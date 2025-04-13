
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="text-2xl font-bold text-brand-blue">
              DigitalStore
            </Link>
            <p className="mt-4 text-gray-600">
              Premium digital products for creators and professionals. Boost your productivity and creativity with our high-quality resources.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-brand-blue">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-blue">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-blue">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-blue">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/products?category=templates" className="text-gray-600 hover:text-brand-blue">Templates</Link></li>
              <li><Link to="/products?category=courses" className="text-gray-600 hover:text-brand-blue">Courses</Link></li>
              <li><Link to="/products?category=assets" className="text-gray-600 hover:text-brand-blue">Digital Assets</Link></li>
              <li><Link to="/products?category=tools" className="text-gray-600 hover:text-brand-blue">Tools</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-brand-blue">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand-blue">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-brand-blue">Careers</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-brand-blue">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-600 hover:text-brand-blue">Help Center</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-brand-blue">FAQ</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-brand-blue">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-brand-blue">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} DigitalStore. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-gray-600 text-sm mr-2">Subscribe to our newsletter</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-brand-blue"
                />
                <button className="bg-brand-blue text-white px-4 py-2 rounded-r-md hover:bg-brand-dark">
                  <Mail size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
