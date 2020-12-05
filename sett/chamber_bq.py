from google.cloud import bigquery
import json

class bq:
    def __new__(cls, settings = {}):
        if 'creds_filename' not in settings or 'table_id' not in settings:
            return None

        instance = super(bq, cls).__new__(cls)
        return instance

    def __init__(self, settings = {}):
        self.creds_filename = settings['creds_filename']
        self.table_id = settings['table_id']

    def send(self, badgr):
        bq_client = bigquery.Client.from_service_account_json(self.creds_filename)
        errors = bq_client.insert_rows_json(self.table_id, [{'event': json.dumps(badgr)}])

        if errors == []:
            print("Badger has entered chamber: BigQuery (name_insert)")
            return True
        else:
            print("Badger has not reached chamber. Error message: {}".format(errors))
            return False
        