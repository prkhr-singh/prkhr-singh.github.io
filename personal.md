---
layout: default
title: Personal Pursuits
permalink: /personal/
---

Notes and projects from outside work — travel, coffee, cycling, and other things I’m exploring in Melbourne and beyond. I’ll add short write‑ups and links here over time.

---

### Writing

Selected posts and notes.

<ul>
{% for post in site.posts limit:5 %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <small>— <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%-d %b %Y" }}</time></small>
  </li>
{% endfor %}
</ul>

<p><a href="{{ '/writing/' | relative_url }}">See all writing →</a></p>

---

### Travel & Photography

Short notes from trips and photo sets. More soon.

### Coffee

Dial‑ins, beans, and moka‑pot experiments.

### Cycling

Routes around Melbourne and occasional gear notes.

---

If you’re after work highlights, see the **[Work]({{ '/work/' | relative_url }})** page.
