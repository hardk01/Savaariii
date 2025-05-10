import Link from 'next/link'
import React from 'react'

const Pagination = ({ handleNextPage, handlePreviousPage, currentPage, totalPages, setCurrentPage }: any) => {
    return (
        <>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item">
                        <Link onClick={(e) => {
                                e.preventDefault(); // Prevent default scrolling behavior
                                handlePreviousPage();
                            }} className={`page-item ${currentPage === 1 ? "disabled" : ""}`} aria-label="Previous" href={'#'}>
                            <span aria-hidden="true">
                                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.00016 1.33325L1.3335 5.99992M1.3335 5.99992L6.00016 10.6666M1.3335 5.99992H10.6668" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </Link>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <li
                            key={index}
                            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                        >
                            <Link href={'#'}
                                className="page-link"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent default scrolling behavior
                                    setCurrentPage(index + 1);
                                }}
                            >
                                {index + 1}
                            </Link>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <Link onClick={(e) => {
                                e.preventDefault(); // Prevent default scrolling behavior
                                handleNextPage();
                            }} className="page-link" href={'#'} aria-label="Next">
                            <span aria-hidden="true">
                                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.99967 10.6666L10.6663 5.99992L5.99968 1.33325M10.6663 5.99992L1.33301 5.99992" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Pagination
