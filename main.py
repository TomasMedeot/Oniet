from flask import *
from flask_cors import *
from database.database import *
from config.config import xml
from estadistics.estadistics import calcule, calcule_host
from admin_users.Login.login import login
from admin_users.Register.register import register
from admin_users.Resetp.resetp import reset

server = Flask('server')
cors = CORS(server)
db = DataBase(xml())

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

#Login route
@server.route('/login',methods=['GET'])
def login ():
    return render_template('login.html')

#Admin route
@server.route('/admin',methods=['GET','POST'])
def admin ():
    if request.method == 'GET':
        return render_template('admin_log.html')

    if request.method == 'POST':
        data = request.get_json()
        if data['action']=='login':
            response = login(data,db)
            if response != None:
                return render_template('admin.html')
            else:
                return render_template('admin_log.html')
        elif data['action']=='register':
            response = register(data,db)
            return response
        elif data['action']=='update_password':
            response = reset(data,db)
            return response

#Api route
@server.route('/api/add',methods=['POST'])
def actividty_add():
    rq = request.get_json()
    context= db.datainsert(db.querys(rq))
    return {'id':request.get_json(),'status':context}

#Api stadistics
@server.route('/api/estadistics',methods=['POST'])
def estadistics_calcule():
    rq = request.get_json()
    context= calcule(rq,db)
    return {'id':request.get_json(),'status':context}

if __name__ == '__main__':
    server.run(debug=True, host='localhost')
