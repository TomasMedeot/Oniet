import xml.etree.ElementTree as ET
import os

#This function read an .xml archive named settings
def xml ():
    '''This function needs an .xml archive named settings, retuns a array of the readed elements'''
    context = []
    archive = ET.parse(os.path.join('./config','settings.xml'))
    main = archive.getroot()
    for element in main:
        variable=element.text
        context.append(variable)
    return context