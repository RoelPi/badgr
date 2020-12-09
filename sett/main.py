import requests
import importlib
import time
import json

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
    badgr = request.get_json(silent=True)
    if 'hit_properties' in badgr:
        # Enrich hit properties with timestamp
        badgr['hit_properties']['processing_timestamp'] = time.time()

        # Validate fields
        fields = ['browser','browser_version','device','user_id', \
            'current_url','initial_referrer','initial_referring_domain', \
            'screen_height','screen_width','referring_search_engine', \
            'os','referrer','referring_domain','query_string','hit_id', \
            'visit_id','utm_campaign','utm_source','utm_medium','utm_content', \
            'utm_term','color_depth','browser_language','timezone_offset', \
            'user_agent', 'protocol', 'page_title', 'hostname','ip']
        for field in fields:
            if field not in badgr['hit_properties']:
                badgr['hit_properties'][field] = 'unspecified'
        
        # Validate arrays
        if 'cookies' not in badgr['hit_properties']:
            badgr['hit_properties']['cookies'] = {}
        if 'queries' not in badgr['hit_properties']:
            badgr['hit_properties']['queries'] = {}
        
    chambers = {}
    for chamber_type_name, chambers_settings in sett_configuration.items():
        chamber_type = importlib.import_module('chamber_' + chamber_type_name)
        for chamber_name, chamber_settings in chambers_settings.items():
            chambers[chamber_name] = getattr(chamber_type, chamber_type_name)(chamber_settings, chamber_name)

    
    if badgr['environment'] == 'staging':
        return badgr['destinations']

    sent_to = []
    for destination in badgr['destinations']:
        if chambers[destination] is not None:
            if chambers[destination].send(badgr):
                sent_to.append(destination)
    return json.dumps(sent_to), 200, {'ContentType': 'application/json'}
