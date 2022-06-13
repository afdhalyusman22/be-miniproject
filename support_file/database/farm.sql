-- public.farm definition

-- Drop table

-- DROP TABLE public.farm;

CREATE TABLE public.farm (
	id serial4 NOT NULL,
	"name" varchar(255) NOT NULL,
	created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	is_deleted bool NULL DEFAULT false,
	deleted_at timestamp NULL,
	CONSTRAINT farm_pkey PRIMARY KEY (id)
);