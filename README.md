<img width="701" height="1621" alt="RNN-Event-Detection-System_Project Diagram" src="https://github.com/user-attachments/assets/1562dbb1-bcca-4e4c-88b7-6fb0c7556cf3" />
🚗 RNN Event Detection System - Complete Documentation
Table of Contents

System Overview
Architecture
Machine Learning Model
Backend Documentation
Frontend Documentation
Data Flow
API Documentation
Setup Guide
Troubleshooting


1. System Overview
What is This System?
The RNN Event Detection System is an AI-powered web application that predicts potential vehicle collisions by analyzing vehicle movement patterns. It uses deep learning (specifically LSTM neural networks) to detect dangerous trajectories before accidents occur.
Real-World Applications

Autonomous Vehicles: Predict collisions before they happen
Traffic Management: Identify dangerous intersections
Fleet Management: Monitor driver behavior
Insurance: Risk assessment
Smart Cities: Traffic flow optimization

Key Features
✅ Real-time prediction - Analyze vehicle trajectories in seconds
✅ High accuracy - 85-90% prediction accuracy
✅ Visual results - Interactive charts and tables
✅ CSV file support - Easy data upload
✅ Web-based - No installation needed
✅ RESTful API - Can integrate with other systems

2. Architecture
System Architecture Diagram
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │   React Frontend (JavaScript)                       │    │
│  │   - UI Components                                   │    │
│  │   - Data Visualization (Charts)                     │    │
│  │   - File Upload Interface                           │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                        SERVER (WSL/Linux)                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │   Flask Backend (Python)                            │    │
│  │   - REST API Endpoints                              │    │
│  │   - Data Preprocessing                              │    │
│  │   - Model Loading                                   │    │
│  └────────────────────────────────────────────────────┘    │
│                            ↕                                 │
│  ┌────────────────────────────────────────────────────┐    │
│  │   PyTorch LSTM Model                                │    │
│  │   - 2-Layer LSTM Network                            │    │
│  │   - 64 Hidden Units per Layer                       │    │
│  │   - Binary Classification (Safe/Collision)          │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
Technology Stack
LayerTechnologyPurposeFrontendReact 18User interface and interactionsStylingTailwindCSSModern, responsive designChartsChart.jsData visualizationBackendFlask 2.3REST API serverML FrameworkPyTorch 2.0Deep learningData ProcessingNumPy, PandasData manipulationModel TypeLSTM (RNN)Sequential data analysis

3. Machine Learning Model
3.1 What is an LSTM?
LSTM stands for Long Short-Term Memory. It's a type of Recurrent Neural Network (RNN) designed to remember patterns over time.
Why LSTM for Vehicle Collision Detection?
Regular Neural Networks look at data as a snapshot:
Input: [position_x, position_y, velocity_x, velocity_y]
Output: Safe or Collision
Problem: Can't see how the vehicle moved over time
LSTM Networks look at data as a movie:
Input: 20 frames of vehicle movement
Each frame: [position_x, position_y, velocity_x, velocity_y]
Output: Safe or Collision
Advantage: Sees the trajectory pattern over time
3.2 Model Architecture Explained
Visual Representation
Input Sequence (20 timesteps × 4 features)
        ↓
┌─────────────────────────────────────┐
│  LSTM Layer 1 (64 hidden units)     │  ← Learns basic movement patterns
│  - Remembers previous positions     │
│  - Tracks velocity changes          │
└─────────────────────────────────────┘
        ↓
    Dropout (30%)  ← Prevents overfitting
        ↓
┌─────────────────────────────────────┐
│  LSTM Layer 2 (64 hidden units)     │  ← Learns complex patterns
│  - Identifies collision trajectories │
│  - Recognizes safe behaviors        │
└─────────────────────────────────────┘
        ↓
    Dropout (30%)
        ↓
┌─────────────────────────────────────┐
│  Fully Connected Layer 1 (32 units) │  ← Combines features
└─────────────────────────────────────┘
        ↓
    ReLU Activation
        ↓
