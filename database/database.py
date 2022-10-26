import pymysql
from datetime import date, datetime
now = datetime.now()

class DataBase:
    def __init__(self,context):
        '''This function need context whit the information for the conecction'''
        self.context = context
        self.conn = pymysql.connect(host=context[0],user=context[1],password=context[2],db=context[3])
        self.cursor = self.conn.cursor()

    #Is the conection to the database for insert , update or delete
    def datainsert(self,accion:str):
        '''This function need the sql instruction, returns 'msj':'DB correctly'//'DB error' '''
        try:
            self.cursor.execute(accion)
            self.conn.commit()
            return {'msj':'DB correctly'}
        except:
            print('error')
            return {'msj':'DB error'}

    #Is the connection to the database for read information
    def datasearch(self,accion:str):
        '''This function need the sql instruction, returns 'msj':'DB correctly'//'DB error' '''
        try:
            self.cursor.execute(accion)
            self.dates = self.cursor.fetchall()
            return self.dates
        except:
            return {'msj':'DB error'}
    
    def querys(self,data):
        if data['action']=='add_activity':
            hour = now.hour
            day = now.day
            month = now.month
            year = now.year
            return f"insert into ACTIVITY(NAME,MAIL,SEX,HOUR,DAY,MONTH,YEAR) values ('{data['name']}','{data['email']}','{data['sex']}',{hour},{day},{month},{year});"
        if data['action']=='add_host_activity':
            hour = now.hour
            day = now.day
            month = now.month
            year = now.year
            return f"insert into ACTIVITY_HOTSPOT(HOUR,DAY,MONTH,YEAR) values ({hour},{day},{month},{year});"
        elif data['action']=='add_host_activity_gen':
            return f"insert into ACTIVITY_HOTSPOT(HOUR,DAY,MONTH,YEAR) values ({data['hour']},{data['day']},{data['month']},{data['year']});"
        elif data['action']=='read_by_year':
            return f"select * from ACTIVITY where YEAR = {data['year']};"
        elif data['action']=='read_by_month':
            return f"select * from ACTIVITY where MONTH = {data['month']} and year = {data['year']};"
        elif data['action']=='read_by_day':
            return f"select * from ACTIVITY where DAY = {data['day']} and month = {data['month']} and year = {data['year']};"
        elif data['action']=='read_sex':
            return f"select * from ACTIVITY;"
        elif data['action']=='read_host_by_year':
            return f"select * from ACTIVITY_HOTSPOT where YEAR = {data['year']};"
        elif data['action']=='read_host_by_month':
            return f"select * from ACTIVITY_HOTSPOT where MONTH = {data['month']} and year = {data['year']};"
        elif data['action']=='read_host_by_day':
            return f"select * from ACTIVITY_HOTSPOT where DAY = {data['day']} and month = {data['month']} and year = {data['year']};"
        elif data['action']=='read_user':
            return f"select * from ADMIN where MAIL like '{data['email']}';"
        elif data['action']=='add_user':
            return f"insert into ADMIN(MAIL,PASSWORD,NAME) values ('{data['email']}','{data['password']}','{data['name']}');"
        elif data['action']=='add_temp_user':
            return f"insert into ADMIN_TEMP(MAIL,PASSWORD,NAME) values ('{data['email']}','{data['password']}','{data['name']}');"
        elif data['action']=='update_user':
            return f"update ADMIN set PASSWORD = '{data['password']}' where mail like '{data['email']}';"
        elif data['action']=='read_temp_user':
            return f"select * from ADMIN_TEMP where mail like '{data['email']}' and id = {data['id']};"
        elif data['action']=='read_id_temp_user':
            return f"select ID from ADMIN_TEMP where mail like '{data['email']}';"
        elif data['action']=='delete_temp_user':
            return f"delete from ADMIN_TEMP where mail like '{data['email']}';"
        elif data['action']=='read_catalog':
            return f"select * from CATALOG;"
        elif data['action']=='add_catalog':
            return f"insert into CATALOG(NAME,DESCRIPTION,PRICE) values('{data['name']}','{data['description']}',{data['price']});"
        elif data['action']=='delete_catalog':
            return f"delete from CATALOG where id = {data['id']};"
        elif data['action']=='update_catalog':
            return f"update CATALOG set NAME = '{data['name']}', DESCRIPTION = '{data['description']}',PRICE = {data['price']} where ID = {data['id']};"
        elif data['action']=='add_catalog_estadistics':
            return f"insert into CATALOG_ESTADISTICS (ID_PRODUCT) values({data['id']});"
        elif data['action']=='read_catalog_estadistics':
            return f"select * from CATALOG_ESTADISTICS;"
        #insert into ACTIVITY(NAME,MAIL,SEX,HOUR,DAY,MONTH,YEAR) values ('tomas','tomimedeot@gmail.com','hombre',,,,);