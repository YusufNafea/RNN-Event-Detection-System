"""
Training Script for RNN Event Detection Model
File: backend/train_model.py

This script:
1. Generates synthetic vehicle trajectory data
2. Preprocesses data for LSTM training
3. Trains the LSTM model
4. Evaluates performance
5. Saves the trained model
"""

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Import model from model.py
from model import EventDetectionLSTM

# Set random seeds
np.random.seed(42)
torch.manual_seed(42)

# ============================================================================
# DATA GENERATION
# ============================================================================

def generate_synthetic_dataset(n_sequences=1000, sequence_length=20, save_path='vehicle_data.csv'):
    """Generate synthetic vehicle movement data"""
    print("=" * 70)
    print("STEP 1: GENERATING SYNTHETIC DATASET")
    print("=" * 70)
    
    data = []
    
    for seq_id in range(n_sequences):
        has_collision = np.random.random() < 0.4
        start_x = np.random.uniform(0, 100)
        start_y = np.random.uniform(0, 100)
        
        if has_collision:
            collision_time = np.random.randint(sequence_length - 5, sequence_length)
            target_x = np.random.uniform(40, 60)
            target_y = np.random.uniform(40, 60)
            
            for t in range(sequence_length):
                progress = t / collision_time if t < collision_time else 1.0
                pos_x = start_x + (target_x - start_x) * progress
                pos_y = start_y + (target_y - start_y) * progress
                
                if t < collision_time:
                    vel_x = (target_x - start_x) / collision_time * (1 + 0.3 * progress)
                    vel_y = (target_y - start_y) / collision_time * (1 + 0.3 * progress)
                else:
                    vel_x = (target_x - start_x) / collision_time * 0.5
                    vel_y = (target_y - start_y) / collision_time * 0.5
                
                pos_x += np.random.normal(0, 0.5)
                pos_y += np.random.normal(0, 0.5)
                vel_x += np.random.normal(0, 0.2)
                vel_y += np.random.normal(0, 0.2)
                
                data.append({
                    'timestamp': t,
                    'vehicle_id': seq_id,
                    'position_x': pos_x,
                    'position_y': pos_y,
                    'velocity_x': vel_x,
                    'velocity_y': vel_y,
                    'event_label': 1
                })
        else:
            vel_x = np.random.uniform(-2, 2)
            vel_y = np.random.uniform(-2, 2)
            pos_x, pos_y = start_x, start_y
            
            for t in range(sequence_length):
                pos_x += vel_x + np.random.normal(0, 0.3)
                pos_y += vel_y + np.random.normal(0, 0.3)
                vel_x += np.random.normal(0, 0.1)
                vel_y += np.random.normal(0, 0.1)
                
                data.append({
                    'timestamp': t,
                    'vehicle_id': seq_id,
                    'position_x': pos_x,
                    'position_y': pos_y,
                    'velocity_x': vel_x,
                    'velocity_y': vel_y,
                    'event_label': 0
                })
    
    df = pd.DataFrame(data)
    df.to_csv(save_path, index=False)
    
    print(f"✓ Generated {n_sequences} sequences with {sequence_length} timesteps each")
    print(f"✓ Total data points: {len(df)}")
    print(f"✓ Collision sequences: {df[df['event_label']==1]['vehicle_id'].nunique()}")
    print(f"✓ Safe sequences: {df[df['event_label']==0]['vehicle_id'].nunique()}")
    print(f"✓ Dataset saved to: {save_path}\n")
    
    return df


# ============================================================================
# DATASET CLASS
# ============================================================================

class VehicleSequenceDataset(Dataset):
    """PyTorch Dataset for vehicle sequences"""
    
    def __init__(self, sequences, labels):
        self.sequences = torch.FloatTensor(sequences)
        self.labels = torch.LongTensor(labels)
    
    def __len__(self):
        return len(self.labels)
    
    def __getitem__(self, idx):
        return self.sequences[idx], self.labels[idx]


# ============================================================================
# DATA PREPROCESSING
# ============================================================================