┌─────────────────────────────────────┐
│  Fully Connected Layer 2 (2 units)  │  ← Final decision
└─────────────────────────────────────┘
        ↓
Output: [Safe_Probability, Collision_Probability]
Layer-by-Layer Explanation
Layer 1: LSTM Layer 1

Input Shape: (batch_size, 20 timesteps, 4 features)
Output Shape: (batch_size, 20 timesteps, 64)
What it does:

Processes each timestep sequentially
Maintains a "memory" of previous movements
Identifies basic movement patterns (straight line, turning, acceleration)



Layer 2: Dropout

Rate: 30%
What it does: Randomly "turns off" 30% of neurons during training
Why: Prevents the model from memorizing training data (overfitting)

Layer 3: LSTM Layer 2

Input Shape: (batch_size, 20 timesteps, 64)
Output Shape: (batch_size, 64) - only last timestep
What it does:

Further refines the patterns
Learns high-level trajectory characteristics
Recognizes collision-specific movements



Layer 4: Fully Connected + ReLU

Input: 64 features
Output: 32 features
What it does: Condenses information into key features
ReLU: Adds non-linearity (enables learning complex patterns)

Layer 5: Output Layer

Input: 32 features
Output: 2 values (logits)
What it does: Produces final scores for Safe and Collision
Softmax (applied during inference): Converts scores to probabilities

3.3 How the Model Makes Predictions
Step-by-Step Prediction Process
Input Example:
Vehicle trajectory over 20 timesteps:
Timestamp 0: x=10, y=20, vx=1.0, vy=0.5
Timestamp 1: x=11, y=20.5, vx=1.0, vy=0.5
...
Timestamp 19: x=29, y=29.5, vx=1.0, vy=0.5
Step 1: Data Preprocessing
python# Original data
data = [[10, 20, 1.0, 0.5], [11, 20.5, 1.0, 0.5], ...]

# Normalize using StandardScaler
normalized = [(data - mean) / std]
# Result: values centered around 0, std of 1
Step 2: LSTM Processing
python# LSTM processes sequentially
timestep_0 → hidden_state_0
timestep_1 → hidden_state_1 (remembers timestep_0)
timestep_2 → hidden_state_2 (remembers timesteps 0-1)
...
timestep_19 → hidden_state_19 (remembers all previous)
Step 3: Classification
python# Final hidden state → Dense layers → Output
hidden_state_19 → [0.85, 0.15]

# Apply softmax
probabilities = softmax([0.85, 0.15])
# Result: [Safe: 70%, Collision: 30%]
Step 4: Decision
pythonif Collision_Probability > 50%:
    prediction = "Potential Collision"
else:
    prediction = "Safe"
3.4 Training Process
What is Training?
Training is the process of teaching the neural network to recognize collision patterns by showing it thousands of examples.
Training Data Generation
We create synthetic data to train the model:
Safe Trajectories (60% of data):
python# Steady movement with small random variations
Start: x=random(0,100), y=random(0,100)
Velocity: vx=random(-2,2), vy=random(-2,2)

For each timestep:
    position += velocity + small_random_noise
    velocity += very_small_random_change
Collision Trajectories (40% of data):
python# Vehicles moving toward a convergence point
Start: x=random(0,100), y=random(0,100)
Target: x=random(40,60), y=random(40,60)

For each timestep:
    position moves toward target
    velocity increases as collision approaches
Training Algorithm
Epoch: One complete pass through all training data
pythonFor 50 epochs:
    For each batch of 32 sequences:
        1. Forward Pass:
           - Feed data through LSTM
           - Get predictions
        
        2. Calculate Loss:
           - Compare predictions to true labels
           - Loss = CrossEntropyLoss(predictions, labels)
        
        3. Backward Pass:
           - Calculate gradients
           - Determine how to adjust weights
        
        4. Update Weights:
           - optimizer.step() adjusts all 50,000 parameters
           - Goal: Reduce loss, improve accuracy
    
    5. Validation:
       - Test on validation set
       - If accuracy improved: save model
