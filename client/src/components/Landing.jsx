import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate: rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border border-white/20 dark:border-white/10",
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function HeroGeometric({
  badge = "improveSkill",
  title1 = "Elevate Your",
  title2 = "Skill Version",
  GradientButton = () => <button>Button</button>,
}) {
  const navigate = useNavigate();
  const { userData, loginData } = useContext(AuthContext);

  const bgColor = userData.mode === "dark" ? "bg-[#030303]" : "bg-[#ffffff]";
  const overlayGradient =
    userData.mode === "dark"
      ? "from-[#030303] via-transparent to-[#030303]/80"
      : "from-[#ffffff] via-transparent to-[#ffffff]/80";

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden ${bgColor}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        {[
          { delay: 0.3, width: 600, height: 140, rotate: 12, className: "left-[-10%] top-[15%]" },
          { delay: 0.5, width: 500, height: 120, rotate: -15, className: "right-[0%] top-[75%]" },
          { delay: 0.4, width: 300, height: 80, rotate: -8, className: "left-[10%] bottom-[10%]" },
          { delay: 0.6, width: 200, height: 60, rotate: 20, className: "right-[20%] top-[15%]" },
          { delay: 0.7, width: 150, height: 40, rotate: -25, className: "left-[25%] top-[10%]" },
        ].map((shape, idx) => (
          <ElegantShape
            key={idx}
            {...shape}
            gradient={
              userData.mode === "dark"
                ? "from-indigo-500/[0.7]"
                : "from-indigo-500/[0.3]"
            }
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-8 md:mb-12"
          >
            <Circle className="h-2 w-2 fill-rose-500/80" />
            <span className={`text-sm tracking-wide ${userData.mode === "dark" ? "text-white/60" : "text-black/50"}`}>{badge}</span>
          </motion.div>

          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className={`text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight`}>
              <span
                className={`bg-clip-text text-transparent ${
                  userData.mode === "dark"
                    ? "bg-gradient-to-b from-white to-white/80"
                    : "bg-gradient-to-b from-black to-black/60"
                }`}
              >
                {title1}
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-rose-400">
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p
              className={`text-base sm:text-lg md:text-xl ${
                userData.mode === "dark" ? "text-white/40" : "text-black/50"
              } mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4`}
            >
              Define your learning goals, access tailored content, assess with quizzes, and monitor your progress all seamlessly integrated.
            </p>
          </motion.div>

          <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
            <GradientButton onClick={() => navigate("/home")}>Move to Home</GradientButton>
          </motion.div>
        </div>
      </div>

      <div className={`absolute inset-0 bg-gradient-to-t ${overlayGradient} pointer-events-none`} />
    </div>
  );
}

export { HeroGeometric };