/* Concept B, lively: builds the grids from RC data and adds the playful parts:
   filters, the smile quiz, sliders, the brushing timer, confetti and a bouncy hero. */
(function () {
  var RC = window.RC, $ = RC.$, $$ = RC.$$, esc = RC.esc;

  /* ---------- Confetti in the brand colours ---------- */
  RC.confetti = function (x, y) {
    if (RC.reducedMotion()) return;
    var c = document.createElement('canvas'), ctx = c.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
    c.className = 'confetti';
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    document.body.appendChild(c);
    ctx.scale(dpr, dpr);
    var cols = ['#10B3C6', '#FFC93C', '#FF4F6D', '#2F5BEA', '#22C3A6', '#FFFFFF'];
    var ox = x == null ? innerWidth / 2 : x, oy = y == null ? innerHeight / 2 : y;
    var parts = [];
    for (var i = 0; i < 140; i++) {
      var a = Math.random() * Math.PI * 2, v = 6 + Math.random() * 10;
      parts.push({ x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, r: 4 + Math.random() * 6, c: cols[i % cols.length], rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, shape: i % 3 });
    }
    var t0 = performance.now();
    (function frame(now) {
      var t = now - t0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(function (p) {
        p.vy += 0.32; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - t / 2400);
        if (p.shape === 0) ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.r / 1.4, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.beginPath(); ctx.moveTo(0, -p.r); ctx.lineTo(p.r, p.r); ctx.lineTo(-p.r, p.r); ctx.fill(); }
        ctx.restore();
      });
      if (t < 2400) requestAnimationFrame(frame); else c.remove();
    })(t0);
  };
  RC.onBooked = function () { RC.confetti(innerWidth * 0.66, innerHeight * 0.35); };

  /* ---------- Treatments with filters ---------- */
  function buildTreats() {
    var grid = $('[data-treats]'), chips = $('[data-filters]');
    chips.innerHTML = RC.cats.map(function (c, i) {
      return '<button type="button" role="tab" class="chip' + (i ? '' : ' is-on') + '" aria-selected="' + !i + '" data-cat="' + c[0] + '">' + esc(c[1]) + '</button>';
    }).join('');
    grid.innerHTML = RC.treatments.map(function (t) {
      return '<article class="treat" data-cat="' + t.cat + '" style="--c:' + t.color + '">' +
        '<span class="treat__ic">' + RC.icon(t.icon) + '</span>' +
        '<h3>' + esc(t.short) + '</h3><p>' + esc(t.blurb) + '</p>' +
        '<div class="treat__btns"><button class="btn btn--blue treat__book" type="button" data-book="' + t.reason + (t.doctor ? ':' + t.doctor : '') + '">Book now <span>' + RC.icon('right') + '</span></button>' +
        '<button class="treat__more" type="button" data-open="treatment:' + t.id + '">Details</button></div>' +
        '<img class="treat__peek" src="' + RC.img(t.thumb) + '" alt="" loading="lazy" width="800" height="1000"></article>';
    }).join('');
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      $$('.chip', chips).forEach(function (x) { var on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', on); });
      var cat = b.getAttribute('data-cat'), cards = $$('.treat', grid);
      var show = cards.filter(function (c) { return cat === 'all' || c.getAttribute('data-cat') === cat; });
      var g = window.gsap;
      if (!g || RC.reducedMotion()) { cards.forEach(function (c) { c.hidden = show.indexOf(c) < 0; }); return; }
      g.to(cards, { autoAlpha: 0, scale: 0.92, duration: 0.18, ease: 'power2.in', onComplete: function () {
        cards.forEach(function (c) { c.hidden = show.indexOf(c) < 0; });
        g.fromTo(show, { autoAlpha: 0, y: 30, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.05, clearProps: 'transform' });
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      } });
    });
  }

  /* ---------- Smile quiz ---------- */
  function buildQuiz() {
    var box = $('[data-quiz]'), ans = [];
    function step(i) {
      var q = RC.quiz[i];
      box.innerHTML = '<div class="quiz__top"><span class="quiz__n">Question ' + (i + 1) + ' of 3</span><span class="quiz__dots">' + RC.quiz.map(function (x, k) { return '<i class="' + (k < i ? 'is-done' : k === i ? 'is-on' : '') + '"></i>'; }).join('') + '</span></div>' +
        '<h3 class="quiz__q">' + esc(q.q) + '</h3><div class="quiz__opts">' + q.a.map(function (a) {
          return '<button type="button" class="qopt" data-a="' + a[0] + '"><span class="qopt__ic">' + RC.icon(a[2]) + '</span>' + esc(a[1]) + '</button>';
        }).join('') + '</div>' + (i ? '<button type="button" class="link-btn quiz__back" data-back>' + RC.icon('left') + 'Back</button>' : '');
      if (window.gsap && !RC.reducedMotion()) window.gsap.from($$('.qopt', box), { y: 24, autoAlpha: 0, scale: 0.9, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.05 });
    }
    function result() {
      var map = { pain: 'emergency', gap: 'implants', colour: 'whitening', shape: 'veneers', health: 'checkup' };
      var id = map[ans[0]];
      if (ans[2] === 'child' && id !== 'emergency') id = 'kids';
      var t = RC.treatment(id);
      var extra = ans[1] === 'long' && id !== 'checkup' && id !== 'emergency' ? ' As it has been a while, we will start with a full check-up and clean too.' : '';
      var fam = ans[2] === 'family' ? ' Bring the whole family: we can book back-to-back visits.' : '';
      box.innerHTML = '<div class="quiz__res" style="--c:' + t.color + '"><p class="quiz__n">Your suggested first visit</p>' +
        '<div class="quiz__pick"><img src="' + RC.img(t.thumb) + '" alt=""><div><span class="quiz__ic">' + RC.icon(t.icon) + '</span><h3>' + esc(t.name) + '</h3><p>' + esc(t.blurb + extra + fam) + '</p></div></div>' +
        '<div class="quiz__btns"><button class="btn btn--blue" type="button" data-book="' + t.reason + (t.doctor ? ':' + t.doctor : '') + '">' + RC.icon('calendar') + 'Book this visit</button>' +
        '<button class="btn btn--ghost" type="button" data-open="treatment:' + t.id + '">What to expect</button>' +
        '<button class="link-btn" type="button" data-restart>' + RC.icon('repeat') + 'Start again</button></div></div>';
      if (window.gsap && !RC.reducedMotion()) window.gsap.from('.quiz__res > *', { y: 30, autoAlpha: 0, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.08 });
      var r = box.getBoundingClientRect();
      RC.confetti(r.left + r.width / 2, r.top + 80);
    }
    box.addEventListener('click', function (e) {
      var o = e.target.closest('.qopt');
      if (o) { ans[RC.quiz.findIndex(function (q) { return q.a.some(function (a) { return a[0] === o.getAttribute('data-a'); }); })] = o.getAttribute('data-a'); var n = ans.filter(Boolean).length; if (n >= 3) result(); else step(n); return; }
      if (e.target.closest('[data-back]')) { ans.pop(); step(ans.length); }
      if (e.target.closest('[data-restart]')) { ans = []; step(0); }
    });
    step(0);
  }

  /* ---------- Real smile makeovers ---------- */
  function buildSmiles() {
    $('[data-smiles]').innerHTML = RC.cases.map(function (c, i) {
      return '<article class="smile-card" style="--tilt:' + [-2.5, 1.8, -1.2, 2.2, -1.8][i] + 'deg">' +
        RC.compare.html(c.id) +
        '<div class="smile-card__b"><span class="smile-card__tag">' + esc(c.tag) + '</span><h3>' + esc(c.title) + '</h3><p>' + esc(c.text) + '</p>' +
        '<button class="link-btn" type="button" data-open="case:' + c.id + '">View bigger</button></div>' +
        (i === 0 ? '<span class="sticker sticker--sun smile-card__drag" data-float="6">' + RC.icon('hand') + 'Drag me!</span>' : '') + '</article>';
    }).join('') + '<article class="smile-cta">' + RC.icon('sparkles') + '<h3>Your smile could be next</h3><p>Tell us what you would love to change. We will plan it with you, shade by shade.</p>' +
      '<button class="btn btn--sun" type="button" data-book="smile">Book a smile chat</button></article>';
  }

  /* ---------- Dentists slider ---------- */
  function buildDocs() {
    var card = $('[data-doc-card]'), i = 0;
    function paint(dir) {
      var d = RC.doctors[i];
      var html = '<div class="dcard__in"><span class="dcard__seal">' + d.initials + '<img src="' + RC.img('logo/mark-sm.webp') + '" alt=""></span>' +
        '<p class="dcard__role">' + esc(d.role) + '</p><h3 class="dcard__name">' + esc(d.name) + '</h3><p class="dcard__creds">' + RC.icon('award') + esc(d.creds) + '</p>' +
        '<p class="dcard__bio">' + esc(d.bio) + '</p><div class="dcard__tags">' + d.focus.slice(0, 4).map(function (f) { return '<span>' + esc(f) + '</span>'; }).join('') + '</div>' +
        '<div class="dcard__btns"><button class="btn btn--blue" type="button" data-book="' + (d.id === 'luvay' ? 'implant' : 'checkup') + ':' + d.id + '">Book with ' + esc(d.short) + '</button><button class="link-btn" type="button" data-open="doctor:' + d.id + '">Full profile</button></div>' +
        '<span class="dcard__count">0' + (i + 1) + ' / 0' + RC.doctors.length + '</span></div>';
      if (!dir || !window.gsap || RC.reducedMotion()) { card.innerHTML = html; return; }
      window.gsap.to(card.firstChild, { x: -60 * dir, autoAlpha: 0, duration: 0.25, ease: 'power2.in', onComplete: function () {
        card.innerHTML = html;
        window.gsap.from(card.firstChild.children, { x: 60 * dir, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.04 });
      } });
    }
    $('[data-doc-prev]').addEventListener('click', function () { i = (i + RC.doctors.length - 1) % RC.doctors.length; paint(-1); });
    $('[data-doc-next]').addEventListener('click', function () { i = (i + 1) % RC.doctors.length; paint(1); });
    paint();
  }

  /* ---------- What we believe ---------- */
  function buildBelieve() {
    var slides = $$('.believe__slide'), imgs = $$('[data-believe-media] img'), i = 0, timer = 0;
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
      imgs.forEach(function (im, k) { im.classList.toggle('is-on', k === i); });
    }
    function auto() { clearInterval(timer); if (!RC.reducedMotion()) timer = setInterval(function () { show(i + 1); }, 5200); }
    $('[data-believe-prev]').addEventListener('click', function () { show(i - 1); auto(); });
    $('[data-believe-next]').addEventListener('click', function () { show(i + 1); auto(); });
    auto();
  }

  function buildReviews() {
    $('[data-reviews]').innerHTML = RC.reviews.map(function (r) {
      return '<article class="rcard"><p>' + esc(r.text) + '</p><footer><span class="rcard__av">' + r.name.charAt(0) + '</span><span><strong>' + esc(r.name) + '</strong><em>' + esc(r.meta) + ' &middot; ' + esc(r.when) + '</em></span>' + RC.stars(r.stars) + '</footer></article>';
    }).join('');
  }

  function buildTips() {
    $('[data-tips]').innerHTML = RC.tips.map(function (t) {
      return '<article class="tip"><button class="tip__img" type="button" data-open="tip:' + t.id + '" aria-label="Read: ' + esc(t.title) + '"><img src="' + RC.img(t.img) + '" alt="" loading="lazy" width="800" height="1000"></button>' +
        '<div class="tip__b"><span class="tip__tag">' + esc(t.tag) + ' &middot; ' + t.mins + ' min read</span><h3>' + esc(t.title) + '</h3><p>' + esc(t.lead) + '</p>' +
        '<button class="link-btn" type="button" data-open="tip:' + t.id + '">Read the tip</button></div></article>';
    }).join('');
  }

  function buildFaq() {
    $('[data-faq]').innerHTML = RC.faqs.map(function (f, i) {
      return '<details class="fq"' + (i === 0 ? ' open' : '') + ' data-reveal="up" data-delay="' + (i * 0.04) + '"><summary><span>' + esc(f[0]) + '</span><span class="fq__ic">' + RC.icon('plus') + '</span></summary><p>' + esc(f[1]) + '</p></details>';
    }).join('');
    $$('.fq').forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) $$('.fq').forEach(function (o) { if (o !== d) o.open = false; }); }); });
  }

  /* ---------- The two-minute brushing timer ---------- */
  function buildTimer() {
    var root = $('[data-timer]'), go = $('[data-timer-go]'), time = $('[data-time]'), cue = $('[data-cue]'), prog = $('.kids__prog', root), tooth = $('[data-tooth]');
    var quads = $$('.kids__quads i', root), TOTAL = 120, left = TOTAL, run = false, last = 0, raf = 0;
    var CUES = ['Top left teeth!', 'Top right teeth!', 'Bottom right teeth!', 'Bottom left teeth!'];
    var LEN = 2 * Math.PI * 96;
    prog.style.strokeDasharray = LEN; prog.style.strokeDashoffset = LEN;
    function paint() {
      var s = Math.ceil(left);
      time.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
      prog.style.strokeDashoffset = LEN * (left / TOTAL);
      var q = Math.min(3, Math.floor((TOTAL - left) / 30));
      quads.forEach(function (el, k) { el.classList.toggle('is-on', run && k === q); el.classList.toggle('is-done', k < q || left <= 0); });
      if (run) cue.textContent = CUES[q];
    }
    function tick(now) {
      if (!run) return;
      left = Math.max(0, left - (now - last) / 1000); last = now;
      paint();
      if (left <= 0) { finish(); return; }
      raf = requestAnimationFrame(tick);
    }
    function finish() {
      run = false;
      cue.textContent = 'Sparkling! See you at your check-up';
      go.innerHTML = RC.icon('repeat') + 'Brush again';
      root.classList.remove('is-running'); root.classList.add('is-done');
      var r = root.getBoundingClientRect();
      RC.confetti(r.left + r.width / 2, r.top + r.height / 2);
    }
    go.addEventListener('click', function () {
      if (left <= 0) { left = TOTAL; root.classList.remove('is-done'); }
      run = !run;
      root.classList.toggle('is-running', run);
      go.innerHTML = RC.icon(run ? 'pause' : 'play') + (run ? 'Pause' : 'Keep brushing');
      if (run) { last = performance.now(); raf = requestAnimationFrame(tick); if (left === TOTAL) cue.textContent = CUES[0]; }
      else cancelAnimationFrame(raf);
      paint();
    });
    paint();
  }

  /* ---------- Motion that belongs to this page ---------- */
  function motion() {
    var g = window.gsap, Split = window.SplitText;
    if (!RC.fx.on) return;
    var lines = $$('[data-hero-line]');
    if (Split) {
      lines.forEach(function (l, k) {
        var s = new Split(l, { type: 'chars', charsClass: 'hero__char' });
        g.from(s.chars, { yPercent: 120, rotation: 10, autoAlpha: 0, duration: 0.9, ease: 'back.out(2)', stagger: 0.04, delay: 0.2 + k * 0.25 });
      });
    }
    g.from('.hero__crown', { y: -160, rotation: -40, autoAlpha: 0, duration: 1.1, ease: 'bounce.out', delay: 1 });
    g.from('.tile', { scale: 0.5, autoAlpha: 0, rotation: function (i, el) { return +el.getAttribute('data-tile'); }, duration: 1.2, ease: 'back.out(1.5)', stagger: 0.12, delay: 0.3 });
    g.from('.hero .sticker', { scale: 0, rotation: -20, duration: 0.8, ease: 'back.out(2.5)', stagger: 0.15, delay: 1.2 });
    // the collage follows the pointer a little
    var hero = $('.hero');
    if (!matchMedia('(hover: none)').matches) {
      var tiles = $$('[data-tile]').map(function (t) { return { el: t, k: +t.getAttribute('data-tile') / 12, x: g.quickTo(t, 'x', { duration: 0.9, ease: 'power3' }), y: g.quickTo(t, 'y', { duration: 0.9, ease: 'power3' }) }; });
      hero.addEventListener('pointermove', function (e) {
        var px = e.clientX / innerWidth - 0.5, py = e.clientY / innerHeight - 0.5;
        tiles.forEach(function (t) { t.x(px * 22 * t.k); t.y(py * 18 * t.k); });
      });
    }
    g.to('.hero__collage', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    g.to('.hero__tooth', { rotation: 25, yPercent: 30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    // icons bounce in, smile cards straighten as they arrive
    g.from('.feat__ic', { scale: 0, rotation: -30, duration: 0.9, ease: 'back.out(2.4)', stagger: 0.1, scrollTrigger: { trigger: '.feats', start: 'top 80%', once: true } });
    g.from('.treat', { y: 60, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.4)', stagger: 0.05, scrollTrigger: { trigger: '.treats__grid', start: 'top 82%', once: true } });
    g.from('.smile-card', { y: 90, rotation: function (i) { return i % 2 ? 8 : -8; }, autoAlpha: 0, duration: 1, ease: 'back.out(1.4)', stagger: 0.08, scrollTrigger: { trigger: '.smiles__row', start: 'top 85%', once: true } });
    g.from('.tip', { y: 70, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.4)', stagger: 0.08, scrollTrigger: { trigger: '.tips__grid', start: 'top 85%', once: true } });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildTreats();
    buildQuiz();
    buildSmiles();
    buildDocs();
    buildBelieve();
    buildReviews();
    buildTips();
    buildFaq();
    buildTimer();
    RC.hydrateIcons(document);
    RC.smoothScroll();
    RC.headerScroll($('#hd'));
    RC.autoVideos(document);
    RC.tilt($$('.feat, .tip'), 6);
    RC.chat.init({ teaser: 'Jambo! 😁 Want a brighter smile? Book in a minute or ask me anything.' });
    RC.fx.init();
    motion();
    RC.compare.mount(document);
  });
})();
