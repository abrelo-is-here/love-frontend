import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react"; // Importing icons for visual appeal

const AdminNavbar = () => {
  const navigate = useNavigate();
  // Check localStorage and ensure user is an object
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminLoggedIn = user && user.username; // Check if user object exists and has a name

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin-login");
  };

  // Function to handle login navigation for the button when not logged in
  const handleLogin = () => {
    navigate("/admin-login");
  };

  return (
    // Updated background to a rich indigo and increased shadow
    <nav className="w-full bg-pink-700 text-white px-6 py-4 shadow-xl sticky top-0 z-10">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        
        {/* Title/Logo Area */}
        {/* Added a brand color highlight to the title */}
        <div className="flex items-center space-x-2">
            
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider">
                <span className="text-indigo-300">Cupid’s </span> Cal
            </h1>
        </div>

        {/* Admin Info & Actions */}
        <div className="flex items-center gap-4">
          {isAdminLoggedIn ? (
            // Logged-in state
            <>
            <Link to="/admin" className="flex items-center gap-2"
                >Admin Dashboard </Link>
            <Link to="/" className="flex items-center gap-2"
                >Home </Link>
              {/* Admin name/label with icon for better visual cue */}
              <div className="hidden sm:flex items-center space-x-2 bg-indigo-600 rounded-full px-4 py-1.5 border border-indigo-500">
                
                <User size={18} className="text-indigo-300" />
                <span className="text-sm font-semibold">
                  Admin: {user.username}
                </span>
              </div>

              {/* Logout Button: Primary/accent style, cleaner icon */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition duration-200 shadow-md transform hover:scale-[1.02]"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            // Not logged-in state (can be simplified)
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-medium opacity-85">
                Login As Admin
              </h3>
              <button
                onClick={handleLogin}
                className="bg-white text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition duration-200 shadow-md"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;