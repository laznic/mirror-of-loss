create extension if not exists "postgis" with schema "extensions";


create table "public"."memories" (
    "id" bigint generated by default as identity not null,
    "image" text,
    "created_at" timestamp with time zone not null default now(),
    "player_id" uuid,
    "group_id" integer
);


alter table "public"."memories" enable row level security;

create table "public"."memory_groups" (
    "id" integer generated by default as identity not null,
    "memory" text not null,
    "position" geography(PointZ,4326) not null,
    "created_at" date default now(),
    "player_id" uuid
);


alter table "public"."memory_groups" enable row level security;

CREATE UNIQUE INDEX memories_pkey ON public.memories USING btree (id);

CREATE INDEX memory_group_pos_index ON public.memory_groups USING gist ("position");

CREATE UNIQUE INDEX memory_groups_pkey ON public.memory_groups USING btree (id);

alter table "public"."memories" add constraint "memories_pkey" PRIMARY KEY using index "memories_pkey";

alter table "public"."memory_groups" add constraint "memory_groups_pkey" PRIMARY KEY using index "memory_groups_pkey";

alter table "public"."memories" add constraint "memories_group_id_fkey" FOREIGN KEY (group_id) REFERENCES memory_groups(id) ON DELETE CASCADE not valid;

alter table "public"."memories" validate constraint "memories_group_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.insert_memory_group(memory text, player_id uuid)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
DECLARE
  random_coordinates geometry;
  id bigint;
BEGIN

  LOOP
    -- Generate random coordinates
    random_coordinates := ST_MakePoint(
      random() * 180 - 90,
      random() * 180 - 90,
      random() * 180 - 90
    );

    -- Check for intersecting geometries
    IF NOT EXISTS (
      SELECT 1
      FROM memory_groups
      WHERE ST_Intersects(position, random_coordinates)
    ) THEN
      -- Insert and return data
      INSERT INTO memory_groups (memory, position, player_id)
      VALUES (memory, random_coordinates, player_id)
      RETURNING memory_groups.id into id;

      RETURN id;
      EXIT;
    END IF;
  END LOOP;

END;
$function$
;

CREATE OR REPLACE FUNCTION public.memory_groups_with_position()
 RETURNS TABLE(id integer, memory text, created_at date, x double precision, y double precision, z double precision)
 LANGUAGE sql
AS $function$
   select id, memory, created_at, st_x(position::geometry) as x, st_y(position::geometry) as y, st_z(position::geometry) as z from public.memory_groups;
$function$
;

grant delete on table "public"."memories" to "anon";

grant insert on table "public"."memories" to "anon";

grant references on table "public"."memories" to "anon";

grant select on table "public"."memories" to "anon";

grant trigger on table "public"."memories" to "anon";

grant truncate on table "public"."memories" to "anon";

grant update on table "public"."memories" to "anon";

grant delete on table "public"."memories" to "authenticated";

grant insert on table "public"."memories" to "authenticated";

grant references on table "public"."memories" to "authenticated";

grant select on table "public"."memories" to "authenticated";

grant trigger on table "public"."memories" to "authenticated";

grant truncate on table "public"."memories" to "authenticated";

grant update on table "public"."memories" to "authenticated";

grant delete on table "public"."memories" to "service_role";

grant insert on table "public"."memories" to "service_role";

grant references on table "public"."memories" to "service_role";

grant select on table "public"."memories" to "service_role";

grant trigger on table "public"."memories" to "service_role";

grant truncate on table "public"."memories" to "service_role";

grant update on table "public"."memories" to "service_role";

grant delete on table "public"."memory_groups" to "anon";

grant insert on table "public"."memory_groups" to "anon";

grant references on table "public"."memory_groups" to "anon";

grant select on table "public"."memory_groups" to "anon";

grant trigger on table "public"."memory_groups" to "anon";

grant truncate on table "public"."memory_groups" to "anon";

grant update on table "public"."memory_groups" to "anon";

grant delete on table "public"."memory_groups" to "authenticated";

grant insert on table "public"."memory_groups" to "authenticated";

grant references on table "public"."memory_groups" to "authenticated";

grant select on table "public"."memory_groups" to "authenticated";

grant trigger on table "public"."memory_groups" to "authenticated";

grant truncate on table "public"."memory_groups" to "authenticated";

grant update on table "public"."memory_groups" to "authenticated";

grant delete on table "public"."memory_groups" to "service_role";

grant insert on table "public"."memory_groups" to "service_role";

grant references on table "public"."memory_groups" to "service_role";

grant select on table "public"."memory_groups" to "service_role";

grant trigger on table "public"."memory_groups" to "service_role";

grant truncate on table "public"."memory_groups" to "service_role";

grant update on table "public"."memory_groups" to "service_role";

create policy "Enable read access for all users"
on "public"."memories"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."memory_groups"
as permissive
for select
to public
using (true);