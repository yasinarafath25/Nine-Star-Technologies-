// Ninestar Technologies — Interactive Core JS (Refined, Modernized, Bilingual)
// Strict Preservation of all backend hooks, event IDs, and modal behaviors

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. HEADER SCROLL GLASS BLUR EFFECT
  // ==========================================================================
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      if (siteHeader) siteHeader.classList.add('header-scrolled');
    } else {
      if (siteHeader) siteHeader.classList.remove('header-scrolled');
    }
  });

  // ==========================================================================
  // 2. MOBILE MENU DRAWER (Strict ID Preservation)
  // ==========================================================================
  const openMenuBtn = document.getElementById('openMenuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerLinks = document.querySelectorAll('.mobile-drawer-link');

  if (openMenuBtn && mobileDrawer) {
    openMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeDrawer = () => {
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeDrawer);
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });

    mobileDrawerLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // ==========================================================================
  // 3. MODAL POPUP FOR CONSULTATION / AUDIT (Strict ID Preservation)
  // ==========================================================================
  const auditModal = document.getElementById('auditModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const triggerAuditBtns = document.querySelectorAll('.trigger-audit-btn');
  const auditForm = document.getElementById('auditForm');

  const openAuditModal = (e) => {
    if (e) e.preventDefault();
    if (auditModal) {
      auditModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const firstInput = auditModal.querySelector('input');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
  };

  const closeAuditModal = () => {
    if (auditModal) {
      auditModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  triggerAuditBtns.forEach(btn => {
    btn.addEventListener('click', openAuditModal);
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAuditModal);
  if (auditModal) {
    auditModal.addEventListener('click', (e) => {
      if (e.target === auditModal) closeAuditModal();
    });
  }

  // Keyboard accessibility: ESC closes modal & drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuditModal();
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // Handle Form Submission (Strict Preservation of Submission Flow & Bengali Alert)
  if (auditForm) {
    auditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = auditForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending Request...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert('ধন্যবাদ! আপনার অডিট রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে। আমাদের টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        auditForm.reset();
        closeAuditModal();
      }, 1000);
    });
  }

  // ==========================================================================
  // 4. NUMBER COUNTER ANIMATION (Smooth Multi-Section Observer)
  // ==========================================================================
  const metricElements = document.querySelectorAll('[data-target]');
  let hasAnimated = false;

  const countUp = () => {
    const triggerBottom = window.innerHeight * 0.92;
    const metricsSection = document.querySelector('.agency-pitch-grid') || document.querySelector('.bento-showcase-grid');

    if (metricsSection && !hasAnimated) {
      const top = metricsSection.getBoundingClientRect().top;
      if (top < triggerBottom) {
        hasAnimated = true;
        metricElements.forEach(el => {
          const target = +el.getAttribute('data-target');
          const duration = 1600;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.innerText = target;
              clearInterval(timer);
            } else {
              el.innerText = Math.floor(current);
            }
          }, stepTime);
        });
      }
    }
  };

  window.addEventListener('scroll', countUp);
  countUp(); // trigger check on load

  // ==========================================================================
  // 5. 3D CURVED PERSPECTIVE FLOATING DECK - MOUSE PARALLAX TILT
  // ==========================================================================
  const deckWrapper = document.querySelector('.floating-deck-wrapper');
  const deckTrack = document.querySelector('.floating-deck-track');

  if (deckWrapper && deckTrack && window.innerWidth > 990) {
    deckWrapper.addEventListener('mousemove', (e) => {
      const rect = deckWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateY = (x / rect.width) * 10;
      const rotateX = -(y / rect.height) * 8;
      deckTrack.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    deckWrapper.addEventListener('mouseleave', () => {
      deckTrack.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
  }

  // ==========================================================================
  // 6. BILINGUAL ENGLISH & BENGALI TRANSLATION ENGINE
  // ==========================================================================
  const translations = {
    en: {
      navHome: "HOME",
      navServices: "SERVICES",
      navAbout: "ABOUT US",
      navWork: "WORK",
      navMore: "MORE LINKS",
      navClients: "Client Network",
      navShowcase: "Media & Tech Talks",
      navInsights: "Articles & Insights",
      navBtn: "GET A FREE AUDIT",
      heroBadge: "9STAR Technologies • Scaled for Global Dominance",
      heroHeadline: "Building the future with<br/>AI and strategy",
      heroSub: "We help organizations unlock growth and efficiency through data-driven consulting, intelligent automation, and high-performance engineering.",
      heroCtaView: "VIEW SERVICES",
      heroCtaStart: "GET STARTED",
      heroRating: "Rated 4.9/5 by 4,900+ clients",
      aboutEyebrow: "ABOUT US",
      aboutHeadline: `A global consulting partner<br />dedicated to building <span class="inline-badge-pill badge-cyan"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span> smarter<br /><span class="muted-text">and <span class="inline-badge-pill badge-lime"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></span> more adaptive</span>`,
      bentoCard1Desc: "Collaborating with leading AI and cloud technology providers.",
      bentoCard2Label: "Commitment to measurable",
      bentoCard2Quote: "“Their automation strategy completely reshaped how we work. It’s efficient, intelligent, and seamless.”",
      bentoCard3Label: "Data Points",
      bentoCard3Desc: "Analyzed monthly to power smarter business strategies.",
      bentoCard4Label: "Global Reach & Continents",
      servicesEyebrow: "02 / CAPABILITIES",
      servicesHeadline: "What We Build & Deliver",
      servicesCta: "Schedule Consultation →",
      s1Title: "Search Engine Optimization",
      s1Desc: "Build compounding organic authority that captures intent-rich search queries and drives perpetual revenue.",
      s2Title: "Generative Engine Optimization",
      s2Desc: "Ensure your brand is proactively cited and recommended by ChatGPT, Perplexity, Claude, and Google AI Overviews.",
      s3Title: "Web & Cloud Engineering",
      s3Desc: "Ultra-fast, modular Next.js and full-stack web applications engineered for speed, clean UX, and 100% uptime.",
      s4Title: "Performance Media & Ads",
      s4Desc: "High-return Google Search, Meta Ads, and programmatic campaigns with strict attribution and verifiable ROAS.",
      s5Title: "Conversion Rate Optimization",
      s5Desc: "Double the output of your existing traffic through data-backed UI/UX redesigns, behavioral heatmaps, and multivariate testing.",
      s6Title: "AI Automations & Agents",
      s6Desc: "Streamline operational bottlenecks with custom LLM agents, automated lead nurturing, and CRM synchronization.",
      s7Title: "Product Design & UX Audit",
      s7Desc: "Intuitive, beautiful interfaces crafted with precision design systems that captivate users and elevate brand perception.",
      s8Title: "Retention & Lifecycle Email",
      s8Desc: "Automated onboarding journeys, customer re-engagement sequences, and high-converting newsletters.",
      s9Title: "Analytics & Deep Attribution",
      s9Desc: "Complete clarity on marketing ROI with server-side tracking, BigQuery data pipelines, and real-time executive dashboards.",
      caseEyebrow: "03 / PROVEN RESULTS",
      caseHeadline: "Case Studies That Speak For Themselves",
      caseCta: "Request Full Case Library →",
      c1Title: "From invisible to fully booked across 3 countries",
      c2Title: "Scaling recurring revenue with zero wasted ad spend",
      c3Title: "Institutional leads at a fraction of benchmark cost",
      mediaEyebrow: "04 / KNOWLEDGE & MEDIA",
      mediaHeadline: "Tech Breakdowns & Strategy Sessions",
      mediaCta: "Subscribe on YouTube →",
      articlesEyebrow: "05 / INSIGHTS & STRATEGY",
      articlesHeadline: "Latest Articles",
      articlesCta: "Explore All Articles →",
      art1Title: "What Is Generative Engine Optimisation (GEO) And Why It Dominates 2026",
      art1Desc: "GEO is the revolutionary marketing concept replacing manual search queries. Discover how AI answer engines index knowledge and how your company can become the top recommended source.",
      art2Title: "Why Legacy WordPress Sites Lose 60% of Mobile Visitors (And How We Fix It)",
      art2Desc: "Bloated plugins and sluggish Core Web Vitals kill conversions before prospects even read your offer. Here is how modern JAMstack architecture restores peak performance.",
      art3Title: "The Real Reason Your Google Ads CPA Is Rising — And The Modern B2B Fix",
      art3Desc: "Blind broad-match bidding and lack of first-party data signals are burning client capital. We reveal the exact full-funnel structure we run across our portfolio.",
      topicsHeadline: "Explore Topics & Disciplines",
      topicsSub: "Practical insights straight from our engineers and marketers running high-volume enterprise infrastructure.",
      ctaHeadline: "Let’s start a conversation.",
      ctaSub: "Ready to discover what’s holding your digital growth back? Get a comprehensive audit from 9STAR Technologies today.",
      ctaBtn: "Book a Free Tech Audit",
      footerBannerTitle: "Ready to transform your business with cutting-edge technology and predictable growth?",
      footerAuditBtn: "Book a Free Audit",
      footerDesc: "Premier technology & growth agency helping ambitious organizations scale through bespoke software, Generative Engine Optimization, performance media, and AI pipelines.",
      footerServicesTitle: "Services",
      footerCompanyTitle: "Company",
      footerAccredTitle: "Accreditations",
      modalTag: "FREE STRATEGY SESSION",
      modalTitle: "Get Your Free Tech & Growth Audit",
      modalSub: "Leave your details below and our senior growth architects will inspect your digital stack, SEO, and speed benchmarks within 24 hours.",
      formName: "Your Full Name",
      formEmail: "Work Email",
      formUrl: "Website / Company URL",
      formSubmit: "Submit Audit Request"
    },
    bn: {
      navHome: "হোম",
      navServices: "সার্ভিসসমূহ",
      navAbout: "আমাদের সম্পর্কে",
      navWork: "প্রজেক্টসমূহ",
      navMore: "অন্যান্য লিঙ্ক",
      navClients: "ক্লায়েন্ট নেটওয়ার্ক",
      navShowcase: "মিডিয়া ও আলোচনা",
      navInsights: "ইনসাইটস ও আর্টিকেল",
      navBtn: "ফ্রি অডিট নিন",
      heroBadge: "নাইনস্টার টেকনোলজিস • বিশ্বমানের প্রবৃদ্ধি",
      heroHeadline: "এআই এবং আধুনিক কৌশলে<br/>আগামীর ভবিষ্যৎ নির্মাণ",
      heroSub: "আমরা ডেটা-চালিত ইঞ্জিনিয়ারিং, ইন্টেলিজেন্ট অটোমেশন এবং কৌশলগত পরামর্শের মাধ্যমে ব্যবসায়ের দ্রুত প্রবৃদ্ধি নিশ্চিত করি।",
      heroCtaView: "সার্ভিস দেখুন",
      heroCtaStart: "শুরু করুন",
      heroRating: "৪,৯০০+ ক্লায়েন্টদের দ্বারা রেটিং ৪.৯/৫",
      aboutEyebrow: "আমাদের সম্পর্কে",
      aboutHeadline: `একটি গ্লোবাল কনসাল্টিং পার্টনার<br />যা গড়ে তুলছে <span class="inline-badge-pill badge-cyan"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span> আরও স্মার্ট<br /><span class="muted-text">এবং <span class="inline-badge-pill badge-lime"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg></span> অভিযোজ্য প্ল্যাটফর্ম</span>`,
      bentoCard1Desc: "বিশ্বসেরা এআই এবং ক্লাউড প্রযুক্তি পার্টনারদের সাথে কোলাবোরেশন।",
      bentoCard2Label: "পরিমাপযোগ্য ফলাফলে প্রতিশ্রুতি",
      bentoCard2Quote: "“তাদের অটোমেশন স্ট্র্যাটেজি আমাদের কাজের ধরন পুরোপুরি বদলে দিয়েছে। এটি অত্যন্ত দ্রুত, স্মার্ট এবং নিখুঁত।”",
      bentoCard3Label: "ডেটা পয়েন্ট",
      bentoCard3Desc: "স্মার্ট ব্যবসায়িক সিদ্ধান্তের জন্য প্রতিমাসে বিশ্লেষিত।",
      bentoCard4Label: "গ্লোবাল উপস্থিতি ও মহাদেশ",
      servicesEyebrow: "০২ / সক্ষমতা",
      servicesHeadline: "আমাদের সেবা ও সমাধান",
      servicesCta: "পরামর্শের জন্য শিডিউল করুন →",
      s1Title: "সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO)",
      s1Desc: "অর্গানিক অথরিটি তৈরি করুন যা নিয়মিত গ্রাহক এবং দীর্ঘমেয়াদি রেভিনিউ নিশ্চিত করে।",
      s2Title: "জেনারেটিভ ইঞ্জিন অপ্টিমাইজেশন (GEO)",
      s2Desc: "ChatGPT, Perplexity এবং Google AI তে আপনার ব্র্যান্ডের রিকমেন্ডেশন নিশ্চিত করুন।",
      s3Title: "ওয়েব ও ক্লাউড ইঞ্জিনিয়ারিং",
      s3Desc: "Next.js এবং ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন যা গতি এবং ১০০% আপটাইমের জন্য অপ্টিমাইজড।",
      s4Title: "পারফরম্যান্স মিডিয়া ও বিজ্ঞাপন",
      s4Desc: "গুগল সার্চ ও মেটা বিজ্ঞাপনের মাধ্যমে সর্বোচ্চ আরওএএস (ROAS) অর্জন।",
      s5Title: "কনভার্সন রেট অপ্টিমাইজেশন (CRO)",
      s5Desc: "ডাটা-চালিত ইউআই/ইউএক্স রিডিজাইন এবং হিটম্যাপ অ্যানালাইসিসের মাধ্যমে সেলস দ্বিগুণ করুন।",
      s6Title: "এআই অটোমেশন ও এজেন্টস",
      s6Desc: "কাস্টম এলএলএম এজেন্ট এবং সিআরএম অটোমেশনের মাধ্যমে কাজের গতি বাড়ান।",
      s7Title: "প্রোডাক্ট ডিজাইন ও ইউআই/ইউএক্স অডিট",
      s7Desc: "আধুনিক ডিজাইন সিস্টেমের মাধ্যমে আকর্ষণীয় এবং ব্যবহারকারী-বান্ধব ইন্টারফেস।",
      s8Title: "রিটেনশন ও লাইফসাইকেল ইমেইল",
      s8Desc: "স্বয়ংক্রিয় অনবোর্ডিং এবং কাস্টমার রি-এনগেজমেন্ট ইমেইল ফানেল।",
      s9Title: "অ্যানালিটিক্স ও ডিপ অ্যাট্রিবিউশন",
      s9Desc: "সার্ভার-সাইড ট্র্যাকিং এবং এক্সিকিউটিভ ড্যাশবোর্ডের মাধ্যমে নিখুঁত আরওআই পর্যবেক্ষণ।",
      caseEyebrow: "০৩ / প্রমাণিত ফলাফল",
      caseHeadline: "আমাদের সফলতার কেস স্টাডি",
      caseCta: "সম্পূর্ণ কেস লাইব্রেরি দেখুন →",
      c1Title: "৩টি দেশে শূন্য থেকে ১০০% ফুললি বুকড",
      c2Title: "কোনো অপ্রয়োজনীয় খরচ ছাড়াই রিকারিং রেভিনিউ বৃদ্ধি",
      c3Title: "স্বল্প খরচে প্রাতিষ্ঠানিক হাই-ভ্যালু লিড অর্জন",
      mediaEyebrow: "০৪ / নলেজ ও মিডিয়া",
      mediaHeadline: "টেক অ্যানালাইসিস ও স্ট্র্যাটেজি সেশন",
      mediaCta: "ইউটিউবে সাবস্ক্রাইব করুন →",
      articlesEyebrow: "০৫ / ইনসাইটস ও স্ট্র্যাটেজি",
      articlesHeadline: "সর্বশেষ আর্টিকেল",
      articlesCta: "সকল আর্টিকেল দেখুন →",
      art1Title: "জেনারেটিভ ইঞ্জিন অপ্টিমাইজেশন (GEO) কী এবং ২০২৬ সালে কেন এটি অপরিহার্য",
      art1Desc: "জিইও হলো আধুনিক মার্কেটিংয়ের নতুন বিপ্লব। জানুন কীভাবে এআই আনসার ইঞ্জিন আপনার ব্র্যান্ডকে প্রথমে তুলে ধরবে।",
      art2Title: "কেন পুরোনো ওয়ার্ডপ্রেস সাইট ৬০% মোবাইল ভিজিটর হারায় (এবং আমাদের সমাধান)",
      art2Desc: "ভারী প্লাগইন এবং ধীরগতি কীভাবে কনভার্সন নষ্ট করে এবং জ্যামস্ট্যাক কীভাবে তা দ্রুত করে।",
      art3Title: "গুগল অ্যাডসের সিপিএ বেড়ে যাওয়ার আসল কারণ ও আধুনিক সমাধান",
      art3Desc: "ব্লাইন্ড বিডিং বন্ধ করে কীভাবে ফার্স্ট-পার্টি ডেটা দিয়ে লাভজনক অ্যাড রান করবেন।",
      topicsHeadline: "টপিক ও প্রযুক্তি অন্বেষণ",
      topicsSub: "আমাদের সিনিয়র ইঞ্জিনিয়ার এবং গ্রোথ মার্কেটারদের প্রত্যক্ষ অভিজ্ঞতা ও পরামর্শ।",
      ctaHeadline: "চলুন শুরু করি এক নতুন যাত্রা।",
      ctaSub: "আপনার ডিজিটাল প্রবৃদ্ধির পথে কী বাধা রয়েছে তা জানতে আজই নাইনস্টার টেকনোলজিস থেকে ফ্রি অডিট গ্রহণ করুন।",
      ctaBtn: "ফ্রি টেক অডিট বুক করুন",
      footerBannerTitle: "আধুনিক প্রযুক্তি ও নিশ্চিত প্রবৃদ্ধির সাথে আপনার ব্যবসাকে রূপান্তর করতে প্রস্তুত?",
      footerAuditBtn: "ফ্রি অডিট বুক করুন",
      footerDesc: "শীর্ষস্থানীয় প্রযুক্তি ও গ্রোথ এজেন্সি যা কাস্টম সফটওয়্যার, জিইও এবং এআই পাইপলাইনের মাধ্যমে প্রতিষ্ঠানগুলোকে এগিয়ে নিয়ে যায়।",
      footerServicesTitle: "সার্ভিস",
      footerCompanyTitle: "কোম্পানি",
      footerAccredTitle: "স্বীকৃতি",
      modalTag: "ফ্রি স্ট্র্যাটেজি সেশন",
      modalTitle: "আপনার ফ্রি টেক ও গ্রোথ অডিট নিন",
      modalSub: "নিচে আপনার তথ্য দিন এবং আমাদের টিম ২৪ ঘণ্টার মধ্যে আপনার ওয়েবসাইট, এসইও এবং টেক স্ট্যাক বিশ্লেষণ করবে।",
      formName: "আপনার পূর্ণ নাম",
      formEmail: "কাজের ইমেইল",
      formUrl: "ওয়েবসাইট / কোম্পানির লিঙ্ক",
      formSubmit: "অডিট রিকোয়েস্ট পাঠান"
    }
  };

  let currentLang = localStorage.getItem('nst_lang') || 'en';

  const updateLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('nst_lang', lang);

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Update switcher display
    const currentTag = document.getElementById('currentLangTag');
    const altTag = document.getElementById('altLangTag');
    if (currentTag && altTag) {
      if (lang === 'bn') {
        currentTag.innerText = 'BN';
        altTag.innerText = 'EN';
      } else {
        currentTag.innerText = 'EN';
        altTag.innerText = 'BN';
      }
    }
  };

  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'en' ? 'bn' : 'en';
      updateLanguage(nextLang);
    });
  }

  // Initialize language preference
  if (currentLang === 'bn') {
    updateLanguage('bn');
  }

});
