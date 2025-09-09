import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import Footer from "@/components/layout/Footer";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-amber-500/10 pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex-grow relative z-10">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
                <MessageCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-medium">Get in Touch</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-amber-300 bg-clip-text text-transparent">
                Contact Us
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Have questions about OFSLEDGER? We're here to help. Reach out to us through any of the channels below or fill out the contact form.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-gradient-to-r from-black/50 to-black/70 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 p-3 rounded-lg border border-yellow-500/30">
                        <Mail className="h-6 w-6 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-white">Email</h3>
                        <p className="text-gray-300">support@ofsledger.com</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gradient-to-r from-black/50 to-black/70 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 p-3 rounded-lg border border-yellow-500/30">
                        <Phone className="h-6 w-6 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-white">Phone</h3>
                        <p className="text-gray-300">+1 (888) OFS-HELP</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="bg-gradient-to-r from-black/50 to-black/70 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition-all duration-300 hover:transform hover:scale-105"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 p-3 rounded-lg border border-yellow-500/30">
                        <MapPin className="h-6 w-6 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-white">Office</h3>
                        <p className="text-gray-300">
                          123 Financial District<br />
                          San Francisco, CA 94111<br />
                          United States
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="border-yellow-500/20 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                      Send us a message
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white font-medium">Name</Label>
                        <Input 
                          id="name" 
                          placeholder="Your name" 
                          required 
                          className="bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-400 focus:border-yellow-500/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white font-medium">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your@email.com" 
                          required 
                          className="bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-400 focus:border-yellow-500/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-white font-medium">Subject</Label>
                        <Input 
                          id="subject" 
                          placeholder="How can we help?" 
                          required 
                          className="bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-400 focus:border-yellow-500/60"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-white font-medium">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your inquiry..."
                          className="min-h-[150px] bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-400 focus:border-yellow-500/60"
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-semibold rounded-full py-3 transition-all duration-300 hover:transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Message
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
