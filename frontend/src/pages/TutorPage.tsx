import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MAX_MESSAGE_LENGTH } from '../../../shared/tutor';
import { TOPICS, type TopicMeta } from '../../../shared/types';
import { Mewy } from '../components/Mewy';
import { askTutor, fetchConfig } from '../lib/api';
import { useSettings } from '../state/settings';

interface Msg {
  from: 'you' | 'mewy';
  text: string;
  confidence?: number;
  intent?: string;
  lesson?: TopicMeta['id'];
}

/** How Mewy shows how sure it is, without a number meter. */
type Sureness = 'sure' | 'medium' | 'unknown';
function sureness(intent: string | undefined, confidence: number | undefined): Sureness {
  if (intent === 'unknown' || !confidence) return 'unknown';
  return confidence >= 0.75 ? 'sure' : 'medium';
}

const SUGGESTIONS: { en: string; id: string }[] = [
  { en: 'How many legs does a dog have?', id: 'Anjing kakinya berapa?' },
  { en: 'What color do red and blue make?', id: 'Merah dicampur biru jadi warna apa?' },
  { en: 'What is 7 + 5?', id: 'Berapa 7 + 5?' },
  { en: 'How many planets are there?', id: 'Ada berapa planet?' },
];

export function TutorPage() {
  const { tr, settings } = useSettings();
  const [messages, setMessages] = useState<Msg[]>([{ from: 'mewy', text: tr('tutorIntro') }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [smart, setSmart] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchConfig().then((c) => setSmart(Boolean(c?.llm)));
  }, []);

  const ask = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setMessages((m) => [...m, { from: 'you', text }]);
    setInput('');
    setBusy(true);
    const reply = await askTutor(text, settings.lang);
    setMessages((m) => [...m, { from: 'mewy', text: reply.reply, confidence: reply.confidence, intent: reply.intent, lesson: reply.lesson }]);
    setBusy(false);
    requestAnimationFrame(() => listRef.current?.scrollTo(0, listRef.current.scrollHeight));
  };
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    void ask(input);
  };
  const L = settings.lang;

  return (
    <section>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        💬 {tr('navTutor')}
        {smart && (
          <span className="pixel-panel" style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem', background: 'var(--pink)', color: 'var(--ink)' }}>
            ✨ Smart Mewy
          </span>
        )}
      </h1>
      <div
        ref={listRef}
        aria-live="polite"
        className="pixel-panel"
        style={{ height: 'min(380px, 55dvh)', minHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg)' }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', flexDirection: m.from === 'you' ? 'row-reverse' : 'row' }}>
            {m.from === 'mewy' && <Mewy size={36} />}
            <div
              style={{
                maxWidth: '75%',
                background: m.from === 'you' ? 'var(--cyan)' : 'var(--panel-light)',
                color: m.from === 'you' ? 'var(--ink)' : 'var(--white)',
                border: '3px solid var(--ink)',
                padding: '0.6rem 0.8rem',
                fontFamily: 'var(--font-read)',
              }}
            >
              {m.from === 'mewy' && m.confidence != null && sureness(m.intent, m.confidence) === 'medium' && (
                <div className="tutor-sure">{tr('tutorMedium')}</div>
              )}
              {m.from === 'mewy' && m.confidence != null && sureness(m.intent, m.confidence) === 'unknown' ? (
                <>
                  <div className="tutor-sure">{tr('tutorUnknown')}</div>
                  <div className="tutor-chips">
                    {SUGGESTIONS.map((q) => (
                      <button key={q.en} type="button" className="btn btn--ghost tutor-chip" disabled={busy} onClick={() => void ask(q[L])}>
                        {q[L]}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                m.text
              )}
              {m.from === 'mewy' && m.lesson && (
                <div style={{ marginTop: 8 }}>
                  <Link to={`/lessons/${m.lesson}`} className="chip tutor-lesson">
                    📚 {tr('tutorLearnMore')}: {TOPICS.find((x) => x.id === m.lesson)?.title[L]}
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && <p style={{ fontFamily: 'var(--font-read)' }}>{tr('tutorThinking')}</p>}
      </div>

      <form onSubmit={send} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <label htmlFor="tutor-input" className="sr-only">{tr('tutorPlaceholder')}</label>
        <input
          id="tutor-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={tr('tutorPlaceholder')}
          maxLength={MAX_MESSAGE_LENGTH}
          style={{ flex: 1 }}
          autoComplete="off"
        />
        <button type="submit" className="btn" disabled={busy || !input.trim()}>{tr('tutorSend')}</button>
      </form>
    </section>
  );
}
