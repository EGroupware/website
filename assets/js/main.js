/* EGroupware static site – progressive enhancement only.
   Everything below is optional: the site works fully without JS. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---- Theme toggle (light / dark / system) ---- */
  var root = document.documentElement;

  function store(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }
  function unstore(key) {
    try { window.localStorage.removeItem(key); } catch (e) { /* ignore */ }
  }

  /* Ohne eigene Wahl folgt die Seite dem Betriebssystem (CSS prefers-color-scheme,
     auch live beim Umschalten). Die letzte Aktion gewinnt: Eine Wahl per Knopf gilt,
     bis das Betriebssystem umgestellt wird. Dafuer merken wir uns das Systemschema
     zum Zeitpunkt des Klicks ("egw-theme-sys"); das Skript im <head> verwirft die
     Wahl, sobald das System nicht mehr dazu passt. */
  var schemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  function systemScheme() { return schemeQuery.matches ? "dark" : "light"; }
  function followSystem() {
    root.removeAttribute("data-theme");
    unstore("egw-theme");
    unstore("egw-theme-sys");
  }

  var themeButtons = document.querySelectorAll(".theme-toggle, .theme-toggle-inline");
  themeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var system = systemScheme();
      var current = root.getAttribute("data-theme") || system;
      var next = current === "dark" ? "light" : "dark";
      if (next === system) {
        followSystem();
      } else {
        root.setAttribute("data-theme", next);
        store("egw-theme", next);
        store("egw-theme-sys", system);
      }
    });
  });

  /* Systemumstellung bei geoeffneter Seite: eigene Wahl verwerfen */
  if (schemeQuery.addEventListener) {
    schemeQuery.addEventListener("change", followSystem);
  } else if (schemeQuery.addListener) {
    schemeQuery.addListener(followSystem);
  }

  /* ---- Text kopieren (Presseseite: Kurzbeschreibung) ----
     <button data-copy="ID" data-copied="Kopiert"> kopiert den Text des Elements ID. */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-copy"));
      if (!target || !navigator.clipboard) { return; }
      var label = btn.textContent;
      navigator.clipboard.writeText(target.innerText.trim()).then(function () {
        btn.textContent = btn.getAttribute("data-copied") || label;
        setTimeout(function () { btn.textContent = label; }, 2000);
      });
    });
  });

  /* ---- Mobile navigation ---- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("primary-nav");
  if (navToggle && navLinks) {
    var setMenu = function (open) {
      navLinks.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      // stop the page behind the menu from scrolling on touch devices
      document.body.classList.toggle("nav-open", open);
    };

    navToggle.addEventListener("click", function () {
      setMenu(!navLinks.classList.contains("is-open"));
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) { setMenu(false); }
    });
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
        setMenu(false);
        navToggle.focus();
      }
    });
    // a rotated phone can widen past the mobile breakpoint while the menu is open
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960 && navLinks.classList.contains("is-open")) {
        setMenu(false);
      }
    });
  }

  /* ---- Untermenues ---- */
  /* Ohne JS oeffnet CSS sie beim Darueberfahren. Hier kommt der Klick dazu,
     damit sie auch auf Touch-Geraeten und im mobilen Menue funktionieren. */
  var subItems = document.querySelectorAll(".nav-has-sub");
  subItems.forEach(function (item) {
    var toggle = item.querySelector(".nav-sub__toggle");
    if (!toggle) { return; }
    var setOpen = function (open) {
      item.setAttribute("data-open", open ? "true" : "false");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      var open = item.getAttribute("data-open") === "true";
      subItems.forEach(function (other) {
        if (other !== item) {
          other.setAttribute("data-open", "false");
          var t = other.querySelector(".nav-sub__toggle");
          if (t) { t.setAttribute("aria-expanded", "false"); }
        }
      });
      setOpen(!open);
    });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && item.getAttribute("data-open") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest(".nav-has-sub")) { return; }
    subItems.forEach(function (item) {
      item.setAttribute("data-open", "false");
      var t = item.querySelector(".nav-sub__toggle");
      if (t) { t.setAttribute("aria-expanded", "false"); }
    });
  });

  /* ---- Sticky header shadow ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Reveal on scroll ---- */
  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    if (!("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---- Remember language choice for the root redirect ---- */
  var langLinks = document.querySelectorAll("[data-set-lang]");
  langLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      store("egw-lang", link.getAttribute("data-set-lang"));
    });
  });

  /* ---- Modulfilter auf der Funktionsseite ---- */
  var filterBar = document.querySelector("[data-module-filter]");
  var grid = document.querySelector("[data-module-grid]");
  if (filterBar && grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-group]"));
    var chips = Array.prototype.slice.call(filterBar.querySelectorAll(".chip"));
    var search = filterBar.querySelector("input[type=search]");
    var desc = document.querySelector("[data-filter-desc]");
    var empty = document.querySelector("[data-module-empty]");
    var status = document.querySelector("[data-filter-status]");
    var reset = document.querySelector("[data-filter-reset]");
    var active = "all";

    var apply = function () {
      var term = (search.value || "").trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        // data-group kann mehrere Kategorien enthalten (erste = Hauptkategorie auf der Karte)
        var byGroup = active === "all" || (" " + card.getAttribute("data-group") + " ").indexOf(" " + active + " ") !== -1;
        var byTerm = !term || card.getAttribute("data-search").indexOf(term) !== -1;
        var visible = byGroup && byTerm;
        card.hidden = !visible;
        if (visible) { shown++; }
      });
      if (empty) { empty.hidden = shown !== 0; }
      if (status) {
        status.textContent = shown === 1
          ? status.getAttribute("data-one")
          : (status.getAttribute("data-many") || "").replace("{n}", String(shown));
      }
    };

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        active = chip.getAttribute("data-filter");
        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle("is-active", on);
          c.setAttribute("aria-pressed", on ? "true" : "false");
        });
        if (desc) { desc.textContent = chip.getAttribute("data-desc") || ""; }
        apply();
      });
    });

    if (search) {
      search.addEventListener("input", apply);
      search.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { search.value = ""; apply(); }
      });
    }

    if (reset) {
      reset.addEventListener("click", function () {
        if (search) { search.value = ""; }
        chips[0].click();
        if (search) { search.focus(); }
      });
    }

    filterBar.hidden = false;
    apply();

    /* Suchfeld so breit wie die ersten zwei Kategorie-Knoepfe der naechsten Zeile,
       damit Suche und Knoepfe ein gemeinsames Raster bilden. Mindestbreite fuer die
       Texteingabe; auf schmalen Schirmen (Suche allein in der Zeile) bleibt sie volle Breite. */
    var searchBox = filterBar.querySelector(".module-filter__search");
    var fitSearch = function () {
      if (!searchBox || !filterBar.querySelector(":scope > .chip")) { return; }
      searchBox.style.flex = ""; searchBox.style.maxWidth = "";
      if (filterBar.clientWidth < 700) { return; }
      for (var i = 0; i < 3; i++) {
        var top = searchBox.offsetTop;
        var below = chips.filter(function (c) { return c.offsetTop > top + 4; });
        if (below.length < 2) { return; }
        var row = below.filter(function (c) { return c.offsetTop === below[0].offsetTop; });
        if (row.length < 2) { return; }
        var w = row[1].offsetLeft + row[1].offsetWidth - row[0].offsetLeft;
        if (w < 300) { w = 300; }
        if (Math.abs(w - searchBox.offsetWidth) < 2) { return; }
        searchBox.style.flex = "0 0 " + w + "px"; searchBox.style.maxWidth = "none";
      }
    };
    fitSearch();
    window.addEventListener("resize", fitSearch);
  }

  /* ---- Rückmeldung nach dem Absenden (?status=ok|error) ---- */
  var params = new URLSearchParams(window.location.search);
  document.querySelectorAll(".form-status").forEach(function (box) {
    var value = params.get(box.getAttribute("data-status-for"));
    if (value !== "ok" && value !== "error") { return; }
    box.textContent = box.getAttribute(value === "ok" ? "data-ok" : "data-error") || "";
    box.classList.add(value === "ok" ? "form-status--ok" : "form-status--error");
    box.hidden = false;
    box.setAttribute("role", "status");
  });

  /* ---- Videos: erst auf Klick laden (Zwei-Klick-Loesung) ---- */
  document.querySelectorAll(".video__cover").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var frame = document.createElement("iframe");
      frame.src = btn.getAttribute("data-video");
      frame.title = btn.getAttribute("data-title") || "Video";
      frame.loading = "lazy";
      frame.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.setAttribute("allowfullscreen", "");
      frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      frame.className = "video__frame";
      btn.replaceWith(frame);
    });
  });

  /* ---- Tarifberater (Preisseite) ----
     Drei Fragen, eine Empfehlung. Regeln und Tariftexte kommen als JSON aus
     dem Generator, damit sie an einer Stelle gepflegt werden. Ohne
     JavaScript ist der Abschnitt per CSS ausgeblendet – die Tarifuebersicht
     darunter beantwortet die Frage dann eben von Hand. */
  var finder = document.querySelector("[data-finder]");
  if (finder) {
    var lies = function (sel) {
      var el = document.querySelector(sel);
      try { return el ? JSON.parse(el.textContent) : null; } catch (e) { return null; }
    };
    var regeln = lies("[data-finder-regeln]") || [];
    var tarife = lies("[data-finder-tarife]") || {};
    var antwort = {};
    var warte = finder.querySelector("[data-finder-warte]");
    var trefferFeld = finder.querySelector("[data-finder-treffer]");

    var passt = function (regel, feld) {
      return regel[feld] === "*" || regel[feld] === antwort[feld];
    };

    var zeigen = function () {
      if (!antwort.betrieb || !antwort.art || !antwort.groesse) { return; }
      var treffer = null;
      for (var i = 0; i < regeln.length; i++) {
        if (passt(regeln[i], "betrieb") && passt(regeln[i], "art")
            && passt(regeln[i], "groesse")) { treffer = regeln[i]; break; }
      }
      var t = treffer && tarife[treffer.plan];
      if (!t) { return; }
      finder.querySelector("[data-finder-name]").textContent = t.name;
      finder.querySelector("[data-finder-preis]").textContent = t.preis;
      finder.querySelector("[data-finder-text]").textContent = t.text;
      // Knoepfe passend zum Tarif: Bestellen im Shop, Angebot oder Testen.
      // Ohne Angabe bleiben die Standardknoepfe aus dem HTML stehen.
      var knoepfe = finder.querySelector("[data-finder-knoepfe]");
      if (knoepfe && t.knoepfe && t.knoepfe.length) {
        knoepfe.textContent = "";
        t.knoepfe.forEach(function (k) {
          var a = document.createElement("a");
          a.className = "btn btn--" + (k.stil === "primary" ? "primary" : "ghost");
          a.href = k.href;
          a.textContent = k.text;
          if (/^https?:/.test(k.href)) { a.rel = "noopener"; }
          knoepfe.appendChild(a);
        });
      }
      // Platzhalter raus, Empfehlung rein. Das Feld selbst stand schon da,
      // deshalb springt an dieser Stelle nichts.
      if (warte) { warte.hidden = true; }
      if (trefferFeld) { trefferFeld.hidden = false; }
    };

    finder.querySelectorAll(".finder__opt").forEach(function (btn) {
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function () {
        var frage = btn.getAttribute("data-frage");
        antwort[frage] = btn.getAttribute("data-wert");
        finder.querySelectorAll('[data-frage="' + frage + '"]').forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        // Ziffer der Frage als beantwortet markieren.
        var feld = btn.closest(".finder__frage");
        if (feld) { feld.setAttribute("data-fertig", "1"); }
        zeigen();
      });
    });

    /* Schritt fuer Schritt: immer nur eine Frage sichtbar, nach der Antwort
       geht es zur naechsten, am Ende kommt die Empfehlung. Ohne JavaScript
       gibt es den Berater ohnehin nicht (siehe oben). */
    var fragen = [].slice.call(finder.querySelectorAll(".finder__frage"));
    var ergebnis = finder.querySelector(".finder__ergebnis");
    var fragenFeld = finder.querySelector(".finder");
    if (fragen.length && ergebnis && fragenFeld) {
      var de = (document.documentElement.lang || "").indexOf("de") === 0;
      var T = de
        ? { schritt: "Schritt", von: "von", zurueck: "Zurück", neu: "Neu starten", fertig: "Fertig" }
        : { schritt: "Step", von: "of", zurueck: "Back", neu: "Start over", fertig: "Done" };
      finder.classList.add("finder-karte--wizard");

      var fort = document.createElement("div");
      fort.className = "finder__fort";
      var schrittText = document.createElement("p");
      schrittText.className = "finder__schritt";
      schrittText.setAttribute("aria-live", "polite");
      var balken = document.createElement("ol");
      balken.className = "finder__balken";
      balken.setAttribute("aria-hidden", "true");
      fragen.forEach(function () { balken.appendChild(document.createElement("li")); });
      fort.appendChild(schrittText);
      fort.appendChild(balken);
      fragenFeld.parentNode.insertBefore(fort, fragenFeld);

      var nav = document.createElement("div");
      nav.className = "finder__nav";
      var zurueck = document.createElement("button");
      zurueck.type = "button";
      zurueck.className = "finder__zurueck";
      zurueck.textContent = "← " + T.zurueck;
      var neu = document.createElement("button");
      neu.type = "button";
      neu.className = "finder__zurueck";
      neu.textContent = T.neu;
      nav.appendChild(zurueck);
      nav.appendChild(neu);
      ergebnis.parentNode.insertBefore(nav, ergebnis.nextSibling);
      ergebnis.setAttribute("tabindex", "-1");
      fragen.forEach(function (f) { f.setAttribute("tabindex", "-1"); });

      var schritt = 0;
      var gehe = function (n, fokus) {
        schritt = n;
        var fertig = n >= fragen.length;
        fragen.forEach(function (f, i) { f.hidden = i !== n; });
        ergebnis.hidden = !fertig;
        [].forEach.call(balken.children, function (li, i) {
          li.className = i < n ? "is-fertig" : (i === n ? "is-aktiv" : "");
        });
        schrittText.textContent = fertig ? T.fertig
          : T.schritt + " " + (n + 1) + " " + T.von + " " + fragen.length;
        zurueck.hidden = n === 0;
        neu.hidden = !fertig;
        if (fokus) {
          // Fokus auf die ganze Frage, nicht auf eine Antwort – sonst sieht
          // die erste Antwort aus, als waere sie schon gewaehlt.
          var ziel = fertig ? ergebnis : fragen[n];
          ziel.focus({ preventScroll: true });
        }
      };

      fragen.forEach(function (f, i) {
        f.querySelectorAll(".finder__opt").forEach(function (btn) {
          btn.addEventListener("click", function () {
            // Kurz stehen lassen, damit die Auswahl sichtbar ist.
            setTimeout(function () { gehe(i + 1, true); }, 250);
          });
        });
      });
      zurueck.addEventListener("click", function () { gehe(Math.max(0, schritt - 1), true); });
      neu.addEventListener("click", function () { gehe(0, true); });
      gehe(0, false);
    }
  }

  /* ---- Footer year ---- */
  var year = document.querySelector("[data-year]");
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();


