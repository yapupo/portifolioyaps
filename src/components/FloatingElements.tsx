import { motion } from "framer-motion";
import { Code2, Palette, Globe, Sparkles, Zap, Terminal, Layers, Cpu, Rocket, Star } from "lucide-react";

const floatingItems = [
  { icon: Code2, x: "10%", y: "15%", delay: 0, size: 28, color: "text-neon-purple" },
  { icon: Palette, x: "85%", y: "10%", delay: 0.5, size: 24, color: "text-neon-cyan" },
  { icon: Globe, x: "75%", y: "65%", delay: 1, size: 22, color: "text-neon-pink" },
  { icon: Sparkles, x: "5%", y: "70%", delay: 1.5, size: 20, color: "text-neon-purple/60" },
  { icon: Zap, x: "90%", y: "40%", delay: 0.3, size: 18, color: "text-neon-cyan/60" },
  { icon: Terminal, x: "15%", y: "45%", delay: 0.8, size: 20, color: "text-neon-purple/40" },
  { icon: Layers, x: "60%", y: "80%", delay: 1.2, size: 22, color: "text-neon-cyan/40" },
  { icon: Cpu, x: "40%", y: "12%", delay: 0.6, size: 18, color: "text-neon-pink/50" },
  { icon: Rocket, x: "50%", y: "75%", delay: 1.8, size: 24, color: "text-neon-purple/50" },
  { icon: Star, x: "25%", y: "85%", delay: 2, size: 16, color: "text-neon-cyan/30" },
];

const particles = Array.from({ length: 20 }, (_, i) => ({
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  delay: Math.random() * 3,
  duration: 3 + Math.random() * 4,
  size: 2 + Math.random() * 3,
}));

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Icons */}
      {floatingItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.1, 0.8],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className={`${item.color} drop-shadow-lg`} size={item.size} />
          </motion.div>
        );
      })}

      {/* Tiny particles / dots */}
      {particles.map((p, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute rounded-full bg-neon-purple/30"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Ambient orbs */}
      <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-neon-purple/5 blur-[100px] animate-glow-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-neon-cyan/5 blur-[120px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-[50%] left-[50%] w-[250px] h-[250px] rounded-full bg-neon-pink/3 blur-[80px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
    </div>
  );
};

export default FloatingElements;
