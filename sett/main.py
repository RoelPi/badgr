import requests
import importlib
import time
import json
import copy

from chamber_mp import mp
from chamber_bq import bq

sett_configuration = {
    'bq': {
        'my_bq' : {
            'table_id': 'roelpeters-blog.web.badgr_lake',
            'creds_filename': 'creds.json'
        }
    },
    'mp': {
        'my_mp': {
            'token': '8d6177f4786fcab7b0388720e7463c98'
        }
    }
}

def Sett(request):
    badgr_ = request.get_json(silent=True)
    if 'destinations' not in badgr_:
        print('No destinations provided.')
        return json.dumps({}), 200, {'ContentType': 'application/json'}

    if 'hit_properties' not in badgr_:
         badgr_['hit_properties'] = {}

    badgr_['hit_properties']['processing_timestamp'] = time.time()
    chambers = {}

    for chamber_type_name, chambers_settings in sett_configuration.items():
        if len(list(set(badgr_['destinations']) & chambers_settings.keys())) <= 0:
            continue
        for chamber_name, chamber_settings in chambers_settings.items():
            chambers[chamber_name] = {
                'mp': mp,
                'bq': bq
            }[chamber_type_name](chamber_settings, badgr_, chamber_name)
            print(badgr_)
            
    if badgr_['environment'] == 'staging':
        return badgr_['destinations']
    sent_to = []
    for destination in badgr_['destinations']:
        if chambers[destination] is not None:
            if chambers[destination].send():
                sent_to.append(destination)
    return json.dumps(sent_to), 200, {'ContentType': 'application/json'}
