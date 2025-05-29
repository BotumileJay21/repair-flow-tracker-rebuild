
import { Repair } from '../types';

// EmailJS configuration - replace with your actual keys
const EMAIL_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
  templateId: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
  publicKey: 'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
};

export const initEmailJS = () => {
  if (typeof window !== 'undefined' && window.emailjs) {
    window.emailjs.init(EMAIL_CONFIG.publicKey);
  }
};

export const sendNewRepairEmail = async (repair: Repair): Promise<void> => {
  if (!window.emailjs) {
    console.warn('EmailJS not loaded');
    return;
  }

  const templateParams = {
    to_email: repair.email,
    client_name: repair.clientName,
    order_number: repair.orderNumber,
    device_type: repair.deviceType,
    issue_description: repair.issueDescription,
    tracking_link: `${window.location.origin}?order=${repair.orderNumber}`
  };

  try {
    await window.emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      templateParams
    );
    console.log('New repair email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

export const sendCompletionEmail = async (repair: Repair): Promise<void> => {
  if (!window.emailjs) {
    console.warn('EmailJS not loaded');
    return;
  }

  const templateParams = {
    to_email: repair.email,
    client_name: repair.clientName,
    order_number: repair.orderNumber,
    device_type: repair.deviceType,
    completion_message: 'Your device repair is now complete and ready for collection!'
  };

  try {
    await window.emailjs.send(
      EMAIL_CONFIG.serviceId,
      'completion_template', // You'll need a separate template for completion emails
      templateParams
    );
    console.log('Completion email sent successfully');
  } catch (error) {
    console.error('Failed to send completion email:', error);
  }
};

// Initialize EmailJS when the module is imported
if (typeof window !== 'undefined') {
  initEmailJS();
}
