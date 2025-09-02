/*
 * admin.js
 *
 * Provides functionality for the admin side of the AGS Activities platform.
 * Handles login authentication, persistence of admin session, and CRUD
 * operations on registrations, activities, gallery images, and chatbot
 * responses via localStorage. This script is shared between login and
 * dashboard pages.
 */

// Utility to check if admin is logged in
function isAdminLoggedIn() {
  return localStorage.getItem('adminLoggedIn') === 'true';
}

// Handle login page behaviour
function handleLoginPage() {
  const loginForm = document.getElementById('admin-login-form');
  if (!loginForm) return;
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    // Simple hard-coded credentials for demonstration
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminLoggedIn', 'true');
      window.location.href = 'dashboard.html';
    } else {
      alert('بيانات الدخول غير صحيحة. تأكد من اسم المستخدم وكلمة المرور.');
    }
  });
}

// Redirect unauthorized users away from dashboard
function requireAdmin() {
  if (!isAdminLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// Logout admin
function handleLogout() {
  const logoutBtn = document.getElementById('logout-button');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem('adminLoggedIn');
      window.location.href = 'login.html';
    });
  }
}

/* Registrations Management */
function renderRegistrations() {
  const tableBody = document.querySelector('#registrations-table tbody');
  if (!tableBody) return;
  let registrations = [];
  try {
    registrations = JSON.parse(localStorage.getItem('registrations'));
  } catch (err) {
    registrations = [];
  }
  if (!Array.isArray(registrations)) registrations = [];
  tableBody.innerHTML = '';
  registrations.forEach((reg, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${reg.studentName || ''}</td>
      <td>${reg.grade || ''}</td>
      <td>${reg.subscription || ''}</td>
      <td>${reg.amount || ''}</td>
      <td><button class="delete" data-index="${index}">حذف</button></td>
    `;
    tableBody.appendChild(tr);
  });
  // Attach delete handlers
  tableBody.querySelectorAll('button.delete').forEach((btn) => {
    btn.addEventListener('click', function () {
      const idx = parseInt(this.getAttribute('data-index'));
      registrations.splice(idx, 1);
      localStorage.setItem('registrations', JSON.stringify(registrations));
      renderRegistrations();
    });
  });
}

/* Activities Management */
function renderActivities() {
  const tableBody = document.querySelector('#activities-table tbody');
  if (!tableBody) return;
  let activities = [];
  try {
    activities = JSON.parse(localStorage.getItem('activities'));
  } catch (err) {
    activities = [];
  }
  if (!Array.isArray(activities)) activities = [];
  tableBody.innerHTML = '';
  activities.forEach((act, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${act.title || ''}</td>
      <td>${act.description || ''}</td>
      <td>${act.type || ''}</td>
      <td>${act.type === 'free' ? 'مجاني' : act.price || ''}</td>
      <td><button class="delete" data-index="${index}">حذف</button></td>
    `;
    tableBody.appendChild(tr);
  });
  // Delete handlers
  tableBody.querySelectorAll('button.delete').forEach((btn) => {
    btn.addEventListener('click', function () {
      const idx = parseInt(this.getAttribute('data-index'));
      activities.splice(idx, 1);
      localStorage.setItem('activities', JSON.stringify(activities));
      renderActivities();
    });
  });
}

function handleAddActivity() {
  const form = document.getElementById('add-activity-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('activityTitle').value.trim();
    const description = document.getElementById('activityDescription').value.trim();
    const priceValue = document.getElementById('activityPrice').value;
    const type = document.getElementById('activityType').value;
    const fileInput = document.getElementById('activityImage');
    const file = fileInput.files[0];
    // Load current activities
    let activities = [];
    try {
      activities = JSON.parse(localStorage.getItem('activities'));
    } catch (err) {
      activities = [];
    }
    if (!Array.isArray(activities)) activities = [];
    // Convert image to base64 (async)
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const newActivity = {
          title,
          description,
          type,
          price: type === 'free' ? 0 : parseFloat(priceValue) || 0,
          image: e.target.result
        };
        activities.push(newActivity);
        localStorage.setItem('activities', JSON.stringify(activities));
        renderActivities();
        form.reset();
      };
      reader.readAsDataURL(file);
    } else {
      // If no image provided, use default hero image
      const newActivity = {
        title,
        description,
        type,
        price: type === 'free' ? 0 : parseFloat(priceValue) || 0,
        image: '../images/hero-bg.jpg'
      };
      activities.push(newActivity);
      localStorage.setItem('activities', JSON.stringify(activities));
      renderActivities();
      form.reset();
    }
  });
}

