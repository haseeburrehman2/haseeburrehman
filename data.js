import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';

export const DEFAULTS = {
  name: 'Haseeb Ur Rehman',
  tagline: 'I turn raw footage into videos people finish watching, and thumbnails people click.',
  aboutText:
    "Assalam o Alaikum! I'm Haseeb Ur Rehman. Alhamdulillah, I can do Video Editing, Thumbnail Design, YouTube SEO and Portfolio Making. I help creators and brands grow with clean edits, high-CTR thumbnails and smart optimization.",
  heroPhoto: '',
  whatsapp: '',
  email: '',
  instagram: '',
  youtube: '',
};

export function useCollection(name) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const q = query(collection(db, name), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (s) => { setItems(s.docs.map((d) => ({ id: d.id, ...d.data() }))); setLoading(false); },
      () => setLoading(false)
    );
  }, [name]);
  return { items, loading };
}

export function useSettings() {
  const [s, setS] = useState(DEFAULTS);
  useEffect(() => onSnapshot(doc(db, 'settings', 'site'), (d) => setS({ ...DEFAULTS, ...(d.data() || {}) }), () => {}), []);
  return s;
}
