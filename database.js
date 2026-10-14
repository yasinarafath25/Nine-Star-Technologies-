/**
 * 9STAR Technologies — Centralized Dynamic Database Layer (localStorage Engine)
 * Manages all dynamic website data, admin CRUD operations, real-time sync, and backup.
 * 100% Clean Slate: All demo/mock data eliminated.
 */

(function () {
  const STORAGE_KEY = 'nst_site_data_v2';
  const AUTH_KEY = 'nst_admin_auth_v2';
  const CREDENTIALS_KEY = 'nst_admin_creds_v2';

  // Default clean configuration (Zero demo data)
  const defaultSiteData = {
    settings: {
      brandName: "9STAR",
      brandSubtitle: "TECHNOLOGIES",
      heroBadge: "9STAR Technologies • Scaled for Global Dominance",
      heroHeadline: "Building the future with\nAI and strategy",
      heroSub: "We help organizations unlock growth and efficiency through data-driven consulting, intelligent automation, and high-performance engineering.",
      heroCtaView: "VIEW SERVICES",
      heroCtaStart: "GET STARTED",
      heroRatingText: "", // Empty: no fake demo ratings
      heroRatingStars: 5,
      showFloatingDeck: false, // Disabled demo cards
      aboutEyebrow: "ABOUT US",
      aboutHeadline: "A global consulting partner dedicated to building smarter, more adaptive digital platforms.",
      aboutDesc: "We partner with ambitious companies to engineer custom software, optimize organic search visibility, and scale digital operations.",
      bentoStats: [],
      prefooterTitle: "Let’s start a conversation.",
      prefooterSub: "Ready to discover what’s holding your digital growth back? Get a comprehensive audit from 9STAR Technologies today.",
      footerBannerTitle: "Ready to transform your business with cutting-edge technology and predictable growth?",
      footerDesc: "Premier technology & growth agency helping ambitious organizations scale through bespoke software, modern cloud architecture, and AI pipelines.",
      supportEmail: "mdyasinarafath20@gmail.com",
      supportPhone: "+8801988941753",
      location: "Dhaka · Singapore · London",
      socialLinks: {
        linkedin: "#",
        twitter: "#",
        youtube: "#",
        facebook: "#"
      }
    },
    services: [],      // 100% CLEAN: All demo services deleted
    caseStudies: [],   // 100% CLEAN: All demo case studies deleted
    articles: [],      // 100% CLEAN: All demo articles deleted
    videos: [],        // 100% CLEAN: All demo videos deleted
    clients: [],       // 100% CLEAN: All demo clients deleted
    partners: [],      // 100% CLEAN: All demo partners deleted
    topics: [],        // 100% CLEAN: All demo topics deleted
    leads: []          // Inquiries from "Get A Free Audit" modal
  };

  const DB = {
    /**
     * Get all site data
     */
    get: function () {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          this.save(defaultSiteData);
          return JSON.parse(JSON.stringify(defaultSiteData));
        }
        const parsed = JSON.parse(stored);
        // Ensure all required fields exist
        return Object.assign({}, defaultSiteData, parsed, {
          settings: Object.assign({}, defaultSiteData.settings, parsed.settings || {}),
          services: Array.isArray(parsed.services) ? parsed.services : [],
          caseStudies: Array.isArray(parsed.caseStudies) ? parsed.caseStudies : [],
          articles: Array.isArray(parsed.articles) ? parsed.articles : [],
          videos: Array.isArray(parsed.videos) ? parsed.videos : [],
          clients: Array.isArray(parsed.clients) ? parsed.clients : [],
          partners: Array.isArray(parsed.partners) ? parsed.partners : [],
          topics: Array.isArray(parsed.topics) ? parsed.topics : [],
          leads: Array.isArray(parsed.leads) ? parsed.leads : []
        });
      } catch (e) {
        console.error("DB.get error:", e);
        return JSON.parse(JSON.stringify(defaultSiteData));
      }
    },

    /**
     * Save all site data & notify listeners
     */
    save: function (data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        window.dispatchEvent(new CustomEvent('nst_data_updated', { detail: data }));
        return true;
      } catch (e) {
        console.error("DB.save error:", e);
        return false;
      }
    },

    /**
     * Completely clear all data to pristine empty state
     */
    resetToClean: function () {
      this.save(defaultSiteData);
      return defaultSiteData;
    },

    // ==========================================
    // SERVICES CRUD
    // ==========================================
    getServices: function () {
      return this.get().services;
    },
    addService: function (service) {
      const data = this.get();
      const newService = Object.assign({
        id: 'srv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        number: String(data.services.length + 1).padStart(2, '0'),
        title: '',
        description: '',
        icon: 'code',
        link: '#services'
      }, service);
      data.services.push(newService);
      this.save(data);
      return newService;
    },
    updateService: function (id, updatedFields) {
      const data = this.get();
      const idx = data.services.findIndex(s => s.id === id);
      if (idx !== -1) {
        data.services[idx] = Object.assign({}, data.services[idx], updatedFields);
        this.save(data);
        return data.services[idx];
      }
      return null;
    },
    deleteService: function (id) {
      const data = this.get();
      data.services = data.services.filter(s => s.id !== id);
      // Renumber services
      data.services.forEach((s, i) => {
        s.number = String(i + 1).padStart(2, '0');
      });
      this.save(data);
      return true;
    },

    // ==========================================
    // CASE STUDIES CRUD
    // ==========================================
    getCaseStudies: function () {
      return this.get().caseStudies;
    },
    addCaseStudy: function (item) {
      const data = this.get();
      const newCase = Object.assign({
        id: 'cs_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        tag: 'Tech & Scale',
        title: '',
        metric1Val: '',
        metric1Label: '',
        metric2Val: '',
        metric2Label: '',
        metric3Val: '',
        metric3Label: '',
        link: '#case-studies'
      }, item);
      data.caseStudies.push(newCase);
      this.save(data);
      return newCase;
    },
    updateCaseStudy: function (id, updatedFields) {
      const data = this.get();
      const idx = data.caseStudies.findIndex(c => c.id === id);
      if (idx !== -1) {
        data.caseStudies[idx] = Object.assign({}, data.caseStudies[idx], updatedFields);
        this.save(data);
        return data.caseStudies[idx];
      }
      return null;
    },
    deleteCaseStudy: function (id) {
      const data = this.get();
      data.caseStudies = data.caseStudies.filter(c => c.id !== id);
      this.save(data);
      return true;
    },

    // ==========================================
    // ARTICLES CRUD
    // ==========================================
    getArticles: function () {
      return this.get().articles;
    },
    addArticle: function (item) {
      const data = this.get();
      const newArt = Object.assign({
        id: 'art_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        tag: 'Strategy',
        title: '',
        description: '',
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        readTime: '5 min read',
        link: '#'
      }, item);
      data.articles.push(newArt);
      this.save(data);
      return newArt;
    },
    updateArticle: function (id, updatedFields) {
      const data = this.get();
      const idx = data.articles.findIndex(a => a.id === id);
      if (idx !== -1) {
        data.articles[idx] = Object.assign({}, data.articles[idx], updatedFields);
        this.save(data);
        return data.articles[idx];
      }
      return null;
    },
    deleteArticle: function (id) {
      const data = this.get();
      data.articles = data.articles.filter(a => a.id !== id);
      this.save(data);
      return true;
    },

    // ==========================================
    // VIDEOS / MEDIA CRUD
    // ==========================================
    getVideos: function () {
      return this.get().videos;
    },
    addVideo: function (item) {
      const data = this.get();
      const newVid = Object.assign({
        id: 'vid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        tag: 'TECH TALK',
        title: '',
        duration: '10 Min Watch',
        thumbnail: '',
        videoUrl: 'https://www.youtube.com'
      }, item);
      data.videos.push(newVid);
      this.save(data);
      return newVid;
    },
    updateVideo: function (id, updatedFields) {
      const data = this.get();
      const idx = data.videos.findIndex(v => v.id === id);
      if (idx !== -1) {
        data.videos[idx] = Object.assign({}, data.videos[idx], updatedFields);
        this.save(data);
        return data.videos[idx];
      }
      return null;
    },
    deleteVideo: function (id) {
      const data = this.get();
      data.videos = data.videos.filter(v => v.id !== id);
      this.save(data);
      return true;
    },

    // ==========================================
    // CLIENTS MARQUEE CRUD
    // ==========================================
    getClients: function () {
      return this.get().clients;
    },
    addClient: function (client) {
      const data = this.get();
      const newClient = Object.assign({
        id: 'cl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: '',
        track: 1 // track 1 or 2
      }, client);
      data.clients.push(newClient);
      this.save(data);
      return newClient;
    },
    deleteClient: function (id) {
      const data = this.get();
      data.clients = data.clients.filter(c => c.id !== id);
      this.save(data);
      return true;
    },

    // ==========================================
    // PARTNERS CRUD
    // ==========================================
    getPartners: function () {
      return this.get().partners;
    },
    addPartner: function (partner) {
      const data = this.get();
      const newP = Object.assign({
        id: 'pt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: ''
      }, partner);
      data.partners.push(newP);
      this.save(data);
      return newP;
    },
    deletePartner: function (id) {
      const data = this.get();
      data.partners = data.partners.filter(p => p.id !== id);
      this.save(data);
      return true;
    },

    // ==========================================
    // TOPICS CRUD
    // ==========================================
    getTopics: function () {
      return this.get().topics;
    },
    addTopic: function (topicName) {
      const data = this.get();
      const trimmed = topicName.trim();
      if (trimmed && !data.topics.includes(trimmed)) {
        data.topics.push(trimmed);
        this.save(data);
      }
      return data.topics;
    },
    deleteTopic: function (topicName) {
      const data = this.get();
      data.topics = data.topics.filter(t => t !== topicName);
      this.save(data);
      return true;
    },

    // ==========================================
    // SETTINGS MANAGEMENT
    // ==========================================
    getSettings: function () {
      return this.get().settings;
    },
    updateSettings: function (newSettings) {
      const data = this.get();
      data.settings = Object.assign({}, data.settings, newSettings);
      this.save(data);
      return data.settings;
    },

    // ==========================================
    // LEADS & INQUIRIES (From Free Audit Modal)
    // ==========================================
    getLeads: function () {
      return this.get().leads;
    },
    addLead: function (lead) {
      const data = this.get();
      const newLead = Object.assign({
        id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: '',
        email: '',
        website: '',
        date: new Date().toLocaleString(),
        status: 'New'
      }, lead);
      data.leads.unshift(newLead);
      this.save(data);
      return newLead;
    },
    deleteLead: function (id) {
      const data = this.get();
      data.leads = data.leads.filter(l => l.id !== id);
      this.save(data);
      return true;
    },
    toggleLeadStatus: function (id) {
      const data = this.get();
      const lead = data.leads.find(l => l.id === id);
      if (lead) {
        lead.status = (lead.status === 'New') ? 'Contacted' : 'New';
        this.save(data);
        return lead;
      }
      return null;
    },

    // ==========================================
    // JSON EXPORT & IMPORT
    // ==========================================
    exportJSON: function () {
      const dataStr = JSON.stringify(this.get(), null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `9star-website-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    importJSON: function (jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (typeof parsed !== 'object' || parsed === null) throw new Error("Invalid format");
        this.save(parsed);
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    // ==========================================
    // AUTHENTICATION MANAGEMENT
    // ==========================================
    getCredentials: function () {
      try {
        const creds = localStorage.getItem(CREDENTIALS_KEY);
        if (!creds) {
          // Default credentials: admin / admin123
          return { username: 'admin', password: 'admin123' };
        }
        return JSON.parse(creds);
      } catch (e) {
        return { username: 'admin', password: 'admin123' };
      }
    },
    updateCredentials: function (newUsername, newPassword) {
      try {
        localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({
          username: newUsername.trim(),
          password: newPassword
        }));
        return true;
      } catch (e) {
        return false;
      }
    },
    login: function (username, password) {
      const creds = this.getCredentials();
      if (username.trim() === creds.username && password === creds.password) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({
          authenticated: true,
          timestamp: Date.now()
        }));
        return true;
      }
      return false;
    },
    logout: function () {
      localStorage.removeItem(AUTH_KEY);
    },
    isAuthenticated: function () {
      try {
        const auth = localStorage.getItem(AUTH_KEY);
        if (!auth) return false;
        const parsed = JSON.parse(auth);
        return parsed && parsed.authenticated === true;
      } catch (e) {
        return false;
      }
    }
  };

  // Expose to window
  window.DB = DB;

  // Initial self-check
  if (!localStorage.getItem(STORAGE_KEY)) {
    DB.save(defaultSiteData);
  }
})();
