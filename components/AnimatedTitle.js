import React from 'react';
import { motion } from 'framer-motion';

const AnimatedTitle = () => {
  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight text-green-900">
      <span className="inline-block">
        Microverdes{' '}
        <span className="relative z-[100]">
          frescos
          <motion.div
            className="absolute -z-50 bottom-0 left-0 h-3 md:h-4 lg:h-5 bg-lime-400"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        </span>
      </span>
      <br />
      Produção local
      <br />
      <span className="relative z-[100] inline-block">
        Sem agrotóxicos
        <motion.svg
          className="absolute -z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[110%] h-[150%]"
          viewBox="0 0 300 150"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M 90 75 
               C 88 55, 75 40, 55 35
               C 35 30, 15 45, 8 65
               C 1 85, 5 105, 20 120
               C 35 135, 60 130, 75 115
               C 85 105, 90 90, 88 78
               C 86 65, 80 55, 65 45"
            fill="none"
            stroke="#A3E635"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 1 }}
          />
        </motion.svg>
      </span>
    </h1>
  );
};

export default AnimatedTitle;