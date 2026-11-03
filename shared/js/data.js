/* Royal Crown Dental Care: the clinic, its dentists, treatments, real cases, reviews and answers.
   Real details come from the clinic's Facebook page, its signboard and its Google listing (see README). */
(function () {
  var RC = window.RC;

  RC.company = {
    name: 'Royal Crown Dental Care',
    kind: 'Dental and Implant Clinic',
    building: 'Husseini Manzil',
    street: 'Off Haile Selassie Avenue',
    landmark: 'Directly opposite the Royal Court Hotel',
    city: 'Mombasa CBD',
    pobox: 'P.O. Box 82458-80100, Mombasa',
    plus: 'WMR8+6VC Mombasa',
    lat: -4.0595432,
    lng: 39.6671978,
    phone: '041 222 5429', phoneHref: 'tel:+254412225429',
    mobile: '0722 901 521', mobileHref: 'tel:+254722901521',
    mobile2: '0738 420 070', mobile2Href: 'tel:+254738420070',
    wa: '254722901521',
    email: 'royalcrowndentalcare@hotmail.com', emailHref: 'mailto:royalcrowndentalcare@hotmail.com',
    maps: 'https://www.google.com/maps/place/Royal+Crown+Dental+Care/@-4.0595432,39.6671978,17z/data=!3m1!4b1!4m6!3m5!1s0x184012d8b2a6b2d7:0xca1fc7e0f62ced5e!8m2!3d-4.0595432!4d39.6671978!16s%2Fg%2F1q5blz5qx',
    directions: 'https://www.google.com/maps/dir/?api=1&destination=Royal+Crown+Dental+Care%2C+Haile+Selassie+Avenue%2C+Mombasa',
    embed: 'https://maps.google.com/maps?q=Royal%20Crown%20Dental%20Care%2C%20Haile%20Selassie%20Avenue%2C%20Mombasa&t=m&z=17&ie=UTF8&iwloc=&output=embed',
    rating: 4.4, ratingCount: 14, recommend: 92, recommendCount: 10, followers: '10K',
    hours: [['Monday to Friday', '8:30 am to 12:30 pm, 2:00 to 5:00 pm'], ['Saturday', '8:30 am to 12:30 pm'], ['Sunday', 'Closed']],
    hoursShort: [['Mon to Fri', '8:30 to 12:30 · 2:00 to 5:00'], ['Saturday', '8:30 to 12:30'], ['Sunday', 'Closed']],
    // minutes after midnight, Mombasa time; Sunday = 0
    week: { 0: null, 1: [[510, 750], [840, 1020]], 2: [[510, 750], [840, 1020]], 3: [[510, 750], [840, 1020]], 4: [[510, 750], [840, 1020]], 5: [[510, 750], [840, 1020]], 6: [[510, 750]] }
  };

  RC.socials = [
    { id: 'facebook', name: 'Facebook', handle: 'Royal Crown Dental Care · 10K followers', label: 'Royal Crown Dental Care on Facebook', href: 'https://www.facebook.com/royalcrowndentalcare' },
    { id: 'instagram', name: 'Instagram', handle: '@royalcrowndentalcare', label: 'Royal Crown Dental Care on Instagram', href: 'https://www.instagram.com/royalcrowndentalcare/' },
    { id: 'whatsapp', name: 'WhatsApp', handle: '0722 901 521', label: 'Chat with Royal Crown on WhatsApp', href: 'https://wa.me/254722901521' },
    { id: 'google', name: 'Google', handle: '4.4 stars · 14 reviews', label: 'Royal Crown Dental Care reviews on Google', href: RC.company.maps }
  ];

  RC.doctors = [
    {
      id: 'mohammed', name: 'Dr. Mohammed N. Hamid', short: 'Dr. Mohammed', initials: 'MH',
      role: 'Dental Surgeon', creds: 'BDS (Nairobi)',
      focus: ['Family check-ups', 'Crowns and bridges', 'Fillings and root canals', 'Dentures', 'Extractions'],
      bio: 'A Nairobi-trained dental surgeon who looks after whole families at Royal Crown, from a first check-up to crowns, bridges and dentures. Every step is explained before it happens, so nothing comes as a surprise.',
      quote: 'Excellent service from Dr Luvay and Dr Mohammed Hamid.', quoteBy: 'Murtaza E., Google review'
    },
    {
      id: 'luvay', name: 'Dr. Luvay M. Hamid', short: 'Dr. Luvay', initials: 'LH',
      role: 'Dental & Implant Surgeon', creds: 'BDS (Nairobi) · MSc Implantology (UK)',
      focus: ['Dental implants', 'Sinus lifts and bone grafts', '3D scan planning', 'Smile makeovers', 'Wisdom teeth'],
      bio: 'A dental and implant surgeon with a BDS from Nairobi and an MSc in Implantology from the UK. He plans implants on the clinic’s own 3D scans and replaces missing teeth with crowns that look and feel natural.',
      quote: 'Very happy with the service provided by Dr. Luvay Hamid, definitely got my smile back.', quoteBy: 'Alifya T., Google review'
    }
  ];

  /* Booking reasons: what the visitor picks first */
  RC.reasons = [
    { id: 'checkup', label: 'Check-up and clean', sub: 'About 30 to 45 minutes', icon: 'sparkletooth', mins: 30 },
    { id: 'pain', label: 'Toothache or emergency', sub: 'We see you as soon as we can', icon: 'bolt', mins: 30, urgent: true },
    { id: 'implant', label: 'Implant consultation', sub: 'With a 3D scan if needed', icon: 'implant', mins: 45, doctor: 'luvay' },
    { id: 'restore', label: 'Crowns, bridges or dentures', sub: 'Repair or replace teeth', icon: 'crown', mins: 45 },
    { id: 'smile', label: 'Veneers or whitening', sub: 'Smile makeover chat', icon: 'smile', mins: 45 },
    { id: 'filling', label: 'Filling or root canal', sub: 'Sensitive or broken tooth', icon: 'filling', mins: 60 },
    { id: 'child', label: 'Child’s visit', sub: 'Gentle and short', icon: 'kid', mins: 30 },
    { id: 'extraction', label: 'Extraction or wisdom tooth', sub: 'Assessment first', icon: 'extract', mins: 45 },
    { id: 'other', label: 'Something else', sub: 'Second opinion, X-ray, advice', icon: 'chat', mins: 30 }
  ];
  RC.reason = function (id) { return RC.reasons.find(function (r) { return r.id === id; }) || null; };

  RC.treatments = [
    {
      id: 'checkup', name: 'Check-ups and cleaning', short: 'Check-up & clean', icon: 'sparkletooth', cat: 'everyday', color: '#12B5C9',
      img: 'care/dentist-patient.webp', thumb: 'care/dentist-patient-t.webp', video: 'video/clean',
      blurb: 'A thorough check, scale and polish every six months keeps small problems small.',
      intro: 'A relaxed half hour that keeps your teeth and gums healthy. We look for early decay and gum disease, take X-rays only when they are needed, and finish with a professional scale and polish.',
      good: ['Everyone, every six months', 'Bleeding or tender gums', 'Stains from tea and coffee', 'Bad breath'],
      steps: [['Tell us how you feel', 'Any pain, sensitivity or worries, and any medicines you take.'], ['A careful look', 'Teeth, gums, bite and soft tissues, with digital X-rays if needed.'], ['Scale and polish', 'Tartar and stains removed gently, with numbing gel for sensitive teeth.'], ['Your plan', 'What is healthy, what to watch, and when to come back.']],
      time: 'About 30 to 45 minutes', after: 'Brush twice a day for two minutes, clean between your teeth daily, and book your next check in six months.',
      faq: [['Does cleaning hurt?', 'Most people feel only light scraping and vibration. Tell us if your teeth are sensitive and we will go gently, with numbing gel if needed.']],
      reason: 'checkup'
    },
    {
      id: 'implants', name: 'Dental implants', short: 'Dental implants', icon: 'implant', cat: 'restore', color: '#2F5BEA',
      img: 'care/implant-model.webp', thumb: 'care/implant-model-t.webp', journey: true,
      blurb: 'A titanium root and a natural-looking crown that replace a missing tooth for good.',
      intro: 'An implant is a small titanium root that bonds with your jawbone and holds a crown, a bridge or a denture. It looks, feels and chews like a natural tooth, and it does not need the teeth next to it to be cut down. Dr. Luvay M. Hamid holds an MSc in Implantology from the UK and plans every implant on the clinic’s own 3D scans.',
      good: ['One or more missing teeth', 'A loose bridge or denture', 'Teeth that cannot be saved', 'Anyone who wants to chew with confidence'],
      steps: [['3D scan and plan', 'We measure your bone in 3D and plan the exact position before anything begins.'], ['Gentle placement', 'The implant goes in under local anaesthetic. You feel pressure, not pain.'], ['Healing', 'Over eight to twelve weeks the implant bonds with the bone. You wear a temporary tooth if needed.'], ['Your new tooth', 'A custom crown, matched to your other teeth, is fixed on top.']],
      extra: 'Not enough bone? A bone graft or a sinus lift can build it up first, here in the clinic.',
      time: 'Usually two to three visits over about three months', after: 'Brush and clean around an implant like a natural tooth and keep your six-monthly check-ups.',
      faq: [['Am I too old for implants?', 'Age is rarely the problem. Healthy gums and enough bone matter more, and the 3D scan tells us both.'], ['How long do implants last?', 'With good care, many last for decades.']],
      reason: 'implant', doctor: 'luvay'
    },
    {
      id: 'crowns', name: 'Crowns and bridges', short: 'Crowns & bridges', icon: 'crown', cat: 'restore', color: '#E0A82E',
      img: 'care/implant-table.webp', thumb: 'care/implant-table-t.webp', caseId: 'crowns',
      blurb: 'Strong, tooth-coloured caps and bridges that rebuild broken or missing teeth.',
      intro: 'A crown covers a cracked, worn or heavily filled tooth to make it strong again. A bridge fills a gap by joining a false tooth to the teeth on either side. Both are made to match the shade and shape of your smile.',
      good: ['Cracked or worn teeth', 'Teeth after a root canal', 'Old crowns with dark edges', 'A gap from a missing tooth'],
      steps: [['Check and shade', 'We check the tooth, take X-rays and match the colour.'], ['Prepare', 'The tooth is shaped under local anaesthetic and a temporary crown goes on.'], ['Fit', 'Your permanent crown or bridge is checked for bite and fitted.']],
      time: 'Usually two visits', after: 'Treat it like a natural tooth: brush, clean between, and avoid opening bottles with your teeth.',
      faq: [['Will it look natural?', 'Yes. Modern crowns are made in tooth-coloured materials and matched to your other teeth.']],
      reason: 'restore'
    },
    {
      id: 'veneers', name: 'Veneers and smile makeovers', short: 'Smile makeovers', icon: 'smile', cat: 'cosmetic', color: '#FF5A6E',
      img: 'care/scarf-mirror.webp', thumb: 'care/scarf-mirror-t.webp', video: 'video/shade', caseId: 'makeover',
      blurb: 'Fix chips, gaps, wear and stains in a few visits with veneers, bonding and crowns.',
      intro: 'A smile makeover brings together the treatments your smile needs: veneers or bonding for chips and gaps, whitening for colour, and crowns for worn teeth. We plan it with you, shade by shade, so the result looks like you on your best day.',
      good: ['Chipped or uneven teeth', 'Gaps between front teeth', 'Worn or stained teeth', 'A smile you hide in photos'],
      steps: [['Smile consultation', 'What you would like to change, photos, and an honest view of what is possible.'], ['Your plan', 'Options, timings and costs written down before you decide.'], ['Treatment', 'Shade matching, then veneers, bonding or crowns over a few visits.'], ['Final check', 'Bite and comfort checked, and a photo of the new you.']],
      time: 'Two to four visits, depending on the plan', after: 'Avoid biting very hard things with your front teeth and keep up your check-ups.',
      faq: [['Are veneers permanent?', 'Porcelain veneers usually need a thin layer of enamel removed, so they are a long-term choice. Bonding can often be done with no drilling at all.']],
      reason: 'smile'
    },
    {
      id: 'whitening', name: 'Teeth whitening', short: 'Teeth whitening', icon: 'sparkles', cat: 'cosmetic', color: '#FFB627',
      img: 'care/smile-red.webp', thumb: 'care/smile-red-t.webp',
      blurb: 'Professional whitening that safely lifts years of tea, coffee and everyday stains.',
      intro: 'Dentist-led whitening uses professional gels that are stronger than shop kits and kinder to your gums. We check your teeth first, because fillings and crowns do not change colour and decay should be treated before whitening.',
      good: ['Yellow or dull teeth', 'Tea and coffee stains', 'Before a wedding or event', 'After braces'],
      steps: [['Check and shade', 'We record your starting shade and check for sensitivity.'], ['Protect your gums', 'A barrier keeps the gel on your teeth only.'], ['Whiten', 'In the chair, at home with custom trays, or both.'], ['Keep it bright', 'Tips and top-ups to keep your new shade.']],
      time: 'One visit, plus home trays if you choose', after: 'Skip strongly coloured food and drinks for 48 hours. Some sensitivity is normal and fades quickly.',
      faq: [['Is whitening safe?', 'Yes, when a dentist supervises it. We check your teeth and gums first and use gels that protect the enamel.']],
      reason: 'smile'
    },
    {
      id: 'fillings', name: 'Tooth-coloured fillings', short: 'White fillings', icon: 'filling', cat: 'everyday', color: '#22C3A6',
      img: 'care/exam-mirror.webp', thumb: 'care/exam-mirror-t.webp', caseId: 'filling',
      blurb: 'White fillings that match your tooth and bond to it, so less drilling is needed.',
      intro: 'Composite fillings are shaded to match your tooth and bonded in layers, so they seal the cavity and keep more of your natural tooth. We can also replace old silver fillings when they wear out.',
      good: ['A new cavity', 'Food catching in a tooth', 'Small chips', 'Worn or leaking old fillings'],
      steps: [['Numb and clean', 'Local anaesthetic, then the decay is removed.'], ['Shade and layer', 'The filling is built up in layers that match your tooth.'], ['Shape and polish', 'Your bite is checked and the filling is polished smooth.']],
      time: 'One visit, about 30 to 60 minutes', after: 'You can eat as soon as the numbness wears off. A little sensitivity for a few days is normal.',
      faq: [['Do white fillings last?', 'Yes. With good care, modern composite fillings last many years.']],
      reason: 'filling'
    },
    {
      id: 'rootcanal', name: 'Root canal treatment', short: 'Root canals', icon: 'root', cat: 'restore', color: '#7C5CFF',
      img: 'care/tooth-model.webp', thumb: 'care/tooth-model-t.webp',
      blurb: 'Saves an infected tooth and stops the throbbing, usually in one or two visits.',
      intro: 'When decay or a crack reaches the nerve, the tooth can throb, swell or turn dark. A root canal cleans out the infection, seals the inside of the tooth and saves it, which is almost always better than losing it.',
      good: ['Throbbing or night pain', 'Pain with hot or cold that lingers', 'A swollen gum or abscess', 'A darkened tooth'],
      steps: [['X-ray and numbing', 'We find the cause and make the tooth completely numb.'], ['Clean the canals', 'The infected nerve is removed and the canals are cleaned and shaped.'], ['Seal and protect', 'The canals are sealed and the tooth is filled. A crown often follows to keep it strong.']],
      time: 'One or two visits', after: 'The tooth may feel tender for a few days. Avoid chewing hard food on it until it is crowned.',
      faq: [['Is a root canal painful?', 'With modern anaesthetic it feels much like a filling. It is the infection that hurts, and treatment stops it.']],
      reason: 'filling'
    },
    {
      id: 'dentures', name: 'Dentures', short: 'Dentures', icon: 'denture', cat: 'restore', color: '#F2789F',
      img: 'care/denture-hands.webp', thumb: 'care/denture-hands-t.webp',
      blurb: 'Comfortable partial and full dentures, including dentures that clip onto implants.',
      intro: 'Well-made dentures restore your smile, your chewing and the shape of your face. Partial dentures fill gaps between your own teeth; full dentures replace a whole arch. If a denture moves when you eat, two implants can hold it firmly in place.',
      good: ['Several missing teeth', 'A loose or broken denture', 'Difficulty chewing', 'Wanting a fuller smile'],
      steps: [['Impressions', 'Accurate moulds of your mouth and bite.'], ['Try-in', 'You see and feel the teeth before the denture is finished.'], ['Fit and adjust', 'Your denture is fitted and fine-tuned for comfort.']],
      time: 'Three to five short visits', after: 'Take dentures out at night, brush them daily and keep them in water.',
      faq: [['Can my denture be fixed in?', 'Often, yes. Implant-supported dentures clip onto implants so they do not slip.']],
      reason: 'restore'
    },
    {
      id: 'kids', name: 'Children’s dentistry', short: 'Children’s dentistry', icon: 'kid', cat: 'kids', color: '#FFB627',
      img: 'care/kid-hijab.webp', thumb: 'care/kid-hijab-t.webp',
      blurb: 'Gentle first visits, sealants and fluoride that keep little teeth strong.',
      intro: 'We keep children’s visits short, gentle and fun, so they grow up happy to see the dentist. Baby teeth matter: they hold the space for adult teeth, so we look after them with sealants, fluoride and early fillings when needed.',
      good: ['A first visit by age one', 'Check-ups every six months', 'Dummy and thumb habits', 'Knocked or chipped teeth'],
      steps: [['Meet and play', 'Your child sits in the chair, rides it up and down and meets the mirror.'], ['Count the teeth', 'A quick, gentle look and a clean if they are ready.'], ['Protect', 'Fluoride varnish or sealants for the back teeth.'], ['Tips for home', 'Brushing, snacks and drinks, explained for parents.']],
      time: 'About 20 to 30 minutes', after: 'Brush twice a day with a smear of fluoride toothpaste, and help until about age seven.',
      faq: [['When should my child first see a dentist?', 'When the first tooth appears, or by their first birthday.']],
      reason: 'child'
    },
    {
      id: 'extractions', name: 'Extractions and wisdom teeth', short: 'Extractions', icon: 'extract', cat: 'everyday', color: '#2F5BEA',
      img: 'care/xray-lightbox.webp', thumb: 'care/xray-lightbox-t.webp',
      blurb: 'Careful, comfortable removal when a tooth cannot be saved, wisdom teeth included.',
      intro: 'We always try to save a tooth first. When one has to go, we check the roots on X-ray, numb the area well and work gently. One patient had eight infected teeth removed in under 45 minutes, in his words, without any pain.',
      good: ['Broken teeth that cannot be repaired', 'Painful or impacted wisdom teeth', 'Severe gum disease', 'Making space before other treatment'],
      steps: [['X-ray first', 'We see the roots and plan the gentlest way out.'], ['Numb well', 'Local anaesthetic, and we check it has worked before we start.'], ['Remove and protect', 'Gentle removal, then gauze, stitches if needed and clear aftercare.']],
      time: 'One visit; wisdom teeth may take longer', after: 'Bite on gauze, rest, avoid smoking and rinsing for 24 hours, then rinse gently with warm salt water.',
      faq: [['Should I replace the tooth?', 'Usually, yes, so neighbouring teeth do not drift. We can talk about implants, bridges or dentures.']],
      reason: 'extraction'
    },
    {
      id: 'emergency', name: 'Emergency dental care', short: 'Emergencies', icon: 'bolt', cat: 'everyday', color: '#E8112D',
      img: 'clinic/work-2-w.webp', thumb: 'clinic/work-2.webp',
      blurb: 'Toothache, swelling or a broken tooth: call the emergency line and we will see you quickly.',
      intro: 'Dental pain cannot wait for a convenient day. Call our emergency line on 0738 420 070 or 0722 901 521 and we will fit you in as soon as we can, relieve the pain first and then plan the repair.',
      good: ['Severe toothache', 'A swollen face or gum', 'A broken or knocked-out tooth', 'A lost crown or filling'],
      steps: [['Call us', '0738 420 070 or 0722 901 521, or WhatsApp a photo.'], ['Relief first', 'We find the cause and stop the pain.'], ['Plan the fix', 'A filling, root canal, crown or extraction, explained before we start.']],
      time: 'Same day where possible', after: 'Knocked-out tooth? Hold it by the white part, keep it in milk and come straight in.',
      faq: [['What if my face is very swollen?', 'Swelling with fever or difficulty swallowing needs urgent care. Call us, and go to hospital emergency if you cannot reach us.']],
      reason: 'pain'
    },
    {
      id: 'scans', name: 'Digital X-rays and 3D scans', short: 'X-rays & 3D scans', icon: 'scan', cat: 'everyday', color: '#12B5C9',
      img: 'clinic/scan-room-w.webp', thumb: 'clinic/scan-room.webp',
      blurb: 'Panoramic X-rays and 3D CT scans in the clinic for precise, safer planning.',
      intro: 'Royal Crown has its own panoramic X-ray and 3D CT scanner, so you do not need to go elsewhere for imaging. Digital X-rays use a fraction of the radiation of film, and a 3D scan shows bone, nerves and sinuses before implants or wisdom tooth surgery.',
      good: ['Implant planning', 'Wisdom teeth', 'Hidden decay and infections', 'Jaw and bite problems'],
      steps: [['Stand or sit still', 'The scanner turns around your head in a few seconds.'], ['See it on screen', 'We go through the images with you.'], ['Plan together', 'The scan shapes a safer, more precise treatment.']],
      time: 'A few minutes', after: 'Nothing to do afterwards. Tell us if you are or might be pregnant before any X-ray.',
      faq: [['Are dental X-rays safe?', 'Digital dental X-rays use very low doses, and we only take them when they change your care.']],
      reason: 'other'
    }
  ];
  RC.treatment = function (id) { return RC.treatments.find(function (t) { return t.id === id; }) || null; };
  RC.cats = [['all', 'All'], ['everyday', 'Everyday care'], ['cosmetic', 'Cosmetic'], ['restore', 'Implants & repair'], ['kids', 'Kids']];

  /* Real before-and-after cases from the clinic's Facebook posts */
  RC.cases = [
    { id: 'makeover', title: 'Smile transformation', tag: 'Smile makeover', treatment: 'veneers', before: 'ba/makeover-before.webp', after: 'ba/makeover-after.webp', w: 850, h: 424,
      text: 'Stained, worn and uneven teeth rebuilt into an even, bright smile.', post: 'Posted by the clinic as “Smile transformation”' },
    { id: 'crowns', title: 'Front crowns renewed', tag: 'Crowns', treatment: 'crowns', before: 'ba/veneers-before.webp', after: 'ba/veneers-after.webp', w: 716, h: 814,
      text: 'Old, opaque crowns with dark edges replaced by crowns that blend with the natural teeth.', post: 'From the clinic’s Facebook page' },
    { id: 'gap', title: 'Missing tooth replaced', tag: 'Implants & bridges', treatment: 'implants', before: 'ba/gap-before.webp', after: 'ba/gap-after.webp', w: 800, h: 570,
      text: 'A gap beside the canine closed with a natural-looking new tooth.', post: 'From the clinic’s Facebook page' },
    { id: 'front', title: 'Front teeth rebuilt', tag: 'Restorations', treatment: 'crowns', before: 'ba/front-before.webp', after: 'ba/front-after.webp', w: 822, h: 556,
      text: 'Broken and missing front teeth restored to a full, confident smile.', post: 'From the clinic’s Facebook page' },
    { id: 'filling', title: 'Tooth-coloured filling', tag: 'Fillings', treatment: 'fillings', before: 'ba/filling-before.webp', after: 'ba/filling-after.webp', w: 698, h: 790,
      text: 'Decay cleaned out of a back tooth and sealed with a filling that matches it.', post: 'Posted by the clinic as “Tooth colored filling”' }
  ];
  RC.case = function (id) { return RC.cases.find(function (c) { return c.id === id; }) || null; };
  RC.journey = {
    title: 'Implant on the lower right first molar',
    post: 'Posted by the clinic as “Implant placed on the lower right first molar”',
    steps: [['ba/implant-1.webp', 'The X-ray', 'The implant sits in the bone where the molar was lost.'], ['ba/implant-2.webp', 'Healed', 'The gum has healed around the implant, ready for its tooth.'], ['ba/implant-3.webp', 'The new tooth', 'A crown on the implant completes the row.']]
  };

  /* Google reviews (5 of 14, quoted as written; names shortened) */
  RC.reviews = [
    { name: 'Ejaz K.', meta: 'Local Guide · Google', when: '2 years ago', stars: 5, title: 'Outstanding dental care',
      text: 'I was in urgent need of care for multiple infected teeth, and Dr. Hamid skillfully removed all eight in less than 45 minutes, remarkably without causing me any pain.',
      more: 'What truly sets this practice apart is the family atmosphere. Both Dr. Hamid and his son, who works alongside him, are incredibly kind and professional.' },
    { name: 'Murtaza E.', meta: 'Google', when: 'a year ago', stars: 5, title: 'New technology',
      text: 'Excellent service from Dr Luvay and Dr Mohammed Hamid. Excellent new technology that I have not seen anywhere in Kenya.' },
    { name: 'Alifya T.', meta: 'Google', when: '5 years ago', stars: 5, title: 'Got my smile back',
      text: 'My experience at royal crown has been very positive and to every visit warmly welcomed with genuine care. Very happy with the service provided by dr. Luvay Hamid, definitely got my smile back :-D' },
    { name: 'Husain K.', meta: 'Google', when: '5 years ago', stars: 5, title: 'Best in town',
      text: 'I can say for sure its the best dental clinic in town.. excellent 5 star in terms of doctors, services provided and cleanliness.. they have a new 3D ct scan which was totally helpfull.' },
    { name: 'Yusuf B.', meta: 'Google', when: '5 years ago', stars: 5, title: 'Under one roof',
      text: 'Very impressed with the professionalism of the Dentist. Ultra Modern X-Ray system & Implant surgeries is a Bonus under One Roof. Highly Recommend Dental Clinic in East Africa!' }
  ];

  RC.faqs = [
    ['Do you see emergencies?', 'Yes. If you are in pain, call 0738 420 070 or 0722 901 521 and we will see you as soon as we can. For everything else, booking ahead means less waiting.'],
    ['How much will my treatment cost?', 'Every mouth is different, so we give you a written estimate after an examination and before any treatment starts. You can also send a photo or X-ray on WhatsApp for a first idea.'],
    ['Do you accept medical insurance?', 'Many medical covers include dental care. Tell us your insurer when you book and we will confirm what your cover includes before your visit.'],
    ['Are dental implants painful?', 'Implants are placed under local anaesthetic, so you feel pressure rather than pain. Most people are back at work the next day with simple painkillers.'],
    ['How often should I see the dentist?', 'Every six months for most people. Children should come when their first tooth appears, or by their first birthday.'],
    ['Is teeth whitening safe?', 'Yes, when a dentist supervises it. We check your teeth and gums first and use professional gels that protect the enamel.'],
    ['Can I bring my children?', 'Of course. We see children of all ages and keep first visits short, gentle and fun.'],
    ['Where exactly are you?', 'In Husseini Manzil, off Haile Selassie Avenue, directly opposite the Royal Court Hotel in Mombasa CBD.']
  ];

  /* Smile tips, written from the topics the clinic shares on Facebook */
  RC.tips = [
    { id: 'crown', title: 'Swallowed a crown? Don’t panic', tag: 'Crowns', mins: 2, img: 'care/implant-crown-t.webp',
      lead: 'It sounds alarming, but a swallowed crown usually passes safely within a few days.',
      body: [['What to do now', 'Stay calm and call us. If you are coughing, wheezing or have chest pain, the crown may have gone down the wrong way: go to a hospital emergency department straight away.'], ['Protect the tooth', 'Keep the tooth underneath clean and avoid chewing on that side. It can be sensitive without its crown.'], ['What happens next', 'We check the tooth, and fit a new crown or re-cement the old one if it is recovered and still fits.']] },
    { id: 'cavity', title: 'A small cavity is a big deal', tag: 'Fillings', mins: 2, img: 'care/exam-mirror-t.webp',
      lead: 'A simple cavity, when ignored, can turn into a serious emergency, not just pain.',
      body: [['How it grows', 'Decay spreads from the enamel into the softer dentine and then the nerve. Once it reaches the nerve, the tooth can throb, swell or form an abscess.'], ['Why early is easier', 'A small cavity needs a quick, white filling. Left alone, the same tooth may need a root canal and a crown, or have to come out.'], ['Signs to watch', 'Sensitivity to sweet or cold, food catching in one spot, a dark mark or a rough edge. Book a check if you notice any of them.']] },
    { id: 'baby', title: 'Baby teeth hold the space', tag: 'Kids', mins: 2, img: 'care/kid-girl-t.webp',
      lead: 'Losing a baby tooth early can start a slow chain reaction inside the mouth.',
      body: [['Teeth drift', 'Neighbouring teeth lean into the empty space, and the adult tooth underneath can be blocked or come in crooked.'], ['A tiny fix', 'A space maintainer is a small device that holds the gap open until the adult tooth arrives. It can save a child years of braces.'], ['What parents can do', 'Bring children for check-ups every six months and come in quickly if a baby tooth is knocked out or pulled early.']] },
    { id: 'dummy', title: 'Dummies after age two', tag: 'Kids', mins: 2, img: 'care/kid-boy-t.webp',
      lead: 'Long dummy or thumb habits can push teeth forward and change how a child bites and speaks.',
      body: [['What can happen', 'After about age two, a dummy or thumb can push the front teeth forward, open the bite, narrow the palate and affect speech.'], ['Easing off', 'Cut down gradually: only at bedtime first, then swap it for a comfort toy. Praise every dummy-free night.'], ['When to see us', 'If your child is over three and still sucks a dummy or thumb, we can check the bite and suggest gentle ways to stop.']] }
  ];
  RC.tip = function (id) { return RC.tips.find(function (t) { return t.id === id; }) || null; };

  /* Quiz for the lively concept: three taps to a suggested visit */
  RC.quiz = [
    { q: 'What would you most like to change?', a: [['pain', 'Stop a toothache', 'bolt'], ['gap', 'Fill a gap', 'implant'], ['colour', 'Whiter teeth', 'sparkles'], ['shape', 'Fix chips or gaps', 'smile'], ['health', 'Just a check-up', 'sparkletooth']] },
    { q: 'When did you last see a dentist?', a: [['recent', 'This year', 'calendar'], ['while', 'One or two years ago', 'clock'], ['long', 'I can’t remember', 'info']] },
    { q: 'Who is the visit for?', a: [['me', 'Me', 'user'], ['child', 'My child', 'kid'], ['family', 'The whole family', 'users']] }
  ];
})();
