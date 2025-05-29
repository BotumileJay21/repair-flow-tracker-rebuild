
import React, { useState } from 'react';
import { Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRepairByOrderNumber } from '../utils/storage';
import { Repair } from '../types';

const ClientLookup: React.FC = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [repair, setRepair] = useState<Repair | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!orderNumber.trim()) return;
    
    setIsSearching(true);
    setNotFound(false);
    
    // Simulate a brief loading state
    setTimeout(() => {
      const foundRepair = getRepairByOrderNumber(orderNumber.trim().toUpperCase());
      
      if (foundRepair) {
        setRepair(foundRepair);
        setNotFound(false);
      } else {
        setRepair(null);
        setNotFound(true);
      }
      setIsSearching(false);
    }, 500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Received':
        return <AlertCircle className="w-6 h-6 text-blue-500" />;
      case 'Diagnosing':
        return <Search className="w-6 h-6 text-yellow-500" />;
      case 'Repairing':
        return <Clock className="w-6 h-6 text-orange-500" />;
      case 'Completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received':
        return 'bg-blue-100 text-blue-800';
      case 'Diagnosing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Repairing':
        return 'bg-orange-100 text-orange-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Track Your Repair</h2>
        <p className="text-gray-600">Enter your order number to check the status of your device repair</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Number
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Enter your order number (e.g., JBV-001)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={!orderNumber.trim() || isSearching}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {repair && (
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          {repair.status === 'Completed' && (
            <div className="bg-green-50 border-b border-green-200 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Repair Completed!</h3>
                  <p className="text-green-600">Your device is ready for collection.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Order {repair.orderNumber}</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(repair.status)}`}>
                {repair.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Device Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Device:</span>
                    <span className="font-medium">{repair.deviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date Received:</span>
                    <span className="font-medium">{new Date(repair.dateReceived).toLocaleDateString()}</span>
                  </div>
                  {repair.expectedCompletion && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Completion:</span>
                      <span className="font-medium">{new Date(repair.expectedCompletion).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Repair Status</h4>
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(repair.status)}
                  <span className="text-lg font-medium">{repair.status}</span>
                </div>
                
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 ${repair.status === 'Received' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-3 h-3 rounded-full ${repair.status === 'Received' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <span>Received</span>
                  </div>
                  <div className={`flex items-center gap-2 ${repair.status === 'Diagnosing' ? 'text-yellow-600' : repair.status === 'Repairing' || repair.status === 'Completed' ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-3 h-3 rounded-full ${repair.status === 'Diagnosing' ? 'bg-yellow-500' : repair.status === 'Repairing' || repair.status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Diagnosing</span>
                  </div>
                  <div className={`flex items-center gap-2 ${repair.status === 'Repairing' ? 'text-orange-600' : repair.status === 'Completed' ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-3 h-3 rounded-full ${repair.status === 'Repairing' ? 'bg-orange-500' : repair.status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Repairing</span>
                  </div>
                  <div className={`flex items-center gap-2 ${repair.status === 'Completed' ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-3 h-3 rounded-full ${repair.status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold text-gray-700 mb-2">Issue Description</h4>
              <p className="text-gray-600">{repair.issueDescription}</p>
            </div>
          </div>
        </div>
      )}

      {notFound && (
        <div className="bg-white rounded-xl shadow-lg border p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Not Found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find an order with number "{orderNumber}". Please check your order number and try again.
          </p>
          <p className="text-sm text-gray-500">
            If you continue to have issues, please contact us directly.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientLookup;
