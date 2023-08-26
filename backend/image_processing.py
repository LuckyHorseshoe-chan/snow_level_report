import zipfile
import os
import random
from PIL import Image, ImageOps
import cv2
import pytesseract
import numpy as np
import pandas as pd
import ultralytics
import sys
import json
import time
from celery import Celery
import xlsxwriter
import shutil
#from roboflow import Roboflow
from ultralytics import YOLO
from bd_api import *

celery_app = Celery('image_processing', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

def unzip_file(path_to_zip_file, directory_to_extract_to):
    with zipfile.ZipFile(path_to_zip_file, 'r') as zip_ref:
        zip_ref.extractall(directory_to_extract_to)

def choose_random_image():
    path = os.getcwd() + '/static/'
    root = os.listdir(path)[0]
    files = os.listdir(path + root)
    ind = random.randrange(len(files))
    return f'{root}/{files[ind]}'

def recognize_text(coordinates):
    try:
        result = {}
        img_path = coordinates["img_path"]
        path = os.getcwd() + '/static/' + img_path
        name = img_path.split('/')[1]
        strip_size = int(coordinates["strip_size"])
        mapping = coordinates["mapping"]
        im = Image.open(path)
        k = 2
        strip = ImageOps.invert(im.crop((0, im.size[1]-strip_size, im.size[0], im.size[1]))).resize((k*im.size[0], k*strip_size))
        err_dir = os.getcwd() + "/static/errors"
        if (not os.path.exists(err_dir)):
            os.makedirs(err_dir)
            os.makedirs(err_dir + "/type/")
            os.makedirs(err_dir + "/temp/")
            os.makedirs(err_dir + "/datetime/")
        for dic in mapping:
            pos = [float(x) for x in dic["pos"]]
            if dic["id"] == 'type':
                strip_type = strip.crop((k*pos[0], 0, k*pos[2], k*strip_size))
                img_type = pytesseract.image_to_string(strip_type, config="--psm 7")
                if img_type.find("M") != -1:
                    result['type'] = "M"
                elif img_type.find("T") != -1:
                    result['type'] = "T"
                else:
                    result['type'] = "error"
                    im.save(f'{err_dir}/type/{name}')
            elif dic["id"] == 'datetime':         
                strip_datetime = strip.crop((k*pos[0], 0, k*pos[2], k*strip_size))
                text = pytesseract.image_to_string(strip_datetime, config="--psm 7").split()
                datetime = []
                for t in text:
                    if t[0] >= '0' and t[0] <='9':
                        datetime.append(t)
                if len(datetime) != 2 or len(datetime[0]) != 10 or len(datetime[1]) != 8:
                    result['datetime'] = "error"
                    im.save(f'{err_dir}/datetime/{name}')
                else:
                    date, time = datetime[0], datetime[1]
                    date = f'{date[6:]}-{date[3:5]}-{date[:2]}'
                    result['datetime'] = f'{date} {time}'
            elif dic["id"] == 'temp':
                strip_temperature = strip.crop((k*pos[0], 0, k*pos[2], k*strip_size))
                temperature = pytesseract.image_to_string(strip_temperature, config="--psm 7")
                for i in range(len(temperature)):
                    if temperature[i] != '-' and (temperature[i] > '9' or temperature[i] < '0'):
                        temperature = temperature[:i]
                        break
                try:
                    result['temp'] = int(temperature)
                except:
                    result['temp'] = "error"
                    im.save(f'{err_dir}/temp/{name}')
        # проверить, насколько часто температура правильная (текст), улучшить обрезку
        return result
    except:
        img_path = coordinates["img_path"]
        path = os.getcwd() + '/static/' + img_path
        name = img_path.split('/')[1]
        err_dir = os.getcwd() + "/static/errors"
        if (not os.path.exists(err_dir)):
            os.makedirs(err_dir)
        if (not os.path.exists(err_dir + "/coordinates/")):
            os.makedirs(err_dir + "/coordinates/")
        im.save(f'{err_dir}/coordinates/{name}')
        return {'type': "error", 'datetime': "error", 'temp': "error"}

def calculate_ruler_height(coordinates):
    mapping = coordinates["mapping"]
    img_path = coordinates["img_path"]
    name = img_path.split('/')[1]
    for dic in mapping:
        if dic["id"] == 'ruler':
            pos = [float(x) for x in dic["pos"]]
            ruler_height = dic["heightCm"]
    pix_ruler_height = pos[3] - pos[1]
    path = os.getcwd() + '/static/' + img_path
    if not pix_ruler_height:
        im = Image.open(path)
        im.save(f'{err_dir}/snow_level/{name}')
        return -999
    #im = Image.open(path)
    #ruler = im.crop((coordinates["topLeft"][0], coordinates["topLeft"][1], \ 
    #        coordinates["rightBottom"][0], coordinates["rightBottom"][1]))
    model = YOLO('best.pt')
    results = model.predict(path, conf=0.25)
    if len(results) == 0:
        return -1
    ind = 0
    err_dir = os.getcwd() + "/static/errors"
    if (not os.path.exists(err_dir)):
        os.makedirs(err_dir)
    if (not os.path.exists(err_dir + "/snow_level/")):
        os.makedirs(err_dir + "/snow_level/")
    for result in results:
        try:
            if int(result.boxes.xyxy[0][3]) > ind and int(result.boxes.xyxy[0][0]) >= pos[0] and int(result.boxes.xyxy[0][2]) <= pos[2]:
                ind = int(result.boxes.xyxy[0][3])
        except:
            im = Image.open(path)
            im.save(f'{err_dir}/snow_level/{name}')
            return -999
    pix_snow_height = pos[3] - ind
    return pix_snow_height * int(ruler_height) / pix_ruler_height

def form_report(data):
    daily_data = data['daily']
    monthly_data = data['monthly']
    workbook = xlsxwriter.Workbook('report.xlsx')
    daily = workbook.add_worksheet('Daily')
    monthly = workbook.add_worksheet('Monthly')
    for col, key in enumerate(daily_data[0].keys()):
        daily.write(0, col, key)
    for col, key in enumerate(monthly_data[0].keys()):
        monthly.write(0, col, key)
    for i in range(len(daily_data)):
        for col, value in enumerate(daily_data[i].values()):
            daily.write(i + 1, col, value)
    for i in range(len(monthly_data)):
        for col, value in enumerate(monthly_data[i].values()):
            monthly.write(i + 1, col, value)
    workbook.close()


def get_errors():
    shutil.make_archive('errors', 'zip', os.getcwd() + '/static/errors')

def delete_files():
    folder = os.getcwd() + '/static/'
    shutil.rmtree(folder)
    os.makedirs(folder)

@celery_app.task(name="process_dataset")
def process_dataset(coordinates):
    result = recognize_text(coordinates)
    for value in result.values():
        if value == "error":
            return 'error'
    result['ruler'] = calculate_ruler_height(coordinates) 
    insert_data_point(coordinates["batchId"], result)
    return 'inserted'

"""
@celery_app.task(name="create_task")
def create_task(task_type):
    time.sleep(int(task_type) * 10)
    return True

@celery_app.task(name="print_batch")
def print_batch():
    batch = get_batch(1)
    return {"batch": batch}
"""
#if __name__ == '__main__':
    #print_batch.delay()
    #process_dataset(json.loads(sys.argv[1]))