from google.cloud import bigquery
import requests
import json

def Sett(request):
  badgr = request.get_json(silent=True)

  #def get_geo(ip):
  #  api_key = '19ab82eab6c0412d8416056d70056015'
  #  url = f"https://api.ipgeolocation.io/ipgeo?apiKey={api_key}&ip={ip}"
  #  headers = {'accept': "application/json", 'content-type': "application/json"}
  #  response = requests.request("GET", url, headers=headers)
  #  response_text = json.loads(response.text)
  #  return response_text, response.status_code

  #geo_data, geo_status = get_geo(request_json['ip'])
  
  #if geo_status == 200:
  #  geo_dict = {}
  #  geo_dict['continent'] = geo_data['continent_name']
  #  geo_dict['country'] = geo_data['country_name']
  #  geo_dict['stateProvince'] = geo_data['state_prov']
  #  geo_dict['district'] = geo_data['district']
  #  geo_dict['zipCode'] = geo_data['zipcode']
  #  geo_dict['city'] = geo_data['city']
  #  geo_dict['longitude'] = geo_data['longitude']
  #  geo_dict['latitude'] = geo_data['latitude']
  #  geo_dict['isp'] = geo_data['isp']
  #  request_json['geo'] = geo_dict

  bq_client = bigquery.Client.from_service_account_json('creds.json')
  table_id = 'roelpeters-blog.web.badgr-lake'
  errors = bq_client.insert_rows(table_id, [('event',json.dumps(badgr))])

  if errors == []:
      print("New rows have been added.")
  else:
      print("Encountered errors while inserting rows: {}".format(errors))

  return {'status': '200'}
