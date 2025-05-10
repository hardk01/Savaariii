"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Pagination from '../elements/Pagination';

const BlogList = () => {
    const [blogs, setBlogs] = useState<{ _id: string; title: string; description: string; image?: string }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}v1/blogs?page=${currentPage}&limit=5`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch blogs");
                }

                const data = await response.json();

                const blogArray = Array.isArray(data.data) ? data.data : [];
                setBlogs(blogArray);

                // Update total pages from the API response
                setTotalPages(data.totalPages || 1);

                localStorage.setItem("blogs", JSON.stringify(blogArray));
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        fetchBlogs();
    }, [currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <>
            <div className="section-box box-posts-grid-2 background-100">
                <div className="container">
                    <div className="text-center  mb-40">
                        <div className="background-body px-3 py-2 rounded-12 border d-flex gap-3 d-inline-flex">
                            <Link href="/" className="neutral-700 text-md-medium">Home</Link>
                            <span>
                                <img src="/assets/imgs/template/icons/arrow-right.svg" alt="Carento" />
                            </span>
                            <Link href="/blog" className="neutral-1000 text-md-bold">Blog</Link>
                        </div>
                        <h3 className="my-3 neutral-1000">Inside &amp; Trending</h3>
                    </div>
                    <div className="row">
                        <div className="col-lg-7">
                            <div className="card-blog">
                                <div className="card-image"><img src="/assets/imgs/blog/blog-list/img-1.png" alt="carento" /></div>
                                <div className="card-info">
                                    <div className="card-info-blog">
                                        <Link className="btn btn-label-tag" href="#">Car Rental Tips</Link>
                                        <Link className="card-title heading-5" href="/blog-details">How to Get the Most Out of Your Rental Car Experience</Link>
                                        <div className="card-meta-user">
                                            <div className="box-author-small">
                                                <img src="/assets/imgs/page/homepage1/avatar.png" alt="Carento" />
                                                <p className="text-sm-bold">By Jimmy Dave</p>
                                            </div>
                                            <div className="date-post">
                                                <p className="text-sm-medium">12 January 2024</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <ul className="list-posts list-posts-md">
                                <li>
                                    {blogs.map((data, index) => (
                                        <div key={index} className="card-post">
                                            <div className="card-image">
                                                <Link href="/blog-details">
                                                    {data.image ? (
                                                        <img src={data.image} alt="carento" />
                                                    ) : (
                                                        <img src="/assets/imgs/blog/blog-list/img-2.png" alt="Default Image" />
                                                    )}
                                                </Link>
                                            </div>
                                            <div className="card-info">
                                                <Link className="text-xl-bold neutral-1000" href="/blog-details">{data.title}</Link>
                                                <div className="d-flex align-items-center">
                                                    <p className="text-md-bold date-post neutral-500 mr-20">18 Sep 2024</p>
                                                    <p className="text-md-bold neutral-500">12 January 2024</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 pt-55">
                        <span className="text-md-bold neutral-1000"> CATEGORY: </span>
                        <Link href="#" className="btn btn-white px-3 py-2">Industry News</Link>
                        <Link href="#" className="btn btn-white px-3 py-2">Rental Advice</Link>
                        <Link href="#" className="btn btn-white px-3 py-2">Road Trips</Link>
                        <Link href="#" className="btn btn-white px-3 py-2">Car Review</Link>
                        <Link href="#" className="btn btn-white px-3 py-2">Travel Tips</Link>
                        <Link href="#" className="btn btn-white px-3 py-2">Customer Stories</Link>
                    </div>
                </div>
            </div>
            <section className="box-section background-body">
                <div className="container">
                    <div className="section-box background-body py-96">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8">
                                    <h2 className="neutral-1000">Recent Posts</h2>
                                    <p className="text-xl-medium neutral-500">Favorite vehicles based on customer reviews</p>
                                    <div className="box-grid-hotels box-grid-news mt-60 mb-50 wow fadeIn">
                                        {blogs.map((data, index) => (
                                            <div key={index} className="card-flight card-news background-card">
                                                <div className="card-image">
                                                    <Link href="/blog-details">
                                                        {data.image ? (
                                                            <img src={data.image} alt="carento" />
                                                        ) : (
                                                            <img src="/assets/imgs/blog/blog-list/img-2.png" alt="Default Image" />
                                                        )}</Link>
                                                </div>
                                                <div className="card-info">
                                                    <Link className="btn btn-label-tag background-3" href="#">Adventure</Link>
                                                    <div className="card-title"><Link className="heading-6 neutral-1000" href="/blog-details">{data.title}</Link></div>
                                                    <div className="card-meta"><span className="post-date neutral-1000">18 Sep 2024</span><span className="post-time neutral-1000">6 mins</span><span className="post-comment neutral-1000">38 comments</span></div>
                                                    <div className="card-desc">
                                                        <p className="text-md-medium neutral-500">{data.description}</p>
                                                    </div>
                                                    <div className="card-program">
                                                        <div className="endtime">
                                                            <div className="card-button"><Link className="btn btn-gray" href="/blog-details">Keep Reading</Link></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                    <Pagination
                                        handleNextPage={handleNextPage}
                                        handlePreviousPage={handlePreviousPage}
                                        totalPages={totalPages}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <div className="box-search-style-2">
                                        <form action="#">
                                            <input type="text" placeholder="Search" />
                                            <input className="btn-search-submit" type="submit" />
                                        </form>
                                    </div>
                                    <div className="box-sidebar-border">
                                        <div className="box-head-sidebar">
                                            <p className="text-xl-bold neutral-1000">Trending Now</p>
                                        </div>
                                        <div className="box-content-sidebar">
                                            <ul className="list-posts">
                                                {blogs.map((data, index) => (
                                                    <li key={index}>
                                                        <div className="card-post">
                                                            <div className="card-image">
                                                                <Link href="/blog-details">{data.image ? (
                                                                    <img src={data.image} alt="carento" />
                                                                ) : (
                                                                    <img src="/assets/imgs/blog/blog-list/img-2.png" alt="Default Image" />
                                                                )}</Link>
                                                            </div>
                                                            <div className="card-info">
                                                                <Link className="text-md-bold neutral-1000" href="/blog-details">{data.title}</Link>
                                                                <p className="text-sm-medium date-post neutral-500">18 Sep 2024</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}

                                            </ul>
                                        </div>
                                    </div>
                                    <div className="box-sidebar-border">
                                        <div className="box-head-sidebar">
                                            <p className="text-xl-bold neutral-1000">Gallery</p>
                                        </div>
                                        <div className="box-content-sidebar">
                                            <ul className="list-photo-col-3">
                                                <li>
                                                    <Link href="#"><img src="/assets/imgs/blog/blog-list/cat.png" alt="Carento" /></Link>
                                                </li>
                                                <li>
                                                    <Link href="#"><img src="/assets/imgs/blog/blog-list/cat2.png" alt="Carento" /></Link>
                                                </li>
                                                <li>
                                                    <Link href="#"><img src="/assets/imgs/blog/blog-list/cat3.png" alt="Carento" /></Link>
                                                </li>
                                                <li>
                                                    <Link href="#"><img src="/assets/imgs/blog/blog-list/cat4.png" alt="Carento" /></Link>
                                                </li>
                                                <li>
                                                    <Link href="#"><img src="/assets/imgs/blog/blog-list/cat5.png" alt="Carento" /></Link>
                                                </li>
                                                <li>
                                                    <Link href="#"><img src="/assets/imgs/blog/blog-list/cat6.png" alt="Carento" /></Link>
                                                </li>
                                                <li>
                                                    <Link href="#"><img src="/assets/imgs/blog/blog-list/cat7.png" alt="Carento" /></Link>
                                                </li>
                                                <li>
                                                    <Link href="#"><img src="/assets/imgs/blog/blog-list/cat8.png" alt="Carento" /></Link>
                                                </li>
                                                <li>
                                                    <Link href="#"><img src="/assets/imgs/blog/blog-list/cat.png" alt="Carento" /></Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="sidebar-banner">
                                        <Link href="#"><img className="rounded-3 w-100" src="/assets/imgs/blog/blog-list/banner-ads.png" alt="Carento" /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section-box box-subscriber background-body">
                        <div className="container">
                            <div className="block-subscriber">
                                <div className="subscriber-left">
                                    <span className="btn btn-primary">Get instant discounts</span>
                                    <h4 className="mt-15 mb-30 neutral-1000">Sign up to unlock secret deals instantly!</h4>
                                    <form className="form-subscriber" action="#">
                                        <input className="form-control" type="text" placeholder="Your Email" />
                                        <input className="btn btn-submit" type="submit" defaultValue="Subscribe" />
                                    </form>
                                    <p className="text-sm-medium neutral-500 mt-15">No ads. No trails. No commitments</p>
                                </div>
                                <div className="subscriber-right" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default BlogList
