--
-- PostgreSQL database cluster dump
--

\restrict PQdSRsrUqBHX6CefYAOY7VPLlr7O68ZkOBqWHu9XhdK1rz2CmPc0FVactylfzEO

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE bars_management;




--
-- Drop roles
--

DROP ROLE admin_boss;


--
-- Roles
--

CREATE ROLE admin_boss;
ALTER ROLE admin_boss WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:8FQXVdxPRrPdWcC0YJo2fQ==$kSrmDdLQ7iEmzncA6s0W5hIOJrHU84zNbMShY1d/ZlA=:EDZKNgsvFKXTKInx1lXseSg1pSWg2AELAOofYYrenWQ=';

--
-- User Configurations
--








\unrestrict PQdSRsrUqBHX6CefYAOY7VPLlr7O68ZkOBqWHu9XhdK1rz2CmPc0FVactylfzEO

--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

\restrict DdxmXZ4bkpEuSWA8wkuefnaNqdq3qfWZ9vmlYdNnmd07iJloqValOWFgkKyxnWW

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

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
-- Name: template1; Type: DATABASE; Schema: -; Owner: admin_boss
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO admin_boss;

\unrestrict DdxmXZ4bkpEuSWA8wkuefnaNqdq3qfWZ9vmlYdNnmd07iJloqValOWFgkKyxnWW
\connect template1
\restrict DdxmXZ4bkpEuSWA8wkuefnaNqdq3qfWZ9vmlYdNnmd07iJloqValOWFgkKyxnWW

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
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: admin_boss
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: admin_boss
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\unrestrict DdxmXZ4bkpEuSWA8wkuefnaNqdq3qfWZ9vmlYdNnmd07iJloqValOWFgkKyxnWW
\connect template1
\restrict DdxmXZ4bkpEuSWA8wkuefnaNqdq3qfWZ9vmlYdNnmd07iJloqValOWFgkKyxnWW

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
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: admin_boss
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict DdxmXZ4bkpEuSWA8wkuefnaNqdq3qfWZ9vmlYdNnmd07iJloqValOWFgkKyxnWW

--
-- Database "bars_management" dump
--

--
-- PostgreSQL database dump
--

\restrict OitegYLle3d7VflSVZTFilNFlj7jXUKgmzWDmsiilYAHQ9QKMXt5gTLXzzpJaTr

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

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
-- Name: bars_management; Type: DATABASE; Schema: -; Owner: admin_boss
--

CREATE DATABASE bars_management WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE bars_management OWNER TO admin_boss;

\unrestrict OitegYLle3d7VflSVZTFilNFlj7jXUKgmzWDmsiilYAHQ9QKMXt5gTLXzzpJaTr
\connect bars_management
\restrict OitegYLle3d7VflSVZTFilNFlj7jXUKgmzWDmsiilYAHQ9QKMXt5gTLXzzpJaTr

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
-- PostgreSQL database dump complete
--

\unrestrict OitegYLle3d7VflSVZTFilNFlj7jXUKgmzWDmsiilYAHQ9QKMXt5gTLXzzpJaTr

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

\restrict q1T4zwgH2pkwblKjyB7ZH0cmyaG92qQoOhSs3wKBeilGeGCsaxFjLOxwJfAhc3j

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 15.17 (Debian 15.17-1.pgdg13+1)

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
-- Name: postgres; Type: DATABASE; Schema: -; Owner: admin_boss
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO admin_boss;

\unrestrict q1T4zwgH2pkwblKjyB7ZH0cmyaG92qQoOhSs3wKBeilGeGCsaxFjLOxwJfAhc3j
\connect postgres
\restrict q1T4zwgH2pkwblKjyB7ZH0cmyaG92qQoOhSs3wKBeilGeGCsaxFjLOxwJfAhc3j

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
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: admin_boss
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bars; Type: TABLE; Schema: public; Owner: admin_boss
--

CREATE TABLE public.bars (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    primary_color text DEFAULT '#1a1a1a'::text,
    logo_url text,
    created_at timestamp with time zone DEFAULT now(),
    logo_url_light text
);


ALTER TABLE public.bars OWNER TO admin_boss;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: admin_boss
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bar_id uuid,
    name text NOT NULL,
    display_order integer DEFAULT 0
);


ALTER TABLE public.categories OWNER TO admin_boss;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: admin_boss
--

CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid,
    product_id uuid,
    quantity integer NOT NULL,
    price_at_time numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    served_at timestamp without time zone
);


ALTER TABLE public.order_items OWNER TO admin_boss;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: admin_boss
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bar_id uuid,
    table_id uuid,
    total_amount numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending_approval'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_paid boolean DEFAULT false,
    items jsonb DEFAULT '[]'::jsonb NOT NULL,
    payment_method character varying(50),
    session_token uuid,
    personal_token uuid,
    placed_by_staff boolean DEFAULT false,
    closed_at timestamp without time zone
);


ALTER TABLE public.orders OWNER TO admin_boss;

--
-- Name: products; Type: TABLE; Schema: public; Owner: admin_boss
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_id uuid,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    is_available boolean DEFAULT true,
    image_url text
);


ALTER TABLE public.products OWNER TO admin_boss;

--
-- Name: requests; Type: TABLE; Schema: public; Owner: admin_boss
--

CREATE TABLE public.requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bar_id uuid NOT NULL,
    table_id uuid NOT NULL,
    session_token character varying(255),
    type character varying(50) NOT NULL,
    payment_method character varying(20),
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.requests OWNER TO admin_boss;

--
-- Name: tables; Type: TABLE; Schema: public; Owner: admin_boss
--

CREATE TABLE public.tables (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bar_id uuid,
    table_number integer NOT NULL,
    current_session_token uuid,
    status character varying(20) DEFAULT 'closed'::character varying,
    merged_into_id uuid,
    session_started_at timestamp with time zone,
    zone_id uuid
);


ALTER TABLE public.tables OWNER TO admin_boss;

--
-- Name: users; Type: TABLE; Schema: public; Owner: admin_boss
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    bar_id uuid,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO admin_boss;

--
-- Name: zones; Type: TABLE; Schema: public; Owner: admin_boss
--

CREATE TABLE public.zones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bar_id uuid,
    name character varying(255) NOT NULL,
    list_order integer DEFAULT 0
);


ALTER TABLE public.zones OWNER TO admin_boss;

--
-- Data for Name: bars; Type: TABLE DATA; Schema: public; Owner: admin_boss
--

COPY public.bars (id, name, slug, primary_color, logo_url, created_at, logo_url_light) FROM stdin;
9f691ec8-003f-47b4-8dd7-c76fbe00154e	La Bossulica Pub	la-bossulica	#E63946	\N	2026-03-21 17:29:17.629006+00	\N
fc578e91-cf0c-44ca-ba12-55d8e057d023	Test Pub	test-pub	#000000	\N	2026-03-21 17:40:57.525438+00	\N
6be69425-875d-46d2-851e-71a875e62025	Test Bar	test-bar	#a04040	\N	2026-03-21 17:45:00.479738+00	\N
d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	bar2	bar2	#ff4500	\N	2026-03-31 11:44:39.222092+00	\N
a54f07a8-39d3-459b-8acd-9914fcdfb43f	bar2_plm	bar2plm	#ff4500	\N	2026-03-31 11:49:51.539566+00	\N
563ab86b-2265-4465-976f-6678096ce70e	Somm Wine & Cheese	somm-wine-cheese	#f1eee9	https://res.cloudinary.com/djoiq4tho/image/upload/v1775632183/light_ttqnyd.png	2026-04-08 07:13:53.458492+00	https://res.cloudinary.com/djoiq4tho/image/upload/v1775632061/dark_vvxqlf.png
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: admin_boss
--

COPY public.categories (id, bar_id, name, display_order) FROM stdin;
a558d86f-0bb2-4331-adc9-f2a91b14266f	9f691ec8-003f-47b4-8dd7-c76fbe00154e	Beri Reci	0
76481eb8-6f61-46bb-80a7-101cd6a4a7a3	fc578e91-cf0c-44ca-ba12-55d8e057d023	Băuturi	0
1086a426-50e9-4c17-bd88-d83801493051	6be69425-875d-46d2-851e-71a875e62025	Bere draught	0
1f8969f6-6a38-433d-8e73-f3ac6bcb72b4	6be69425-875d-46d2-851e-71a875e62025	VIn	0
af6b77cf-20ee-47c8-ab5e-ff0ef6e07813	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	bere	0
95548502-a8e8-4c9b-be8e-43bc432ce791	a54f07a8-39d3-459b-8acd-9914fcdfb43f	bere	0
7b4b533d-d925-422d-83e5-043c23c284d6	6be69425-875d-46d2-851e-71a875e62025	Mancare	0
dea80ef8-b080-44d2-a57e-efffbf67500c	6be69425-875d-46d2-851e-71a875e62025	test	0
98276b5c-7145-4549-af3a-1cd3b6f842ec	563ab86b-2265-4465-976f-6678096ce70e	ȘAMPANIE, SPUMANTE ȘI PROSECCO	0
e7111669-38dd-4a1e-aea9-23fa6339df7a	563ab86b-2265-4465-976f-6678096ce70e	VIN ROȘU	0
f93683e5-27ad-4c20-8125-ee4f6108ea4a	563ab86b-2265-4465-976f-6678096ce70e	COCKTAILS	0
081c578a-df15-42da-808e-a21c20a1842e	563ab86b-2265-4465-976f-6678096ce70e	SPIRTOASE	0
d9f4ebc5-d672-4987-ba67-124fee573e45	563ab86b-2265-4465-976f-6678096ce70e	SUC ȘI APĂ	0
050a1cd2-2cbe-42ba-976c-84e9fcef2fbb	563ab86b-2265-4465-976f-6678096ce70e	BERE	0
400fbc04-6c1f-476e-ada2-15953d54b549	563ab86b-2265-4465-976f-6678096ce70e	VIN ALB	0
8469b8e4-09f9-4f0d-9372-647c3611877c	563ab86b-2265-4465-976f-6678096ce70e	VINURI ROZE	0
591c193d-67af-4fc9-8023-4ad215cff8cf	563ab86b-2265-4465-976f-6678096ce70e	Mâncare	0
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: admin_boss
--

