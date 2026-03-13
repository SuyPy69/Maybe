from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import joblib
import random
import numpy as np

app = Flask(__name__)
CORS(app)

hospitals_df = pd.read_csv('hospitals_detailed.csv')
HUB = (12.9767, 77.5713)

try:
    model = joblib.load('blood_predictor.pkl')
except:
    model = None

def get_node_stats(h, traffic, rain, bg):
    is_neg = 1 if 'neg' in bg else 0
    lat, lon = map(float, h['location'].split(','))
    dist = np.sqrt((lat - HUB[0])**2 + (lon - HUB[1])**2) * 111
    pop = h.get('pop_density', 10000)

    if model:
        pred = model.predict([[traffic, rain, pop, dist, is_neg]])[0]
    else:
        pred = random.uniform(2, 12)

    threshold = int(15 * (1.6 if dist < 6 else 1.2) * (1.4 if is_neg else 1.0))
    return {
        "threshold": threshold,
        "predicted_drain": round(pred, 1),
        "risk": "CRITICAL" if (h[bg] - pred) < threshold else "STABLE"
    }

@app.route('/hospitals')
def get_hospitals():
    return jsonify(hospitals_df.to_dict(orient='records'))

@app.route('/predict_all_nodes')
def predict_all():
    t, r = round(random.uniform(0.5, 4.0), 2), random.randint(0, 100)
    results = [{"id": h['id'], "analysis": {bg: get_node_stats(h, t, r, bg) for bg in ['O_pos', 'O_neg', 'A_pos', 'A_neg', 'B_pos', 'B_neg', 'AB_pos', 'AB_neg']}} for _, h in hospitals_df.iterrows()]
    return jsonify({"telemetry": {"traffic": t, "rain": r}, "global_status": "CRITICAL" if t > 3.2 else "OPTIMAL", "nodes": results})

if __name__ == '__main__':
    app.run(port=8000, debug=True)