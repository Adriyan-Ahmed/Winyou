import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              <span className=" font-bold uppercase text-gray-200">
                {" "}
                <span className="text-amber-400">Win</span>you
                <span className=" text-amber-400 text-lg lowercase">.me</span>
              </span>
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Winyou me eCommerce platform for Product resources. We provide
              high-quality
            </p>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Subjects</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#" className="hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-white transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/auth/register"
                  className="hover:text-white transition"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-white transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Connect With Us
            </h3>

            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="bg-gray-700 p-3 rounded-lg hover:bg-indigo-600 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="bg-gray-700 p-3 rounded-lg hover:bg-indigo-600 transition"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="#"
                className="bg-gray-700 p-3 rounded-lg hover:bg-indigo-600 transition"
              >
                <FaYoutube />
              </a>
            </div>

            <p className="text-gray-400 text-sm">Email: support@hureshop.com</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Winyou me. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
