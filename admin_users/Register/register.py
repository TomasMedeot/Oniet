from admin_users.encript.encript import encriptpassword

def register(data,database):
    data['action']='add_user'
    data['password']=encriptpassword(data['password'])
    request=database.datainsert(database.querys(data))
    return request