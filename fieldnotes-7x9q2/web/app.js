const suburbs = [
  {
    name: "Highton",
    category: "A",
    commute: "Geelong track",
    median: "$863.5k",
    land: "IRSAD D9",
    score: "Best suburb quality",
    tags: ["land", "geelong"],
    summary:
      "Data-backed suburb-quality leader: IRSAD decile 9, IEO decile 9, low crime signal, strong education profile, and the best qualitative character from the Geelong visit.",
  },
  {
    name: "Taylors Hill",
    category: "A",
    commute: "Western corridor",
    median: "$885k",
    land: "IRSAD D8",
    score: "Upgrade search",
    tags: ["newer", "western"],
    summary:
      "Strong family/affluence profile: young median age, high household income, IER decile 9 and very low calculated 2025 crime incident signal.",
  },
  {
    name: "Taylors Lakes",
    category: "A",
    commute: "Western corridor",
    median: "$945k",
    land: "IRSAD D8",
    score: "Established wealth",
    tags: ["land", "western"],
    summary:
      "High owner-occupier, high economic-resources and strong established-house growth. Watch affordability because the median is already near the FHBG cap.",
  },
  {
    name: "Caroline Springs",
    category: "A",
    commute: "Western corridor",
    median: "$743.5k",
    land: "IRSAD D7",
    score: "Amenity fallback",
    tags: ["newer", "western"],
    summary:
      "Solid family and amenity profile with lake/town-centre convenience, but weaker growth and ownership data than Taylors Hill or Taylors Lakes.",
  },
  {
    name: "Mill Park",
    category: "A",
    commute: "65-75 min",
    median: "$785k",
    land: "IRSAD D5",
    score: "Property-led target",
    tags: ["newer", "land"],
    summary:
      "Still valid because of budget and north-side strategy, but the suburb data is middle rather than premium. Pursue only when the house itself is excellent.",
  },
  {
    name: "Belmont",
    category: "B",
    commute: "Geelong track",
    median: "$700k",
    land: "IRSAD D6",
    score: "Street-by-street",
    tags: ["land", "geelong"],
    summary:
      "Good education/occupation profile and Geelong convenience, but lower economic-resources score, higher renter share, and higher crime signal than Highton.",
  },
  {
    name: "Charlemont",
    category: "B",
    commute: "Geelong growth",
    median: "$612k",
    land: "IRSAD D8",
    score: "New-estate value",
    tags: ["newer", "package", "geelong"],
    summary:
      "Strong low-disadvantage data but a small, young growth-area suburb. Compare it to Armstrong Creek/new-build logic rather than Highton character.",
  },
  {
    name: "Bundoora",
    category: "A",
    commute: "45 min tram",
    median: "$882k",
    land: "62.2%",
    score: "Best wife commute",
    tags: ["newer"],
    summary:
      "Still relevant for commute anchoring, but not part of this suburb-analytics pass. Revisit if listings reappear inside budget.",
  },
  {
    name: "Lara / Armstrong Creek",
    category: "C",
    commute: "90-105 min",
    median: "$657k-$690k",
    land: "62.6%",
    score: "New-build fallback",
    tags: ["package", "newer", "geelong"],
    summary:
      "Cheaper land and new builds. Use as a benchmark against Charlemont rather than as a direct substitute for Highton/Belmont.",
  },
];

