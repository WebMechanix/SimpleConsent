const _Namespace = 'simple-consent:';

const bootManager = () => {
  
  const defaultContainerId = 'PTLD5H79';

  const activeConfig = Alpine.store('app').getActiveConfig();

  const overrides = {
    gtm: {
      loadContainer: true,
      containerId: `GTM-${Alpine.store('app').getContainerId() || defaultContainerId}`,
    }
  };

  const defaultUi = {
    placement: {
      banner: ['bottom', 'left'],
      settingsButton: ['bottom', 'left'],
    }
  };

  if (activeConfig.gtm)
    delete activeConfig.gtm;

  if (activeConfig.ui) {
    activeConfig.ui.placement = defaultUi.placement;
  } else {
    overrides.ui = defaultUi;
  }

  const config = Object.assign({}, activeConfig, overrides);

  new SimpleConsent(config);

};

const clearLog = () => Alpine.store('log').tags = [];

document.addEventListener('simple-consent:destroy', clearLog);
document.addEventListener('simple-consent:reset', clearLog);
document.addEventListener('simple-consent:datalayer.push', (e) => Alpine.store('app').updateDataLayer(e.detail) );

const loadCustomConfigs = () => {
  
  const items = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(`${_Namespace}custom.`)) {
      const config = JSON.parse(localStorage.getItem(key));
      items[key.replace(_Namespace, '')] = config;
    }
  }

  return items;

};

const storeConfig = (key, value) => {
  localStorage.setItem(`${_Namespace}${key}`, JSON.stringify(value));
};

function logTag(tag) {
  const event = new CustomEvent(`cy:gtm.tag.fired`, {detail: tag});
  document.dispatchEvent(event);
}

document.addEventListener('submit', (e) => {
  
  if (! e.target.hasAttribute('data-testbench-controls')) 
    return;
  
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  let queryParams = new URLSearchParams({
    lang: formData.get('lang'),
    config: formData.get('config'),
  });

  if (formData.get('container_id'))
    queryParams.set('container_id', formData.get('container_id').toUpperCase());

  history.pushState({}, '', `${location.pathname}?${queryParams.toString()}`);

  SimpleConsent.manager().destroy();

  if (formData.get('lang'))
    document.documentElement.lang = formData.get('lang');

  Alpine.store('app').setActiveConfig(formData.get('config'));

  Alpine.store('app').dataLayer = {};

  bootManager();

});

document.addEventListener('submit', (e) => {

  if (! e.target.hasAttribute('data-testbench-config-editor')) 
    return;

  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const validateJson = (json) => {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  };

  const configKey = formData.get('config_name').startsWith(`custom.`) ? formData.get('config_name') : Alpine.store('editor').makeConfigKey(formData.get('config_name'));
  const configJson = JSON.parse(formData.get('config_json'));
  
  Alpine.store('editor').save(configKey, configJson);

});

document.addEventListener('click', (e) => {

  if (! e.target.matches('a[href*="webmechanix.com"], a[href*="level.agency"], a[href*="derekcavaliero.com"]'))
    return;

  e.target.target = '_blank';
  e.target.href += '?utm_source=Open%20Source&utm_medium=SimpleConsent&utm_campaign=Derek%20Cavaliero';

});

