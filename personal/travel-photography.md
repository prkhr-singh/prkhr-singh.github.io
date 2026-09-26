---
layout: default
title: Travel & Photography
permalink: /personal/travel-photography/
travel_map_page: true
---

<div class="travel-page">
  <p class="travel-eyebrow">Personal pursuits / an evolving atlas</p>
  <h1>Travel & Photography</h1>
  <p class="travel-intro">Travel started early for me, with railway journeys across India. This map is a first look through the geography of my photo library: cities, small towns, neighbourhoods, and the occasional mountain or beach. Selected photographs and stories will grow from here.</p>

  <div class="travel-stats" aria-label="Map summary">
    <div><strong>{{ site.data.travel_places.size }}</strong><span>place labels</span></div>
    <div><strong>12</strong><span>countries &amp; territories</span></div>
    <div><strong>1</strong><span>point per label</span></div>
  </div>

  <div class="travel-toolbar">
    <label for="travel-region-filter">Show places in</label>
    <select id="travel-region-filter">
      <option value="">Everywhere</option>
      <option value="IN">India</option>
      <option value="AU">Australia</option>
      <option value="US">United States</option>
      <option value="JP">Japan</option>
      <option value="MA">Morocco</option>
      <option value="MX">Mexico</option>
      <option value="TH">Thailand</option>
      <option value="TR">Türkiye</option>
      <option value="VN">Vietnam</option>
      <option value="MY">Malaysia</option>
      <option value="NP">Nepal</option>
      <option value="HK">Hong Kong</option>
    </select>
    <button type="button" id="travel-map-mode" aria-pressed="false">Show individual points</button>
  </div>

  <figure class="travel-map">
    <div class="travel-map-stage" id="travel-map-stage">
      <img src="{{ '/assets/maps/travel-world.svg' | relative_url }}" alt="World map with country outlines" width="1200" height="600">
      <canvas id="travel-map-canvas" aria-hidden="true"></canvas>
      <div class="travel-map-tooltip" id="travel-map-tooltip" hidden></div>
    </div>
    <figcaption>Each glow represents the density of distinct place labels in Google Photos, <strong>not</strong> photo volume, time spent, or number of trips. Hover for names, or choose a region above.</figcaption>
  </figure>

  <div class="travel-list-heading">
    <div>
      <p class="travel-eyebrow">The complete list</p>
      <h2>Places in my photo library</h2>
    </div>
    <p id="travel-visible-count">{{ site.data.travel_places.size }} labels</p>
  </div>
  <p class="travel-list-intro">This is a snapshot of the Places view on 26 September 2026. Google Photos can include overlapping labels for the same area. For 89 smaller or ambiguous labels, the map uses an approximate nearby location, marked ≈ in the list. The names below are kept as listed.</p>
  <label class="travel-search-label" for="travel-place-search">Find a place</label>
  <input id="travel-place-search" type="search" placeholder="Search all 504 places" autocomplete="off">

  <div class="travel-regions" id="travel-regions">
    {% assign travel_regions = "India:IN|Australia:AU|United States:US|Japan:JP|Morocco:MA|Mexico:MX|Thailand:TH|Türkiye:TR|Vietnam:VN|Malaysia:MY|Nepal:NP|Hong Kong:HK" | split: "|" %}
    {% for region in travel_regions %}
      {% assign region_parts = region | split: ":" %}
      {% assign region_name = region_parts[0] %}
      {% assign region_code = region_parts[1] %}
      {% assign region_places = site.data.travel_places | where: "country", region_code %}
      <details class="travel-region" data-country="{{ region_code }}">
        <summary><span>{{ region_name }}</span><span>{{ region_places.size }} {% if region_places.size == 1 %}place{% else %}places{% endif %}</span></summary>
        <ul>
          {% for place in region_places %}
            <li data-place-name="{{ place.name | downcase | escape }}">{{ place.name | escape }}{% if place.approximate %}<span class="travel-approx" title="Approximate map position" aria-label="Approximate map position">≈</span>{% endif %}</li>
          {% endfor %}
        </ul>
      </details>
    {% endfor %}
  </div>

  <p class="travel-sources">Place names: my Google Photos Places view. Map positions: <a href="https://www.geonames.org/">GeoNames</a> and approximate nearby locations where a label was ambiguous. Country outlines: <a href="https://www.naturalearthdata.com/">Natural Earth</a>. <a href="{{ '/assets/data/travel-places.txt' | relative_url }}">Download the complete list as text</a>.</p>
</div>
<script id="travel-place-data" type="application/json">{{ site.data.travel_places | jsonify }}</script>
<script defer src="{{ '/assets/js/travel-map.js' | relative_url }}"></script>
