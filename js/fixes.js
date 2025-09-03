
// Patch: ensure Save buttons write to localStorage reliably.
(function(){
  function load(k, fb){ try{return JSON.parse(localStorage.getItem(k)) ?? fb;}catch(e){return fb;} }
  function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
  function byId(id){ return document.getElementById(id); }

  document.addEventListener('DOMContentLoaded', function(){
    // Contact info save (AR/EN)
    [['save-contact','contact-address','contact-phone','contact-email','contact-instagram','contact-facebook','contact-x','contact-youtube','contact-tiktok'],
     ['save-contact-en','contact-address-en','contact-phone-en','contact-email-en','contact-instagram-en','contact-facebook-en','contact-x-en','contact-youtube-en','contact-tiktok-en']]
    .forEach(function(cfg){
      var btn = byId(cfg[0]); if(!btn) return;
      btn.addEventListener('click', function(){
        var data = {
          address: (byId(cfg[1])||{}).value || '',
          phone:   (byId(cfg[2])||{}).value || '',
          email:   (byId(cfg[3])||{}).value || '',
          instagram: (byId(cfg[4])||{}).value || '',
          facebook:  (byId(cfg[5])||{}).value || '',
          x:         (byId(cfg[6])||{}).value || '',
          youtube:   (byId(cfg[7])||{}).value || '',
          tiktok:    (byId(cfg[8])||{}).value || ''
        };
        save('contactInfo', data);
        alert(document.documentElement.lang==='ar' ? 'تم حفظ معلومات التواصل' : 'Contact info saved');
      });
    });

    // Email template save (multi logos) AR/EN
    function bindEmail(suf){
      var btn = byId('save-email'+suf); if(!btn) return;
      btn.addEventListener('click', function(){
        var subj = (byId('email-subject'+suf)||{}).value || '';
        var body = (byId('email-template'+suf)||{}).value || '';
        var filesInput = byId('email-logos'+suf) || byId('email-logo'+suf);
        var files = filesInput && filesInput.files ? Array.from(filesInput.files) : [];
        var logos = [];
        if(files.length===0){
          logos = load('emailTemplate',{}).logos || [];
          save('emailTemplate',{subject:subj, body:body, logos:logos});
          alert(document.documentElement.lang==='ar' ? 'تم حفظ قالب البريد' : 'Email template saved');
          return;
        }
        var n=0;
        files.forEach(function(file){
          var r=new FileReader();
          r.onload=function(e){ logos.push(e.target.result); n++; if(n===files.length){ save('emailTemplate',{subject:subj, body:body, logos:logos}); alert(document.documentElement.lang==='ar' ? 'تم حفظ قالب البريد' : 'Email template saved'); } };
          r.readAsDataURL(file);
        });
      });
    }
    bindEmail(''); bindEmail('-en');
  });
})();
