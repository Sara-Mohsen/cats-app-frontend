"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  ShieldAlert, 
  Home, 
  Check, 
  X, 
  User, 
  Mail, 
  Phone,
  Loader2 
} from "lucide-react";
import "../styles/dashboard.css";
import "../styles/dash-nav.css";
import DashNav from "../../components/DashNav";
import Pagination from "../../components/Pagination";
import { useAuth } from "../context/AuthContext";
import { getNotificationsApi, updateNotificationStatusApi } from "@/lib/api/posts";

interface NotificationItem {
  id: string;
  type: "like" | "comment" | "adoption" | "rescue" | "default";
  user: {
    name: string;
    email: string;
    phone: string;
  };
  text: string;
  postId: string;
  postType: string; 
  time: string;
  status?: "pending" | "accepted" | "rejected";
}

interface NotificationApiItem {
  id?: string | number;
  type?: string;
  message?: string;
  text?: string;
  created_at?: string;
  time?: string;
  status?: string;
  post_id?: string | number;
  postId?: string | number;
  post_type?: string;
  post?: {
    id?: string | number;
    post_type?: string;
  };
  sender?: {
    username?: string;
    full_name?: string;
    name?: string;
    email?: string;
    phone?: string;
    phone_number?: string;
  };
  user?: {
    username?: string;
    full_name?: string;
    name?: string;
    email?: string;
    phone?: string;
    phone_number?: string;
  };
  from_user?: {
    username?: string;
    full_name?: string;
    name?: string;
    email?: string;
    phone?: string;
    phone_number?: string;
  };
  user_name?: string;
  sender_name?: string;
  user_email?: string;
  user_phone?: string;
}

const ITEMS_PER_PAGE = 5;

