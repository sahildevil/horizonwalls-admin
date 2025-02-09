"use client";
import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

// Updated API URL to match backend route
const API_URL = "http://localhost:8000/api/categories"; // Changed from category to categories

export default function Page() {
  const [category, setCategory] = useState({
    name: "",
    image: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageError, setImageError] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setCategories(data.category);
        setMessage({ type: "", text: "" });
      } else {
        throw new Error(data.error || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage({
        type: "error",
        text:
          error.message === "Failed to fetch"
            ? "Unable to connect to server. Please check if the server is running."
            : error.message,
      });
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Category added successfully!" });
        setCategory({ name: "", image: "" });
        setImageError(false);
        fetchCategories();
      } else {
        throw new Error(data.error || "Failed to add category");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text:
          error.message === "Failed to fetch"
            ? "Unable to connect to server. Please check if the server is running."
            : error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Category deleted successfully!" });
        fetchCategories();
      } else {
        throw new Error(data.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        type: "error",
        text:
          error.message === "Failed to fetch"
            ? "Unable to connect to server. Please check if the server is running."
            : error.message,
      });
    }
  };

  const handleImageError = () => {
    setImageError(true);
    console.error("Image failed to load:", category.image);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {message.type === "error" && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Add New Category
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={category.image}
                  className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 ${
                    imageError ? "border-red-500" : "border-gray-300"
                  }`}
                  onChange={(event) => {
                    setCategory((prev) => ({
                      ...prev,
                      image: event.target.value,
                    }));
                    setImageError(false);
                  }}
                  required
                />
                {imageError && (
                  <p className="text-red-500 text-sm">Failed to load image</p>
                )}
              </div>

              {category.image && !imageError && (
                <div className="w-full h-48 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-200">
                  <img
                    src={category.image}
                    alt="Category Preview"
                    className="w-full h-full object-contain"
                    onError={handleImageError}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={category.name}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                  onChange={(event) =>
                    setCategory((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  required
                />
              </div>

              {message.type === "success" && (
                <div className="p-3 rounded-lg bg-green-100 text-green-700">
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || imageError}
                className={`w-full ${
                  loading || imageError ? "bg-blue-400" : "bg-blue-600"
                } text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition ${
                  loading || imageError ? "cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating..." : "Create Category"}
              </button>
            </form>
          </div>

          {/* Categories List Section */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Existing Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="border rounded-lg p-4 relative group"
                >
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="h-32 mb-2">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/150/150";
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {cat.name}
                  </h3>
                </div>
              ))}
            </div>
            {categories.length === 0 && (
              <p className="text-gray-500 text-center">No categories yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import React, { useState, useEffect } from "react";
// import { Trash2 } from "lucide-react";

// export default function Page() {
//   const [category, setCategory] = useState({
//     name: "",
//     image: "",
//   });
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [imageError, setImageError] = useState(false);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch("http://localhost:8000/api/category");
//       const data = await response.json();
//       if (data.success) {
//         setCategories(data.category);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       const response = await fetch("http://localhost:8000/api/category", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(category),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setMessage({ type: "success", text: "Category added successfully!" });
//         setCategory({ name: "", image: "" });
//         setImageError(false);
//         fetchCategories();
//       } else {
//         setMessage({
//           type: "error",
//           text: data.error || "Failed to add category",
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setMessage({
//         type: "error",
//         text: "Error connecting to server. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this category?")) {
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/category/${id}`, {
//         method: "DELETE",
//       });

//       const data = await response.json();

//       if (data.success) {
//         setMessage({ type: "success", text: "Category deleted successfully!" });
//         fetchCategories();
//       } else {
//         setMessage({
//           type: "error",
//           text: data.error || "Failed to delete category",
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setMessage({
//         type: "error",
//         text: "Error deleting category. Please try again.",
//       });
//     }
//   };

//   const handleImageError = () => {
//     setImageError(true);
//     console.error("Image failed to load:", category.image);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Form Section */}
//           <div className="bg-white shadow-lg rounded-2xl p-6">
//             <h1 className="text-2xl font-bold text-gray-800 mb-4">
//               Add New Category
//             </h1>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Image URL
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter image URL"
//                   value={category.image}
//                   className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 ${
//                     imageError ? "border-red-500" : "border-gray-300"
//                   }`}
//                   onChange={(event) => {
//                     setCategory((prev) => ({
//                       ...prev,
//                       image: event.target.value,
//                     }));
//                     setImageError(false);
//                   }}
//                   required
//                 />
//                 {imageError && (
//                   <p className="text-red-500 text-sm">Failed to load image</p>
//                 )}
//               </div>

//               {category.image && !imageError && (
//                 <div className="w-full h-48 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-200">
//                   <img
//                     src={category.image}
//                     alt="Category Preview"
//                     className="w-full h-full object-contain"
//                     onError={handleImageError}
//                   />
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Category Name
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter category name"
//                   value={category.name}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
//                   onChange={(event) =>
//                     setCategory((prev) => ({
//                       ...prev,
//                       name: event.target.value,
//                     }))
//                   }
//                   required
//                 />
//               </div>

//               {message.text && (
//                 <div
//                   className={`p-3 rounded-lg ${
//                     message.type === "success"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-red-100 text-red-700"
//                   }`}
//                 >
//                   {message.text}
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading || imageError}
//                 className={`w-full ${
//                   loading || imageError ? "bg-blue-400" : "bg-blue-600"
//                 } text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition ${
//                   loading || imageError ? "cursor-not-allowed" : ""
//                 }`}
//               >
//                 {loading ? "Creating..." : "Create Category"}
//               </button>
//             </form>
//           </div>

//           {/* Categories List Section */}
//           <div className="bg-white shadow-lg rounded-2xl p-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">
//               Existing Categories
//             </h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {categories.map((cat) => (
//                 <div
//                   key={cat._id}
//                   className="border rounded-lg p-4 relative group"
//                 >
//                   <button
//                     onClick={() => handleDelete(cat._id)}
//                     className="absolute top-2 right-2 p-1 rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                   <div className="h-32 mb-2">
//                     <img
//                       src={cat.image}
//                       alt={cat.name}
//                       className="w-full h-full object-contain"
//                       onError={(e) => {
//                         e.target.src = "/api/placeholder/150/150";
//                       }}
//                     />
//                   </div>
//                   <h3 className="text-lg font-medium text-gray-800">
//                     {cat.name}
//                   </h3>
//                 </div>
//               ))}
//             </div>
//             {categories.length === 0 && (
//               <p className="text-gray-500 text-center">No categories yet</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