document.addEventListener('alpine:init', () => {

  const Url = new URL(window.location.href);

  Alpine.store('app', {
    configs: {
      active: {},
      custom: loadCustomConfigs(),
      default: {
        'Default' : {
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
          }
        }
      },
    },
    dataLayer: {},
    console: {
      config: null,
      dataLayer: null,
    },
    controls: {
      lang: Url.searchParams.get('lang') || 'en',
      config: Url.searchParams.get('config') || 'Default',
      containerId: Url.searchParams.get('container_id') || '',
    },
    boot() {

      if (Url.searchParams.get('lang'))
        document.documentElement.lang = Url.searchParams.get('lang');

      this.setActiveConfig(Url.searchParams.get('config') || 'Default');

      [
        'config',
        'dataLayer',
      ].forEach(key => {

        this.console[key] = ace.edit(document.querySelector(`[data-ace-editor="${key}"]`));
        // this.console.editors[key].setValue(this.json(key), -1);

        if (key === 'config')
          this.console[key].setValue(JSON.stringify(this.getActiveConfig(), null, 2), -1);

        if (key === 'dataLayer')
          this.console[key].setValue(JSON.stringify(this.dataLayer, null, 2), -1);

        this.console[key].setTheme('ace/theme/one_dark');
        this.console[key].setShowPrintMargin(false);
        this.console[key].setReadOnly(true);
        this.console[key].container.style.lineHeight = "1.4";
        this.console[key].session.setTabSize(2);
        this.console[key].session.setUseWrapMode(true);
        this.console[key].session.setMode('ace/mode/json');

        this.console[key].renderer.setScrollMargin(16, 16);
        this.console[key].renderer.on('afterRender', function() {
          document.querySelector(`[data-ace-editor="${key}"]`).classList.add('is-loaded');
        });

      });

    },
    changeConfig(value) {
      this.setActiveConfig(value);
      SimpleConsent.manager().destroy();
      bootManager();
      // this.setConsoleValue('config', this.getActiveConfig());
    },
    changeLang(value) {
      document.documentElement.lang = value;
      SimpleConsent.manager().destroy();
      bootManager();
      // this.setConsoleValue('config', this.getActiveConfig());
    },
    getActiveConfig() {
      return this.configs.active;
    },
    setActiveConfig(configKey) {
      this.configs.active = (configKey.startsWith('custom.')) ? this.configs.custom[configKey] : this.configs.default[configKey];
    },
    getConfig(configKey) {
     
      if (configKey.startsWith('custom.'))
        return this.configs.custom[configKey];

      return this.configs.default[configKey];

    },
    getConfigOptionLabel(key) {
      return key.replace(`custom.`, '');
    },
    getContainerId() {
      return this.controls.containerId.replace('GTM-', '').toUpperCase();
    },
    setConsoleValue(key, value) {
      this.console[key].setValue(JSON.stringify(value, null, 2), -1);
    },
    setControl(key, value) {
      this.controls[key] = value;
    },
    updateDataLayer(data) {
      this.dataLayer = data;
    },
    upsertConfig(key, value) {

      this.configs.custom[key] = value;
      storeConfig(key, value);        

      this.setControl('config', key);
      this.setActiveConfig(key);

      bootManager();

    }
  });

  Alpine.store('editor', {
    editor: null,
    errors: {
      json: null,
      name: null,
    },
    json: {},
    modal: new bootstrap.Modal(document.querySelector('[data-testbench-config-editor]')),
    mode: 'new',
    name: '',
    boot() {
      this.editor = ace.edit(document.querySelector('[data-ace-editor="modalEditor"]'));

      this.editor.setValue("{\n\t\n}", -1);
      
      this.editor.session.on("change", () => {
        this.json = this.editor.getValue();
      });
    
      this.editor.setTheme('ace/theme/one_dark');
      this.editor.setShowPrintMargin(false);
      this.editor.renderer.setScrollMargin(16, 16);
      this.editor.container.style.lineHeight = "1.4";
      this.editor.session.setTabSize(2);
      this.editor.session.setUseWrapMode(true);
      this.editor.session.setMode('ace/mode/json');
    },
    edit(configKey) {
      this.name = configKey;
      this.mode = 'edit';
      this.json = Alpine.store('app').getActiveConfig();
      this.editor.setValue(JSON.stringify(this.json, null, 2), -1);
      this.modal.show();
    },
    save(configKey, configJson) {
      Alpine.store('app').upsertConfig(configKey, configJson);
      this.modal.hide();
      this.reset();
    },
    makeConfigKey(str) {

      if (! str)
        str = this.name;

      return `custom.${str.toLowerCase().replace(/[^a-z0-9\-]/g, '-')}`;

    },
    new() {
      this.reset();
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

  Alpine.store('log', {
    tags: [],
    updatedTags: new Set(),
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
    }
  }); 

  Alpine.store('app').boot();
  Alpine.store('editor').boot();

  document.addEventListener('cy:gtm.tag.fired', (event) => {

    if (! event.detail.key)
      return;

    Alpine.store('log').addOrUpdateTag(event.detail);

  });

});

document.addEventListener('DOMContentLoaded', () => {

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

  const header = document.querySelector('header[data-testbench-header]');
  const main = document.querySelector('main[data-testbench-body]');
  const footer = document.querySelector('footer[data-testbench-footer]');

  main.style.minHeight = `calc(100vh - (${header.offsetHeight + (footer.offsetHeight)}px)`;

  bootManager();

});