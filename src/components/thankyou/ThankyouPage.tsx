"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const ThankyouPage = () => {
    const router = useRouter()

    const hanldeGoHome = () => {
        router.push('/deshboard')
    }
    return (
        <>
            <div className="container pt-140 pb-170">
                <div className="content">
                    <div className="wrapper-1">
                        <div className="wrapper-2">
                            <h1>Thank you !</h1>
                            <p>Thanks for subscribing to our newsletter.</p>
                            <p>You should receive a confirmation email soon.</p>
                            <button onClick={hanldeGoHome} className="go-home">
                                Go Deshboard
                            </button>
                        </div>
                        <div className="footer-like">
                            <p>Email not received?
                                <a href="#"> Click here to send again</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
      .{
      background: #ffffff;
background: linear-gradient(to bottom, #ffffff 0%,#e1e8ed 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#e1e8ed',GradientType=0 );
    height: 100%;
        margin: 0;
        background-repeat: no-repeat;
        background-attachment: fixed;
      }
        .wrapper-1 {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .wrapper-2 {
          padding: 30px;
          text-align: center;
        }
        h1 {
          font-family: 'Kaushan Script', cursive;
          font-size: 4em;
          letter-spacing: 3px;
          color: #70f46d;
          margin: 0;
          margin-bottom: 20px;
        }
        .wrapper-2 p {
          margin: 0;
          font-size: 1.3em;
          color: #aaa;
          font-family: 'Source Sans Pro', sans-serif;
          letter-spacing: 1px;
        }
        .go-home {
          color: #fff;
          background: #70f46d;
          border: none;
          padding: 10px 50px;
          margin: 30px 0;
          border-radius: 30px;
          text-transform: capitalize;
          box-shadow: 0 10px 16px 1px rgba(174, 199, 251, 1);
          cursor: pointer;
        }
        .footer-like {
          margin-top: auto;
          background: #D7E6FE;
          padding: 6px;
          text-align: center;
        }
        .footer-like p {
          margin: 0;
          padding: 4px;
          color: #000000;
          font-family: 'Source Sans Pro', sans-serif;
          letter-spacing: 1px;
        }
        .footer-like p a {
          text-decoration: none;
          color: #000000;
          font-weight: 600;
        }
        @media (min-width: 360px) {
          h1 {
            font-size: 4.5em;
          }
          .go-home {
            margin-bottom: 20px;
          }
        }
        @media (min-width: 600px) {
          .content {
            max-width: 1000px;
            margin: 0 auto;
          }
          .wrapper-1 {
            height: initial;
            max-width: 620px;
            margin: 0 auto;
            margin-top: 50px;
            box-shadow: 4px 8px 40px 8px rgba(88, 146, 255, 0.2);
          }
        }
      `}</style>
        </>
    )
}

export default ThankyouPage
