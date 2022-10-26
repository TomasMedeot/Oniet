import operator

def calcule_product(database):
    products=[]
    visualitions=[]
    cat = database.datasearch(database.querys({'action':'read_catalog'}))
    if cat != ():
        for i in cat:
            products.append({'id':i[0],'name':i[2],'visualitions':0})
    est = database.datasearch(database.querys({'action':'read_catalog_estadistics'}))
    if est != ():
        for i in est:
            visualitions.append({'id':i[0],'id_p':i[1]})
    for e in visualitions:
        for i in products:
            if i['id']==e['id_p']:
                i['visualitions']=i['visualitions']+1
    return products

def calcule(data,database):
    if data['type']=='day':
        status = {'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'11':0,'12':0,'13':0,'14':0,'15':0,'16':0,'17':0,'18':0,'19':0,'20':0,'21':0,'22':0,'23':0,'24':0}
        data['action']='read_by_day'
        response = database.datasearch(database.querys(data))
        for r in response:
            status[str(r[4])] = status[str(r[4])]+1
        escale = {'escale':status[max(status.items(), key=operator.itemgetter(1))[0]]}
        return status, escale
    
    if data['type']=='month':
        status = {'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'11':0,'12':0,'13':0,'14':0,'15':0,'16':0,'17':0,'18':0,'19':0,'20':0,'21':0,'22':0,'23':0,'24':0,'25':0,'26':0,'27':0,'28':0,'29':0,'30':0,'31':0}
        data['action']='read_by_month'
        response = database.datasearch(database.querys(data))
        for r in response:
            status[str(r[5])] = status[str(r[5])]+1
        escale = {'escale':status[max(status.items(), key=operator.itemgetter(1))[0]]}
        return status, escale
    
    if data['type']=='year':
        status = {'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'11':0,'12':0}
        data['action']='read_by_year'
        response = database.datasearch(database.querys(data))
        for r in response:
            status[str(r[6])] = status[str(r[6])]+1
        escale = {'escale':status[max(status.items(), key=operator.itemgetter(1))[0]]}
        return status, escale

    if data['type']=='sex':
        status = {'hombre':0,'mujer':0,'no-especificado':0}
        data['action']='read_sex'
        response = database.datasearch(database.querys(data))
        for r in response:
            status[str(r[3])] = status[str(r[3])]+1
        escale = {'escale':status[max(status.items(), key=operator.itemgetter(1))[0]]}
        return status, escale

def calcule_host(data,database):
    if data['type']=='day':
        status = {'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'11':0,'12':0,'13':0,'14':0,'15':0,'16':0,'17':0,'18':0,'19':0,'20':0,'21':0,'22':0,'23':0,'24':0}
        data['action']='read_host_by_day'
        response = database.datasearch(database.querys(data))
        for r in response:
                status[str(r[1])] = int(status[str(r[1])])+1
        escale = {'escale':status[max(status.items(), key=operator.itemgetter(1))[0]]}
        return status, escale
    
    if data['type']=='month':
        status = {'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'11':0,'12':0,'13':0,'14':0,'15':0,'16':0,'17':0,'18':0,'19':0,'20':0,'21':0,'22':0,'23':0,'24':0,'25':0,'26':0,'27':0,'28':0,'29':0,'30':0,'31':0}
        data['action']='read_host_by_month'
        response = database.datasearch(database.querys(data))
        for r in response:
            status[str(r[2])] = status[str(r[2])]+1
        escale = {'escale':status[max(status.items(), key=operator.itemgetter(1))[0]]}
        return status, escale
    
    if data['type']=='year':
        status = {'1':0,'2':0,'3':0,'4':0,'5':0,'6':0,'7':0,'8':0,'9':0,'10':0,'11':0,'12':0}
        data['action']='read_host_by_year'
        response = database.datasearch(database.querys(data))
        for r in response:
            status[str(r[3])] = status[str(r[3])]+1
        escale = {'escale':status[max(status.items(), key=operator.itemgetter(1))[0]]}
        return status, escale