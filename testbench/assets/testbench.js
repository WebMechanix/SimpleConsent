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

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  const header = document.querySelector('header[data-testbench-header]');
  const main = document.querySelector('main[data-testbench-body]');
  const footer = document.querySelector('footer[data-testbench-footer]');

  main.style.minHeight = `calc(100vh - (${header.offsetHeight + (footer.offsetHeight)}px)`;

  let config = window._configs[configKey];
  window._configs[configKey].gtm = window._configs._.gtm;
  window._configs[configKey].ui = window._configs._.ui;
  Alpine.store('log').config = config;

  new SimpleConsent(config);

});

document.addEventListener('submit', (e) => {
  
  if (! e.target.hasAttribute('data-testbench-controls')) 
    return;
  
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

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

  window._configs[configKey].gtm = window._configs._.gtm;
  window._configs[configKey].ui = window._configs._.ui;

  Alpine.store('log').config = window._configs[configKey];
  Alpine.store('log').dataLayer = {};

  new SimpleConsent(window._configs[configKey]);

});

const loadCustomConfigs = () => {
  
  const items = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('simple-consent:config.')) {
      const config = localStorage.getItem(key);
      window._configs[key] = JSON.parse(config);
      items.push({ key, config });
    }
  }

  return items;

}

document.addEventListener('submit', (e) => {

  if (! e.target.hasAttribute('data-testbench-config-editor')) 
    return;

  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const modal = bootstrap.Modal.getInstance(e.target);

  const validateJson = (json) => {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  };

  const configKey = formData.get('config_name').startsWith('simple-consent:config.') ? formData.get('config_name') : Alpine.store('configEditor').makeConfigKey(formData.get('config_name'));
  const configJson = JSON.stringify(JSON.parse(formData.get('config_json')));

  console.log({
    configKey,
    configJson,
    configValid: validateJson(formData.get('config_json'))
  });

  if (formData.get('mode') === 'new')
      Alpine.store('controls').addConfig({ key: configKey, config: configJson });

  localStorage.setItem(configKey, configJson);

  modal.hide();
  
  Alpine.store('configEditor').reset();

});

document.addEventListener('click', (e) => {

  if (! e.target.matches('a[href*="webmechanix.com"], a[href*="level.agency"], a[href*="derekcavaliero.com"]'))
    return;

  e.target.target = '_blank';
  e.target.href += '?utm_source=Open%20Source&utm_medium=SimpleConsent&utm_campaign=Derek%20Cavaliero';

});

function logTag(tag) {
  const event = new CustomEvent(`cy:gtm.tag.fired`, {detail: tag});
  document.dispatchEvent(event);
}

const reboot = () => Alpine.store('log').tags = [];

document.addEventListener('simple-consent:destroy', reboot);
document.addEventListener('simple-consent:reset', reboot);
document.addEventListener('simple-consent:datalayer.push', (e) => Alpine.store('log').updateDataLayer(e.detail) );

document.addEventListener('alpine:init', () => {

  Alpine.store('configEditor', {
    editor: null,
    errors: {
      json: null,
      name: null,
    },
    json: {},
    modal: new bootstrap.Modal(document.querySelector('[data-testbench-config-editor]')),
    mode: 'new',
    name: '',
    bootEditor() {
      this.editor = ace.edit('editor');

      this.editor.setValue("{\n\t\n}", -1);
      
      this.editor.session.on("change", () => {
        this.json = this.editor.getValue();
      });
    
      this.editor.setTheme('ace/theme/one_dark');
      this.editor.setShowPrintMargin(false);
      this.editor.renderer.setScrollMargin(16, 16);
      this.editor.session.setTabSize(2);
      this.editor.session.setUseWrapMode(true);
      this.editor.session.setMode('ace/mode/json');
    },
    makeConfigKey(str) {

      if (! str)
        str = this.name;

      return `simple-consent:config.${str.toLowerCase().replace(/[^a-z0-9\-]/g, '-')}`;

    },
    new() {
      this.modal.show();
    },
    edit(configKey) {
      this.name = configKey;
      this.mode = 'edit';
      this.json = Alpine.store('controls').getConfig(configKey);
      this.editor.setValue(JSON.stringify(this.json, null, 2), -1);
      this.modal.show();
    },
    reset() {
      this.editor.setValue("{\n\t\n}", -1);
      this.json = {};
      this.name = '';
      this.mode = 'new';
      this.errors = { json: null, name: null };
    }
  });

  Alpine.store('configEditor').bootEditor();

  Alpine.store('controls', {
    lang: Url.searchParams.get('lang') || 'en',
    config: Url.searchParams.get('config') || '_',
    customConfigs: loadCustomConfigs(),
    containerId: Url.searchParams.get('container_id') || '',
    addConfig(config) {
      this.customConfigs.push(config);
    },
    getConfig(configKey) {
      return window._configs[configKey];
    },
    getConfigOptionLabel(config) {
      return config.key.replace('simple-consent:config.', '');
    },
    loadConfig(configKey) {},
  });

  Alpine.store('log', {
    config: {},
    dataLayer: {},
    editors: {
      config: null,
      dataLayer: null,
    },
    tags: [],
    updatedTags: new Set(),
    bootEditors() {

      [
        'config',
        'dataLayer',
      ].forEach(key => {

        this.editors[key] = ace.edit(document.querySelector(`[data-ace-editor="${key}"]`));
        this.editors[key].setTheme('ace/theme/one_dark');
        this.editors[key].setShowPrintMargin(false);
        this.editors[key].setReadOnly(true);
        this.editors[key].renderer.setScrollMargin(16, 16);
        this.editors[key].session.setTabSize(2);
        this.editors[key].session.setUseWrapMode(true);
        this.editors[key].session.setMode('ace/mode/json');

      });

    },
    addTag(tag) {
      tag.totalFired = 1;
      tag.triggerEvent = [tag.triggerEvent];
      this.tags.push(tag);
      this.updatedTags.add(tag.key);
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
    },
    findTag(key) {
      return this.tags.find(tag => tag.key === key);
    },
    json(key) {
      return JSON.stringify(this[key], null, 2);
    },
    updateDataLayer(data) {
      this.dataLayer = data;
    },
  }); 

  Alpine.store('log').bootEditors();

  document.addEventListener('cy:gtm.tag.fired', (event) => {

    if (! event.detail.key)
      return;

    Alpine.store('log').addOrUpdateTag(event.detail);

  });

});