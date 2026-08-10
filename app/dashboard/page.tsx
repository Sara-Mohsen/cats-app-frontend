"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Images,
  Heart,
  Bell, 
  MessageCircle,
  User,
  Wand2
} from "lucide-react";
import "../styles/dashboard.css"; 
import "../styles/dash-nav.css"; 
import DashNav from "../../components/DashNav";
export default function Dashboard() {
  // كلاس الحركة للروابط (رفع وتكبير ناعم)
  const titleHoverStyle = "flex items-center gap-2 cursor-pointer inline-flex transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:opacity-90";

  return (
    <div className="dashboard-container">
      {/* شريط الخيارات الجديد في الأوفر سبيس العلوي */}
      <DashNav />

      {/* محتوى الصفحة الرئيسي */}
      <main className="dashboard-main-content">
        <div className="dashboard-grid">
          {/* كرت الترحيب */}
          <div className="card welcome-card">
            <h2 className="flex items-center gap-2 transition-transform duration-300 hover:scale-102 origin-right">
              <Wand2 className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" size={26} />
              Welcome back, Sara!
            </h2>
            <p>Overview of your dashboard activity.</p>
          </div>

          {/* كرت Profile Snapshot */}
          <div className="card profile-snapshot-card">
            <h3>
              <Link href="/profile" className={titleHoverStyle}>
                <User className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" size={24} />
                <span>Profile Snapshot</span>
              </Link>
            </h3>
            <div className="profile-info">
              <div className="avatar-large">
                <Image
                  src="/images/profile.png"
                  alt="Sara_Cats"
                  width={90}
                  height={90}
                />
              </div>
              <h4>Sara_Cats</h4>
              <p className="sub-label">Username</p>
              <p className="info-detail">0566730167</p>
              <p className="sub-label">Phone</p>
              <p className="info-detail">Medina</p>
              <p className="sub-label">City</p>
            </div>
          </div>

          {/* كرت My Posts */}
          <div className="card my-posts-card">
            <h3>
              <Link href="/my-posts" className={titleHoverStyle}>
                <Images className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" size={24} />
                <span>My Posts</span>
              </Link>
            </h3>
            <div className="posts-mini-grid">
              <div className="post-thumb">
                <Image src="/images/Cats/pic1.png" alt="Cat" width={150} height={150} />
              </div>
              <div className="post-thumb">
                <Image src="/images/Cats/pic5.png" alt="Cat" width={150} height={150} />
              </div>
              <div className="post-thumb">
                <Image src="/images/Cats/pic3.png" alt="Cat" width={150} height={150} />
              </div>
              <div className="post-thumb">
                <Image src="/images/Cats/pic2.png" alt="Cat" width={150} height={150} />
              </div>
            </div>
          </div>

          {/* كرت Favorite Posts */}
          <div className="card favorite-posts-card">
            <h3>
              <Link href="/favorite" className={titleHoverStyle}>
                <Heart className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" size={24} />
                <span>Favorite Posts</span>
              </Link>
            </h3>
            <div className="posts-mini-grid">
              <div className="post-thumb">
                <Image src="/images/Cats/pic10.png" alt="Cat" width={150} height={150} />
              </div>
              <div className="post-thumb">
                <Image src="/images/Cats/pic9.png" alt="Cat" width={150} height={150} />
              </div>
              <div className="post-thumb">
                <Image src="/images/Cats/pic8.png" alt="Cat" width={150} height={150} />
              </div>
            </div>
          </div>

          {/* كرت Recent Notifications */}
          <div className="card notifications-card">
            <h3>
              <Link href="/notifications" className={titleHoverStyle}>
                <Bell className="text-pink-900/70 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" size={24} />
                <span>Recent Notifications</span>
              </Link>
            </h3>
            <ul className="notifications-list">
              <li>
                <Heart size={16} className="notif-icon heart" />
                <span>User liked your post</span>
              </li>
              <li>
                <MessageCircle size={16} className="notif-icon comment" />
                <span>New comment on your cat pic</span>
              </li>
              <li>
                <Bell size={16} className="notif-icon bell" />
                <span>User sent adoption request</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
