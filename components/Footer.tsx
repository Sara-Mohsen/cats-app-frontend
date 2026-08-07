import Link from 'next/link';
import Image from 'next/image';
import { 
  FaWhatsapp, 
  FaLinkedinIn, 
  FaHeart, 
  FaGithub,
  FaMailBulk
} from 'react-icons/fa';
import { useRef } from 'react';



export default function Footer() {

  const homepageRef = useRef<HTMLAnchorElement>(null);
  const scrollToHomePage = (e: React.MouseEvent) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  return (
    <footer className="w-full dir-ltr font-sans text-slate-800 p-4 md:p-8 flex justify-center items-center">
      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-5xl backdrop-blur-md bg-white/30 dark:bg-slate-900/60 border border-white/60 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 text-left">
          
          {/* Logo & Description (أخذ 6 أعمدة من أصل 12) */}
          <div className="md:col-span-6 flex flex-col justify-start space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <Image 
                  src="/images/logo.png" 
                  alt="Cat Gallery Logo" 
                  fill
                  className="object-contain drop-shadow-sm"
                />
              </div>

              <span className="text-3xl font-bold tracking-wide text-white drop-shadow-sm">
                Cats Gallery
              </span>
            </div>
            <p className="text-pink-900 text-sm font-medium leading-relaxed max-w-xs drop-shadow-sm">
              Give every cat a second chance, and every home a new friend.
            </p>
          </div>

          {/* Quick Links (مباشرة بجانب Contact Us - أخذ 3 أعمدة) */}
          <div className="md:col-span-3 flex flex-col space-y-3">
            <h3 className="text-lg font-bold text-white drop-shadow-sm mb-1">Quick Links</h3>
            <ul className="space-y-2 text-sm text-pink-900 font-medium">
              <li>
                <Link href="#home-page" className="hover:text-pink-600 drop-shadow-sm transition-colors duration-200" 
                ref={homepageRef}
                onClick={scrollToHomePage}>
                    Home
                </Link>
              </li>
              <li>
                <Link href="/AllAdoptionPosts" className="hover:text-pink-600 drop-shadow-sm transition-colors duration-200">
                  Adopt
                </Link>
              </li>
              <li>
                <Link href="/AllRescuePosts" className="hover:text-pink-600 drop-shadow-sm transition-colors duration-200">
                  Rescue
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-pink-600 drop-shadow-sm transition-colors duration-200">
                  Create
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us (على أقصى اليمين - أخذ 3 أعمدة) */}
          <div className="md:col-span-3 flex flex-col space-y-3">
            <h3 className="text-lg font-bold text-white drop-shadow-sm mb-1">Contact Us</h3>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1 text-pink-900">
              <a href="https://wa.me/0566730167" className="hover:text-pink-600 hover:scale-110 drop-shadow-sm transition-all text-xl" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sarasmr90@gmail.com" className="hover:text-pink-600 hover:scale-110 drop-shadow-sm transition-all text-xl" aria-label="Mail">
                <FaMailBulk />
              </a>
              <a href="https://github.com/Sara-Mohsen/cats-app-frontend" className="hover:text-pink-600 hover:scale-110 drop-shadow-sm transition-all text-xl" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="https://github.com/Sara-Mohsen" className="hover:text-pink-600 hover:scale-110 drop-shadow-sm transition-all text-xl" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-600/10 flex flex-col sm:flex-row justify-between items-center text-xs text-pink-900 font-medium gap-2">
          <p className="drop-shadow-sm">© 2026 Cat Gallery. All rights reserved.</p>
          <p className="flex items-center gap-1 drop-shadow-sm">
            Made with <FaHeart className="text-pink-300 text-xs inline" /> for cats
          </p>
        </div>

      </div>
    </footer>
  );
}
