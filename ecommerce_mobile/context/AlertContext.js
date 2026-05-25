import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PremiumAlertDialog, { inferAlertVariant } from '../components/premium/PremiumAlertDialog';
import { registerPremiumAlert } from '../utils/premiumAlert';

const AlertContext = createContext(null);

export function AlertProvider({ children }) {
  const [state, setState] = useState(null);

  const hide = useCallback(() => setState(null), []);

  const showAlert = useCallback((title, message, buttons, options = {}) => {
    const variant = options.variant || inferAlertVariant(title, message);
    setState({
      title: title || '',
      message: message || '',
      buttons: buttons || [{ text: 'OK', style: 'default' }],
      variant,
    });
  }, []);

  useEffect(() => {
    registerPremiumAlert(showAlert);
    return () => registerPremiumAlert(null);
  }, [showAlert]);

  return (
    <AlertContext.Provider value={{ showAlert, hide }}>
      {children}
      <PremiumAlertDialog
        visible={!!state}
        title={state?.title}
        message={state?.message}
        buttons={state?.buttons}
        variant={state?.variant}
        onClose={hide}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return ctx;
}
