/**!
 * SimpleConsent.js
 * 
 * Author: Derek Cavaliero (@derekcavaliero)
 * Repository: https://github.com/derekcavaliero/SimpleConsent
 * Version: 1.0.alpha
 * License: MIT
 */
class SimpleConsent {

  static #instance = null;

  #_multiConfig = null;
  #_namespace = 'simple-consent';
  #_version = 1.0;
  #_geo = null;
  
  #actions = [
    'acceptAll',
    'acceptSelected',
    'close',
    'denyAll',
    'saveSettings',
    'showSettings',
  ];  

  /**
   * The main configuation object for the consent manager.
   * The bulk of the functionality is driven by this object.
   * 
   * This object is resolved through a fair bit of recursion and object merging. Any custom config will be merged with this object.
   * 
   * The most specific config will always take precedence over the default config. This includes multi-configuration objects where the user's geolocation matches N+1 configurations.
   * This config is written to be "safe" by design. If a user provides an invalid value, the library will default to the safest value (e.g. the most restrictive in terms of privacy).
   * 
   * Multi-configuration is supported by passing an object with a `_default` key and a `_router` key and any number of custom keys for each configuration.
   * The library will detect if a multi-config object is passed and resolve the appropriate config based on the user's geolocation (if a `geoLocate` function is provided).
   * 
   * @private
   * @type {Object}
   */
  #config = {

    /**
     * Actions
     * 
     * The actions object is used to configure the action buttons that are displayed in the consent UI.
     * Each action can be enabled or disabled by setting the value to `true` or `false`.
     * The order of the actions (left-to-right) can be customized by setting the `_order` array.
     */
    actions: {
      banner: {
        _order: ['showSettings', 'denyAll', 'acceptAll'],
        showSettings: true,
        denyAll: true,
        acceptAll: true,
      },
      modal: {
        _order: ['denyAll', 'saveSettings', 'acceptSelected', 'acceptAll'],
        acceptAll: true,
        acceptSelected: true,
        saveSettings: true,
        denyAll: true,
      },
    },

    /**
     * Consent Model
     * 
     * The consent model determines whether the user must opt-in or opt-out of services.
     * "opt-in" - The user must explicitly consent to each consent type.
     * "opt-out" - The user must explicitly decline each consent type.
     * 
     * @default string 'opt-in'
     */
    consentModel: 'opt-in',

    /**
     * If the user performs one of the actions listed in this array, they will be considered to have given consent.
     * Possible values: `''click', 'banner.close', scroll'`
     * 
     * @default boolean false
     */
    consentOnImplicitAction: false,

    /**
     * If set to true, the consent modal will be shown immediately and the user will be required 
     * to make a selection before using the website.
     * 
     * @default boolean false
     */
    consentRequired: false,

    /**
     * Content
     * 
     * This object contains the default content used in various parts of the consent manager UI.
     * It includes text for the banner, modal, and URLs for privacy-related documents.
     * 
     * @property {Object} content - The text object.
     * @property {Object} content.banner - The text content for the consent banner.
     * @property {string} content.banner.heading - The heading text for the banner.
     * @property {string} content.banner.description - The description text for the banner.
     * @property {Object} content.banner.actions - The action buttons text for the banner.
     * @property {string} content.banner.actions.acceptAll - The text for the "Accept All" button.
     * @property {string} content.banner.actions.denyAll - The text for the "Decline All" button.
     * @property {string} content.banner.actions.showSettings - The text for the "Edit Settings" button.
     * 
     * @property {Object} content.modal - The text content for the consent modal.
     * @property {string} content.modal.heading - The heading text for the modal.
     * @property {string} content.modal.description - The description text for the modal.
     * @property {string} content.modal.toggleAll - The text for the "Enable/Disable All" toggle.
     * @property {Object} content.modal.actions - The action buttons text for the modal.
     * @property {string} content.modal.actions.acceptAll - The text for the "Accept All" button.
     * @property {string} content.modal.actions.acceptSelected - The text for the "Accept Selected" button.
     * @property {string} content.modal.actions.denyAll - The text for the "Decline All" button.
     * @property {string} content.modal.actions.save - The text for the "Save" button.
     * 
     * @property {Object} content.urls - The URLs for privacy-related documents.
     * @property {string} content.urls.privacyPolicy - The URL for the privacy policy.
     * @property {string} content.urls.termsOfService - The URL for the terms of service.
     * @property {string} content.urls.cookiePolicy - The URL for the cookie policy.
     */
    content: {
      banner: {
        heading: 'Privacy Notice',
        description: 'This website uses cookies (or other browser storage) to deliver our services and/or analyze our website usage. This information is also shared with advertising partners through the use of tracking scripts/pixels.',
        actions: {
          acceptAll: 'Accept All',
          denyAll: 'Decline All',
          showSettings: 'Edit Settings',
        },
      },
      modal: {
        heading: 'Consent & Privacy Settings',
        description: 'This website uses services that utilize storage features in your browser (via cookies or other browser storage functionality) to collect information. You can choose to grant or deny certain types of data collection using the controls below.',
        toggleAll: 'Enable/Disable All',
        actions: {
          acceptAll: 'Accept All',
          acceptSelected: 'Accept Selected',
          denyAll: 'Decline All',
          saveSettings: 'Save Preferences',
        },
      },
      links: {
        privacyPolicy: {
          text: 'Privacy Policy',
          url: '#/privacy-policy',
        },
        termsOfService: null,
        cookiePolicy: {
          text: 'Cookie Policy',
          url: '#/cookie-policy',
        },
      },
    },

    /**
     * Cookie Domain
     * 
     * The domain to set the consent cookie on. If null, the cookie domain will be set to the root domain.
     * 
     * @default null
     */
    cookieDomain: null, 

    /**
     * Cookie Expiry Days
     * 
     * The number of days that the consent cookie should be stored for.
     * 
     * @default integer 365
     */
    cookieExpiryDays: 365,          

    /**
     * Cookie Name
     * 
     * The name of the cookie that stores the user's consent settings.
     * 
     * @default string 'simple_consent'
     */
    cookieName: 'simple_consent',   

    /**
     * @value {Function} geoLocate - A function that returns a promise that resolves to the user's geolocation.
     * @default null
     */
    geoLocate: null,

    /**
     * Used to configure settings specific to Google Tag Manager.
     * Things like the dataLayer object, container ID, etc..
     */
    gtm: {
      loadContainer: false,
      containerId: null,
    },
    
    /**
     * Localization object
     * 
     * This object is used to store the translations for the consent manager. The following objects can be localized:
     * - services
     * - types
     * - ui
     * 
     * The object is keyed by the locale code (e.g., 'en', 'de', 'fr', etc.). The default locale is 'en'.
     * 
     * @property {Object} l10n - The localization object.
     * @property {Object} l10n.<locale> - The translations for a specific locale.
     * @property {Array<Object>} l10n.<locale>.services - An array of localized service objects.
     * @property {Array<Object>} l10n.<locale>.types - An array of localized type objects.
     * @property {Object} l10n.<locale>.text - An object containing localized UI content.
     * 
     * @example
     * {
     *   fr: {
     *     services: [],
     *     content: {},
     *     types: [],
     *   },
     * }
     * 
     * @default {}
     */
    l10n: {},

    /**
     * Locale
     * 
     * The locale code for the consent manager. This code is used to determine which localization to use (if available).
     * The locale is determined in the following order: 
     * 1. Explicitly set locale (e.g., 'en', 'de', 'fr', etc...)
     * 2. The locale code from the pages `lang` attribute (e.g., 'en-US', 'de-DE', 'fr-FR', etc...)
     * 3. If no locale is set, the default `text`, `services`, and `types` will be used.
     * 
     * @default null
     */
    locale: null,

    /** 
     * Callback: onInit
     * 
     * Called when the consent manager is initialized (e.g. after UI is booted).
     * @param {Object} [context] - The context object provided during initialization.
     * @default function(context) {}
     */
    onInit: function(settings) {},

    /** 
     * Callback: onUpdateAfter
     * 
     * Called after the consent settings are updated.
     * @param {Object} [settings] - The updated consent settings.
     * @default function(settings) {}
     */
    onUpdateAfter: function(settings) {},

    /** 
     * Callback: onUpdateBefore
     * 
     * Called before the consent settings are updated.
     * @param {Object} [settings] - The current consent settings before update.
     * @default function(settings) {}
     */
    onUpdateBefore: function(settings) {},

    /**
     * Services
     * 
     * An array of service objects that the website uses. 
     * Each service object should have the following properties:
     * 
     * @property {string} name - The name of the service.
     * @property {string} description - A short description of the service.
     * @property {Array<Object>} cookies - An array of cookie objects that the service uses. 
     * @property {Array<string>} types - An array of consent type keys that the service uses:
     *   - `necessary`
     *   - `analytics_storage`
     *   - `ad_storage`
     *   - `ad_personalization`
     *   - `ad_user_data`
     *   - `functionality_storage`
     *   - `personalization_storage`
     *   - `security_storage`
     * 
     * @default []
     */
    services: {},

    /**
     * Templates
     * 
     * The templates object is used to store the HTML templates for the consent manager. 
     * You can customize any of the templates in this object, but you must keep the following data-attributes in the templates:
     * - data-consent-actions
     * - data-consent-action
     * - data-consent-settings
     * 
     * @property {Object} templates - The templates object.
     * @property {string} templates.banner - The HTML template for the consent banner.
     * @property {string} templates.modal - The HTML template for the consent modal.
     * @property {string} templates.type - The HTML template for the consent type.
     */
    templates: {
      banner: `
              <div class="consent-banner">
                <div class="consent-ui__content" role="alert" aria-labelledby="consentBannerHeading" aria-describedby="consentBannerDescription">
                  <div class="consent-ui__header">
                    <h2 class="consent-banner__heading" id="consentBannerHeading">
                      {{ heading }}
                    </h2>
                    <button aria-label="Close" data-consent-close></button>
                  </div>
                  <div class="consent-banner__description" id="consentBannerDescription">{{ description }}</div>
                  <div data-consent-actions></div>
                  <div data-consent-links class="consent-ui__footer"></div>
                </div>
              </div>
              `,
      modal:  `
              <div class="consent-modal" aria-labelledby="consentModalHeading" aria-describedby="consentModalDescription">
                <div class="consent-ui__content">
                  <div class="consent-ui__header">
                    <h2 class="consent-modal__heading" id="consentModalHeading">{{ heading }}</h2>
                    <button aria-label="Close" data-consent-close></button>
                  </div>
                  <div class="consent-modal__description" id="consentModalDescription">{{ description }}</div>
                  <form data-consent-settings>
                    <div data-consent-types class="consent-modal__body">
                    </div>
                    <div data-consent-actions></div>
                  </form>
                  <div data-consent-links class="consent-ui__footer"></div>
                </div>
              </div>
              `,
      type:   `
              <div class="consent-type">
                <div class="consent-switch">
                  <input type="checkbox" role="switch" id="type-{{ key }}" name="{{ key }}">
                  <div class="consent-switch__text">
                    <label for="type-{{ key }}">{{ name }}</label>
                    <div>{{ description }}</div>
                    <div data-consent-type-services></div>
                  </div>
                </div>
              </div>
              `,
    },

    types: {},

    /**
     * UI
     * 
     * This object contains settings for the consent manager UI.
     * It allows customization of action button classes, banner placement, etc...
     * 
     * @property {Object} ui - The ui settings object.
     * @property {string|null} ui.actionClasses - CSS classes to be applied to action buttons. If `null`, default classes are used.
     * @property {Object} ui.placement - The placement settings for the banner.
     * @property {Array<string>} ui.placement.banner - An array specifying the position of the banner. Possible values include 'top', 'bottom', 'left', 'right'.
     */
    ui: {
      actionClasses: {
        _all: null,
        acceptAll: null,
        acceptSelected: null,
        denyAll: null,
        showSettings: null,
        saveSettings: null,
      },
      placement: {
        banner: ['bottom', 'left'],
      },
      rootClass: 'simple-consent',
      rootId: 'simple-consent',
      showBranding: true,
    },

  };

  /**
   * Settings
   * 
   * Holds the consent settings for the consent manager.
   * The settings object is a key-value pair where the key is the consent type and the value is a boolean indicating whether the user has consented.
   * Any keys starting with an underscore (_) are reserved for internal use (e.g., _gpc for Global Privacy Control or _geo for geolocation etc...).
   * 
   * @private
   * @type {Object|null}
   */
  #settings = null;

  #types = {
    necessary: {
      key: 'necessary',
      name: 'Strictly Necessary',
      description: 'These cookies/services are required for our website(s) to function properly and cannot be disabled.',
      required: true,
    }
  };

  /**
   * UI Elements
   * 
   * This private property is an object used to store references to the DOM nodes created by the consent manager.
   * Each property within this object will hold a reference to specific DOM node(s).
   * 
   * @private
   * @type {Object}
   * @property {HTMLElement|null} banner - Reference to the banner DOM node.
   * @property {HTMLElement|null} modal - Reference to the modal DOM node.
   * @property {HTMLElement|null} root - Reference to the root DOM node.
   * @property {HTMLElement|null} settings - Reference to the settings DOM node.
   */
  #ui = {
    banner: null,
    modal: null,
    root: null,
    settings: null
  };

  constructor(config) {

    console.time(`⏱️ ${this.#name}`);

    if (SimpleConsent.#instance) 
      return SimpleConsent.#instance;

    SimpleConsent.#instance = this;

    this.#resolveConfig(config);

    console.timeEnd(`⏱️ ${this.#name}`);

  }

  get #name() {
    return this.constructor.name;
  }

  async #resolveConfig(config) {
    
    if (config._default) {

      this.#_multiConfig = config;
      config = config._default;

      this.#config = this.#deepMerge(this.#config, config);

      let router = this.#_multiConfig._router;

      if (! router)
        console.warn('SimpleConsent: No `_router` found in multi-config object. Will default to base config.');

      if (this.#config.geoLocate && typeof this.#config.geoLocate == 'function') {

        this.#config.geoLocate().then((geo) => {

          this.#_geo = geo;

          if (! router) {
            this.#init();
            return;
          }

          router.forEach((route) => {
            
            if (! route.geoMatch)
              return;

            if (geo.match(route.geoMatch) && this.#_multiConfig.hasOwnProperty(route.config))
              this.#config = this.#deepMerge(this.#config, this.#_multiConfig[route.config]);

          });

          this.#init();

        });

      }

    } else {
      this.#config = this.#deepMerge(this.#config, config);
      this.#init();
    }

  }

  #init() {
    
    this.#config.cookieDomain = this.#resolveCookieDomain();
    this.#types = this.#deepMerge(this.#types, this.#config.types);

    this.#gtmSetDataLayer();

    this.#bindCustomEvents();

    this.#loadSettings();
    this.#gtmLoadConainer();
    
    this.#bindExplicitActions();
    this.#bindImplicitActions();
    
    this.#maybeLocalize();
    this.#mount();

    if (typeof this.#config.onInit == 'function') {
      this.#config.onInit(this.#settings);
      this.#emit('init', this.#settings);
    }

  }

  /* -------------
   * Private API
   * ------------- */

  #addAttributes(element, attributes) {
    for (const key in attributes) {
      if (! attributes.hasOwnProperty(key)) continue;
      element.setAttribute(key, attributes[key]);
    }
  }

  #bindCustomEvents() {

    document.addEventListener(`${this.#_namespace}:modal.show.before`, (e) => {

      const actions = e.detail.querySelectorAll('[data-consent-action]');

      if (! this.#settings._datetime) {

        actions.forEach((action) => {
          action.style.display = (action.getAttribute('data-consent-action') !== 'saveSettings') ? 'block' : 'none';
        });

        this.hide('banner');

        return;

      }

      actions.forEach((action) => {
        action.style.display = (action.getAttribute('data-consent-action') !== 'saveSettings') ? 'none' : 'block';
      });

    });

    document.addEventListener(`${this.#_namespace}:modal.close.before`, (e) => {

      if (! this.#settings._datetime)
        this.show('banner');

    });

    document.addEventListener(`${this.#_namespace}:settings.update`, (e) => {
      this.#gtmPush('update');
    });

    document.addEventListener(`${this.#_namespace}:settings.load`, (e) => {
      console.log(e.type, e.detail);
      this.#gtmPush('default');
    });

  }

  #bindExplicitActions() {

    document.addEventListener('click', (e) => {

      if (e.target.hasAttribute('data-consent-action')) {
        
        e.preventDefault();

        this[{
          showSettings: 'show',
          acceptAll: 'accept',
          acceptSelected: 'save',
          denyAll: 'deny',
          saveSettings: 'save',
        }[e.target.dataset.consentAction]]();
        
      }        

      if (e.target.hasAttribute('data-consent-close')) {
        e.preventDefault();
        this.#close(e.target);
      }

    });

  }

  #bindImplicitActions() {

    // We only want to bind the listeners if the user has not already set their preferences
    // and if the consentOnImplicitAction array is not empty/falsy.
    if (! this.#config.consentOnImplicitAction || this.#settings)
      return;

    const consentToAll = () => {
      this.changeAll();
      this.save(true);

      removeEventListeners();
    }

    const debounce = (func, wait) => {
      
      let timeout;
      
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };

    }

    const acceptOnScroll = (e) => {

      if (window.scrollY < (window.innerHeight * 0.05))
        return;

      consentToAll();

    }
  
    const debouncedAcceptOnScroll = debounce(acceptOnScroll, 100);

    if (this.#config.consentOnImplicitAction.includes('scroll'))
      document.addEventListener('scroll', debouncedAcceptOnScroll);

    const acceptOnBodyClick = (e) => {
      
      if (e.target.closest('[data-consent-tpl]')) 
        return;

      consentToAll();

    }

    if (this.#config.consentOnImplicitAction.includes('click'))
      document.addEventListener('mousedown', acceptOnBodyClick);

    const acceptOnClose = (e) => {
      consentToAll();
    }

    if (this.#config.consentOnImplicitAction.includes('banner.close'))
      document.addEventListener(`${this.#_namespace}:banner.close.after`, acceptOnClose);

    const removeEventListeners = () => {
      document.removeEventListener('mousedown', acceptOnBodyClick);
      document.removeEventListener(`${this.#_namespace}:banner.close.after'`, acceptOnClose);
      document.removeEventListener('scroll', acceptOnScroll);
    }

  }

  #convertSettingsToStatusObject() {

    let obj = {};
      
    if (this.#settings) {

      for (let setting in this.#settings) {
        
        if (! this.#settings.hasOwnProperty(setting) || setting.startsWith('_')) 
          continue;

        obj[setting] = this.#settings[setting] ? 'granted' : 'denied';
      
      }

    }

    return obj;

  }

  #close(target) {

    if (this.#config.consentRequired && ! this.#settings)
      return;

    const element = target.closest('[data-consent-tpl]');

    if (! element)
      return;

    this.#emit(`${element.dataset.consentTpl}.close.before`, element);

    element.classList.remove('is-open');

    this.#emit(`${element.dataset.consentTpl}.close.after`, element);

  }

  #deepMerge(target, source) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (Array.isArray(source[key])) {
          target[key] = source[key].slice();
        } else if (typeof source[key] === 'object' && source[key] !== null) {
          if (!target[key]) {
            target[key] = {};
          }
          this.#deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    return target;
  }

  #gtmSetDataLayer() {

    // @consider - custom dataLayer name support. Hardly anyone does this.
    // Simo's "Consent Mode (Google tags)" tag template uses "dataLayer" as the default and it can't be customized.
    window.dataLayer = window.dataLayer || [];

    // if (! window.gtag)
    //   window.gtag = function() { window.dataLayer.push(arguments); }

  }

  #gtmLoadConainer() {
    
    if (! this.#config.gtm.loadContainer || ! this.#config.gtm.containerId)
      return;

    (function(w, d, s, l, i){
  
      w[l]=w[l]||[];
      w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
    
      var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),
          dl=l!='dataLayer'?'&l='+l:'';
    
      j.async=true;
      j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
      
    })(window, document, 'script', 'dataLayer', this.#config.gtm.containerId);

  }

  #gtmPush(event) {
    
    // window.gtag('consent', event, this.#convertSettingsToStatusObject());

    let payload = this.#convertSettingsToStatusObject();

    /**
     * This looks odd - but its intentional.
     * 
     * If the library is responsible for loading the GTM contianer, we can make sure the consent settings are
     * present in the dataLayer before the container is loaded by pushing the consent data WITHOUT an event name.
     * Doing this will enable the use of Initialization, All Pages, and DOM Ready triggers in GTM instead of having to wait for the consent event.
     */
    if (! this.#config.gtm.loadContainer && event == 'default')
      payload.event = `${this.#_namespace}.${event}`;

    payload.consentModel = this.#config.consentModel;

    window.dataLayer.push(payload);

  }

  #emit(eventName, detail) {
    const event = new CustomEvent(`${this.#_namespace}:${eventName}`, { detail });
    document.dispatchEvent(event);
  }

  

  #hideAll() {
    this.hide('modal');
    this.hide('banner');
  }

  #loadSettings() {
      
    this.#settings = this.settings;
    
    // If we have settings, we don't need to do anything else.
    if (this.#settings) {
      this.#emit('settings.load', this.#settings);
      return;
    }
    
    this.#settings = {};

    this.#config.consentModel = this.#config.consentModel.toLowerCase().trim();

    // Saftey net for invalid consentModel values
    if (! ['opt-in', 'opt-out'].includes(this.#config.consentModel)) {
      console.info(`⚠️ ${this.#name}: Invalid consentModel config value "${this.#config.consentModel}". Defaulting to "opt-in".`);
      this.#config.consentModel = 'opt-in';
    }

    let defaultSetting = {
      'opt-in': false,
      'opt-out': true,
    }[this.#config.consentModel];

    // Respect the user's Global Privacy Control setting
    // @todo - make sure that we can fine-tune by type if desired.
    if (navigator.globalPrivacyControl) {
      defaultSetting = navigator.globalPrivacyControl ? false : defaultSetting;
      this.#settings['_gpc'] = navigator.globalPrivacyControl;
      console.info(`ℹ️ ${this.#name}: GPC signal detected, setting applicable types to "denied" (false) =>`, this.#settings);
    } else {
      console.info(`ℹ️ ${this.#name}: Settings determined by "${this.#config.consentModel}" consentModel (${defaultSetting}) =>`, this.#settings);
    }

    for (let [typeKey, type] of Object.entries(this.#types)) {
      this.#settings[typeKey] = type.required ? true : defaultSetting;
    }

    this.#emit('settings.load', this.#settings);

  }

  /**
   * Responsible for:
   * - Checking if a default locale is set in the config.
   * - Extracting the current language code from the `<html>` "lang" attribute (if no explicit locale is set in the config).
   * - Localizing the consent manager UI based on the locale and `l10n` config object (if defined).
   * 
   * If no localization possible given the above, the default text will be used.
   * 
   * @todo Implement localization for services and types.
   * 
   * @returns {void}
   */
  #maybeLocalize() {
      
      if (! this.#config.l10n)
        return;
  
      if (! this.#config.locale) {
        const lang = document.documentElement.lang;
        this.#config.locale = lang || null;
      }

      if (! this.#config.locale) {
        console.info(`ℹ️ ${this.#name}: No locale set or detected on html "lang" attribute.`);
        return;
      }

      this.#config.locale = this.#config.locale.toLowerCase();

      const l10n = this.#config.l10n[this.#config.locale];
  
      if (! l10n) {
        console.info(`ℹ️ ${this.#name}: No l10n key found for "${this.#config.locale}".`);
        return;
      }
  
      if (l10n.content) 
        this.#config.content = this.#deepMerge(this.#config.content, l10n.content);
  
      if (l10n.services)
        this.#config.services = l10n.services;
  
      if (l10n.types)
        this.#types = l10n.types;
  }

  /**
   * Reponsible for mounting the consent manager UI to the DOM.
   * Calls sub-methods for mounting the modal, banner, and their appropriate actions.
   * 
   * @returns {void}
   */
  #mount() {

    const root = document.createElement('div');
    root.id = this.#config.ui.rootId;
    
    root.className = this.#config.ui.rootClass;
    this.#addAttributes(root, { 
      'data-consent-tpl': 'root',
    });

    // Modal
    this.#ui.modal = this.#parseTemplate('modal', this.#config.content.modal);
    this.#addAttributes(this.#ui.modal, {
      'role': 'dialog',
    });

    this.#mountActions(this.#ui.modal);
    this.#mountConsentTypes(this.#settings, this.#ui);

    root.appendChild(this.#ui.modal);

    // Banner
    this.#ui.banner = this.#parseTemplate('banner', this.#config.content.banner);
    this.#mountActions(this.#ui.banner);
    
    this.#addAttributes(this.#ui.banner, { 
      'data-consent-placement': this.#config.ui.placement.banner.join(','),
    });

    root.appendChild(this.#ui.banner);

    this.#mountLinks(root);

    // Root
    document.body.appendChild(root);
    this.#ui.root = root;

    // Show the appropriate UI based on config + the state of the users settings.
    // e.g. if the user has already set their preferences, we don't need to show the banner.
    this.#showOnMount();

  }

  #mountActions(element) {
      
    const template = element.dataset.consentTpl;
    const actions = this.#config.actions[template];
    const target = element.querySelector('[data-consent-actions]');

    if (! target) {
      console.info(`ℹ️ ${this.#name}: Template Error - "${template}" does not contain a [data-consent-actions] target.`);
      return;
    }

    for (let prop of this.#config.actions[template]._order) {
      
      if (!actions.hasOwnProperty(prop) || !actions[prop] || !this.#actions.includes(prop))
        continue;
  
      let action = document.createElement('button');
  
      if (this.#config.ui.actionClasses[prop]) {

        if (this.#config.ui.actionClasses._all)
          action.classList.add(...this.#config.ui.actionClasses._all.split(' '));

        action.classList.add(...this.#config.ui.actionClasses[prop].split(' '));
        
      }
  
      action.setAttribute('data-consent-action', prop);
      action.textContent = this.#config.content[template].actions[prop];
  
      target.append(action);
    }

  }

  #mountLinks(element) {
      
    const links = this.#config.content.links;
    const targets = element.querySelectorAll('[data-consent-links]');

    if (!targets.length)
      return;
    
    for (let target of targets) {
      
      let linkCount = 0;

      for (let link in links) {

        if (!links.hasOwnProperty(link) || !links[link])
          continue;
    
        if (linkCount > 0) {
          let delimiter = document.createElement('span');
          delimiter.setAttribute('data-consent-link-delimiter', '');
          target.appendChild(delimiter);
        }
    
        let a = document.createElement('a');
        a.href = links[link].url;
        a.textContent = links[link].text;
    
        target.appendChild(a);
        
        linkCount++;

      }
    }
  }

  #mountConsentTypes() {

    const services = this.#servicesByType;

    for (let [typeKey, type] of Object.entries(this.#types)) {

      // @review - this needs to be reworked to handle the new services object.
      // if (! services[typeKey] && ! type.required) 
      //   continue;

      this.#types[typeKey].key = typeKey;

      const tpl = this.#parseTemplate('type', type);

      this.#addAttributes(tpl, { 
        'data-consent-type': typeKey
      });

      const input = tpl.querySelector('input');

      input.checked = this.#settings[typeKey] ? true : false;

      if (type.required) {
        input.disabled = true;
        input.checked = true;
      }

      this.#ui.modal.querySelector('[data-consent-types]').appendChild(tpl);

    }

    this.#ui.settings = this.#ui.modal.querySelectorAll('[data-consent-settings] input');

  }

  /**
   * Parses a template string from the config and replaces placeholders with content.
   * 
   * @param {string} template - The key of the template to parse from the `#config.templates` object.
   * @param {Object} content - The content object to replace placeholders in the template.
   * 
   * @returns {HTMLElement} The parsed template as a DOM node.
   */
  #parseTemplate(template, content = {}) {

    const tpl = document.createElement('template');
    tpl.innerHTML = this.#config.templates[template].trim();

    for (let placeholder in content) {

      if (! content.hasOwnProperty(placeholder) || ['actions', 'required'].includes(placeholder))
        continue;

      if (typeof content[placeholder] !== 'string')
        continue;

      // let pattern = new RegExp(`{{ ${placeholder} }}`, 'g');
      // let sanitized = content[placeholder].replace(/<\/?[^>]+(>|$)/g, '');
      // tpl.innerHTML = tpl.innerHTML.replace(pattern, sanitized);

      tpl.innerHTML = this.#safelyReplaceToken(tpl.innerHTML, placeholder, content[placeholder]);

    }

    this.#addAttributes(tpl.content.firstChild, {
      'data-consent-tpl': template
    });
    
    return tpl.content.firstChild;

  }

  #resolveCookieDomain() {
    if (this.#config.cookieDomain) 
        return this.#config.cookieDomain;

    const hostname = window.location.hostname;

    if (hostname === 'localhost')
      return '';

    const domainParts = hostname.split('.').reverse();

    // Handle TLDs with two segments (e.g., co.uk)
    let rootDomain = domainParts[1] + '.' + domainParts[0];
    if (domainParts.length > 2 && domainParts[1].length <= 3) {
        rootDomain = domainParts[2] + '.' + rootDomain;
    }

    return rootDomain;
  }

  #escapeHTML(unsafeText) {
    return unsafeText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
  }

  #safelyReplaceToken(tpl, token, content) {

    let pattern = new RegExp(`{{ ${token} }}`, 'g');
    let sanitized = content.replace(/<[^>]*>?/gm, '');
    sanitized = this.#escapeHTML(sanitized);

    return tpl.replace(pattern, sanitized);

  }

  get #servicesByType() {

    const services = {};
    
    for (let [serviceKey, service] of Object.entries(this.#config.services)) {

      for (let type of service.types) {
        if (! services[type]) {
          services[type] = [];
        }
        services[type].push(service);
      }
      
    }

    return services;

  }

  #showOnMount() {

    const consentRequired = this.#config.consentRequired;
    const hasStoredSettings = this.#settings._datetime;

    if (hasStoredSettings)
      return;

    if (! consentRequired) {
      this.show('banner');
    } else {
      this.show('modal');
    }

  }

  #getType(key) {
    return this.#types[key] || false;
  }
  
  /* -------------
   * Public API
   * ------------- */

  static manager(config) {

    if (!SimpleConsent.#instance) 
      SimpleConsent.#instance = new SimpleConsent(config);
    
    return SimpleConsent.#instance;

  }

  get config() {
    return this.#config;
  }

  get settings() {

    if (this.#settings) 
      return this.#settings;

    let name = `${this.#config.cookieName}=`;
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for (let i = 0; i <ca.length; i++) {

      let c = ca[i];

      while (c.charAt(0) == ' ')
        c = c.substring(1);
      
      if (c.indexOf(name) == 0) 
        return JSON.parse(c.substring(name.length, c.length));
      
    }
    
    return null;

  }

  accept() {
    this.changeAll();
    this.save();
  }

  changeAll(value = true) {
    this.#ui.settings.forEach((input) => {
      if (!input.disabled)
        input.checked = value;
    });
  }

  deny() {
    this.changeAll(false);
    this.save();
  }

  hide(uiKey = 'modal') {

    if (this.#config.consentRequired && ! this.#settings)
      return;

    this.#ui[uiKey].classList.remove('is-open');

  }

  reset() {
    
    document.cookie = `${this.#config.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${this.#config.cookieDomain}`;
    this.#settings = null;

    this.#loadSettings();
    this.#bindImplicitActions();

    // @bug - this needs adjusted to read the default settings and update the UI accordingly. 
    // It won't always be as simple as just setting the defaults based on the consentModel.
    this.changeAll((this.#config.consentModel === 'opt-in') ? false : true);

    this.#showOnMount();

  }

  #boolToStatus(bool) {
    return bool ? 'granted' : 'denied';
  }

  save(implicit = false) {

    if (typeof this.#config.onUpdateBefore == 'function') 
      this.#config.onUpdateBefore(this.#settings);

    if (! this.#settings)
      this.#settings = {};

    for (let input of this.#ui.settings) {

      if (input.name == 'necessary')
        continue; // we don't need to store the necessary setting - it's always true.
      
      const type = this.#getType(input.name);

      this.#settings[input.name] = input.checked;

      if (type.mapTo && Array.isArray(type.mapTo)) {
        type.mapTo.forEach((type) => {
          this.#settings[type] = input.checked;
          this.#emit(`${type}.${this.#boolToStatus(input.checked)}`);
        });
      }

      let status = input.checked ? 'granted' : 'denied';
      this.#emit(`${input.name}.${this.#boolToStatus(input.checked)}`);

    }

    Object.entries({
      _datetime: new Date().toISOString(),
      _id: crypto.randomUUID(),
      _model: `${this.#config.consentModel}/` + (implicit ? 'implicit' : 'explicit'),
      _geo: this.#_geo,
      _version: this.#_version,
    }).forEach(([key, value]) => {
      this.#settings[key] = value;
    });

    document.cookie = `${this.#config.cookieName}=${JSON.stringify(this.#settings)}; expires=${new Date(Date.now() + (this.#config.cookieExpiryDays * 24 * 60 * 60 * 1000)).toUTCString()}; path=/; domain=${this.#config.cookieDomain}`;

    this.#emit('settings.update', this.#settings);

    if (typeof this.#config.onUpdateAfter == 'function') 
      this.#config.onUpdateAfter(this.#settings);

    setTimeout(() => this.#hideAll(), 150);

  }

  show(uiKey = 'modal') {

    this.#emit(`${uiKey}.show.before`, this.#ui[uiKey]);
    this.#ui[uiKey].classList.add('is-open');
    this.#emit(`${uiKey}.show.after`, this.#ui[uiKey]);

  }

}

document.addEventListener('DOMContentLoaded', () => {

  const script = document.querySelector('script[data-consent-config]');

  if (! script) 
    return;

  let config = window[script.dataset.consentConfig] || {};

  new SimpleConsent(config);

  // Clean up the global namespace
  delete window[script.dataset.consentConfig];
  
});