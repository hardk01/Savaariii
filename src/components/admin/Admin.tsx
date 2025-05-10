"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { coupons } from "@/utility/coupon"
import CarsSelect from './CarsSelect';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export interface AuthTokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

interface Blog {
  title: string;
  image: string;
  date: string;
  description: string;
}

interface city {
  cityFrom: string;
  cityTo: string;
  pickUpDate: string;
  pickUpTime: string;
}

interface user {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  postCode: number
}

interface Cars {
  selectedCar: string;
  from: string;
  to: string;
  distance: string;
  pickUpDate: string;
  pickUpTime: string;
  city: string;
  returnDate: string;
  price: string;
  name: string;
  email: string;
  phoneNumber: string;
  discountedPrice: string;
  finalPayableAmount: string;
}

const Admin = () => {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState("Blog");
  const [formData, setFormData] = useState<user[]>([]);
  const [carData, setCarData] = useState<Cars[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState<city[]>([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);


  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) {
      router.push("/loginadmin"); 
    }
  }, [router]);

  
  useEffect(() => {
    const storedBlogs = localStorage.getItem("blogs");
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('users');
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('orderHistory');
    if (storedData) {
      setCarData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('formDataArray');
    if (storedData) {
      setSearch(JSON.parse(storedData));
    }
  }, []);

  const handleAddBlog = async () => {
    if (!title || !image || !description) {
        alert("Please fill in all fields");
        return;
    }

    try {
      const token = localStorage.getItem("token");
      let userId: string | undefined;
  
      if (token) {
        const decoded: AuthTokenPayload = jwtDecode(token);
        // console.log("Decoded Token:", decoded);
        userId = decoded.userId;
      }
  
      if (!userId) {
        alert("User ID not found in token");
        return;
      }

        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("title", title);
        formData.append("description", description);
        // formData.append("date", new Date().toLocaleDateString());

        console.log("formData", userId, title, description)

        // Convert base64 image to Blob (if image is base64)
        if (image.startsWith("data:image")) {
            const blob = await (await fetch(image)).blob();
            formData.append("image", blob, "image.jpg");
        } else {
            alert("Invalid image format");
            return;
        }

        
        const response = await fetch("http://192.168.1.7:3000/v1/blogs/", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData, 
        });

        if (!response.ok) {
            throw new Error("Failed to add blog post");
        }

        const result = await response.json();
        // console.log("Blog added:", result);

        const updatedBlogs = [...blogs, result];
        setBlogs(updatedBlogs);

        setTitle("");
        setImage("");
        setDescription("");

        alert("Blog post added successfully!");

    } catch (error) {
        console.error("Add blog error:", error);
        alert(error);
    }
};


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file");
    }
  };


  return (
    <div className='min-h-screen bg-gray-100'>
      <div className="flex justify-center mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
          <a
            onClick={() => setSelectedOption("Blog")}
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:scale-105 transform transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Blog
            </h2>
          </a>
          <a
            onClick={() => setSelectedOption("User")}
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:scale-105 transform transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              User Info
            </h2>
          </a>
          <a
            onClick={() => setSelectedOption("Booking")}
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:scale-105 transform transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Booking Info
            </h2>
          </a>
          <a
            onClick={() => setSelectedOption("Search")}
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:scale-105 transform transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Search Info
            </h2>
          </a>
          <a
            onClick={() => setSelectedOption("Cars")}
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:scale-105 transform transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Cars
            </h2>
          </a>
          <a
            onClick={() => setSelectedOption("Coupon")}
            className="bg-white shadow-lg rounded-lg p-6 text-center hover:scale-105 transform transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Coupon Code
            </h2>
          </a>
        </div>
      </div>
      {selectedOption === "Blog" && (
        <div className="min-h-screen bg-gray-100 py-10">
          <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Add Blog</h1>

            {/* Blog Form */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Enter blog title"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Image</label>
                <div
                  className={`w-full mt-1 p-6 border border-dashed rounded-md flex flex-col items-center justify-center ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  {image ? (
                    <Image
                      width="0"
                      height="0"
                      priority={true}
                      unoptimized
                      src={image} alt="Uploaded Preview" className="h-40 object-contain" />
                  ) : (
                    <p className="text-gray-500">
                      Drag & drop an image here, or click to upload
                    </p>
                  )}
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                  placeholder="Or enter image URL"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Enter blog description"
                />
              </div>

              <button
                onClick={handleAddBlog} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                Add Blog
              </button>
            </div>
          </div>

          {/* Blog List */}
          <div className="max-w-3xl mx-auto mt-10">
            <h2 className="text-xl font-semibold mb-4">Blog List</h2>
            {blogs.length === 0 ? (
              <p className="text-gray-500">No blogs added yet.</p>
            ) : (
              blogs.map((blog, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-4 mb-4"
                >
                  <h3 className="text-lg font-bold">{blog.title}</h3>
                  <Image
                    width="0"
                    height="0"
                    priority={true}
                    unoptimized
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded-md mt-2"
                  />
                  <p className="text-gray-500 text-sm mt-1">{blog.date}</p>
                  <p className="mt-2">{blog.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {selectedOption === "User" && (
        <div className="max-w-3xl mx-auto mt-10">
          <h2 className="text-xl font-semibold mb-4">Coustmer Details</h2>
          {formData.map((data, index: number) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold">No.{index + 1}</h3>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Full Name: </span>{data.firstName} {" "} {data.lastName}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Email: </span>{data.email}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Phone Number: </span>{data.phoneNumber}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Post Code: </span>{data.postCode}</p>
            </div>
          ))}
        </div>
      )}
      {selectedOption === "Booking" && (
        <div className="max-w-3xl mx-auto mt-10">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          {carData.map((data, index: number) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold">No.{index + 1}</h3>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Name: </span>{data?.name}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Email: </span>{data?.email}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Contact Number: </span> {data?.phoneNumber}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Car: </span> {data?.selectedCar}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">City: </span> {data?.from} {">"} {data?.to}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Distance: </span>{data?.distance}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">PICK UP Date: </span>{data?.pickUpDate}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">PICK UP Time: </span>{data?.pickUpTime}</p>
              {data.city && (
                <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">City: </span>{data?.city}</p>
              )}
              {data.returnDate && (
                <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Return Date: </span>{data?.returnDate}</p>
              )}
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Rate: </span>{data?.price}₹</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Cash On Pay: </span>{data?.discountedPrice}₹</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Online Payment : </span>{data?.finalPayableAmount}₹</p>
            </div>
          ))}
        </div>
      )}
      {selectedOption === "Search" && (
        <div className="max-w-3xl mx-auto mt-10">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          {search.map((data, index: number) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold">No.{index + 1}</h3>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">From: </span>{data.cityFrom}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">To: </span>{data.cityTo}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Date: </span>{data.pickUpDate}</p>
              <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Time: </span>{data.pickUpTime}</p>
            </div>
          ))}
        </div>
      )}
      {selectedOption === "Cars" && (
        <div className="max-w-6xl mx-auto mt-10">
          <h2 className="text-xl font-semibold mb-4">Cars Details</h2>
          <CarsSelect />
        </div>
      )}
      {selectedOption === "Coupon" && (
        <div className="max-w-6xl mx-auto mt-10">
          <h2 className="text-xl font-semibold mb-4">Cars Details</h2>
          {coupons.map((data, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold">No.{index + 1}</h3>
              <div>
                <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Code: </span>{data.code}</p>
                <p className="text-gray-500 text-sm mt-1"><span className="text-md font-bold">Discount: </span>{data.discount}%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Admin;
