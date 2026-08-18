/* Interium Lua API docs — tiny hash-router SPA, no build step, works on file:// */

(function () {
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const sidebarEl = $("#sidebar-nav");
  const mainEl = $("#main");
  const searchInput = $("#search-input");
  const searchResults = $("#search-results");

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Small Lua/JS-ish tokenizer — splits code into typed chunks so every
  // character ends up inside a styled span (nothing is left to inherit
  // default browser <code> styling).
  const LUA_KEYWORDS = new Set(["local", "function", "end", "if", "then", "else", "elseif", "return", "for", "while", "do", "not", "and", "or", "nil", "true", "false", "break", "goto", "repeat", "until", "in"]);
  const JS_KEYWORDS = new Set(["function", "var", "let", "const", "if", "else", "return", "for", "while", "new", "true", "false", "null"]);

  function highlight(code, lang) {
    const keywords = lang === "js" ? JS_KEYWORDS : LUA_KEYWORDS;
    const tokenRe = lang === "js"
      ? /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b0x[0-9a-fA-F]+\b|\b\d+\.?\d*\b)|([A-Za-z_$][A-Za-z0-9_$]*)|(\s+)|([\s\S])/g
      : /(--\[\[[\s\S]*?\]\]|--[^\n]*)|(\[\[[\s\S]*?\]\]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b0x[0-9a-fA-F]+\b|\b\d+\.?\d*\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([\s\S])/g;

    let out = "";
    let m;
    while ((m = tokenRe.exec(code)) !== null) {
      const [, comment, str, num, word, space, other] = m;
      if (comment !== undefined) out += `<span class="tok-comment">${escapeHtml(comment)}</span>`;
      else if (str !== undefined) out += `<span class="tok-string">${escapeHtml(str)}</span>`;
      else if (num !== undefined) out += `<span class="tok-number">${escapeHtml(num)}</span>`;
      else if (word !== undefined) {
        const cls = keywords.has(word) ? "tok-keyword" : "tok-plain";
        out += `<span class="${cls}">${escapeHtml(word)}</span>`;
      }
      else if (space !== undefined) out += escapeHtml(space);
      else out += `<span class="tok-plain">${escapeHtml(other)}</span>`;
    }
    return out;
  }

  function codeBlock(example) {
    if (!example) return "";
    const lang = example.lang || "lua";
    return `
      <div class="code-file">${escapeHtml(example.file)}</div>
      <pre class="code-block"><code>${highlight(example.code, lang)}</code></pre>
    `;
  }

  function entryCard(e) {
    const tags = [];
    if (e.category) {
      e.category.split(",").forEach(c => tags.push(`<span class="tag">${escapeHtml(c.trim())}</span>`));
    }
    if (e.inferred) tags.push(`<span class="tag inferred">inferred</span>`);
    if (e.isField) tags.push(`<span class="tag">field</span>`);
    if (e.isJs) tags.push(`<span class="tag">panorama js</span>`);

    return `
      <div class="entry" id="entry-${slug(e.name)}">
        <div class="entry-header">
          <div class="entry-name">${escapeHtml(e.name)}</div>
          <div class="entry-sig">${escapeHtml(e.sig)}</div>
        </div>
        <div class="entry-body">
          <div class="entry-tags">${tags.join("")}</div>
          <div class="entry-desc">${escapeHtml(e.desc)}</div>
          ${codeBlock(e.example)}
        </div>
      </div>
    `;
  }

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  // ---------- Pages ----------

  function renderHome() {
    const totalEntries = API_DATA.entries.length;
    const totalNamespaces = Object.keys(API_DATA.namespaceInfo).length;
    const totalCallbacks = API_DATA.callbacks.length;
    const totalOffsets = API_DATA.offsets.length;

    const cards = [];
    API_DATA.groups.forEach(g => {
      if (g.namespaces) {
        g.namespaces.forEach(ns => {
          const info = API_DATA.namespaceInfo[ns];
          const count = API_DATA.entries.filter(e => e.ns === ns).length;
          cards.push(`
            <div class="home-card" data-route="#/ns/${ns}">
              <div class="h-title">${escapeHtml(info.title)}</div>
              <div class="h-sub">${escapeHtml(info.tagline)} · ${count} entries</div>
            </div>
          `);
        });
      }
    });

    mainEl.innerHTML = `
      <h1>${escapeHtml(API_DATA.meta.title)}</h1>
      <div class="page-tagline">${escapeHtml(API_DATA.meta.subtitle)}</div>

      <div class="callout">${escapeHtml(API_DATA.meta.sourceNote)}</div>

      <div class="stat-row">
        <div class="stat"><div class="num">${totalEntries}</div><div class="lbl">API entries</div></div>
        <div class="stat"><div class="num">${totalNamespaces}</div><div class="lbl">Namespaces</div></div>
        <div class="stat"><div class="num">${totalCallbacks}</div><div class="lbl">Callbacks</div></div>
        <div class="stat"><div class="num">${totalOffsets}</div><div class="lbl">Known offsets</div></div>
      </div>

      <div class="prose">
        <h2>Start here</h2>
        <ul>
          <li><a href="#/page/getting-started">Getting started</a> — loading a script and the callback model.</li>
          <li><a href="#/page/callbacks">Callbacks</a> — every engine hook you can register with <code>Hack.RegisterCallback</code>.</li>
          <li><a href="#/page/conventions">Conventions</a> — how signatures, tags, and “inferred” entries work in this reference.</li>
        </ul>
      </div>

      <div class="prose"><h2>Browse namespaces</h2></div>
      <div class="home-grid">${cards.join("")}</div>

      <div class="footer-note">Unofficial, community-compiled reference. Not affiliated with or endorsed by Interium.</div>
    `;

    $$(".home-card", mainEl).forEach(el => {
      el.addEventListener("click", () => { location.hash = el.dataset.route; });
    });
  }

  function renderNamespace(ns) {
    const info = API_DATA.namespaceInfo[ns];
    if (!info) return renderNotFound();
    const entries = API_DATA.entries.filter(e => e.ns === ns);

    mainEl.innerHTML = `
      <h1>${escapeHtml(info.title)}</h1>
      <div class="page-tagline">${escapeHtml(info.tagline)}</div>
      ${entries.map(entryCard).join("")}
      <div class="footer-note">${entries.length} entries in this namespace.</div>
    `;
  }

  function renderCallbacks() {
    const cards = API_DATA.callbacks.map(cb => `
      <div class="callback-card" id="entry-${slug(cb.name)}">
        <div class="callback-name">"${escapeHtml(cb.name)}"</div>
        <div class="callback-sig">${escapeHtml(cb.handlerSig)}</div>
        <div class="callback-trigger">${escapeHtml(cb.trigger)}</div>
        ${codeBlock(cb.example)}
      </div>
    `).join("");

    mainEl.innerHTML = `
      <h1>Callbacks</h1>
      <div class="page-tagline">Every distinct callback name registered via <code>Hack.RegisterCallback(name, fn)</code> found across the example scripts.</div>
      ${cards}
      <div class="footer-note">${API_DATA.callbacks.length} known callbacks.</div>
    `;
  }

  function renderOffsets() {
    const rows = API_DATA.offsets.map(o => `
      <tr>
        <td>${escapeHtml(o.cls)}</td>
        <td>${escapeHtml(o.prop)}</td>
        <td>${escapeHtml(o.desc)}</td>
      </tr>
    `).join("");

    mainEl.innerHTML = `
      <h1>Offset Catalog</h1>
      <div class="page-tagline"><code>Hack.GetOffset(className, propName)</code> pairs seen in real scripts, resolved for use with <code>:GetProp*</code> / <code>:SetProp*</code>.</div>
      <table class="ref-table">
        <thead><tr><th>Class (net table)</th><th>Property</th><th>Used for</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="prose"><h2>Example usage pattern</h2></div>
      ${codeBlock(API_DATA.offsetExample)}
      <div class="footer-note">${API_DATA.offsets.length} known offset pairs. This list only reflects what appears in the example corpus — many more offsets almost certainly exist.</div>
    `;
  }

  function renderClassIds() {
    const rows = API_DATA.classIds.map(c => `
      <tr><td>${c.id}</td><td>${escapeHtml(c.desc)}</td></tr>
    `).join("");
    mainEl.innerHTML = `
      <h1>Class ID Reference</h1>
      <div class="page-tagline">Networked class IDs returned by <code>entity:GetClassId()</code>.</div>
      <table class="ref-table">
        <thead><tr><th>ID</th><th>Meaning</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer-note">Small list — only IDs that appeared explicitly in example scripts are included.</div>
    `;
  }

  function constTable(title, rows) {
    if (!rows || rows.length === 0) return "";
    return `
      <div class="prose"><h2>${escapeHtml(title)}</h2></div>
      <table class="ref-table">
        <thead><tr><th>Name</th><th>Value</th><th>Meaning</th></tr></thead>
        <tbody>${rows.map(r => `
          <tr><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.value)}</td><td>${escapeHtml(r.desc)}</td></tr>
        `).join("")}</tbody>
      </table>
    `;
  }

  function renderConstants() {
    const c = API_DATA.constants || {};
    mainEl.innerHTML = `
      <h1>Constants</h1>
      <div class="page-tagline">Trace masks, button bit indices, move types and physics values used by real movement scripts.</div>
      <div class="callout">Remember that <code>SetBit</code> / <code>DelBit</code> / <code>IsBit</code> take a bit <strong>index</strong>, not the flag value. Passing the value (e.g. 4 for IN_DUCK instead of 2) silently sets the wrong button.</div>
      ${constTable("Trace masks", c.masks)}
      ${constTable("Button bit indices (cmd.buttons)", c.buttonBits)}
      ${constTable("Move types (entity:GetMoveType())", c.moveTypes)}
      ${constTable("Flag bits (m_fFlags)", c.flagBits)}
      ${constTable("Physics values", c.physics)}
      <div class="footer-note">Values observed in working community scripts. Verify against your build before relying on them.</div>
    `;
  }

  function renderVars() {
    const rows = (API_DATA.varsHandles || []).map(v => `
      <tr><td>${escapeHtml(v.name)}</td><td>${escapeHtml(v.type)}</td><td>${escapeHtml(v.desc)}</td></tr>
    `).join("");
    mainEl.innerHTML = `
      <h1>Built-in Vars Handles</h1>
      <div class="page-tagline">The <code>Vars</code> table exposes the hack's own built-in settings, separate from user-registered <code>Menu.*</code> widgets. Read them with the bare <code>GetBool</code> / <code>GetInt</code> / <code>GetColor</code> functions, not <code>Menu.Get*</code>.</div>
      <table class="ref-table">
        <thead><tr><th>Handle</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="prose"><h2>Usage</h2></div>
      <pre class="code-block"><code>${highlight(`-- Wrap in pcall: handles may not exist on every build.
local function getVarBool(name)
    if (Vars == nil) then return false end
    local ok, handle = pcall(function() return Vars[name] end)
    if (not ok or handle == nil) then return false end
    local ok2, result = pcall(GetBool, handle)
    return ok2 and result == true
end

if (getVarBool("misc_edgebug")) then
    local key = GetInt(Vars.misc_edgebug_key)
    if (key ~= 0 and InputSys.IsKeyDown(key)) then
        -- the built-in edgebug bind is being held
    end
end`, "lua")}</code></pre>
      <div class="footer-note">This list is not exhaustive — it covers handles seen in working scripts.</div>
    `;
  }

  const PROSE_PAGES = {
    intro: {
      title: "Introduction",
      html: `
        <div class="prose">
          <p>This is an <strong>unofficial, community-compiled reference</strong> for the Lua scripting API exposed by the Interium CS:GO client. There is no official documentation for this API — everything here was reverse-engineered by reading roughly 135 real Lua scripts written by the community (the <code>examples/</code> folder shipped alongside this site).</p>
          <p>Because it's derived from usage rather than source code or headers, treat every signature as a best-effort description of how people actually call these functions. Parameter names come from the variable names authors chose, not from official docs — they're a strong hint, not a guarantee. Entries tagged <span class="tag inferred">inferred</span> are the least certain: functions referenced by name but never called with a full argument list in the corpus.</p>
          <h2>How this reference is organized</h2>
          <ul>
            <li><strong>Core</strong> — the loader (<code>Hack</code>), state helpers (<code>Utils</code>), and ungrouped globals.</li>
            <li><strong>Menu &amp; UI</strong> — registering settings widgets in the hack's menu.</li>
            <li><strong>Rendering</strong> — drawing HUD elements, world overlays, fonts, images, chams.</li>
            <li><strong>Entities &amp; World</strong> — looking up players/entities and reading their state.</li>
            <li><strong>Math &amp; Vectors</strong> — vector/angle math and the core value types.</li>
            <li><strong>Input</strong> — keyboard and cursor state.</li>
            <li><strong>Events &amp; Networking</strong> — game events, chat, cvars, raw network messages.</li>
            <li><strong>Files &amp; System</strong> — reading/writing local files.</li>
            <li><strong>Panorama</strong> — bridging into the CEF-based menu UI's JavaScript environment.</li>
          </ul>
          <p>Every entry links back to the real script it was observed in, so you can open <code>examples/Lua/&lt;file&gt;</code> yourself to see the full context.</p>
        </div>
      `
    },
    "getting-started": {
      title: "Getting Started",
      html: `
        <div class="prose">
          <p>Interium Lua scripts are plain <code>.lua</code> files placed in the client's Lua scripts folder (commonly under <code>%AppData%\\INTERIUM\\CSGO\\Lua\\</code>, based on paths seen throughout the example scripts) and loaded from the in-game menu, or programmatically with <a href="#/ns/Hack"><code>Hack.LoadLua</code></a>.</p>
          <h2>The basic shape of a script</h2>
          <p>Almost every script follows the same pattern: define one or more handler functions, then register them against an engine callback so the client calls them at the right time.</p>
          <pre class="code-block"><code><span class="tok-comment">-- 1. Register menu options (runs once, at load)</span>
Menu.Checkbox(<span class="tok-string">"Enable Feature"</span>, <span class="tok-string">"bMyFeature"</span>, <span class="tok-keyword">true</span>)

<span class="tok-comment">-- 2. Define a handler</span>
<span class="tok-keyword">local</span> <span class="tok-keyword">function</span> Draw()
    <span class="tok-keyword">if</span> (<span class="tok-keyword">not</span> Menu.GetBool(<span class="tok-string">"bMyFeature"</span>)) <span class="tok-keyword">then</span> <span class="tok-keyword">return</span> <span class="tok-keyword">end</span>
    Render.Text_1(<span class="tok-string">"Hello"</span>, <span class="tok-number">100</span>, <span class="tok-number">100</span>, <span class="tok-number">18</span>, Color.new(<span class="tok-number">255</span>,<span class="tok-number">255</span>,<span class="tok-number">255</span>,<span class="tok-number">255</span>), <span class="tok-keyword">false</span>, <span class="tok-keyword">true</span>)
<span class="tok-keyword">end</span>

<span class="tok-comment">-- 3. Register it against the right engine callback</span>
Hack.RegisterCallback(<span class="tok-string">"PaintTraverse"</span>, Draw)</code></pre>
          <p>See <a href="#/page/callbacks">Callbacks</a> for the full list of hooks (<code>CreateMove</code> for per-tick/movement logic, <code>PaintTraverse</code> for drawing, <code>FireEventClientSideThink</code> for game events, and more).</p>
          <h2>Reading and writing settings</h2>
          <p>Widgets registered with <a href="#/ns/Menu"><code>Menu.*</code></a> functions take an <code>id</code> string as their storage key. Read the current value back anywhere in your script with the matching <code>Menu.Get*</code> function — this is also how separate scripts can share state with each other (several examples in the corpus use a <code>Menu.SetString</code>/<code>Menu.GetString</code> pair purely as a cross-script mailbox).</p>
          <h2>Working with entities</h2>
          <p>Most gameplay-reading scripts follow this shape: get the local player, resolve any netprop offsets you need once (outside the hot loop), then read them every frame or tick.</p>
          <pre class="code-block"><code><span class="tok-keyword">local</span> healthOffset = Hack.GetOffset(<span class="tok-string">"DT_BasePlayer"</span>, <span class="tok-string">"m_iHealth"</span>)

<span class="tok-keyword">local</span> <span class="tok-keyword">function</span> CreateMove(cmd, sendp)
    <span class="tok-keyword">if</span> (<span class="tok-keyword">not</span> Utils.IsLocalAlive()) <span class="tok-keyword">then</span> <span class="tok-keyword">return</span> <span class="tok-keyword">end</span>
    <span class="tok-keyword">local</span> pLocal = IEntityList.GetPlayer(IEngine.GetLocalPlayer())
    <span class="tok-keyword">local</span> health = pLocal:GetPropInt(healthOffset)
<span class="tok-keyword">end</span>
Hack.RegisterCallback(<span class="tok-string">"CreateMove"</span>, CreateMove)</code></pre>
          <p>See the <a href="#/page/offsets">Offset Catalog</a> for every <code>Hack.GetOffset</code> class/property pair seen across the example scripts.</p>
        </div>
      `
    },
    conventions: {
      title: "Conventions",
      html: `
        <div class="prose">
          <p>A few notes on how to read entries in this reference:</p>
          <h2>Signatures</h2>
          <p>Parameter names are taken directly from the variable names real scripts used when calling a function — they describe intent, not a confirmed formal parameter list. Optional-looking parameters are wrapped in <code>[brackets]</code> when the corpus showed both a short and a long call form.</p>
          <h2>Tags</h2>
          <ul>
            <li><span class="tag">category name</span> — one or more informal categories a function fits into (rendering, entities, input, etc). Several of the top-level sidebar groups are built directly from these.</li>
            <li><span class="tag inferred">inferred</span> — this entry was named/referenced in scripts but never called with concrete arguments in the corpus, so its shape is a best guess from context (comments, sibling functions, naming pattern).</li>
            <li><span class="tag">field</span> — accessed as a plain property (no parentheses), not called as a function.</li>
            <li><span class="tag">panorama js</span> — not a Lua API at all; a JavaScript global only reachable from inside a string passed to <code>IPanorama.RunScript_Menu</code>.</li>
          </ul>
          <h2>Code examples</h2>
          <p>Every example is a real, lightly-trimmed snippet pulled from a script in <code>examples/Lua/</code>, with the source filename shown above the code block so you can go read the full file for more context.</p>
          <h2>What's missing</h2>
          <p>~30 of the ~165 scripts in the examples folder are binary/obfuscated and unreadable as text, so any API surface used <em>only</em> by those scripts is not represented here. This reference should be treated as a lower bound on the full API, not an exhaustive one.</p>
        </div>
      `
    },
    credits: {
      title: "Credits",
      html: `
        <div class="prose">
          <p>Special thanks to: <strong>валик</strong></p>
          <p>Made by <strong>ui</strong></p>
        </div>
      `
    }
  };

  function renderProse(id) {
    const page = PROSE_PAGES[id];
    if (!page) return renderNotFound();
    mainEl.innerHTML = `<h1>${escapeHtml(page.title)}</h1>${page.html}`;
  }

  function renderNotFound() {
    mainEl.innerHTML = `<h1>Not found</h1><div class="page-tagline">That page doesn't exist. <a href="#/">Go home</a>.</div>`;
  }

  // ---------- Router ----------

  function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    const parts = hash.split("/").filter(Boolean);

    if (parts.length === 0) {
      renderHome();
    } else if (parts[0] === "ns" && parts[1]) {
      renderNamespace(parts[1]);
    } else if (parts[0] === "page" && parts[1] === "callbacks") {
      renderCallbacks();
    } else if (parts[0] === "page" && parts[1] === "offsets") {
      renderOffsets();
    } else if (parts[0] === "page" && parts[1] === "classids") {
      renderClassIds();
    } else if (parts[0] === "page" && parts[1] === "constants") {
      renderConstants();
    } else if (parts[0] === "page" && parts[1] === "vars") {
      renderVars();
    } else if (parts[0] === "page" && parts[1]) {
      renderProse(parts[1]);
    } else {
      renderNotFound();
    }

    window.scrollTo(0, 0);
    updateActiveNav();
    closeSidebarMobile();
  }

  window.addEventListener("hashchange", route);

  // ---------- Sidebar build ----------

  const PAGE_LABELS = {
    intro: "Introduction",
    "getting-started": "Getting Started",
    callbacks: "Callbacks",
    conventions: "Conventions",
    offsets: "Offset Catalog",
    classids: "Class IDs",
    constants: "Constants",
    vars: "Vars Handles",
    credits: "Credits"
  };

  function buildSidebar() {
    let html = "";
    API_DATA.groups.forEach(g => {
      html += `<div class="nav-group"><div class="nav-group-label">${escapeHtml(g.label)}</div>`;
      if (g.pages) {
        g.pages.forEach(p => {
          html += `<a class="nav-item" data-route="#/page/${p}" href="#/page/${p}">${escapeHtml(PAGE_LABELS[p] || p)}</a>`;
        });
      }
      if (g.namespaces) {
        g.namespaces.forEach(ns => {
          const info = API_DATA.namespaceInfo[ns];
          html += `<a class="nav-item" data-route="#/ns/${ns}" href="#/ns/${ns}">${escapeHtml(info ? info.title : ns)}</a>`;
        });
      }
      html += `</div>`;
    });
    sidebarEl.innerHTML = html;
  }

  function updateActiveNav() {
    const current = location.hash || "#/";
    $$(".nav-item", sidebarEl).forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === current);
    });
  }

  // ---------- Search ----------

  function buildSearchIndex() {
    const idx = [];
    API_DATA.entries.forEach(e => {
      idx.push({ label: e.name, sub: e.ns, route: `#/ns/${e.ns}`, anchor: `entry-${slug(e.name)}`, hay: (e.name + " " + e.sig + " " + e.desc).toLowerCase() });
    });
    API_DATA.callbacks.forEach(cb => {
      idx.push({ label: `"${cb.name}"`, sub: "Callback", route: `#/page/callbacks`, anchor: `entry-${slug(cb.name)}`, hay: (cb.name + " " + cb.handlerSig + " " + cb.trigger).toLowerCase() });
    });
    return idx;
  }

  const searchIndex = buildSearchIndex();

  function runSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) { searchResults.classList.remove("open"); searchResults.innerHTML = ""; return; }
    const matches = searchIndex.filter(item => item.hay.includes(q)).slice(0, 20);
    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="search-result-item"><div class="search-result-name">No results</div></div>`;
    } else {
      searchResults.innerHTML = matches.map(m => `
        <div class="search-result-item" data-route="${m.route}" data-anchor="${m.anchor}">
          <div class="search-result-name">${escapeHtml(m.label)}</div>
          <div class="search-result-ns">${escapeHtml(m.sub)}</div>
        </div>
      `).join("");
    }
    searchResults.classList.add("open");
  }

  searchInput.addEventListener("input", e => runSearch(e.target.value));
  searchInput.addEventListener("focus", e => { if (e.target.value) runSearch(e.target.value); });

  searchResults.addEventListener("click", e => {
    const item = e.target.closest(".search-result-item");
    if (!item || !item.dataset.route) return;
    const targetRoute = item.dataset.route;
    const anchor = item.dataset.anchor;
    searchInput.value = "";
    searchResults.classList.remove("open");
    searchResults.innerHTML = "";
    if (location.hash === targetRoute) {
      scrollToAnchor(anchor);
    } else {
      location.hash = targetRoute;
      setTimeout(() => scrollToAnchor(anchor), 50);
    }
  });

  function scrollToAnchor(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.style.borderColor = "var(--accent)";
      setTimeout(() => { el.style.borderColor = ""; }, 1500);
    }
  }

  document.addEventListener("click", e => {
    if (!e.target.closest(".search-box")) {
      searchResults.classList.remove("open");
    }
  });

  // ---------- Mobile sidebar ----------

  const menuToggle = $("#menu-toggle");
  const sidebar = $("#sidebar");
  menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
  function closeSidebarMobile() { sidebar.classList.remove("open"); }

  // ---------- Init ----------

  buildSidebar();
  route();
})();
