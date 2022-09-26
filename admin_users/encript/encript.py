from werkzeug.security import check_password_hash,generate_password_hash

def encriptpassword(password):
    context =generate_password_hash(password)
    return context

def verifpassword(password,hash):
    context = check_password_hash(hash,password)
    return context