from fastapi import FastAPI, File, UploadFile, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import json
import subprocess
import datetime
from celery.result import AsyncResult

import shutil
import os

from bd_api import *
from image_processing import *

app = FastAPI()

subprocesses = []

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    sites, batches, data_points = get_all_data()
    return {"sites": sites, "batches": batches, "data_points": data_points}

@app.post("/site")
async def create_site(site: dict):
    insert_site(site["name"], site["comment"])
    return site

@app.post("/batch")
async def create_batch(batch: dict):
    insert_batch(batch["site_id"], batch["start_date"], batch["end_date"], batch["createdAt"], \
                batch["processedAt"], batch["mapping"], batch["status"], batch["comment"])

@app.put("/batch/status")
async def put_batch_status(status):
    update_batch_status(status)

@app.put("/batch/dates")
async def put_batch_dates(dates: dict):
    update_batch_dates(dates["start_date"], dates["end_date"], dates["processed_at"])

@app.put("/batch/mapping")
async def put_batch_mapping(mapping: dict):
    update_batch_mapping(mapping["mapping"])
    return {"map": json.dumps(mapping["mapping"])}

@app.post("/data_point")
async def create_data_point(data_point: dict):
    insert_data_point(data_point["batchId"], data_point["data"])
    return {"batch_id": data_point["batchId"], "data": data_point["data"]}

@app.get("/site")
async def site(site_id):
    _, name, comment  = get_site(site_id)
    return {"site_id": site_id, "name": name, "comment": comment}

@app.get("/sites")
async def sites():
    return get_sites()

@app.get("/batch")
async def batch(batch_id):
    #_, site_id, start_date, end_date, createdAt, processedAt, mapping, status, comment  = get_batch(batch_id)
    return get_batch(batch_id)

@app.get("/batches")
async def batches(site_id):
    return get_batches(site_id)

@app.get("/data_points")
async def data_points(batch_id):
    return get_data_points(batch_id)

@app.delete("/site")
async def del_site(site_id):
    delete_site(site_id)

@app.delete("/batches")
async def del_batches(batch_ids: dict):
    delete_batches(batch_ids["batch_ids"])

@app.post("/upload")
async def upload_zip(file: UploadFile):
    delete_files()
    err_dir = os.getcwd() + "/static/errors"
    os.makedirs(err_dir)
    os.makedirs(err_dir + "/type/")
    os.makedirs(err_dir + "/temp/")
    os.makedirs(err_dir + "/datetime/")
    os.makedirs(err_dir + "/coordinates/")
    os.makedirs(err_dir + "/snow_level/")
    path = os.getcwd() + '/static/'
    with open(f'{path}{file.filename}', 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    unzip_file(f'{path}{file.filename}', path)
    os.remove(f'{path}{file.filename}')
    return {"filename": file.filename}

@app.get("/img_path")
async def get_random_path():
    return {'img_url': choose_random_image()}

@app.post("/text")
async def get_text(coordinates: dict):
    return recognize_text(coordinates)

@app.post("/ruler_height")
async def get_ruler_height(coordinates: dict):
    return {"snow_height": calculate_ruler_height(coordinates)}

tasks = []

def run_worker(coordinates):
    task = process_dataset.delay(coordinates)
    tasks.append(task.id)
    #subprocesses.append(subprocess.Popen(['C:\\Users\\Anna\\Desktop\\GitHub\\snow_level_report\\backend\\venv\\Scripts\\python', 'image_processing.py', json.dumps(coordinates)]))

@app.post("/images")
async def process_batch(coordinates: dict):
    keys = coordinates.keys()
    if ("strip_size" not in keys or "mapping" not in keys \
    or not coordinates["mapping"] or not coordinates["strip_size"]):
        return {"status": "fail"}
    update_batch_mapping(coordinates["mapping"])
    path = os.getcwd() + '/static/'
    for d in os.listdir(path):
        if d != 'errors' and os.path.isdir(f'{path}{d}'):
            folder = d
    files = os.listdir(f'{path}{folder}')
    tasks = []
    for i in range(len(files)):
        coordinates["img_path"] = f'{folder}/{files[i]}'
        run_worker(coordinates)
    #coordinates["img_path"] = f'{folder}/{files[0]}'
    #run_worker(coordinates)
    return {"status": "ok"}

@app.get("/tasks_status")
async def get_tasks():
    new_tasks = []
    for task in tasks:
        if not AsyncResult(task).ready():
            new_tasks.append(task)
    if (len(new_tasks)):
        return {"status": "pending"}
    data_points = get_dp_by_batches_lst([-1])
    if len(data_points):
        dates = [dp["datetime"] for dp in data_points]
        update_batch_dates(min(dates), max(dates), datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f"))
        form_errors()
    return {"status": "success"}

@app.post("/form_report")
async def get_report(data: dict):
    form_report(data)

@app.get("/form_errors")
async def get_errors():
    form_errors()

@app.get("/clear_static")
async def clear_static():
    delete_files()

@app.get("/batch_tree")
async def get_tree():
    return get_batch_tree()

@app.post("/report/data_points")
async def get_report_data_points(batches: dict):
    if not len(batches["batches"]):
        return []
    return get_dp_by_batches_lst(batches["batches"])