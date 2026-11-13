(() => {
  const dataNode = document.getElementById('hikes-data');
  const mapNode = document.getElementById('hikes-map');
  if (!dataNode || !mapNode || !window.L) return;
  const trips = JSON.parse(dataNode.textContent);
  const filter = document.getElementById('hikes-trip-filter');
  const cards = [...document.querySelectorAll('.hikes-trip')];

  // Keep the Pacific contiguous: shift western-hemisphere points east by 360°.
  const lonOf = lon => (lon < -30 ? lon + 360 : lon);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const map = L.map(mapNode, { scrollWheelZoom: false, worldCopyJump: false, minZoom: 2 });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Group trails that share a trailhead (within ~150 m) inside a trip.
  const markers = [];
  trips.forEach(trip => {
    const heads = [];
    trip.trails.forEach(t => {
      const lat = t.lat, lon = lonOf(t.lon);
      let head = heads.find(h => Math.abs(h.lat - lat) < 0.0015 && Math.abs(h.lon - lon) < 0.0015);
      if (!head) { head = { lat, lon, trails: [] }; heads.push(head); }
      head.trails.push(t);
    });
    heads.forEach(h => {
      const icon = L.divIcon({ className: 'hikes-pin', html: `<span>${trip.chapter}</span>`, iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -12] });
      const first = h.trails[0];
      const rows = h.trails.map(t => `<li><a href="https://www.alltrails.com/trail/${esc(t.slug)}" target="_blank" rel="noopener">${esc(t.name)}</a><span>${t.km} km · ${t.gain_m} m up · ${esc(t.route.toLowerCase())}</span></li>`).join('');
      const html = `<div class="hikes-pop"><p class="hikes-pop-eyebrow">Trip ${trip.chapter} · ${esc(trip.when)}</p><p class="hikes-pop-title">${esc(first.place)}, ${esc(first.region)}</p><ul>${rows}</ul></div>`;
      const m = L.marker([h.lat, h.lon], { icon, title: `${trip.title}: ${h.trails.length} trail${h.trails.length > 1 ? 's' : ''}`, riseOnHover: true }).bindPopup(html, { maxWidth: 300 });
      m.chapter = trip.chapter;
      markers.push(m);
    });
  });

  // Zoomed out: one pin per trip (click to zoom in). Zoomed in: one pin per trailhead.
  const DETAIL_ZOOM = 7;
  const tripMarkers = trips.map(trip => {
    const pts = markers.filter(m => m.chapter === trip.chapter).map(m => m.getLatLng());
    const lat = pts.reduce((a, p) => a + p.lat, 0) / pts.length;
    const lng = pts.reduce((a, p) => a + p.lng, 0) / pts.length;
    const icon = L.divIcon({ className: 'hikes-pin', html: `<span>${trip.chapter}</span>`, iconSize: [26, 26], iconAnchor: [13, 13] });
    const m = L.marker([lat, lng], { icon, title: `${trip.chapter}. ${trip.title} (${trip.when}): ${trip.trails.length} trail${trip.trails.length > 1 ? 's' : ''}`, riseOnHover: true });
    m.chapter = trip.chapter;
    m.on('click', () => { filter.value = String(trip.chapter); show(trip.chapter); });
    return m;
  });
  let selected = 0;
  function syncLayers() {
    const detail = map.getZoom() >= DETAIL_ZOOM;
    markers.forEach(m => detail ? m.addTo(map) : m.remove());
    tripMarkers.forEach(m => detail ? m.remove() : m.addTo(map));
    [...markers, ...tripMarkers].forEach(m => {
      const el = m.getElement();
      if (el) el.classList.toggle('is-dim', !!selected && m.chapter !== selected);
      m.setZIndexOffset(selected && m.chapter === selected ? 1000 : 0);
    });
  }
  map.on('zoomend', syncLayers);

  const boundsFor = chapter => L.latLngBounds(markers.filter(m => !chapter || m.chapter === chapter).map(m => m.getLatLng()));

  function show(chapter) {
    selected = chapter;
    cards.forEach(c => c.classList.toggle('is-active', !!chapter && Number(c.dataset.chapter) === chapter));
    map.closePopup();
    map.fitBounds(boundsFor(chapter), { padding: [36, 36], maxZoom: chapter ? 13 : 4 });
    syncLayers();
  }

  filter.addEventListener('change', () => show(Number(filter.value) || 0));
  document.querySelectorAll('.hikes-show').forEach(b => b.addEventListener('click', () => {
    const chapter = Number(b.dataset.chapter);
    filter.value = String(chapter);
    show(chapter);
    mapNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));

  show(0);
})();
