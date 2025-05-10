import Pagination from '@/components/elements/Pagination'
import Link from 'next/link'
import React from 'react'

const BlogGrid = ({ blogs, handleDelete, handleEdit, handleNextPage, handlePreviousPage, totalPages, currentPage, setCurrentPage }: any) => {

    return (
        <>
            <section className="box-section background-body pt-80">
                <div className="container">
                    <h3 className="text-center mb-65 neutral-1000">Latest News</h3>
                    <div className="row">
                        {blogs.map((data: any, index: number) => (
                            <div key={index} className="col-lg-4 col-md-6 col-12">
                                <div className="card-news background-card hover-up mb-4">
                                    <div className="card-image">
                                        <img src={data.image} alt="Carento" />
                                    </div>
                                    <div className="card-info">
                                        <label className="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold">Car Review</label>
                                        <div className="card-meta"><span className="post-date neutral-1000">{data.updatedAt}</span><span className="post-time neutral-1000">6 mins</span><span className="post-comment neutral-1000">38 comments</span></div>
                                        <div className="card-title"><Link className="text-xl-bold neutral-1000" href="/blog-details">{data.title}</Link></div>
                                        <div className="card-program">
                                            <div className="endtime">
                                                <div className="card-author">
                                                    <img className="rounded-circle border border-primary" src="/assets/imgs/blog/blog-grid/avatar1.png" alt="Carento" />
                                                    <p className="text-sm-bold neutral-1000">Jimmy Dave</p>
                                                </div>
                                                <div style={{ display: "flex", gap: "10px" }} className="card-button">
                                                    <button onClick={() => handleEdit(data)} style={{ zIndex: "1" }} className="btn btn-light btn-sm p-1 rounded-circle shadow-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#70f46d" className="bi bi-pencil" viewBox="0 0 16 16">
                                                            <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2L2 11.207V13h1.793L14 3.793 11.207 2zM12.5 1.5 14.5 3.5 13.5 4.5 11.5 2.5l1-1z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(data._id)} style={{ zIndex: "1" }} className="btn btn-light btn-sm p-1 rounded-circle shadow-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dc3545" className="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 1 1 0-2H5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h2.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="d-flex justify-content-center">
                        <Pagination
                            handleNextPage={handleNextPage}
                            handlePreviousPage={handlePreviousPage}
                            totalPages={totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>

                </div>
            </section>
        </>
    )
}

export default BlogGrid
