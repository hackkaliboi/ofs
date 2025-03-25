import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Code, Shield, Wallet, Cog, Book } from "lucide-react";
import Footer from "@/components/layout/Footer";

const Documentation = () => {
  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Book,
      content: [
        {
          title: "Introduction",
          description: "Learn about OFSLEDGER and its core features",
          link: "/docs/intro"
        },
        {
          title: "Quick Start Guide",
          description: "Get up and running with OFSLEDGER in minutes",
          link: "/docs/quickstart"
        },
        {
          title: "Platform Overview",
          description: "Understand the OFSLEDGER platform architecture",
          link: "/docs/overview"
        }
      ]
    },
    {
      id: "asset-management",
      title: "Asset Management",
      icon: Wallet,
      content: [
        {
          title: "Digital Asset Types",
          description: "Overview of supported digital assets",
          link: "/docs/assets"
        },
        {
          title: "Wallet Integration",
          description: "Connect and manage your Web3 wallets",
          link: "/docs/wallets"
        },
        {
          title: "Asset Validation",
          description: "Learn about the asset validation process",
          link: "/docs/validation"
        }
      ]
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      content: [
        {
          title: "Security Features",
          description: "Understand our security measures",
          link: "/docs/security"
        },
        {
          title: "Best Practices",
          description: "Security recommendations for users",
          link: "/docs/security/best-practices"
        },
        {
          title: "Multi-Signature Support",
          description: "Set up multi-signature protection",
          link: "/docs/security/multisig"
        }
      ]
    },
    {
      id: "api",
      title: "API Reference",
      icon: Code,
      content: [
        {
          title: "REST API",
          description: "Complete REST API documentation",
          link: "/docs/api/rest"
        },
        {
          title: "WebSocket API",
          description: "Real-time data streaming API",
          link: "/docs/api/websocket"
        },
        {
          title: "Authentication",
          description: "API authentication and security",
          link: "/docs/api/auth"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">Documentation</h1>
              <p className="text-lg text-gray-600">
                Everything you need to know about using OFSLEDGER's platform and services.
              </p>
            </div>

            <div className="grid gap-8">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.id}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Icon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold">{section.title}</h2>
                        <p>Explore {section.title.toLowerCase()} documentation</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {section.content.map((item) => (
                        <Link key={item.link} to={item.link}>
                          <div className="group p-4 rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all">
                            <h3 className="font-semibold mb-1 group-hover:text-indigo-600">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex justify-center">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
                <Link to="/contact">
                  <Button variant="outline">Contact Support</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Documentation;
