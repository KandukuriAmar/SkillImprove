import React, { useEffect, useState, useCallback, useContext } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { AuthContext } from './AuthContext.jsx';


function generateStars(count, starColor) {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 4000) - 2000;
    const y = Math.floor(Math.random() * 4000) - 2000;
    shadows.push(`${x}px ${y}px ${starColor}`);
  }
  return shadows.join(', ');
}

function StarLayer({
  count = 10000,
  size = 6,
  transition = { repeat: Infinity, duration: 50, ease: 'linear' },
  starColor = "black",
  className,
  ...props
}) {
  const [boxShadow, setBoxShadow] = useState('');

  useEffect(() => {
    setBoxShadow(generateStars(count, starColor));
    const mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }, [count, starColor]);

  return (
    <motion.div
      animate={{ y: [0, -2000] }}
      transition={transition}
      className={`absolute top-0 left-0 w-full h-[2000px] ${className || ''}`}
      {...props}
    >
      <div
        className="absolute bg-transparent rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: boxShadow,
        }}
      />
      <div
        className="absolute bg-transparent rounded-full top-[2000px]"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: boxShadow,
        }}
      />
    </motion.div>
  );
}

export default function StarsBackground({
  children,
  className = '',
  factor = 0.05,
  speed = 50,
  transition = { stiffness: 50, damping: 20 },
  pointerEvents = true,
  starColor = "white",
  ...props
}) {
  const { userData } = useContext(AuthContext);
  const containsDark = userData.mode === 'dark';
  
  const mode = containsDark ? 'dark' : 'light';
  const resolvedStarColor = starColor === "white" ? (mode === 'dark' ? 'white' : 'black') : starColor;
  const offsetX = useMotionValue(1);
  const offsetY = useMotionValue(1);
    
  const springX = useSpring(offsetX, transition);
  const springY = useSpring(offsetY, transition);

  const handleMouseMove = useCallback((e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const newOffsetX = -(e.clientX - centerX) * factor;
    const newOffsetY = -(e.clientY - centerY) * factor;
    offsetX.set(newOffsetX);
    offsetY.set(newOffsetY);
  }, [offsetX, offsetY, factor]);

  return (
    <div
className={`relative w-full h-full overflow-hidden ${mode === 'dark' ? 'bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]' : 'bg-white'}`}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <motion.div
        style={{ x: springX, y: springY }}
        className={!pointerEvents ? 'pointer-events-none' : ''}
      >
        <StarLayer
          count={1000}
          size={1}
          transition={{ repeat: Infinity, duration: speed, ease: 'linear' }}
          starColor={resolvedStarColor}
        />
        <StarLayer
          count={400}
          size={2}
          transition={{ repeat: Infinity, duration: speed * 2, ease: 'linear' }}
          starColor={resolvedStarColor}
        />
        <StarLayer
          count={200}
          size={3}
          transition={{ repeat: Infinity, duration: speed * 3, ease: 'linear' }}
          starColor={resolvedStarColor}
        />
      </motion.div>
      {children}
    </div>
  );
}
