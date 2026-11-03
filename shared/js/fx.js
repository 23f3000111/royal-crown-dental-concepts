/* Motion layer shared by both concepts (GSAP, ScrollTrigger and SplitText, vendored).
   Markup asks for motion with data attributes; reduced motion or a missing library leaves everything still and visible.
   data-reveal="up|lines|chars|words|clip|scale|stagger|fade|pop"   data-delay="0.2"
   data-parallax="-0.15" (share of own height)   data-marquee (data-speed, data-dir="right")   data-count="4.4" (data-decimals)
   data-magnetic   data-spin="20"   data-scrub-words (words light up as you scroll)   data-float (gentle bob) */
(function () {
  var RC = window.RC;
  var html = document.documentElement;
  RC.fx = { on: false };

  RC.fx.init = function () {
    var g = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
    if (!g || !ST || RC.reducedMotion()) { html.classList.remove('js'); html.classList.add('fx-off'); return; }
    g.registerPlugin(ST);
    if (Split) g.registerPlugin(Split);
    RC.fx.on = true;
    var ease = 'expo.out';

    /* Reveals give explicit end values (fromTo): a ScrollTrigger refresh re-reads "current" values,
       and on cards with a CSS transform transition that read lands mid-transition and the card stays shifted */
    RC.$$('[data-reveal]').forEach(function (el) {
      if (el.closest('[data-reveal-manual]')) return;
      var type = el.getAttribute('data-reveal') || 'up';
      var delay = +(el.getAttribute('data-delay') || 0);
      var st = { trigger: el, start: el.getAttribute('data-start') || (el.getBoundingClientRect().top + scrollY < innerHeight ? 'top bottom' : 'top 88%'), once: true };
      g.set(el, { visibility: 'visible' });
      if ((type === 'lines' || type === 'chars' || type === 'words') && Split) {
        var s = new Split(el, { type: type === 'chars' ? 'lines,chars' : type === 'words' ? 'lines,words' : 'lines', mask: 'lines', linesClass: 'fx-line' });
        var parts = type === 'chars' ? s.chars : type === 'words' ? s.words : s.lines;
        g.from(parts, { yPercent: 115, duration: type === 'chars' ? 1.1 : 1.15, ease: ease, stagger: type === 'chars' ? 0.026 : type === 'words' ? 0.05 : 0.09, delay: delay, scrollTrigger: st });
      } else if (type === 'clip') {
        var img = el.querySelector('img, video');
        g.fromTo(el, { clipPath: 'inset(16% 12% 16% 12% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.4, ease: 'expo.inOut', delay: delay, scrollTrigger: st, clearProps: 'clipPath' });
        if (img) g.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: 'expo.out', delay: delay, scrollTrigger: st });
      } else if (type === 'scale') {
        g.fromTo(el, { scale: 0.86, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.1, ease: 'back.out(1.6)', delay: delay, scrollTrigger: st, clearProps: 'transform' });
      } else if (type === 'pop') {
        g.fromTo(el, { scale: 0.3, rotation: -12, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.9, ease: 'back.out(2.2)', delay: delay, scrollTrigger: st });
      } else if (type === 'stagger') {
        g.fromTo(el.children, { y: 46, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: ease, stagger: 0.08, delay: delay, scrollTrigger: st, clearProps: 'transform' });
      } else if (type === 'fade') {
        g.from(el, { autoAlpha: 0, duration: 1.2, ease: 'power2.out', delay: delay, scrollTrigger: st });
      } else {
        g.fromTo(el, { y: 56, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.15, ease: ease, delay: delay, scrollTrigger: st, clearProps: 'transform' });
      }
    });

    RC.$$('[data-parallax]').forEach(function (el) {
      var amt = +el.getAttribute('data-parallax');
      g.fromTo(el, { yPercent: -amt * 50 }, { yPercent: amt * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    RC.$$('[data-spin]').forEach(function (el) {
      g.to(el, { rotation: 360, duration: +el.getAttribute('data-spin') || 20, ease: 'none', repeat: -1 });
    });

    RC.$$('[data-float]').forEach(function (el, i) {
      var amp = +(el.getAttribute('data-float') || 10);
      g.to(el, { y: -amp, rotation: (i % 2 ? 2 : -2), duration: 2.2 + (i % 4) * 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: (i % 5) * 0.3 });
    });

    RC.$$('[data-count]').forEach(function (el) {
      var to = +el.getAttribute('data-count'), from = +(el.getAttribute('data-from') || 0), dec = +(el.getAttribute('data-decimals') || 0), o = { v: from };
      el.textContent = from.toFixed(dec);
      g.to(o, { v: to, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        onUpdate: function () { el.textContent = dec ? o.v.toFixed(dec) : Math.round(o.v).toLocaleString('en-GB'); } });
    });

    /* Statement paragraphs: each word brightens as it scrolls through the middle of the screen */
    RC.$$('[data-scrub-words]').forEach(function (el) {
      if (!Split) return;
      var s = new Split(el, { type: 'words', wordsClass: 'fx-word' });
      g.fromTo(s.words, { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 42%', scrub: 0.6 } });
    });

    /* Marquees: repeat the set until the loop always covers the screen (a set can be narrower than a laptop),
       slide by exactly one set, and let scroll speed push it along. Each track's end padding equals its gap. */
    var marquees = RC.$$('[data-marquee]').map(function (el) {
      var track = el.firstElementChild, set = track.innerHTML, ids = RC.$$('[id]', track).length;
      var copies = 1 + Math.max(1, Math.ceil(el.clientWidth / Math.max(track.scrollWidth, 1)));
      for (var i = 1; i < copies; i++) track.innerHTML += set;
      RC.$$('[id]', track).forEach(function (n, k) { if (k >= ids) n.removeAttribute('id'); });
      var right = el.getAttribute('data-dir') === 'right', step = 100 / copies;
      return g.fromTo(track, { xPercent: right ? -step : 0 }, { xPercent: right ? 0 : -step, duration: +(el.getAttribute('data-speed') || 30), ease: 'none', repeat: -1 });
    });
    if (marquees.length) {
      ST.create({ onUpdate: function (self) {
        var v = Math.min(Math.abs(self.getVelocity()) / 400, 5);
        marquees.forEach(function (tw) { g.to(tw, { timeScale: 1 + v, duration: 0.2, overwrite: true }); g.to(tw, { timeScale: 1, duration: 1.2, delay: 0.25 }); });
      } });
    }

    if (!matchMedia('(hover: none)').matches) {
      RC.$$('[data-magnetic]').forEach(function (el) {
        var x = g.quickTo(el, 'x', { duration: 0.5, ease: 'power3' }), y = g.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          x((e.clientX - r.left - r.width / 2) * 0.3);
          y((e.clientY - r.top - r.height / 2) * 0.35);
        });
        el.addEventListener('pointerleave', function () { x(0); y(0); });
      });
    }

    html.classList.add('fx-ready');
    addEventListener('load', function () { ST.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
  };
})();
