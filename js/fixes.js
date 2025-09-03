
(function(){
function load(k, fb){ try{return JSON.parse(localStorage.getItem(k)) ?? fb;}catch(e){return fb;} }
function save(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
function id(x){ return document.getElementById(x); }
document.addEventListener('DOMContentLoaded', function(){
  // Ensure forms save for activities/trips/chatbot Q&A
  function bindForm(modalId, formSelector, arrayKey, after){
    var modal = document.getElementById(modalId);
    if(!modal) return;
    var form = modal.querySelector(formSelector);
    if(!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(form);
      var list = load(arrayKey, []);
      var obj = {};
      data.forEach(function(v,k){ obj[k]=v; });
      obj.id = list.length>0 ? Math.max.apply(null, list.map(function(a){return +a.id||0;}))+1 : 1;
      list.push(obj);
      save(arrayKey, list);
      if(after) after(obj, list);
      alert(document.documentElement.lang==='ar' ? 'تم الحفظ' : 'Saved');
    });
  }
  bindForm('activityModal', 'form', 'activities');
  bindForm('tripModal', 'form', 'trips');
  bindForm('chatbotModal', 'form', 'chatbotQA');

  // Contact & email template save
  [['save-contact','contact-address','contact-phone','contact-email','contact-instagram','contact-facebook','contact-x','contact-youtube','contact-tiktok'],
   ['save-contact-en','contact-address-en','contact-phone-en','contact-email-en','contact-instagram-en','contact-facebook-en','contact-x-en','contact-youtube-en','contact-tiktok-en']]
  .forEach(function(cfg){
    var btn = id(cfg[0]); if(!btn) return;
    btn.addEventListener('click', function(){
      var data = {
        address:(id(cfg[1])||{}).value||'',
        phone:(id(cfg[2])||{}).value||'',
        email:(id(cfg[3])||{}).value||'',
        instagram:(id(cfg[4])||{}).value||'',
        facebook:(id(cfg[5])||{}).value||'',
        x:(id(cfg[6])||{}).value||'',
        youtube:(id(cfg[7])||{}).value||'',
        tiktok:(id(cfg[8])||{}).value||''
      };
      save('contactInfo', data);
      alert(document.documentElement.lang==='ar' ? 'تم الحفظ' : 'Saved');
    });
  });
});
})();