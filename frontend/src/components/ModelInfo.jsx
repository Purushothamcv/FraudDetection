import React, { useEffect, useState } from 'react';
import { Shield, Activity, Database, TrendingUp, AlertCircle } from 'lucide-react';
import { getModelInfo, checkHealth } from '../services/api';

const ModelInfo = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [infoData, healthData] = await Promise.all([
        getModelInfo(),
        checkHealth()
      ]);
      setModelInfo(infoData);
      setHealth(healthData);
    } catch (error) {
      console.error('Error fetching model info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Status */}
      {health && (
        <div className={`card ${health.status === 'healthy' ? 'bg-success-50 border-2 border-success-200' : 'bg-danger-50 border-2 border-danger-200'}`}>
          <div className="flex items-center gap-3">
            <Activity className={`w-6 h-6 ${health.status === 'healthy' ? 'text-success-600' : 'text-danger-600'}`} />
            <div>
              <h3 className="text-lg font-bold text-gray-900">System Status</h3>
              <p className={`text-sm ${health.status === 'healthy' ? 'text-success-700' : 'text-danger-700'}`}>
                {health.message}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Model Information */}
      {modelInfo && (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Model Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Model Name</div>
                <div className="text-lg font-semibold text-gray-900">{modelInfo.model_name}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Version</div>
                <div className="text-lg font-semibold text-gray-900">{modelInfo.version}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Model Type</div>
                <div className="text-lg font-semibold text-gray-900">{modelInfo.model_type}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Status</div>
                <span className={`badge-${modelInfo.is_loaded ? 'success' : 'danger'}`}>
                  {modelInfo.is_loaded ? 'Loaded' : 'Not Loaded'}
                </span>
              </div>
            </div>
            
            {/* Training Info */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Training Date</div>
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(modelInfo.training_info?.training_date || Date.now()).toLocaleDateString()}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Training Samples</div>
                <div className="text-lg font-semibold text-gray-900">
                  {(modelInfo.training_info?.training_samples || 0).toLocaleString()}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Framework Version</div>
                <div className="text-lg font-semibold text-gray-900">
                  {modelInfo.training_info?.framework_version || 'N/A'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          {modelInfo.performance_metrics && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(modelInfo.performance_metrics).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs text-gray-600 mb-1 uppercase">{key.replace(/_/g, ' ')}</div>
                    <div className="text-2xl font-bold text-primary-600">
                      {(value * 100).toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Risk Thresholds */}
          {modelInfo.risk_thresholds && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Risk Thresholds</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                  <div className="text-sm text-danger-800 font-medium mb-1">High Risk Threshold</div>
                  <div className="text-3xl font-bold text-danger-600">
                    {(modelInfo.risk_thresholds.high_risk * 100).toFixed(0)}%
                  </div>
                  <p className="text-xs text-danger-700 mt-2">
                    Transactions above this threshold are flagged as high risk
                  </p>
                </div>
                
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <div className="text-sm text-warning-800 font-medium mb-1">Medium Risk Threshold</div>
                  <div className="text-3xl font-bold text-warning-600">
                    {(modelInfo.risk_thresholds.medium_risk * 100).toFixed(0)}%
                  </div>
                  <p className="text-xs text-warning-700 mt-2">
                    Transactions above this threshold require review
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Features */}
          {modelInfo.features && modelInfo.features.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Input Features</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {modelInfo.features.map(feature => (
                  <span key={feature} className="badge bg-primary-100 text-primary-800">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelInfo;
