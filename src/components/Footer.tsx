import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-purple-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">InclusiTrack</h3>
                <p className="text-purple-300 text-sm">HEVA Cultural Inclusion Platform</p>
              </div>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              Empowering vulnerable communities through data-driven inclusion initiatives. 
              Our platform connects beneficiaries with funding opportunities and tracks 
              the impact of cultural inclusion programs across Kenya.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-purple-300" />
                <span className="text-purple-200 text-sm">info@heva.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-purple-300" />
                <span className="text-purple-200 text-sm">+254 700 000 000</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-purple-300" />
                <span className="text-purple-200 text-sm">Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="#" className="block text-purple-200 hover:text-white text-sm transition-colors">
                About HEVA
              </a>
              <a href="#" className="block text-purple-200 hover:text-white text-sm transition-colors">
                Programs
              </a>
              <a href="#" className="block text-purple-200 hover:text-white text-sm transition-colors">
                Support
              </a>
              <a href="#" className="block text-purple-200 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-800 mt-8 pt-8 text-center">
          <p className="text-purple-300 text-sm">
            © 2024 HEVA Foundation. All rights reserved. Building inclusive communities through technology.
          </p>
        </div>
      </div>
    </footer>
  );
};