export default function NotificationsPage() {
  const router = useRouter();
  const { token: authContextToken } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNotifications() {
      const token = authContextToken || localStorage.getItem("auth_token") || localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const data = await getNotificationsApi(token);
        const rawList = Array.isArray(data) ? data : data.notifications || data.data || [];

        const formattedNotifs: NotificationItem[] = rawList.map((item: NotificationApiItem) => {
          const sender = item.sender || item.user || item.from_user || {};
          
          let userName = sender.username || sender.full_name || sender.name || item.user_name || item.sender_name;
          if (!userName && (item.message || item.text)) {
            const msg = item.message || item.text || "";
            const firstWord = msg.split(" ")[0];
            if (firstWord && !["sent", "liked", "commented", "accepted", "declined"].includes(firstWord.toLowerCase())) {
              userName = firstWord;
            }
          }
          if (!userName) userName = "User";

          const userEmail = sender.email || item.user_email || "N/A";
          const userPhone = sender.phone || sender.phone_number || item.user_phone || "N/A";

          const rawType = String(item.type || "").toLowerCase();
          const messageText = String(item.message || item.text || "").toLowerCase();

          let detectedType: "like" | "comment" | "adoption" | "rescue" | "default" = "default";
          if (rawType.includes("like") || messageText.includes("like")) {
            detectedType = "like";
          } else if (rawType.includes("comment") || messageText.includes("comment")) {
            detectedType = "comment";
          } else if (rawType.includes("adoption") || rawType.includes("adopt") || messageText.includes("adopt")) {
            detectedType = "adoption";
          } else if (rawType.includes("rescue") || messageText.includes("rescue") || messageText.includes("help rescue")) {
            detectedType = "rescue";
          }

          const rawMessage = item.message || item.text || "";
          let cleanedText = rawMessage;

          if (userName && cleanedText.toLowerCase().startsWith(userName.toLowerCase())) {
            cleanedText = cleanedText.slice(userName.length).trim();
          }

          let formattedTime = item.created_at || item.time || "";
          if (formattedTime && !isNaN(Date.parse(formattedTime))) {
            formattedTime = new Date(formattedTime).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          }

          const postObj = item.post || {};
          const pType = postObj.post_type || item.post_type || (detectedType === "rescue" ? "rescue" : "adoption");

          const rawStatus = String(item.status || "pending").toLowerCase();
          let initialStatus: "pending" | "accepted" | "rejected" =
            rawStatus === "accepted" || rawStatus === "rejected" ? rawStatus : "pending";
          if (messageText.includes("accepted")) {
            initialStatus = "accepted";
          } else if (messageText.includes("declined") || messageText.includes("rejected")) {
            initialStatus = "rejected";
          }

          return {
            id: String(item.id),
            type: detectedType,
            user: {
              name: userName,
              email: userEmail,
              phone: userPhone,
            },
            text: cleanedText,
            postId: String(item.post_id || item.postId || postObj.id || ""),
            postType: String(pType).toLowerCase(),
            time: formattedTime,
            status: initialStatus,
          };
        });

        setNotifications(formattedNotifs);
      } catch (err: unknown) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, [authContextToken, router]);

  const handleAction = async (id: string, newStatus: "accepted" | "rejected") => {
    const token = authContextToken || localStorage.getItem("auth_token") || localStorage.getItem("token");
    if (!token) return;

    setActionLoadingId(id);

    try {
      await updateNotificationStatusApi(id, newStatus, token);

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, status: newStatus } : notif
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("An error occurred while updating the status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getPostLink = (postId: string, postType: string) => {
    if (!postId || postId === "undefined" || postId === "null") return "#";
    if (postType.includes("rescue")) {
      return `/rescue/${postId}`; 
    }
    return `/details/${postId}`; 
  };

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const currentNotifs = notifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart size={18} className="text-pink-600 fill-pink-600/10" />;
      case "comment":
        return <MessageCircle size={18} className="text-sky-500 fill-sky-500/10" />;
      case "adoption":
        return <Home size={18} className="text-emerald-600 fill-emerald-600/10" />;
      case "rescue":
        return <ShieldAlert size={18} className="text-amber-500 fill-amber-500/10" />;
      default:
        return <Bell size={18} className="text-gray-600" />;
    }
  };

  return (
    <div className="dashboard-container min-h-screen">
      <DashNav />

      <main className="dashboard-main-content">
        <div className="w-full">
          <div className="card w-full">
            <div className="mb-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                <Bell className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" size={28} />
                <span>Notifications</span>
              </h2>
              <p className="text-sm text-pink-900/60 mt-1">
                Stay updated with your latest interactions and requests.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-pink-100 border border-pink-300 text-pink-950 text-xs rounded-xl font-bold">
                {error}
              </div>
            )}

            {currentNotifs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {currentNotifs.map((notif) => {
                  const lowerText = notif.text.toLowerCase();
                  // التأكد ما إذا كان الإشعار مجرد نتيجة (رد) للطلب وليس طلب ينتظر القرار
                  const isResultNotification = lowerText.includes("accepted") || lowerText.includes("declined") || lowerText.includes("rejected");

                  return (
                    <div
                      key={notif.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/40 border border-white/60 rounded-2xl backdrop-blur-md transition-all duration-200 hover:bg-white/60 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-white/80 shadow-xs mt-0.5">
                          {getNotifIcon(notif.type)}
                        </div>

                        <div className="text-sm">
                          <div className="relative inline-block group">
                            <span className="font-bold text-pink-950 underline decoration-pink-300 decoration-2 underline-offset-2 cursor-pointer">
                              {notif.user.name}
                            </span>

                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:flex flex-col gap-1.5 p-3 w-56 bg-white/95 backdrop-blur-xl rounded-xl border border-pink-100 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                              <div className="flex items-center gap-2 text-pink-950 font-semibold border-b border-gray-100 pb-1.5">
                                <User size={14} className="text-pink-600" />
                                <span>{notif.user.name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail size={12} className="text-gray-400" />
                                <span className="truncate">{notif.user.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone size={12} className="text-gray-400" />
                                <span>{notif.user.phone}</span>
                              </div>
                            </div>
                          </div>

                          <span className="text-gray-700 mx-1.5 font-medium">{notif.text}</span>

                          {notif.postId && (
                            <Link
                              href={getPostLink(notif.postId, notif.postType)}
                              className="inline-block text-xs text-pink-700 font-semibold hover:underline ml-1"
                            >
                              [View Post]
                            </Link>
                          )}

                          <p className="text-[11px] text-pink-900/50 mt-1">{notif.time}</p>
                        </div>
                      </div>

                      {(notif.type === "adoption" || notif.type === "rescue") && (
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {/* إذا كان الإشعار نتيجة رد، يظهر Badge فقط بدون أزرار */}
                          {isResultNotification ? (
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-bold border ${
                                notif.status === "accepted" || lowerText.includes("accepted")
                                  ? "bg-pink-50 text-pink-950 border-pink-200"
                                  : "bg-purple-50 text-purple-950 border-purple-200"
                              }`}
                            >
                              {notif.status === "accepted" || lowerText.includes("accepted") ? "Accepted" : "Declined"}
                            </span>
                          ) : notif.status === "pending" ? (
                            <>
                              <button
                                onClick={() => handleAction(notif.id, "accepted")}
                                disabled={actionLoadingId === notif.id}
                                className="flex items-center gap-1 px-3.5 py-1.5 bg-pink-100/90 hover:bg-pink-200 text-pink-950 border border-pink-300 rounded-xl text-xs font-bold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                {actionLoadingId === notif.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Check size={14} className="text-pink-800" />
                                )}
                                Accept
                              </button>

                              <button
                                onClick={() => handleAction(notif.id, "rejected")}
                                disabled={actionLoadingId === notif.id}
                                className="flex items-center gap-1 px-3.5 py-1.5 bg-purple-100/90 hover:bg-purple-200 text-purple-950 border border-purple-300 rounded-xl text-xs font-bold shadow-xs transition-all duration-150 active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                {actionLoadingId === notif.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <X size={14} className="text-purple-800" />
                                )}
                                Reject
                              </button>
                            </>
                          ) : (
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-bold border ${
                                notif.status === "accepted"
                                  ? "bg-pink-50 text-pink-950 border-pink-200"
                                  : "bg-purple-50 text-purple-950 border-purple-200"
                              }`}
                            >
                              {notif.status === "accepted" ? "Accepted" : "Rejected"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-pink-900/60">
                <Bell className="mx-auto mb-3 opacity-40" size={48} />
                <p>No new notifications.</p>
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}