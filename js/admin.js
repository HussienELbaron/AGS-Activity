/*
  Admin panel logic for AGS Activities platform.
  Manages simple CRUD operations using localStorage for demonstration.
*/

// Utility to load JSON from localStorage
function loadData(key, fallback = []) {
  return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Subscribers
let subscribers = loadData('subscribers');
function renderSubscribers() {
  const containerId = document.documentElement.lang === 'ar' ? 'subscribers-list' : 'subscribers-list-en';
  const container = document.getElementById(containerId);
  if (!container) return;
  if (subscribers.length === 0) {
    container.innerHTML = '<p>' + (document.documentElement.lang === 'ar' ? 'لا يوجد مشتركين' : 'No subscribers yet') + '</p>';
    return;
  }
  // Build table header with translated labels
  let html = '<table class="table table-bordered"><thead><tr><th>' + (document.documentElement.lang === 'ar' ? 'الاسم' : 'Name') + '</th><th>Email</th><th>' + (document.documentElement.lang === 'ar' ? 'خيارات' : 'Actions') + '</th></tr></thead><tbody>';
  subscribers.forEach((sub, idx) => {
    html += `<tr><td>${sub.name}</td><td>${sub.email}</td><td><button class="btn btn-sm btn-danger" onclick="deleteSubscriber(${idx})">${document.documentElement.lang === 'ar' ? 'حذف' : 'Delete'}</button></td></tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}
function addSubscriber() {
  const name = prompt(document.documentElement.lang === 'ar' ? 'أدخل اسم المشترك:' : 'Enter subscriber name:');
  if (!name) return;
  const email = prompt('Email:');
  if (!email) return;
  subscribers.push({ name, email });
  saveData('subscribers', subscribers);
  renderSubscribers();
}
function deleteSubscriber(index) {
  const confirmMsg = document.documentElement.lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?';
  if (confirm(confirmMsg)) {
    subscribers.splice(index, 1);
    saveData('subscribers', subscribers);
    renderSubscribers();
  }
}

// Admins
let admins = loadData('admins', [{ username: 'admin', password: 'admin123' }]);
function renderAdmins() {
  const containerId = document.documentElement.lang === 'ar' ? 'admins-list' : 'admins-list-en';
  const container = document.getElementById(containerId);
  if (!container) return;
  if (admins.length === 0) {
    container.innerHTML = '<p>' + (document.documentElement.lang === 'ar' ? 'لا يوجد مدراء' : 'No admins yet') + '</p>';
    return;
  }
  let html = '<table class="table table-bordered"><thead><tr><th>' + (document.documentElement.lang === 'ar' ? 'اسم المستخدم' : 'Username') + '</th><th>' + (document.documentElement.lang === 'ar' ? 'خيارات' : 'Actions') + '</th></tr></thead><tbody>';
  admins.forEach((adm, idx) => {
    const deleteBtn = idx === 0 ? '' : `<button class="btn btn-sm btn-danger" onclick="deleteAdmin(${idx})">${document.documentElement.lang === 'ar' ? 'حذف' : 'Delete'}</button>`;
    html += `<tr><td>${adm.username}</td><td>${deleteBtn}</td></tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}
function addAdmin() {
  const username = prompt(document.documentElement.lang === 'ar' ? 'أدخل اسم المستخدم للمدير:' : 'Enter admin username:');
  if (!username) return;
  admins.push({ username });
  saveData('admins', admins);
  renderAdmins();
}
function deleteAdmin(index) {
  if (index === 0) {
    alert(document.documentElement.lang === 'ar' ? 'لا يمكن حذف المدير الأساسى' : 'Cannot delete primary admin');
    return;
  }
  if (confirm(document.documentElement.lang === 'ar' ? 'تأكيد حذف المدير؟' : 'Confirm delete admin?')) {
    admins.splice(index, 1);
    saveData('admins', admins);
    renderAdmins();
  }
}

// Slides (hero carousel)
let slides = loadData('slides', [
  {
    image: '../images/hero-bg.jpg',
    title_ar: 'شريحة 1',
    title_en: 'Slide 1',
    text_ar: 'نص الشريحة 1',
    text_en: 'Slide text 1',
    date: ''
  }
]);
function renderSlides() {
  const containerId = document.documentElement.lang === 'ar' ? 'slider-list' : 'slider-list-en';
  const container = document.getElementById(containerId);
  if (!container) return;
  if (slides.length === 0) {
    container.innerHTML = '<p>' + (document.documentElement.lang === 'ar' ? 'لا يوجد شرائح' : 'No slides yet') + '</p>';
    return;
  }
  let html = '';
  slides.forEach((slide, idx) => {
    const title = document.documentElement.lang === 'ar' ? slide.title_ar : slide.title_en;
    const text = document.documentElement.lang === 'ar' ? slide.text_ar : slide.text_en;
    html += `<div class="col-md-4"><div class="card"><img src="${slide.image}" class="card-img-top" alt="slide"><div class="card-body"><h6>${title}</h6><p>${text}</p><button class="btn btn-sm btn-danger" onclick="deleteSlide(${idx})">${document.documentElement.lang === 'ar' ? 'حذف' : 'Delete'}</button></div></div></div>`;
  });
  container.innerHTML = html;
}
function addSlide() {
  const title = prompt(document.documentElement.lang === 'ar' ? 'عنوان الشريحة:' : 'Slide title:');
  const text = prompt(document.documentElement.lang === 'ar' ? 'نص الشريحة:' : 'Slide text:');
  const image = prompt(document.documentElement.lang === 'ar' ? 'رابط الصورة:' : 'Image URL:');
  slides.push({ image, title_ar: title, title_en: title, text_ar: text, text_en: text });
  saveData('slides', slides);
  renderSlides();
}
function deleteSlide(index) {
  slides.splice(index, 1);
  saveData('slides', slides);
  renderSlides();
}

// Activities management (paid/free/trip/talent)
let activities = loadData('activities', sampleActivities);
function renderActivitiesAdmin() {
  // Map of tables for each type; may include talent table if present in HTML
  const tables = {
    paid: document.getElementById(document.documentElement.lang === 'ar' ? 'paid-activities-table' : 'paid-activities-table-en'),
    free: document.getElementById(document.documentElement.lang === 'ar' ? 'free-activities-table' : 'free-activities-table-en'),
    trip: document.getElementById(document.documentElement.lang === 'ar' ? 'trips-table' : 'trips-table-en'),
    talent: document.getElementById(document.documentElement.lang === 'ar' ? 'talent-table' : 'talent-table-en')
  };
  ['paid', 'free', 'trip', 'talent'].forEach((type) => {
    const container = tables[type];
    if (!container) return;
    const filtered = activities.filter((act) => act.type === type);
    if (filtered.length === 0) {
      container.innerHTML = '<p>' + (document.documentElement.lang === 'ar' ? 'لا يوجد عناصر' : 'No items') + '</p>';
    } else {
      let html = '<table class="table table-bordered"><thead><tr><th>ID</th><th>' + (document.documentElement.lang === 'ar' ? 'العنوان' : 'Title') + '</th><th>' + (document.documentElement.lang === 'ar' ? 'خيارات' : 'Actions') + '</th></tr></thead><tbody>';
      filtered.forEach((act) => {
        html += `<tr><td>${act.id}</td><td>${document.documentElement.lang === 'ar' ? act.title_ar : act.title_en}</td><td><button class="btn btn-sm btn-danger" onclick="deleteActivity(${act.id})">${document.documentElement.lang === 'ar' ? 'حذف' : 'Delete'}</button></td></tr>`;
      });
      html += '</tbody></table>';
      container.innerHTML = html;
    }
  });
}
// Delete an activity by its ID
function deleteActivity(id) {
  activities = activities.filter((act) => act.id !== id);
  saveData('activities', activities);
  renderActivitiesAdmin();
}

// Gallery management
let gallery = loadData('gallery', sampleGallery);
function renderGalleryAdmin() {
  const container = document.getElementById(document.documentElement.lang === 'ar' ? 'gallery-table' : 'gallery-table-en');
  if (!container) return;
  if (gallery.length === 0) {
    container.innerHTML = '<p>' + (document.documentElement.lang === 'ar' ? 'لا توجد صور' : 'No images') + '</p>';
    return;
  }
  let html = '<table class="table table-bordered"><thead><tr><th>ID</th><th>' + (document.documentElement.lang === 'ar' ? 'العنوان' : 'Title') + '</th><th>Type</th><th>Time</th><th>Actions</th></tr></thead><tbody>';
  gallery.forEach((img, idx) => {
    html += `<tr><td>${img.id}</td><td>${document.documentElement.lang === 'ar' ? img.title_ar : img.title_en}</td><td>${img.type}</td><td>${img.time}</td><td><button class="btn btn-sm btn-danger" onclick="deleteGalleryImage(${idx})">${document.documentElement.lang === 'ar' ? 'حذف' : 'Delete'}</button></td></tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}
function addGalleryImage() {
  const title = prompt(document.documentElement.lang === 'ar' ? 'عنوان الصورة:' : 'Image title:');
  const type = prompt(document.documentElement.lang === 'ar' ? 'النوع (activity/trip):' : 'Type (activity/trip):');
  const time = prompt(document.documentElement.lang === 'ar' ? 'الوقت (recent/old):' : 'Time (recent/old):');
  const src = prompt(document.documentElement.lang === 'ar' ? 'رابط الصورة:' : 'Image URL:');
  const id = Math.max(0, ...gallery.map((g) => g.id)) + 1;
  gallery.push({ id, type, time, src, title_ar: title, title_en: title });
  saveData('gallery', gallery);
  renderGalleryAdmin();
}
function deleteGalleryImage(index) {
  gallery.splice(index, 1);
  saveData('gallery', gallery);
  renderGalleryAdmin();
}

// Chatbot training
let chatbotTraining = loadData('chatbotTraining', []);
function renderChatbotTraining() {
  const container = document.getElementById(document.documentElement.lang === 'ar' ? 'chatbot-training-list' : 'chatbot-training-list-en');
  if (!container) return;
  if (chatbotTraining.length === 0) {
    container.innerHTML = '<p>' + (document.documentElement.lang === 'ar' ? 'لا توجد أسئلة مدربة' : 'No trained questions') + '</p>';
    return;
  }
  let html = '<ul class="list-group">';
  chatbotTraining.forEach((qa, idx) => {
    html += `<li class="list-group-item d-flex justify-content-between align-items-center"><span><strong>${qa.q}</strong> - ${qa.a}</span><button class="btn btn-sm btn-danger" onclick="deleteQA(${idx})">${document.documentElement.lang === 'ar' ? 'حذف' : 'Delete'}</button></li>`;
  });
  html += '</ul>';
  container.innerHTML = html;
}
// Add QA pair from admin form
document.addEventListener('DOMContentLoaded', () => {
  // Chatbot training form submission
  const formId = document.documentElement.lang === 'ar' ? 'chatbot-training-form' : 'chatbot-training-form-en';
  const trainingForm = document.getElementById(formId);
  if (trainingForm) {
    trainingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const qId = document.documentElement.lang === 'ar' ? 'bot-question' : 'bot-question-en';
      const aId = document.documentElement.lang === 'ar' ? 'bot-answer' : 'bot-answer-en';
      const qInput = document.getElementById(qId);
      const aInput = document.getElementById(aId);
      const q = qInput.value.trim();
      const a = aInput.value.trim();
      if (q && a) {
        chatbotTraining.push({ q, a });
        saveData('chatbotTraining', chatbotTraining);
        const responses = JSON.parse(localStorage.getItem('chatbotResponses') || '{}');
        responses[q.toLowerCase()] = a;
        localStorage.setItem('chatbotResponses', JSON.stringify(responses));
        qInput.value = '';
        aInput.value = '';
        renderChatbotTraining();
      }
    });
  }
  // Initialize select values from stored settings
  const savedLang = loadData('defaultLanguage', document.documentElement.lang);
  const savedTheme = loadData('themeMode', 'light');
  const langSelect = document.getElementById(document.documentElement.lang === 'ar' ? 'default-language' : 'default-language-en');
  const themeSelect = document.getElementById(document.documentElement.lang === 'ar' ? 'theme-mode' : 'theme-mode-en');
  if (langSelect) langSelect.value = savedLang;
  if (themeSelect) themeSelect.value = savedTheme;
  // contact info prefill
  const contactInfo = loadData('contactInfo', {});
  const fill = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
  };
  if (document.documentElement.lang === 'ar') {
    fill('contact-address', contactInfo.address);
    fill('contact-phone', contactInfo.phone);
    fill('contact-email', contactInfo.email);
    fill('contact-instagram', contactInfo.instagram);
    fill('contact-facebook', contactInfo.facebook);
    fill('contact-x', contactInfo.x);
    fill('contact-youtube', contactInfo.youtube);
    fill('contact-tiktok', contactInfo.tiktok);
  } else {
    fill('contact-address-en', contactInfo.address);
    fill('contact-phone-en', contactInfo.phone);
    fill('contact-email-en', contactInfo.email);
    fill('contact-instagram-en', contactInfo.instagram);
    fill('contact-facebook-en', contactInfo.facebook);
    fill('contact-x-en', contactInfo.x);
    fill('contact-youtube-en', contactInfo.youtube);
    fill('contact-tiktok-en', contactInfo.tiktok);
  }
  // Initialize email template fields
  const emailTemplate = loadData('emailTemplate', {});
  if (document.documentElement.lang === 'ar') {
    const subjectInput = document.getElementById('email-subject');
    const bodyInput = document.getElementById('email-template');
    if (subjectInput) subjectInput.value = emailTemplate.subject || '';
    if (bodyInput) bodyInput.value = emailTemplate.body || '';
  } else {
    const bodyInputEn = document.getElementById('email-template-en');
    if (bodyInputEn) bodyInputEn.value = emailTemplate.body || '';
  }
  // Save settings handler
  const settingsBtn = document.getElementById(document.documentElement.lang === 'ar' ? 'save-settings' : 'save-settings-en');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      const languageVal = langSelect ? langSelect.value : document.documentElement.lang;
      const themeVal = themeSelect ? themeSelect.value : 'light';
      saveData('defaultLanguage', languageVal);
      saveData('themeMode', themeVal);
      alert(document.documentElement.lang === 'ar' ? 'تم حفظ الإعدادات' : 'Settings saved');
    });
  }
  // Save email handler
  const emailBtn = document.getElementById('save-email');
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      const subject = document.getElementById('email-subject').value;
      const body = document.getElementById('email-template').value;
      const fileInput = document.getElementById('email-logo');
      const file = fileInput && fileInput.files && fileInput.files[0];
      const saveTemplate = (logoData) => {
        saveData('emailTemplate', { subject, body, logo: logoData });
        alert(document.documentElement.lang === 'ar' ? 'تم حفظ القالب' : 'Email template saved');
      };
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          saveTemplate(ev.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        saveTemplate(emailTemplate.logo || null);
      }
    });
  }
  // Save contact handler
  const contactBtn = document.getElementById(document.documentElement.lang === 'ar' ? 'save-contact' : 'save-contact-en');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      const get = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
      };
      const prefix = document.documentElement.lang === 'ar' ? '' : '-en';
      const info = {
        address: get('contact-address' + prefix),
        phone: get('contact-phone' + prefix),
        email: get('contact-email' + prefix),
        instagram: get('contact-instagram' + prefix),
        facebook: get('contact-facebook' + prefix),
        x: get('contact-x' + prefix),
        youtube: get('contact-youtube' + prefix),
        tiktok: get('contact-tiktok' + prefix)
      };
      saveData('contactInfo', info);
      alert(document.documentElement.lang === 'ar' ? 'تم حفظ بيانات التواصل' : 'Contact info saved');
    });
  }
  // Save calendar handler
  const calendarBtn = document.querySelector('#calendar .btn.btn-primary');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', () => {
      const term1Input = document.getElementById(document.documentElement.lang === 'ar' ? 'term1-pdf' : 'term1-pdf-en');
      const term2Input = document.getElementById(document.documentElement.lang === 'ar' ? 'term2-pdf' : 'term2-pdf-en');
      const term1 = term1Input && term1Input.files[0] ? term1Input.files[0].name : '';
      const term2 = term2Input && term2Input.files[0] ? term2Input.files[0].name : '';
      saveData('calendar', { term1, term2 });
      alert(document.documentElement.lang === 'ar' ? 'تم حفظ التقويم' : 'Calendar saved');
    });
  }
  // Render initial data
  renderSubscribers();
  renderAdmins();
  renderSlides();
  renderActivitiesAdmin();
  renderGalleryAdmin();
  renderChatbotTraining();
});

function deleteQA(index) {
  chatbotTraining.splice(index, 1);
  saveData('chatbotTraining', chatbotTraining);
  renderChatbotTraining();
  // update responses
  const responses = JSON.parse(localStorage.getItem('chatbotResponses') || '{}');
  // Remove key (we can't easily know, but we can rebuild)
  const newResponses = {};
  chatbotTraining.forEach((qa) => {
    newResponses[qa.q.toLowerCase()] = qa.a;
  });
  localStorage.setItem('chatbotResponses', JSON.stringify(newResponses));
}

/* -------------------------------------------------------------------------
  Modal helper functions
  These functions open the corresponding Bootstrap modal and handle form
  submissions for creating new subscribers, admins, slides, activities/trips,
  and gallery albums. They read values from the form, push new objects into
  the appropriate arrays, persist them in localStorage, and refresh the
  rendered lists. They also reset the forms each time.
*/
function showSubscriberModal() {
  const modalEl = document.getElementById('subscriberModal');
  if (!modalEl) return;
  const modal = new bootstrap.Modal(modalEl);
  const form = modalEl.querySelector('#subscriber-form');
  form.reset();
  form.onsubmit = function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name').toString().trim();
    const email = data.get('email').toString().trim();
    const phone = data.get('phone') ? data.get('phone').toString().trim() : '';
    if (!name || !email) return;
    subscribers.push({ name, email, phone });
    saveData('subscribers', subscribers);
    renderSubscribers();
    modal.hide();
  };
  modal.show();
}

function showAdminModal() {
  const modalEl = document.getElementById('adminModal');
  if (!modalEl) return;
  const modal = new bootstrap.Modal(modalEl);
  const form = modalEl.querySelector('#admin-form');
  form.reset();
  form.onsubmit = function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const username = data.get('username').toString().trim();
    const password = data.get('password').toString().trim();
    if (!username || !password) return;
    admins.push({ username, password });
    saveData('admins', admins);
    renderAdmins();
    modal.hide();
  };
  modal.show();
}

function showSlideModal() {
  const modalEl = document.getElementById('slideModal');
  if (!modalEl) return;
  const modal = new bootstrap.Modal(modalEl);
  const form = modalEl.querySelector('#slide-form');
  form.reset();
  form.onsubmit = function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const title_ar = data.get('title_ar').toString().trim();
    const title_en = data.get('title_en').toString().trim();
    const text_ar = data.get('text_ar').toString().trim();
    const text_en = data.get('text_en').toString().trim();
    const date = data.get('date') ? data.get('date').toString() : '';
    const imageFile = data.get('image');
    const saveSlide = (imgData) => {
      slides.push({ title_ar, title_en, text_ar, text_en, date, image: imgData });
      saveData('slides', slides);
      renderSlides();
      modal.hide();
    };
    if (imageFile && imageFile.size > 0) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        saveSlide(ev.target.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      saveSlide('../images/hero-bg.jpg');
    }
  };
  modal.show();
}

function showActivityModal(type) {
  const modalEl = document.getElementById('activityModal');
  if (!modalEl) return;
  const modal = new bootstrap.Modal(modalEl);
  const form = modalEl.querySelector('#activity-form');
  // set hidden type value
  document.getElementById('activity-type').value = type;
  // show price only for paid
  const priceGroup = modalEl.querySelector('#price-group');
  priceGroup.style.display = type === 'paid' ? 'block' : 'none';
  form.reset();
  form.onsubmit = function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const title_ar = data.get('title_ar').toString().trim();
    const title_en = data.get('title_en').toString().trim();
    const description_ar = data.get('description_ar').toString().trim();
    const description_en = data.get('description_en').toString().trim();
    const priceVal = data.get('price') ? parseFloat(data.get('price').toString()) : 0;
    const imageFile = data.get('image');
    const id = activities.length > 0 ? Math.max(...activities.map((a) => a.id)) + 1 : 1;
    const saveItem = (imgData) => {
      const newItem = {
        id,
        type,
        title_ar,
        title_en,
        description_ar,
        description_en,
        image: imgData,
        price: type === 'paid' ? priceVal : 0
      };
      activities.push(newItem);
      saveData('activities', activities);
      renderActivitiesAdmin();
      modal.hide();
    };
    if (imageFile && imageFile.size > 0) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        saveItem(ev.target.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      saveItem('../images/hero-bg.jpg');
    }
  };
  modal.show();
}

function showAlbumModal() {
  const modalEl = document.getElementById('albumModal');
  if (!modalEl) return;
  const modal = new bootstrap.Modal(modalEl);
  const form = modalEl.querySelector('#album-form');
  form.reset();
  form.onsubmit = function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const title_ar = data.get('title_ar').toString().trim();
    const title_en = data.get('title_en').toString().trim();
    const date = data.get('date').toString();
    const type = data.get('type').toString();
    const images = data.getAll('images');
    const id = gallery.length > 0 ? Math.max(...gallery.map((a) => a.id)) + 1 : 1;
    const album = { id, title_ar, title_en, date, type, images: [] };
    if (images.length === 0) {
      gallery.push(album);
      saveData('gallery', gallery);
      renderGalleryAdmin();
      modal.hide();
      return;
    }
    let processed = 0;
    images.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        album.images.push(ev.target.result);
        processed++;
        if (processed === images.length) {
          gallery.push(album);
          saveData('gallery', gallery);
          renderGalleryAdmin();
          modal.hide();
        }
      };
      reader.readAsDataURL(file);
    });
  };
  modal.show();
}