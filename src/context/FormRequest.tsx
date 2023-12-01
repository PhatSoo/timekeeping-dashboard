'use client';
import { createContext, useEffect, useState } from 'react';

interface FormRequestProps {
  pending: number;
  checkPending: () => void;
}

const FormRequestContext = createContext<FormRequestProps | null>(null);

const FormRequestProvider = ({ children }: { children: React.ReactNode }) => {
  const [pending, setPending] = useState(0);

  const checkPending = () => {
    return fetch('api/form-request?pending')
      .then((response) => response.json())
      .then((result) => result.success && setPending(result.data));
  };

  useEffect(() => {
    checkPending();
  }, [pending]);

  return <FormRequestContext.Provider value={{ pending, checkPending }}>{children}</FormRequestContext.Provider>;
};

export { FormRequestContext, FormRequestProvider };
