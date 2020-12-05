from google.cloud import bigquery
import requests
import json

def Sett(request):
    sent_to = []
    badgr = request.get_json(silent=True)
    for nest in badgr['destinations']:
        # Send data to BigQuery
        if nest == 'bq':
            bq_client = bigquery.Client.from_service_account_json('creds.json')
            table_id = 'roelpeters-blog.web.badgr_lake'
            errors = bq_client.insert_rows_json(table_id, [{"event": json.dumps(badgr)}])

            if errors == []:
                print("Badger has entered chamber: BigQuery ({})".format(nest))
                sent_to.append(nest)
            else:
                print("Badger has not reached chamber. Error message: {}".format(errors))

    return sent_to
