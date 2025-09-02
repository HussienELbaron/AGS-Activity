/*
 * chatbot.js
 *
 * Provides a very simple chatbot that responds based on predefined question-answer
 * pairs stored in localStorage. If no suitable response is found, it returns
 * a default reply. Users can view the chat history within the chatbot
 * container. The admin can manage responses via the dashboard.
 */

// Toggle chatbot visibility
function toggleChatbot() {
  const container = document.getElementById('chatbot-container');
  if (container.style.display === 'none' || container.style.display === '') {
    container.style.display = 'flex';
  } else {
    container.style.display = 'none';
  }
}

// Load responses from localStorage
function getBotResponses() {
  let responses = [];
  try {
    responses = JSON.parse(localStorage.getItem('botResponses'));
  } catch (err) {
    responses = [];
  }
  if (!Array.isArray(responses)) responses = [];
  return responses;
}

// Send message from user and get response
function sendMessage() {
  const inputField = document.getElementById('chatbot-user-input');
  const messagesContainer = document.getElementById('chatbot-messages');
  const userText = inputField.value.trim();
  if (!userText) return;
  // Display user message
  const userMsg = document.createElement('div');
  userMsg.className = 'message user';
  userMsg.innerHTML = `<span>${userText}</span>`;
  messagesContainer.appendChild(userMsg);
  // Clear input
  inputField.value = '';
  // Retrieve bot responses
  const responses = getBotResponses();
  // Find matching response (exact match ignoring case)
  const found = responses.find((pair) => pair.question.toLowerCase() === userText.toLowerCase());
  let botReply = '';
  if (found) {
    botReply = found.answer;
  } else {
    botReply = 'عذراً، لم أفهم سؤالك. يمكنك تدريب المساعد على الردود الشائعة في لوحة الإدارة.';
  }
  // Display bot message
  const botMsg = document.createElement('div');
  botMsg.className = 'message bot';
  botMsg.innerHTML = `<span>${botReply}</span>`;
  messagesContainer.appendChild(botMsg);
  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}