"use client";
import React, { useState, useEffect } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

// Add this constant at the top of your file
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZpbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbiI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg==";

export default function WallpaperPage() {
  const [wallpaper, setWallpaper] = useState({
    name: "",
    image: "",
    category: "", // This will now store category ID
  });
  const [wallpapers, setWallpapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageError, setImageError] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Search and filter states
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories for the dropdown
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch wallpapers with filters
  useEffect(() => {
    fetchWallpapers();
  }, [currentPage, selectedCategory, searchValue]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchWallpapers = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/wallpapers?page=${currentPage}&limit=20`; // Changed limit to 20
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      if (searchValue) {
        url += `&searchValue=${searchValue}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setWallpapers(data.wallpapers);
        // Update total pages calculation based on new limit of 20
        setTotalPages(Math.ceil(data.total / 20) || 1);
      }
    } catch (error) {
      console.error("Error fetching wallpapers:", error);
      setMessage({
        type: "error",
        text: "Failed to load wallpapers. Please try again.",
      });
    }
  };
  const [loadingPage, setLoadingPage] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wallpapers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(wallpaper),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Wallpaper added successfully!" });
        setWallpaper({ name: "", image: "", category: "" });
        setImageError(false);
        setShowForm(false);
        fetchWallpapers();
      } else {
        throw new Error(data.error || "Failed to add wallpaper");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Error adding wallpaper",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update the getCategoryName function
  const getCategoryName = (categoryId) => {
    // Add debug logging
    console.log("Looking for category:", categoryId);
    console.log("Available categories:", categories);

    const category = categories.find((cat) => cat._id === categoryId);
    if (!category) {
      console.log("Category not found for ID:", categoryId);
      return "Unknown";
    }
    return category.name;
  };

  // Add the delete handler function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this wallpaper?")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wallpapers/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Wallpaper deleted successfully!",
        });
        fetchWallpapers(); // Refresh the list
      } else {
        throw new Error(data.error || "Failed to delete wallpaper");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage({
        type: "error",
        text: error.message || "Error deleting wallpaper",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search wallpapers..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 w-full p-2 border rounded-lg"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-lg min-w-[200px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {" "}
                {/* Changed from cat.name to cat._id */}
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            Add New
          </button>
        </div>

        {/* Add Wallpaper Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Add New Wallpaper</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={wallpaper.name}
                  onChange={(e) =>
                    setWallpaper((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={wallpaper.image}
                  onChange={(e) => {
                    setWallpaper((prev) => ({
                      ...prev,
                      image: e.target.value,
                    }));
                    setImageError(false);
                  }}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              {wallpaper.image && (
                <div>
                  <div className="h-48 border rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={wallpaper.image}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        setImageError(true);
                        e.target.src = PLACEHOLDER_IMAGE;
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  {imageError && (
                    <p className="mt-2 text-yellow-600 text-sm">
                      ⚠️ Warning: Image preview failed to load. You can still
                      submit, but please verify the URL is correct.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={wallpaper.category}
                  onChange={(e) =>
                    setWallpaper((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {" "}
                      {/* Changed from cat.name to cat._id */}
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {message.text && (
                <div
                  className={`p-3 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 ${
                    loading ? "bg-blue-400" : "bg-blue-600"
                  } text-white py-2 rounded-lg hover:bg-blue-700 transition`}
                >
                  {loading ? "Adding..." : "Add Wallpaper"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Wallpapers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wallpapers.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow overflow-hidden relative group"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                  title="Delete wallpaper"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <span className="text-sm text-gray-500">
                  {item.category?.name ||
                    getCategoryName(item.category) ||
                    "Unknown"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="py-2 px-4 border rounded-lg bg-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
