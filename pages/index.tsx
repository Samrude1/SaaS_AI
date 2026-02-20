import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Sparkles, FileText, ArrowRight, CheckCircle, Mail, Zap, MessageSquare } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <main className="relative min-h-screen bg-slate-950 overflow-hidden selection:bg-violet-500/30">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply opacity-20 filter blur-3xl animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply opacity-20 filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply opacity-20 filter blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative container mx-auto px-4 py-8 z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16 glass-dark rounded-full px-6 py-3 border border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-violet-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              MeetingMind Pro
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-slate-300 hover:text-white font-medium transition-colors cursor-pointer">Sign in</button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="bg-white text-slate-950 px-5 py-2 rounded-full font-bold hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95 cursor-pointer">
                  Try for free
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-6">
                <Link href="/product" className="text-slate-300 hover:text-white font-medium transition-colors">Dashboard</Link>
                <UserButton showName={true} appearance={{ elements: { userButtonAvatarBox: "border border-white/10" } }} />
              </div>
            </SignedIn>
          </div>
        </nav>

        {/* Hero Section */}
        <motion.div className="text-center max-w-4xl mx-auto py-12" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Powered by Gemini, GPT-4o, and more</span>
          </motion.div>

          <motion.h2 variants={itemVariants} className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight">
            Turn Notes Into<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              Action
            </span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Paste your raw meeting notes and get instant decisions, action items, a ready-to-send Slack message and a follow-up email draft — in seconds.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto bg-violet-600 border border-violet-500 hover:bg-violet-500 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center justify-center gap-2 group cursor-pointer">
                  Start for free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/product" className="w-full sm:w-auto">
                <button className="w-full bg-violet-600 border border-violet-500 hover:bg-violet-500 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center justify-center gap-2 group cursor-pointer">
                  Open MeetingMind Pro <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </SignedIn>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 text-left">
            <div className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 bg-violet-500/10 rounded-bl-3xl">
                <CheckCircle className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-4">Key Decisions</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Every concrete decision from your meeting, extracted and listed clearly in seconds.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 bg-fuchsia-500/10 rounded-bl-3xl">
                <MessageSquare className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-4">Action Items + Slack</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                A table of tasks with owners and deadlines, plus a ready-to-paste Slack summary.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 bg-indigo-500/10 rounded-bl-3xl">
                <Mail className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-4">Follow-up Email</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                A professional follow-up email draft, ready to send to all participants.
              </p>
            </div>
          </motion.div>

          {/* Model badges */}
          <motion.div variants={itemVariants} className="mt-12 flex items-center justify-center gap-4 flex-wrap">
            <span className="text-slate-600 text-sm">Powered by</span>
            {["Gemini 2.5 Flash-Lite", "GPT-4o Mini"].map(m => (
              <span key={m} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 text-xs font-mono">{m}</span>
            ))}
          </motion.div>
        </motion.div>

        <footer className="mt-32 pt-12 border-t border-white/5 text-center text-slate-600 text-sm pb-12">
          © 2026 MeetingMind Pro. AI-powered meeting intelligence.
        </footer>
      </div>
    </main>
  );
}