import Pagination from '@/components/elements/Pagination';
import React, { ReactNode, useEffect, useState } from 'react'

interface CabBooking {
    drop: ReactNode;
    pic: ReactNode;
    fullname: ReactNode;
    email: ReactNode;
    phoneno: ReactNode;
    id: number;
}

const UserAdmin = () => {
    const [cabBookings, setCabBookings] = useState<CabBooking[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchCabBookings = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cab-bookings?page=${currentPage}&limit=10`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await res.json();
                setCabBookings(data.data);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error('Error fetching cab bookings:', err);
            }
        };

        fetchCabBookings();
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
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered   table-striped" style={{ marginTop: "100px" }}>
                            <thead className="table__head">
                                <tr className="winner__table">
                                    <th>S/N</th>
                                    <th><i className="fa fa-user" aria-hidden="true"></i>Full Name</th>
                                    <th><i className="fa fa-map-marker" aria-hidden="true"></i>Email</th>
                                    <th><i className="fa fa-calendar-o" aria-hidden="true"></i>Phone Number</th>
                                    <th><i className="fa fa-trophy" aria-hidden="true"></i>Pick Up</th>
                                    <th><i className="fa fa-trophy" aria-hidden="true"></i> Drop</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cabBookings.map((booking, index: number) => (
                                    <tr key={index} className="winner__table">
                                        <td>{index + 1}</td>
                                        <td>{booking.fullname}</td>
                                        <td>{booking.email}</td>
                                        <td>{booking.phoneno}</td>
                                        <td>{booking.pic}</td>
                                        <th>{booking.drop} </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
        </>
    )
}

export default UserAdmin
