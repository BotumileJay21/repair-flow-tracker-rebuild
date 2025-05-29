
import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Repair } from '../types';
import { generateOrderNumber, saveRepair } from '../utils/storage';
import { sendNewRepairEmail } from '../utils/emailService';
import { useToast } from '@/hooks/use-toast';

interface AddRepairFormProps {
  onBack: () => void;
  onSaved: () => void;
}

const AddRepairForm: React.FC<AddRepairFormProps> = ({ onBack, onSaved }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    deviceType: '',
    issueDescription: '',
    expectedCompletion: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();
      const repair: Repair = {
        id: Date.now().toString(),
        orderNumber,
        ...formData,
        dateReceived: new Date().toISOString().split('T')[0],
        status: 'Received',
        createdAt: new Date().toISOString()
      };

      saveRepair(repair);
      
      // Send email notification
      await sendNewRepairEmail(repair);

      toast({
        title: "Repair Added Successfully!",
        description: `Order ${orderNumber} has been created and client notified.`,
      });

      onSaved();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save repair. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold text-gray-800">Add New Repair</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter client name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="client@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Type *
              </label>
              <select
                name="deviceType"
                value={formData.deviceType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select device type</option>
                <option value="Laptop">Laptop</option>
                <option value="Desktop Computer">Desktop Computer</option>
                <option value="MacBook">MacBook</option>
                <option value="iMac">iMac</option>
                <option value="Gaming PC">Gaming PC</option>
                <option value="Tablet">Tablet</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Completion
              </label>
              <input
                type="date"
                name="expectedCompletion"
                value={formData.expectedCompletion}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Description *
            </label>
            <textarea
              name="issueDescription"
              value={formData.issueDescription}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the problem in detail..."
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Saving...' : 'Save Repair'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRepairForm;
