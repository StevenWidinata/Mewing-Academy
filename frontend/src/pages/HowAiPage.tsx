import { useSettings } from '../state/settings';

const CONTENT = {
  en: {
    intro: 'Mewing Academy uses two kinds of AI, and both run right here on your device.',
    steps: [
      { icon: '✋', title: 'Hand tracking', body: 'A computer-vision model (Google MediaPipe HandLandmarker) finds 21 points on your hand. We count how many fingers are up and turn that into answer A, B, C or D.' },
      { icon: '💬', title: 'Tutor Mewy', body: 'A language helper reads your question, cleans it up, matches it to what it knows, and even solves simple maths. It shows how sure it is.' },
    ],
    privacyTitle: 'Your privacy',
    privacy: 'The camera and all the AI run inside your browser. The camera only looks for your hand: we never scan or remember your face. No video or photo is ever uploaded or saved. Turn the camera off any time, and you can still play by tapping or using number keys.',
    tryTitle: 'Try the hand controls',
    try: 'In a quiz, count with your fingers: 1 finger = A, 2 fingers = B, 3 = C, 4 = D (keep your thumb tucked in). Each answer card shows a little hand. Hold still until the bar fills up. A whole open hand means "no answer".',
  },
  id: {
    intro: 'Mewing Academy memakai dua jenis AI, dan keduanya berjalan di perangkatmu sendiri.',
    steps: [
      { icon: '✋', title: 'Pelacakan tangan', body: 'Model computer vision (Google MediaPipe HandLandmarker) menemukan 21 titik di tanganmu. Kami menghitung berapa jari yang terangkat dan mengubahnya jadi jawaban A, B, C, atau D.' },
      { icon: '💬', title: 'Tutor Mewy', body: 'Pembantu bahasa membaca pertanyaanmu, merapikannya, mencocokkan dengan yang diketahui, bahkan menyelesaikan hitungan sederhana. Ia menunjukkan seberapa yakin.' },
    ],
    privacyTitle: 'Privasimu',
    privacy: 'Kamera dan semua AI berjalan di dalam browsermu. Kamera hanya mencari tanganmu: kami tidak pernah memindai atau mengingat wajahmu. Tidak ada video atau foto yang diunggah atau disimpan. Matikan kamera kapan saja, dan kamu tetap bisa bermain dengan mengetuk atau memakai tombol angka.',
    tryTitle: 'Coba kontrol tangan',
    try: 'Dalam kuis, hitung dengan jarimu: 1 jari = A, 2 jari = B, 3 = C, 4 = D (lipat jempolmu). Setiap kartu jawaban menunjukkan gambar tangan kecil. Tahan sampai bar penuh. Satu tangan terbuka penuh berarti "bukan jawaban".',
  },
};

export function HowAiPage() {
  const { settings, tr } = useSettings();
  const c = CONTENT[settings.lang];
  return (
    <section>
      <h1>🤖 {tr('howAiTitle')}</h1>
      <p style={{ fontFamily: 'var(--font-read)', fontSize: '1.1rem' }}>{c.intro}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {c.steps.map((s) => (
          <div key={s.title} className="pixel-panel">
            <div style={{ fontSize: '2rem' }}>{s.icon}</div>
            <h3 style={{ fontSize: '0.85rem' }}>{s.title}</h3>
            <p style={{ fontFamily: 'var(--font-read)' }}>{s.body}</p>
          </div>
        ))}
      </div>
      <div className="pixel-panel" style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem' }}>🔒 {c.privacyTitle}</h2>
        <p style={{ fontFamily: 'var(--font-read)' }}>{c.privacy}</p>
      </div>
      <div className="pixel-panel">
        <h2 style={{ fontSize: '1rem' }}>{c.tryTitle}</h2>
        <p style={{ fontFamily: 'var(--font-read)' }}>{c.try}</p>
      </div>
    </section>
  );
}
