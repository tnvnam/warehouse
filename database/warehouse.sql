--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-05-23 01:12:16

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
-- TOC entry 2 (class 3079 OID 16703)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5334 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 883 (class 1247 OID 16715)
-- Name: customer_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.customer_priority AS ENUM (
    'Cao',
    'Trung bình',
    'Thấp'
);


ALTER TYPE public.customer_priority OWNER TO postgres;

--
-- TOC entry 886 (class 1247 OID 16722)
-- Name: customer_scale; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.customer_scale AS ENUM (
    'Lớn',
    'Vừa',
    'Nhỏ'
);


ALTER TYPE public.customer_scale OWNER TO postgres;

--
-- TOC entry 889 (class 1247 OID 16730)
-- Name: customer_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.customer_status AS ENUM (
    'Đang hoạt động',
    'Tạm dừng',
    'Ngừng hợp tác'
);


ALTER TYPE public.customer_status OWNER TO postgres;

--
-- TOC entry 892 (class 1247 OID 16738)
-- Name: delivery_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.delivery_status AS ENUM (
    'Pending',
    'In Transit',
    'Delivered',
    'Returned'
);


ALTER TYPE public.delivery_status OWNER TO postgres;

--
-- TOC entry 895 (class 1247 OID 16748)
-- Name: material_request_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.material_request_status AS ENUM (
    'Mới tạo',
    'Đã duyệt',
    'Đã xuất',
    'Hủy'
);


ALTER TYPE public.material_request_status OWNER TO postgres;

--
-- TOC entry 898 (class 1247 OID 16758)
-- Name: order_approval_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_approval_status AS ENUM (
    'Pending',
    'Approved',
    'Rejected'
);


ALTER TYPE public.order_approval_status OWNER TO postgres;

--
-- TOC entry 901 (class 1247 OID 16766)
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'New',
    'Confirmed',
    'Processing',
    'Delivered',
    'Cancelled',
    'Returned'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- TOC entry 904 (class 1247 OID 16780)
-- Name: payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_method AS ENUM (
    'Tiền mặt',
    'Chuyển khoản',
    'Thẻ',
    'COD'
);


ALTER TYPE public.payment_method OWNER TO postgres;

--
-- TOC entry 907 (class 1247 OID 16790)
-- Name: payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_status AS ENUM (
    'Unpaid',
    'Partially Paid',
    'Paid'
);


ALTER TYPE public.payment_status OWNER TO postgres;

--
-- TOC entry 910 (class 1247 OID 16798)
-- Name: production_order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.production_order_status AS ENUM (
    'Đang chờ',
    'Đã duyệt',
    'Đang sản xuất',
    'Hoàn thành',
    'Đã hủy'
);


ALTER TYPE public.production_order_status OWNER TO postgres;

--
-- TOC entry 913 (class 1247 OID 16810)
-- Name: purchase_request_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.purchase_request_status AS ENUM (
    'Mới tạo',
    'Đã duyệt',
    'Đã mua',
    'Đã hủy'
);


ALTER TYPE public.purchase_request_status OWNER TO postgres;

--
-- TOC entry 916 (class 1247 OID 16820)
-- Name: transport_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transport_method AS ENUM (
    'Xe tải',
    'Máy bay',
    'Tàu hỏa',
    'Bưu điện'
);


ALTER TYPE public.transport_method OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16829)
-- Name: banks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    bank_name text NOT NULL,
    account_number text NOT NULL,
    branch text
);


ALTER TABLE public.banks OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16835)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    tax_code text,
    address text,
    phone text,
    email text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT companies_email_check CHECK ((email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)),
    CONSTRAINT companies_phone_check CHECK ((phone ~ '^\d{10,15}$'::text))
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16846)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tax_code text NOT NULL,
    company_name text NOT NULL,
    address text,
    phone text,
    email text,
    contact_person text,
    contact_position text,
    created_by uuid,
    updated_by uuid,
    business_field text,
    note text,
    scale public.customer_scale DEFAULT 'Vừa'::public.customer_scale,
    status public.customer_status DEFAULT 'Đang hoạt động'::public.customer_status,
    credit_limit numeric(15,2) DEFAULT 0.00,
    priority_level public.customer_priority DEFAULT 'Thấp'::public.customer_priority,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT customers_credit_limit_check CHECK ((credit_limit >= (0)::numeric)),
    CONSTRAINT customers_email_check CHECK ((email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)),
    CONSTRAINT customers_phone_check CHECK ((phone ~ '^\d{10}$'::text))
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16862)
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
-- TOC entry 244 (class 1259 OID 24969)
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    material_id uuid,
    warehouse_id uuid,
    quantity numeric(10,2) DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16871)
-- Name: material_request_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material_request_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    material_request_id uuid,
    material_id uuid,
    material_name text,
    specification text,
    quantity numeric NOT NULL,
    unit_id uuid,
    note text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT material_request_items_quantity_check CHECK ((quantity > (0)::numeric))
);


