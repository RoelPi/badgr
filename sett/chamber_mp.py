from mixpanel import Mixpanel
import json

import chamber

class mp(chamber.Chamber):

    def __init__(self, settings = {}, badgr = {}, name = 'unspecified_name'):
        # Create Mixpanel client
        if 'api_host' not in settings:
            self.mp_client = Mixpanel(
                settings['token']
            )
        else:
            self.mp_client = Mixpanel(
                settings['token'],
                consumer = mixpanel.Consumer(api_host = settings['api_host'])
        )

        # Map properties
        if 'hit_properties' in badgr:
            super().__init__(badgr, name)
            props = self.badgr['hit_properties']
            custom_props = {}
            for prop in props:
                if prop not in self.default_hit_props:
                    custom_props[prop] = props[prop]

            mapped_props = {
                '$browser': props['browser_name'],
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
                'ip': props['ip'],
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
            self.badgr['hit_properties'] = {**custom_props, **mapped_props}      
            
    def trackEvent(self):
        self.mp_client.track(
            self.badgr['hit_properties']['$user_id'],
            self.badgr['event'],
            self.badgr['hit_properties']
        )
        return

    def trackSearch(self):
        self.mp_client.track(
            self.badgr['hit_properties']['$user_id'],
            self.badgr['event'],
            self.badgr['hit_properties']
        )
        return

    def trackMetrics(self):
        self.mp_client.people_increment(
            self.badgr['hit_properties']['$user_id'],
            self.badgr['metrics']
        )
        return

    def enrichUserProfile(self):
        self.mp_client.people_set(
            self.badgr['hit_properties']['$user_id'],
            self.badgr['user_properties']
        )
        return

    def appendUserPropertyList(self):
        self.mp_client.people_set(
            self.badgr['hit_properties']['$user_id'],
            self.badgr['user_property_list']
        )
        return

    def trackProductView(self):
        self.mp_client.track(
            self.badgr['hit_properties']['$user_id'],
            'Product View',
            self.badgr['product_properties']
        )
        return

    def trackProductClick(self):
        self.mp_client.track(
            self.badgr['hit_properties']['$user_id'],
            'Product Click',
            self.badgr['product_properties']
        )
        return

    def trackProductCartAdd(self):
        self.mp_client.track(
            self.badgr['hit_properties']['$user_id'],
            'Add To Cart',
            self.badgr['product_properties']
        )
        return


    def trackProductCartRemove(self):
        self.mp_client.track(
            self.badgr['hit_properties']['$user_id'],
            'Remove From Cart',
            self.badgr['product_properties']
        )
        return

    def trackProductListView(self):
        self.mp_client.track(
            self.badgr['hit_properties']['$user_id'],
            'Product List View',
            {'Product List Name': self.badgr['product_list_name']}
        )
        return

    def trackCheckoutStep(self):
        self.badgr['hit_properties']['Checkout Step'] = self.badgr['step_name']
        self.mp_client.track(
            self.badgr['hit_properties']['$user_id'],
            'Checkout Step',
            self.badgr['hit_properties']
        )
        return

    def trackTransaction(self):
        self.badgr['hit_properties']['Transaction ID'] = self.badgr['transaction_id']
        self.badgr['hit_properties']['Transaction Value'] = self.badgr['transaction_value']
        self.badgr['hit_properties']['VAT'] = self.badgr['transaction_vat']
        self.mp_client.track(
            self.badgr['hit_properties']['$user_id'],
            'Transaction',
            self.badgr['hit_properties']
        )
        self.mp_client.people_track_charge(
            self.badgr['hit_properties']['$user_id'],
            self.badgr['transaction_value']
        )
        return

    def send(self):
        getattr(self,{
            'event': 'trackEvent',
            'search': 'trackSearch',
            'metrics': 'trackMetrics',
            'enrich_user': 'enrichUserProfile',
            'append_user_property_list': 'appendUserPropertyList',
            'product_view': 'trackProductView',
            'product_click': 'trackProductClick',
            'cart_add': 'trackProductCartAdd',
            'cart_remove': 'trackProductCartRemove',
            'product_list_view': 'trackProductListView',
            'step': 'trackCheckoutStep',
            'transaction': 'trackTransaction'
        }[self.badgr['track']])()
        print('Badger has entered chamber: ' + str(self.name) + '.')
        return True
         