COPY public.order_items (id, order_id, product_id, quantity, price_at_time, status, served_at) FROM stdin;
2f9ffc49-e638-48e0-aeb8-af3fa04ec37e	ae934b5d-ad31-4404-9e2f-72eaa629c752	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
34ec8be5-9d34-4cfd-98c3-971f6696b3dc	f8c5665d-6a21-4874-904c-105648b860fc	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
9f5c97e8-16d0-4ba9-894f-b08455b13856	7b92a09f-6d96-4c5f-8cd7-74c55bc068b0	26d92cf2-aa2c-4cdd-8b75-675813686b42	1	20.00	served	\N
6af7695b-d98e-4469-9919-3c49fe9f2157	64a9e1d1-3a72-4a8b-9c7d-0eb394612ac4	9c2c9a4c-fcff-44cd-b970-b4f675959514	1	30.00	served	\N
66ad784a-4531-4972-a57c-3d33323f8b1c	ac2c1d41-5ecf-41a1-9c41-79bb2043a4c8	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
d5db621b-a284-403b-b319-81a65fc438e6	a405e844-412e-476b-973b-a8d83ed3c8df	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
19d5796f-3e81-47fb-b3f4-d7075d03a04e	8d0d0de8-c77c-4ba6-a5aa-b54be6b436ba	ada8853d-2dd1-496f-98ef-0afdbf652dfa	4	15.00	served	\N
3eda6afb-1c29-4932-bb25-8c28f2cc1e82	11001b6b-c718-49b4-a5e9-fe887f4e34ce	744121b2-4bca-427c-8772-fb42c2655c04	3	10.00	served	\N
632361da-454b-4555-b627-a18884d73f6a	b0a1cd3f-1777-4fef-8a25-8d083b757b4a	26d92cf2-aa2c-4cdd-8b75-675813686b42	2	20.00	served	\N
f6adb315-1e60-48aa-a247-9d726d61d265	9035d591-5c86-4c24-8f76-bdbd37f83e2e	744121b2-4bca-427c-8772-fb42c2655c04	4	10.00	served	\N
7d2a53a3-02ff-4aae-aec1-4602d74f8227	9035d591-5c86-4c24-8f76-bdbd37f83e2e	9c2c9a4c-fcff-44cd-b970-b4f675959514	1	30.00	served	\N
af8be4d1-01fb-49b0-a0d7-e2cd96d3445a	aedeb843-e761-47c1-91ba-56cd0e2999ca	ada8853d-2dd1-496f-98ef-0afdbf652dfa	2	15.00	served	\N
8e983d3b-decd-49f5-9954-6b94f0a245a9	17535537-d174-4d43-bc01-d57d7152bc50	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
94bcb08a-49a6-451c-8277-f581f576cbbc	76459a95-cf17-4cb0-99f3-d27767972a72	26d92cf2-aa2c-4cdd-8b75-675813686b42	4	20.00	served	\N
f641335f-95fc-426a-9371-d8ea13876bf9	904c2a7b-a00a-421c-ad72-cb80786debe8	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
0b5af2ef-b1cc-44a1-88e6-a1b6b7ee5e54	78072d6e-2301-4eab-a11d-3387e72f8963	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
977498e3-adf3-4370-a1a2-a62314d752e8	e9ea2670-9731-46c3-9136-99fa774de74e	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
5441ca99-c773-42a7-873e-f7cf2adf2f01	a7f936c1-b0ee-4bba-9640-c104be928e34	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
9e8ec23f-7023-4972-ab83-0eac9cb34468	bca49811-9afd-4771-9461-73b90ee58b41	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
50034f98-6e3c-46d3-b9b7-0c780f580d91	a087ee3d-4780-465e-b30b-cfbe8d8c8cfd	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
8ebcd177-b1ed-4bd9-ae75-29e735517c47	eb481572-fd80-4165-90a2-521e2cfadf63	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
43fdd571-1260-4cc5-956a-ab31eb7ee954	5513e259-63f5-4944-ba5a-18c48fb61397	744121b2-4bca-427c-8772-fb42c2655c04	4	10.00	served	\N
76fbf6d6-564b-4aa3-b240-d0f8b8f919bf	96c9fdbc-bd26-4970-957c-27fa8cdb4d08	744121b2-4bca-427c-8772-fb42c2655c04	4	10.00	served	\N
00b161d5-7bc5-4930-8d84-209034e20766	35934c3b-f6c8-4fea-925e-47916c2b1dc7	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
d88640ef-8689-4985-9723-0eef8225e612	ce233490-792d-4711-b261-a384a4603f73	ada8853d-2dd1-496f-98ef-0afdbf652dfa	2	15.00	served	\N
610b7cc2-d233-4117-b6b7-14be8b8635cb	a0e065cc-6782-4654-bbb0-46136f62bb58	26d92cf2-aa2c-4cdd-8b75-675813686b42	1	20.00	served	\N
275fe138-8a70-4246-908c-bd07f67b1757	bd13c439-138d-4079-94e7-ac183fdf8076	9c2c9a4c-fcff-44cd-b970-b4f675959514	2	30.00	served	\N
0a9137f3-66bb-47a3-837d-07a747129397	aa2b81b4-8a83-4490-be26-703ed22204dc	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
4f6afa53-1489-48e4-962a-a7dfbfb3ecf4	a3c8b24c-b771-474b-9319-e782f4f27792	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
51bfccc5-375c-44e1-9943-99b4e1de6a7e	85f7fb4c-9ce6-4777-a69e-036dd8db119f	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
c9779bac-9912-4600-aa2c-e966ab5a4e0d	eb7d725c-4c8d-4f36-bf02-7ab38cb62d9c	744121b2-4bca-427c-8772-fb42c2655c04	4	10.00	served	\N
05937a1a-4481-4d84-801b-ca5c64df76e7	57aa2e82-6249-4fdb-af7f-a4fc42b14e1f	744121b2-4bca-427c-8772-fb42c2655c04	3	10.00	served	\N
4a6a4f44-3ea3-49e5-841e-e0e2d3b1cb3f	57aa2e82-6249-4fdb-af7f-a4fc42b14e1f	ada8853d-2dd1-496f-98ef-0afdbf652dfa	3	15.00	served	\N
493158fc-7f29-4cbe-97cd-4d15d00ef9c3	066935e9-0bb3-40e1-bd74-9ec6444d492c	9c2c9a4c-fcff-44cd-b970-b4f675959514	1	30.00	served	\N
1c4ec881-f7a0-4521-9564-2e356f99d231	1388144c-f0c8-4015-bc97-019e2a9f33a0	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
987d71b2-20e6-4156-96e1-4497c61714d7	3391afee-86d7-4e5c-b368-26f9c8372019	744121b2-4bca-427c-8772-fb42c2655c04	29	10.00	served	\N
23c02410-76b7-471c-950a-125516e14c13	93ef3404-aff1-4c68-bbad-084e45e6aa7c	26d92cf2-aa2c-4cdd-8b75-675813686b42	1	20.00	served	\N
99b34ae4-da89-4a4e-9b1f-55911697cf72	9c32d473-b5f2-4131-bf99-336e313fb111	9c2c9a4c-fcff-44cd-b970-b4f675959514	1	30.00	served	\N
7f5f4a20-cea5-447f-950c-a7c45a2b3c57	5536b362-93c1-438d-b906-347f9177cfca	63be279b-6ee8-4043-87d1-3613c013fa2f	1	12.20	served	\N
12c48819-a36d-4a89-a3f7-a4790b6052e8	1b9dd7c2-1330-4df1-b834-d42d2e79caa9	63be279b-6ee8-4043-87d1-3613c013fa2f	4	12.20	served	\N
e02a7974-8787-4fd6-ac41-eae20bd47447	a2848ccb-fd9a-4828-aa09-b54a0714742a	63be279b-6ee8-4043-87d1-3613c013fa2f	3	12.20	served	\N
6575199e-9ae2-46fc-a4c7-75ff28621837	faf7868b-cc38-4915-b953-21115d709cbb	744121b2-4bca-427c-8772-fb42c2655c04	3	10.00	served	\N
7571f62a-1d38-49ac-84cd-aa725943b3b5	b00d6e47-4b5e-4daa-835c-7cef4ad991e4	744121b2-4bca-427c-8772-fb42c2655c04	4	10.00	served	\N
6dcb771d-0732-45d0-829d-e078e044c600	a913016e-3059-43be-8358-926ab4bf7133	744121b2-4bca-427c-8772-fb42c2655c04	3	10.00	served	\N
b9122729-45ab-4a77-ae0d-6211593407cc	09dec8a0-e9a6-476e-abbf-3e437d9eb12e	744121b2-4bca-427c-8772-fb42c2655c04	3	10.00	served	\N
de2e2bf8-4356-4fb6-9876-785e044a8d44	6f1be7df-9f1a-4ced-8097-f62da4beeed4	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
4cbbc304-c2f3-40d0-9720-9ac5180611c8	6f1be7df-9f1a-4ced-8097-f62da4beeed4	ada8853d-2dd1-496f-98ef-0afdbf652dfa	2	15.00	served	\N
267a2ba4-3903-4461-9e83-b9d787a9e29e	8dc2a11c-82d8-4160-bb4b-c4ff072fd172	26d92cf2-aa2c-4cdd-8b75-675813686b42	2	20.00	served	\N
ef9df02d-d1a5-47f8-ab09-6cd219fcbcb5	8dc2a11c-82d8-4160-bb4b-c4ff072fd172	9c2c9a4c-fcff-44cd-b970-b4f675959514	1	30.00	served	\N
8d190f1c-70db-492c-b16c-72e4a8885a69	3d4ef723-9379-4c18-a906-b1bf09636c68	ada8853d-2dd1-496f-98ef-0afdbf652dfa	2	15.00	served	\N
7bf26dc0-145a-4144-8982-f2b5dc6f96bf	3d4ef723-9379-4c18-a906-b1bf09636c68	be0d45f1-a1ea-4805-b82d-41ae8886404b	1	100.00	served	\N
495cdb31-1e0a-4a49-a943-ae0567bdbcca	daee7073-dac9-4f41-955b-e684335eb2a1	744121b2-4bca-427c-8772-fb42c2655c04	5	10.00	served	\N
d94e925b-fa47-44bd-94e8-7f93f7344d4c	5c66ae14-51e2-4c82-9c89-405566665a31	744121b2-4bca-427c-8772-fb42c2655c04	3	10.00	served	\N
91d4f7c2-4595-4ee6-aae3-7b110cbe1662	53aa223f-a3a9-403e-92dd-3bdd3fbfa7e2	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
34e0b4e6-0cdf-47d1-929a-18977a1c556f	78329e0a-e8af-4607-a181-579dd4be1952	744121b2-4bca-427c-8772-fb42c2655c04	3	10.00	served	\N
3ef4a7b4-92a8-4bef-9c34-1f781a6582bf	36c53550-54d2-4a62-a092-b9f725b10deb	744121b2-4bca-427c-8772-fb42c2655c04	3	10.00	served	\N
1847c3d3-772a-470c-8173-f889f816a7cb	e3ff65ef-28ca-461f-bb80-2d82d836a85d	744121b2-4bca-427c-8772-fb42c2655c04	4	10.00	served	\N
a73b1d10-d288-4d8e-a6b6-4a834f7059e9	b39042ee-6c52-4f84-aa04-54868328c8fa	ada8853d-2dd1-496f-98ef-0afdbf652dfa	3	15.00	served	\N
4c058593-a45d-412a-a1bf-489d3dd386ff	1a51a35b-2d19-4464-9d46-089bb7ba49ae	be0d45f1-a1ea-4805-b82d-41ae8886404b	1	100.00	served	\N
eccb1c67-2071-4880-ab09-dfceff332a73	631ec4cd-d8c7-4982-b033-f7536ad4bddb	744121b2-4bca-427c-8772-fb42c2655c04	3	10.00	served	\N
28067a71-0aae-4deb-9c55-b7ad54d582d1	c81369a7-a537-4647-a57f-937dcd39ddc7	ada8853d-2dd1-496f-98ef-0afdbf652dfa	4	15.00	served	\N
43cfbc48-27cc-4a48-bb61-0e4bfc38bcbe	ce8b2fb1-01a7-492e-b56f-be68c88377bd	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
c2703012-db4b-409f-8398-1a79373398bb	5674f13c-ba7e-485f-b63c-813be2cdf88f	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
e8045ac6-a956-4bcf-9e51-89a91a64b3fc	0fae3400-e7eb-431e-a838-368829182562	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
1171c1fa-8eb8-4152-ba2c-812c930e5743	0b07bd78-9396-4e16-9ffd-1fe95935f080	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
767befd4-6a9b-4d5a-8c2f-ec76b0763c59	71e809c0-3727-49d1-82c3-032efd0b6802	744121b2-4bca-427c-8772-fb42c2655c04	5	10.00	served	\N
b03540cf-de4d-4426-a947-da3f010d71f3	f6709db7-04f4-4470-a380-76ac6c3dbf62	26d92cf2-aa2c-4cdd-8b75-675813686b42	1	20.00	served	\N
d7b5021f-bd28-437b-bcef-d8f3a37bd6b8	08fc624e-ed51-41d9-83f6-24291c449ec3	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
45ec8961-0b1e-4ace-b9ab-51e774ff610c	dbe47d59-fe4b-49ee-9554-5e4818087fad	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
747145a0-c83c-4082-be35-ab90c91c0ef4	4db5a80e-9cd3-4805-a761-eee245506e32	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
c14ef07e-c027-4298-8be5-49ff3a419887	d277aebe-d2e1-48e5-a49e-8420c6de26e4	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
a26845cc-c8f6-44d5-b4a1-edaf491ab42f	56d492b1-832c-47e2-927d-562773127fcb	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
ff46923f-611e-4c86-bbf6-65e13c8220ff	77ddb9c3-3f48-4d50-981a-af64a83762cc	744121b2-4bca-427c-8772-fb42c2655c04	4	10.00	served	\N
cf79c897-7df7-4579-857a-8b595d3265aa	03278287-fd66-4f00-bd5f-cfdbb5d59c89	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
15a6c9d7-bdfd-49ce-8b50-f57e748d9b10	96880871-aa1a-45e9-8177-cdec25d549e7	be0d45f1-a1ea-4805-b82d-41ae8886404b	3	100.00	served	\N
1419a63c-c31c-4460-8ee7-94fc2113115e	078855d3-b90f-444f-9fce-dd0d89a1a64f	744121b2-4bca-427c-8772-fb42c2655c04	3	10.00	served	\N
27ede8ae-38a4-4e76-9ba9-978863d1f1d7	fa523e9a-b7d5-4ff5-8323-4bf2bc339775	744121b2-4bca-427c-8772-fb42c2655c04	3	10.00	served	\N
c2ead783-f060-4f8a-9520-2da00712bb95	53c6c8e9-72f8-4017-8502-4f0d81d0bf78	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
7e2b5b61-238e-489a-83da-c4e242b9fe08	9baa9882-1f51-49de-be83-61e392e20965	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
493d11a7-00c6-41d8-8015-1ddd4f60a00c	e2433dbe-1b4d-49ad-a724-fb3bfac34ccd	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
a2edee0e-47ce-44cf-8162-a7df2307c3eb	56f2428e-d1d2-4967-9ec6-ec9d09c1226b	0041856c-ecd8-495c-8a7b-24fb9d5358a4	3	30.00	served	\N
89a8b915-6670-4e9c-ab79-d7d09fa4ee15	f667079f-2864-48a1-a218-3ee996b61f06	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
224e7649-cb65-47c1-bbdc-b6ac56debbba	96acd4df-2d8e-41f3-8bce-66d0aaaeef28	0041856c-ecd8-495c-8a7b-24fb9d5358a4	1	30.00	served	\N
6ec3039c-04f1-459b-b0e0-038ecaf9625f	d8b2bbb7-c9af-4de5-abd1-6861d2f5e46c	0041856c-ecd8-495c-8a7b-24fb9d5358a4	1	30.00	served	\N
517f65c6-c242-40ac-8ef5-c54c76cb0422	d8b2bbb7-c9af-4de5-abd1-6861d2f5e46c	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
626b3be0-24ca-4fa4-b3bf-a70b8fe3e9aa	0266e6c2-da00-4e36-b3e5-524e6af0be51	26d92cf2-aa2c-4cdd-8b75-675813686b42	6	20.00	served	\N
a9fbe729-de8d-4652-b8ef-2246cea52071	830d2def-2859-4490-b45a-4ff71ac17172	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
04389bc2-cb99-4306-ad6f-ba11e4fdd3ee	830d2def-2859-4490-b45a-4ff71ac17172	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
7c4b1d86-44c9-4474-94d4-aa31550cc12b	52825f3e-b0c8-4a46-9ed3-eb7bded9e739	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
229fae96-1c74-4f40-a674-7e2e5a3613cf	11ea3f1e-b4cb-41b4-a651-f9406e860c9f	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
38dd1a43-e967-4d58-b5c5-f3de0972b672	792304cf-7e33-4cac-995a-0c5e4cc7a063	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
767d3529-bc0a-4891-8674-32a702dfbfea	cae8c276-d3ed-4043-9e93-03b5a28977a0	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
5e98f4cc-94d3-405d-8f67-705bec21588c	190bb666-e566-4c14-b6b5-09058d577c0a	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
11216f90-5d9b-4c69-b78e-65b02becc02c	4b8b7c7f-7727-44f6-9bd9-3e43d84d817a	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
9689bc47-3050-496e-928a-165b479534c4	bb312204-fea4-4e7f-a2bb-d3dfa0347e0d	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
0bab62a1-eca5-46b9-a5dc-ca00851b29f8	18e21b40-f60b-456e-85df-d65b78c17dd9	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
9a4d66a7-4598-4e63-a327-db6faa75f102	c25cfee9-269c-4de7-bf98-a02b40808699	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
6a4df5f4-d152-4ea6-a80b-7a66e577cb68	374eb66a-89c0-4577-8f6d-b6501d6433cf	ada8853d-2dd1-496f-98ef-0afdbf652dfa	6	15.00	served	\N
a8835e3f-791b-4dc6-8ab7-a7896e4e5605	3f732648-2d21-459d-a928-6d38d98aa342	0041856c-ecd8-495c-8a7b-24fb9d5358a4	1	30.00	served	\N
b9e7afae-4a1b-4e3b-baa5-e77b854e6e62	4169c59a-4216-4f13-963b-924eeedeb900	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
38f86604-80bc-4a84-831a-395558219070	fbdcfdfd-270b-453c-8ac2-a3e350e18a48	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
48e3f7db-9d39-4a71-a728-0c82b6e33cf4	3522d4e6-8045-485d-a447-2068aca2a632	744121b2-4bca-427c-8772-fb42c2655c04	4	10.00	served	\N
f4d24500-038c-40a7-a6b5-392ede13812e	6b7d2a21-a110-4b62-8b6e-6c24f36fb291	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
8166b84a-fb7f-4d21-96b1-fd4d7aad09bd	9bcf8621-2fe6-4c35-9f7f-8fbc2324c5e7	744121b2-4bca-427c-8772-fb42c2655c04	7	10.00	served	\N
2a55bc9f-4e95-4c02-b850-9f630fb9ebcb	54d602c9-0a47-4d76-8cc2-4c07cbfde661	744121b2-4bca-427c-8772-fb42c2655c04	4	10.00	served	\N
b3e13ddf-4ae8-4d16-8f4a-b4b8e325c37d	1608218b-a8a0-4603-aa7e-93dfd0b1f335	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
519286a4-8fd7-45e6-856d-e0db84c6bcdf	544c17f8-0f63-4ba8-8f55-3374245993bd	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
7979d4d4-afed-446e-a798-cb348be0908d	f873d185-1ab5-4397-878b-4ddfd3a23852	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
fd388e6a-cd44-48f7-a52f-e7d1dc6528ef	1ea022a6-c9be-4910-826e-cf64c071111c	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
4f5e0296-a1af-4e77-9397-8ed0f21e62e5	2a9739e6-12e6-423c-b3fe-e5798834278b	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
04169f0c-2221-4ba4-885e-5d783de6c8ba	04cd7de7-7e3a-42ee-88b4-0bb9e3e69204	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
62376751-4a76-4d09-871d-ec3b82e923f8	b67b6033-685a-406a-a78a-1a8f421f7c70	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
268c2335-211b-46fe-b8a0-13ff99c821a4	8ff8caa7-d056-48c0-9551-2b7324bd22a7	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
8f2dd522-547a-442a-b689-8c13e80aa50a	def64442-c645-4cc6-8d24-2748bae41032	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
25b773db-9a66-45cc-8afd-ca5b4108319d	0683388a-d87d-4db4-ac9f-884f63deea63	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
1e2f616e-9fa3-4944-b7dd-8b309033ecbf	272f4705-3624-4ab1-b107-d321cee6ede7	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
1118dea5-f0e1-46db-a0e6-a15d412893c8	cd640009-86cc-4e77-a738-ce4d2287ba69	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
e790a2c6-6678-40f4-bcaf-bb0d339169f9	184db9ba-398e-4961-a662-bba1c45a9c19	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
e8f553c8-97d4-4243-93db-adbf1e7c1a17	2a871624-9445-4fd4-beb8-6b35a17c43b2	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
0a37c433-86a2-498f-9822-1041b0eb40e1	87d3af82-8f0d-4fd3-84ec-63d2f3bead6b	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
159d7d15-297e-4e1a-95be-354297bb9a66	b55ed94a-6fa1-4425-a873-8dd980f45d27	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
62ee7510-a4c3-4d2d-aee9-eb4858a9c5d9	4e4dac90-f7b6-4ba4-add3-68479aeebe51	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
d54ecb5d-7cb4-4f02-9684-a708634cacd8	4b2330ba-5f5a-4041-9682-5008daa47cce	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
57452deb-3a0c-425e-8022-c6190c8b1df4	e53e06bd-ef20-4f41-beb0-9cef96fc6ca9	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
f6393942-77da-4625-bb8d-8c1d0c45ad21	e26c832c-b3dc-4cfc-8d19-8920f37b899f	744121b2-4bca-427c-8772-fb42c2655c04	2	10.00	served	\N
6b7efa72-a202-400b-ad0b-268dde113e5d	d6fbd092-e9ef-4eee-bdd5-293e20aaf27f	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
828581bb-2cc6-4696-b9a3-3414e98a9923	260b9c2f-dfb2-459b-bef3-34ba101a541a	744121b2-4bca-427c-8772-fb42c2655c04	4	10.00	served	\N
a1a818b3-cdb8-4fee-a3ec-18e17f71656b	6f71f186-59a1-4dab-8fa2-0a76cc34f564	d77380d2-a9a7-49bb-afa5-ad2b2e4c5033	1	65.00	served	\N
3748fd33-70f6-4392-9378-83b0f3d7db08	36339db7-9c7f-474f-882e-82116a3d2bcb	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
cb92931d-55f0-4122-98d4-29a0ec079130	60bf5ce8-f3ff-42e8-9823-40477b679148	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
ae3dee00-80c9-4396-933c-6bdee27bceee	782c3802-783e-4f7d-bdbb-76d756ff9a13	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
933cf5ef-4b7d-448c-9a95-2ac7903b119e	0eadb8b4-79ef-4043-bb82-5bcd61ff7d54	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
c857b1d9-aa95-4dac-84a6-7343d8e8a1b8	2cc019e4-0c91-4ae6-b745-6ca0fd1c570c	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
4b400573-681e-4805-84ee-20aa1242a720	fbc27ded-f1aa-49ae-8e5e-f2aa74cc67e9	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
0c33b3ab-d7e7-4d79-8801-39d90052c006	406d02e6-7d90-41b3-8f31-68264b6c37eb	26d92cf2-aa2c-4cdd-8b75-675813686b42	1	20.00	served	\N
69461afc-21bd-49d2-8f9a-9d20d895ad75	dd40616d-bd86-46e9-9043-96a21b7db259	744121b2-4bca-427c-8772-fb42c2655c04	1	10.00	served	\N
311d5a35-bb21-4948-a75e-ac627b0d38c1	f2ad75f3-4567-4859-abec-a63fd72e2aac	ada8853d-2dd1-496f-98ef-0afdbf652dfa	1	15.00	served	\N
77e45b50-368b-4f1b-b698-4164d92f978c	2f9c154a-98e1-443a-857f-c66d6a0f2597	\N	1	100.00	served	\N
38f0d299-b2d8-4615-9ddf-871b1029747d	6f71f186-59a1-4dab-8fa2-0a76cc34f564	62a68295-6293-4df0-8e35-fa7193fc071b	1	32.00	served	\N
627db07d-dfe6-4c3e-8950-12cfba7b14e0	b28ca289-0f14-4779-bd24-158502c697c1	\N	1	100.00	served	\N
cc396b5a-9aa2-4b18-bd0c-a1a3de178e5b	6f71f186-59a1-4dab-8fa2-0a76cc34f564	c4ee4ede-71d9-4e09-991e-cd49b4b14213	1	30.00	served	\N
0e364de7-7748-4cd3-8472-e4f7cad69538	2ad0d4ca-6a3c-4777-94e7-fe5855549d26	\N	3	100.00	served	\N
e0e72461-f052-4189-bc26-c101deb327f7	6f71f186-59a1-4dab-8fa2-0a76cc34f564	2accffe2-6bc4-4def-97bf-ccbf216754a2	2	120.00	served	\N
6e5804ea-5e9b-4d83-9b07-047c6b611c22	6f71f186-59a1-4dab-8fa2-0a76cc34f564	8fed930c-ae7c-4488-9551-610e1190f8a0	1	175.00	served	\N
12c161f1-cd0f-45e9-8b98-9f10ab74a889	6f71f186-59a1-4dab-8fa2-0a76cc34f564	4a72d098-5562-4ff9-af1c-d8f547a3607a	1	20.00	served	\N
4246bc13-6498-43c3-af90-df63e00e0eda	6f71f186-59a1-4dab-8fa2-0a76cc34f564	c01a6c75-c84e-4dfa-8196-57785d26b9ea	1	18.00	served	\N
00717d57-07d4-47f5-bb31-8157b5b41dde	6f71f186-59a1-4dab-8fa2-0a76cc34f564	d7cbfa50-c562-4993-92be-177255b19675	1	15.00	served	\N
98ed5f84-6052-4466-a733-c25982046bb1	11fcbf18-b183-4cb0-ba15-6cc7f402d89b	2c0fca42-614a-445c-a199-c9013c54bd2c	1	200.00	served	\N
9e07cdcb-2195-4e22-aeac-f0560fb3278c	06a8f016-4998-4f47-bf27-93061976f324	99f87882-50db-40ba-b93b-0d4cde27d046	1	80.00	served	\N
90e7c222-04a1-4b29-a243-85a77c95a7ff	8a7a1249-8891-4984-9f77-4459ba5cc63c	f0561938-84db-4730-9bb7-32484069337e	2	25.00	served	\N
cfe91f7e-717d-4e67-8a55-cc6b04511991	6f71f186-59a1-4dab-8fa2-0a76cc34f564	35b683dd-23be-41ae-8226-3187dd5c8f99	1	20.00	served	\N
3445d350-0219-44e0-bff9-4ce8bfe48806	6cbce574-ff7f-4c9a-8d6b-b17987fc3dae	2c0fca42-614a-445c-a199-c9013c54bd2c	1	200.00	served	\N
1eb90dad-cd78-46d7-90ff-9784b944956e	df86a903-e821-44ed-916e-1187bc379edd	2c0fca42-614a-445c-a199-c9013c54bd2c	1	200.00	served	\N
a717a51d-bf8b-4e1d-a69f-129d8a083b46	8238ebf8-9ff0-4e34-97d8-be1b2433ee90	38943710-1b4a-43b9-a9db-9f0767629e8c	1	75.00	served	\N
faf28534-9727-4bc0-bee3-02465317da50	aa52fc03-cd2e-4d1d-baca-2ed2046b1472	2c0fca42-614a-445c-a199-c9013c54bd2c	1	200.00	served	\N
fa206a8f-533b-443c-aa8a-08c702d809e3	1290d8e8-83c6-4835-a65b-ce3293c4a4fe	2c0fca42-614a-445c-a199-c9013c54bd2c	1	200.00	served	\N
37696a28-0bfe-46c5-983f-833072b4fc29	4474aa4a-4336-4728-8fb6-84daef2245e2	62a68295-6293-4df0-8e35-fa7193fc071b	1	32.00	served	\N
2cfea3d8-9bf9-4903-858b-c7321dadddf2	4bcd08cf-40b9-4502-9a30-96cfecb0fae0	2c0fca42-614a-445c-a199-c9013c54bd2c	1	200.00	served	\N
abf53467-5ad4-47b4-be40-cd0c543f3a18	06993fe1-08de-4a5c-a7bf-889eb7df357a	6542371f-ee02-48fd-be76-32309d7da25c	1	220.00	served	\N
53a4f045-839a-49ff-940d-11d1bba43849	ee75dcd5-7aef-4b7c-80a7-ccb4c6672ea5	f4aeee34-d054-4b5a-92f6-f4e8f2d55d25	1	200.00	served	\N
0d37371c-ccf7-43a7-a14d-35091c3ccbae	431cc038-ad68-46d9-9414-29d2d0cb21d1	2c0fca42-614a-445c-a199-c9013c54bd2c	1	200.00	served	\N
d6f36ae4-baf3-4245-a618-d98d6b73f0d3	39cbc19e-7335-48df-a8dc-6e6e84228637	2c0fca42-614a-445c-a199-c9013c54bd2c	5	200.00	served	\N
1b143a72-b1c6-4201-8f63-3573198c9891	7e5562d0-b694-438b-8dc8-7700f879e0af	2c0fca42-614a-445c-a199-c9013c54bd2c	1	200.00	served	\N
789a2318-4ebc-41cc-8830-7cbcc1a03502	2b0b4005-272b-426e-ad42-20f8363b45f4	2c0fca42-614a-445c-a199-c9013c54bd2c	1	200.00	served	\N
bd5da08a-19f5-4586-9cec-80c20e6be187	f148ab07-1119-4a63-aef7-8b0d25fbbc16	2c0fca42-614a-445c-a199-c9013c54bd2c	1	200.00	served	\N
c92bc3c1-e3cb-4898-8cca-ead24ae1de9d	0b655ab0-7c2f-4012-bb0e-db99e21e270e	9fb7c63c-7bef-4f54-a714-0ac014533015	1	25.00	served	\N
2528a024-f861-41da-b305-f926c1fec392	692c8530-2871-4e65-b3ef-736d4c485fdb	c4ee4ede-71d9-4e09-991e-cd49b4b14213	1	30.00	served	\N
b303a419-6ff8-48c8-bd3d-edba7f9dde5a	e7331f85-53be-4fc9-88bf-b125edda6a97	9f812a22-1219-4a72-9457-0d08d3b01008	1	15.00	served	\N
1ca422ac-6e81-4190-a8b5-90ae51003244	08bf7f2b-196c-4e2a-b349-78c27819c0d5	2c0fca42-614a-445c-a199-c9013c54bd2c	1	200.00	served	2026-04-11 06:52:15.865897
f3c3da63-d8a8-4daa-a011-5272be239795	6e171e9e-7c32-4296-99fb-1368398a620e	c4ee4ede-71d9-4e09-991e-cd49b4b14213	1	30.00	served	2026-04-11 06:52:54.0802
af19684b-0d6d-4b39-9d65-f475a468e635	5a7576de-90fd-4ce1-93f7-8fbf72996291	2c0fca42-614a-445c-a199-c9013c54bd2c	2	200.00	served	2026-04-11 07:09:42.145141
80d5309d-45c4-44d6-b35c-8c0cbcae1368	f907b7d4-0938-4fc8-8191-938249e6a976	2c0fca42-614a-445c-a199-c9013c54bd2c	1	200.00	served	2026-04-11 07:10:19.351628
efffb64f-61d5-4e6e-a8ae-2df0d6012f00	f907b7d4-0938-4fc8-8191-938249e6a976	6542371f-ee02-48fd-be76-32309d7da25c	1	220.00	served	2026-04-11 07:10:19.981633
07bf9f7c-d11f-4cd4-b200-340123ca1347	548e51e5-7a9c-4776-ad45-e8441f90166b	c4ee4ede-71d9-4e09-991e-cd49b4b14213	1	30.00	served	2026-04-11 07:10:33.851211
59071a0b-a944-4f11-9210-302fae7a45eb	09550a9d-e45f-4995-a4be-f22379f030f9	0a50f934-994f-4eda-8432-4442069676ee	1	35.00	served	2026-04-11 07:10:45.899156
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: admin_boss
--

