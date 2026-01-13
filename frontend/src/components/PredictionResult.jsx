import React, { useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, ShieldCheck, Info, X } from 'lucide-react';
import { approveTransaction } from '../services/api';

const PredictionResult = ({ result, transactionData }) => {
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  if (!result) return null;

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'success';
      default:
        return 'gray';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'BLOCK':
        return 'danger';
      case 'REVIEW':
        return 'warning';
      case 'ALLOW':
        return 'success';
      default:
        return 'gray';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'HIGH':
        return <AlertCircle className="w-8 h-8" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-8 h-8" />;
      case 'LOW':
        return <CheckCircle className="w-8 h-8" />;
      default:
        return <Info className="w-8 h-8" />;
    }
  };

  const handleApproveTransaction = async () => {
    if (!transactionData) {
      setApprovalStatus({
        type: 'error',
        message: 'Transaction data not available'
      });
      return;
    }

    setIsApproving(true);
    setApprovalStatus(null);
    
    try {
      const response = await approveTransaction(transactionData);
      setApprovalStatus({
        type: 'success',
        message: response.message,
        details: response
      });
    } catch (error) {
      setApprovalStatus({
        type: 'error',
        message: error.message || 'Failed to approve transaction'
      });
    } finally {
      setIsApproving(false);
    }
  };

  const riskColor = getRiskColor(result.risk_level);
  const actionColor = getActionColor(result.recommended_action);

  return (
    <div className="card animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Result</h2>
      
      {/* Main Status */}
      <div className={`bg-${riskColor}-50 border-2 border-${riskColor}-200 rounded-lg p-6 mb-6`}>
        <div className="flex items-start gap-4">
          <div className={`text-${riskColor}-600`}>
            {getRiskIcon(result.risk_level)}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {result.is_fraud ? 'Fraudulent Transaction Detected' : 'Transaction Appears Legitimate'}
            </h3>
            <p className="text-gray-700 mb-4">{result.explanation}</p>
            
            <div className="flex flex-wrap gap-3">
              <span className={`badge-${riskColor} text-sm font-semibold px-3 py-1`}>
                Risk: {result.risk_level}
              </span>
              <span className={`badge-${actionColor} text-sm font-semibold px-3 py-1`}>
                Action: {result.recommended_action}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Fraud Probability</div>
          <div className="text-2xl font-bold text-gray-900">
            {(result.fraud_probability * 100).toFixed(2)}%
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-${riskColor}-500 h-2 rounded-full transition-all duration-500`}
                style={{ width: `${result.fraud_probability * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Model Confidence</div>
          <div className="text-2xl font-bold text-gray-900">
            {(result.confidence * 100).toFixed(2)}%
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${result.confidence * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Risk Level</div>
          <div className={`text-2xl font-bold text-${riskColor}-600`}>
            {result.risk_level}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {result.risk_level === 'HIGH' && 'Immediate action required'}
            {result.risk_level === 'MEDIUM' && 'Enhanced verification needed'}
            {result.risk_level === 'LOW' && 'Normal processing'}
          </div>
        </div>
      </div>
      
      {/* Recommended Action */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck className="w-6 h-6 text-primary-600" />
          <h4 className="text-lg font-bold text-gray-900">Recommended Action</h4>
        </div>
        <p className="text-gray-700 mb-3">
          {result.recommended_action === 'BLOCK' && 
            'Block this transaction immediately and investigate the account for suspicious activity.'}
          {result.recommended_action === 'REVIEW' && 
            'Flag for manual review. Conduct enhanced verification before processing.'}
          {result.recommended_action === 'ALLOW' && 
            'Transaction can be processed with standard monitoring procedures.'}
        </p>
        
        {/* Approval Status Message */}
        {approvalStatus && (
          <div className={`mb-3 p-4 rounded-lg ${
            approvalStatus.type === 'success' ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'
          }`}>
            <p className={`text-sm font-semibold ${
              approvalStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {approvalStatus.message}
            </p>
            {approvalStatus.details && (
              <p className="text-xs text-gray-600 mt-1">
                Approved by: {approvalStatus.details.approved_by}
              </p>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          {result.recommended_action === 'BLOCK' && (
            <button className="btn bg-danger-600 text-white hover:bg-danger-700">
              Block Transaction
            </button>
          )}
          {result.recommended_action === 'REVIEW' && (
            <button className="btn bg-warning-600 text-white hover:bg-warning-700">
              Send for Review
            </button>
          )}
          {result.recommended_action === 'ALLOW' && (
            <button 
              className="btn bg-success-600 text-white hover:bg-success-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleApproveTransaction}
              disabled={isApproving || approvalStatus?.type === 'success'}
            >
              {isApproving ? 'Approving...' : approvalStatus?.type === 'success' ? 'Approved ✓' : 'Approve Transaction'}
            </button>
          )}
          <button className="btn-secondary" onClick={() => setShowDetailsModal(true)}>
            View Details
          </button>
        </div>
      </div>
      
      {/* Timestamp */}
      {result.timestamp && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          Analysis completed at {new Date(result.timestamp).toLocaleString()}
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && transactionData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Fraud Analysis */}
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Fraud Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Classification</div>
                    <div className={`text-lg font-bold ${result.is_fraud ? 'text-danger-600' : 'text-success-600'}`}>
                      {result.is_fraud ? 'Fraudulent' : 'Legitimate'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Fraud Probability</div>
                    <div className="text-lg font-bold text-gray-900">
                      {(result.fraud_probability * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Risk Level</div>
                    <div className={`text-lg font-bold text-${getRiskColor(result.risk_level)}-600`}>
                      {result.risk_level}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Confidence</div>
                    <div className="text-lg font-bold text-gray-900">
                      {(result.confidence * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Transaction Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Transaction Type</div>
                      <div className="text-base font-medium text-gray-900">{transactionData.type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Amount</div>
                      <div className="text-base font-medium text-gray-900">${parseFloat(transactionData.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Step/Time</div>
                      <div className="text-base font-medium text-gray-900">{transactionData.step}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Recommended Action</div>
                      <div className={`text-base font-medium text-${getActionColor(result.recommended_action)}-600`}>
                        {result.recommended_action}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Origin Account */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Origin Account</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Old Balance</div>
                      <div className="text-base font-medium text-gray-900">${parseFloat(transactionData.oldbalanceOrg).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">New Balance</div>
                      <div className="text-base font-medium text-gray-900">${parseFloat(transactionData.newbalanceOrig).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600">Balance Change</div>
                    <div className={`text-base font-medium ${
                      transactionData.newbalanceOrig - transactionData.oldbalanceOrg < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${(transactionData.newbalanceOrig - transactionData.oldbalanceOrg).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination Account */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Destination Account</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Old Balance</div>
                      <div className="text-base font-medium text-gray-900">${parseFloat(transactionData.oldbalanceDest).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">New Balance</div>
                      <div className="text-base font-medium text-gray-900">${parseFloat(transactionData.newbalanceDest).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600">Balance Change</div>
                    <div className={`text-base font-medium ${
                      transactionData.newbalanceDest - transactionData.oldbalanceDest < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${(transactionData.newbalanceDest - transactionData.oldbalanceDest).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Analysis Explanation</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{result.explanation}</p>
                </div>
              </div>

              {/* Approval Status */}
              {approvalStatus?.type === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-900 mb-2">✓ Transaction Approved</h4>
                  <p className="text-sm text-green-700">{approvalStatus.message}</p>
                  {approvalStatus.details?.approved_by && (
                    <p className="text-xs text-green-600 mt-2">Approved by: {approvalStatus.details.approved_by}</p>
                  )}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