def preprocess_data(df, sequence_length=20, test_size=0.2):
    """Preprocess data into sequences"""
    print("=" * 70)
    print("STEP 2: DATA PREPROCESSING")
    print("=" * 70)
    
    feature_cols = ['position_x', 'position_y', 'velocity_x', 'velocity_y']
    sequences = []
    labels = []
    
    for vehicle_id in df['vehicle_id'].unique():
        vehicle_data = df[df['vehicle_id'] == vehicle_id].sort_values('timestamp')
        features = vehicle_data[feature_cols].values
        label = vehicle_data['event_label'].iloc[0]
        
        if len(features) == sequence_length:
            sequences.append(features)
            labels.append(label)
    
    sequences = np.array(sequences)
    labels = np.array(labels)
    
    print(f"✓ Created {len(sequences)} sequences")
    print(f"✓ Sequence shape: {sequences.shape}")
    print(f"✓ Class distribution: {np.bincount(labels)}\n")
    
    # Split data
    X_temp, X_test, y_temp, y_test = train_test_split(
        sequences, labels, test_size=test_size, random_state=42, stratify=labels
    )
    
    X_train, X_val, y_train, y_val = train_test_split(
        X_temp, y_temp, test_size=0.2, random_state=42, stratify=y_temp
    )
    
    # Normalize
    scaler = StandardScaler()
    n_train, seq_len, n_features = X_train.shape
    X_train_reshaped = X_train.reshape(-1, n_features)
    X_train_scaled = scaler.fit_transform(X_train_reshaped)
    X_train = X_train_scaled.reshape(n_train, seq_len, n_features)
    
    n_val = X_val.shape[0]
    X_val_reshaped = X_val.reshape(-1, n_features)
    X_val_scaled = scaler.transform(X_val_reshaped)
    X_val = X_val_scaled.reshape(n_val, seq_len, n_features)
    
    n_test = X_test.shape[0]
    X_test_reshaped = X_test.reshape(-1, n_features)
    X_test_scaled = scaler.transform(X_test_reshaped)
    X_test = X_test_scaled.reshape(n_test, seq_len, n_features)
    
    print(f"✓ Data split - Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")
    print(f"✓ Features normalized\n")
    
    # Create DataLoaders
    train_dataset = VehicleSequenceDataset(X_train, y_train)
    val_dataset = VehicleSequenceDataset(X_val, y_val)
    test_dataset = VehicleSequenceDataset(X_test, y_test)
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)
    
    return train_loader, val_loader, test_loader, scaler


# ============================================================================
# TRAINING
# ============================================================================

def train_model(model, train_loader, val_loader, num_epochs=50, learning_rate=0.001):
    """Train the model"""
    print("=" * 70)
    print("STEP 3: MODEL TRAINING")
    print("=" * 70)
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"✓ Using device: {device}\n")
    
    model = model.to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
    
    history = {
        'train_loss': [],
        'val_loss': [],
        'train_acc': [],
        'val_acc': []
    }
    
    best_val_acc = 0.0
    
    for epoch in range(num_epochs):
        # Training
        model.train()
        train_loss = 0.0
        train_correct = 0
        train_total = 0
        
        for sequences, labels in train_loader:
            sequences, labels = sequences.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(sequences)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            train_total += labels.size(0)
            train_correct += (predicted == labels).sum().item()
        
        # Validation
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0
        
        with torch.no_grad():
            for sequences, labels in val_loader:
                sequences, labels = sequences.to(device), labels.to(device)
                outputs = model(sequences)
                loss = criterion(outputs, labels)
                
                val_loss += loss.item()
                _, predicted = torch.max(outputs.data, 1)
                val_total += labels.size(0)
                val_correct += (predicted == labels).sum().item()
        
        train_loss = train_loss / len(train_loader)
        val_loss = val_loss / len(val_loader)
        train_acc = 100 * train_correct / train_total
        val_acc = 100 * val_correct / val_total
        
        history['train_loss'].append(train_loss)
        history['val_loss'].append(val_loss)
        history['train_acc'].append(train_acc)
        history['val_acc'].append(val_acc)
        
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), 'models/best_model.pth')
        
        if (epoch + 1) % 10 == 0:
            print(f"Epoch [{epoch+1}/{num_epochs}]")
            print(f"  Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%")
            print(f"  Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%")
    
    print(f"\n✓ Training completed!")
    print(f"✓ Best validation accuracy: {best_val_acc:.2f}%\n")
    
    return history


# ============================================================================
# EVALUATION
# ============================================================================

def evaluate_model(model, test_loader):
    """Evaluate model on test set"""
    print("=" * 70)
    print("STEP 4: MODEL EVALUATION")
    print("=" * 70)
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = model.to(device)
    model.eval()
    
    all_predictions = []
    all_labels = []
    
    with torch.no_grad():
        for sequences, labels in test_loader:
            sequences, labels = sequences.to(device), labels.to(device)
            outputs = model(sequences)
            _, predicted = torch.max(outputs.data, 1)
            
            all_predictions.extend(predicted.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    
    accuracy = accuracy_score(all_labels, all_predictions)
    precision = precision_score(all_labels, all_predictions, average='binary')
    recall = recall_score(all_labels, all_predictions, average='binary')
    f1 = f1_score(all_labels, all_predictions, average='binary')
    cm = confusion_matrix(all_labels, all_predictions)
    
    print(f"✓ Accuracy:  {accuracy:.4f}")
    print(f"✓ Precision: {precision:.4f}")
    print(f"✓ Recall:    {recall:.4f}")
    print(f"✓ F1-Score:  {f1:.4f}\n")
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'confusion_matrix': cm,
        'predictions': all_predictions,
        'labels': all_labels
    }


