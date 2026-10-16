import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Image as ImageIcon, Search, Globe, MessageCircle, Mail, Instagram, Youtube, ArrowRight, Play } from 'lucide-react';
import { useCollection, useSettings } from '../lib/data';

const R = ({ children, d = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay: d }}>
    {children}
  </motion.div>
);
const Head = ({ title, sub }) => (
  <R>
    <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">{title}</h2>
    <p className="mt-3 mb-12 max-w-xl text-white/55">{sub}</p>
  </R>
);
const skills = [
  [Video, 'Video Editing', '(Professional)'],
  [ImageIcon, 'Thumbnail Design', '(High CTR)'],
  [Search, 'YouTube SEO & Optimization', ''],
  [Globe, 'Portfolio Website Making', '(Modern & Professional)'],
];
const nav = [['About', '#about'], ['Skills', '#skills'], ['Work', '#work'], ['Updates', '#updates'], ['Contact', '#contact']];

export default function Home() {
  const s = useSettings();
  const projects = useCollection('projects');
  const posts = useCollection('posts');
  const [msg, setMsg] = useState({ name: '', text: '' });
  const initials = s.name.split(' ').map((w) => w[0]).slice(0, 2).join('');

  const send = (e) => {
    e.preventDefault();
    const text = `Hi ${s.name}, I'm ${msg.name}. ${msg.text}`;
    if (s.whatsapp) window.open(`https://wa.me/${s.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
    else if (s.email) window.location.href = `mailto:${s.email}?subject=Project inquiry&body=${encodeURIComponent(text)}`;
  };
  const links = [
    s.whatsapp && [MessageCircle, 'WhatsApp', `https://wa.me/${s.whatsapp.replace(/\D/g, '')}`],
    s.email && [Mail, 'Email', `mailto:${s.email}`],
    s.instagram && [Instagram, 'Instagram', s.instagram],
    s.youtube && [Youtube, 'YouTube', s.youtube],
  ].filter(Boolean);

  return (
    <div className="overflow-x-hidden">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#top" className="font-display text-xl font-bold">{s.name.split(' ')[0]}<span className="text-red-500">.</span></a>
          <div className="hidden gap-8 text-sm text-white/70 md:flex">
            {nav.map(([n, h]) => <a key={n} href={h} className="transition hover:text-white">{n}</a>)}
          </div>
          <a href="#contact" className="btn !py-2 !px-5 text-sm">Hire me</a>
        </nav>
      </header>

      <section id="top" className="relative flex min-h-screen items-center pt-24">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-red-600/25 blur-[150px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-red-900/30 blur-[130px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-[1.2fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-sm text-red-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Open for new projects
            </p>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Hi, I'm <span className="bg-gradient-to-r from-[#e50914] to-[#ff6b6b] bg-clip-text text-transparent">{s.name}</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/65">{s.tagline}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#work" className="btn">See my work <ArrowRight size={18} /></a>
              <a href="#contact" className="btn-ghost">Let's talk</a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.2 }} className="relative mx-auto h-[26rem] w-72 md:h-[30rem] md:w-96">
            <div className="absolute inset-0 rounded-[2.5rem] bg-red-600/40 blur-3xl" />
            <div className="relative h-full rounded-[2.5rem] bg-gradient-to-br from-red-500 via-red-900 to-transparent p-[2px]">
              <div className="h-full overflow-hidden rounded-[2.4rem] bg-neutral-950">
                {s.heroPhoto ? <img src={s.heroPhoto} alt={s.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center font-display text-8xl font-bold text-red-600/70">{initials}</div>}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-5 py-24">
        <Head title="About me" sub="The person behind the edits." />
        <R>
          <div className="card p-8 md:p-12">
            <p className="whitespace-pre-line text-lg leading-relaxed text-white/80 md:text-xl">{s.aboutText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Video Editing', 'Thumbnail Design', 'YouTube SEO', 'Portfolio Making'].map((t) => (
                <span key={t} className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-sm text-red-200">{t}</span>
              ))}
            </div>
          </div>
        </R>
      </section>

      <section id="skills" className="mx-auto max-w-6xl px-5 py-24">
        <Head title="Skills" sub="What I can do for your channel or brand." />
        <div className="grid gap-5 sm:grid-cols-2">
          {skills.map(([Icon, t, tag], i) => (
            <R key={t} d={i * 0.08}>
              <div className="card group h-full p-7">
                <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#e50914] to-[#7a0510] transition group-hover:rotate-6"><Icon /></div>
                <h3 className="font-display text-xl font-bold">{t}</h3>
                {tag && <p className="mt-1 text-white/55">{tag}</p>}
              </div>
            </R>
          ))}
        </div>
      </section>

      <section id="work" className="mx-auto max-w-6xl px-5 py-24">
        <Head title="My work" sub="Recent edits, thumbnails and websites." />
        {!projects.items.length && <p className="text-white/50">{projects.loading ? 'Loading projects…' : 'Projects will appear here soon.'}</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.items.map((p) => {
            const Tag = p.link ? 'a' : 'div';
            return (
              <R key={p.id}>
                <Tag {...(p.link ? { href: p.link, target: '_blank', rel: 'noreferrer' } : {})} className="card group block overflow-hidden">
                  <div className="relative aspect-video overflow-hidden bg-neutral-900">
                    {p.image ? <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" /> : <div className="grid h-full place-items-center text-white/20"><ImageIcon size={40} /></div>}
                    {p.link && <div className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition group-hover:opacity-100"><span className="grid h-14 w-14 place-items-center rounded-full bg-red-600"><Play fill="white" size={22} /></span></div>}
                  </div>
                  <div className="p-5">
                    {p.category && <span className="text-sm text-red-400">{p.category}</span>}
                    <h3 className="font-display text-lg font-bold">{p.title}</h3>
                    {p.description && <p className="mt-1 text-sm text-white/55">{p.description}</p>}
                  </div>
                </Tag>
              </R>
            );
          })}
        </div>
      </section>

      <section id="updates" className="mx-auto max-w-4xl px-5 py-24">
        <Head title="Daily updates" sub="What I'm working on right now." />
        {!posts.items.length && <p className="text-white/50">{posts.loading ? 'Loading updates…' : 'No updates yet.'}</p>}
        <div className="space-y-5 border-l border-red-500/30 pl-6">
          {posts.items.map((p) => (
            <R key={p.id}>
              <article className="card relative overflow-hidden">
                <span className="absolute -left-[31px] top-8 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_12px_#e50914]" />
                {p.image && <img src={p.image} alt={p.title} loading="lazy" className="max-h-80 w-full object-cover" />}
                <div className="p-6">
                  <time className="text-sm text-white/40">{p.createdAt?.toDate?.().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                  <h3 className="font-display text-xl font-bold">{p.title}</h3>
                  <p className="mt-2 whitespace-pre-line text-white/65">{p.text}</p>
                </div>
              </article>
            </R>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-5 py-24">
        <Head title="Let's work together" sub="Tell me about your project and I'll reply fast." />
        <div className="grid gap-8 md:grid-cols-2">
          <R>
            <form onSubmit={send} className="card space-y-4 p-7">
              <input required className="inp" placeholder="Your name" value={msg.name} onChange={(e) => setMsg({ ...msg, name: e.target.value })} />
              <textarea required rows={5} className="inp" placeholder="Tell me about your project" value={msg.text} onChange={(e) => setMsg({ ...msg, text: e.target.value })} />
              <button className="btn w-full">Send message <ArrowRight size={18} /></button>
            </form>
          </R>
          <R d={0.1}>
            <div className="grid gap-4">
              {links.length ? links.map(([Icon, l, h]) => (
                <a key={l} href={h} target="_blank" rel="noreferrer" className="card flex items-center gap-4 p-5"><span className="grid h-12 w-12 place-items-center rounded-xl bg-red-600/20 text-red-400"><Icon /></span><span className="font-semibold">{l}</span></a>
              )) : <p className="text-white/50">Add your contact links from the admin panel (Profile & About).</p>}
            </div>
          </R>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/40">© {new Date().getFullYear()} {s.name}. All rights reserved.</footer>
    </div>
  );
}
