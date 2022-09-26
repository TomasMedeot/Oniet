from admin_users.encript.encript import encriptpassword
def reset(data,database):
    data['password']=encriptpassword(data['password'])
    data['action']='update_user'
    request =database.datainsert(database.querys(data))
    return request