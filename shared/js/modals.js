/* Pop-ups shared by both concepts: treatments, dentists, real cases, smile tips and the clinic film.
   Each one ends in a way to book or to ask on WhatsApp. */
(function () {
  var RC = window.RC, esc = RC.esc, C = RC.company;

  function list(items) { return '<ul class="pop__list">' + items.map(function (x) { return '<li>' + RC.icon('check') + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul>'; }
  function steps(items) {
    return '<ol class="pop__steps">' + items.map(function (s, i) {
      return '<li><span class="pop__num">' + (i + 1) + '</span><div><strong>' + esc(s[0]) + '</strong><p>' + esc(s[1]) + '</p></div></li>';
    }).join('') + '</ol>';
  }
  function faq(items) {
    return items.map(function (f) { return '<details class="pop__faq"><summary>' + esc(f[0]) + RC.icon('plus') + '</summary><p>' + esc(f[1]) + '</p></details>'; }).join('');
  }
  function journey() {
    var j = RC.journey;
    return '<div class="pop__journey"><p class="pop__label">A real case: ' + esc(j.title.toLowerCase()) + '</p><div class="pop__jrow">' + j.steps.map(function (s, i) {
      return '<figure><img src="' + RC.img(s[0]) + '" alt="' + esc(s[1]) + '" loading="lazy"><figcaption><strong>' + (i + 1) + '. ' + esc(s[1]) + '</strong>' + esc(s[2]) + '</figcaption></figure>';
    }).join('') + '</div><p class="pop__src">' + esc(j.post) + '</p></div>';
  }
  function bindBook(d, preset) {
    RC.$$('[data-pop-book]', d).forEach(function (b) {
      b.addEventListener('click', function () {
        var doc = b.getAttribute('data-doctor');
        RC.modal.close(d);
        if (RC.booking) RC.booking.preset(Object.assign({}, preset, doc ? { doctor: doc } : {}));
        setTimeout(function () { RC.go('#book'); }, 240);
      });
    });
  }

  RC.openTreatment = function (id) {
    var t = RC.treatment(id);
    if (!t) return;
    var doc = t.doctor ? RC.doctors.find(function (x) { return x.id === t.doctor; }) : null;
    var media = t.video ? RC.videoTag(t.video, 'pop__video', 'autoplay') : '<img src="' + RC.img(t.img) + '" alt="" class="pop__img">';
    var c = t.caseId ? RC.case(t.caseId) : null;
    var html = '<article class="pop pop--treatment" style="--tc:' + t.color + '">' +
      '<div class="pop__media">' + media + '<span class="pop__chip">' + RC.icon(t.icon) + esc(RC.cats.find(function (k) { return k[0] === t.cat; })[1]) + '</span></div>' +
      '<div class="pop__body">' +
      '<p class="pop__eyebrow">Treatment</p><h2 class="pop__title">' + esc(t.name) + '</h2>' +
      '<p class="pop__intro">' + esc(t.intro) + '</p>' +
      '<div class="pop__facts"><div>' + RC.icon('clock') + '<span>Time</span><strong>' + esc(t.time) + '</strong></div>' +
      '<div>' + RC.icon('user') + '<span>With</span><strong>' + (doc ? esc(doc.name) : 'Dr. Mohammed or Dr. Luvay Hamid') + '</strong></div></div>' +
      '<h3 class="pop__h">Good for</h3>' + list(t.good) +
      '<h3 class="pop__h">What to expect</h3>' + steps(t.steps) +
      (t.extra ? '<p class="pop__note">' + RC.icon('info') + esc(t.extra) + '</p>' : '') +
      (t.journey ? journey() : '') +
      (c ? '<div class="pop__case"><p class="pop__label">A real result from our chair: ' + esc(c.title.toLowerCase()) + '</p>' + RC.compare.html(c.id, { eager: true }) + '<p class="pop__src">' + esc(c.post) + '. Drag the handle to compare.</p></div>' : '') +
      '<h3 class="pop__h">Aftercare</h3><p class="pop__p">' + esc(t.after) + '</p>' +
      faq(t.faq) +
      '<div class="pop__cta"><button type="button" class="btn btn--primary" data-pop-book>' + RC.icon('calendar') + 'Book this treatment</button>' +
      '<a class="btn btn--ghost" target="_blank" rel="noopener" href="' + RC.wa('Hello Royal Crown! I would like to ask about ' + t.name.toLowerCase() + '.') + '">' + RC.icon('whatsapp') + 'Ask on WhatsApp</a></div>' +
      '</div></article>';
    RC.modal.open(html, { className: 'rc-dialog--wide', label: t.name, onOpen: function (d) {
      bindBook(d, { reason: t.reason, doctor: t.doctor || '', treatment: t.id });
      RC.compare.mount(d);
      RC.autoVideos(d);
    } });
  };

  RC.openDoctor = function (id) {
    var doc = RC.doctors.find(function (x) { return x.id === id; });
    if (!doc) return;
    var html = '<article class="pop pop--doctor">' +
      '<div class="pop__seal"><img src="' + RC.img('logo/mark.webp') + '" alt=""><span>' + doc.initials + '</span></div>' +
      '<div class="pop__body">' +
      '<p class="pop__eyebrow">' + esc(doc.role) + '</p><h2 class="pop__title">' + esc(doc.name) + '</h2>' +
      '<p class="pop__creds">' + RC.icon('award') + esc(doc.creds) + '</p>' +
      '<p class="pop__intro">' + esc(doc.bio) + '</p>' +
      '<h3 class="pop__h">Focus</h3><div class="pop__tags">' + doc.focus.map(function (f) { return '<span>' + esc(f) + '</span>'; }).join('') + '</div>' +
      '<blockquote class="pop__quote">' + RC.icon('quote') + '<p>' + esc(doc.quote) + '</p><cite>' + esc(doc.quoteBy) + '</cite></blockquote>' +
      '<div class="pop__cta"><button type="button" class="btn btn--primary" data-pop-book data-doctor="' + doc.id + '">' + RC.icon('calendar') + 'Book with ' + esc(doc.short) + '</button>' +
      '<a class="btn btn--ghost" href="' + C.phoneHref + '">' + RC.icon('phone') + C.phone + '</a></div>' +
      '</div></article>';
    RC.modal.open(html, { className: 'rc-dialog--doctor', label: doc.name, onOpen: function (d) { bindBook(d, {}); } });
  };

  RC.openCase = function (id) {
    var c = RC.case(id);
    if (!c) return;
    var t = RC.treatment(c.treatment);
    var html = '<article class="pop pop--case">' +
      '<div class="pop__body">' +
      '<p class="pop__eyebrow">Real patient · ' + esc(c.tag) + '</p><h2 class="pop__title">' + esc(c.title) + '</h2>' +
      RC.compare.html(c.id, { eager: true, className: 'ba--big' }) +
      '<p class="pop__intro">' + esc(c.text) + '</p><p class="pop__src">' + esc(c.post) + '. Results vary from person to person.</p>' +
      '<div class="pop__cta"><button type="button" class="btn btn--primary" data-pop-book>' + RC.icon('calendar') + 'Book a consultation</button>' +
      (t ? '<button type="button" class="btn btn--ghost" data-pop-treat="' + t.id + '">About ' + esc(t.short.toLowerCase()) + '</button>' : '') + '</div>' +
      '</div></article>';
    RC.modal.open(html, { className: 'rc-dialog--case', label: c.title, onOpen: function (d) {
      bindBook(d, { reason: t ? t.reason : 'smile', treatment: t ? t.id : '' });
      RC.compare.mount(d);
      var tb = RC.$('[data-pop-treat]', d);
      if (tb) tb.addEventListener('click', function () { RC.modal.close(d); setTimeout(function () { RC.openTreatment(tb.getAttribute('data-pop-treat')); }, 230); });
    } });
  };

  RC.openTip = function (id) {
    var t = RC.tip(id);
    if (!t) return;
    var html = '<article class="pop pop--tip">' +
      '<div class="pop__media"><img src="' + RC.img(t.img) + '" alt="" class="pop__img"></div>' +
      '<div class="pop__body">' +
      '<p class="pop__eyebrow">Smile tip · ' + esc(t.tag) + ' · ' + t.mins + ' min read</p><h2 class="pop__title">' + esc(t.title) + '</h2>' +
      '<p class="pop__intro">' + esc(t.lead) + '</p>' +
      t.body.map(function (b) { return '<h3 class="pop__h">' + esc(b[0]) + '</h3><p class="pop__p">' + esc(b[1]) + '</p>'; }).join('') +
      '<p class="pop__note">' + RC.icon('info') + 'General advice only. For your own teeth, ask Dr. Mohammed or Dr. Luvay at your visit.</p>' +
      '<div class="pop__cta"><button type="button" class="btn btn--primary" data-pop-book>' + RC.icon('calendar') + 'Book a check-up</button>' +
      '<a class="btn btn--ghost" target="_blank" rel="noopener" href="' + RC.wa('Hello Royal Crown! I read your tip "' + t.title + '" and have a question.') + '">' + RC.icon('whatsapp') + 'Ask a question</a></div>' +
      '</div></article>';
    RC.modal.open(html, { className: 'rc-dialog--wide', label: t.title, onOpen: function (d) { bindBook(d, { reason: t.tag === 'Kids' ? 'child' : 'checkup' }); } });
  };

  /* The clinic film: five short chapters that play like stories */
  var FILM = [
    ['video/chair-team2', 'A proper conversation first', 'We listen, look and explain before anything starts.'],
    ['video/treat', 'Gentle, careful hands', 'Two people at your side for every treatment.'],
    ['video/clean', 'A deep, comfortable clean', 'Scale and polish that leaves teeth feeling brand new.'],
    ['video/shade', 'Matched shade by shade', 'Crowns and veneers that blend with your own teeth.'],
    ['video/hero-laugh', 'And you leave smiling', 'That is the Royal Crown welcome.']
  ];
  RC.openFilm = function (start) {
    var i = +start || 0, timer = 0, paused = false;
    var html = '<div class="film">' +
      '<div class="film__bars">' + FILM.map(function () { return '<span><i></i></span>'; }).join('') + '</div>' +
      '<video class="film__video" muted playsinline preload="auto"></video>' +
      '<div class="film__cap"><p class="film__n"></p><h2 class="film__t"></h2><p class="film__s"></p></div>' +
      '<button type="button" class="film__nav film__nav--prev" aria-label="Previous chapter">' + RC.icon('left') + '</button>' +
      '<button type="button" class="film__nav film__nav--next" aria-label="Next chapter">' + RC.icon('right') + '</button>' +
      '<button type="button" class="film__pp" aria-label="Pause">' + RC.icon('pause') + '</button>' +
      '<button type="button" class="btn btn--primary film__book" data-pop-book>' + RC.icon('calendar') + 'Book your visit</button>' +
      '</div>';
    RC.modal.open(html, { className: 'rc-dialog--film', label: 'A visit to Royal Crown Dental Care', onOpen: function (d) {
      var v = RC.$('.film__video', d), bars = RC.$$('.film__bars span i', d), pp = RC.$('.film__pp', d);
      var DUR = 6200, t0 = 0, elapsed = 0;
      function show(n) {
        i = (n + FILM.length) % FILM.length;
        var f = FILM[i];
        v.src = RC.media(f[0] + '.mp4');
        v.poster = RC.media(f[0] + '.webp');
        var p = v.play(); if (p && p.catch) p.catch(function () {});
        RC.$('.film__n', d).textContent = 'Chapter ' + (i + 1) + ' of ' + FILM.length;
        RC.$('.film__t', d).textContent = f[1];
        RC.$('.film__s', d).textContent = f[2];
        bars.forEach(function (b, k) { b.style.width = k < i ? '100%' : '0%'; });
        elapsed = 0; t0 = performance.now();
        d.classList.remove('is-cap'); void d.offsetWidth; d.classList.add('is-cap');
      }
      function tick(now) {
        if (!d.isConnected) return;
        if (!paused) {
          var p = Math.min(1, (elapsed + now - t0) / DUR);
          bars[i].style.width = (p * 100) + '%';
          if (p >= 1) show(i + 1);
        }
        timer = requestAnimationFrame(tick);
      }
      RC.$('.film__nav--prev', d).addEventListener('click', function () { show(i - 1); });
      RC.$('.film__nav--next', d).addEventListener('click', function () { show(i + 1); });
      pp.addEventListener('click', function () {
        paused = !paused;
        if (paused) { elapsed += performance.now() - t0; v.pause(); } else { t0 = performance.now(); v.play(); }
        pp.innerHTML = RC.icon(paused ? 'play' : 'pause');
        pp.setAttribute('aria-label', paused ? 'Play' : 'Pause');
      });
      d._onClose = function () { cancelAnimationFrame(timer); };
      bindBook(d, {});
      show(i);
      timer = requestAnimationFrame(tick);
    } });
  };

  /* Any element with data-open="treatment:implants" (or doctor:, case:, tip:, film) opens its pop-up */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-open]');
    if (!el) return;
    e.preventDefault();
    var parts = el.getAttribute('data-open').split(':');
    var fn = { treatment: RC.openTreatment, doctor: RC.openDoctor, 'case': RC.openCase, tip: RC.openTip, film: RC.openFilm }[parts[0]];
    if (fn) fn(parts[1]);
  });
})();
