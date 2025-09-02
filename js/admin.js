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
  const container = document.getElementById(document.documentElement.lang === 'ar' ? 'subscribers-list' : 'subscribers-list-en');
  if (!container) return;
  if (subscribers.length === 0) {
    container.innerHTML = '<p>' + (document.documentElement.lang === 'ar' ? 'لا يوجد مشتركين' : 'No subscribers yet') + '</p>';
    return;
  }
  let html = '<table class="table table-bordered"><thead><tr><th>' + (document.documentElement.lang === 'ar' ? 'الاسم' : 'Name') + '</th><th>Email</th><th>Actions</th></tr></thead><tbody>';
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
  if (confirm(document.documentElement.lang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
    subscribers.splice(index, 1);
    saveData('subscribers', subscribers);
    renderSubscribers();
  }
}

// Admins
let admins = loadData('admins', [{ username: 'admin' }]);
function renderAdmins() {
  const container = document.getElementById(document.documentElement.lang === 'ar' ? 'admins-list' : 'admins-list-en');
  if (!container) return;
  if (admins.length === 0) {
    container.innerHTML = '<p>' + (document.documentElement.lang === 'ar' ? 'لا يوجد مدراء' : 'No admins yet') + '</p>';
    return;
  }
  let html = '<table class="table table-bordered"><thead><tr><th>' + (document.documentElement.lang === 'ar' ? 'اسم المستخدم' : 'Username') + '</th><th>Actions</th></tr></thead><tbody>';
  admins.forEach((adm, idx) => {
    html += `<tr><td>${adm.username}</td><td>${idx === 0 ? '' : '<button class="btn btn-sm btn-danger" onclick="deleteAdmin(' + idx + ')">' + (document.documentElement.lang === 'ar' ? 'حذف' : 'Delete') + '</button>'}</td></tr>`;
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
  { image: '../images/hero-bg.jpg', title_ar: 'شريحة 1', title_en: 'Slide 1', text_ar: 'نص الشريحة 1', text_en: 'Slide text 1' }
]);
function renderSlides() {
  const container = document.getElementById(document.documentElement.lang === 'ar' ? 'slider-list' : 'slider-list-en');
  if (!container) return;
  if (slides.length === 0) {
    container.innerHTML = '<p>' + (document.documentElement.lang === 'ar' ? 'لا يوجد شرائح' : 'No slides yet') + '</p>';
    return;
  }
  let html = '';
  slides.forEach((slide, idx) => {
    html += `<div class="col-md-4"><div class="card"><img src="${slide.image}" class="card-img-top" alt="slide"><div class="card-body"><h6>${document.documentElement.lang === 'ar' ? slide.title_ar : slide.title_en}</h6><p>${document.documentElement.lang === 'ar' ? slide.text_ar : slide.text_en}</p><button class="btn btn-sm btn-danger" onclick="deleteSlide(${idx})">${document.documentElement.lang === 'ar' ? 'حذف' : 'Delete'}</button></div></div></div>`;
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

// Activities management (paid & free) and trips share similar logic
let activities = loadData('activities', sampleActivities);
function renderActivitiesAdmin() {
  const tables = {
    paid: document.getElementById(document.documentElement.lang === 'ar' ? 'paid-activities-table' : 'paid-activities-table-en'),
    free: document.getElementById(document.documentElement.lang === 'ar' ? 'free-activities-table' : 'free-activities-table-en'),
    trip: document.getElementById(document.documentElement.lang === 'ar' ? 'trips-table' : 'trips-table-en')
  };
  ['paid', 'free', 'trip'].forEach((type) => {
    const container = tables[type];
    if (!container) return;
    const filtered = activities.filter((act) => act.type === type);
    if (filtered.length === 0) {
      container.innerHTML = '<p>' + (document.documentElement.lang === 'ar' ? 'لا يوجد عناصر' : 'No items') + '</p>';
    } else {
      let html = '<table class="table table-bordered"><thead><tr><th>#</th><th>' + (document.documentElement.lang === 'ar' ? 'العنوان' : 'Title') + '</th><th>Actions</th></tr></thead><tbody>';
      filtered.forEach((act, idx) => {
        html += `<tr><td>${act.id}</td><td>${document.documentElement.lang === 'ar' ? act.title_ar : act.title_en}</td><td><button class="btn btn-sm btn-danger" onclick="deleteActivity(${act.id})">${document.documentElement.lang === 'ar' ? 'حذف' : 'Delete'}</button></td></tr>`;
      });
      html += '</tbody></table>';
      container.innerHTML = html;
    }
  });
}
function addPaidActivity() {
  addActivity('paid');
}
function addFreeActivity() {
  addActivity('free');
}
function addTrip() {
  addActivity('trip');
}
function addActivity(type) {
  const title = prompt(document.documentElement.lang === 'ar' ? 'اسم النشاط/الرحلة:' : 'Title:');
  const desc = prompt(document.documentElement.lang === 'ar' ? 'وصف:' : 'Description:');
  const price = type === 'paid' ? parseFloat(prompt(document.documentElement.lang === 'ar' ? 'السعر:' : 'Price:') || '0') : 0;
  const id = Math.max(0, ...activities.map((a) => a.id)) + 1;
  activities.push({ id, type, title_ar: title, title_en: title, description_ar: desc, description_en: desc, image: '../images/hero-bg.jpg', price });
  saveData('activities', activities);
  renderActivitiesAdmin();
}
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
  const form = document.getElementById(document.documentElement.lang === 'ar' ? 'chatbot-training-form' : 'chatbot-training-form-en');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const qInput = document.getElementById(document.documentElement.lang === 'ar' ? 'bot-question' : 'bot-question-en');
      const aInput = document.getElementById(document.documentElement.lang === 'ar' ? 'bot-answer' : 'bot-answer-en');
      const q = qInput.value.trim();
      const a = aInput.value.trim();
      if (q && a) {
        chatbotTraining.push({ q, a });
        saveData('chatbotTraining', chatbotTraining);
        // Update chatbot responses for front-end
        const responses = JSON.parse(localStorage.getItem('chatbotResponses') || '{}');
        responses[q.toLowerCase()] = a;
        localStorage.setItem('chatbotResponses', JSON.stringify(responses));
        qInput.value = '';
        aInput.value = '';
        renderChatbotTraining();
      }
    });
  }
  // initial renders
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