ALTER TABLE public.material_request_items OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16880)
-- Name: material_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material_requests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    request_code text NOT NULL,
    production_order_id uuid,
    requester_id uuid,
    request_date date DEFAULT CURRENT_DATE,
    status public.material_request_status DEFAULT 'Mới tạo'::public.material_request_status,
    note text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.material_requests OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16891)
-- Name: materials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materials (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    specification text,
    category_id uuid,
    unit_id uuid,
    brand text,
    origin text,
    supplier_id uuid,
    attributes jsonb,
    image_urls text[],
    stock_min numeric,
    stock_max numeric,
    note text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT materials_stock_max_check CHECK ((stock_max >= (0)::numeric)),
    CONSTRAINT materials_stock_min_check CHECK ((stock_min >= (0)::numeric))
);


ALTER TABLE public.materials OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16902)
-- Name: order_approval; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_approval (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    approver_id uuid,
    approved_at timestamp with time zone,
    approval_status public.order_approval_status DEFAULT 'Pending'::public.order_approval_status,
    approval_note text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.order_approval OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16911)
-- Name: order_delivery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_delivery (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid,
    delivery_address text,
    transport_method public.transport_method,
    shipping_cost numeric,
    delivery_status public.delivery_status DEFAULT 'Pending'::public.delivery_status,
    actual_delivery_date date,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT order_delivery_shipping_cost_check CHECK ((shipping_cost >= (0)::numeric))
);


ALTER TABLE public.order_delivery OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16921)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid,
    product_code text,
    product_type text,
    material text,
    specification text,
    dimension text,
    color text,
    unit text,
    quantity integer,
    packing_spec text,
    unit_price numeric,
    amount numeric,
    vat numeric,
    total_after_tax numeric,
    tolerance_percent numeric,
    CONSTRAINT order_items_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT order_items_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT order_items_tolerance_percent_check CHECK ((tolerance_percent >= (0)::numeric)),
    CONSTRAINT order_items_total_after_tax_check CHECK ((total_after_tax >= (0)::numeric)),
    CONSTRAINT order_items_unit_price_check CHECK ((unit_price >= (0)::numeric)),
    CONSTRAINT order_items_vat_check CHECK ((vat >= (0)::numeric))
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16933)
-- Name: order_payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_payment (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid,
    payment_terms text,
    payment_method public.payment_method,
    bank_id uuid,
    payment_status public.payment_status DEFAULT 'Unpaid'::public.payment_status,
    payment_amount numeric,
    payment_date date,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT order_payment_payment_amount_check CHECK ((payment_amount >= (0)::numeric))
);


ALTER TABLE public.order_payment OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16943)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_code text NOT NULL,
    customer_id uuid,
    order_date date DEFAULT CURRENT_DATE,
    delivery_date_required date,
    delivery_date_estimated date,
    special_request text,
    quality_standard text,
    return_policy text,
    internal_note text,
    status public.order_status DEFAULT 'New'::public.order_status,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16953)
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
-- TOC entry 231 (class 1259 OID 16962)
-- Name: production_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.production_orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_code text NOT NULL,
    product_id uuid,
    planned_quantity numeric NOT NULL,
    actual_quantity numeric,
    start_date date,
    end_date date,
    requester_id uuid,
    approver_id uuid,
    status public.production_order_status DEFAULT 'Đang chờ'::public.production_order_status,
    priority integer DEFAULT 1,
    note text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT production_orders_actual_quantity_check CHECK ((actual_quantity >= (0)::numeric)),
    CONSTRAINT production_orders_planned_quantity_check CHECK ((planned_quantity > (0)::numeric)),
    CONSTRAINT production_orders_priority_check CHECK (((priority >= 1) AND (priority <= 5)))
);


ALTER TABLE public.production_orders OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16976)
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
-- TOC entry 233 (class 1259 OID 16987)
-- Name: purchase_request_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_request_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    purchase_request_id uuid,
    material_id uuid,
    material_code text,
    material_name text,
    specification text,
    unit_id uuid,
    unit text,
    quantity numeric,
    note text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT purchase_request_items_quantity_check CHECK ((quantity > (0)::numeric))
);


ALTER TABLE public.purchase_request_items OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16996)
-- Name: purchase_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_requests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    request_code text NOT NULL,
    department_id uuid,
    requester_id uuid,
    created_by uuid,
    request_date date DEFAULT CURRENT_DATE,
    status public.purchase_request_status DEFAULT 'Mới tạo'::public.purchase_request_status,
    note text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.purchase_requests OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 24947)
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type character varying(10) NOT NULL,
    department_id uuid,
    material_id uuid,
    quantity numeric(10,2) NOT NULL,
    status character varying(10) DEFAULT 'pending'::character varying,
    date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    warehouse_id uuid,
    CONSTRAINT requests_quantity_check CHECK ((quantity > (0)::numeric)),
    CONSTRAINT requests_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))),
    CONSTRAINT requests_type_check CHECK (((type)::text = ANY ((ARRAY['import'::character varying, 'export'::character varying])::text[])))
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17006)
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
-- TOC entry 241 (class 1259 OID 24914)
-- Name: stock_check; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_check (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    warehouse_id uuid,
    date date NOT NULL,
    note text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock_check OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 24928)
