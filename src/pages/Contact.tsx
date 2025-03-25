import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
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
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
                <div className="prose prose-indigo max-w-none mb-8">
                  <p className="text-lg text-gray-600">
                    Have questions about OFSLEDGER? We're here to help. Reach out to us through any of the channels below or fill out the contact form.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">support@ofsledger.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600">+1 (888) OFS-HELP</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Office</h3>
                      <p className="text-gray-600">
                        123 Financial District<br />
                        San Francisco, CA 94111<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Send us a message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="How can we help?" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your inquiry..."
                          className="min-h-[150px]"
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full">
                        Send Message
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
