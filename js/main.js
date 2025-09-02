/*
 * main.js
 *
 * Handles dynamic content loading for the AGS Activities website. This script
 * populates activities and gallery sections from localStorage (or default
 * values), processes form submissions for activity registration and
 * contacting the school, and provides utility functions such as smooth
 * scrolling and basic notifications.
 */

// Smoothly scroll to a section by id
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Retrieve default activities if none are stored
function getDefaultActivities() {
  return [
    {
      title: 'نشاط رياضي',
      description: 'برنامج لتحسين اللياقة البدنية والصحة العامة.',
      type: 'paid',
      price: 50,
      image: 'images/hero-bg.jpg'
    },
    {
      title: 'ورشة فنية',
      description: 'ورشة لتعلم المهارات الفنية والرسم.',
      type: 'free',
      price: 0,
      image: 'images/hero-bg.jpg'
    },
    {
      title: 'رحلة علمية',
      description: 'زيارة ميدانية لاكتشاف العلوم في الواقع.',
      type: 'special',
      price: 20,
      image: 'images/hero-bg.jpg'
    }
  ];
}

// Load activities from localStorage or use defaults
function loadActivities() {
  const activitiesContainer = document.getElementById('activities-container');
  if (!activitiesContainer) return;
  let activities = [];
  try {
    activities = JSON.parse(localStorage.getItem('activities'));
  } catch (e) {
    activities = null;
  }
  if (!Array.isArray(activities) || activities.length === 0) {
    activities = getDefaultActivities();
  }
  activitiesContainer.innerHTML = '';
  activities.forEach((activity, idx) => {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.innerHTML = `
      <img src="${activity.image}" alt="${activity.title}" />
      <div class="activity-card-body">
        <h5>${activity.title}</h5>
        <p>${activity.description}</p>
        <div class="price">${
          activity.type === 'free'
            ? 'مجاني'
            : activity.price && !isNaN(activity.price)
            ? activity.price + ' ر.س'
            : '—'
        }</div>
        <button onclick="scrollToSection('registration')">سجل</button>
      </div>
    `;
    activitiesContainer.appendChild(card);
  });
}

// Retrieve default gallery images if none are stored
function getDefaultGallery() {
  return [
    'images/hero-bg.jpg',
    'images/hero-bg.jpg',
    'images/hero-bg.jpg'
  ];
}

// Load gallery images
function loadGallery() {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) return;
  let images = [];
  try {
    images = JSON.parse(localStorage.getItem('gallery'));
  } catch (e) {
    images = null;
  }
  if (!Array.isArray(images) || images.length === 0) {
    images = getDefaultGallery();
  }
  galleryContainer.innerHTML = '';
  images.forEach((imgSrc) => {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = 'صورة نشاط';
    galleryContainer.appendChild(img);
  });
}

// Handle registration form submission
function handleRegistrationForm() {
  const form = document.getElementById('registration-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const studentName = document.getElementById('studentName')?.value || document.getElementById('studentNameEn')?.value;
    const grade = document.getElementById('grade')?.value || document.getElementById('gradeEn')?.value;
    const parentName = document.getElementById('parentName')?.value || document.getElementById('parentNameEn')?.value;
    const phone = document.getElementById('phone')?.value || document.getElementById('phoneEn')?.value;
    const subscription = document.getElementById('subscription')?.value || document.getElementById('subscriptionEn')?.value;
    const amount = document.getElementById('amount')?.value || document.getElementById('amountEn')?.value;
    const registration = {
      studentName,
      grade,
      parentName,
      phone,
      subscription,
      amount
    };
    let registrations = [];
    try {
      registrations = JSON.parse(localStorage.getItem('registrations'));
    } catch (err) {
      registrations = [];
    }
    if (!Array.isArray(registrations)) registrations = [];
    registrations.push(registration);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    alert('تم استلام طلبك! / Your request has been received!');
    form.reset();
  });
}

// Handle contact form submission
function handleContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value || document.getElementById('contactNameEn')?.value;
    const email = document.getElementById('contactEmail')?.value || document.getElementById('contactEmailEn')?.value;
    const message = document.getElementById('contactMessage')?.value || document.getElementById('contactMessageEn')?.value;
    const contactMessage = { name, email, message, date: new Date().toISOString() };
    let messages = [];
    try {
      messages = JSON.parse(localStorage.getItem('messages'));
    } catch (err) {
      messages = [];
    }
    if (!Array.isArray(messages)) messages = [];
    messages.push(contactMessage);
    localStorage.setItem('messages', JSON.stringify(messages));
    alert('شكراً لتواصلك! / Thank you for contacting us!');
    form.reset();
  });
}

// Initialize functions on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  loadActivities();
  loadGallery();
  handleRegistrationForm();
  handleContactForm();
});