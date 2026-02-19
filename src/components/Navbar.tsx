import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

const Navbar = () => {
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
      </div>
    </motion.nav>
  );
};

export default Navbar;
