import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';
import { getFeatureImportance } from '../services/api';

const FeatureImportance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeatureImportance();
  }, []);

  const fetchFeatureImportance = async () => {
    try {
      setLoading(true);
      const response = await getFeatureImportance();
      
      // Transform data for recharts
      // API returns: { features: [...], importance: [...], importance_percentage: [...] }
      const chartData = response.features.map((featureName, index) => ({
        name: formatFeatureName(featureName),
        importance: response.importance_percentage[index], // Already in percentage
        fullName: featureName
      }));
      
      setData(chartData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching feature importance:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatFeatureName = (name) => {
    const nameMap = {
      'oldbalanceOrg': 'Origin Old Balance',
      'newbalanceOrig': 'Origin New Balance',
      'oldbalanceDest': 'Dest Old Balance',
      'newbalanceDest': 'Dest New Balance',
      'amount': 'Transaction Amount',
      'step': 'Time Step',
      'type_encoded': 'Transaction Type'
    };
    return nameMap[name] || name;
  };

  const getFeatureDescription = (name) => {
    const descriptions = {
      'oldbalanceOrg': 'Initial balance of the origin account before the transaction',
      'newbalanceOrig': 'Balance of the origin account after the transaction',
      'oldbalanceDest': 'Initial balance of the destination account before the transaction',
      'newbalanceDest': 'Balance of the destination account after the transaction',
      'amount': 'The amount of money transferred in the transaction',
      'step': 'Time unit representing when the transaction occurred',
      'type_encoded': 'Type of transaction (CASH_IN, CASH_OUT, DEBIT, PAYMENT, TRANSFER)'
    };
    return descriptions[name] || 'No description available';
  };

  const COLORS = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#f59e0b', // amber-500
    '#eab308', // yellow-500
    '#84cc16', // lime-500
    '#22c55e', // green-500
    '#10b981', // emerald-500
  ];

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p className="text-danger-800">Error loading feature importance: {error}</p>
          <button
            onClick={fetchFeatureImportance}
            className="mt-2 btn-primary text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900">Feature Importance</h2>
      </div>
      
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700">
            These scores show how much each feature contributes to the model's fraud detection decisions. 
            Higher values indicate more important features for predicting fraud.
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              label={{ value: 'Importance (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => `${value.toFixed(2)}%`}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Bar 
              dataKey="importance" 
              name="Importance (%)"
              radius={[8, 8, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Descriptions</h3>
        {data.map((feature, index) => (
          <div 
            key={feature.fullName}
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <h4 className="font-semibold text-gray-900">{feature.name}</h4>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {feature.importance.toFixed(2)}%
              </span>
            </div>
            <p className="text-sm text-gray-600 ml-7">
              {getFeatureDescription(feature.fullName)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureImportance;
