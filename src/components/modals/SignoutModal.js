'use client';

import { useState } from 'react';
import CustomAlert from '@/components/ui/CustomAlert';
import SuccessAlert from '@/components/ui/SuccessAlert';

export default function SignoutModal({ isOpen, onClose, onConfirm }) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSignout = async () => {
    setIsSigningOut(true);
    
    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Call the actual signout function
    await onConfirm();
    
    setIsSigningOut(false);
    
    // Show success message briefly before redirecting
    setShowSuccess(true);
  };

  return (
    <>
      <CustomAlert
        isOpen={isOpen && !showSuccess}
        onClose={onClose}
        title="Sign Out"
        message="Are you sure you want to sign out? You'll need to sign in again to access your dashboard."
        type="warning"
        confirmText={isSigningOut ? "Signing Out..." : "Yes, Sign Out"}
        cancelText="Cancel"
        onConfirm={handleSignout}
        showCancel={true}
      />
      
      <SuccessAlert
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Signed Out Successfully"
        message="You have been signed out. Redirecting to login page..."
        duration={2000}
      />
    </>
  );
}
