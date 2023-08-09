from fastapi import FastAPI
from bd_api import *

app = FastAPI()


@app.get("/")
async def root():
    sites, batches, data_points = get_all_data()
    return {"sites": sites, "batches": batches, "data_points": data_points}

@app.post("/site")
async def create_site(name, comment):
    insert_site(name, comment)
    return {"name": name, "comment": comment}

@app.post("/batch")
async def create_batch(site_id, createdAt, processedAt, mapping, status, comment):
    insert_batch(site_id, createdAt, processedAt, mapping, status, comment)
    return {"site_id": site_id, "createdAt": createdAt, "processedAt": processedAt, "mapping": mapping, "status": status, "comment": comment}

@app.post("/data_points")
async def create_data_points(batch_id, data):
    insert_data_points(batch_id, data)
    return {"batch_id": batch_id, "data": data}

@app.get("/site")
async def site(site_id):
    _, name, comment  = get_site(site_id)
    return {"site_id": site_id, "name": name, "comment": comment}

@app.get("/batch")
async def batch(batch_id):
    _, site_id, createdAt, processedAt, mapping, status, comment  = get_batch(batch_id)
    return {"batch_id": batch_id, "site_id": site_id, "createdAt": createdAt, "processedAt": processedAt, "mapping": mapping, "status": status, "comment": comment}

@app.delete("/site")
async def del_site(site_id):
    delete_site(site_id)

@app.delete("/batch")
async def del_batch(batch_id):
    delete_batch(batch_id)