/**
 * API Client — Connects frontend to backend
 */
// Automatically use localhost for local development, and the deployed origin for production
const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' || window.location.protocol === 'file:';
const BACKEND_URL = isLocal ? 'http://localhost:5000' : window.location.origin;
const API_BASE = BACKEND_URL + '/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token
  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token
  clearToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Base fetch wrapper
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.getToken()) {
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // GET
  async get(endpoint) {
    return this.request(endpoint);
  }

  // POST
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // PUT
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  // DELETE
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // ===== AUTH =====
  async login(email, password) {
    const data = await this.post('/auth/login', { email, password });
    if (data.success) {
      this.setToken(data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
    }
    return data;
  }

  async getMe() {
    return this.get('/auth/me');
  }

  logout() {
    this.clearToken();
    window.location.href = '/admin/login.html';
  }

  // ===== APPOINTMENTS =====
  async bookAppointment(data) {
    return this.post('/appointments', data);
  }

  async getAppointments(params = '') {
    return this.get(`/appointments${params ? '?' + params : ''}`);
  }

  async updateAppointment(id, data) {
    return this.put(`/appointments/${id}`, data);
  }

  async deleteAppointment(id) {
    return this.delete(`/appointments/${id}`);
  }

  async getAppointmentStats() {
    return this.get('/appointments/stats');
  }

  // ===== CONTACT =====
  async submitContact(data) {
    return this.post('/contact', data);
  }

  async getContacts(params = '') {
    return this.get(`/contact${params ? '?' + params : ''}`);
  }

  async markContactRead(id) {
    return this.put(`/contact/${id}`);
  }

  async deleteContact(id) {
    return this.delete(`/contact/${id}`);
  }

  // ===== BLOGS =====
  async getBlogs(params = '') {
    return this.get(`/blogs${params ? '?' + params : ''}`);
  }

  async getBlog(slug) {
    return this.get(`/blogs/${slug}`);
  }

  async getAllBlogsAdmin() {
    return this.get('/blogs/admin/all');
  }

  async createBlog(data) {
    return this.post('/blogs', data);
  }

  async updateBlog(id, data) {
    return this.put(`/blogs/${id}`, data);
  }

  async deleteBlog(id) {
    return this.delete(`/blogs/${id}`);
  }

  // ===== TESTIMONIALS =====
  async getTestimonials() {
    return this.get('/testimonials');
  }

  async getAllTestimonialsAdmin() {
    return this.get('/testimonials/admin/all');
  }

  async createTestimonial(data) {
    return this.post('/testimonials', data);
  }

  async updateTestimonial(id, data) {
    return this.put(`/testimonials/${id}`, data);
  }

  async deleteTestimonial(id) {
    return this.delete(`/testimonials/${id}`);
  }

  // ===== CASES =====
  async getCases(caseType = '') {
    return this.get(`/cases${caseType ? '?caseType=' + caseType : ''}`);
  }

  async getAllCasesAdmin() {
    return this.get('/cases/admin/all');
  }

  async createCase(data) {
    return this.post('/cases', data);
  }

  async updateCase(id, data) {
    return this.put(`/cases/${id}`, data);
  }

  async deleteCase(id) {
    return this.delete(`/cases/${id}`);
  }
}

// Global instance
const api = new ApiClient();

/* ===== Dynamic Content Loaders ===== */

// Load testimonials into a container
async function loadTestimonials(containerId, limit = 6) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    container.innerHTML = '<p class="text-center text-muted">Loading testimonials...</p>';
    const { data } = await api.getTestimonials();
    const items = limit ? data.slice(0, limit) : data;

    if (!items.length) {
      container.innerHTML = getFallbackTestimonials();
      return;
    }

    container.innerHTML = items.map(t => `
      <div class="testimonial-card" data-animate="fade-up">
        <div class="testimonial-stars">
          ${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}
        </div>
        <p class="testimonial-text">"${t.content}"</p>
        <div class="testimonial-author">
          <div class="testimonial-avatar">${t.name.charAt(0)}</div>
          <div>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-role">${t.role}</div>
          </div>
        </div>
      </div>
    `).join('');

    // Re-init animations for new elements
    initScrollAnimations();
  } catch (error) {
    container.innerHTML = getFallbackTestimonials();
  }
}

