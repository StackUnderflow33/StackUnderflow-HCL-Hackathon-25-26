import urllib.request
import json

url = 'http://localhost:8080/api/auth/login'
data = {'email': 'admin@hotel.com', 'password': 'admin123'}

req = urllib.request.Request(url)
req.add_header('Content-Type', 'application/json; charset=utf-8')

jsondata = json.dumps(data)
jsondataasbytes = jsondata.encode('utf-8')
req.add_header('Content-Length', len(jsondataasbytes))

try:
    response = urllib.request.urlopen(req, jsondataasbytes)
    print("STATUS:", response.status)
    print("BODY:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("ERROR STATUS:", e.code)
    print("ERROR BODY:", e.read().decode('utf-8'))
except Exception as e:
    print("OTHER ERROR:", str(e))
