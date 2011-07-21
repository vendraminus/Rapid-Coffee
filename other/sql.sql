/*	RapidCoffee is a free, opensource dynamic internet forum.
	(C) Copyright 2011.

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


--create schema depression;
CREATE PROCEDURAL LANGUAGE plpgsql;

--set search_path to depression,public;
set search_path to public;

CREATE TABLE public.addthis(
	channelid integer,
	sms_ss varchar(100),
	at_xt varchar(100),
	date timestamp default now(),
	userid integer,
	anon boolean,
	ip varchar(100)
);

CREATE TABLE public.emails(
	email varchar(100),
	lang varchar(10),
	date timestamp default now()
);
create or replace function TG_emails() returns trigger as
$$
 DECLARE r RECORD;
 BEGIN

  SELECT count(*) as C INTO r FROM emails WHERE email=NEW.email;  
  IF r.C > 0 THEN
   RETURN NULL;
  ELSE
   RETURN NEW;
  END IF;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_emails BEFORE INSERT on public.emails FOR EACH ROW EXECUTE PROCEDURE TG_emails();


CREATE TABLE public.anon(
	id serial primary key,
	fingerprint char(32),
	ip char(15),
	nickname varchar(15),
	fingerprintdebug text,
	date timestamp default now(),
	bancounter integer default 0,
	lastban_time timestamp,
	likes integer default 0,
	dislikes integer default 0,
	lang varchar(10)
);

CREATE TABLE public.user_camefrom(
	id serial primary key,
	name varchar(100)
);
INSERT INTO public.user_camefrom(id,name) values (0,'RapidCoffee');

CREATE TABLE public."user"(
	id serial primary key,
	email varchar(100) not null,
	password char(128) not null,
	nickname varchar(15) not null,
	date timestamp default now(),
	credits integer default 3,
	--avatar oid,
	hasavatar boolean,
	avatar_update_time timestamp,
	bancounter integer default 0,
	lastban_time timestamp,
	likes integer default 0,
	dislikes integer default 0,
	signature varchar(200),
	lang varchar(10) default 'en_us',
	firsttime boolean default true,
	emailvalidated boolean default false,
	camefrom integer references user_camefrom(id) default 0,
	email_mytopics integer default 1,
	email_mychannels integer default 2,
	email_followedtopics integer default 1,
	email_followedchannels integer default 2
);
CREATE UNIQUE INDEX user_uniqueemail ON "user" (lower(email));
CREATE UNIQUE INDEX user_nickname ON "user" (lower(nickname));

INSERT INTO "user" (email, password, nickname, credits, lang) values ('admin@rapidcoffee.com','ed2c5e919b13fa43a8f88560dd77d4792e9af28a1fee0e85154bf6dd341e371ac2d80fc393aa60d93a6b7eaad845c1136fd6d13029458ef6bf11006f183f78cc','RapidCoffee',99999,'en_us');
INSERT INTO "user" (email, password, nickname) values ('a','a','Anon');
INSERT INTO "user" (email, password, nickname) values ('b','b','admin');

--INSERT INTO "user" (email, password, nickname, credits, lang) values ('danilo.horta@gmail.com','3fde5fbf7602fd4a38b7b3df4a0c7f33949c731d87da212f5dbaea005c8eb4189c4c8c6625e914639478b309b78771e35fae915f01b688843ffda5155b038389','horta',99999,'en_us');

CREATE OR REPLACE VIEW public.vw_user AS select "user".*, floor(extract(epoch from avatar_update_time)) AS unix_avatar_update_time, extract(epoch from date) as unixdate, user_camefrom.name as camefrom_name from "user" left join user_camefrom on "user".camefrom = user_camefrom.id;


CREATE TABLE public."unconfirmed_user"(
	id serial primary key,
	email varchar(100) not null,
	password char(128) not null,
	nickname varchar(15) not null,
	date timestamp default now(),
	credits integer default 3,
	--avatar oid,
	signature varchar(200),
	lang varchar(10)
);


CREATE TABLE public.message(
	id serial primary key,
	user_to_id integer references "user"(id) not null,		--somente usuario cadastrado pode ter (receber) mensagens
	user_from_id integer,
	user_from_anon boolean,
	subject varchar(200),
	msg text,
	date timestamp default now(),
	read_time timestamp,
	isoff integer default 0
);

---------================== TG - PUNICAO PARA MUITOS DISLIKES
create or replace function TG_user_isoff() returns trigger as
$$
 BEGIN
  IF NEW.likes + NEW.dislikes > 10 AND (10000*NEW.dislikes)/(NEW.likes+NEW.dislikes)>7500 THEN
	NEW.likes=0;
	NEW.dislikes=0;
	NEW.bancounter=NEW.bancounter+1;
	NEW.lastban_time=now();
  END IF;  
  RETURN NEW;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_user_isoff BEFORE UPDATE on "user" FOR EACH ROW EXECUTE PROCEDURE TG_user_isoff();

create or replace function TG_anon_isoff() returns trigger as
$$
 BEGIN
  IF NEW.likes + NEW.dislikes > 10 AND (10000*NEW.dislikes)/(NEW.likes+NEW.dislikes)>7500 THEN
	NEW.likes=0;
	NEW.dislikes=0;
	NEW.bancounter=NEW.bancounter+1;
	NEW.lastban_time=now();
  END IF;  
  RETURN NEW;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_anon_isoff BEFORE UPDATE on anon FOR EACH ROW EXECUTE PROCEDURE TG_anon_isoff();


------================ VIEWS =================------
CREATE OR REPLACE VIEW vw_message AS SELECT *,(read_time is not null) as read,extract(epoch from date) as unixdate,extract(epoch from read_time) as unixread_time FROM message;
















--------------------------------------------------
--------------------------------------------------
----==== DIFERENTES SCHEMA COPIA DAKI PRA BAIXO!!!
drop schema beta;

create schema beta;
set search_path to beta,public;


CREATE TABLE topic(
	id serial primary key,
	--channelid integer references channel(id), --eh colocado la em baixo num alter table
	subject varchar(100) not null,
	msg text not null,
	date timestamp default now(),
	updatetime timestamp default null,
	utdate timestamp default now(),	--up topic date
	orderid serial,		--ordem que deve ser mostrado o topico (atualizado se mexe no utdate pelo trigger)
	userid integer,
	anon boolean,
	isoff integer default 0,
	lang varchar(10) default 'en_us',
	likes integer default 0,
	dislikes integer default 0,
	views integer default 0,
	replies integer default 0,
	counter integer default 1 	-- contador de modificacoes
);

INSERT INTO topic(subject,msg,userid,anon) values ('RapidCoffee Beta Version','We are under beta version.\nPlease, help us with comments and sugestions about the site.\n\nThank you!',1,false);
INSERT INTO topic(subject,msg,userid,anon,lang) values ('RapidCoffee Versão Beta','Estamos em versão beta.\nPor favor, ajude-nos com comentários e sugestões.\n\nObrigado!',1,false,'pt_br');

CREATE TABLE email_topic_user(
	id serial primary key,
	topicid integer references topic(id) on delete cascade,
	userid integer references "user"(id) on delete cascade,
	counter integer,
	date timestamp default now()
);

CREATE TABLE post(
	id serial primary key,
	topicid integer references topic(id) on delete cascade,
	userid integer,
	anon boolean,
	post text,
	date timestamp default now(),
	updatetime timestamp default null,
	likes integer default 0,
	dislikes integer default 0,
	isoff integer default 0
);

CREATE TABLE follow_topic_user(
	id serial primary key,
	topicid integer references topic(id) on delete cascade,
	userid integer,
	anon boolean,
	counter integer default 0,	--checar se has unviewed posts
	date timestamp default now(),
	UNIQUE(topicid,userid,anon)
);

CREATE TABLE channel(
	id serial primary key,
	name varchar(100) not null,
	urlname varchar(100) not null,
	description text,
	userid integer, --sera sempre usuario cadastrado!!!
	asktofollow boolean default false,
	perm_member smallint default 3,
	perm_reguser smallint default 2,
	perm_anon smallint default 1,
	date timestamp default now(),
	haslogo boolean,
	logo_update_time timestamp,
	lang varchar(10) default 'en_us',
	isoff integer default 0,
	pp_name varchar(100),	--Pre-processed name
	pp_description text	--Pre-processed description
);
CREATE UNIQUE INDEX channel_urlname on channel (lower(urlname));
CREATE UNIQUE INDEX channel_name ON channel (lower(name));
ALTER TABLE topic ADD channelid integer references channel(id) default null;
INSERT INTO channel(name,urlname,userid) values ('rapidcoffee','rapidcoffee',1);
INSERT INTO channel(name,urlname,userid) values ('beta','beta',1);
UPDATE topic SET channelid=1;

CREATE TABLE unconfirmed_follow_channel_user(
	id serial primary key,
	channelid integer references channel(id) on delete cascade,
	userid integer,
	anon boolean,
	askmessageid integer references message(id),
	answermessageid integer references message(id),
	follow_channel_user_id integer
);

CREATE TABLE follow_channel_user(
	id serial primary key,
	channelid integer references channel(id) on delete cascade,
	userid integer,
	anon boolean,
	counter integer default 0,
	date timestamp default now(),
	UNIQUE(channelid,userid,anon)
);

CREATE TABLE topicld(
	id serial primary key,
	topicid integer references topic(id) on delete cascade,
	userid integer references "user"(id) on delete cascade,
	date timestamp default now(),
	liked boolean,
	UNIQUE(topicid,userid)
);
CREATE INDEX topicld_topicidliked ON topicld (topicid,liked);

CREATE TABLE postld(
	id serial primary key,
	postid integer references post(id) on delete cascade,
	userid integer references "user"(id) on delete cascade,
	date timestamp default now(),
	liked boolean,
	UNIQUE(postid,userid)
);
CREATE INDEX postld_postidliked ON postld (postid,liked);

CREATE TABLE topicview(
	id serial primary key,
	topicid integer references topic(id) on delete cascade,
	userid integer,
	anon boolean,
	date timestamp default now(),
	counter integer,
	UNIQUE (topicid,userid,anon)
);

--------------------------- VIEWS
CREATE OR REPLACE VIEW vw_topic AS SELECT *,extract(epoch from date) as unixdate,extract(epoch from updatetime) as unixupdatetime, utdate>date as upped FROM topic;
CREATE OR REPLACE VIEW vw_topic_notoff AS SELECT * FROM vw_topic WHERE isoff=0;
CREATE OR REPLACE VIEW vw_channel AS SELECT channel.*,COALESCE((select count(follow_channel_user.*) from follow_channel_user where channel.id = follow_channel_user.channelid group by channel.id),0) as qt_followers, floor(extract(epoch from logo_update_time)) as unix_logo_update_time FROM channel;
--------------------------- TRIGGERS

create or replace function TG_follow_topic_user_notduplicate() returns trigger as
$$
 DECLARE r RECORD;
 BEGIN
  SELECT count(*) as c INTO r FROM follow_topic_user where topicid=NEW.topicid and userid=NEW.userid and anon=NEW.anon;
  IF r.c>0 THEN
   RETURN NULL;
  END IF;
  RETURN NEW;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_follow_topic_user_notduplicate BEFORE INSERT on follow_topic_user FOR EACH ROW EXECUTE PROCEDURE TG_follow_topic_user_notduplicate();

create or replace function TG_follow_channel_user_notduplicate() returns trigger as
$$
 DECLARE r RECORD;
 BEGIN
  SELECT count(*) as c INTO r FROM follow_channel_user where channelid=NEW.channelid and userid=NEW.userid and anon=NEW.anon;
  IF r.c>0 THEN
   RETURN NULL;
  END IF;
  RETURN NEW;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_follow_channel_user_notduplicate BEFORE INSERT on follow_channel_user FOR EACH ROW EXECUTE PROCEDURE TG_follow_channel_user_notduplicate();


--=============== Sincronizacao Likes e Dislikes Views e Posts
create or replace function TG_topicld_sync() returns trigger as
$$
 DECLARE r RECORD;
 BEGIN
  SELECT userid,anon INTO r FROM topic WHERE id=NEW.topicid;
  IF NEW.liked<>true THEN
   UPDATE topic SET dislikes = dislikes + 1 WHERE id=NEW.topicid;
   IF r.anon = TRUE THEN
    UPDATE anon SET dislikes = dislikes + 1 WHERE id = r.userid;
   ELSE
    UPDATE "user" SET dislikes = dislikes + 1 WHERE id = r.userid;
   END IF;
  ELSE
   UPDATE topic SET likes = likes + 1 WHERE id=NEW.topicid;
   IF r.anon = TRUE THEN
    UPDATE anon SET likes = likes + 1 WHERE id = r.userid;
   ELSE
    UPDATE "user" SET likes = likes + 1 WHERE id = r.userid;
   END IF;
  END IF;
  RETURN NEW;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_topicld_sync AFTER INSERT on topicld FOR EACH ROW EXECUTE PROCEDURE TG_topicld_sync();

create or replace function TG_topicview_sync() returns trigger as
$$
 BEGIN
  UPDATE topic SET views = views + 1 WHERE id = NEW.topicid;
  RETURN NEW;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_topicview_sync AFTER INSERT on topicview FOR EACH ROW EXECUTE PROCEDURE TG_topicview_sync();

create or replace function TG_post_sync() returns trigger as
$$
 BEGIN
  UPDATE topic SET replies = replies + 1 WHERE id = NEW.topicid;
  UPDATE follow_topic_user SET counter = (select counter from topic where id=NEW.topicid)+1 WHERE topicid=NEW.topicid and userid=NEW.userid and anon=NEW.anon;
  RETURN NEW;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_post_sync AFTER INSERT on post FOR EACH ROW EXECUTE PROCEDURE TG_post_sync();

create or replace function TG_postld_sync() returns trigger as
$$
 DECLARE r record;
 BEGIN
  SELECT userid,anon INTO r FROM post WHERE id=NEW.postid;
  IF NEW.liked<>true THEN
   UPDATE post SET dislikes = dislikes + 1 WHERE id=NEW.postid;
   IF r.anon = TRUE THEN
    UPDATE anon SET dislikes = dislikes + 1 WHERE id = r.userid;
   ELSE
    UPDATE "user" SET dislikes = dislikes + 1 WHERE id = r.userid;
   END IF;
  ELSE
   UPDATE post SET likes = likes + 1 WHERE id=NEW.postid;
   IF r.anon = TRUE THEN
    UPDATE anon SET likes = likes + 1 WHERE id = r.userid;
   ELSE
    UPDATE "user" SET likes = likes + 1 WHERE id = r.userid;
   END IF;
  END IF;
  RETURN NEW;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_postld_sync AFTER INSERT on postld FOR EACH ROW EXECUTE PROCEDURE TG_postld_sync();

--=============== PUNICAO PARA TOPICOS e COMENTARIOS COM MUITOS DISLIKES
create or replace function TG_topic_isoff() returns trigger as
$$
 BEGIN
  IF NEW.likes + NEW.dislikes > 10 AND (10000*NEW.dislikes)/(NEW.likes+NEW.dislikes)>7500 THEN
	NEW.isoff=1;
  END IF;
  RETURN NEW;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_topic_isoff BEFORE UPDATE on topic FOR EACH ROW EXECUTE PROCEDURE TG_topic_isoff();


create or replace function TG_post_isoff() returns trigger as
$$
 BEGIN
  IF NEW.likes + NEW.dislikes > 10 AND (10000*NEW.dislikes)/(NEW.likes+NEW.dislikes)>7500 THEN
	NEW.isoff=1;
  END IF;  
  RETURN NEW;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_post_isoff BEFORE UPDATE on post FOR EACH ROW EXECUTE PROCEDURE TG_post_isoff();

--=============== SINCRONIZADOR PARA CHECAR SE TEM TOPICOS MODIFICADOS

create or replace function TG_post_topiccount() returns trigger as
$$
 BEGIN
  IF NEW.post<>OLD.post THEN
   UPDATE topic SET counter=counter+1 WHERE id=NEW.topicid;
   UPDATE follow_topic_user SET counter = (select counter from topic where id=NEW.topicid) WHERE topicid=NEW.topicid and userid=NEW.userid and anon=NEW.anon;
  END IF;
  NEW.updatetime=now();
  RETURN NEW;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_post_topiccount BEFORE UPDATE on post FOR EACH ROW EXECUTE PROCEDURE TG_post_topiccount();

create or replace function TG_topic_topiccount() returns trigger as
$$
 BEGIN
  IF NEW.replies<>OLD.replies OR NEW.subject <> OLD.subject OR NEW.msg <> OLD.msg THEN
   NEW.counter=NEW.counter+1;
  END IF;
  IF NEW.utdate<>OLD.utdate THEN
   NEW.orderid = nextval('topic_orderid_seq');
  END IF;
  NEW.updatetime=now();
  RETURN NEW;
 END;
$$ language 'plpgsql';
CREATE TRIGGER TG_topic_topiccount BEFORE UPDATE on topic FOR EACH ROW EXECUTE PROCEDURE TG_topic_topiccount();

--=============== VOCE SEGUE SEU TOPICO
--create or replace function TG_topic_followyourself() returns trigger as
--$$
-- BEGIN
--
--  INSERT INTO follow_topic_user (topicid,userid,anon,counter) VALUES (NEW.id,NEW.userid,NEW.anon,NEW.counter);
--
--  RETURN NEW;
-- END;
--$$ language 'plpgsql';
--CREATE TRIGGER TG_topic_followyourself AFTER INSERT on topic FOR EACH ROW EXECUTE PROCEDURE TG_topic_followyourself();

--================ VISITANDO O TOPICO
create or replace function F_topic_visit(i_topicid integer,i_userid integer,i_anon boolean,i_counter integer) RETURNS integer AS
$$
 DECLARE r RECORD;
 BEGIN
  UPDATE follow_topic_user SET counter=i_counter WHERE topicid=i_topicid AND userid=i_userid and anon=i_anon;
  SELECT count(*) as C INTO r FROM topicview WHERE topicid=i_topicid and userid=i_userid and anon=i_anon;
  IF r.C=0 THEN
   INSERT INTO topicview(topicid,userid,anon,counter) VALUES(i_topicid,i_userid,i_anon,i_counter);
  ELSE
   UPDATE topicview SET counter=i_counter WHERE topicid=i_topicid AND userid=i_userid AND anon=i_anon;
  END IF;
  RETURN 1;
 END;
$$ language 'plpgsql';




--===EMAIL DO TOPICO

create or replace function F_topic_email(i_topicid integer,i_userid integer,i_counter integer) RETURNS integer AS
$$
 DECLARE r RECORD;
 BEGIN
  SELECT count(*) as C INTO r FROM email_topic_user WHERE topicid=i_topicid and userid=i_userid;
  IF r.C=0 THEN
   INSERT INTO email_topic_user(topicid,userid,counter) VALUES (i_topicid,i_userid,i_counter);
  ELSE
   UPDATE email_topic_user SET counter=i_counter WHERE topicid=i_topicid AND userid=i_userid;
  END IF;
  RETURN 1;
 END;
$$ language 'plpgsql';






------------------------
grant all on schema public to rapidcof_db;
grant all on public.addthis to rapidcof_db;
grant all on public.anon to rapidcof_db;
grant all on public.emails to rapidcof_db;
grant all on public.unconfirmed_user to rapidcof_db;
grant all on public.user_camefrom to rapidcof_db;
grant all on public."user" to rapidcof_db;
grant all on public.anon_id_seq to rapidcof_db;
grant all on public.unconfirmed_user_id_seq to rapidcof_db;
grant all on public.user_id_seq to rapidcof_db;
grant all on public.vw_user to rapidcof_db;


grant all on schema beta to rapidcof_db;
grant all on beta.follow_topic_user to rapidcof_db;
grant all on beta.post to rapidcof_db;
grant all on beta.postld to rapidcof_db;
grant all on beta.topic to rapidcof_db;
grant all on beta.topicld to rapidcof_db;
grant all on beta.topicview to rapidcof_db;
grant all on beta.follow_topic_user_id_seq to rapidcof_db;
grant all on beta.channel to rapidcof_db;
grant all on beta.channel_id_seq to rapidcof_db;
grant all on beta.follow_channel_user to rapidcof_db;
grant all on beta.follow_channel_user_id_seq to rapidcof_db;
grant all on beta.post_id_seq to rapidcof_db;
grant all on beta.postld_id_seq to rapidcof_db;
grant all on beta.topic_id_seq to rapidcof_db;
grant all on beta.topic_orderid_seq to rapidcof_db;
grant all on beta.topicld_id_seq to rapidcof_db;
grant all on beta.topicview_id_seq to rapidcof_db;
grant all on beta.vw_topic to rapidcof_db;
grant all on beta.vw_topic_notoff to rapidcof_db;
grant all on beta.vw_channel to rapidcof_db;
grant all on public.message to rapidcof_db;
grant all on public.vw_message to rapidcof_db;
grant all on public.message_id_seq to rapidcof_db;
grant all on beta.unconfirmed_follow_channel_user to rapidcof_db;
grant all on beta.unconfirmed_follow_channel_user_id_seq to rapidcof_db;
grant all on public.user_camefrom to rapidcof_db;
grant all on beta.email_topic_user to rapidcof_db;
