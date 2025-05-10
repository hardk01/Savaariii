import Pagination from '@/components/elements/Pagination';
import Link from 'next/link'
import React from 'react'

interface Car {
    id: string;
    name: string;
    model: string;
    image: string;
}

const CarListing = ({
    carList,
    handleEdit,
    handleDelete,
    handleNextPage,
    handlePreviousPage,
    totalPages,
    currentPage,
    setCurrentPage
}: {
    carList: Car[];
    handleEdit: (car: Car) => void;
    handleDelete: (carId: string) => void;
    handleNextPage: () => void;
    handlePreviousPage: () => void;
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}) => {
    return (
        <section className="section-box background-body py-96">
            <div className="container">
                <div className="row align-items-end mb-40">
                    <div className="col-md-8">
                        <h3 className="neutral-1000 wow fadeInUp">Browse by Type</h3>
                        <p className="text-xl-medium neutral-500 wow fadeInUp">Find the perfect ride for any occasion</p>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex justify-content-md-end mt-md-0 mt-4">
                            <Link className="btn btn-primary wow fadeInUp" href="/cars-list-1">
                                View More
                                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="box-list-populars">
                    <div className="row">
                        {carList.map((car: any, index: number) => (
                            <div key={index} className="col-lg-3 col-sm-6">
                                <div className="card-popular background-card hover-up wow fadeIn" data-wow-delay="0.2s">
                                    <div className="card-image">
                                        <Link className="card-title" href="#"><img src={car.image} alt="Carento" /></Link>
                                    </div>
                                    <div className="card-info">
                                        <Link className="card-title" href="#">{car.name}</Link>
                                        <div className="card-meta">
                                            <div className="meta-links"><Link href="#">{car.model}</Link></div>
                                            <div style={{ display: "flex", gap: "10px" }} className="card-button">
                                                <button onClick={() => handleEdit(car)} style={{ zIndex: "1" }} className="btn btn-light btn-sm p-1 rounded-circle shadow-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#70f46d" className="bi bi-pencil" viewBox="0 0 16 16">
                                                        <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2L2 11.207V13h1.793L14 3.793 11.207 2zM12.5 1.5 14.5 3.5 13.5 4.5 11.5 2.5l1-1z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleDelete(car._id)} style={{ zIndex: "1" }} className="btn btn-light btn-sm p-1 rounded-circle shadow-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dc3545" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 1 1 0-2H5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h2.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div style={{ justifyContent: "end" }} className="d-flex">
                            <Pagination
                                handleNextPage={handleNextPage}
                                handlePreviousPage={handlePreviousPage}
                                totalPages={totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CarListing
