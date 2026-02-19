import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Satellite, Bug, Camera, TrendingUp, Activity, AlertTriangle,
  Upload, Bot, Eye, RefreshCw, ChevronDown, Clock, Check,
  Thermometer, Droplets, Leaf, Layers, ZoomIn, ZoomOut,
  MessageCircle, Image, Shield, Sprout, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { cn } from "@/lib/utils";

// ─── Mock Data ───────────────────────────────────────────────

const healthTrendData = [
  { week: "W1", health: 76 },
  { week: "W2", health: 78 },
  { week: "W3", health: 74 },
  { week: "W4", health: 80 },
  { week: "W5", health: 82 },
  { week: "W6", health: 79 },
  { week: "W7", health: 84 },
  { week: "W8", health: 84 },
];

const fieldOverlays = ["Satellite", "NDVI", "Moisture", "Temperature"] as const;

const diseaseAlerts = [
  {
    id: 1,
    disease: "Leaf Rust",
    field: "Field B",
    confidence: 87,
    severity: "High" as const,
    image: "🍂",
    description: "Possible Leaf Rust detected in northern section of Field B. Early treatment recommended.",
  },
  {
    id: 2,
    disease: "Powdery Mildew",
    field: "Field A",
    confidence: 72,
    severity: "Medium" as const,
    image: "🌿",
    description: "Early signs of Powdery Mildew in Field A east corner. Monitor closely.",
  },
  {
    id: 3,
    disease: "Aphid Infestation",
    field: "Field C",
    confidence: 64,
    severity: "Low" as const,
    image: "🐛",
    description: "Minor aphid activity detected in Field C. No immediate action needed.",
  },
];

const droneCaptures = [
  { id: 1, date: "Feb 17, 2026", field: "Field A", tag: "Healthy", tagColor: "leaf" },
  { id: 2, date: "Feb 16, 2026", field: "Field B", tag: "Stress", tagColor: "warning" },
  { id: 3, date: "Feb 15, 2026", field: "Field C", tag: "Healthy", tagColor: "leaf" },
  { id: 4, date: "Feb 14, 2026", field: "Field A", tag: "Disease", tagColor: "destructive" },
  { id: 5, date: "Feb 13, 2026", field: "Field B", tag: "Healthy", tagColor: "leaf" },
  { id: 6, date: "Feb 12, 2026", field: "Field C", tag: "Stress", tagColor: "warning" },
];

const fieldStats = [
  { label: "Field A Health", value: 88, unit: "%", trend: "+4%", up: true, icon: Sprout },
  { label: "Field B Stress", value: 32, unit: "%", trend: "+8%", up: true, icon: AlertTriangle },
  { label: "Pest Risk Index", value: 18, unit: "/100", trend: "-3", up: false, icon: Bug },
  { label: "Growth Rate", value: 2.4, unit: "cm/day", trend: "+0.3", up: true, icon: TrendingUp },
];

const fieldAlerts = [
  { id: 1, icon: Bug, text: "Pest risk increasing in Field C — monitoring threshold breached", time: "15 min ago", severity: "warning" },
  { id: 2, icon: Droplets, text: "Moisture imbalance detected in north sector of Field A", time: "1 hr ago", severity: "info" },
  { id: 3, icon: Activity, text: "Crop stress detected in Field B — leaf temperature elevated", time: "2 hr ago", severity: "error" },
  { id: 4, icon: Leaf, text: "NDVI values improving in Field C south — recovery underway", time: "4 hr ago", severity: "info" },
  { id: 5, icon: AlertTriangle, text: "Unusual growth pattern in Field A row 12 — manual inspection suggested", time: "6 hr ago", severity: "warning" },
];

// ─── NDVI Field Map Component ────────────────────────────────

