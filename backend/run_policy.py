from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import subprocess
import os
import re
import yaml

app = Flask(__name__)
CORS(app)  # 允许所有跨域请求

# 基础目录路径，全局共享使用
BASE_DIR = r'C:\Users\wcc\code\py\wrjv1'
IMG_DIR = os.path.join(BASE_DIR, 'MACA', 'render', 'tmp')

# 地图名称映射表
MAP_NAME_MAPPING = {
    'map1': 'dz_easy_v5',          # 对战场景-简单
    'map2': 'dz_medium_v7',     # 对战场景-中等
    'map3': 'dz_hard_v8',       # 对战场景-困难
    'map4': 'zc_easy',          # 侦察场景-简单
    'map5': 'zc_medium',        # 侦察场景-中等
    'map6': 'zc_hard'           # 侦察场景-困难
}

# 环境类型映射表
ENV_TYPE_MAPPING = {
    'map1': 'CannonReconnHieraricalEnv',  # 对战场景
    'map2': 'CannonReconnHieraricalEnv',  # 对战场景
    'map3': 'CannonReconnHieraricalEnv',  # 对战场景
    'map4': 'RaderReconnHieraricalEnv',   # 侦察场景
    'map5': 'RaderReconnHieraricalEnv',   # 侦察场景
    'map6': 'RaderReconnHieraricalEnv'    # 侦察场景
}

@app.route('/run_policy_detect', methods=['POST'])
def run_policy_detect():
    data = request.get_json()
    frontend_map = data.get('map', 'map1')  # 默认为map1
    
    # 映射到实际地图名称
    map_name = MAP_NAME_MAPPING.get(frontend_map, 'sz_easy')
    
    command = f'conda run -n maca python .\\MACA\\algorithm\\ippo\\TestPolicy_detect.py --map_name {map_name}'
    process = subprocess.Popen(
        command,
        cwd=BASE_DIR,
        shell=True
    )
    return jsonify({'status': 'started', 'pid': process.pid, 'map': map_name})

@app.route('/run_policy', methods=['POST'])
def run_policy():
    data = request.get_json()
    frontend_map = data.get('map', 'map1')  # 默认为map1
    
    # 映射到实际地图名称
    map_name = MAP_NAME_MAPPING.get(frontend_map, 'sz_easy')
    
    command = f'conda run -n maca python .\\MACA\\algorithm\\ippo\\TestPolicy.py --map_name {map_name}'
    process = subprocess.Popen(
        command,
        cwd=BASE_DIR,
        shell=True
    )
    return jsonify({'status': 'started', 'pid': process.pid, 'map': map_name})

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

@app.route('/download_replay_gif/<map_id>')
def download_replay_gif(map_id):
    # 确定环境类型和地图名称
    env_type = ENV_TYPE_MAPPING.get(map_id, 'CannonReconnHieraricalEnv')
    map_name = MAP_NAME_MAPPING.get(map_id, 'dz_easy')
    
    # 构建GIF路径
    gif_path = os.path.join(
        BASE_DIR, 
        'MACA', 'algorithm', 'ippo', 'result', 
        env_type, map_name, 'render_0.gif'
    )
    
    # 检查文件是否存在
    if os.path.exists(gif_path):
        return send_file(
            gif_path,
            mimetype='image/gif',
            as_attachment=True,
            download_name=f'{map_name}_replay.gif'
        )
    else:
        return jsonify({'status': 'error', 'message': 'Replay file not found'}), 404

