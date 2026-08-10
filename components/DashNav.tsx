"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Images,
  Heart,
  Bell, 
  Menu,
  Home,
} from "lucide-react";

export default function DashNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // إغلاق قائمة الجوال عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="dashboard-container">
      {/* النافبار العلوي */}
      <header 
        ref={navRef} 
        className={scrolled ? "dash-navbar scrolled" : "dash-navbar"}>
        <Link href="/" className="dash-logo" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Cats Library"
            width={42}
            height={42}
          />
          <span>Cats Gallery</span>
        </Link>

        {/* أقسام الملاحة */}
        <nav className={`dash-nav-links ${menuOpen ? "active" : ""}`}>

          <Link href="/">
            <Home size={25} />
          </Link>

          <Link href="/dashboard" className="active-link">
            <LayoutDashboard size={25} />
          </Link>

          <Link href="/my-posts">
            <Images size={25} />
          </Link>

          <Link href="/favorite">
            <Heart size={25} />
          </Link>

          <Link href="/notifications" className="nav-icon-badge">
            <Bell size={25} />
            <span className="dot"></span>
          </Link>

          <Link href="/profile" className="profile-nav-item">
            <div className="nav-avatar-wrapper">
              <Image
                src="/images/profile.png"
                alt="Profile"
                width={28}
                height={28}
                className="nav-avatar"
              />
            </div>
          </Link>
        </nav>

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={28} />
        </button>
      </header>
    </div>
  );
}