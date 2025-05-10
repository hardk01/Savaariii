import Layout from '@/components/layout/Layout'
import UserContact from '@/components/section/UserContact'
import React from 'react'

const page = () => {
    return (
        <>
            <Layout headerStyle={2} footerStyle={1}>
                <UserContact />
            </Layout>
        </>
    )
}

export default page
