import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Bot, Cloud, Leaf, Sprout, Tractor, TrendingUp, Zap, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import heroImage from "@/assets/hero-farm.jpg";

const features = [
  { icon: BarChart3, title: "Precision Farming", desc: "AI-driven irrigation and fertilizer optimization based on real-time soil data." },
  { icon: Sprout, title: "Crop Monitoring", desc: "Drone imagery analysis and disease detection to protect your yields." },
  { icon: Tractor, title: "Smart Machinery", desc: "Autonomous task scheduling and fleet management for your equipment." },
  { icon: TrendingUp, title: "Yield Forecasting", desc: "Predictive analytics for harvest planning and market timing." },
  { icon: Bot, title: "AI Agents", desc: "Intelligent assistants that analyze data and provide actionable recommendations." },
  { icon: Cloud, title: "Weather Intelligence", desc: "Hyperlocal weather forecasting integrated with your farm operations." },
];

const stats = [
  { value: "40%", label: "Yield Increase" },
  { value: "60%", label: "Water Savings" },
  { value: "10K+", label: "Farms Connected" },
  { value: "99.9%", label: "Uptime" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#stats" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Results</a>
            <Link to="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="bg-gradient-hero hover:opacity-90" asChild>
              <Link to="/register">Get Started Free <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-background to-background" />
          <div className="absolute right-0 top-20 h-[500px] w-[500px] rounded-full bg-leaf/5 blur-3xl" />
          <div className="absolute -left-20 top-40 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-leaf/10 px-4 py-1.5 text-xs font-medium text-primary">
                <Zap className="h-3.5 w-3.5" /> AI-Powered Agriculture Platform
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Farm Smarter with{" "}
                <span className="text-gradient-hero">AgriMind AI</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Transform your agricultural operations with AI-driven insights. From precision farming to yield forecasting — make data-backed decisions that grow your bottom line.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" className="bg-gradient-hero px-8 text-base hover:opacity-90" asChild>
                  <Link to="/register">Start Free Trial <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base" asChild>
                  <Link to="/dashboard">View Demo Dashboard</Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-leaf" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-leaf" /> Setup in 5 minutes</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
              <div className="overflow-hidden rounded-2xl shadow-card-hover">
                <img src={heroImage} alt="Smart agriculture dashboard" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-xl border border-border bg-card p-4 shadow-card animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-leaf/10">
                    <TrendingUp className="h-5 w-5 text-leaf" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Yield Forecast</p>
                    <p className="font-display text-lg font-bold text-foreground">+32% <span className="text-xs text-leaf">↑</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y border-border bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="font-display text-4xl font-bold text-gradient-hero">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">Everything You Need to Farm Intelligently</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Comprehensive tools powered by AI to optimize every aspect of your agricultural operations.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-gradient-hero">
                  <f.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-earth px-8 py-16 text-center sm:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative">
              <Leaf className="mx-auto mb-6 h-12 w-12 text-leaf-foreground/80" />
              <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground sm:text-4xl">Ready to Transform Your Farm?</h2>
              <p className="mx-auto mb-8 max-w-xl text-lg text-primary-foreground/80">Join thousands of farmers already using AgriMind AI to increase yields, reduce costs, and farm sustainably.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary" className="px-8 text-base font-semibold" asChild>
                  <Link to="/register">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/20 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link to="/pricing">View Plans</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Logo />
            <p className="text-sm text-muted-foreground">© 2026 AgriMind AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
