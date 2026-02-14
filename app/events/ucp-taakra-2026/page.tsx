"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Code2,
  Shield,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/layouts/footer";

export default function UCPTaakraPage() {
  const subEvents = [
    {
      id: "speed-programming",
      title: "Speed Programming",
      description:
        "Solve algorithmic problems against the clock. Test your logic, speed, and coding skills.",
      icon: <Code2 className="h-8 w-8 text-blue-600" />,
      time: "10:00 AM - 1:00 PM",
      fee: "PKR 1500 / Team",
      teamSize: "1-3 Members",
    },
    {
      id: "ctf",
      title: "Capture the Flag (CTF)",
      description:
        "Uncover hidden flags through cybersecurity challenges. Cryptography, web exploitation, and forensics.",
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      time: "2:00 PM - 5:00 PM",
      fee: "PKR 2000 / Team",
      teamSize: "2-4 Members",
    },
    {
      id: "web-hackathon",
      title: "Web Hackathon",
      description:
        "Build a functional web solution for a real-world problem statement in a limited time.",
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      time: "9:00 AM - 6:00 PM (2 Days)",
      fee: "PKR 2500 / Team",
      teamSize: "2-4 Members",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="fixed top-0 z-30 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="text-xl font-bold font-orenza tracking-wide flex items-center">
            Taakra
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 ml-0.5" />
          </div>
          <div className="w-[100px]"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-5">
          <div className="rounded-3xl bg-slate-900 p-8 md:p-12 lg:p-16 text-white overflow-hidden relative">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 mb-6">
                Featured Event
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-walsheim">
                UCP Taakra 2026
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
                Join the ultimate showdown of tech talent at the University of
                Central Punjab. Competitions, networking, and exciting prizes
                await the champions.
              </p>

              <div className="flex flex-wrap gap-6 mb-8 text-sm font-medium text-slate-300">
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span>March 15-16, 2026</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span>UCP Campus, Lahore</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                  <Trophy className="h-4 w-4 text-blue-400" />
                  <span>PKR 500,000 Prize Pool</span>
                </div>
              </div>
            </div>

            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          </div>
        </section>

        {/* Competitions Section */}
        <section className="mx-auto max-w-6xl px-5 mt-16">
          <h2 className="text-3xl font-bold mb-8">Featured Competitions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow group flex flex-col h-full"
              >
                <div className="mb-4 p-3 bg-blue-50 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                  {event.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-3 mb-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Time</span>
                    <span className="font-medium text-slate-900">
                      {event.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Team Size</span>
                    <span className="font-medium text-slate-900">
                      {event.teamSize}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Reg Fee</span>
                    <span className="font-medium text-slate-900">
                      {event.fee}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/register?competition=${event.id}`}
                  className="w-full"
                >
                  <Button className="w-full rounded-xl group-hover:bg-blue-600 transition-colors h-11 font-medium">
                    Register Team
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Rules & Info Section using file icons as requested (simulated with lucide for now as public access is preferred via URL) */}
        <section className="mx-auto max-w-6xl px-5 mt-16 mb-20">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-slate-900 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              General Rules
            </h3>
            <ul className="grid md:grid-cols-2 gap-4 text-slate-600 text-sm list-disc pl-5">
              <li>Participants must bring their own laptops.</li>
              <li>University ID card is mandatory for entry.</li>
              <li>Internet access will be provided by UCP.</li>
              <li>
                Any form of cheating or plagiarism will lead to immediate
                disqualification.
              </li>
              <li>Decisions made by the judges will be final and binding.</li>
              <li>
                Teams must report 30 minutes before the competition starts.
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