-- Name: stock_check_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_check_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    stock_check_id uuid,
    material_id uuid,
    expected_quantity numeric(10,2) NOT NULL,
    actual_quantity numeric(10,2) NOT NULL,
    note text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock_check_items OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 17015)
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
-- TOC entry 237 (class 1259 OID 17025)
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
-- TOC entry 238 (class 1259 OID 17035)
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
-- TOC entry 239 (class 1259 OID 17041)
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
-- TOC entry 240 (class 1259 OID 17050)
-- Name: warehouses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    parent_id uuid,
    address text,
    manager_id uuid,
    note text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.warehouses OWNER TO postgres;

--
-- TOC entry 5302 (class 0 OID 16829)
-- Dependencies: 218
-- Data for Name: banks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.banks (id, bank_name, account_number, branch) FROM stdin;
\.


--
-- TOC entry 5303 (class 0 OID 16835)
-- Dependencies: 219
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, tax_code, address, phone, email, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5304 (class 0 OID 16846)
-- Dependencies: 220
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, tax_code, company_name, address, phone, email, contact_person, contact_position, created_by, updated_by, business_field, note, scale, status, credit_limit, priority_level, is_active, created_at, updated_at) FROM stdin;
9a4752a4-a418-435b-8e12-0153722b5225	13565656	ten cong ty	dia chi	0123456789	doanhnghiep@gmail.com	nguoi lien he	chuc vu nguoi lien he	af5cdd63-3078-4f5c-98b6-4c07e5fe3d34	af5cdd63-3078-4f5c-98b6-4c07e5fe3d34	nganh nghe kinh doanh	ghi chu	Vừa	Đang hoạt động	10500000.00	Trung bình	\N	2025-05-20 17:50:54.830143+07	2025-05-20 17:50:54.830143+07
\.


--
-- TOC entry 5305 (class 0 OID 16862)
-- Dependencies: 221
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, code, name, description, is_active, created_at, updated_at) FROM stdin;
7dd8c930-4099-4bdb-ac24-2302a0a9a98a	N	A	B	t	2025-05-19 07:53:10.664906	2025-05-19 07:53:10.664906
\.


--
-- TOC entry 5328 (class 0 OID 24969)
-- Dependencies: 244
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (id, material_id, warehouse_id, quantity, updated_at) FROM stdin;
1ada6e54-e7a5-4f12-8761-ec40bc5a7b2c	539a8b90-58fa-4640-8de8-c6a3f28962f4	f738d696-8451-4701-bc57-0866a9c30ec7	150.00	2025-05-22 22:01:03.645402
de5d721a-1d54-41c2-b78b-67da4aeffc1e	539a8b90-58fa-4640-8de8-c6a3f28962f4	0a28e2dd-ad84-45bb-96a8-ecbe790b75db	80.00	2025-05-22 22:01:03.645402
\.


--
-- TOC entry 5306 (class 0 OID 16871)
-- Dependencies: 222
-- Data for Name: material_request_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.material_request_items (id, material_request_id, material_id, material_name, specification, quantity, unit_id, note, created_at, updated_at) FROM stdin;
54eb713d-684a-48c7-9900-8f5d202c4070	73368dcc-274d-4ef0-9339-64b36294b11e	539a8b90-58fa-4640-8de8-c6a3f28962f4	Thép tấm	Q345B, dày 10mm	100	ebba51b8-1c20-452b-afec-3ff5b0a454f3	Dùng cho sản xuất tháng 5	2025-05-21 22:19:24.905225+07	2025-05-21 22:19:24.905225+07
\.


--
-- TOC entry 5307 (class 0 OID 16880)
-- Dependencies: 223
-- Data for Name: material_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.material_requests (id, request_code, production_order_id, requester_id, request_date, status, note, is_active, created_at, updated_at) FROM stdin;
73368dcc-274d-4ef0-9339-64b36294b11e	YCVT-001	49039cde-86f0-42d9-a0b5-23f3b5d473ec	af5cdd63-3078-4f5c-98b6-4c07e5fe3d34	2025-05-21	Mới tạo	Yêu cầu xuất vật tư cho sản xuất	t	2025-05-21 22:15:00.635856+07	2025-05-21 22:15:00.635856+07
\.


