import Layout from '@/components/layout/Layout'
import Brand1 from '@/components/section/Brand'
import CabBox from '@/components/section/CabBox'
import Hero2 from '@/components/section/Hero2'
import { Suspense } from 'react';

const BookingInfo = () => {

  return (
    <>
      <Layout headerStyle={2} footerStyle={1}>
        <Hero2 />
        <Suspense fallback={<div>Loading...</div>}>
          <CabBox />
        </Suspense>
        <Brand1 />
      </Layout>
    </>
  )
}

export default BookingInfo
