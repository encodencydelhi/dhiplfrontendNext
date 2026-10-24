// Lets the navbar ask "is the hero dark or light under this point?" so its
// links can be white over dark parts of a light hero image and dark over the
// light parts. The home hero registers a sampler; other pages register none,
// and the navbar keeps its usual styling there.

export type Tone = "dark" | "light";
// `key` names the navbar element being sampled (a link label, "__logo", "__login"),
// so a hero can pin the tone of a particular link
type Sampler = (clientX: number, clientY: number, key?: string) => Tone | null;

let sampler: Sampler | null = null;
const listeners = new Set<() => void>();

export function setHeroToneSampler(next: Sampler | null) {
  sampler = next;
  listeners.forEach((l) => l());
}

export function getHeroToneSampler() {
  return sampler;
}

export function subscribeHeroTone(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// The hero changed what is behind the navbar (e.g. a slide transition) — ask it to re-measure
export function notifyHeroTone() {
  listeners.forEach((l) => l());
}
