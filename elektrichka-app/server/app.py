from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

YANDEX_API = 'https://api.rasp.yandex.net/v3.0'
API_KEY = os.getenv('YANDEX_API_KEY')
PORT = int(os.getenv('PORT', 3001))

print(f"\nAPI Key: {API_KEY[:8] if API_KEY else 'None'}...")

@app.route('/api/rasp/<path:path>', methods=['GET'])
def proxy_request(path):
    try:
        params = dict(request.args)
        params['format'] = 'json'
        params['lang'] = 'ru_RU'
        params['apikey'] = API_KEY
        
        print(f"\n{'='*60}")
        print(f"ЗАПРОС: {path}")
        print(f"Params: {params}")
        
        response = requests.get(
            f'{YANDEX_API}/{path}',
            params=params,
            headers={'Accept-Language': 'ru_RU'},
            timeout=120 
        )
        
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            print("УСПЕХ!")
            return jsonify(response.json())
        else:
            print(f"Ошибка {response.status_code}: {response.text[:200]}")
            return jsonify({'error': response.text}), response.status_code
            
    except requests.exceptions.Timeout:
        print("Timeout - запрос превысил 120 секунд")
        return jsonify({'error': 'Timeout'}), 504
    except Exception as e:
        print(f"Ошибка: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    return jsonify({'status': 'ok', 'api': YANDEX_API})

if __name__ == '__main__':
    print(f"\nServer: http://localhost:{PORT}")
    app.run(debug=True, port=PORT)