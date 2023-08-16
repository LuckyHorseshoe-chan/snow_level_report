import zipfile
import os
import random

def unzip_file(path_to_zip_file, directory_to_extract_to):
    with zipfile.ZipFile(path_to_zip_file, 'r') as zip_ref:
        zip_ref.extractall(directory_to_extract_to)

def choose_random_image():
    path = os.getcwd() + '/static/'
    root = os.listdir(path)[0]
    files = os.listdir(path + root)
    ind = random.randrange(len(files))
    return f'{root}/{files[ind]}'