/* Rocket.Chat-Livechat: erst auf Klick laden.
   Das Widget setzt beim Laden Cookies (rc_is_widget, rc_room_type) und eine
   Besucherkennung im lokalen Speicher von pole.egroupware.org. Deshalb zeigen
   wir zuerst nur einen eigenen Knopf im Aussehen des Rocket.Chat-Knopfs; erst
   der Klick laedt das offizielle Embed-Skript (unveraendert, Version kommt
   vom Rocket.Chat-Server) und oeffnet das Chatfenster direkt. */
(function (w, d) {
  var u = 'https://pole.egroupware.org/livechat';
  var en = (d.documentElement.lang || '').slice(0, 2) === 'en';
  var btn = d.createElement('button');
  btn.type = 'button';
  btn.className = 'livechat-start';
  btn.setAttribute('aria-label', en ? 'Open live chat' : 'Live-Chat öffnen');
  btn.title = en ? 'Live chat – loads the chat from pole.egroupware.org'
                 : 'Live-Chat – lädt den Chat von pole.egroupware.org';
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="currentColor">' +
    '<path d="M21.63 11.09c0-3.26-4-5.9-8.94-5.9-4.94 0-8.94 2.64-8.94 5.9 0 1.42.76 2.73 2.03 3.75.22 2.12-.8 3.41-1.49 4.18 2.11.55 4.29-1.16 5.28-2.39.97.24 2.03.37 3.13.37 4.94 0 8.94-2.64 8.94-5.91zM3.8 20.99.58 20.15l2.27-2.52c.58-.64.9-1.18.97-1.85-1.29-1.31-2.04-2.93-2.04-4.68 0-4.63 5.02-7.94 10.9-7.94 5.89 0 10.9 3.31 10.9 7.94 0 4.63-5.01 7.94-10.9 7.94-.83 0-1.65-.07-2.45-.2-1.76 1.71-4.13 2.75-6.43 2.15z"/>' +
    '<circle cx="8.91" cy="11.03" r="1.3"/><circle cx="12.8" cy="11.03" r="1.3"/><circle cx="16.7" cy="11.03" r="1.3"/></g></svg>';
  btn.addEventListener('click', function () {
    if (btn.getAttribute('aria-busy')) { return; }
    btn.setAttribute('aria-busy', 'true');
    /* Offizielles Rocket.Chat-Embed-Snippet */
    (function (w, d, s, u) {
      w.RocketChat = function (c) { w.RocketChat._.push(c); }; w.RocketChat._ = []; w.RocketChat.url = u;
      var h = d.getElementsByTagName(s)[0], j = d.createElement(s);
      j.async = true; j.src = 'https://pole.egroupware.org/livechat/rocketchat-livechat.min.js?_=201912110000';
      h.parentNode.insertBefore(j, h);
    })(w, d, 'script', u);
    w.RocketChat(function () {
      if (this.maximizeWidget) { this.maximizeWidget(); }
      setTimeout(function () { btn.remove(); }, 800);
    });
    /* Falls der Chat-Server nicht antwortet: Knopf wieder freigeben. */
    setTimeout(function () {
      if (!d.querySelector('.rocketchat-widget')) { btn.removeAttribute('aria-busy'); }
    }, 10000);
  });
  d.body.appendChild(btn);
})(window, document);