const NDVIFieldMap = ({ overlay }: { overlay: string }) => {
  const overlayColors: Record<string, string[]> = {
    Satellite: ["hsl(120,30%,35%)", "hsl(100,25%,45%)", "hsl(80,20%,55%)"],
    NDVI: ["hsl(0,72%,51%)", "hsl(45,93%,47%)", "hsl(122,39%,49%)"],
    Moisture: ["hsl(30,60%,50%)", "hsl(199,50%,55%)", "hsl(211,78%,46%)"],
    Temperature: ["hsl(211,78%,46%)", "hsl(45,93%,47%)", "hsl(0,72%,51%)"],
  };
  const colors = overlayColors[overlay] || overlayColors.NDVI;

  return (
    <svg viewBox="0 0 600 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="fieldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[2]} stopOpacity="0.8" />
          <stop offset="50%" stopColor={colors[1]} stopOpacity="0.7" />
          <stop offset="100%" stopColor={colors[2]} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="fieldGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors[1]} stopOpacity="0.7" />
          <stop offset="60%" stopColor={colors[0]} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors[1]} stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="fieldGrad3" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors[2]} stopOpacity="0.9" />
          <stop offset="40%" stopColor={colors[1]} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors[0]} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="600" height="300" fill="hsl(100,12%,94%)" rx="12" />
      {/* Grid lines */}
      {[...Array(7)].map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} stroke="hsl(100,12%,88%)" strokeWidth="0.5" />
      ))}
      {[...Array(13)].map((_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="300" stroke="hsl(100,12%,88%)" strokeWidth="0.5" />
      ))}
      {/* Field A */}
      <motion.polygon
        points="50,40 220,30 240,140 60,150"
        fill="url(#fieldGrad1)"
        stroke="hsl(122,39%,49%)"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <text x="130" y="95" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Field A</text>
      {/* Field B */}
      <motion.polygon
        points="260,25 440,35 430,160 250,145"
        fill="url(#fieldGrad2)"
        stroke="hsl(45,93%,47%)"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      />
      <text x="340" y="95" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Field B</text>
      {/* Field C */}
      <motion.polygon
        points="460,40 570,50 560,155 450,148"
        fill="url(#fieldGrad3)"
        stroke="hsl(211,78%,46%)"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      <text x="510" y="100" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Field C</text>
      {/* Field D (bottom) */}
      <motion.polygon
        points="80,170 350,165 340,270 70,275"
        fill="url(#fieldGrad1)"
        stroke="hsl(122,39%,49%)"
        strokeWidth="2"
        strokeDasharray="6 3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.45 }}
      />
      <text x="200" y="225" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Field D</text>
      {/* Marker pins */}
      <circle cx="140" cy="85" r="4" fill="white" stroke="hsl(122,39%,49%)" strokeWidth="2" />
      <circle cx="340" cy="85" r="4" fill="white" stroke="hsl(45,93%,47%)" strokeWidth="2" />
      <circle cx="510" cy="90" r="4" fill="white" stroke="hsl(211,78%,46%)" strokeWidth="2" />
    </svg>
  );
};

// ─── Sub-Components ──────────────────────────────────────────

