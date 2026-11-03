/* Concept A, professional: builds the repeated parts from RC data and adds the page's own motion. */
(function () {
  var RC = window.RC, $ = RC.$, $$ = RC.$$, esc = RC.esc;

  /* ---------- Treatments rail ---------- */
  function buildCare() {
    var track = $('[data-care-track]');
    track.innerHTML = RC.treatments.map(function (t, i) {
      return '<article class="tcard" style="--tc:' + t.color + '">' +
        '<div class="tcard__top"><span class="tcard__icon">' + RC.icon(t.icon) + '</span><span class="tcard__n">' + String(i + 1).padStart(2, '0') + '</span></div>' +
        '<h3 class="tcard__t">' + esc(t.name) + '</h3>' +
        '<p class="tcard__p">' + esc(t.blurb) + '</p>' +
        '<div class="tcard__img"><img src="' + RC.img(t.thumb) + '" alt="" loading="lazy" width="800" height="1000"></div>' +
        '<div class="tcard__foot"><button class="tcard__more" type="button" data-open="treatment:' + t.id + '">Learn more <span>' + RC.icon('right') + '</span></button>' +
        '<button class="tcard__book" type="button" data-book="' + t.reason + (t.doctor ? ':' + t.doctor : '') + '" aria-label="Book ' + esc(t.short) + '">' + RC.icon('calendar') + '</button></div>' +
        '</article>';
    }).join('') + '<div class="tcard tcard--end"><p>Not sure what you need?</p><h3>Book a check-up and we&rsquo;ll guide you</h3><button class="btn btn--primary" type="button" data-book="checkup">Book a check-up</button><button class="link-btn" type="button" data-chat="I am not sure which treatment I need">Ask the assistant</button></div>';
  }

  /* ---------- Book by what you need ---------- */
  var ROWS = [
    ['checkup', 'Check-up and clean', 'A thorough check, scale and polish every six months', 'care/dentist-patient-t.webp'],
    ['pain', 'Toothache or emergency', 'Call 0738 420 070, or request the first free time', 'clinic/work-3.webp'],
    ['implant', 'Implant consultation', 'With Dr. Luvay M. Hamid and a 3D scan if needed', 'care/implant-model-t.webp'],
    ['smile', 'Smile makeover or whitening', 'Veneers, bonding and whitening, planned shade by shade', 'care/scarf-mirror-t.webp'],
    ['child', 'Your child’s visit', 'Short, gentle and fun, from the first tooth', 'care/kid-hijab-t.webp']
  ];
  function buildRows() {
    $('[data-rows]').innerHTML = ROWS.map(function (r, i) {
      return '<li><button class="row" type="button" data-book="' + r[0] + '" data-img="' + RC.img(r[3]) + '" data-reveal="up" data-delay="' + (i * 0.05) + '">' +
        '<span class="row__n">0' + (i + 1) + '</span><span class="row__t">' + esc(r[1]) + '</span><span class="row__d">' + esc(r[2]) + '</span>' +
        '<span class="row__go">' + RC.icon('right') + '</span></button></li>';
    }).join('');
    var float = $('[data-rows-float]'), img = $('img', float), list = $('[data-rows]');
    if (matchMedia('(hover: none)').matches || RC.reducedMotion()) return;
    var g = window.gsap;
    var xTo = g ? g.quickTo(float, 'x', { duration: 0.6, ease: 'power3' }) : null, yTo = g ? g.quickTo(float, 'y', { duration: 0.6, ease: 'power3' }) : null;
    list.addEventListener('pointermove', function (e) {
      var row = e.target.closest('.row');
      if (!row) return;
      if (img.getAttribute('src') !== row.getAttribute('data-img')) img.src = row.getAttribute('data-img');
      var r = list.getBoundingClientRect();
      if (xTo) { xTo(e.clientX - r.left); yTo(e.clientY - r.top); }
      float.classList.add('is-on');
    });
    list.addEventListener('pointerleave', function () { float.classList.remove('is-on'); });
  }

  /* ---------- Real results ---------- */
  function buildSmiles() {
    var view = $('[data-smiles-view]'), list = $('[data-smiles-list]');
    list.innerHTML = RC.cases.map(function (c, i) {
      return '<button class="case" type="button" role="tab" aria-selected="' + (i === 0) + '" data-case="' + c.id + '">' +
        '<span class="case__thumb"><img src="' + RC.img(c.after) + '" alt="" loading="lazy"></span>' +
        '<span class="case__txt"><span class="case__tag">' + esc(c.tag) + '</span><strong>' + esc(c.title) + '</strong><span class="case__p">' + esc(c.text) + '</span></span>' +
        '<span class="case__go">' + RC.icon('right') + '</span></button>';
    }).join('') + '<p class="smiles__note">' + RC.icon('info') + 'Real cases shared by the clinic. Results vary from person to person.</p>';
    function show(id, animate) {
      var c = RC.case(id);
      view.innerHTML = RC.compare.html(id, { eager: true, className: 'ba--hero' }) +
        '<div class="smiles__cap"><span>' + esc(c.post) + '</span><button class="link-btn" type="button" data-open="treatment:' + c.treatment + '">About this treatment</button></div>';
      var ba = $('.ba', view);
      RC.compare.wire(ba);
      if (animate && window.gsap && !RC.reducedMotion()) {
        window.gsap.from(ba, { clipPath: 'inset(0 0 0 100% round 26px)', duration: 0.9, ease: 'expo.inOut' });
        setTimeout(function () { RC.compare.peek(ba); }, 600);
      }
      $$('.case', list).forEach(function (b) { var on = b.getAttribute('data-case') === id; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
    }
    list.addEventListener('click', function (e) { var b = e.target.closest('.case'); if (b && !b.classList.contains('is-on')) show(b.getAttribute('data-case'), true); });
    show(RC.cases[0].id);
  }

  /* ---------- Reviews ---------- */
  function buildReviews() {
    $('[data-reviews]').innerHTML = '<div class="reviews__track">' + RC.reviews.map(function (r, i) {
      return '<article class="rev' + (i % 2 ? ' rev--low' : '') + '">' + RC.icon('quote', 'rev__q') +
        '<p class="rev__t">' + esc(r.text) + '</p>' + (r.more ? '<p class="rev__more">' + esc(r.more) + '</p>' : '') +
        '<footer class="rev__by"><span class="rev__av">' + r.name.charAt(0) + '</span><span><strong>' + esc(r.name) + '</strong><span>' + esc(r.meta) + ' &middot; ' + esc(r.when) + '</span></span>' + RC.stars(r.stars) + '</footer></article>';
    }).join('') + '</div>';
  }

  function buildFaq() {
    $('[data-faq]').innerHTML = RC.faqs.map(function (f, i) {
      return '<details class="faq__item"' + (i === 0 ? ' open' : '') + '><summary><span>' + esc(f[0]) + '</span><span class="faq__ic">' + RC.icon('plus') + '</span></summary><p>' + esc(f[1]) + '</p></details>';
    }).join('');
    // one open at a time
    $$('.faq__item').forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) $$('.faq__item').forEach(function (o) { if (o !== d) o.open = false; }); }); });
  }

  /* ---------- Motion that belongs to this page ---------- */
  function motion() {
    var g = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
    if (!RC.fx.on) return;
    // hero: the title rises line by line, the film settles in from a slight zoom
    var title = $('[data-hero-title]');
    if (Split) {
      var s = new Split(title, { type: 'lines,words', mask: 'lines', linesClass: 'fx-line' });
      g.from(s.words, { yPercent: 120, duration: 1.3, ease: 'expo.out', stagger: 0.06, delay: 0.25 });
    }
    g.fromTo('.hero__video', { scale: 1.14 }, { scale: 1, duration: 2.4, ease: 'expo.out' });
    g.to('[data-hero-media]', { yPercent: 18, scale: 1.06, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    g.to('.hero__inner', { yPercent: -30, autoAlpha: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });

    // the clinic film opens from a card to the full width
    g.fromTo('[data-intro-film]', { clipPath: 'inset(0 14% 0 14% round 36px)' }, { clipPath: 'inset(0 0% 0 0% round 28px)', ease: 'none',
      scrollTrigger: { trigger: '[data-intro-film]', start: 'top 95%', end: 'top 25%', scrub: 0.6 } });
    g.fromTo('[data-intro-film] video', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '[data-intro-film]', start: 'top bottom', end: 'bottom top', scrub: true } });

    // treatments: the section pins and the cards slide past
    var track = $('[data-care-track]'), bar = $('[data-care-bar]');
    var dist = function () { return Math.max(0, track.scrollWidth - track.parentElement.clientWidth); };
    g.to(track, { x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: '[data-care-pin]', start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (self) { bar.style.transform = 'scaleX(' + self.progress.toFixed(3) + ')'; } } });
    g.from('.tcard', { y: 80, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.care', start: 'top 70%', once: true } });

    // reviews drift sideways as you scroll
    g.fromTo('.reviews__track', { x: 0 }, { x: function () { var t = $('.reviews__track'); return -Math.max(0, t.scrollWidth - innerWidth + 64); }, ease: 'none',
      scrollTrigger: { trigger: '.reviews', start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true } });

    // closing mark turns gently
    g.to('.cta__mark', { rotation: 8, yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildCare();
    buildRows();
    buildSmiles();
    buildReviews();
    buildFaq();
    RC.hydrateIcons(document);
    RC.smoothScroll();
    RC.headerScroll($('#hd'));
    RC.autoVideos(document);
    RC.tilt($$('.doc, .tcard'), 4);
    RC.chat.init({ teaser: 'Habari! 👋 Need a dentist? Book in a minute or ask me anything.' });
    RC.fx.init();
    motion();
    RC.compare.mount(document);
  });
})();
