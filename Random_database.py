from database.database import *
from config.config import xml
import random

conf = xml()
db = DataBase(conf)

for i in range(12):
    for e in range(31):
        for z in range(24):
            for x in range(random.randint(1,50)):
                db.datainsert(db.querys({'action':'add_host_activity_gen','year':2021,'month':i+1,'day':e+1,'hour':z+1}))
