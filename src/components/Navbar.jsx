"use client";

import { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Headphones,
  AudioLines,
  Mic,
  ListMusic,
  Captions,
  Menu,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (route) => pathname === route;

  const navItems = [
    { href: ROUTES.AUDIO_FORM, title: "Audio Form", icon: Mic },
    { href: ROUTES.MY_AUDIOS, title: "My Audios", icon: ListMusic },
    {
      href: ROUTES.AUDIO_TRANSCRIPTION,
      title: "Audio Transcription",
      icon: Captions,
    },
    { href: ROUTES.TRANSLATOR, title: "Translator", icon: AudioLines },
  ];

  const NavLink = ({ href, title, icon: Icon }) => (
    <Link
      href={href}
      title={title}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive(href)
          ? "bg-blue-500 text-white"
          : "hover:bg-blue-500 hover:text-white"
      }`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Icon className="h-6 w-6 mr-2 sm:mr-0 sm:mb-1" />
      <span className="sm:hidden">{title}</span>
    </Link>
  );

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href={ROUTES.HOME} className="flex items-center">
              <Headphones className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">Speak Easy</span>
            </Link>
          </div>
          <div className="hidden sm:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <SignedOut>
              <SignInButton>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors duration-200">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
            </SignedIn>
            <button
              className="ml-4 sm:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div
        className={`sm:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        } bg-blue-600`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </div>
    </nav>
  );
}
