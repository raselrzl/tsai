"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddNoteDialog from "../component/AddNote";
import Aichatbutton from "../component/AIchatButton";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when path changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Helper to style active link
  const linkClass = (path: string) =>
    `text-gray-700 hover:text-black font-medium py-1 text-lg ${
      pathname === path ? "border-b-4 border-red-800" : ""
    }`;

  const [showAddNoteDialog, setshowAddNoteDialog] = useState(false);

  return (
    <>
      <nav className="bg-[#f6f6f6] shadow-md sticky top-0 z-50 py-1 md:py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                {/* <Image src="/logocar1111.png" alt="Logo" width={140} height={40} /> */}{" "}
                <p className="text-lg font-bold">Flygg-Chatt</p>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              <UserButton
                afterSwitchSessionUrl="/"
                appearance={{
                  elements: {
                    avatarBox: { width: "2.5rem", height: "2.5rem" },
                  },
                }}
              />
              <Button
                className="flex items-center justify-center mx-auto bg-black p-2 rounded text-white"
                onClick={() => setshowAddNoteDialog(true)}
              >
                <Plus size={24} strokeWidth={2} className="text-white" />
                Add Notes
              </Button>
              <Aichatbutton />
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-red-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-[#f6f6f6] shadow-md z-40 flex flex-col items-center text-center space-y-2 py-6">
            <Link href="/sign-in" className={linkClass("/login")}>
              Login
            </Link>

            <Button
              className="flex items-center justify-center mx-auto bg-black p-2 rounded text-white"
              onClick={() => setshowAddNoteDialog(true)}
            >
              <Plus size={24} strokeWidth={2} className="text-white" />
              Add Notes
            </Button>
          </div>
        )}
      </nav>
      {/* Add Note Dialog component */}
      <AddNoteDialog open={showAddNoteDialog} setOpen={setshowAddNoteDialog} />
    </>
  );
}
