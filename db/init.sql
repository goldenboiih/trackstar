-- Adminer 4.8.1 PostgreSQL 13.11 dump

\connect "db";

DROP TABLE IF EXISTS "answers";
DROP SEQUENCE IF EXISTS answers_id_seq;
CREATE SEQUENCE answers_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."answers" (
    "id" integer DEFAULT nextval('answers_id_seq') NOT NULL,
    "query_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "date" date DEFAULT now() NOT NULL,
    "answer" integer,
    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "answers" ("id", "query_id", "user_id", "date", "answer") VALUES
(8,	19,	1,	'2023-08-03',	3),
(9,	20,	1,	'2023-08-03',	3),
(10,	20,	1,	'2023-08-03',	3),
(11,	20,	1,	'2023-08-03',	5),
(12,	22,	1,	'2023-08-03',	5),
(13,	19,	1,	'2023-08-03',	1),
(14,	19,	1,	'2023-08-03',	2),
(15,	20,	1,	'2023-08-03',	3),
(16,	20,	1,	'2023-08-03',	4),
(17,	20,	1,	'2023-08-03',	4),
(18,	20,	1,	'2023-08-03',	4),
(19,	20,	1,	'2023-08-03',	5),
(20,	24,	1,	'2023-08-04',	3),
(21,	24,	1,	'2023-08-04',	3),
(22,	22,	1,	'2023-08-04',	3),
(23,	24,	1,	'2023-08-04',	3),
(24,	24,	1,	'2023-08-04',	5),
(25,	23,	1,	'2023-08-04',	5),
(26,	22,	1,	'2023-08-04',	4),
(27,	19,	1,	'2023-08-04',	5),
(28,	24,	1,	'2023-08-04',	4),
(29,	24,	1,	'2023-08-04',	5);

DROP TABLE IF EXISTS "queries";
DROP SEQUENCE IF EXISTS queries_id_seq;
CREATE SEQUENCE queries_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."queries" (
    "id" integer DEFAULT nextval('queries_id_seq') NOT NULL,
    "question" character varying(256) NOT NULL,
    "answered" boolean DEFAULT false NOT NULL
) WITH (oids = false);

INSERT INTO "queries" ("id", "question", "answered") VALUES
(20,	'How are you feeling right now?',	'f'),
(24,	'How do you rate your current energy levels?',	'f'),
(22,	'How was your day?',	'f'),
(23,	'Do you feel wrist pain?',	'f'),
(25,	'What is the meaning of life?',	'f'),
(19,	'How did you sleep last night?',	'f');

DROP TABLE IF EXISTS "users";
DROP SEQUENCE IF EXISTS user_id_seq;
CREATE SEQUENCE user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."users" (
    "id" integer DEFAULT nextval('user_id_seq') NOT NULL,
    "username" text NOT NULL,
    "expo_token" text NOT NULL,
    CONSTRAINT "constraint_name" UNIQUE ("expo_token"),
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "users" ("id", "username", "expo_token") VALUES
(1,	'kenny',	'ExponentPushToken[4kZFDTP83BXWMwKFnF8ZRy]'),
(3,	'anas',	'ExponentPushToken[nsfvcTJJYEaCICR7kfTtLG]');

-- 2023-08-10 18:34:50.449183+00
