// Travel map refresh: run in the browser console (or via Claude in Chrome) on
// https://photos.google.com/places while signed in. It scrolls the Places grid,
// collects every place label, compares them with the list published on the site,
// and returns only the differences, so the full list never has to be read.
//
// Output: { photos, site, fresh: [labels not on the site], gone: [site labels no longer in Photos] }
// Then: add each `fresh` label to _data/travel_places.json (one line, with lat/lon),
// and remove `gone` labels (Google sometimes renames, e.g. "Sawai Madhopur" -> "Sawaimadhopur").
// If Google changes the page, the tile selector below (a.p137Zd) is the part to update.
(async () => {
  const names = new Set();
  const grab = () => document.querySelectorAll('a.p137Zd').forEach(e => {
    const t = (e.getAttribute('aria-label') || e.innerText).trim();
    if (t) names.add(t);
  });
  let el = document.querySelector('a.p137Zd');
  while (el && !(el.scrollHeight > el.clientHeight + 10 && /(auto|scroll)/.test(getComputedStyle(el).overflowY))) el = el.parentElement;
  let stall = 0, last = -1;
  grab();
  for (let i = 0; i < 400 && stall < 6; i++) {
    el.scrollTop += el.clientHeight * 0.8;
    await new Promise(r => setTimeout(r, 350));
    grab();
    if (names.size === last && el.scrollTop + el.clientHeight >= el.scrollHeight - 5) stall++; else stall = 0;
    last = names.size;
  }
  const site = (await (await fetch('https://prakharsingh.com/assets/data/travel-places.txt', { cache: 'no-store' })).text())
    .split('\n').map(s => s.trim()).filter(Boolean);
  const have = new Set(site.map(s => s.toLowerCase()));
  const photosLower = new Set([...names].map(s => s.toLowerCase()));
  return JSON.stringify({
    photos: names.size,
    site: site.length,
    fresh: [...names].filter(n => !have.has(n.toLowerCase())),
    gone: site.filter(s => !photosLower.has(s.toLowerCase())),
  });
})();