COPY public.orders (id, bar_id, table_id, total_amount, status, created_at, is_paid, items, payment_method, session_token, personal_token, placed_by_staff, closed_at) FROM stdin;
0b07bd78-9396-4e16-9ffd-1fe95935f080	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-01 15:51:23.547749	t	[]	\N	\N	\N	f	\N
dbe47d59-fe4b-49ee-9554-5e4818087fad	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	15.00	confirmed	2026-04-01 15:58:26.278122	t	[]	\N	\N	\N	f	\N
4db5a80e-9cd3-4805-a761-eee245506e32	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-01 15:58:51.166968	t	[]	\N	\N	\N	f	\N
9bcf8621-2fe6-4c35-9f7f-8fbc2324c5e7	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	70.00	confirmed	2026-04-03 10:30:03.031352	t	[]	cash	\N	\N	f	\N
631ec4cd-d8c7-4982-b033-f7536ad4bddb	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-04-01 15:49:09.704555	t	[]	\N	\N	\N	f	\N
ce233490-792d-4711-b261-a384a4603f73	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-03-25 17:14:11.931745	t	[]	\N	\N	\N	f	\N
a0e065cc-6782-4654-bbb0-46136f62bb58	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-03-25 17:14:31.181059	t	[]	\N	\N	\N	f	\N
bd13c439-138d-4079-94e7-ac183fdf8076	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	60.00	confirmed	2026-03-25 17:15:23.335597	t	[]	\N	\N	\N	f	\N
ac2c1d41-5ecf-41a1-9c41-79bb2043a4c8	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-03-25 12:13:15.844206	t	[]	\N	\N	\N	f	\N
a405e844-412e-476b-973b-a8d83ed3c8df	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-03-25 12:18:37.198004	t	[]	\N	\N	\N	f	\N
aa2b81b4-8a83-4490-be26-703ed22204dc	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-03-25 17:15:43.797321	t	[]	\N	\N	\N	f	\N
8d0d0de8-c77c-4ba6-a5aa-b54be6b436ba	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	60.00	confirmed	2026-03-25 12:32:19.937935	t	[]	\N	\N	\N	f	\N
96c9fdbc-bd26-4970-957c-27fa8cdb4d08	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	40.00	confirmed	2026-03-25 17:13:27.36248	t	[]	\N	\N	\N	f	\N
77ddb9c3-3f48-4d50-981a-af64a83762cc	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	40.00	confirmed	2026-04-01 16:04:57.096459	t	[]	\N	\N	\N	f	\N
03278287-fd66-4f00-bd5f-cfdbb5d59c89	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-01 16:05:04.939055	t	[]	\N	\N	\N	f	\N
11001b6b-c718-49b4-a5e9-fe887f4e34ce	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-03-25 12:42:17.406684	t	[]	\N	\N	\N	f	\N
b0a1cd3f-1777-4fef-8a25-8d083b757b4a	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	40.00	confirmed	2026-03-25 12:42:26.437895	t	[]	\N	\N	\N	f	\N
35934c3b-f6c8-4fea-925e-47916c2b1dc7	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	15.00	confirmed	2026-03-25 17:13:40.497935	t	[]	\N	\N	\N	f	\N
9035d591-5c86-4c24-8f76-bdbd37f83e2e	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	70.00	confirmed	2026-03-25 12:44:05.319801	t	[]	\N	\N	\N	f	\N
96880871-aa1a-45e9-8177-cdec25d549e7	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	300.00	confirmed	2026-04-01 16:05:26.93132	t	[]	\N	\N	\N	f	\N
aedeb843-e761-47c1-91ba-56cd0e2999ca	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-03-25 12:44:23.347065	t	[]	\N	\N	\N	f	\N
dd40616d-bd86-46e9-9043-96a21b7db259	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-06 18:02:58.804681	t	[]	card	6d511bf5-6fb1-44a6-b8a7-f3a3686861d8	faf27884-3dd3-4af9-9894-91dbad6310f4	f	\N
17535537-d174-4d43-bc01-d57d7152bc50	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	15.00	confirmed	2026-03-25 12:45:27.46159	t	[]	\N	\N	\N	f	\N
e2433dbe-1b4d-49ad-a724-fb3bfac34ccd	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-02 08:54:17.905984	t	[]	\N	\N	\N	f	\N
544c17f8-0f63-4ba8-8f55-3374245993bd	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-04 09:02:57.327559	t	[]	cash	\N	\N	f	\N
96acd4df-2d8e-41f3-8bce-66d0aaaeef28	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-04-02 10:06:48.782607	t	[]	\N	\N	\N	f	\N
76459a95-cf17-4cb0-99f3-d27767972a72	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	80.00	confirmed	2026-03-25 13:17:45.339351	t	[]	\N	\N	\N	f	\N
904c2a7b-a00a-421c-ad72-cb80786debe8	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-03-25 13:22:03.01023	t	[]	\N	\N	\N	f	\N
830d2def-2859-4490-b45a-4ff71ac17172	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	25.00	confirmed	2026-04-02 13:54:23.220368	t	[]	\N	\N	\N	f	\N
792304cf-7e33-4cac-995a-0c5e4cc7a063	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-02 19:35:17.030758	t	[]	\N	\N	\N	f	\N
2a9739e6-12e6-423c-b3fe-e5798834278b	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:07:29.437125	t	[]	cash	\N	\N	f	\N
4b8b7c7f-7727-44f6-9bd9-3e43d84d817a	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-02 19:55:28.267917	t	[]	\N	\N	\N	f	\N
c25cfee9-269c-4de7-bf98-a02b40808699	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	15.00	confirmed	2026-04-02 20:41:12.708537	t	[]	\N	\N	\N	f	\N
374eb66a-89c0-4577-8f6d-b6501d6433cf	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	90.00	confirmed	2026-04-02 20:41:57.031291	t	[]	\N	\N	\N	f	\N
3f732648-2d21-459d-a928-6d38d98aa342	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-04-02 20:42:09.378397	t	[]	\N	\N	\N	f	\N
3522d4e6-8045-485d-a447-2068aca2a632	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	40.00	confirmed	2026-04-03 10:24:22.446984	t	[]	cash	\N	\N	f	\N
6f71f186-59a1-4dab-8fa2-0a76cc34f564	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	615.00	confirmed	2026-04-08 11:45:14.333723	t	[]	card	\N	b34865d6-3ad7-4727-bae2-a8c04e9d3440	f	\N
def64442-c645-4cc6-8d24-2748bae41032	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:27:47.57863	t	[]	card	\N	\N	f	\N
116696bf-4ed3-4772-a037-685cfbaabc83	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 08:11:13.291075	t	[]	cash	\N	3ece1b7a-551a-4060-91bd-da8050f8f74c	f	\N
184db9ba-398e-4961-a662-bba1c45a9c19	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:38:14.004714	t	[]	cash	\N	\N	f	\N
87d3af82-8f0d-4fd3-84ec-63d2f3bead6b	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:40:50.953347	t	[]	card	\N	\N	f	\N
4b2330ba-5f5a-4041-9682-5008daa47cce	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-06 15:12:27.764968	t	[]	card	\N	\N	f	\N
70108236-6bac-462e-b1b5-382c58e066bd	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 08:13:57.970388	t	[]	cash	afae8e2a-ebe0-4d51-9060-aa9e68c4df30	11fb6165-f516-4b77-bfd8-3cf31511bec8	f	\N
d6fbd092-e9ef-4eee-bdd5-293e20aaf27f	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-06 16:00:52.155994	t	[]	card	\N	\N	f	\N
2ad0d4ca-6a3c-4777-94e7-fe5855549d26	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	300.00	confirmed	2026-04-08 08:14:14.195631	t	[]	cash	afae8e2a-ebe0-4d51-9060-aa9e68c4df30	\N	f	\N
60bf5ce8-f3ff-42e8-9823-40477b679148	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-06 17:52:16.680925	t	[]	cash	e48963a0-17ec-467a-8b95-5099709fbae6	\N	f	\N
2cc019e4-0c91-4ae6-b745-6ca0fd1c570c	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	15.00	confirmed	2026-04-06 17:55:02.327314	t	[]	card	b2744942-40a4-45a6-96c7-a493e467d910	\N	f	\N
8238ebf8-9ff0-4e34-97d8-be1b2433ee90	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	75.00	confirmed	2026-04-08 11:50:07.998843	t	[]	card	799cdb6c-4105-4d42-9606-70a49a5f9912	\N	t	\N
da9c2be5-b6f3-4949-ae56-8fad7a6d9f94	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 08:20:06.526245	t	[]	card	9c843328-bce9-47f5-a65c-e4e47b7437dc	11fb6165-f516-4b77-bfd8-3cf31511bec8	f	\N
f0235879-436e-4ec1-a0ce-3f984e2dc387	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 08:28:53.502554	t	[]	card	3aa8a5c5-2737-4593-bd11-ea9a358b1139	\N	t	\N
bc6ad8d6-a79e-4ffb-8256-1e675b115f4c	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 10:12:21.324133	t	[]	cash	01b5a369-7a60-4828-a84f-43b82c57bfdf	\N	t	\N
1290d8e8-83c6-4835-a65b-ce3293c4a4fe	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	200.00	confirmed	2026-04-08 14:29:02.954827	t	[]	card	\N	c47904eb-05e5-40d0-8a99-09dc90647874	f	\N
5a7576de-90fd-4ce1-93f7-8fbf72996291	563ab86b-2265-4465-976f-6678096ce70e	504b37cc-3b1c-4533-bcbc-9260c71c43f2	400.00	confirmed	2026-04-11 07:09:34.963578	t	[]	cash	49224285-c9d6-488d-975b-79657ad235f6	01ff17a5-b2fe-4fee-a18d-fbcee90e1dd4	f	2026-04-11 07:10:52.209406
08bf7f2b-196c-4e2a-b349-78c27819c0d5	563ab86b-2265-4465-976f-6678096ce70e	504b37cc-3b1c-4533-bcbc-9260c71c43f2	200.00	confirmed	2026-04-11 06:52:07.150109	t	[]	card	02e0dda4-55bf-4330-bd86-2818fb1650d9	01ff17a5-b2fe-4fee-a18d-fbcee90e1dd4	f	2026-04-11 06:53:11.09204
06993fe1-08de-4a5c-a7bf-889eb7df357a	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	220.00	confirmed	2026-04-08 14:34:36.486951	t	[]	cash	\N	3ece1b7a-551a-4060-91bd-da8050f8f74c	f	\N
f907b7d4-0938-4fc8-8191-938249e6a976	563ab86b-2265-4465-976f-6678096ce70e	504b37cc-3b1c-4533-bcbc-9260c71c43f2	420.00	confirmed	2026-04-11 07:10:12.661779	t	[]	cash	7cd4858a-5640-4778-80eb-6d52e5881cd5	01ff17a5-b2fe-4fee-a18d-fbcee90e1dd4	f	2026-04-11 07:10:52.209406
0fae3400-e7eb-431e-a838-368829182562	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-01 15:50:24.865154	t	[]	\N	\N	\N	f	\N
6b7d2a21-a110-4b62-8b6e-6c24f36fb291	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-03 10:28:30.732382	t	[]	cash	\N	\N	f	\N
71e809c0-3727-49d1-82c3-032efd0b6802	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	50.00	confirmed	2026-04-01 15:57:53.479792	t	[]	\N	\N	\N	f	\N
d277aebe-d2e1-48e5-a49e-8420c6de26e4	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-01 15:59:39.415382	t	[]	\N	\N	\N	f	\N
fa523e9a-b7d5-4ff5-8323-4bf2bc339775	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-04-01 16:06:36.621082	t	[]	\N	\N	\N	f	\N
c81369a7-a537-4647-a57f-937dcd39ddc7	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	60.00	confirmed	2026-04-01 15:49:25.680491	t	[]	\N	\N	\N	f	\N
078855d3-b90f-444f-9fce-dd0d89a1a64f	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-04-01 16:06:24.692027	t	[]	\N	\N	\N	f	\N
54d602c9-0a47-4d76-8cc2-4c07cbfde661	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	40.00	confirmed	2026-04-04 07:40:34.646577	t	[]	cash	\N	\N	f	\N
78072d6e-2301-4eab-a11d-3387e72f8963	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-03-25 15:45:04.010552	t	[]	\N	\N	\N	f	\N
e9ea2670-9731-46c3-9136-99fa774de74e	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-03-25 15:45:54.609298	t	[]	\N	\N	\N	f	\N
a7f936c1-b0ee-4bba-9640-c104be928e34	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-03-25 15:48:31.581883	t	[]	\N	\N	\N	f	\N
bca49811-9afd-4771-9461-73b90ee58b41	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-03-25 15:50:31.365713	t	[]	\N	\N	\N	f	\N
a087ee3d-4780-465e-b30b-cfbe8d8c8cfd	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-03-25 16:22:52.625693	t	[]	\N	\N	\N	f	\N
eb481572-fd80-4165-90a2-521e2cfadf63	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-03-25 16:47:27.810037	t	[]	\N	\N	\N	f	\N
5513e259-63f5-4944-ba5a-18c48fb61397	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	40.00	confirmed	2026-03-25 16:49:22.370196	t	[]	\N	\N	\N	f	\N
faf7868b-cc38-4915-b953-21115d709cbb	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-03-26 10:15:23.008666	t	[]	\N	\N	\N	f	\N
f8c5665d-6a21-4874-904c-105648b860fc	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-03-25 17:16:23.961786	t	[]	\N	\N	\N	f	\N
ae934b5d-ad31-4404-9e2f-72eaa629c752	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-03-25 17:16:29.268451	t	[]	\N	\N	\N	f	\N
85f7fb4c-9ce6-4777-a69e-036dd8db119f	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	15.00	confirmed	2026-03-25 17:19:44.616035	t	[]	\N	\N	\N	f	\N
a3c8b24c-b771-474b-9319-e782f4f27792	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	15.00	confirmed	2026-03-25 17:21:22.653746	t	[]	\N	\N	\N	f	\N
7b92a09f-6d96-4c5f-8cd7-74c55bc068b0	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-03-25 17:24:37.153078	t	[]	\N	\N	\N	f	\N
64a9e1d1-3a72-4a8b-9c7d-0eb394612ac4	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-03-25 17:24:41.612228	t	[]	\N	\N	\N	f	\N
a2848ccb-fd9a-4828-aa09-b54a0714742a	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	36.60	confirmed	2026-03-26 10:13:37.302538	t	[]	\N	\N	\N	f	\N
eb7d725c-4c8d-4f36-bf02-7ab38cb62d9c	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	40.00	confirmed	2026-03-25 18:02:52.564493	t	[]	\N	\N	\N	f	\N
57aa2e82-6249-4fdb-af7f-a4fc42b14e1f	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	75.00	confirmed	2026-03-26 07:25:30.895245	t	[]	\N	\N	\N	f	\N
066935e9-0bb3-40e1-bd74-9ec6444d492c	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-03-26 07:32:27.53796	t	[]	\N	\N	\N	f	\N
b00d6e47-4b5e-4daa-835c-7cef4ad991e4	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	40.00	confirmed	2026-03-27 11:02:08.840425	t	[]	\N	\N	\N	f	\N
1388144c-f0c8-4015-bc97-019e2a9f33a0	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-03-26 07:45:06.041775	t	[]	\N	\N	\N	f	\N
3391afee-86d7-4e5c-b368-26f9c8372019	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	290.00	confirmed	2026-03-26 07:46:56.781449	t	[]	\N	\N	\N	f	\N
93ef3404-aff1-4c68-bbad-084e45e6aa7c	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-03-26 07:47:16.502645	t	[]	\N	\N	\N	f	\N
9c32d473-b5f2-4131-bf99-336e313fb111	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-03-26 07:47:22.234268	t	[]	\N	\N	\N	f	\N
5536b362-93c1-438d-b906-347f9177cfca	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	12.20	confirmed	2026-03-26 09:18:18.698292	t	[]	\N	\N	\N	f	\N
1b9dd7c2-1330-4df1-b834-d42d2e79caa9	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	48.80	confirmed	2026-03-26 09:18:42.887284	t	[]	\N	\N	\N	f	\N
53aa223f-a3a9-403e-92dd-3bdd3fbfa7e2	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-01 07:16:16.174028	t	[]	\N	\N	\N	f	\N
a913016e-3059-43be-8358-926ab4bf7133	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-03-27 11:50:30.766958	t	[]	\N	\N	\N	f	\N
78329e0a-e8af-4607-a181-579dd4be1952	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-04-01 07:39:17.719702	t	[]	\N	\N	\N	f	\N
56f2428e-d1d2-4967-9ec6-ec9d09c1226b	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	90.00	confirmed	2026-04-02 09:58:55.802648	t	[]	\N	\N	\N	f	\N
260b9c2f-dfb2-459b-bef3-34ba101a541a	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	40.00	confirmed	2026-04-06 17:44:28.932686	t	[]	cash	\N	\N	f	\N
d8b2bbb7-c9af-4de5-abd1-6861d2f5e46c	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	50.00	confirmed	2026-04-02 10:24:36.407521	t	[]	\N	\N	\N	f	\N
f873d185-1ab5-4397-878b-4ddfd3a23852	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-04 09:22:12.517249	t	[]	card	\N	\N	f	\N
52825f3e-b0c8-4a46-9ed3-eb7bded9e739	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-02 19:32:43.361892	t	[]	\N	\N	\N	f	\N
cae8c276-d3ed-4043-9e93-03b5a28977a0	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-02 19:43:32.595414	t	[]	\N	\N	\N	f	\N
bb312204-fea4-4e7f-a2bb-d3dfa0347e0d	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-02 20:09:39.000462	t	[]	\N	\N	\N	f	\N
04cd7de7-7e3a-42ee-88b4-0bb9e3e69204	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:19:51.424034	t	[]	cash	\N	\N	f	\N
4169c59a-4216-4f13-963b-924eeedeb900	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-02 20:45:02.823419	t	[]	\N	\N	\N	f	\N
782c3802-783e-4f7d-bdbb-76d756ff9a13	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	15.00	confirmed	2026-04-06 17:52:26.956614	t	[]	cash	30d8c0f3-9e7b-4c79-98c7-81a1f20987ae	\N	f	\N
b67b6033-685a-406a-a78a-1a8f421f7c70	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:20:12.218096	t	[]	cash	\N	\N	f	\N
d698b185-b2aa-4622-a1df-505af0562a0e	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 08:19:02.213056	t	[]	card	9c843328-bce9-47f5-a65c-e4e47b7437dc	11fb6165-f516-4b77-bfd8-3cf31511bec8	f	\N
0683388a-d87d-4db4-ac9f-884f63deea63	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:30:27.12031	t	[]	cash	\N	\N	f	\N
fbc27ded-f1aa-49ae-8e5e-f2aa74cc67e9	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-06 17:56:59.859163	t	[]	cash	b2744942-40a4-45a6-96c7-a493e467d910	\N	f	\N
2a871624-9445-4fd4-beb8-6b35a17c43b2	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:39:56.785892	t	[]	card	\N	\N	f	\N
e53e06bd-ef20-4f41-beb0-9cef96fc6ca9	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-06 15:14:37.088996	t	[]	card	\N	\N	f	\N
f2ad75f3-4567-4859-abec-a63fd72e2aac	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	15.00	confirmed	2026-04-06 18:03:07.208061	t	[]	card	954fc8e5-e2ef-42ee-9ef8-607ea8e06406	d356178e-e239-45b4-b96a-52193757d7fd	f	\N
b28ca289-0f14-4779-bd24-158502c697c1	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 08:11:22.624344	t	[]	cash	becd09f6-0709-4004-87c7-f6147048f7ed	\N	f	\N
6ee58641-bbe1-46cc-9f13-03f98e3abe69	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 08:18:38.844002	t	[]	card	afae8e2a-ebe0-4d51-9060-aa9e68c4df30	11fb6165-f516-4b77-bfd8-3cf31511bec8	f	\N
7b81dadd-0d9e-41bd-aeba-3fffac0641d1	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 08:31:07.216336	t	[]	card	3aa8a5c5-2737-4593-bd11-ea9a358b1139	01ff17a5-b2fe-4fee-a18d-fbcee90e1dd4	f	\N
b6ae685a-402f-4720-b4e1-72424b0e1f55	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 08:24:23.569477	t	[]	card	614534aa-1352-4061-b510-8593fd1a6597	11fb6165-f516-4b77-bfd8-3cf31511bec8	f	\N
6cbce574-ff7f-4c9a-8d6b-b17987fc3dae	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	200.00	confirmed	2026-04-08 11:45:58.697987	t	[]	card	289114b6-8e30-4608-9b2d-54449ea2d090	34febc60-2088-4589-970b-7a732addee8f	f	\N
06a8f016-4998-4f47-bf27-93061976f324	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	80.00	confirmed	2026-04-08 11:28:25.289462	t	[]	card	fcaa35af-6083-4d65-9c13-586a9abcdc1a	\N	t	\N
11fcbf18-b183-4cb0-ba15-6cc7f402d89b	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	200.00	confirmed	2026-04-08 11:27:54.594629	t	[]	card	97c3eee5-16b6-404e-b941-e42f802b2d20	01ff17a5-b2fe-4fee-a18d-fbcee90e1dd4	f	\N
aa52fc03-cd2e-4d1d-baca-2ed2046b1472	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	200.00	confirmed	2026-04-08 11:50:37.674179	t	[]	card	799cdb6c-4105-4d42-9606-70a49a5f9912	34febc60-2088-4589-970b-7a732addee8f	f	\N
4bcd08cf-40b9-4502-9a30-96cfecb0fae0	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	200.00	confirmed	2026-04-08 14:32:41.092114	t	[]	card	fd41b338-2194-4f6d-9188-12e8ed9a8153	2228305c-7d01-4391-aad7-3b4c94214fe0	f	\N
4474aa4a-4336-4728-8fb6-84daef2245e2	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	32.00	confirmed	2026-04-08 14:32:56.772868	t	[]	card	fd41b338-2194-4f6d-9188-12e8ed9a8153	2228305c-7d01-4391-aad7-3b4c94214fe0	f	\N
431cc038-ad68-46d9-9414-29d2d0cb21d1	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	200.00	confirmed	2026-04-08 14:35:07.163881	t	[]	cash	2b6d2027-1c8f-40b1-ad70-afcd8fe9583a	3ece1b7a-551a-4060-91bd-da8050f8f74c	f	\N
f148ab07-1119-4a63-aef7-8b0d25fbbc16	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	200.00	confirmed	2026-04-11 06:17:00.64106	t	[]	card	\N	01ff17a5-b2fe-4fee-a18d-fbcee90e1dd4	f	\N
09dec8a0-e9a6-476e-abbf-3e437d9eb12e	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-03-27 11:56:17.002753	t	[]	\N	\N	\N	f	\N
6f1be7df-9f1a-4ced-8097-f62da4beeed4	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	50.00	confirmed	2026-03-27 13:24:34.207567	t	[]	\N	\N	\N	f	\N
8dc2a11c-82d8-4160-bb4b-c4ff072fd172	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	70.00	confirmed	2026-03-27 13:24:56.260638	t	[]	\N	\N	\N	f	\N
3d4ef723-9379-4c18-a906-b1bf09636c68	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	130.00	confirmed	2026-03-27 13:28:10.486811	t	[]	\N	\N	\N	f	\N
daee7073-dac9-4f41-955b-e684335eb2a1	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	50.00	confirmed	2026-03-28 08:44:41.577288	t	[]	\N	\N	\N	f	\N
36c53550-54d2-4a62-a092-b9f725b10deb	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-04-01 07:41:44.563643	t	[]	\N	\N	\N	f	\N
5c66ae14-51e2-4c82-9c89-405566665a31	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	30.00	confirmed	2026-03-28 08:44:49.524125	t	[]	\N	\N	\N	f	\N
e3ff65ef-28ca-461f-bb80-2d82d836a85d	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	40.00	confirmed	2026-04-01 15:36:34.566056	t	[]	\N	\N	\N	f	\N
b39042ee-6c52-4f84-aa04-54868328c8fa	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	45.00	confirmed	2026-04-01 15:36:39.796948	t	[]	\N	\N	\N	f	\N
1a51a35b-2d19-4464-9d46-089bb7ba49ae	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	100.00	confirmed	2026-04-01 15:43:11.688323	t	[]	\N	\N	\N	f	\N
ce8b2fb1-01a7-492e-b56f-be68c88377bd	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-01 15:50:07.512048	t	[]	\N	\N	\N	f	\N
5674f13c-ba7e-485f-b63c-813be2cdf88f	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-01 15:50:14.043707	t	[]	\N	\N	\N	f	\N
a6156b8e-c68e-484f-a602-10ea1b2d658b	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 08:28:17.810481	t	[]	card	\N	01ff17a5-b2fe-4fee-a18d-fbcee90e1dd4	f	\N
f6709db7-04f4-4470-a380-76ac6c3dbf62	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-01 15:58:06.034679	t	[]	\N	\N	\N	f	\N
08fc624e-ed51-41d9-83f6-24291c449ec3	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-01 15:58:16.042854	t	[]	\N	\N	\N	f	\N
56d492b1-832c-47e2-927d-562773127fcb	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-01 16:04:32.699516	t	[]	\N	\N	\N	f	\N
1608218b-a8a0-4603-aa7e-93dfd0b1f335	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	15.00	confirmed	2026-04-04 07:44:03.58549	t	[]	cash	\N	\N	f	\N
53c6c8e9-72f8-4017-8502-4f0d81d0bf78	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-01 16:10:22.464812	t	[]	\N	\N	\N	f	\N
9baa9882-1f51-49de-be83-61e392e20965	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-01 16:10:30.652041	t	[]	\N	\N	\N	f	\N
f667079f-2864-48a1-a218-3ee996b61f06	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-02 10:02:37.983596	t	[]	\N	\N	\N	f	\N
0266e6c2-da00-4e36-b3e5-524e6af0be51	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	120.00	confirmed	2026-04-02 10:50:34.753553	t	[]	\N	\N	\N	f	\N
11ea3f1e-b4cb-41b4-a651-f9406e860c9f	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	15.00	confirmed	2026-04-02 19:32:54.434333	t	[]	\N	\N	\N	f	\N
1ea022a6-c9be-4910-826e-cf64c071111c	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-04 09:23:04.334247	t	[]	cash	\N	\N	f	\N
190bb666-e566-4c14-b6b5-09058d577c0a	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-02 19:48:53.807432	t	[]	\N	\N	\N	f	\N
18e21b40-f60b-456e-85df-d65b78c17dd9	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-02 20:39:23.793497	t	[]	\N	\N	\N	f	\N
a5b897e1-0391-4ffe-870e-2da8b9399148	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	400.00	confirmed	2026-04-08 08:33:27.001737	t	[]	card	97c3eee5-16b6-404e-b941-e42f802b2d20	11fb6165-f516-4b77-bfd8-3cf31511bec8	f	\N
fbdcfdfd-270b-453c-8ac2-a3e350e18a48	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-03 07:49:40.902871	t	[]	\N	\N	\N	f	\N
8ff8caa7-d056-48c0-9551-2b7324bd22a7	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:26:55.328165	t	[]	cash	\N	\N	f	\N
272f4705-3624-4ab1-b107-d321cee6ede7	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:31:25.403389	t	[]	cash	\N	\N	f	\N
cd640009-86cc-4e77-a738-ce4d2287ba69	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:31:34.384151	t	[]	card	\N	\N	f	\N
8a7a1249-8891-4984-9f77-4459ba5cc63c	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	50.00	confirmed	2026-04-08 11:29:41.001893	t	[]	card	fcaa35af-6083-4d65-9c13-586a9abcdc1a	450256f5-3e30-4641-930f-ed92d2fbf8be	f	\N
b55ed94a-6fa1-4425-a873-8dd980f45d27	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:43:30.678972	t	[]	card	\N	\N	f	\N
4e4dac90-f7b6-4ba4-add3-68479aeebe51	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-05 09:43:46.128315	t	[]	cash	\N	\N	f	\N
2b0b4005-272b-426e-ad42-20f8363b45f4	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	200.00	confirmed	2026-04-08 14:38:38.387085	t	[]	cash	2b6d2027-1c8f-40b1-ad70-afcd8fe9583a	\N	t	\N
e26c832c-b3dc-4cfc-8d19-8920f37b899f	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-06 15:19:47.030177	t	[]	card	\N	\N	f	\N
36339db7-9c7f-474f-882e-82116a3d2bcb	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	15.00	confirmed	2026-04-06 17:47:32.888357	t	[]	cash	\N	\N	f	\N
df86a903-e821-44ed-916e-1187bc379edd	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	200.00	confirmed	2026-04-08 11:49:57.890459	t	[]	card	289114b6-8e30-4608-9b2d-54449ea2d090	b34865d6-3ad7-4727-bae2-a8c04e9d3440	f	\N
0eadb8b4-79ef-4043-bb82-5bcd61ff7d54	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	10.00	confirmed	2026-04-06 17:54:46.63666	t	[]	card	30d8c0f3-9e7b-4c79-98c7-81a1f20987ae	\N	f	\N
406d02e6-7d90-41b3-8f31-68264b6c37eb	6be69425-875d-46d2-851e-71a875e62025	7be2be91-9559-483d-b9e0-c4eedfc2a745	20.00	confirmed	2026-04-06 17:57:13.690476	t	[]	cash	6d511bf5-6fb1-44a6-b8a7-f3a3686861d8	\N	f	\N
2f9c154a-98e1-443a-857f-c66d6a0f2597	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 07:45:24.10033	t	[]	cash	e791305a-cc66-498a-b21e-4ba869f47020	\N	f	\N
9bee5e43-c5c6-47f6-bf78-e023ba0a2306	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 08:13:47.246933	t	[]	cash	\N	11fb6165-f516-4b77-bfd8-3cf31511bec8	f	\N
66b5e4f6-7f1e-42fb-9c26-fd5ab5976d78	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	100.00	confirmed	2026-04-08 08:18:47.966123	t	[]	card	9c843328-bce9-47f5-a65c-e4e47b7437dc	\N	t	\N
ee75dcd5-7aef-4b7c-80a7-ccb4c6672ea5	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	200.00	confirmed	2026-04-08 14:34:29.298968	t	[]	cash	fd41b338-2194-4f6d-9188-12e8ed9a8153	c47904eb-05e5-40d0-8a99-09dc90647874	f	\N
7e5562d0-b694-438b-8dc8-7700f879e0af	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	200.00	confirmed	2026-04-08 14:38:33.529383	t	[]	cash	cb55d1fe-90c5-4326-b204-a21724c03444	\N	t	\N
39cbc19e-7335-48df-a8dc-6e6e84228637	563ab86b-2265-4465-976f-6678096ce70e	64eb6aa0-cf55-46b9-bfbd-1072d23ed656	1000.00	confirmed	2026-04-08 14:38:43.427801	t	[]	cash	39c56cc8-1730-4fb8-8077-39406b6b6137	\N	t	\N
692c8530-2871-4e65-b3ef-736d4c485fdb	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	30.00	confirmed	2026-04-11 06:17:49.453065	t	[]	card	4cf02dc4-012d-40d3-8c64-aa61b326e79f	7bbe4312-b643-43cb-a56d-5fb52d976291	f	\N
e7331f85-53be-4fc9-88bf-b125edda6a97	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	15.00	confirmed	2026-04-11 06:18:03.362495	t	[]	card	4cf02dc4-012d-40d3-8c64-aa61b326e79f	\N	t	\N
0b655ab0-7c2f-4012-bb0e-db99e21e270e	563ab86b-2265-4465-976f-6678096ce70e	451b1def-3b14-42a9-8dfe-ba2ab591d158	25.00	confirmed	2026-04-11 06:17:26.059589	t	[]	card	4cf02dc4-012d-40d3-8c64-aa61b326e79f	7bbe4312-b643-43cb-a56d-5fb52d976291	f	\N
6e171e9e-7c32-4296-99fb-1368398a620e	563ab86b-2265-4465-976f-6678096ce70e	504b37cc-3b1c-4533-bcbc-9260c71c43f2	30.00	confirmed	2026-04-11 06:52:32.300531	t	[]	card	49224285-c9d6-488d-975b-79657ad235f6	01ff17a5-b2fe-4fee-a18d-fbcee90e1dd4	f	2026-04-11 06:53:11.09204
548e51e5-7a9c-4776-ad45-e8441f90166b	563ab86b-2265-4465-976f-6678096ce70e	504b37cc-3b1c-4533-bcbc-9260c71c43f2	30.00	confirmed	2026-04-11 07:10:27.833441	t	[]	cash	7cd4858a-5640-4778-80eb-6d52e5881cd5	01ff17a5-b2fe-4fee-a18d-fbcee90e1dd4	f	2026-04-11 07:10:52.209406
09550a9d-e45f-4995-a4be-f22379f030f9	563ab86b-2265-4465-976f-6678096ce70e	504b37cc-3b1c-4533-bcbc-9260c71c43f2	35.00	confirmed	2026-04-11 07:10:41.466477	t	[]	cash	7cd4858a-5640-4778-80eb-6d52e5881cd5	01ff17a5-b2fe-4fee-a18d-fbcee90e1dd4	f	2026-04-11 07:10:52.209406
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: admin_boss
--

