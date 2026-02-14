"use client";

import Link from "next/link";
import { EmailBetaInput } from "@/components/landing/email-beta-input";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white py-20 px-5 md:px-10 border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
          {/* Left: Tagline */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
              Experience competition
            </h2>
            <p className="text-slate-600 max-w-sm -mt-4">
              Empowering the next generation of Pakistani students to discover,
              register, and compete at the highest level.
            </p>
            <div className="w-max">
              <Link href="/register">
                <Button
                  variant="outline"
                  className="w-auto bg-transparent text-slate-900 font-bold pl-2 pr-1 py-6 text-sm rounded-full border border-slate-900 hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer group"
                >
                  <span className="px-4">Register Now</span>
                  <div className="p-2 h-10 w-10 rounded-full flex items-center justify-center bg-blue-600 group-hover:bg-white transition-colors">
                    <ArrowRight className="text-white group-hover:text-blue-600 -rotate-45" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Links */}
          <div className="flex flex-col md:flex-row gap-12 md:justify-end">
            <div className="flex flex-col gap-4">
              <span className="text-sm font-semibold text-slate-900">Hub</span>
              <a
                href="#how"
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                How it works
              </a>
              <a
                href="#features"
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                Features
              </a>
              <Link
                href="/competitions"
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                Browse
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-sm font-semibold text-slate-900">
                Project
              </span>
              <Link
                href="#"
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                About Taakra
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                Community
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-sm font-semibold text-slate-900">
                Legal
              </span>
              <Link
                href="#"
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Middle: Massive Logo */}
        <div className="w-full flex justify-center items-center py-10 overflow-hidden">
          <h1 className="text-[12vw] leading-none font-bold text-slate-900 font-orenza tracking-tight select-none">
            Taakra
          </h1>
          <div className="md:w-10 md:h-10 w-4 h-4 rounded-full bg-transparent border-2 border-slate-100 ml-2 mt-4 md:mt-24 flex items-center justify-center">
            <div className="md:w-8 md:h-8 w-3 h-3 bg-blue-600 rounded-full" />
          </div>
        </div>

        {/* Bottom: Copyright & Extra Links */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-10 pt-10 border-t border-slate-100 gap-4">
          <div className="text-sm font-medium text-slate-500">
            © {new Date().getFullYear()} Taakra. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-xs text-slate-400 hover:text-slate-900 transition"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-slate-400 hover:text-slate-900 transition"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
