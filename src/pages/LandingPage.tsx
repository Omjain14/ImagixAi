import React from "react";
import { motion } from "motion/react";
import { Zap, Shield, Wand2, Download, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-48 px-4 md:px-12 flex flex-col items-center text-center">
        {/* Background blobs */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-500/10 dark:bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-500/10 dark:bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto z-10"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8 border-slate-200 dark:border-white/20 text-slate-900 dark:text-white shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 dark:bg-brand-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-brand-white"></span>
            </span>
            25 Free Credits for New Users
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-8xl font-display font-bold leading-[0.9] tracking-tighter mb-8 uppercase text-slate-900 dark:text-white"
          >
            TURN YOUR <br /><span className="opacity-30">IMAGINATIONS</span> <br /><span className="text-gradient">INTO REAL IMAGES.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-slate-500 dark:text-brand-gray text-sm md:text-lg max-w-xl mx-auto mb-12 leading-relaxed font-medium"
          >
            Powered by Google AI Studio. Privacy-first image generation with zero permanent storage. Professional grade visuals in seconds.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/generator" 
              className="bg-slate-900 dark:bg-brand-white text-white dark:text-brand-black px-10 py-5 rounded-2xl font-bold text-lg hover:translate-y-[-4px] active:scale-95 transition-all flex items-center justify-center gap-2 group shadow-xl"
            >
              Start Generating
              <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
            <Link 
              to="/purchase" 
              className="glass px-10 py-5 rounded-2xl font-bold text-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm"
            >
              View Pricing
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Demo Images Row */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4 w-full max-w-7xl"
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square relative group overflow-hidden rounded-3xl glass border-slate-200 dark:border-white/10 shadow-xl">
              <img 
                src={`https://picsum.photos/seed/ai-gen-${i}/800/800`}
                alt="Sample AI Generation"
                className="w-full h-full object-cover opacity-80 dark:opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 dark:from-black/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-white text-[10px] font-bold uppercase tracking-widest leading-relaxed">Prompt: Futuristic cyberpunk city with neon lighting and high detail architecture...</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 md:px-12 bg-slate-50 dark:bg-white/5 border-y border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4 text-slate-900 dark:text-white uppercase">ENGINEERED FOR <span className="opacity-30">EXCELLENCE</span></h2>
              <p className="text-slate-500 dark:text-brand-gray font-medium">Efficient workflow for high-quality AI images without any storage bloat.</p>
            </div>
            <Link to="/generator" className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:opacity-80 transition-all flex items-center gap-2">
              Try it now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6" />}
              title="ULTRA FAST"
              description="Direct API optimization ensures your unique images are ready in under 10 seconds."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6" />}
              title="PRIVACY FIRST"
              description="We do not store your prompts or images. Your data never touches our permanent servers."
            />
            <FeatureCard 
              icon={<Download className="w-6 h-6" />}
              title="PRO EXPORT"
              description="High-resolution downloads in 1024x1024 format, ready for professional use."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 md:px-12 bg-white dark:bg-transparent">
        <div className="max-w-5xl mx-auto text-center mb-20 md:mb-32">
          <h2 className="text-4xl md:text-7xl font-display font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-tighter">SIMPLE. SECURE. <span className="opacity-30">SEAMLESS.</span></h2>
          <p className="text-slate-500 dark:text-brand-gray font-medium">Getting started takes less than a minute. Guaranteed.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 relative">
          <Step 
            number="01"
            title="Create Identity"
            description="Sign up and receive 25 free high-quality generation credits instantly."
          />
          <Step 
            number="02"
            title="Design Visions"
            description="Enter detailed prompts and witness the AI crafting your vision in Real-Time."
          />
          <Step 
            number="03"
            title="Own Forever"
            description="Save your creations directly. We keep nothing, ensuring your total creative privacy."
          />
          {/* Connector lines (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-1/4 w-[15%] h-[1px] bg-slate-200 dark:bg-white/10 -translate-y-1/2"></div>
          <div className="hidden md:block absolute top-1/2 left-[60%] w-[15%] h-[1px] bg-slate-200 dark:bg-white/10 -translate-y-1/2"></div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 px-4 md:px-12 bg-slate-50 dark:bg-white/5 border-y border-slate-200 dark:border-white/5 overflow-hidden relative">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/5 dark:bg-white/5 rounded-full blur-[100px] -ml-32"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-4 text-slate-900 dark:text-white uppercase">CREATOR <span className="opacity-30">FEEDBACK</span></h2>
            <p className="text-slate-500 dark:text-brand-gray font-medium max-w-xl mx-auto">See why thousands of digital artists and creators choose Imagix AI for their visual needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REVIEWS.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 md:px-12">
        <div className="max-w-7xl mx-auto rounded-[40px] glass p-12 md:p-24 overflow-hidden relative border-slate-200 dark:border-white/20 shadow-2xl bg-white/40 dark:bg-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-brand-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-7xl font-display font-bold tracking-tighter mb-8 leading-none text-slate-900 dark:text-white uppercase">
              Ready to bring your <br /><span className="opacity-30">imaginations</span> to life?
            </h2>
            <Link 
              to="/signup" 
              className="inline-flex bg-slate-900 dark:bg-brand-white text-white dark:text-brand-black px-12 py-5 rounded-2xl font-bold text-xl hover:translate-y-[-4px] transition-all shadow-xl shadow-blue-500/10"
            >
              Join Imagix Now
            </Link>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-slate-500 dark:text-brand-gray text-[10px] md:text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> No Card Required
              </span>
              <span className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Free 25 Credits
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 md:p-10 rounded-[32px] glass hover:bg-white dark:hover:bg-white/10 transition-all border-slate-200 dark:border-white/10 group shadow-sm hover:shadow-xl hover:translate-y-[-4px]">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-8 text-slate-900 dark:text-brand-white group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold mb-4 text-slate-900 dark:text-white uppercase tracking-tight">{title}</h3>
      <p className="text-slate-500 dark:text-brand-gray text-sm leading-relaxed font-medium">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="text-center group relative">
      <div className="text-7xl md:text-[10rem] font-display font-black text-slate-200/50 dark:text-white/5 mb-[-2.5rem] md:mb-[-4rem] group-hover:text-slate-300 dark:group-hover:text-white/10 transition-all duration-500 select-none">
        {number}
      </div>
      <h3 className="text-2xl md:text-3xl font-display font-bold mb-4 relative z-10 text-slate-900 dark:text-white uppercase tracking-tighter">{title}</h3>
      <p className="text-slate-500 dark:text-brand-gray text-sm md:text-base max-w-[280px] mx-auto leading-relaxed relative z-10 font-medium italic">
        {description}
      </p>
    </div>
  );
}

function ReviewCard({ name, role, content, avatar }: { name: string, role: string, content: string, avatar: string }) {
  return (
    <div className="p-8 rounded-[32px] glass bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col h-full hover:shadow-2xl transition-all hover:translate-y-[-4px]">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10 shadow-inner">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{name}</h4>
          <p className="text-[10px] font-bold text-slate-400 dark:text-brand-gray uppercase tracking-widest">{role}</p>
        </div>
      </div>
      <p className="text-slate-600 dark:text-brand-gray text-sm font-medium leading-[1.6] italic grow">
        "{content}"
      </p>
      <div className="flex gap-1 mt-6">
        {[1, 2, 3, 4, 5].map((s) => (
          <Zap key={s} className="w-3 h-3 text-slate-900 dark:text-brand-white fill-current" />
        ))}
      </div>
    </div>
  );
}

const REVIEWS = [
  {
    name: "Aryan Sharma",
    role: "Concept Artist",
    content: "Imagix AI has completely transformed my workflow. The speed and quality of image generation are unmatched. Truly a game-changer.",
    avatar: "https://i.pravatar.cc/150?u=aryan"
  },
  {
    name: "Sneha Kapoor",
    role: "UI/UX Designer",
    content: "I use this daily for generating unique assets for my design projects. The privacy focus is what keeps me coming back.",
    avatar: "https://i.pravatar.cc/150?u=sneha"
  },
  {
    name: "Rohan Dass",
    role: "Content Creator",
    content: "The best AI image generator I've used so far. Simple interface, powerful results, and the credit system is very fair.",
    avatar: "https://i.pravatar.cc/150?u=rohan"
  }
];