Training Metrics
MetricDescriptionTargetLossHow wrong the model isLower is betterAccuracy% of correct predictions85-90%PrecisionOf predicted collisions, how many are real?80-88%RecallOf real collisions, how many did we catch?80-87%
3.5 Model Parameters
Total Parameters: ~50,000
Breakdown:
LSTM Layer 1: 4 inputs × 64 hidden × 4 gates × 2 (input & hidden) = 33,024
LSTM Layer 2: 64 inputs × 64 hidden × 4 gates × 2 = 131,584
FC Layer 1: 64 × 32 = 2,048
FC Layer 2: 32 × 2 = 64
Biases: Various

Total: ~167,000 parameters (166,720 trainable)
Why so many?

Each parameter is a "weight" that gets adjusted during training
More parameters = more patterns the model can learn
But too many = overfitting (that's why we use dropout)

3.6 What Makes a Collision Trajectory?
The model learns these patterns indicate collision risk:
Pattern 1: Convergence
Vehicle A: moving toward point (50, 50)
Vehicle B: moving toward point (50, 50)
→ High collision risk
Pattern 2: Acceleration Toward Target
Timestep 0-5: velocity = 1.0
Timestep 6-10: velocity = 1.2
Timestep 11-15: velocity = 1.5
Timestep 16-19: velocity = 2.0
→ Accelerating toward something = risk
Pattern 3: Direct Trajectory
All timesteps moving in same direction
Position changes are consistent
No evasive maneuvers
→ Potential collision
Safe Patterns:
Random velocity changes
Curved paths
Deceleration
Maintaining distance

4. Backend Documentation
4.1 Backend Structure
backend/
├── app.py              # Flask server & API endpoints
├── model.py            # LSTM model architecture
├── train_model.py      # Training script
├── requirements.txt    # Python dependencies
├── models/
│   └── best_model.pth  # Trained model weights
└── uploads/            # Temporary file storage
4.2 app.py - Flask Server
Purpose
Main backend server that handles HTTP requests, loads the model, and provides API endpoints.
Key Components
1. Imports and Configuration
pythonfrom flask import Flask, request, jsonify
from flask_cors import CORS
import torch

app = Flask(__name__)
CORS(app)  # Allows frontend to call backend
Why CORS?

Frontend runs on localhost:3000
Backend runs on localhost:5000
Without CORS, browsers block cross-origin requests
CORS allows React to communicate with Flask

2. Model Loading
pythondef load_model():
    model = EventDetectionLSTM(...)
    model.load_state_dict(torch.load('models/best_model.pth'))
    model.eval()  # Set to evaluation mode
    return model
What does model.eval() do?

Disables dropout (no random neuron dropping)
Disables batch normalization updates
Makes predictions deterministic

3. Data Preprocessing
pythondef preprocess_sequence(sequence_data):
    # 1. Convert to numpy array
    sequence = np.array(sequence_data)
    
    # 2. Normalize features
    scaled = scaler.transform(sequence)
    
    # 3. Convert to PyTorch tensor
    tensor = torch.FloatTensor(scaled)
    
    return tensor
Why normalize?

Neural networks work best with normalized data
Position values: 0-100
Velocity values: -5 to 5
After normalization: All values centered around 0

4. API Endpoints
GET / - API Information
python@app.route('/')
def home():
    return {
        'message': 'RNN Event Detection API',
        'status': 'online',
        'endpoints': {...}
    }
Purpose: Health check and API documentation
GET /api/model-info
python@app.route('/api/model-info')
def model_info():
    return {
        'model': {
            'name': 'LSTM Event Detector',
            'input_features': 4,
            'sequence_length': 20
        }
    }
Purpose: Returns model specifications
POST /api/predict
python@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    sequence = data['sequence']
    
    # Preprocess
    tensor = preprocess_sequence(sequence)
    
    # Predict
    with torch.no_grad():
        output = model(tensor)
        probabilities = torch.softmax(output, dim=1)
    
    return {'prediction': ..., 'probability': ...}
Step-by-step:

Receive JSON with sequence data
Convert to tensor
Pass through model
Apply softmax to get probabilities
Return result

Why torch.no_grad()?

Disables gradient calculation
Saves memory
Speeds up inference
Not needed during prediction (only training)

POST /api/upload
python@app.route('/api/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    
    # Save file
    filepath = os.path.join('uploads', filename)
    file.save(filepath)
    
    # Process CSV
    df = pd.read_csv(filepath)
    sequences = extract_sequences(df)
    
    # Make predictions
    predictions = []
    for seq in sequences:
        pred = model(seq)
        predictions.append(pred)
    
    return {'predictions': predictions}
Process:

Receive file upload
Save temporarily
Parse CSV
Extract vehicle sequences
Predict each sequence
Return all results
Delete temporary file

4.3 model.py - LSTM Architecture
Complete Model Code with Explanations
pythonclass EventDetectionLSTM(nn.Module):
    def __init__(self, input_size=4, hidden_size=64, 
                 num_layers=2, dropout=0.3):
        super(EventDetectionLSTM, self).__init__()
        
        # LSTM layers
        self.lstm = nn.LSTM(
            input_size=input_size,      # 4 features per timestep
            hidden_size=hidden_size,    # 64 hidden neurons
            num_layers=num_layers,      # 2 stacked LSTM layers
            batch_first=True,           # Input: (batch, time, features)
            dropout=dropout             # 30% dropout between layers
        )
        
        # Dropout layer
        self.dropout = nn.Dropout(dropout)
        
        # Classification layers
        self.fc1 = nn.Linear(hidden_size, 32)  # 64 → 32
        self.relu = nn.ReLU()                   # Activation
        self.fc2 = nn.Linear(32, 2)            # 32 → 2 classes
Parameter Explanations:
ParameterValueWhy?input_size4position_x, position_y, velocity_x, velocity_yhidden_size64Balance between capacity and speednum_layers2Captures both simple and complex patternsdropout0.3Prevents overfittingbatch_firstTrueEasier to work with (batch, time, features)
Forward Pass:
pythondef forward(self, x):
    # x shape: (batch_size, 20, 4)
    
    # LSTM processing
    lstm_out, (hidden, cell) = self.lstm(x)
    # hidden shape: (2, batch_size, 64)
    
    # Take last layer's final hidden state
    last_hidden = hidden[-1]
    # Shape: (batch_size, 64)
    
    # Classification
    out = self.dropout(last_hidden)
    out = self.fc1(out)        # (batch_size, 32)
    out = self.relu(out)
    out = self.dropout(out)
    out = self.fc2(out)        # (batch_size, 2)
    
    return out
4.4 train_model.py - Training Script
Training Process Diagram
Start
  ↓
Generate Synthetic Data (1000 sequences)
  ↓
Split: 64% Train, 16% Val, 20% Test
  ↓
Normalize Features (StandardScaler)
  ↓
Create DataLoaders (batch_size=32)
  ↓
Initialize Model
  ↓
Training Loop (50 epochs)
  │
  ├─→ For each batch:
  │     - Forward pass
  │     - Calculate loss
  │     - Backward pass
  │     - Update weights
  │   
  ├─→ Validation:
  │     - Calculate accuracy
  │     - If best: save model
  │
  ↓
Load Best Model
  ↓
Evaluate on Test Set
  ↓
Generate Visualizations
  ↓
Save Model & Results
Key Functions
1. Data Generation
pythondef generate_synthetic_dataset(n_sequences=1000):
    for each sequence:
        if random() < 0.4:
            create_collision_trajectory()
        else:
            create_safe_trajectory()
2. Training Loop
pythonfor epoch in range(50):
    # Training
    for batch in train_loader:
        # Forward
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        
        # Backward
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    
    # Validation
    val_accuracy = evaluate(model, val_loader)
    
    # Save if improved
    if val_accuracy > best_accuracy:
        torch.save(model.state_dict(), 'best_model.pth')
3. Loss Function: CrossEntropyLoss
python# What it does:
prediction = [0.7, 0.3]  # [Safe, Collision]
true_label = 1  # Actually a collision

loss = -log(0.3) = 1.20

# Lower loss = better prediction
# Perfect prediction: loss ≈ 0
# Random guess: loss ≈ 0.69
4. Optimizer: Adam
python# Adam adjusts learning rate automatically
# Combines momentum and adaptive learning rates
# Works well for most deep learning tasks

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.001  # Learning rate
)

5. Frontend Documentation
5.1 Frontend Structure
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js              # Main component
│   ├── App.css             # Styles & animations
│   ├── components/
│   │   ├── Dashboard.js    # Model info display
│   │   ├── FileUpload.js   # Upload interface
│   │   └── Results.js      # Results visualization
│   ├── services/
│   │   └── api.js          # API communication
│   └── index.js            # Entry point
└── package.json            # Dependencies
5.2 React Architecture
Component Hierarchy
App
├── Dashboard (Model Info)
├── FileUpload (Upload Interface)
│   ├── Drag & Drop Zone
│   ├── File Info Display
│   └── Action Buttons
└── Results (Predictions Display)
    ├── Summary Cards
    ├── Pie Chart
    ├── Bar Chart
    └── Results Table
5.3 App.js - Main Component
State Management
javascriptconst [modelInfo, setModelInfo] = useState(null);
const [predictions, setPredictions] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [apiStatus, setApiStatus] = useState('checking');
State Explanations:
StateTypePurposemodelInfoObjectStores model specificationspredictionsObjectStores prediction resultsloadingBooleanShows loading animationerrorStringDisplays error messagesapiStatusStringBackend connection status
Lifecycle Hooks
javascriptuseEffect(() => {
    checkApiConnection();  // On component mount
    fetchModelInfo();
}, []);  // Empty dependency = run once
What useEffect does:

Runs code after component renders
Empty [] means run only on mount
With [variable] would run when variable changes

Event Handlers
File Upload Handler:
javascriptconst handleFileUpload = async (file) => {
    setLoading(true);      // Show spinner
    setError(null);        // Clear errors
    setPredictions(null);  // Clear old results
    
    try {
        const result = await api.uploadFile(file);
        setPredictions(result);  // Store new results
        setLoading(false);       // Hide spinner
    } catch (err) {
        setError(err.message);   // Show error
        setLoading(false);
    }
};
5.4 api.js - API Communication
Axios Configuration
javascriptconst apiClient = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 30000,  // 30 seconds
    headers: {
        'Content-Type': 'application/json'
    }
});
What this does:

