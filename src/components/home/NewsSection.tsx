
import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Link } from "react-router-dom";

const newsItems = [
  {
    title: "OFSLEDGER Partners with Major Financial Institutions",
    date: "June 15, 2023",
    excerpt: "OFSLEDGER announces strategic partnerships with leading financial institutions to expand the adoption of blockchain technology.",
    image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=800&auto=format&fit=crop",
    link: "#"
  },
  {
    title: "New Security Features Added to Protect Digital Assets",
    date: "May 28, 2023",
    excerpt: "OFSLEDGER enhances platform security with advanced quantum-resistant encryption protocols to stay ahead of emerging threats.",
    image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=800&auto=format&fit=crop",
    link: "#"
  },
  {
    title: "OFSLEDGER Achieves Record Transaction Volume",
    date: "April 12, 2023",
    excerpt: "Our platform reaches new milestones with record transaction volumes, demonstrating growing trust in our ecosystem.",
    image: "https://images.unsplash.com/photo-1613843439331-2a8d207415e0?q=80&w=800&auto=format&fit=crop",
    link: "#"
  }
];

const NewsSection = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest <span className="text-gradient">News</span> & Updates
            </h2>
            <p className="text-lg text-gray-600">
              Stay informed about the latest developments in our ecosystem and the broader market.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <AnimatedSection key={item.title} delay={(index + 1) as 1 | 2 | 3 | 4}>
              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 h-full hover:shadow-lg transition-all duration-300">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    {item.date}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <Link to={item.link} className="text-blue-600 font-medium inline-flex items-center hover:text-blue-500 transition-colors">
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
