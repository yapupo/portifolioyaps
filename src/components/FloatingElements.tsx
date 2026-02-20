import { motion } from "framer-motion";
import {
  Code2, Palette, Globe, Sparkles, Zap, Terminal,
  Layers, Cpu, Rocket, Star, Hexagon, Wifi,
  Shield, Database, Gem, Binary, Monitor, Braces,
  CircuitBoard, Gamepad2
} from "lucide-react";

const floatingItems = [
  { icon: Code2, x: "8%", y: "12%", delay: 0, size: 30, glow: "icon-neon-purple", color: "text-neon-purple" },
  { icon: Palette, x: "88%", y: "8%", delay: 0.5, size: 26, glow: "icon-neon-cyan", color: "text-neon-cyan" },
  { icon: Globe, x: "78%", y: "60%", delay: 1, size: 24, glow: "icon-neon-pink", color: "text-neon-pink" },
  { icon: Sparkles, x: "3%", y: "65%", delay: 1.5, size: 22, glow: "icon-neon-purple", color: "text-neon-purple/70" },
  { icon: Zap, x: "92%", y: "35%", delay: 0.3, size: 20, glow: "icon-neon-cyan", color: "text-neon-cyan/70" },
  { icon: Terminal, x: "12%", y: "42%", delay: 0.8, size: 22, glow: "icon-neon-purple", color: "text-neon-purple/50" },
  { icon: Layers, x: "65%", y: "82%", delay: 1.2, size: 24, glow: "icon-neon-cyan", color: "text-neon-cyan/50" },
  { icon: Cpu, x: "42%", y: "10%", delay: 0.6, size: 20, glow: "icon-neon-pink", color: "text-neon-pink/60" },
  { icon: Rocket, x: "52%", y: "72%", delay: 1.8, size: 26, glow: "icon-neon-purple", color: "text-neon-purple/60" },
  { icon: Star, x: "22%", y: "88%", delay: 2, size: 18, glow: "icon-neon-cyan", color: "text-neon-cyan/40" },
  { icon: Hexagon, x: "70%", y: "18%", delay: 0.4, size: 28, glow: "icon-neon-purple", color: "text-neon-purple/40" },
  { icon: Wifi, x: "35%", y: "55%", delay: 1.4, size: 18, glow: "icon-neon-cyan", color: "text-neon-cyan/30" },
  { icon: Shield, x: "95%", y: "70%", delay: 0.9, size: 20, glow: "icon-neon-purple", color: "text-neon-purple/30" },
  { icon: Database, x: "18%", y: "25%", delay: 1.6, size: 16, glow: "icon-neon-cyan", color: "text-neon-cyan/40" },
  { icon: Gem, x: "82%", y: "88%", delay: 2.2, size: 22, glow: "icon-neon-pink", color: "text-neon-pink/40" },
  { icon: Binary, x: "55%", y: "30%", delay: 0.7, size: 16, glow: "icon-neon-purple", color: "text-neon-purple/25" },
  { icon: Monitor, x: "30%", y: "75%", delay: 1.1, size: 20, glow: "icon-neon-cyan", color: "text-neon-cyan/35" },
  { icon: Braces, x: "48%", y: "92%", delay: 1.9, size: 18, glow: "icon-neon-purple", color: "text-neon-purple/35" },
  { icon: CircuitBoard, x: "6%", y: "50%", delay: 2.4, size: 24, glow: "icon-neon-cyan", color: "text-neon-cyan/25" },
  { icon: Gamepad2, x: "75%", y: "42%", delay: 0.2, size: 20, glow: "icon-neon-pink", color: "text-neon-pink/30" },
];

const particles = Array.from({ length: 30 }, (_, i) => ({
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  delay: Math.random() * 4,
  duration: 3 + Math.random() * 5,
  size: 1 + Math.random() * 3,
  color: i % 3 === 0 ? "bg-neon-purple/40" : i % 3 === 1 ? "bg-neon-cyan/30" : "bg-neon-pink/20",
}));

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Icons with neon glow */}
      {floatingItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.15, 0.5, 0.15],
              scale: [0.7, 1.15, 0.7],
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5 + i * 0.3,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className={`${item.color} ${item.glow}`} size={item.size} />
          </motion.div>
        );
      })}

      {/* Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={`p-${i}`}
          className={`absolute rounded-full ${p.color}`}
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.3, 1.5, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Large ambient orbs */}
      <div className="absolute top-[-5%] left-[15%] w-[500px] h-[500px] rounded-full bg-neon-purple/[0.04] blur-[150px] animate-glow-pulse" />
      <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-neon-cyan/[0.03] blur-[180px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full bg-neon-pink/[0.02] blur-[120px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
      <div className="absolute top-[60%] left-[5%] w-[350px] h-[350px] rounded-full bg-neon-blue/[0.03] blur-[100px] animate-glow-pulse" style={{ animationDelay: "4.5s" }} />
    </div>
  );
};

export default FloatingElements;
