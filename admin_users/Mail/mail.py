from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import random 
from email.mime import *

#Create a 9 number code like string var
def createcode():
    '''This function retuns a random number with 9 digicts '''
    code1 = random.randint(100,999)
    code2 = random.randint(100,999)
    code3 = random.randint(100,999)
    return str(code1)+str(code2)+str(code3)

#Load the structure of the mail
def loadindex(type:str,name:str,mail:str,securecode:str,password:str):
    '''This function needs 3 archive .html named inhtml, inrhtml, outhtml, returns dictionary 'msj':'error load index'//array with start html , link , endhtml'''
    try:
        if type == 'reg': #register mail
            inhtml = open('Users/Mail/inhtml.html')
            inhtml = inhtml.read()
            link=f"/api/register/verif/{name}/{mail}/{securecode}/{password}"
        elif type == 'res': #reset mail
            inhtml = open('Users/Mail/inrhtml.html')
            inhtml = inhtml.read()
            link=f"/api/resetp/verif/none/{mail}/{securecode}/{password}"
        outhtml = open('Users/mail/outhtml.html')
        outhtml = outhtml.read()
        return [inhtml,link,outhtml]
    except:
        return {'msj':'error load index'}

#Create the messaje
def insertlink(index):
    '''This function need index ,returns messaje'''
    messaje = f"{index[0]}{index[1]}{index[2]}"
    return messaje

#Send mail
def sendmail(mailserver:str,mailuser:str,passwordserver:str,type:str,password:str,name:str):
    '''This function need mailserver, mailusr, passwordserver, type, password, name, returns dictionary with 'msj':'mail sended','code':*code*//'mail error',*none* '''
    try:
        securecode = createcode()
        print(name)
        index = loadindex(type,name,mailuser,securecode,password)
        messaje = insertlink(index)
        message = MIMEMultipart()
        message['Subject']='Verificate email'
        message['To']=mailuser
        message['From']='asusgoverif@gmail.com'
        body_content = messaje
        message.attach(MIMEText(body_content, 'html'))
        msg_body = message.as_string()
        localmail = smtplib.SMTP('smtp.gmail.com', 587)
        localmail.starttls()
        localmail.login(mailserver,passwordserver)
        localmail.sendmail(mailserver,mailuser,msg_body)
        localmail.quit()
        return {'msj':'mail sended','code':securecode}
    except:
        return {'msj':'mail error','code':''}