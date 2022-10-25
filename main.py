from flask import *
from flask_cors import *
from database.database import *
from config.config import xml
from estadistics.estadistics import calcule, calcule_host , calcule_product
from admin_users.Login.login import login
from admin_users.Register.register import register, register_temp
from admin_users.Resetp.resetp import reset

server = Flask('server')
cors = CORS(server)
conf = xml()
db = DataBase(conf)

#default route
@server.route('/',methods=['GET'])
def default():
    return redirect('/home')

#Home route
@server.route('/home',methods=['GET'])
def home ():
    db.datainsert(db.querys({'action':'add_host_activity'}))
    return render_template('home.html')

#Admin route
@server.route('/admin',methods=['GET','POST'])
def admin ():
    if request.method == 'GET':
        return render_template('admin.html')
        
    if request.method == 'POST':
        data = request.get_json()
        if data['action']=='login':
            response = login(data,db)
            print(response)
            if response != None:
                return {'logged':True,'user':response[0]}
            else:
                return {'logged':False}
        elif data['action']=='register':
            response = register_temp(data,db,conf[4],conf[5])
            return response

#Api gmail verif
@server.route('/api/add_user/<mail>/<id>',methods=['GET'])
def verif(mail,id):
    data = db.datasearch(db.querys({'action':'read_temp_user','email':mail,'id':id}))[0]
    data = {'email':data[2],'name':data[1],'password':data[3]}
    data['action']='delete_temp_user'
    db.datainsert(db.querys(data))
    if data != ():
        register(data,db)
        return redirect('/admin')
    else:
        return redirect('/admin')

#Api activity
@server.route('/api/add',methods=['POST'])
def actividty_add():
    rq = request.get_json()
    rq['action']='add_activity'
    context= db.datainsert(db.querys(rq))
    return {'id':request.get_json(),'status':context}

#Api general stadistics
@server.route('/api/general/estadistics',methods=['POST'])
def estadistics_calcule():
    rq = request.get_json()
    context= calcule(rq,db)
    return {'id':request.get_json(),'status':context}

#Api host stadistics
@server.route('/api/host/estadistics',methods=['POST'])
def estadistics_host_calcule():
    rq = request.get_json()
    context= calcule_host(rq,db)
    return {'id':request.get_json(),'status':context}

#Api product stadistics
@server.route('/api/product/estadistics',methods=['GET', 'POST'])
def estadistics_product():
    if request.method == 'GET':
        context= calcule_product(db)
        return {'status':context}
    elif request.method == 'POST':
        rq = request.get_json()
        return {'status':'ok'}

#Api catalog
@server.route('/api/catalog',methods=['GET','POST'])
def catalog ():
    if request.method == 'GET':
        response =[]
        cat = db.datasearch(db.querys({'action':'read_catalog'}))
        if cat != ():
            for i in cat:
                response.append({'id':i[0],'price':i[1],'name':i[2],'description':i[3]})
        return {'catalog':response}

    elif request.method == 'POST':
        data = request.get_json()
        if data['action']=='add':
            data['action']='add_catalog'
            response =db.datainsert(db.querys(data))
            return {'status':response}
        elif data['action']=='delete':
            data['action']='delete_catalog'
            response =db.datainsert(db.querys(data))
            return {'status':response}
        elif data['action']=='update':
            data['action']='update_catalog'
            response =db.datainsert(db.querys(data))
            return {'status':response}


if __name__ == '__main__':
    #server.run(debug=True, host='192.168.60.12')
    server.run(debug=True, host='localhost')
