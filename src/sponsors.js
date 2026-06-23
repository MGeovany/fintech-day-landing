/**
 * Sponsor logos marquee - primera imagen de cada par (325, 327, …).
 */
const assets = import.meta.glob('./assets/sponsors/afinh2025_image-*', {
  eager: true,
  query: '?url',
  import: 'default',
});

function imageNumber(path) {
  const match = path.match(/image-(\d+)/);
  return match ? Number(match[1]) : 0;
}

const sorted = Object.entries(assets)
  .map(([path, url]) => ({ path, url, num: imageNumber(path) }))
  .sort((a, b) => a.num - b.num);

const logos = sorted.filter((_, i) => i % 2 === 0);

function logoImg(url) {
  return `<img src="${url}" alt="" class="h-10 w-auto max-w-[7.5rem] shrink-0 object-contain opacity-85 sm:h-11 sm:max-w-[8.5rem]" width="120" height="48" loading="lazy" decoding="async" />`;
}

function marqueeRow(urls, direction) {
  if (!urls.length) return '';
  const track = urls.map((u) => logoImg(u.url)).join('');
  const anim =
    direction === 'right' ? 'animate-marquee-right' : 'animate-marquee-left';
  return `
    <div class="overflow-hidden">
      <div class="flex w-max items-center gap-10 sm:gap-14 ${anim} motion-reduce:animate-none" aria-hidden="true">
        ${track}${track}
      </div>
    </div>`;
}

export function buildSponsorMarqueeHtml() {
  const size = Math.ceil(logos.length / 3);
  const row1 = logos.slice(0, size);
  const row2 = logos.slice(size, size * 2);
  const row3 = logos.slice(size * 2);

  return `
    <div class="relative mt-10 w-full" data-reveal aria-label="Logos de patrocinadores">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg via-bg/60 to-transparent backdrop-blur-[6px] sm:w-28"
        aria-hidden="true"
      ></div>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg via-bg/60 to-transparent backdrop-blur-[6px] sm:w-28"
        aria-hidden="true"
      ></div>
      <div
        class="[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
      >
        <div class="flex flex-col gap-5 sm:gap-7">
          ${marqueeRow(row1, 'left')}
          ${marqueeRow(row2, 'right')}
          ${marqueeRow(row3, 'left')}
        </div>
      </div>
    </div>`;
}
