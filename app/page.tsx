"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Filter,
  Infinity,
  Lock,
  Search,
  Sparkles,
  Wand2,
  User,
  LogOut,
  Trophy,
  Users,
  Target,
  ChevronDown,
  Code2,
  Cpu,
  Globe,
  Database,
  Shield,
  Briefcase,
  Megaphone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Footer from "@/components/layouts/footer";
import { UpcomingEvents } from "@/components/landing/upcoming-events";

export default function LandingPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-xl sm:text-2xl tracking-wide font-semibold text-slate-800 flex items-center font-orenza">
            Taakra
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 ml-0.5" />
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-slate-900 focus:outline-none">
                Categories <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem>
                  <Code2 className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Hackathons</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Cpu className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Robotics</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Globe className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Web Development</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Database className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Data Science</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Cyber Security</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Briefcase className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Business Case</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Megaphone className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Marketing</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <a href="#how" className="transition hover:text-slate-900">
              How it works
            </a>
            <a href="#features" className="transition hover:text-slate-900">
              Features
            </a>
            <Link
              href="/competitions"
              className="transition hover:text-slate-900"
            >
              Browse
            </Link>
          </nav>
          <div className="flex items-center gap-2 font-inter">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="outline" className="rounded-full">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-slate-500 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="rounded-full px-4 text-sm font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/login?mode=signup">
                  <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6 text-sm font-semibold transition-all hover:scale-105">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-16 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-8">
          <div className="flex w-fit items-center gap-2 rounded-full border border-slate-300/60 bg-white/70 px-4 py-2 text-xs font-normal text-slate-600 font-outfit uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Pakistan's Premier Competition Discovery Platform
          </div>
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              Where Ambition Meets Competition
            </h1>
            <p className="max-w-xl text-base text-slate-600 sm:text-lg text-balance font-inter leading-relaxed">
              Taakra connects talent with high-impact academic and technical
              competitions across Pakistan. Whether you're a student,
              professional, or enthusiast, find your stage to compete and excel.
            </p>
          </div>

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

          <div className="grid gap-4 sm:grid-cols-3 font-outfit">
            {[
              { label: "Universities", value: "50+" },
              { label: "Competitions", value: "200+" },
              { label: "Participants", value: "15k+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200/70 bg-white/70 p-4"
              >
                <p className="text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Student-Centric",
                copy: "Verified registrations exclusively for university students with .edu.pk emails.",
                icon: <Users className="h-5 w-5 text-blue-600 mb-2" />,
              },
              {
                title: "Real-time Updates",
                copy: "Get notified instantly about new competitions and your registration status.",
                icon: <Target className="h-5 w-5 text-blue-600 mb-2" />,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/70 bg-white/70 p-5 group hover:border-blue-300 transition-colors"
              >
                {item.icon}
                <p className="text-sm font-semibold text-slate-900 font-walsheim">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 leading-normal font-inter">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
          {/* Decorative element */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10" />
        </div>
      </section>

      <section id="how" className="mx-auto w-full max-w-6xl px-5 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white">
            <Trophy className="mb-4 h-8 w-8 text-blue-400" />
            <h2 className="text-3xl font-semibold font-walsheim">
              Verified & Secured.
            </h2>
            <p className="mt-3 text-sm text-slate-300 font-inter leading-relaxed">
              Sign up with your official university email to join the Taakra
              community. Our platform ensures that only genuine students
              participate in competitions.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Browse Competitions",
                copy: "Explore a wide range of technical, academic, and creative contests.",
              },
              {
                title: "Form Your Team",
                copy: "Connect with peers or register your existing team members seamlessly.",
              },
              {
                title: "Submit Registration",
                copy: "Fill out the quick form and wait for organizer approval.",
              },
              {
                title: "Track Status",
                copy: "Monitor your dashboard for real-time updates on your participation.",
              },
            ].map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 font-inter"
              >
                <p className="text-xs font-semibold text-blue-600 font-outfit mb-1">
                  Step {index + 1}
                </p>
                <p className="text-base font-semibold text-slate-900 font-walsheim mb-1">
                  {step.title}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed font-inter">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <UpcomingEvents />

      <section id="features" className="mx-auto w-full max-w-6xl px-5 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-slate-900 sm:text-5xl font-walsheim">
            Built for Success
          </h2>
          <p className="mt-4 text-base text-slate-600 font-inter">
            Everything you need to discover and excel in the competition
            circuit.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 group hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900 font-walsheim">
              Smart Filtering
            </h3>
            <p className="mt-2 text-sm text-slate-600 font-inter leading-relaxed">
              Find exactly what you're looking for. Filter by category
              (Hackathons, Case Studies, Seminars), university, or registration
              status.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm group hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900 font-walsheim">
              Secure Auth
            </h3>
            <p className="mt-2 text-sm text-slate-600 font-inter leading-relaxed">
              Firebase-powered secure authentication with .edu.pk restriction to
              maintain the integrity of student competitions.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm group hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Filter className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900 font-walsheim">
              Unified Dashboard
            </h3>
            <p className="mt-2 text-sm text-slate-600 font-inter leading-relaxed">
              One place to manage everything. See your active, pending, and past
              registrations along with organizer notes.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm group hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Trophy className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900 font-walsheim">
              Achievement Hub
            </h3>
            <p className="mt-2 text-sm text-slate-600 font-inter leading-relaxed">
              Coming soon: Showcase your wins and certifications directly on
              your public profile to impress future employers.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm group hover:shadow-md transition-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Infinity className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900 font-walsheim">
              100% Student-Focused
            </h3>
            <p className="mt-2 text-sm text-slate-600 font-inter leading-relaxed">
              Free to use for students. Created to build the largest student
              competition community in Pakistan.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
