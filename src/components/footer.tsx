'use client';
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

export default function ThreeBlocksInRow() {
  return (
    <section className="bg-[#050119] pb-15">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Первый блок */}
          <div className="flex justify-center items-center sm:border-r-2 sm:border-dashed  max-[640px]:border-b-2 max-[640px]:border-dashed max-[640px]:pb-6 pr-6">
            <img src="/logo.png" alt="Meeple Cave Logo" className="object-center" />
          </div>

          {/* Второй блок */}
          <div className="flex justify-center sm:pl-6 sm:pr-6 items-center sm:border-r-2 sm:border-dashed  max-[640px]:border-b-2 max-[640px]:border-dashed max-[640px]:pb-6 pr-6">
            <div className="grid grid-cols-2 gap-6 text-center">
              <a href="#" className="text-white inline-block">
                <span className="border-b-2 border-transparent hover:border-cm-blue transition duration-300">
                  ABOUT
                </span>
              </a>
              <a href="#" className="text-white inline-block">
                <span className="border-b-2 border-transparent hover:border-cm-blue transition duration-300">
                  STORE
                </span>
              </a>
              <a href="#" className="text-white inline-block">
                <span className="border-b-2 border-transparent hover:border-cm-blue transition duration-300">
                  CATALOG
                </span>
              </a>
              <a href="#" className="text-white inline-block">
                <span className="border-b-2 border-transparent hover:border-cm-blue transition duration-300">
                  SERVICE
                </span>
              </a>
            </div>
          </div>

          {/* Третий блок */}
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-2 gap-6 text-center">
              <span className="border-b-2 border-transparent">Latvia, Liepaja</span>
              <a href="tel:+3712999999" className="text-white inline-block">
                <span className="border-b-2 border-transparent">+3712999999</span>
              </a>
              <a href="mailto:email@meeplecave.com" className="text-white inline-block">
                <span className="border-b-2 border-transparent">email@meeplecave.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Социальные сети */}
        <div className="flex space-x-2 mt-4 justify-center">
          <Link
            href="https://www.facebook.com/groups/1383629365341369"
            target="_blank"
            className="text-gray-400 hover:text-[#394DFF]"
          >
            <div className="w-10 h-10 border border-gray-800 rounded-full flex items-center justify-center text-sm hover:border-[#394DFF]">
              <Facebook className="w-6 h-6" />
            </div>
          </Link>
          <Link
            href="https://www.instagram.com/meeple_cave/?hl=ru"
            target="_blank"
            className="text-gray-400 hover:text-[#394DFF]"
          >
            <div className="w-10 h-10 border border-gray-800 rounded-full flex items-center justify-center text-sm hover:border-[#394DFF]">
              <Instagram className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {/* Копирайт */}
        <div className="text-center text-gray-400 text-sm mt-4 pb-3">
          &copy; {new Date().getFullYear()} MeepleCave. All rights reserved.
        </div>
      </div>
    </section>
  );
}
