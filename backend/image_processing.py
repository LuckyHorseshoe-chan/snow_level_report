import zipfile
import os
import random
from PIL import Image, ImageOps
import cv2
import pytesseract
import numpy as np
import pandas as pd

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
    else:
        img_type = "T"
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
    strip_temperature = strip.crop((k*coordinates['temperature'][0], 0, k*coordinates['temperature'][1], k*strip_size))
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
    return {'type': img_type, 'date': date, 'time': time, 'temperature': temperature}

def calculate_ruler_height(coordinates):
    img_path = coordinates["img_path"]
    pix_ruler_height = coordinates["rightBottom"][1] - coordinates["topLeft"][1]
    path = os.getcwd() + '/static/' + img_path
    im = Image.open(path)
    ruler = im.crop((coordinates["topLeft"][0], coordinates["topLeft"][1], coordinates["rightBottom"][0], coordinates["rightBottom"][1]))
    ruler.save('crops/' + img_path)
    ruler = cv2.imread('ruler.jpg')
    ruler = remove_shadow(ruler)
    ind, im = find_snow_bound(ruler)
    pix_snow_height = pix_ruler_height - ind
    cv2.imwrite('test/' + img_path, im)
    return pix_snow_height * float(coordinates["rulerHeight"]) / pix_ruler_height

def remove_shadow(img):
    rgb_planes = cv2.split(img)

    result_planes = []
    result_norm_planes = []
    for plane in rgb_planes:
        dilated_img = cv2.dilate(plane, np.ones((7,7), np.uint8))
        bg_img = cv2.medianBlur(dilated_img, 21)
        diff_img = 255 - cv2.absdiff(plane, bg_img)
        norm_img = cv2.normalize(diff_img,None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8UC1)
        result_planes.append(diff_img)
        result_norm_planes.append(norm_img)
    result_norm = cv2.merge(result_norm_planes)
    result_norm = cv2.cvtColor(result_norm, cv2.COLOR_BGR2GRAY)
    return result_norm
def find_snow_bound(img):
    mean_change, white_line = -1, -1
    for i in range(img.shape[0]-5):
        end = img.shape[0]-1-i
        # 200, 100, 255 - цвет пикселей
        if mean_change == -1 and np.mean(img[end]) < 200 and np.mean(img[end]) > 100:
            mean_change = end
        if np.sum(img[end]) > 255 * 0.9 * img.shape[1]:
            white_line = end
    ind = mean_change
    if white_line > ind:
        ind = white_line
    img[ind, :] = 0
    return ind, img  