
// Lightweight patch script to ensure core behaviors keep working even if other scripts error.
(function(){
  // Safely bind event by id
  function onClick(id, handler){
    document.addEventListener('DOMContentLoaded', function(){
      var el = document.getElementById(id);
      if(el){ el.addEventListener('click', handler); }
    });
  }
  // LocalStorage helpers
  function load(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch(e){ return fallback; } }
  function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

  // Settings (language + theme)
  document.addEventListener('DOMContentLoaded', function(){
    var langSel = document.getElementById(document.documentElement.lang === 'ar' ? 'default-language' : 'default-language-en');
    var themeSel = document.getElementById(document.documentElement.lang === 'ar' ? 'theme-mode' : 'theme-mode-en');
    var savedLang = load('defaultLanguage', document.documentElement.lang);
    var savedTheme = load('themeMode', 'light');
    if(langSel) langSel.value = savedLang;
    if(themeSel) themeSel.value = savedTheme;
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  });
  onClick(document.documentElement.lang === 'ar' ? 'save-settings' : 'save-settings-en', function(){
    var langSel = document.getElementById(document.documentElement.lang === 'ar' ? 'default-language' : 'default-language-en');
    var themeSel = document.getElementById(document.documentElement.lang === 'ar' ? 'theme-mode' : 'theme-mode-en');
    var languageVal = langSel ? langSel.value : document.documentElement.lang;
    var themeVal = themeSel ? themeSel.value : 'light';
    save('defaultLanguage', languageVal);
    save('themeMode', themeVal);
    alert(document.documentElement.lang === 'ar' ? 'تم حفظ الإعدادات' : 'Settings saved');
    location.reload();
  });

  // Email template (multi logos)
  function handleEmailSave(suffix){
    var subjId = 'email-subject' + suffix;
    var bodyId = 'email-template' + suffix;
    var fileId = 'email-logos' + suffix;
    var btnId  = 'save-email' + suffix;
    onClick(btnId, function(){
      var subject = (document.getElementById(subjId)||{}).value || '';
      var body = (document.getElementById(bodyId)||{}).value || '';
      var filesInput = document.getElementById(fileId);
      var files = filesInput && filesInput.files ? Array.from(filesInput.files) : [];
      var logos = [];
      if(files.length === 0){
        logos = load('emailTemplate', {}).logos || [];
        save('emailTemplate', {subject, body, logos});
        alert(document.documentElement.lang === 'ar' ? 'تم حفظ قالب البريد' : 'Email template saved');
        return;
      }
      var processed = 0;
      files.forEach(function(file){
        var reader = new FileReader();
        reader.onload = function(ev){
          logos.push(ev.target.result);
          processed++;
          if(processed === files.length){
            save('emailTemplate', {subject, body, logos});
            alert(document.documentElement.lang === 'ar' ? 'تم حفظ قالب البريد' : 'Email template saved');
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }
  document.addEventListener('DOMContentLoaded', function(){
    var tpl = load('emailTemplate', {});
    ['','-en'].forEach(function(suf){
      var subj = document.getElementById('email-subject'+suf);
      var body = document.getElementById('email-template'+suf);
      if(subj) subj.value = tpl.subject || '';
      if(body) body.value = tpl.body || '';
    });
  });
  handleEmailSave('');
  handleEmailSave('-en');

  // Robust sidebar toggle (for English/Arabic)
  window.toggleSidebar = window.toggleSidebar || function(){
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    if(!sidebar) return;
    var open = sidebar.classList.toggle('open');
    if(overlay){
      if(open) overlay.classList.add('show'); else overlay.classList.remove('show');
    }
  };

  // Robust chatbot handlers
  window.toggleChatbot = window.toggleChatbot || function(){
    var c = document.getElementById('chatbot-container');
    if(c){ c.classList.toggle('show'); }
  };
  window.sendMessage = window.sendMessage || function(){
    var input = document.getElementById('chatbot-user-input');
    if(!input) return;
    var message = input.value.trim();
    if(!message) return;
    addChatMessage('user', message);
    input.value='';
    setTimeout(function(){
      var resp = (message.toLowerCase() in {}) ? {}[message.toLowerCase()] : (document.documentElement.lang==='ar' ? 'شكرًا لرسالتك! سنتواصل قريبًا.' : 'Thanks for your message!');
      addChatMessage('bot', resp);
    }, 300);
  };
  window.addChatMessage = window.addChatMessage || function(sender, text){
    var messages = document.getElementById('chatbot-messages');
    if(!messages) return;
    var div = document.createElement('div');
    div.className = sender === 'user' ? 'mb-2 text-end' : 'mb-2 text-start';
    var who = sender === 'user' ? (document.documentElement.lang==='ar' ? 'أنت' : 'You') : 'AGS';
    div.innerHTML = '<span class="badge bg-' + (sender==='user'?'secondary':'primary') + '">' + who + '</span> ' + text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  };
})();