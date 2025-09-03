layout: default
title: Writing
permalink: /writing/
---

A mix of short notes and longer posts.

<ul>
{% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <small>— <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%-d %b %Y" }}</time></small>
  </li>
{% endfor %}
</ul>