Creates reusable HTTP client
Sets base URL (all requests go to Flask server)
Sets timeout (prevents hanging requests)
Sets default headers

API Methods
1. Health Check
javascriptasync checkHealth() {
    const response = await apiClient.get('/api/health');
    return response.data;
}
2. Upload File
javascriptasync uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/api/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    
    return response.data;
}
Why FormData?

HTML forms can send files
FormData mimics form submission
Required for file uploads

Error Handling
javascriptapiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error
            throw new Error(error.response.data.error);
        } else if (error.request) {
            // No response from server
            throw new Error('Backend not responding');
        } else {
            // Request setup error
            throw new Error(error.message);
        }
    }
);
5.5 Components Explained
Dashboard.js
Purpose: Displays model information and system status
Data Display:
javascript<div className="metric-card">
    <h3>Input Features</h3>
    <p>{model.input_features}</p>
</div>
Status Indicators:
javascript<div className={`status-badge ${loaded ? 'success' : 'error'}`}>
    {loaded ? 'Ready' : 'Not Loaded'}
</div>
FileUpload.js
Drag & Drop Implementation:
javascriptconst handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    
    // Validate file type
    if (!file.name.endsWith('.csv')) {
        alert('Please upload CSV');
        return;
    }
    
    // Validate file size
    if (file.size > 16 * 1024 * 1024) {
        alert('File too large');
        return;
    }
    
    setSelectedFile(file);
};
Why preventDefault()?