const DiseaseCard = ({ alert }: { alert: typeof diseaseAlerts[0] }) => {
  const severityColors = {
    High: "bg-destructive/10 text-destructive border-destructive/20",
    Medium: "bg-warning/10 text-warning border-warning/20",
    Low: "bg-leaf/10 text-leaf border-leaf/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-2xl">
          {alert.image}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold">{alert.disease}</p>
            <Badge variant="outline" className={cn("text-[10px]", severityColors[alert.severity])}>
              {alert.severity}
            </Badge>
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-[10px]">
              <Check className="mr-0.5 h-2.5 w-2.5" /> {alert.confidence}%
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{alert.field}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{alert.description}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs">
              <Eye className="mr-1 h-3 w-3" /> View Details
            </Button>
            <Button size="sm" className="h-7 bg-accent text-accent-foreground hover:bg-accent/90 text-xs">
              <RefreshCw className="mr-1 h-3 w-3" /> Run New Scan
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DroneImageCard = ({ capture }: { capture: typeof droneCaptures[0] }) => {
  const tagColors: Record<string, string> = {
    leaf: "bg-leaf/10 text-leaf border-leaf/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      className="group rounded-xl border border-border bg-card overflow-hidden shadow-card transition-shadow hover:shadow-card-hover"
    >
      {/* Image placeholder */}
      <div className="relative h-28 bg-gradient-to-br from-leaf/20 via-primary/10 to-accent/10 flex items-center justify-center">
        <Camera className="h-8 w-8 text-muted-foreground/40" />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
        <Badge variant="outline" className={cn("absolute top-2 right-2 text-[10px]", tagColors[capture.tagColor])}>
          {capture.tag}
        </Badge>
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold">{capture.field}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" /> {capture.date}
        </p>
      </div>
    </motion.div>
  );
};

const StatCard = ({ stat }: { stat: typeof fieldStats[0] }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover"
  >
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
        <stat.icon className="h-4 w-4 text-primary" />
      </div>
      <span className="text-xs text-muted-foreground">{stat.label}</span>
    </div>
    <div className="mt-3 flex items-end gap-2">
      <span className="text-2xl font-bold">{stat.value}</span>
      <span className="mb-0.5 text-xs text-muted-foreground">{stat.unit}</span>
      <span className={cn(
        "mb-0.5 ml-auto flex items-center text-xs font-medium",
        stat.up ? (stat.label.includes("Stress") || stat.label.includes("Pest") ? "text-destructive" : "text-leaf") : (stat.label.includes("Stress") || stat.label.includes("Pest") ? "text-leaf" : "text-destructive")
      )}>
        {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {stat.trend}
      </span>
    </div>
  </motion.div>
);

const AlertItem = ({ alert }: { alert: typeof fieldAlerts[0] }) => {
  const severityColors = {
    error: "border-l-destructive",
    warning: "border-l-warning",
    info: "border-l-accent",
  };
  const iconColors = {
    error: "text-destructive",
    warning: "text-warning",
    info: "text-accent",
  };

  return (
    <div className={cn("flex items-start gap-3 rounded-lg border-l-4 bg-muted/50 p-3 transition-colors hover:bg-muted", severityColors[alert.severity as keyof typeof severityColors])}>
      <alert.icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconColors[alert.severity as keyof typeof iconColors])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">{alert.text}</p>
        <p className="mt-1 text-xs text-muted-foreground">{alert.time}</p>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────

const CropMonitoring = () => {
  const [selectedField, setSelectedField] = useState("All Fields");
  const [activeOverlay, setActiveOverlay] = useState<typeof fieldOverlays[number]>("NDVI");
  const [timeRange, setTimeRange] = useState<"Weekly" | "Monthly">("Weekly");

  const fields = ["All Fields", "Field A", "Field B", "Field C", "Field D"];
  const overlayIcons: Record<string, React.ElementType> = {
    Satellite: Satellite,
    NDVI: Layers,
    Moisture: Droplets,
    Temperature: Thermometer,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Crop Monitoring</h1>
          <p className="mt-1 text-muted-foreground">
            Monitor crop health using satellite imagery and AI detection.
          </p>
        </div>

        {/* ───── HERO: Field Map Viewer ───── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card-hover overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">Farm Field Overview</CardTitle>
                  <Badge variant="outline" className="bg-leaf/10 text-leaf border-leaf/20 text-xs">
                    <Clock className="mr-1 h-3 w-3" /> Last scan: 2 hours ago
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {/* Field selector */}
                  <div className="relative">
                    <select
                      value={selectedField}
                      onChange={(e) => setSelectedField(e.target.value)}
                      className="appearance-none rounded-lg border border-border bg-background px-3 py-1.5 pr-7 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {fields.map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Overlay toggles */}
              <div className="flex flex-wrap items-center gap-2">
                {fieldOverlays.map((o) => {
                  const Icon = overlayIcons[o];
                  return (
                    <button
                      key={o}
                      onClick={() => setActiveOverlay(o)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                        activeOverlay === o
                          ? "bg-accent text-accent-foreground shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {o}
                    </button>
                  );
                })}
                <div className="ml-auto flex gap-1">
                  <button className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                    <ZoomOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Map */}
              <div className="relative rounded-xl border border-border overflow-hidden bg-muted/30" style={{ minHeight: 260 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NDVIFieldMap overlay={activeOverlay} />
                  </motion.div>
                </AnimatePresence>
                {/* Legend */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-card/90 px-3 py-1.5 text-[10px] font-medium shadow-sm backdrop-blur-sm border border-border">
                  {activeOverlay === "NDVI" && (
                    <>
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(0,72%,51%)" }} /> Low</span>
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(45,93%,47%)" }} /> Medium</span>
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(122,39%,49%)" }} /> High</span>
                    </>
                  )}
                  {activeOverlay === "Moisture" && (
                    <>
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(30,60%,50%)" }} /> Dry</span>
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(199,50%,55%)" }} /> Moderate</span>
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(211,78%,46%)" }} /> Wet</span>
                    </>
                  )}
                  {activeOverlay === "Temperature" && (
                    <>
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(211,78%,46%)" }} /> Cool</span>
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(45,93%,47%)" }} /> Warm</span>
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "hsl(0,72%,51%)" }} /> Hot</span>
                    </>
                  )}
                  {activeOverlay === "Satellite" && (
                    <span>RGB Composite View</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ───── ROW 2: Disease Detection + Drone Images ───── */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* CARD 2 — Disease Detection */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="h-full border-destructive/10 bg-gradient-to-br from-card via-card to-destructive/3 shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-lg">AI Disease Detection</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {diseaseAlerts.map((alert) => (
                  <DiseaseCard key={alert.id} alert={alert} />
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* CARD 3 — Drone Image Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            <Card className="h-full shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-earth" />
                    <CardTitle className="text-lg">Recent Drone Captures</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Upload className="mr-1 h-3 w-3" /> Upload
                    </Button>
                    <Button size="sm" className="h-7 bg-accent text-accent-foreground hover:bg-accent/90 text-xs">
                      <Bot className="mr-1 h-3 w-3" /> Analyze with AI
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {droneCaptures.map((c) => (
                    <DroneImageCard key={c.id} capture={c} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ───── ROW 3: Health Trend + Field Stats ───── */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* CARD 4 — Crop Health Trend */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="shadow-card h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-leaf" />
                      <CardTitle className="text-lg">Crop Health Trend</CardTitle>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-3xl font-bold">84%</span>
                      <Badge variant="outline" className="bg-leaf/10 text-leaf border-leaf/20 text-xs">
                        <ArrowUpRight className="mr-0.5 h-3 w-3" /> +6% this month
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 rounded-lg bg-muted p-0.5">
                    {(["Weekly", "Monthly"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setTimeRange(r)}
                        className={cn(
                          "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                          timeRange === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={healthTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(100, 12%, 88%)" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(120, 8%, 46%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(120, 8%, 46%)" domain={[60, 100]} unit="%" />
                    <RechartsTooltip contentStyle={{ borderRadius: 10, border: "1px solid hsl(100,12%,88%)", fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="health"
                      name="Health Index"
                      stroke="hsl(122, 39%, 49%)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "hsl(122,39%,49%)" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* CARD 5 — Field Performance Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2"
          >
            <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {fieldStats.map((stat, i) => (
                <StatCard key={i} stat={stat} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ───── ROW 4: Field Alert Feed ───── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <CardTitle className="text-lg">Field Alert Feed</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {fieldAlerts.map((a) => (
                  <AlertItem key={a.id} alert={a} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ───── FLOATING AI BUTTON ───── */}
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Ask AgriMind AI about crop health</p>
        </TooltipContent>
      </Tooltip>
    </DashboardLayout>
  );
};

export default CropMonitoring;
