import psycopg2
conn = psycopg2.connect(dbname='objects', user='lucky', 
                        password='12345', host='localhost', port="5432")
cursor = conn.cursor()
commands = (
        """
        CREATE TABLE sites (
            site_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            comment VARCHAR(255)
        )
        """,
        """
        CREATE TYPE BATCH_STATUS AS ENUM ('accepted', 'rejected')
        """,
        """ 
        CREATE TABLE batches (
            batch_id SERIAL PRIMARY KEY,
            site_id INTEGER NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            createdAt TIMESTAMP,
            processedAt TIMESTAMP,
            mapping JSON,
            status BATCH_STATUS,
            comment VARCHAR(255),
            FOREIGN KEY(site_id)
                REFERENCES sites(site_id)
                ON UPDATE CASCADE ON DELETE CASCADE
            )
        """,
        """
        CREATE TABLE data_points (
                data_point_id SERIAL PRIMARY KEY,
                batch_id INTEGER NOT NULL,
                data JSON,
                FOREIGN KEY (batch_id)
                    REFERENCES batches (batch_id)
                    ON UPDATE CASCADE ON DELETE CASCADE
        )
        """
)
for command in commands:
    cursor.execute(command)
cursor.close()
conn.commit()
conn.close()