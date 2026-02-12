"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaPhoneAlt, FaEnvelope, FaRegClock, FaDiscord, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { WHATSAPP_SUPPORT_NUMBER } from "@/lib/constants/contacts";


const ContactSection = () => {
  return (
    <section className="py-16 px-4 md:px-6">
      <div className="text-center mb-12">
        <h2 className="text-36-bold text-black-1 dark:text-white mb-4">Connect with Our Team</h2>
        <p className="text-16-regular text-black-1/70 dark:text-white/70 max-w-xl mx-auto">
          In rare cases of difficulties at any point of using Pavied you can contact us here
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form Card */}
        <div className="bg-[#F9FAFB] dark:bg-black-1/20 p-8 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
          <h3 className="text-20-medium text-black-1 dark:text-white mb-8">Get in Touch With Us</h3>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-14-medium text-black-1 dark:text-white">First Name</label>
                <Input 
                  placeholder="John Doe" 
                  className="bg-white dark:bg-black-2 h-12 border-gray-200 dark:border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-14-medium text-black-1 dark:text-white">Last Name</label>
                <Input 
                  placeholder="John Doe" 
                  className="bg-white dark:bg-black-2 h-12 border-gray-200 dark:border-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-14-medium text-black-1 dark:text-white">Email address</label>
              <Input 
                type="email"
                placeholder="Johndoe@gmail.com" 
                className="bg-white dark:bg-black-2 h-12 border-gray-200 dark:border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Textarea 
                placeholder="Input your statement here" 
                className="bg-white dark:bg-black-2 min-h-[160px] border-gray-200 dark:border-white/10 resize-none p-4"
              />
            </div>

            <Button className="btn-secondary w-full md:w-auto px-8 h-12 text-16-bold">
              Send Message
            </Button>
          </form>
        </div>

        {/* Contact Info & Socials */}
        <div className="space-y-12 lg:pl-8">
          <div>
            <h3 className="text-36-bold text-black-1 dark:text-white mb-2">Contact Details</h3>
            <p className="text-16-regular text-black-1/70 dark:text-white/70 mb-8">
              You can reach us via the following options
            </p>

            <div className="space-y-6">
              {/* Mobile */}
              <a 
                href={`tel:+${WHATSAPP_SUPPORT_NUMBER}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-black-2 shadow-sm transition-all hover:border-secondary/50 group"
              >
                <div className="size-12 rounded-lg bg-secondary flex items-center justify-center text-white shrink-0">
                  <FaPhoneAlt className="size-5" />
                </div>
                <div>
                  <h4 className="text-18-bold text-black-1 dark:text-white">Mobile</h4>
                  <p className="text-14-regular text-black-1/70 dark:text-white/70">
                    (+{WHATSAPP_SUPPORT_NUMBER.slice(0, 3)}) {WHATSAPP_SUPPORT_NUMBER.slice(3, 6)} {WHATSAPP_SUPPORT_NUMBER.slice(6, 10)} {WHATSAPP_SUPPORT_NUMBER.slice(10)}
                  </p>
                </div>
              </a>

              {/* Availability */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-black-2 shadow-sm">
                <div className="size-12 rounded-lg bg-secondary flex items-center justify-center text-white shrink-0">
                  <FaRegClock className="size-6" />
                </div>
                <div>
                  <h4 className="text-18-bold text-black-1 dark:text-white">Availability</h4>
                  <p className="text-14-regular text-black-1/70 dark:text-white/70">6am - 6pm Mon - Sat</p>
                </div>
              </div>

              {/* Email */}
              <a 
                href={`mailto:support@pavied.com`}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-black-2 shadow-sm transition-all hover:border-secondary/50 group"
              >
                <div className="size-12 rounded-lg bg-secondary flex items-center justify-center text-white shrink-0">
                  <FaEnvelope className="size-5" />
                </div>
                <div>
                  <h4 className="text-18-bold text-black-1 dark:text-white">Email</h4>
                  <p className="text-14-regular text-black-1/70 dark:text-white/70">support@pavied.com</p>
                </div>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-24-bold text-black-1 dark:text-white mb-6">Social Media</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <a href="#" className="text-[#5865F2] transition-transform hover:scale-110">
                <FaDiscord className="size-7" />
              </a>
              <a href="#" className="text-[#E4405F] transition-transform hover:scale-110">
                <FaInstagram className="size-7" />
              </a>
              <a href="#" className="text-black dark:text-white transition-transform hover:scale-110">
                <FaXTwitter className="size-7" />
              </a>
              <a href="#" className="text-[#1877F2] transition-transform hover:scale-110">
                <FaFacebook className="size-7" />
              </a>
              <a href="#" className="text-black dark:text-white transition-transform hover:scale-110">
                <FaTiktok className="size-7" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
