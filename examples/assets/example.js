window._configs = {
  _: {
    gtm: {
      containerId: 'GTM-PTLD5H79',
      loadContainer: true,
    },
    services: {
      cloudflare: {
        name: 'Cloudflare',
        description: '',
        types: ['necessary', 'security_storage'],
      },
      google_analytics: {
        name: 'Google Analytics',
        description: '',
        types: ['analytics_storage', 'advertising'],
      },
      google_ads: {
        name: 'Google Ads',
        description: '',
        types: ['advertising'],
      },
      hotjar: {
        name: 'Hotjar',
        description: '',
        types: ['analytics_storage'],
      },
      hubspot: {
        name: 'HubSpot',
        description: '',
        types: ['analytics_storage', 'personalization_storage'],
      },
      linkedin_ads: {
        name: 'LinkedIn Ads',
        description: '',
        types: ['advertising'],
      },
      meta_ads: {
        name: 'Meta Ads',
        description: '',
        types: ['advertising'],
      },
      microsoft_ads: {
        name: 'Microsoft Ads',
        description: '',
        types: ['advertising'],
      },
      microsoft_clarity: {
        name: 'Microsoft Clarity',
        description: '',
        types: ['analytics_storage'],
      },
      tiktok_ads: {
        name: 'TikTok Ads',
        description: '',
        types: ['advertising'],
      },
      vwo: {
        name: 'Visual Website Optimizer',
        description: '',
        types: ['analytics_storage'],
      },
    },
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
      placement: {
        banner: ['bottom', 'center'],
        settingsButton: ['bottom', 'right'],
      }
    }
  }
};

const Url = new URL(window.location.href);
window.configKey = Url.searchParams.get('config') || '_';

if (Url.searchParams.get('lang'))
  document.documentElement.lang = Url.searchParams.get('lang');

if (Url.searchParams.get('container_id'))
  window._configs._.gtm.containerId = 'GTM-' + Url.searchParams.get('container_id').toUpperCase();

document.addEventListener('DOMContentLoaded', () => {

  let params = {
    lang: Url.searchParams.get('lang'),
    config: Url.searchParams.get('config'),
    container_id: Url.searchParams.get('container_id'),
  };
  
  for (let key in params) {
    let input = document.querySelector(`[name="${key}"]`);
    if (input && params[key]) 
      input.value = params[key];
  }

  let config = window._configs[configKey];

  new SimpleConsent(config);

});

document.addEventListener('submit', (e) => {
  
  if (! e.target.hasAttribute('data-testbench-controls')) 
    return;
  
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  console.log(`${location.pathname}${(location.search ? '&' : '?')}`);

  let queryParams = new URLSearchParams({
    lang: formData.get('lang'),
    config: formData.get('config'),
    container_id: formData.get('container_id').toUpperCase(),
  });

  history.pushState({}, '', `${location.pathname}?${queryParams.toString()}`);

  SimpleConsent.manager().destroy();

  if (formData.get('lang'))
    document.documentElement.lang = formData.get('lang');

  if (formData.get('container_id'))
    window._configs._.gtm.containerId = 'GTM-' + formData.get('container_id').toUpperCase();

  configKey = formData.get('config');

  Alpine.store('log').config = window._configs[configKey];
  Alpine.store('log').dataLayer = {};

  new SimpleConsent(window._configs[configKey]);

});

document.addEventListener('click', (e) => {

  if (! e.target.hasAttribute('data-toggle-stylesheets'))
    return;

  e.preventDefault();

  e.target.innerText = e.target.innerText === 'Enable Stylesheets' ? 'Disable Stylesheets' : 'Enable Stylesheets';
  document.body.classList.toggle('stylesheets-disabled');

  const stylesheets = document.querySelectorAll('link[can-disable]');
  stylesheets.forEach(stylesheet => {
    stylesheet.disabled = ! stylesheet.disabled;
  });

});

/**
 * Logger Functionality
 */

function logTag(tag) {
  const event = new CustomEvent(`cy:gtm.tag.fired`, {detail: tag});
  document.dispatchEvent(event);
}

const reboot = () => {

  Alpine.store('log').tags = [];

  // document.querySelectorAll('script[src*="www.googletagmanager.com"]').forEach(script => script.remove());
  
  // delete window.google_tag_data;
  // delete window.google_tag_manager;

  window.dataLayer.push(function() {
    this.clear();
  });



};

document.addEventListener('simple-consent:destroy', reboot);
document.addEventListener('simple-consent:reset', reboot);

document.addEventListener('simple-consent:datalayer.push', (e) => {
  Alpine.store('log').updateDataLayer(e.detail);
});

document.addEventListener('alpine:init', () => {

  Alpine.store('log', {
    config: window._configs[configKey],
    dataLayer: {},
    tags: [],
    updatedTags: new Set(),
    updateDataLayer(data) {
      let newObject = {
        event: data.event,
        consent: data.consent,
      };
      for (let key in data) {
        if (['event', 'consent', 'gtm.uniqueEventId'].includes(key))
          continue;
        newObject[key] = data[key];
      }
      this.dataLayer = newObject;
    },
    json(key) {
      return JSON.stringify(this[key], null, 2);
    },
    addTag(tag) {
      tag.totalFired = 1;
      tag.triggerEvent = [tag.triggerEvent];
      this.tags.push(tag);
      this.updatedTags.add(tag.key);
    },
    findTag(key) {
      return this.tags.find(tag => tag.key === key);
    },
    addOrUpdateTag(tag) {
      const existingTag = this.findTag(tag.key);
      if (existingTag) {
        existingTag.totalFired++;
        existingTag.triggerEvent.push(tag.triggerEvent);
        this.updatedTags.add(existingTag.key);
      } else {
        this.addTag(tag);
      }
    },
    clearUpdatedTags() {
      this.updatedTags.clear();
    }
  });  

  document.addEventListener('cy:gtm.tag.fired', (event) => {

    if (! event.detail.key)
      return;

    Alpine.store('log').addOrUpdateTag(event.detail);

  });

});