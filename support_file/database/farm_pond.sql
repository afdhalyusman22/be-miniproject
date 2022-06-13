-- public.farm_pond definition

-- Drop table

-- DROP TABLE public.farm_pond;

CREATE TABLE public.farm_pond (
	id serial4 NOT NULL,
	farm_id int4 NOT NULL,
	pond_id int4 NOT NULL,
	created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX farm_pond_id_uindex ON public.farm_pond USING btree (id);