const grid = document.querySelector("#suburbGrid");
const filterButtons = document.querySelectorAll("[data-filter]");
const comparisonGrid = document.querySelector("#comparisonGrid");
const comparisonSummary = document.querySelector("#comparisonSummary");
const comparisonTableBody = document.querySelector("#comparisonTableBody");
const sortButtons = document.querySelectorAll("[data-sort]");
const propertyNav = document.querySelector("#propertyNav");
const criteriaGrid = document.querySelector("#criteriaGrid");
const markdownReader = document.querySelector("#markdownReader");
const workspaceTabs = document.querySelectorAll("[data-view]");
const workspaceSections = document.querySelectorAll("[data-workspace]");
const DATA_VERSION = "2026-05-15-saturday-agenda";
const SATURDAY_AGENDA_SLUGS = [
  "18-landes-avenue-highton",
  "158-grantham-drive-highton",
  "8-northam-avenue-highton",
  "2-ashford-court-belmont",
  "134-roslyn-road-belmont",
  "3-cambra-road-belmont",
  "37-peter-street-grovedale",
  "37-salisbury-circuit-fyansford",
  "1-32-the-avenue-belmont",
  "43-waurnvale-drive-belmont",
];
const WEBP_ONLY_ASSET_SLUGS = new Set([
  "1-32-the-avenue-belmont",
  "2-ashford-court-belmont",
  "3-cambra-road-belmont",
  "8-northam-avenue-highton",
  "134-roslyn-road-belmont",
]);
const NO_REPUBLISHED_MEDIA_SLUGS = new Set([
  "37-peter-street-grovedale",
  "43-waurnvale-drive-belmont",
]);

const sectionWorkspace = Object.fromEntries(
  [...workspaceSections].map((section) => [section.id, section.dataset.workspace]),
);

function activateWorkspace(view, options = {}) {
  const selectedView = view || "today";

  workspaceTabs.forEach((tab) => {
    const isActive = tab.dataset.view === selectedView;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  workspaceSections.forEach((section) => {
    section.hidden = section.dataset.workspace !== selectedView;
  });

  if (options.updateHash) {
    const activeTab = [...workspaceTabs].find((tab) => tab.dataset.view === selectedView);
    const defaultSection = activeTab?.dataset.defaultSection;
    if (defaultSection) location.hash = defaultSection;
  }
}

function activateWorkspaceForHash() {
  const sectionId = location.hash.replace("#", "");
  const view = sectionWorkspace[sectionId];
  if (view) activateWorkspace(view);
}

workspaceTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activateWorkspace(tab.dataset.view, { updateHash: true });
  });
});

document.addEventListener("click", (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;
  const sectionId = anchor.getAttribute("href").slice(1);
  const view = sectionWorkspace[sectionId];
  if (view) activateWorkspace(view);
});

window.addEventListener("hashchange", activateWorkspaceForHash);
activateWorkspace(sectionWorkspace[location.hash.replace("#", "")] || "today");

const criteriaSections = [
  {
    title: "Immediate Rejects",
    tone: "reject",
    items: [
      "Not a freestanding house, including X/Y unit or townhouse-style addresses.",
      "Above the $950k FHBG hard cap.",
      "Less than 3 bedrooms or less than 2 bathrooms.",
      "Shared driveway, body corporate, or unclear own-title frontage.",
      "Routine 1970s-1990s compromise unless the layout and condition are exceptional.",
    ],
  },
  {
    title: "Daily-Life Fit",
    tone: "priority",
    items: [
      "Real study, upstairs retreat, or a bedroom that can work as a comfortable office.",
      "Spacious master with WIR preferred over just BIR.",
      "Ensuite should feel usable, not just technically present.",
      "Kitchen has deep storage, pantry/WIP, bench runs, and sensible appliance placement.",
      "Secondary bedrooms share a good bathroom without awkward access.",
    ],
  },
  {
    title: "Storage And Utility",
    tone: "neutral",
    items: [
      "Separate laundry with enough room to actually use it.",
      "Linen cupboard or walk-in linen, not just incidental shelves.",
      "Under-stair, garage, pantry, and robe storage checked physically.",
      "FTTP NBN preferred for WFH reliability.",
      "Garage/car space works for current car plus storage needs.",
    ],
  },
  {
    title: "Light And Comfort",
    tone: "neutral",
    items: [
      "North-facing or bright main living is a meaningful plus.",
      "Bedroom windows are large enough to make rooms feel open.",
      "Check west-facing rooms for summer heat exposure.",
      "Confirm orientation on-site with phone compass or sun position.",
      "Heating/cooling system is modern enough for daily comfort.",
    ],
  },
  {
    title: "Outdoor Fit",
    tone: "priority",
    items: [
      "Covered attached alfresco is valuable.",
      "Open decks and detached outdoor areas are lower priority.",
      "Large lawns are a maintenance burden, not a benefit.",
      "Compact land around 300-550m2 is generally better for this search.",
      "Outdoor space should be easy to maintain and useful year-round.",
    ],
  },
  {
    title: "Inspection Checks",
    tone: "neutral",
    items: [
      "Cracks, water stains, soft cabinetry, sticking doors/windows.",
      "Tap pressure, toilet operation, roof/gutter condition.",
      "Switchboard age, hot-water age, heating/cooling type.",
      "Ask why vendors are selling and preferred settlement.",
      "Request Section 32/contract and ask whether pre-auction offers are considered.",
    ],
  },
];

