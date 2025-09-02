/*
  Main JavaScript for the AGS platform.
  Handles sidebar toggling, chatbot, rendering of dynamic content such as
  statistics, activities, events and trips, search filtering, and gallery filtering.
*/

// Sidebar toggle
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  }
}

// Chatbot toggle
function toggleChatbot() {
  const container = document.getElementById('chatbot-container');
  container.style.display = container.style.display === 'none' || container.style.display === '' ? 'block' : 'none';
}

// Chatbot simple Q&A logic
const chatbotResponses = JSON.parse(localStorage.getItem('chatbotResponses') || '{}');

function sendMessage() {
  const input = document.getElementById('chatbot-user-input');
  if (!input) return;
  const message = input.value.trim();
  if (!message) return;
  addChatMessage('user', message);
  input.value = '';
  // respond after small delay
  setTimeout(() => {
    const lower = message.toLowerCase();
    let response = chatbotResponses[lower];
    if (!response) {
      response = document.documentElement.lang === 'ar'
        ? 'عذرًا، لا أملك إجابة لهذا السؤال بعد.'
        : "Sorry, I don't have an answer for that yet.";
    }
    addChatMessage('bot', response);
  }, 500);
}

function addChatMessage(sender, text) {
  const messages = document.getElementById('chatbot-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = sender === 'user' ? 'mb-2 text-end' : 'mb-2 text-start';
  msgDiv.innerHTML = `<span class="badge bg-${sender === 'user' ? 'primary' : 'secondary'}">${sender === 'user' ? (document.documentElement.lang === 'ar' ? 'أنت' : 'You') : 'AGS'}</span> ` + text;
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

// Sample data for demonstration (to be replaced by admin-controlled data)
const sampleActivities = [
  {
    id: 1,
    type: 'paid',
    title_ar: 'نشاط كرة القدم',
    title_en: 'Football Activity',
    description_ar: 'تعلم أساسيات كرة القدم.',
    description_en: 'Learn the basics of football.',
    image: 'images/hero-bg.jpg',
    price: 50
  },
  {
    id: 2,
    type: 'free',
    title_ar: 'نشاط الرسم',
    title_en: 'Drawing Activity',
    description_ar: 'ورشة لتعلم الرسم.',
    description_en: 'Workshop to learn drawing.',
    image: 'images/hero-bg.jpg',
    price: 0
  },
  {
    id: 3,
    type: 'trip',
    title_ar: 'رحلة إلى المتحف',
    title_en: 'Museum Trip',
    description_ar: 'زيارة تعليمية للمتحف.',
    description_en: 'Educational visit to the museum.',
    image: 'images/hero-bg.jpg',
    price: 30
  }
];

const sampleGallery = [
  {
    id: 1,
    type: 'activity',
    time: 'recent',
    src: 'images/hero-bg.jpg',
    title_ar: 'نشاط كرة القدم',
    title_en: 'Football Activity'
  },
  {
    id: 2,
    type: 'trip',
    time: 'old',
    src: 'images/hero-bg.jpg',
    title_ar: 'رحلة إلى المتحف',
    title_en: 'Museum Trip'
  }
];

// Initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Render stats if stats container exists
  const statsContainer = document.getElementById('stats-container');
  if (statsContainer) {
    renderStats(statsContainer);
  }
  // Render carousels/sections on home page
  if (document.getElementById('popular-activities')) {
    renderActivities(document.getElementById('popular-activities'), 'paid');
  }
  if (document.getElementById('current-events')) {
    renderActivities(document.getElementById('current-events'), 'free');
  }
  if (document.getElementById('current-trips')) {
    renderActivities(document.getElementById('current-trips'), 'trip');
  }
  // Render activities list on respective pages
  if (document.getElementById('paid-activities-list')) {
    renderActivitiesList(document.getElementById('paid-activities-list'), 'paid');
  }
  if (document.getElementById('free-activities-list')) {
    renderActivitiesList(document.getElementById('free-activities-list'), 'free');
  }
  if (document.getElementById('trips-list')) {
    renderActivitiesList(document.getElementById('trips-list'), 'trip');
  }
  // Gallery page
  if (document.getElementById('gallery-grid')) {
    renderGallery();
  }
  // Render hero slides
  renderHeroSlides();
  // Search functionality
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = document.getElementById('search-query').value.toLowerCase();
      const type = document.getElementById('filter-type').value;
      const grade = document.getElementById('filter-grade').value;
      const results = sampleActivities.filter((act) => {
        // text match on both languages
        const matchesQuery = act.title_ar.toLowerCase().includes(query) || act.title_en.toLowerCase().includes(query);
        const matchesType = type === 'all' || act.type === type;
        // grade filter not implemented: always true
        return matchesQuery && matchesType;
      });
      displaySearchResults(results);
    });
  }
});

