'use client';

import { useState, useEffect } from 'react';
import CustomAlert from './CustomAlert';

export default function SuccessAlert({ 
  isOpen, 
  onClose, 
  title = "Success!", 
  message = "Operation completed successfully.",
  duration = 3000 
}) {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAlert(true);
      
      // Auto-close after duration
      const timer = setTimeout(() => {
        setShowAlert(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <CustomAlert
      isOpen={showAlert}
      onClose={() => {
        setShowAlert(false);
        setTimeout(onClose, 300);
      }}
      title={title}
      message={message}
      type="success"
      confirmText="OK"
      showCancel={false}
    />
  );
}
