/**
 * MetricsDisplay Component
 * File: frontend/src/components/MetricsDisplay.js
 * 
 * Displays confusion matrix and detailed metrics
 */

import React from 'react';

function MetricsDisplay({ metrics }) {
  if (!metrics) return null;

  const { confusion_matrix, accuracy, precision, recall, f1_score, per_class } = metrics;
  const { matrix, true_negatives, false_positives, false_negatives, true_positives } = confusion_matrix;

  // Calculate percentages for confusion matrix
  const total = true_negatives + false_positives + false_negatives + true_positives;
  const tnPercent = ((true_negatives / total) * 100).toFixed(1);
  const fpPercent = ((false_positives / total) * 100).toFixed(1);
  const fnPercent = ((false_negatives / total) * 100).toFixed(1);
  const tpPercent = ((true_positives / total) * 100).toFixed(1);

  return (
    <div className="metrics-container">
      <style jsx>{`
        .metrics-container {
          margin-top: 2rem;
          animation: slideUp 0.6s ease-out;
        }

        .metrics-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .metrics-title {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .metrics-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(30px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #fed766);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        .metric-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .metric-icon {
          width: 50px;
          height: 50px;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
        }

        .metric-icon svg {
          width: 28px;
          height: 28px;
          stroke: white;
          stroke-width: 2.5;
        }

        .metric-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.8rem;
        }

        .metric-value {
          font-size: 3rem;
          font-weight: 900;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          line-height: 1;
        }

        .metric-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          overflow: hidden;
          margin-top: 1rem;
        }

        .metric-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
          border-radius: 10px;
          transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 15px rgba(255, 107, 107, 0.6);
        }

        .confusion-section {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(30px);
          border-radius: 24px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          margin-bottom: 2rem;
        }

        .confusion-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .confusion-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .confusion-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
        }

        .confusion-matrix {
          max-width: 600px;
          margin: 0 auto;
        }

        .matrix-wrapper {
          display: grid;
          grid-template-columns: 80px 1fr 1fr;
          grid-template-rows: 80px 1fr 1fr;
          gap: 2px;
        }

        .matrix-label {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 1rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .matrix-label-top {
          writing-mode: horizontal-tb;
          padding: 1rem;
        }

        .matrix-label-left {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          padding: 1rem;
        }

        .matrix-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .matrix-cell:hover {
          transform: scale(1.05);
          z-index: 10;
        }

        .matrix-cell::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .matrix-cell:hover::before {
          opacity: 1;
        }

        .cell-tn {
          background: linear-gradient(135deg, rgba(6, 214, 160, 0.4), rgba(6, 214, 160, 0.2));
          box-shadow: 0 10px 30px rgba(6, 214, 160, 0.3);
        }

        .cell-fp {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.4), rgba(255, 193, 7, 0.2));
          box-shadow: 0 10px 30px rgba(255, 193, 7, 0.3);
        }

        .cell-fn {
          background: linear-gradient(135deg, rgba(255, 152, 0, 0.4), rgba(255, 152, 0, 0.2));
          box-shadow: 0 10px 30px rgba(255, 152, 0, 0.3);
        }

        .cell-tp {
          background: linear-gradient(135deg, rgba(239, 71, 111, 0.4), rgba(239, 71, 111, 0.2));
          box-shadow: 0 10px 30px rgba(239, 71, 111, 0.3);
        }

        .cell-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          margin-bottom: 0.3rem;
        }

        .cell-percent {
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .cell-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 0.3rem;
        }

        .matrix-legend {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .legend-color {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .legend-color.tn {
          background: linear-gradient(135deg, #06d6a0, #059669);
        }

        .legend-color.fp {
          background: linear-gradient(135deg, #ffc107, #ff9800);
        }

        .legend-color.fn {
          background: linear-gradient(135deg, #ff9800, #ff5722);
        }

        .legend-color.tp {
          background: linear-gradient(135deg, #ef476f, #e11d48);
        }

        .legend-text {
          flex: 1;
        }

        .legend-title {
          font-weight: 700;
          color: white;
          font-size: 0.95rem;
          margin-bottom: 0.2rem;
        }

        .legend-description {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .per-class-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .class-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(30px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .class-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .class-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .class-icon.safe {
          background: linear-gradient(135deg, #06d6a0, #059669);
          box-shadow: 0 8px 20px rgba(6, 214, 160, 0.4);
        }

        .class-icon.collision {
          background: linear-gradient(135deg, #ef476f, #e11d48);
          box-shadow: 0 8px 20px rgba(239, 71, 111, 0.4);
        }

        .class-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: white;
        }

        .class-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.8rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .stat-label {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .stat-value {
          font-weight: 800;
          font-size: 1.1rem;
          color: white;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .matrix-wrapper {
            grid-template-columns: 60px 1fr 1fr;
            grid-template-rows: 60px 1fr 1fr;
          }

          .cell-value {
            font-size: 2rem;
          }

          .metric-value {
            font-size: 2.5rem;
          }
        }
      `}</style>

      {/* Header */}
      <div className="metrics-header">
        <h2 className="metrics-title">📊 Model Performance Metrics</h2>
        <p className="metrics-subtitle">Detailed analysis of prediction accuracy</p>
      </div>

      {/* Main Metrics Cards */}
      <div className="metrics-grid">
        {/* Accuracy */}
        <div className="metric-card">
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="metric-label">Accuracy</div>
          <div className="metric-value">{(accuracy * 100).toFixed(1)}%</div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{width: `${accuracy * 100}%`}}></div>
          </div>
        </div>

        {/* Precision */}
        <div className="metric-card">
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="metric-label">Precision</div>
          <div className="metric-value">{(precision * 100).toFixed(1)}%</div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{width: `${precision * 100}%`}}></div>
          </div>
        </div>

        {/* Recall */}
        <div className="metric-card">
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div className="metric-label">Recall</div>
          <div className="metric-value">{(recall * 100).toFixed(1)}%</div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{width: `${recall * 100}%`}}></div>
          </div>
        </div>

        {/* F1 Score */}
        <div className="metric-card">
          <div className="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div className="metric-label">F1 Score</div>
          <div className="metric-value">{(f1_score * 100).toFixed(1)}%</div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{width: `${f1_score * 100}%`}}></div>
          </div>
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className="confusion-section">
        <div className="confusion-header">
          <h3 className="confusion-title">🎯 Confusion Matrix</h3>
          <p className="confusion-subtitle">Breakdown of predictions vs actual labels</p>
        </div>

        <div className="confusion-matrix">
          <div className="matrix-wrapper">
            {/* Empty corner */}
            <div></div>
            
            {/* Top labels */}
            <div className="matrix-label matrix-label-top">
              <strong>Predicted: Safe</strong>
            </div>
            <div className="matrix-label matrix-label-top">
              <strong>Predicted: Collision</strong>
            </div>

            {/* Left label - Actual: Safe */}
            <div className="matrix-label matrix-label-left">
              <strong>Actual: Safe</strong>
            </div>

            {/* True Negative */}
            <div className="matrix-cell cell-tn">
              <div className="cell-value">{true_negatives}</div>
              <div className="cell-percent">{tnPercent}%</div>
              <div className="cell-label">True Negative</div>
            </div>

            {/* False Positive */}
            <div className="matrix-cell cell-fp">
              <div className="cell-value">{false_positives}</div>
              <div className="cell-percent">{fpPercent}%</div>
              <div className="cell-label">False Positive</div>
            </div>

            {/* Left label - Actual: Collision */}
            <div className="matrix-label matrix-label-left">
              <strong>Actual: Collision</strong>
            </div>

            {/* False Negative */}
            <div className="matrix-cell cell-fn">
              <div className="cell-value">{false_negatives}</div>
              <div className="cell-percent">{fnPercent}%</div>
              <div className="cell-label">False Negative</div>
            </div>

            {/* True Positive */}
            <div className="matrix-cell cell-tp">
              <div className="cell-value">{true_positives}</div>
              <div className="cell-percent">{tpPercent}%</div>
              <div className="cell-label">True Positive</div>
            </div>
          </div>

          {/* Legend */}
          <div className="matrix-legend">
            <div className="legend-item">
              <div className="legend-color tn"></div>
              <div className="legend-text">
                <div className="legend-title">True Negative (TN)</div>
                <div className="legend-description">Correctly predicted Safe</div>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color fp"></div>
              <div className="legend-text">
                <div className="legend-title">False Positive (FP)</div>
                <div className="legend-description">Safe predicted as Collision</div>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color fn"></div>
              <div className="legend-text">
                <div className="legend-title">False Negative (FN)</div>
                <div className="legend-description">Collision predicted as Safe</div>
              </div>
            </div>
            <div className="legend-item">
              <div className="legend-color tp"></div>
              <div className="legend-text">
                <div className="legend-title">True Positive (TP)</div>
                <div className="legend-description">Correctly predicted Collision</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Class Statistics */}
      <div className="per-class-section">
        {/* Safe Class */}
        <div className="class-card">
          <div className="class-header">
            <div className="class-icon safe">✓</div>
            <div className="class-title">Safe Class</div>
          </div>
          <div className="class-stats">
            <div className="stat-row">
              <span className="stat-label">Total Samples:</span>
              <span className="stat-value">{per_class.safe.total}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Correct Predictions:</span>
              <span className="stat-value">{per_class.safe.correct}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Incorrect Predictions:</span>
              <span className="stat-value">{per_class.safe.incorrect}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Class Accuracy:</span>
              <span className="stat-value">{(per_class.safe.accuracy * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Collision Class */}
        <div className="class-card">
          <div className="class-header">
            <div className="class-icon collision">⚠</div>
            <div className="class-title">Collision Class</div>
          </div>
          <div className="class-stats">
            <div className="stat-row">
              <span className="stat-label">Total Samples:</span>
              <span className="stat-value">{per_class.collision.total}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Correct Predictions:</span>
              <span className="stat-value">{per_class.collision.correct}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Incorrect Predictions:</span>
              <span className="stat-value">{per_class.collision.incorrect}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Class Accuracy:</span>
              <span className="stat-value">{(per_class.collision.accuracy * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetricsDisplay;