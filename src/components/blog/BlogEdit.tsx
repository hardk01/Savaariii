// "use client"
// import Image from "next/image";
// import React, { useState, useEffect } from "react";

// interface Blog {
//   title: string;
//   image: string;
//   date: string;
//   description: string;
// }

// const Home: React.FC = () => {
//   const [title, setTitle] = useState("");
//   const [image, setImage] = useState("");
//   const [description, setDescription] = useState("");
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);

//     // Load stored blogs from localStorage on component mount
//     const storedBlogs = localStorage.getItem("blogs");
//     if (storedBlogs) {
//       setBlogs(JSON.parse(storedBlogs));
//     }
//   }, []);

  

//   const handleAddBlog = () => {
//     if (!title || !image || !description) {
//       alert("Please fill in all fields");
//       return;
//     }

//     const newBlog: Blog = {
//       title,
//       image,
//       date: new Date().toLocaleDateString(),
//       description,
//     };

//     const updatedBlogs = [...blogs, newBlog];
//     setBlogs(updatedBlogs);
//     localStorage.setItem("blogs", JSON.stringify(updatedBlogs));

//     // Reset form fields
//     setTitle("");
//     setImage("");
//     setDescription("");
//   };

//   if (!isClient) {
//     return <div className="min-h-screen bg-gray-100 py-10">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 py-10">
//       <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
//         <h1 className="text-2xl font-bold text-center mb-6">Add Blog</h1>

//         {/* Blog Form */}
//         <div className="space-y-4">
//           <div>
//             <label className="block font-medium text-gray-700">Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//               placeholder="Enter blog title"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Image URL</label>
//             <input
//               type="text"
//               value={image}
//               onChange={(e) => setImage(e.target.value)}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//               placeholder="Enter image URL"
//             />
//           </div>

//           <div>
//             <label className="block font-medium text-gray-700">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full mt-1 p-2 border border-gray-300 rounded-md"
//               rows={4}
//               placeholder="Enter blog description"
//             />
//           </div>

//           <button
//             onClick={handleAddBlog}
//             className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
//           >
//             Add Blog
//           </button>
//         </div>
//       </div>

//       {/* Blog List */}
//       <div className="max-w-3xl mx-auto mt-10">
//         <h2 className="text-xl font-semibold mb-4">Blog List</h2>
//         {blogs.length === 0 ? (
//           <p className="text-gray-500">No blogs added yet.</p>
//         ) : (
//           blogs.map((blog, index) => (
//             <div
//               key={index}
//               className="bg-white shadow-md rounded-lg p-4 mb-4"
//             >
//               <h3 className="text-lg font-bold">{blog.title}</h3>
//               <Image
//                 width="0"
//                 height="0"
//                 src={blog.image}
//                 alt={blog.title}
//                 className="w-full h-40 object-cover rounded-md mt-2"
//               />
//               <p className="text-gray-500 text-sm mt-1">{blog.date}</p>
//               <p className="mt-2">{blog.description}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;
"use client"
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface Blog {
  title: string;
  image: string;
  date: string;
  description: string;
}

const BlogEdit = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedBlogs = localStorage.getItem("blogs");
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    }
  }, []);

  const handleAddBlog = () => {
    if (!title || !image || !description) {
      alert("Please fill in all fields");
      return;
    }

    const newBlog: Blog = {
      title,
      image,
      date: new Date().toLocaleDateString(),
      description,
    };

    const updatedBlogs = [...blogs, newBlog];
    setBlogs(updatedBlogs);
    localStorage.setItem("blogs", JSON.stringify(updatedBlogs));

    setTitle("");
    setImage("");
    setDescription("");
  };

  if (!isClient) {
    return <div className="min-h-screen bg-gray-100 py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Add Blog</h1>

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
            <label className="block font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="Enter image URL"
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
            onClick={handleAddBlog}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add Blog
          </button>
        </div>
      </div>

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
                width={0}
                height={0}
                sizes="100vw"
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
  );
};

export default BlogEdit;