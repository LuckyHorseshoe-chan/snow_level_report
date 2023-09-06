--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE objects;




--
-- Drop roles
--

DROP ROLE lucky;


--
-- Roles
--

CREATE ROLE lucky;
ALTER ROLE lucky WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:1mGwi2Kb5fcs6Id9BILayA==$gY8t3tsSw9nZyxgaYqcbfA47ayGHSeQvabiU3amNGtA=:VM4Ow543Wv/YmYzO9+QOIQQDGu9G8a+QUbeLY47E0lE=';






--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.9 (Debian 14.9-1.pgdg120+1)
-- Dumped by pg_dump version 14.9 (Debian 14.9-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: lucky
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO lucky;

\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: lucky
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: lucky
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: lucky
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "objects" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.9 (Debian 14.9-1.pgdg120+1)
-- Dumped by pg_dump version 14.9 (Debian 14.9-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: objects; Type: DATABASE; Schema: -; Owner: lucky
--

CREATE DATABASE objects WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE objects OWNER TO lucky;

\connect objects

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: batch_status; Type: TYPE; Schema: public; Owner: lucky
--

CREATE TYPE public.batch_status AS ENUM (
    'accepted',
    'rejected'
);


ALTER TYPE public.batch_status OWNER TO lucky;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: batches; Type: TABLE; Schema: public; Owner: lucky
--

CREATE TABLE public.batches (
    batch_id integer NOT NULL,
    site_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    createdat timestamp without time zone,
    processedat timestamp without time zone,
    mapping json,
    status public.batch_status,
    comment character varying(255)
);


ALTER TABLE public.batches OWNER TO lucky;

--
-- Name: batches_batch_id_seq; Type: SEQUENCE; Schema: public; Owner: lucky
--

CREATE SEQUENCE public.batches_batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.batches_batch_id_seq OWNER TO lucky;

--
-- Name: batches_batch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lucky
--

ALTER SEQUENCE public.batches_batch_id_seq OWNED BY public.batches.batch_id;


--
-- Name: data_points; Type: TABLE; Schema: public; Owner: lucky
--

CREATE TABLE public.data_points (
    data_point_id integer NOT NULL,
    batch_id integer NOT NULL,
    data json
);


ALTER TABLE public.data_points OWNER TO lucky;

--
-- Name: data_points_data_point_id_seq; Type: SEQUENCE; Schema: public; Owner: lucky
--

CREATE SEQUENCE public.data_points_data_point_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.data_points_data_point_id_seq OWNER TO lucky;

--
-- Name: data_points_data_point_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lucky
--

ALTER SEQUENCE public.data_points_data_point_id_seq OWNED BY public.data_points.data_point_id;


--
-- Name: sites; Type: TABLE; Schema: public; Owner: lucky
--

CREATE TABLE public.sites (
    site_id integer NOT NULL,
    name character varying(255) NOT NULL,
    comment character varying(255)
);


ALTER TABLE public.sites OWNER TO lucky;

--
-- Name: sites_site_id_seq; Type: SEQUENCE; Schema: public; Owner: lucky
--

CREATE SEQUENCE public.sites_site_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sites_site_id_seq OWNER TO lucky;

--
-- Name: sites_site_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lucky
--

ALTER SEQUENCE public.sites_site_id_seq OWNED BY public.sites.site_id;


--
-- Name: batches batch_id; Type: DEFAULT; Schema: public; Owner: lucky
--

ALTER TABLE ONLY public.batches ALTER COLUMN batch_id SET DEFAULT nextval('public.batches_batch_id_seq'::regclass);


--
-- Name: data_points data_point_id; Type: DEFAULT; Schema: public; Owner: lucky
--

ALTER TABLE ONLY public.data_points ALTER COLUMN data_point_id SET DEFAULT nextval('public.data_points_data_point_id_seq'::regclass);


--
-- Name: sites site_id; Type: DEFAULT; Schema: public; Owner: lucky
--

ALTER TABLE ONLY public.sites ALTER COLUMN site_id SET DEFAULT nextval('public.sites_site_id_seq'::regclass);


--
-- Data for Name: batches; Type: TABLE DATA; Schema: public; Owner: lucky
--

COPY public.batches (batch_id, site_id, start_date, end_date, createdat, processedat, mapping, status, comment) FROM stdin;
1	1	2022-10-29	2023-01-08	2023-09-05 20:51:58.260181	2023-09-05 20:53:44.267332	[{"id": "ruler", "type": "centimeters", "heightCm": "250", "pos": ["2683", "252.7", "3062", "2703"]}, {"id": "datetime", "type": "timestamp", "pos": ["2068", "2951", "2613", "3031"]}]	accepted	batch
2	2	2022-10-02	2023-05-20	2023-09-05 20:55:10.847448	2023-09-05 21:02:23.290146	[{"id": "ruler", "type": "centimeters", "heightCm": "250", "pos": ["1903", "207.8", "2298", "1966"]}, {"id": "datetime", "type": "timestamp", "pos": ["2057", "2951", "2602", "3026"]}, {"id": "temp", "type": "celsius", "pos": ["3226", "2957", "3381", "3021"]}, {"id": "type", "type": "str", "pos": ["1431", "2946", "1597", "3026"]}]	accepted	calm batch
\.


--
-- Data for Name: data_points; Type: TABLE DATA; Schema: public; Owner: lucky
--

COPY public.data_points (data_point_id, batch_id, data) FROM stdin;
1	1	{"datetime": "2022-11-07 10:00:02", "ruler": -4.081132922499285}
2	1	{"datetime": "2022-12-21 14:00:02", "ruler": 35.70991307186875}
3	1	{"datetime": "2022-11-01 10:00:02", "ruler": -7.856180875811124}
4	1	{"datetime": "2022-11-13 10:00:02", "ruler": -0.8162265844998571}
5	1	{"datetime": "2022-11-19 10:00:02", "ruler": -1.7344814920621963}
6	1	{"datetime": "2022-12-21 14:00:02", "ruler": 40.91335754805534}
7	1	{"datetime": "2023-01-08 14:00:01", "ruler": -999}
8	1	{"datetime": "2022-11-10 10:00:02", "ruler": -2.2446231073746072}
9	1	{"datetime": "2022-11-04 10:00:01", "ruler": -7.448067583561196}
10	1	{"datetime": "2022-10-29 10:00:02", "ruler": -10.917030567685588}
11	1	{"datetime": "2022-11-16 10:00:01", "ruler": -0.8162265844998571}
12	1	{"datetime": "2022-12-31 14:00:00", "ruler": 35.4038281026813}
13	1	{"datetime": "2022-12-24 14:00:01", "ruler": 36.62816797943109}
14	1	{"datetime": "2023-01-04 10:00:02", "ruler": -999}
15	2	{"datetime": "2023-05-20 14:00:01", "temp": 5, "type": "T", "ruler": -28.295984529632577}
16	2	{"datetime": "2022-10-18 14:00:02", "temp": 10, "type": "T", "ruler": -27.158457513365942}
17	2	{"datetime": "2023-04-26 10:00:02", "temp": 6, "type": "T", "ruler": 27.016266636332613}
18	2	{"datetime": "2022-11-10 14:00:02", "temp": -15, "type": "T", "ruler": -9.526788761233078}
19	2	{"datetime": "2023-02-28 14:00:02", "temp": -15, "type": "T", "ruler": 37.680582413832326}
20	2	{"datetime": "2023-03-05 14:00:02", "temp": 0, "type": "T", "ruler": 36.685246274599024}
21	2	{"datetime": "2023-03-14 14:00:01", "temp": 0, "type": "T", "ruler": 36.54305539756569}
22	2	{"datetime": "2022-10-02 15:01:56", "temp": 2, "type": "T", "ruler": -999}
23	2	{"datetime": "2023-03-29 10:00:02", "temp": -6, "type": "T", "ruler": 36.82743715163235}
24	2	{"datetime": "2022-11-12 14:00:01", "temp": -15, "type": "T", "ruler": -9.668979638266409}
25	2	{"datetime": "2022-11-30 10:00:01", "temp": -27, "type": "T", "ruler": 7.678307359799795}
26	2	{"datetime": "2022-11-14 14:00:02", "temp": -12, "type": "T", "ruler": -9.811170515299738}
27	2	{"datetime": "2022-10-13 14:00:02", "temp": 8, "type": "T", "ruler": -28.580366283699238}
28	2	{"datetime": "2023-03-04 10:00:02", "temp": -34, "type": "T", "ruler": 37.39620065976567}
29	2	{"datetime": "2022-10-14 14:00:01", "temp": -4, "type": "T", "ruler": -30.57103856216585}
30	2	{"datetime": "2023-05-15 14:00:01", "temp": 21, "type": "T", "ruler": -28.295984529632577}
31	2	{"datetime": "2023-05-16 14:00:01", "temp": 10, "type": "T", "ruler": -27.58503014446593}
32	2	{"datetime": "2023-03-19 10:00:02", "temp": -10, "type": "T", "ruler": 38.24934592196565}
33	2	{"datetime": "2023-01-31 10:00:02", "temp": -24, "type": "T", "ruler": 37.25400978273234}
34	2	{"datetime": "2023-01-20 10:00:02", "temp": -37, "type": "T", "ruler": 30.286656808099192}
35	2	{"datetime": "2023-03-16 14:00:01", "temp": 1, "type": "T", "ruler": 35.689910135365714}
36	2	{"datetime": "2023-05-19 14:00:02", "temp": 9, "type": "T", "ruler": -28.580366283699238}
37	2	{"datetime": "2023-05-20 10:00:01", "temp": 7, "type": "T", "ruler": -27.58503014446593}
38	2	{"datetime": "2023-05-17 10:00:01", "temp": 8, "type": "T", "ruler": -25.45216698896599}
39	2	{"datetime": "2023-03-07 14:00:02", "temp": -8, "type": "T", "ruler": -999}
40	2	{"datetime": "2023-03-15 14:00:02", "temp": 8, "type": "T", "ruler": 35.689910135365714}
41	2	{"datetime": "2023-02-18 14:00:00", "temp": -9, "type": "T", "ruler": 37.822773290865655}
42	2	{"datetime": "2023-03-18 14:00:01", "temp": 5, "type": "T", "ruler": 37.25400978273234}
43	2	{"datetime": "2023-04-21 14:00:01", "temp": 22, "type": "T", "ruler": 29.006938914799225}
44	2	{"datetime": "2023-04-01 14:00:02", "temp": 18, "type": "T", "ruler": 37.538391536799}
45	2	{"datetime": "2023-02-01 14:00:02", "temp": -22, "type": "T", "ruler": 36.685246274599024}
46	2	{"datetime": "2022-11-02 10:00:02", "temp": -27, "type": "T", "ruler": -17.631668752132864}
47	2	{"datetime": "2023-04-16 10:00:01", "temp": 2, "type": "T", "ruler": 33.6992378568991}
48	2	{"datetime": "2022-10-13 10:00:02", "temp": -8, "type": "T", "ruler": -28.580366283699238}
49	2	{"datetime": "2023-02-07 10:00:01", "temp": -34, "type": "T", "ruler": 33.84142873393243}
50	2	{"datetime": "2022-10-14 10:00:01", "temp": -13, "type": "T", "ruler": -26.874075759299284}
51	2	{"datetime": "2023-03-26 14:00:02", "temp": 9, "type": "T", "ruler": 37.11181890569901}
52	2	{"datetime": "2022-12-23 10:00:01", "temp": -24, "type": "T", "ruler": 32.27732908656581}
53	2	{"datetime": "2022-11-11 14:00:00", "temp": -19, "type": "T", "ruler": -9.10021613013309}
54	2	{"datetime": "2023-04-04 10:00:02", "temp": 0, "type": "T", "ruler": 36.96962802866568}
55	2	{"datetime": "2023-04-09 14:00:01", "temp": 13, "type": "T", "ruler": 35.40552838129906}
56	2	{"datetime": "2023-03-12 14:00:01", "temp": -12, "type": "T", "ruler": 34.41019224206575}
57	2	{"datetime": "2023-02-23 14:00:02", "temp": -12, "type": "T", "ruler": 36.685246274599024}
\.


--
-- Data for Name: sites; Type: TABLE DATA; Schema: public; Owner: lucky
--

COPY public.sites (site_id, name, comment) FROM stdin;
1	╨У╨Я-2	╨║╨╛╨╝╨╝╨╡╨╜╤В╨░╤А╨╕╨╣
2	CALM	keep calm
\.


--
-- Name: batches_batch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lucky
--

SELECT pg_catalog.setval('public.batches_batch_id_seq', 3, true);


--
-- Name: data_points_data_point_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lucky
--

SELECT pg_catalog.setval('public.data_points_data_point_id_seq', 57, true);


--
-- Name: sites_site_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lucky
--

SELECT pg_catalog.setval('public.sites_site_id_seq', 2, true);


--
-- Name: batches batches_pkey; Type: CONSTRAINT; Schema: public; Owner: lucky
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_pkey PRIMARY KEY (batch_id);


--
-- Name: data_points data_points_pkey; Type: CONSTRAINT; Schema: public; Owner: lucky
--

ALTER TABLE ONLY public.data_points
    ADD CONSTRAINT data_points_pkey PRIMARY KEY (data_point_id);


--
-- Name: sites sites_pkey; Type: CONSTRAINT; Schema: public; Owner: lucky
--

ALTER TABLE ONLY public.sites
    ADD CONSTRAINT sites_pkey PRIMARY KEY (site_id);


--
-- Name: batches batches_site_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lucky
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_site_id_fkey FOREIGN KEY (site_id) REFERENCES public.sites(site_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: data_points data_points_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lucky
--

ALTER TABLE ONLY public.data_points
    ADD CONSTRAINT data_points_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batches(batch_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.9 (Debian 14.9-1.pgdg120+1)
-- Dumped by pg_dump version 14.9 (Debian 14.9-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: lucky
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO lucky;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: lucky
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

