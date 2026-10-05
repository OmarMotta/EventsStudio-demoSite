'use client';
import { motion, useReducedMotion } from 'motion/react';
export default function Template({children}:{children:React.ReactNode}) {const reduced=useReducedMotion();return <motion.div initial={false} animate={{opacity:1}} className={reduced?'':'page-arrival'}>{children}</motion.div>;}
