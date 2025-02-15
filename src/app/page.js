"use client";
import Image from "next/image";
import Link from "next/link";
import { Plus, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Home() {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            HorizonWalls Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Wallpapers Card */}
          <Link href="/add-wallpaper" className="block">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Manage Wallpapers
                </h2>
                <Plus className="text-blue-600" size={24} />
              </div>
              <p className="text-gray-600">
                Add, edit, or remove wallpapers from your collection
              </p>
            </div>
          </Link>

          {/* Add Categories Card */}
          <Link href="/add-category" className="block">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Manage Categories
                </h2>
                <Plus className="text-blue-600" size={24} />
              </div>
              <p className="text-gray-600">
                Create and manage wallpaper categories
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
