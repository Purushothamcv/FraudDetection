import React, { useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, DollarSign, Clock, TrendingUp } from 'lucide-react';

const TransactionForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    step: 1,
    type: 'TRANSFER',
    amount: '',
    oldbalanceOrg: '',
    newbalanceOrig: '',
    oldbalanceDest: '',
    newbalanceDest: ''
  });

  const [errors, setErrors] = useState({});

  const transactionTypes = ['CASH_IN', 'CASH_OUT', 'DEBIT', 'PAYMENT', 'TRANSFER'];

  const validateField = (name, value) => {
    const numValue = parseFloat(value);
    
    switch (name) {
      case 'step':
        return numValue >= 1 ? '' : 'Step must be at least 1';
      case 'amount':
        return numValue > 0 ? '' : 'Amount must be greater than 0';
      case 'oldbalanceOrg':
      case 'newbalanceOrig':
      case 'oldbalanceDest':
      case 'newbalanceDest':
        return numValue >= 0 ? '' : 'Balance cannot be negative';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change
    if (value && name !== 'type') {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      if (key !== 'type') {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });
    
    // Check if all numeric fields are filled
    const numericFields = ['step', 'amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest'];
    numericFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    if (isValid) {
      // Convert string values to numbers
      const processedData = {
        ...formData,
        step: parseInt(formData.step),
        amount: parseFloat(formData.amount),
        oldbalanceOrg: parseFloat(formData.oldbalanceOrg),
        newbalanceOrig: parseFloat(formData.newbalanceOrig),
        oldbalanceDest: parseFloat(formData.oldbalanceDest),
        newbalanceDest: parseFloat(formData.newbalanceDest)
      };
      
      onSubmit(processedData);
    }
  };

  const fillSampleData = (scenario) => {
    const samples = {
      legitimate: {
        step: 1,
        type: 'PAYMENT',
        amount: '50.00',
        oldbalanceOrg: '1000.00',
        newbalanceOrig: '950.00',
        oldbalanceDest: '2000.00',
        newbalanceDest: '2050.00'
      },
      suspicious: {
        step: 1,
        type: 'TRANSFER',
        amount: '500000.00',
        oldbalanceOrg: '500000.00',
        newbalanceOrig: '0.00',
        oldbalanceDest: '0.00',
        newbalanceDest: '500000.00'
      },
      highRisk: {
        step: 1,
        type: 'CASH_OUT',
        amount: '999999.00',
        oldbalanceOrg: '1000000.00',
        newbalanceOrig: '1.00',
        oldbalanceDest: '0.00',
        newbalanceDest: '999999.00'
      }
    };
    
    setFormData(samples[scenario]);
    setErrors({});
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Transaction Details</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fillSampleData('legitimate')}
            className="text-xs btn bg-success-100 text-success-700 hover:bg-success-200"
          >
            Sample: Legitimate
          </button>
          <button
            type="button"
            onClick={() => fillSampleData('suspicious')}
            className="text-xs btn bg-warning-100 text-warning-700 hover:bg-warning-200"
          >
            Sample: Suspicious
          </button>
          <button
            type="button"
            onClick={() => fillSampleData('highRisk')}
            className="text-xs btn bg-danger-100 text-danger-700 hover:bg-danger-200"
          >
            Sample: High Risk
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">
              <Clock className="w-4 h-4 inline mr-1" />
              Step (Time Unit)
            </label>
            <input
              type="number"
              name="step"
              value={formData.step}
              onChange={handleChange}
              className={`input ${errors.step ? 'border-danger-500' : ''}`}
              placeholder="1"
              min="1"
            />
            {errors.step && <p className="text-danger-500 text-sm mt-1">{errors.step}</p>}
          </div>
          
          <div>
            <label className="label">Transaction Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input"
            >
              {transactionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="label">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Transaction Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`input ${errors.amount ? 'border-danger-500' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0.01"
            />
            {errors.amount && <p className="text-danger-500 text-sm mt-1">{errors.amount}</p>}
          </div>
          
          <div>
            <label className="label">Origin - Old Balance</label>
            <input
              type="number"
              name="oldbalanceOrg"
              value={formData.oldbalanceOrg}
              onChange={handleChange}
              className={`input ${errors.oldbalanceOrg ? 'border-danger-500' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.oldbalanceOrg && <p className="text-danger-500 text-sm mt-1">{errors.oldbalanceOrg}</p>}
          </div>
          
          <div>
            <label className="label">Origin - New Balance</label>
            <input
              type="number"
              name="newbalanceOrig"
              value={formData.newbalanceOrig}
              onChange={handleChange}
              className={`input ${errors.newbalanceOrig ? 'border-danger-500' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.newbalanceOrig && <p className="text-danger-500 text-sm mt-1">{errors.newbalanceOrig}</p>}
          </div>
          
          <div>
            <label className="label">Destination - Old Balance</label>
            <input
              type="number"
              name="oldbalanceDest"
              value={formData.oldbalanceDest}
              onChange={handleChange}
              className={`input ${errors.oldbalanceDest ? 'border-danger-500' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.oldbalanceDest && <p className="text-danger-500 text-sm mt-1">{errors.oldbalanceDest}</p>}
          </div>
          
          <div>
            <label className="label">Destination - New Balance</label>
            <input
              type="number"
              name="newbalanceDest"
              value={formData.newbalanceDest}
              onChange={handleChange}
              className={`input ${errors.newbalanceDest ? 'border-danger-500' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.newbalanceDest && <p className="text-danger-500 text-sm mt-1">{errors.newbalanceDest}</p>}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Analyze Transaction
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
