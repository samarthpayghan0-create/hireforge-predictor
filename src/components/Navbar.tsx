import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-border/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <img
                src="/logo.png"
                alt="HireForge"
                className="w-12 h-12 rounded-xl shadow-md transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-xl bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
              HireForge
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
