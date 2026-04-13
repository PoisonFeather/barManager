"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-orange-500 selection:text-black">
      
      {/* BACKGROUND GLOWS */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-zinc-800/50 blur-[150px] rounded-full pointer-events-none" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.5)]">
              <span className="text-black font-black text-xs uppercase tracking-widest">BM</span>
            </div>
            <span className="text-xl font-black tracking-tighter">BarManager.</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold text-zinc-300 hover:text-white uppercase tracking-widest transition-colors">
              Log In
            </Link>
            <Link href="/onboarding" className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 hover:bg-orange-50 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-40 pb-24 relative z-10">
        {/* HERO SECTION */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mt-16 md:mt-24"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-[0.2em]">Next-Gen POS System</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Control the chaos. <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Serve faster.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-medium mb-12">
            The intelligent, zero-install bar management platform. Self-service QR orders, individual bill splitting, and real-time layout rendering all in one elegant ecosystem.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/onboarding" className="px-8 py-4 rounded-full bg-orange-500 text-black text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(234,88,12,0.4)]">
              Start Your Free Trial
            </Link>
            <Link href="/login" className="px-8 py-4 rounded-full bg-zinc-900 border border-white/10 text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all">
              Login to Dashboard
            </Link>
          </motion.div>
        </motion.div>

        {/* FEATURES GRID SECTION */}
        <div id="features" className="mt-40 md:mt-64 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">Features that change the game.</h2>
            <p className="text-zinc-500 font-medium">Brought to you exactly as you need them. Fast, responsive, flawless.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 hover:bg-zinc-900 transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-500/20 group-hover:text-orange-400 transition-colors">
                📱
              </div>
              <h3 className="text-lg font-black shrink-0 tracking-tight mb-2">QR Self-Service</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                Clients easily scan, browse, and order directly from their phone with no app downloads required.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 hover:bg-zinc-900 transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-500/20 group-hover:text-orange-400 transition-colors">
                🍕
              </div>
              <h3 className="text-lg font-black shrink-0 tracking-tight mb-2">"My Share" Tech</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                Individual fingerprint tokens for table groups. Easily segment orders down to the individual customer for flawless billing.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 hover:bg-zinc-900 transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-500/20 group-hover:text-orange-400 transition-colors">
                🖱️
              </div>
              <h3 className="text-lg font-black shrink-0 tracking-tight mb-2">Drag & Drop Zones</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                Merge tables or shuffle them across zones with a flick of a finger. The dashboard is 100% physically intuitive.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 hover:bg-zinc-900 transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-500/20 group-hover:text-orange-400 transition-colors">
                📈
              </div>
              <h3 className="text-lg font-black shrink-0 tracking-tight mb-2">Advanced Analytics</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                Measure precise table duration and order wait-times natively. Stop guessing, start knowing your bar's pulse.
              </p>
            </motion.div>

          </div>
        </div>

        {/* BANNER DEMO/CTA */}
        <div className="mt-32 md:mt-48 mb-20 bg-gradient-to-tr from-zinc-900 to-zinc-950 border border-white/10 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-orange-500/10 blur-[100px] pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 relative z-10">Stop serving the old way.</h2>
          <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 relative z-10">
            Join the revolution of digital bars. The interface requires no installation - run it on an iPad, a phone or your pocket.
          </p>
          <Link href="/onboarding" className="inline-block px-10 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] relative z-10">
            Create Your Bar Now
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-black text-center py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <span className="text-xs font-black uppercase tracking-widest text-white">BarManager © 2026</span>
          </div>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest text-zinc-600">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
            <a href="mailto:contact@barmanager.app" className="hover:text-zinc-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
