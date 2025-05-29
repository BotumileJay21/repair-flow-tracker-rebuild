
import React, { useState } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Repair } from '../types';
import { updateRepair, deleteRepair } from '../utils/storage';
import { sendCompletionEmail } from '../utils/emailService';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  repairs: Repair[];
  onRepairUpdated: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ repairs, onRepairUpdated }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dateReceived');

  const filteredRepairs = repairs
    .filter(repair => {
      const matchesSearch = 
        repair.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repair.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repair.deviceType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || repair.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'dateReceived') {
        return new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime();
      }
      return a[sortBy as keyof Repair] > b[sortBy as keyof Repair] ? 1 : -1;
    });

  const handleStatusUpdate = async (repairId: string, newStatus: Repair['status']) => {
    const repair = repairs.find(r => r.id === repairId);
    if (!repair) return;

    updateRepair(repairId, { status: newStatus });
    
    // Send completion email if status changed to Completed
    if (newStatus === 'Completed' && repair.status !== 'Completed') {
      try {
        await sendCompletionEmail({ ...repair, status: newStatus });
        toast({
          title: "Status Updated!",
          description: "Completion email sent to client.",
        });
      } catch (error) {
        toast({
          title: "Status Updated",
          description: "Status updated but email notification failed.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Status Updated!",
        description: `Order ${repair.orderNumber} status changed to ${newStatus}.`,
      });
    }
    
    onRepairUpdated();
  };

  const handleDelete = (repairId: string) => {
    const repair = repairs.find(r => r.id === repairId);
    if (!repair) return;

    if (window.confirm(`Are you sure you want to delete order ${repair.orderNumber}?`)) {
      deleteRepair(repairId);
      toast({
        title: "Order Deleted",
        description: `Order ${repair.orderNumber} has been deleted.`,
      });
      onRepairUpdated();
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

  if (repairs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border p-12 text-center">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No repairs yet</h3>
        <p className="text-gray-500">Add your first repair to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order number, client name, or device..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Statuses</option>
              <option value="Received">Received</option>
              <option value="Diagnosing">Diagnosing</option>
              <option value="Repairing">Repairing</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dateReceived">Sort by Date</option>
              <option value="orderNumber">Sort by Order Number</option>
              <option value="clientName">Sort by Client Name</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Repairs List */}
      <div className="space-y-4">
        {filteredRepairs.map((repair) => (
          <div key={repair.id} className="bg-white rounded-xl shadow-lg border overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                    <h3 className="text-lg font-bold text-gray-800">{repair.orderNumber}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(repair.status)} w-fit`}>
                      {repair.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Client:</span>
                      <p className="font-medium">{repair.clientName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Device:</span>
                      <p className="font-medium">{repair.deviceType}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Date Received:</span>
                      <p className="font-medium">{new Date(repair.dateReceived).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{repair.email}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className="text-gray-600 text-sm">Issue:</span>
                    <p className="text-gray-800">{repair.issueDescription}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {repair.status !== 'Received' && (
                      <Button
                        onClick={() => handleStatusUpdate(repair.id, 'Received')}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        Received
                      </Button>
                    )}
                    {repair.status !== 'Diagnosing' && (
                      <Button
                        onClick={() => handleStatusUpdate(repair.id, 'Diagnosing')}
                        variant="outline"
                        size="sm"
                        className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                      >
                        Diagnosing
                      </Button>
                    )}
                    {repair.status !== 'Repairing' && (
                      <Button
                        onClick={() => handleStatusUpdate(repair.id, 'Repairing')}
                        variant="outline"
                        size="sm"
                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      >
                        Repairing
                      </Button>
                    )}
                    {repair.status !== 'Completed' && (
                      <Button
                        onClick={() => handleStatusUpdate(repair.id, 'Completed')}
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        Completed
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleDelete(repair.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRepairs.length === 0 && repairs.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No repairs match your filters</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