--
-- TOC entry 5308 (class 0 OID 16891)
-- Dependencies: 224
-- Data for Name: materials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.materials (id, code, name, specification, category_id, unit_id, brand, origin, supplier_id, attributes, image_urls, stock_min, stock_max, note, is_active, created_at, updated_at) FROM stdin;
539a8b90-58fa-4640-8de8-c6a3f28962f4	NVL1	NVL1	3.23	4d9da72e-46a1-4229-9bb1-841afaee726a	d4f101da-e6f5-4a81-84b1-f94e0713113d	thuong hieu	xuat su	c96d14ee-3bda-4879-83ea-a7dabfda0dfa	{"do": "", "xl": ""}	{"anh o day"}	120	3000	a	t	2025-05-20 19:24:19.462584+07	2025-05-20 19:24:19.462584+07
\.


--
-- TOC entry 5309 (class 0 OID 16902)
-- Dependencies: 225
-- Data for Name: order_approval; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_approval (id, order_id, approver_id, approved_at, approval_status, approval_note, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5310 (class 0 OID 16911)
-- Dependencies: 226
-- Data for Name: order_delivery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_delivery (id, order_id, delivery_address, transport_method, shipping_cost, delivery_status, actual_delivery_date, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5311 (class 0 OID 16921)
-- Dependencies: 227
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_code, product_type, material, specification, dimension, color, unit, quantity, packing_spec, unit_price, amount, vat, total_after_tax, tolerance_percent) FROM stdin;
\.


--
-- TOC entry 5312 (class 0 OID 16933)
-- Dependencies: 228
-- Data for Name: order_payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_payment (id, order_id, payment_terms, payment_method, bank_id, payment_status, payment_amount, payment_date, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5313 (class 0 OID 16943)
-- Dependencies: 229
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, order_code, customer_id, order_date, delivery_date_required, delivery_date_estimated, special_request, quality_standard, return_policy, internal_note, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5314 (class 0 OID 16953)
-- Dependencies: 230
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_categories (id, code, name, description, is_active, created_at, updated_at) FROM stdin;
4d9da72e-46a1-4229-9bb1-841afaee726a	RS	Rau sạch	Rau sieu sach	t	2025-05-19 09:11:09.983543	2025-05-19 09:11:09.983543
\.


--
-- TOC entry 5315 (class 0 OID 16962)
-- Dependencies: 231
-- Data for Name: production_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.production_orders (id, order_code, product_id, planned_quantity, actual_quantity, start_date, end_date, requester_id, approver_id, status, priority, note, is_active, created_at, updated_at) FROM stdin;
49039cde-86f0-42d9-a0b5-23f3b5d473ec	LSX1	3485be07-4b39-4fd2-8e47-31224a5a3ed4	12	21	2025-05-21	2025-05-23	af5cdd63-3078-4f5c-98b6-4c07e5fe3d34	af5cdd63-3078-4f5c-98b6-4c07e5fe3d34	Đang sản xuất	5	ghi chu	t	2025-05-21 21:42:43.353281+07	2025-05-21 21:42:43.353281+07
\.


--
-- TOC entry 5316 (class 0 OID 16976)
-- Dependencies: 232
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, code, name, barcode, category_id, specification, unit_id, brand, origin, attributes, image_urls, price, stock_min, stock_max, supplier_id, is_active, note, created_at) FROM stdin;
3485be07-4b39-4fd2-8e47-31224a5a3ed4	Sp1	san pham1	5205496833046	4d9da72e-46a1-4229-9bb1-841afaee726a	quy cach/dac ta san pham	d4f101da-e6f5-4a81-84b1-f94e0713113d	thuong hieu	xuat su	{"3m": "", "xanh": "", "chong nuoc": ""}	\N	1000000	120	1000	c96d14ee-3bda-4879-83ea-a7dabfda0dfa	t	ghi chu	2025-05-19 15:23:42.746956+07
95dddb06-e3b0-44be-989f-06f18c71bf85	2	abc	2655379837278	4d9da72e-46a1-4229-9bb1-841afaee726a	rau ngon	d4f101da-e6f5-4a81-84b1-f94e0713113d	rau	cho	{"xanh": ""}	\N	2000	5	10	c96d14ee-3bda-4879-83ea-a7dabfda0dfa	t	aaa	2025-05-22 16:30:06.277216+07
\.


--
-- TOC entry 5317 (class 0 OID 16987)
-- Dependencies: 233
-- Data for Name: purchase_request_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_request_items (id, purchase_request_id, material_id, material_code, material_name, specification, unit_id, unit, quantity, note, created_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5318 (class 0 OID 16996)
-- Dependencies: 234
-- Data for Name: purchase_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_requests (id, request_code, department_id, requester_id, created_by, request_date, status, note, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5327 (class 0 OID 24947)
-- Dependencies: 243
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (id, type, department_id, material_id, quantity, status, date, created_at, warehouse_id) FROM stdin;
1dceff7e-de34-48e1-8110-026fde58e4d4	import	7dd8c930-4099-4bdb-ac24-2302a0a9a98a	539a8b90-58fa-4640-8de8-c6a3f28962f4	5.00	pending	2025-05-22	2025-05-22 21:44:22.751039	f738d696-8451-4701-bc57-0866a9c30ec7
1422a5f7-3eed-4da6-914c-75c8be3cefff	export	7dd8c930-4099-4bdb-ac24-2302a0a9a98a	539a8b90-58fa-4640-8de8-c6a3f28962f4	3.00	pending	2025-05-22	2025-05-22 21:45:59.645686	f738d696-8451-4701-bc57-0866a9c30ec7
62e95a9f-98ea-4dc3-92b6-bcbcbd2a5cea	import	7dd8c930-4099-4bdb-ac24-2302a0a9a98a	539a8b90-58fa-4640-8de8-c6a3f28962f4	100.00	approved	2025-05-22	2025-05-22 22:38:00.716562	f738d696-8451-4701-bc57-0866a9c30ec7
e457e2b7-b4c4-4b27-a980-825c32e1e1e6	import	\N	539a8b90-58fa-4640-8de8-c6a3f28962f4	5.00	approved	2025-05-22	2025-05-23 01:05:25.394694	f738d696-8451-4701-bc57-0866a9c30ec7
263ea078-f3ee-458e-ab15-b6bcae642c99	export	\N	539a8b90-58fa-4640-8de8-c6a3f28962f4	5.00	approved	2025-05-22	2025-05-23 01:06:31.025189	f738d696-8451-4701-bc57-0866a9c30ec7
\.


--
-- TOC entry 5319 (class 0 OID 17006)
-- Dependencies: 235
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (name, description, permissions, status, created_at, updated_at, id) FROM stdin;
Admin	Quản trị viên hệ thống 	{"permissions": ["view", "edit", "delete", "add"]}	active	2025-05-19 07:32:41.05131	2025-05-19 07:32:41.05131	148fa076-70da-40c0-9c83-4ea2004b39cb
Manager	Quản lý kho	{"permissions": ["view", "edit", "add"]}	active	2025-05-19 07:35:23.040657	2025-05-19 07:35:23.040657	1ef47567-49f8-41ed-8d22-138d5ae68ccd
Employee	Nhân viên kho	{"permissions": ["add", "view"]}	active	2025-05-19 07:37:11.552886	2025-05-19 07:37:11.552886	8b79a84f-436c-4dd8-9c6e-2266b94dc379
Other	Thành phần khác	{"permissions": ["view"]}	active	2025-05-19 07:37:44.321392	2025-05-19 07:37:44.321392	3af49502-a14f-4e95-ba8f-c41975ebcdb6
\.


--
-- TOC entry 5325 (class 0 OID 24914)
-- Dependencies: 241
-- Data for Name: stock_check; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_check (id, warehouse_id, date, note, created_at) FROM stdin;
5ab220de-6f22-4b8c-ac16-dd8030f0ec6e	f738d696-8451-4701-bc57-0866a9c30ec7	2025-05-22	Ok day	2025-05-22 21:24:56.799044
6eed8ab5-cea2-4eff-b185-88c271866d2b	f738d696-8451-4701-bc57-0866a9c30ec7	2025-05-22	Tam on	2025-05-22 21:31:31.500155
\.


--
-- TOC entry 5326 (class 0 OID 24928)
-- Dependencies: 242
-- Data for Name: stock_check_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_check_items (id, stock_check_id, material_id, expected_quantity, actual_quantity, note, created_at) FROM stdin;
\.


--
-- TOC entry 5320 (class 0 OID 17015)
-- Dependencies: 236
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, code, name, tax_code, address, phone, email, contact_person, contact_position, business_field, note, credit_limit, priority_level, is_active, created_by, created_at, updated_at) FROM stdin;
c96d14ee-3bda-4879-83ea-a7dabfda0dfa	NCC1	Nha cc 1	ma so thue	bd	0123456789	ncc@gmail.com	nguoi lien he	chuc vu nguoi lien he	linh vuc kinh doanh	ghi chu	\N	muc do uu tien	t	af5cdd63-3078-4f5c-98b6-4c07e5fe3d34	2025-05-19 14:50:20.640546	2025-05-19 14:50:20.640546
\.


--
-- TOC entry 5321 (class 0 OID 17025)
-- Dependencies: 237
-- Data for Name: unit_conversions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit_conversions (id, product_id, from_unit_id, to_unit_id, factor, note, is_active, created_at, updated_at) FROM stdin;
4a1af918-6a0d-4394-9d6f-2588ad8079df	3485be07-4b39-4fd2-8e47-31224a5a3ed4	d4f101da-e6f5-4a81-84b1-f94e0713113d	ebba51b8-1c20-452b-afec-3ff5b0a454f3	1.5		\N	2025-05-19 15:43:26.783715+07	2025-05-19 15:43:26.783715+07
\.


--
-- TOC entry 5322 (class 0 OID 17035)
-- Dependencies: 238
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.units (id, code, name, description) FROM stdin;
d4f101da-e6f5-4a81-84b1-f94e0713113d	kg	Kilogram	Kí lô
ebba51b8-1c20-452b-afec-3ff5b0a454f3	m2	Square meter	Mét vuông
\.


--
-- TOC entry 5323 (class 0 OID 17041)
-- Dependencies: 239
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, full_name, email, phone, department_id, role_id, is_active, created_at, updated_at) FROM stdin;
af5cdd63-3078-4f5c-98b6-4c07e5fe3d34	tnvnam	$2b$10$xhH2jba3hcDm93sKx.kpO.9W1dbGCP78v/Tk8S5tM/DLZGJqeZXm.	Trần Nguyễn Vũ Nam	tnvnam.it@gmail.com	0123456789	7dd8c930-4099-4bdb-ac24-2302a0a9a98a	148fa076-70da-40c0-9c83-4ea2004b39cb	t	2025-05-19 08:55:12.457223	2025-05-19 08:55:12.457223
1d176032-6d02-4fe4-b0e8-19f3a88fa0fe	vanhiep2	$2b$10$nFDCQX9qePcIFaPIDn1vGuw9im0aGYwE0QddoevLzqGvph.dWP/EW	Le Van Hiep 	hiep2@gmail.com	0215898745	7dd8c930-4099-4bdb-ac24-2302a0a9a98a	8b79a84f-436c-4dd8-9c6e-2266b94dc379	t	2025-05-22 13:50:31.37393	2025-05-22 13:50:31.37393
901f4365-b038-464c-bc37-51fd32ee9501	vanhiep1	$2b$10$RSTS7ew3gYOuYTdOyRNy9.wlsecnoD16tpaibRqm6NcELpox5XfNS	Le Van Hiep	hiep1@gmail.com	0325894251	7dd8c930-4099-4bdb-ac24-2302a0a9a98a	148fa076-70da-40c0-9c83-4ea2004b39cb	t	2025-05-22 08:52:56.045959	2025-05-22 15:20:47.344759
\.


--
-- TOC entry 5324 (class 0 OID 17050)
-- Dependencies: 240
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouses (id, code, name, parent_id, address, manager_id, note, is_active, created_at, updated_at) FROM stdin;
f738d696-8451-4701-bc57-0866a9c30ec7	K01	Kho 01	\N	dia chi	af5cdd63-3078-4f5c-98b6-4c07e5fe3d34	kho lon	t	2025-05-20 18:18:00.180651+07	2025-05-20 18:18:00.180651+07
0a28e2dd-ad84-45bb-96a8-ecbe790b75db	K01_1	kho con cua kho 01	f738d696-8451-4701-bc57-0866a9c30ec7	dia chi 	af5cdd63-3078-4f5c-98b6-4c07e5fe3d34	A	t	2025-05-20 18:18:50.65934+07	2025-05-20 18:18:50.65934+07
\.


--
-- TOC entry 5022 (class 2606 OID 17060)
-- Name: banks banks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_pkey PRIMARY KEY (id);


--
-- TOC entry 5024 (class 2606 OID 17062)
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- TOC entry 5026 (class 2606 OID 17064)
-- Name: companies companies_tax_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_tax_code_key UNIQUE (tax_code);


--
-- TOC entry 5028 (class 2606 OID 17066)
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- TOC entry 5030 (class 2606 OID 17068)
-- Name: customers customers_tax_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_tax_code_key UNIQUE (tax_code);


--
-- TOC entry 5032 (class 2606 OID 17070)
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- TOC entry 5034 (class 2606 OID 17072)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- TOC entry 5110 (class 2606 OID 24976)
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- TOC entry 5036 (class 2606 OID 17074)
-- Name: material_request_items material_request_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_request_items
    ADD CONSTRAINT material_request_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5038 (class 2606 OID 17076)
-- Name: material_requests material_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_requests
    ADD CONSTRAINT material_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 5040 (class 2606 OID 17078)
-- Name: material_requests material_requests_request_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_requests
    ADD CONSTRAINT material_requests_request_code_key UNIQUE (request_code);


--
-- TOC entry 5042 (class 2606 OID 17080)
-- Name: materials materials_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_code_key UNIQUE (code);


--
-- TOC entry 5044 (class 2606 OID 17082)
-- Name: materials materials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_pkey PRIMARY KEY (id);


--
-- TOC entry 5046 (class 2606 OID 17084)
-- Name: order_approval order_approval_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_approval
    ADD CONSTRAINT order_approval_pkey PRIMARY KEY (id);


--
-- TOC entry 5048 (class 2606 OID 17086)
-- Name: order_delivery order_delivery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_delivery
    ADD CONSTRAINT order_delivery_pkey PRIMARY KEY (id);


--
-- TOC entry 5050 (class 2606 OID 17088)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5052 (class 2606 OID 17090)
-- Name: order_payment order_payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_payment
    ADD CONSTRAINT order_payment_pkey PRIMARY KEY (id);


--
-- TOC entry 5054 (class 2606 OID 17092)
-- Name: orders orders_order_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_code_key UNIQUE (order_code);


--
-- TOC entry 5056 (class 2606 OID 17094)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 5058 (class 2606 OID 17096)
-- Name: product_categories product_categories_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_code_key UNIQUE (code);


--
-- TOC entry 5060 (class 2606 OID 17098)
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5062 (class 2606 OID 17100)
-- Name: production_orders production_orders_order_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_orders
    ADD CONSTRAINT production_orders_order_code_key UNIQUE (order_code);


--
-- TOC entry 5064 (class 2606 OID 17102)
-- Name: production_orders production_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_orders
    ADD CONSTRAINT production_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 5066 (class 2606 OID 17104)
-- Name: products products_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_code_key UNIQUE (code);


--
-- TOC entry 5068 (class 2606 OID 17106)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 5070 (class 2606 OID 17108)
-- Name: purchase_request_items purchase_request_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_request_items
    ADD CONSTRAINT purchase_request_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5072 (class 2606 OID 17110)
-- Name: purchase_requests purchase_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 5074 (class 2606 OID 17112)
-- Name: purchase_requests purchase_requests_request_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_request_code_key UNIQUE (request_code);


--
-- TOC entry 5108 (class 2606 OID 24958)
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- TOC entry 5076 (class 2606 OID 17114)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5106 (class 2606 OID 24936)
-- Name: stock_check_items stock_check_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_check_items
    ADD CONSTRAINT stock_check_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5104 (class 2606 OID 24922)
-- Name: stock_check stock_check_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_check
    ADD CONSTRAINT stock_check_pkey PRIMARY KEY (id);


--
-- TOC entry 5078 (class 2606 OID 17116)
-- Name: suppliers suppliers_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_code_key UNIQUE (code);


--
-- TOC entry 5080 (class 2606 OID 17118)
-- Name: suppliers suppliers_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_email_unique UNIQUE (email);


--
-- TOC entry 5082 (class 2606 OID 17120)
-- Name: suppliers suppliers_phone_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_phone_unique UNIQUE (phone);


--
-- TOC entry 5084 (class 2606 OID 17122)
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- TOC entry 5086 (class 2606 OID 17124)
-- Name: unit_conversions unit_conversions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_conversions
    ADD CONSTRAINT unit_conversions_pkey PRIMARY KEY (id);


--
-- TOC entry 5088 (class 2606 OID 17126)
-- Name: unit_conversions unit_conversions_product_from_to_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_conversions
    ADD CONSTRAINT unit_conversions_product_from_to_unique UNIQUE (product_id, from_unit_id, to_unit_id);


--
-- TOC entry 5090 (class 2606 OID 17128)
-- Name: units units_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_code_key UNIQUE (code);


--
-- TOC entry 5092 (class 2606 OID 17130)
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- TOC entry 5094 (class 2606 OID 17132)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5096 (class 2606 OID 17134)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5098 (class 2606 OID 17136)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 5100 (class 2606 OID 17138)
-- Name: warehouses warehouses_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_code_key UNIQUE (code);


--
-- TOC entry 5102 (class 2606 OID 17140)
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- TOC entry 5111 (class 2606 OID 17141)
-- Name: customers customers_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5112 (class 2606 OID 17146)
-- Name: customers customers_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5155 (class 2606 OID 24977)
-- Name: inventory inventory_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id);


