/**
 * 9STAR Technologies — Dynamic Interactive Engine & Live Admin Sync
 * Renders only data from the database / admin section (No demo data).
 * Real-time synchronization across browser tabs.
 */

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
  // 2. MOBILE MENU DRAWER
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
  // 3. MODAL POPUP FOR CONSULTATION / AUDIT (Stores directly into Admin Leads)
  // ==========================================================================
  const auditModal = document.getElementById('auditModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
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

  // Delegate audit trigger clicks for both static & dynamically rendered buttons
  document.addEventListener('click', (e) => {
    const triggerBtn = e.target.closest('.trigger-audit-btn');
    if (triggerBtn) {
      openAuditModal(e);
    }
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAuditModal);
  if (auditModal) {
    auditModal.addEventListener('click', (e) => {
      if (e.target === auditModal) closeAuditModal();
    });
  }

  // Keyboard accessibility: ESC closes modal & drawer, Ctrl+Shift+A opens Admin
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAuditModal();
      if (mobileDrawer && mobileDrawer.classList.contains('active')) {
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
    // Admin shortcut: Ctrl+Shift+A
    if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.href = 'admin.html';
    }
  });

  // Handle Form Submission -> Saves to Admin Leads
  if (auditForm) {
    auditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = auditForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const nameInput = document.getElementById('clientName');
      const emailInput = document.getElementById('clientEmail');
      const websiteInput = document.getElementById('clientWebsite');

      const leadData = {
        name: nameInput ? nameInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim() : '',
        website: websiteInput ? websiteInput.value.trim() : '',
        date: new Date().toLocaleString(),
        status: 'New'
      };

      submitBtn.innerHTML = 'Sending Request...';
      submitBtn.disabled = true;

      // Save into DB
      if (window.DB && typeof window.DB.addLead === 'function') {
        window.DB.addLead(leadData);
      }

      setTimeout(() => {
        alert('ধন্যবাদ! আপনার অডিট রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে। আমাদের টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        auditForm.reset();
        closeAuditModal();
      }, 700);
    });
  }

  // ==========================================================================
  // 4. NUMBER COUNTER ANIMATION OBSERVER
  // ==========================================================================
  const triggerCountAnimation = () => {
    const metricElements = document.querySelectorAll('[data-target]');
    metricElements.forEach(el => {
      const target = +el.getAttribute('data-target');
      if (isNaN(target) || target <= 0) return;
      const duration = 1400;
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
  };

  // ==========================================================================
  // 5. ICON HELPER FOR SERVICES
  // ==========================================================================
  const getIconSvg = (iconName) => {
    const icons = {
      code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
      search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
      bot: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
      growth: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
      ads: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      design: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>',
      email: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
      cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
      shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
      rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>'
    };
    const pathContent = icons[iconName] || icons.code;
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">${pathContent}</svg>`;
  };

  const escapeHtml = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

  // ==========================================================================
  // 6. DYNAMIC RENDERING ENGINE (Strictly renders admin data, no demo data)
  // ==========================================================================
  const renderWebsite = () => {
    if (!window.DB) return;
    const data = window.DB.get();
    const settings = data.settings || {};

    // 6.1 Brand & Title
    if (settings.brandName) {
      document.title = `${settings.brandName} ${settings.brandSubtitle || ''} — Building the Future with AI & Strategy`;
      const brandTitles = document.querySelectorAll('#headerBrandName, #footerBrandTitle, #mobileBrandTitle');
      brandTitles.forEach(el => el.innerText = settings.brandName);
    }
    if (settings.brandSubtitle) {
      const brandSubs = document.querySelectorAll('#headerBrandSubtitle, #footerBrandSub');
      brandSubs.forEach(el => el.innerText = settings.brandSubtitle);
    }

    // 6.2 Hero Typography
    const heroBadge = document.getElementById('heroBadgeText');
    if (heroBadge && settings.heroBadge) heroBadge.innerText = settings.heroBadge;

    const heroHeadline = document.getElementById('heroHeadlineText');
    if (heroHeadline && settings.heroHeadline) {
      heroHeadline.innerHTML = settings.heroHeadline.replace(/\n/g, '<br/>');
    }

    const heroSub = document.getElementById('heroSubText');
    if (heroSub && settings.heroSub) heroSub.innerText = settings.heroSub;

    const heroCta1 = document.getElementById('heroCtaBtn1');
    if (heroCta1 && settings.heroCtaView) heroCta1.innerText = settings.heroCtaView;

    const heroCta2 = document.getElementById('heroCtaBtn2');
    if (heroCta2 && settings.heroCtaStart) {
      const textSpan = heroCta2.querySelector('span:not(.arrow-circle)');
      if (textSpan) textSpan.innerText = settings.heroCtaStart;
    }

    // 6.3 Hero Rating (Shown only if configured in Admin)
    const ratingWrap = document.getElementById('heroSocialProof');
    const ratingText = document.getElementById('heroRatingText');
    const ratingStars = document.getElementById('heroRatingStars');
    if (ratingWrap && ratingText) {
      if (settings.heroRatingText && settings.heroRatingText.trim() !== '') {
        ratingText.innerText = settings.heroRatingText;
        if (ratingStars) {
          const count = settings.heroRatingStars || 5;
          ratingStars.innerText = '★'.repeat(count);
        }
        ratingWrap.style.display = 'flex';
      } else {
        ratingWrap.style.display = 'none'; // Clean: no fake demo rating
      }
    }

    // 6.4 Hero Floating Deck (Shown only if enabled in Admin)
    const deckWrapper = document.getElementById('heroDeckWrapper');
    if (deckWrapper) {
      deckWrapper.style.display = settings.showFloatingDeck ? 'block' : 'none';
    }

    // 6.5 Partner Logos (Shown only if partners added in Admin)
    const partnerStrip = document.getElementById('partnerStrip');
    const partnersRow = document.getElementById('partnersRow');
    if (partnerStrip && partnersRow) {
      if (data.partners && data.partners.length > 0) {
        partnerStrip.style.display = 'block';
        partnersRow.innerHTML = data.partners.map(p => `
          <div class="partner-logo-item">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 14h9l-1 8 12-12h-9l1-8z"/></svg>
            <span>${escapeHtml(p.name)}</span>
          </div>
        `).join('');
      } else {
        partnerStrip.style.display = 'none'; // Clean: no fake partner badges
      }
    }

    // 6.6 About Us & Bento Grid
    const aboutEyebrow = document.getElementById('aboutEyebrowText');
    if (aboutEyebrow && settings.aboutEyebrow) aboutEyebrow.innerText = settings.aboutEyebrow;

    const aboutHeadline = document.getElementById('aboutHeadlineText');
    if (aboutHeadline && settings.aboutHeadline) {
      aboutHeadline.innerHTML = settings.aboutHeadline.replace(/\n/g, '<br/>');
    }

    const aboutDesc = document.getElementById('aboutDescText');
    if (aboutDesc && settings.aboutDesc) aboutDesc.innerText = settings.aboutDesc;

    // Render Bento Cards
    const bentoGrid = document.getElementById('aboutBentoGrid');
    if (bentoGrid) {
      if (settings.bentoStats && settings.bentoStats.length > 0) {
        bentoGrid.innerHTML = settings.bentoStats.map(stat => `
          <div class="bento-card-lime">
            <div>
              <span class="tag-label">${escapeHtml(stat.label || 'Metric')}</span>
              <div class="stat-huge-number">${escapeHtml(stat.value || '0')}</div>
            </div>
            <p class="stat-desc">${escapeHtml(stat.description || '')}</p>
          </div>
        `).join('');
      } else {
        // Clean default: Minimal value proposition cards without fake statistics
        bentoGrid.innerHTML = `
          <div class="bento-card-lime">
            <div>
              <span class="tag-label">Dynamic Capabilities</span>
              <div class="stat-huge-number">100%</div>
            </div>
            <p class="stat-desc">Custom-tailored modern web development, intelligent automations, and digital strategy.</p>
          </div>
          <div class="bento-card-dark">
            <span class="dark-label">Quality Assured</span>
            <span class="dark-number">Pro</span>
          </div>
        `;
      }
    }

    // 6.7 Services Section (100% Dynamic from Admin)
    const servicesGrid = document.getElementById('modernServicesGrid');
    const navDropdown = document.getElementById('navServicesDropdown');
    const footerServicesList = document.getElementById('footerServicesList');

    if (servicesGrid) {
      if (data.services.length === 0) {
        // Clean empty state (No demo data)
        servicesGrid.innerHTML = `
          <div class="empty-state-notice">
            <div class="empty-state-icon">🛠️</div>
            <h4 class="empty-state-title">কোনো সার্ভিস এখনো যুক্ত করা হয়নি</h4>
            <p class="empty-state-text">অ্যাডমিন প্যানেল থেকে আপনার সার্ভিস এবং সমাধানগুলো যুক্ত করুন। যা ব্যাকএন্ডে আপলোড দিবেন, সরাসরি এখানে দেখতে পাবেন।</p>
            <a href="admin.html" class="admin-shortcut-btn">⚙️ সার্ভিস যুক্ত করতে অ্যাডমিন প্যানেলে যান</a>
          </div>
        `;
        if (navDropdown) {
          navDropdown.innerHTML = `<a href="#services">View All Services <span>→</span></a><a href="admin.html" style="color: #0b74f5;">+ Add Service in Admin <span>⚙️</span></a>`;
        }
        if (footerServicesList) {
          footerServicesList.innerHTML = `<li><a href="#services" class="footer-link">Services</a></li>`;
        }
      } else {
        // Render real services
        servicesGrid.innerHTML = data.services.map((srv, idx) => `
          <div class="service-bento-card trigger-audit-btn" style="cursor: pointer;">
            <div class="service-card-top">
              <span class="service-index-badge">${escapeHtml(srv.number || String(idx + 1).padStart(2, '0'))}</span>
              <div class="service-icon-box">
                ${getIconSvg(srv.icon)}
              </div>
            </div>
            <h3 class="service-title">${escapeHtml(srv.title)}</h3>
            <p class="service-desc">${escapeHtml(srv.description)}</p>
            <div class="service-card-action"><span>Explore Service</span> <span>↗</span></div>
          </div>
        `).join('');

        // Dynamic Nav Dropdown
        if (navDropdown) {
          navDropdown.innerHTML = data.services.slice(0, 6).map(srv => `
            <a href="#services">${escapeHtml(srv.title)} <span>→</span></a>
          `).join('') + `<a href="#services" style="font-weight: 700; color: #0b74f5;">View All (${data.services.length}) <span>→</span></a>`;
        }

        // Dynamic Footer List
        if (footerServicesList) {
          footerServicesList.innerHTML = data.services.slice(0, 7).map(srv => `
            <li><a href="#services" class="footer-link">${escapeHtml(srv.title)}</a></li>
          `).join('');
        }
      }
    }

    // 6.8 Case Studies Section (100% Dynamic from Admin)
    const caseStudiesGrid = document.getElementById('caseStudiesGrid');
    if (caseStudiesGrid) {
      if (data.caseStudies.length === 0) {
        // Clean empty state (No demo data)
        caseStudiesGrid.innerHTML = `
          <div class="empty-state-notice dark">
            <div class="empty-state-icon">📁</div>
            <h4 class="empty-state-title">কোনো কেস স্টাডি এখনো যুক্ত করা হয়নি</h4>
            <p class="empty-state-text">অ্যাডমিন প্যানেল থেকে আপনার সফল প্রজেক্ট এবং কেস স্টাডি যুক্ত করুন।</p>
            <a href="admin.html" class="admin-shortcut-btn">⚙️ প্রজেক্ট যুক্ত করতে অ্যাডমিন প্যানেলে যান</a>
          </div>
        `;
      } else {
        // Render real case studies
        caseStudiesGrid.innerHTML = data.caseStudies.map(cs => `
          <div class="case-study-card">
            <div>
              <span class="case-study-tag">${escapeHtml(cs.tag || 'Case Study')}</span>
              <h3 class="case-study-title">${escapeHtml(cs.title)}</h3>
              <div class="case-study-metrics">
                ${cs.metric1Val ? `
                  <div>
                    <div class="case-metric-val">${escapeHtml(cs.metric1Val)}</div>
                    <div class="case-metric-label">${escapeHtml(cs.metric1Label || '')}</div>
                  </div>
                ` : ''}
                ${cs.metric2Val ? `
                  <div>
                    <div class="case-metric-val">${escapeHtml(cs.metric2Val)}</div>
                    <div class="case-metric-label">${escapeHtml(cs.metric2Label || '')}</div>
                  </div>
                ` : ''}
                ${cs.metric3Val ? `
                  <div>
                    <div class="case-metric-val">${escapeHtml(cs.metric3Val)}</div>
                    <div class="case-metric-label">${escapeHtml(cs.metric3Label || '')}</div>
                  </div>
                ` : ''}
              </div>
            </div>
            <a href="${escapeHtml(cs.link || '#case-studies')}" class="case-link-action trigger-audit-btn">
              <span>View Case Study</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        `).join('');
      }
    }

    // 6.9 Client Marquee (Shown only if clients exist)
    const clientSection = document.getElementById('clients');
    const marqueeTrack1 = document.getElementById('marqueeTrack1');
    const marqueeTrack2 = document.getElementById('marqueeTrack2');
    if (clientSection && marqueeTrack1 && marqueeTrack2) {
      if (data.clients.length === 0) {
        clientSection.style.display = 'none'; // Clean: no fake marquee
      } else {
        clientSection.style.display = 'block';
        const track1Clients = data.clients.filter(c => c.track !== 2);
        const track2Clients = data.clients.filter(c => c.track === 2);
        const list1 = track1Clients.length > 0 ? track1Clients : data.clients;
        const list2 = track2Clients.length > 0 ? track2Clients : data.clients;

        const makePills = (arr, dotColor) => {
          const pills = arr.map(c => `
            <div class="client-pill"><span class="client-dot" style="${dotColor ? 'background: ' + dotColor : ''}"></span> ${escapeHtml(c.name)}</div>
          `).join('');
          return pills + pills; // duplicate for infinite loop
        };

        marqueeTrack1.innerHTML = makePills(list1);
        marqueeTrack2.innerHTML = makePills(list2, 'var(--star-cyan)');
      }
    }

    // 6.10 Media & Video Talks (100% Dynamic from Admin)
    const videoGrid = document.getElementById('videoGrid');
    if (videoGrid) {
      if (data.videos.length === 0) {
        // Clean empty state (No demo videos)
        videoGrid.innerHTML = `
          <div class="empty-state-notice">
            <div class="empty-state-icon">🎬</div>
            <h4 class="empty-state-title">কোনো মিডিয়া বা ভিডিও সেশন এখনো যুক্ত করা হয়নি</h4>
            <p class="empty-state-text">অ্যাডমিন প্যানেল থেকে আপনার ইউটিউব বা টেক টক ভিডিও লিংক যুক্ত করুন।</p>
            <a href="admin.html" class="admin-shortcut-btn">⚙️ ভিডিও যুক্ত করতে অ্যাডমিন প্যানেলে যান</a>
          </div>
        `;
      } else {
        videoGrid.innerHTML = data.videos.map(vid => `
          <div class="video-card" onclick="window.open('${escapeHtml(vid.videoUrl || 'https://youtube.com')}', '_blank')" style="cursor: pointer;">
            <div class="video-thumb">
              ${vid.thumbnail ? `<img src="${escapeHtml(vid.thumbnail)}" alt="${escapeHtml(vid.title)}" />` : '<div style="height: 100%; display: flex; align-items: center; justify-content: center; background: #0f172a; color: #fff; font-size: 2.5rem;">▶</div>'}
              <div class="play-overlay">
                <div class="play-circle"><div class="play-triangle"></div></div>
              </div>
            </div>
            <div style="padding: 22px 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span class="service-index-badge" style="font-size: 0.7rem;">${escapeHtml(vid.tag || 'VIDEO')}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(vid.duration || 'Video')}</span>
              </div>
              <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--obsidian-900); line-height: 1.4;">
                ${escapeHtml(vid.title)}
              </h4>
            </div>
          </div>
        `).join('');
      }
    }

    // 6.11 Articles & Insights (100% Dynamic from Admin)
    const articlesContainer = document.getElementById('articlesContainer');
    if (articlesContainer) {
      if (data.articles.length === 0) {
        // Clean empty state (No demo articles)
        articlesContainer.innerHTML = `
          <div class="empty-state-notice">
            <div class="empty-state-icon">📰</div>
            <h4 class="empty-state-title">কোনো আর্টিকেল এখনো প্রকাশিত হয়নি</h4>
            <p class="empty-state-text">অ্যাডমিন প্যানেল থেকে আপনার কোম্পানির নতুন ব্লগ, রিসার্চ বা আর্টিকেল প্রকাশ করুন।</p>
            <a href="admin.html" class="admin-shortcut-btn">⚙️ আর্টিকেল যুক্ত করতে অ্যাডমিন প্যানেলে যান</a>
          </div>
        `;
      } else {
        articlesContainer.innerHTML = data.articles.map(art => `
          <a href="${escapeHtml(art.link || '#insights')}" class="article-item" style="display: block; text-decoration: none;">
            <span class="article-tag">${escapeHtml(art.tag || 'Article')}</span>
            <h3 class="article-title">${escapeHtml(art.title)}</h3>
            <p class="article-desc">${escapeHtml(art.description || '')}</p>
            <div style="display: flex; align-items: center; gap: 14px; font-size: 0.84rem; color: var(--text-muted);">
              <time>${escapeHtml(art.date || '')}</time>
              <span>·</span>
              <span>${escapeHtml(art.readTime || '3 min read')}</span>
            </div>
          </a>
        `).join('');
      }
    }

    // 6.12 Topics Pills (Dynamic from Admin)
    const topicsSection = document.getElementById('topicsSection');
    const topicsContainer = document.getElementById('topicsContainer');
    if (topicsSection && topicsContainer) {
      if (data.topics && data.topics.length > 0) {
        topicsSection.style.display = 'block';
        topicsContainer.innerHTML = data.topics.map(t => `
          <a href="#services" class="category-pill">${escapeHtml(t)}</a>
        `).join('');
      } else {
        topicsSection.style.display = 'none'; // Clean: no fake topic pills
      }
    }

    // 6.13 Prefooter CTA & Footer Settings
    const prefooterHead = document.getElementById('prefooterHeadline');
    if (prefooterHead && settings.prefooterTitle) prefooterHead.innerText = settings.prefooterTitle;

    const prefooterSub = document.getElementById('prefooterSubheadline');
    if (prefooterSub && settings.prefooterSub) prefooterSub.innerText = settings.prefooterSub;

    const footerBannerTitle = document.getElementById('footerBannerTitleText');
    if (footerBannerTitle && settings.footerBannerTitle) footerBannerTitle.innerText = settings.footerBannerTitle;

    const footerDesc = document.getElementById('footerDescText');
    if (footerDesc && settings.footerDesc) footerDesc.innerText = settings.footerDesc;

    const footerLocation = document.getElementById('footerLocationText');
    if (footerLocation && settings.location) footerLocation.innerText = settings.location;

    // Contact Email & Phone
    const email = settings.supportEmail || 'mdyasinarafath20@gmail.com';
    const phone = settings.supportPhone || '+8801988941753';

    const footerEmailLink = document.getElementById('footerDirectEmailLink');
    if (footerEmailLink) footerEmailLink.href = `mailto:${email}`;
    const footerEmailSpan = document.getElementById('footerDirectEmailSpan');
    if (footerEmailSpan) footerEmailSpan.innerText = email;

    const footerSupportEmail = document.getElementById('footerSupportEmail');
    if (footerSupportEmail) {
      footerSupportEmail.href = `mailto:${email}`;
      footerSupportEmail.innerText = email;
    }

    const footerSupportPhone = document.getElementById('footerSupportPhone');
    if (footerSupportPhone) {
      footerSupportPhone.href = `tel:${phone}`;
      footerSupportPhone.innerText = phone;
    }

    const mobileEmail = document.getElementById('mobileSupportEmail');
    if (mobileEmail) mobileEmail.innerText = email;

    // Social Links
    if (settings.socialLinks) {
      const fb = document.getElementById('socialFacebook');
      if (fb && settings.socialLinks.facebook) fb.href = settings.socialLinks.facebook;
      const li = document.getElementById('socialLinkedin');
      if (li && settings.socialLinks.linkedin) li.href = settings.socialLinks.linkedin;
      const tw = document.getElementById('socialTwitter');
      if (tw && settings.socialLinks.twitter) tw.href = settings.socialLinks.twitter;
      const yt = document.getElementById('socialYoutube');
      if (yt && settings.socialLinks.youtube) yt.href = settings.socialLinks.youtube;
    }

    triggerCountAnimation();
  };

  // Initial Render
  renderWebsite();

  // Listen to Storage updates (Live Multi-Tab Synchronization with Admin Panel)
  window.addEventListener('storage', (e) => {
    if (e.key === 'nst_site_data_v2') {
      renderWebsite();
    }
  });

  window.addEventListener('nst_data_updated', () => {
    renderWebsite();
  });

  // ==========================================================================
  // 7. BILINGUAL TRANSLATION ENGINE (Header & Core UI Labels)
  // ==========================================================================
  const uiTranslations = {
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
      servicesEyebrow: "02 / CAPABILITIES",
      servicesHeadline: "What We Build & Deliver",
      servicesCta: "Schedule Consultation →",
      caseEyebrow: "03 / PROVEN RESULTS",
      caseHeadline: "Case Studies That Speak For Themselves",
      caseCta: "Request Full Case Library →",
      mediaEyebrow: "04 / KNOWLEDGE & MEDIA",
      mediaHeadline: "Tech Breakdowns & Strategy Sessions",
      mediaCta: "Subscribe on YouTube →",
      articlesEyebrow: "05 / INSIGHTS & STRATEGY",
      articlesHeadline: "Latest Articles",
      articlesCta: "Explore All Articles →",
      topicsHeadline: "Explore Topics & Disciplines",
      topicsSub: "Practical insights straight from our engineers and marketers running high-volume enterprise infrastructure.",
      ctaHeadline: "Let’s start a conversation.",
      ctaSub: "Ready to discover what’s holding your digital growth back? Get a comprehensive audit from 9STAR Technologies today.",
      ctaBtn: "Book a Free Tech Audit",
      footerBannerTitle: "Ready to transform your business with cutting-edge technology and predictable growth?",
      footerAuditBtn: "Book a Free Audit",
      footerServicesTitle: "Services",
      footerCompanyTitle: "Company",
      modalTag: "FREE STRATEGY SESSION",
      modalTitle: "Get Your Free Tech & Growth Audit",
      modalSub: "Leave your details below and our team will inspect your digital stack, SEO, and benchmarks within 24 hours.",
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
      servicesEyebrow: "০২ / সক্ষমতা",
      servicesHeadline: "আমাদের সেবা ও সমাধান",
      servicesCta: "পরামর্শের জন্য শিডিউল করুন →",
      caseEyebrow: "০৩ / প্রমাণিত ফলাফল",
      caseHeadline: "আমাদের সফলতার কেস স্টাডি",
      caseCta: "সম্পূর্ণ কেস লাইব্রেরি দেখুন →",
      mediaEyebrow: "০৪ / নলেজ ও মিডিয়া",
      mediaHeadline: "টেক অ্যানালাইসিস ও স্ট্র্যাটেজি সেশন",
      mediaCta: "ইউটিউবে সাবস্ক্রাইব করুন →",
      articlesEyebrow: "০৫ / ইনসাইটস ও স্ট্র্যাটেজি",
      articlesHeadline: "সর্বশেষ আর্টিকেল",
      articlesCta: "সকল আর্টিকেল দেখুন →",
      topicsHeadline: "টপিক ও প্রযুক্তি অন্বেষণ",
      topicsSub: "আমাদের ইঞ্জিনিয়ার এবং গ্রোথ মার্কেটারদের প্রত্যক্ষ অভিজ্ঞতা ও সমাধান।",
      ctaHeadline: "চলুন শুরু করি এক নতুন যাত্রা।",
      ctaSub: "আপনার ডিজিটাল প্রবৃদ্ধির পথে কী বাধা রয়েছে তা জানতে আজই নাইনস্টার টেকনোলজিস থেকে ফ্রি অডিট গ্রহণ করুন।",
      ctaBtn: "ফ্রি টেক অডিট বুক করুন",
      footerBannerTitle: "আধুনিক প্রযুক্তি ও নিশ্চিত প্রবৃদ্ধির সাথে আপনার ব্যবসাকে রূপান্তর করতে প্রস্তুত?",
      footerAuditBtn: "ফ্রি অডিট বুক করুন",
      footerServicesTitle: "সার্ভিস",
      footerCompanyTitle: "কোম্পানি",
      modalTag: "ফ্রি স্ট্র্যাটেজি সেশন",
      modalTitle: "আপনার ফ্রি টেক ও গ্রোথ অডিট নিন",
      modalSub: "নিচে আপনার তথ্য দিন এবং আমাদের টিম ২৪ ঘণ্টার মধ্যে আপনার ওয়েবসাইট ও টেক স্ট্যাক বিশ্লেষণ করবে।",
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
      if (uiTranslations[lang] && uiTranslations[lang][key]) {
        el.innerHTML = uiTranslations[lang][key];
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
