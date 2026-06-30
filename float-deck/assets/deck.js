/* ==========================================================================
   deck.js — Generic, content-agnostic deck engine
   Self-initializes on DOMContentLoaded.

   HTML hooks:
     #deck                  — deck container; add data-lenis to opt-in Lenis
     .slide[data-label]     — each slide; data-label populates nav-dot aria-label
     #slide-nav             — nav dot container (populated by this script)
     .reveal                — children that animate in when their slide is active
     [data-typed]           — element whose own data-typed text is typed out
     .typewrite[data-text]  — element whose data-text is typed out
     .score-slider          — range inputs for diagnostic score
     #score-fill            — progress bar fill element
     #score-value           — score display element
     #fs-btn                — fullscreen toggle button
     #fs-expand / #fs-compress — icons swapped on fullscreen change
     #zoom-in / #zoom-out / #zoom-level — zoom controls

   Lenis opt-in (desktop-only):
     Add data-lenis to #deck. Engine checks:
       1. #deck has [data-lenis]
       2. matchMedia('(hover:hover) and (pointer:fine)').matches
       3. NOT matchMedia('(prefers-reduced-motion: reduce)').matches
       4. typeof window.Lenis !== 'undefined'
     When all pass: new Lenis() (window scroller), RAF loop, html.lenis-on.
     Snap: uses globalThis.Snap (lenis-snap CDN build) if available;
           otherwise falls back to manual scroll-end nearest-slide snap.
   ========================================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------------------------------
     Bootstrap on DOMContentLoaded
  ------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const deckEl = document.getElementById('deck');
    if (!deckEl) return; // nothing to do on pages without a deck

    const slides = Array.from(deckEl.querySelectorAll('.slide'));
    if (!slides.length) return;

    // Nav dots are built only from slides that carry a data-label attribute.
    // Slides without data-label are still observed/navigable but produce no dot.
    const labeledSlides = slides.filter(s => s.hasAttribute('data-label'));

    const navEl = document.getElementById('slide-nav');

    let currentIndex = 0;
    let snap = null;   // Lenis Snap instance (or null)
    let lenis = null;  // Lenis instance (or null)

    /* -----------------------------------------------------------------------
       Nav dots — built from .slide[data-label] only
    ----------------------------------------------------------------------- */
    if (navEl) {
      labeledSlides.forEach((slide) => {
        const i = slides.indexOf(slide);
        const btn = document.createElement('button');
        btn.className = 'nav-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', slide.dataset.label);
        btn.dataset.slideIndex = i;
        btn.addEventListener('click', () => goTo(i));
        navEl.appendChild(btn);
      });
    }

    /* -----------------------------------------------------------------------
       Navigation helpers
    ----------------------------------------------------------------------- */
    function goTo(index) {
      const el = slides[index];
      if (!el) return;
      if (snap) {
        snap.goTo(index);
      } else if (lenis) {
        lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function updateNav(index) {
      currentIndex = index;
      if (navEl) {
        navEl.querySelectorAll('.nav-dot').forEach(dot => {
          dot.classList.toggle('active', Number(dot.dataset.slideIndex) === index);
        });
      }
    }

    /* -----------------------------------------------------------------------
       Slide enter: reveal children, mark active (only one slide active at a time)
    ----------------------------------------------------------------------- */
    function onSlideEnter(slide) {
      // Remove .active from all other slides so only the current one is active
      slides.forEach(s => { if (s !== slide) s.classList.remove('active'); });
      slide.classList.add('active');
      slide.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));

      // Typewriter: [data-typed] — types its own data-typed attribute text
      slide.querySelectorAll('[data-typed]').forEach(el => {
        if (!el.dataset.done) startTyped(el);
      });

      // Typewriter: .typewrite[data-text]
      slide.querySelectorAll('.typewrite[data-text]').forEach(el => {
        if (!el.dataset.done) startTypewrite(el);
      });
    }

    /* -----------------------------------------------------------------------
       IntersectionObserver — root: null (window scroll), threshold 0.6
    ----------------------------------------------------------------------- */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio >= 0.6) {
          const index = slides.indexOf(entry.target);
          if (index === -1) return;
          updateNav(index);
          onSlideEnter(entry.target);
        }
      });
    }, { root: null, threshold: 0.6 });

    slides.forEach(slide => observer.observe(slide));

    // Trigger first slide immediately
    updateNav(0);
    onSlideEnter(slides[0]);

    /* -----------------------------------------------------------------------
       Keyboard navigation
       Guard: skip when focus is inside an interactive/editable control so
       Arrow/Page keys don't hijack range sliders, inputs, selects, etc.
    ----------------------------------------------------------------------- */
    document.addEventListener('keydown', e => {
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
      const isInteractive = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
        || tag === 'BUTTON' || (e.target && e.target.isContentEditable);
      if (isInteractive) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goTo(Math.min(currentIndex + 1, slides.length - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(Math.max(currentIndex - 1, 0));
      }
    });

    /* -----------------------------------------------------------------------
       Fullscreen toggle
    ----------------------------------------------------------------------- */
    const fsBtn = document.getElementById('fs-btn');
    const fsExpand = document.getElementById('fs-expand');
    const fsCompress = document.getElementById('fs-compress');

    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      });

      document.addEventListener('fullscreenchange', () => {
        const isFs = !!document.fullscreenElement;
        if (fsExpand) fsExpand.style.display = isFs ? 'none' : 'block';
        if (fsCompress) fsCompress.style.display = isFs ? 'block' : 'none';
        document.documentElement.classList.toggle('is-fullscreen', isFs);
        if (!isFs) {
          setTimeout(() => goTo(currentIndex), 100);
        }
      });
    }

    /* -----------------------------------------------------------------------
       Zoom controls
    ----------------------------------------------------------------------- */
    let zoomLevel = 100;
    const zoomDisplay = document.getElementById('zoom-level');

    function applyZoom() {
      document.documentElement.style.fontSize = zoomLevel + '%';
      if (zoomDisplay) zoomDisplay.textContent = zoomLevel + '%';
    }

    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');

    if (zoomIn) {
      zoomIn.addEventListener('click', () => {
        zoomLevel = Math.min(zoomLevel + 10, 150);
        applyZoom();
      });
    }
    if (zoomOut) {
      zoomOut.addEventListener('click', () => {
        zoomLevel = Math.max(zoomLevel - 10, 80);
        applyZoom();
      });
    }

    /* -----------------------------------------------------------------------
       Optional: diagnostic slider / score
       Auto-skips if .score-slider, #score-fill, or #score-value are absent.
    ----------------------------------------------------------------------- */
    (function initDiagnostic() {
      const sliders = deckEl.querySelectorAll('.score-slider');
      const fill = document.getElementById('score-fill');
      const value = document.getElementById('score-value');
      if (!sliders.length || !fill || !value) return;

      function updateScore() {
        let total = 0;
        sliders.forEach(s => { total += parseInt(s.value, 10); });
        const avg = Math.round(total / sliders.length);
        const readiness = 100 - avg;
        fill.style.width = readiness + '%';
        value.textContent = readiness;
      }

      sliders.forEach(s => s.addEventListener('input', updateScore));
      updateScore();
    })();

    /* -----------------------------------------------------------------------
       Optional: typewriter for [data-typed]
       Reads text from the element's own data-typed attribute. No hardcoded strings.
    ----------------------------------------------------------------------- */
    function startTyped(el) {
      const text = el.dataset.typed;
      if (!text) return;
      el.dataset.done = '1';
      el.textContent = '';
      let i = 0;
      const tick = () => {
        if (i <= text.length) {
          el.textContent = text.slice(0, i++);
          setTimeout(tick, 20);
        }
      };
      setTimeout(tick, 400);
    }

    /* -----------------------------------------------------------------------
       Optional: typewriter for .typewrite[data-text]
       Reads text from data-text attribute. No hardcoded strings.
    ----------------------------------------------------------------------- */
    function startTypewrite(el) {
      const text = el.dataset.text;
      if (!text) return;
      el.dataset.done = '1';
      el.textContent = '';
      let i = 0;
      const tick = () => {
        if (i <= text.length) {
          el.textContent = text.slice(0, i++);
          setTimeout(tick, 17);
        }
      };
      setTimeout(tick, 300);
    }

    /* -----------------------------------------------------------------------
       Lenis opt-in (desktop-only)
       Conditions (ALL must be true):
         1. #deck has [data-lenis]
         2. matchMedia('(hover:hover) and (pointer:fine)').matches
         3. NOT matchMedia('(prefers-reduced-motion: reduce)').matches
         4. typeof window.Lenis !== 'undefined'
    ----------------------------------------------------------------------- */
    (function initLenis() {
      if (!deckEl.hasAttribute('data-lenis')) return;
      if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (typeof window.Lenis === 'undefined') return;

      // Initialize Lenis with window as scroller (default — no wrapper/content)
      lenis = new window.Lenis();

      // RAF loop
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Signal to CSS: disable CSS scroll-snap, Lenis Snap takes over
      document.documentElement.classList.add('lenis-on');

      // ---- Snap setup ----
      // Prefer the CDN Snap build (globalThis.Snap exposed by lenis-snap.min.js).
      // Fall back to manual nearest-slide snap if Snap constructor is unavailable.
      const SnapCtor = (typeof globalThis !== 'undefined' && globalThis.Snap)
        || (typeof window !== 'undefined' && window.Snap)
        || null;

      if (SnapCtor) {
        // --- Module path: Lenis Snap ---
        // type:'mandatory' snaps to the nearest slide on any scroll gesture,
        // matching the slide-by-slide locking behaviour required by the brief.
        snap = new SnapCtor(lenis, {
          type: 'mandatory',
          duration: 0.8,
        });
        snap.addElements(slides, { align: 'start' });
      } else {
        // --- Manual fallback: debounced scroll-end nearest-slide snap ---
        let scrollEndTimer = null;

        function nearestSlide() {
          let best = slides[0];
          let bestDist = Infinity;
          slides.forEach(slide => {
            const dist = Math.abs(slide.getBoundingClientRect().top);
            if (dist < bestDist) {
              bestDist = dist;
              best = slide;
            }
          });
          return best;
        }

        window.addEventListener('scroll', () => {
          clearTimeout(scrollEndTimer);
          scrollEndTimer = setTimeout(() => {
            const el = nearestSlide();
            lenis.scrollTo(el, { duration: 0.8 });
          }, 120);
        }, { passive: true });
      }
    })();
  }

})();
