/**
 * Dashboard Component
 * File: frontend/src/components/Dashboard.js
 * 
 * Displays model information and system status
 */

import React from 'react';

function Dashboard({ modelInfo }) {
  if (!modelInfo) return null;

  const { model, device, loaded } = modelInfo;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
        Model Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Model Name */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Model</h3>
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-indigo-900">{model.name}</p>
          <p className="text-sm text-gray-600 mt-1">v{model.version}</p>
        </div>

        {/* Input Features */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Features</h3>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-green-900">{model.input_features}</p>
          <p className="text-sm text-gray-600 mt-1">Input dimensions</p>
        </div>

        {/* Sequence Length */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Sequence</h3>
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-purple-900">{model.sequence_length}</p>
          <p className="text-sm text-gray-600 mt-1">Timesteps</p>
        </div>

        {/* Device Status */}
        <div className={`bg-gradient-to-br ${loaded ? 'from-blue-50 to-blue-100' : 'from-red-50 to-red-100'} rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Status</h3>
            {loaded ? (
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <p className={`text-2xl font-bold ${loaded ? 'text-blue-900' : 'text-red-900'}`}>
            {loaded ? 'Ready' : 'Not Loaded'}
          </p>
          <p className="text-sm text-gray-600 mt-1">{device}</p>
        </div>
      </div>

      {/* Classes */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Detection Classes:</h3>
        <div className="flex flex-wrap gap-3">
          {model.classes.map((className, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-full font-medium text-sm ${
                index === 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {className}
            </div>
          ))}
        </div>
      </div>

      {/* Technical Details */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700 flex items-center hover:text-indigo-600">
            <svg className="w-5 h-5 mr-2 transform group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Technical Specifications
          </summary>
          <div className="mt-4 pl-7 space-y-2 text-sm text-gray-600">
            <p><strong>Architecture:</strong> 2-Layer LSTM with 64 hidden units</p>
            <p><strong>Input Format:</strong> (batch_size, {model.sequence_length}, {model.input_features})</p>
            <p><strong>Output Format:</strong> 2-class probability distribution</p>
            <p><strong>Regularization:</strong> Dropout (30%)</p>
            <p><strong>Activation:</strong> ReLU (hidden layers), Softmax (output)</p>
          </div>
        </details>
      </div>
    </div>
  );
}

export default Dashboard;
