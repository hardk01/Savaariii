import React, { useEffect, useRef, useState } from 'react';
import CarListing from './elements/CarListing';

const AddCar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [carList, setCarList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingCar, setEditingCar] = useState<{
    _id: any; id: string; name: string; model: string
  } | null>(null);

  // console.log(carList, "response");
  

  const fetchCarList = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}v1/cars?page=${currentPage}&limit=8`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }

      const data = await response.json();

      const carArray = Array.isArray(data.data) ? data.data : [];
      setCarList(carArray);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  useEffect(() => {
    fetchCarList();
  }, [currentPage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!name || !model || (!imageFile && !editingCar)) {
      setMessage("Please fill all fields and upload an image.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("model", model);
  
    if (imageFile) {
      formData.append("image", imageFile);
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Unauthorized.");
        return;
      }
  
      const url = editingCar
        ? `${process.env.NEXT_PUBLIC_API_URL}v1/cars/${editingCar.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}v1/cars/`;
  
      const method = editingCar ? "PATCH" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        setName("");
        setModel("");
        setImageUrl("");
        setImageFile(null);
        setEditingCar(null);
        setMessage(editingCar ? "Car updated successfully!" : "Car added successfully!");
        fetchCarList();
      } else {
        setMessage("Failed to save car.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred.");
    }
  };
  
  const handleEdit = (car: { id?: string; _id?: string; name: string; model: string; image: string }) => {
    const resolvedId = car._id || car.id;
  
    if (!resolvedId) {
      console.error("Car ID is missing!");
      return;
    }
  
    setEditingCar({
      _id: resolvedId,
      id: resolvedId,
      name: car.name,
      model: car.model,
    });
  
    setName(car.name);
    setModel(car.model);
    setImageUrl(car.image);
    setImageFile(null);
  };
  

  const handleUpdateCar = async () => {
    if (!editingCar?._id || !editingCar?.name || !editingCar?.model) {
      setMessage("Invalid car data.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Unauthorized.");
        return;
      }
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}v1/cars/${editingCar._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingCar.name,
            model: editingCar.model,
          }),
        }
      );
  
      if (response.ok) {
        setName("");
        setModel("");
        setImageFile(null);
        setEditingCar(null);
        setImageUrl("");
        setMessage("Car updated successfully!");
      
        // Refetch the car list to update the UI
        fetchCarList();
      }
  
      const updatedCar = await response.json();
  
      // Update the carList state with the updated car
      setCarList((prevCars) =>
        prevCars.map((car) => (car._id === updatedCar._id ? updatedCar : car))
      );
  
      // Reset the form fields
      setName("");
      setModel("");
      setImageFile(null);
      setEditingCar(null);
      setImageUrl("");
      setMessage("Car updated successfully!");
    } catch (error) {
      console.error("Error updating car:", error);
      setMessage("An error occurred.");
    }
  };

  const handleDelete = async (carId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Unauthorized.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/cars/${carId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage("Car deleted successfully.");
        // Optionally refetch your list of cars here
      } else {
        setMessage("Failed to delete car.");
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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
  return (
    <>
      <section className="section-cta-6 background-body py-96">
        <div className="box-cta-6">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="col-lg-12 mb-30">
                  <div className="form-contact">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label className="text-sm-medium neutral-1000">Car Name</label>
                            <input
                              value={name || ""}
                              onChange={(e) => setName(e.target.value)}
                              className="form-control username"
                              type="text"
                              placeholder="Car Name"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label className="text-sm-medium neutral-1000">Car Modal</label>
                            <input
                              value={model || ""}
                              onChange={(e) => setModel(e.target.value)}
                              className="form-control username"
                              type="text"
                              placeholder="Car Model"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label className="text-sm-medium neutral-1000">Image</label>
                            <div
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                              className="form-control username"
                              style={{
                                border: "2px dashed #ccc",
                                padding: "10px",
                                cursor: "pointer",
                                textAlign: "center",
                              }}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt="preview"
                                  style={{ maxWidth: "200px", height: "auto" }}
                                />
                              ) : (
                                <span>Click or drag & drop image, or paste image URL below</span>
                              )}
                            </div>

                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleFileSelect}
                            />

                            <input
                              className="form-control mt-2"
                              type="text"
                              placeholder="Or paste image URL"
                              value={imageUrl || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="col-lg-5">
                            <button
                              type="submit"
                              className="btn btn-book"
                            >
                             {editingCar ? "Update Car" : "Add Car"}
                              <svg
                                width={17}
                                height={16}
                                viewBox="0 0 17 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
               
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
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
          <div className="bg-overlay position-absolute bottom-0 end-0 h-75 background-brand-2 opacity-25 z-0 rounded-start-pill" />
          <CarListing
            carList={carList}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </section>
    </>
  )
}

export default AddCar
