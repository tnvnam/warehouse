--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-19 15:49:18

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
-- TOC entry 5016 (class 0 OID 0)
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
-- TOC entry 224 (class 1259 OID 17558)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    barcode text,
    category_id uuid,
    specification text,
    unit_id uuid,
    brand text,
    origin text,
    attributes jsonb,
    image_urls text[],
    price numeric,
    stock_min numeric,
    stock_max numeric,
    supplier_id uuid,
    is_active boolean DEFAULT true,
    note text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT products_stock_max_check CHECK ((stock_max >= (0)::numeric)),
    CONSTRAINT products_stock_min_check CHECK ((stock_min >= (0)::numeric))
);


ALTER TABLE public.products OWNER TO postgres;

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
-- TOC entry 223 (class 1259 OID 17535)
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    tax_code text,
    address text,
    phone text,
    email text,
    contact_person text,
    contact_position text,
    business_field text,
    note text,
    credit_limit numeric,
    priority_level text,
    is_active boolean DEFAULT true,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT suppliers_credit_limit_check CHECK ((credit_limit >= (0)::numeric))
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17588)
-- Name: unit_conversions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit_conversions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid,
    from_unit_id uuid NOT NULL,
    to_unit_id uuid NOT NULL,
    factor numeric NOT NULL,
    note text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unit_conversions_factor_check CHECK ((factor > (0)::numeric))
);


ALTER TABLE public.unit_conversions OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17525)
-- Name: units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.units (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public.units OWNER TO postgres;

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
-- TOC entry 5004 (class 0 OID 17264)
-- Dependencies: 219
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, code, name, description, is_active, created_at, updated_at) FROM stdin;
7dd8c930-4099-4bdb-ac24-2302a0a9a98a	N	A	B	t	2025-05-19 07:53:10.664906	2025-05-19 07:53:10.664906
\.


--
-- TOC entry 5006 (class 0 OID 17332)
-- Dependencies: 221
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_categories (id, code, name, description, is_active, created_at, updated_at) FROM stdin;
4d9da72e-46a1-4229-9bb1-841afaee726a	RS	Rau sạch	Rau sieu sach	t	2025-05-19 09:11:09.983543	2025-05-19 09:11:09.983543
\.


--
-- TOC entry 5009 (class 0 OID 17558)
-- Dependencies: 224
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, code, name, barcode, category_id, specification, unit_id, brand, origin, attributes, image_urls, price, stock_min, stock_max, supplier_id, is_active, note, created_at) FROM stdin;
3485be07-4b39-4fd2-8e47-31224a5a3ed4	Sp1	san pham1	5205496833046	4d9da72e-46a1-4229-9bb1-841afaee726a	quy cach/dac ta san pham	d4f101da-e6f5-4a81-84b1-f94e0713113d	thuong hieu	xuat su	{"3m": "", "xanh": "", "chong nuoc": ""}	\N	1000000	120	1000	c96d14ee-3bda-4879-83ea-a7dabfda0dfa	t	ghi chu	2025-05-19 15:23:42.746956+07
\.


--
-- TOC entry 5003 (class 0 OID 17242)
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
-- TOC entry 5008 (class 0 OID 17535)
-- Dependencies: 223
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, code, name, tax_code, address, phone, email, contact_person, contact_position, business_field, note, credit_limit, priority_level, is_active, created_by, created_at, updated_at) FROM stdin;
c96d14ee-3bda-4879-83ea-a7dabfda0dfa	NCC1	Nha cc 1	ma so thue	bd	0123456789	ncc@gmail.com	nguoi lien he	chuc vu nguoi lien he	linh vuc kinh doanh	ghi chu	\N	muc do uu tien	t	af5cdd63-3078-4f5c-98b6-4c07e5fe3d34	2025-05-19 14:50:20.640546	2025-05-19 14:50:20.640546
\.


--
-- TOC entry 5010 (class 0 OID 17588)
-- Dependencies: 225
-- Data for Name: unit_conversions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit_conversions (id, product_id, from_unit_id, to_unit_id, factor, note, is_active, created_at, updated_at) FROM stdin;
4a1af918-6a0d-4394-9d6f-2588ad8079df	3485be07-4b39-4fd2-8e47-31224a5a3ed4	d4f101da-e6f5-4a81-84b1-f94e0713113d	ebba51b8-1c20-452b-afec-3ff5b0a454f3	1.5		\N	2025-05-19 15:43:26.783715+07	2025-05-19 15:43:26.783715+07
\.