const fallbackComparisons = [
  {
    slug: "1-buick-crescent-mill-park",
    address: "1 Buick Crescent, Mill Park VIC 3082",
    suburb: "Mill Park",
    price_guide: "740000-790000",
    bedrooms: "3",
    bathrooms: "2",
    car_spaces: "3",
    land_m2: "303",
    estimated_internal_area_m2: "130-145",
    study_score: "10",
    room_spaciousness_score: "8",
    ensuite_score: "6",
    kitchen_storage_score: "8",
    shared_bathroom_score: "8",
    low_maintenance_score: "9",
    light_orientation_score: "8",
    overall_fit_score: "82",
    in_person_visited: "2026-05-02",
    in_person_overall_score: "85",
    in_person_price_ceiling: "830000",
    status: "Primary target",
    next_action:
      "Section 32 review; building/pest inspection; pre-auction offer via Jay Moxon (Barry Plant)",
  },
  {
    slug: "31-st-hellier-street-heidelberg-heights",
    address: "31 St Hellier Street, Heidelberg Heights VIC 3081",
    suburb: "Heidelberg Heights",
    price_guide: "840000-880000",
    bedrooms: "3",
    bathrooms: "2",
    car_spaces: "2",
    land_m2: "303",
    estimated_internal_area_m2: "105-120 internal; 166 reported floor area",
    study_score: "5",
    room_spaciousness_score: "6",
    ensuite_score: "6",
    kitchen_storage_score: "9",
    shared_bathroom_score: "8",
    low_maintenance_score: "7",
    light_orientation_score: "8",
    overall_fit_score: "76",
    in_person_visited: "2026-05-02",
    in_person_overall_score: "65",
    in_person_price_ceiling: "800000",
    status: "Sold - auction observed (comp only)",
    next_action:
      "SOLD 2 May 2026 at $997k. Not pursuing. Comp: top of guide + 10-12% = expected clearance model for area.",
  },
];

const fallbackSpace = [
  {
    slug: "1-buick-crescent-mill-park",
    master_band: "large",
    secondary_bedroom_band: "mid",
    study_or_retreat_band: "extra-large",
    primary_living_band: "mid-large",
    ensuite_band: "compact",
    kitchen_storage_band: "large",
    outdoor_space_band: "large covered alfresco",
    space_takeaway:
      "Best dedicated WFH/retreat; compact land but spacious usable layout because of vertical floor area and covered outdoor zone.",
  },
];

function renderSuburbs(filter = "all") {
  const visible =
    filter === "all" ? suburbs : suburbs.filter((suburb) => suburb.tags.includes(filter));

  grid.innerHTML = visible
    .map(
      (suburb) => `
        <article class="suburb-card">
          <div>
            <h3>${suburb.name}</h3>
            <div class="suburb-meta">
              <span class="tag">Cat ${suburb.category}</span>
              <span class="tag">${suburb.commute}</span>
              <span class="tag">${suburb.median}</span>
              <span class="tag">${suburb.land}</span>
            </div>
            <p>${suburb.summary}</p>
          </div>
          <div class="suburb-score">
            <span>Best use</span>
            <strong>${suburb.score}</strong>
          </div>
        </article>
      `,
    )
    .join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderSuburbs(button.dataset.filter);
  });
});

