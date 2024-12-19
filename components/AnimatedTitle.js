import React from 'react';
import { motion } from 'framer-motion';

const AnimatedTitle = () => {
  return (
    <h1 className="text-4xl font-bold text-center leading-tight text-green-900">
      <span className="inline-block">
        Microverdes{' '}
        <span className="relative z-[100]">
          frescos
          <motion.div
            className="absolute -z-50 bottom-0 left-0 h-3 bg-orange-400"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        </span>
      </span>
      <br />
      Produção local
      <br />
      <span className="relative inline-block">
        Sem agrotóxicos
        <motion.svg
          className="absolute -z-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[110%] h-[150%]"
          viewBox="0 0 300 150"
          preserveAspectRatio="none"
        >
          <motion.circle
            cx="50"
            cy="80"
            r="45"
            fill="none"
            stroke="#FB923C"
            strokeWidth="4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          />
        </motion.svg>
      </span>
    </h1>
  );
};

export default AnimatedTitle;