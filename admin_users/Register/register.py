from admin_users.encript.encript import encriptpassword
from admin_users.Mail.mail import sendmail

def register(data,database):
    data['action']='add_user'
    request=database.datainsert(database.querys(data))
    return request

def register_temp(data,database,mail,password):
    data['action']='add_temp_user'
    data['password']=encriptpassword(data['password'])
    database.datainsert(database.querys(data))
    data['action']='read_id_temp_user'
    request = database.datasearch(database.querys(data))
    response = sendmail(mail,data['email'],password,'register',request[0][0])
    return response