renderSuburbs();

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
  }

  const [headers, ...records] = rows;
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""])),
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugId(slug) {
  return `property-${String(slug || "").replace(/[^a-z0-9_-]/gi, "-")}`;
}

function numberValue(value) {
  return Number.parseFloat(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

function formatMoney(value) {
  const amount = numberValue(value);
  if (!amount) return "N/A";
  return `$${Math.round(amount / 1000)}k`;
}

function formatLegalScore(value) {
  const score = numberValue(value);
  return score ? `${score}/10` : "N/A";
}

function formatPriceGuide(value) {
  if (/sold/i.test(String(value || ""))) return String(value).replace(/^sold-?/i, "Sold ");
  const [low, high] = String(value || "").split("-").map(numberValue);
  if (!low && !high) return "No guide";
  return high ? `${formatMoney(low)}-${formatMoney(high)}` : formatMoney(low);
}

function formatRange(value) {
  const text = String(value || "").trim();
  if (!text || text.toLowerCase() === "unknown") return "Unknown";
  if (text.includes("-")) return formatPriceGuide(text);
  return formatMoney(text) || text;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatInternalArea(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  return /\b(m2|m²|sqm|internal|floor area)\b/i.test(text) ? text : `${text}m2 internal`;
}

function shortAddress(address) {
  return String(address || "").replace(/\s+VIC\s+/i, " Vic ");
}

function personalScore(property) {
  return numberValue(property.in_person_overall_score) || numberValue(property.overall_fit_score);
}

function scoreClass(score) {
  if (score >= 85 || score >= 9) return "great";
  if (score >= 75 || score >= 8) return "good";
  if (score >= 65 || score >= 6) return "ok";
  return "weak";
}

function statusClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("primary")) return "primary";
  if (normalized.includes("sold") || normalized.includes("comp")) return "comp";
  if (normalized.includes("reject") || normalized.includes("not pursuing")) return "rejected";
  return "neutral";
}

function scoreBar(label, score, max = 10) {
  const numericScore = numberValue(score);
  const percent = Math.max(0, Math.min(100, (numericScore / max) * 100));
  return `
    <div class="score-row">
      <span>${label}</span>
      <div class="score-track" aria-hidden="true"><div style="width: ${percent}%"></div></div>
      <strong>${numericScore}/${max}</strong>
    </div>
  `;
}

function renderCriteria() {
  criteriaGrid.innerHTML = criteriaSections
    .map(
      (section) => `
        <article class="criteria-card ${section.tone}">
          <h3>${escapeHtml(section.title)}</h3>
          <ul class="inspection-list">
            ${section.items
              .map(
                (item) => `
                  <li>
                    <span class="checkbox" aria-hidden="true"></span>
                    <span>${escapeHtml(item)}</span>
                  </li>
                `,
              )
              .join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

renderCriteria();

function inlineMarkdown(text) {
  let output = escapeHtml(text);
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const safeUrl = String(url).replace(/"/g, "%22");
    return `<a href="${safeUrl}">${label}</a>`;
  });
  return output;
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "").split(/\r?\n/);
  const html = [];
  let listType = null;
  let table = null;

  function closeList() {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  }

  function closeTable() {
    if (table) {
      html.push("</tbody></table></div>");
      table = null;
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      closeTable();
      return;
    }

    if (/^\|.+\|$/.test(trimmed)) {
      closeList();
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((cell) => inlineMarkdown(cell.trim()));
      if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) return;
      if (!table) {
        table = { headerDone: false };
        html.push('<div class="markdown-table-wrap"><table>');
      }
      if (!table.headerDone) {
        html.push(`<thead><tr>${cells.map((cell) => `<th>${cell}</th>`).join("")}</tr></thead><tbody>`);
        table.headerDone = true;
      } else {
        html.push(`<tr>${cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`);
      }
      return;
    }

    closeTable();

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = Math.min(heading[1].length + 1, 5);
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    const bullet = trimmed.match(/^[-*]\s+(.*)$/);
    const checkbox = trimmed.match(/^[-*]\s+\[( |x|X)\]\s+(.*)$/);
    if (checkbox || bullet) {
      const targetList = checkbox ? "ul" : "ul";
      if (listType !== targetList) {
        closeList();
        listType = targetList;
        html.push(`<${listType}>`);
      }
      const content = checkbox
        ? `<span class="inline-check">${checkbox[1].toLowerCase() === "x" ? "✓" : ""}</span>${inlineMarkdown(
            checkbox[2],
          )}`
        : inlineMarkdown(bullet[1]);
      html.push(`<li>${content}</li>`);
      return;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(trimmed)}</p>`);
  });

  closeList();
  closeTable();
  return html.join("");
}

