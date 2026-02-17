import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import authBg from "@/assets/auth-bg.jpg";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Account created!", description: "Welcome to AgriMind AI." });
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 lg:flex lg:flex-col lg:justify-between lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={authBg} alt="African farmland" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full">
        <Logo variant="light" />
        <div>
          <h2 className="mb-3 font-display text-3xl font-bold text-primary-foreground">Start your journey with AgriMind AI</h2>
          <p className="text-primary-foreground/70">Free plan includes dashboard access, basic analytics, and AI recommendations.</p>
        </div>
        <p className="text-sm text-primary-foreground/50">© 2026 AgriMind AI</p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 lg:w-1/2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="mb-2 font-display text-2xl font-bold">Create your free account</h1>
          <p className="mb-8 text-muted-foreground">Get started with AgriMind AI in minutes</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Farmer" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="farmer@agrimind.ai" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-hero hover:opacity-90">Create Account <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
