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
from ultralytics import YOLO
from bd_api import *

cwd = os.environ['CWD']
celery_app = Celery('image_processing', broker='redis://redis:6379/0', backend='redis://redis:6379/0')
err_dir = cwd + "errors"

def unzip_file(path_to_zip_file, directory_to_extract_to):
    with zipfile.ZipFile(path_to_zip_file, 'r') as zip_ref:
        zip_ref.extractall(directory_to_extract_to)

def choose_random_image():
    for d in os.listdir(cwd):
        if d != 'errors' and os.path.isdir(f'{cwd}{d}'):
            root = d
    files = os.listdir(cwd + root)
    ind = random.randrange(len(files))
    return f'{root}/{files[ind]}'

def recognize_text(coordinates):
    try:
        result = {}
        img_path = coordinates["img_path"]
        path = cwd + img_path
        name = img_path.split('/')[1]
        strip_size = int(coordinates["strip_size"])
        mapping = coordinates["mapping"]
        im = Image.open(path)
        k = 2
        strip = ImageOps.invert(im.crop((0, im.size[1]-strip_size, im.size[0], im.size[1]))).resize((k*im.size[0], k*strip_size))
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
                try:
                    if len(datetime) != 2 or len(datetime[0]) != 10 or len(datetime[1]) != 8 \
                    or int(datetime[0][3:5]) > 12 or int(datetime[0][:2]) > 31 \
                    or not int(datetime[0][3:5]) or not int(datetime[0][:2]):
                        result['datetime'] = "error"
                        im.save(f'{err_dir}/datetime/{name}')
                    else:
                        date, time = datetime[0], datetime[1]
                        date = f'{date[6:]}-{date[3:5]}-{date[:2]}'
                        result['datetime'] = f'{date} {time}'
                except:
                    result['datetime'] = "error"
                    im.save(f'{err_dir}/datetime/{name}')
            elif dic["id"] == 'temp':
                strip_temperature = strip.crop((k*pos[0], 0, k*pos[2], k*strip_size))
                temperature = pytesseract.image_to_string(strip_temperature, config="--psm 7")
                for i in range(len(temperature)):
                    if temperature[i] != '-' and (temperature[i] > '9' or temperature[i] < '0'):
                        temperature = temperature[:i]
                        break
                try:
                    result['temp'] = int(temperature)
                    if result['temp'] > 50 or result['temp'] < -90:
                        result['temp'] = "error"
                        im.save(f'{err_dir}/temp/{name}')
                except:
                    result['temp'] = "error"
                    im.save(f'{err_dir}/temp/{name}')
        return result
    except:
        img_path = coordinates["img_path"]
        path = cwd + img_path
        name = img_path.split('/')[1]
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
    path = cwd + img_path
    if not pix_ruler_height:
        im = Image.open(path)
        im.save(f'{err_dir}/snow_level/{name}')
        return -999
    model = YOLO('best.pt')
    results = model.predict(path, conf=0.25)
    if len(results) == 0:
        return -1
    ind = 0
    for result in results:
        try:
            if int(result.boxes.xyxy[0][3]) > ind and int(result.boxes.xyxy[0][0]) >= pos[0] and int(result.boxes.xyxy[0][2]) <= pos[2]:
                ind = int(result.boxes.xyxy[0][3])
        except:
            im = Image.open(path)
            im.save(f'{err_dir}/snow_level/{name}')
            return -999
    if not ind:
        im = Image.open(path)
        im.save(f'{err_dir}/snow_level/{name}')
        return -999
    pix_snow_height = pos[3] - ind
    return pix_snow_height * int(ruler_height) / pix_ruler_height

def form_report(data):
    daily_data = data['daily']
    monthly_data = data['monthly']
    workbook = xlsxwriter.Workbook('report.xlsx')
    if not (len(daily_data) and len(monthly_data)):
        workbook.close()
        shutil.move('report.xlsx', cwd + 'report.xlsx')
        return
    daily = workbook.add_worksheet('Daily')
    monthly = workbook.add_worksheet('Monthly')
    keys_dic = {'name': 0, 'datetime': 1, 'ruler': 2, 'temp': 3}
    col_names = ['Gauge-Name', 'Date', 'Snow depth, cm', 'Temperature, ℃']
    for key in daily_data[0].keys():
        if key == 'type':
            continue
        daily.write(0, keys_dic[key], col_names[keys_dic[key]])
    for i in range(len(daily_data)):
        for key, value in daily_data[i].items():
            if key == 'type':
                continue
            daily.write(i + 1, keys_dic[key], value)
    keys_dic = {'name': 0, 'ruler': 3, 'temp': 4, 'maxSnow': 5, 'maxSnowDate': 6, 'minSnow': 7, 'minSnowDate': 8}
    col_names = ['Gauge-Name', 'Month', 'Year', 'Average snow depth, cm', 'Average temperature, ℃', \
    'Maximum snow depth, cm', 'Date of maximum snow depth, cm', 'Minimum snow depth, cm', 'Data of minimum snow depth']
    for key in monthly_data[0].keys():
        if key == 'datetime':
            monthly.write(0, 1, 'Month')
            monthly.write(0, 2, 'Year')
            continue
        if key == 'type':
            continue
        monthly.write(0, keys_dic[key], col_names[keys_dic[key]])
    for i in range(len(monthly_data)):
        for key, value in monthly_data[i].items():
            if key == 'type':
                continue
            if key == 'datetime':
                monthly.write(i + 1, 1, value[5:7])
                monthly.write(i + 1, 2, value[:4])
                continue
            monthly.write(i + 1, keys_dic[key], value)
    workbook.close()
    shutil.move('report.xlsx', cwd + 'report.xlsx')


def form_errors():
    shutil.make_archive('errors', 'zip', cwd + 'errors')
    shutil.move('errors.zip', cwd + 'errors.zip')

def delete_files():
    for f in os.listdir(cwd):
        if os.path.isdir(f'{cwd}{f}'):
            shutil.rmtree(f'{cwd}{f}')
        else:
            os.remove(f'{cwd}{f}')

@celery_app.task(name="process_dataset")
def process_dataset(coordinates):
    result = recognize_text(coordinates)
    for value in result.values():
        if value == "error" or value == "M":
            return 'error'
    result['ruler'] = calculate_ruler_height(coordinates) 
    insert_data_point(-1, result)
    return 'inserted'