import React from "react";
import { motion } from "framer-motion";
import styles from "./animatedLinks.css";

const HighlightedLinks = () => {
  return (
    <div className="flex flex-col items-center space-y-6 mt-10">
      {/* Glowing Effect Link */}
      {/* <a
        href="#"
        className="relative text-blue-600 font-bold text-lg before:absolute before:-inset-1 before:bg-blue-300 before:opacity-50 before:blur-md before:animate-pulse"
      >
        Glowing Link
      </a> */}

      {/* Pulsing Animation Link */}
      <motion.a
        href="http://localhost:3000/allhiringrequest/1626"
        className="text-blue-500 font-bold text-lg cta-button"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        Pulsing Link
      </motion.a>

      {/* Bouncing Animation Link */}
      {/* <motion.a
        href="#"
        className="text-blue-500 font-bold text-lg"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      >
        Bouncing Link
      </motion.a> */}

      {/* Shaking Animation Link */}
      {/* <motion.a
        href="#"
        className="text-blue-500 font-bold text-lg"
        animate={{ x: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        Shaking Link
      </motion.a> */}

      {/* Waving Animation Link */}
      {/* <motion.a
        href="#"
        className="text-blue-500 font-bold text-lg"
        animate={{ x: [0, 10, -10, 10, -10, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      >
        Waving Link
      </motion.a> */}

      {/* Floating Animation Link */}
      {/* <motion.a
        href="#"
        className="text-blue-500 font-bold text-lg"
        animate={{ y: [0, -10, 10, -10, 10, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        Floating Link
      </motion.a>    */}

     
    </div>
  );
};

export default HighlightedLinks;
