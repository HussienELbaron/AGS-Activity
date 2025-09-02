/*
 * Simple rule‑based chatbot for the AGS activities platform.
 * This bot uses a list of predefined questions and answers in both Arabic and English.
 * The admin can extend the responses by editing the responses object.
 */

const responses = {
  // Arabic questions and answers
  "السلام عليكم": "وعليكم السلام! كيف يمكنني مساعدتك؟",
  "متى تبدأ بطولة كرة القدم": "بطولة كرة القدم السنوية تبدأ في الأول من أكتوبر.",
  "كيف أسجل في الأنشطة": "يمكنك التسجيل عبر نموذج التسجيل أسفل الصفحة أو من خلال صفحة الأنشطة.",
  "هل الأنشطة مجانية": "بعض الأنشطة مجانية وبعضها مدفوعة. يمكنك اختيار التصنيف المناسب لمعرفة المزيد.",
  "كم رسوم الاشتراك": "تختلف رسوم الاشتراك حسب النشاط. يرجى الاطلاع على تفاصيل كل نشاط في صفحة الأنشطة.",
  // English questions and answers
  "hello": "Hello! How can I assist you today?",
  "hi": "Hi there! What can I do for you?",
  "when does the football tournament start": "The annual football tournament starts on October 1st.",
  "how do i register": "You can register via the registration form at the bottom of the page or through the activities page.",
  "is it free": "Some activities are free and some require a fee. Please check the activity details for more information.",
  "how much is the fee": "Fees vary depending on the activity. Please see each activity's details.",
};

// Default reply if no match is found
const defaultReply = {
  ar: "عذرًا، لم أفهم سؤالك. يرجى إعادة صياغته أو التواصل مع إدارة المدرسة.",
  en: "Sorry, I didn't understand your question. Please rephrase or contact the school administration."
};

// Detect language (very simple detection based on Arabic characters)
function detectLanguage(text) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text) ? 'ar' : 'en';
}

function toggleChatbot() {
  const container = document.getElementById('chatbot-container');
  if (container.style.display === 'flex') {
    container.style.display = 'none';
  } else {
    container.style.display = 'flex';
  }
}

function addMessage(content, sender) {
  const messagesContainer = document.getElementById('chatbot-messages');
  const messageElem = document.createElement('div');
  messageElem.classList.add('message', sender);
  const span = document.createElement('span');
  span.textContent = content;
  messageElem.appendChild(span);
  messagesContainer.appendChild(messageElem);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getResponse(userInput) {
  const lowerInput = userInput.toLowerCase().trim();
  for (const key in responses) {
    if (lowerInput.includes(key)) {
      return responses[key];
    }
  }
  // No direct match found; use default language reply
  const lang = detectLanguage(userInput);
  return defaultReply[lang];
}

function sendMessage() {
  const inputElem = document.getElementById('chatbot-user-input');
  const userText = inputElem.value;
  if (!userText) return;
  addMessage(userText, 'user');
  const reply = getResponse(userText);
  setTimeout(() => {
    addMessage(reply, 'bot');
  }, 500);
  inputElem.value = '';
}

// Attach event listener for Enter key
document.addEventListener('DOMContentLoaded', () => {
  const inputElem = document.getElementById('chatbot-user-input');
  inputElem.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });
});