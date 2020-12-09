class Chamber:


    def __init__(self, settings = {}):
        pass

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