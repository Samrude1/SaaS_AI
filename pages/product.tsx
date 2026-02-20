"use client"

import { useState, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth, Protect, PricingTable, UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, RefreshCw, Calendar, MessageSquare, Zap, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import DatePicker from 'react-datepicker';

const MODELS = [
    { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite', badge: 'Fast · Free', color: 'text-blue-400' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini', badge: 'Accurate', color: 'text-emerald-400' },
];

function MeetingForm() {
    const { getToken } = useAuth();

    const [topic, setTopic] = useState('');
    const [meetingDate, setMeetingDate] = useState<Date | null>(new Date());
    const [notes, setNotes] = useState('');
    const [model, setModel] = useState('gemini-2.5-flash-lite');
    const [output, setOutput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setIsGenerating(true);
        setOutput('');
        let buffer = '';

        const jwt = await getToken();
        if (!jwt) { setOutput('Authentication required'); setIsGenerating(false); return; }

        const controller = new AbortController();
        try {
            await fetchEventSource('/api/consultation', {
                signal: controller.signal,
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
                body: JSON.stringify({
                    topic,
                    meeting_date: meetingDate?.toISOString().slice(0, 10),
                    notes,
                    model,
                }),
                onmessage(ev) {
                    try { buffer += JSON.parse(ev.data); }
                    catch { buffer += ev.data; }
                    setOutput(buffer);
                },
                onclose() { setIsGenerating(false); },
                onerror(err) { console.error('SSE error:', err); controller.abort(); setIsGenerating(false); }
            });
        } catch (error) {
            console.error('Submission failed:', error);
            setIsGenerating(false);
        }
    }

    const selectedModel = MODELS.find(m => m.value === model) ?? MODELS[0];

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-start">

                {/* ── Form Side ── */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 shadow-2xl"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-violet-600/20 rounded-2xl flex items-center justify-center border border-violet-500/20">
                            <FileText className="w-6 h-6 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Meeting Notes</h2>
                            <p className="text-slate-400 text-sm">Paste your raw notes and let AI do the rest</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Topic */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-violet-400" /> Meeting Topic
                            </label>
                            <input
                                type="text" required value={topic}
                                onChange={e => setTopic(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-slate-600"
                                placeholder="e.g. Q2 Planning Kickoff"
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-violet-400" /> Meeting Date
                            </label>
                            <DatePicker
                                selected={meetingDate}
                                onChange={(date: Date | null) => setMeetingDate(date)}
                                dateFormat="dd.MM.yyyy"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all cursor-pointer"
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-violet-400" /> Raw Meeting Notes
                            </label>
                            <textarea
                                required rows={8} value={notes}
                                onChange={e => setNotes(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all placeholder:text-slate-600 resize-none"
                                placeholder="Paste or type your raw, unstructured meeting notes here..."
                            />
                        </div>

                        {/* Model Selector */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-violet-400" /> AI Model
                            </label>
                            <div className="relative">
                                <select
                                    value={model}
                                    onChange={e => setModel(e.target.value)}
                                    className="w-full appearance-none bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all cursor-pointer pr-12"
                                >
                                    {MODELS.map(m => (
                                        <option key={m.value} value={m.value}>{m.label} — {m.badge}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                            <p className={`text-xs ml-1 ${selectedModel.color}`}>
                                Selected: {selectedModel.label} · {selectedModel.badge}
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit" disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-violet-500/10 flex items-center justify-center gap-3"
                        >
                            {isGenerating ? (
                                <><RefreshCw className="w-5 h-5 animate-spin" /> Analysing...</>
                            ) : (
                                <><Sparkles className="w-5 h-5" /> Generate Summary</>
                            )}
                        </button>
                    </form>
                </motion.div>

                {/* ── Output Side ── */}
                <div className="relative min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {output || isGenerating ? (
                            <motion.div
                                key="output"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass p-8 md:p-10 rounded-[2.5rem] border-white/5 shadow-2xl h-full overflow-y-auto"
                            >
                                {isGenerating ? (
                                    // Streaming skeleton
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 mb-6">
                                            <RefreshCw className="w-4 h-4 text-violet-400 animate-spin" />
                                            <span className="text-violet-400 text-sm font-semibold">Generating your summary...</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
                                            <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                                            <div className="h-4 bg-white/5 rounded-full w-5/6 animate-pulse"></div>
                                            <div className="h-4 bg-white/5 rounded-full w-2/3 animate-pulse"></div>
                                        </div>
                                        <div className="mt-8 space-y-3">
                                            <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                                            <div className="h-4 bg-white/5 rounded-full w-4/5 animate-pulse"></div>
                                            <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
                                            <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
                                        </div>
                                    </div>
                                ) : (
                                    // Done: render beautiful markdown
                                    <div className="markdown-content">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-[2.5rem]"
                            >
                                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6">
                                    <FileText className="w-10 h-10 text-slate-700" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-400 mb-2">No summary yet</h3>
                                <p className="text-slate-600 max-w-xs">Fill in the form and hit Generate to see your structured meeting output here.</p>
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
        <main className="min-h-screen bg-[#020617] text-[#f8fafc] selection:bg-violet-500/30">
            <header className="border-b border-white/5 bg-[#020617]/90 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-white tracking-tight text-xl">MeetingMind Pro</span>
                    </Link>
                    <UserButton
                        showName={true}
                        appearance={{ baseTheme: dark, elements: { userButtonAvatarBox: "border-2 border-violet-500/40 shadow-lg" } }}
                    />
                </div>
            </header>

            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-1/4 -right-20 w-[30rem] h-[30rem] bg-violet-600/10 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-1/4 -left-20 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[140px]"></div>
            </div>

            <div className="relative z-10 font-sans">
                <Protect
                    plan="premium_subscription"
                    fallback={
                        <div className="container mx-auto px-4 py-24 max-w-5xl">
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-16">
                                <div className="inline-flex p-4 bg-violet-500/10 rounded-2xl border border-violet-500/20 mb-6 font-bold text-violet-400">
                                    PREMIUM ACCESS
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
                                    Supercharge <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">Your Meetings</span>
                                </h1>
                                <p className="text-slate-300 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                                    MeetingMind Pro turns your messy notes into clean decisions, action items, and ready-to-send emails — in seconds.
                                </p>
                            </motion.div>
                            <div className="max-w-4xl mx-auto bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                                <PricingTable />
                            </div>
                        </div>
                    }
                >
                    <MeetingForm />
                </Protect>
            </div>
        </main>
    );
}
