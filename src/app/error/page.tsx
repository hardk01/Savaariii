import Link from 'next/link';
import React from 'react'

const AuthRequired = () => {
    return (
        <div className="container pt-140 pb-170">
            <div className="row">
                <div className="col-md-5 mx-auto">
                    <div className="d-flex justify-content-center align-items-center flex-column">
                        <h1>404</h1>
                        <h5>Please Login or Register</h5>
                        <p className="text-md-medium neutral-500 text-center"> You must be logged in to access this page.<br />
                            Please login or create an account to continue.</p>
                        <Link href="/login" className="btn btn-primary mt-30"><img src="/assets/imgs/template/icons/arrow-left.svg" /> Back to Login</Link>
                        <img src="/assets/imgs/template/404.png" alt="Carento" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthRequired;
