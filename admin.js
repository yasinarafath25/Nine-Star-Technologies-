/**
 * 9STAR Technologies — Admin Dashboard Application Logic
 * Full CRUD, real-time sync with main site, data import/export, auth, and image processing.
 */

const adminApp = {
  currentTab: 'dashboard',

  init: function () {
    this.checkAuth();
    this.bindEvents();
    this.refreshAll();
  },

  // ==========================================================================
  // AUTHENTICATION
  // ==========================================================================
  checkAuth: function () {
    const loginOverlay = document.getElementById('loginOverlay');
    if (!window.DB.isAuthenticated()) {
      if (loginOverlay) loginOverlay.style.display = 'flex';
    } else {
      if (loginOverlay) loginOverlay.style.display = 'none';
    }
  },

  handleLogin: function (e) {
    e.preventDefault();
    const u = document.getElementById('loginUsername').value;
    const p = document.getElementById('loginPassword').value;

    if (window.DB.login(u, p)) {
      document.getElementById('loginOverlay').style.display = 'none';
      this.showToast('সফলভাবে লগইন হয়েছে!');
      this.refreshAll();
    } else {
      alert('ভুল ইউজারনেম বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিন।');
    }
  },

  handleLogout: function () {
    if (confirm('আপনি কি লগআউট করতে চান?')) {
      window.DB.logout();
      document.getElementById('loginOverlay').style.display = 'flex';
      this.showToast('লগআউট সম্পন্ন হয়েছে।');
    }
  },

  // ==========================================================================
  // TAB NAVIGATION
  // ==========================================================================
  bindEvents: function () {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.handleLogout());

    // Nav items
    const navBtns = document.querySelectorAll('.nav-item-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Mobile sidebar toggle
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('adminSidebar');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Forms
    this.bindForms();

    // ESC closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModals();
    });

    // Multi-tab storage listener
    window.addEventListener('storage', (e) => {
      if (e.key === 'nst_site_data_v2') {
        this.refreshAll();
      }
    });
  },

  switchTab: function (tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.nav-item-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    const activePane = document.getElementById(`tab-${tabName}`);
    if (activePane) activePane.classList.add('active');

    // Update topbar title
    const titles = {
      dashboard: 'ড্যাশবোর্ড ওভারভিউ',
      services: 'সার্ভিসেস ম্যানেজমেন্ট',
      caseStudies: 'কেস স্টাডি ও প্রজেক্টস',
      articles: 'আর্টিকেল ও ইনসাইটস',
      videos: 'মিডিয়া ও ভিডিও সেশন',
      clients: 'ক্লায়েন্ট ও পার্টনার্স',
      topics: 'টপিকস ও ক্যাটাগরি',
      heroAbout: 'হিরো ও অ্যাবাউট কন্টেন্ট',
      contact: 'যোগাযোগ ও ফুটার তথ্য',
      leads: 'অডিট রিকোয়েস্ট লিডস',
      settings: 'ব্যাকআপ ও সিকিউরিটি'
    };
    const titleEl = document.getElementById('pageTitleText');
    if (titleEl) titleEl.innerText = titles[tabName] || 'Admin Panel';

    // Close mobile sidebar if open
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar) sidebar.classList.remove('open');
  },

  // ==========================================================================
  // REFRESH ALL VIEWS & DATA
  // ==========================================================================
  refreshAll: function () {
    const data = window.DB.get();
    this.renderStats(data);
    this.renderServices(data);
    this.renderCaseStudies(data);
    this.renderArticles(data);
    this.renderVideos(data);
    this.renderClientsAndPartners(data);
    this.renderTopics(data);
    this.loadHeroAboutForm(data);
    this.loadContactForm(data);
    this.renderLeads(data);
  },

  // ==========================================================================
  // STATS & DASHBOARD
  // ==========================================================================
  renderStats: function (data) {
    const srvCount = data.services.length;
    const csCount = data.caseStudies.length;
    const artCount = data.articles.length;
    const vidCount = data.videos.length;
    const clientCount = data.clients.length;
    const leadCount = data.leads.length;

    // Badges in sidebar
    document.getElementById('badgeServicesCount').innerText = srvCount;
    document.getElementById('badgeCasesCount').innerText = csCount;
    document.getElementById('badgeArticlesCount').innerText = artCount;
    document.getElementById('badgeVideosCount').innerText = vidCount;
    document.getElementById('badgeLeadsCount').innerText = leadCount;

    // Numbers in dashboard
    document.getElementById('statServices').innerText = srvCount;
    document.getElementById('statCaseStudies').innerText = csCount;
    document.getElementById('statArticles').innerText = artCount;
    document.getElementById('statVideos').innerText = vidCount;
    document.getElementById('statClients').innerText = clientCount;
    document.getElementById('statLeads').innerText = leadCount;

    // Leads preview
    const previewBox = document.getElementById('dashboardLeadsPreview');
    if (previewBox) {
      if (data.leads.length === 0) {
        previewBox.innerHTML = `
          <div class="admin-empty-box" style="padding: 24px;">
            <p>এখনো কোনো অডিট রিকোয়েস্ট আসেনি। ভিজিটররা ওয়েবসাইটে ফর্ম পূরণ করলে সরাসরি এখানে দেখতে পাবেন।</p>
          </div>
        `;
      } else {
        previewBox.innerHTML = `
          <div class="data-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>তারিখ</th>
                  <th>নাম</th>
                  <th>ইমেইল</th>
                  <th>ওয়েবসাইট</th>
                  <th>স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                ${data.leads.slice(0, 5).map(l => `
                  <tr>
                    <td>${this.escape(l.date)}</td>
                    <td class="item-title">${this.escape(l.name)}</td>
                    <td><a href="mailto:${this.escape(l.email)}" style="color: #60a5fa;">${this.escape(l.email)}</a></td>
                    <td><a href="${this.escape(l.website)}" target="_blank" style="color: var(--neon-lime);">${this.escape(l.website)}</a></td>
                    <td><span class="nav-badge-pill" style="${l.status === 'Contacted' ? 'background: rgba(16, 185, 129, 0.2); color: #10b981;' : ''}">${l.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    }
  },

  // ==========================================================================
  // SERVICES CRUD
  // ==========================================================================
  renderServices: function (data) {
    const tbody = document.getElementById('servicesTableBody');
    if (!tbody) return;

    if (data.services.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="admin-empty-box">
              <span class="icon">🛠️</span>
              <p>কোনো সার্ভিস পাওয়া যায়নি। উপরের <strong>"+ নতুন সার্ভিস যুক্ত করুন"</strong> বাটনে ক্লিক করে প্রথম সার্ভিস যোগ করুন।</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data.services.map(s => `
      <tr>
        <td style="font-weight: 700; color: var(--neon-lime);">${this.escape(s.number)}</td>
        <td class="item-title">${this.escape(s.title)}</td>
        <td style="max-width: 380px; font-size: 0.82rem;">${this.escape(s.description)}</td>
        <td><code>${this.escape(s.icon)}</code></td>
        <td style="text-align: right;">
          <button class="btn-secondary btn-sm" onclick="adminApp.openServiceModal('${s.id}')">এডিট</button>
          <button class="btn-danger btn-sm" onclick="adminApp.deleteService('${s.id}')">মুছুন</button>
        </td>
      </tr>
    `).join('');
  },

  openServiceModal: function (id = null) {
    const modal = document.getElementById('serviceModal');
    const titleEl = document.getElementById('serviceModalTitle');
    const form = document.getElementById('serviceForm');
    form.reset();

    if (id) {
      const data = window.DB.get();
      const s = data.services.find(item => item.id === id);
      if (s) {
        titleEl.innerText = 'সার্ভিস সম্পাদনা করুন';
        document.getElementById('serviceEditId').value = s.id;
        document.getElementById('serviceTitleInput').value = s.title;
        document.getElementById('serviceDescInput').value = s.description;
        document.getElementById('serviceIconSelect').value = s.icon || 'code';
      }
    } else {
      titleEl.innerText = 'নতুন সার্ভিস যোগ করুন';
      document.getElementById('serviceEditId').value = '';
    }

    modal.classList.add('active');
  },

  deleteService: function (id) {
    if (confirm('আপনি কি নিশ্চিত যে এই সার্ভিসটি মুছে ফেলতে চান?')) {
      window.DB.deleteService(id);
      this.refreshAll();
      this.showToast('সার্ভিস মুছে ফেলা হয়েছে।');
    }
  },

  // ==========================================================================
  // CASE STUDIES CRUD
  // ==========================================================================
  renderCaseStudies: function (data) {
    const tbody = document.getElementById('caseStudiesTableBody');
    if (!tbody) return;

    if (data.caseStudies.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="admin-empty-box">
              <span class="icon">📁</span>
              <p>কোনো কেস স্টাডি পাওয়া যায়নি। "+ নতুন কেস স্টাডি যুক্ত করুন" বাটনে ক্লিক করুন।</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data.caseStudies.map(cs => `
      <tr>
        <td><span class="nav-badge-pill">${this.escape(cs.tag)}</span></td>
        <td class="item-title">${this.escape(cs.title)}</td>
        <td><strong>${this.escape(cs.metric1Val)}</strong> <span style="font-size:0.75rem;">${this.escape(cs.metric1Label)}</span></td>
        <td><strong>${this.escape(cs.metric2Val)}</strong> <span style="font-size:0.75rem;">${this.escape(cs.metric2Label)}</span></td>
        <td><strong>${this.escape(cs.metric3Val)}</strong> <span style="font-size:0.75rem;">${this.escape(cs.metric3Label)}</span></td>
        <td style="text-align: right;">
          <button class="btn-secondary btn-sm" onclick="adminApp.openCaseModal('${cs.id}')">এডিট</button>
          <button class="btn-danger btn-sm" onclick="adminApp.deleteCaseStudy('${cs.id}')">মুছুন</button>
        </td>
      </tr>
    `).join('');
  },

  openCaseModal: function (id = null) {
    const modal = document.getElementById('caseModal');
    const titleEl = document.getElementById('caseModalTitle');
    const form = document.getElementById('caseForm');
    form.reset();

    if (id) {
      const data = window.DB.get();
      const cs = data.caseStudies.find(item => item.id === id);
      if (cs) {
        titleEl.innerText = 'কেস স্টাডি সম্পাদনা করুন';
        document.getElementById('caseEditId').value = cs.id;
        document.getElementById('caseTagInput').value = cs.tag;
        document.getElementById('caseTitleInput').value = cs.title;
        document.getElementById('caseM1Val').value = cs.metric1Val;
        document.getElementById('caseM1Lbl').value = cs.metric1Label;
        document.getElementById('caseM2Val').value = cs.metric2Val;
        document.getElementById('caseM2Lbl').value = cs.metric2Label;
        document.getElementById('caseM3Val').value = cs.metric3Val;
        document.getElementById('caseM3Lbl').value = cs.metric3Label;
      }
    } else {
      titleEl.innerText = 'নতুন কেস স্টাডি যোগ করুন';
      document.getElementById('caseEditId').value = '';
    }

    modal.classList.add('active');
  },

  deleteCaseStudy: function (id) {
    if (confirm('আপনি কি এই কেস স্টাডিটি মুছে ফেলতে চান?')) {
      window.DB.deleteCaseStudy(id);
      this.refreshAll();
      this.showToast('কেস স্টাডি মুছে ফেলা হয়েছে।');
    }
  },

  // ==========================================================================
  // ARTICLES CRUD
  // ==========================================================================
  renderArticles: function (data) {
    const tbody = document.getElementById('articlesTableBody');
    if (!tbody) return;

    if (data.articles.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="admin-empty-box">
              <span class="icon">📰</span>
              <p>কোনো আর্টিকেল প্রকাশিত হয়নি। "+ নতুন আর্টিকেল লিখুন" বাটনে ক্লিক করুন।</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data.articles.map(a => `
      <tr>
        <td><span class="nav-badge-pill">${this.escape(a.tag)}</span></td>
        <td class="item-title">${this.escape(a.title)}</td>
        <td>${this.escape(a.date)}</td>
        <td>${this.escape(a.readTime)}</td>
        <td style="text-align: right;">
          <button class="btn-secondary btn-sm" onclick="adminApp.openArticleModal('${a.id}')">এডিট</button>
          <button class="btn-danger btn-sm" onclick="adminApp.deleteArticle('${a.id}')">মুছুন</button>
        </td>
      </tr>
    `).join('');
  },

  openArticleModal: function (id = null) {
    const modal = document.getElementById('articleModal');
    const titleEl = document.getElementById('articleModalTitle');
    const form = document.getElementById('articleForm');
    form.reset();

    if (id) {
      const data = window.DB.get();
      const a = data.articles.find(item => item.id === id);
      if (a) {
        titleEl.innerText = 'আর্টিকেল সম্পাদনা করুন';
        document.getElementById('articleEditId').value = a.id;
        document.getElementById('artTagInput').value = a.tag;
        document.getElementById('artTitleInput').value = a.title;
        document.getElementById('artDescInput').value = a.description;
        document.getElementById('artDateInput').value = a.date;
        document.getElementById('artReadTimeInput').value = a.readTime;
      }
    } else {
      titleEl.innerText = 'নতুন আর্টিকেল লিখুন';
      document.getElementById('articleEditId').value = '';
      document.getElementById('artDateInput').value = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      document.getElementById('artReadTimeInput').value = '5 min read';
    }

    modal.classList.add('active');
  },

  deleteArticle: function (id) {
    if (confirm('আপনি কি এই আর্টিকেলটি মুছে ফেলতে চান?')) {
      window.DB.deleteArticle(id);
      this.refreshAll();
      this.showToast('আর্টিকেল মুছে ফেলা হয়েছে।');
    }
  },

  // ==========================================================================
  // VIDEOS CRUD
  // ==========================================================================
  renderVideos: function (data) {
    const tbody = document.getElementById('videosTableBody');
    if (!tbody) return;

    if (data.videos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="admin-empty-box">
              <span class="icon">🎬</span>
              <p>কোনো ভিডিও নেই। "+ নতুন ভিডিও যুক্ত করুন" বাটনে ক্লিক করুন।</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data.videos.map(v => `
      <tr>
        <td>
          ${v.thumbnail ? `<img src="${this.escape(v.thumbnail)}" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;" />` : '🎬'}
        </td>
        <td class="item-title">${this.escape(v.title)}</td>
        <td><span class="nav-badge-pill">${this.escape(v.tag)}</span></td>
        <td>${this.escape(v.duration)}</td>
        <td><a href="${this.escape(v.videoUrl)}" target="_blank" style="color: #60a5fa; font-size: 0.8rem;">প্লে করুন ↗</a></td>
        <td style="text-align: right;">
          <button class="btn-secondary btn-sm" onclick="adminApp.openVideoModal('${v.id}')">এডিট</button>
          <button class="btn-danger btn-sm" onclick="adminApp.deleteVideo('${v.id}')">মুছুন</button>
        </td>
      </tr>
    `).join('');
  },

  openVideoModal: function (id = null) {
    const modal = document.getElementById('videoModal');
    const titleEl = document.getElementById('videoModalTitle');
    const form = document.getElementById('videoForm');
    form.reset();

    if (id) {
      const data = window.DB.get();
      const v = data.videos.find(item => item.id === id);
      if (v) {
        titleEl.innerText = 'ভিডিও সম্পাদনা করুন';
        document.getElementById('videoEditId').value = v.id;
        document.getElementById('vidTitleInput').value = v.title;
        document.getElementById('vidTagInput').value = v.tag;
        document.getElementById('vidDurationInput').value = v.duration;
        document.getElementById('vidUrlInput').value = v.videoUrl;
        document.getElementById('vidThumbnailUrlInput').value = v.thumbnail;
      }
    } else {
      titleEl.innerText = 'নতুন ভিডিও যুক্ত করুন';
      document.getElementById('videoEditId').value = '';
      document.getElementById('vidTagInput').value = 'MASTERCLASS';
      document.getElementById('vidDurationInput').value = '15 Min Watch';
    }

    modal.classList.add('active');
  },

  deleteVideo: function (id) {
    if (confirm('আপনি কি এই ভিডিওটি মুছে ফেলতে চান?')) {
      window.DB.deleteVideo(id);
      this.refreshAll();
      this.showToast('ভিডিও মুছে ফেলা হয়েছে।');
    }
  },

  // ==========================================================================
  // CLIENTS & PARTNERS
  // ==========================================================================
  renderClientsAndPartners: function (data) {
    // Clients
    const clientWrap = document.getElementById('clientsListWrap');
    if (clientWrap) {
      if (data.clients.length === 0) {
        clientWrap.innerHTML = `<span style="font-size:0.85rem; color:var(--text-muted);">কোনো ক্লায়েন্ট যুক্ত নেই।</span>`;
      } else {
        clientWrap.innerHTML = data.clients.map(c => `
          <span style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; background: rgba(255,255,255,0.06); border: 1px solid var(--admin-border); border-radius: 99px; font-size: 0.85rem;">
            <span>${this.escape(c.name)}</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">(T${c.track})</span>
            <button type="button" onclick="adminApp.deleteClient('${c.id}')" style="background:none; border:none; color:var(--star-rose); cursor:pointer; font-weight:700;">✕</button>
          </span>
        `).join('');
      }
    }

    // Partners
    const partnerWrap = document.getElementById('partnersListWrap');
    if (partnerWrap) {
      if (data.partners.length === 0) {
        partnerWrap.innerHTML = `<span style="font-size:0.85rem; color:var(--text-muted);">কোনো পার্টনার যুক্ত নেই।</span>`;
      } else {
        partnerWrap.innerHTML = data.partners.map(p => `
          <span style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; background: rgba(255,255,255,0.06); border: 1px solid var(--admin-border); border-radius: 99px; font-size: 0.85rem;">
            <span>${this.escape(p.name)}</span>
            <button type="button" onclick="adminApp.deletePartner('${p.id}')" style="background:none; border:none; color:var(--star-rose); cursor:pointer; font-weight:700;">✕</button>
          </span>
        `).join('');
      }
    }
  },

  deleteClient: function (id) {
    window.DB.deleteClient(id);
    this.refreshAll();
    this.showToast('ক্লায়েন্ট সরানো হয়েছে।');
  },

  deletePartner: function (id) {
    window.DB.deletePartner(id);
    this.refreshAll();
    this.showToast('পার্টনার সরানো হয়েছে।');
  },

  // ==========================================================================
  // TOPICS
  // ==========================================================================
  renderTopics: function (data) {
    const wrap = document.getElementById('topicsListWrap');
    if (!wrap) return;

    if (data.topics.length === 0) {
      wrap.innerHTML = `<span style="font-size:0.85rem; color:var(--text-muted);">কোনো টপিক যুক্ত করা হয়নি।</span>`;
      return;
    }

    wrap.innerHTML = data.topics.map(t => `
      <span style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255,255,255,0.06); border: 1px solid var(--admin-border); border-radius: 99px; font-size: 0.85rem;">
        <span>${this.escape(t)}</span>
        <button type="button" onclick="adminApp.deleteTopic('${this.escape(t)}')" style="background:none; border:none; color:var(--star-rose); cursor:pointer; font-weight:700;">✕</button>
      </span>
    `).join('');
  },

  deleteTopic: function (topicName) {
    window.DB.deleteTopic(topicName);
    this.refreshAll();
    this.showToast('টপিক সরানো হয়েছে।');
  },

  // ==========================================================================
  // HERO & ABOUT SETTINGS
  // ==========================================================================
  loadHeroAboutForm: function (data) {
    const s = data.settings || {};
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined ? val : '';
    };

    setVal('setBrandName', s.brandName);
    setVal('setBrandSubtitle', s.brandSubtitle);
    setVal('setHeroBadge', s.heroBadge);
    setVal('setHeroHeadline', s.heroHeadline);
    setVal('setHeroSub', s.heroSub);
    setVal('setHeroCtaView', s.heroCtaView);
    setVal('setHeroCtaStart', s.heroCtaStart);
    setVal('setHeroRatingText', s.heroRatingText);
    setVal('setHeroRatingStars', s.heroRatingStars || 5);
    setVal('setAboutEyebrow', s.aboutEyebrow);
    setVal('setAboutHeadline', s.aboutHeadline);
    setVal('setAboutDesc', s.aboutDesc);

    const deckCheck = document.getElementById('setShowFloatingDeck');
    if (deckCheck) deckCheck.checked = s.showFloatingDeck === true;
  },

  // ==========================================================================
  // CONTACT SETTINGS
  // ==========================================================================
  loadContactForm: function (data) {
    const s = data.settings || {};
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined ? val : '';
    };

    setVal('setSupportEmail', s.supportEmail);
    setVal('setSupportPhone', s.supportPhone);
    setVal('setLocation', s.location);
    setVal('setPrefooterTitle', s.prefooterTitle);
    setVal('setFooterDesc', s.footerDesc);

    if (s.socialLinks) {
      setVal('setSocialFacebook', s.socialLinks.facebook);
      setVal('setSocialLinkedin', s.socialLinks.linkedin);
      setVal('setSocialTwitter', s.socialLinks.twitter);
      setVal('setSocialYoutube', s.socialLinks.youtube);
    }
  },

  // ==========================================================================
  // LEADS
  // ==========================================================================
  renderLeads: function (data) {
    const tbody = document.getElementById('leadsTableBody');
    if (!tbody) return;

    if (data.leads.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="admin-empty-box">
              <span class="icon">📬</span>
              <p>কোনো লিড বা অডিট রিকোয়েস্ট এখনো আসেনি।</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data.leads.map(l => `
      <tr>
        <td style="font-size:0.8rem; color:var(--text-muted);">${this.escape(l.date)}</td>
        <td class="item-title">${this.escape(l.name)}</td>
        <td><a href="mailto:${this.escape(l.email)}" style="color: #60a5fa;">${this.escape(l.email)}</a></td>
        <td><a href="${this.escape(l.website)}" target="_blank" style="color: var(--neon-lime);">${this.escape(l.website)}</a></td>
        <td>
          <span class="nav-badge-pill" style="cursor: pointer; ${l.status === 'Contacted' ? 'background: rgba(16, 185, 129, 0.2); color: #10b981;' : ''}" onclick="adminApp.toggleLeadStatus('${l.id}')">
            ${l.status} ↺
          </span>
        </td>
        <td style="text-align: right;">
          <button class="btn-danger btn-sm" onclick="adminApp.deleteLead('${l.id}')">মুছুন</button>
        </td>
      </tr>
    `).join('');
  },

  toggleLeadStatus: function (id) {
    window.DB.toggleLeadStatus(id);
    this.refreshAll();
    this.showToast('স্ট্যাটাস পরিবর্তিত হয়েছে।');
  },

  deleteLead: function (id) {
    if (confirm('আপনি কি এই লিডটি মুছে ফেলতে চান?')) {
      window.DB.deleteLead(id);
      this.refreshAll();
      this.showToast('লিড মুছে ফেলা হয়েছে।');
    }
  },

  exportLeadsCSV: function () {
    const leads = window.DB.getLeads();
    if (leads.length === 0) {
      alert('কোনো লিড ডাটা নেই।');
      return;
    }
    let csv = "ID,Date,Name,Email,Website,Status\n";
    leads.forEach(l => {
      csv += `"${l.id}","${l.date}","${l.name}","${l.email}","${l.website}","${l.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // ==========================================================================
  // FORMS BINDING
  // ==========================================================================
  bindForms: function () {
    // Service Form Submit
    const srvForm = document.getElementById('serviceForm');
    if (srvForm) {
      srvForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('serviceEditId').value;
        const payload = {
          title: document.getElementById('serviceTitleInput').value.trim(),
          description: document.getElementById('serviceDescInput').value.trim(),
          icon: document.getElementById('serviceIconSelect').value
        };

        if (editId) {
          window.DB.updateService(editId, payload);
          this.showToast('সার্ভিস সফলভাবে আপডেট হয়েছে!');
        } else {
          window.DB.addService(payload);
          this.showToast('নতুন সার্ভিস যুক্ত করা হয়েছে!');
        }

        this.closeModals();
        this.refreshAll();
      });
    }

    // Case Study Form Submit
    const caseForm = document.getElementById('caseForm');
    if (caseForm) {
      caseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('caseEditId').value;
        const payload = {
          tag: document.getElementById('caseTagInput').value.trim(),
          title: document.getElementById('caseTitleInput').value.trim(),
          metric1Val: document.getElementById('caseM1Val').value.trim(),
          metric1Label: document.getElementById('caseM1Lbl').value.trim(),
          metric2Val: document.getElementById('caseM2Val').value.trim(),
          metric2Label: document.getElementById('caseM2Lbl').value.trim(),
          metric3Val: document.getElementById('caseM3Val').value.trim(),
          metric3Label: document.getElementById('caseM3Lbl').value.trim()
        };

        if (editId) {
          window.DB.updateCaseStudy(editId, payload);
          this.showToast('কেস স্টাডি আপডেট হয়েছে!');
        } else {
          window.DB.addCaseStudy(payload);
          this.showToast('নতুন কেস স্টাডি যুক্ত হয়েছে!');
        }

        this.closeModals();
        this.refreshAll();
      });
    }

    // Article Form Submit
    const artForm = document.getElementById('articleForm');
    if (artForm) {
      artForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('articleEditId').value;
        const payload = {
          tag: document.getElementById('artTagInput').value.trim(),
          title: document.getElementById('artTitleInput').value.trim(),
          description: document.getElementById('artDescInput').value.trim(),
          date: document.getElementById('artDateInput').value.trim(),
          readTime: document.getElementById('artReadTimeInput').value.trim()
        };

        if (editId) {
          window.DB.updateArticle(editId, payload);
          this.showToast('আর্টিকেল আপডেট হয়েছে!');
        } else {
          window.DB.addArticle(payload);
          this.showToast('নতুন আর্টিকেল যুক্ত হয়েছে!');
        }

        this.closeModals();
        this.refreshAll();
      });
    }

    // Video Form Submit (with image file upload to base64)
    const vidForm = document.getElementById('videoForm');
    if (vidForm) {
      vidForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('videoEditId').value;
        const fileInput = document.getElementById('vidThumbnailFileInput');
        const urlInput = document.getElementById('vidThumbnailUrlInput');

        const saveVideo = (thumbUrl) => {
          const payload = {
            title: document.getElementById('vidTitleInput').value.trim(),
            tag: document.getElementById('vidTagInput').value.trim(),
            duration: document.getElementById('vidDurationInput').value.trim(),
            videoUrl: document.getElementById('vidUrlInput').value.trim(),
            thumbnail: thumbUrl || urlInput.value.trim()
          };

          if (editId) {
            window.DB.updateVideo(editId, payload);
            this.showToast('ভিডিও আপডেট হয়েছে!');
          } else {
            window.DB.addVideo(payload);
            this.showToast('নতুন ভিডিও যুক্ত হয়েছে!');
          }

          this.closeModals();
          this.refreshAll();
        };

        if (fileInput && fileInput.files && fileInput.files[0]) {
          const reader = new FileReader();
          reader.onload = (re) => saveVideo(re.target.result);
          reader.readAsDataURL(fileInput.files[0]);
        } else {
          saveVideo(urlInput.value.trim());
        }
      });
    }

    // Add Client Form
    const addClientForm = document.getElementById('addClientForm');
    if (addClientForm) {
      addClientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('clientNameInput');
        const track = document.getElementById('clientTrackSelect').value;
        if (input.value.trim()) {
          window.DB.addClient({ name: input.value.trim(), track: parseInt(track) || 1 });
          input.value = '';
          this.refreshAll();
          this.showToast('ক্লায়েন্ট যুক্ত করা হয়েছে!');
        }
      });
    }

    // Add Partner Form
    const addPartnerForm = document.getElementById('addPartnerForm');
    if (addPartnerForm) {
      addPartnerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('partnerNameInput');
        if (input.value.trim()) {
          window.DB.addPartner({ name: input.value.trim() });
          input.value = '';
          this.refreshAll();
          this.showToast('পার্টনার যুক্ত করা হয়েছে!');
        }
      });
    }

    // Add Topic Form
    const addTopicForm = document.getElementById('addTopicForm');
    if (addTopicForm) {
      addTopicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('topicNameInput');
        if (input.value.trim()) {
          window.DB.addTopic(input.value.trim());
          input.value = '';
          this.refreshAll();
          this.showToast('টপিক যুক্ত করা হয়েছে!');
        }
      });
    }

    // Hero & About Settings Form
    const heroForm = document.getElementById('heroSettingsForm');
    if (heroForm) {
      heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = {
          brandName: document.getElementById('setBrandName').value.trim(),
          brandSubtitle: document.getElementById('setBrandSubtitle').value.trim(),
          heroBadge: document.getElementById('setHeroBadge').value.trim(),
          heroHeadline: document.getElementById('setHeroHeadline').value.trim(),
          heroSub: document.getElementById('setHeroSub').value.trim(),
          heroCtaView: document.getElementById('setHeroCtaView').value.trim(),
          heroCtaStart: document.getElementById('setHeroCtaStart').value.trim(),
          heroRatingText: document.getElementById('setHeroRatingText').value.trim(),
          heroRatingStars: parseInt(document.getElementById('setHeroRatingStars').value) || 5,
          showFloatingDeck: document.getElementById('setShowFloatingDeck').checked,
          aboutEyebrow: document.getElementById('setAboutEyebrow').value.trim(),
          aboutHeadline: document.getElementById('setAboutHeadline').value.trim(),
          aboutDesc: document.getElementById('setAboutDesc').value.trim()
        };
        window.DB.updateSettings(payload);
        this.showToast('হিরো ও অ্যাবাউট কন্টেন্ট সংরক্ষিত হয়েছে!');
        this.refreshAll();
      });
    }

    // Contact Settings Form
    const contactForm = document.getElementById('contactSettingsForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = {
          supportEmail: document.getElementById('setSupportEmail').value.trim(),
          supportPhone: document.getElementById('setSupportPhone').value.trim(),
          location: document.getElementById('setLocation').value.trim(),
          prefooterTitle: document.getElementById('setPrefooterTitle').value.trim(),
          footerDesc: document.getElementById('setFooterDesc').value.trim(),
          socialLinks: {
            facebook: document.getElementById('setSocialFacebook').value.trim(),
            linkedin: document.getElementById('setSocialLinkedin').value.trim(),
            twitter: document.getElementById('setSocialTwitter').value.trim(),
            youtube: document.getElementById('setSocialYoutube').value.trim()
          }
        };
        window.DB.updateSettings(payload);
        this.showToast('যোগাযোগ তথ্য সংরক্ষিত হয়েছে!');
        this.refreshAll();
      });
    }

    // Change Password Form
    const pwdForm = document.getElementById('changePasswordForm');
    if (pwdForm) {
      pwdForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('newUsernameInput').value.trim();
        const p = document.getElementById('newPasswordInput').value;
        if (window.DB.updateCredentials(u, p)) {
          this.showToast('ইউজারনেম ও পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
          pwdForm.reset();
        } else {
          alert('পাসওয়ার্ড পরিবর্তনে সমস্যা হয়েছে।');
        }
      });
    }
  },

  // ==========================================================================
  // BACKUP & RESET
  // ==========================================================================
  handleImportJson: function (event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = window.DB.importJSON(e.target.result);
      if (res.success) {
        this.showToast('ডাটা সফলভাবে ইমপোর্ট ও রিস্টোর করা হয়েছে!');
        this.refreshAll();
      } else {
        alert('ইমপোর্ট ব্যর্থ হয়েছে: ' + res.error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  },

  confirmResetAllData: function () {
    const confirmed = confirm('⚠️ সাবধান! আপনি কি ওয়েবসাইটের সব ডাটা মুছে সম্পূর্ণ ক্লিন (Empty Slate) করতে চান?\nকোনো ডেমো বা টেস্ট ডাটা থাকবে না।');
    if (confirmed) {
      window.DB.resetToClean();
      this.refreshAll();
      this.showToast('সব ডাটা মুছে সম্পূর্ণ ক্লিন করা হয়েছে!');
    }
  },

  // ==========================================================================
  // HELPERS
  // ==========================================================================
  closeModals: function () {
    document.querySelectorAll('.admin-modal-backdrop').forEach(m => m.classList.remove('active'));
  },

  showToast: function (msg) {
    const toast = document.getElementById('adminToast');
    const msgEl = document.getElementById('toastMessage');
    if (toast && msgEl) {
      msgEl.innerText = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }
  },

  escape: function (str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
};

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  adminApp.init();
});