COPY public.products (id, category_id, name, description, price, is_available, image_url) FROM stdin;
dbec1530-54fd-4b7f-9739-b33dc983aff8	76481eb8-6f61-46bb-80a7-101cd6a4a7a3	Apă	Plată/Minereală	10.00	t	\N
63be279b-6ee8-4043-87d1-3613c013fa2f	1086a426-50e9-4c17-bd88-d83801493051	test test	test	12.20	t	\N
455ce166-164c-47b5-8c8a-99ff6dfb9a27	98276b5c-7145-4549-af3a-1cd3b6f842ec	CECILIA B. PROSECCO MILLESIAMATO	Sticlă	120.00	t	\N
753f0871-69cd-4ff0-95b0-8e5707087ceb	98276b5c-7145-4549-af3a-1cd3b6f842ec	ISSA CHARM SPUMANT	Sticlă	110.00	t	\N
be0d45f1-a1ea-4805-b82d-41ae8886404b	1086a426-50e9-4c17-bd88-d83801493051	test 123	limonada	100.00	t	\N
7238f2af-c4db-4ed5-853b-ac270f37eb75	af6b77cf-20ee-47c8-ab5e-ff0ef6e07813	bere	-	10.00	t	\N
2060a3af-b9b4-4244-b5b7-3cb8f27c051a	95548502-a8e8-4c9b-be8e-43bc432ce791	bere	-	10.00	t	\N
0041856c-ecd8-495c-8a7b-24fb9d5358a4	7b4b533d-d925-422d-83e5-043c23c284d6	Burger	Carne de vita chestii trestii	30.00	t	\N
bbbbdec4-e432-4037-a944-5644b766d80c	98276b5c-7145-4549-af3a-1cd3b6f842ec	PIERRE ZERO CHARDONNAY SPARKLING	750ml — Zero alcol	130.00	t	\N
26d92cf2-aa2c-4cdd-8b75-675813686b42	1f8969f6-6a38-433d-8e73-f3ac6bcb72b4	alb	Descriere de test adăugată direct din baza de date ca să vedem cum arată UI-ul nou și dacă taie textul bine pe 2 rânduri.	20.00	t	\N
f4aeee34-d054-4b5a-92f6-f4e8f2d55d25	98276b5c-7145-4549-af3a-1cd3b6f842ec	CARASTELLEC CARASSIA CLASSIC	Sticlă	200.00	t	\N
aeff2e5a-5392-4aca-be36-54656999c2df	dea80ef8-b080-44d2-a57e-efffbf67500c	jmek	200	100.00	t	\N
ada8853d-2dd1-496f-98ef-0afdbf652dfa	1086a426-50e9-4c17-bd88-d83801493051	Heineken	Descriere de test adăugată direct din baza de date ca să vedem cum arată UI-ul nou și dacă taie textul bine pe 2 rânduri.	15.00	t	\N
9c2c9a4c-fcff-44cd-b970-b4f675959514	1f8969f6-6a38-433d-8e73-f3ac6bcb72b4	rosu	Descriere de test adăugată direct din baza de date ca să vedem cum arată UI-ul nou și dacă taie textul bine pe 2 rânduri.	30.00	t	\N
744121b2-4bca-427c-8772-fb42c2655c04	1086a426-50e9-4c17-bd88-d83801493051	Birra	gustul primaverii\n	10.00	t	\N
0c40a3ab-9e51-4c90-a05c-6e141c2f49b2	98276b5c-7145-4549-af3a-1cd3b6f842ec	CHAMPAGNE CHARLES BLANC DE BLANC		570.00	t	\N
3e9bfa88-4240-45ef-98f0-5d33aae2c001	98276b5c-7145-4549-af3a-1cd3b6f842ec	CHAMPAGNE CHARLES BRUT MILLESIME		682.00	t	\N
2faeb678-8055-44cb-9db7-bb4900823372	98276b5c-7145-4549-af3a-1cd3b6f842ec	CHAMPAGNE TAITTINGER BRUT RESERVE		415.00	t	\N
cc2f27cc-776d-4c27-9195-f5e9864efc9c	98276b5c-7145-4549-af3a-1cd3b6f842ec	CHAMPAGNE TAITTINGER PRESTIGE ROSE		512.00	t	\N
6542371f-ee02-48fd-be76-32309d7da25c	98276b5c-7145-4549-af3a-1cd3b6f842ec	CARASTELLEC CARASSIA ROSE		220.00	t	\N
99f87882-50db-40ba-b93b-0d4cde27d046	98276b5c-7145-4549-af3a-1cd3b6f842ec	CARASTELLEC FRIZA ROSE		80.00	t	\N
db400a73-472a-4fec-ba31-48d57fb05410	98276b5c-7145-4549-af3a-1cd3b6f842ec	PROSSECO NINO FRANCO RUSTICO		170.00	t	\N
2c0fca42-614a-445c-a199-c9013c54bd2c	98276b5c-7145-4549-af3a-1cd3b6f842ec	CARASTELLEC CARASSIA BLANC DE BLANCS		200.00	t	https://cdn.beicevrei.ro/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/c/a/carassiablancdeblancs.jpg
7004eca3-f358-45e0-bded-0d2a395c904e	98276b5c-7145-4549-af3a-1cd3b6f842ec	SAN SIMONE IL CONCERTO DOC BRUT		120.00	t	\N
91603e7a-450e-461c-94e2-fc4cdee80dce	98276b5c-7145-4549-af3a-1cd3b6f842ec	VILLA SANDI DOCG BRUT		140.00	t	\N
55fc980d-4a15-4182-b4ff-596ff5e3b267	98276b5c-7145-4549-af3a-1cd3b6f842ec	NINO FRANCO DI SAN FLORIANO		185.00	t	\N
8021e9db-3495-472a-acae-8654a2de7077	98276b5c-7145-4549-af3a-1cd3b6f842ec	MASCHIO MILLESIMATO EXTRA DRY		130.00	t	\N
4a51817e-2b29-45b9-bc46-8f87fa0ce5fd	98276b5c-7145-4549-af3a-1cd3b6f842ec	MASCHIO DEI CAVALIERI MILLESIMATO ROSE		120.00	t	\N
f60e4357-3be1-4103-921f-23ca9099eb7a	e7111669-38dd-4a1e-aea9-23fa6339df7a	BALLA GEZA STONE WINE FETEASCA NEAGRA		165.00	t	\N
ef88f193-fc91-4b29-8dc5-0339b5379b03	e7111669-38dd-4a1e-aea9-23fa6339df7a	CATLEYA PERFECT SIMPLU FETEASCA NEAGRA		105.00	t	\N
3ba026f6-4b50-439c-b972-7e83edc5292a	e7111669-38dd-4a1e-aea9-23fa6339df7a	CATLEYA PERFECT SIMPLU SYRAH		105.00	t	\N
fe082e36-420c-4f3e-857b-b835225b79af	e7111669-38dd-4a1e-aea9-23fa6339df7a	DAVINO FLAMBOYANT		390.00	t	\N
1ec42d82-f1ff-435f-914e-e8151d49111f	e7111669-38dd-4a1e-aea9-23fa6339df7a	LAFITE AMANCAYA		160.00	t	\N
25d9fbfe-d9d2-47f1-adfd-fd34fd836cd4	e7111669-38dd-4a1e-aea9-23fa6339df7a	LAFITE ARUMA		130.00	t	\N
2636525d-faa8-4ea2-8d6c-cdb26f9ec226	e7111669-38dd-4a1e-aea9-23fa6339df7a	ERAZURIZ DON MAXIMIANO		600.00	t	\N
a45be6e7-a897-4a31-9aba-831430e7f650	e7111669-38dd-4a1e-aea9-23fa6339df7a	ERAZURIZ SYRAH LA CUMBRE		550.00	t	\N
f24a8300-afbb-48e2-a91c-8ed31b5523a2	e7111669-38dd-4a1e-aea9-23fa6339df7a	ERAZURIZ VILLA DON MAXIMIANO		310.00	t	\N
d73b1312-fb28-4af4-a5cf-51e143c029fb	f93683e5-27ad-4c20-8125-ee4f6108ea4a	BELINI	prosecco, liq piersică, piersică	30.00	t	\N
f2b1899a-700c-4036-bc35-bf50cbbdcc24	f93683e5-27ad-4c20-8125-ee4f6108ea4a	KIR ROYAL	prosecco, Chambord	30.00	t	\N
40aa79e8-796f-4c76-924b-c6d31bc37f7e	f93683e5-27ad-4c20-8125-ee4f6108ea4a	NEGRONI	Tanqueray, Martini rosso, Campari	35.00	t	\N
fcb7b3a7-9d4e-44ed-8dbd-6ca3f5c33457	f93683e5-27ad-4c20-8125-ee4f6108ea4a	GIN TONIC	Tanqueray, gin, lime, lămâie	30.00	t	\N
d5b1f7ed-554d-487c-b384-27efd4e426fd	f93683e5-27ad-4c20-8125-ee4f6108ea4a	APEROL SPRITZ	Aperol, portocală, prosecco	30.00	t	\N
f93cbecd-df06-4954-b5e5-c71bd34ddecc	f93683e5-27ad-4c20-8125-ee4f6108ea4a	BOBBY’S TONIC	Bobby Gin, Dubble Dutch Tonic	35.00	t	\N
047082ae-0b42-454e-91ee-c17d4f081ec8	081c578a-df15-42da-808e-a21c20a1842e	TEELING WHISKEY SINGLE GRAIN	40 ML	30.00	t	\N
6bac4c26-33dc-4aec-8006-09b00184c731	081c578a-df15-42da-808e-a21c20a1842e	TEELING WHISKEY SINGLE MALT	40 ML	35.00	t	\N
e5c11b05-75ee-452e-84c9-46edec4d2329	081c578a-df15-42da-808e-a21c20a1842e	BUSHMILLS IRISH WHISKEY	40 ML	20.00	t	\N
f0561938-84db-4730-9bb7-32484069337e	081c578a-df15-42da-808e-a21c20a1842e	ROM BUMBU THE ORIGINAL	40 ML	25.00	t	\N
2014be8a-a3c6-42a6-81e4-4f380638aa45	081c578a-df15-42da-808e-a21c20a1842e	GIN BOBBY’S	40 ML	30.00	t	\N
925d97ab-9ae8-4a0e-828a-a1ccb543d27b	081c578a-df15-42da-808e-a21c20a1842e	COGNAC HINE RARE	40 ML	30.00	t	\N
6fee62f8-9551-42ca-816f-d6e6d6448a77	d9f4ebc5-d672-4987-ba67-124fee573e45	GAMA COLA		11.00	t	\N
7444b8d3-976e-4b0f-be8a-9f535278a7b8	d9f4ebc5-d672-4987-ba67-124fee573e45	APĂ PLATĂ	330 ML	9.00	t	\N
48f39938-492d-4009-b060-0b00da8aa8ff	d9f4ebc5-d672-4987-ba67-124fee573e45	APĂ MINERALĂ	330 ML	9.00	t	\N
9f1fd238-9687-4a8b-afe8-aef09fefa9da	d9f4ebc5-d672-4987-ba67-124fee573e45	APĂ PLATĂ	750 ML	15.00	t	\N
c4e43982-dc3d-4171-a6d9-646c774b771f	d9f4ebc5-d672-4987-ba67-124fee573e45	APĂ MINERALĂ	750 ML	15.00	t	\N
0e4e2f03-3b39-437f-ac64-81db4399459b	050a1cd2-2cbe-42ba-976c-84e9fcef2fbb	GUINNESS	500 ML	28.00	t	\N
61db57e3-9ba2-47e4-99c3-4649d7efe2a3	050a1cd2-2cbe-42ba-976c-84e9fcef2fbb	KRONENBOURG BLANC	330 ML	22.00	t	\N
48377197-9513-4f56-bf35-38c449e922d9	050a1cd2-2cbe-42ba-976c-84e9fcef2fbb	WEIHENSTEPHANER WEISSBIER	500 ML	25.00	t	\N
d7cbfa50-c562-4993-92be-177255b19675	050a1cd2-2cbe-42ba-976c-84e9fcef2fbb	BUCUR BLONDA	330 ML	15.00	t	\N
47dbdc63-2aef-44c2-9002-3c39c1353524	050a1cd2-2cbe-42ba-976c-84e9fcef2fbb	OLD RICH PILSNER	330 ML	20.00	t	\N
4a72d098-5562-4ff9-af1c-d8f547a3607a	050a1cd2-2cbe-42ba-976c-84e9fcef2fbb	OLD RICH BRUNA	330 ML	20.00	t	\N
c01a6c75-c84e-4dfa-8196-57785d26b9ea	050a1cd2-2cbe-42ba-976c-84e9fcef2fbb	CORONA EXTRA	330 ML	18.00	t	\N
9f812a22-1219-4a72-9457-0d08d3b01008	050a1cd2-2cbe-42ba-976c-84e9fcef2fbb	CARLSBERG ZERO	330 ML	15.00	t	\N
46ffc6d4-67bd-4c3b-a7eb-5c323e461910	400fbc04-6c1f-476e-ada2-15953d54b549	NACHBIL CHARDONNAY BARRIQUE		115.00	t	\N
d2a2cec3-865c-4180-8aef-8c290b8f2346	400fbc04-6c1f-476e-ada2-15953d54b549	ISSA CHARDONNAY		100.00	t	\N
c8dfe2fb-613f-42d1-b1af-b1cbca315e4a	400fbc04-6c1f-476e-ada2-15953d54b549	CECILIA B. LUGANA		120.00	t	\N
a94b3367-5ad8-4551-bc69-6b1022d50156	400fbc04-6c1f-476e-ada2-15953d54b549	CECILIA B. PINOT GRIGIO		80.00	t	\N
90bfcfa5-58dd-4588-97b8-b8c79f9f1cc5	400fbc04-6c1f-476e-ada2-15953d54b549	ERAZURIZ SAUVIGNON BLANC MAX		125.00	t	\N
b6a90c9f-7ce5-4b65-a065-adb2a3ac697e	400fbc04-6c1f-476e-ada2-15953d54b549	GREYWACKE SAUVIGNON BLANC		190.00	t	\N
d9e75167-edd6-43fd-ab3a-9a5636f0f25a	400fbc04-6c1f-476e-ada2-15953d54b549	DOMAINE BALLOT-MILLOT LES CRIOTS		550.00	t	\N
1a051971-a2c9-462b-bc9b-0958bd5a985d	400fbc04-6c1f-476e-ada2-15953d54b549	DOMAINE BALLOT-MILLOT MEURSAULT		470.00	t	\N
8e12706a-f8f0-45f3-aa7b-8224c98625df	400fbc04-6c1f-476e-ada2-15953d54b549	CHAVY CHOUET BOURGOGNE ALIGOTE		200.00	t	\N
0e000c0b-7f4a-4a66-a304-a65a7949e1b9	400fbc04-6c1f-476e-ada2-15953d54b549	CHAVY CHOUET BOURGOGNE BLANC		230.00	t	\N
57cbc04f-a034-43f1-ac15-409a3c9308bd	400fbc04-6c1f-476e-ada2-15953d54b549	PETIT CHABLIS – DOMAINE COLLET		150.00	t	\N
d0f86fa2-684c-412e-811d-d5cdb6a13690	400fbc04-6c1f-476e-ada2-15953d54b549	FAMILIA SAVU – SAUVIGNON BLANC		95.00	t	\N
a50107d4-d3aa-4f0e-8da7-f552bba5b82e	400fbc04-6c1f-476e-ada2-15953d54b549	FAMILIA SAVU – SPECIAL SELECTION RR-21		122.00	t	\N
ab3af39e-84f3-47cc-b6a2-2b4157dc9dff	400fbc04-6c1f-476e-ada2-15953d54b549	FAMILIA SAVU – SPECIAL SELECTION SB-21		180.00	t	\N
99c3db7e-d4ec-4272-b7c1-22f93b8bc9ff	400fbc04-6c1f-476e-ada2-15953d54b549	LARTIST ALB DE GABI LACUREANU		160.00	t	\N
9b13cb63-42d4-417c-98e0-f232d59515f0	400fbc04-6c1f-476e-ada2-15953d54b549	AVERESTI DIAMOND ZGHIHARA		100.00	t	\N
8482a4d1-6d42-4beb-b341-c34710e471c4	400fbc04-6c1f-476e-ada2-15953d54b549	AVINCIS CRAMPOSIE SELECTIONATA		110.00	t	\N
62691310-d4f6-45cd-903c-fa7078c5c9a0	400fbc04-6c1f-476e-ada2-15953d54b549	JIDVEI ANA CHARDONNAY		150.00	t	\N
acbea624-4335-4337-984a-9f82318b4106	400fbc04-6c1f-476e-ada2-15953d54b549	RECAS SOLO QUINTA		175.00	t	\N
254ca3ce-3408-4a31-a99a-3dea54050584	400fbc04-6c1f-476e-ada2-15953d54b549	VILLA VINEA DIAMANT		140.00	t	\N
f2f9319f-2853-43db-bb6c-4c5251fa2f79	400fbc04-6c1f-476e-ada2-15953d54b549	VILLA VINEA FETEASCA REGALA PREMIUM		75.00	t	\N
3be6b516-46d6-48f1-9e9e-2d15d14252c7	400fbc04-6c1f-476e-ada2-15953d54b549	VILLA VINEA GEWURZTRAMINER		115.00	t	\N
779e0056-86c6-47a7-92d3-d7b3aa2ef55e	400fbc04-6c1f-476e-ada2-15953d54b549	PANDORA SECRETS SERIGRAFIE ALIGOTE		100.00	t	\N
0f80ada0-a4d2-489e-9527-8e263560ad13	400fbc04-6c1f-476e-ada2-15953d54b549	PANDORA SECRETS SERIGRAFIAT CHARDONNAY		100.00	t	\N
3932fc9c-797f-4620-b705-9c77d5b56866	400fbc04-6c1f-476e-ada2-15953d54b549	PANDORA SECRETS SERIGRAFIE SBL		100.00	t	\N
9468d1c6-d5e0-4b3d-ab0e-1e609b17e63e	400fbc04-6c1f-476e-ada2-15953d54b549	JELNA FETEASCA ALBA WILD YEAST		120.00	t	\N
ed959d57-540d-4df2-a831-c50a4e8e9a2e	400fbc04-6c1f-476e-ada2-15953d54b549	JELNA FETEASCA REGALA		90.00	t	\N
a07c0af9-d275-40df-87bb-8ce9d7873ca3	400fbc04-6c1f-476e-ada2-15953d54b549	DRADARA FETEASCA REGALA		100.00	t	\N
8fed930c-ae7c-4488-9551-610e1190f8a0	400fbc04-6c1f-476e-ada2-15953d54b549	CA DEI FRATI LUGANA		175.00	t	\N
eebea7cd-6b31-4782-bbd6-483afaf42241	400fbc04-6c1f-476e-ada2-15953d54b549	DORVENA PINOT GRIS		80.00	t	\N
689b3a35-8b47-49d1-b4f3-ab0f0386c4b6	400fbc04-6c1f-476e-ada2-15953d54b549	DORVENA BIANCO		80.00	t	\N
4b2435c0-fd93-427f-b43c-12288441140d	400fbc04-6c1f-476e-ada2-15953d54b549	NAIV TAMAIOASA ROMANEASCA		100.00	t	\N
7ba644f0-c5fb-4f08-929f-d0d09735d1f6	400fbc04-6c1f-476e-ada2-15953d54b549	GITTON SANCERE		230.00	t	\N
b35e1590-b678-4263-8a9f-c160080ab1c4	400fbc04-6c1f-476e-ada2-15953d54b549	TRAMIN CLASSIC SAUVIGNON BLANC	Sticlă	130.00	t	\N
405642b7-c313-4bee-9636-43909242177b	e7111669-38dd-4a1e-aea9-23fa6339df7a	BALLA EZA STONE WINE FET. NEAGRA & CAB. FRANC	Sticlă	180.00	t	\N
a0db31c5-7b70-4b76-a8c5-bc455b4ae9da	e7111669-38dd-4a1e-aea9-23fa6339df7a	BALLA GEZA STONE WINE CABERNET FRANC	Sticlă	170.00	t	\N
8e4d2c1f-b55b-4d9f-8be9-597b4735557d	400fbc04-6c1f-476e-ada2-15953d54b549	FAMILIA SAVU – TRAMINER ROZ	Sticlă	100.00	t	\N
6e09493d-baa8-4069-bb50-b28ca6f9c4ac	400fbc04-6c1f-476e-ada2-15953d54b549	ISSA RIESLING DE RHIN	Sticlă	100.00	t	\N
6c86d6f5-2cf8-4106-b417-0b123e699843	400fbc04-6c1f-476e-ada2-15953d54b549	ISSA SAUVIGNON BLANC	Sticlă	100.00	t	\N
63641e65-dd02-4a7c-8dce-bd98f5d86f56	400fbc04-6c1f-476e-ada2-15953d54b549	NACHBIL RIESLING DE RHIN	Sticlă	115.00	t	\N
f2aa459e-bcd8-413c-8907-20000d57c593	400fbc04-6c1f-476e-ada2-15953d54b549	TRAMIN T. CUVEE BIANCO	Sticlă	110.00	t	\N
b1e6fa88-36f5-4ef2-b2ae-2825c87ca9c0	e7111669-38dd-4a1e-aea9-23fa6339df7a	NACHBIL SYRAH RESERVE		180.00	f	\N
b22a2f7d-348d-4b3d-841f-85048adf5752	400fbc04-6c1f-476e-ada2-15953d54b549	CHABLIS GUEGUEN		250.00	t	\N
229b9075-ad4f-42c6-8f1b-2a74bf2d576f	400fbc04-6c1f-476e-ada2-15953d54b549	MASTRO GRECO DI TUFO		150.00	t	\N
2c45209a-ec44-4a57-b393-17929b61524e	400fbc04-6c1f-476e-ada2-15953d54b549	FOURNIER CUVEE SAUVIGNON BLANC		140.00	t	\N
02acdc77-6b57-473a-ab1a-a0a9d48ac658	400fbc04-6c1f-476e-ada2-15953d54b549	PAUL MAS VIOGNIER		115.00	t	\N
1c6f85dc-10d9-4f13-ab06-3356d1e08903	400fbc04-6c1f-476e-ada2-15953d54b549	CRAMA MAIER REGINA		125.00	t	\N
db8f7490-443d-4996-96f3-0e2631884f90	400fbc04-6c1f-476e-ada2-15953d54b549	CRAMA MAIER RHINE RIESLING		135.00	t	\N
11adbb6f-2a36-4ad7-a42a-9951377d1ea3	400fbc04-6c1f-476e-ada2-15953d54b549	CRAMA MAIER CUVEE TRANSILVANIA		100.00	t	\N
aebf6b74-dda1-4803-b9e6-873ef7d0770b	8469b8e4-09f9-4f0d-9372-647c3611877c	DAVINO DOMAINE CEPTURA ROSE		150.00	t	\N
d751f36d-ee9e-431d-b383-531c6d92e0a4	8469b8e4-09f9-4f0d-9372-647c3611877c	CABERNET D’ANJOU		100.00	t	\N
f51e55df-ceaf-4bfe-992a-a18544223bc9	8469b8e4-09f9-4f0d-9372-647c3611877c	ROSE D’ANJOU		100.00	t	\N
050cef66-fe12-4e2d-b45c-74c43c567d12	8469b8e4-09f9-4f0d-9372-647c3611877c	DUCHESS OF TRANSYLVANIA ROSE		125.00	t	\N
321c8c04-14fe-47d8-bbf6-b2c06453c41d	8469b8e4-09f9-4f0d-9372-647c3611877c	VALAHORUM ROSE CRAMA TOHANI		90.00	t	\N
6cb89986-edc9-4aff-b6f7-8e8677004c17	8469b8e4-09f9-4f0d-9372-647c3611877c	RECAS SOLO QUINTA ROZE		175.00	t	\N
fbfa6b86-8905-42c5-b391-a700a122c74c	8469b8e4-09f9-4f0d-9372-647c3611877c	GUEISSARD COTE DU PROVONCE		115.00	t	\N
2accffe2-6bc4-4def-97bf-ccbf216754a2	8469b8e4-09f9-4f0d-9372-647c3611877c	AVERESTI DIAMOND BUSUIOACA DD	Sticlă	120.00	t	\N
d233c528-a181-496c-8536-c4c4b102d49c	8469b8e4-09f9-4f0d-9372-647c3611877c	AVERESTI DIAMOND BUSUIOACA DD	Pahar	25.00	t	\N
5f0becf4-d827-4708-8676-c12fcdf1aae5	8469b8e4-09f9-4f0d-9372-647c3611877c	MON ROSE BY PANDORA	Sticlă	135.00	t	\N
1c080ca8-b47f-4f95-b0ef-a557db663f6d	8469b8e4-09f9-4f0d-9372-647c3611877c	MON ROSE BY PANDORA	Pahar	25.00	t	\N
35c21e0b-c256-4150-8302-1bc087053508	8469b8e4-09f9-4f0d-9372-647c3611877c	ISSA ROSE	Sticlă	100.00	t	\N
1f99e428-a4f4-4d7d-a88b-6c29b7c00f33	8469b8e4-09f9-4f0d-9372-647c3611877c	ISSA ROSE	Pahar	20.00	t	\N
c74a249a-32ed-4e9f-b8fe-c321c6172e45	400fbc04-6c1f-476e-ada2-15953d54b549	TRAMIN CLASSIC SAUVIGNON BLANC	Pahar	28.00	t	\N
9fb7c63c-7bef-4f54-a714-0ac014533015	98276b5c-7145-4549-af3a-1cd3b6f842ec	CECILIA B. PROSECCO MILLESIAMATO	Pahar	25.00	t	\N
341b34a0-fd03-48a0-9dcc-24c07c17aeb1	98276b5c-7145-4549-af3a-1cd3b6f842ec	ISSA CHARM SPUMANT	Pahar	25.00	t	\N
5acb8a07-ada9-4a84-89e6-5671d7f6069d	98276b5c-7145-4549-af3a-1cd3b6f842ec	PIERRE ZERO CHARDONNAY SPARKLING	Pahar - zero alcool	30.00	t	\N
307d2d80-8901-4d85-8495-0a44a2d062f1	e7111669-38dd-4a1e-aea9-23fa6339df7a	BALLA EZA STONE WINE FET. NEAGRA & CAB. FRANC	Pahar	40.00	t	\N
9b8eb356-ff53-4d48-8cc5-fafaafc0030b	e7111669-38dd-4a1e-aea9-23fa6339df7a	BALLA GEZA STONE WINE CABERNET FRANC	Pahar	35.00	t	\N
2845d684-c977-47da-add4-003d6d19f76e	400fbc04-6c1f-476e-ada2-15953d54b549	FAMILIA SAVU – TRAMINER ROZ	Pahar	20.00	t	\N
c138744c-980f-44f5-bd70-34d260d6d07f	400fbc04-6c1f-476e-ada2-15953d54b549	FAUTOR ILUSTRO	Sticlă	160.00	t	\N
496a3e4d-58a6-4d84-829e-f6147fd268e6	400fbc04-6c1f-476e-ada2-15953d54b549	FAUTOR ILUSTRO	Pahar	30.00	t	\N
879dd420-6d91-47e7-bd48-d87c63b2afa2	400fbc04-6c1f-476e-ada2-15953d54b549	ISSA RIESLING DE RHIN	Pahar	20.00	t	\N
224b28a9-f88c-4cac-9e18-c61f16813ca5	400fbc04-6c1f-476e-ada2-15953d54b549	ISSA SAUVIGNON BLANC	Pahar	20.00	t	\N
9fb263d7-db63-434a-b058-b236553b65d9	400fbc04-6c1f-476e-ada2-15953d54b549	MON BLANC BY PANDORA	Sticlă	135.00	t	\N
669b86fc-6c95-4095-9aab-81e69d0188a7	400fbc04-6c1f-476e-ada2-15953d54b549	MON BLANC BY PANDORA	Pahar	25.00	t	\N
f23a6aa3-4706-44ba-b472-fdd6436d7be3	400fbc04-6c1f-476e-ada2-15953d54b549	NACHBIL RIESLING DE RHIN	Pahar	25.00	t	\N
5f4b7535-c2a2-4786-af1a-66caad06d63f	400fbc04-6c1f-476e-ada2-15953d54b549	TOHANI VALAHORUM CHARDONNAY	Sticlă	90.00	t	\N
ede65279-e5a5-48c5-a686-5ebd6c855524	400fbc04-6c1f-476e-ada2-15953d54b549	TOHANI VALAHORUM CHARDONNAY	Pahar	18.00	t	\N
defb6935-9c87-47ab-91fe-0ca434a0e796	400fbc04-6c1f-476e-ada2-15953d54b549	TRAMIN T. CUVEE BIANCO	Pahar	24.00	t	\N
38943710-1b4a-43b9-a9db-9f0767629e8c	591c193d-67af-4fc9-8023-4ad215cff8cf	Platou Mix Pentru Vin	brânză Brie, brânză Pecorino, salam Napoli, salam Milano, salam Coppa, nucă,\ncapere, prune uscate, cipoline, caise uscate, merișoare – 500 g (1105 Kcal) (2) (6) (7)	75.00	t	\N
ffba6bc8-7430-4625-b578-cbaac02770fd	591c193d-67af-4fc9-8023-4ad215cff8cf	Platou De Colțești	brânză Apuseni, brânză Trapist, brânză Tilsit, brânză Floare de colț, brânză Trascău,\nprune uscate, miere, nucă – 400 g (1462 Kcal) (2) (6) (7)	65.00	t	\N
d77380d2-a9a7-49bb-afa5-ad2b2e4c5033	591c193d-67af-4fc9-8023-4ad215cff8cf	Cheese Plate	brânză Brie, brânză Talegio, brânză Pecorino, brânză Gorgonzola, brânză Provola\nAfumicata, mere, struguri, caise uscate, merișoare – 500 g (1334,5 Kcal) (2) (6) (7)	65.00	t	\N
ac21c015-23c2-4a49-9a72-6900b3e17f73	591c193d-67af-4fc9-8023-4ad215cff8cf	Bruschete Cu Roșii Și Busuioc	pâine Ciabatta, usturoi, roșii, busuioc – 300 g (202 Kcal) (7) (9)	24.00	t	\N
62a68295-6293-4df0-8e35-fa7193fc071b	591c193d-67af-4fc9-8023-4ad215cff8cf	BRUSCHETE CU RICOTTA ȘI PIERSICĂ ȘI MIERE	pâine Ciabatta, brânză Ricotta, piersică, miere – 300 g (324,2 Kcal) (2 ) (7)	32.00	t	\N
53596f0a-290d-4a73-ac3f-482595522c05	591c193d-67af-4fc9-8023-4ad215cff8cf	CROSTINI CU PARĂ, GORGONZOLA ȘI NUCĂ	pâine Ciabatta, brânză Gorgonzola, pară, miere, nucă – 300 g (482,1 Kcal) (2) (6) (7)	35.00	t	\N
35b683dd-23be-41ae-8226-3187dd5c8f99	591c193d-67af-4fc9-8023-4ad215cff8cf	Mix De Măsline	măsline verzi, măsline negre, măsline Kalamata – 120 g (203 Kcal) (9)	20.00	t	\N
0a50f934-994f-4eda-8432-4442069676ee	591c193d-67af-4fc9-8023-4ad215cff8cf	CROSTINI CU BRIE, PROSCIUTTO ȘI MERIȘOARE	brânză brie, prosciutto, merișoare, cremă balsamică, ciabatta brie, prosciutto,\ncranberry, balsamic cream, bread – 300 g (462 Kcal) (7)	35.00	t	\N
c4ee4ede-71d9-4e09-991e-cd49b4b14213	591c193d-67af-4fc9-8023-4ad215cff8cf	BRUSCHETE CU PROSCIUTTO ȘI PARMESAN	pâine Ciabatta, roșii Pasata, usturoi, prosciutto, Parmesan – 300 g (469,5 Kcal) (2) (7)	30.00	t	https://imperialgrillandmusic.ro/wp-content/uploads/2020/11/Produse-Imperial-3-300x300.jpg
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: admin_boss
--

