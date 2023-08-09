import psycopg2
import json

def insert_site(name, comment):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='localhost', port="5432")
    cur = conn.cursor()
    sql = "INSERT INTO sites(name, comment) VALUES (%s, %s)"
    cur.execute(sql, (name, comment))
    cur.close()
    conn.commit()
    conn.close()

def insert_batch(site_id, createdAt, processedAt, mapping, status, comment):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='localhost', port="5432")
    cur = conn.cursor()
    sql = "INSERT INTO batches(site_id, createdAt, processedAt, mapping, status, comment) VALUES (%s, %s, %s, %s, %s, %s)"
    cur.execute(sql, (site_id, createdAt, processedAt, mapping, status, comment))
    cur.close()
    conn.commit()
    conn.close()

def insert_data_points(batch_id, data):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='localhost', port="5432")
    cur = conn.cursor()
    sql = "INSERT INTO data_points(batch_id, data) VALUES (%s, %s)"
    batches = [(batch_id, json.dumps(el)) for el in json.loads(data)]
    print(batches)
    cur.executemany(sql, (batches))
    cur.close()
    conn.commit()
    conn.close()

def delete_site(site_id):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='localhost', port="5432")
    cur = conn.cursor()
    sql = "DELETE FROM sites WHERE site_id = %s"
    cur.execute(sql, (site_id,))
    cur.close()
    conn.commit()
    conn.close()

def delete_batch(batch_id):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='localhost', port="5432")
    cur = conn.cursor()
    sql = "DELETE FROM batches WHERE batch_id = %s"
    cur.execute(sql, (batch_id,))
    cur.close()
    conn.commit()
    conn.close()

def get_site(site_id):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='localhost', port="5432")
    cur = conn.cursor()
    sql = "SELECT * FROM sites WHERE site_id = %s"
    cur.execute(sql, (site_id,))
    site = cur.fetchone()
    cur.close()
    conn.commit()
    conn.close()
    return site

def get_batch(batch_id):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='localhost', port="5432")
    cur = conn.cursor()
    sql = "SELECT * FROM batches WHERE batch_id = %s"
    cur.execute(sql, (batch_id,))
    batch = cur.fetchone()
    cur.close()
    conn.commit()
    conn.close()
    return batch

def get_all_data():
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='localhost', port="5432")
    cur = conn.cursor()
    sql = "SELECT * FROM sites"
    cur.execute(sql)
    sites = cur.fetchall()
    sql = "SELECT * FROM batches"
    cur.execute(sql)
    batches = cur.fetchall()
    sql = "SELECT * FROM data_points"
    cur.execute(sql)
    data_points = cur.fetchall()
    cur.close()
    conn.commit()
    conn.close()
    return sites, batches, data_points