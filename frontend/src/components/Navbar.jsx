import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
        Chirplt
      </Link>

      <div className="flex items-center gap-5 text-sm font-medium">
        {user ? (
          <>
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Create Post
            </Link>
            <Link
              to={`/profile/${user._id}`}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                {user.username[0].toUpperCase()}
              </div>
              <span>{user.username}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
