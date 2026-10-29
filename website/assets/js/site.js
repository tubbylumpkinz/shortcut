/* ==========================================================================
   Shortcut — site behaviour
   Vanilla JS. No build step, no dependencies.
   ========================================================================== */

(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var SITE = window.SITE || { posts: [], links: [] };

  var THEME_KEY = "shortcut-theme";

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(iso) {
    var d = new Date(iso + "T12:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  /* ---- Theme ------------------------------------------------------------- */
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f6f3ee" : "#08080a");
    $$("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
    });
  }

  if (root.getAttribute("data-theme") !== "light" && root.getAttribute("data-theme") !== "dark") {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
    setTheme(stored || "dark");
  }

  $$("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  });

  /* ---- Mobile nav -------------------------------------------------------- */
  var navToggle = $(".nav-toggle");
  var siteNav = $(".site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    siteNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && siteNav.classList.contains("open")) {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---- Reveal on scroll -------------------------------------------------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealObserver = null;

  if (!reduced && "IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
  }

  function watchReveals(scope) {
    $$(".reveal", scope || doc).forEach(function (el) {
      if (el.classList.contains("in")) return;
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add("in");
    });
  }

  /* ---- Post cards -------------------------------------------------------- */
  function postCard(p) {
    return (
      '<article class="post-card reveal">' +
        '<a class="post-card-link" href="posts/' + esc(p.slug) + '.html">' +
          '<div class="post-art" data-num="' + esc(p.num) + '" style="--h:' + esc(p.hue) + '">' +
            '<span class="art-glyph" aria-hidden="true">' + esc(p.glyph) + "</span>" +
          "</div>" +
          '<div class="post-card-body">' +
            '<div class="meta"><span class="tag">' + esc(p.tag) + '</span><span class="sep">/</span><span>' + esc(p.read) + " min read</span></div>" +
            "<h2>" + esc(p.title) + "</h2>" +
            "<p>" + esc(p.dek) + "</p>" +
            '<div class="card-foot"><span>' + formatDate(p.date) + '</span><span class="go">Read &rarr;</span></div>' +
          "</div>" +
        "</a>" +
      "</article>"
    );
  }

  function linkCard(l) {
    var letter = String(l.name || "?").charAt(0).toUpperCase();
    return (
      '<a class="link-card reveal" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="monogram" style="--h:' + esc(l.hue) + '" aria-hidden="true">' + esc(letter) + "</span>" +
        '<span class="link-body">' +
          '<span class="link-top">' +
            '<span class="link-name">' + esc(l.name) + "</span>" +
            '<span class="link-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></span>' +
          "</span>" +
          '<span class="link-note">' + esc(l.note) + "</span>" +
          '<span class="link-domain">' + esc(l.domain) + "</span>" +
        "</span>" +
      "</a>"
    );
  }

  var posts = (SITE.posts || []).slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  /* ---- Home -------------------------------------------------------------- */
  var featuredHost = $("#featured-post");
  if (featuredHost) {
    var featured = posts.filter(function (p) { return p.featured; })[0] || posts[0];
    if (featured) {
      featuredHost.innerHTML =
        '<article class="featured reveal">' +
          '<div class="featured-body">' +
            '<div class="meta"><span class="tag">Featured</span><span class="sep">/</span><span>' + esc(featured.tag) + '</span><span class="sep">/</span><span>' + esc(featured.read) + " min read</span></div>" +
            '<h2><a href="posts/' + esc(featured.slug) + '.html">' + esc(featured.title) + "</a></h2>" +
            "<p>" + esc(featured.dek) + "</p>" +
            '<div class="featured-cta">' +
              '<a class="btn btn-primary" href="posts/' + esc(featured.slug) + '.html">Read the piece' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
              "</a>" +
              '<span class="mono" style="color:var(--text-faint)">' + formatDate(featured.date) + "</span>" +
            "</div>" +
          "</div>" +
          '<div class="post-art" data-num="' + esc(featured.num) + '" style="--h:' + esc(featured.hue) + '">' +
            '<span class="art-glyph" aria-hidden="true">' + esc(featured.glyph) + "</span>" +
          "</div>" +
        "</article>";
    }
  }

  var latestHost = $("#latest-posts");
  if (latestHost) {
    var featuredSlug = (posts.filter(function (p) { return p.featured; })[0] || posts[0] || {}).slug;
    var rest = posts.filter(function (p) { return p.slug !== featuredSlug; }).slice(0, 6);
    latestHost.innerHTML = rest.map(postCard).join("");
  }

  /* ---- Archive ----------------------------------------------------------- */
  var archiveGrid = $("#archive-grid");
  if (archiveGrid) {
    var archiveSearch = $("#archive-search");
    var chipHost = $("#tag-chips");
    var countEl = $("#archive-count");
    var activeTag = "All";
    var query = "";

    var tags = ["All"];
    posts.forEach(function (p) {
      if (tags.indexOf(p.tag) === -1) tags.push(p.tag);
    });

    if (chipHost) {
      chipHost.innerHTML = tags.map(function (tag) {
        return '<button class="chip" type="button" data-tag="' + esc(tag) + '" aria-pressed="' +
          (tag === activeTag ? "true" : "false") + '">' + esc(tag) + "</button>";
      }).join("");

      chipHost.addEventListener("click", function (e) {
        var chip = e.target.closest(".chip");
        if (!chip) return;
        activeTag = chip.getAttribute("data-tag");
        $$(".chip", chipHost).forEach(function (c) {
          c.setAttribute("aria-pressed", String(c === chip));
        });
        renderArchive();
      });
    }

    function renderArchive() {
      var q = query.trim().toLowerCase();
      var matches = posts.filter(function (p) {
        var tagOk = activeTag === "All" || p.tag === activeTag;
        if (!tagOk) return false;
        if (!q) return true;
        return (p.title + " " + p.dek + " " + p.tag).toLowerCase().indexOf(q) !== -1;
      });

      if (countEl) {
        countEl.textContent = matches.length + (matches.length === 1 ? " piece" : " pieces") +
          (activeTag === "All" ? "" : " in " + activeTag) + (q ? ' for "' + query.trim() + '"' : "");
      }

      if (!matches.length) {
        archiveGrid.innerHTML =
          '<div class="empty-state" style="grid-column:1/-1">' +
            "<strong>Nothing filed under that yet.</strong>" +
            "<p>Try a different word, or clear the filters and browse the shelf.</p>" +
          "</div>";
        return;
      }

      archiveGrid.innerHTML = matches.map(postCard).join("");
      watchReveals(archiveGrid);
    }

    if (archiveSearch) {
      archiveSearch.addEventListener("input", function (e) {
        query = e.target.value;
        renderArchive();
      });
    }

    renderArchive();
  }

  /* ---- Link library ------------------------------------------------------ */
  var linksGrid = $("#links-grid");
  if (linksGrid) {
    var linkSearch = $("#links-search");
    var linkChips = $("#link-chips");
    var linkCount = $("#links-count");
    var activeCat = "All";
    var linkQuery = "";
    var links = SITE.links || [];
    var cats = ["All"];
    links.forEach(function (l) {
      if (cats.indexOf(l.cat) === -1) cats.push(l.cat);
    });

    function renderLinks() {
      var q = linkQuery.trim().toLowerCase();
      var matches = links.filter(function (l) {
        if (activeCat !== "All" && l.cat !== activeCat) return false;
        if (!q) return true;
        return (l.name + " " + l.note + " " + l.domain + " " + l.cat).toLowerCase().indexOf(q) !== -1;
      });

      if (linkCount) {
        linkCount.textContent = matches.length + " of " + links.length + " links" +
          (activeCat === "All" ? "" : " / " + activeCat);
      }

      if (!matches.length) {
        linksGrid.innerHTML =
          '<div class="empty-state" style="grid-column:1/-1">' +
            "<strong>No links match that.</strong>" +
            "<p>Try a shorter search, or pick another shelf.</p>" +
          "</div>";
        return;
      }

      if (activeCat === "All" && !q) {
        linksGrid.innerHTML = cats.slice(1).map(function (cat) {
          var group = matches.filter(function (l) { return l.cat === cat; });
          if (!group.length) return "";
          return (
            '<div class="link-group" style="grid-column:1/-1">' +
              '<h2 class="group-head"><span>' + esc(cat) + '</span><span class="group-count">' + group.length + "</span></h2>" +
              '<div class="links-grid">' + group.map(linkCard).join("") + "</div>" +
            "</div>"
          );
        }).join("");
      } else {
        linksGrid.innerHTML = matches.map(linkCard).join("");
      }
      watchReveals(linksGrid);
    }

    if (linkChips) {
      linkChips.innerHTML = cats.map(function (cat) {
        return '<button class="chip" type="button" data-cat="' + esc(cat) + '" aria-pressed="' +
          (cat === activeCat ? "true" : "false") + '">' + esc(cat) + "</button>";
      }).join("");

      linkChips.addEventListener("click", function (e) {
        var chip = e.target.closest(".chip");
        if (!chip) return;
        activeCat = chip.getAttribute("data-cat");
        $$(".chip", linkChips).forEach(function (c) {
          c.setAttribute("aria-pressed", String(c === chip));
        });
        renderLinks();
      });
    }

    if (linkSearch) {
      linkSearch.addEventListener("input", function (e) {
        linkQuery = e.target.value;
        renderLinks();
      });
    }

    renderLinks();
  }

  /* ---- Home: link preview ------------------------------------------------ */
  var previewHost = $("#link-preview");
  if (previewHost) {
    var picks = ["Marginalia Search", "Excalidraw", "Privacy Guides", "Squoosh", "Are.na", "Crontab Guru"];
    var byName = {};
    (SITE.links || []).forEach(function (l) { byName[l.name] = l; });
    previewHost.innerHTML = picks.map(function (name) {
      return byName[name] ? linkCard(byName[name]) : "";
    }).join("");
  }

  /* ---- "/" jumps to search ----------------------------------------------- */
  doc.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (e.key !== "/" || tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
    var search = $("[data-search]");
    if (!search) return;
    e.preventDefault();
    search.focus();
    search.select();
  });

  /* ---- Table of contents ------------------------------------------------- */
  var prose = $("#prose");
  var toc = $("#toc");
  if (prose && toc) {
    var headings = $$("h2, h3", prose);

    function slugify(text) {
      return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60);
    }

    var used = {};
    headings.forEach(function (h) {
      var id = h.id || slugify(h.textContent);
      if (used[id]) { used[id]++; id = id + "-" + used[id]; } else { used[id] = 1; }
      h.id = id;
    });

    toc.innerHTML = headings.map(function (h) {
      return '<a class="depth-' + h.tagName.charAt(1) + '" href="#' + h.id + '">' + esc(h.textContent) + "</a>";
    }).join("");

    if (headings.length && "IntersectionObserver" in window) {
      var tocLinks = $$("a", toc);
      var tocObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          tocLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      }, { rootMargin: "-90px 0px -68% 0px", threshold: 0 });

      headings.forEach(function (h) { tocObserver.observe(h); });
    }
  }

  /* ---- Reading progress -------------------------------------------------- */
  var progress = $(".read-progress");
  if (progress) {
    var updateProgress = function () {
      var height = doc.documentElement.scrollHeight - window.innerHeight;
      var pct = height > 0 ? (window.scrollY / height) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, pct)) + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  /* ---- Copy code --------------------------------------------------------- */
  $$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var block = btn.closest(".code-block");
      var code = block ? $("pre", block) : null;
      if (!code) return;
      var text = code.innerText.replace(/\n$/, "");
      var done = function () {
        btn.textContent = "Copied";
        btn.classList.add("done");
        setTimeout(function () {
          btn.textContent = "Copy";
          btn.classList.remove("done");
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var ta = doc.createElement("textarea");
        ta.value = text;
        doc.body.appendChild(ta);
        ta.select();
        try { doc.execCommand("copy"); done(); } catch (e) {}
        doc.body.removeChild(ta);
      }
    });
  });

  /* ---- Subscribe form (demo) --------------------------------------------- */
  $$("[data-subscribe]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = $('input[type="email"]', form);
      var note = $(".form-note", form);
      if (!input || !input.value || input.value.indexOf("@") === -1) {
        if (note) { note.textContent = "That email looks incomplete."; note.classList.remove("ok"); }
        if (input) input.focus();
        return;
      }
      if (note) {
        note.textContent = "You're in. Look for issue 25 on Friday.";
        note.classList.add("ok");
      }
      form.reset();
    });
  });

  /* ---- Footer year ------------------------------------------------------- */
  $$("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Kick off reveals -------------------------------------------------- */
  watchReveals();
})();
