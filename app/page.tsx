import HomeHero from "@/components/HomeHero";
import Posts from "@/components/Posts";
import ResqPost from "@/components/ResqPost";
import AdPost from "@/components/AdPost";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <HomeHero />

      <Posts />

      <ResqPost />

      <AdPost />

      <Footer />
    </main>
  );
}