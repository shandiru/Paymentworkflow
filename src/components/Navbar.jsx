import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Theme from './Theme';
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside (for desktop dropdown)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDesktopDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black backdrop-blur-md dark:bg-[#242427]/95 dark:backdrop-blur-md text-white font-semibold shadow-lg">
      {/* Optional: Shine/gradient overlay for dark mode */}
      <div className="hidden dark:block absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 to-black/80" />

      <div className="relative max-w-7xl mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <img src="/logo.png" alt="Logo" className="h-18 object-contain bg-white " />

        {/* Desktop Menu */}
        <div className="hidden sm:flex space-x-8">
          <a href="/" className='hover:text-blue-400'>HOME</a>
          <a href="/about" className="hover:text-blue-400">ABOUT</a>
          <a href="/gallery" className="hover:text-blue-400">GALLERY</a>
          <a href="/pricing" className="hover:text-blue-400">PRICING</a>
          <a href="/services" className="hover:text-blue-400">SERVICES</a>
        </div>

        {/* Theme toggle (desktop) */}
        <div className="block">
          <Theme />
        </div>

        {/* Hamburger Icon */}
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 border border-white rounded-full"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden mt-3 pt-3 px-4 pb-6 space-y-4 text-white bg-[#242427]/95 dark:bg-[#242427]/95">
          <a href="/" className="block border-b border-gray-400 pb-2 hover:text-blue-400">HOME</a>
          <a href="/about" className="block border-b border-gray-400 pb-2 hover:text-blue-400">ABOUT</a>
          <a href="/gallery" className="block border-b border-gray-400 pb-2 hover:text-blue-400">GALLERY</a>
          <a href="/pricing" className="block border-b border-gray-400 pb-2 hover:text-blue-400">PRICING</a>
          <a href="/pricing" className="block border-b border-gray-400 pb-2 hover:text-blue-400">SERVICES</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
