from flask import *
from flask_cors import *
from database.database import *
from config.config import xml
from estadistics.estadistics import calcule, calcule_host
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

#Stats route
@server.route('/stats',methods=['GET'])
def stats ():
    return render_template('stats.html')

#Config route
@server.route('/config',methods=['GET'])
def config ():
    return render_template('config.html')

#Config route
@server.route('/register',methods=['GET'])
# TODO: change name of function
def registro ():
    return render_template('register.html')

#Admin route
@server.route('/admin',methods=['GET','POST'])
def admin ():
    if request.method == 'GET':
        return render_template('login.html')

    if request.method == 'POST':
        data = request.get_json()
        if data['action']=='login':
            response = login(data,db)
            if response != None:
                return render_template('admin.html')
            else:
                return render_template('login.html')
        '''
        #revise 
        elif data['action']=='register':
            response = register_temp(data,db,conf[4],conf[5])
            return response
        elif data['action']=='update_password':
            response = reset(data,db)
            return response
        '''

'''
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
'''

#Api route
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


if __name__ == '__main__':
    server.run(debug=True, host='localhost')
    # server.run(debug=True, host='192.168.2.252')