async function openDocument(path, title) {
  if (!markdownReader) return;

  markdownReader.innerHTML = `<div class="reader-empty">Loading ${escapeHtml(title || "document")}...</div>`;
  location.hash = "reader";

  try {
    const response = await fetch(cacheBust(path), { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    markdownReader.innerHTML = `
      <div class="reader-heading">
        <div>
          <p class="eyebrow">Rendered Markdown</p>
          <h3>${escapeHtml(title || path)}</h3>
        </div>
        <a class="reader-button link-button" href="${path}">Raw file</a>
      </div>
      <div class="markdown-body">${markdownToHtml(markdown)}</div>
    `;
    markdownReader.focus({ preventScroll: true });
  } catch (error) {
    markdownReader.innerHTML = `
      <div class="reader-empty">
        Could not load ${escapeHtml(path)}. ${escapeHtml(error.message)}
      </div>
    `;
  }
}

function attachDocumentHandlers(root = document) {
  root.querySelectorAll("[data-doc]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      openDocument(button.dataset.doc, button.dataset.title || button.textContent.trim());
    });
  });
}

attachDocumentHandlers();

function cacheBust(path) {
  const separator = String(path).includes("?") ? "&" : "?";
  return `${path}${separator}v=${DATA_VERSION}`;
}

function isArchivedProperty(property) {
  const status = String(property.status || "").toLowerCase();
  return status.includes("archived") || status.includes("sold");
}

function isCurrentComparisonProperty(property) {
  return SATURDAY_AGENDA_SLUGS.includes(property.slug) || !isArchivedProperty(property);
}

function propertyMedia(property) {
  if (NO_REPUBLISHED_MEDIA_SLUGS.has(property.slug)) {
    return { photo: "", contactSheet: "", floorplan: "" };
  }

  const base = `../property-comparisons/${property.slug}/assets`;
  const ext = WEBP_ONLY_ASSET_SLUGS.has(property.slug) ? "webp" : "jpg";
  const floorplanExt =
    WEBP_ONLY_ASSET_SLUGS.has(property.slug) || property.slug === "10-northbridge-road-highton"
      ? "webp"
      : "jpg";

  return {
    photo: `${base}/photo-01.${ext}`,
    contactSheet: `${base}/contact-sheet.jpg`,
    floorplan: `${base}/floorplan.${floorplanExt}`,
  };
}

