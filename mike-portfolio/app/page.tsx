'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MIKE_CONTEXT: Record<string, string> = {
  recruiter: "You are Mike Ncube's AI assistant talking to a RECRUITER. Be professional and concise. Highlight: 5+ years building AI/ML systems, RAG architectures deployed across 26 countries, AWS infrastructure with 99.9% uptime, 92% ML accuracy on 10M+ records/day. Mike is available immediately for AI Infrastructure roles. Email: mikencube03@gmail.com. GitHub: MikeNcube.",
  developer: "You are Mike Ncube's AI assistant talking to a DEVELOPER. Be technical and detailed. Highlight: RAG with semantic chunking, MMR reranking, hybrid dense/sparse retrieval. Agentic AI: planner-executor-critic multi-agent architecture. AWS: Multi-AZ, ALB, Auto Scaling, CodePipeline. Stack: Python, LangChain, Spark, PostgreSQL, Docker, Next.js. Open to collaboration.",
  friend: "You are Mike Ncube's AI assistant talking to a FRIEND. Be casual, warm and fun. Mike is an AI engineer from South Africa who built cool AI systems deployed across 26 African countries. He loves building things that scale and is always up for a chat about AI, tech or life.",
};

const skills = [
  { category: 'AI and LLM', icon: 'ðŸ¤–', items: ['RAG Architectures', 'Agentic AI', 'LangChain', 'Vector DBs', 'Prompt Engineering', 'Gemini CLI'] },
  { category: 'Cloud and Infra', icon: 'â˜ï¸', items: ['AWS EC2/ALB', 'Auto Scaling', 'CI/CD', 'Terraform', 'Railway', 'VPC/IAM'] },
  { category: 'Data and ML', icon: 'ðŸ“Š', items: ['Apache Spark', 'Python', 'PostgreSQL', 'Pandas', 'Docker', 'ML Pipelines'] },
  { category: 'Architecture', icon: 'ðŸ—ï¸', items: ['System Design', 'REST APIs', 'React', 'Workflow Automation', 'Compliance Systems', 'Audit Logging'] },
];

const stats = [
  { val: '26+', label: 'Countries' },
  { val: '92%', label: 'ML Accuracy' },
  { val: '10M+', label: 'Records/Day' },
  { val: '60%', label: 'Less Latency' },
];

type Project = {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  metrics: { val: string; label: string }[];
  color: string;
  url: string;
};