--
-- TOC entry 5156 (class 2606 OID 24982)
-- Name: inventory inventory_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- TOC entry 5113 (class 2606 OID 17151)
-- Name: material_request_items material_request_items_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_request_items
    ADD CONSTRAINT material_request_items_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON DELETE SET NULL;


--
-- TOC entry 5114 (class 2606 OID 17156)
-- Name: material_request_items material_request_items_material_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_request_items
    ADD CONSTRAINT material_request_items_material_request_id_fkey FOREIGN KEY (material_request_id) REFERENCES public.material_requests(id) ON DELETE CASCADE;


--
-- TOC entry 5115 (class 2606 OID 17161)
-- Name: material_request_items material_request_items_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_request_items
    ADD CONSTRAINT material_request_items_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE SET NULL;


--
-- TOC entry 5116 (class 2606 OID 17166)
-- Name: material_requests material_requests_production_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_requests
    ADD CONSTRAINT material_requests_production_order_id_fkey FOREIGN KEY (production_order_id) REFERENCES public.production_orders(id) ON DELETE SET NULL;


--
-- TOC entry 5117 (class 2606 OID 17171)
-- Name: material_requests material_requests_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_requests
    ADD CONSTRAINT material_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5118 (class 2606 OID 17176)
-- Name: materials materials_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id) ON DELETE SET NULL;


