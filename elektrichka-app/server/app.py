from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import time
import jwt
from datetime import datetime, timedelta

# Загрузка переменных окружения
load_dotenv()

app = Flask(__name__)
CORS(app)

# Конфигурация
YANDEX_API = 'https://api.rasp.yandex-net.ru/v3.0'
CLIENT_ID = os.getenv('YANDEX_CLIENT_ID')
CLIENT_SECRET = os.getenv('YANDEX_CLIENT_SECRET')
PORT = int(os.getenv('PORT', 3001))

# Кэш для токена
cached_token = None
token_expiry = None

def get_yandex_token():
    """Получение OAuth токена от Яндекса"""
    global cached_token, token_expiry
    
    try:
        # Создание JWT токена
        payload = {
            'client_id': CLIENT_ID,
            'exp': datetime.utcnow() + timedelta(hours=1)
        }
        jwt_token = jwt.sign(payload, CLIENT_SECRET, algorithm='HS256')
        
        # Получения OAuth токена
        response = requests.post(
            'https://oauth.yandex.ru/token',
            params={
                'grant_type': 'client_credentials',
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            cached_token = data['access_token']
            token_expiry = time.time() + 55 * 60 
            return cached_token
        else:
            print(f"Ошибка получения токена: {response.text}")
            return None
            
    except Exception as e:
        print(f"Ошибка: {e}")
        return None

def get_valid_token():
    """Получение валидного токена (из кэша или новый)"""
    global cached_token, token_expiry
    
    if cached_token and token_expiry and time.time() < token_expiry:
        return cached_token
    
    return get_yandex_token()

@app.route('/api/rasp/<path:path>', methods=['GET'])
def proxy_request(path):
    """Прокси для запросов к Яндекс.Расписаниям"""
    try:
        token = get_valid_token()
        if not token:
            return jsonify({'error': 'Ошибка авторизации'}), 500
        
        params = dict(request.args)
        params['format'] = 'json'
        params['lang'] = 'ru_RU'
        
        response = requests.get(
            f'{YANDEX_API}/{path}',
            params=params,
            headers={
                'Authorization': f'OAuth {token}',
                'Accept-Language': 'ru_RU'
            }
        )
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Ошибка запроса к Яндекс API'}), response.status_code
            
    except Exception as e:
        print(f"Proxy error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health():
    """Проверка работоспособности сервера"""
    return jsonify({'status': 'ok', 'client_id': CLIENT_ID[:8] + '...' if CLIENT_ID else None})

if __name__ == '__main__':
    print(f"Proxy server running on http://localhost:{PORT}")
    print(f"Client ID: {CLIENT_ID[:8] + '...' if CLIENT_ID else 'Not set'}")
    app.run(debug=True, port=PORT)