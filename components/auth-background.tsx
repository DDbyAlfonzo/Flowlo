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

      <motion.div
        className="absolute left-[7%] top-[28%] h-14 w-14 sm:left-[9%] sm:top-[24%] sm:h-20 sm:w-20"
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -8, 0],
                x: [0, 5, 0],
                opacity: [0.16, 0.28, 0.16],
              }
        }
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <svg viewBox="0 0 96 96" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="18" y="22" width="60" height="52" rx="12" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          <path d="M18 38L48 20L78 38" stroke="rgba(62,242,207,0.28)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M48 20V74" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="74" cy="24" r="4" fill="rgba(255,212,90,0.62)" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute right-[7%] top-[18%] h-12 w-20 sm:right-[10%] sm:top-[20%] sm:h-14 sm:w-24"
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, 6, 0],
                x: [0, -6, 0],
                opacity: [0.14, 0.24, 0.14],
              }
        }
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
      >
        <svg viewBox="0 0 120 72" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 18C18 11.3726 23.3726 6 30 6H90C96.6274 6 102 11.3726 102 18V36C102 42.6274 96.6274 48 90 48H54L36 62V48H30C23.3726 48 18 42.6274 18 36V18Z"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
          />
          <path d="M36 24H82" stroke="rgba(62,242,207,0.28)" strokeWidth="4" strokeLinecap="round" />
          <path d="M36 36H70" stroke="rgba(255,255,255,0.12)" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[18%] right-[9%] h-12 w-28 hidden sm:block lg:right-[12%]"
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -7, 0],
                x: [0, 8, 0],
                opacity: [0.12, 0.22, 0.12],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
      >
        <svg viewBox="0 0 176 72" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="156" height="52" rx="18" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <circle cx="34" cy="36" r="10" fill="rgba(62,242,207,0.14)" />
          <path d="M30 36L33 39L39 33" stroke="rgba(62,242,207,0.62)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M56 30H118" stroke="rgba(255,255,255,0.14)" strokeWidth="4" strokeLinecap="round" />
          <path d="M56 42H92" stroke="rgba(255,212,90,0.18)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="146" cy="36" r="4" fill="rgba(255,212,90,0.58)" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute left-[12%] bottom-[22%] h-9 w-20 hidden sm:block"
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, 4, 0],
                opacity: [0.08, 0.16, 0.08],
              }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
      >
        <svg viewBox="0 0 120 48" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 10V38" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <path d="M26 8V40" stroke="rgba(62,242,207,0.18)" strokeWidth="3" />
          <path d="M38 12V36" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <path d="M50 8V40" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
          <path d="M66 12V36" stroke="rgba(255,212,90,0.16)" strokeWidth="2" />
          <path d="M76 9V39" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <path d="M88 14V34" stroke="rgba(62,242,207,0.12)" strokeWidth="2" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute right-[14%] bottom-[34%] h-8 w-12 hidden md:block"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -6, 0],
                y: [0, 3, 0],
                opacity: [0.08, 0.16, 0.08],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
      >
        <svg viewBox="0 0 72 48" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 26H40L48 16H58V26H62V34H10V26Z" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="22" cy="36" r="5" stroke="rgba(62,242,207,0.2)" strokeWidth="2" />
          <circle cx="52" cy="36" r="5" stroke="rgba(255,212,90,0.2)" strokeWidth="2" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={
          reduceMotion
            ? undefined
            : {
                opacity: [0.12, 0.2, 0.12],
              }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <svg
          viewBox="0 0 1280 900"
          className="absolute left-1/2 top-1/2 w-[760px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.22] sm:w-[920px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M348 650C406 618 470 604 538 606C616 608 686 638 760 624C820 612 870 584 928 538"
            stroke="rgba(62,242,207,0.16)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="10 14"
          />
          <path
            d="M392 690C452 664 516 654 580 658"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M876 512L928 538L906 584"
            stroke="rgba(255,212,90,0.16)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