# ============================================================================
# VISUALIZATION
# ============================================================================

def plot_results(history, metrics):
    """Plot training results"""
    print("=" * 70)
    print("STEP 5: VISUALIZATION")
    print("=" * 70)
    
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    
    # Loss
    axes[0, 0].plot(history['train_loss'], label='Train Loss', linewidth=2)
    axes[0, 0].plot(history['val_loss'], label='Val Loss', linewidth=2)
    axes[0, 0].set_xlabel('Epoch')
    axes[0, 0].set_ylabel('Loss')
    axes[0, 0].set_title('Training and Validation Loss')
    axes[0, 0].legend()
    axes[0, 0].grid(True, alpha=0.3)
    
    # Accuracy
    axes[0, 1].plot(history['train_acc'], label='Train Accuracy', linewidth=2)
    axes[0, 1].plot(history['val_acc'], label='Val Accuracy', linewidth=2)
    axes[0, 1].set_xlabel('Epoch')
    axes[0, 1].set_ylabel('Accuracy (%)')
    axes[0, 1].set_title('Training and Validation Accuracy')
    axes[0, 1].legend()
    axes[0, 1].grid(True, alpha=0.3)
    
    # Confusion Matrix
    cm = metrics['confusion_matrix']
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[1, 0],
                xticklabels=['Safe', 'Collision'],
                yticklabels=['Safe', 'Collision'])
    axes[1, 0].set_xlabel('Predicted Label')
    axes[1, 0].set_ylabel('True Label')
    axes[1, 0].set_title('Confusion Matrix')
    
    # Metrics
    metric_names = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
    metric_values = [metrics['accuracy'], metrics['precision'], 
                     metrics['recall'], metrics['f1_score']]
    
    bars = axes[1, 1].bar(metric_names, metric_values, 
                          color=['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'])
    axes[1, 1].set_ylabel('Score')
    axes[1, 1].set_title('Evaluation Metrics')
    axes[1, 1].set_ylim([0, 1])
    axes[1, 1].grid(True, alpha=0.3, axis='y')
    
    for bar in bars:
        height = bar.get_height()
        axes[1, 1].text(bar.get_x() + bar.get_width()/2., height,
                       f'{height:.3f}', ha='center', va='bottom')
    
    plt.tight_layout()
    plt.savefig('training_results.png', dpi=300, bbox_inches='tight')
    print("✓ Results plotted and saved to 'training_results.png'\n")
    plt.close()


# ============================================================================
# MAIN
# ============================================================================

def main():
    """Main training pipeline"""
    print("\n" + "=" * 70)
    print("RNN EVENT DETECTION - MODEL TRAINING")
    print("=" * 70 + "\n")
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Step 1: Generate data
    df = generate_synthetic_dataset(n_sequences=1000, sequence_length=20)
    
    # Step 2: Preprocess
    train_loader, val_loader, test_loader, scaler = preprocess_data(df)
    
    # Step 3: Create model
    model = EventDetectionLSTM(
        input_size=4,
        hidden_size=64,
        num_layers=2,
        dropout=0.3
    )
    
    print("=" * 70)
    print("MODEL ARCHITECTURE")
    print("=" * 70)
    print(model)
    print()
    
    # Step 4: Train
    history = train_model(
        model=model,
        train_loader=train_loader,
        val_loader=val_loader,
        num_epochs=50,
        learning_rate=0.001
    )
    
    # Step 5: Load best model and evaluate
    model.load_state_dict(torch.load('models/best_model.pth'))
    metrics = evaluate_model(model, test_loader)
    
    # Step 6: Visualize
    plot_results(history, metrics)
    
    print("=" * 70)
    print("TRAINING COMPLETED SUCCESSFULLY!")
    print("=" * 70)
    print("\nFiles generated:")
    print("  1. vehicle_data.csv - Training dataset")
    print("  2. models/best_model.pth - Trained model weights")
    print("  3. training_results.png - Visualization")
    print("\n" + "=" * 70 + "\n")


if __name__ == "__main__":
    main()