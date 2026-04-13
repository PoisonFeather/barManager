"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Head from "next/head";

// ─── Translations ────────────────────────────────────────────────────────────
const LANG = {
  ro: {
    lang: "ro",
    badge: "Sistem POS de Nouă Generație",
    heroTitle1: "Controlează haosul.",
    heroTitle2: "Servește mai repede.",
    heroSub:
      "Platforma inteligentă de management bar. Comenzi prin QR, bon individual și vizualizare în timp real — totul într-un singur ecosistem elegant.",
    ctaPrimary: "Începe Gratuit",
    ctaSecondary: "Intră în Dashboard",
    featuresLabel: "Funcționalități",
    demoLabel: "Demo Live",
    pricingLabel: "Prețuri",
    logIn: "Autentificare",
    getStarted: "Încearcă Gratuit",

    featuresTitle: "Funcționalități care schimbă jocul.",
    featuresSub:
      "Construite exact cum ai nevoie. Rapid, responsive, impecabil.",
    f1Title: "Auto-Servire QR",
    f1Desc:
      "Clienții scanează, navighează și comandă direct de pe telefon — fără instalare, fără așteptare.",
    f2Title: "Tehnologia „Bonul Meu"",
    f2Desc:
      "Token individual per client la masă. Separă comenzile și eliberează bonuri personalizate în câteva secunde.",
    f3Title: "Zone Drag & Drop",
    f3Desc:
      "Mută sau combină măsele din Terasă, Bar sau Sală cu un singur gest. Dashboardul e 100% intuitiv.",
    f4Title: "Analiză Avansată",
    f4Desc:
      "Durata la masă, timpii de servire, produsele top — toate live. Oprește-te din ghicit, începe să știi.",

    bannerTitle: "Lasă în urmă ordinea veche.",
    bannerSub:
      "Alătură-te revoluției barurilor digitale. Funcționează pe iPad, telefon sau orice ecran — fără instalare.",
    bannerCta: "Creează-ți Barul Acum",

    pricingTitle: "Un preț corect. Zero surprize.",
    pricingBadge: "Transparent & Predictibil",
    pricingSub:
      "Nu plătești abonamente mari fără să știi ce primești. Plătești exact cât folosești.",

    planFreeTitle: "Gratuit",
    planFreePrice: "0€",
    planFreePeriod: "/ lună",
    planFreeDesc: "Pornește motorul. Fără card, fără risc.",
    planFreeFeatures: [
      "1 locație activă",
      "Până la 5 mese",
      "Meniu QR nelimitat",
      "Acces la dashboard de bază",
    ],
    planFreeCta: "Începe Acum",

    planProTitle: "Pro",
    planProPrice: "5€",
    planProPer: "/ masă",
    planProPeriod: "/ lună",
    planProHighlight: "≈ prețul a 2 cafele ☕ per masă",
    planProDesc:
      "Gândește-te invers: o singură masă activată în plus aduce mai mult decât costul ei. Plătești pe ce folosești — nimic mai mult.",
    planProFeatures: [
      "Mese nelimitate (5€/masă/lună)",
      "Tehnologia „Bonul Meu"",
      "Zone Drag & Drop",
      "Analytics avansat în timp real",
      "Suport prioritar",
      "Integrare multi-locație",
    ],
    planProCta: "Activează Pro",
    planProBadge: "Cel mai popular",

    pricingNote:
      "💡 Un local cu 10 mese plătește 50€/lună — mai puțin decât un POS clasic doar pentru licență.",

    roiTitle: "ROI vizibil din prima săptămână",
    roi1: "−30 min",
    roi1Label: "timp pierdut pe tură cu bonuri",
    roi2: "+18%",
    roi2Label: "rotație masă prin comenzi mai rapide",
    roi3: "0€",
    roi3Label: "instalare sau hardware suplimentar",

    footerPrivacy: "Confidențialitate",
    footerTerms: "Termeni",
    footerContact: "Contact",

    testimonialBadge: "Ce spun clienții noștri",
    t1Quote:
      "\"Am redus erorile de comandă cu 80% în prima săptămână. Personalul nu mai aleargă după bonuri.\"\n— Mihai, Bar Fabric București",
    t2Quote:
      "\"5€ pe masă? Recuperăm asta dintr-o singură comandă uitată de ospătar.\"\n— Elena, Terasa Vii Cluj",
    t3Quote:
      "\"QR-ul e o minune. Clienții comandă singuri, noi ne concentrăm pe calitate.\"\n— Radu, Cafenea Nomad",
  },
  en: {
    lang: "en",
    badge: "Next-Gen POS System",
    heroTitle1: "Control the chaos.",
    heroTitle2: "Serve faster.",
    heroSub:
      "The intelligent, zero-install bar management platform. Self-service QR orders, individual bill splitting, and real-time layout rendering — all in one elegant ecosystem.",
    ctaPrimary: "Start Free Trial",
    ctaSecondary: "Login to Dashboard",
    featuresLabel: "Features",
    demoLabel: "Live Demo",
    pricingLabel: "Pricing",
    logIn: "Log In",
    getStarted: "Get Started",

    featuresTitle: "Features that change the game.",
    featuresSub: "Brought to you exactly as you need them. Fast, responsive, flawless.",
    f1Title: "QR Self-Service",
    f1Desc:
      "Clients scan, browse and order directly from their phone — no app downloads, no waiting.",
    f2Title: "\"My Share\" Tech",
    f2Desc:
      "Individual fingerprint tokens per customer at the table. Segment orders and print personal bills in seconds.",
    f3Title: "Drag & Drop Zones",
    f3Desc:
      "Move or merge tables across Terrace, Bar or Hall with a single gesture. The dashboard is 100% intuitive.",
    f4Title: "Advanced Analytics",
    f4Desc:
      "Table duration, wait-times, top products — all live. Stop guessing, start knowing your bar's pulse.",

    bannerTitle: "Stop serving the old way.",
    bannerSub:
      "Join the revolution of digital bars. Runs on an iPad, phone, or any screen — no installation needed.",
    bannerCta: "Create Your Bar Now",

    pricingTitle: "One fair price. Zero surprises.",
    pricingBadge: "Transparent & Predictable",
    pricingSub:
      "No hidden fees, no opaque subscriptions. You pay exactly for what you use.",

    planFreeTitle: "Free",
    planFreePrice: "€0",
    planFreePeriod: "/ month",
    planFreeDesc: "Start the engine. No card required, no risk.",
    planFreeFeatures: [
      "1 active location",
      "Up to 5 tables",
      "Unlimited QR menu",
      "Basic dashboard access",
    ],
    planFreeCta: "Start Now",

    planProTitle: "Pro",
    planProPrice: "€5",
    planProPer: "/ table",
    planProPeriod: "/ month",
    planProHighlight: "≈ the cost of 2 coffees ☕ per table",
    planProDesc:
      "Think about it: one extra table activated generates more than it costs. You pay per table you use — nothing more.",
    planProFeatures: [
      "Unlimited tables (€5/table/month)",
      "\"My Share\" Technology",
      "Drag & Drop Zones",
      "Advanced real-time analytics",
      "Priority support",
      "Multi-location integration",
    ],
    planProCta: "Activate Pro",
    planProBadge: "Most popular",

    pricingNote:
      "💡 A venue with 10 tables pays €50/month — less than a traditional POS for the license alone.",

    roiTitle: "Visible ROI from the first week",
    roi1: "−30 min",
    roi1Label: "wasted per shift on billing",
    roi2: "+18%",
    roi2Label: "table turnover via faster orders",
    roi3: "€0",
    roi3Label: "installation or extra hardware",

    footerPrivacy: "Privacy",
    footerTerms: "Terms",
    footerContact: "Contact",

    testimonialBadge: "What our clients say",
    t1Quote:
      "\"We reduced order errors by 80% in the first week. Staff no longer chase receipts.\"\n— Mihai, Bar Fabric Bucharest",
    t2Quote:
      "\"€5 per table? We recover that from a single order a waiter forgot.\"\n— Elena, Terasa Vii Cluj",
    t3Quote:
      "\"QR is a game-changer. Customers order themselves, we focus on quality.\"\n— Radu, Nomad Café",
  },
} as const;

