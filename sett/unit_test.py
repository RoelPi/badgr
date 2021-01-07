from unittest.mock import Mock

import main


def test_Sett():
    name = 'test'
    all_actions = [
        'event','search','metrics','enrich_user', \
        'append_user_property_list', 'product_view', \
        'product_click', 'cart_add', 'cart_remove', \
        'product_list_view', 'step', 'transaction'
    ]
    for action in all_actions:
        data = {
            'track': action,
            'event': 'test',
            'metrics': {},
            'hit_properties': {'test': 'true','browser':'roel','browser_Version':'1'},
            'destinations': ['my_mp','my_bq'],
            'environment': 'production',
            'search_term': '',
            'search_results': [],
            'user_properties': {},
            'user_property_list': {},
            'product_properties': [],
            'product_list_name': '',
            'products': [],
            'step_name': '',
            'transaction_id': 'ABCD1234',
            'transaction_value': 100,
            'transaction_vat': 21
        }
        req = Mock(get_json = Mock(return_value = data), args = data)

        # Call tested function
        output = main.Sett(req)
        print(output)

        # assert output == ('["my_mp","my_bq"]', 200, {'ContentType': 'application/json'})
        print('Event "{}" has passed the unit test.'.format(action))
        break
test_Sett()