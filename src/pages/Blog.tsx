import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 text-white pt-32 pb-20">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">OFSLEDGER Blog</h1>
            <p className="text-xl text-blue-100/90 max-w-2xl">
              Insights, updates, and deep dives into the world of oracle financial systems and digital assets.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container-custom py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600">
              Our blog section is currently under development. Soon, you'll find the latest insights, 
              technical deep-dives, and updates about OFSLEDGER and the future of oracle financial systems.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
