class Chamber:

    def __init__(self, badgr = {}, name = 'unspecified_name'):
        self.name = name
        self.badgr = badgr

        # Validate default hit properties
        self.default_hit_props = ['browser_name','browser_version','device','user_id', \
            'current_url','initial_referrer','initial_referring_domain', \
            'screen_height','screen_width','referring_search_engine', \
            'os','referrer','referring_domain','query_string','hit_id', \
            'visit_id','utm_campaign','utm_source','utm_medium','utm_content', \
            'utm_term','color_depth','browser_language','timezone_offset', \
            'user_agent', 'protocol', 'page_title', 'hostname','ip']

        for default_hit_prop in self.default_hit_props:
            if default_hit_prop not in self.badgr['hit_properties']:
                self.badgr['hit_properties'][default_hit_prop] = 'unspecified'

        # Validate default hit lists
        self.default_dicts = ['cookies','queries']
        for default_dict in self.default_dicts:
            if default_dict not in self.badgr['hit_properties']:
                self.badgr['hit_properties'][default_dict] = {}

    def trackEvent(self, badgr):
        return "This method is not supported."
    def trackSearch(self, badgr):
        return "This method is not supported."
    def trackMetrics(self, badgr):
        return "This method is not supported."
    def enrichUserProfile(self, badgr):
        return "This method is not supported."
    def appendUserPropertyList(self, badgr):
        return "This method is not supported."
    def trackProductView(self, badgr):
        return "This method is not supported."
    def trackProductClick(self, badgr):
        return "This method is not supported."
    def trackProductCartAdd(self, badgr):
        return "This method is not supported."
    def trackProductCartRemove(self, badgr):
        return "This method is not supported."
    def trackProductListView(self, badgr):
        return "This method is not supported."
    def trackCheckoutStep(self, badgr):
        return "This method is not supported."
    def trackTransaction(self, badgr):
        return "This method is not supported."
    def send(self, badgr):
        {
            'event': None,
            'search': None,
            'metrics': None,
            'enrich_user': None,
            'user_property_list': None,
            'product_view': None,
            'product_click': None,
            'cart_add': None,
            'cart_remove': None,
            'product_list_view': None,
            'step': None,
            'transaction': None
        }[badgr['track']]
        return True