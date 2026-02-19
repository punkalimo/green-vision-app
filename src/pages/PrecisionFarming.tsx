import { useState } from "react";
import { motion } from "framer-motion";
import {
  Droplets, Bot, AlertTriangle, Cloud, Sun, Zap, Wifi, WifiOff,
  BatteryFull, BatteryMedium, BatteryLow, RefreshCw, ChevronDown,
  TrendingDown, Leaf, FlaskConical, Activity, Clock, Check,
  CloudRain, CloudSun, Wind, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { cn } from "@/lib/utils";

// ─── Mock Data ───────────────────────────────────────────────
const moistureData7d = [
  { day: "Mon", fieldA: 72, fieldB: 65, fieldC: 58 },
  { day: "Tue", fieldA: 68, fieldB: 62, fieldC: 55 },
  { day: "Wed", fieldA: 64, fieldB: 60, fieldC: 52 },
  { day: "Thu", fieldA: 70, fieldB: 58, fieldC: 48 },
  { day: "Fri", fieldA: 75, fieldB: 63, fieldC: 45 },
  { day: "Sat", fieldA: 71, fieldB: 66, fieldC: 50 },
  { day: "Sun", fieldA: 69, fieldB: 64, fieldC: 53 },
];

const nutrientData = [
  { nutrient: "Nitrogen (N)", current: 78, optimal: 90, unit: "kg/ha" },
  { nutrient: "Phosphorus (P)", current: 45, optimal: 50, unit: "kg/ha" },
  { nutrient: "Potassium (K)", current: 62, optimal: 60, unit: "kg/ha" },
];

const sensors = [
  { id: 1, name: "Field A Sensor #1", battery: 92, signal: "strong", lastSync: "2 min ago", status: "healthy" },
  { id: 2, name: "Field A Sensor #2", battery: 78, signal: "strong", lastSync: "5 min ago", status: "healthy" },
  { id: 3, name: "Field B Sensor #1", battery: 45, signal: "medium", lastSync: "12 min ago", status: "warning" },
  { id: 4, name: "Field B Sensor #2", battery: 15, signal: "weak", lastSync: "1 hr ago", status: "warning" },
  { id: 5, name: "Field C Sensor #1", battery: 88, signal: "strong", lastSync: "3 min ago", status: "healthy" },
  { id: 6, name: "Field C Sensor #2", battery: 0, signal: "none", lastSync: "3 days ago", status: "offline" },
];

const alerts = [
  { id: 1, icon: Droplets, text: "Low moisture detected in Field C — below 50% threshold", time: "12 min ago", severity: "error" },
  { id: 2, icon: CloudRain, text: "Rain expected tomorrow — 78% probability, consider delaying irrigation", time: "1 hr ago", severity: "info" },
  { id: 3, icon: FlaskConical, text: "Fertilizer levels dropping in Field B — nitrogen at 65%", time: "2 hr ago", severity: "warning" },
  { id: 4, icon: AlertTriangle, text: "Sensor #4 battery critically low — replace within 24 hours", time: "3 hr ago", severity: "warning" },
  { id: 5, icon: Activity, text: "Soil pH anomaly detected in Field A — recommend manual testing", time: "5 hr ago", severity: "error" },
];

const weatherForecast = [
  { day: "Today", icon: Sun, temp: "28°C", rain: "10%" },
  { day: "Tomorrow", icon: CloudRain, temp: "24°C", rain: "78%" },
  { day: "Wed", icon: CloudSun, temp: "26°C", rain: "35%" },
];

// ─── Sub-Components ──────────────────────────────────────────

const MoistureGauge = ({ value }: { value: number }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  const color = value > 60 ? "hsl(122, 39%, 49%)" : value > 40 ? "hsl(45, 93%, 47%)" : "hsl(0, 72%, 51%)";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="hsl(100, 12%, 88%)" strokeWidth="10" />
        <motion.circle
          cx="65" cy="65" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold">{value}%</span>
        <span className="text-xs text-muted-foreground">Moisture</span>
      </div>
    </div>
  );
};

const SensorCard = ({ sensor }: { sensor: typeof sensors[0] }) => {
  const statusColors = {
    healthy: "bg-leaf/10 text-leaf border-leaf/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    offline: "bg-destructive/10 text-destructive border-destructive/20",
  };
  const BatteryIcon = sensor.battery > 60 ? BatteryFull : sensor.battery > 20 ? BatteryMedium : BatteryLow;
  const SignalIcon = sensor.signal === "none" ? WifiOff : Wifi;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold truncate pr-2">{sensor.name}</p>
        <Badge variant="outline" className={cn("text-[10px] capitalize", statusColors[sensor.status as keyof typeof statusColors])}>
          {sensor.status}
        </Badge>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <BatteryIcon className={cn("h-3.5 w-3.5", sensor.battery <= 20 ? "text-destructive" : "text-muted-foreground")} />
          {sensor.battery}%
        </span>
        <span className="flex items-center gap-1">
          <SignalIcon className={cn("h-3.5 w-3.5", sensor.signal === "none" ? "text-destructive" : sensor.signal === "weak" ? "text-warning" : "text-muted-foreground")} />
          {sensor.signal}
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="h-3 w-3" />
          {sensor.lastSync}
        </span>
      </div>
    </motion.div>
  );
};

