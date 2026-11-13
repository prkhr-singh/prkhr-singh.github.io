---
layout: default
title: Hikes
permalink: /personal/hikes/
description: "Every trail I have completed on AllTrails, on one map and grouped into trips, from Melbourne river loops to the Hooker Valley."
travel_map_page: true
---

{% assign hike_count = 0 %}{% for trip in site.data.hikes %}{% assign hike_count = hike_count | plus: trip.trails.size %}{% endfor %}
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">

<div class="travel-page hikes-page">
  <p class="travel-eyebrow">Personal pursuits / on foot</p>
  <h1>Hikes</h1>
  <p class="travel-intro">Hiking became a habit after moving to Melbourne. It began with river loops near home and grew into trips to the Grampians, the Snowy Mountains, Hawaiʻi, Cappadocia and New Zealand. Every trail I have marked complete on AllTrails is on this map, grouped into trips and listed in the order I walked them.</p>

  <div class="travel-stats" aria-label="Hiking summary">
    <div><strong>{{ hike_count }}</strong><span>trails completed</span></div>
    <div><strong>{{ site.data.hikes.size }}</strong><span>trips</span></div>
    <div><strong>4</strong><span>countries</span></div>
  </div>

  <div class="travel-toolbar">
    <label for="hikes-trip-filter">Show</label>
    <select id="hikes-trip-filter">
      <option value="">All trips</option>
      {% for trip in site.data.hikes %}<option value="{{ trip.chapter }}">{{ trip.chapter }}. {{ trip.title }} ({{ trip.when }})</option>
      {% endfor %}
    </select>
  </div>

  <figure class="travel-map">
    <div class="hikes-map" id="hikes-map" role="region" aria-label="Map of trailheads"></div>
    <figcaption>Zoomed out, each dot is a trip; tap one to zoom in. Zoomed in, each dot is a trailhead, with the trails that start there. Several trails often share a car park.</figcaption>
  </figure>

  <div class="travel-list-heading">
    <div>
      <p class="travel-eyebrow">In the order I walked them</p>
      <h2>Trips</h2>
    </div>
    <p>{{ site.data.hikes.size }} trips, oldest first</p>
  </div>
  <p class="travel-list-intro">Seasons are local to where each walk was, so a December in Hawaiʻi is winter while a December in Queensland is summer.</p>

  <ol class="hikes-trips" id="hikes-trips">
    {% for trip in site.data.hikes %}
    <li class="hikes-trip" id="trip-{{ trip.chapter }}" data-chapter="{{ trip.chapter }}">
      <div class="hikes-trip-head">
        <span class="hikes-num" aria-hidden="true">{{ trip.chapter }}</span>
        <div>
          <h3>{{ trip.title }}</h3>
          <p class="hikes-meta">{{ trip.region }} · {{ trip.when }}</p>
        </div>
        <button type="button" class="hikes-show" data-chapter="{{ trip.chapter }}">Show on map</button>
      </div>
      <p class="hikes-blurb">{{ trip.blurb }}</p>
      <ul class="hikes-trails">
        {% for t in trip.trails %}
        <li><a href="https://www.alltrails.com/trail/{{ t.slug }}">{{ t.name }}</a><span>{{ t.km }} km · {{ t.gain_m }} m up · {{ t.route | downcase }}</span></li>
        {% endfor %}
      </ul>
    </li>
    {% endfor %}
  </ol>

  <p class="travel-sources">Trails: my <a href="https://www.alltrails.com/members/prakhar-singh-7">AllTrails profile</a>. Distances and elevation gain are AllTrails’ listed figures for each trail, not my recorded tracks, and overlapping variants of the same walk are listed separately. Map tiles: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attributions">CARTO</a>.</p>
</div>
<script id="hikes-data" type="application/json">{{ site.data.hikes | jsonify }}</script>
<script defer src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script defer src="{{ '/assets/js/hikes-map.js' | relative_url }}"></script>
