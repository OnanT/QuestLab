--
-- PostgreSQL database dump
--

\restrict aNxk1FQeJedaDSrH6sZTYTO9b02FAJy1vSFTyWOtEzxDzVVJ0Xq57Xd7oBUuMht

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assignments (
    id integer NOT NULL,
    student_id integer NOT NULL,
    parent_id integer,
    teacher_id integer,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;


--
-- Name: concepts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.concepts (
    id integer NOT NULL,
    topic_id integer,
    title character varying(150) NOT NULL
);


--
-- Name: concepts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.concepts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: concepts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.concepts_id_seq OWNED BY public.concepts.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: cultural_practices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cultural_practices (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    practice_type character varying(100),
    country_id integer,
    description text,
    historical_context text,
    contemporary_practice text,
    tags text
);


--
-- Name: cultural_practices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cultural_practices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cultural_practices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cultural_practices_id_seq OWNED BY public.cultural_practices.id;


--
-- Name: curriculum_subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.curriculum_subjects (
    id integer NOT NULL,
    country_id integer,
    subject_id integer,
    grade_level integer NOT NULL
);


--
-- Name: curriculum_subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.curriculum_subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: curriculum_subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.curriculum_subjects_id_seq OWNED BY public.curriculum_subjects.id;


--
-- Name: game_engines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.game_engines (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    CONSTRAINT game_engines_name_check CHECK (((name)::text = ANY ((ARRAY['SkillBuilder'::character varying, 'QuizBattle'::character varying, 'StoryQuest'::character varying, 'MapChallenge'::character varying, 'Quiz Engine'::character varying, 'Memory Match'::character varying, 'Drag and Drop'::character varying, 'Multiple Choice'::character varying, 'Fill in the Blanks'::character varying, 'Interactive Simulation'::character varying])::text[])))
);


--
-- Name: game_engines_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.game_engines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: game_engines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.game_engines_id_seq OWNED BY public.game_engines.id;


--
-- Name: games; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.games (
    id integer NOT NULL,
    lesson_id integer,
    game_engine_id integer,
    config_json jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: games_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;


--
-- Name: geographical_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.geographical_features (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    feature_type character varying(100),
    country_id integer,
    latitude numeric(10,7),
    longitude numeric(10,7),
    elevation_meters integer,
    description text,
    scientific_significance text
);


--
-- Name: geographical_features_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.geographical_features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: geographical_features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.geographical_features_id_seq OWNED BY public.geographical_features.id;


--
-- Name: historical_figures; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.historical_figures (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    birth_year integer,
    death_year integer,
    country_id integer,
    contribution text,
    legacy text
);


--
-- Name: historical_figures_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.historical_figures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: historical_figures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.historical_figures_id_seq OWNED BY public.historical_figures.id;


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessons (
    id integer NOT NULL,
    concept_id integer,
    title character varying(150) NOT NULL,
    content_html text NOT NULL,
    creator_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category character varying(50) DEFAULT 'General'::character varying,
    difficulty character varying(20) DEFAULT 'beginner'::character varying,
    estimated_time integer DEFAULT 30,
    points integer DEFAULT 50,
    grade_levels text DEFAULT ''::text,
    description text DEFAULT ''::text,
    objectives text DEFAULT ''::text,
    prerequisites text DEFAULT ''::text,
    tags text DEFAULT ''::text,
    points_possible integer DEFAULT 100
);


--
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lessons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lessons_id_seq OWNED BY public.lessons.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    filetype character varying(50) NOT NULL,
    file_category character varying(20) DEFAULT 'other'::character varying,
    url character varying(255) NOT NULL,
    lesson_id integer,
    game_id integer,
    uploaded_by integer,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.progress (
    id integer NOT NULL,
    user_id integer,
    lesson_id integer,
    score integer,
    completed boolean DEFAULT false,
    completed_at timestamp without time zone
);


--
-- Name: progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.progress_id_seq OWNED BY public.progress.id;


--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quizzes (
    id integer NOT NULL,
    lesson_id integer,
    question text NOT NULL,
    question_type character varying(20) DEFAULT 'mc_single'::character varying,
    options text NOT NULL,
    correct_answer character varying(100) NOT NULL,
    explanation text DEFAULT ''::text,
    points integer DEFAULT 10,
    difficulty character varying(20) DEFAULT 'beginner'::character varying,
    time_limit integer DEFAULT 0,
    image_url text DEFAULT ''::text,
    audio_url text DEFAULT ''::text,
    tags text DEFAULT ''::text
);


--
-- Name: quizzes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quizzes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quizzes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quizzes_id_seq OWNED BY public.quizzes.id;


--
-- Name: rewards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rewards (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    points_required integer NOT NULL,
    creator_id integer,
    for_user_id integer
);


--
-- Name: rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rewards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rewards_id_seq OWNED BY public.rewards.id;


--
-- Name: school_years; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.school_years (
    id integer NOT NULL,
    country_id integer,
    year_label character varying(50) NOT NULL
);


--
-- Name: school_years_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.school_years_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: school_years_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.school_years_id_seq OWNED BY public.school_years.id;


--
-- Name: schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schools (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    island_id integer,
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schools_id_seq OWNED BY public.schools.id;


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subjects (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subjects_id_seq OWNED BY public.subjects.id;


--
-- Name: terms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.terms (
    id integer NOT NULL,
    school_year_id integer,
    term_number integer NOT NULL,
    title character varying(100) NOT NULL
);


--
-- Name: terms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.terms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: terms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.terms_id_seq OWNED BY public.terms.id;


--
-- Name: topics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topics (
    id integer NOT NULL,
    curriculum_subject_id integer,
    term_id integer,
    title character varying(150) NOT NULL
);


--
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.topics_id_seq OWNED BY public.topics.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    hashed_password character varying(150) NOT NULL,
    role character varying(50) NOT NULL,
    avatar character varying(150) DEFAULT 'default_avatar.png'::character varying,
    points integer DEFAULT 0,
    badges text DEFAULT ''::text,
    level character varying(50) DEFAULT 'Explorer'::character varying,
    streak integer DEFAULT 0,
    parent_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    display_name character varying(150),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['student'::character varying, 'parent'::character varying, 'teacher'::character varying, 'admin'::character varying, 'guest'::character varying])::text[])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);


--
-- Name: concepts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concepts ALTER COLUMN id SET DEFAULT nextval('public.concepts_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: cultural_practices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cultural_practices ALTER COLUMN id SET DEFAULT nextval('public.cultural_practices_id_seq'::regclass);


--
-- Name: curriculum_subjects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum_subjects ALTER COLUMN id SET DEFAULT nextval('public.curriculum_subjects_id_seq'::regclass);


--
-- Name: game_engines id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_engines ALTER COLUMN id SET DEFAULT nextval('public.game_engines_id_seq'::regclass);


--
-- Name: games id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);


--
-- Name: geographical_features id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.geographical_features ALTER COLUMN id SET DEFAULT nextval('public.geographical_features_id_seq'::regclass);


--
-- Name: historical_figures id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historical_figures ALTER COLUMN id SET DEFAULT nextval('public.historical_figures_id_seq'::regclass);


--
-- Name: lessons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons ALTER COLUMN id SET DEFAULT nextval('public.lessons_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress ALTER COLUMN id SET DEFAULT nextval('public.progress_id_seq'::regclass);


--
-- Name: quizzes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes ALTER COLUMN id SET DEFAULT nextval('public.quizzes_id_seq'::regclass);


--
-- Name: rewards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rewards ALTER COLUMN id SET DEFAULT nextval('public.rewards_id_seq'::regclass);


--
-- Name: school_years id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_years ALTER COLUMN id SET DEFAULT nextval('public.school_years_id_seq'::regclass);


--
-- Name: schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools ALTER COLUMN id SET DEFAULT nextval('public.schools_id_seq'::regclass);


--
-- Name: subjects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects ALTER COLUMN id SET DEFAULT nextval('public.subjects_id_seq'::regclass);


--
-- Name: terms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms ALTER COLUMN id SET DEFAULT nextval('public.terms_id_seq'::regclass);


--
-- Name: topics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assignments (id, student_id, parent_id, teacher_id, created_at) FROM stdin;
\.


--
-- Data for Name: concepts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.concepts (id, topic_id, title) FROM stdin;
1	2	Understanding Fractions
2	2	Adding Fractions
3	2	Subtracting Fractions
4	2	Decimal Place Value
5	2	Converting Fractions to Decimals
6	2	Comparing Fractions and Decimals
7	8	Main Idea and Supporting Details
8	8	Making Inferences
9	8	Identifying Story Elements
10	8	Summarizing Passages
11	4	Introduction to Variables
12	4	Solving Simple Equations
13	4	Understanding Expressions
14	4	Order of Operations
15	1	The Kalinago People of Dominica
16	1	Nevis Peak: A Dormant Volcano
17	1	Sugar Plantation Economy in Nevis
18	1	Dominica's Volcanoes
19	1	Marine Ecosystems
20	1	Cultural Festivals
21	1	Agricultural Mathematics
22	1	Island Climate
23	2	The Kalinago People of Dominica
24	2	Nevis Peak: A Dormant Volcano
25	2	Sugar Plantation Economy in Nevis
26	2	Dominica's Volcanoes
27	2	Marine Ecosystems
28	2	Cultural Festivals
29	2	Agricultural Mathematics
30	2	Island Climate
31	3	The Kalinago People of Dominica
32	3	Nevis Peak: A Dormant Volcano
33	3	Sugar Plantation Economy in Nevis
34	3	Dominica's Volcanoes
35	3	Marine Ecosystems
36	3	Cultural Festivals
37	3	Agricultural Mathematics
38	3	Island Climate
39	4	The Kalinago People of Dominica
40	4	Nevis Peak: A Dormant Volcano
41	4	Sugar Plantation Economy in Nevis
42	4	Dominica's Volcanoes
43	4	Marine Ecosystems
44	4	Cultural Festivals
45	4	Agricultural Mathematics
46	4	Island Climate
47	5	The Kalinago People of Dominica
48	5	Nevis Peak: A Dormant Volcano
49	5	Sugar Plantation Economy in Nevis
50	5	Dominica's Volcanoes
51	5	Marine Ecosystems
52	5	Cultural Festivals
53	5	Agricultural Mathematics
54	5	Island Climate
215	1	Counting to 10
216	1	Counting to 20
217	2	Adding Single Digits
218	2	Adding with Objects
219	3	The Alphabet
220	3	Vowels and Consonants
221	5	What are Living Things?
222	5	Needs of Living Things
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.countries (id, name) FROM stdin;
1	Barbados
2	Trinidad and Tobago
3	Jamaica
4	Guyana
5	St. Kitts & Nevis
6	Dominica
10	Saint Kitts and Nevis
\.


--
-- Data for Name: cultural_practices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cultural_practices (id, name, practice_type, country_id, description, historical_context, contemporary_practice, tags) FROM stdin;
1	Culturama Festival	Cultural Festival	10	Annual 10-day cultural festival in Nevis celebrating emancipation	Began in 1974 to preserve cultural traditions	Features music, dance, pageants, food fairs; major tourist attraction	festival,culture,tradition,nevis
2	World Creole Music Festival	Music Festival	6	Annual three-day music festival celebrating Creole culture	Started in 1997 to promote Creole culture	Draws international artists and visitors, held in October	music,festival,creole,dominica
3	Kwéyòl Language Use	Linguistic Practice	6	Use of Dominican Creole French in daily communication	Developed during colonial period	Taught in schools, used in media	language,creole,culture,dominica
4	Culturama Festival	Cultural Festival	10	Annual 10-day cultural festival in Nevis celebrating emancipation	Began in 1974 to preserve cultural traditions	Features music, dance, pageants, food fairs; major tourist attraction	festival,culture,tradition,nevis
5	World Creole Music Festival	Music Festival	6	Annual three-day music festival celebrating Creole culture	Started in 1997 to promote Creole culture	Draws international artists and visitors, held in October	music,festival,creole,dominica
6	Kwéyòl Language Use	Linguistic Practice	6	Use of Dominican Creole French in daily communication	Developed during colonial period	Taught in schools, used in media	language,creole,culture,dominica
7	Culturama Festival	Cultural Festival	10	Annual 10-day cultural festival in Nevis celebrating emancipation	Began in 1974 to preserve cultural traditions	Features music, dance, pageants, food fairs; major tourist attraction	festival,culture,tradition,nevis
8	World Creole Music Festival	Music Festival	6	Annual three-day music festival celebrating Creole culture	Started in 1997 to promote Creole culture	Draws international artists and visitors, held in October	music,festival,creole,dominica
9	Kwéyòl Language Use	Linguistic Practice	6	Use of Dominican Creole French in daily communication	Developed during colonial period	Taught in schools, used in media	language,creole,culture,dominica
10	Culturama Festival	Cultural Festival	10	Annual 10-day cultural festival in Nevis celebrating emancipation	Began in 1974 to preserve cultural traditions	Features music, dance, pageants, food fairs; major tourist attraction	festival,culture,tradition,nevis
11	World Creole Music Festival	Music Festival	6	Annual three-day music festival celebrating Creole culture	Started in 1997 to promote Creole culture	Draws international artists and visitors, held in October	music,festival,creole,dominica
12	Kwéyòl Language Use	Linguistic Practice	6	Use of Dominican Creole French in daily communication	Developed during colonial period	Taught in schools, used in media	language,creole,culture,dominica
13	Culturama Festival	Cultural Festival	10	Annual 10-day cultural festival in Nevis celebrating emancipation	Began in 1974 to preserve cultural traditions	Features music, dance, pageants, food fairs; major tourist attraction	festival,culture,tradition,nevis
14	World Creole Music Festival	Music Festival	6	Annual three-day music festival celebrating Creole culture	Started in 1997 to promote Creole culture	Draws international artists and visitors, held in October	music,festival,creole,dominica
15	Kwéyòl Language Use	Linguistic Practice	6	Use of Dominican Creole French in daily communication	Developed during colonial period	Taught in schools, used in media	language,creole,culture,dominica
\.


--
-- Data for Name: curriculum_subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.curriculum_subjects (id, country_id, subject_id, grade_level) FROM stdin;
1	1	1	1
2	1	2	1
3	1	3	1
4	1	4	1
5	1	5	1
6	1	10	1
7	1	11	1
8	2	1	1
9	2	2	1
10	2	3	1
11	2	4	1
12	2	5	1
13	2	10	1
14	2	11	1
15	3	1	1
16	3	2	1
17	3	3	1
18	3	4	1
19	3	5	1
20	3	10	1
21	3	11	1
22	4	1	1
23	4	2	1
24	4	3	1
25	4	4	1
26	4	5	1
27	4	10	1
28	4	11	1
29	5	1	1
30	5	2	1
31	5	3	1
32	5	4	1
33	5	5	1
34	5	10	1
35	5	11	1
36	6	1	1
37	6	2	1
38	6	3	1
39	6	4	1
40	6	5	1
41	6	10	1
42	6	11	1
43	1	1	2
44	1	2	2
45	1	3	2
46	1	4	2
47	1	5	2
48	1	10	2
49	1	11	2
50	2	1	2
51	2	2	2
52	2	3	2
53	2	4	2
54	2	5	2
55	2	10	2
56	2	11	2
57	3	1	2
58	3	2	2
59	3	3	2
60	3	4	2
61	3	5	2
62	3	10	2
63	3	11	2
64	4	1	2
65	4	2	2
66	4	3	2
67	4	4	2
68	4	5	2
69	4	10	2
70	4	11	2
71	5	1	2
72	5	2	2
73	5	3	2
74	5	4	2
75	5	5	2
76	5	10	2
77	5	11	2
78	6	1	2
79	6	2	2
80	6	3	2
81	6	4	2
82	6	5	2
83	6	10	2
84	6	11	2
85	1	1	3
86	1	2	3
87	1	3	3
88	1	4	3
89	1	5	3
90	1	10	3
91	1	11	3
92	2	1	3
93	2	2	3
94	2	3	3
95	2	4	3
96	2	5	3
97	2	10	3
98	2	11	3
99	3	1	3
100	3	2	3
101	3	3	3
102	3	4	3
103	3	5	3
104	3	10	3
105	3	11	3
106	4	1	3
107	4	2	3
108	4	3	3
109	4	4	3
110	4	5	3
111	4	10	3
112	4	11	3
113	5	1	3
114	5	2	3
115	5	3	3
116	5	4	3
117	5	5	3
118	5	10	3
119	5	11	3
120	6	1	3
121	6	2	3
122	6	3	3
123	6	4	3
124	6	5	3
125	6	10	3
126	6	11	3
127	1	1	4
128	1	2	4
129	1	3	4
130	1	4	4
131	1	5	4
132	1	10	4
133	1	11	4
134	2	1	4
135	2	2	4
136	2	3	4
137	2	4	4
138	2	5	4
139	2	10	4
140	2	11	4
141	3	1	4
142	3	2	4
143	3	3	4
144	3	4	4
145	3	5	4
146	3	10	4
147	3	11	4
148	4	1	4
149	4	2	4
150	4	3	4
151	4	4	4
152	4	5	4
153	4	10	4
154	4	11	4
155	5	1	4
156	5	2	4
157	5	3	4
158	5	4	4
159	5	5	4
160	5	10	4
161	5	11	4
162	6	1	4
163	6	2	4
164	6	3	4
165	6	4	4
166	6	5	4
167	6	10	4
168	6	11	4
169	1	1	5
170	1	2	5
171	1	3	5
172	1	4	5
173	1	5	5
174	1	10	5
175	1	11	5
176	2	1	5
177	2	2	5
178	2	3	5
179	2	4	5
180	2	5	5
181	2	10	5
182	2	11	5
183	3	1	5
184	3	2	5
185	3	3	5
186	3	4	5
187	3	5	5
188	3	10	5
189	3	11	5
190	4	1	5
191	4	2	5
192	4	3	5
193	4	4	5
194	4	5	5
195	4	10	5
196	4	11	5
197	5	1	5
198	5	2	5
199	5	3	5
200	5	4	5
201	5	5	5
202	5	10	5
203	5	11	5
204	6	1	5
205	6	2	5
206	6	3	5
207	6	4	5
208	6	5	5
209	6	10	5
210	6	11	5
211	1	1	6
212	1	2	6
213	1	3	6
214	1	4	6
215	1	5	6
216	1	10	6
217	1	11	6
218	2	1	6
219	2	2	6
220	2	3	6
221	2	4	6
222	2	5	6
223	2	10	6
224	2	11	6
225	3	1	6
226	3	2	6
227	3	3	6
228	3	4	6
229	3	5	6
230	3	10	6
231	3	11	6
232	4	1	6
233	4	2	6
234	4	3	6
235	4	4	6
236	4	5	6
237	4	10	6
238	4	11	6
239	5	1	6
240	5	2	6
241	5	3	6
242	5	4	6
243	5	5	6
244	5	10	6
245	5	11	6
246	6	1	6
247	6	2	6
248	6	3	6
249	6	4	6
250	6	5	6
251	6	10	6
252	6	11	6
254	10	1	3
256	10	1	4
258	10	1	5
260	10	1	6
262	10	2	3
264	10	2	4
266	10	2	5
268	10	2	6
270	10	3	3
272	10	3	4
274	10	3	5
276	10	3	6
278	10	4	3
280	10	4	4
282	10	4	5
284	10	4	6
286	10	5	3
288	10	5	4
290	10	5	5
292	10	5	6
294	10	10	3
296	10	10	4
298	10	10	5
300	10	10	6
302	10	11	3
304	10	11	4
306	10	11	5
308	10	11	6
309	6	17	3
310	10	17	3
311	6	17	4
312	10	17	4
313	6	17	5
314	10	17	5
315	6	17	6
316	10	17	6
317	6	18	3
318	10	18	3
319	6	18	4
320	10	18	4
321	6	18	5
322	10	18	5
323	6	18	6
324	10	18	6
325	6	19	3
326	10	19	3
327	6	19	4
328	10	19	4
329	6	19	5
330	10	19	5
331	6	19	6
332	10	19	6
661	1	17	1
662	1	18	1
663	1	19	1
671	2	17	1
672	2	18	1
673	2	19	1
681	3	17	1
682	3	18	1
683	3	19	1
691	4	17	1
692	4	18	1
693	4	19	1
701	5	17	1
702	5	18	1
703	5	19	1
711	6	17	1
712	6	18	1
713	6	19	1
714	10	1	1
715	10	2	1
716	10	3	1
717	10	4	1
718	10	5	1
719	10	10	1
720	10	11	1
721	10	17	1
722	10	18	1
723	10	19	1
731	1	17	2
732	1	18	2
733	1	19	2
741	2	17	2
742	2	18	2
743	2	19	2
751	3	17	2
752	3	18	2
753	3	19	2
761	4	17	2
762	4	18	2
763	4	19	2
771	5	17	2
772	5	18	2
773	5	19	2
781	6	17	2
782	6	18	2
783	6	19	2
784	10	1	2
785	10	2	2
786	10	3	2
787	10	4	2
788	10	5	2
789	10	10	2
790	10	11	2
791	10	17	2
792	10	18	2
793	10	19	2
801	1	17	3
802	1	18	3
803	1	19	3
811	2	17	3
812	2	18	3
813	2	19	3
821	3	17	3
822	3	18	3
823	3	19	3
831	4	17	3
832	4	18	3
833	4	19	3
841	5	17	3
842	5	18	3
843	5	19	3
871	1	17	4
872	1	18	4
873	1	19	4
881	2	17	4
882	2	18	4
883	2	19	4
891	3	17	4
892	3	18	4
893	3	19	4
901	4	17	4
902	4	18	4
903	4	19	4
911	5	17	4
912	5	18	4
913	5	19	4
941	1	17	5
942	1	18	5
943	1	19	5
951	2	17	5
952	2	18	5
953	2	19	5
961	3	17	5
962	3	18	5
963	3	19	5
971	4	17	5
972	4	18	5
973	4	19	5
981	5	17	5
982	5	18	5
983	5	19	5
1011	1	17	6
1012	1	18	6
1013	1	19	6
1021	2	17	6
1022	2	18	6
1023	2	19	6
1031	3	17	6
1032	3	18	6
1033	3	19	6
1041	4	17	6
1042	4	18	6
1043	4	19	6
1051	5	17	6
1052	5	18	6
1053	5	19	6
\.


--
-- Data for Name: game_engines; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.game_engines (id, name) FROM stdin;
1	SkillBuilder
2	QuizBattle
3	StoryQuest
4	MapChallenge
5	Quiz Engine
6	Memory Match
7	Drag and Drop
8	Multiple Choice
9	Fill in the Blanks
10	Interactive Simulation
11	SkillBuilder
12	QuizBattle
13	StoryQuest
14	MapChallenge
15	SkillBuilder
16	QuizBattle
17	StoryQuest
18	MapChallenge
19	SkillBuilder
20	QuizBattle
21	StoryQuest
22	MapChallenge
23	SkillBuilder
24	QuizBattle
25	StoryQuest
26	MapChallenge
27	SkillBuilder
28	QuizBattle
29	StoryQuest
30	MapChallenge
31	Quiz Engine
32	Memory Match
33	Drag and Drop
34	Multiple Choice
35	Fill in the Blanks
36	Interactive Simulation
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.games (id, lesson_id, game_engine_id, config_json, created_at) FROM stdin;
1	1	5	{"type": "quiz", "difficulty": "beginner", "time_limit": 300, "questions_count": 5}	2026-01-30 06:48:53.531795
2	3	6	{"type": "memory_match", "pairs": 6, "difficulty": "intermediate", "time_limit": 180}	2026-01-30 06:48:53.531795
7	1	5	{"type": "quiz", "difficulty": "beginner", "time_limit": 300, "questions_count": 5}	2026-01-30 13:37:34.235207
8	3	6	{"type": "memory_match", "pairs": 6, "difficulty": "intermediate", "time_limit": 180}	2026-01-30 13:37:34.235207
\.


--
-- Data for Name: geographical_features; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.geographical_features (id, name, feature_type, country_id, latitude, longitude, elevation_meters, description, scientific_significance) FROM stdin;
1	Nevis Peak	Volcano	10	17.1500000	-62.5833000	985	Dormant stratovolcano forming the central peak of Nevis	Youngest volcanic center, potential for future activity
2	Boiling Lake	Volcanic Feature	6	15.3200000	-61.2933000	800	World's second-largest boiling lake	Unique hydrothermal feature, water temperature 82-92°C
3	Kalinago Territory	Cultural Region	6	15.4722000	-61.2778000	100	3,700-acre territory on Dominica's northeast coast	Last remaining indigenous territory in the Caribbean
4	Nevis Peak	Volcano	10	17.1500000	-62.5833000	985	Dormant stratovolcano forming the central peak of Nevis	Youngest volcanic center, potential for future activity
5	Boiling Lake	Volcanic Feature	6	15.3200000	-61.2933000	800	World's second-largest boiling lake	Unique hydrothermal feature, water temperature 82-92°C
6	Kalinago Territory	Cultural Region	6	15.4722000	-61.2778000	100	3,700-acre territory on Dominica's northeast coast	Last remaining indigenous territory in the Caribbean
7	Nevis Peak	Volcano	10	17.1500000	-62.5833000	985	Dormant stratovolcano forming the central peak of Nevis	Youngest volcanic center, potential for future activity
8	Boiling Lake	Volcanic Feature	6	15.3200000	-61.2933000	800	World's second-largest boiling lake	Unique hydrothermal feature, water temperature 82-92°C
9	Kalinago Territory	Cultural Region	6	15.4722000	-61.2778000	100	3,700-acre territory on Dominica's northeast coast	Last remaining indigenous territory in the Caribbean
10	Nevis Peak	Volcano	10	17.1500000	-62.5833000	985	Dormant stratovolcano forming the central peak of Nevis	Youngest volcanic center, potential for future activity
11	Boiling Lake	Volcanic Feature	6	15.3200000	-61.2933000	800	World's second-largest boiling lake	Unique hydrothermal feature, water temperature 82-92°C
12	Kalinago Territory	Cultural Region	6	15.4722000	-61.2778000	100	3,700-acre territory on Dominica's northeast coast	Last remaining indigenous territory in the Caribbean
13	Nevis Peak	Volcano	10	17.1500000	-62.5833000	985	Dormant stratovolcano forming the central peak of Nevis	Youngest volcanic center, potential for future activity
14	Boiling Lake	Volcanic Feature	6	15.3200000	-61.2933000	800	World's second-largest boiling lake	Unique hydrothermal feature, water temperature 82-92°C
15	Kalinago Territory	Cultural Region	6	15.4722000	-61.2778000	100	3,700-acre territory on Dominica's northeast coast	Last remaining indigenous territory in the Caribbean
\.


--
-- Data for Name: historical_figures; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.historical_figures (id, name, birth_year, death_year, country_id, contribution, legacy) FROM stdin;
1	Dame Mary Eugenia Charles	1919	2005	6	First female Prime Minister in the Caribbean, served 1980-1995	Trailblazer for women in politics
2	Alexander Hamilton	1755	1804	10	Founding Father of the United States, born in Charlestown, Nevis	His childhood home is now a museum
3	Robert Llewelyn Bradshaw	1916	1978	10	First Premier of Saint Kitts-Nevis-Anguilla	Father of the nation
4	Dame Mary Eugenia Charles	1919	2005	6	First female Prime Minister in the Caribbean, served 1980-1995	Trailblazer for women in politics
5	Alexander Hamilton	1755	1804	10	Founding Father of the United States, born in Charlestown, Nevis	His childhood home is now a museum
6	Robert Llewelyn Bradshaw	1916	1978	10	First Premier of Saint Kitts-Nevis-Anguilla	Father of the nation
7	Dame Mary Eugenia Charles	1919	2005	6	First female Prime Minister in the Caribbean, served 1980-1995	Trailblazer for women in politics
8	Alexander Hamilton	1755	1804	10	Founding Father of the United States, born in Charlestown, Nevis	His childhood home is now a museum
9	Robert Llewelyn Bradshaw	1916	1978	10	First Premier of Saint Kitts-Nevis-Anguilla	Father of the nation
10	Dame Mary Eugenia Charles	1919	2005	6	First female Prime Minister in the Caribbean, served 1980-1995	Trailblazer for women in politics
11	Alexander Hamilton	1755	1804	10	Founding Father of the United States, born in Charlestown, Nevis	His childhood home is now a museum
12	Robert Llewelyn Bradshaw	1916	1978	10	First Premier of Saint Kitts-Nevis-Anguilla	Father of the nation
13	Dame Mary Eugenia Charles	1919	2005	6	First female Prime Minister in the Caribbean, served 1980-1995	Trailblazer for women in politics
14	Alexander Hamilton	1755	1804	10	Founding Father of the United States, born in Charlestown, Nevis	His childhood home is now a museum
15	Robert Llewelyn Bradshaw	1916	1978	10	First Premier of Saint Kitts-Nevis-Anguilla	Father of the nation
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lessons (id, concept_id, title, content_html, creator_id, created_at, category, difficulty, estimated_time, points, grade_levels, description, objectives, prerequisites, tags, points_possible) FROM stdin;
1	2	Introduction to Adding Fractions	<h2>Adding Fractions with Same Denominators</h2><p>When fractions have the same denominator, we simply add the numerators and keep the denominator the same.</p><p><strong>Example:</strong> 1/4 + 2/4 = 3/4</p><div class="activity">Try it yourself: What is 2/5 + 1/5?</div>	2	2026-01-30 06:48:53.531795	General	beginner	30	50						100
2	2	Adding Fractions with Different Denominators	<h2>Finding Common Denominators</h2><p>To add fractions with different denominators, we first need to find a common denominator.</p><p><strong>Example:</strong> 1/2 + 1/4 = 2/4 + 1/4 = 3/4</p>	2	2026-01-30 06:48:53.531795	General	beginner	30	50						100
3	7	Finding the Main Idea in Stories	<h2>What is the Main Idea?</h2><p>The main idea is what the passage is mostly about. It's the central point the author wants you to understand.</p><p><strong>Steps to find the main idea:</strong></p><ol><li>Read the entire passage</li><li>Ask yourself: What is this mostly about?</li><li>Look for repeated words or ideas</li></ol>	2	2026-01-30 06:48:53.531795	General	beginner	30	50						100
4	12	Solving One-Step Equations	<h2>Introduction to Equations</h2><p>An equation is like a balanced scale. What you do to one side, you must do to the other.</p><p><strong>Example:</strong> x + 3 = 7</p><p>To solve: Subtract 3 from both sides</p><p>x = 4</p>	2	2026-01-30 06:48:53.531795	General	beginner	30	50						100
5	1	Introduction to Understanding Fractions	<div class="lesson-content">\n        <h2>Understanding Fractions</h2>\n        <p>This lesson introduces students to important concepts about Understanding Fractions in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
7	3	Introduction to Subtracting Fractions	<div class="lesson-content">\n        <h2>Subtracting Fractions</h2>\n        <p>This lesson introduces students to important concepts about Subtracting Fractions in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
8	4	Introduction to Decimal Place Value	<div class="lesson-content">\n        <h2>Decimal Place Value</h2>\n        <p>This lesson introduces students to important concepts about Decimal Place Value in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
9	5	Introduction to Converting Fractions to Decimals	<div class="lesson-content">\n        <h2>Converting Fractions to Decimals</h2>\n        <p>This lesson introduces students to important concepts about Converting Fractions to Decimals in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
10	6	Introduction to Comparing Fractions and Decimals	<div class="lesson-content">\n        <h2>Comparing Fractions and Decimals</h2>\n        <p>This lesson introduces students to important concepts about Comparing Fractions and Decimals in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
11	7	Introduction to Main Idea and Supporting Details	<div class="lesson-content">\n        <h2>Main Idea and Supporting Details</h2>\n        <p>This lesson introduces students to important concepts about Main Idea and Supporting Details in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
12	8	Introduction to Making Inferences	<div class="lesson-content">\n        <h2>Making Inferences</h2>\n        <p>This lesson introduces students to important concepts about Making Inferences in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
13	9	Introduction to Identifying Story Elements	<div class="lesson-content">\n        <h2>Identifying Story Elements</h2>\n        <p>This lesson introduces students to important concepts about Identifying Story Elements in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
14	10	Introduction to Summarizing Passages	<div class="lesson-content">\n        <h2>Summarizing Passages</h2>\n        <p>This lesson introduces students to important concepts about Summarizing Passages in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
15	11	Introduction to Introduction to Variables	<div class="lesson-content">\n        <h2>Introduction to Variables</h2>\n        <p>This lesson introduces students to important concepts about Introduction to Variables in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
16	12	Introduction to Solving Simple Equations	<div class="lesson-content">\n        <h2>Solving Simple Equations</h2>\n        <p>This lesson introduces students to important concepts about Solving Simple Equations in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
17	13	Introduction to Understanding Expressions	<div class="lesson-content">\n        <h2>Understanding Expressions</h2>\n        <p>This lesson introduces students to important concepts about Understanding Expressions in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
18	14	Introduction to Order of Operations	<div class="lesson-content">\n        <h2>Order of Operations</h2>\n        <p>This lesson introduces students to important concepts about Order of Operations in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
19	15	Introduction to The Kalinago People of Dominica	<div class="lesson-content">\n        <h2>The Kalinago People of Dominica</h2>\n        <p>This lesson introduces students to important concepts about The Kalinago People of Dominica in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		indigenous,history,culture,dominica	100
20	16	Introduction to Nevis Peak: A Dormant Volcano	<div class="lesson-content">\n        <h2>Nevis Peak: A Dormant Volcano</h2>\n        <p>This lesson introduces students to important concepts about Nevis Peak: A Dormant Volcano in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		science,geology,volcano	100
21	17	Introduction to Sugar Plantation Economy in Nevis	<div class="lesson-content">\n        <h2>Sugar Plantation Economy in Nevis</h2>\n        <p>This lesson introduces students to important concepts about Sugar Plantation Economy in Nevis in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
22	18	Introduction to Dominica's Volcanoes	<div class="lesson-content">\n        <h2>Dominica's Volcanoes</h2>\n        <p>This lesson introduces students to important concepts about Dominica's Volcanoes in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		science,geology,volcano	100
23	19	Introduction to Marine Ecosystems	<div class="lesson-content">\n        <h2>Marine Ecosystems</h2>\n        <p>This lesson introduces students to important concepts about Marine Ecosystems in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		caribbean,education	100
24	20	Introduction to Cultural Festivals	<div class="lesson-content">\n        <h2>Cultural Festivals</h2>\n        <p>This lesson introduces students to important concepts about Cultural Festivals in the Caribbean context.</p>\n        \n        <h3>Learning Objectives</h3>\n        <ul>\n            <li>Understand the basic concepts</li>\n            <li>Apply knowledge to real-world scenarios</li>\n            <li>Develop critical thinking skills</li>\n        </ul>\n        \n        <h3>Key Points</h3>\n        <p>Students will explore the historical, cultural, and scientific significance of this topic.</p>\n        \n        <div class="activity">\n            <h3>Activity</h3>\n            <p>Research and present findings about this topic in groups.</p>\n        </div>\n    </div>	2	2026-01-30 06:49:12.639909	General	beginner	45	75	3,4,5,6	Educational content for Caribbean students in grades 3-6.	1. Identify key concepts\n2. Apply learning to real situations\n3. Demonstrate understanding		culture,tradition,festival	100
105	1	Introduction to Counting	<h1>Let's Learn to Count!</h1>\n<p>Counting is one of the first math skills we learn. Today we'll practice counting from 1 to 10.</p>\n<h2>What is Counting?</h2>\n<p>Counting means saying numbers in order: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10!</p>\n<h2>Let's Practice!</h2>\n<p>Count these items:</p>\n<ul>\n  <li>🍎 How many apples? (3 apples)</li>\n  <li>⭐ How many stars? (5 stars)</li>\n  <li>🐟 How many fish? (7 fish)</li>\n</ul>\n<h2>Fun Activity</h2>\n<p>Find 5 objects in your room and count them aloud!</p>	2	2026-01-30 06:52:44.058898	Mathematics	beginner	15	50	1	Learn to count from 1 to 10 using fun objects and examples	Students will be able to count objects from 1 to 10 accurately	None - perfect for beginners	counting,numbers,math,basics	100
106	2	Counting to 20	<h1>Counting Higher Numbers</h1>\n<p>Now that you can count to 10, let's count even higher - all the way to 20!</p>\n<h2>Numbers 11-20</h2>\n<p>After 10 comes: 11, 12, 13, 14, 15, 16, 17, 18, 19, 20</p>\n<h2>Practice Time!</h2>\n<p>Let's count by pointing at each number:</p>\n<p>1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20!</p>\n<h2>Caribbean Fun Fact</h2>\n<p>Did you know Barbados has 11 parishes? Can you count them all?</p>	2	2026-01-30 06:52:44.058898	Mathematics	beginner	20	60	1,2	Extend counting skills from 10 to 20	Count from 1 to 20 and recognize numbers	Ability to count to 10	counting,numbers,teen numbers	100
107	3	Simple Addition	<h1>Adding Numbers Together</h1>\n<p>Addition means putting numbers together to find out how many you have in total!</p>\n<h2>What is Addition?</h2>\n<p>When we add, we use the + sign. Example: 2 + 3 = 5</p>\n<h2>Let's Try Some!</h2>\n<ul>\n  <li>1 + 1 = 2</li>\n  <li>2 + 2 = 4</li>\n  <li>3 + 2 = 5</li>\n  <li>4 + 1 = 5</li>\n</ul>\n<h2>Story Problem</h2>\n<p>Marcus has 2 mangoes 🥭. His friend gives him 3 more mangoes 🥭🥭🥭. How many mangoes does Marcus have now?</p>\n<p>Answer: 2 + 3 = 5 mangoes!</p>	2	2026-01-30 06:52:44.058898	Mathematics	beginner	25	75	1,2	Learn basic addition with numbers 1-10	Add single-digit numbers using objects and pictures	Counting to 10	addition,math,single digit,operations	100
108	5	The Alphabet Song	<h1>Learning Our ABCs</h1>\n<p>The alphabet has 26 letters. Let's learn them all!</p>\n<h2>The Alphabet</h2>\n<p><strong>A B C D E F G<br>H I J K L M N O P<br>Q R S T U V<br>W X Y and Z</strong></p>\n<h2>Capital and Lowercase</h2>\n<p>Each letter has two forms:</p>\n<ul>\n  <li>Capital (big): A B C</li>\n  <li>Lowercase (small): a b c</li>\n</ul>\n<h2>Fun Activity</h2>\n<p>Sing the alphabet song and point to each letter!</p>	2	2026-01-30 06:52:44.058898	English Language	beginner	20	50	1	Learn all 26 letters of the alphabet	Recite the alphabet and recognize letter shapes	None	alphabet,letters,literacy,reading	100
109	6	Vowels and Consonants	<h1>Special Letters: Vowels</h1>\n<p>Some letters are extra special - they're called vowels!</p>\n<h2>The Five Vowels</h2>\n<p>A, E, I, O, U - these are our vowels!</p>\n<h2>The Rest are Consonants</h2>\n<p>All the other letters (B, C, D, F, G, etc.) are consonants.</p>\n<h2>Caribbean Words Practice</h2>\n<p>Let's find vowels in Caribbean words:</p>\n<ul>\n  <li><strong>B A R B A D O S</strong> - How many vowels? (4: A, A, O)</li>\n  <li><strong>B E A C H</strong> - How many vowels? (2: E, A)</li>\n  <li><strong>S U N</strong> - How many vowels? (1: U)</li>\n</ul>	3	2026-01-30 06:52:44.058898	English Language	beginner	25	60	1,2	Identify vowels and consonants in words	Distinguish between vowels (A,E,I,O,U) and consonants	Know the alphabet	vowels,consonants,letters,phonics	100
110	7	What are Living Things?	<h1>Living vs Non-Living</h1>\n<p>Everything around us is either living or non-living. Let's learn the difference!</p>\n<h2>Living Things</h2>\n<p>Living things:</p>\n<ul>\n  <li>✅ Grow and change</li>\n  <li>✅ Need food and water</li>\n  <li>✅ Can have babies</li>\n  <li>✅ Breathe</li>\n</ul>\n<h2>Examples of Living Things</h2>\n<p>🌴 Palm trees, 🐠 Flying fish, 🦎 Lizards, 🌺 Hibiscus flowers, 🐒 Green monkeys</p>\n<h2>Non-Living Things</h2>\n<p>Non-living things don't grow, eat, or breathe:</p>\n<p>🪨 Rocks, 💧 Water, ☀️ Sunshine, 🏖️ Sand</p>\n<h2>Caribbean Activity</h2>\n<p>Look around! Name 5 living things you can see in Barbados!</p>	2	2026-01-30 06:52:44.058898	Science	beginner	30	70	1,2	Understand the characteristics of living things	Distinguish between living and non-living things	None	living things,science,nature,biology	100
111	8	Needs of Living Things	<h1>What Do Living Things Need?</h1>\n<p>All living things need certain things to survive!</p>\n<h2>The Basic Needs</h2>\n<ol>\n  <li><strong>Air</strong> - to breathe</li>\n  <li><strong>Water</strong> - to drink</li>\n  <li><strong>Food</strong> - for energy</li>\n  <li><strong>Shelter</strong> - a safe place to live</li>\n  <li><strong>Space</strong> - room to grow</li>\n</ol>\n<h2>Caribbean Examples</h2>\n<p><strong>Sea Turtles 🐢</strong></p>\n<ul>\n  <li>Air: Come to surface to breathe</li>\n  <li>Water: Live in the ocean</li>\n  <li>Food: Eat sea grass and jellyfish</li>\n  <li>Shelter: Sandy beaches for nesting</li>\n</ul>\n<p><strong>Coconut Trees 🥥</strong></p>\n<ul>\n  <li>Air: Get from atmosphere</li>\n  <li>Water: Roots drink from soil</li>\n  <li>Food: Make their own from sunlight!</li>\n  <li>Space: Need room for roots and branches</li>\n</ul>	2	2026-01-30 06:52:44.058898	Science	beginner	25	65	1,2	Learn what all living things need to survive	Identify the five basic needs of living things	Understanding of living vs non-living	needs,survival,habitats,animals,plants	100
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media (id, filename, filetype, file_category, url, lesson_id, game_id, uploaded_by, uploaded_at) FROM stdin;
1	lesson_1_image.jpg	image/jpeg	educational	https://example.com/media/lesson_1.jpg	1	\N	2	2026-01-30 06:49:12.671702
2	lesson_2_image.jpg	image/jpeg	educational	https://example.com/media/lesson_2.jpg	2	\N	2	2026-01-30 06:49:12.671702
3	lesson_3_image.jpg	image/jpeg	educational	https://example.com/media/lesson_3.jpg	3	\N	2	2026-01-30 06:49:12.671702
4	lesson_4_image.jpg	image/jpeg	educational	https://example.com/media/lesson_4.jpg	4	\N	2	2026-01-30 06:49:12.671702
5	lesson_5_image.jpg	image/jpeg	educational	https://example.com/media/lesson_5.jpg	5	\N	2	2026-01-30 06:49:12.671702
6	lesson_7_image.jpg	image/jpeg	educational	https://example.com/media/lesson_7.jpg	7	\N	2	2026-01-30 06:49:12.671702
7	lesson_8_image.jpg	image/jpeg	educational	https://example.com/media/lesson_8.jpg	8	\N	2	2026-01-30 06:49:12.671702
8	lesson_9_image.jpg	image/jpeg	educational	https://example.com/media/lesson_9.jpg	9	\N	2	2026-01-30 06:49:12.671702
9	lesson_10_image.jpg	image/jpeg	educational	https://example.com/media/lesson_10.jpg	10	\N	2	2026-01-30 06:49:12.671702
10	lesson_11_image.jpg	image/jpeg	educational	https://example.com/media/lesson_11.jpg	11	\N	2	2026-01-30 06:49:12.671702
11	lesson_1_image.jpg	image/jpeg	educational	https://example.com/media/lesson_1.jpg	1	\N	2	2026-01-30 06:49:53.939989
12	lesson_2_image.jpg	image/jpeg	educational	https://example.com/media/lesson_2.jpg	2	\N	2	2026-01-30 06:49:53.939989
13	lesson_3_image.jpg	image/jpeg	educational	https://example.com/media/lesson_3.jpg	3	\N	2	2026-01-30 06:49:53.939989
14	lesson_4_image.jpg	image/jpeg	educational	https://example.com/media/lesson_4.jpg	4	\N	2	2026-01-30 06:49:53.939989
15	lesson_5_image.jpg	image/jpeg	educational	https://example.com/media/lesson_5.jpg	5	\N	2	2026-01-30 06:49:53.939989
16	lesson_7_image.jpg	image/jpeg	educational	https://example.com/media/lesson_7.jpg	7	\N	2	2026-01-30 06:49:53.939989
17	lesson_8_image.jpg	image/jpeg	educational	https://example.com/media/lesson_8.jpg	8	\N	2	2026-01-30 06:49:53.939989
18	lesson_9_image.jpg	image/jpeg	educational	https://example.com/media/lesson_9.jpg	9	\N	2	2026-01-30 06:49:53.939989
19	lesson_10_image.jpg	image/jpeg	educational	https://example.com/media/lesson_10.jpg	10	\N	2	2026-01-30 06:49:53.939989
20	lesson_11_image.jpg	image/jpeg	educational	https://example.com/media/lesson_11.jpg	11	\N	2	2026-01-30 06:49:53.939989
21	lesson_1_image.jpg	image/jpeg	educational	https://example.com/media/lesson_1.jpg	1	\N	2	2026-01-30 06:51:31.933471
22	lesson_2_image.jpg	image/jpeg	educational	https://example.com/media/lesson_2.jpg	2	\N	2	2026-01-30 06:51:31.933471
23	lesson_3_image.jpg	image/jpeg	educational	https://example.com/media/lesson_3.jpg	3	\N	2	2026-01-30 06:51:31.933471
24	lesson_4_image.jpg	image/jpeg	educational	https://example.com/media/lesson_4.jpg	4	\N	2	2026-01-30 06:51:31.933471
25	lesson_5_image.jpg	image/jpeg	educational	https://example.com/media/lesson_5.jpg	5	\N	2	2026-01-30 06:51:31.933471
26	lesson_7_image.jpg	image/jpeg	educational	https://example.com/media/lesson_7.jpg	7	\N	2	2026-01-30 06:51:31.933471
27	lesson_8_image.jpg	image/jpeg	educational	https://example.com/media/lesson_8.jpg	8	\N	2	2026-01-30 06:51:31.933471
28	lesson_9_image.jpg	image/jpeg	educational	https://example.com/media/lesson_9.jpg	9	\N	2	2026-01-30 06:51:31.933471
29	lesson_10_image.jpg	image/jpeg	educational	https://example.com/media/lesson_10.jpg	10	\N	2	2026-01-30 06:51:31.933471
30	lesson_11_image.jpg	image/jpeg	educational	https://example.com/media/lesson_11.jpg	11	\N	2	2026-01-30 06:51:31.933471
31	lesson_1_image.jpg	image/jpeg	educational	https://example.com/media/lesson_1.jpg	1	\N	2	2026-01-30 06:52:05.238928
32	lesson_2_image.jpg	image/jpeg	educational	https://example.com/media/lesson_2.jpg	2	\N	2	2026-01-30 06:52:05.238928
33	lesson_3_image.jpg	image/jpeg	educational	https://example.com/media/lesson_3.jpg	3	\N	2	2026-01-30 06:52:05.238928
34	lesson_4_image.jpg	image/jpeg	educational	https://example.com/media/lesson_4.jpg	4	\N	2	2026-01-30 06:52:05.238928
35	lesson_5_image.jpg	image/jpeg	educational	https://example.com/media/lesson_5.jpg	5	\N	2	2026-01-30 06:52:05.238928
36	lesson_7_image.jpg	image/jpeg	educational	https://example.com/media/lesson_7.jpg	7	\N	2	2026-01-30 06:52:05.238928
37	lesson_8_image.jpg	image/jpeg	educational	https://example.com/media/lesson_8.jpg	8	\N	2	2026-01-30 06:52:05.238928
38	lesson_9_image.jpg	image/jpeg	educational	https://example.com/media/lesson_9.jpg	9	\N	2	2026-01-30 06:52:05.238928
39	lesson_10_image.jpg	image/jpeg	educational	https://example.com/media/lesson_10.jpg	10	\N	2	2026-01-30 06:52:05.238928
40	lesson_11_image.jpg	image/jpeg	educational	https://example.com/media/lesson_11.jpg	11	\N	2	2026-01-30 06:52:05.238928
41	lesson_1_image.jpg	image/jpeg	educational	https://example.com/media/lesson_1.jpg	1	\N	2	2026-01-30 06:52:38.793962
42	lesson_2_image.jpg	image/jpeg	educational	https://example.com/media/lesson_2.jpg	2	\N	2	2026-01-30 06:52:38.793962
43	lesson_3_image.jpg	image/jpeg	educational	https://example.com/media/lesson_3.jpg	3	\N	2	2026-01-30 06:52:38.793962
44	lesson_4_image.jpg	image/jpeg	educational	https://example.com/media/lesson_4.jpg	4	\N	2	2026-01-30 06:52:38.793962
45	lesson_5_image.jpg	image/jpeg	educational	https://example.com/media/lesson_5.jpg	5	\N	2	2026-01-30 06:52:38.793962
46	lesson_7_image.jpg	image/jpeg	educational	https://example.com/media/lesson_7.jpg	7	\N	2	2026-01-30 06:52:38.793962
47	lesson_8_image.jpg	image/jpeg	educational	https://example.com/media/lesson_8.jpg	8	\N	2	2026-01-30 06:52:38.793962
48	lesson_9_image.jpg	image/jpeg	educational	https://example.com/media/lesson_9.jpg	9	\N	2	2026-01-30 06:52:38.793962
49	lesson_10_image.jpg	image/jpeg	educational	https://example.com/media/lesson_10.jpg	10	\N	2	2026-01-30 06:52:38.793962
50	lesson_11_image.jpg	image/jpeg	educational	https://example.com/media/lesson_11.jpg	11	\N	2	2026-01-30 06:52:38.793962
\.


--
-- Data for Name: progress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.progress (id, user_id, lesson_id, score, completed, completed_at) FROM stdin;
1	1	1	85	t	2026-01-28 06:48:53.531795
2	1	1	92	t	2026-01-29 06:48:53.531795
3	1	1	65	f	\N
4	1	15	71	t	2026-01-16 03:56:14.826478
5	1	22	96	t	2026-01-12 18:49:12.338446
6	1	21	72	t	2026-01-12 20:55:11.616065
7	5	15	90	t	2026-01-27 18:14:22.179982
8	5	22	74	t	2026-01-27 01:06:19.849936
9	5	21	73	t	2026-01-15 04:35:13.669476
10	6	15	85	t	2026-01-17 06:52:34.966617
11	6	22	97	t	2026-01-05 16:22:53.050522
12	6	21	85	t	2026-01-20 13:58:54.745759
13	1	3	88	t	2026-01-06 20:57:56.236121
14	1	15	89	t	2026-01-27 05:58:54.985411
15	1	7	87	t	2026-01-06 12:30:21.377369
16	5	3	72	t	2026-01-08 21:24:13.099469
17	5	15	73	t	2026-01-19 02:53:09.170482
18	5	7	71	t	2026-01-20 10:35:59.08211
19	6	3	88	t	2026-01-28 00:54:19.75282
20	6	15	85	t	2026-01-01 16:40:26.441715
21	6	7	74	t	2026-01-26 15:16:12.72367
22	1	15	96	t	2026-01-22 10:26:35.484378
23	1	8	86	t	2026-01-27 05:56:18.553688
24	1	9	90	t	2026-01-03 01:43:27.739427
25	5	15	87	t	2026-01-25 18:43:13.714693
26	5	8	90	t	2026-01-13 11:51:58.430441
27	5	9	99	t	2026-01-06 07:23:14.731485
28	6	15	94	t	2026-01-13 16:16:01.562331
29	6	8	70	t	2026-01-03 23:12:23.972964
30	6	9	89	t	2026-01-17 10:22:58.470938
31	1	20	88	t	2026-01-10 16:25:54.727991
32	1	12	73	t	2026-01-06 16:08:36.455433
33	1	8	98	t	2026-01-29 21:20:14.190486
34	5	20	86	t	2026-01-11 23:59:17.937237
35	5	12	91	t	2026-01-09 03:54:02.645149
36	5	8	80	t	2026-01-04 20:34:34.250453
37	6	20	95	t	2026-01-03 02:06:19.029265
38	6	12	95	t	2026-01-13 21:25:21.438094
39	6	8	85	t	2026-01-29 05:46:54.484092
40	1	19	73	t	2026-01-12 06:17:20.51299
41	1	8	83	t	2025-12-31 17:55:05.592375
42	1	17	90	t	2026-01-17 05:29:31.933257
43	5	19	97	t	2026-01-18 09:19:26.097463
44	5	8	75	t	2026-01-24 04:14:44.157022
45	5	17	80	t	2026-01-06 09:26:39.089112
46	6	19	83	t	2026-01-08 14:21:45.051065
47	6	8	83	t	2026-01-27 11:49:56.596259
48	6	17	80	t	2026-01-21 17:27:11.80018
63	12	1	0	f	2026-01-30 12:26:15.559636
64	13	1	0	f	2026-01-30 13:25:30.058942
65	13	1	100	t	2026-01-30 13:29:32.255549
66	13	1	0	f	2026-01-30 13:29:42.743219
67	1	1	85	t	2026-01-28 13:37:34.235207
68	1	1	92	t	2026-01-29 13:37:34.235207
69	1	1	65	f	\N
70	13	19	0	f	2026-01-30 13:38:11.416096
71	13	21	0	f	2026-01-30 13:39:40.035656
72	13	14	0	f	2026-01-30 13:40:50.546355
73	13	19	0	f	2026-01-30 13:42:32.039347
74	13	19	0	f	2026-01-30 13:51:03.189086
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.quizzes (id, lesson_id, question, question_type, options, correct_answer, explanation, points, difficulty, time_limit, image_url, audio_url, tags) FROM stdin;
2	1	What is 2/5 + 1/5?	mc_single	["3/10", "3/5", "1/5", "2/5"]	3/5		10	beginner	0			
3	3	What is the main idea of a passage?	mc_single	["Details", "Title", "Central theme", "Conclusion"]	Central theme		10	beginner	0			
4	3	Where can you often find the main idea?	mc_single	["In the middle", "At the end", "At the beginning or end", "Never stated"]	At the beginning or end		10	beginner	0			
5	4	If x + 5 = 12, what is x?	mc_single	["5", "7", "12", "17"]	7		10	beginner	0			
6	4	Solve: y - 3 = 8	mc_single	["5", "8", "11", "24"]	11		10	beginner	0			
7	1	What is the main topic of this lesson about Adding Fractions?	mc_single	["Adding Fractions", "Something else", "Another topic", "Different subject"]	Adding Fractions	This lesson focuses on Adding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
8	2	What is the main topic of this lesson about Adding Fractions?	mc_single	["Adding Fractions", "Something else", "Another topic", "Different subject"]	Adding Fractions	This lesson focuses on Adding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
9	3	What is the main topic of this lesson about Main Idea and Supporting Details?	mc_single	["Main Idea and Supporting Details", "Something else", "Another topic", "Different subject"]	Main Idea and Supporting Details	This lesson focuses on Main Idea and Supporting Details, which is important for understanding Caribbean culture and history.	10	beginner	0			
10	4	What is the main topic of this lesson about Solving Simple Equations?	mc_single	["Solving Simple Equations", "Something else", "Another topic", "Different subject"]	Solving Simple Equations	This lesson focuses on Solving Simple Equations, which is important for understanding Caribbean culture and history.	10	beginner	0			
11	5	What is the main topic of this lesson about Understanding Fractions?	mc_single	["Understanding Fractions", "Something else", "Another topic", "Different subject"]	Understanding Fractions	This lesson focuses on Understanding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
12	7	What is the main topic of this lesson about Subtracting Fractions?	mc_single	["Subtracting Fractions", "Something else", "Another topic", "Different subject"]	Subtracting Fractions	This lesson focuses on Subtracting Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
13	8	What is the main topic of this lesson about Decimal Place Value?	mc_single	["Decimal Place Value", "Something else", "Another topic", "Different subject"]	Decimal Place Value	This lesson focuses on Decimal Place Value, which is important for understanding Caribbean culture and history.	10	beginner	0			
14	9	What is the main topic of this lesson about Converting Fractions to Decimals?	mc_single	["Converting Fractions to Decimals", "Something else", "Another topic", "Different subject"]	Converting Fractions to Decimals	This lesson focuses on Converting Fractions to Decimals, which is important for understanding Caribbean culture and history.	10	beginner	0			
15	10	What is the main topic of this lesson about Comparing Fractions and Decimals?	mc_single	["Comparing Fractions and Decimals", "Something else", "Another topic", "Different subject"]	Comparing Fractions and Decimals	This lesson focuses on Comparing Fractions and Decimals, which is important for understanding Caribbean culture and history.	10	beginner	0			
16	11	What is the main topic of this lesson about Main Idea and Supporting Details?	mc_single	["Main Idea and Supporting Details", "Something else", "Another topic", "Different subject"]	Main Idea and Supporting Details	This lesson focuses on Main Idea and Supporting Details, which is important for understanding Caribbean culture and history.	10	beginner	0			
17	12	What is the main topic of this lesson about Making Inferences?	mc_single	["Making Inferences", "Something else", "Another topic", "Different subject"]	Making Inferences	This lesson focuses on Making Inferences, which is important for understanding Caribbean culture and history.	10	beginner	0			
18	13	What is the main topic of this lesson about Identifying Story Elements?	mc_single	["Identifying Story Elements", "Something else", "Another topic", "Different subject"]	Identifying Story Elements	This lesson focuses on Identifying Story Elements, which is important for understanding Caribbean culture and history.	10	beginner	0			
20	15	What is the main topic of this lesson about Introduction to Variables?	mc_single	["Introduction to Variables", "Something else", "Another topic", "Different subject"]	Introduction to Variables	This lesson focuses on Introduction to Variables, which is important for understanding Caribbean culture and history.	10	beginner	0			
21	16	What is the main topic of this lesson about Solving Simple Equations?	mc_single	["Solving Simple Equations", "Something else", "Another topic", "Different subject"]	Solving Simple Equations	This lesson focuses on Solving Simple Equations, which is important for understanding Caribbean culture and history.	10	beginner	0			
22	17	What is the main topic of this lesson about Understanding Expressions?	mc_single	["Understanding Expressions", "Something else", "Another topic", "Different subject"]	Understanding Expressions	This lesson focuses on Understanding Expressions, which is important for understanding Caribbean culture and history.	10	beginner	0			
23	18	What is the main topic of this lesson about Order of Operations?	mc_single	["Order of Operations", "Something else", "Another topic", "Different subject"]	Order of Operations	This lesson focuses on Order of Operations, which is important for understanding Caribbean culture and history.	10	beginner	0			
24	19	What is the main topic of this lesson about The Kalinago People of Dominica?	mc_single	["The Kalinago People of Dominica", "Something else", "Another topic", "Different subject"]	The Kalinago People of Dominica	This lesson focuses on The Kalinago People of Dominica, which is important for understanding Caribbean culture and history.	10	beginner	0			
25	20	What is the main topic of this lesson about Nevis Peak: A Dormant Volcano?	mc_single	["Nevis Peak: A Dormant Volcano", "Something else", "Another topic", "Different subject"]	Nevis Peak: A Dormant Volcano	This lesson focuses on Nevis Peak: A Dormant Volcano, which is important for understanding Caribbean culture and history.	10	beginner	0			
26	21	What is the main topic of this lesson about Sugar Plantation Economy in Nevis?	mc_single	["Sugar Plantation Economy in Nevis", "Something else", "Another topic", "Different subject"]	Sugar Plantation Economy in Nevis	This lesson focuses on Sugar Plantation Economy in Nevis, which is important for understanding Caribbean culture and history.	10	beginner	0			
27	1	What is the main topic of this lesson about Adding Fractions?	mc_single	["Adding Fractions", "Something else", "Another topic", "Different subject"]	Adding Fractions	This lesson focuses on Adding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
28	2	What is the main topic of this lesson about Adding Fractions?	mc_single	["Adding Fractions", "Something else", "Another topic", "Different subject"]	Adding Fractions	This lesson focuses on Adding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
29	3	What is the main topic of this lesson about Main Idea and Supporting Details?	mc_single	["Main Idea and Supporting Details", "Something else", "Another topic", "Different subject"]	Main Idea and Supporting Details	This lesson focuses on Main Idea and Supporting Details, which is important for understanding Caribbean culture and history.	10	beginner	0			
30	4	What is the main topic of this lesson about Solving Simple Equations?	mc_single	["Solving Simple Equations", "Something else", "Another topic", "Different subject"]	Solving Simple Equations	This lesson focuses on Solving Simple Equations, which is important for understanding Caribbean culture and history.	10	beginner	0			
31	5	What is the main topic of this lesson about Understanding Fractions?	mc_single	["Understanding Fractions", "Something else", "Another topic", "Different subject"]	Understanding Fractions	This lesson focuses on Understanding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
32	7	What is the main topic of this lesson about Subtracting Fractions?	mc_single	["Subtracting Fractions", "Something else", "Another topic", "Different subject"]	Subtracting Fractions	This lesson focuses on Subtracting Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
33	8	What is the main topic of this lesson about Decimal Place Value?	mc_single	["Decimal Place Value", "Something else", "Another topic", "Different subject"]	Decimal Place Value	This lesson focuses on Decimal Place Value, which is important for understanding Caribbean culture and history.	10	beginner	0			
34	9	What is the main topic of this lesson about Converting Fractions to Decimals?	mc_single	["Converting Fractions to Decimals", "Something else", "Another topic", "Different subject"]	Converting Fractions to Decimals	This lesson focuses on Converting Fractions to Decimals, which is important for understanding Caribbean culture and history.	10	beginner	0			
35	10	What is the main topic of this lesson about Comparing Fractions and Decimals?	mc_single	["Comparing Fractions and Decimals", "Something else", "Another topic", "Different subject"]	Comparing Fractions and Decimals	This lesson focuses on Comparing Fractions and Decimals, which is important for understanding Caribbean culture and history.	10	beginner	0			
36	11	What is the main topic of this lesson about Main Idea and Supporting Details?	mc_single	["Main Idea and Supporting Details", "Something else", "Another topic", "Different subject"]	Main Idea and Supporting Details	This lesson focuses on Main Idea and Supporting Details, which is important for understanding Caribbean culture and history.	10	beginner	0			
37	12	What is the main topic of this lesson about Making Inferences?	mc_single	["Making Inferences", "Something else", "Another topic", "Different subject"]	Making Inferences	This lesson focuses on Making Inferences, which is important for understanding Caribbean culture and history.	10	beginner	0			
38	13	What is the main topic of this lesson about Identifying Story Elements?	mc_single	["Identifying Story Elements", "Something else", "Another topic", "Different subject"]	Identifying Story Elements	This lesson focuses on Identifying Story Elements, which is important for understanding Caribbean culture and history.	10	beginner	0			
39	14	What is the main topic of this lesson about Summarizing Passages?	mc_single	["Summarizing Passages", "Something else", "Another topic", "Different subject"]	Summarizing Passages	This lesson focuses on Summarizing Passages, which is important for understanding Caribbean culture and history.	10	beginner	0			
40	15	What is the main topic of this lesson about Introduction to Variables?	mc_single	["Introduction to Variables", "Something else", "Another topic", "Different subject"]	Introduction to Variables	This lesson focuses on Introduction to Variables, which is important for understanding Caribbean culture and history.	10	beginner	0			
41	16	What is the main topic of this lesson about Solving Simple Equations?	mc_single	["Solving Simple Equations", "Something else", "Another topic", "Different subject"]	Solving Simple Equations	This lesson focuses on Solving Simple Equations, which is important for understanding Caribbean culture and history.	10	beginner	0			
42	17	What is the main topic of this lesson about Understanding Expressions?	mc_single	["Understanding Expressions", "Something else", "Another topic", "Different subject"]	Understanding Expressions	This lesson focuses on Understanding Expressions, which is important for understanding Caribbean culture and history.	10	beginner	0			
43	18	What is the main topic of this lesson about Order of Operations?	mc_single	["Order of Operations", "Something else", "Another topic", "Different subject"]	Order of Operations	This lesson focuses on Order of Operations, which is important for understanding Caribbean culture and history.	10	beginner	0			
44	19	What is the main topic of this lesson about The Kalinago People of Dominica?	mc_single	["The Kalinago People of Dominica", "Something else", "Another topic", "Different subject"]	The Kalinago People of Dominica	This lesson focuses on The Kalinago People of Dominica, which is important for understanding Caribbean culture and history.	10	beginner	0			
45	20	What is the main topic of this lesson about Nevis Peak: A Dormant Volcano?	mc_single	["Nevis Peak: A Dormant Volcano", "Something else", "Another topic", "Different subject"]	Nevis Peak: A Dormant Volcano	This lesson focuses on Nevis Peak: A Dormant Volcano, which is important for understanding Caribbean culture and history.	10	beginner	0			
46	21	What is the main topic of this lesson about Sugar Plantation Economy in Nevis?	mc_single	["Sugar Plantation Economy in Nevis", "Something else", "Another topic", "Different subject"]	Sugar Plantation Economy in Nevis	This lesson focuses on Sugar Plantation Economy in Nevis, which is important for understanding Caribbean culture and history.	10	beginner	0			
47	1	What is the main topic of this lesson about Adding Fractions?	mc_single	["Adding Fractions", "Something else", "Another topic", "Different subject"]	Adding Fractions	This lesson focuses on Adding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
48	2	What is the main topic of this lesson about Adding Fractions?	mc_single	["Adding Fractions", "Something else", "Another topic", "Different subject"]	Adding Fractions	This lesson focuses on Adding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
49	3	What is the main topic of this lesson about Main Idea and Supporting Details?	mc_single	["Main Idea and Supporting Details", "Something else", "Another topic", "Different subject"]	Main Idea and Supporting Details	This lesson focuses on Main Idea and Supporting Details, which is important for understanding Caribbean culture and history.	10	beginner	0			
50	4	What is the main topic of this lesson about Solving Simple Equations?	mc_single	["Solving Simple Equations", "Something else", "Another topic", "Different subject"]	Solving Simple Equations	This lesson focuses on Solving Simple Equations, which is important for understanding Caribbean culture and history.	10	beginner	0			
51	5	What is the main topic of this lesson about Understanding Fractions?	mc_single	["Understanding Fractions", "Something else", "Another topic", "Different subject"]	Understanding Fractions	This lesson focuses on Understanding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
52	7	What is the main topic of this lesson about Subtracting Fractions?	mc_single	["Subtracting Fractions", "Something else", "Another topic", "Different subject"]	Subtracting Fractions	This lesson focuses on Subtracting Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
53	8	What is the main topic of this lesson about Decimal Place Value?	mc_single	["Decimal Place Value", "Something else", "Another topic", "Different subject"]	Decimal Place Value	This lesson focuses on Decimal Place Value, which is important for understanding Caribbean culture and history.	10	beginner	0			
54	9	What is the main topic of this lesson about Converting Fractions to Decimals?	mc_single	["Converting Fractions to Decimals", "Something else", "Another topic", "Different subject"]	Converting Fractions to Decimals	This lesson focuses on Converting Fractions to Decimals, which is important for understanding Caribbean culture and history.	10	beginner	0			
55	10	What is the main topic of this lesson about Comparing Fractions and Decimals?	mc_single	["Comparing Fractions and Decimals", "Something else", "Another topic", "Different subject"]	Comparing Fractions and Decimals	This lesson focuses on Comparing Fractions and Decimals, which is important for understanding Caribbean culture and history.	10	beginner	0			
56	11	What is the main topic of this lesson about Main Idea and Supporting Details?	mc_single	["Main Idea and Supporting Details", "Something else", "Another topic", "Different subject"]	Main Idea and Supporting Details	This lesson focuses on Main Idea and Supporting Details, which is important for understanding Caribbean culture and history.	10	beginner	0			
57	12	What is the main topic of this lesson about Making Inferences?	mc_single	["Making Inferences", "Something else", "Another topic", "Different subject"]	Making Inferences	This lesson focuses on Making Inferences, which is important for understanding Caribbean culture and history.	10	beginner	0			
58	13	What is the main topic of this lesson about Identifying Story Elements?	mc_single	["Identifying Story Elements", "Something else", "Another topic", "Different subject"]	Identifying Story Elements	This lesson focuses on Identifying Story Elements, which is important for understanding Caribbean culture and history.	10	beginner	0			
59	14	What is the main topic of this lesson about Summarizing Passages?	mc_single	["Summarizing Passages", "Something else", "Another topic", "Different subject"]	Summarizing Passages	This lesson focuses on Summarizing Passages, which is important for understanding Caribbean culture and history.	10	beginner	0			
60	15	What is the main topic of this lesson about Introduction to Variables?	mc_single	["Introduction to Variables", "Something else", "Another topic", "Different subject"]	Introduction to Variables	This lesson focuses on Introduction to Variables, which is important for understanding Caribbean culture and history.	10	beginner	0			
61	16	What is the main topic of this lesson about Solving Simple Equations?	mc_single	["Solving Simple Equations", "Something else", "Another topic", "Different subject"]	Solving Simple Equations	This lesson focuses on Solving Simple Equations, which is important for understanding Caribbean culture and history.	10	beginner	0			
62	17	What is the main topic of this lesson about Understanding Expressions?	mc_single	["Understanding Expressions", "Something else", "Another topic", "Different subject"]	Understanding Expressions	This lesson focuses on Understanding Expressions, which is important for understanding Caribbean culture and history.	10	beginner	0			
63	18	What is the main topic of this lesson about Order of Operations?	mc_single	["Order of Operations", "Something else", "Another topic", "Different subject"]	Order of Operations	This lesson focuses on Order of Operations, which is important for understanding Caribbean culture and history.	10	beginner	0			
65	20	What is the main topic of this lesson about Nevis Peak: A Dormant Volcano?	mc_single	["Nevis Peak: A Dormant Volcano", "Something else", "Another topic", "Different subject"]	Nevis Peak: A Dormant Volcano	This lesson focuses on Nevis Peak: A Dormant Volcano, which is important for understanding Caribbean culture and history.	10	beginner	0			
66	21	What is the main topic of this lesson about Sugar Plantation Economy in Nevis?	mc_single	["Sugar Plantation Economy in Nevis", "Something else", "Another topic", "Different subject"]	Sugar Plantation Economy in Nevis	This lesson focuses on Sugar Plantation Economy in Nevis, which is important for understanding Caribbean culture and history.	10	beginner	0			
67	1	What is the main topic of this lesson about Adding Fractions?	mc_single	["Adding Fractions", "Something else", "Another topic", "Different subject"]	Adding Fractions	This lesson focuses on Adding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
68	2	What is the main topic of this lesson about Adding Fractions?	mc_single	["Adding Fractions", "Something else", "Another topic", "Different subject"]	Adding Fractions	This lesson focuses on Adding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
69	3	What is the main topic of this lesson about Main Idea and Supporting Details?	mc_single	["Main Idea and Supporting Details", "Something else", "Another topic", "Different subject"]	Main Idea and Supporting Details	This lesson focuses on Main Idea and Supporting Details, which is important for understanding Caribbean culture and history.	10	beginner	0			
70	4	What is the main topic of this lesson about Solving Simple Equations?	mc_single	["Solving Simple Equations", "Something else", "Another topic", "Different subject"]	Solving Simple Equations	This lesson focuses on Solving Simple Equations, which is important for understanding Caribbean culture and history.	10	beginner	0			
71	5	What is the main topic of this lesson about Understanding Fractions?	mc_single	["Understanding Fractions", "Something else", "Another topic", "Different subject"]	Understanding Fractions	This lesson focuses on Understanding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
72	7	What is the main topic of this lesson about Subtracting Fractions?	mc_single	["Subtracting Fractions", "Something else", "Another topic", "Different subject"]	Subtracting Fractions	This lesson focuses on Subtracting Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
73	8	What is the main topic of this lesson about Decimal Place Value?	mc_single	["Decimal Place Value", "Something else", "Another topic", "Different subject"]	Decimal Place Value	This lesson focuses on Decimal Place Value, which is important for understanding Caribbean culture and history.	10	beginner	0			
74	9	What is the main topic of this lesson about Converting Fractions to Decimals?	mc_single	["Converting Fractions to Decimals", "Something else", "Another topic", "Different subject"]	Converting Fractions to Decimals	This lesson focuses on Converting Fractions to Decimals, which is important for understanding Caribbean culture and history.	10	beginner	0			
75	10	What is the main topic of this lesson about Comparing Fractions and Decimals?	mc_single	["Comparing Fractions and Decimals", "Something else", "Another topic", "Different subject"]	Comparing Fractions and Decimals	This lesson focuses on Comparing Fractions and Decimals, which is important for understanding Caribbean culture and history.	10	beginner	0			
76	11	What is the main topic of this lesson about Main Idea and Supporting Details?	mc_single	["Main Idea and Supporting Details", "Something else", "Another topic", "Different subject"]	Main Idea and Supporting Details	This lesson focuses on Main Idea and Supporting Details, which is important for understanding Caribbean culture and history.	10	beginner	0			
77	12	What is the main topic of this lesson about Making Inferences?	mc_single	["Making Inferences", "Something else", "Another topic", "Different subject"]	Making Inferences	This lesson focuses on Making Inferences, which is important for understanding Caribbean culture and history.	10	beginner	0			
78	13	What is the main topic of this lesson about Identifying Story Elements?	mc_single	["Identifying Story Elements", "Something else", "Another topic", "Different subject"]	Identifying Story Elements	This lesson focuses on Identifying Story Elements, which is important for understanding Caribbean culture and history.	10	beginner	0			
79	14	What is the main topic of this lesson about Summarizing Passages?	mc_single	["Summarizing Passages", "Something else", "Another topic", "Different subject"]	Summarizing Passages	This lesson focuses on Summarizing Passages, which is important for understanding Caribbean culture and history.	10	beginner	0			
80	15	What is the main topic of this lesson about Introduction to Variables?	mc_single	["Introduction to Variables", "Something else", "Another topic", "Different subject"]	Introduction to Variables	This lesson focuses on Introduction to Variables, which is important for understanding Caribbean culture and history.	10	beginner	0			
81	16	What is the main topic of this lesson about Solving Simple Equations?	mc_single	["Solving Simple Equations", "Something else", "Another topic", "Different subject"]	Solving Simple Equations	This lesson focuses on Solving Simple Equations, which is important for understanding Caribbean culture and history.	10	beginner	0			
82	17	What is the main topic of this lesson about Understanding Expressions?	mc_single	["Understanding Expressions", "Something else", "Another topic", "Different subject"]	Understanding Expressions	This lesson focuses on Understanding Expressions, which is important for understanding Caribbean culture and history.	10	beginner	0			
83	18	What is the main topic of this lesson about Order of Operations?	mc_single	["Order of Operations", "Something else", "Another topic", "Different subject"]	Order of Operations	This lesson focuses on Order of Operations, which is important for understanding Caribbean culture and history.	10	beginner	0			
84	19	What is the main topic of this lesson about The Kalinago People of Dominica?	mc_single	["The Kalinago People of Dominica", "Something else", "Another topic", "Different subject"]	The Kalinago People of Dominica	This lesson focuses on The Kalinago People of Dominica, which is important for understanding Caribbean culture and history.	10	beginner	0			
85	20	What is the main topic of this lesson about Nevis Peak: A Dormant Volcano?	mc_single	["Nevis Peak: A Dormant Volcano", "Something else", "Another topic", "Different subject"]	Nevis Peak: A Dormant Volcano	This lesson focuses on Nevis Peak: A Dormant Volcano, which is important for understanding Caribbean culture and history.	10	beginner	0			
86	21	What is the main topic of this lesson about Sugar Plantation Economy in Nevis?	mc_single	["Sugar Plantation Economy in Nevis", "Something else", "Another topic", "Different subject"]	Sugar Plantation Economy in Nevis	This lesson focuses on Sugar Plantation Economy in Nevis, which is important for understanding Caribbean culture and history.	10	beginner	0			
87	1	What is the main topic of this lesson about Adding Fractions?	mc_single	["Adding Fractions", "Something else", "Another topic", "Different subject"]	Adding Fractions	This lesson focuses on Adding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
88	2	What is the main topic of this lesson about Adding Fractions?	mc_single	["Adding Fractions", "Something else", "Another topic", "Different subject"]	Adding Fractions	This lesson focuses on Adding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
89	3	What is the main topic of this lesson about Main Idea and Supporting Details?	mc_single	["Main Idea and Supporting Details", "Something else", "Another topic", "Different subject"]	Main Idea and Supporting Details	This lesson focuses on Main Idea and Supporting Details, which is important for understanding Caribbean culture and history.	10	beginner	0			
90	4	What is the main topic of this lesson about Solving Simple Equations?	mc_single	["Solving Simple Equations", "Something else", "Another topic", "Different subject"]	Solving Simple Equations	This lesson focuses on Solving Simple Equations, which is important for understanding Caribbean culture and history.	10	beginner	0			
91	5	What is the main topic of this lesson about Understanding Fractions?	mc_single	["Understanding Fractions", "Something else", "Another topic", "Different subject"]	Understanding Fractions	This lesson focuses on Understanding Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
92	7	What is the main topic of this lesson about Subtracting Fractions?	mc_single	["Subtracting Fractions", "Something else", "Another topic", "Different subject"]	Subtracting Fractions	This lesson focuses on Subtracting Fractions, which is important for understanding Caribbean culture and history.	10	beginner	0			
93	8	What is the main topic of this lesson about Decimal Place Value?	mc_single	["Decimal Place Value", "Something else", "Another topic", "Different subject"]	Decimal Place Value	This lesson focuses on Decimal Place Value, which is important for understanding Caribbean culture and history.	10	beginner	0			
94	9	What is the main topic of this lesson about Converting Fractions to Decimals?	mc_single	["Converting Fractions to Decimals", "Something else", "Another topic", "Different subject"]	Converting Fractions to Decimals	This lesson focuses on Converting Fractions to Decimals, which is important for understanding Caribbean culture and history.	10	beginner	0			
95	10	What is the main topic of this lesson about Comparing Fractions and Decimals?	mc_single	["Comparing Fractions and Decimals", "Something else", "Another topic", "Different subject"]	Comparing Fractions and Decimals	This lesson focuses on Comparing Fractions and Decimals, which is important for understanding Caribbean culture and history.	10	beginner	0			
96	11	What is the main topic of this lesson about Main Idea and Supporting Details?	mc_single	["Main Idea and Supporting Details", "Something else", "Another topic", "Different subject"]	Main Idea and Supporting Details	This lesson focuses on Main Idea and Supporting Details, which is important for understanding Caribbean culture and history.	10	beginner	0			
97	12	What is the main topic of this lesson about Making Inferences?	mc_single	["Making Inferences", "Something else", "Another topic", "Different subject"]	Making Inferences	This lesson focuses on Making Inferences, which is important for understanding Caribbean culture and history.	10	beginner	0			
98	13	What is the main topic of this lesson about Identifying Story Elements?	mc_single	["Identifying Story Elements", "Something else", "Another topic", "Different subject"]	Identifying Story Elements	This lesson focuses on Identifying Story Elements, which is important for understanding Caribbean culture and history.	10	beginner	0			
99	14	What is the main topic of this lesson about Summarizing Passages?	mc_single	["Summarizing Passages", "Something else", "Another topic", "Different subject"]	Summarizing Passages	This lesson focuses on Summarizing Passages, which is important for understanding Caribbean culture and history.	10	beginner	0			
100	15	What is the main topic of this lesson about Introduction to Variables?	mc_single	["Introduction to Variables", "Something else", "Another topic", "Different subject"]	Introduction to Variables	This lesson focuses on Introduction to Variables, which is important for understanding Caribbean culture and history.	10	beginner	0			
101	16	What is the main topic of this lesson about Solving Simple Equations?	mc_single	["Solving Simple Equations", "Something else", "Another topic", "Different subject"]	Solving Simple Equations	This lesson focuses on Solving Simple Equations, which is important for understanding Caribbean culture and history.	10	beginner	0			
102	17	What is the main topic of this lesson about Understanding Expressions?	mc_single	["Understanding Expressions", "Something else", "Another topic", "Different subject"]	Understanding Expressions	This lesson focuses on Understanding Expressions, which is important for understanding Caribbean culture and history.	10	beginner	0			
103	18	What is the main topic of this lesson about Order of Operations?	mc_single	["Order of Operations", "Something else", "Another topic", "Different subject"]	Order of Operations	This lesson focuses on Order of Operations, which is important for understanding Caribbean culture and history.	10	beginner	0			
104	19	What is the main topic of this lesson about The Kalinago People of Dominica?	mc_single	["The Kalinago People of Dominica", "Something else", "Another topic", "Different subject"]	The Kalinago People of Dominica	This lesson focuses on The Kalinago People of Dominica, which is important for understanding Caribbean culture and history.	10	beginner	0			
105	20	What is the main topic of this lesson about Nevis Peak: A Dormant Volcano?	mc_single	["Nevis Peak: A Dormant Volcano", "Something else", "Another topic", "Different subject"]	Nevis Peak: A Dormant Volcano	This lesson focuses on Nevis Peak: A Dormant Volcano, which is important for understanding Caribbean culture and history.	10	beginner	0			
106	21	What is the main topic of this lesson about Sugar Plantation Economy in Nevis?	mc_single	["Sugar Plantation Economy in Nevis", "Something else", "Another topic", "Different subject"]	Sugar Plantation Economy in Nevis	This lesson focuses on Sugar Plantation Economy in Nevis, which is important for understanding Caribbean culture and history.	10	beginner	0			
1	1	What is 1/2 + 1/4?	mc_single	"1/4", "3/4", "1/6", "2/4"	3/4		10	beginner	0			
128	1	What is 1/2 + 1/4?	mc_single	["1/4", "3/4", "1/6", "2/4"]	3/4		10	beginner	0			
129	1	What is 2/5 + 1/5?	mc_single	["3/10", "3/5", "1/5", "2/5"]	3/5		10	beginner	0			
130	3	What is the main idea of a passage?	mc_single	["Details", "Title", "Central theme", "Conclusion"]	Central theme		10	beginner	0			
131	3	Where can you often find the main idea?	mc_single	["In the middle", "At the end", "At the beginning or end", "Never stated"]	At the beginning or end		10	beginner	0			
132	4	If x + 5 = 12, what is x?	mc_single	["5", "7", "12", "17"]	7		10	beginner	0			
133	4	Solve: y - 3 = 8	mc_single	["5", "8", "11", "24"]	11		10	beginner	0			
19	14	What is the main topic of this lesson about Summarizing Passages?	mc_single	"The Kalinago People of Dominica, Something else, Another topic, Different subject"	Summarizing Passages	This lesson focuses on Summarizing Passages, which is important for understanding Caribbean culture and history.	10	beginner	0			
64	19	What is the main topic of this lesson about The Kalinago People of Dominica?	mc_single	The Kalinago People of Dominica, Something else, Another topic, Different subject	The Kalinago People of Dominica	This lesson focuses on The Kalinago People of Dominica, which is important for understanding Caribbean culture and history.	10	beginner	0			
\.


--
-- Data for Name: rewards; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rewards (id, name, points_required, creator_id, for_user_id) FROM stdin;
1	Bronze Badge	50	3	\N
2	Silver Badge	150	3	\N
3	Gold Badge	300	3	\N
4	Platinum Badge	500	3	\N
5	Math Master Certificate	200	3	\N
6	Reading Champion Trophy	250	3	\N
7	Problem Solver Award	400	3	\N
14	Bronze Badge	50	3	\N
15	Silver Badge	150	3	\N
16	Gold Badge	300	3	\N
17	Platinum Badge	500	3	\N
18	Math Master Certificate	200	3	\N
19	Reading Champion Trophy	250	3	\N
20	Problem Solver Award	400	3	\N
\.


--
-- Data for Name: school_years; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.school_years (id, country_id, year_label) FROM stdin;
1	1	Grade 1
2	1	Grade 2
3	1	Grade 3
4	1	Grade 4
5	1	Grade 5
6	1	Grade 6
7	2	Grade 1
8	2	Grade 2
9	2	Grade 3
10	2	Grade 4
11	2	Grade 5
12	2	Grade 6
13	3	Grade 1
14	3	Grade 2
15	3	Grade 3
16	3	Grade 4
17	3	Grade 5
18	3	Grade 6
19	4	Grade 1
20	4	Grade 2
21	4	Grade 3
22	4	Grade 4
23	4	Grade 5
24	4	Grade 6
25	5	Grade 1
26	5	Grade 2
27	5	Grade 3
28	5	Grade 4
29	5	Grade 5
30	5	Grade 6
31	6	Grade 1
32	6	Grade 2
33	6	Grade 3
34	6	Grade 4
35	6	Grade 5
36	6	Grade 6
38	10	Grade 3
40	10	Grade 4
42	10	Grade 5
44	10	Grade 6
45	6	Form 1
46	10	Form 1
47	6	Form 2
48	10	Form 2
49	6	Form 3
50	10	Form 3
107	1	Year 1
108	1	Year 2
109	1	Year 3
110	1	Year 4
111	1	Year 5
112	1	Year 6
149	10	Grade 1
150	10	Grade 2
\.


--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schools (id, name, island_id, address, created_at) FROM stdin;
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subjects (id, name) FROM stdin;
1	Mathematics
2	English Language
3	Science
4	Social Studies
5	Creative Arts
10	History
11	Geography
17	Technology
18	Communication Studies
19	Caribbean Studies
\.


--
-- Data for Name: terms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.terms (id, school_year_id, term_number, title) FROM stdin;
1	1	1	Term 1 - September to December
2	1	2	Term 2 - January to March
3	1	3	Term 3 - April to June
4	2	1	Term 1 - September to December
5	2	2	Term 2 - January to March
6	2	3	Term 3 - April to June
7	3	1	Term 1 - September to December
8	3	2	Term 2 - January to March
9	3	3	Term 3 - April to June
10	4	1	Term 1 - September to December
11	4	2	Term 2 - January to March
12	4	3	Term 3 - April to June
13	5	1	Term 1 - September to December
14	5	2	Term 2 - January to March
15	5	3	Term 3 - April to June
16	6	1	Term 1 - September to December
17	6	2	Term 2 - January to March
18	6	3	Term 3 - April to June
19	7	1	Term 1 - September to December
20	7	2	Term 2 - January to March
21	7	3	Term 3 - April to June
22	8	1	Term 1 - September to December
23	8	2	Term 2 - January to March
24	8	3	Term 3 - April to June
25	9	1	Term 1 - September to December
26	9	2	Term 2 - January to March
27	9	3	Term 3 - April to June
28	10	1	Term 1 - September to December
29	10	2	Term 2 - January to March
30	10	3	Term 3 - April to June
31	11	1	Term 1 - September to December
32	11	2	Term 2 - January to March
33	11	3	Term 3 - April to June
34	12	1	Term 1 - September to December
35	12	2	Term 2 - January to March
36	12	3	Term 3 - April to June
37	13	1	Term 1 - September to December
38	13	2	Term 2 - January to March
39	13	3	Term 3 - April to June
40	14	1	Term 1 - September to December
41	14	2	Term 2 - January to March
42	14	3	Term 3 - April to June
43	15	1	Term 1 - September to December
44	15	2	Term 2 - January to March
45	15	3	Term 3 - April to June
46	16	1	Term 1 - September to December
47	16	2	Term 2 - January to March
48	16	3	Term 3 - April to June
49	17	1	Term 1 - September to December
50	17	2	Term 2 - January to March
51	17	3	Term 3 - April to June
52	18	1	Term 1 - September to December
53	18	2	Term 2 - January to March
54	18	3	Term 3 - April to June
55	19	1	Term 1 - September to December
56	19	2	Term 2 - January to March
57	19	3	Term 3 - April to June
58	20	1	Term 1 - September to December
59	20	2	Term 2 - January to March
60	20	3	Term 3 - April to June
61	21	1	Term 1 - September to December
62	21	2	Term 2 - January to March
63	21	3	Term 3 - April to June
64	22	1	Term 1 - September to December
65	22	2	Term 2 - January to March
66	22	3	Term 3 - April to June
67	23	1	Term 1 - September to December
68	23	2	Term 2 - January to March
69	23	3	Term 3 - April to June
70	24	1	Term 1 - September to December
71	24	2	Term 2 - January to March
72	24	3	Term 3 - April to June
73	25	1	Term 1 - September to December
74	25	2	Term 2 - January to March
75	25	3	Term 3 - April to June
76	26	1	Term 1 - September to December
77	26	2	Term 2 - January to March
78	26	3	Term 3 - April to June
79	27	1	Term 1 - September to December
80	27	2	Term 2 - January to March
81	27	3	Term 3 - April to June
82	28	1	Term 1 - September to December
83	28	2	Term 2 - January to March
84	28	3	Term 3 - April to June
85	29	1	Term 1 - September to December
86	29	2	Term 2 - January to March
87	29	3	Term 3 - April to June
88	30	1	Term 1 - September to December
89	30	2	Term 2 - January to March
90	30	3	Term 3 - April to June
91	31	1	Term 1 - September to December
92	31	2	Term 2 - January to March
93	31	3	Term 3 - April to June
94	32	1	Term 1 - September to December
95	32	2	Term 2 - January to March
96	32	3	Term 3 - April to June
97	33	1	Term 1 - September to December
98	33	2	Term 2 - January to March
99	33	3	Term 3 - April to June
100	34	1	Term 1 - September to December
101	34	2	Term 2 - January to March
102	34	3	Term 3 - April to June
103	35	1	Term 1 - September to December
104	35	2	Term 2 - January to March
105	35	3	Term 3 - April to June
106	36	1	Term 1 - September to December
107	36	2	Term 2 - January to March
108	36	3	Term 3 - April to June
217	38	1	Term 1
218	38	2	Term 2
219	38	3	Term 3
220	40	1	Term 1
221	40	2	Term 2
222	40	3	Term 3
223	42	1	Term 1
224	42	2	Term 2
225	42	3	Term 3
226	44	1	Term 1
227	44	2	Term 2
228	44	3	Term 3
229	45	1	Term 1
230	45	2	Term 2
231	45	3	Term 3
232	46	1	Term 1
233	46	2	Term 2
234	46	3	Term 3
235	47	1	Term 1
236	47	2	Term 2
237	47	3	Term 3
238	48	1	Term 1
239	48	2	Term 2
240	48	3	Term 3
241	49	1	Term 1
242	49	2	Term 2
243	49	3	Term 3
244	50	1	Term 1
245	50	2	Term 2
246	50	3	Term 3
938	107	1	Term 1 - September to December
939	107	2	Term 2 - January to March
940	107	3	Term 3 - April to June
941	108	1	Term 1 - September to December
942	108	2	Term 2 - January to March
943	108	3	Term 3 - April to June
944	109	1	Term 1 - September to December
945	109	2	Term 2 - January to March
946	109	3	Term 3 - April to June
947	110	1	Term 1 - September to December
948	110	2	Term 2 - January to March
949	110	3	Term 3 - April to June
950	111	1	Term 1 - September to December
951	111	2	Term 2 - January to March
952	111	3	Term 3 - April to June
953	112	1	Term 1 - September to December
954	112	2	Term 2 - January to March
955	112	3	Term 3 - April to June
956	149	1	Term 1 - September to December
957	149	2	Term 2 - January to March
958	149	3	Term 3 - April to June
959	150	1	Term 1 - September to December
960	150	2	Term 2 - January to March
961	150	3	Term 3 - April to June
\.


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.topics (id, curriculum_subject_id, term_id, title) FROM stdin;
1	197	85	Operations with Fractions
2	197	85	Fractions and Decimals
3	197	86	Geometry - Shapes and Angles
4	197	86	Basic Algebra
5	197	87	Problem Solving
6	197	87	Measurement and Data
7	198	85	Vocabulary Building
8	198	85	Reading Comprehension
9	198	86	Creative Writing
10	198	86	Grammar and Punctuation
11	198	87	Poetry and Literature
12	198	87	Research and Presentation
13	1	1	Practical Mathematics
14	2	1	English Language Fundamentals
15	3	1	Natural Sciences of the Caribbean
16	4	1	Caribbean Society and Culture
17	5	1	Creative Arts Fundamentals
18	6	1	Caribbean History and Culture
19	7	1	Island Geography
20	43	4	Practical Mathematics
21	44	4	English Language Fundamentals
22	45	4	Natural Sciences of the Caribbean
23	46	4	Caribbean Society and Culture
24	47	4	Creative Arts Fundamentals
25	48	4	Caribbean History and Culture
26	49	4	Island Geography
27	85	7	Practical Mathematics
28	86	7	English Language Fundamentals
29	87	7	Natural Sciences of the Caribbean
30	88	7	Caribbean Society and Culture
31	89	7	Creative Arts Fundamentals
32	90	7	Caribbean History and Culture
113	1	1	Numbers and Counting
114	1	1	Basic Addition
115	2	1	Reading Basics
116	2	1	Letter Recognition
117	3	1	Living Things
118	3	1	Plants and Animals
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, hashed_password, role, avatar, points, badges, level, streak, parent_id, created_at, display_name) FROM stdin;
4	parent	parent@onan.shop	$argon2id$v=19$m=65536,t=3,p=4$kLKWUsqZ8/7/f29tbW0NAQ$Vgr4LeIuxO0p0/7WAM7eL9ePsRKNIhZxVCZ35GjsxOE	parent	default_avatar.png	0		Explorer	0	\N	2026-01-30 06:48:53.531795	\N
12	student1	stdent@quest.lab	$argon2id$v=19$m=65536,t=3,p=4$Rai1dm7NWetdK2UsxVirtQ$/QRfteOwZyKF/Fjf8MX1kP10vGYItJAdIg93XOekqkk	student	default_avatar.png	0		1	0	\N	2026-01-30 12:25:25.067568	\N
3	admin	admin@onan.shop	$argon2id$v=19$m=65536,t=3,p=4$Rai1dm7NWetdK2UsxVirtQ$/QRfteOwZyKF/Fjf8MX1kP10vGYItJAdIg93XOekqkk	admin	default_avatar.png	1000		Legend	50	\N	2026-01-30 06:48:53.531795	\N
13	kim	kim@onan.shop	$argon2id$v=19$m=65536,t=3,p=4$Xus9hxBCyNkb43zPOedcCw$K6eY1CkrYbfb9Wk31UA+WzL7o6V3sCKnWSFBA36B33o	student	default_avatar.png	0		1	0	\N	2026-01-30 13:18:54.688008	\N
2	teach	teach@onan.shop	$argon2id$v=19$m=65536,t=3,p=4$kLKWUsqZ8/7/f29tbW0NAQ$Vgr4LeIuxO0p0/7WAM7eL9ePsRKNIhZxVCZ35GjsxOE	teacher	default_avatar.png	0		Master	0	\N	2026-01-30 06:48:53.531795	\N
5	student	student@onan.shop	$argon2id$v=19$m=65536,t=3,p=4$kLKWUsqZ8/7/f29tbW0NAQ$Vgr4LeIuxO0p0/7WAM7eL9ePsRKNIhZxVCZ35GjsxOE	student	default_avatar.png	150		Explorer	5	4	2026-01-30 06:48:53.531795	\N
6	student3	student3@onan.shop	$argon2id$v=19$m=65536,t=3,p=4$kLKWUsqZ8/7/f29tbW0NAQ$Vgr4LeIuxO0p0/7WAM7eL9ePsRKNIhZxVCZ35GjsxOE	student	default_avatar.png	300		Adventurer	10	4	2026-01-30 06:48:53.531795	\N
1	testi	testi@onan.shop	$argon2id$v=19$m=65536,t=3,p=4$kLKWUsqZ8/7/f29tbW0NAQ$Vgr4LeIuxO0p0/7WAM7eL9ePsRKNIhZxVCZ35GjsxOE	student	default_avatar.png	1634		Explorer	0	4	2026-01-30 06:48:53.531795	\N
\.


--
-- Name: assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assignments_id_seq', 1, false);


--
-- Name: concepts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.concepts_id_seq', 236, true);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.countries_id_seq', 22, true);


