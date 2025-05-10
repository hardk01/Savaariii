import Pagination from '@/components/elements/Pagination';
import React, { useEffect, useState } from 'react'

const CouponAdd = () => {
    const [coupons, setCoupons] = useState<{ _id: string; title: string; code: string; discount: number }[]>([]);
    const [title, setTitle] = useState("");
    const [discount, setDiscount] = useState("");
    const [code, setCode] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/coupons?page=${currentPage}&limit=10`);
                const result = await response.json();

                if (response.ok) {
                    setCoupons(result.data || []);
                    setTotalPages(result.totalPages || 1);
                } else {
                    console.error("Failed to fetch coupons:", result.message);
                }
            } catch (error) {
                console.error("Error fetching coupons:", error);
            }
        };
        fetchCoupons();
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
            <section className="box-section box-contact-form background-body">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mb-30">
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!code || !discount || !title) {
                                        alert("Please fill all fields.");
                                        return;
                                    }

                                    const token = localStorage.getItem("token");
                                    const method = editingId ? "PUT" : "POST";
                                    const endpoint = editingId
                                        ? `${process.env.NEXT_PUBLIC_API_URL}v1/coupons/${editingId}`
                                        : `${process.env.NEXT_PUBLIC_API_URL}v1/coupons/`;

                                    try {
                                        const res = await fetch(endpoint, {
                                            method,
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: `Bearer ${token}`,
                                            },
                                            body: JSON.stringify({
                                                title,
                                                code,
                                                discount: Number(discount),
                                            }),
                                        });

                                        const result = await res.json();

                                        if (res.ok) {
                                            if (editingId) {
                                                // Update existing
                                                setCoupons((prev) =>
                                                    prev.map((c) => (c._id === editingId ? result.data : c))
                                                );
                                                alert("Coupon updated successfully!");
                                            } else {
                                                // Add new
                                                setCoupons((prev) => [...prev, result.data]);
                                                alert("Coupon added successfully!");
                                            }

                                            // Reset form
                                            setTitle("");
                                            setCode("");
                                            setDiscount("");
                                            setEditingId(null);
                                        } else {
                                            alert(result.message || "Failed to save coupon.");
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert("Error saving coupon.");
                                    }
                                }}
                                className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center gap-4"
                            >
                                <div className="form-contact">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="text-sm-medium neutral-1000">Code Title</label>
                                                <input
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    className="form-control username" type="text" placeholder="Title" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label className="text-sm-medium neutral-1000">Code</label>
                                                <input
                                                    value={code}
                                                    onChange={(e) => setCode(e.target.value)}
                                                    className="form-control username" type="text" placeholder="Enter Your Code" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label className="text-sm-medium neutral-1000">Discount</label>
                                                <input
                                                    value={discount}
                                                    onChange={(e) => setDiscount(e.target.value)}
                                                    className="form-control username" type="text" placeholder="Enter Your Discount %" />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <button type='submit' className="btn btn-book">
                                                Add Coupon
                                                <svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-5 offset-lg-1 position-relative z-1 mt-lg-0 mt-4">
                            <div className="position-relative">
                                <div className="row align-items-center">
                                    <div className="col-sm-6">
                                        <img className="bdrd8 w-100 mb-15 wow fadeInUp" src="/assets/imgs/cta/cta-6/img-1.png" alt="Carento" />
                                        <img className="bdrd8 w-100 mb-15 wow fadeInUp" src="/assets/imgs/cta/cta-6/img-2.png" alt="Carento" />
                                    </div>
                                    <div className="col-sm-6 mt-md-50">
                                        <img className="bdrd8 w-100 mb-15 wow fadeInUp" src="/assets/imgs/cta/cta-6/img-3.png" alt="Carento" />
                                        <img className="bdrd8 w-100 wow fadeInUp" src="/assets/imgs/cta/cta-6/img-4.png" alt="Carento" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="row mb-5">
                {coupons.map((item, idx) => (
                    <div key={idx} style={{ padding: "10px" }} className="col-lg-3 col-md-6">
                        <div className="card-news background-card hover-up mb-24">
                            <div className="position-absolute top-0 end-0 m-3 d-flex gap-2">
                                <button onClick={() => {
                                    setTitle(item.title);
                                    setCode(item.code);
                                    setDiscount(item.discount.toString());
                                    setEditingId(item._id);
                                }} style={{ zIndex: "1" }} className="btn btn-light btn-sm p-1 rounded-circle shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6c757d" className="bi bi-pencil" viewBox="0 0 16 16">
                                        <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2L2 11.207V13h1.793L14 3.793 11.207 2zM12.5 1.5 14.5 3.5 13.5 4.5 11.5 2.5l1-1z" />
                                    </svg>
                                </button>

                                <button
                                    onClick={async () => {
                                        const token = localStorage.getItem("token");
                                        try {
                                            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/coupons/${item._id}`, {
                                                method: "DELETE",
                                                headers: {
                                                    Authorization: `Bearer ${token}`,
                                                },
                                            });

                                            if (res.ok) {
                                                setCoupons((prev) => prev.filter((coupon) => coupon._id !== item._id));
                                                alert("Coupon deleted successfully!");
                                            } else {
                                                alert("Failed to delete coupon.");
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert("Error deleting coupon.");
                                        }
                                    }}
                                    style={{ zIndex: "1" }} className="btn btn-light btn-sm p-1 rounded-circle shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#dc3545" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 1 1 0-2H5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h2.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z" />
                                    </svg>
                                </button>
                            </div>
                            <div style={{ padding: "46px 30px" }} className="card-info">
                                <div className="card-title mb-3">
                                    <div className="text-xl-bold neutral-1000">Code : {item.code}</div>
                                    <p className="text-md-medium neutral-500 mt-2">Title : {item.title}</p>
                                </div>
                                <div className="card-program">
                                    <div className="endtime">
                                        <div className="card-button"><div className="btn btn-primary2">{item.discount}% Discount</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
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
        </>
    )
}

export default CouponAdd