/* Gallery Management */
function renderGalleryManagement() {
  const galleryDiv = document.getElementById('gallery-management');
  if (!galleryDiv) return;
  let images = [];
  try {
    images = JSON.parse(localStorage.getItem('gallery'));
  } catch (err) {
    images = [];
  }
  if (!Array.isArray(images)) images = [];
  galleryDiv.innerHTML = '';
  images.forEach((imgSrc, index) => {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    wrapper.style.margin = '5px';
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.width = '150px';
    img.style.height = '100px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '4px';
    const delBtn = document.createElement('button');
    delBtn.textContent = '×';
    delBtn.style.position = 'absolute';
    delBtn.style.top = '0';
    delBtn.style.right = '0';
    delBtn.style.background = '#dc3545';
    delBtn.style.color = '#fff';
    delBtn.style.border = 'none';
    delBtn.style.borderRadius = '50%';
    delBtn.style.width = '20px';
    delBtn.style.height = '20px';
    delBtn.style.cursor = 'pointer';
    delBtn.setAttribute('data-index', index);
    delBtn.addEventListener('click', function () {
      const idx = parseInt(this.getAttribute('data-index'));
      images.splice(idx, 1);
      localStorage.setItem('gallery', JSON.stringify(images));
      renderGalleryManagement();
    });
    wrapper.appendChild(img);
    wrapper.appendChild(delBtn);
    galleryDiv.appendChild(wrapper);
  });
}

function handleAddImage() {
  const form = document.getElementById('add-image-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const fileInput = document.getElementById('galleryImage');
    const file = fileInput.files[0];
    if (!file) return;
    let images = [];
    try {
      images = JSON.parse(localStorage.getItem('gallery'));
    } catch (err) {
      images = [];
    }
    if (!Array.isArray(images)) images = [];
    const reader = new FileReader();
    reader.onload = function (evt) {
      images.push(evt.target.result);
      localStorage.setItem('gallery', JSON.stringify(images));
      renderGalleryManagement();
      form.reset();
    };
    reader.readAsDataURL(file);
  });
}

/* Bot Responses Management */
function renderBotResponses() {
  const tableBody = document.querySelector('#responses-table tbody');
  if (!tableBody) return;
  let responses = [];
  try {
    responses = JSON.parse(localStorage.getItem('botResponses'));
  } catch (err) {
    responses = [];
  }
  if (!Array.isArray(responses)) responses = [];
  tableBody.innerHTML = '';
  responses.forEach((pair, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${pair.question}</td>
      <td>${pair.answer}</td>
      <td><button class="delete" data-index="${index}">حذف</button></td>
    `;
    tableBody.appendChild(tr);
  });
  // Delete handlers
  tableBody.querySelectorAll('button.delete').forEach((btn) => {
    btn.addEventListener('click', function () {
      const idx = parseInt(this.getAttribute('data-index'));
      responses.splice(idx, 1);
      localStorage.setItem('botResponses', JSON.stringify(responses));
      renderBotResponses();
    });
  });
}

function handleAddResponse() {
  const form = document.getElementById('add-response-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const question = document.getElementById('botQuestion').value.trim();
    const answer = document.getElementById('botAnswer').value.trim();
    if (!question || !answer) return;
    let responses = [];
    try {
      responses = JSON.parse(localStorage.getItem('botResponses'));
    } catch (err) {
      responses = [];
    }
    if (!Array.isArray(responses)) responses = [];
    responses.push({ question, answer });
    localStorage.setItem('botResponses', JSON.stringify(responses));
    renderBotResponses();
    form.reset();
  });
}

// Initialise dashboard when DOM is ready
function initDashboard() {
  requireAdmin();
  renderRegistrations();
  renderActivities();
  renderGalleryManagement();
  renderBotResponses();
  handleAddActivity();
  handleAddImage();
  handleAddResponse();
  handleLogout();
}

// Setup logic on DOMContentLoaded for both login and dashboard
document.addEventListener('DOMContentLoaded', function () {
  // Determine page based on presence of specific elements
  if (document.getElementById('admin-login-form')) {
    handleLoginPage();
  } else if (document.getElementById('registrations-section')) {
    initDashboard();
  }
});