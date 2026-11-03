/* Appointment booking (five steps) and the question form, shared by both concepts.
   GitHub Pages cannot receive posts, so a request goes to the clinic on WhatsApp or by email,
   and is also kept in this browser (localStorage: rc-bookings, rc-booking-draft, rc-patient, rc-questions). */
(function () {
  var RC = window.RC, $ = RC.$, $$ = RC.$$, esc = RC.esc, C = RC.company;
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var STEPS = ['Reason', 'Dentist', 'Day & time', 'Your details', 'Confirm'];
  var WHO = [['me', 'Me'], ['child', 'My child'], ['other', 'Someone else']];
  var CONTACT = [['whatsapp', 'WhatsApp'], ['call', 'Phone call'], ['sms', 'SMS'], ['email', 'Email']];

  /* ---------- Days and times the clinic is open, in Mombasa time ---------- */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); }
  function ymd(t) { return t.getUTCFullYear() + '-' + String(t.getUTCMonth() + 1).padStart(2, '0') + '-' + String(t.getUTCDate()).padStart(2, '0'); }
  RC.openDays = function (n) {
    var now = RC.now(), out = [];
    var base = Date.UTC(now.date.getUTCFullYear(), now.date.getUTCMonth(), now.date.getUTCDate());
    for (var k = 0; out.length < n && k < 40; k++) {
      var t = new Date(base + k * 86400000), dow = t.getUTCDay(), spans = C.week[dow];
      if (!spans) continue;
      var slots = [];
      spans.forEach(function (sp) { for (var m = sp[0]; m + 30 <= sp[1]; m += 30) slots.push(m); });
      if (k === 0) slots = slots.filter(function (m) { return m >= now.mins + 60; });
      if (!slots.length) continue;
      out.push({ key: ymd(t), dow: dow, d: t.getUTCDate(), month: t.getUTCMonth(), year: t.getUTCFullYear(), slots: slots,
        label: k === 0 ? 'Today' : k === 1 ? 'Tomorrow' : RC.dayNames[dow].slice(0, 3) });
    }
    return out;
  };
  RC.slotTaken = function (key, m, doctor) {
    if (!doctor || doctor === 'any') return hash(key + m + 'a') % 100 < 12;
    return hash(key + m + doctor) % 100 < 30;
  };
  RC.dayText = function (key) {
    var p = key.split('-'), t = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
    return RC.dayNames[t.getUTCDay()] + ' ' + t.getUTCDate() + ' ' + MONTHS[t.getUTCMonth()];
  };
  function doctorName(id) { var d = RC.doctors.find(function (x) { return x.id === id; }); return d ? d.name : 'First available dentist'; }
  var CONFIRM_BY = { whatsapp: 'on WhatsApp', call: 'with a phone call', sms: 'by SMS', email: 'by email' };
  function confirmLine(rec) {
    return { whatsapp: 'The clinic will confirm on WhatsApp, ' + rec.phone + '.', call: 'The clinic will call you on ' + rec.phone + ' to confirm.',
      sms: 'The clinic will confirm by SMS to ' + rec.phone + '.', email: 'The clinic will confirm by email to ' + rec.email + '.' }[rec.contact];
  }

  /* ---------- Calendar file for the visitor's own calendar ---------- */
  function ics(rec) {
    var p = rec.day.split('-'), start = Date.UTC(+p[0], +p[1] - 1, +p[2], 0, rec.time) - 3 * 3600000;
    var mins = (RC.reason(rec.reason) || { mins: 30 }).mins;
    var f = function (ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
    var txt = function (s) { return String(s).replace(/[\\;,]/g, function (c) { return '\\' + c; }).replace(/\n/g, '\\n'); };
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Royal Crown Dental Care//Booking//EN', 'BEGIN:VEVENT',
      'UID:' + rec.ref + '@royalcrowndentalcare', 'DTSTAMP:' + f(Date.now()), 'DTSTART:' + f(start), 'DTEND:' + f(start + mins * 60000),
      'SUMMARY:' + txt('Dental visit at Royal Crown Dental Care (requested)'),
      'LOCATION:' + txt(C.building + ', ' + C.street + ', ' + C.landmark + ', Mombasa'),
      'DESCRIPTION:' + txt((RC.reason(rec.reason) || {}).label + ' with ' + doctorName(rec.doctor) + '. Reference ' + rec.ref + '. The clinic confirms your time on WhatsApp or by phone. ' + C.phone),
      'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:Dental visit at Royal Crown', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }
  function download(name, text, type) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: type }));
    a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function seg(name, items, value) {
    return '<div class="seg" role="radiogroup">' + items.map(function (it) {
      return '<label class="seg__opt"><input type="radio" name="' + name + '" value="' + it[0] + '"' + (it[0] === value ? ' checked' : '') + '><span>' + esc(it[1]) + '</span></label>';
    }).join('') + '</div>';
  }

  /* =================================================================== booking */
  var S = null, root = null, form = null, armed = false;
  function blank() { return { step: 1, reason: '', notes: '', doctor: 'any', who: 'me', visit: 'new', day: '', time: null, name: '', phone: '', email: '', contact: 'whatsapp', child: '', cover: '', remind: true }; }
  function saveDraft() { var o = Object.assign({}, S, { saved: Date.now() }); RC.store.set('rc-booking-draft', o); }
  function loadDraft() {
    var d = RC.store.get('rc-booking-draft', null), s = blank();
    if (d && Date.now() - (d.saved || 0) < 7 * 86400000) Object.keys(s).forEach(function (k) { if (d[k] !== undefined) s[k] = d[k]; });
    var pt = RC.store.get('rc-patient', null);
    if (pt) ['name', 'phone', 'email', 'contact'].forEach(function (k) { if (!s[k] && pt[k]) s[k] = pt[k]; });
    if (s.day && !RC.openDays(12).some(function (d) { return d.key === s.day; })) { s.day = ''; s.time = null; }
    if (s.step > 4) s.step = 4;
    return s;
  }

  function shell() {
    var pt = RC.store.get('rc-patient', null);
    return '<div class="bk__top"><ol class="bk__steps">' + STEPS.map(function (s, i) {
      return '<li data-dot="' + (i + 1) + '"><span class="bk__dot">' + (i + 1) + '</span><span class="bk__dot-l">' + s + '</span></li>';
    }).join('') + '</ol><div class="bk__bar"><i></i></div></div>' +
      (pt && pt.name ? '<p class="bk__hello">' + RC.icon('heart') + 'Welcome back, ' + esc(pt.name.split(' ')[0]) + '. Your details are filled in.</p>' : '') +
      '<form class="bk__form" novalidate>' +
      // 1. reason
      '<fieldset class="bk__step" data-step="1"><legend class="bk__q">What brings you in?</legend>' +
      '<div class="bk__reasons">' + RC.reasons.map(function (r) {
        return '<label class="opt opt--reason' + (r.urgent ? ' opt--urgent' : '') + '"><input type="radio" name="reason" value="' + r.id + '">' +
          '<span class="opt__icon">' + RC.icon(r.icon) + '</span><span class="opt__t">' + esc(r.label) + '</span><span class="opt__s">' + esc(r.sub) + '</span>' +
          '<span class="opt__tick">' + RC.icon('check') + '</span></label>';
      }).join('') + '</div>' +
      '<div class="bk__urgent" hidden>' + RC.icon('alert') + '<div><strong>In pain right now?</strong><span>Call the emergency line and we will see you as soon as we can.</span></div>' +
      '<a class="btn btn--danger" href="' + C.mobile2Href + '">' + RC.icon('phone') + C.mobile2 + '</a><a class="btn btn--ghost" href="' + C.mobileHref + '">' + C.mobile + '</a></div>' +
      '</fieldset>' +
      // 2. dentist
      '<fieldset class="bk__step" data-step="2" hidden><legend class="bk__q">Who would you like to see?</legend>' +
      '<div class="bk__docs">' + RC.doctors.map(function (d) {
        return '<label class="opt opt--doc"><input type="radio" name="doctor" value="' + d.id + '"><span class="opt__seal">' + d.initials + '</span>' +
          '<span class="opt__t">' + esc(d.name) + '</span><span class="opt__s">' + esc(d.role) + ' · ' + esc(d.creds) + '</span><span class="opt__badge" data-rec="' + d.id + '" hidden>Recommended</span><span class="opt__tick">' + RC.icon('check') + '</span></label>';
      }).join('') +
      '<label class="opt opt--doc"><input type="radio" name="doctor" value="any"><span class="opt__seal opt__seal--any">' + RC.icon('users') + '</span><span class="opt__t">First available dentist</span><span class="opt__s">More times to choose from</span><span class="opt__tick">' + RC.icon('check') + '</span></label></div>' +
      '<div class="bk__row2"><div class="field"><span class="field__l">Who is the visit for?</span>' + seg('who', WHO, 'me') + '</div>' +
      '<div class="field"><span class="field__l">Have you been to Royal Crown before?</span>' + seg('visit', [['new', 'First visit'], ['back', 'I have been before']], 'new') + '</div></div>' +
      '</fieldset>' +
      // 3. day and time
      '<fieldset class="bk__step" data-step="3" hidden><legend class="bk__q">Pick a day and time</legend>' +
      '<div class="bk__days" role="radiogroup" aria-label="Day"></div>' +
      '<div class="bk__slots" aria-live="polite"></div>' +
      '<p class="bk__fine">' + RC.icon('info') + 'Times are requests. The clinic confirms on WhatsApp or by phone, usually within opening hours.</p>' +
      '</fieldset>' +
      // 4. details
      '<fieldset class="bk__step" data-step="4" hidden><legend class="bk__q">Your details</legend>' +
      '<div class="bk__grid">' +
      '<div class="field"><label for="bk-name">Full name</label><input id="bk-name" name="name" autocomplete="name" placeholder="For example: Amina Hassan"></div>' +
      '<div class="field"><label for="bk-phone">Mobile number</label><input id="bk-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0712 345 678"></div>' +
      '<div class="field" data-if-child hidden><label for="bk-child">Child’s name and age</label><input id="bk-child" name="child" placeholder="For example: Zara, 6"></div>' +
      '<div class="field"><label for="bk-email">Email <em>Optional</em></label><input id="bk-email" name="email" type="email" autocomplete="email" placeholder="you@example.com"></div>' +
      '<div class="field"><label for="bk-cover">Medical cover <em>Optional</em></label><input id="bk-cover" name="cover" placeholder="Insurer, if you plan to use it"></div>' +
      '<div class="field field--wide"><span class="field__l">How should we confirm?</span>' + seg('contact', CONTACT, 'whatsapp') + '</div>' +
      '<div class="field field--wide"><label for="bk-notes">Anything we should know? <em>Optional</em></label><textarea id="bk-notes" name="notes" rows="2" maxlength="400" placeholder="For example: a sensitive tooth on the lower left, or a crown that came off"></textarea></div>' +
      '</div>' +
      '<label class="check"><input type="checkbox" name="remind" checked><span class="check__box">' + RC.icon('check') + '</span><span>Remind me the day before</span></label>' +
      '<label class="check field"><input type="checkbox" name="consent"><span class="check__box">' + RC.icon('check') + '</span><span>Royal Crown may contact me about this appointment. My details stay with the clinic.</span></label>' +
      '</fieldset>' +
      // 5. review
      '<fieldset class="bk__step" data-step="5" hidden><legend class="bk__q">Check and send</legend>' +
      '<dl class="bk__review"></dl>' +
      '<div class="bk__send"><button type="button" class="btn btn--wa" data-send="wa">' + RC.icon('whatsapp') + 'Send on WhatsApp</button>' +
      '<button type="button" class="btn btn--ghost" data-send="email">' + RC.icon('mail') + 'Send by email</button></div>' +
      '<p class="bk__fine">' + RC.icon('lock') + 'Nothing is charged online. You pay at the clinic after your visit.</p>' +
      '</fieldset>' +
      '<div class="bk__nav"><button type="button" class="btn btn--ghost bk__back" data-back>' + RC.icon('left') + 'Back</button>' +
      '<p class="bk__sum" aria-live="polite"></p>' +
      '<button type="button" class="btn btn--primary bk__next" data-next>Continue' + RC.icon('right') + '</button></div>' +
      '</form>' +
      '<div class="bk__done" hidden tabindex="-1"></div>';
  }

  function sync() {
    // state -> inputs
    var f = form.elements;
    $$('input[name="reason"]', form).forEach(function (i) { i.checked = i.value === S.reason; });
    $$('input[name="doctor"]', form).forEach(function (i) { i.checked = i.value === S.doctor; });
    ['who', 'visit', 'contact'].forEach(function (n) { $$('input[name="' + n + '"]', form).forEach(function (i) { i.checked = i.value === S[n]; }); });
    ['notes', 'name', 'phone', 'email', 'child', 'cover'].forEach(function (n) { if (f[n] && f[n].value !== S[n]) f[n].value = S[n] || ''; });
    f.remind.checked = !!S.remind;
    paint();
  }

  function read() {
    var f = form.elements;
    var r = $('input[name="reason"]:checked', form), d = $('input[name="doctor"]:checked', form);
    S.reason = r ? r.value : '';
    S.doctor = d ? d.value : 'any';
    ['who', 'visit', 'contact'].forEach(function (n) { var x = $('input[name="' + n + '"]:checked', form); if (x) S[n] = x.value; });
    ['notes', 'name', 'phone', 'email', 'child', 'cover'].forEach(function (n) { if (f[n]) S[n] = f[n].value; });
    S.remind = f.remind.checked;
  }

  function paintDays() {
    var days = RC.openDays(12), box = $('.bk__days', form);
    if (!S.day || !days.some(function (d) { return d.key === S.day; })) S.day = days[0] ? days[0].key : '';
    box.innerHTML = days.map(function (d) {
      var free = d.slots.filter(function (m) { return !RC.slotTaken(d.key, m, S.doctor); }).length;
      return '<label class="day"><input type="radio" name="day" value="' + d.key + '"' + (d.key === S.day ? ' checked' : '') + '>' +
        '<span class="day__l">' + d.label + '</span><span class="day__n">' + d.d + '</span><span class="day__m">' + MONTHS[d.month].slice(0, 3) + '</span>' +
        '<span class="day__f">' + (free ? free + ' free' : 'Full') + '</span></label>';
    }).join('');
    paintSlots();
  }
  function paintSlots() {
    var day = RC.openDays(12).find(function (d) { return d.key === S.day; }), box = $('.bk__slots', form);
    if (!day) { box.innerHTML = '<p class="bk__empty">No times left for this day. Please pick another.</p>'; return; }
    var groups = [['Morning', day.slots.filter(function (m) { return m < 780; })], ['Afternoon', day.slots.filter(function (m) { return m >= 780; })]];
    if (S.time !== null && (day.slots.indexOf(S.time) < 0 || RC.slotTaken(day.key, S.time, S.doctor))) S.time = null;
    box.innerHTML = groups.filter(function (g) { return g[1].length; }).map(function (g) {
      return '<div class="slots"><p class="slots__h">' + RC.icon(g[0] === 'Morning' ? 'sun' : 'clock') + g[0] + '</p><div class="slots__row">' + g[1].map(function (m) {
        var taken = RC.slotTaken(day.key, m, S.doctor);
        return '<label class="slot' + (taken ? ' is-taken' : '') + '"><input type="radio" name="time" value="' + m + '"' + (S.time === m ? ' checked' : '') + (taken ? ' disabled' : '') + '><span>' + RC.hm(m) + '</span></label>';
      }).join('') + '</div></div>';
    }).join('') + '<button type="button" class="link-btn" data-earliest>' + RC.icon('bolt') + 'Give me the earliest free time</button>';
  }

  function paint() {
    $$('.bk__step', form).forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== S.step; });
    $$('.bk__steps li', root).forEach(function (li) {
      var n = +li.getAttribute('data-dot');
      li.classList.toggle('is-on', n === S.step);
      li.classList.toggle('is-done', n < S.step);
    });
    $('.bk__bar i', root).style.width = ((S.step - 1) / 4 * 100) + '%';
    $('[data-back]', form).style.visibility = S.step > 1 ? 'visible' : 'hidden';
    $('[data-next]', form).hidden = S.step === 5;
    $('.bk__urgent', form).hidden = S.reason !== 'pain';
    $$('[data-rec]', form).forEach(function (b) { b.hidden = !(S.reason === 'implant' && b.getAttribute('data-rec') === 'luvay'); });
    $$('[data-if-child]', form).forEach(function (el) { el.hidden = S.who !== 'child'; });
    if (S.step === 3) paintDays();
    if (S.step === 5) paintReview();
    var r = RC.reason(S.reason);
    var bits = [];
    if (r) bits.push(r.label);
    if (S.step > 2) bits.push(S.doctor === 'any' ? 'First available' : doctorName(S.doctor).replace('Dr. ', 'Dr '));
    if (S.step > 3 && S.day && S.time !== null) bits.push(RC.dayText(S.day).split(' ').slice(0, 2).join(' ') + ', ' + RC.hm(S.time));
    $('.bk__sum', form).textContent = bits.join(' · ');
  }

  function paintReview() {
    var r = RC.reason(S.reason) || {};
    var rows = [
      ['Reason', r.label + (S.notes ? ' · “' + S.notes + '”' : ''), 1],
      ['Dentist', doctorName(S.doctor) + (S.visit === 'new' ? ' · first visit' : ' · returning patient'), 2],
      ['When', RC.dayText(S.day) + ' at ' + RC.hm(S.time) + ' (about ' + (r.mins || 30) + ' min)', 3],
      ['Patient', (S.who === 'child' ? (S.child || 'My child') + ', with ' + S.name : S.who === 'other' ? 'Someone else, booked by ' + S.name : S.name), 4],
      ['Contact', RC.prettyPhone(S.phone) + (S.email ? ' · ' + S.email : '') + ' · confirm ' + CONFIRM_BY[S.contact], 4]
    ];
    if (S.cover) rows.push(['Cover', S.cover, 4]);
    $('.bk__review', form).innerHTML = rows.map(function (x) {
      return '<div><dt>' + x[0] + '</dt><dd>' + esc(x[1]) + '</dd><button type="button" class="link-btn" data-edit="' + x[2] + '">' + RC.icon('edit') + 'Edit</button></div>';
    }).join('');
  }

  var RULES4 = { name: RC.rules.name, phone: RC.rules.phoneOrIntl, consent: RC.rules.consent,
    email: function (v, f) { var c = f.querySelector('input[name="contact"]:checked'); return c && c.value === 'email' && !v.trim() ? 'Add your email so we can confirm by email.' : RC.rules.email(v); } };
  function check(step) {
    read();
    if (step === 1 && !S.reason) { shake($('.bk__reasons', form)); RC.toast('Please choose what brings you in.', null, 'warn'); return false; }
    if (step === 3 && (S.time === null || !S.day)) { shake($('.bk__slots', form)); RC.toast('Please pick a time.', null, 'warn'); return false; }
    if (step === 4) {
      armed = true;
      var bad = RC.validateForm(form, RULES4);
      if (bad) { bad.focus(); return false; }
    }
    return true;
  }
  function shake(el) { if (!el || RC.reducedMotion()) return; el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }], { duration: 380 }); }

  function go(step, focus) {
    S.step = Math.max(1, Math.min(5, step));
    paint();
    saveDraft();
    var top = root.getBoundingClientRect().top;
    if (top < 0 || top > innerHeight * 0.6) RC.scrollTo(root, { duration: 0.8 });
    if (focus !== false) {
      var leg = $('.bk__step[data-step="' + S.step + '"] .bk__q', form);
      if (leg) { leg.setAttribute('tabindex', '-1'); leg.focus({ preventScroll: true }); }
    }
  }

  function record(channel) {
    var r = RC.reason(S.reason) || {};
    return { ref: RC.reference('RC'), at: new Date().toISOString(), channel: channel, reason: S.reason, reasonLabel: r.label, doctor: S.doctor, day: S.day, time: S.time,
      who: S.who, visit: S.visit, child: S.child, name: S.name.trim(), phone: RC.prettyPhone(S.phone), email: S.email.trim(), contact: S.contact, cover: S.cover, notes: S.notes, remind: S.remind };
  }
  function message(rec) {
    return 'Hello Royal Crown Dental Care! I would like to book a visit.\n\n' +
      '• Reason: ' + rec.reasonLabel + '\n' +
      '• Dentist: ' + doctorName(rec.doctor) + '\n' +
      '• Preferred time: ' + RC.dayText(rec.day) + ', ' + RC.hm(rec.time) + '\n' +
      '• Patient: ' + (rec.who === 'child' ? (rec.child || 'my child') + ' (booked by ' + rec.name + ')' : rec.who === 'other' ? 'booked by ' + rec.name : rec.name) + (rec.visit === 'new' ? ', first visit' : ', returning patient') + '\n' +
      '• Phone: ' + rec.phone + (rec.email ? '\n• Email: ' + rec.email : '') + (rec.cover ? '\n• Medical cover: ' + rec.cover : '') +
      (rec.notes ? '\n• Notes: ' + rec.notes : '') + '\n\nPlease confirm ' + CONFIRM_BY[rec.contact] + '. Reference: ' + rec.ref;
  }
  function send(channel) {
    var rec = record(channel), text = message(rec);
    if (channel === 'wa') RC.openWa(text);
    else window.location.href = C.emailHref + '?subject=' + encodeURIComponent('Appointment request ' + rec.ref) + '&body=' + encodeURIComponent(text);
    RC.store.push('rc-bookings', rec, 20);
    RC.store.set('rc-patient', { name: rec.name, phone: rec.phone, email: rec.email, contact: rec.contact });
    try { localStorage.removeItem('rc-booking-draft'); } catch (e) { /* ignore */ }
    done(rec);
  }

  function done(rec) {
    var box = $('.bk__done', root);
    form.hidden = true;
    $('.bk__top', root).hidden = true;
    var hello = $('.bk__hello', root); if (hello) hello.hidden = true;
    box.hidden = false;
    box.innerHTML = '<div class="done">' +
      '<div class="done__tick"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg></div>' +
      '<p class="done__ref">Reference ' + rec.ref + '</p>' +
      '<h3 class="done__t">Request sent, ' + esc(rec.name.split(' ')[0]) + '!</h3>' +
      '<p class="done__p">' + esc(rec.reasonLabel) + ' with ' + esc(doctorName(rec.doctor)) + ', <strong>' + RC.dayText(rec.day) + ' at ' + RC.hm(rec.time) + '</strong>. ' + esc(confirmLine(rec)) + '</p>' +
      '<ol class="done__track"><li class="is-done"><span>' + RC.icon('check') + '</span>Requested</li><li class="is-next"><span>2</span>Clinic confirms</li><li><span>3</span>' + (rec.remind ? 'Reminder the day before' : 'See you soon') + '</li><li><span>4</span>Your visit</li></ol>' +
      '<div class="done__acts"><button type="button" class="btn btn--primary" data-ics>' + RC.icon('calcheck') + 'Add to calendar</button>' +
      '<a class="btn btn--ghost" href="' + C.directions + '" target="_blank" rel="noopener">' + RC.icon('nav') + 'Directions</a>' +
      '<button type="button" class="btn btn--ghost" data-print>' + RC.icon('print') + 'Print</button>' +
      '<button type="button" class="link-btn" data-again>' + RC.icon('repeat') + 'Book another visit</button></div>' +
      '<p class="done__fine">Did WhatsApp not open? Call ' + C.phone + ' or ' + C.mobile + ' and quote your reference.</p></div>';
    $('[data-ics]', box).addEventListener('click', function () { download('royal-crown-' + rec.ref + '.ics', ics(rec), 'text/calendar'); });
    $('[data-print]', box).addEventListener('click', function () { window.print(); });
    $('[data-again]', box).addEventListener('click', function () {
      box.hidden = true; form.hidden = false; $('.bk__top', root).hidden = false;
      var keep = { name: S.name, phone: S.phone, email: S.email, contact: S.contact };
      S = Object.assign(blank(), keep);
      sync(); go(1);
    });
    box.focus({ preventScroll: true });
    RC.scrollTo(root, { duration: 0.8 });
    if (RC.onBooked) RC.onBooked(rec);
  }

  function bind() {
    form.addEventListener('change', function (e) {
      var n = e.target.name;
      if (n === 'day') { S.day = e.target.value; S.time = null; paintSlots(); }
      else if (n === 'time') { S.time = +e.target.value; }
      else read();
      if (n === 'doctor' && S.step === 3) paintDays();
      if (n === 'reason' && S.reason) {
        var rr = RC.reason(S.reason);
        if (rr.doctor && S.doctor === 'any') { S.doctor = rr.doctor; }
      }
      sync();
      saveDraft();
      if (n === 'reason' && S.reason && S.reason !== 'pain' && S.step === 1 && !RC.reducedMotion()) setTimeout(function () { if (S.step === 1 && S.reason) go(2); }, 450);
    });
    form.addEventListener('input', function (e) { if (/^(notes|name|phone|email|child|cover)$/.test(e.target.name)) { S[e.target.name] = e.target.value; saveDraft(); } });
    RC.liveValidate(form, RULES4, function () { return armed; });
    form.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t) return;
      if (t.hasAttribute('data-next')) { if (check(S.step)) go(S.step + 1); }
      else if (t.hasAttribute('data-back')) go(S.step - 1);
      else if (t.hasAttribute('data-edit')) go(+t.getAttribute('data-edit'));
      else if (t.hasAttribute('data-send')) { read(); send(t.getAttribute('data-send')); }
      else if (t.hasAttribute('data-earliest')) {
        var days = RC.openDays(12);
        for (var i = 0; i < days.length; i++) {
          var m = days[i].slots.find(function (x) { return !RC.slotTaken(days[i].key, x, S.doctor); });
          if (m !== undefined) { S.day = days[i].key; S.time = m; break; }
        }
        paintDays();
        paint();
        saveDraft();
      }
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  RC.booking = {
    mount: function (el) {
      root = el;
      S = loadDraft();
      root.classList.add('bk');
      root.innerHTML = shell();
      form = $('.bk__form', root);
      RC.hydrateIcons(root);
      bind();
      sync();
    },
    /* preset({ reason, doctor, day, time, name, phone, step }) from buttons, pop-ups and the chat */
    preset: function (o) {
      if (!root) return;
      o = o || {};
      var box = $('.bk__done', root);
      if (!box.hidden) { box.hidden = true; form.hidden = false; $('.bk__top', root).hidden = false; }
      ['reason', 'doctor', 'day', 'time', 'name', 'phone', 'notes', 'who'].forEach(function (k) { if (o[k] !== undefined && o[k] !== '') S[k] = o[k]; });
      if (o.reason && !o.doctor) { var rr = RC.reason(o.reason); S.doctor = rr && rr.doctor ? rr.doctor : (S.doctor || 'any'); }
      sync();
      go(o.step || (o.reason ? 2 : 1), false);
      root.classList.remove('is-flash'); void root.offsetWidth; root.classList.add('is-flash');
    },
    state: function () { return S; },
    send: send
  };

  /* =================================================================== questions */
  var TOPICS = ['A treatment question', 'Prices and estimates', 'Medical cover and payment', 'Implants', 'A second opinion', 'Something else'];
  RC.inquiry = {
    mount: function (el) {
      var pt = RC.store.get('rc-patient', null) || {};
      el.classList.add('iq');
      el.innerHTML = '<form class="iq__form" novalidate>' +
        '<div class="bk__grid">' +
        '<div class="field"><label for="iq-name">Your name</label><input id="iq-name" name="name" autocomplete="name" value="' + esc(pt.name || '') + '"></div>' +
        '<div class="field"><label for="iq-phone">Mobile number</label><input id="iq-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="0712 345 678" value="' + esc(pt.phone || '') + '"></div>' +
        '<div class="field"><label for="iq-email">Email <em>Optional</em></label><input id="iq-email" name="email" type="email" autocomplete="email" value="' + esc(pt.email || '') + '"></div>' +
        '<div class="field"><label for="iq-topic">Topic</label><div class="select"><select id="iq-topic" name="topic">' + TOPICS.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('') + '</select>' + RC.icon('chevronDown') + '</div></div>' +
        '<div class="field field--wide"><label for="iq-msg">Your question</label><textarea id="iq-msg" name="message" rows="4" maxlength="1200" placeholder="Ask us anything: treatments, prices, cover, timings or a second opinion."></textarea><span class="field__count" aria-hidden="true">0 / 1200</span></div>' +
        '<div class="field field--wide"><span class="field__l">How should we reply?</span>' + seg('reply', [['whatsapp', 'WhatsApp'], ['call', 'Phone call'], ['email', 'Email']], 'whatsapp') + '</div>' +
        '</div>' +
        '<label class="check field"><input type="checkbox" name="consent"><span class="check__box">' + RC.icon('check') + '</span><span>Royal Crown may reply to me about my question.</span></label>' +
        '<div class="iq__send"><button type="button" class="btn btn--primary" data-iq="wa">' + RC.icon('whatsapp') + 'Send on WhatsApp</button><button type="button" class="btn btn--ghost" data-iq="email">' + RC.icon('mail') + 'Send by email</button></div>' +
        '</form><div class="iq__done" hidden tabindex="-1"></div>';
      var f = $('form', el), armedQ = false;
      var rules = { name: RC.rules.name, phone: RC.rules.phoneOrIntl, email: function (v, form) { return form.elements.reply.value === 'email' && !v.trim() ? 'Add your email so we can reply.' : RC.rules.email(v); }, message: RC.rules.required('Please write your question.'), consent: RC.rules.consent };
      RC.liveValidate(f, rules, function () { return armedQ; });
      f.elements.message.addEventListener('input', function () { $('.field__count', f).textContent = f.elements.message.value.length + ' / 1200'; });
      f.addEventListener('submit', function (e) { e.preventDefault(); });
      $$('[data-iq]', f).forEach(function (b) {
        b.addEventListener('click', function () {
          armedQ = true;
          var bad = RC.validateForm(f, rules);
          if (bad) { bad.focus(); return; }
          var ref = RC.reference('Q'), x = f.elements;
          var text = 'Hello Royal Crown Dental Care! I have a question (' + x.topic.value.toLowerCase() + ').\n\n' + x.message.value.trim() + '\n\n— ' + x.name.value.trim() + ', ' + RC.prettyPhone(x.phone.value) + (x.email.value ? ', ' + x.email.value.trim() : '') + '\nPlease reply by ' + ({ whatsapp: 'WhatsApp', call: 'phone call', email: 'email' })[x.reply.value] + '. Ref ' + ref;
          if (b.getAttribute('data-iq') === 'wa') RC.openWa(text);
          else window.location.href = C.emailHref + '?subject=' + encodeURIComponent('Question: ' + x.topic.value + ' (' + ref + ')') + '&body=' + encodeURIComponent(text);
          RC.store.push('rc-questions', { ref: ref, at: new Date().toISOString(), topic: x.topic.value, name: x.name.value.trim(), phone: x.phone.value, email: x.email.value, message: x.message.value.trim(), reply: x.reply.value }, 20);
          RC.store.set('rc-patient', Object.assign(RC.store.get('rc-patient', {}), { name: x.name.value.trim(), phone: RC.prettyPhone(x.phone.value), email: x.email.value.trim() }));
          var d = $('.iq__done', el);
          f.hidden = true; d.hidden = false;
          d.innerHTML = '<div class="done done--small"><div class="done__tick"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg></div>' +
            '<p class="done__ref">Reference ' + ref + '</p><h3 class="done__t">Thank you, ' + esc(x.name.value.trim().split(' ')[0]) + '!</h3>' +
            '<p class="done__p">Your question is on its way. The team replies during opening hours, usually the same day.</p>' +
            '<button type="button" class="link-btn" data-iq-again>' + RC.icon('repeat') + 'Ask another question</button></div>';
          $('[data-iq-again]', d).addEventListener('click', function () { d.hidden = true; f.hidden = false; x.message.value = ''; x.consent.checked = false; armedQ = false; x.message.focus(); });
          d.focus({ preventScroll: true });
        });
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var b = $('[data-booking]'), q = $('[data-inquiry]');
    if (b) RC.booking.mount(b);
    if (q) RC.inquiry.mount(q);
    // Any [data-book="reason:doctor"] button fills the form and scrolls to it
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-book]');
      if (!t) return;
      e.preventDefault();
      var p = (t.getAttribute('data-book') || '').split(':');
      RC.booking.preset({ reason: p[0] || '', doctor: p[1] || '' });
      RC.go('#book');
    });
  });
})();
