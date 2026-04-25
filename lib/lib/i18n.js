/* lib/i18n.js
   AZ/EN UI tərcümələri + DB-dən gələn bilinqval məzmunu seçən helper.
*/

export const TRANSLATIONS = {
  az: {
    // Naviqasiya
    navAbout: "Haqqında", navSpeakers: "Spikerlər", navProgramme: "Proqram",
    navSubmit: "Məqalə göndər", navContact: "Əlaqə", navMore: "Daha çox",

    // CTA və ümumi
    submitArticle: "Məqalə göndər",
    learnMore: "Ətraflı",
    viewProfile: "Profilə bax",

    // Hero
    heroBadge: "Beynəlxalq Dənizçilik Konfransı",
    heroDate: "15–17 İyun 2026  ·  Bakı, Azərbaycan",
    countdownTitle: "Konfransa qalıb",
    days: "Gün", hours: "Saat", minutes: "Dəqiqə", seconds: "Saniyə",
    plateMaritime: "Dənizçilik təhsili",
    plateYears145: "il · 1881–2026",
    plateYears30: "il · 1996–2026",
    heroTitleA: "Azərbaycanda",
    heroTitleB: "Dənizçilik Təhsilinin",
    heroTitleC: "145 İli",
    heroSub: "Azərbaycan Dövlət Dəniz Akademiyasının 30 illiyi münasibətilə admiralları, nazirləri, təsnifat cəmiyyətlərini və yeni nəsil dənizçiləri bir araya gətirən forum.",

    // About
    aboutEyebrow: "Konfrans haqqında",
    aboutTitle: "Üç əsri əhatə edən bir miras",
    aboutLeftHead: "İrs — 1881-dən",
    aboutLeftText: "Azərbaycanda dənizçilik təhsili 1881-ci ildə Bakı Dəniz Məktəbinin Xəzər sahilində açılışı ilə başlamışdır. 145 il ərzində bu məktəbin varisləri Azərbaycanın bayrağını dünya dənizlərində daşıyan kapitanları, mühəndisləri və gəmi memarlarını yetişdirmişdir.",
    aboutRightHead: "ADDA-nın otuz ili",
    aboutRightText: "1996-cı ildə təsis edilmiş Azərbaycan Dövlət Dəniz Akademiyası Xəzər hövzəsinin IMO tərəfindən tanınan əsas ali dənizçilik təhsil müəssisəsidir. Otuz il ərzində 12 000-dən çox zabit yetişdirib.",
    statYears: "il", statAlumni: "məzun", statCountries: "ölkə",
    statFaculties: "fakültə", statShip: "təlim gəmisi",

    // Speakers
    speakersEyebrow: "Görkəmli iştirakçılar",
    speakersTitle: "Spikerlər və qonaqlar",
    speakersSub: "On altı ölkədən nazirlər, admirallar, təsnifat cəmiyyətlərinin rəhbərləri və akademik şəxsiyyətlər.",
    speakerLabel: "Spiker",

    // Programme
    programmeEyebrow: "Üç gün · İki istiqamət",
    programmeTitle: "Konfrans proqramı",
    day1: "1-ci gün", day2: "2-ci gün", day3: "3-cü gün",
    day1Date: "B.e., 15 İyun", day2Date: "Ç.a., 16 İyun", day3Date: "Ç., 17 İyun",
    featured: "Seçilmiş sessiya",
    noSessions: "Bu gün üçün sessiya yoxdur.",

    // Footer
    footerTagline: "Azərbaycan Dövlət Dəniz Akademiyası",
    footerDesc: "1996-cı ildən Xəzər hövzəsinin IMO tərəfindən tanınan əsas ali dənizçilik təhsil müəssisəsi, 145 illik ənənənin varisi.",
    quickLinks: "Sürətli keçidlər",
    resources: "Resurslar",
    contact: "Katibliklə əlaqə",
    accreditation: "Akkreditasiya tərəfdaşları",
    rights: "Bütün hüquqlar qorunur.",
    adminPortal: "Admin paneli",
    privacy: "Məxfilik",
    terms: "Şərtlər",
  },

  en: {
    navAbout: "About", navSpeakers: "Speakers", navProgramme: "Programme",
    navSubmit: "Submit article", navContact: "Contact", navMore: "More",

    submitArticle: "Submit article",
    learnMore: "Learn more",
    viewProfile: "View profile",

    heroBadge: "International Maritime Conference",
    heroDate: "15–17 June 2026  ·  Baku, Azerbaijan",
    countdownTitle: "Conference begins in",
    days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
    plateMaritime: "Maritime education",
    plateYears145: "years · 1881–2026",
    plateYears30: "years · 1996–2026",
    heroTitleA: "145 Years of",
    heroTitleB: "Maritime Education",
    heroTitleC: "in Azerbaijan",
    heroSub: "Marking the 30th anniversary of Azerbaijan State Marine Academy — a convening of admirals, ministers, classification societies and the next generation of seafarers.",

    aboutEyebrow: "About the conference",
    aboutTitle: "A legacy charted across three centuries",
    aboutLeftHead: "Heritage — since 1881",
    aboutLeftText: "Maritime instruction in Azerbaijan began in 1881 with the founding of the Baku Maritime School on the Caspian shore. For 145 years its descendants have trained the captains, engineers and naval architects who carry Azerbaijan's flag across the world's seas.",
    aboutRightHead: "Three decades of ADDA",
    aboutRightText: "Established in 1996, the Azerbaijan State Marine Academy is the principal IMO-recognised institution of higher maritime education in the Caspian basin. Over thirty years it has graduated more than 12,000 officers.",
    statYears: "years", statAlumni: "alumni", statCountries: "countries",
    statFaculties: "faculties", statShip: "training ship",

    speakersEyebrow: "Distinguished voices",
    speakersTitle: "Speakers & dignitaries",
    speakersSub: "Ministers, admirals, classification society leaders and academic luminaries from sixteen nations.",
    speakerLabel: "Speaker",

    programmeEyebrow: "Three days · Two tracks",
    programmeTitle: "Conference programme",
    day1: "Day 01", day2: "Day 02", day3: "Day 03",
    day1Date: "Mon 15 June", day2Date: "Tue 16 June", day3Date: "Wed 17 June",
    featured: "Featured session",
    noSessions: "No sessions for this day.",

    footerTagline: "Azerbaijan State Marine Academy",
    footerDesc: "The principal IMO-recognised institution of higher maritime education in the Caspian basin since 1996, heir to a 145-year tradition.",
    quickLinks: "Quick links",
    resources: "Resources",
    contact: "Contact secretariat",
    accreditation: "Accreditation partners",
    rights: "All rights reserved.",
    adminPortal: "Admin portal",
    privacy: "Privacy",
    terms: "Terms",
  },
};

/* DB-dən gələn bilinqval məzmun obyektindən mətn götürür.
   Format: { az: "...", en: "..." } və ya birbaşa string. */
export function pick(obj, lang, fallback = "") {
  if (!obj) return fallback;
  if (typeof obj === "string") return obj;
  return obj[lang] || obj.az || obj.en || fallback;
}
