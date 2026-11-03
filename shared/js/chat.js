/* Royal Crown on WhatsApp: a chat that looks and feels like WhatsApp, answers from the site's own content,
   books a visit in a few taps, and hands the conversation to the clinic's real WhatsApp number. Rule based, no server. */
(function () {
  var RC = window.RC, $ = RC.$, $$ = RC.$$, esc = RC.esc;
  var C = RC.company;

  var CHIPS = [
    { label: 'Book a visit', say: 'I want to book a visit' },
    { label: 'I have a toothache', say: 'I have a toothache' },
    { label: 'Treatments', say: 'What treatments do you offer?' },
    { label: 'Opening hours', say: 'What time are you open?' },
    { label: 'Where are you?', say: 'Where are you located?' },
    { label: 'Prices and cover', say: 'How much does it cost?' }
  ];

  function strip(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9.\s'-]/g, ' '); }

  var TREAT_WORDS = {
    implants: /implant|missing tooth|missing teeth|replace a tooth|sinus lift|bone graft/,
    crowns: /\bcrowns?\b|\bcap\b|bridge/,
    veneers: /veneer|makeover|smile design|bonding|chipped front|gap in my (front )?teeth|cosmetic/,
    whitening: /whiten|white teeth|yellow teeth|stain|bleach|brighter/,
    fillings: /filling|cavity|cavities|hole in|decay/,
    rootcanal: /root canal|nerve|abscess/,
    dentures: /denture|false teeth|plate/,
    kids: /\bkids?\b|child|children|baby teeth|toddler|\bson\b|daughter|mtoto|watoto/,
    extractions: /extract|pull (out )?(a |my )?tooth|remove (a |my )?tooth|wisdom/,
    checkup: /check ?up|cleaning|clean my teeth|scale|polish|tartar/,
    scans: /x-?ray|xray|scan|\bct\b|cbct|3d|opg|panoramic/
  };

  var INTENTS = [
    { id: 'person', re: /\b(person|human|someone|receptionist|real people|staff)\b|talk to|speak to|call me back/ },
    { id: 'emergency', re: /toothache|tooth ache|\b(in|have|having|got|severe|bad|terrible|so much) pain\b|pain in my|my (tooth|teeth|gum|gums|jaw|face) (hurts|is hurting|is killing|is swollen)|throbb|swollen|swelling|bleed(ing)? (a lot|badly)|broken tooth|cracked|knocked|emergency|urgent|maumivu|linauma/ },
    { id: 'book', re: /\bbook|appointment|schedule|reserve|\bslot|come in|see (a|the) (dentist|doctor)|miadi|nataka kuja/ },
    { id: 'results', re: /before|after|results?|cases|transformation|your work/ },
    { id: 'fear', re: /scared|afraid|nervous|anxious|\bfear|phobia|hate (the )?dentist|worried|wasiwasi|naogopa|(does|will|would) (it|this|that) hurt|is it painful|painless/ },
    { id: 'price', re: /price|cost|how much|charge|\bfee|expensive|cheap|\bbei\b|pesa|ksh|shilling|quote|estimate/ },
    { id: 'cover', re: /insurance|insurer|\bcover\b|nhif|\bsha\b|jubilee|\baar\b|britam|madison|\bcic\b|m-?pesa|pay(ment)?|card|cash|instal/ },
    { id: 'hours', re: /\bopen|hours|closing|\bclose\b|what time|today|weekend|saturday|sunday|lunch|\bsaa\b/ },
    { id: 'where', re: /where|location|locat|address|direction|\bmap\b|find you|parking|\bpark\b|wapi|haile|royal court/ },
    { id: 'doctors', re: /doctor|dentist|\bdr\b|luvay|mohammed|hamid|qualif|surgeon|who will see/ },
    { id: 'breath', re: /bad breath|halitosis|mouth smells/ },
    { id: 'gums', re: /\bgums?\b|gingivitis|periodont|bleeding when i brush/ },
    { id: 'sensitive', re: /sensitiv|cold hurts|ice cream hurts/ },
    { id: 'pregnant', re: /pregnan|mimba/ },
    { id: 'braces', re: /braces|aligner|orthodont|crooked|straighten/ },
    { id: 'treatments', re: /treatments|services|what do you (do|offer)|offer|huduma|menu/ },
    { id: 'social', re: /instagram|insta|facebook|\bfb\b|social|follow/ },
    { id: 'contact', re: /contact|phone|\bcall\b|number|email|whatsapp|reach/ },
    { id: 'thanks', re: /thank|asante|shukran|\bthx\b|great|perfect|\bok\b|okay|nice|sawa|poa/ },
    { id: 'bye', re: /\bbye\b|goodbye|kwaheri|see you|later/ },
    { id: 'greet', re: /\b(hi|hello|hey|jambo|habari|mambo|sasa|niaje|hujambo|salaam|salam|salaamu|assalam\w*|good (morning|afternoon|evening))\b/ }
  ];

  function treatIn(s) {
    var hit = null;
    Object.keys(TREAT_WORDS).forEach(function (id) { if (!hit && TREAT_WORDS[id].test(s)) hit = id; });
    return hit;
  }

  var book = { label: 'Book a visit', act: 'book' };
  var person = { label: 'Chat with the team', act: 'wa-person' };
  var callEm = { label: 'Call ' + C.mobile2 + ' (emergency)', href: C.mobile2Href };

  function reply(intent, ctx, raw) {
    switch (intent) {
      case 'greet':
        var s = strip(raw || '');
        var salam = /sala(a)?m|assalam/.test(s);
        return { text: (salam ? 'Wa alaykum salaam! ' : 'Habari! ') + '👋 Karibu to Royal Crown Dental Care. I can book you in, help with a toothache, explain a treatment or show you how to find us. What would you like?', chips: CHIPS };
      case 'treatments':
        return { text: 'Everything your smile needs, under one roof. Tap one for details, or book straight away:', treatments: ['checkup', 'implants', 'veneers', 'whitening', 'crowns', 'fillings', 'rootcanal', 'kids', 'extractions', 'dentures', 'scans', 'emergency'] };
      case 'treatment':
        var t = RC.treatment(ctx);
        return { text: t.name + ': ' + t.blurb + '\n\n⏱ ' + t.time + '.', treatments: [t.id], chips: [{ label: 'Book ' + t.short.toLowerCase(), say: 'book ' + t.short }, { label: 'Other treatments', say: 'What treatments do you offer?' }] };
      case 'emergency':
        return { text: 'Sorry you’re in pain 😣 Please call our emergency line now and we’ll see you as soon as we can:\n\n📞 ' + C.mobile2 + '\n📞 ' + C.mobile + '\n\nUntil then: rinse with warm salt water, take a simple painkiller if you normally can, and don’t put aspirin on the gum. If your face is very swollen or you have a fever, get urgent care.', actions: [callEm, { label: 'Call ' + C.mobile, href: C.mobileHref }, { label: 'Book an urgent visit', act: 'flow', reason: 'pain' }] };
      case 'book':
        return null; // handled by the booking flow
      case 'hours':
        var st = RC.openState();
        return { text: (st.open ? 'We’re open right now. ' + st.sub + '.' : st.label + '. ' + st.sub + '.') + '\n\n' + C.hours.map(function (h) { return h[0] + ': ' + h[1]; }).join('\n') + '\n\nFor emergencies call ' + C.mobile2 + '.', actions: [book], location: false };
      case 'where':
        return { text: 'You’ll find us at ' + C.building + ', ' + C.street.toLowerCase() + ', ' + C.landmark.toLowerCase() + ', ' + C.city + '.', location: true, chips: [{ label: 'Opening hours', say: 'What time are you open?' }, { label: 'Book a visit', say: 'I want to book a visit' }] };
      case 'price':
        return { text: 'Every mouth is different, so the dentist gives you a written estimate after a check, before any treatment starts. If you like, send a photo or an X-ray on WhatsApp for a first idea.', actions: [book, person] };
      case 'cover':
        return { text: 'Many medical covers include dental care. Tell us your insurer when you book and we’ll confirm what’s covered before your visit. The team will also tell you which payment options suit you best.', actions: [book, person] };
      case 'doctors':
        return { text: 'You’ll be seen by one of our two dentists:', doctors: true };
      case 'results':
        return { text: 'Here are real results from our chair, as posted on our Facebook page. Tap one and drag to compare before and after 👇', cases: RC.cases.map(function (c) { return c.id; }) };
      case 'fear':
        return { text: 'You’re not alone, lots of people feel nervous. Tell us when you book: we go at your pace, explain every step first, agree a “stop” signal and make sure you’re completely numb. One patient had eight teeth out in under 45 minutes and said it was “without causing me any pain”.', actions: [book] };
      case 'breath':
        return { text: 'Bad breath usually comes from bacteria on the tongue and between teeth, or from gum disease. A check-up and professional clean often fixes it. At home: brush twice, clean between your teeth and brush your tongue.', treatments: ['checkup'] };
      case 'gums':
        return { text: 'Gums that bleed when you brush are often an early sign of gum disease, which is reversible when caught early. A check-up and a deep clean are the first steps.', treatments: ['checkup'] };
      case 'sensitive':
        return { text: 'Sensitivity to cold can come from worn enamel, receding gums or a cavity. Try a sensitive toothpaste for two weeks, and book a check so we can find the cause.', treatments: ['fillings', 'checkup'] };
      case 'pregnant':
        return { text: 'Congratulations! Check-ups and cleaning are safe and recommended in pregnancy, because gums often get more tender. Tell us you’re pregnant when you book; we avoid X-rays unless they’re really needed.', actions: [book] };
      case 'braces':
        return { text: 'For crooked or crowded teeth, the dentist will look at your bite and talk you through the options, including braces and clear aligners, and refer you if that’s best.', actions: [book, person] };
      case 'social':
        return { text: 'Follow Royal Crown for tips, offers and smile transformations:', actions: RC.socials.filter(function (x) { return x.id !== 'google'; }).map(function (x) { return { label: x.name + ' · ' + x.handle, href: x.href }; }) };
      case 'contact':
      case 'person':
        return { text: 'The team is on WhatsApp at ' + C.mobile + ', by phone on ' + C.phone + ', and by email at ' + C.email + '. Tap below and I’ll pass our chat to a person.', actions: [person, { label: 'Call ' + C.phone, href: C.phoneHref }, { label: 'Email us', href: C.emailHref }] };
      case 'thanks':
        return { text: 'Karibu sana! Anything else I can help with? 😊', chips: CHIPS };
      case 'bye':
        return { text: 'Kwaheri! Keep smiling 😁' };
      default:
        return { text: 'I’m not sure about that one yet. I can book a visit, help with pain, explain treatments, prices and cover, or pass you to a person.', chips: CHIPS, actions: [person] };
    }
  }

  function clock() { return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }

  RC.chat = {
    init: function (cfg) {
      cfg = cfg || {};
      var root = document.createElement('div');
      root.className = 'wa';
      root.innerHTML =
        '<div class="wa__teaser" hidden><button class="wa__teaser-text" type="button"><span class="wa__teaser-av"><img src="' + RC.img('logo/mark-sm.webp') + '" alt=""></span>' +
        '<span><strong>Royal Crown Dental Care</strong>' + esc(cfg.teaser || 'Habari! 👋 Need a dentist? Book in a minute or ask me anything.') + '</span></button>' +
        '<button class="wa__teaser-x" type="button" aria-label="Dismiss">' + RC.icon('close') + '</button></div>' +
        '<section class="wa__panel" id="wa-panel" data-lenis-prevent aria-label="Chat with Royal Crown Dental Care" hidden>' +
        '<header class="wa__head"><span class="wa__av"><img src="' + RC.img('logo/mark-sm.webp') + '" alt=""></span>' +
        '<span class="wa__who"><strong>Royal Crown Dental Care</strong><span class="wa__status">online</span></span>' +
        '<a class="wa__head-btn" href="' + C.phoneHref + '" aria-label="Call Royal Crown Dental Care">' + RC.icon('phone') + '</a>' +
        '<button class="wa__head-btn wa__close" type="button" aria-label="Close chat">' + RC.icon('close') + '</button></header>' +
        '<div class="wa__log" role="log" aria-live="polite" aria-relevant="additions">' +
        '<p class="wa__day">Today</p>' +
        '<p class="wa__sys">' + RC.icon('lock') + 'Answers come from Royal Crown’s assistant. Tap “Continue on WhatsApp” any time to reach a person.</p></div>' +
        '<form class="wa__form"><span class="wa__emoji" aria-hidden="true">' + RC.icon('smile') + '</span><label class="visually-hidden" for="wa-input">Message</label>' +
        '<input id="wa-input" type="text" autocomplete="off" maxlength="300" placeholder="Message">' +
        '<button type="submit" class="wa__send" aria-label="Send">' + RC.icon('send') + '</button></form>' +
        '<a class="wa__continue" target="_blank" rel="noopener" href="' + RC.wa() + '">' + RC.icon('whatsapp') + 'Continue on WhatsApp</a>' +
        '</section>' +
        '<button class="wa__launcher" type="button" aria-expanded="false" aria-controls="wa-panel" aria-label="Chat with Royal Crown on WhatsApp">' +
        RC.icon('whatsapp') + '<span class="wa__badge">1</span></button>';
      document.body.appendChild(root);

      var panel = $('.wa__panel', root), log = $('.wa__log', root), launcher = $('.wa__launcher', root);
      var input = $('#wa-input', root), teaser = $('.wa__teaser', root), status = $('.wa__status', root), cont = $('.wa__continue', root);
      var started = false, transcript = [], flow = null;

      function down() { log.scrollTop = log.scrollHeight; }
      function updateContinue() {
        var last = transcript.slice(-5).join('\n');
        cont.href = RC.wa('Hello Royal Crown! ' + (last ? 'From the website chat:\n' + last : 'I have a question.'));
      }

      function addUser(text) {
        var m = document.createElement('div');
        m.className = 'wa-msg wa-msg--out';
        m.innerHTML = '<p>' + esc(text) + '</p><span class="wa-msg__meta">' + clock() + '<i class="wa-msg__ticks">' + RC.icon('checks') + '</i></span>';
        log.appendChild(m);
        transcript.push('Me: ' + text);
        down();
        setTimeout(function () { m.classList.add('is-read'); }, 700);
      }

      function tcard(t) {
        return '<div class="wa-card" style="--c:' + t.color + '"><button type="button" class="wa-card__img" data-t="' + t.id + '"><img src="' + RC.img(t.thumb) + '" alt=""><span class="wa-card__ic">' + RC.icon(t.icon) + '</span></button>' +
          '<strong>' + esc(t.short) + '</strong><span>' + esc(t.time) + '</span>' +
          '<span class="wa-card__btns"><button type="button" data-t="' + t.id + '">Details</button><button type="button" data-tb="' + t.id + '">' + RC.icon('calendar') + 'Book</button></span></div>';
      }

      function renderBot(r) {
        var m = document.createElement('div');
        m.className = 'wa-msg wa-msg--in';
        var html = '<p>' + esc(r.text).replace(/\n/g, '<br>') + '</p>';
        if (r.location) {
          html += '<a class="wa-loc" href="' + C.maps + '" target="_blank" rel="noopener"><span class="wa-loc__map">' + RC.icon('pin') + '</span><span><strong>Royal Crown Dental Care</strong>' + esc(C.landmark) + ', Mombasa</span></a>';
        }
        if (r.summary) {
          html += '<div class="wa-sum">' + r.summary.map(function (x) { return '<span><em>' + esc(x[0]) + '</em>' + esc(x[1]) + '</span>'; }).join('') + '</div>';
        }
        html += '<span class="wa-msg__meta">' + clock() + '</span>';
        m.innerHTML = html;
        log.appendChild(m);
        transcript.push('Royal Crown: ' + r.text.split('\n')[0].slice(0, 140));
        if (r.treatments) {
          var row = document.createElement('div');
          row.className = 'wa-cards';
          row.innerHTML = r.treatments.map(function (id) { return tcard(RC.treatment(id)); }).join('');
          log.appendChild(row);
        }
        if (r.doctors) {
          var dr = document.createElement('div');
          dr.className = 'wa-cards';
          dr.innerHTML = RC.doctors.map(function (d) {
            return '<div class="wa-card wa-card--doc"><span class="wa-card__seal">' + d.initials + '</span><strong>' + esc(d.name) + '</strong><span>' + esc(d.role) + '<br>' + esc(d.creds) + '</span>' +
              '<span class="wa-card__btns"><button type="button" data-d="' + d.id + '">Profile</button><button type="button" data-db="' + d.id + '">' + RC.icon('calendar') + 'Book</button></span></div>';
          }).join('');
          log.appendChild(dr);
        }
        if (r.cases) {
          var cs = document.createElement('div');
          cs.className = 'wa-cards';
          cs.innerHTML = r.cases.map(function (id) {
            var c = RC.case(id);
            return '<div class="wa-card"><button type="button" class="wa-card__img wa-card__img--ba" data-c="' + c.id + '"><img src="' + RC.img(c.before) + '" alt=""><img src="' + RC.img(c.after) + '" alt=""></button><strong>' + esc(c.title) + '</strong><span>' + esc(c.tag) + '</span>' +
              '<span class="wa-card__btns"><button type="button" data-c="' + c.id + '">Compare</button></span></div>';
          }).join('');
          log.appendChild(cs);
        }
        if (r.actions) {
          var acts = document.createElement('div');
          acts.className = 'wa-acts';
          acts.innerHTML = r.actions.map(function (a, i) {
            if (a.href) return '<a href="' + a.href + '"' + (/^https?:/.test(a.href) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(a.label) + '</a>';
            return '<button type="button" data-i="' + i + '">' + esc(a.label) + '</button>';
          }).join('');
          $$('button', acts).forEach(function (btn) { btn.addEventListener('click', function () { act(r.actions[+btn.getAttribute('data-i')]); }); });
          log.appendChild(acts);
        }
        if (r.chips) renderChips(r.chips);
        updateContinue();
        down();
      }

      function renderChips(chips) {
        var old = $('.wa-chips', log);
        if (old) old.remove();
        var c = document.createElement('div');
        c.className = 'wa-chips';
        chips.forEach(function (ch) {
          var b = document.createElement('button');
          b.type = 'button';
          b.textContent = ch.label;
          b.addEventListener('click', function () { ask(ch.say, ch.forced); });
          c.appendChild(b);
        });
        log.appendChild(c);
        down();
      }

      function botSay(r) {
        status.textContent = 'typing…';
        var t = document.createElement('div');
        t.className = 'wa-msg wa-msg--in wa-msg--typing';
        t.setAttribute('aria-label', 'Royal Crown is typing');
        t.innerHTML = '<i></i><i></i><i></i>';
        log.appendChild(t);
        down();
        setTimeout(function () { t.remove(); status.textContent = 'online'; renderBot(r); }, RC.reducedMotion() ? 120 : 600 + Math.min(r.text.length * 4, 900));
      }

      /* ---------- Booking inside the chat: reason, day, time, name, phone, confirm ---------- */
      function flowStart(reason, doctor) {
        flow = { step: 'reason', reason: reason || '', doctor: doctor || '' };
        if (reason) return flowNext();
        return { text: 'Lovely, let’s get you booked 📅 What is the visit for?', chips: RC.reasons.map(function (r) { return { label: r.label, say: r.label, forced: { flowReason: r.id } }; }) };
      }
      function flowNext() {
        var r = RC.reason(flow.reason);
        if (!flow.doctor) flow.doctor = r && r.doctor ? r.doctor : 'any';
        if (!flow.day) {
          flow.step = 'day';
          var days = RC.openDays(6);
          return { text: (r.urgent ? 'We’ll squeeze you in. For fastest help also call ' + C.mobile2 + '.\n\n' : r.label + ', noted. ') + 'Which day suits you?',
            chips: days.map(function (d) { return { label: d.label + ' ' + d.d + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.month], say: d.label + ' ' + d.d, forced: { flowDay: d.key } }; }) };
        }
        if (flow.time == null) {
          flow.step = 'time';
          var day = RC.openDays(12).find(function (d) { return d.key === flow.day; });
          var free = day ? day.slots.filter(function (m) { return !RC.slotTaken(day.key, m, flow.doctor); }) : [];
          if (!free.length) { flow.day = ''; return { text: 'That day is full, sorry. Let’s try another.', chips: flowNext().chips }; }
          return { text: 'Here are the free times on ' + RC.dayText(flow.day) + ':', chips: free.slice(0, 10).map(function (m) { return { label: RC.hm(m), say: RC.hm(m), forced: { flowTime: m } }; }) };
        }
        if (!flow.name) { flow.step = 'name'; return { text: 'Great, ' + RC.hm(flow.time) + ' it is. What name should we book it under?' }; }
        if (!flow.phone) { flow.step = 'phone'; return { text: 'Thanks, ' + flow.name.split(' ')[0] + '! And your mobile number, so the clinic can confirm?' }; }
        flow.step = 'confirm';
        return { text: 'Here’s your request. Tap “Send on WhatsApp” and the clinic will confirm it 👇',
          summary: [['Visit', r.label], ['Dentist', flow.doctor === 'any' ? 'First available' : RC.doctors.find(function (d) { return d.id === flow.doctor; }).name], ['When', RC.dayText(flow.day) + ', ' + RC.hm(flow.time)], ['Name', flow.name], ['Mobile', RC.prettyPhone(flow.phone)]],
          actions: [{ label: 'Send on WhatsApp', act: 'flow-send' }, { label: 'Open it in the booking form', act: 'flow-form' }, { label: 'Start again', act: 'flow-restart' }] };
      }
      function flowInput(text) {
        var s = strip(text);
        if (/\b(cancel|stop|never ?mind|quit|exit)\b/.test(s)) { flow = null; return { text: 'No problem, I’ve stopped the booking. Anything else?', chips: CHIPS }; }
        if (flow.step === 'reason') {
          var tr = treatIn(s), map = { implants: 'implant', crowns: 'restore', dentures: 'restore', veneers: 'smile', whitening: 'smile', fillings: 'filling', rootcanal: 'filling', kids: 'child', extractions: 'extraction', checkup: 'checkup', scans: 'other' };
          var em = INTENTS[1].re.test(s);
          flow.reason = em ? 'pain' : tr ? map[tr] : (RC.reasons.find(function (r) { return strip(r.label) === s; }) || { id: 'other' }).id;
          return flowNext();
        }
        if (flow.step === 'day' || flow.step === 'time') return { text: 'Please tap one of the options above 🙂', chips: flowNext().chips };
        if (flow.step === 'name') {
          if (text.trim().length < 2) return { text: 'Could you type your name, please?' };
          flow.name = text.trim().replace(/^(my name is|i am|i'm|mimi ni|naitwa)\s+/i, '').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
          return flowNext();
        }
        if (flow.step === 'phone') {
          if (RC.rules.phoneOrIntl(text) !== true) return { text: 'Hmm, that doesn’t look like a mobile number. Try something like 0712 345 678.' };
          flow.phone = text.trim();
          return flowNext();
        }
        return null;
      }
      function flowMessage() {
        var r = RC.reason(flow.reason);
        return 'Hello Royal Crown Dental Care! I would like to book a visit.\n\n• Reason: ' + r.label + '\n• Dentist: ' + (flow.doctor === 'any' ? 'First available' : RC.doctors.find(function (d) { return d.id === flow.doctor; }).name) +
          '\n• Preferred time: ' + RC.dayText(flow.day) + ', ' + RC.hm(flow.time) + '\n• Name: ' + flow.name + '\n• Phone: ' + RC.prettyPhone(flow.phone) + '\n\n(Booked through the website chat)';
      }

      function understand(text, forced) {
        if (forced) {
          if (forced.flowReason) { flow = flow || { step: 'reason' }; flow.reason = forced.flowReason; return flowNext(); }
          if (forced.flowDay) { flow.day = forced.flowDay; flow.time = null; return flowNext(); }
          if (forced.flowTime != null) { flow.time = forced.flowTime; return flowNext(); }
          return forced;
        }
        if (flow && flow.step !== 'confirm') { var f = flowInput(text); if (f) return f; }
        var s = strip(text);
        var tr = treatIn(s);
        var hit = INTENTS.find(function (i) { return i.re.test(s); });
        if (hit && hit.id === 'book') {
          var map = { implants: 'implant', crowns: 'restore', dentures: 'restore', veneers: 'smile', whitening: 'smile', fillings: 'filling', rootcanal: 'filling', kids: 'child', extractions: 'extraction', checkup: 'checkup', scans: 'other', emergency: 'pain' };
          return flowStart(tr ? map[tr] : '');
        }
        if (hit && hit.id === 'emergency') return reply('emergency', null, text);
        if (tr && (!hit || ['treatments', 'greet', 'thanks', 'price', 'doctors'].indexOf(hit.id) > -1)) return reply('treatment', tr, text);
        return reply(hit ? hit.id : 'fallback', null, text);
      }

      function ask(text, forced) {
        var old = $('.wa-chips', log);
        if (old) old.remove();
        addUser(text);
        botSay(understand(text, forced));
      }

      function act(a) {
        if (a.act === 'book') { botSay(flowStart('')); }
        else if (a.act === 'flow') { addUser('Book an urgent visit'); botSay(flowStart(a.reason)); }
        else if (a.act === 'flow-send') {
          RC.openWa(flowMessage());
          RC.store.push('rc-bookings', { ref: RC.reference('RC'), at: new Date().toISOString(), channel: 'chat', reason: flow.reason, doctor: flow.doctor, day: flow.day, time: flow.time, name: flow.name, phone: RC.prettyPhone(flow.phone) }, 20);
          RC.store.set('rc-patient', Object.assign(RC.store.get('rc-patient', {}), { name: flow.name, phone: RC.prettyPhone(flow.phone) }));
          botSay({ text: 'Sent to WhatsApp ✅ The team confirms during opening hours. See you soon, ' + flow.name.split(' ')[0] + '!', chips: CHIPS });
          flow = null;
        } else if (a.act === 'flow-form') {
          if (RC.booking) RC.booking.preset({ reason: flow.reason, doctor: flow.doctor, day: flow.day, time: flow.time, name: flow.name, phone: flow.phone, step: 4 });
          close();
          RC.go('#book');
        } else if (a.act === 'flow-restart') { botSay(flowStart('')); }
        else if (a.act === 'wa-person') { updateContinue(); window.open(cont.href, '_blank', 'noopener'); }
      }

      log.addEventListener('click', function (e) {
        var t = e.target.closest('button');
        if (!t) return;
        if (t.hasAttribute('data-t')) RC.openTreatment(t.getAttribute('data-t'));
        else if (t.hasAttribute('data-tb')) {
          var tr = RC.treatment(t.getAttribute('data-tb'));
          addUser('Book ' + tr.short.toLowerCase());
          botSay(flowStart(tr.reason, tr.doctor || ''));
        } else if (t.hasAttribute('data-d')) RC.openDoctor(t.getAttribute('data-d'));
        else if (t.hasAttribute('data-db')) {
          var d = RC.doctors.find(function (x) { return x.id === t.getAttribute('data-db'); });
          addUser('Book with ' + d.short);
          var r = flowStart('', d.id);
          botSay(r);
        } else if (t.hasAttribute('data-c')) RC.openCase(t.getAttribute('data-c'));
      });

      function open() {
        panel.hidden = false;
        teaser.hidden = true;
        root.classList.add('is-open');
        launcher.setAttribute('aria-expanded', 'true');
        try { sessionStorage.setItem('rc-chat-seen', '1'); } catch (e) { /* ignore */ }
        if (!started) {
          started = true;
          botSay({ text: cfg.greeting || 'Karibu to Royal Crown Dental Care! 👋 I’m the clinic’s assistant. I can book you in, help with a toothache, explain treatments or show you how to find us.', chips: CHIPS });
        }
        setTimeout(function () { input.focus(); }, 60);
      }
      function close() {
        root.classList.remove('is-open');
        launcher.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      }

      launcher.addEventListener('click', function () { if (panel.hidden) open(); else close(); });
      $('.wa__close', root).addEventListener('click', function () { close(); launcher.focus(); });
      panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); launcher.focus(); } });
      $('.wa__form', root).addEventListener('submit', function (e) {
        e.preventDefault();
        var v = input.value.trim();
        if (!v) return;
        input.value = '';
        ask(v);
      });
      $('.wa__teaser-text', root).addEventListener('click', open);
      $('.wa__teaser-x', root).addEventListener('click', function () {
        teaser.hidden = true;
        try { sessionStorage.setItem('rc-chat-seen', '1'); } catch (e) { /* ignore */ }
      });
      var seen = false;
      try { seen = sessionStorage.getItem('rc-chat-seen') === '1'; } catch (e) { /* ignore */ }
      if (!seen) setTimeout(function () { if (panel.hidden) teaser.hidden = false; }, cfg.teaserDelay || 6000);

      RC.chat.open = open;
      RC.chat.close = close;
      RC.chat.ask = function (text) { open(); setTimeout(function () { ask(text); }, started ? 50 : 1400); };
    }
  };

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-chat]');
    if (!t || !RC.chat.ask) return;
    e.preventDefault();
    var q = t.getAttribute('data-chat');
    if (q) RC.chat.ask(q); else RC.chat.open();
  });
})();
