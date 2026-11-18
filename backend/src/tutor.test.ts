import { describe, expect, it } from 'vitest';
import { tutorReply } from '../../shared/tutor';
import { findEntities, words } from '../../shared/tutor/smart';
import { ENTITIES } from '../../shared/tutor/knowledge';
import { MORE_FACTS } from '../../shared/tutor/more';

const en = (q: string) => tutorReply(q, 'en');
const id = (q: string) => tutorReply(q, 'id');

describe('smarter offline Ask Mewy', () => {
  it('answers the known bad cases', () => {
    expect(en('How many legs does a dog have?').reply).toMatch(/^A dog has 4 legs/);
    expect(en('what color is a banana').reply).toMatch(/banana is yellow/i);
    expect(id('Anjing kakinya berapa?').reply).toMatch(/^Anjing punya 4 kaki/);
    expect(id('pisang warnanya apa?').reply).toMatch(/Pisang berwarna kuning/);
  });

  it('knows animal legs, sounds, homes, food and babies', () => {
    expect(en('how many legs does a spider have').reply).toContain('8 legs');
    expect(en('how many legs do snakes have').reply).toContain('no legs');
    expect(en('what sound does a cow make?').reply).toContain('Moo');
    expect(en('where do penguins live').reply).toContain('Antarctica');
    expect(en('what does a panda... no, what does a rabbit eat').reply).toContain('carrots');
    expect(en('what is a baby frog called').reply).toContain('tadpole');
    expect(id('suara kucing bagaimana?').reply).toContain('Meong');
    expect(id('burung hantu tinggal di mana?').reply).toMatch(/^Burung hantu tinggal di/);
    expect(id('laba-laba kakinya ada berapa').reply).toContain('8 kaki');
    expect(en('how many legs does an octopus have').reply).toContain('8 arms');
  });

  it('handles typos and plurals', () => {
    expect(en('how many legs does an elefant have').reply).toContain('An elephant has 4 legs');
    expect(en('do giraffes eat leaves').intent).toBe('animals:giraffe');
  });

  it('does not guess from look-alike words', () => {
    expect(findEntities(words('how much money is in my pocket'))).toEqual([]);
    expect(en('I cannot sleep').intent).not.toMatch(/sheep/);
  });

  it('knows space', () => {
    expect(en('how many planets are there?').reply).toContain('8 planets');
    expect(en('which planet is the biggest').reply).toMatch(/^Jupiter/);
    expect(id('planet apa yang paling panas?').reply).toMatch(/^Venus/);
    expect(en('tell me about Mars').reply).toContain('Red Planet');
    expect(id('berapa bulan dalam setahun').reply).toContain('12 bulan');
  });

  it('knows shapes and vehicles', () => {
    expect(en('how many sides does a hexagon have').reply).toContain('6 sides');
    expect(id('persegi panjang punya berapa sudut?').reply).toMatch(/^Persegi panjang punya 4 sisi dan 4 sudut/);
    expect(en('how many corners does a circle have').reply).toContain('no straight sides');
    expect(en('how many wheels does a bike have').reply).toContain('2 wheels');
    expect(id('becak rodanya berapa').reply).toContain('3 roda');
    expect(en('where does a submarine go').reply).toContain('under the water');
  });

  it('knows colors, mixing and fruit vs vegetable', () => {
    expect(en('what color do red and blue make?').reply).toContain('purple');
    expect(id('merah dicampur kuning jadi apa?').reply).toContain('oranye');
    expect(en('what do blue and orange make').reply).toContain('brown');
    expect(en('what color is an orange').reply).toMatch(/orange is orange/i);
    expect(en('is a zebra black and white?').intent).toBe('animals:zebra');
    expect(en('is a tomato a fruit or a vegetable').reply).toMatch(/tomato is a fruit/i);
    expect(id('wortel itu buah atau sayur?').reply).toContain('sayuran');
    expect(en('why is the sky blue?').reply).toContain('blue light');
  });

  it('knows the body, senses and counting facts', () => {
    expect(en('how many fingers do I have').reply).toContain('10 fingers');
    expect(id('berapa jari kaki kita?').reply).toContain('10 jari kaki');
    expect(en('how many teeth do kids have').reply).toContain('20 baby teeth');
    expect(en('what do we use to smell').reply).toContain('nose');
    expect(en('how many senses do we have').reply).toContain('5 senses');
  });

  it('knows days, months, numbers and opposites', () => {
    expect(en('what day comes after Monday?').reply).toMatch(/^Tuesday/);
    expect(id('hari apa sebelum senin?').reply).toMatch(/^Minggu/);
    expect(en('what month comes after December').reply).toMatch(/^January/);
    expect(en('what number comes after 9').reply).toMatch(/^10 comes after 9/);
    expect(en('how many days are in a week').reply).toContain('7 days');
    expect(id('berapa jam dalam sehari').reply).toContain('24 jam');
    expect(en('what is the opposite of hot').reply).toContain('"cold"');
    expect(id('lawan kata besar apa?').reply).toContain('"kecil"');
  });

  it('links answers to a lesson and stays sure when it knows', () => {
    const r = en('how many legs does a cat have');
    expect(r.lesson).toBe('animals');
    expect(r.confidence).toBe(1);
    expect(en('what is 3 + 4').lesson).toBe('math');
  });

  it('offers "tell me more" for things it knows', () => {
    const r = en('how many legs does a cat have');
    expect(r.more?.text).toContain('32 muscles');
    expect(r.more?.emoji).toBe('🐱');
    expect(id('ceritakan tentang mars').more?.text).toContain('Olympus Mons');
    expect(en('what is 3 + 4').more).toBeUndefined();
  });

  it('every fact table entry is filled in both languages', () => {
    for (const e of ENTITIES) {
      expect(MORE_FACTS[e.id]?.en && MORE_FACTS[e.id]?.id, `${e.id} needs a "tell me more" fact`).toBeTruthy();
      expect(e.names.length, e.id).toBeGreaterThan(0);
      expect(e.fact.en && e.fact.id, e.id).toBeTruthy();
      expect(e.name.en && e.name.id, e.id).toBeTruthy();
    }
  });

  it('leaves feelings and app help to the caring answers', () => {
    expect(en('i feel sad').intent).toBe('sad');
    expect(en('how do I answer with my hand').intent).toBe('camera');
  });

  it('still falls back gracefully', () => {
    expect(en('qwzx').intent).toBe('unknown');
    expect(en('what is a volcano').intent).toBe('unknown');
  });
});
