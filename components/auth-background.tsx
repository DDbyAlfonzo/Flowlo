"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AuthBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-[12%] h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(62,242,207,0.12),transparent_68%)] blur-[120px] sm:h-[24rem] sm:w-[24rem]"
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.18, 0.3, 0.18],
                scale: [1, 1.05, 1],
                y: [0, 16, 0],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-[-5rem] top-[14%] h-[14rem] w-[14rem] rounded-full bg-[radial-gradient(circle,rgba(255,212,90,0.09),transparent_72%)] blur-[95px] sm:right-[4%] sm:h-[18rem] sm:w-[18rem]"
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.08, 0.16, 0.08],
                x: [0, -18, 0],
                y: [0, 10, 0],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />

      <motion.div
        className="absolute bottom-[-7rem] left-[10%] h-[16rem] w-[16rem] rounded-full bg-[radial-gradient(circle,rgba(102,232,255,0.08),transparent_72%)] blur-[110px] sm:bottom-[-9rem] sm:left-[14%] sm:h-[22rem] sm:w-[22rem]"
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.08, 0.15, 0.08],
                x: [0, 12, 0],
                y: [0, -14, 0],
              }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
      />

      <motion.div
        className="absolute inset-0"
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.22, 0.34, 0.22],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 1280 900"
          className="absolute left-1/2 top-1/2 w-[980px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.34] sm:w-[1120px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="auth-route" x1="242" y1="514" x2="976" y2="396" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#3EF2CF" stopOpacity="0.55" />
              <stop offset="0.62" stopColor="#66E8FF" stopOpacity="0.34" />
              <stop offset="1" stopColor="#FFD45A" stopOpacity="0.36" />
            </linearGradient>
          </defs>

          <path
            d="M192 612C300 536 392 498 496 490C614 480 704 514 812 472C890 442 952 390 1036 336"
            stroke="url(#auth-route)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="12 16"
          />
          <circle cx="194" cy="612" r="8" fill="#3EF2CF" fillOpacity="0.72" />
          <circle cx="1036" cy="336" r="8" fill="#FFD45A" fillOpacity="0.72" />

          <rect x="170" y="298" width="180" height="184" rx="30" stroke="rgba(255,255,255,0.12)" strokeWidth="2.2" />
          <rect x="198" y="330" width="56" height="48" rx="12" stroke="rgba(62,242,207,0.26)" strokeWidth="2" />
          <rect x="268" y="330" width="52" height="48" rx="12" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <path d="M198 408H318" stroke="rgba(255,255,255,0.12)" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M198 438H286" stroke="rgba(255,212,90,0.18)" strokeWidth="2.4" strokeLinecap="round" />

          <path
            d="M898 276C898 263.85 907.85 254 920 254H1048C1060.15 254 1070 263.85 1070 276V306C1070 318.15 1060.15 328 1048 328H956L930 350V328H920C907.85 328 898 318.15 898 306V276Z"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2.2"
          />
          <path d="M934 286H1020" stroke="rgba(62,242,207,0.28)" strokeWidth="5" strokeLinecap="round" />
          <path d="M934 308H996" stroke="rgba(255,255,255,0.12)" strokeWidth="5" strokeLinecap="round" />

          <path
            d="M790 548C790 515.415 816.415 489 849 489H912C944.585 489 971 515.415 971 548V566H790V548Z"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2.2"
          />
          <path
            d="M963 524H996C1012.57 524 1026 537.431 1026 554V576H963V524Z"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2.2"
          />
          <path d="M774 576H1026" stroke="rgba(255,255,255,0.12)" strokeWidth="8" strokeLinecap="round" />
          <circle cx="846" cy="590" r="28" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
          <circle cx="846" cy="590" r="11" fill="rgba(62,242,207,0.16)" />
          <circle cx="968" cy="590" r="28" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
          <circle cx="968" cy="590" r="11" fill="rgba(255,212,90,0.16)" />

          <path d="M416 378H546" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
          <path d="M416 408H510" stroke="rgba(62,242,207,0.14)" strokeWidth="2" strokeLinecap="round" />
          <path d="M416 438H492" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}