// Render statistics (dummy numbers)
function renderStats(container) {
  container.innerHTML = '';
  const stats = [
    { label_ar: 'المشتركين', label_en: 'Subscribers', value: 120 },
    { label_ar: 'الأنشطة', label_en: 'Activities', value: 8 },
    { label_ar: 'الرحلات', label_en: 'Trips', value: 3 }
  ];
  stats.forEach((stat) => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-3';
    col.innerHTML = `
      <div class="card">
        <h4>${stat.value}</h4>
        <p>${document.documentElement.lang === 'ar' ? stat.label_ar : stat.label_en}</p>
      </div>
    `;
    container.appendChild(col);
  });
}

// Render carousel-like cards on home page for a given type
function renderActivities(container, type) {
  container.innerHTML = '';
  const filtered = sampleActivities.filter((act) => act.type === type);
  filtered.forEach((act) => {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.innerHTML = `
      <div class="card-activity">
        <img src="${act.image}" alt="${act.title_ar}" />
        <div class="card-body">
          <h5 class="card-title">${document.documentElement.lang === 'ar' ? act.title_ar : act.title_en}</h5>
          <p class="card-text">${document.documentElement.lang === 'ar' ? act.description_ar : act.description_en}</p>
          <button class="btn btn-outline-primary btn-sm" onclick="showDetails(${act.id})">${document.documentElement.lang === 'ar' ? 'التفاصيل' : 'Details'}</button>
          <button class="btn btn-primary btn-sm" onclick="openRegistration(${act.id})">${document.documentElement.lang === 'ar' ? 'تسجيل' : 'Register'}</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// Render list of activities/trips on dedicated pages
function renderActivitiesList(container, type) {
  container.innerHTML = '';
  const filtered = sampleActivities.filter((act) => act.type === type);
  filtered.forEach((act) => {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.innerHTML = `
      <div class="card-activity">
        <img src="${act.image}" alt="${act.title_ar}" />
        <div class="card-body">
          <h5 class="card-title">${document.documentElement.lang === 'ar' ? act.title_ar : act.title_en}</h5>
          <p class="card-text">${document.documentElement.lang === 'ar' ? act.description_ar : act.description_en}</p>
          <button class="btn btn-outline-primary btn-sm" onclick="showDetails(${act.id})">${document.documentElement.lang === 'ar' ? 'التفاصيل' : 'Details'}</button>
          <button class="btn btn-primary btn-sm" onclick="openRegistration(${act.id})">${document.documentElement.lang === 'ar' ? 'تسجيل' : 'Register'}</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// Show details modal
function showDetails(id) {
  const act = sampleActivities.find((a) => a.id === id);
  const modalId = act.type === 'trip' ? 'tripDetailsModal' : 'activityDetailsModal';
  const bodyId = act.type === 'trip' ? 'trip-details-body' : 'activity-details-body';
  const body = document.getElementById(bodyId);
  body.innerHTML = `
    <h5>${document.documentElement.lang === 'ar' ? act.title_ar : act.title_en}</h5>
    <p>${document.documentElement.lang === 'ar' ? act.description_ar : act.description_en}</p>
    ${act.price > 0 ? `<p>${document.documentElement.lang === 'ar' ? 'السعر: ' : 'Price: '} ${act.price}</p>` : ''}
  `;
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
}

// Open registration modal and store selected id
let currentRegistrationId = null;
function openRegistration(id) {
  currentRegistrationId = id;
  const isTrip = sampleActivities.find((a) => a.id === id).type === 'trip';
  const modalId = isTrip ? 'registerTripModal' : 'registerActivityModal';
  const formId = isTrip ? 'trip-registration-form' : 'activity-registration-form';
  // Reset form
  const form = document.getElementById(formId);
  if (form) form.reset();
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  modal.show();
  // Attach submit handler (ensuring one time)
  form.onsubmit = (e) => {
    e.preventDefault();
    // Collect data and store (mock)
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Registration data for id', currentRegistrationId, data);
    alert(document.documentElement.lang === 'ar' ? 'تم إرسال طلب التسجيل بنجاح' : 'Registration request sent successfully');
    modal.hide();
    // Optionally save to localStorage
  };
}

// Display search results
function displaySearchResults(results) {
  const container = document.getElementById('search-results');
  if (!container) return;
  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = `<p>${document.documentElement.lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}.</p>`;
    return;
  }
  const list = document.createElement('div');
  list.className = 'row g-4';
  results.forEach((act) => {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.innerHTML = `
      <div class="card-activity">
        <img src="${act.image}" alt="${act.title_ar}" />
        <div class="card-body">
          <h5 class="card-title">${document.documentElement.lang === 'ar' ? act.title_ar : act.title_en}</h5>
          <p class="card-text">${document.documentElement.lang === 'ar' ? act.description_ar : act.description_en}</p>
          <button class="btn btn-outline-primary btn-sm" onclick="showDetails(${act.id})">${document.documentElement.lang === 'ar' ? 'التفاصيل' : 'Details'}</button>
          <button class="btn btn-primary btn-sm" onclick="openRegistration(${act.id})">${document.documentElement.lang === 'ar' ? 'تسجيل' : 'Register'}</button>
        </div>
      </div>
    `;
    list.appendChild(col);
  });
  container.appendChild(list);
}

// Render gallery images
function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';
  sampleGallery.forEach((img) => {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.dataset.type = img.type;
    col.dataset.time = img.time;
    col.innerHTML = `
      <div class="card">
        <img src="${img.src}" alt="${document.documentElement.lang === 'ar' ? img.title_ar : img.title_en}" />
        <div class="card-body">
          <h6 class="card-title">${document.documentElement.lang === 'ar' ? img.title_ar : img.title_en}</h6>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

// Filter gallery
function filterGallery() {
  const typeSelect = document.getElementById('filter-gallery-type');
  const timeSelect = document.getElementById('filter-gallery-time');
  const typeVal = typeSelect ? typeSelect.value : 'all';
  const timeVal = timeSelect ? timeSelect.value : 'all';
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  Array.from(grid.children).forEach((col) => {
    const matchesType = typeVal === 'all' || col.dataset.type === typeVal;
    const matchesTime = timeVal === 'all' || col.dataset.time === timeVal;
    col.style.display = matchesType && matchesTime ? '' : 'none';
  });
}

// Render hero slides from admin-controlled slides array (localStorage)
function renderHeroSlides() {
  const carouselInner = document.querySelector('#hero-carousel .carousel-inner');
  if (!carouselInner) return;
  // Load slides from localStorage
  let slides = [];
  try {
    slides = JSON.parse(localStorage.getItem('slides')) || [];
  } catch (e) {}
  if (!slides || slides.length === 0) return;
  carouselInner.innerHTML = '';
  slides.forEach((slide, idx) => {
    const item = document.createElement('div');
    item.className = 'carousel-item' + (idx === 0 ? ' active' : '');
    item.style.backgroundImage = `url('${slide.image.replace('..', '')}')`;
    item.innerHTML = `
      <div class="carousel-caption text-start">
        <h2>${document.documentElement.lang === 'ar' ? slide.title_ar : slide.title_en}</h2>
        <p>${document.documentElement.lang === 'ar' ? slide.text_ar : slide.text_en}</p>
      </div>
    `;
    carouselInner.appendChild(item);
  });
}