--
-- TOC entry 5007 (class 0 OID 17525)
-- Dependencies: 222
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.units (id, code, name, description) FROM stdin;
d4f101da-e6f5-4a81-84b1-f94e0713113d	kg	Kilogram	Kí lô
ebba51b8-1c20-452b-afec-3ff5b0a454f3	m2	Square meter	Mét vuông
\.


--
-- TOC entry 5005 (class 0 OID 17306)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, full_name, email, phone, department_id, role_id, is_active, created_at, updated_at) FROM stdin;
af5cdd63-3078-4f5c-98b6-4c07e5fe3d34	tnvnam	$2b$10$xhH2jba3hcDm93sKx.kpO.9W1dbGCP78v/Tk8S5tM/DLZGJqeZXm.	Trần Nguyễn Vũ Nam	tnvnam.it@gmail.com	0123456789	7dd8c930-4099-4bdb-ac24-2302a0a9a98a	148fa076-70da-40c0-9c83-4ea2004b39cb	t	2025-05-19 08:55:12.457223	2025-05-19 08:55:12.457223
\.


--
-- TOC entry 4816 (class 2606 OID 17274)
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- TOC entry 4818 (class 2606 OID 17272)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- TOC entry 4826 (class 2606 OID 17344)
-- Name: product_categories product_categories_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_code_key UNIQUE (code);


--
-- TOC entry 4828 (class 2606 OID 17342)
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4842 (class 2606 OID 17572)
-- Name: products products_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_code_key UNIQUE (code);


--
-- TOC entry 4844 (class 2606 OID 17570)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 17285)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 17548)
-- Name: suppliers suppliers_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_code_key UNIQUE (code);


--
-- TOC entry 4836 (class 2606 OID 17550)
-- Name: suppliers suppliers_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_email_unique UNIQUE (email);


--
-- TOC entry 4838 (class 2606 OID 17552)
-- Name: suppliers suppliers_phone_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_phone_unique UNIQUE (phone);


--
-- TOC entry 4840 (class 2606 OID 17546)
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- TOC entry 4846 (class 2606 OID 17599)
-- Name: unit_conversions unit_conversions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_conversions
    ADD CONSTRAINT unit_conversions_pkey PRIMARY KEY (id);


--
-- TOC entry 4848 (class 2606 OID 17601)
-- Name: unit_conversions unit_conversions_product_from_to_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_conversions
    ADD CONSTRAINT unit_conversions_product_from_to_unique UNIQUE (product_id, from_unit_id, to_unit_id);


--
-- TOC entry 4830 (class 2606 OID 17534)
-- Name: units units_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_code_key UNIQUE (code);


--
-- TOC entry 4832 (class 2606 OID 17532)
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- TOC entry 4820 (class 2606 OID 17320)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4822 (class 2606 OID 17316)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4824 (class 2606 OID 17318)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4852 (class 2606 OID 17573)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id);


--
-- TOC entry 4853 (class 2606 OID 17583)
-- Name: products products_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- TOC entry 4854 (class 2606 OID 17578)
-- Name: products products_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 4851 (class 2606 OID 17553)
-- Name: suppliers suppliers_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 4855 (class 2606 OID 17607)
-- Name: unit_conversions unit_conversions_from_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_conversions
    ADD CONSTRAINT unit_conversions_from_unit_id_fkey FOREIGN KEY (from_unit_id) REFERENCES public.units(id);


--
-- TOC entry 4856 (class 2606 OID 17602)
-- Name: unit_conversions unit_conversions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_conversions
    ADD CONSTRAINT unit_conversions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4857 (class 2606 OID 17612)
-- Name: unit_conversions unit_conversions_to_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_conversions
    ADD CONSTRAINT unit_conversions_to_unit_id_fkey FOREIGN KEY (to_unit_id) REFERENCES public.units(id);


--
-- TOC entry 4849 (class 2606 OID 17321)
-- Name: users users_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- TOC entry 4850 (class 2606 OID 17326)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL;


-- Completed on 2025-05-19 15:49:18

--
-- PostgreSQL database dump complete
--

