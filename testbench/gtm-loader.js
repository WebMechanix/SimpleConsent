(function(w,m,x,d,e,v){
  var cdn='https://cdn.jsdelivr.net/gh/derekcavaliero/simpleconsent@latest/dist/';
  var z=m.createElement('link');z.rel='stylesheet';z.href=cdn+'SimpleConsent.min.css'; m.head.appendChild(z);
  e=m.createElement(x);e.onload=d;e.defer=1;
  e.src=cdn+"SimpleConsent.min.js";
  v=m.getElementsByTagName(x)[0];v.parentNode.insertBefore(e,v);
})(window, document, 'script', function(){
  
  new SimpleConsent({
    types: {
      analytics_storage: {
        name: 'Analytics & Performance',
        description: 'Enables storage and services that are used to measure visits, sessions, and certain types of on-page activity (such as clicks on buttons).',
        gpc: true,
      },
      advertising: {
        name: 'Advertising Targeting & Measurement',
        description: 'Enables services and services for all advertising purposes. This includes, ad personalization, advertising cookies, user data shared with our advertising partners.',
        mapTo : ['ad_storage', 'ad_personalization', 'ad_user_data'],
        gpc: true,
      },
      personalization_storage: {
        name: 'Personalization Storage',
        description: 'Enables storage and services related to personalization e.g. video recommendations, and account preferences.',
      },
      functionality_storage: {
        name: 'Functional Storage',
        description: 'Enables storage and services that supports the functionality of the website or app (e.g. language settings).',
      },
      security_storage: {
        name: 'Security Storage',
        description: 'Enables storage and services related to security such as authentication functionality, fraud prevention, and other user protection.',
        required: true,
      }
    },
    ui: {
      actionClasses: {
        _all: 'btn btn-sm',
        acceptAll: 'btn btn-primary',
        denyAll: 'btn btn-secondary',
      },
    }
  });
  
});