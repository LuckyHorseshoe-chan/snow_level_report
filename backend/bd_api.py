import psycopg2
import json

def insert_site(name, comment):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "INSERT INTO sites(name, comment) VALUES (%s, %s)"
    cur.execute(sql, (name, comment))
    cur.close()
    conn.commit()
    conn.close()

def insert_batch(site_id, start_date, end_date, createdAt, processedAt, mapping, status, comment):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "INSERT INTO batches(site_id, start_date, end_date, createdAt, processedAt, mapping, status, comment) \
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    cur.execute(sql, (site_id, start_date, end_date, createdAt, processedAt, mapping, status, comment))
    cur.close()
    conn.commit()
    conn.close()

def insert_data_point(batch_id, data):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "INSERT INTO data_points(batch_id, data) VALUES (%s, %s)"
    #batches = [(batch_id, json.dumps(el)) for el in json.loads(data)]
    if batch_id < 0:
        cur.execute("SELECT MAX(batch_id) FROM batches")
        batch_id = cur.fetchone()[0]
    cur.execute(sql, (batch_id, json.dumps(data)))
    cur.close()
    conn.commit()
    conn.close()

def delete_site(site_id):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "DELETE FROM sites WHERE site_id = %s"
    cur.execute(sql, (site_id,))
    cur.close()
    conn.commit()
    conn.close()

def delete_batches(batch_ids):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "DELETE FROM batches WHERE batch_id IN (%s)" % ", ".join(batch_ids)
    cur.execute(sql)
    cur.close()
    conn.commit()
    conn.close()

def get_site(site_id):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "SELECT * FROM sites WHERE site_id = %s"
    cur.execute(sql, (site_id,))
    site = cur.fetchone()
    cur.close()
    conn.commit()
    conn.close()
    return site

def get_sites():
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "SELECT sites.site_id, sites.name, COUNT(batches.batch_id) AS batches_count, \
    MIN(batches.start_date) AS min_date, MAX(batches.end_date) AS max_date \
    FROM sites LEFT JOIN batches ON sites.site_id = batches.site_id GROUP BY sites.site_id"
    cur.execute(sql)
    sites = cur.fetchall()
    cur.close()
    conn.commit()
    conn.close()
    return sites

def get_batch(batch_id):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "SELECT * FROM batches WHERE batch_id = %s"
    cur.execute(sql, (batch_id,))
    batch = cur.fetchone()
    cur.close()
    conn.commit()
    conn.close()
    return batch

def get_batches(site_id):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "SELECT * FROM batches WHERE site_id = %s"
    cur.execute(sql, (site_id,))
    batches = cur.fetchall()
    cur.close()
    conn.commit()
    conn.close()
    return batches

def get_data_points(batch_id):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "SELECT * FROM data_points WHERE batch_id = %s"
    cur.execute(sql, (batch_id,))
    data_points = cur.fetchall()
    cur.close()
    conn.commit()
    conn.close()
    return data_points

def get_batch_tree():
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    cur.execute("SELECT * FROM sites")
    sites = cur.fetchall()
    sites_dic = []
    for site in sites:
        sites_dic.append({"site_id": site[0], "name": site[1], "batches": []})
        sql = "SELECT * FROM batches WHERE site_id = %s"
        cur.execute(sql, (site[0],))
        batches = cur.fetchall()
        for batch in batches:
            start_date, end_date = str(batch[2]), str(batch[3])
            name = f'{start_date[8:]}.{start_date[5:7]}.{start_date[:4]}-{end_date[8:]}.{end_date[5:7]}.{end_date[:4]}'
            sites_dic[-1]["batches"].append({"batch_id": batch[0], "name": name})
    cur.close()
    conn.commit()
    conn.close()
    return sites_dic

def update_batch_status(status):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "UPDATE batches SET status = %s WHERE batch_id = (SELECT MAX(batch_id) FROM batches)"
    cur.execute(sql, (status,))
    cur.close()
    conn.commit()
    conn.close()

def update_batch_dates(start_date, end_date, processed_at):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "UPDATE batches SET start_date = %s, end_date = %s, processedAt = %s WHERE batch_id = (SELECT MAX(batch_id) FROM batches)"
    cur.execute(sql, (start_date, end_date, processed_at))
    cur.close()
    conn.commit()
    conn.close()

def update_batch_mapping(mapping):
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    sql = "UPDATE batches SET mapping = %s WHERE batch_id = (SELECT MAX(batch_id) FROM batches)"
    cur.execute(sql, (json.dumps(mapping),))
    cur.close()
    conn.commit()
    conn.close()

def get_all_data():
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
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

def get_dp_by_batches_lst(batches):
    data_points = []
    conn = psycopg2.connect(dbname='objects', user='lucky', password='12345', host='db', port="5432")
    cur = conn.cursor()
    if batches[0] < 0:
        cur.execute("SELECT MAX(batch_id) FROM batches")
        batches = cur.fetchone()
    sql = "SELECT * FROM \
    (SELECT data_points.batch_id, data_points.data, sites.name FROM data_points \
    JOIN batches ON batches.batch_id = data_points.batch_id \
    JOIN sites ON sites.site_id = batches.site_id) AS x \
    WHERE batch_id IN (%s)" % ','.join([str(x) for x in batches])
    cur.execute(sql)
    all_data = cur.fetchall()
    data_points = []
    for el in all_data:
        data_points.append(el[1])
        data_points[-1]["name"] = el[2]
    cur.close()
    conn.commit()
    conn.close()
    return data_points