import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic farm analytics",
    features: [
      "Overview dashboard",
      "Basic weather widget",
      "Crop health index",
      "1 AI analysis per day",
      "Community support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Full access to AI agents and analytics",
    features: [
      "Everything in Free",
      "Precision farming module",
      "Crop monitoring & disease detection",
      "Yield forecasting",
      "Unlimited AI analyses",
      "Priority support",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large farms and agribusiness",
    features: [
      "Everything in Pro",
      "Autonomous machinery control",
      "Livestock monitoring",
      "Custom AI models",
      "Multi-farm management",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </nav>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h1 className="mb-4 font-display text-4xl font-bold">Simple, Transparent Pricing</h1>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">Choose the plan that fits your farm. Start free, upgrade when you're ready.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-8 ${plan.popular ? "border-primary shadow-glow" : "border-border shadow-card"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-hero px-4 py-1 text-xs font-semibold text-primary-foreground">
                    <Star className="h-3 w-3" /> Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <Button className={`mt-6 w-full ${plan.popular ? "bg-gradient-hero hover:opacity-90" : ""}`} variant={plan.popular ? "default" : "outline"} asChild>
                  <Link to="/register">{plan.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <ul className="mt-8 space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
