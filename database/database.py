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
            return f"insert into ACTIVITY_HOSTPOT(HOUR,DAY,MONTH,YEAR) values ({hour},{day},{month},{year});"
        elif data['action']=='read_by_year':
            return f"select * from ACTIVITY where YEAR = {data['year']};"
        elif data['action']=='read_by_month':
            return f"select * from ACTIVITY where MONTH = {data['month']} and year = {data['year']};"
        elif data['action']=='read_by_day':
            return f"select * from ACTIVITY where DAY = {data['day']} and month = {data['month']} and year = {data['year']};"
        elif data['action']=='read_sex':
            return f"select * from ACTIVITY;"
        elif data['action']=='read_host_by_year':
            return f"select * from ACTIVITY_HOSTPOT where YEAR = {data['year']};"
        elif data['action']=='read_host_by_month':
            return f"select * from ACTIVITY_HOSTPOT where MONTH = {data['month']} and year = {data['year']};"
        elif data['action']=='read_host_by_day':
            return f"select * from ACTIVITY_HOSTPOT where DAY = {data['day']} and month = {data['month']} and year = {data['year']};"
        elif data['action']=='read_user':
            return f"select * from ADMIN where MAIL like '{data['email']}';"
        elif data['action']=='add_user':
            return f"insert into ADMIN(MAIL,PASSWORD,NAME) values ('{data['email']}','{data['password']}','{data['name']}');"
        elif data['action']=='update_user':
            return f"update ADMIN set PASSWORD = '{data['password']}' where mail like '{data['email']}';"
        #insert into ACTIVITY(NAME,MAIL,SEX,HOUR,DAY,MONTH,YEAR) values ('tomas','tomimedeot@gmail.com','hombre',,,,);