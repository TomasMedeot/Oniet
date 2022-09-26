DROP DATABASE IF EXISTS HOTSPOT;
CREATE DATABASE HOTSPOT;
USE HOTSPOT;

DROP TABLE IF EXISTS ADMIN;
CREATE TABLE ADMIN(
    ID int not null auto_increment,
	NAME varchar(30)NOT NULL,
	MAIL varchar(30) NOT NULL,
	PASSWORD varchar(200) NOT NULL,
	primary key (ID));

DROP TABLE IF EXISTS ACTIVITY;
CREATE TABLE ACTIVITY(
    ID int not null auto_increment,
	NAME varchar(20)NOT NULL,
	MAIL varchar(30) NOT NULL,
	SEX varchar(30) NOT NULL,
    HOUR int NOT NULL,
    DAY int NOT NULL,
    MONTH int NOT NULL,
    YEAR int NOT NULL,
	primary key (ID));
    
DROP TABLE IF EXISTS ACTIVITY_HOTSPOT;
CREATE TABLE ACTIVITY_HOTSPOT(
    ID int not null auto_increment,
    HOUR int NOT NULL,
    DAY int NOT NULL,
    MONTH int NOT NULL,
    YEAR int NOT NULL,
	primary key (ID));


INSERT INTO ADMIN(NAME, MAIL, PASSWORD) VALUES('Tomas', 'tomicaceres07@gmail.com', '1234567');
INSERT INTO ADMIN(NAME, MAIL, PASSWORD) VALUES('Tomaaa', 'tomicaceres08@gmail.com', '12345679');
INSERT INTO ADMIN(NAME, MAIL, PASSWORD) VALUES('Tomassss', 'tomicaceres09@gmail.com', '123456788');

INSERT INTO ACTIVITY(NAME, MAIL, SEX, HOUR, DAY, MONTH, YEAR) VALUES('TOMEE', 'tomicacer09@gmail.com', 'hombre', 23, 1, 2, 2020);
INSERT INTO ACTIVITY(NAME, MAIL, SEX, HOUR, DAY, MONTH, YEAR) VALUES('TOMESSSE', 'tomicacerEE09@gmail.com', 'mujer', 22, 2, 3, 2020);
INSERT INTO ACTIVITY(NAME, MAIL, SEX, HOUR, DAY, MONTH, YEAR) VALUES('sofi', 'sofiiii@gmail.com', 'mujer', 10, 3, 4, 2020);

INSERT INTO ACTIVITY_HOTSPOT(HOUR, DAY, MONTH, YEAR) VALUES(24, 1, 2, 2020);
INSERT INTO ACTIVITY_HOTSPOT(HOUR, DAY, MONTH, YEAR) VALUES(19, 2, 3, 2020);
INSERT INTO ACTIVITY_HOTSPOT(HOUR, DAY, MONTH, YEAR) VALUES(16, 3, 4, 2020);
