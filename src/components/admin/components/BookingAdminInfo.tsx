import Pagination from '@/components/elements/Pagination';
import React, { useEffect, useState } from 'react'

const BookingAdminInfo = () => {
    interface CabBooking {
        _id: string;
        fullname: string;
        email: string;
        phoneno: string;
        pic: string;
        drop: string;
        amount: number;
        status: string;
        pickupdate: string;
        pickuptime: string;
    }

    const [cabBookings, setCabBookings] = useState<CabBooking[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCabBookings = async () => {

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

    const handleAccept = async (id: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cab-bookings/${id}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error('Failed to accept booking');
            }

            alert('Booking accepted successfully');
            setCabBookings((prev) => prev.filter((booking) => booking._id !== id));
        } catch (err) {
            console.error('Error accepting booking:', err);
        }
    };

    const handleReject = async (id: string) => {
        const rejectionReason = prompt('Enter the reason for rejection:');
        if (!rejectionReason) {
            alert('Rejection reason is required');
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cab-bookings/${id}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rejectionReason }),
            });

            if (!res.ok) {
                throw new Error('Failed to reject booking');
            }

            alert('Booking rejected successfully');
            setCabBookings((prev) => prev.filter((booking) => booking._id !== id));
        } catch (err) {
            console.error('Error rejecting booking:', err);
        }
    };

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
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
                                <th><i className="fa fa-trophy" aria-hidden="true"></i> Rate</th>
                                <th><i className="fa fa-trophy" aria-hidden="true"></i> Status</th>
                                <th><i className="fa fa-trophy" aria-hidden="true"></i> Date</th>
                                <th><i className="fa fa-trophy" aria-hidden="true"></i> Time</th>
                                <th><i className="fa fa-trophy" aria-hidden="true"></i> Action</th>
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
                                    <th>{booking.amount} </th>
                                    <th>{booking.status} </th>
                                    <th>{booking?.pickupdate ? formatDate(booking.pickupdate) : ""} </th>
                                    <th>{booking.pickuptime} </th>
                                    <th><div style={{ display: "flex", gap: "10px" }} className="card-button">
                                        <button onClick={() => handleAccept(booking._id)} style={{ zIndex: "1" }} className="btn btn-light btn-sm p-1 rounded-circle shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#70f46d" className="bi bi-pencil" viewBox="0 0 16 16">
                                                <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2L2 11.207V13h1.793L14 3.793 11.207 2zM12.5 1.5 14.5 3.5 13.5 4.5 11.5 2.5l1-1z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleReject(booking._id)} style={{ zIndex: "1" }} className="btn btn-light btn-sm p-1 rounded-circle shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dc3545" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 1 1 0-2H5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h2.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z" />
                                            </svg>
                                        </button>
                                    </div></th>
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
    )
}

export default BookingAdminInfo
