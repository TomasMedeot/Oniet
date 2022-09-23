from flask import *
from flask_cors import *

server = Flask('server')
cors = CORS(server)

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
@server.route('/act_add',methods=['POST'])
def actividty_add():
    #add code to database
    return {'id':request.get_json()}

server.run(debug=True, host='192.168.2.252')