// "use client"
// import Image from 'next/image';
// import React, { useEffect, useState } from 'react'

// interface Blog {
//     title: string;
//     image: string;
//     date: string;
//     description: string;
// }

// const BlogDetails = () => {
//     const [blogs, setBlogs] = useState<Blog[]>([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
//     const [isClient, setIsClient] = useState(false);

//     useEffect(() => {
//         setIsClient(true);
//         const storedBlogs = localStorage.getItem("blogs");
//         if (storedBlogs) {
//             const parsedBlogs = JSON.parse(storedBlogs);
//             setBlogs(parsedBlogs);
//             setFilteredBlogs(parsedBlogs);
//         }
//     }, []);

//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const query = e.target.value.toLowerCase();
//         setSearchQuery(query);

//         // Filter blogs by title
//         const filtered = blogs.filter((blog) =>
//             blog.title.toLowerCase().includes(query)
//         );
//         setFilteredBlogs(filtered);
//     };

//     if (!isClient) {
//         return <div className="min-h-screen bg-gray-100 py-10">Loading...</div>;
//     }

//     return (
//         <div className='flex h-screen'>
//             <main className="flex-1 p-6 bg-gray-100">
//                 <div className="max-w-3xl mx-auto mt-10">
//                     <h1>Blog Search</h1>
//                     {/* Search Input Field */}
//                     <input
//                         type="text"
//                         placeholder="Search blog titles..."
//                         value={searchQuery}
//                         onChange={handleSearch}
//                         style={{
//                             padding: "10px",
//                             marginBottom: "20px",
//                             width: "100%",
//                             borderRadius: "5px",
//                             border: "1px solid #ccc",
//                         }}
//                     />
//                     <h2 className="text-xl font-semibold mb-4">Blog List</h2>
//                     {filteredBlogs.length === 0 ? (
//                         <p className="text-gray-500">No blogs added yet.</p>
//                     ) : (
//                         filteredBlogs.map((blog, index) => (
//                             <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
//                                 <h3 className="text-lg font-bold">{blog.title}</h3>
//                                 <Image
//                                     src={blog.image}
//                                     alt={blog.title}
//                                     width={0}
//                                     height={0}
//                                     className="w-full h-40 object-cover rounded-md mt-2"
//                                 />
//                                 <p className="text-gray-500 text-sm mt-1">{blog.date}</p>
//                                 <p className="mt-2">{blog.description}</p>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </main>
//         </div>
//     )
// }

// export default BlogDetails
"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface Blog {
    title: string;
    image: string;
    date: string;
    description: string;
}

const BlogDetails = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const storedBlogs = localStorage.getItem("blogs");
        if (storedBlogs) {
            const parsedBlogs = JSON.parse(storedBlogs);
            setBlogs(parsedBlogs);
            setFilteredBlogs(parsedBlogs);
        }
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = blogs.filter((blog) =>
            blog.title.toLowerCase().includes(query)
        );
        setFilteredBlogs(filtered);
    };

    if (!isClient) {
        return <div className="min-h-screen bg-gray-100 py-10">Loading...</div>;
    }

    return (
        <div className='flex h-screen'>
            <main className="flex-1 p-6 bg-gray-100">
                <div className="max-w-3xl mx-auto mt-10">
                    <h1>Blog Search</h1>
                    <input
                        type="text"
                        placeholder="Search blog titles..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                    />
                    <h2 className="text-xl font-semibold mb-4">Blog List</h2>
                    {filteredBlogs.length === 0 ? (
                        <p className="text-gray-500">No blogs added yet.</p>
                    ) : (
                        filteredBlogs.map((blog, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
                                <h3 className="text-lg font-bold">{blog.title}</h3>
                                <Image
                                    src={blog.image}
                                    alt={blog.title}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="w-full h-40 object-cover rounded-md mt-2"
                                />
                                <p className="text-gray-500 text-sm mt-1">{blog.date}</p>
                                <p className="mt-2">{blog.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default BlogDetails;