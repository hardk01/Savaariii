'use client';
import React, { useEffect, useState } from 'react';

export interface AuthTokenPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

interface ContactData {
    _id?: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

const Contect = () => {


    const [userData, setUserData] = useState<ContactData[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [contectId, setContectId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCabBookings = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/contact/`, {
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
                setUserData(Array.isArray(data.data) ? data.data : []);
                setUserData(data.data);
            } catch (err) {
                console.error('Error fetching cab bookings:', err);
            }
        };

        fetchCabBookings();
    }, []);



    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEdit = (sub: any) => {

        setFormData({
            name: sub.name || "",
            email: sub.email || "",
            subject: sub.subject || "",
            message: sub.message || "",
        });
        setContectId(sub._id);
        setShowModal(true);
    };

    const handleUpdate = async (e: any) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/contact/${contectId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setUserData(prev =>
                    prev ? prev.map(item => item._id === contectId ? { ...item, ...formData } : item) : prev
                );
                setShowModal(false);
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(date);
    };

    return (
        <>
            <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex={-1} style={{ background: showModal ? "rgba(0,0,0,0.5)" : "transparent" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleUpdate}>
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Contact</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-control mb-2"
                                    placeholder="Name"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control mb-2"
                                    placeholder="Email"
                                    required
                                />
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="form-control mb-2"
                                    placeholder="Subject"
                                    required
                                />
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="form-control mb-2"
                                    placeholder="Message"
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">Update</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <section className="box-section block-content-tourlist background-body">
                <div className="container">
                    <div className="box-content-main pt-20">
                        <div className="content-right">
                            <div className="box-grid-tours wow fadeIn">
                                <div className="row">
                                    {userData && userData.map((sub, index) => (
                                        <div key={index} className="col-lg-4 col-md-6">
                                            <div className="card-journey-small background-card hover-up">
                                                <div className="card-info p-3 pt-30 border-top">
                                                    <div className="author-info">
                                                        <p className="text-lg-bold">{sub.name}</p>
                                                        <p className="text-sm-medium neutral-500">{typeof sub.createdAt === 'string' ? formatDate(sub.createdAt) : 'Invalid Date'}</p>
                                                    </div>
                                                    <div className="card-program border-top">
                                                        <div className="box-info-contact">
                                                            <p className="text-md-medium email neutral-1000"><span className="text-md-bold">Email:</span> {sub.email}</p>
                                                        </div>
                                                        <label className="bg-2 rounded-12 position-absolute top-0 end-0 translate-middle-y px-3 py-2 me-4 text-sm-bold">{sub.status}</label>
                                                        <div className="endtime pt-3 mt-3 border-top">
                                                            <p className="text-md-medium mobile-phone neutral-1000"><span className="text-md-bold">Subject:</span> {sub.subject}</p>
                                                            {/* <p className="text-md-medium mobile-phone neutral-1000"><span className="text-md-bold">Message:</span> {sub.message}</p> */}

                                                        </div>
                                                        <div className="endtime pt-3 mt-3">
                                                            {/* <p className="text-md-medium mobile-phone neutral-1000"><span className="text-md-bold">Subject:</span> {sub.subject}</p> */}
                                                            <p className="text-md-medium mobile-phone neutral-1000"><span className="text-md-bold">Message:</span> {sub.message}</p>

                                                        </div>
                                                        <div className="endtime">
                                                            <div className="card-price">
                                                                <p className="text-sm-medium neutral-500"><span style={{ color: '#6e1107' }}>{typeof sub.updatedAt === 'string' ? formatDate(sub.updatedAt) : 'Invalid Date'}</span></p>
                                                            </div>

                                                            <div className="card-button"><span onClick={() => handleEdit(sub)} className="btn btn-gray" >Edit</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                            {/* <div className="d-flex justify-content-end">
                                <Pagination
                                handleNextPage={handleNextPage}
                                handlePreviousPage={handlePreviousPage}
                                totalPages={totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                />
                                </div> */}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contect;
