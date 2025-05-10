import Layout from '@/components/layout/Layout'
import Login from '@/components/login/Login'
import React from 'react'

const page = () => {
  return (
    <div>
      <Layout headerStyle={2} footerStyle={1}>
      <Login />
      </Layout>
    </div>
  )
}

export default page