COPY public.requests (id, bar_id, table_id, session_token, type, payment_method, status, created_at) FROM stdin;
\.


--
-- Data for Name: tables; Type: TABLE DATA; Schema: public; Owner: admin_boss
--

COPY public.tables (id, bar_id, table_number, current_session_token, status, merged_into_id, session_started_at, zone_id) FROM stdin;
879d0c37-8116-4e41-8e51-c5a6d4a8aa14	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	1	\N	closed	\N	\N	\N
8670f2d7-feae-4ed4-ac18-16a34a06bf97	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	2	\N	closed	\N	\N	\N
10b7212b-ef19-417a-a904-4ef5febb8e23	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	3	\N	closed	\N	\N	\N
66ad92e0-f5bb-4ee2-b249-10b2fbe4b2cb	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	4	\N	closed	\N	\N	\N
3d4f575a-9df0-41d2-87a6-905f03649476	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	5	\N	closed	\N	\N	\N
47b0c289-9501-49df-ac95-5c9fa3ea6024	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	6	\N	closed	\N	\N	\N
aba53330-1ec9-4f1a-a0e1-7d5243390c26	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	7	\N	closed	\N	\N	\N
f934d07b-8839-4603-9db8-8ab11171ced0	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	8	\N	closed	\N	\N	\N
4375955e-6b38-427e-a561-667c47e139f8	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	9	\N	closed	\N	\N	\N
f54f7f4b-e8c3-4af5-846c-775b8686f823	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	10	\N	closed	\N	\N	\N
af1292e7-78dd-47c6-8a9a-cfbd8b985e24	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	11	\N	closed	\N	\N	\N
0ff79647-1d64-49bf-8536-b3b4bb4af377	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	12	\N	closed	\N	\N	\N
9ba89cc1-9693-470c-9ddd-1510daf2e39f	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	13	\N	closed	\N	\N	\N
af5e9c34-d5de-4103-9186-cececdb5fb5a	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	14	\N	closed	\N	\N	\N
0e237d7c-ba95-4005-b91d-63563d8269c2	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	15	\N	closed	\N	\N	\N
69adff6b-84cf-4e49-a592-36ec015ce592	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	16	\N	closed	\N	\N	\N
7bd6ec87-fa42-4570-ba84-8b505cd678de	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	17	\N	closed	\N	\N	\N
417dec3f-eb13-47bd-b82d-34e777fb0682	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	18	\N	closed	\N	\N	\N
1a82ca8f-8522-4a6c-bb60-bf2b884a0663	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	19	\N	closed	\N	\N	\N
d802117c-b843-445e-93de-dd08c32aeac7	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	20	\N	closed	\N	\N	\N
2e70d384-abcc-476a-ae6c-9fe35b78d12d	a54f07a8-39d3-459b-8acd-9914fcdfb43f	1	\N	closed	\N	\N	\N
20be8456-72c6-4e91-b497-200dd102d478	a54f07a8-39d3-459b-8acd-9914fcdfb43f	2	\N	closed	\N	\N	\N
87dcff33-ec59-4ddd-8fe8-b08c8c9fccfd	a54f07a8-39d3-459b-8acd-9914fcdfb43f	3	\N	closed	\N	\N	\N
290c70c9-c455-4655-b213-1e43fb45cbb1	a54f07a8-39d3-459b-8acd-9914fcdfb43f	4	\N	closed	\N	\N	\N
e28aab9f-e20f-482b-a818-5b549422bcee	a54f07a8-39d3-459b-8acd-9914fcdfb43f	5	\N	closed	\N	\N	\N
1047896c-b63a-4721-91e2-05d1fc3da22d	a54f07a8-39d3-459b-8acd-9914fcdfb43f	6	\N	closed	\N	\N	\N
d7ae26a3-796f-4bef-a263-e76903d48c13	a54f07a8-39d3-459b-8acd-9914fcdfb43f	7	\N	closed	\N	\N	\N
f309aa50-1a85-4e80-8796-2d5758980dbe	a54f07a8-39d3-459b-8acd-9914fcdfb43f	8	\N	closed	\N	\N	\N
7309f1ef-9f7b-4fad-ba25-92594fd14011	6be69425-875d-46d2-851e-71a875e62025	10	\N	closed	\N	\N	\N
836c4a24-5834-45e2-87df-5e757126ec2a	a54f07a8-39d3-459b-8acd-9914fcdfb43f	9	\N	closed	\N	\N	\N
7749a4a2-873e-4b30-adcc-d7f244096991	a54f07a8-39d3-459b-8acd-9914fcdfb43f	10	\N	closed	\N	\N	\N
504b37cc-3b1c-4533-bcbc-9260c71c43f2	563ab86b-2265-4465-976f-6678096ce70e	2	\N	closed	\N	\N	a574fd85-1969-4562-8cd1-c0b93de7a89b
7be2be91-9559-483d-b9e0-c4eedfc2a745	6be69425-875d-46d2-851e-71a875e62025	1	\N	closed	\N	\N	\N
20e8684d-3ab3-4b65-8232-1f51515cd645	fc578e91-cf0c-44ca-ba12-55d8e057d023	5	\N	closed	\N	\N	\N
93d31494-49b0-4759-b5b9-65ac77de7c39	fc578e91-cf0c-44ca-ba12-55d8e057d023	7	\N	closed	\N	\N	\N
06cc5051-d05f-44f1-b69c-3bcc45b35fea	fc578e91-cf0c-44ca-ba12-55d8e057d023	8	\N	closed	\N	\N	\N
689bafb3-b218-4412-b029-ca0be4cc3dc9	fc578e91-cf0c-44ca-ba12-55d8e057d023	9	\N	closed	\N	\N	\N
de7d7058-63aa-4d7e-85ca-c064b33522cb	6be69425-875d-46d2-851e-71a875e62025	2	\N	closed	\N	\N	\N
ded52c70-f41b-4739-9291-f6fadd82b8c3	6be69425-875d-46d2-851e-71a875e62025	3	\N	closed	\N	\N	\N
087f91d8-ab2a-4e0e-b538-cca8dd0db3d0	6be69425-875d-46d2-851e-71a875e62025	6	\N	closed	\N	\N	\N
451b1def-3b14-42a9-8dfe-ba2ab591d158	563ab86b-2265-4465-976f-6678096ce70e	1	\N	closed	\N	\N	a574fd85-1969-4562-8cd1-c0b93de7a89b
f612520e-6041-445c-b667-1db4b6c03ee4	563ab86b-2265-4465-976f-6678096ce70e	3	\N	closed	\N	\N	a574fd85-1969-4562-8cd1-c0b93de7a89b
64eb6aa0-cf55-46b9-bfbd-1072d23ed656	563ab86b-2265-4465-976f-6678096ce70e	4	\N	closed	\N	\N	feaf4da8-4591-4844-befd-ca48949f0829
e9e1c4e1-2c03-42e7-aec9-a12775737e65	563ab86b-2265-4465-976f-6678096ce70e	5	\N	closed	\N	\N	feaf4da8-4591-4844-befd-ca48949f0829
dc850ede-1a52-415a-90fb-2fc671e82ef3	563ab86b-2265-4465-976f-6678096ce70e	6	\N	closed	\N	\N	feaf4da8-4591-4844-befd-ca48949f0829
789a2e7c-2018-4702-ac3c-181bc13f4469	563ab86b-2265-4465-976f-6678096ce70e	7	\N	closed	\N	\N	feaf4da8-4591-4844-befd-ca48949f0829
c159ef21-e090-4fdb-9b3a-4111ef8e756b	563ab86b-2265-4465-976f-6678096ce70e	8	\N	closed	\N	\N	feaf4da8-4591-4844-befd-ca48949f0829
b3499fa7-c0dd-49d9-960b-68c19871c6f1	563ab86b-2265-4465-976f-6678096ce70e	9	\N	closed	\N	\N	feaf4da8-4591-4844-befd-ca48949f0829
35734d46-9655-4529-a14f-2b5b730ea39e	563ab86b-2265-4465-976f-6678096ce70e	10	\N	closed	\N	\N	feaf4da8-4591-4844-befd-ca48949f0829
f188cc4e-f5b3-4af6-a634-7937e840cc36	6be69425-875d-46d2-851e-71a875e62025	4	\N	closed	\N	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin_boss
--

