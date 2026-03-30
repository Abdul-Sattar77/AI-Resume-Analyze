"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LayoutDashboard, FileText, Zap } from "lucide-react";
import UploadForm from "@/components/UploadForm";
import ResultCard from "@/components/ResultCard";

export default function Home() {
  const [result, setResult] = useState(null);

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <span>Resume<span className="text-blue-500">Analyzer</span>.pro</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">API Docs</a>
          </div>
          <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-50 transition-all">
            Get Pro
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6"
          >
            <Sparkles size={14} /> NEW: GEMINI 1.5 FLASH POWERED
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-black tracking-tighter text-white mb-6"
          >
            Land Your Dream Job <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              With AI Intelligence.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Don't let ATS filters stop you. Our AI analyzes your resume against any job description, 
            giving you actionable insights to beat the competition.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="p-1 rounded-3xl bg-gradient-to-b from-slate-700 to-slate-900 shadow-2xl">
              <UploadForm onResult={(data) => setResult(data)} />
            </div>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <ResultCard data={result} />
                </motion.div>
              ) : (
                <motion.div 
                  key="placeholder"
                  className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500 bg-slate-900/20"
                >
                  <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                    <LayoutDashboard size={40} />
                  </div>
                  <p className="font-medium">Analysis results will appear here</p>
                  <p className="text-sm opacity-60 px-6 text-center mt-2">Upload your resume to see your match score and missing skills.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}