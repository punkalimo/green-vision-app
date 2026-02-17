import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  collapsed?: boolean;
  variant?: "light" | "dark";
}

const Logo = ({ collapsed = false, variant = "dark" }: LogoProps) => {
  return (
    <Link to="/" className="flex items-center gap-2.5 no-underline">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
        <Leaf className="h-5 w-5 text-primary-foreground" />
      </div>
      {!collapsed && (
        <span className={`font-display text-xl font-bold tracking-tight ${variant === "light" ? "text-primary-foreground" : "text-foreground"}`}>
          AgriMind <span className="text-leaf">AI</span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