--
-- TOC entry 5119 (class 2606 OID 17181)
-- Name: materials materials_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL;


--
-- TOC entry 5120 (class 2606 OID 17186)
-- Name: materials materials_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materials
    ADD CONSTRAINT materials_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE SET NULL;


--
-- TOC entry 5121 (class 2606 OID 17191)
-- Name: order_approval order_approval_approver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_approval
    ADD CONSTRAINT order_approval_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5122 (class 2606 OID 17196)
-- Name: order_approval order_approval_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_approval
    ADD CONSTRAINT order_approval_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 5123 (class 2606 OID 17201)
-- Name: order_delivery order_delivery_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_delivery
    ADD CONSTRAINT order_delivery_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 5124 (class 2606 OID 17206)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 5125 (class 2606 OID 17211)
-- Name: order_payment order_payment_bank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_payment
    ADD CONSTRAINT order_payment_bank_id_fkey FOREIGN KEY (bank_id) REFERENCES public.banks(id) ON DELETE SET NULL;


--
-- TOC entry 5126 (class 2606 OID 17216)
-- Name: order_payment order_payment_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_payment
    ADD CONSTRAINT order_payment_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 5127 (class 2606 OID 17221)
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE SET NULL;


--
-- TOC entry 5128 (class 2606 OID 17226)
-- Name: production_orders production_orders_approver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_orders
    ADD CONSTRAINT production_orders_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5129 (class 2606 OID 17231)
