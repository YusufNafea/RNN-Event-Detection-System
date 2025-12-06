"""
LSTM Model Definition for Backend
File: backend/model.py

This file contains the same model architecture used during training.
It must match exactly for loading trained weights.
"""

import torch
import torch.nn as nn


class EventDetectionLSTM(nn.Module):
    """
    LSTM-based RNN for event detection
    
    Architecture:
    - 2 LSTM layers with 64 hidden units each
    - Dropout for regularization
    - 2 fully connected layers for classification
    """
    
    def __init__(self, input_size=4, hidden_size=64, num_layers=2, dropout=0.3):
        super(EventDetectionLSTM, self).__init__()
        
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        # LSTM layers
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0
        )
        
        # Dropout
        self.dropout = nn.Dropout(dropout)
        
        # Fully connected layers
        self.fc1 = nn.Linear(hidden_size, 32)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(32, 2)
    
    def forward(self, x):
        # LSTM forward pass
        lstm_out, (hidden, cell) = self.lstm(x)
        
        # Use last hidden state
        last_hidden = hidden[-1]
        
        # Fully connected layers
        out = self.dropout(last_hidden)
        out = self.fc1(out)
        out = self.relu(out)
        out = self.dropout(out)
        out = self.fc2(out)
        
        return out
