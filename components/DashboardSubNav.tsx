"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Images,
  Heart,
  Bell
} from "lucide-react";

export default function DashboardSubNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      href: "/my-posts",
      icon: Images,
      label: "My Posts",
    },
    {
      href: "/favorite",
      icon: Heart,
      label: "Favorite Posts",
    },
    {
      href: "/notifications",
      icon: Bell,
      label: "Notifications",
      hasBadge: true,
    },
    {
      href: "/profile",
      isProfile: true,
      label: "Profile",
    },
  ];

  return (
    <div className="w-[min(93%,1100px)] mx-auto pt-35 md:pt-35 pb-2 transition-all duration-300">
      {/* إطار زجاجي شفاف بنفس طابع شريط البحث */}
      <div className="relative flex items-center justify-around bg-white/30 backdrop-blur-md border border-white/70 shadow-md rounded-3xl p-2 md:p-1.5 transition-all duration-300">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative z-10 flex items-center justify-center p-3 md:p-3.5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 ${
                isActive ? "text-pink-900" : "text-gray-500 hover:text-pink-900"
              }`}
            >
              {/* المؤشر الأبيض المتحرك بسلاسة (Sliding Indicator) */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 -z-10"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}

              {/* الأيقونة أو الصورة */}
              {item.isProfile ? (
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border transition-all duration-300 ${
                    isActive ? "border-pink-500 scale-105 shadow-sm" : "border-white/80"
                  }`}
                >
                  <Image
                    src="/images/profile.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                item.icon && (
                  <div className="relative">
                    <item.icon
                      size={23}
                      className={`transition-colors duration-200 ${
                        isActive ? "text-pink-900" : ""
                      }`}
                    />
                    {item.hasBadge && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-700/80 rounded-full border border-white animate-pulse" />
                    )}
                  </div>
                )
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
