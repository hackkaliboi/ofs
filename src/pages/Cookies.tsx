
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Cookie, Info } from "lucide-react";

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <div className="container-custom">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/cookies" className="font-medium">Cookie Policy</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
              <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div className="flex items-center gap-3 mb-6 text-indigo-600">
                <Cookie className="h-6 w-6" />
                <span className="font-medium text-xl">About Cookies</span>
              </div>
              
              <p>
                This Cookie Policy explains how OFSLEDGER uses cookies and similar technologies to recognize you when 
                you visit our website. It explains what these technologies are and why we use them, as well as your 
                rights to control our use of them.
              </p>
              
              <h2>What are cookies?</h2>
              <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
                Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
                as well as to provide reporting information.
              </p>
              <p>
                Cookies set by the website owner (in this case, OFSLEDGER) are called "first-party cookies". Cookies set 
                by parties other than the website owner are called "third-party cookies". Third-party cookies enable 
                third-party features or functionality to be provided on or through the website (e.g., advertising, interactive 
                content, and analytics). The parties that set these third-party cookies can recognize your computer both 
                when it visits the website in question and also when it visits certain other websites.
              </p>
              
              <h2>Why do we use cookies?</h2>
              <p>
                We use first-party and third-party cookies for several reasons. Some cookies are required for technical 
                reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" 
                cookies. Other cookies also enable us to track and target the interests of our users to enhance the 
                experience on our Online Properties. Third parties serve cookies through our Website for advertising, 
                analytics, and other purposes.
              </p>
              
              <h2>Types of cookies we use</h2>
              <div className="bg-gray-50 p-6 rounded-lg my-6">
                <h3 className="text-lg font-medium mt-0">Essential cookies</h3>
                <p className="mb-0">
                  These cookies are strictly necessary to provide you with services available through our Website and to 
                  use some of its features, such as access to secure areas. Because these cookies are strictly necessary 
                  to deliver the Website, you cannot refuse them without impacting how our Website functions.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg my-6">
                <h3 className="text-lg font-medium mt-0">Performance and functionality cookies</h3>
                <p className="mb-0">
                  These cookies are used to enhance the performance and functionality of our Website but are non-essential 
                  to their use. However, without these cookies, certain functionality may become unavailable.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg my-6">
                <h3 className="text-lg font-medium mt-0">Analytics and customization cookies</h3>
                <p className="mb-0">
                  These cookies collect information that is used either in aggregate form to help us understand how our 
                  Website is being used or how effective our marketing campaigns are, or to help us customize our Website 
                  for you in order to enhance your experience.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg my-6">
                <h3 className="text-lg font-medium mt-0">Advertising cookies</h3>
                <p className="mb-0">
                  These cookies are used to make advertising messages more relevant to you. They perform functions like 
                  preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in 
                  some cases selecting advertisements that are based on your interests.
                </p>
              </div>
              
              <h2>How can you control cookies?</h2>
              <p>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences 
                by clicking on the appropriate opt-out links provided below.
              </p>
              <p>
                You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, 
                you may still use our website though your access to some functionality and areas of our website may be restricted. 
                As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, 
                you should visit your browser's help menu for more information.
              </p>
              
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg my-8 text-indigo-700">
                <Info className="h-5 w-5 shrink-0" />
                <p className="text-sm m-0">
                  In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like 
                  to find out more information, please visit <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">http://www.aboutads.info/choices/</a> or 
                  <a href="http://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline"> http://www.youronlinechoices.com</a>.
                </p>
              </div>
              
              <h2>Cookie Preferences</h2>
              <p>
                You can view and manage your cookie preferences at any time by clicking on the "Cookie Settings" button 
                located in the footer of our website.
              </p>
              
              <h2>Updates to this Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies 
                we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy 
                regularly to stay informed about our use of cookies and related technologies.
              </p>
              <p>
                The date at the top of this Cookie Policy indicates when it was last updated.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or other technologies, please contact us at:
              </p>
              <p>
                Email: privacy@ofsledger.com<br />
                Phone: +1 (888) OFS-LEDG
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cookies;
