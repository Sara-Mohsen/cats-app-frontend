"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Posts from "@/components/Posts";
import ResqPost from "@/components/ResqPost";
import AdPost from "@/components/AdPost";
import Footer from "@/components/Footer";

const titles = [
  "Welcome to our Cats Gallery",
  "Discover Amazing Cats",
  "Find Your New Best Friend",
  "Adopt. Rescue. Love.",
];


export default function Home() {
  const [index, setIndex] = useState(0);
  const latestPostsRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToLatestPosts = () => {
    latestPostsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="container mx-auto px-4">
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
          <Link href="/login">
            <button className="btn-primary">Sign up</button>
          </Link>

          <Link href="#latest-posts" ref={latestPostsRef}>
            <button className="btn-secondary" onClick={scrollToLatestPosts}>
              View Cats
            </button>
          </Link>
        </div>
      </div>
    </section>
    <Posts />
    <ResqPost />
    <AdPost />
    <Footer />
    </main>
    
  );
}


