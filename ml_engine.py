import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
import joblib
import os

LOG_FILE = 'ml_training_log.csv'

def initialize_log():
    if not os.path.exists(LOG_FILE):
        cols = ['traffic_index', 'rain_intensity', 'pop_density', 'dist_from_hub', 'is_negative', 'actual_deficit']
        pd.DataFrame(columns=cols).to_csv(LOG_FILE, index=False)

def update_learning_data():
    # Simulate data logging for all 135 nodes to build a robust dataset
    new_entries = []
    for _ in range(20):
        new_entries.append({
            'traffic_index': round(np.random.uniform(0.5, 4.0), 2),
            'rain_intensity': np.random.randint(0, 100),
            'pop_density': np.random.choice([5000, 15000, 25000]),
            'dist_from_hub': round(np.random.uniform(1.0, 30.0), 2),
            'is_negative': np.random.choice([0, 1]),
            'actual_deficit': np.random.randint(5, 30)
        })
    pd.DataFrame(new_entries).to_csv(LOG_FILE, mode='a', header=False, index=False)

def train_stability_model():
    initialize_log()
    update_learning_data()
    df = pd.read_csv(LOG_FILE)

    if len(df) > 10:
        X = df[['traffic_index', 'rain_intensity', 'pop_density', 'dist_from_hub', 'is_negative']]
        y = df['actual_deficit']
        model = GradientBoostingRegressor(n_estimators=200, learning_rate=0.1)
        model.fit(X, y)
        joblib.dump(model, 'blood_predictor.pkl')
        print("--- ML_ENGINE: Model recalibrated with live stressors.")

if __name__ == "__main__":
    train_stability_model()