from google.cloud import bigquery
import json

import chamber

class bq(chamber.Chamber):
    def __init__(self, settings = {}, badgr = {}, name = 'unspecified_name'):
        self.creds_filename = settings['creds_filename']
        self.table_id = settings['table_id']
        self.name = name
        self.badgr = badgr
        self.bq_client = bigquery.Client.from_service_account_json(self.creds_filename)


    def send(self):
        errors = []
        errors = self.bq_client.insert_rows_json(self.table_id, [{'event': json.dumps(self.badgr)}])
        if errors == []:
            print("Badger has entered chamber: " + str(self.name) + ".")
            return True
        else:
            print("Badger has not reached chamber (" + str(self.name) + "). Error message: {}".format(errors))
            return False
        