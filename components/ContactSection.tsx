"use client";


import { FaPhoneAlt, FaEnvelope, FaRegClock, FaDiscord, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { WHATSAPP_SUPPORT_NUMBER } from "@/lib/constants/contacts";


const ContactSection = () => {
  return (
    <section className="py-20 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-36-bold text-black-1 dark:text-white">
            Get in Touch
          </h2>
          <p className="text-16-regular text-black-1/70 dark:text-white/70 max-w-2xl mx-auto">
            Have questions or need assistance? Our support team is here to help you around the clock. 
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Mobile Card */}
          <a 
            href={`tel:+${WHATSAPP_SUPPORT_NUMBER}`}
            className="flex flex-col items-center p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="size-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
              <FaPhoneAlt className="size-6" />
            </div>
            <h3 className="text-20-bold text-black-1 dark:text-white mb-2">Call Us</h3>
            <p className="text-16-regular text-black-1/60 dark:text-white/60 text-center mb-4">
              Speak directly with our support team
            </p>
            <p className="text-18-medium text-black-1 dark:text-white">
              (+{WHATSAPP_SUPPORT_NUMBER.slice(0, 3)}) {WHATSAPP_SUPPORT_NUMBER.slice(3, 6)} {WHATSAPP_SUPPORT_NUMBER.slice(6, 10)} {WHATSAPP_SUPPORT_NUMBER.slice(10)}
            </p>
          </a>

          {/* Availability Card */}
          <div className="flex flex-col items-center p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm">
            <div className="size-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
              <FaRegClock className="size-7" />
            </div>
            <h3 className="text-20-bold text-black-1 dark:text-white mb-2">Availability</h3>
            <p className="text-16-regular text-black-1/60 dark:text-white/60 text-center mb-4">
              We are available to help you
            </p>
            <p className="text-18-medium text-black-1 dark:text-white">
              24/7
            </p>
          </div>

          {/* Email Card */}
          <a 
            href="mailto:support@pavied.com"
            className="flex flex-col items-center p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="size-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
              <FaEnvelope className="size-6" />
            </div>
            <h3 className="text-20-bold text-black-1 dark:text-white mb-2">Email Us</h3>
            <p className="text-16-regular text-black-1/60 dark:text-white/60 text-center mb-4">
              Send us a detailed message
            </p>
            <p className="text-18-medium text-black-1 dark:text-white">
              support@pavied.com
            </p>
          </a>
        </div>

        {/* Social Media Section */}
        <div className="text-center bg-gray-50 dark:bg-white/5 rounded-3xl p-10">
          <h3 className="text-24-bold text-black-1 dark:text-white mb-8">Connect on Social Media</h3>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="#" className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1">
              <div className="size-12 rounded-full bg-white dark:bg-black-2 shadow-sm flex items-center justify-center text-[#5865F2] group-hover:bg-[#5865F2] group-hover:text-white transition-all">
                <FaDiscord className="size-6" />
              </div>
              <span className="text-14-medium text-black-1/70 dark:text-white/70">Discord</span>
            </a>
            <a href="#" className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1">
              <div className="size-12 rounded-full bg-white dark:bg-black-2 shadow-sm flex items-center justify-center text-[#E4405F] group-hover:bg-[#E4405F] group-hover:text-white transition-all">
                <FaInstagram className="size-6" />
              </div>
              <span className="text-14-medium text-black-1/70 dark:text-white/70">Instagram</span>
            </a>
            <a href="#" className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1">
              <div className="size-12 rounded-full bg-white dark:bg-black-2 shadow-sm flex items-center justify-center text-black dark:text-white group-hover:bg-black group-hover:dark:bg-white group-hover:text-white group-hover:dark:text-black transition-all">
                <FaXTwitter className="size-6" />
              </div>
              <span className="text-14-medium text-black-1/70 dark:text-white/70">X (Twitter)</span>
            </a>
            <a href="#" className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1">
              <div className="size-12 rounded-full bg-white dark:bg-black-2 shadow-sm flex items-center justify-center text-[#1877F2] group-hover:bg-[#1877F2] group-hover:text-white transition-all">
                <FaFacebook className="size-6" />
              </div>
              <span className="text-14-medium text-black-1/70 dark:text-white/70">Facebook</span>
            </a>
            <a href="#" className="group flex flex-col items-center gap-2 transition-transform hover:-translate-y-1">
              <div className="size-12 rounded-full bg-white dark:bg-black-2 shadow-sm flex items-center justify-center text-black dark:text-white group-hover:bg-black group-hover:dark:bg-white group-hover:text-white group-hover:dark:text-black transition-all">
                <FaTiktok className="size-6" />
              </div>
              <span className="text-14-medium text-black-1/70 dark:text-white/70">TikTok</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
