"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? "navbar scrolled" : "navbar"}>
      <Link href="/" className="logo">
        <Image
          src="/images/logo.png"
          alt="Cats Library"
          width={42}
          height={42}
        />
        <span>Cats App</span>
      </Link>

      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link href="/">Home</Link>
        <Link href="/favorite">Favorite</Link>
        <Link href="/profile">Profile</Link>

        <Link href="/create" className="create-btn">
          Create
        </Link>
      </nav>

      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu size={24} />
      </button>
    </header>
  );
}
