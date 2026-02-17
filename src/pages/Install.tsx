import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Monitor, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  const steps = [
    { icon: Smartphone, title: "Android", desc: "Tap the install button below, or use your browser menu → 'Add to Home Screen'." },
    { icon: Monitor, title: "Windows / Desktop", desc: "Click install in Chrome/Edge address bar, or use browser menu → 'Install App'." },
    { icon: Download, title: "iPhone / iPad", desc: "Open in Safari → tap Share → 'Add to Home Screen'." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Logo />
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {isInstalled ? (
            <div className="mb-8">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-leaf" />
              <h1 className="mb-2 font-display text-3xl font-bold">App Installed!</h1>
              <p className="text-muted-foreground">AgriMind AI is ready on your device.</p>
            </div>
          ) : (
            <>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-hero">
                <Download className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="mb-3 font-display text-3xl font-bold">Install AgriMind AI</h1>
              <p className="mb-8 text-lg text-muted-foreground">
                Install the app on your device for quick access, offline support, and a native app experience.
              </p>

              {deferredPrompt && (
                <Button size="lg" className="mb-10 bg-gradient-hero px-8 text-base hover:opacity-90" onClick={handleInstall}>
                  Install Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </>
          )}

          <div className="grid gap-4 text-left sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.title} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <s.icon className="mb-3 h-8 w-8 text-primary" />
                <h3 className="mb-1 font-display font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Install;
