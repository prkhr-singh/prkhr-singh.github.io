(() => {
  const dataNode = document.getElementById('travel-place-data');
  if (!dataNode) return;
  const places = JSON.parse(dataNode.textContent);
  const stage = document.getElementById('travel-map-stage');
  const canvas = document.getElementById('travel-map-canvas');
  const tooltip = document.getElementById('travel-map-tooltip');
  const regionFilter = document.getElementById('travel-region-filter');
  const search = document.getElementById('travel-place-search');
  const modeButton = document.getElementById('travel-map-mode');
  const count = document.getElementById('travel-visible-count');
  const regions = [...document.querySelectorAll('.travel-region')];
  const context = canvas.getContext('2d');
  let visible = places;
  let pointMode = false;

  const project = (place, width, height) => ({
    x: (place.lon + 180) * width / 360,
    y: (90 - place.lat) * height / 180
  });

  function draw() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);

    if (pointMode) {
      visible.forEach(place => {
        const { x, y } = project(place, width, height);
        context.beginPath();
        context.arc(x, y, Math.max(2.5, width / 360), 0, Math.PI * 2);
        context.fillStyle = place.approximate ? '#846b74' : '#aa3f4b';
        context.fill();
      });
      return;
    }

    const radius = Math.max(11, Math.min(27, width / 42));
    visible.forEach(place => {
      const { x, y } = project(place, width, height);
      const glow = context.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, 'rgba(216, 67, 43, .27)');
      glow.addColorStop(.4, 'rgba(237, 105, 54, .13)');
      glow.addColorStop(1, 'rgba(237, 105, 54, 0)');
      context.fillStyle = glow;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    });
    visible.forEach(place => {
      const { x, y } = project(place, width, height);
      context.beginPath();
      context.arc(x, y, 1.25, 0, Math.PI * 2);
      context.fillStyle = 'rgba(137, 55, 55, .75)';
      context.fill();
    });
  }

  function applyFilters() {
    const query = search.value.trim().toLocaleLowerCase();
    const selectedRegion = regionFilter.value;
    visible = places.filter(place =>
      (!selectedRegion || place.country === selectedRegion) &&
      (!query || place.name.toLocaleLowerCase().includes(query))
    );
    regions.forEach(region => {
      const regionMatches = !selectedRegion || region.dataset.country === selectedRegion;
      let found = 0;
      region.querySelectorAll('li').forEach(item => {
        const matches = regionMatches && (!query || item.dataset.placeName.includes(query));
        item.hidden = !matches;
        if (matches) found++;
      });
      region.hidden = !found;
      region.open = !!found && !!(query || selectedRegion);
    });
    count.textContent = `${visible.length} of ${places.length} labels`;
    tooltip.hidden = true;
    draw();
  }

  function showTooltip(event) {
    const bounds = stage.getBoundingClientRect();
    const px = event.clientX - bounds.left;
    const py = event.clientY - bounds.top;
    const nearby = visible.map(place => {
      const point = project(place, bounds.width, bounds.height);
      return { place, distance: Math.hypot(point.x - px, point.y - py) };
    }).filter(item => item.distance < 11).sort((a, b) => a.distance - b.distance);
    if (!nearby.length) {
      tooltip.hidden = true;
      return;
    }
    const names = nearby.slice(0, 3).map(item => item.place.name);
    tooltip.textContent = names.join(' · ') + (nearby.length > 3 ? ` · +${nearby.length - 3} nearby` : '');
    tooltip.style.left = `${Math.min(px + 12, bounds.width - 180)}px`;
    tooltip.style.top = `${Math.max(8, py - 36)}px`;
    tooltip.hidden = false;
  }

  regionFilter.addEventListener('change', applyFilters);
  search.addEventListener('input', applyFilters);
  modeButton.addEventListener('click', () => {
    pointMode = !pointMode;
    modeButton.textContent = pointMode ? 'Show density' : 'Show individual points';
    modeButton.setAttribute('aria-pressed', String(pointMode));
    draw();
  });
  stage.addEventListener('pointermove', showTooltip);
  stage.addEventListener('pointerleave', () => { tooltip.hidden = true; });
  new ResizeObserver(draw).observe(stage);
  draw();
})();
