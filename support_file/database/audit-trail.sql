-- public.audit_trail definition

-- Drop table

-- DROP TABLE public.audit_trail;

CREATE TABLE public.audit_trail (
	id serial4 NOT NULL,
	username varchar(255) NOT NULL,
	endpoint text NOT NULL,
	created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT audit_trail_pkey PRIMARY KEY (id)
);