COPY public.users (id, username, password_hash, bar_id, created_at) FROM stdin;
4999725d-4f58-4849-b372-67451d2c0662	admin	$2b$10$aOKMPuEtmuUVY7GieF8lN.ZNEQ7dLsmoyK4p4A1wjLoRY7aGj8YRe	d53a5a2f-df4b-4cd3-a062-021fbc36ed1f	2026-03-31 11:44:39.222092+00
53297ee7-7daa-417e-a7c3-9edfb918f8b3	admin1	$2b$10$p/LkI5xm23bs7omTvr6RbeNJx5kVQxxmUhlUzH3E9FR6ApUW3T9Lm	a54f07a8-39d3-459b-8acd-9914fcdfb43f	2026-03-31 11:49:51.539566+00
f3b0604f-2bbb-4cc7-aa26-bb18a60fe1f5	alin	$2b$10$gU5hgxGg9i5TOaGz3gNKleVrQTNxjGQd.inu5cE7NS0dn2Iyd8PQy	563ab86b-2265-4465-976f-6678096ce70e	2026-04-08 07:13:53.458492+00
\.


--
-- Data for Name: zones; Type: TABLE DATA; Schema: public; Owner: admin_boss
--

COPY public.zones (id, bar_id, name, list_order) FROM stdin;
a574fd85-1969-4562-8cd1-c0b93de7a89b	563ab86b-2265-4465-976f-6678096ce70e	Terasa	0
feaf4da8-4591-4844-befd-ca48949f0829	563ab86b-2265-4465-976f-6678096ce70e	Interior	1
\.


