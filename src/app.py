from flask import Flask, render_template, request, redirect, url_for
from flask_cors import CORS
from flask_wtf import Form
from wtforms import TextField
from werkzeug import secure_filename
import numpy as np
import torch
import sys
import os

from collections import Counter
from sklearn.preprocessing import LabelEncoder

from librosa.core import load
from librosa.feature import melspectrogram
from librosa import power_to_db

from model import genreNet
from config import MODELPATH
from config import GENRES

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'bucokzorbirsifre'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['PROPAGATE_EXCEPTIONS'] = False

cors = CORS(app, resources={r"*": {"origins": "http://localhost:5000"}})
URL = 'http://localhost:5000'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/uploader', methods=['GET', 'POST'])
def file_upload():

    message = ""
    error = 0
    
    if request.method == 'POST':
        f = request.files['file']
        if f.filename.split('.')[1] == 'mp3':
            f.save("static/test.mp3")
            error = 0
            message = 'success'
        else:
            error = 1
            message = 'error'
    else:
        return render_template('api.html', message="success")
    
    if error == 1:
        return render_template('api.html', message=message)
    else:
        return render_template('api.html', message=message)
    
@app.route('/analytics')
def analytics():

    message = ""

    le = LabelEncoder().fit(GENRES)

    net = genreNet()
    net.load_state_dict(torch.load(MODELPATH, map_location='cpu'))

    audio_path = os.path.realpath(os.path.dirname(__file__)) + "/static/test.mp3"
    y, sr = load(audio_path, mono=True, sr=22050)

    S = melspectrogram(y=y, sr=sr).T
    S= S[:-1 * (S.shape[0] % 128)]
    num_chunk = S.shape[0] / 128
    data_chunks = np.split(S, num_chunk)
    genres = list()
    for i, data in enumerate(data_chunks):
        data = torch.FloatTensor(data).view(1, 1, 128, 128)
        preds = net(data)
        pred_val, pred_index = preds.max(1)
        pred_index = pred_index.data.numpy()
        pred_val = np.exp(pred_val.data.numpy()[0])
        pred_genre = le.inverse_transform(pred_index).item()
        if pred_val >= 0.5:
            genres.append(pred_genre)
    s = float(sum([v for k,v in dict(Counter(genres)).items()]))
    pos_genre = sorted([(k, v/s*100 ) for k,v in dict(Counter(genres)).items()], key=lambda x:x[1], reverse=True)
    for genre, pos in pos_genre:
        message += "%10s: \t%.2f\t%%" % (genre, pos) + ","

    return render_template('analytics.html', message=message)
    
app.run(debug=True)