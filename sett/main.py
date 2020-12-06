import requests
import importlib
import time

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
    chambers = {}
    for chamber_type_name, chambers_settings in sett_configuration.items():
        chamber_type = importlib.import_module('chamber_' + chamber_type_name)
        for chamber_name, chamber_settings in chambers_settings.items():
            chambers[chamber_name] = getattr(chamber_type, chamber_type_name)(chamber_settings)
            print(chambers[chamber_name])

    badgr = request.get_json(silent=True)

    # Append processing time to hit properties
    if 'hit_properties' in badgr:
        processing_timestamp = time.time()
        badgr['hit_properties']['processing_timestamp'] = processing_timestamp

    if badgr['environment'] == 'staging':
        return badgr['destinations']

    sent_to = []
    for destination in badgr['destinations']:
        if chambers[destination] is not None:
            if chambers[destination].send(badgr):
                sent_to.append(destination)

    return sent_to