// Load case results
async function loadCaseResults(containerId, limit = 6) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    container.innerHTML = '<p class="text-center text-muted">Loading case results...</p>';
    const { data } = await api.getCases();
    const items = limit ? data.slice(0, limit) : data;

    if (!items.length) {
      container.innerHTML = getFallbackCases();
      return;
    }

    container.innerHTML = items.map(c => `
      <div class="case-card" data-animate="fade-up">
        <span class="case-card-badge">${c.resultBadge}</span>
        <h4>${c.title}</h4>
        <p>${c.description.substring(0, 150)}...</p>
        <p style="font-weight:600; color: var(--navy-800); margin-bottom:0.5rem;">${c.result}</p>
        <div class="case-card-meta">
          <span>⏱ ${c.timeline}</span>
          <span>🏛 ${c.court}</span>
          <span>📅 ${c.year}</span>
        </div>
      </div>
    `).join('');

    initScrollAnimations();
  } catch (error) {
    container.innerHTML = getFallbackCases();
  }
}

// Load blogs
async function loadBlogs(containerId, category = 'all', limit = 6) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    container.innerHTML = '<p class="text-center text-muted">Loading articles...</p>';
    let params = `limit=${limit}`;
    if (category && category !== 'all') params += `&category=${category}`;

    const { data } = await api.getBlogs(params);

    if (!data.length) {
      container.innerHTML = getFallbackBlogs();
      return;
    }

    const categoryLabels = {
      'legal-advice': 'Legal Advice',
      'case-studies': 'Case Studies',
      'news': 'News',
      'guides': 'Guides'
    };

    container.innerHTML = data.map(b => `
      <div class="blog-card" data-animate="fade-up">
        <div class="blog-card-image">
          <span class="blog-card-category">${categoryLabels[b.category] || b.category}</span>
          ⚖️
        </div>
        <div class="blog-card-body">
          <p class="blog-card-date">${new Date(b.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <h3>${b.title}</h3>
          <p>${b.excerpt}</p>
          <a href="blog.html?slug=${b.slug}" class="card-link">Read Article →</a>
        </div>
      </div>
    `).join('');

    initScrollAnimations();
  } catch (error) {
    container.innerHTML = getFallbackBlogs();
  }
}

// ===== Fallback static content (when API is unavailable) =====
function getFallbackTestimonials() {
  const testimonials = [
    { name: 'Rajesh Patel', role: 'Business Owner', content: 'BHATI LAW ASSOCIATES handled my corporate dispute with outstanding professionalism. The case was resolved in our favour within 3 months. Highly recommended for any business legal matters in Indore.', rating: 5 },
    { name: 'Sunita Verma', role: 'Debt Recovery Client', content: 'I had been struggling with recovering a large outstanding amount for over a year. The team filed a recovery suit and got the matter resolved efficiently. Excellent SARFAESI work.', rating: 5 },
    { name: 'Amit Kumar', role: 'Criminal Defense Client', content: 'I was wrongly accused in a fraud case. BHATI LAW ASSOCIATES secured my bail within 48 hours and eventually got me acquitted. Their criminal defense expertise is unmatched.', rating: 5 },
    { name: 'Priya Sharma', role: 'Property Dispute Client', content: 'Had a complex property dispute that lasted years before I approached BHATI LAW ASSOCIATES. They resolved it in just 6 months with a favourable verdict. Excellent work by Adv. Ajit Singh Bhati.', rating: 5 },
    { name: 'Vikram Singh', role: 'Startup Founder', content: 'Exceptional corporate advisory for our startup — from incorporation to investor agreements. Their understanding of business law is remarkable. Truly professional team.', rating: 4 },
    { name: 'Deepa Nair', role: 'Civil Litigation Client', content: 'Professional, punctual and dedicated. The team personally argued my civil case in the High Court and won. Could not have asked for better legal representation.', rating: 5 }
  ];

  return testimonials.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
      <p class="testimonial-text">"${t.content}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.name.charAt(0)}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function getFallbackCases() {
  const cases = [
    { title: 'Bail Granted in 48 Hours — Wrongful Fraud Accusation', desc: 'Client was falsely implicated in a commercial fraud case with multiple co-accused. We prepared a comprehensive bail application highlighting the lack of direct evidence.', result: 'Bail granted by Sessions Court within 48 hours. Client later acquitted of all charges.', badge: 'acquitted', time: '48 hrs (bail) / 8 months', court: 'Sessions Court, Indore', year: 2024 },
    { title: 'Debt Recovery — ₹1.5 Cr Outstanding Loan Recovered', desc: 'Financial institution sought recovery of ₹1.5 Cr in outstanding secured loans. Borrower had defaulted for over 18 months and was evading legal notices.', result: 'Full recovery achieved through SARFAESI proceedings including symbolic and physical possession.', badge: 'won', time: '4 months', court: 'DRT, Indore', year: 2024 },
    { title: 'Property Dispute Resolved — Ancestral Land Partition', desc: 'Multi-party property inheritance dispute involving ancestral land. Case involved competing claims from siblings and forged documentation allegations.', result: 'Favourable partition decree securing client\'s rightful share of the property.', badge: 'won', time: '6 months', court: 'District Court, Indore', year: 2024 },
    { title: 'Corporate Fraud Dismissed — Director Exonerated', desc: 'Company director accused of financial mismanagement and embezzlement by minority shareholders. Faced potential criminal prosecution under Companies Act.', result: 'All charges dismissed. NCLT ruled in favour of the director with costs awarded.', badge: 'dismissed', time: '10 months', court: 'NCLT, Indore Bench', year: 2024 },
    { title: 'Cheque Bounce Recovery — ₹45 Lakh Recovered Under NI Act', desc: 'Client issued multiple cheques that bounced. Filed complaint under Section 138 of Negotiable Instruments Act for recovery of ₹45 lakh.', result: 'Full amount of ₹45 lakh recovered through successful prosecution and settlement.', badge: 'won', time: '3 months', court: 'Magistrate Court, Indore', year: 2023 },
    { title: 'Civil Injunction Granted — Commercial Property Protected', desc: 'Client\'s commercial property was being illegally encroached upon. Urgent injunction application filed to prevent further damage and encroachment.', result: 'Injunction granted preventing encroachment. Subsequently won the title suit with possession restored.', badge: 'won', time: '5 months', court: 'Civil Court, Indore', year: 2024 }
  ];

  return cases.map(c => `
    <div class="case-card">
      <span class="case-card-badge">${c.badge}</span>
      <h4>${c.title}</h4>
      <p>${c.desc}</p>
      <p style="font-weight:600; color: var(--navy-800); margin-bottom:0.5rem;">${c.result}</p>
      <div class="case-card-meta">
        <span>⏱ ${c.time}</span>
        <span>🏛 ${c.court}</span>
        <span>📅 ${c.year}</span>
      </div>
    </div>
  `).join('');
}

