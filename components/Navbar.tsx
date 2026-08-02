"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const hideNavbarPaths = ["/login", "/sign"];
  const shouldHideNavbar = hideNavbarPaths.includes(pathname);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (shouldHideNavbar) return null;
  return (
    <header className={scrolled ? "navbar scrolled" : "navbar"}>
      <Link href="/" className="logo">
        <Image
          src="/images/logo.png"
          alt="Cats Library"
          width={42}
          height={42}
        />
        <span>Cats Gallery</span>
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
