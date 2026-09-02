"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Heart,
  Bell,
  Menu,
  Home,
  User,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const API_BASE_URL = API_URL.replace(/\/api$/, "");

type NotificationItem = {
  read?: boolean;
  read_at?: string | null;
  is_read?: boolean;
};

const getStorageUrl = (path?: string | null) => {
  if (!path || path === "null" || path === "undefined") {
    return null;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  const cleanPath = path
    .replace(/^\/+/, "")
    .replace(/^storage\/+/, "");

  return `${API_BASE_URL}/storage/${cleanPath}`;
};

export default function DashNav() {
  const pathname = usePathname();
  const { token: authContextToken } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function fetchNavData() {
      const token =
        authContextToken ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("token");

      if (!token) return;

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        const [meRes, notifRes] = await Promise.all([
          fetch(`${API_URL}/me`, { headers }),
          fetch(`${API_URL}/notifications`, { headers }),
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          const user = meData.user || meData;
          setAvatarUrl(user?.avatar_url || user?.avatar || null);
        }

        if (notifRes.ok) {
          const notifData = await notifRes.json();
          const rawNotifs = Array.isArray(notifData)
            ? notifData
            : notifData.notifications || notifData.data || [];

          const hasUnread = rawNotifs.some(
            (n: NotificationItem) => n.read === false || n.read_at === null || !n.is_read
          );

          const shouldShowUnreadBadge =
            pathname !== "/notifications" && (hasUnread || rawNotifs.length > 0);

          setHasUnreadNotifs(shouldShowUnreadBadge);
        }
      } catch (err) {
        console.error("Error fetching nav data:", err);
      }
    }

    fetchNavData();
  }, [authContextToken, pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const isActive = (path: string) => (pathname === path ? "active-link" : "");

  const userAvatarImage = getStorageUrl(avatarUrl);

  return (
    <div className="dashboard-container">
      <header
        ref={navRef}
        className={scrolled ? "dash-navbar scrolled" : "dash-navbar"}
      >
        <Link href="/" className="dash-logo" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Cats Library"
            width={42}
            height={42}
          />
          <span>Cats Gallery</span>
        </Link>

        <nav className={`dash-nav-links ${menuOpen ? "active" : ""}`}>
          <Link href="/" className={isActive("/")}>
            <Home size={25} />
          </Link>

          <Link href="/dashboard" className={isActive("/dashboard")}>
            <LayoutDashboard size={25} />
          </Link>

          <Link href="/my-posts" className={isActive("/my-posts")}>
            <Images size={25} />
          </Link>

          <Link href="/favorite" className={isActive("/favorite")}>
            <Heart size={25} />
          </Link>

          <Link
            href="/notifications"
            className={`nav-icon-badge ${isActive("/notifications")}`}
            onClick={() => setHasUnreadNotifs(false)}
          >
            <Bell size={25} />
            {hasUnreadNotifs && <span className="dot"></span>}
          </Link>

          <Link
            href="/profile"
            className={`profile-nav-item ${isActive("/profile")}`}
          >
            <div className="nav-avatar-wrapper overflow-hidden rounded-full w-8 h-8 flex items-center justify-center border border-pink-200">
              {userAvatarImage && !avatarError ? (
                <Image
                  src={userAvatarImage}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="nav-avatar object-cover w-full h-full"
                  unoptimized
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <User size={18} className="text-pink-700" />
              )}
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