const AlertItem = ({ alert }: { alert: typeof alerts[0] }) => {
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

const PrecisionFarming = () => {
  const [selectedField, setSelectedField] = useState("Field A");
  const [fertilizerField, setFertilizerField] = useState("Field B");
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

  const fields = ["Field A", "Field B", "Field C"];
  const moistureValues: Record<string, number> = { "Field A": 69, "Field B": 64, "Field C": 53 };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Precision Farming</h1>
          <p className="mt-1 text-muted-foreground">
            Optimize irrigation, fertilizer and soil health using AI insights.
          </p>
        </div>

        {/* ───── ROW 1: Hero + Soil Moisture ───── */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* CARD 1 — AI Irrigation Hero */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-card via-card to-accent/5 shadow-card-hover">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-accent/5" />
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Bot className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">AI Irrigation Recommendation</CardTitle>
                  <Badge className="bg-warning/10 text-warning border-warning/20 text-xs">
                    Action Needed Tomorrow
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* AI Message */}
                <div className="rounded-xl bg-accent/5 border border-accent/10 p-4">
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold text-accent">💧 Recommendation:</span>{" "}
                    Irrigate <strong>{selectedField}</strong> at <strong>06:00 AM</strong> for optimal moisture levels.
                    Rain probability for tomorrow is 78% — consider reducing irrigation volume by 30%.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="bg-leaf/10 text-leaf border-leaf/20 text-xs">
                      <Check className="mr-1 h-3 w-3" /> 92% confidence
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  {/* Field Selector + Gauge */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-full">
                      <select
                        value={selectedField}
                        onChange={(e) => setSelectedField(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {fields.map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                    <MoistureGauge value={moistureValues[selectedField]} />
                  </div>

                  {/* Weather Mini Forecast */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weather Forecast</p>
                    {weatherForecast.map((w) => (
                      <div key={w.day} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                        <w.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm flex-1">{w.day}</span>
                        <span className="text-sm font-semibold">{w.temp}</span>
                        <span className="text-xs text-accent">{w.rain} 🌧</span>
                      </div>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="flex flex-col justify-between gap-3">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Stats</p>
                      <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Last Irrigated</span>
                          <span className="font-medium">2 days ago</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Water Saved</span>
                          <span className="font-medium text-leaf">1,240 L</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Next Window</span>
                          <span className="font-medium text-accent">Tomorrow 6AM</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      <Bot className="mr-2 h-4 w-4" /> Run AI Analysis
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CARD 2 — Soil Moisture Trends */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="h-full shadow-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Soil Moisture Trends</CardTitle>
                  <div className="flex gap-1 rounded-lg bg-muted p-0.5">
                    {(["7d", "30d", "90d"] as const).map((r) => (
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
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={moistureData7d}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(100, 12%, 88%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(120, 8%, 46%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(120, 8%, 46%)" domain={[30, 100]} unit="%" />
                    <RechartsTooltip contentStyle={{ borderRadius: 10, border: "1px solid hsl(100,12%,88%)", fontSize: 12 }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="fieldA" name="Field A" stroke="hsl(122, 39%, 49%)" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="fieldB" name="Field B" stroke="hsl(211, 78%, 46%)" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="fieldC" name="Field C" stroke="hsl(45, 93%, 47%)" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ───── ROW 2: Fertilizer + Sensors ───── */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* CARD 3 — Fertilizer Optimization */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="shadow-card h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-leaf" />
                    <CardTitle className="text-lg">Fertilizer Optimization</CardTitle>
                  </div>
                  <div className="relative">
                    <select
                      value={fertilizerField}
                      onChange={(e) => setFertilizerField(e.target.value)}
                      className="appearance-none rounded-lg border border-border bg-background px-3 py-1.5 pr-7 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {fields.map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AI Recommendation */}
                <div className="rounded-lg bg-leaf/5 border border-leaf/10 p-3">
                  <p className="text-sm">
                    <span className="font-semibold text-leaf">🌱 AI Insight:</span>{" "}
                    Reduce nitrogen usage by <strong>12%</strong> in {fertilizerField}. Current levels exceed crop requirements, leading to potential runoff.
                  </p>
                  <Badge variant="outline" className="mt-2 bg-leaf/10 text-leaf border-leaf/20 text-xs">
                    <Check className="mr-1 h-3 w-3" /> 88% confidence
                  </Badge>
                </div>

                {/* Nutrient Bars */}
                <div className="space-y-3">
                  {nutrientData.map((n) => {
                    const pct = (n.current / n.optimal) * 100;
                    const isOver = pct > 100;
                    return (
                      <div key={n.nutrient}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium">{n.nutrient}</span>
                          <span className="text-muted-foreground">
                            {n.current}/{n.optimal} {n.unit}
                          </span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className={cn("h-full rounded-full", isOver ? "bg-warning" : "bg-leaf")}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(pct, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button className="w-full bg-leaf text-leaf-foreground hover:bg-leaf/90">
                  <Leaf className="mr-2 h-4 w-4" /> Apply Fertilizer Plan
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* CARD 4 — Sensor Status */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Soil Sensor Status</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                    <RefreshCw className="mr-1 h-3 w-3" /> Sync All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {sensors.map((sensor) => (
                    <SensorCard key={sensor.id} sensor={sensor} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ───── ROW 3: Alerts ───── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <CardTitle className="text-lg">AI Alerts Feed</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">{alerts.length} active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1 scrollbar-thin">
                {alerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ───── Floating AI Button ───── */}
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Ask AgriMind AI</p>
        </TooltipContent>
      </Tooltip>
    </DashboardLayout>
  );
};

export default PrecisionFarming;
