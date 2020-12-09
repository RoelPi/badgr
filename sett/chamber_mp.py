from mixpanel import Mixpanel
import json

import chamber

class mp(chamber.Chamber):


    def __init__(self, settings = {}, name = 'unspecified_name'):
        if 'api_host' not in settings:
            self.mp_client = Mixpanel(
                settings['token']
            )
        else:
            self.mp_client = Mixpanel(
                settings['token'],
                consumer = mixpanel.Consumer(api_host = settings['api_host'])
        )
        self.name = name

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
            '$ip': props['ip'],
            'Query String': props['query_string'],
            'hit_id': props['hit_id'],
            'visit_id': props['visit_id'],
            'utm_campaign': props['utm_campaign'],
            'utm_source': props['utm_source'],
            'utm_medium': props['utm_medium'],
            'utm_content': props['utm_content'],
            'utm_term': props['utm_term'],
            'Color Depth': props['color_depth'],
            'Browser Language': props['browser_language'],
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
            self.__mapProperties(badgr['hit_properties']))
        print('Badger has entered chamber: ' + str(self.name) + '.')
        pass

    def trackSearch(self, badgr):
        self.mp_client.track(
            badgr['hit_properties']['user_id'],
            badgr['event'],
            self.__mapProperties(badgr['hit_properties'])
        print('Badger has entered chamber: ' + str(self.name) + '.')

        )
        pass

    def trackMetrics(self, badgr):
        self.mp_client.people_increment(
            badgr['hit_properties']['user_id'],
            badgr['metrics']
        )
        print('Badger has entered chamber: ' + str(self.name) + '.')
        pass

    def enrichUserProfile(self, badgr):
        self.mp_client.people_set(
            badgr['hit_properties']['user_id'],
            badgr['user_properties']
        )
        print('Badger has entered chamber: ' + str(self.name) + '.')
        pass

    def appendUserPropertyList(self, badgr):
        self.mp_client.people_set(
            badgr['hit_properties']['user_id'],
            badgr['user_property_list']
        )
        print('Badger has entered chamber: ' + str(self.name) + '.')
        pass

    def trackProductView(self, badgr):
        self.mp_client.track(
            badgr['hit_properties']['user_id'],
            'Product View',
            badgr['product_properties'])
        print('Badger has entered chamber: ' + str(self.name) + '.')
        pass

    def trackProductClick(self, badgr):
        self.mp_client.track(
            badgr['hit_properties']['user_id'],
            'Product Click',
            badgr['product_properties']
        )
        print('Badger has entered chamber: ' + str(self.name) + '.')
        pass

    def trackProductCartAdd(self, badgr):
        self.mp_client.track(
            badgr['hit_properties']['user_id'],
            'Add To Cart',
            badgr['product_properties']
        )
        print('Badger has entered chamber: ' + str(self.name) + '.')
        pass


    def trackProductCartRemove(self, badgr):
        self.mp_client.track(
            badgr['hit_properties']['user_id'],
            'Remove From Cart',
            badgr['product_properties']
        )
        print('Badger has entered chamber: ' + str(self.name) + '.')
        pass

    def trackProductListView(self, badgr):
        self.mp_client.track(
            badgr['hit_properties']['user_id'],
            'Product List View',
            {'Product List Name': badgr['product_list_name']}
        )
        print('Badger has entered chamber: ' + str(self.name) + '.')
        pass

    def trackCheckoutStep(self, badgr):
        badgr['hit_properties']['Checkout Step'] = badgr['step_name']
        self.mp_client.track(
            badgr['hit_properties']['user_id'],
            'Checkout Step',
            badgr['hit_properties']
        )
        print('Badger has entered chamber: ' + str(self.name) + '.')
        pass

    def trackTransaction(self, badgr):
        badgr['hit_properties']['Transaction ID'] = badgr['transaction_id']
        badgr['hit_properties']['Transaction Value'] = badgr['transaction_value']
        badgr['hit_properties']['VAT'] = badgr['transaction_vat']
        self.mp_client.track(
            badgr['hit_properties']['user_id'],
            'Transaction',
            badgr['hit_properties']
        )
        self.mp_client.people_track_charge(
            badgr['hit_properties']['user_id'],
            badgr['transaction_value']
        )
        print('Badger has entered chamber: ' + str(self.name) + '.')
        pass

    def send(self, badgr):
        {
            'event': self.trackEvent(badgr),
            'search': self.trackSearch(badgr),
            'metrics': self.trackMetrics(badgr),
            'enrich_user': self.enrichUserProfile(badgr),
            'user_property_list': self.appendUserPropertyList(badgr),
            'product_view': self.trackProductView(badgr),
            'product_click': self.trackProductClick(badgr),
            'cart_add': self.trackProductCartAdd(badgr),
            'cart_remove': self.trackProductCartRemove(badgr),
            'product_list_view': self.trackProductListView(badgr),
            'step': self.trackStep(badgr),
            'transaction': self.trackTransaction(badgr)
        }[badgr['track']]
        return True
         