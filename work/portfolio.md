---
layout: default
title: Work portfolio explorer
permalink: /work/portfolio/
work_explorer_page: true
description: "Filter Prakhar Singh's project cards by company, geography, industry, and theme."
---

<div class="nri-page px">
<p class="nri-eyebrow">Work portfolio</p>
<h1>Explore my projects</h1>
<p class="nri-intro">Every project from my time at Nomura Research Institute and Uber in one place. Pick filters to narrow the list. Filters in the same group show any match; filters in different groups must all match.</p>
<p><a href="{{ '/work/' | relative_url }}">← Back to Work</a></p>

<div class="px-controls">
  <input id="px-q" type="search" placeholder="Search projects, skills, methods…" aria-label="Search projects">
  <div id="px-facets"></div>
  <div class="px-bar"><span id="px-count" aria-live="polite"></span><button type="button" id="px-clear">Clear all</button></div>
</div>
<div id="px-list" class="nri-cards"></div>
<noscript><p>This page needs JavaScript. The full list is also available as <a href="{{ '/llms.txt' | relative_url }}">plain text</a>.</p></noscript>
</div>

<script>
(function () {
  var AXES = [
    { key: 'company', label: 'Company' },
    { key: 'geos', label: 'Geography' },
    { key: 'industries', label: 'Industry' },
    { key: 'themes', label: 'Theme' }
  ];
  var ORDER = { company: ['NRI', 'Uber'] };
  var sel = {}, cards = [], q = '';
  AXES.forEach(function (a) { sel[a.key] = new Set(); });
  var $ = function (id) { return document.getElementById(id); };
  var vals = function (c, k) { return [].concat(c[k] || []); };
  var esc = function (s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; };

  function matches(c, skip) {
    if (q && c._t.indexOf(q) < 0) return false;
    return AXES.every(function (a) {
      if (a.key === skip || !sel[a.key].size) return true;
      return vals(c, a.key).some(function (v) { return sel[a.key].has(v); });
    });
  }

  function renderFacets() {
    $('px-facets').innerHTML = AXES.map(function (a) {
      var all = {}, live = {};
      cards.forEach(function (c) { vals(c, a.key).forEach(function (v) { all[v] = 1; if (matches(c, a.key)) live[v] = (live[v] || 0) + 1; }); });
      var keys = (ORDER[a.key] || Object.keys(all).sort(function (x, y) { return (live[y] || 0) - (live[x] || 0) || x.localeCompare(y); }));
      return '<fieldset class="px-axis"><legend>' + a.label + '</legend>' + keys.map(function (v) {
        var on = sel[a.key].has(v), n = live[v] || 0;
        return '<button type="button" class="px-chip' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-k="' + a.key + '" data-v="' + esc(v) + '"' + (!n && !on ? ' disabled' : '') + '>' + esc(v) + ' <span>' + n + '</span></button>';
      }).join('') + '</fieldset>';
    }).join('');
  }

  function renderCards() {
    var shown = cards.filter(function (c) { return matches(c); });
    $('px-count').textContent = shown.length + ' of ' + cards.length + ' projects';
    $('px-list').innerHTML = shown.map(function (c) {
      var tags = [c.company].concat(c.geos, c.industries, c.themes).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
      var f = [['Context', c.trigger], ['Problem', c.problem], ['What I did', c.method_and_execution], ['Artifacts', c.artifacts], ['What I learned', c.impact_or_learning]];
      return '<details class="nri-card px-card" id="' + c.id.toLowerCase() + '"><summary><p class="nri-id">' + esc(c.role) + ' · ' + esc(c.period) + '</p><h2>' + esc(c.title) + '</h2><div class="nri-tags">' + tags + '</div></summary>' +
        '<div class="nri-fields">' + f.map(function (x) { return '<div><h3>' + x[0] + '</h3><p>' + esc(x[1]) + '</p></div>'; }).join('') + '</div>' +
        '<p class="px-skills"><strong>Skills:</strong> ' + esc(c.skills.join(', ')) + '</p></details>';
    }).join('') || '<p>No projects match these filters. Try removing one.</p>';
  }

  function sync() {
    var h = AXES.filter(function (a) { return sel[a.key].size; }).map(function (a) { return a.key + '=' + Array.from(sel[a.key]).map(encodeURIComponent).join(','); });
    if (q) h.push('q=' + encodeURIComponent(q));
    history.replaceState(null, '', h.length ? '#' + h.join('&') : location.pathname);
    renderFacets(); renderCards();
  }

  function readHash() {
    location.hash.slice(1).split('&').forEach(function (p) {
      var kv = p.split('='); if (!kv[1]) return;
      if (kv[0] === 'q') { q = decodeURIComponent(kv[1]).toLowerCase(); $('px-q').value = q; }
      else if (sel[kv[0]]) kv[1].split(',').forEach(function (v) { sel[kv[0]].add(decodeURIComponent(v)); });
    });
  }

  $('px-facets').addEventListener('click', function (e) {
    var b = e.target.closest('.px-chip'); if (!b) return;
    var s = sel[b.dataset.k], v = b.dataset.v; s.has(v) ? s.delete(v) : s.add(v); sync();
  });
  $('px-q').addEventListener('input', function (e) { q = e.target.value.trim().toLowerCase(); sync(); });
  $('px-clear').addEventListener('click', function () { AXES.forEach(function (a) { sel[a.key].clear(); }); q = ''; $('px-q').value = ''; sync(); });

  fetch('{{ "/work/cards.json" | relative_url }}').then(function (r) { return r.json(); }).then(function (d) {
    cards = d.cards.map(function (c) { c._t = JSON.stringify(c).toLowerCase(); return c; })
      .sort(function (a, b) { return b.period.localeCompare(a.period); });
    readHash(); sync();
  }).catch(function () { $('px-list').innerHTML = '<p>Could not load projects. The full list is available as <a href="{{ "/llms.txt" | relative_url }}">plain text</a>.</p>'; });
})();
</script>