--
-- Name: cultural_practices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cultural_practices_id_seq', 15, true);


--
-- Name: curriculum_subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.curriculum_subjects_id_seq', 1073, true);


--
-- Name: game_engines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.game_engines_id_seq', 36, true);


--
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.games_id_seq', 8, true);


--
-- Name: geographical_features_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.geographical_features_id_seq', 15, true);


--
-- Name: historical_figures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.historical_figures_id_seq', 15, true);


--
-- Name: lessons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lessons_id_seq', 115, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_id_seq', 50, true);


--
-- Name: progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.progress_id_seq', 74, true);


--
-- Name: quizzes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quizzes_id_seq', 133, true);


--
-- Name: rewards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rewards_id_seq', 20, true);


--
-- Name: school_years_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.school_years_id_seq', 154, true);


--
-- Name: schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.schools_id_seq', 1, false);


--
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subjects_id_seq', 57, true);


--
-- Name: terms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.terms_id_seq', 961, true);


--
-- Name: topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.topics_id_seq', 130, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 19, true);


--
-- Name: assignments assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);


--
-- Name: concepts concepts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concepts
    ADD CONSTRAINT concepts_pkey PRIMARY KEY (id);


--
-- Name: concepts concepts_topic_id_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concepts
    ADD CONSTRAINT concepts_topic_id_title_key UNIQUE (topic_id, title);


