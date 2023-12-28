'use client';
import { createContext, useEffect, useState } from 'react';

interface FormRequestProps {
  pending: number;
}

const FormRequestContext = createContext<FormRequestProps | null>(null);

const FormRequestProvider = ({ children }: { children: React.ReactNode }) => {
  const [pending, setPending] = useState(0);

  const checkPending = async () => {
    return fetch('api/form-request?pending')
      .then((response) => response.json())
      .then((result) => {
        return result.success && setPending(result.total);
      });
  };

  useEffect(() => {
    // checkPending();
    (async () => await checkPending())();

    return () => setPending(0);
  }, [pending]);

  return <FormRequestContext.Provider value={{ pending }}>{children}</FormRequestContext.Provider>;
};

export { FormRequestContext, FormRequestProvider };
