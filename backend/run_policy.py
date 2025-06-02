from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os
import re

app = Flask(__name__)
CORS(app)  # 允许所有跨域请求

IMG_DIR = r'C:\Users\wcc\code\py\wrjv1\MACA\render\tmp'

@app.route('/run_policy', methods=['POST'])
def run_policy():
    work_dir = r'C:\Users\wcc\code\py\wrjv1'
    command = r'conda run -n maca python .\MACA\algorithm\ippo\TestPolicy_detect.py'
    process = subprocess.Popen(
        command,
        cwd=work_dir,
        shell=True
    )
    return jsonify({'status': 'started', 'pid': process.pid})

@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory(IMG_DIR, filename)

@app.route('/images_list')
def images_list():
    # 只返回形如数字.png的文件，并按数字排序
    files = [f for f in os.listdir(IMG_DIR) if re.fullmatch(r'\d+\.png', f)]
    files.sort(key=lambda x: int(x.split('.')[0]))
    return jsonify(files)

@app.route('/clear_images', methods=['POST'])
def clear_images():
    for f in os.listdir(IMG_DIR):
        if re.fullmatch(r'\d+\.png', f):
            os.remove(os.path.join(IMG_DIR, f))
    return jsonify({'status': 'cleared'})

if __name__ == '__main__':
    app.run(port=5001) 