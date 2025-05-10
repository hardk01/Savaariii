import Layout from '@/components/layout/Layout'
import Brand1 from '@/components/section/Brand'
import CabBox from '@/components/section/CabBox'
import Hero2 from '@/components/section/Hero2'

const BookingInfo = () => {

  return (
    <>
      <Layout headerStyle={2} footerStyle={1}>
        <Hero2 />
        <CabBox />
        <Brand1 />
      </Layout>
    </>
  )
}

export default BookingInfo