type LangKey = keyof typeof LANG;

// ─── Animations ──────────────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 22 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

// ─── Check Icon ──────────────────────────────────────────────────────────────
function Check() {
  return (
    <svg className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" className="fill-orange-500/20" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Home() {
  const [lang, setLang] = useState<LangKey>("ro");
  const t = LANG[lang];

  const toggleLang = () => setLang((l) => (l === "ro" ? "en" : "ro"));

  return (
    <>
      {/* SEO — injected via next/head semantics; layout.tsx handles <title> globally */}
      <div
        className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-orange-500 selection:text-black"
        lang={t.lang}
      >
        {/* ── BACKGROUND GLOWS ──────────────────────────────────────── */}
        <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] bg-orange-600/15 blur-[160px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-zinc-800/40 blur-[160px] rounded-full pointer-events-none" />

        {/* ── NAVBAR ────────────────────────────────────────────────── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 px-6 py-5 border-b border-white/5 bg-black/60 backdrop-blur-lg"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.5)]">
                <span className="text-black font-black text-xs uppercase tracking-widest">BM</span>
              </div>
              <span className="text-xl font-black tracking-tighter">BarManager.</span>
            </div>

            {/* Nav links */}
            <div className="hidden md:flex gap-8 text-xs font-bold text-zinc-400 uppercase tracking-widest">
              <a href="#features" className="hover:text-white transition-colors">{t.featuresLabel}</a>
              <a href="#pricing" className="hover:text-white transition-colors">{t.pricingLabel}</a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Language toggle */}
              <button
                onClick={toggleLang}
                aria-label="Switch language"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs font-black uppercase tracking-widest text-zinc-300 hover:text-white transition-all"
              >
                <span className="text-[10px]">{lang === "ro" ? "🇷🇴" : "🇬🇧"}</span>
                {lang === "ro" ? "EN" : "RO"}
              </button>
              <Link
                href="/login"
                className="text-xs font-bold text-zinc-300 hover:text-white uppercase tracking-widest transition-colors hidden sm:block"
              >
                {t.logIn}
              </Link>
              <Link
                href="/onboarding"
                className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 hover:bg-orange-50 transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                {t.getStarted}
              </Link>
            </div>
          </div>
        </nav>

        {/* ── MAIN ──────────────────────────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-6 pt-40 pb-24 relative z-10">

          {/* HERO */}
          <motion.div
            className="text-center max-w-4xl mx-auto mt-16 md:mt-24"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 mb-8">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-[0.2em]">{t.badge}</span>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
            >
              {t.heroTitle1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                {t.heroTitle2}
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-medium mb-12">
              {t.heroSub}
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/onboarding"
                className="px-8 py-4 rounded-full bg-orange-500 text-black text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(234,88,12,0.4)]"
              >
                {t.ctaPrimary}
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-full bg-zinc-900 border border-white/10 text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
              >
                {t.ctaSecondary}
              </Link>
            </motion.div>

            {/* Social proof mini-strip */}
            <motion.div variants={item} className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-zinc-500 font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><span className="text-green-400">●</span> 100% Web — fără instalare</span>
              <span className="flex items-center gap-1.5"><span className="text-orange-400">●</span> GDPR Compliant</span>
              <span className="flex items-center gap-1.5"><span className="text-blue-400">●</span> Real-time sync</span>
            </motion.div>
          </motion.div>

          {/* ── FEATURES ──────────────────────────────────────────────── */}
          <section id="features" className="mt-40 md:mt-64">
            <div className="text-center mb-16">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-black tracking-tighter mb-4"
              >
                {t.featuresTitle}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-zinc-500 font-medium"
              >
                {t.featuresSub}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "📱", title: t.f1Title, desc: t.f1Desc, delay: 0 },
                { icon: "🧾", title: t.f2Title, desc: t.f2Desc, delay: 0.1 },
                { icon: "🖱️", title: t.f3Title, desc: t.f3Desc, delay: 0.2 },
                { icon: "📈", title: t.f4Title, desc: t.f4Desc, delay: 0.3 },
              ].map(({ icon, title, desc, delay }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 hover:bg-zinc-900 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-500/20 group-hover:text-orange-400 transition-colors">
                    {icon}
                  </div>
                  <h3 className="text-lg font-black tracking-tight mb-2">{title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-medium">{desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── PRICING ───────────────────────────────────────────────── */}
          <section id="pricing" className="mt-40 md:mt-64">
            <div className="text-center mb-16">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 mb-6"
              >
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-[0.2em]">{t.pricingBadge}</span>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="text-3xl md:text-5xl font-black tracking-tighter mb-4"
              >
                {t.pricingTitle}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-zinc-500 font-medium max-w-xl mx-auto"
              >
                {t.pricingSub}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-900/50 rounded-[2.5rem] border border-white/5 p-10 flex flex-col"
              >
                <div className="mb-8">
                  <h3 className="text-xl font-black tracking-tight mb-1">{t.planFreeTitle}</h3>
                  <p className="text-zinc-500 text-sm font-medium mb-6">{t.planFreeDesc}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black">{t.planFreePrice}</span>
                    <span className="text-zinc-400 text-sm font-bold mb-2">{t.planFreePeriod}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-10 flex-1">
                  {t.planFreeFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-300 font-medium">
                      <Check /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/onboarding"
                  className="w-full text-center px-6 py-3.5 rounded-full border border-white/10 bg-zinc-800 text-white text-sm font-black uppercase tracking-widest hover:bg-zinc-700 transition-all"
                >
                  {t.planFreeCta}
                </Link>
              </motion.div>

              {/* Pro Plan */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-[2.5rem] border border-orange-500/30 p-10 flex flex-col shadow-[0_0_60px_rgba(234,88,12,0.15)] overflow-hidden"
              >
                {/* glow */}
                <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-orange-500/10 blur-[80px] pointer-events-none" />

                {/* Popular badge */}
                <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-orange-500 text-black text-[10px] font-black uppercase tracking-widest">
                  {t.planProBadge}
                </div>

                <div className="mb-8 relative z-10">
                  <h3 className="text-xl font-black tracking-tight mb-1">{t.planProTitle}</h3>
                  <p className="text-zinc-400 text-sm font-medium mb-6">{t.planProDesc}</p>
                  <div className="flex items-end gap-1 flex-wrap">
                    <span className="text-5xl font-black text-orange-400">{t.planProPrice}</span>
                    <div className="flex flex-col mb-1">
                      <span className="text-zinc-400 text-xs font-bold">{t.planProPer}</span>
                      <span className="text-zinc-400 text-xs font-bold">{t.planProPeriod}</span>
                    </div>
                  </div>
                  {/* Anchor framing */}
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                    <span className="text-xs text-orange-300 font-bold">{t.planProHighlight}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-10 flex-1 relative z-10">
                  {t.planProFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-200 font-medium">
                      <Check /> {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/onboarding"
                  className="w-full text-center px-6 py-3.5 rounded-full bg-orange-500 text-black text-sm font-black uppercase tracking-widest hover:scale-105 hover:bg-orange-400 transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] relative z-10"
                >
                  {t.planProCta}
                </Link>
              </motion.div>
            </div>

            {/* Pricing note */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center text-zinc-500 text-sm font-medium mt-8 max-w-xl mx-auto"
            >
              {t.pricingNote}
            </motion.p>

            {/* ROI Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              viewport={{ once: true }}
              className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              <h3 className="sr-only">{t.roiTitle}</h3>
              {[
                { val: t.roi1, label: t.roi1Label, color: "text-red-400" },
                { val: t.roi2, label: t.roi2Label, color: "text-green-400" },
                { val: t.roi3, label: t.roi3Label, color: "text-orange-400" },
              ].map(({ val, label, color }) => (
                <div
                  key={label}
                  className="text-center bg-zinc-900/50 rounded-3xl border border-white/5 px-8 py-8"
                >
                  <div className={`text-4xl font-black tracking-tighter mb-2 ${color}`}>{val}</div>
                  <div className="text-zinc-400 text-sm font-medium">{label}</div>
                </div>
              ))}
            </motion.div>
          </section>

          {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
          <section className="mt-40 md:mt-48">
            <div className="text-center mb-12">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-zinc-900 mb-4"
              >
                <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-[0.2em]">⭐ {t.testimonialBadge}</span>
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[t.t1Quote, t.t2Quote, t.t3Quote].map((q, i) => {
                const [quote, author] = q.split("\n—");
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8"
                  >
                    <div className="text-orange-400 text-3xl mb-4 leading-none">&ldquo;</div>
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium mb-6">{quote?.replace(/^"/, "")}</p>
                    {author && (
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">— {author.trim()}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ── CTA BANNER ───────────────────────────────────────────── */}
          <div className="mt-32 md:mt-48 mb-20 bg-gradient-to-tr from-zinc-900 to-zinc-950 border border-white/10 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-orange-500/10 blur-[100px] pointer-events-none" />
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black tracking-tighter mb-6 relative z-10"
            >
              {t.bannerTitle}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 relative z-10"
            >
              {t.bannerSub}
            </motion.p>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/onboarding"
                className="inline-block px-10 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] relative z-10"
              >
                {t.bannerCta}
              </Link>
            </motion.div>
          </div>
        </main>

        {/* ── FOOTER ────────────────────────────────────────────────── */}
        <footer className="border-t border-white/5 bg-black text-center py-12 relative z-10" role="contentinfo">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 opacity-50">
              <span className="text-xs font-black uppercase tracking-widest text-white">BarManager © 2026</span>
            </div>
            <div className="flex gap-6 text-xs font-bold uppercase tracking-widest text-zinc-600">
              <a href="#" className="hover:text-zinc-300 transition-colors">{t.footerPrivacy}</a>
              <a href="#" className="hover:text-zinc-300 transition-colors">{t.footerTerms}</a>
              <a href="mailto:contact@barmanager.app" className="hover:text-zinc-300 transition-colors">{t.footerContact}</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