--
-- Name: bars bars_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.bars
    ADD CONSTRAINT bars_pkey PRIMARY KEY (id);


--
-- Name: bars bars_slug_key; Type: CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.bars
    ADD CONSTRAINT bars_slug_key UNIQUE (slug);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: tables tables_bar_id_table_number_key; Type: CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_bar_id_table_number_key UNIQUE (bar_id, table_number);


--
-- Name: tables tables_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: zones zones_pkey; Type: CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_pkey PRIMARY KEY (id);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: admin_boss
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: categories categories_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_bar_id_fkey FOREIGN KEY (bar_id) REFERENCES public.bars(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: orders orders_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_bar_id_fkey FOREIGN KEY (bar_id) REFERENCES public.bars(id) ON DELETE CASCADE;


--
-- Name: orders orders_table_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.tables(id) ON DELETE SET NULL;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: tables tables_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_bar_id_fkey FOREIGN KEY (bar_id) REFERENCES public.bars(id) ON DELETE CASCADE;


--
-- Name: tables tables_merged_into_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_merged_into_id_fkey FOREIGN KEY (merged_into_id) REFERENCES public.tables(id) ON DELETE SET NULL;


--
-- Name: tables tables_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zones(id) ON DELETE SET NULL;


--
-- Name: users users_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_bar_id_fkey FOREIGN KEY (bar_id) REFERENCES public.bars(id) ON DELETE CASCADE;


--
-- Name: zones zones_bar_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin_boss
--

ALTER TABLE ONLY public.zones
    ADD CONSTRAINT zones_bar_id_fkey FOREIGN KEY (bar_id) REFERENCES public.bars(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict q1T4zwgH2pkwblKjyB7ZH0cmyaG92qQoOhSs3wKBeilGeGCsaxFjLOxwJfAhc3j

--
-- PostgreSQL database cluster dump complete
--

