from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles

import shutil
import os

from bd_api import *
from image_processing import *

app = FastAPI()

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
async def create_batch(site_id, start_date, end_date, createdAt, processedAt, mapping, status, comment):
    insert_batch(site_id, start_date, end_date, createdAt, processedAt, mapping, status, comment)
    return {"site_id": site_id}

@app.post("/data_points")
async def create_data_points(batch_id, data):
    insert_data_points(batch_id, data)
    return {"batch_id": batch_id, "data": data}

@app.get("/site")
async def site(site_id):
    _, name, comment  = get_site(site_id)
    return {"site_id": site_id, "name": name, "comment": comment}

@app.get("/sites")
async def sites():
    return get_sites()

@app.get("/batch")
async def batch(batch_id):
    _, site_id, createdAt, processedAt, mapping, status, comment  = get_batch(batch_id)
    return {"batch_id": batch_id, "site_id": site_id, "createdAt": createdAt, "processedAt": processedAt, "mapping": mapping, "status": status, "comment": comment}

@app.get("/batches")
async def batches(site_id):
    return get_batches(site_id)

@app.delete("/site")
async def del_site(site_id):
    delete_site(site_id)

@app.delete("/batches")
async def del_batches(batch_ids: dict):
    delete_batches(batch_ids["batch_ids"])

@app.post("/upload")
async def upload_zip(file: UploadFile):
    path = os.getcwd() + '/static/'
    with open(f'{path}{file.filename}', 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)
    unzip_file(f'{path}{file.filename}', path)
    os.remove(f'{path}{file.filename}')
    return {"filename": file.filename}

@app.get("/img_path")
async def get_random_path():
    return {'img_url': choose_random_image()}