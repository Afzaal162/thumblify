import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <motion.nav
        className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <Link to='/'>
          <img src="/logo.svg" alt="logo" className="h-8.5 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8 transition duration-500">
          <Link to='/' className="hover:text-pink-300 transition">Home</Link>
          <Link to='/generate' className="hover:text-pink-300 transition">Generate</Link>
          {isLoggedIn ? (
            <Link to='/my-generation' className="hover:text-pink-300 transition">My Generation</Link>
          ) : (
            <Link to='#' className="hover:text-pink-300 transition">About</Link>
          )}
          <Link to='contact' className="hover:text-pink-300 transition">Contact us</Link>
        </div>

        <div className="flex items-center gap-2 relative">
          {isLoggedIn ? (
            <div className="relative group">
              {/* Profile Icon */}
              <button className="rounded-full w-10 h-10 bg-white/20 border-2 border-white/10 text-white flex items-center justify-center">
                {user?.name.charAt(0).toUpperCase()}
              </button>

              {/* Logout button: hidden until hover */}
              <div className="absolute right-0 mt-2 w-max opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => logout()}
                  className="bg-white/20 border border-white/10 px-4 py-2 rounded text-white hover:bg-pink-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="hidden md:block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 rounded-full transition"
            >
              Get Started
            </button>
          )}
          <button onClick={() => setIsOpen(true)} className="md:hidden">
          <MenuIcon size={26} className="active:scale-90 transition" />
        </button>
        </div>

        
      </motion.nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Link onClick={() => setIsOpen(false)} to='/'>Home</Link>
        <Link onClick={() => setIsOpen(false)} to='/generate'>Generate</Link>
        {isLoggedIn ?
          <Link onClick={() => setIsOpen(false)} to='/my-generation'>My Generation</Link> :
          <Link onClick={() => setIsOpen(false)} to='#'>About</Link>
        }
        <Link onClick={() => setIsOpen(false)} to='#'>Contact us</Link>
        {isLoggedIn ?
          <button onClick={() => { setIsOpen(false); logout() }}>Logout</button> :
          <Link onClick={() => setIsOpen(false)} to='/login'>Login</Link>
        }

        <button onClick={() => setIsOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex">
          <XIcon />
        </button>
      </div>
    </>
  );
}