Stops browser from opening the file
Allows custom handling

Results.js
Chart Configuration:
javascriptconst pieData = {
    labels: ['Safe', 'Collision'],
    datasets: [{
        data: [summary.safe, summary.collision],
        backgroundColor: ['#10b981', '#ef4444']
    }]
};
Data Processing:
javascript// Calculate confidence
const confidence = Math.max(...probabilities) * 100;

// Determine class
const isSafe = label === 'Safe';

// Apply styling
const color = isSafe ? 'green' : 'red';

6. Data Flow
6.1 Complete Request Flow
User Action: Upload CSV File
        ↓
Frontend: FileUpload.js
    - Validate file (CSV, < 16MB)
    - Create FormData
    - Call api.uploadFile()
        ↓
API Service: api.js
    - Send POST to /api/upload
    - Include file in multipart/form-data
        ↓
Backend: Flask app.py
    - Receive file
    - Save to uploads/
    - Parse CSV with pandas
        ↓
Backend: Data Processing
    - Group by vehicle_id
    - Extract sequences (20 timesteps)
    - Normalize features (StandardScaler)
        ↓
Backend: Model Inference
    - Convert to PyTorch tensor
    - Pass through LSTM
    - Apply softmax
    - Get predictions
        ↓
Backend: Response
    - Format results as JSON
    - Include predictions, probabilities, summary
    - Send to frontend
        ↓
