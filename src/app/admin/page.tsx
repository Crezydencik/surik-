"use client";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 rounded-xl text-white shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>
            <p className="text-sm text-white/80 mt-1">
              Manage your board game club with powerful tools and insights
            </p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-medium shadow">
            + Create New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0e0e1a] p-4 rounded-lg shadow border border-gray-800">
          <p className="text-sm text-gray-400">Total Games</p>
          <h2 className="text-2xl font-bold text-white mt-1">5</h2>
          <p className="text-xs text-green-500 mt-1">+2 this week</p>
        </div>
        <div className="bg-[#0e0e1a] p-4 rounded-lg shadow border border-gray-800">
          <p className="text-sm text-gray-400">Active Users</p>
          <h2 className="text-2xl font-bold text-white mt-1">1</h2>
          <p className="text-xs text-green-500 mt-1">+5 this month</p>
        </div>
        <div className="bg-[#0e0e1a] p-4 rounded-lg shadow border border-gray-800">
          <p className="text-sm text-gray-400">Content Sections</p>
          <h2 className="text-2xl font-bold text-white mt-1">0</h2>
          <p className="text-xs text-gray-400 mt-1">All active</p>
        </div>
        <div className="bg-[#0e0e1a] p-4 rounded-lg shadow border border-gray-800">
          <p className="text-sm text-gray-400">Translations</p>
          <h2 className="text-2xl font-bold text-white mt-1">66</h2>
          <p className="text-xs text-orange-500 mt-1">2 languages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0e0e1a] p-4 rounded-lg shadow border border-gray-800">
          <h3 className="text-lg font-semibold mb-3">🧩 Recent Activity</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✔️ New game added — 2 hours ago</li>
            <li>👤 User profile updated — 5 hours ago</li>
            <li>📝 Content section modified — 1 day ago</li>
          </ul>
        </div>
        <div className="bg-[#0e0e1a] p-4 rounded-lg shadow border border-gray-800">
          <h3 className="text-lg font-semibold mb-3">⚡ Quick Actions</h3>
          <ul className="space-y-2">
            <li>
              <button className="w-full text-left bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded">
                Add New Game
              </button>
            </li>
            <li>
              <button className="w-full text-left bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded">
                Edit Content
              </button>
            </li>
            <li>
              <button className="w-full text-left bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded">
                Manage Users
              </button>
            </li>
            <li>
              <button className="w-full text-left bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded">
                Update Translations
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
