"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Images,
  Heart,
  Bell,
  MessageCircle,
  User,
  Wand2,
  ShieldAlert,
  Home,
  Loader2,
} from "lucide-react";

import "../styles/dashboard.css";
import "../styles/dash-nav.css";
import DashNav from "../../components/DashNav";
import { useAuth } from "../context/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const API_BASE_URL = API_URL.replace(/\/api$/, "");

type UserData = {
  full_name?: string;
  username?: string;
  avatar_url?: string | null;
  avatar?: string | null;
  phone?: string;
  city?: {
    name?: string;
  } | null;
};

type DashboardItem = {
  id?: string | number;
  name?: string;
  image_url?: string;
  image?: string;
  post_type?: string;
  images?: Array<{
    image_url?: string;
    url?: string;
    path?: string;
  }>;
};

type DashboardNotification = {
  id?: string | number;
  type?: string;
  message?: string;
  text?: string;
  sender?: {
    username?: string;
    full_name?: string;
  };
  user?: {
    username?: string;
    full_name?: string;
  };
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


function UserAvatar({
  avatarUrl,
  username,
}: {
  avatarUrl?: string | null;
  username?: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const imageUrl = getStorageUrl(avatarUrl);
  const hasFailed = failedUrl === imageUrl;

  if (!imageUrl || hasFailed) {
    return <User size={38} className="text-pink-700/80" />;
  }

  return (
    <Image
      key={imageUrl}
      src={imageUrl}
      alt={username || "Profile"}
      width={70}
      height={70}
      className="object-cover w-full h-full"
      unoptimized
      onError={() => {
        console.error("Failed to load avatar:", imageUrl);
        setFailedUrl(imageUrl);
      }}
    />
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { token: authContextToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [myPosts, setMyPosts] = useState<DashboardItem[]>([]);
  const [favorites, setFavorites] = useState<DashboardItem[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>(
    []
  );

  useEffect(() => {
    async function fetchDashboardData() {
      const token =
        authContextToken ||
        localStorage.getItem("auth_token") ||
        localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        const [meRes, postsRes, favRes, notifRes] = await Promise.all([
          fetch(`${API_URL}/me`, { headers }),
          fetch(`${API_URL}/my-posts`, { headers }),
          fetch(`${API_URL}/favorites`, { headers }),
          fetch(`${API_URL}/notifications`, { headers }),
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          setUserData(meData.user || meData);
        }

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          const rawPosts = Array.isArray(postsData)
            ? postsData
            : postsData.data || postsData.posts || [];

          setMyPosts(rawPosts.slice(0, 4));
        }

        if (favRes.ok) {
          const favData = await favRes.json();
          const rawFavs = Array.isArray(favData)
            ? favData
            : favData.data || favData.posts || [];

          setFavorites(rawFavs.slice(0, 3));
        }

        if (notifRes.ok) {
          const notifData = await notifRes.json();
          const rawNotifs = Array.isArray(notifData)
            ? notifData
            : notifData.notifications || notifData.data || [];

          setNotifications(rawNotifs.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [authContextToken, router]);

  const titleHoverStyle =
    "flex items-center gap-2 cursor-pointer inline-flex transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:opacity-90";


  const getImageUrl = (item: DashboardItem | null | undefined) => {
    const fallback = "/images/Cats/pic1.png";

    if (!item) return fallback;

    if (item.image_url) {
      return getStorageUrl(item.image_url) || fallback;
    }

    if (item.image) {
      return getStorageUrl(item.image) || fallback;
    }

    if (item.images && item.images.length > 0) {
      const imgPath =
        item.images[0].image_url ||
        item.images[0].url ||
        item.images[0].path;

      if (imgPath) {
        return getStorageUrl(imgPath) || fallback;
      }
    }

    return fallback;
  };

  const getPostLink = (id?: string | number, postType?: string) => {
    const safeId = id ?? "";

    if (postType && postType.toLowerCase().includes("rescue")) {
      return `/rescue/${safeId}`;
    }

    return `/details/${safeId}`;
  };

  const getNotifIcon = (type?: string, message?: string) => {
    const rawType = String(type || "").toLowerCase();
    const text = String(message || "").toLowerCase();

    if (rawType.includes("like") || text.includes("like")) {
      return (
        <Heart
          size={16}
          className="notif-icon heart text-pink-600 shrink-0"
        />
      );
    }

    if (rawType.includes("comment") || text.includes("comment")) {
      return (
        <MessageCircle
          size={16}
          className="notif-icon comment text-sky-500 shrink-0"
        />
      );
    }

    if (rawType.includes("adopt") || text.includes("adopt")) {
      return (
        <Home
          size={16}
          className="notif-icon text-emerald-600 shrink-0"
        />
      );
    }

    if (rawType.includes("rescue") || text.includes("rescue")) {
      return (
        <ShieldAlert
          size={16}
          className="notif-icon text-amber-500 shrink-0"
        />
      );
    }

    return (
      <Bell
        size={16}
        className="notif-icon bell text-gray-600 shrink-0"
      />
    );
  };

  if (loading) {
    return (
      <div className="dashboard-container min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-600" size={36} />
      </div>
    );
  }


  return (
    <div className="dashboard-container">
      <DashNav />

      <main className="dashboard-main-content">
        <div className="dashboard-grid">
          <div className="card welcome-card">
            <h2 className="flex items-center gap-2 transition-transform duration-300 hover:scale-102 origin-right">
              <Wand2
                className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                size={26}
              />
              Welcome back,{" "}
              {userData?.full_name?.split(" ")[0] ||
                userData?.username ||
                "Guest"}
              !
            </h2>
            <p className="text-sm text-pink-900/60 mt-1">
              Overview of your dashboard activity.
            </p>
          </div>

          <div className="card profile-snapshot-card">
            <h3>
              <Link href="/profile" className={titleHoverStyle}>
                <User
                  className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                  size={24}
                />
                <span>Profile Snapshot</span>
              </Link>
            </h3>

            <div className="profile-info">
              <div className="avatar-large overflow-hidden rounded-full border-2 border-pink-200 flex items-center justify-center bg-pink-100/60 text-pink-800">
                <UserAvatar
                  avatarUrl={userData?.avatar_url || userData?.avatar}
                  username={userData?.username}
                />
              </div>

              <h4 className="mt-2">{userData?.username || "Username"}</h4>
              <p className="sub-label">Username</p>

              <p className="info-detail mt-2">{userData?.phone || "N/A"}</p>
              <p className="sub-label">Phone</p>

              <p className="info-detail mt-2">
                {userData?.city?.name || "N/A"}
              </p>
              <p className="sub-label">City</p>
            </div>
          </div>

          <div className="card my-posts-card">
            <h3>
              <Link href="/my-posts" className={titleHoverStyle}>
                <Images
                  className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                  size={24}
                />
                <span>My Posts</span>
              </Link>
            </h3>

            {myPosts.length > 0 ? (
              <div className="posts-mini-grid">
                {myPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={getPostLink(post.id, post.post_type)}
                    className="post-thumb block relative rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src={getImageUrl(post)}
                      alt={post.name || "My Post"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 mt-4 text-center">
                No posts submitted yet.
              </div>
            )}
          </div>

          <div className="card favorite-posts-card">
            <h3>
              <Link href="/favorite" className={titleHoverStyle}>
                <Heart
                  className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                  size={24}
                />
                <span>Favorite Posts</span>
              </Link>
            </h3>

            {favorites.length > 0 ? (
              <div className="posts-mini-grid">
                {favorites.map((post) => (
                  <Link
                    key={post.id}
                    href={getPostLink(post.id, post.post_type)}
                    className="post-thumb block relative rounded-xl overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src={getImageUrl(post)}
                      alt={post.name || "Favorite Post"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 mt-4 text-center">
                No favorite posts yet.
              </div>
            )}
          </div>

          <div className="card notifications-card">
            <h3>
              <Link href="/notifications" className={titleHoverStyle}>
                <Bell
                  className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                  size={24}
                />
                <span>Recent Notifications</span>
              </Link>
            </h3>

            {notifications.length > 0 ? (
              <ul className="notifications-list mt-3 space-y-1.5">
                {notifications.map((notif) => {
                  const senderName =
                    notif.sender?.username ||
                    notif.sender?.full_name ||
                    notif.user?.username ||
                    "Someone";

                  const rawMessage = notif.message || notif.text || "";

                  let cleanMsg = rawMessage;

                  if (
                    cleanMsg.toLowerCase().startsWith(senderName.toLowerCase())
                  ) {
                    cleanMsg = cleanMsg.slice(senderName.length).trim();
                  }

                  return (
                    <li
                      key={notif.id}
                      className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 bg-white/60 p-2.5 rounded-xl border border-pink-100/80 shadow-2xs"
                    >
                      {getNotifIcon(notif.type, rawMessage)}

                      <span className="truncate">
                        <span className="font-semibold text-pink-950 mr-1">
                          {senderName}
                        </span>
                        {cleanMsg}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-sm text-gray-500 mt-4 text-center">
                No new notifications.
              </div>
            )}
          </div>
        </div>
      </main> 
    </div>
  );
}