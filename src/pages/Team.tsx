import React from "react";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Our Team</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Meet the experts behind OFSLedger. Our team combines decades of experience
          in blockchain, finance, and technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => (
          <Card key={member.name} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 mx-auto mb-4 rounded-full"
              />
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-indigo-600 mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm">{member.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Team;
