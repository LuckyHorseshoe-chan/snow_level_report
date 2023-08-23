import zipfile
import os
import random
from PIL import Image, ImageOps
import cv2
import pytesseract
import numpy as np
import pandas as pd
import ultralytics
#from roboflow import Roboflow
from ultralytics import YOLO
from celery import Celery
from sqlalchemy import create_engine
from bd_api import *

#engine = create_engine('postgresql+psycopg2://lucky:12345@localhost/celery_db')
celery = Celery(broker='redis://localhost:6379/0')
#celery.conf.broker_url = 'redis://localhost:6379/0'

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
    img_path = coordinates["img_path"]
    path = os.getcwd() + '/static/' + img_path
    strip_size = int(coordinates["strip_size"])
    im = Image.open(path)
    k = 2
    strip = ImageOps.invert(im.crop((0, im.size[1]-strip_size, im.size[0], im.size[1]))).resize((k*im.size[0], k*strip_size))
    strip_type = strip.crop((k*coordinates['type'][0], 0, k*coordinates['type'][1], k*strip_size))
    img_type = pytesseract.image_to_string(strip_type, config="--psm 10")
    if img_type.find("M") != -1:
        img_type = "M"
    elif img_type.find("T") != -1:
        img_type = "T"
    else:
        img_type = "error"
    strip_datetime = strip.crop((k*coordinates['datetime'][0], 0, k*coordinates['datetime'][1], k*strip_size))
    text = pytesseract.image_to_string(strip_datetime, config="--psm 7").split()
    datetime = []
    for t in text:
      if t[0] >= '0' and t[0] <='9':
        datetime.append(t)
    # todo: сделать валидацию даты-времени
    # 27 принимает за 21
    if len(datetime) != 2 or len(datetime[0]) != 10 or len(datetime[1]) != 8:
        date, time = "error", "error"
    else:
        date, time = datetime[0], datetime[1]
        date = f'{date[6:]}-{date[3:5]}-{date[:2]}'
    strip_temperature = strip.crop((k*coordinates['temp'][0], 0, k*coordinates['temp'][1], k*strip_size))
    temperature = pytesseract.image_to_string(strip_temperature, config="--psm 7")
    for i in range(len(temperature)):
      if temperature[i] != '-' and (temperature[i] > '9' or temperature[i] < '0'):
        temperature = temperature[:i]
        break
    try:
        temperature = int(temperature)
    except:
        temperature = "error"
    # проверить, насколько часто температура правильная (текст), улучшить обрезку
    return {'type': img_type, 'datetime': f'{date} {time}', 'temp': temperature}

def calculate_ruler_height(coordinates):
    img_path = coordinates["img_path"]
    pix_ruler_height = coordinates["rightBottom"][1] - coordinates["topLeft"][1]
    path = os.getcwd() + '/static/' + img_path
    #im = Image.open(path)
    #ruler = im.crop((coordinates["topLeft"][0], coordinates["topLeft"][1], \ 
    #        coordinates["rightBottom"][0], coordinates["rightBottom"][1]))
    model = YOLO('best.pt')
    results = model.predict(path, conf=0.25)
    if len(results) == 0:
        return -1
    ind = 0
    for result in results:
        if int(result.boxes.xyxy[0][3]) > ind:
            ind = int(result.boxes.xyxy[0][3])
    pix_snow_height = coordinates["rightBottom"][1] - ind
    return pix_snow_height * float(coordinates["rulerHeight"]) / pix_ruler_height

#@celery.task(name="process_dataset")
def process_dataset(coordinates):
    result = recognize_text(coordinates)
    result["ruler"] = calculate_ruler_height(coordinates)
    _, _, _, _, _, _, mapping, _, _  = get_batch(coordinates["batchId"])
    keys = [dic["id"] for dic in mapping]
    for key, value in result.items():
        if value == "error" and key in keys:
            return result
    insert_data_point(coordinates["batchId"], result)
    return result

@celery.task(name="create_task")
def create_task(task_type):
    time.sleep(int(task_type) * 10)
    return True