function renderComparisonSummary(properties) {
  if (!properties.length) {
    comparisonSummary.innerHTML = "";
    return;
  }

  const primary = properties.find((property) =>
    String(property.status || "").toLowerCase().includes("primary"),
  );
  const bestPersonal = [...properties].sort((a, b) => personalScore(b) - personalScore(a))[0];
  const marketComp = properties.find((property) =>
    property.slug === "5-berala-place-mill-park",
  ) || properties.find((property) =>
    String(property.status || "").toLowerCase().includes("sold"),
  );
  const bestValue = [...properties]
    .filter((property) => !String(property.status || "").toLowerCase().includes("sold"))
    .sort(
      (a, b) =>
        numberValue(b.price_risk_score) * 10 +
        personalScore(b) -
        (numberValue(a.price_risk_score) * 10 + personalScore(a)),
    )[0];
  const ceilingProperty = primary || bestPersonal;

  comparisonSummary.innerHTML = `
    <article>
      <span>Primary target</span>
      <strong>${primary ? primary.suburb : "None"}</strong>
      <small>${primary ? primary.address : "No active target in the matrix"}</small>
    </article>
    <article>
      <span>Best in-person score</span>
      <strong>${personalScore(bestPersonal)}/100</strong>
      <small>${bestPersonal.address}</small>
    </article>
    <article>
      <span>Current price ceiling</span>
      <strong>${formatMoney(ceilingProperty.in_person_price_ceiling)}</strong>
      <small>${ceilingProperty.address}</small>
    </article>
    <article>
      <span>Best value fit</span>
      <strong>${bestValue ? personalScore(bestValue) : "N/A"}/100</strong>
      <small>${bestValue ? bestValue.address : "No active value candidate"}</small>
    </article>
    <article>
      <span>Latest direct comp</span>
      <strong>${marketComp ? formatRange(marketComp.likely_transaction_range) : "$997k"}</strong>
      <small>${marketComp ? marketComp.address : "No sold comp in the matrix"}</small>
    </article>
  `;
}

function comparisonSortValue(property, sortKey) {
  if (sortKey === "overall_fit_score") return personalScore(property);
  return numberValue(property[sortKey]);
}

function renderPropertyNav(properties) {
  if (!propertyNav) return;
  propertyNav.innerHTML = properties
    .map(
      (property) => `
        <a href="#${slugId(property.slug)}">
          <strong>${escapeHtml(shortAddress(property.address).split(",")[0])}</strong>
          <span>${personalScore(property)}/100 · ${property.bedrooms}/${property.bathrooms}/${property.car_spaces}</span>
        </a>
      `,
    )
    .join("");
}

function spaceMetric(label, value) {
  return value ? `<div><span>${label}</span><strong>${escapeHtml(value)}</strong></div>` : "";
}

