import Deshboard from '@/components/deshboard/Deshboard'
import Layout from '@/components/layout/Layout'
import React from 'react'
import "../../../public/assets/css/deshboard.css"

const page = () => {
  return (
    <>
    <Layout headerStyle={2} footerStyle={1}>
      <Deshboard />
    </Layout>
    </>
  )
}

export default page
