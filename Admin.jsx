import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { Trash2, Pencil, LogOut, Upload } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { uploadImage } from '../lib/cloudinary';
import { useCollection, useSettings } from '../lib/data';

function ImageField({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setBusy(true);
    try { onChange(await uploadImage(f)); } catch (err) { alert('Upload failed: ' + err.message); }
    setBusy(false);
  };
  return (
    <div className="mt-1 flex items-center gap-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/50">{value && <img src={value} alt="" className="h-full w-full object-cover" />}</div>
      <label className="btn-ghost cursor-pointer !py-2 text-sm"><Upload size={16} />{busy ? 'Uploading…' : value ? 'Change image' : 'Upload image'}<input type="file" accept="image/*" hidden onChange={pick} disabled={busy} /></label>
    </div>
  );
}

function Form({ fields, initial, onSave, label, onCancel }) {
  const [v, setV] = useState(initial);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await onSave(v); } catch (err) { alert(err.message); }
    setBusy(false);
  };
  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      {fields.map((f) => (
        <div key={f.k}>
          <label className="text-sm text-white/60">{f.label}</label>
          {f.type === 'image' ? <ImageField value={v[f.k]} onChange={(u) => setV((p) => ({ ...p, [f.k]: u }))} />
            : f.type === 'textarea' ? <textarea rows={f.rows || 4} className="inp" value={v[f.k] || ''} onChange={(e) => setV((p) => ({ ...p, [f.k]: e.target.value }))} />
            : <input className="inp" required={f.required} value={v[f.k] || ''} placeholder={f.ph} onChange={(e) => setV((p) => ({ ...p, [f.k]: e.target.value }))} />}
        </div>
      ))}
      <div className="flex gap-3">
        <button className="btn" disabled={busy}>{busy ? 'Saving…' : label}</button>
        {onCancel && <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

function Manager({ col, fields, noun }) {
  const { items } = useCollection(col);
  const [edit, setEdit] = useState(null);
  const [n, setN] = useState(0);
  const save = async (v) => {
    const { id, createdAt, ...data } = v;
    if (edit) await updateDoc(doc(db, col, edit.id), data);
    else await addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() });
    setEdit(null); setN((x) => x + 1);
  };
  const del = (i) => confirm(`Delete "${i.title}"?`) && deleteDoc(doc(db, col, i.id));
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Form key={(edit?.id || 'new') + n} fields={fields} initial={edit || {}} onSave={save} label={edit ? 'Save changes' : `Add ${noun}`} onCancel={edit && (() => setEdit(null))} />
      <div className="space-y-3">
        {!items.length && <p className="text-white/50">No {noun}s yet. Add your first one.</p>}
        {items.map((i) => (
          <div key={i.id} className="card flex items-center gap-4 p-3">
            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-black/50">{i.image && <img src={i.image} alt="" className="h-full w-full object-cover" />}</div>
            <p className="min-w-0 flex-1 truncate font-semibold">{i.title}</p>
            <button onClick={() => { setEdit(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 text-white/60 hover:text-white" aria-label="Edit"><Pencil size={18} /></button>
            <button onClick={() => del(i)} className="p-2 text-red-400 hover:text-red-300" aria-label="Delete"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

const projectFields = [
  { k: 'title', label: 'Title', required: true },
  { k: 'category', label: 'Category', ph: 'Video Editing, Thumbnail, Website…' },
  { k: 'image', label: 'Thumbnail / cover image', type: 'image' },
  { k: 'link', label: 'Video or project link', ph: 'https://youtube.com/…' },
  { k: 'description', label: 'Description', type: 'textarea', rows: 3 },
];
const postFields = [
  { k: 'title', label: 'Title', required: true },
  { k: 'text', label: 'Update', type: 'textarea' },
  { k: 'image', label: 'Image (optional)', type: 'image' },
];
const settingFields = [
  { k: 'heroPhoto', label: 'Profile picture (shown in hero)', type: 'image' },
  { k: 'name', label: 'Your name', required: true },
  { k: 'tagline', label: 'Hero tagline', type: 'textarea', rows: 2 },
  { k: 'aboutText', label: 'About me text', type: 'textarea', rows: 7 },
  { k: 'whatsapp', label: 'WhatsApp number (with country code)', ph: '923001234567' },
  { k: 'email', label: 'Email' },
  { k: 'instagram', label: 'Instagram link' },
  { k: 'youtube', label: 'YouTube link' },
];

function Settings() {
  const s = useSettings();
  const [saved, setSaved] = useState(false);
  const save = async (v) => { await setDoc(doc(db, 'settings', 'site'), v, { merge: true }); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  return (
    <div className="max-w-2xl">
      <Form key={JSON.stringify(s)} fields={settingFields} initial={s} onSave={save} label="Save settings" />
      {saved && <p className="mt-3 text-green-400">Saved. Your portfolio is updated.</p>}
    </div>
  );
}

function Login() {
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const go = async (e) => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, f.email, f.password); } catch { setErr('Wrong email or password.'); }
  };
  return (
    <div className="grid min-h-screen place-items-center px-5">
      <form onSubmit={go} className="card w-full max-w-sm space-y-4 p-8">
        <h1 className="font-display text-3xl font-bold">Admin login</h1>
        <input type="email" required className="inp" placeholder="Email" onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input type="password" required className="inp" placeholder="Password" onChange={(e) => setF({ ...f, password: e.target.value })} />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="btn w-full">Log in</button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [user, setUser] = useState(undefined);
  const [tab, setTab] = useState('projects');
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  if (user === undefined) return <div className="grid min-h-screen place-items-center text-white/50">Loading…</div>;
  if (!user) return <Login />;
  const tabs = [['projects', 'Projects'], ['posts', 'Daily updates'], ['settings', 'Profile & About']];
  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-3">
          <a href="/" target="_blank" className="btn-ghost !py-2 text-sm">View site</a>
          <button onClick={() => signOut(auth)} className="btn-ghost !py-2 text-sm"><LogOut size={16} /> Log out</button>
        </div>
      </header>
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`rounded-full px-5 py-2 font-semibold transition ${tab === k ? 'bg-gradient-to-r from-[#e50914] to-[#ff3b3b]' : 'border border-white/15 text-white/70 hover:border-red-500'}`}>{l}</button>)}
      </div>
      {tab === 'projects' && <Manager col="projects" fields={projectFields} noun="project" />}
      {tab === 'posts' && <Manager col="posts" fields={postFields} noun="update" />}
      {tab === 'settings' && <Settings />}
    </div>
  );
}
