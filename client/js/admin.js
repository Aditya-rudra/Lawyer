/**
 * Admin Dashboard JavaScript
 * Handles all admin panel interactions
 */

// ===== Auth Guard =====
function checkAuth() {
  if (!api.isAuthenticated()) {
    window.location.href = '/admin/login.html';
    return false;
  }
  return true;
}

// ===== Dashboard Stats =====
async function loadDashboardStats() {
  try {
    const [appointments, contacts, blogs, cases, testimonials] = await Promise.all([
      api.getAppointments('limit=1'),
      api.getContacts('limit=1'),
      api.getAllBlogsAdmin(),
      api.getAllCasesAdmin(),
      api.getAllTestimonialsAdmin()
    ]);

    document.getElementById('stat-appointments').textContent = appointments.total || 0;
    document.getElementById('stat-contacts').textContent = contacts.total || 0;
    document.getElementById('stat-blogs').textContent = blogs.total || 0;
    document.getElementById('stat-cases').textContent = cases.data?.length || 0;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

// ===== Appointments Management =====
async function loadAppointments(status = '') {
  const container = document.getElementById('appointments-list');
  if (!container) return;

  try {
    container.innerHTML = '<p class="text-muted">Loading appointments...</p>';
    const params = status ? `status=${status}` : '';
    
    console.log("Fetching appointments from backend API...");
    const response = await api.getAppointments(params);
    console.log("API Response received:", response);
    
    const appointments = response.data || [];
    console.log("Appointments:", appointments);

    if (!appointments || appointments.length === 0) {
      container.innerHTML = '<p class="text-muted">No appointments found.</p>';
      return;
    }

    displayAppointments(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    container.innerHTML = `<p class="text-muted">Error loading appointments: ${error.message}</p>`;
  }
}

function displayAppointments(data) {
  const container = document.getElementById('appointments-list');
  container.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th>Case Type</th>
          <th>Message</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(a => `
          <tr>
            <td><strong>${a.name}</strong></td>
            <td>${a.email}<br><small>${a.phone}</small></td>
            <td><span class="badge badge-${a.caseType}">${a.caseType}</span></td>
            <td class="msg-cell" title="${a.message || ''}">${a.message ? (a.message.length > 40 ? a.message.substring(0, 40) + '...' : a.message) : '<span class="text-muted">No message</span>'}</td>
            <td>${new Date(a.preferredDate).toLocaleDateString('en-IN')}<br><small>${a.preferredTime}</small></td>
            <td><span class="status-badge status-${a.status}">${a.status}</span></td>
            <td class="actions">
              ${a.status === 'pending' ? `
                <button onclick="updateAppointmentStatus('${a._id}', 'approved')" class="btn-action btn-approve" title="Approve">✓</button>
                <button onclick="updateAppointmentStatus('${a._id}', 'rejected')" class="btn-action btn-reject" title="Reject">✕</button>
              ` : ''}
              <button onclick="deleteAppointmentItem('${a._id}')" class="btn-action btn-delete" title="Delete">🗑</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

async function updateAppointmentStatus(id, status) {
  if (!confirm(`Are you sure you want to ${status} this appointment?`)) return;
  try {
    await api.updateAppointment(id, { status });
    loadAppointments();
    showToast(`Appointment ${status}`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteAppointmentItem(id) {
  if (!confirm('Delete this appointment?')) return;
  try {
    await api.deleteAppointment(id);
    loadAppointments();
    showToast('Appointment deleted', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// ===== Contacts Management =====
async function loadContacts() {
  const container = document.getElementById('contacts-list');
  if (!container) return;

  try {
    container.innerHTML = '<p class="text-muted">Loading inquiries...</p>';
    const { data } = await api.getContacts();

    if (!data.length) {
      container.innerHTML = '<p class="text-muted">No inquiries found.</p>';
      return;
    }

    container.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(c => `
            <tr class="${c.isRead ? '' : 'unread'}">
              <td><strong>${c.name}</strong><br><small>${c.email}</small></td>
              <td>${c.subject}</td>
              <td class="msg-cell">${c.message.substring(0, 80)}...</td>
              <td>${new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
              <td><span class="status-badge status-${c.isRead ? 'approved' : 'pending'}">${c.isRead ? 'Read' : 'New'}</span></td>
              <td class="actions">
                ${!c.isRead ? `<button onclick="markRead('${c._id}')" class="btn-action btn-approve" title="Mark Read">✓</button>` : ''}
                <button onclick="deleteContactItem('${c._id}')" class="btn-action btn-delete" title="Delete">🗑</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    container.innerHTML = `<p class="text-muted">Error: ${error.message}</p>`;
  }
}

async function markRead(id) {
  try {
    await api.markContactRead(id);
    loadContacts();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteContactItem(id) {
  if (!confirm('Delete this inquiry?')) return;
  try {
    await api.deleteContact(id);
    loadContacts();
    showToast('Inquiry deleted', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// ===== Blog Management =====
async function loadAdminBlogs() {
  const container = document.getElementById('blogs-list');
  if (!container) return;

  try {
    container.innerHTML = '<p class="text-muted">Loading blogs...</p>';
    const { data } = await api.getAllBlogsAdmin();

    if (!data.length) {
      container.innerHTML = '<p class="text-muted">No blog posts yet.</p>';
      return;
    }

    container.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Views</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(b => `
            <tr>
              <td><strong>${b.title}</strong></td>
              <td><span class="badge">${b.category}</span></td>
              <td><span class="status-badge status-${b.isPublished ? 'approved' : 'pending'}">${b.isPublished ? 'Published' : 'Draft'}</span></td>
              <td>${b.views || 0}</td>
              <td>${new Date(b.createdAt).toLocaleDateString('en-IN')}</td>
              <td class="actions">
                <button onclick="toggleBlogPublish('${b._id}', ${!b.isPublished})" class="btn-action btn-approve" title="${b.isPublished ? 'Unpublish' : 'Publish'}">
                  ${b.isPublished ? '📤' : '📥'}
                </button>
                <button onclick="deleteBlogItem('${b._id}')" class="btn-action btn-delete" title="Delete">🗑</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    container.innerHTML = `<p class="text-muted">Error: ${error.message}</p>`;
  }
}

async function toggleBlogPublish(id, publish) {
  try {
    await api.updateBlog(id, {
      isPublished: publish,
      publishedAt: publish ? new Date() : null
    });
    loadAdminBlogs();
    showToast(`Blog ${publish ? 'published' : 'unpublished'}`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteBlogItem(id) {
  if (!confirm('Delete this blog post?')) return;
  try {
    await api.deleteBlog(id);
    loadAdminBlogs();
    showToast('Blog deleted', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function createBlogPost(formData) {
  try {
    await api.createBlog(formData);
    showToast('Blog post created!', 'success');
    loadAdminBlogs();
    document.getElementById('blog-form').reset();
    toggleModal('blog-modal', false);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// ===== Testimonials Management =====
async function loadAdminTestimonials() {
  const container = document.getElementById('testimonials-list');
  if (!container) return;

  try {
    container.innerHTML = '<p class="text-muted">Loading testimonials...</p>';
    const { data } = await api.getAllTestimonialsAdmin();

    if (!data.length) {
      container.innerHTML = '<p class="text-muted">No testimonials yet.</p>';
      return;
    }

    container.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Review</th>
            <th>Rating</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(t => `
            <tr>
              <td><strong>${t.name}</strong><br><small>${t.role}</small></td>
              <td class="msg-cell">${t.content.substring(0, 100)}...</td>
              <td>${'★'.repeat(t.rating)}</td>
              <td><span class="status-badge status-${t.isActive ? 'approved' : 'rejected'}">${t.isActive ? 'Active' : 'Hidden'}</span></td>
              <td class="actions">
                <button onclick="toggleTestimonial('${t._id}', ${!t.isActive})" class="btn-action btn-approve">
                  ${t.isActive ? '👁️' : '🙈'}
                </button>
                <button onclick="deleteTestimonialItem('${t._id}')" class="btn-action btn-delete">🗑</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    container.innerHTML = `<p class="text-muted">Error: ${error.message}</p>`;
  }
}

async function toggleTestimonial(id, active) {
  try {
    await api.updateTestimonial(id, { isActive: active });
    loadAdminTestimonials();
    showToast(`Testimonial ${active ? 'activated' : 'hidden'}`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteTestimonialItem(id) {
  if (!confirm('Delete this testimonial?')) return;
  try {
    await api.deleteTestimonial(id);
    loadAdminTestimonials();
    showToast('Testimonial deleted', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function createTestimonialItem(formData) {
  try {
    await api.createTestimonial(formData);
    showToast('Testimonial added!', 'success');
    loadAdminTestimonials();
    document.getElementById('testimonial-form').reset();
    toggleModal('testimonial-modal', false);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// ===== Cases Management =====
async function loadAdminCases() {
  const container = document.getElementById('cases-list');
  if (!container) return;

  try {
    container.innerHTML = '<p class="text-muted">Loading cases...</p>';
    const { data } = await api.getAllCasesAdmin();

    if (!data.length) {
      container.innerHTML = '<p class="text-muted">No case results yet.</p>';
      return;
    }

    container.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Result</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(c => `
            <tr>
              <td><strong>${c.title}</strong></td>
              <td><span class="badge">${c.caseType}</span></td>
              <td><span class="status-badge status-approved">${c.resultBadge}</span></td>
              <td>${c.year}</td>
              <td class="actions">
                <button onclick="deleteCaseItem('${c._id}')" class="btn-action btn-delete">🗑</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    container.innerHTML = `<p class="text-muted">Error: ${error.message}</p>`;
  }
}

async function deleteCaseItem(id) {
  if (!confirm('Delete this case result?')) return;
  try {
    await api.deleteCase(id);
    loadAdminCases();
    showToast('Case deleted', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function createCaseItem(formData) {
  try {
    await api.createCase(formData);
    showToast('Case result added!', 'success');
    loadAdminCases();
    document.getElementById('case-form').reset();
    toggleModal('case-modal', false);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// ===== UI Helpers =====
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function toggleModal(modalId, show = true) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = show ? 'flex' : 'none';
  }
}

// Tab switching
function switchTab(tabName) {
  document.querySelectorAll('.admin-tab-content').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));

  const tab = document.getElementById(`tab-${tabName}`);
  if (tab) tab.style.display = 'block';

  const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (tabBtn) tabBtn.classList.add('active');

  // Load data for the selected tab
  switch(tabName) {
    case 'appointments': loadAppointments(); break;
    case 'contacts': loadContacts(); break;
    case 'blogs': loadAdminBlogs(); break;
    case 'testimonials': loadAdminTestimonials(); break;
    case 'cases': loadAdminCases(); break;
    case 'dashboard': loadDashboardStats(); break;
  }
}
