import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Clipboard, Activity, Shield, FileText, ArrowRight, CheckCircle, Mail } from 'lucide-react';

export default function Home() {
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
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <main className="relative min-h-screen bg-slate-950 overflow-hidden selection:bg-blue-500/30">
      {/* Background Orbs - Healthcare Themed */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply opacity-20 filter blur-3xl animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply opacity-20 filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply opacity-20 filter blur-3xl animate-blob animation-delay-4000"></div>

      <div className="relative container mx-auto px-4 py-8 z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16 glass-dark rounded-full px-6 py-3 border border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              MediNotes Pro
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-slate-300 hover:text-white font-medium transition-colors cursor-pointer">
                  Kirjaudu
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="bg-white text-slate-950 px-5 py-2 rounded-full font-bold hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95 cursor-pointer">
                  Aloita kokeilu
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-6">
                <Link
                  href="/product"
                  className="text-slate-300 hover:text-white font-medium transition-colors"
                >
                  Työpöytä
                </Link>
                <UserButton showName={true} appearance={{
                  elements: {
                    userButtonAvatarBox: "border border-white/10",
                    userButtonOuterIdentifier: "text-slate-300 font-medium"
                  }
                }} />
              </div>
            </SignedIn>
          </div>
        </nav>

        {/* Hero Section */}
        <motion.div
          className="text-center max-w-4xl mx-auto py-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Turvallinen ja HIPAA-yhteensopiva AI</span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight"
          >
            Optimoi <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Potilaskirjaukset
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Säästä tuntikausia paperitöissä. Tekoälyavustajamme muuntaa vastaanotto-muistiinpanosi ammattimaisiksi yhteenvedoiksi, jatko-ohjeiksi ja potilasviesteiksi sekunneissa.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto bg-blue-600 border border-blue-500 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 group cursor-pointer">
                  Aloita ilmainen kokeilu
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/product" className="w-full sm:w-auto">
                <button className="w-full bg-blue-600 border border-blue-500 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 group cursor-pointer">
                  Avaa MediNotes Pro
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </SignedIn>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6 text-left"
          >
            <div className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 bg-blue-500/10 rounded-bl-3xl">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-4">Lääkärin yhteenveto</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Muodostaa rakenteelliset ja ammattimaiset yhteenvedot lääkärin muistiinpanojen pohjalta arkistointia varten.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 bg-cyan-500/10 rounded-bl-3xl">
                <CheckCircle className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-4">Jatkotunnisteet</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Tunnistaa automaattisesti seuraavat askeleet, tutkimukset ja reseptien uusinnat helpottamaan lääkärin työtä.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 bg-indigo-500/10 rounded-bl-3xl">
                <Mail className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-4">Potilasviestit</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Luo ystävällisen ja selkeän sähköpostiluonnoksen, joka selittää hoito-ohjeet potilaalle ymmärrettävästi.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-white/5 text-center text-slate-600 text-sm pb-12">
          © 2026 MediNotes Pro. Luottamuksellinen ja ammattimainen AI-avustaja.
        </footer>
      </div>
    </main>
  );
}