@app.route('/submit_params', methods=['POST'])
def submit_params():
    data = request.get_json()
    print('Received params:', data)
    
    # 获取地图ID
    map_id = data.get('map', 'map1')
    # 根据地图ID获取环境类型
    env_type = ENV_TYPE_MAPPING.get(map_id, 'CannonReconnHieraricalEnv')
    
    print(f'Map ID: {map_id}, Environment Type: {env_type}')
    
    # 参数映射表
    param_mapping = {
        'radius': {
            'recons': {
                'RaderReconnHieraricalEnv': {
                    'small': 70,
                    'medium': 85,
                    'large': 90
                },
                'CannonReconnHieraricalEnv': {
                    'small': 180,
                    'medium': 200,
                    'large': 220
                }
            },
            'cannons': {
                'small': 50,
                'medium': 60,
                'large': 70
            },
            'defenses': {
                'small': 50,
                'medium': 75,
                'large': 90
            }
        },
        'speed': {
            'slow': 35,
            'medium': 40,
            'fast': 45
        }
    }
    
    # 预处理参数：将字符串转换为数值
    processed_data = {}
    
    # 处理红方参数
    if 'red' in data:
        processed_data['red'] = {}
        for unit_type, units in data['red'].items():
            processed_data['red'][unit_type] = {}
            for unit_id, params in units.items():
                processed_data['red'][unit_type][unit_id] = {}
                for param_name, param_value in params.items():
                    if param_name == 'radius' and unit_type == 'recons':
                        # 使用环境类型选择对应的半径参数
                        if param_value in param_mapping['radius']['recons'][env_type]:
                            processed_data['red'][unit_type][unit_id][param_name] = param_mapping['radius']['recons'][env_type][param_value]
                        else:
                            processed_data['red'][unit_type][unit_id][param_name] = param_value
                    elif param_name == 'radius' and param_value in param_mapping['radius'].get(unit_type, {}):
                        processed_data['red'][unit_type][unit_id][param_name] = param_mapping['radius'][unit_type][param_value]
                    elif param_name == 'speed' and param_value in param_mapping['speed']:
                        processed_data['red'][unit_type][unit_id][param_name] = param_mapping['speed'][param_value]
                    else:
                        processed_data['red'][unit_type][unit_id][param_name] = param_value
    
    # 处理蓝方参数
    if 'blue' in data:
        processed_data['blue'] = {}
        for unit_type, units in data['blue'].items():
            processed_data['blue'][unit_type] = {}
            for unit_id, params in units.items():
                processed_data['blue'][unit_type][unit_id] = {}
                for param_name, param_value in params.items():
                    if param_name == 'radius' and unit_type == 'recons':
                        # 使用环境类型选择对应的半径参数
                        if param_value in param_mapping['radius']['recons'][env_type]:
                            processed_data['blue'][unit_type][unit_id][param_name] = param_mapping['radius']['recons'][env_type][param_value]
                        else:
                            processed_data['blue'][unit_type][unit_id][param_name] = param_value
                    elif param_name == 'radius' and param_value in param_mapping['radius'].get(unit_type, {}):
                        processed_data['blue'][unit_type][unit_id][param_name] = param_mapping['radius'][unit_type][param_value]
                    elif param_name == 'speed' and param_value in param_mapping['speed']:
                        processed_data['blue'][unit_type][unit_id][param_name] = param_mapping['speed'][param_value]
                    else:
                        processed_data['blue'][unit_type][unit_id][param_name] = param_value
    
    # 保存到YAML文件
    config_path = os.path.join(BASE_DIR, 'MACA', 'utils', 'frontend_params.yaml')
    
    with open(config_path, 'w') as f:
        yaml.dump(processed_data, f, default_flow_style=False)
    
    print(f'Processed params saved to {config_path}')
    return jsonify({'status': 'ok', 'file_path': config_path})

# 图片展示接口
@app.route('/static/<filename>')
def serve_static_file(filename):
    """提供静态文件服务"""
    static_dir = os.path.join(os.path.dirname(__file__), 'static')
    try:
        return send_from_directory(static_dir, filename)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

@app.route('/image/<int:image_number>')
def serve_image_by_number(image_number):
    """通过编号访问图片（1-6对应01.png-06.png）"""
    if not 1 <= image_number <= 6:
        return jsonify({'error': 'Image number must be between 1 and 6'}), 400
    
    filename = f'{image_number:02d}.png'
    static_dir = os.path.join(os.path.dirname(__file__), 'static')
    
    try:
        return send_from_directory(static_dir, filename)
    except FileNotFoundError:
        return jsonify({'error': f'Image {filename} not found'}), 404

@app.route('/images')
def list_images():
    """返回所有可用图片的列表和访问链接"""
    static_dir = os.path.join(os.path.dirname(__file__), 'static')
    try:
        files = os.listdir(static_dir)
        image_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        image_files.sort()
        
        images_info = []
        for i, img_file in enumerate(image_files, 1):
            images_info.append({
                'filename': img_file,
                'number': i,
                'url_by_name': f'/static/{img_file}',
                'url_by_number': f'/image/{i}'
            })
        
        return jsonify({
            'status': 'success',
            'count': len(image_files),
            'images': images_info
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001) 