-- Name: production_orders production_orders_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_orders
    ADD CONSTRAINT production_orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- TOC entry 5130 (class 2606 OID 17236)
-- Name: production_orders production_orders_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.production_orders
    ADD CONSTRAINT production_orders_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5131 (class 2606 OID 17241)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id);


--
-- TOC entry 5132 (class 2606 OID 17246)
-- Name: products products_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- TOC entry 5133 (class 2606 OID 17251)
-- Name: products products_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- TOC entry 5134 (class 2606 OID 17256)
-- Name: purchase_request_items purchase_request_items_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_request_items
    ADD CONSTRAINT purchase_request_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5135 (class 2606 OID 17261)
-- Name: purchase_request_items purchase_request_items_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_request_items
    ADD CONSTRAINT purchase_request_items_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id) ON DELETE SET NULL;


--
-- TOC entry 5136 (class 2606 OID 17266)
-- Name: purchase_request_items purchase_request_items_purchase_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_request_items
    ADD CONSTRAINT purchase_request_items_purchase_request_id_fkey FOREIGN KEY (purchase_request_id) REFERENCES public.purchase_requests(id) ON DELETE CASCADE;


--
-- TOC entry 5137 (class 2606 OID 17271)
-- Name: purchase_request_items purchase_request_items_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_request_items
    ADD CONSTRAINT purchase_request_items_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE SET NULL;


