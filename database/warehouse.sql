--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-19 09:19:02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 17181)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4952 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 17264)
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17332)
-- Name: product_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_categories OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 17242)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    name character varying(50) NOT NULL,
    description text,
    permissions jsonb,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17306)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    full_name text,
    email text,
    phone text,
    department_id uuid,
    role_id uuid,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4944 (class 0 OID 17264)
-- Dependencies: 219
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, code, name, description, is_active, created_at, updated_at) FROM stdin;
7dd8c930-4099-4bdb-ac24-2302a0a9a98a	N	A	B	t	2025-05-19 07:53:10.664906	2025-05-19 07:53:10.664906
\.


--
-- TOC entry 4946 (class 0 OID 17332)
-- Dependencies: 221
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_categories (id, code, name, description, is_active, created_at, updated_at) FROM stdin;
4d9da72e-46a1-4229-9bb1-841afaee726a	RS	Rau sạch	Rau sieu sach	t	2025-05-19 09:11:09.983543	2025-05-19 09:11:09.983543
\.


--
-- TOC entry 4943 (class 0 OID 17242)
-- Dependencies: 218
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (name, description, permissions, status, created_at, updated_at, id) FROM stdin;
Admin	Quản trị viên hệ thống 	{"permissions": ["view", "edit", "delete", "add"]}	active	2025-05-19 07:32:41.05131	2025-05-19 07:32:41.05131	148fa076-70da-40c0-9c83-4ea2004b39cb
Manager	Quản lý kho	{"permissions": ["view", "edit", "add"]}	active	2025-05-19 07:35:23.040657	2025-05-19 07:35:23.040657	1ef47567-49f8-41ed-8d22-138d5ae68ccd
Employee	Nhân viên kho	{"permissions": ["add", "view"]}	active	2025-05-19 07:37:11.552886	2025-05-19 07:37:11.552886	8b79a84f-436c-4dd8-9c6e-2266b94dc379
Other	Thành phần khác	{"permissions": ["view"]}	active	2025-05-19 07:37:44.321392	2025-05-19 07:37:44.321392	3af49502-a14f-4e95-ba8f-c41975ebcdb6
\.


--
-- TOC entry 4945 (class 0 OID 17306)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, full_name, email, phone, department_id, role_id, is_active, created_at, updated_at) FROM stdin;
af5cdd63-3078-4f5c-98b6-4c07e5fe3d34	tnvnam	$2b$10$xhH2jba3hcDm93sKx.kpO.9W1dbGCP78v/Tk8S5tM/DLZGJqeZXm.	Trần Nguyễn Vũ Nam	tnvnam.it@gmail.com	0123456789	7dd8c930-4099-4bdb-ac24-2302a0a9a98a	148fa076-70da-40c0-9c83-4ea2004b39cb	t	2025-05-19 08:55:12.457223	2025-05-19 08:55:12.457223
\.


--
-- TOC entry 4783 (class 2606 OID 17274)
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- TOC entry 4785 (class 2606 OID 17272)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- TOC entry 4793 (class 2606 OID 17344)
-- Name: product_categories product_categories_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_code_key UNIQUE (code);


--
-- TOC entry 4795 (class 2606 OID 17342)
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4781 (class 2606 OID 17285)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4787 (class 2606 OID 17320)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4789 (class 2606 OID 17316)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 17318)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4796 (class 2606 OID 17321)
-- Name: users users_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- TOC entry 4797 (class 2606 OID 17326)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL;


-- Completed on 2025-05-19 09:19:02

--
-- PostgreSQL database dump complete
--

