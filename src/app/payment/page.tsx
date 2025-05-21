'use client';
import Layout from '@/components/layout/Layout';
import PaymentDetails from '@/components/section/PaymentDetails';
import React, { useEffect, useState } from 'react';
import AuthRequired from '../error/page';

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  if (isLoggedIn === null) {
    // Optionally show a loading spinner here
    return null;
  }

  return (
    <Layout>
      {!isLoggedIn ? <AuthRequired /> : <PaymentDetails />}
    </Layout>
  );
};

export default Page;