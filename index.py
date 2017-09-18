from flask import Flask, render_template, jsonify, url_for, request
from flask_jsglue import JSGlue
import random
from uuid import uuid1

app = Flask(__name__)
jsglue = JSGlue()
jsglue.init_app(app)
results = []
chars = 'ABCDEFGHIJKLMNOPQRSTUVWSYZ'
results.append({'name': 'vue.js+flask+element-ui简易Demo', 'flag': 'true'})
results.append({'name': '代码请戳github', 'flag': 'true','url':'https://github.com/qianbin01/Vue-flask'})
for i in range(5):
    results.append({'name': random.choice(chars), 'index': str(uuid1())})


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/get_base_data')
def get_base_data():
    return jsonify({'results': results})


@app.route('/add', methods=['POST'])
def add():
    name = request.json.get('name')
    results.append({'name': name, 'index': str(uuid1())})
    print(results)
    return jsonify({'message': '添加成功！'}), 200


@app.route('/update', methods=['PUT'])
def update():
    name = request.json.get('name')
    index = request.json.get('index')
    for item in results:
        if item['index'] == index:
            item['name'] = name
            break
    return jsonify({'message': '添加成功！'}), 200


@app.route('/delete', methods=['DELETE'])
def delete():
    name = request.args.get('name')
    index = request.args.get('index')
    results.remove({'name': name, 'index': index})
    return jsonify({'message': '删除成功！'}), 200


if __name__ == '__main__':
    app.run(debug=True)
