"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useAuth } from "@/app/context/AuthContext";

const titles = [
  "Welcome to our Cats Gallery",
  "Discover Amazing Cats",
  "Find Your New Best Friend",
  "Adopt. Rescue. Love.",
];

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function HomeHero() {
  const [index, setIndex] = useState(0);
  const mounted = useIsMounted();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <AnimatePresence mode="wait">
          <motion.h1
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="hero-title"
          >
            {titles[index]}
          </motion.h1>
        </AnimatePresence>

        <p className="hero-description">
          A Small Network That All Cats Lovers Need!!
        </p>

        <div className="hero-buttons">
          {mounted && (
            isAuthenticated ? (
              <Link href="/profile">
                <button className="btn-primary cursor-pointer">
                  Profile
                </button>
              </Link>
            ) : (
              <Link href="/login">
                <button className="btn-primary cursor-pointer">
                  Login
                </button>
              </Link>
            )
          )}

          <a href="#latest-posts" className="btn-secondary flex items-center justify-center cursor-pointer">
            View Cats
          </a>
        </div>
      </div>
    </section>
  );
}