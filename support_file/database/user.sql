-- public."user" definition

-- Drop table

-- DROP TABLE public."user";

CREATE TABLE public."user" (
	id serial4 NOT NULL,
	username varchar(50) NOT NULL,
	email varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"createdAt" date NULL,
	"updatedAt" date NULL,
	CONSTRAINT user_pk PRIMARY KEY (id)
);