from unittest.mock import Mock

import main


def test_Sett():
    name = 'test'
    data = {
        'track': 'event',
        'event': 'test',
        'hit_properties': {'test': 'true'},
        'destinations': ['my_bq','my_mp'],
        'environment': 'production'
    }
    req = Mock(get_json=Mock(return_value=data), args=data)

    # Call tested function
    assert main.Sett(req) == ('["my_bq", "my_mp"]', 200, {'ContentType': 'application/json'})

test_Sett()