Frontend: Results.js
    - Parse response
    - Generate charts
    - Display table
    - Show summary cards
        ↓
User: Views Results
6.2 Data Transformations
CSV File → Predictions:
Step 1: CSV Input
timestamp,vehicle_id,position_x,position_y,velocity_x,velocity_y
0,1,10.5,20.3,1.2,0.8
1,1,11.7,21.1,1.2,0.8
...

Step 2: Parse to DataFrame
   timestamp  vehicle_id  position_x  position_y  velocity_x  velocity_y
0          0           1        10.5        20.3         1.2         0.8
1          1           1        11.7        21.1         1.2         0.8
...

Step 3: Extract Sequence
sequence = [[10.5, 20.3, 1.2, 0.8],
            [11.7, 21.1, 1.2, 0.8],
            ...]
Shape: (20, 4)

Step 4: Normalize
mean = [15.0, 25.0, 1.0, 0.5]
std = [5.0, 5.0, 0.3, 0.2]
normalized = (sequence - mean) / std

Step 5: Convert to Tensor
tensor = torch.FloatTensor(normalized)
Shape: (1, 20, 4)  # batch_size=1

Step 6: LSTM Processing
output = model(tensor)
Shape: (1, 2)  # [safe_score, collision_score]

Step 7: Softmax
probabilities = softmax(output)
Result: [0.75, 0.25]  # [75% safe, 25% collision]

Step 8: Prediction
prediction = argmax(probabilities) = 0
label = "Safe"

Step 9: JSON Response
{
    "prediction": 0,
    "probability": [0.75, 0.25],
    "label": "Safe",
    "confidence": 0.75
}

Step 10: Display
✅ Safe (75% confidence)

7. API Documentation
Base URL
http://localhost:5000
Endpoints
1. GET / - API Information
Description: Returns API information and available endpoints
Response:
json{
    "message": "RNN Event Detection API",
    "version": "1.0.0",
    "status": "online",
    "model_loaded": true,
    "endpoints": {
        "GET /": "API information",
        "GET /api/model-info
