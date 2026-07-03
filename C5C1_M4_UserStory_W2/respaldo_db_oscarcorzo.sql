--
-- PostgreSQL database dump
--

\restrict 65anBkFzO6XhIXXw00kKTd0bDva94PJUgiO3ybqPnu0KvlVQTzeHSypcbyRlu13

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-03 02:36:10

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16872)
-- Name: cursos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cursos (
    id_curso integer NOT NULL,
    nombre character varying(200) NOT NULL,
    codigo character varying(20) NOT NULL,
    creditos smallint,
    semestre smallint,
    id_docente integer,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cursos_creditos_check CHECK ((creditos > 0)),
    CONSTRAINT cursos_semestre_check CHECK (((semestre >= 1) AND (semestre <= 10)))
);


ALTER TABLE public.cursos OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16871)
-- Name: cursos_id_curso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.cursos ALTER COLUMN id_curso ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cursos_id_curso_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 16856)
-- Name: docentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.docentes (
    id_docente integer NOT NULL,
    nombre_completo character varying(200) NOT NULL,
    correo_institucional character varying(200) NOT NULL,
    departamento_academico character varying(50) NOT NULL,
    anios_experiencia smallint NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT docentes_anios_experiencia_check CHECK ((anios_experiencia >= 0))
);


ALTER TABLE public.docentes OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16855)
-- Name: docentes_id_docente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.docentes ALTER COLUMN id_docente ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.docentes_id_docente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16835)
-- Name: estudiantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estudiantes (
    id_estudiante integer NOT NULL,
    nombre_completo character varying(200) NOT NULL,
    correo_electronico character varying(200) NOT NULL,
    identificacion character varying(20) NOT NULL,
    carrera character varying(100) NOT NULL,
    fecha_nacimiento date NOT NULL,
    fecha_ingreso date NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    estado_academico character varying(20),
    CONSTRAINT estudiantes_estado_academico_check CHECK (((estado_academico)::text = ANY ((ARRAY['Activo'::character varying, 'Inactivo'::character varying, 'Graduado'::character varying, 'Suspendido'::character varying])::text[])))
);


ALTER TABLE public.estudiantes OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16834)
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.estudiantes ALTER COLUMN id_estudiante ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.estudiantes_id_estudiante_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 16892)
-- Name: inscripciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inscripciones (
    id_inscripcion integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_curso integer NOT NULL,
    fecha_inscripcion date NOT NULL,
    calificacion_final numeric(4,2),
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT inscripciones_calificacion_final_check CHECK (((calificacion_final >= 0.0) AND (calificacion_final <= 5.0)))
);


ALTER TABLE public.inscripciones OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16891)
-- Name: inscripciones_id_inscripcion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.inscripciones ALTER COLUMN id_inscripcion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.inscripciones_id_inscripcion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 16915)
-- Name: vista_historial_academico; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_historial_academico AS
 SELECT e.nombre_completo AS nombre_estudiante,
    c.nombre AS nombre_curso,
    d.nombre_completo AS nombre_docente,
    c.semestre,
    i.calificacion_final
   FROM (((public.inscripciones i
     JOIN public.cursos c ON ((c.id_curso = i.id_curso)))
     JOIN public.docentes d ON ((d.id_docente = c.id_docente)))
     JOIN public.estudiantes e ON ((e.id_estudiante = i.id_estudiante)));


ALTER VIEW public.vista_historial_academico OWNER TO postgres;

--
-- TOC entry 5060 (class 0 OID 16872)
-- Dependencies: 224
-- Data for Name: cursos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cursos (id_curso, nombre, codigo, creditos, semestre, id_docente, created_at, updated_at) FROM stdin;
2	Cálculo Diferencial	MAT-101	4	1	2	2026-07-03 02:32:52	2026-07-03 02:32:52
3	Gestión Empresarial	ADM-201	3	2	3	2026-07-03 02:32:52	2026-07-03 02:32:52
1	Fundamentos de Programación	ISI-101	3	1	\N	2026-07-03 02:32:52	2026-07-03 02:32:52
4	Base de Datos I	ISI-301	4	3	\N	2026-07-03 02:32:52	2026-07-03 02:32:52
\.


--
-- TOC entry 5058 (class 0 OID 16856)
-- Dependencies: 222
-- Data for Name: docentes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.docentes (id_docente, nombre_completo, correo_institucional, departamento_academico, anios_experiencia, created_at, updated_at) FROM stdin;
2	Laura Gómez Herrera	l.gomez@universidad.edu.co	Ciencias Básicas	8	2026-07-03 02:32:52	2026-07-03 02:32:52
3	Andrés Vargas Pinto	a.vargas@universidad.edu.co	Administración	15	2026-07-03 02:32:52	2026-07-03 02:32:52
\.


