import json
import chamber
class ga(chamber.Chamber):
    def __init__(self, settings = {}, badgr = {}, name = 'unspecified_name'):
        # Create GA client


        # Map properties
        if 'hit_properties' in badgr:
            super().__init__(badgr, name)
            props = badgr['hit_properties']
            custom_props = {}
            for prop in props:
                if prop not in self.default_hit_props:
                    custom_props[prop] = props[prop]
            mapped_props = {

            }
            self.badgr['hit_properties'] = {**custom_props, **mapped_props} 

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