import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, Shield } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center neon-border-purple">
            <Code2 className="w-4 h-4 text-neon-purple" />
          </div>
          <span className="text-lg font-bold text-gradient">Portfólio</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/" ? "text-neon-cyan" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Projetos
          </Link>
          <Link
            to="/admin"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              location.pathname === "/admin" ? "text-neon-cyan" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
