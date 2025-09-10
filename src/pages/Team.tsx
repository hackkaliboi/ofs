import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Star, Award } from "lucide-react";
import Footer from "@/components/layout/Footer";

const teamMembers = [
  {
    name: "John Smith",
    role: "CEO & Founder",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    bio: "Blockchain expert with 10+ years in fintech"
  },
  {
    name: "Sarah Johnson",
    role: "CTO",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    bio: "Former lead engineer at major crypto exchange"
  },
  {
    name: "Michael Chen",
    role: "Head of Security",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    bio: "Cybersecurity specialist with focus on blockchain"
  },
  {
    name: "Emily Brown",
    role: "Product Manager",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    bio: "Experienced in leading DeFi products"
  }
];

const Team = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-amber-500/10 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-grow relative z-10">
        <div className="container mx-auto px-4 py-24">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">Meet Our Team</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-amber-300 bg-clip-text text-transparent">
              Our Team
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the experts behind SolmintX. Our team combines decades of experience
              in blockchain, finance, and technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="bg-gradient-to-br from-black/50 to-black/70 border border-yellow-500/20 backdrop-blur-sm hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 p-1">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full p-2">
                        <Star className="w-4 h-4 text-black" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{member.name}</h3>
                    <p className="text-yellow-400 mb-3 font-medium">{member.role}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Team;