type Message = {
  role: 'ai' | 'user';
  content: string;
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [visitorType, setVisitorType] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/github').then(r => r.json()).then(data => {
      setProjects(Array.isArray(data) ? data : []);
      setLoadingProjects(false);
    }).catch(() => setLoadingProjects(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectVisitorType = (type: string) => {
    setVisitorType(type);
    setChatStarted(true);
    const greetings: Record<string, string> = {
      recruiter: "Hi! I'm Mike's AI assistant. I see you're a recruiter â€” great! Mike is actively looking for AI Infrastructure roles. What would you like to know about his experience?",
      developer: "Hey! Fellow developer here. Mike's built some seriously cool RAG and agentic AI systems. Want to geek out about the tech stack?",
      friend: "Hey there! ðŸ‘‹ Mike's pretty awesome â€” built AI systems deployed across 26 countries! What do you want to know about him?",
    };
    setMessages([{ role: 'ai', content: greetings[type] }]);
  };

  const send = async (text: string = '') => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          repos: projects,
          context: MIKE_CONTEXT[visitorType] || MIKE_CONTEXT.developer,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response || 'Sorry, something went wrong.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Connection error. Please try again.' }]);
    }
    setLoading(false);
  };

  const handleContact = async () => {
    if (!form.name || !form.email || !form.message) return;
    setFormStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setFormStatus('success');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 4000);
      }
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  const quickReplies: Record<string, string[]> = {
    recruiter: ['Experience?', 'Available now?', 'Key projects?'],
    developer: ['RAG details?', 'AWS stack?', 'Agentic AI?'],
    friend: ['What does he do?', 'Cool projects?', 'Contact him'],
  };

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0a0f1e 50%, #0d1117 100%)' }}>

      {/* NAV */}
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4"
        style={{ background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="font-black text-lg text-white">MIKE<span style={{ color: '#0066FF' }}>.</span>NCUBE</span>
        <div className="hidden md:flex gap-8">
          {['About', 'Projects', 'Skills', 'Contact'].map(item => (
            <a key={item} href={'#' + item.toLowerCase()} className="text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>{item}</a>
          ))}
        </div>
        <a href="mailto:mikencube03@gmail.com" className="text-xs font-semibold px-5 py-2 rounded-lg text-white" style={{ background: '#0066FF' }}>Hire Me</a>
      </motion.nav>

      {/* HERO */}
      <section id="about" className="min-h-screen flex flex-col justify-center px-4 md:px-16 pt-20 pb-8">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-8 md:gap-16 items-center">

          {/* LEFT */}
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-6">
              <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full" style={{ background: '#00C896' }} />
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#00C896' }}>AI Infrastructure Engineer</span>
            </div>
            <h1 className="font-black leading-none mb-4" style={{ fontSize: 'clamp(2.5rem,5vw,5.5rem)', letterSpacing: '-0.03em' }}>
              <span className="text-white">Mike S</span><br />
              <span className="glow-text">Ncube</span>
            </h1>
            <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(255,255,255,0.55)' }}>
              I design and deploy scalable AI systems â€” RAG architectures, agentic workflows, and cloud infrastructure built for real enterprise environments.
            </p>
            <div className="flex gap-4 mb-8 flex-wrap">
              <a href="#projects" style={{ padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14, background: '#0066FF', color: '#fff', textDecoration: 'none', display: 'inline-block' }}>View Projects</a>
              <a href="#contact" style={{ padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14, border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', display: 'inline-block' }}>Contact Me</a>
            </div>
            <div className="flex gap-8 pt-6 flex-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {stats.map(s => (
                <div key={s.label}>
                  <div className="font-black text-2xl text-white">{s.val}</div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col gap-5 items-center">

            {/* PHOTO */}
            <div className="relative w-full max-w-xs rounded-2xl overflow-hidden flex-shrink-0 mx-auto" style={{ height: 280, border: '2px solid rgba(0,102,255,0.4)', boxShadow: '0 0 40px rgba(0,102,255,0.2)' }}>
              <img src="/Mike_Org.jpeg" alt="Mike Ncube" className="w-full h-full object-cover object-top" />
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-2" style={{ background: 'linear-gradient(transparent, rgba(13,17,23,0.95))' }}>
                <motion.div animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#00C896' }} />
                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: '#00C896' }}>Available for Opportunities</span>
              </div>
            </div>

            {/* AI CHAT */}
            <div className="w-full rounded-2xl overflow-hidden" style={{ background: 'rgba(10,12,24,0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,102,255,0.25)', boxShadow: '0 0 40px rgba(0,102,255,0.1)' }}>

              {/* Chat header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(0,102,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }}></div>
                </div>
                <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>mike-ai v3.0</span>
                <div className="flex items-center gap-1.5">
                  <motion.div animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full" style={{ background: '#00C896' }} />
                  <span className="text-xs font-mono" style={{ color: '#00C896' }}>GEMINI</span>
                </div>
              </div>

              {/* Visitor selector */}
              <AnimatePresence>
                {!chatStarted && (
                  <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
                    <p className="text-xs mb-3 text-center font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>Who are you? I will tailor my responses for you.</p>
                    <div className="flex gap-2 justify-center flex-wrap">
                      {[
                        { type: 'recruiter', label: 'ðŸ’¼ Recruiter', desc: 'Hiring?' },
                        { type: 'developer', label: 'ðŸ‘¨â€ðŸ’» Developer', desc: 'Tech talk?' },
                        { type: 'friend', label: 'ðŸ‘‹ Friend', desc: 'Just curious?' }
                      ].map(v => (
                        <motion.button key={v.type} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => selectVisitorType(v.type)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-0.5"
                          style={{ background: 'rgba(0,102,255,0.12)', border: '1px solid rgba(0,102,255,0.3)', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}>
                          <span>{v.label}</span>
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{v.desc}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              {chatStarted && (
                <div className="h-52 overflow-y-auto p-4 flex flex-col gap-3">
                  {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      className={'flex gap-2 ' + (msg.role === 'user' ? 'flex-row-reverse' : '')}>
                      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: msg.role === 'ai' ? 'linear-gradient(135deg,#0066FF,#00C896)' : 'rgba(255,255,255,0.1)' }}>
                        {msg.role === 'ai' ? 'AI' : 'U'}
                      </div>
                      <div className="max-w-xs px-3 py-2 text-xs leading-relaxed"
                        style={{ whiteSpace: 'pre-line', background: msg.role === 'ai' ? 'rgba(255,255,255,0.05)' : 'rgba(0,102,255,0.2)', border: '1px solid ' + (msg.role === 'ai' ? 'rgba(255,255,255,0.08)' : 'rgba(0,102,255,0.3)'), borderRadius: msg.role === 'ai' ? '4px 12px 12px 12px' : '12px 4px 12px 12px', color: 'rgba(255,255,255,0.85)' }}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg,#0066FF,#00C896)' }}>AI</div>
                      <div className="px-3 py-2 flex gap-1 items-center"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px 12px 12px 12px' }}>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Quick replies */}
              {chatStarted && (
                <div className="px-3 py-2 flex gap-2 overflow-x-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {(quickReplies[visitorType] || quickReplies.developer).map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="text-xs px-3 py-1 rounded-full flex-shrink-0 whitespace-nowrap"
                      style={{ background: 'rgba(0,102,255,0.1)', border: '1px solid rgba(0,102,255,0.3)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>{s}</button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <input type="text" value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send(input)}
                  placeholder={chatStarted ? 'Ask me anything about Mike...' : 'Select who you are first...'}
                  disabled={!chatStarted || loading}
                  className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.87)' }} />
                <button onClick={() => send(input)} disabled={!chatStarted || loading || !input.trim()}
                  className="w-8 h-8 rounded-lg text-white text-xs font-bold flex-shrink-0 flex items-center justify-center"
                  style={{ background: '#0066FF', border: 'none', cursor: 'pointer' }}>â†’</button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-16 px-4 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 style={{ fontWeight: 900, color: "#fff", fontSize: "clamp(2rem,4vw,3.5rem)" }}>GitHub Projects</h2>
            <div className="flex items-center gap-2">
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full" style={{ background: '#00C896' }} />
              <span className="text-xs font-mono" style={{ color: '#00C896' }}>Auto-synced from GitHub</span>
            </div>
          </div>
          <p className="mb-12 text-sm" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 500 }}>Live projects pulled directly from GitHub â€” always up to date.</p>

          {loadingProjects ? (
            <div className="flex gap-3 items-center p-6">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 rounded-full" style={{ border: '2px solid rgba(0,102,255,0.3)', borderTop: '2px solid #0066FF' }} />
              <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>Fetching from GitHub...</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((p, i) => (
                <motion.div key={p.num} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} onClick={() => window.open(p.url, '_blank')}
                  className="p-6 rounded-2xl cursor-pointer group"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid ' + p.color + '33' }}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-black" style={{ fontSize: 56, color: p.color + '18', lineHeight: 1 }}>{p.num}</span>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {p.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full"
                          style={{ background: p.color + '18', border: '1px solid ' + p.color + '44', color: p.color }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-2 capitalize" style={{ fontSize: 16 }}>{p.title}</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.desc}</p>
                  <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex gap-5">
                      {p.metrics.map(m => (
                        <div key={m.label}>
                          <div className="font-black text-lg" style={{ color: p.color }}>{m.val}</div>
                          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "rgba(255,255,255,0.3)" }} style={{ color: 'rgba(255,255,255,0.4)' }}>View →</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-16 px-4 md:px-16" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="font-black text-white mb-12" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>The Stack</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {skills.map((s, i) => (
              <motion.div key={s.category} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }} className="p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-bold text-white text-sm mb-4">{s.category}</div>
                <ul className="space-y-2">
                  {s.items.map(item => (
                    <li key={item} className="text-xs flex items-center gap-2"
                      style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 4 }}>
                      <span style={{ color: '#0066FF', fontSize: 8 }}>â–¶</span>{item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16 px-4 md:px-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <img src="/Mike_3d.png" alt="Mike 3D" style={{ width: 120, height: 120, objectFit: 'contain', animation: 'float 6s ease-in-out infinite', margin: '0 auto 16px', filter: 'drop-shadow(0 0 20px rgba(0,102,255,0.6))' }} />
            <h2 className="font-black text-white mb-4" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>Lets Build Something Real</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>Looking for an AI Infrastructure Engineer who can take your AI ambitions from architecture to production?</p>
          </div>

          <div className="p-8 rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex gap-4 mb-4 flex-wrap">
              <div className="flex-1 min-w-48">
                <label className="text-xs font-mono tracking-widest block mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>YOUR NAME</label>
                <input type="text" placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.87)' }} />
              </div>
              <div className="flex-1 min-w-48">
                <label className="text-xs font-mono tracking-widest block mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>YOUR EMAIL</label>
                <input type="email" placeholder="john@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.87)' }} />
              </div>
            </div>
            <div className="mb-5">
              <label className="text-xs font-mono tracking-widest block mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>MESSAGE</label>
              <textarea placeholder="Tell me about your project or opportunity..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={5}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.87)', lineHeight: 1.6 }} />
            </div>
            <button onClick={handleContact} disabled={formStatus === 'sending' || !form.name || !form.email || !form.message}
              className="w-full py-4 rounded-xl font-bold text-sm text-white transition-all"
              style={{ background: formStatus === 'success' ? '#00C896' : formStatus === 'error' ? '#FF5F57' : '#0066FF', border: 'none', cursor: 'pointer' }}>
              {formStatus === 'sending' ? 'Sending...' : formStatus === 'success' ? 'âœ“ Message Sent!' : formStatus === 'error' ? 'Failed - Try Again' : 'Send Message'}
            </button>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <a href="mailto:mikencube03@gmail.com" className="px-6 py-3 rounded-xl font-semibold text-sm text-white" style={{ background: '#0066FF' }}>Email Mike</a>
            <a href="https://github.com/MikeNcube" target="_blank" className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>GitHub</a>
            <a href="https://www.linkedin.com/in/mike-ncube-669563a7/" target="_blank" className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>LinkedIn</a>
          </div>

          <p className="text-center mt-8 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>2025 Mike S Ncube. All rights reserved.</p>
        </div>
      </section>

    </main>
  );
}