--
-- TOC entry 5056 (class 0 OID 16835)
-- Dependencies: 220
-- Data for Name: estudiantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estudiantes (id_estudiante, nombre_completo, correo_electronico, identificacion, carrera, fecha_nacimiento, fecha_ingreso, created_at, updated_at, estado_academico) FROM stdin;
1	Sofía Torres Mejía	s.torres@estudiantil.edu.co	1005234781	Ingeniería de Sistemas	2001-03-14	2020-01-20	2026-07-03 02:32:52	2026-07-03 02:32:52	\N
2	Mateo Ramírez Cruz	m.ramirez@estudiantil.edu.co	1006789234	Administración de Empresas	2000-07-22	2019-07-15	2026-07-03 02:32:52	2026-07-03 02:32:52	\N
3	Valentina Moreno Gil	v.moreno@estudiantil.edu.co	1007345612	Ingeniería de Sistemas	2002-11-05	2021-01-18	2026-07-03 02:32:52	2026-07-03 02:32:52	\N
4	Juan Pablo Ossa	jp.ossa@estudiantil.edu.co	1003456789	Contaduría Pública	1999-05-30	2018-07-10	2026-07-03 02:32:52	2026-07-03 02:32:52	\N
5	Daniela Restrepo Vega	d.restrepo@estudiantil.edu.co	1008123456	Administración de Empresas	2003-01-17	2022-01-24	2026-07-03 02:32:52	2026-07-03 02:32:52	\N
\.


--
-- TOC entry 5062 (class 0 OID 16892)
-- Dependencies: 226
-- Data for Name: inscripciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inscripciones (id_inscripcion, id_estudiante, id_curso, fecha_inscripcion, calificacion_final, created_at, updated_at) FROM stdin;
2	1	2	2020-02-01	3.80	2026-07-03 02:32:52	2026-07-03 02:32:52
3	2	3	2019-08-05	4.10	2026-07-03 02:32:52	2026-07-03 02:32:52
4	3	1	2021-02-03	3.50	2026-07-03 02:32:52	2026-07-03 02:32:52
5	3	4	2021-02-03	4.80	2026-07-03 02:32:52	2026-07-03 02:32:52
6	4	2	2018-08-01	2.90	2026-07-03 02:32:52	2026-07-03 02:32:52
7	4	3	2018-08-01	3.70	2026-07-03 02:32:52	2026-07-03 02:32:52
8	2	1	2024-02-10	4.30	2026-07-03 02:32:52	2026-07-03 02:32:52
9	5	4	2022-02-07	4.20	2026-07-03 02:32:52	2026-07-03 02:32:52
1	1	1	2020-02-01	4.90	2026-07-03 02:32:52	2026-07-03 02:32:52
\.


--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 223
-- Name: cursos_id_curso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cursos_id_curso_seq', 4, true);


--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 221
-- Name: docentes_id_docente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.docentes_id_docente_seq', 3, true);


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 219
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estudiantes_id_estudiante_seq', 5, true);


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 225
-- Name: inscripciones_id_inscripcion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inscripciones_id_inscripcion_seq', 9, true);


--
-- TOC entry 4899 (class 2606 OID 16885)
-- Name: cursos cursos_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_codigo_key UNIQUE (codigo);


--
-- TOC entry 4901 (class 2606 OID 16883)
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id_curso);


--
-- TOC entry 4895 (class 2606 OID 16870)
-- Name: docentes docentes_correo_institucional_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_correo_institucional_key UNIQUE (correo_institucional);


--
-- TOC entry 4897 (class 2606 OID 16868)
-- Name: docentes docentes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_pkey PRIMARY KEY (id_docente);


--
-- TOC entry 4889 (class 2606 OID 16852)
-- Name: estudiantes estudiantes_correo_electronico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_correo_electronico_key UNIQUE (correo_electronico);


--
-- TOC entry 4891 (class 2606 OID 16854)
-- Name: estudiantes estudiantes_identificacion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_identificacion_key UNIQUE (identificacion);


--
-- TOC entry 4893 (class 2606 OID 16850)
-- Name: estudiantes estudiantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (id_estudiante);


--
-- TOC entry 4903 (class 2606 OID 16903)
-- Name: inscripciones inscripciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_pkey PRIMARY KEY (id_inscripcion);


--
-- TOC entry 4904 (class 2606 OID 16886)
-- Name: cursos cursos_id_docente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_id_docente_fkey FOREIGN KEY (id_docente) REFERENCES public.docentes(id_docente) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4905 (class 2606 OID 16909)
-- Name: inscripciones inscripciones_id_curso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_id_curso_fkey FOREIGN KEY (id_curso) REFERENCES public.cursos(id_curso) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 4906 (class 2606 OID 16904)
-- Name: inscripciones inscripciones_id_estudiante_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_id_estudiante_fkey FOREIGN KEY (id_estudiante) REFERENCES public.estudiantes(id_estudiante) ON UPDATE CASCADE ON DELETE RESTRICT;


-- Completed on 2026-07-03 02:36:10

--
-- PostgreSQL database dump complete
--

\unrestrict 65anBkFzO6XhIXXw00kKTd0bDva94PJUgiO3ybqPnu0KvlVQTzeHSypcbyRlu13

