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
-- Data for Name: sites; Type: TABLE DATA; Schema: public; Owner: lucky
--

INSERT INTO public.sites (site_id, name, comment) VALUES (1, 'all', '');


--
-- Data for Name: batches; Type: TABLE DATA; Schema: public; Owner: lucky
--

INSERT INTO public.batches (batch_id, site_id, start_date, end_date, createdat, processedat, mapping, status, comment) VALUES (2, 1, '1900-01-01', '1900-01-01', '2023-09-25 16:09:24.218451', '2023-09-25 16:09:24.220386', '{}', 'rejected', '');
INSERT INTO public.batches (batch_id, site_id, start_date, end_date, createdat, processedat, mapping, status, comment) VALUES (3, 1, '2022-11-04', '2023-01-08', '2023-09-25 16:13:34.331882', '2023-09-25 16:17:42.437708', '[{"id": "ruler", "type": "centimeters", "heightCm": "250", "pos": ["491.6", "26.88", "554.4", "515.9"]}, {"id": "datetime", "type": "timestamp", "pos": ["378.0", "542.9", "476.0", "557.6"]}, {"id": "temp", "type": "celsius", "pos": ["590.3", "540.9", "619.7", "556.6"]}, {"id": "type", "type": "str", "pos": ["261.3", "540.9", "295.6", "556.6"]}]', 'accepted', '');


--
-- Data for Name: data_points; Type: TABLE DATA; Schema: public; Owner: lucky
--

INSERT INTO public.data_points (data_point_id, batch_id, data) VALUES (1, 3, '{"datetime": "2022-11-19 10:00:02", "temp": 38, "type": "T", "ruler": 7.900677200902934}');
INSERT INTO public.data_points (data_point_id, batch_id, data) VALUES (2, 3, '{"datetime": "2023-01-08 14:00:01", "temp": -40, "type": "T", "ruler": -999}');
INSERT INTO public.data_points (data_point_id, batch_id, data) VALUES (3, 3, '{"datetime": "2022-12-24 14:00:01", "temp": -26, "type": "T", "ruler": 43.26561324303988}');
INSERT INTO public.data_points (data_point_id, batch_id, data) VALUES (4, 3, '{"datetime": "2023-01-04 10:00:02", "temp": -28, "type": "T", "ruler": -999}');
INSERT INTO public.data_points (data_point_id, batch_id, data) VALUES (5, 3, '{"datetime": "2022-11-04 10:00:01", "temp": -20, "type": "T", "ruler": 2.6335590669676447}');
INSERT INTO public.data_points (data_point_id, batch_id, data) VALUES (6, 3, '{"datetime": "2022-12-31 14:00:00", "temp": -40, "type": "T", "ruler": 42.136945071482316}');
INSERT INTO public.data_points (data_point_id, batch_id, data) VALUES (7, 3, '{"datetime": "2022-11-16 10:00:01", "temp": -40, "type": "T", "ruler": 8.747178329571106}');


--
-- Name: batches_batch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lucky
--

SELECT pg_catalog.setval('public.batches_batch_id_seq', 3, true);


--
-- Name: data_points_data_point_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lucky
--

SELECT pg_catalog.setval('public.data_points_data_point_id_seq', 7, true);


--
-- Name: sites_site_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lucky
--

SELECT pg_catalog.setval('public.sites_site_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

