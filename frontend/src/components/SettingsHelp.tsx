import type { ReactNode } from 'react';
import type { Text } from '../../../shared/types';
import { HOLD_MS } from '../state/holdSpeed';
import { useSettings } from '../state/settings';
import { poseFor } from '../vision/fingers';
import { HandPose } from './HandPose';
import { ParentsLinkCard } from './ParentsLinkCard';

const T = (en: string, id: string): Text => ({ en, id });
const LETTERS = ['A', 'B', 'C', 'D'];

const CAMERA_TIPS: Text[] = [
  T('Play in a bright room, with the light in front of you, not behind.', 'Main di ruangan terang, cahaya dari depan, bukan dari belakang.'),
  T('Hold your hand up like a high-five, about one big step from the camera.', 'Angkat tanganmu seperti tos, kira-kira satu langkah besar dari kamera.'),
  T('Show one hand at a time, with your palm facing the camera.', 'Tunjukkan satu tangan saja, telapak menghadap kamera.'),
  T('Keep your fingers still until the bar is full.', 'Tahan jarimu diam sampai bilahnya penuh.'),
  T('The camera only runs on this device. No video is sent or saved.', 'Kamera hanya berjalan di perangkat ini. Video tidak dikirim atau disimpan.'),
];

const GAME_TIPS: { icon: string; text: Text }[] = [
  { icon: '🔥', text: T('Get 3 right in a row for a COMBO: your hits on the boss turn critical!', 'Benar 3 kali berturut-turut untuk COMBO: seranganmu ke bos jadi kritis!') },
  { icon: '⚡', text: T('Answer within 5 seconds for a QUICK bonus.', 'Jawab dalam 5 detik untuk bonus CEPAT.') },
  { icon: '👾', text: T('Right answers knock down the boss. The final K.O. comes on the last question.', 'Jawaban benar menjatuhkan bos. K.O. terakhir terjadi di soal terakhir.') },
  { icon: '⭐', text: T('Every right answer earns a star. Spend stars in the Closet to dress up Mewy.', 'Setiap jawaban benar memberi bintang. Belanjakan bintang di Lemari untuk mendandani Mewy.') },
  { icon: '🔍', text: T('Got one wrong? Tap "Why?" to see the right answer explained.', 'Salah? Ketuk "Kenapa?" untuk melihat penjelasan jawaban yang benar.') },
];

function HelpCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="pixel-panel settings-help">
      <h2 className="settings-help__title">{title}</h2>
      {children}
    </div>
  );
}

/** The Help tab: how to answer (camera, tap, keys), camera tips and game tips. */
export function SettingsHelp() {
  const { settings } = useSettings();
  const L = settings.lang;
  const en = L === 'en';
  const holdS = (HOLD_MS[settings.holdSpeed] / 1000).toFixed(1);
  return (
    <>
      <HelpCard title={en ? '🎮 How to play' : '🎮 Cara bermain'}>
        <p>{en ? 'Answer every question in one of three ways:' : 'Jawab setiap soal dengan salah satu dari tiga cara:'}</p>
        <h3 className="settings-help__sub">📷 {en ? 'With your hand (camera)' : 'Dengan tangan (kamera)'}</h3>
        <p>
          {en
            ? `Turn on the camera, show fingers for your answer, then hold still for ${holdS} s until the bar fills.`
            : `Nyalakan kamera, tunjukkan jari untuk jawabanmu, lalu tahan diam selama ${holdS} detik sampai bilahnya penuh.`}
        </p>
        <ul className="settings-help__fingers">
          {LETTERS.map((letter, i) => (
            <li key={letter}>
              <HandPose pose={poseFor(i)} size={40} label={`${i + 1}`} />
              <span>
                <strong>{letter}</strong> = {i + 1} {en ? (i ? 'fingers' : 'finger') : 'jari'}
              </span>
            </li>
          ))}
        </ul>
        <h3 className="settings-help__sub">👆 {en ? 'Tap or click' : 'Ketuk atau klik'}</h3>
        <p>{en ? 'Tap an answer card when the camera is off.' : 'Ketuk kartu jawaban saat kamera mati.'}</p>
        <h3 className="settings-help__sub">⌨️ {en ? 'Keyboard' : 'Papan ketik'}</h3>
        <p>
          {en ? 'Press ' : 'Tekan '}
          <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> {en ? 'or' : 'atau'} <kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd>.{' '}
          {en ? 'Use ' : 'Pakai '}
          <kbd>Tab</kbd> {en ? 'to move and' : 'untuk pindah dan'} <kbd>Enter</kbd> {en ? 'to press a button.' : 'untuk menekan tombol.'}
        </p>
      </HelpCard>

      <HelpCard title={en ? '📷 Camera tips' : '📷 Tips kamera'}>
        <ul className="settings-help__list">
          {CAMERA_TIPS.map((tip) => (
            <li key={tip.en}>{tip[L]}</li>
          ))}
        </ul>
      </HelpCard>

      <HelpCard title={en ? '🏆 Game tips' : '🏆 Tips permainan'}>
        <ul className="settings-help__list settings-help__list--icons">
          {GAME_TIPS.map((tip) => (
            <li key={tip.icon}>
              <span aria-hidden="true">{tip.icon}</span> {tip.text[L]}
            </li>
          ))}
        </ul>
      </HelpCard>

      <ParentsLinkCard />
    </>
  );
}
