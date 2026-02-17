import { motion } from "framer-motion";
import {
  Cloud, Droplets, Heart, Leaf, AlertTriangle, TrendingUp, Bot, Sun, Wind, ThermometerSun,
  ArrowUpRight, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

const yieldData = [
  { month: "Jan", yield: 65, predicted: 68 },
  { month: "Feb", yield: 72, predicted: 70 },
  { month: "Mar", yield: 78, predicted: 80 },
  { month: "Apr", yield: 85, predicted: 88 },
  { month: "May", yield: 92, predicted: 95 },
  { month: "Jun", yield: 88, predicted: 90 },
];

const soilData = [
  { time: "6am", moisture: 72, temp: 18 },
  { time: "9am", moisture: 68, temp: 22 },
  { time: "12pm", moisture: 55, temp: 28 },
  { time: "3pm", moisture: 48, temp: 32 },
  { time: "6pm", moisture: 52, temp: 26 },
  { time: "9pm", moisture: 60, temp: 20 },
];

const cropHealth = [
  { name: "Wheat", health: 92 },
  { name: "Corn", health: 87 },
  { name: "Soybean", health: 78 },
  { name: "Rice", health: 95 },
];

const alerts = [
  { icon: AlertTriangle, text: "Pest risk detected in Field B — wheat section", type: "warning" },
  { icon: Droplets, text: "Irrigation needed in Zone 3 within 4 hours", type: "info" },
  { icon: TrendingUp, text: "Corn yield forecast increased by 8%", type: "success" },
];

const StatCard = ({ icon: Icon, label, value, change, color }: { icon: any; label: string; value: string; change: string; color: string }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
    <div className="flex items-center justify-between">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="flex items-center gap-0.5 text-xs font-medium text-leaf"><ArrowUpRight className="h-3 w-3" />{change}</span>
    </div>
    <p className="mt-3 font-display text-2xl font-bold">{value}</p>
    <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
  </motion.div>
);

const LockedCard = ({ title }: { title: string }) => (
  <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card">
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm">
      <Lock className="mb-2 h-6 w-6 text-muted-foreground" />
      <p className="mb-3 text-sm font-medium text-muted-foreground">Premium Feature</p>
      <Button size="sm" className="bg-gradient-hero hover:opacity-90" asChild>
        <Link to="/pricing">Upgrade to Pro</Link>
      </Button>
    </div>
    <h3 className="font-display text-lg font-semibold">{title}</h3>
    <div className="mt-4 h-40 rounded-lg bg-muted" />
  </div>
);

const DashboardOverview = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold">Good morning, John 👋</h1>
          <p className="text-muted-foreground">Here's what's happening on your farm today.</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Heart} label="Farm Health Score" value="87/100" change="+3%" color="bg-leaf/10 text-leaf" />
          <StatCard icon={Droplets} label="Soil Moisture" value="64%" change="+5%" color="bg-sky/10 text-sky" />
          <StatCard icon={Leaf} label="Crop Health Index" value="91%" change="+2%" color="bg-primary/10 text-primary" />
          <StatCard icon={ThermometerSun} label="Soil Temp" value="24°C" change="+1°" color="bg-warning/10 text-warning" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Yield chart */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Yield Performance</h3>
              <span className="rounded-full bg-leaf/10 px-3 py-1 text-xs font-medium text-leaf">Live</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={yieldData}>
                <defs>
                  <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(122, 39%, 49%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(122, 39%, 49%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(100, 12%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(120, 8%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(120, 8%, 46%)" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(100,12%,88%)", fontSize: 13 }} />
                <Area type="monotone" dataKey="yield" stroke="hsl(122, 39%, 49%)" fill="url(#yieldGrad)" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="hsl(211, 78%, 46%)" strokeDasharray="5 5" strokeWidth={2} dot={false} name="AI Predicted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Weather widget */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold">Weather</h3>
            <div className="flex items-center gap-4">
              <Sun className="h-14 w-14 text-warning" />
              <div>
                <p className="font-display text-3xl font-bold">28°C</p>
                <p className="text-sm text-muted-foreground">Partly Cloudy</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[{ icon: Droplets, label: "Humidity", value: "65%" }, { icon: Wind, label: "Wind", value: "12 km/h" }, { icon: Cloud, label: "Rain", value: "20%" }].map(w => (
                <div key={w.label} className="rounded-lg bg-muted p-3 text-center">
                  <w.icon className="mx-auto h-4 w-4 text-muted-foreground" />
                  <p className="mt-1 text-xs text-muted-foreground">{w.label}</p>
                  <p className="text-sm font-semibold">{w.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Soil data chart */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold">Soil Moisture Today</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={soilData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(100, 12%, 88%)" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(120, 8%, 46%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(120, 8%, 46%)" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(100,12%,88%)", fontSize: 13 }} />
                <Line type="monotone" dataKey="moisture" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Crop health bar chart */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-semibold">Crop Health</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={cropHealth} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(100, 12%, 88%)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(120, 8%, 46%)" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={60} stroke="hsl(120, 8%, 46%)" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(100,12%,88%)", fontSize: 13 }} />
                <Bar dataKey="health" fill="hsl(122, 39%, 49%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Alerts */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">AI Alerts</h3>
              <Bot className="h-5 w-5 text-accent" />
            </div>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-muted p-3">
                  <alert.icon className={`mt-0.5 h-4 w-4 shrink-0 ${alert.type === "warning" ? "text-warning" : alert.type === "success" ? "text-leaf" : "text-sky"}`} />
                  <p className="text-sm">{alert.text}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              <Bot className="mr-2 h-4 w-4" /> Run AI Analysis
            </Button>
          </div>
        </div>

        {/* Locked premium modules */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <LockedCard title="Precision Farming" />
          <LockedCard title="Autonomous Machinery" />
          <LockedCard title="Livestock Monitoring" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardOverview;
