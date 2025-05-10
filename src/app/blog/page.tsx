import Layout from '@/components/layout/Layout'
import BlogList from '@/components/section/BlogList'
import React from 'react'

const page = () => {
  return (
    <>
      <Layout footerStyle={1}>
        <BlogList />
      </Layout>
    </>
  )
}

export default page
