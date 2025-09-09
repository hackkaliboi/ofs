import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const positions = [
  {
    title: "Senior Blockchain Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "We're looking for an experienced blockchain developer with strong knowledge of Ethereum, Solidity, and Web3.js."
  },
  {
    title: "Product Manager - DeFi",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    description: "Join us in building the next generation of decentralized finance products."
  },
  {
    title: "Security Engineer",
    department: "Security",
    location: "Remote",
    type: "Full-time",
    description: "Help us maintain and enhance our enterprise-grade security infrastructure."
  },
  {
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Create beautiful and intuitive user interfaces for our blockchain platform."
  }
];

const Careers = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Help us build the future of finance. We're looking for passionate individuals
          who want to make a difference in the blockchain space.
        </p>
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {positions.map((position) => (
          <Card key={position.title} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
                      {position.department}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
                      {position.location}
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
                      {position.type}
                    </span>
                  </div>
                  <p className="text-gray-600">{position.description}</p>
                </div>
                <Button className="mt-4 md:mt-0 md:ml-4">Apply Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16">
        <p className="text-lg text-gray-600 mb-6">
          Don't see a position that matches your skills?
        </p>
        <Button variant="outline" size="lg">
          Send us your CV
        </Button>
      </div>
    </div>
  );
};

export default Careers;
