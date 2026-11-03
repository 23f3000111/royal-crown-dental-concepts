/* Before and after slider: drag, click, or use the arrow keys on the handle.
   RC.compare.html(caseId, opts) builds one; RC.compare.mount(root) wires every [data-ba] inside root. */
(function () {
  var RC = window.RC, esc = RC.esc;

  function html(id, opts) {
    var c = RC.case(id);
    opts = opts || {};
    if (!c) return '';
    return '<div class="ba ' + (opts.className || '') + '" data-ba="' + c.id + '" style="--ar:' + c.w + '/' + c.h + '">' +
      '<img class="ba__img" src="' + RC.img(c.after) + '" alt="After: ' + esc(c.title.toLowerCase()) + '" width="' + c.w + '" height="' + c.h + '" draggable="false"' + (opts.eager ? '' : ' loading="lazy"') + '>' +
      '<div class="ba__before"><img class="ba__img" src="' + RC.img(c.before) + '" alt="Before" width="' + c.w + '" height="' + c.h + '" draggable="false"' + (opts.eager ? '' : ' loading="lazy"') + '></div>' +
      '<span class="ba__tag ba__tag--before">Before</span><span class="ba__tag ba__tag--after">After</span>' +
      '<div class="ba__line"><button class="ba__handle" type="button" role="slider" aria-label="Compare before and after: ' + esc(c.title) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="Half before, half after">' +
      RC.icon('drag') + '</button></div></div>';
  }

  function wire(el) {
    if (el._ba) return el._ba;
    var handle = el.querySelector('.ba__handle'), drag = false, raf = 0, pos = 50;
    function set(p, user) {
      pos = Math.max(0, Math.min(100, p));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { el.style.setProperty('--pos', pos + '%'); });
      handle.setAttribute('aria-valuenow', Math.round(pos));
      handle.setAttribute('aria-valuetext', pos < 8 ? 'All after' : pos > 92 ? 'All before' : Math.round(pos) + ' percent before');
      if (user) { el.classList.add('is-touched'); if (el._peek) { el._peek.kill(); el._peek = null; } }
    }
    function fromEvent(e) { var r = el.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; }
    el.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      drag = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add('is-dragging');
      set(fromEvent(e), true);
      e.preventDefault();
    });
    el.addEventListener('pointermove', function (e) { if (drag) set(fromEvent(e), true); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) {
      el.addEventListener(t, function () { drag = false; el.classList.remove('is-dragging'); });
    });
    handle.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 20 : 5, k = e.key;
      if (k === 'ArrowLeft' || k === 'ArrowDown') set(pos - step, true);
      else if (k === 'ArrowRight' || k === 'ArrowUp') set(pos + step, true);
      else if (k === 'Home') set(0, true);
      else if (k === 'End') set(100, true);
      else return;
      e.preventDefault();
    });
    set(50);
    el._ba = { set: set, get: function () { return pos; } };
    return el._ba;
  }

  /* A little sweep that shows people the slider moves, once it is on screen */
  function peek(el) {
    var g = window.gsap;
    if (!g || RC.reducedMotion() || el.classList.contains('is-touched')) return;
    var api = wire(el), o = { p: 50 };
    el._peek = g.timeline({ delay: 0.3 })
      .to(o, { p: 18, duration: 0.9, ease: 'power2.inOut', onUpdate: function () { api.set(o.p); } })
      .to(o, { p: 80, duration: 1.2, ease: 'power2.inOut', onUpdate: function () { api.set(o.p); } })
      .to(o, { p: 50, duration: 0.8, ease: 'power2.inOut', onUpdate: function () { api.set(o.p); } });
  }

  function mount(root) {
    var els = RC.$$('[data-ba]', root || document);
    els.forEach(wire);
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); peek(en.target); } });
    }, { threshold: 0.55 });
    els.forEach(function (el) { if (!el.hasAttribute('data-no-peek')) io.observe(el); });
  }

  RC.compare = { html: html, mount: mount, wire: wire, peek: peek };
})();
