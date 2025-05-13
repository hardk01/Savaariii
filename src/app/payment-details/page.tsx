import Layout from '@/components/layout/Layout';
import UserPaymentDetails from '@/components/section/UserPaymentDetails';
import React from 'react'
import { Suspense } from 'react';

const page = () => {
  return (
    <>

      {/* <Payment /> */}
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <UserPaymentDetails />
        </Suspense>
      </Layout>

    </>
  )
}

export default page;
