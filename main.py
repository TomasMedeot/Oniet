from flask import *
from flask_cors import *
from database.database import *
from config.config import xml
from estadistics.estadistics import calcule

server = Flask('server')
cors = CORS(server)
db = DataBase(xml())

#Home route
@server.route('/home',methods=['GET'])
def home ():
    return render_template('home.html')

@server.route('/admin',methods=['GET','POST'])
def admin():
    if request.method == 'GET':
        code = request.args.get('code', None)
        if code != None:
            return render_template('admin.html')
        else:
            return redirect('/admin_log')
    if request.method == 'POST':
        pass

#Admin route
@server.route('/admin_log',methods=['GET','POST'])
def admin_l ():
    if request.method == 'GET':
        return render_template('admin.html')

    if request.method == 'POST':
        credentials = request.get_json()

        response=[]#database code

        for user in response:
            if credentials['email'] == user['email']:
                if credentials['password'] == user['password']:
                    code=123
                    return redirect('/admin',code=code)
        
        return redirect('/admin_log')


#Api route
@server.route('/api/add',methods=['POST'])
def actividty_add():
    rq = request.get_json()
    context= db.datainsert(db.querys(rq))
    return {'id':request.get_json(),'status':context}

@server.route('/api/estadistics',methods=['POST'])
def estadistics_calcule():
    rq = request.get_json()
    context= calcule(rq,db)
    return {'id':request.get_json(),'status':context}

server.run(debug=True, host='192.168.2.252')