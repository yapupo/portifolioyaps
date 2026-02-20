import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Hexagon } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/20"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-neon-purple/10 flex items-center justify-center border border-neon-purple/30 group-hover:neon-glow-purple transition-shadow duration-300">
            <Hexagon className="w-4.5 h-4.5 text-neon-purple icon-neon-purple" />
          </div>
          <span className="text-lg font-bold text-gradient font-display tracking-wider">PORTFÓLIO</span>
        </Link>

        {/* Decorative status */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground/60">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-glow-pulse" />
          <span className="tracking-widest uppercase">Online</span>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