--
-- Name: countries countries_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_name_key UNIQUE (name);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: cultural_practices cultural_practices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cultural_practices
    ADD CONSTRAINT cultural_practices_pkey PRIMARY KEY (id);


--
-- Name: curriculum_subjects curriculum_subjects_country_id_subject_id_grade_level_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum_subjects
    ADD CONSTRAINT curriculum_subjects_country_id_subject_id_grade_level_key UNIQUE (country_id, subject_id, grade_level);


--
-- Name: curriculum_subjects curriculum_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum_subjects
    ADD CONSTRAINT curriculum_subjects_pkey PRIMARY KEY (id);


--
-- Name: game_engines game_engines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.game_engines
    ADD CONSTRAINT game_engines_pkey PRIMARY KEY (id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: geographical_features geographical_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.geographical_features
    ADD CONSTRAINT geographical_features_pkey PRIMARY KEY (id);


--
-- Name: historical_figures historical_figures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historical_figures
    ADD CONSTRAINT historical_figures_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_title_key UNIQUE (title);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: progress progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_pkey PRIMARY KEY (id);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- Name: rewards rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_pkey PRIMARY KEY (id);


--
-- Name: school_years school_years_country_id_year_label_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_years
    ADD CONSTRAINT school_years_country_id_year_label_key UNIQUE (country_id, year_label);


--
-- Name: school_years school_years_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_years
    ADD CONSTRAINT school_years_pkey PRIMARY KEY (id);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_name_key UNIQUE (name);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: terms terms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms
    ADD CONSTRAINT terms_pkey PRIMARY KEY (id);


--
-- Name: terms terms_school_year_id_term_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms
    ADD CONSTRAINT terms_school_year_id_term_number_key UNIQUE (school_year_id, term_number);


--
-- Name: topics topics_curriculum_subject_id_term_id_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_curriculum_subject_id_term_id_title_key UNIQUE (curriculum_subject_id, term_id, title);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_media_lesson; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_lesson ON public.media USING btree (lesson_id);


--
-- Name: idx_progress_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_progress_user ON public.progress USING btree (user_id);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: ix_assignments_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_assignments_id ON public.assignments USING btree (id);


--
-- Name: assignments assignments_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: assignments assignments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: assignments assignments_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: concepts concepts_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.concepts
    ADD CONSTRAINT concepts_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON DELETE CASCADE;


--
-- Name: cultural_practices cultural_practices_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cultural_practices
    ADD CONSTRAINT cultural_practices_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;


--
-- Name: curriculum_subjects curriculum_subjects_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum_subjects
    ADD CONSTRAINT curriculum_subjects_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;


--
-- Name: curriculum_subjects curriculum_subjects_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.curriculum_subjects
    ADD CONSTRAINT curriculum_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


--
-- Name: games games_game_engine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_game_engine_id_fkey FOREIGN KEY (game_engine_id) REFERENCES public.game_engines(id) ON DELETE CASCADE;


--
-- Name: games games_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: geographical_features geographical_features_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.geographical_features
    ADD CONSTRAINT geographical_features_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;


--
-- Name: historical_figures historical_figures_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historical_figures
    ADD CONSTRAINT historical_figures_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_concept_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_concept_id_fkey FOREIGN KEY (concept_id) REFERENCES public.concepts(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: media media_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE;


--
-- Name: media media_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: media media_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: progress progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: progress progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress
    ADD CONSTRAINT progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: quizzes quizzes_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: rewards rewards_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: rewards rewards_for_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_for_user_id_fkey FOREIGN KEY (for_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: school_years school_years_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_years
    ADD CONSTRAINT school_years_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;


--
-- Name: schools schools_island_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_island_id_fkey FOREIGN KEY (island_id) REFERENCES public.countries(id);


--
-- Name: terms terms_school_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.terms
    ADD CONSTRAINT terms_school_year_id_fkey FOREIGN KEY (school_year_id) REFERENCES public.school_years(id) ON DELETE CASCADE;


--
-- Name: topics topics_curriculum_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_curriculum_subject_id_fkey FOREIGN KEY (curriculum_subject_id) REFERENCES public.curriculum_subjects(id) ON DELETE CASCADE;


--
-- Name: topics topics_term_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_term_id_fkey FOREIGN KEY (term_id) REFERENCES public.terms(id) ON DELETE CASCADE;


--
-- Name: users users_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict aNxk1FQeJedaDSrH6sZTYTO9b02FAJy1vSFTyWOtEzxDzVVJ0Xq57Xd7oBUuMht

