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
        title_en: 'Football Activity',
        images: ['images/hero-bg.jpg', 'images/hero-bg.jpg', 'images/hero-bg.jpg']
      },
      {
        id: 2,
        type: 'trip',
        time: 'old',
        src: 'images/hero-bg.jpg',
        title_ar: 'رحلة إلى المتحف',
        title_en: 'Museum Trip',
        images: ['images/hero-bg.jpg', 'images/hero-bg.jpg']
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
    {
      label_ar: 'المشتركين',
      label_en: 'Subscribers',
      value: 120,
      icon: '👥'
    },
    {
      label_ar: 'الأنشطة',
      label_en: 'Activities',
      value: 8,
      icon: '🏀'
    },
    {
      label_ar: 'الرحلات',
      label_en: 'Trips',
      value: 3,
      icon: '🚌'
    }
  ];
  stats.forEach((stat) => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-3';
    col.innerHTML = `
      <div class="card stats-card d-flex flex-column align-items-center p-4">
        <div class="stat-icon mb-2" style="font-size: 2rem;">\${stat.icon}</div>
        <h4 class="mb-1">\${stat.value}</h4>
        <p class="mb-0">\${document.documentElement.lang === 'ar' ? stat.label_ar : stat.label_en}</p>
      </div>
    `;
    container.appendChild(col);
  });
}

// Render carousel-like cards on home page for a given type
function renderActivities(container, type) {
  // container here refers to the carousel-inner element
  container.innerHTML = '';
  const filtered = sampleActivities.filter((act) => act.type === type);
  // Group items into slides of 3
  const slides = [];
  for (let i = 0; i < filtered.length; i += 3) {
    slides.push(filtered.slice(i, i + 3));
  }
  slides.forEach((slideItems, index) => {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'carousel-item' + (index === 0 ? ' active' : '');
    let rowHtml = '<div class="row g-4 justify-content-center">';
    slideItems.forEach((act) => {
      rowHtml += `
        <div class="col-md-4">
          <div class="card-activity h-100 d-flex flex-column">
            <img src="${act.image}" alt="${act.title_ar}" />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${document.documentElement.lang === 'ar' ? act.title_ar : act.title_en}</h5>
              <p class="card-text flex-grow-1">${document.documentElement.lang === 'ar' ? act.description_ar : act.description_en}</p>
              <div class="mt-auto">
                <button class="btn btn-outline-primary btn-sm me-2" onclick="showDetails(${act.id})">${document.documentElement.lang === 'ar' ? 'التفاصيل' : 'Details'}</button>
                <button class="btn btn-primary btn-sm" onclick="openRegistration(${act.id})">${document.documentElement.lang === 'ar' ? 'تسجيل' : 'Register'}</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    rowHtml += '</div>';
    slideDiv.innerHTML = rowHtml;
    container.appendChild(slideDiv);
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
  sampleGallery.forEach((album) => {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.dataset.type = album.type;
    col.dataset.time = album.time;
    const title = document.documentElement.lang === 'ar' ? album.title_ar : album.title_en;
    const typeLabel = document.documentElement.lang === 'ar'
      ? (album.type === 'activity' ? 'نشاط' : 'رحلة')
      : (album.type === 'activity' ? 'Activity' : 'Trip');
    col.innerHTML = `
      <div class="card gallery-card h-100" onclick="openGalleryAlbum(${album.id})" style="cursor:pointer;">
        <img src="${album.src}" alt="${title}" class="card-img-top" />
        <div class="card-body text-center">
          <h6 class="card-title mb-1">${title}</h6>
          <small class="text-muted">${typeLabel}</small>
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

// Open a gallery album in a modal carousel
function openGalleryAlbum(id) {
  const album = sampleGallery.find((g) => g.id === id);
  if (!album) return;
  const body = document.getElementById('gallery-album-body');
  if (!body) return;
  // Build carousel HTML for the album
  const carouselId = `albumCarousel${id}`;
  let inner = '';
  album.images.forEach((imgSrc, idx) => {
    inner += `<div class="carousel-item${idx === 0 ? ' active' : ''}">
      <img src="${imgSrc}" class="d-block w-100" alt="slide${idx}" />
    </div>`;
  });
  body.innerHTML = `
    <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        ${inner}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">${document.documentElement.lang === 'ar' ? 'السابق' : 'Previous'}</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">${document.documentElement.lang === 'ar' ? 'التالى' : 'Next'}</span>
      </button>
    </div>
  `;
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('galleryAlbumModal'));
  modal.show();
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
