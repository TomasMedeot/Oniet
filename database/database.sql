DROP DATABASE IF EXISTS HOSTPOT;
CREATE HOSTPOT;
USE HOSTPOT;

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
    
DROP TABLE IF EXISTS ACTIVITY_HOSTPOT;
CREATE TABLE ACTIVITY_HOSTPOT(
    ID int not null auto_increment,
    HOUR int NOT NULL,
    DAY int NOT NULL,
    MONTH int NOT NULL,
    YEAR int NOT NULL,
	primary key (ID));