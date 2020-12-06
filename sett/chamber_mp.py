from mixpanel import Mixpanel
import json

import chamber

class mp(chamber.Chamber):


    def __init__(self, settings = {}):
        if 'api_host' not in settings:
            self.mp_client = Mixpanel(
                settings['token']
            )
        else:
            self.mp_client = Mixpanel(
                settings['token'],
                consumer = mixpanel.Consumer(api_host = settings['api_host'])
        )

    def __mapProperties(self, props):
        mapped_props = {
            '$browser': props['browser'],
            '$browser_version': props['browser_version'],
            '$device': props['device'],
            '$user_id': props['user_id'],
            '$current_url': props['current_url'],
            '$initial_referrer': props['initial_referrer'],
            '$initial_referring_domain': props['initial_referring_domain'],
            '$screen_height': props['screen_height'],
            '$screen_width': props['screen_width'],
            '$search_engine': props['referring_search_engine'],
            '$os': props['os'],
            '$referrer': props['referrer'],
            '$referring_domain': props['referring_domain'],
            'query_string': props['query_string'],
            'hit_id': props['hit_id'],
            'visit_id': props['visit_id'],
            'utm_campaign': props['utm_campaign'],
            'utm_source': props['utm_source'],
            'utm_medium': props['utm_medium'],
            'utm_content': props['utm_content'],
            'utm_term': props['utm_term'],
            'Color Depth': props['color_depth'],
            'Browser Language': props['browser language'],
            'Timezone Offset': props['timezone_offset'],
            'User Agent': props['user_agent'],
            'Protocol': props['protocol'],
            'Page Title': props['page_title'],
            'Hostname': props['hostname']
        }
        return mapped_props


    def trackEvent(self, badgr):
        self.mp_client.track(
            badgr['hit_properties']['user_id'],
            badgr['event'],
            __mapProperties(badgr['hit_properties']))
        print('Event sent to MP.')
        pass

    def trackSearch():
        pass

    def trackMetrics():
        pass

    def enrichUserProfile():
        pass

    def appendUserPropertyList():
        pass

    def trackProductView():
        pass

    def trackProductClick():
        pass

    def trackProductCartAdd():
        pass

    def trackProductCartRemove():
        pass

    def trackProductListView():
        pass

    def trackCheckoutStep():
        pass

    def trackTransaction():
        pass

    def send(self, badgr):
        {
            'event': lambda badgr : self.trackEvent(badgr)
        }[badgr['track']](badgr)
        return True
         