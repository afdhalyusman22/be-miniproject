-- public.pond definition

-- Drop table

-- DROP TABLE public.pond;

CREATE TABLE public.pond (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	is_deleted bool NULL DEFAULT false,
	deleted_at timestamp NULL,
	CONSTRAINT pond_pkey PRIMARY KEY (id)
);