--
-- TOC entry 5138 (class 2606 OID 17276)
-- Name: purchase_requests purchase_requests_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5139 (class 2606 OID 17281)
-- Name: purchase_requests purchase_requests_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5140 (class 2606 OID 17286)
-- Name: purchase_requests purchase_requests_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_requests
    ADD CONSTRAINT purchase_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5152 (class 2606 OID 24959)
-- Name: requests requests_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- TOC entry 5153 (class 2606 OID 24964)
-- Name: requests requests_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id);


--
-- TOC entry 5154 (class 2606 OID 24987)
-- Name: requests requests_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- TOC entry 5150 (class 2606 OID 24942)
-- Name: stock_check_items stock_check_items_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_check_items
    ADD CONSTRAINT stock_check_items_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id);


--
-- TOC entry 5151 (class 2606 OID 24937)
-- Name: stock_check_items stock_check_items_stock_check_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_check_items
    ADD CONSTRAINT stock_check_items_stock_check_id_fkey FOREIGN KEY (stock_check_id) REFERENCES public.stock_check(id) ON DELETE CASCADE;


--
-- TOC entry 5149 (class 2606 OID 24923)
-- Name: stock_check stock_check_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_check
    ADD CONSTRAINT stock_check_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- TOC entry 5141 (class 2606 OID 17291)
-- Name: suppliers suppliers_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- TOC entry 5142 (class 2606 OID 17296)
-- Name: unit_conversions unit_conversions_from_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_conversions
    ADD CONSTRAINT unit_conversions_from_unit_id_fkey FOREIGN KEY (from_unit_id) REFERENCES public.units(id);


--
-- TOC entry 5143 (class 2606 OID 17301)
-- Name: unit_conversions unit_conversions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_conversions
    ADD CONSTRAINT unit_conversions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 5144 (class 2606 OID 17306)
-- Name: unit_conversions unit_conversions_to_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_conversions
    ADD CONSTRAINT unit_conversions_to_unit_id_fkey FOREIGN KEY (to_unit_id) REFERENCES public.units(id);


--
-- TOC entry 5145 (class 2606 OID 17311)
-- Name: users users_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- TOC entry 5146 (class 2606 OID 17316)
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE SET NULL;


--
-- TOC entry 5147 (class 2606 OID 17321)
-- Name: warehouses warehouses_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5148 (class 2606 OID 17326)
-- Name: warehouses warehouses_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.warehouses(id) ON DELETE SET NULL;


-- Completed on 2025-05-23 01:12:16

--
-- PostgreSQL database dump complete
--

