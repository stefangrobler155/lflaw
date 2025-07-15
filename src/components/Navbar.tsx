"use client";
import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
// import MiniCart from "@/components/MiniCart";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    {
      name: 'Contracts',
      href: '/contracts',
      subItems: [
        { name: 'Family Law', href: '/contracts/category/family-law' },
        { name: 'Corporate Law', href: '/contracts/category/corporate-law' },
        { name: 'Real Estate Law', href: '/contracts/category/real-estate-law' },
      ],
    },
    { name: 'Contact', href: '/contact' },
  ];


  return (
    <header className="sticky top-0 z-50 black__bg shadow-md transition-all duration-300 ease-in-out">

    
    <nav className="shadow-md">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold light__text">
              Logo
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) =>
              item.subItems ? (
                // Handle items with submenu — i.e. "Contracts"
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="light__text px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    {item.name}
                    <FaChevronDown className="text-xs mt-0.5 group-hover:rotate-180 transition-transform duration-300" />
                  </Link>

                  {/* Dropdown menu */}
                  <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg opacity-0 group-hover:opacity-200 transition-opacity duration-200 z-50">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-200"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                // Handle normal items
                <Link
                  key={item.name}
                  href={item.href}
                  className="light__text px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              )
            )}

            {/* <MiniCart /> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="light__text light__text:hover light__text:active focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Off-Canvas Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-64 black__bg shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="light__text light__text:hover focus:outline-none"
            aria-label="Close menu"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="flex flex-col space-y-4 p-4">
            {navItems.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={toggleMenu}
                    className="light__text text-lg font-medium flex items-center gap-1"
                  >
                    {item.name}
                  </Link>

                  {item.subItems && (
                    <button
                      onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                      aria-label="Toggle submenu"
                      className="text-white ml-2"
                    >
                      <FaChevronDown
                        className={`transition-transform duration-300 ${
                          mobileSubmenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {item.subItems && mobileSubmenuOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={toggleMenu}
                        className="block text-sm text-gray-400 hover:text-white"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          {/* <MiniCart /> */}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </nav>
    </header>
  );
};

export default Navbar;