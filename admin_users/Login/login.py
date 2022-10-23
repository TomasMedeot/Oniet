from admin_users.encript.encript import verifpassword

def login(data,database):
    data['action']='read_user'
    request = database.datasearch(database.querys(data))
    if request != ():
        v_p =verifpassword(data['password'],request[0][3])
        #if data['password'] == request[0][3]:
        if v_p == True:
            return request
    return None