function getFallbackBlogs() {
  const blogs = [
    { title: 'What to Do After an FIR is Filed Against You in India', excerpt: 'Getting named in an FIR can be alarming. Here is a step-by-step guide on your legal rights and the immediate actions you should take.', category: 'Legal Advice', date: 'December 15, 2024' },
    { title: 'How Bail Works in India: A Complete Legal Guide', excerpt: 'Understand the types of bail, the application process, conditions, and your rights when seeking bail in Indian courts.', category: 'Legal Advice', date: 'November 20, 2024' },
    { title: 'Understanding Debt Recovery Under SARFAESI Act', excerpt: 'A comprehensive guide to the SARFAESI Act and how financial institutions can recover secured debts through legal mechanisms.', category: 'Guides', date: 'October 10, 2024' },
    { title: 'Cheque Bounce Cases Under Section 138 NI Act', excerpt: 'Everything you need to know about cheque bounce cases — legal process, penalties, and how to file or defend a complaint under the NI Act.', category: 'Legal Advice', date: 'September 5, 2024' },
    { title: 'Insolvency & Bankruptcy Code (IBC): What Businesses Need to Know', excerpt: 'An overview of the IBC framework, CIRP process, and what creditors and debtors need to understand about insolvency proceedings in India.', category: 'News', date: 'August 20, 2024' },
    { title: 'Starting a Business in India: Legal Checklist for Entrepreneurs', excerpt: 'A comprehensive legal checklist for entrepreneurs looking to start a business in India — from registration to compliance.', category: 'Guides', date: 'July 15, 2024' }
  ];

  return blogs.map(b => `
    <div class="blog-card">
      <div class="blog-card-image">
        <span class="blog-card-category">${b.category}</span>
        ⚖️
      </div>
      <div class="blog-card-body">
        <p class="blog-card-date">${b.date}</p>
        <h3>${b.title}</h3>
        <p>${b.excerpt}</p>
        <a href="blog.html" class="card-link">Read Article →</a>
      </div>
    </div>
  `).join('');
}

// Helper: re-initialize scroll animations for dynamically loaded content
function initScrollAnimations() {
  const animElements = document.querySelectorAll('[data-animate]:not(.visible)');
  if (!animElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animElements.forEach(el => observer.observe(el));
}
