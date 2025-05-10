import React, { useEffect, useRef, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import BlogGrid from './elements/BlogGrid';

export interface AuthTokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const BlogAdmin = () => {
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [blogs, setBlogs] = useState<{ _id: string; title: string; description: string; image?: string }[]>([]);
  const [editingBlog, setEditingBlog] = useState<{ _id: string; title: string; description: string; image?: string } | null>(null);
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


  const handleAddBlog = async () => {
    if (!title || !imageUrl || !description) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let userId: string | undefined;

      if (token) {
        const decoded: AuthTokenPayload = jwtDecode(token);
        userId = decoded.userId;
      }

      if (!userId) {
        return;
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("title", title);
      formData.append("description", description);

      if (imageUrl.startsWith("blob:") || imageUrl.startsWith("data:image")) {
        const blob = await (await fetch(imageUrl)).blob();
        formData.append("image", blob, "image.jpg");
      } else {
        return;
      }


      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/blogs/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add blog post");
      }

      setTitle("");
      setImageUrl("");
      setDescription("");

    } catch (error) {
      alert(error);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}v1/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      setBlogs((prevBlogs: any[]) => prevBlogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
    }
  };

  const handleEdit = (blog: { _id: string; title: string; description: string; image?: string } | null) => {
    setEditingBlog(blog);
    if (blog) {
      setTitle(blog.title || ""); 
      setImageUrl(blog.image || ""); 
      setDescription(blog.description || "");
    }
  };

  const handleUpdateBlog = async () => {
    if (!editingBlog?.title || !editingBlog?.description) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}v1/blogs/${editingBlog._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editingBlog.title,
            description: editingBlog.description,
          }),
        }
      );

      if (!response.ok) {
        return;
      }

      const updatedBlog = await response.json();
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
      );

      setEditingBlog(null); 
      setTitle(""); 
      setDescription(""); 
      setImageUrl(""); 
    } catch (error) {
      console.error(error);
    }
  };


  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="text-sm-medium neutral-1000">Title</label>
                          <input
                            value={title || ""}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-control username"
                            type="text"
                            placeholder="Title"
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
                            value={imageUrl || ""} // Ensure value is always a string
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="text-sm-medium neutral-1000">Description</label>
                          <textarea
                            value={description || ""} // Ensure value is always a string
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-control"
                            rows={6}
                            placeholder="Description..."
                          />
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <button
                          onClick={editingBlog ? handleUpdateBlog : handleAddBlog}
                          className="btn btn-book"
                        >
                          {editingBlog ? "Update Blog" : "Add Blog"}
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
          <BlogGrid
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            blogs={blogs}
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

export default BlogAdmin