function renderComparisons(properties, sortKey = "overall_fit_score") {
  const sorted = [...properties].sort(
    (a, b) => comparisonSortValue(b, sortKey) - comparisonSortValue(a, sortKey),
  );

  comparisonGrid.innerHTML = sorted
    .map((property, index) => {
      const inPerson = personalScore(property);
      const aiScore = numberValue(property.overall_fit_score);
      const media = propertyMedia(property);
      const reportPath = `../property-comparisons/${property.slug}/report.md`;
      const inPersonPath = `../property-comparisons/${property.slug}/in-person.md`;
      const status = escapeHtml(property.status);
      const visited = formatDate(property.in_person_visited);
      const assessmentLayer = property.assessment_layer || (visited ? "AI + in-person" : "AI pre-visit only");
      const space = property.space || {};
      const contractWatchpoints = property.contract_watchpoints
        ? `<p class="contract-watch"><strong>Contract watch:</strong> ${escapeHtml(property.contract_watchpoints)}</p>`
        : "";

      return `
        <article class="property-card" id="${slugId(property.slug)}">
          <div class="property-image-wrap${media.photo ? "" : " image-missing"}">
            ${
              media.photo
                ? `<img src="${media.photo}" alt="${escapeHtml(property.address)}" loading="lazy" onerror="this.closest('.property-image-wrap').classList.add('image-missing'); this.remove();" />`
                : ""
            }
            <span class="rank">#${index + 1}</span>
            <span class="overall-badge ${scoreClass(inPerson)}">${inPerson}/100</span>
            <span class="status-badge ${statusClass(property.status)}">${status}</span>
          </div>
          <div class="property-body">
            <div class="property-title-row">
              <div>
                <h3>${escapeHtml(property.address).replace(", VIC", ", Vic")}</h3>
                <p>${visited ? `Visited ${visited}` : "AI assessment only"}</p>
              </div>
              <div class="report-links">
                <button class="text-link button-link" type="button" data-doc="${reportPath}" data-title="${escapeHtml(property.address)} — AI report">AI report</button>
                <button class="text-link button-link" type="button" data-doc="${inPersonPath}" data-title="${escapeHtml(property.address)} — In-person notes">In-person</button>
                ${media.contactSheet ? `<a class="text-link" href="${media.contactSheet}">Photos</a>` : ""}
                ${media.floorplan ? `<a class="text-link" href="${media.floorplan}">Floorplan</a>` : ""}
              </div>
            </div>
            <div class="score-pair">
              <div>
                <span>In-person</span>
                <strong>${inPerson}/100</strong>
              </div>
              <div>
                <span>AI</span>
                <strong>${aiScore}/100</strong>
              </div>
              <div>
                <span>Legal</span>
                <strong>${formatLegalScore(property.legal_risk_score)}</strong>
              </div>
              <div>
                <span>Ceiling</span>
                <strong>${formatMoney(property.in_person_price_ceiling)}</strong>
              </div>
              <div>
                <span>Price risk</span>
                <strong>${property.price_risk_score ? `${escapeHtml(property.price_risk_score)}/10` : "N/A"}</strong>
              </div>
              <div>
                <span>Fair value</span>
                <strong>${formatRange(property.fair_value_estimate)}</strong>
              </div>
            </div>
            <div class="property-facts">
              <span>${formatPriceGuide(property.price_guide)}</span>
              ${property.sale_method ? `<span>${escapeHtml(property.sale_method)}</span>` : ""}
              ${
                property.likely_transaction_range
                  ? `<span>Likely ${escapeHtml(formatRange(property.likely_transaction_range))}</span>`
                  : ""
              }
              <span>${property.bedrooms} bed</span>
              <span>${property.bathrooms} bath</span>
              <span>${property.car_spaces} car</span>
              <span>${property.land_m2}m2 land</span>
              <span>${escapeHtml(formatInternalArea(property.estimated_internal_area_m2))}</span>
              <span>${escapeHtml(assessmentLayer)}</span>
              ${
                property.pre_visit_confidence
                  ? `<span>${escapeHtml(property.pre_visit_confidence)} confidence</span>`
                  : ""
              }
            </div>
            <div class="space-snapshot">
              <div class="space-heading">
                <h4>Space read</h4>
                <button class="reader-button small" type="button" data-doc="../property-comparisons/space-analysis.md" data-title="Space Analysis">Details</button>
              </div>
              <div class="space-metrics">
                ${spaceMetric("Internal", property.estimated_internal_area_m2)}
                ${spaceMetric("Master", space.master_band)}
                ${spaceMetric("Bedrooms", space.secondary_bedroom_band)}
                ${spaceMetric("Study/retreat", space.study_or_retreat_band)}
                ${spaceMetric("Living", space.primary_living_band)}
                ${spaceMetric("Ensuite", space.ensuite_band)}
                ${spaceMetric("Kitchen", space.kitchen_storage_band)}
                ${spaceMetric("Outdoor", space.outdoor_space_band)}
              </div>
              ${
                space.space_takeaway
                  ? `<p>${escapeHtml(space.space_takeaway)}</p>`
                  : `<p>No space-matrix row yet. Add this property to space-matrix.csv for room bands.</p>`
              }
            </div>
            ${
              property.price_lens || property.affordability_read
                ? `<div class="price-snapshot">
                    <h4>Price read</h4>
                    ${property.price_lens ? `<p>${escapeHtml(property.price_lens)}</p>` : ""}
                    ${property.affordability_read ? `<p>${escapeHtml(property.affordability_read)}</p>` : ""}
                  </div>`
                : ""
            }
            <div class="score-list">
              ${scoreBar("Study/work", property.study_score)}
              ${scoreBar("Room size", property.room_spaciousness_score)}
              ${scoreBar("Ensuite", property.ensuite_score)}
              ${scoreBar("Kitchen storage", property.kitchen_storage_score)}
              ${scoreBar("Shared bath", property.shared_bathroom_score)}
              ${scoreBar("Low maintenance", property.low_maintenance_score)}
              ${scoreBar("Light", property.light_orientation_score)}
            </div>
            ${contractWatchpoints}
            <p class="next-action">${escapeHtml(property.next_action)}</p>
          </div>
        </article>
      `;
    })
    .join("");

  attachDocumentHandlers(comparisonGrid);

  comparisonTableBody.innerHTML = sorted
    .map(
      (property) => `
        <tr>
          <td>
            <a href="../property-comparisons/${property.slug}/report.md">${escapeHtml(
              property.address,
            )}</a>
            <small class="table-status">${escapeHtml(property.status)}</small>
          </td>
          <td>${formatPriceGuide(property.price_guide)}</td>
          <td>${escapeHtml(formatRange(property.likely_transaction_range || property.fair_value_estimate))}</td>
          <td>${escapeHtml(property.sale_method || "N/A")}</td>
          <td>${property.price_risk_score ? `${escapeHtml(property.price_risk_score)}/10` : "N/A"}</td>
          <td><strong>${personalScore(property)}</strong></td>
          <td>${property.overall_fit_score}</td>
          <td>${formatLegalScore(property.legal_risk_score)}</td>
          <td>${formatMoney(property.in_person_price_ceiling)}</td>
          <td>${property.land_m2 ? `${property.land_m2}m2` : "N/A"}</td>
          <td>${escapeHtml(formatInternalArea(property.estimated_internal_area_m2) || "N/A")}</td>
          <td>${escapeHtml(property.space?.master_band || "N/A")}</td>
          <td>${escapeHtml(property.space?.study_or_retreat_band || "N/A")}</td>
          <td>${property.study_score}</td>
          <td>${property.room_spaciousness_score}</td>
          <td>${property.ensuite_score}</td>
          <td>${property.kitchen_storage_score}</td>
          <td>${property.shared_bathroom_score}</td>
          <td>${property.low_maintenance_score}</td>
          <td>${property.light_orientation_score}</td>
        </tr>
      `,
    )
    .join("");
}

async function loadComparisons() {
  let comparisons = fallbackComparisons;
  let spaces = fallbackSpace;

  try {
    const [comparisonResponse, spaceResponse] = await Promise.all([
      fetch(cacheBust("../property-comparisons/comparison-matrix.csv"), { cache: "no-store" }),
      fetch(cacheBust("../property-comparisons/space-matrix.csv"), { cache: "no-store" }),
    ]);
    if (comparisonResponse.ok) comparisons = parseCsv(await comparisonResponse.text());
    if (spaceResponse.ok) spaces = parseCsv(await spaceResponse.text());
  } catch {
    comparisons = fallbackComparisons;
  }

  const spaceBySlug = Object.fromEntries(spaces.map((space) => [space.slug, space]));
  comparisons = comparisons.map((property) => ({
    ...property,
    space: spaceBySlug[property.slug],
  }));

  const currentComparisons = comparisons.filter(isCurrentComparisonProperty);

  renderPropertyNav(currentComparisons);
  renderComparisonSummary(currentComparisons);
  renderComparisons(currentComparisons);

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      sortButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderComparisons(currentComparisons, button.dataset.sort);
    });
  });
}

loadComparisons();
