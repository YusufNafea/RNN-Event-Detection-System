import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import MetricsDisplay from './MetricsDisplay';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Results({ predictions, onClear }) {
  if (!predictions) return null;

  const { summary, labels, probabilities, filename, metrics } = predictions;

  // ... (keep all existing chart configurations and code)

  const pieData = {
    labels: ['Safe', 'Potential Collision'],
    datasets: [
      {
        data: [summary.safe, summary.collision],
        backgroundColor: ['#10b981', '#ef4444'],
        borderColor: ['#059669', '#dc2626'],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 14 },
          color: 'white'
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = ((value / summary.total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const barData = {
    labels: labels.map((_, idx) => `Seq ${idx + 1}`),
    datasets: [
      {
        label: 'Confidence',
        data: probabilities.map(prob => Math.max(...prob) * 100),
        backgroundColor: labels.map(label =>
          label === 'Safe' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'
        ),
        borderColor: labels.map(label =>
          label === 'Safe' ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 2,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: 'Confidence (%)', color: 'white' },
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Confidence: ${context.parsed.y.toFixed(2)}%`;
          }
        }
      }
    },
  };

  return (
    <div className="results-wrapper">
      <style jsx>{`
        .results-wrapper {
          animation: fadeIn 0.6s ease-out;
        }

        .results-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(30px);
          border-radius: 24px;
          padding: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          margin-bottom: 2rem;
        }

        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .results-title {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .results-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        .clear-btn {
          padding: 0.8rem 1.8rem;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          backdrop-filter: blur(10px);
        }

        .clear-btn:hover {
          background: rgba(239, 71, 111, 0.3);
          border-color: rgba(239, 71, 111, 0.5);
          transform: translateY(-2px);
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 1.8rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s;
        }

        .summary-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .summary-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .summary-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .summary-subtext {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 0.5rem;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(30px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .chart-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .chart-container {
          height: 300px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Header */}
      <div className="results-card">
        <div className="results-header">
          <div>
            <h2 className="results-title">🎉 Prediction Results</h2>
            <p className="results-subtitle">File: {filename}</p>
          </div>
          <button onClick={onClear} className="clear-btn">
            Clear Results
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-label">Total Analyzed</div>
            <div className="summary-value">{summary.total}</div>
            <div className="summary-subtext">Vehicle sequences processed</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Safe Predictions</div>
            <div className="summary-value" style={{color: '#10b981'}}>{summary.safe}</div>
            <div className="summary-subtext">{((summary.safe / summary.total) * 100).toFixed(1)}% of total</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Collision Warnings</div>
            <div className="summary-value" style={{color: '#ef4444'}}>{summary.collision}</div>
            <div className="summary-subtext">{((summary.collision / summary.total) * 100).toFixed(1)}% of total</div>
          </div>

          <div className="summary-card">
            <div className="summary-label">Risk Level</div>
            <div className="summary-value" style={{
              color: summary.collision_rate > 0.5 ? '#ef4444' : 
                     summary.collision_rate > 0.25 ? '#ffd93d' : '#10b981'
            }}>
              {summary.collision_rate > 0.5 ? 'High' : 
               summary.collision_rate > 0.25 ? 'Medium' : 'Low'}
            </div>
            <div className="summary-subtext">{(summary.collision_rate * 100).toFixed(1)}% collision rate</div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Distribution Overview</h3>
            <div className="chart-container">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Confidence Scores</h3>
            <div className="chart-container">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Display with Confusion Matrix */}
      {metrics && <MetricsDisplay metrics={metrics} />}

      {/* Detailed Table */}
      <div className="results-card">
        <h3 className="chart-title" style={{marginBottom: '1.5rem'}}>📋 Detailed Predictions</h3>
        <div style={{overflowX: 'auto'}}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 0.5rem'
          }}>
            <thead>
              <tr style={{color: 'white'}}>
                <th style={{padding: '1rem', textAlign: 'left'}}>Sequence #</th>
                <th style={{padding: '1rem', textAlign: 'left'}}>Prediction</th>
                <th style={{padding: '1rem', textAlign: 'left'}}>Confidence</th>
                <th style={{padding: '1rem', textAlign: 'left'}}>Safe Prob</th>
                <th style={{padding: '1rem', textAlign: 'left'}}>Collision Prob</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label, idx) => {
                const confidence = Math.max(...probabilities[idx]) * 100;
                const isSafe = label === 'Safe';
                
                return (
                  <tr key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s'
                  }}>
                    <td style={{padding: '1rem', color: 'white', fontWeight: '700'}}>
                      {idx + 1}
                    </td>
                    <td style={{padding: '1rem'}}>
                      <span style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        background: isSafe ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                        color: isSafe ? '#10b981' : '#ef4444',
                        border: `2px solid ${isSafe ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`
                      }}>
                        {label}
                      </span>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <div style={{
                          flex: 1,
                          height: '8px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '10px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${confidence}%`,
                            background: isSafe ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
                            borderRadius: '10px',
                            transition: 'width 1s'
                          }}></div>
                        </div>
                        <span style={{color: 'white', fontWeight: '700', minWidth: '60px'}}>
                          {confidence.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td style={{padding: '1rem', color: 'white'}}>
                      {(probabilities[idx][0] * 100).toFixed(2)}%
                    </td>
                    <td style={{padding: '1rem', color: 'white'}}>
                      {(probabilities[idx][1] * 100).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Button */}
      <div style={{textAlign: 'right'}}>
        <button
          onClick={() => {
            const csvContent = [
              ['Sequence', 'Prediction', 'Confidence', 'Safe_Prob', 'Collision_Prob'],
              ...labels.map((label, idx) => [
                idx + 1,
                label,
                (Math.max(...probabilities[idx]) * 100).toFixed(2),
                (probabilities[idx][0] * 100).toFixed(2),
                (probabilities[idx][1] * 100).toFixed(2),
              ])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'prediction_results.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }}
          style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Results (CSV)
        </button>
      </div>
    </div>
  );
}

export default Results;