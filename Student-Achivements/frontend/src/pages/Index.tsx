import { Link } from "react-router-dom";
import { Shield, FileCheck, Trophy, ArrowRight, LayoutDashboard, UserPlus } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Centralized Portfolio",
    desc: "One secure location for all academic records, achievements, and identity documents.",
  },
  {
    icon: FileCheck,
    title: "Easy Verification",
    desc: "Instant document verification with status tracking for administrators and students.",
  },
  {
    icon: Trophy,
    title: "Achievement Tracking",
    desc: "Track hackathons, internships, research papers, sports, and cultural activities.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-20">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/15 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <LayoutDashboard className="w-3.5 h-3.5" />
              Student Achievement Management
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              Your Academic Legacy, Verified.
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              A comprehensive system for managing student profiles, tracking achievements, and verifying academic documents — all in one secure platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 border border-border bg-card/80 backdrop-blur-sm text-foreground px-6 py-3 rounded-md font-medium hover:bg-card transition-colors">
                Student Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-6 shadow-sm">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2024 CSAPMS — Comprehensive Student Achievement and Profile Management System
        </div>
      </footer>
    </div>
  );
}
