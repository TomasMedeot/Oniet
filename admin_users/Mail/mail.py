from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from email.mime import *

def loadindex(type,mail,id):
    if type == 'register': #register mail
        inhtml = open('admin_users/Mail/inhtml.html')
        inhtml = inhtml.read()
        link=f"/api/add_user/{mail}/{id}"
    elif type == 'reset': #reset mail
        inhtml = open('admin_users/Mail/inrhtml.html')
        inhtml = inhtml.read()
        link=f"/api/reset_user/{mail}/{id}"
    outhtml = open('admin_users/mail/outhtml.html')
    outhtml = outhtml.read()
    return [inhtml,link,outhtml]

def insertlink(index):
    messaje = f"{index[0]}{index[1]}{index[2]}"
    return messaje

def sendmail(mailserver,mailuser,passwordserver,type,id):
        index = loadindex(type,mailuser,id)
        messaje = insertlink(index)
        message = MIMEMultipart()
        message['Subject']='Verificate email'
        message['To']=mailuser
        message['From']='asusgoverif@gmail.com'
        body_content = messaje
        message.attach(MIMEText(body_content,'html'))
        msg_body = message.as_string()
        localmail = smtplib.SMTP('smtp.gmail.com', 587)
        localmail.starttls()
        localmail.login(mailserver,passwordserver)
        localmail.sendmail(mailserver,mailuser,msg_body)
        localmail.quit()
        return {'msj':'mail sended'}