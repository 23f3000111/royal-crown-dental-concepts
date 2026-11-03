/* Shared UI helpers for both Royal Crown concepts: icons, smooth scroll, dialogs, toast,
   WhatsApp links, form checks, socials and the live open/closed state in Mombasa time. */
(function () {
  var RC = window.RC = window.RC || {};
  var reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');

  RC.reducedMotion = function () { return reduceQuery.matches; };
  RC.$ = function (sel, root) { return (root || document).querySelector(sel); };
  RC.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  RC.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  RC.base = (document.currentScript && document.currentScript.src.replace(/js\/ui\.js.*$/, '')) || '../shared/';
  RC.img = function (rel) { return RC.base + 'img/' + rel; };
  RC.media = function (rel) { return RC.base + rel; };

  /* Line icons: paths after Lucide (ISC licence) plus our own tooth set; WhatsApp, Instagram,
     Facebook and Google are the brands' marks */
  var TOOTH = 'M12 5.2C10.3 3.9 8.6 3.3 7 3.3 4.6 3.3 3 5.2 3 7.7c0 1.9.7 3.5 1.3 5.2.7 2.1 1 4.4 1.6 6.6.3 1.2 1 2 1.9 2 1.1 0 1.5-1.2 1.8-2.7l.6-2.9c.2-.9.9-1.5 1.8-1.5s1.6.6 1.8 1.5l.6 2.9c.3 1.5.7 2.7 1.8 2.7.9 0 1.6-.8 1.9-2 .6-2.2.9-4.5 1.6-6.6.6-1.7 1.3-3.3 1.3-5.2 0-2.5-1.6-4.4-4-4.4-1.6 0-3.3.6-5 1.9z';
  var P = {
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    left: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    right: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    up: '<path d="M7 17 17 7M8 7h9v9"/>',
    down: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-9 5.7a2 2 0 0 1-2 0L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    nav: '<path d="M3 11 22 2l-9 19-2-8z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    calcheck: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    play: '<path d="M7 4.5v15a1 1 0 0 0 1.5.9l12.2-7.5a1 1 0 0 0 0-1.8L8.5 3.6A1 1 0 0 0 7 4.5Z" fill="currentColor" stroke="none"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checks: '<path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    alert: '<path d="m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"/><path d="M12 9v4M12 17h.01"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    starFill: '<path fill="currentColor" stroke="none" d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    sparkle: '<path d="M9.9 15.5a2 2 0 0 0-1.4-1.4l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0z"/>',
    sparkles: '<path d="M9.9 15.5a2 2 0 0 0-1.4-1.4l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0z"/><path d="M20 3v4M22 5h-4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/>',
    kid: '<path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
    tooth: '<path d="' + TOOTH + '"/>',
    sparkletooth: '<g transform="translate(-1.2 1.6) scale(.86)"><path d="' + TOOTH + '"/></g><path d="M19.5 1.5v4M17.5 3.5h4"/>',
    filling: '<path d="' + TOOTH + '"/><path d="M9.5 8.6c.8.9 1.6 1.3 2.5 1.3s1.7-.4 2.5-1.3" stroke-width="2.4"/>',
    root: '<path d="' + TOOTH + '"/><path d="M9.6 10.2c.1 2.2.3 4.3.7 6.4M14.4 10.2c-.1 2.2-.3 4.3-.7 6.4"/>',
    extract: '<g transform="translate(2.4 4.4) scale(.8)"><path d="' + TOOTH + '"/></g><path d="M12 1.2v3.6M10.2 3 12 1.2 13.8 3"/>',
    implant: '<path d="M6.6 2.8h10.8a1.6 1.6 0 0 1 1.6 1.8l-.3 2.3a3.4 3.4 0 0 1-3.4 3H8.7a3.4 3.4 0 0 1-3.4-3l-.3-2.3a1.6 1.6 0 0 1 1.6-1.8z"/><path d="M8.6 9.9v7.4l3.4 4 3.4-4V9.9M7.2 12.7h9.6M7.6 15.5h8.8"/>',
    crown: '<path d="M11.6 3.3a.5.5 0 0 1 .8 0l3 5.6a1 1 0 0 0 1.5.3l4.3-3.7a.5.5 0 0 1 .8.5l-2.8 10.3a1 1 0 0 1-1 .7H5.8a1 1 0 0 1-1-.7L2 6a.5.5 0 0 1 .8-.5l4.3 3.7a1 1 0 0 0 1.5-.3z"/><path d="M5 21h14"/>',
    denture: '<path d="M3.5 8.5c0 6.4 3.8 11 8.5 11s8.5-4.6 8.5-11"/><path d="M3.5 8.5C6 9.6 8.5 10 12 10s6-.4 8.5-1.5"/><path d="M7.4 9.7v3.2M12 10v3.8M16.6 9.7v3.2"/>',
    brush: '<path d="M3 21 13.5 10.5"/><path d="m12.5 11.5 6-6a2.1 2.1 0 0 1 3 3l-6 6z"/><path d="m16 6 2 2M14.5 7.5l2 2M17.5 4.5l2 2"/>',
    drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    timer: '<path d="M10 2h4M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
    edit: '<path d="M21.17 6.81a1 1 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>',
    print: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    repeat: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    drag: '<path d="m18 8 4 4-4 4M6 8l-4 4 4 4M2 12h20"/>',
    quote: '<path fill="currentColor" stroke="none" d="M4.6 19.5c-1.2-1.3-1.9-2.8-1.9-5.1 0-4.1 2.9-7.7 7-9.5l1 1.6C6.9 8.6 6.1 11 5.8 12.5c.7-.4 1.7-.5 2.6-.4 2.4.2 4.3 2.2 4.3 4.7a4.8 4.8 0 0 1-8.1 2.7Zm11 0c-1.2-1.3-1.9-2.8-1.9-5.1 0-4.1 2.9-7.7 7-9.5l1 1.6c-3.8 2.1-4.6 4.5-4.9 6 .7-.4 1.7-.5 2.6-.4 2.4.2 4.3 2.2 4.3 4.7a4.8 4.8 0 0 1-8.1 2.7Z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8a4 4 0 0 1 3.4 3.4z"/><path d="M17.5 6.5h.01"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    google: '<path fill="currentColor" stroke="none" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z"/><path fill="currentColor" stroke="none" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" opacity=".75"/><path fill="currentColor" stroke="none" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z" opacity=".55"/><path fill="currentColor" stroke="none" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 6 12 6Z" opacity=".9"/>',
    whatsapp: '<path fill="currentColor" stroke="none" d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1a8.2 8.2 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1.1 2.5 5.9 5.9 0 0 0 1.2 3.1c.2.2 2.1 3.2 5 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.8-.7 2-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.3ZM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8Zm8.4-18.2A11.8 11.8 0 0 0 1.8 17.8L.1 24l6.4-1.7A11.8 11.8 0 0 0 12 23.7a11.8 11.8 0 0 0 8.4-20.1Z"/>'
  };
  RC.icon = function (name, cls) {
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (P[name] || P.tooth) + '</svg>';
  };
  RC.hydrateIcons = function (root) {
    RC.$$('[data-icon]', root).forEach(function (el) {
      if (!el.firstElementChild) el.innerHTML = RC.icon(el.getAttribute('data-icon'));
    });
  };
  RC.stars = function (n) {
    var s = '';
    for (var i = 0; i < 5; i++) s += RC.icon(i < Math.round(n) ? 'starFill' : 'star');
    return '<span class="stars" aria-label="' + n + ' out of 5 stars">' + s + '</span>';
  };

  /* Smooth wheel scrolling (Lenis, MIT). Touch, keyboard and reduced motion keep native scrolling.
     ScrollTrigger, when present, is driven from the same frame so pinned scenes stay in step. */
  RC.lenis = null;
  RC.smoothScroll = function () {
    if (!RC.lenis && !RC.reducedMotion() && typeof window.Lenis !== 'undefined') {
      var gsapOn = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
      RC.lenis = new window.Lenis({ lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: true, allowNestedScroll: true, autoRaf: !gsapOn });
      if (gsapOn) {
        RC.lenis.on('scroll', window.ScrollTrigger.update);
        window.gsap.ticker.add(function (t) { RC.lenis.raf(t * 1000); });
        window.gsap.ticker.lagSmoothing(0);
      }
    }
    // In-page links glide and land below the fixed header
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var href = a.getAttribute('href');
      var target = href === '#top' ? 0 : href.length > 1 ? RC.$(href) : null;
      if (target === null) return;
      e.preventDefault();
      RC.modal.closeAll();
      RC.scrollTo(target);
    });
  };
  RC.scrollTo = function (target, opts) {
    opts = opts || {};
    if (typeof target === 'string') target = RC.$(target);
    if (target === null || target === undefined) return;
    var y = typeof target === 'number' ? target
      : target.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0);
    if (RC.lenis) RC.lenis.scrollTo(y, { duration: opts.duration || Math.min(1.8, 0.7 + Math.abs(y - scrollY) / 5000), force: true });
    else window.scrollTo({ top: y, behavior: RC.reducedMotion() || opts.immediate ? 'auto' : 'smooth' });
  };
  RC.go = function (sel, focusSel) {
    var target = RC.$(sel);
    if (!target) return;
    RC.modal.closeAll();
    RC.scrollTo(target);
    if (focusSel) setTimeout(function () { var f = RC.$(focusSel); if (f) f.focus({ preventScroll: true }); }, RC.reducedMotion() ? 0 : 1000);
  };

  /* Dialogs: native <dialog> gives the focus trap, Esc and an inert page */
  RC.modal = {
    open: function (html, opts) {
      opts = opts || {};
      var d = document.createElement('dialog');
      d.className = 'rc-dialog ' + (opts.className || '');
      d.setAttribute('data-lenis-prevent', '');
      d.innerHTML = '<div class="rc-dialog__panel">' + html + '<button class="rc-dialog__close" type="button" aria-label="Close">' + RC.icon('close') + '</button></div>';
      if (opts.label) d.setAttribute('aria-label', opts.label);
      document.body.appendChild(d);
      d.addEventListener('click', function (e) { if (e.target === d) RC.modal.close(d); });
      d.addEventListener('cancel', function (e) { e.preventDefault(); RC.modal.close(d); });
      d.querySelector('.rc-dialog__close').addEventListener('click', function () { RC.modal.close(d); });
      RC.hydrateIcons(d);
      d.showModal();
      d.querySelector('.rc-dialog__close').focus({ preventScroll: true });
      d.scrollTop = 0;
      document.documentElement.classList.add('rc-modal-open');
      if (RC.lenis) RC.lenis.stop();
      if (opts.onOpen) opts.onOpen(d);
      return d;
    },
    close: function (d) {
      d = d || RC.$('dialog.rc-dialog[open]:not(.is-closing)');
      if (!d || d.classList.contains('is-closing')) return;
      d.classList.add('is-closing');
      RC.$$('video', d).forEach(function (v) { v.pause(); });
      if (d._onClose) d._onClose();
      var last = !RC.$$('dialog.rc-dialog[open]').some(function (x) { return x !== d && !x.classList.contains('is-closing'); });
      if (last) {
        document.documentElement.classList.remove('rc-modal-open');
        if (RC.lenis) RC.lenis.start();
      }
      var done = function () { d.close(); d.remove(); };
      if (RC.reducedMotion()) done(); else setTimeout(done, 220);
    },
    closeAll: function () { RC.$$('dialog.rc-dialog[open]').forEach(function (d) { RC.modal.close(d); }); }
  };

  RC.toast = function (msg, action, kind) {
    var t = RC.$('.rc-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'rc-toast';
      t.setAttribute('role', 'status');
      t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.classList.toggle('rc-toast--warn', kind === 'warn');
    t.innerHTML = '<span class="rc-toast__tick">' + RC.icon(kind === 'warn' ? 'info' : 'check') + '</span><span>' + RC.esc(msg) + '</span>' +
      (action ? '<button type="button" class="rc-toast__act">' + RC.esc(action.label) + '</button>' : '');
    if (action) t.querySelector('.rc-toast__act').addEventListener('click', function () { t.classList.remove('is-on'); action.run(); });
    t.classList.add('is-on');
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove('is-on'); }, 3800);
  };

  /* Pointer tilt: sets --rx, --ry, --mx, --my */
  RC.tilt = function (els, max) {
    max = max || 6;
    if (RC.reducedMotion() || matchMedia('(hover: none)').matches) return;
    els.forEach(function (el) {
      var raf = 0;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.setProperty('--rx', ((0.5 - py) * max).toFixed(2) + 'deg');
          el.style.setProperty('--ry', ((px - 0.5) * max).toFixed(2) + 'deg');
          el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        });
      });
      el.addEventListener('pointerleave', function () {
        cancelAnimationFrame(raf);
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  };

  /* Muted loops play only while on screen */
  RC.autoVideos = function (root) {
    var vids = RC.$$('video[data-autoplay]', root);
    if (!vids.length) return;
    if (RC.reducedMotion()) { vids.forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () { /* autoplay blocked: poster stays */ }); }
        else v.pause();
      });
    }, { rootMargin: '120px 0px' });
    vids.forEach(function (v) { v.muted = true; v.playsInline = true; io.observe(v); });
  };
  RC.videoTag = function (rel, cls, attrs) {
    return '<video class="' + (cls || '') + '" src="' + RC.media(rel + '.mp4') + '" poster="' + RC.media(rel + '.webp') + '" muted loop playsinline preload="metadata" data-autoplay ' + (attrs || '') + '></video>';
  };

  RC.headerScroll = function (el) {
    var last = 0;
    var on = function () {
      var y = window.scrollY;
      el.classList.toggle('is-scrolled', y > 8);
      el.classList.toggle('is-hidden', y > 600 && y > last + 4 && !document.documentElement.classList.contains('rc-modal-open'));
      if (y < last - 4) el.classList.remove('is-hidden');
      last = y;
    };
    on();
    addEventListener('scroll', on, { passive: true });
  };

  /* ---------- WhatsApp ---------- */
  RC.wa = function (text) { return 'https://wa.me/' + RC.company.wa + (text ? '?text=' + encodeURIComponent(text) : ''); };
  RC.openWa = function (text) { window.open(RC.wa(text), '_blank', 'noopener'); };

  RC.reference = function (prefix) {
    var d = new Date();
    return prefix + '-' + String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  };
  RC.store = {
    get: function (k, fallback) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? fallback : v; } catch (e) { return fallback; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked: the page still works */ } },
    push: function (k, v, max) { var a = this.get(k, []); a.push(v); this.set(k, a.slice(-(max || 20))); }
  };

  /* ---------- Form checks ---------- */
  RC.rules = {
    name: function (v) { return v.trim().length > 1 || 'Please tell us your name.'; },
    phone: function (v) {
      var d = v.replace(/[\s\-()]/g, '');
      return /^(\+?254|0)(7|1)\d{8}$/.test(d) || 'Use a Kenyan mobile number, for example 0712 345 678.';
    },
    phoneOrIntl: function (v) {
      var d = v.replace(/[\s\-()]/g, '');
      return /^(\+?254|0)(7|1)\d{8}$/.test(d) || /^\+\d{8,15}$/.test(d) || 'Use a Kenyan mobile (0712 345 678) or an international number with +.';
    },
    email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Check the email address.'; },
    required: function (msg) { return function (v) { return !!String(v || '').trim() || msg; }; },
    consent: function (v, f) { return f.elements.consent.checked || 'Please tick the box so we can contact you.'; }
  };
  function fieldOf(el) { return el.closest('.field') || el.parentNode; }
  function setError(el, msg) {
    var f = fieldOf(el), box = f.querySelector('.field__error');
    if (!box) { box = document.createElement('p'); box.className = 'field__error'; f.appendChild(box); }
    box.textContent = msg || '';
    f.classList.toggle('has-error', !!msg);
    if (el.setAttribute) { if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); }
  }
  RC.validateForm = function (form, rules) {
    var first = null;
    Object.keys(rules).forEach(function (name) {
      var el = form.elements[name];
      if (!el) return;
      var target = el.length && !el.tagName ? el[0] : el;
      if (target.closest && target.closest('[hidden]')) { setError(target, ''); return; }
      var value = el.type === 'checkbox' ? el.checked : el.value;
      var ok = rules[name](value || '', form);
      setError(target, ok === true ? '' : ok);
      if (ok !== true && !first) first = target;
    });
    return first;
  };
  RC.liveValidate = function (form, rules, armed) {
    form.addEventListener('input', function (e) {
      var name = e.target.name;
      if (!rules[name] || !armed()) return;
      var el = form.elements[name];
      var value = e.target.type === 'checkbox' ? e.target.checked : el.value;
      var ok = rules[name](value || '', form);
      setError(el.length && !el.tagName ? el[0] : el, ok === true ? '' : ok);
    });
  };
  RC.prettyPhone = function (v) {
    var d = String(v || '').replace(/[^\d+]/g, '');
    var m = d.match(/^(?:\+?254|0)(\d{3})(\d{3})(\d{3})$/);
    return m ? '0' + m[1] + ' ' + m[2] + ' ' + m[3] : v;
  };

  /* Social links from RC.socials fill every [data-socials] element:
     "icons" gives round buttons, "labels" adds the network name and handle. */
  RC.fillSocials = function (root) {
    RC.$$('[data-socials]', root).forEach(function (el) {
      var labels = el.getAttribute('data-socials') === 'labels';
      el.innerHTML = RC.socials.map(function (s) {
        return '<a class="social social--' + s.id + '" href="' + s.href + '" target="_blank" rel="noopener"' +
          (labels ? '' : ' aria-label="' + RC.esc(s.label) + ' (opens in a new tab)"') + '>' +
          '<span class="social__icon">' + RC.icon(s.id) + '</span>' +
          (labels ? '<span class="social__text"><strong>' + s.name + '</strong><span>' + RC.esc(s.handle) + '</span></span>' : '') + '</a>';
      }).join('');
    });
  };

  /* ---------- Clinic hours, in Mombasa time (EAT, UTC+3) whatever the visitor's clock says ---------- */
  RC.now = function () { var d = new Date(Date.now() + 3 * 3600000); return { day: d.getUTCDay(), mins: d.getUTCHours() * 60 + d.getUTCMinutes(), date: d }; };
  RC.hm = function (m) { var h = Math.floor(m / 60), mm = m % 60; return (h > 12 ? h - 12 : h) + (mm ? ':' + String(mm).padStart(2, '0') : '') + (h >= 12 ? ' pm' : ' am'); };
  RC.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  RC.openState = function () {
    var n = RC.now(), spans = RC.company.week[n.day] || [];
    for (var i = 0; i < spans.length; i++) {
      if (n.mins >= spans[i][0] && n.mins < spans[i][1]) {
        var lunch = spans[i + 1] ? ' for lunch' : '';
        return { open: true, label: 'Open now', sub: 'Closes' + lunch + ' at ' + RC.hm(spans[i][1]) };
      }
    }
    var later = spans.find(function (s) { return n.mins < s[0]; });
    if (later) return { open: false, label: spans[0][0] < n.mins ? 'Lunch break' : 'Closed now', sub: 'Opens today at ' + RC.hm(later[0]) };
    for (var k = 1; k < 8; k++) {
      var d = (n.day + k) % 7, s = RC.company.week[d];
      if (s) return { open: false, label: 'Closed now', sub: 'Opens ' + (k === 1 ? 'tomorrow' : RC.dayNames[d]) + ' at ' + RC.hm(s[0][0]) };
    }
    return { open: false, label: 'Closed now', sub: '' };
  };
  /* Every [data-open-state] shows the live status; [data-today-row] highlights today's hours */
  RC.paintOpen = function () {
    var st = RC.openState();
    RC.$$('[data-open-state]').forEach(function (el) {
      el.classList.toggle('is-open', st.open);
      el.innerHTML = '<i class="pulse" aria-hidden="true"></i><strong>' + st.label + '</strong><span>' + st.sub + '</span>';
    });
    var day = RC.now().day, key = day === 0 ? 'sun' : day === 6 ? 'sat' : 'week';
    RC.$$('[data-hours-row]').forEach(function (r) { r.classList.toggle('is-today', r.getAttribute('data-hours-row') === key); });
  };

  document.addEventListener('DOMContentLoaded', function () {
    RC.hydrateIcons(document);
    RC.fillSocials(document);
    RC.paintOpen();
    setInterval(RC.paintOpen, 60000);
  });
})();
