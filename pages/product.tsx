"use client"

import { useState, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useAuth, Protect, PricingTable, UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clipboard, RefreshCw, Calendar, User, Activity, Rocket } from 'lucide-react';
import Link from 'next/link';
import DatePicker from 'react-datepicker';

function ConsultationForm() {
    const { getToken } = useAuth();

    // Form state
    const [patientName, setPatientName] = useState('');
    const [visitDate, setVisitDate] = useState<Date | null>(new Date());
    const [notes, setNotes] = useState('');

    // Streaming state
    const [output, setOutput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setIsGenerating(true);
        setOutput('');
        let buffer = '';

        const jwt = await getToken();
        if (!jwt) {
            setOutput('Authentication required');
            setIsGenerating(false);
            return;
        }

        const controller = new AbortController();

        try {
            await fetchEventSource('/api/consultation', {
                signal: controller.signal,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`
                },
                body: JSON.stringify({
                    patient_name: patientName,
                    date_of_visit: visitDate?.toISOString().slice(0, 10),
                    notes,
                }),
                onmessage(ev) {
                    buffer += ev.data;
                    setOutput(buffer);
                },
                onclose() {
                    setIsGenerating(false);
                },
                onerror(err) {
                    console.error('SSE error:', err);
                    controller.abort();
                    setIsGenerating(false);
                }
            });
        } catch (error) {
            console.error('Submission failed:', error);
            setIsGenerating(false);
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Form Side */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
                            <Clipboard className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Vastaanottolomake</h2>
                            <p className="text-slate-400 text-sm">Täytä potilaan tiedot ja huomiot</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-400" /> Potilaan nimi
                            </label>
                            <input
                                type="text"
                                required
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                                placeholder="Esim. Matti Meikäläinen"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-400" /> Vastaanottopäivä
                            </label>
                            <div className="relative">
                                <DatePicker
                                    selected={visitDate}
                                    onChange={(date: Date | null) => setVisitDate(date)}
                                    dateFormat="dd.MM.yyyy"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-400" /> Vastaanottokäynnin muistiinpanot
                            </label>
                            <textarea
                                required
                                rows={8}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 resize-none"
                                placeholder="Kuvaile oireet, havainnot ja määräykset..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3 group"
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Analysoidaan...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Luo Yhteenveto
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* Output Side */}
                <div className="relative min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {output || isGenerating ? (
                            <motion.div
                                key="output"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 shadow-2xl h-full overflow-y-auto"
                            >
                                <div className="markdown-content">
                                    {output ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                            {output}
                                        </ReactMarkdown>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-48 text-slate-500 animate-pulse">
                                            <Activity className="w-12 h-12 mb-4 text-blue-500/20" />
                                            <p>Valmistellaan lääketieteellistä analyysia...</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-[2.5rem]"
                            >
                                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6">
                                    <Clipboard className="w-10 h-10 text-slate-700" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-400 mb-2">Ei raporttia saatavilla</h3>
                                <p className="text-slate-600 max-w-xs">Täytä vasemmanpuoleinen lomake aloittaaksesi älykkään yhteenvedon luomisen.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default function Product() {
    return (
        <main className="min-h-screen bg-[#020617] text-[#f8fafc] selection:bg-blue-500/30">
            {/* Global Header */}
            <header className="border-b border-white/5 bg-[#020617]/90 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-white tracking-tight text-xl">MediNotes Pro</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <UserButton
                            showName={true}
                            appearance={{
                                baseTheme: dark,
                                elements: {
                                    userButtonAvatarBox: "border-2 border-blue-500/40 shadow-lg",
                                    userButtonOuterIdentifier: "text-slate-200 font-bold"
                                }
                            }}
                        />
                    </div>
                </div>
            </header>

            {/* Background Effects - Healthcare Themed */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-1/4 -right-20 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-1/4 -left-20 w-[30rem] h-[30rem] bg-cyan-600/10 rounded-full blur-[140px]"></div>
            </div>

            <div className="relative z-10 font-sans">
                <Protect
                    plan="premium_subscription"
                    fallback={
                        <div className="container mx-auto px-4 py-24 max-w-5xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center mb-16"
                            >
                                <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-6 font-bold text-blue-400">
                                    PREMIUM-PÄÄSY
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                                    Optimoi <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">Työnkulkusi</span>
                                </h1>
                                <p className="text-slate-300 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                                    MediNotes Pro on tarkoitettu terveydenhuollon ammattilaisille. Liity edelläkävijöiden joukkoon ja tehosta potilaskommunikaatiotasi.
                                </p>
                            </motion.div>
                            <div className="max-w-4xl mx-auto bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                                <PricingTable />
                            </div>
                        </div>
                    }
                >
                    <ConsultationForm />
                </Protect>
            </div>
        </main>
    );
}
