/**!
 * SimpleConsent.js
 * 
 * Most consent/cookie banners are too bloated and try to be "everything to everyone" - SimpleConsent is hyperfocused on ease of use, 
 * particularly with Google Tag Manager's "Consent" APIs.
 * 
 * Author: Derek Cavaliero (@derekcavaliero)
 * Repository: https://github.com/derekcavaliero/SimpleConsent
 * Version: 1.0.beta
 * License: MIT
 */
class SimpleConsent {

  static #instance = null;

  #actions = [
    'acceptAll',
    'acceptSelected',
    'close',
    'denyAll',
    'saveSettings',
    'showSettings',
  ];

  #config = {

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
     * Data Layer Global
     * 
     * The global variable name for the Google Tag Manager (GTM) `dataLayer` object.
     * This only needs to be customized if not using the default global variable.
     */
    dataLayer: window.dataLayer || [],

    /**
     * Force Consent
     * 
     * If set to true, the consent modal will be shown immediately and the user will be required to make a selection before using the website.
     * 
     * @default boolean false
     */
    forceConsent: false,

    /**
     * Implied Consent
     * 
     * If the user performs one of the actions listed in this array, they will be considered to have given consent.
     * Possible values: `''click', 'close', scroll'`
     * 
     * @default boolean false
     */
    impliedConsentOn: false,
    
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
     * @property {Object} l10n.<locale>.text - An object containing localized UI text.
     * 
     * @example
     * {
     *   fr: {
     *     services: [],
     *     text: {},
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
     * Location
     * 
     * The location of the user. This is used to determine the user's country code for regional compliance needs.
     * This value can be set manually or automatically detected based on the user's IP address.
     * 
     * Value should be an ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'DE', etc...), 
     * or a combination of ISO 3166-1 alpha-2 + a regional code (e.g., 'US-CA', 'GB-ENG', 'DE-BY', etc...).
     */
    location: null,

    locationLookup: function() {},

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
    services: [],

    showEmptyTypes: false,

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
                </div>
              </div>
              `,
      modal:  `
              <div class="consent-modal" role="dialog" aria-labelledby=consentModalHeading" aria-describedby="consentModalDescription">
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
                </div>
              </div>
              `,
      type:   `
              <div class="consent-type">
                <div class="consent-switch">
                  <input type="checkbox" role="switch" id="type-{{ key }}" name="{{ key }}">
                  <div class="consent-switch__text">
                    <label for="type-{{ key }}">{{ label }}</label>
                    <div>{{ description }}</div>
                    <div data-consent-type-services></div>
                  </div>
                </div>
              </div>
              `,
    },

    /**
     * Text
     * 
     * This object contains the default text content used in various parts of the consent manager UI.
     * It includes text for the banner, modal, and URLs for privacy-related documents.
     * 
     * @property {Object} text - The text object.
     * @property {Object} text.banner - The text content for the consent banner.
     * @property {string} text.banner.heading - The heading text for the banner.
     * @property {string} text.banner.description - The description text for the banner.
     * @property {Object} text.banner.actions - The action buttons text for the banner.
     * @property {string} text.banner.actions.acceptAll - The text for the "Accept All" button.
     * @property {string} text.banner.actions.denyAll - The text for the "Decline All" button.
     * @property {string} text.banner.actions.showSettings - The text for the "Edit Settings" button.
     * 
     * @property {Object} text.modal - The text content for the consent modal.
     * @property {string} text.modal.heading - The heading text for the modal.
     * @property {string} text.modal.description - The description text for the modal.
     * @property {string} text.modal.toggleAll - The text for the "Enable/Disable All" toggle.
     * @property {Object} text.modal.actions - The action buttons text for the modal.
     * @property {string} text.modal.actions.acceptAll - The text for the "Accept All" button.
     * @property {string} text.modal.actions.acceptSelected - The text for the "Accept Selected" button.
     * @property {string} text.modal.actions.denyAll - The text for the "Decline All" button.
     * @property {string} text.modal.actions.save - The text for the "Save" button.
     * 
     * @property {Object} text.urls - The URLs for privacy-related documents.
     * @property {string} text.urls.privacyPolicy - The URL for the privacy policy.
     * @property {string} text.urls.termsOfService - The URL for the terms of service.
     * @property {string} text.urls.cookiePolicy - The URL for the cookie policy.
     */
    text: {
      banner: {
        heading: 'Privacy Notice',
        description: 'This website uses cookies (or other browser storage) to deliver our services and/or analyze our traffic. Information is also shared about your use of our site with our advertising partners.',
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
      urls: {
        privacyPolicy: '#/privacy-policy',
        termsOfService: '#/terms-of-service',
        cookiePolicy: '#/cookie-policy',
      },
    },

    /**
     * Theme
     * 
     * This object contains the theme settings for the consent manager UI.
     * It allows customization of action button classes, banner placement, and color scheme.
     * 
     * @property {Object} theme - The theme settings object.
     * @property {string|null} theme.actionClasses - CSS classes to be applied to action buttons. If `null`, default classes are used.
     * @property {Object} theme.placement - The placement settings for the banner.
     * @property {Array<string>} theme.placement.banner - An array specifying the position of the banner. Possible values include 'top', 'bottom', 'left', 'right'.
     * @property {string} theme.scheme - The color scheme for the UI. Possible values are 'light' or 'dark'.
     */
    theme: {
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
      scheme: 'light',
    },

  };

  /**
   * Settings
   * 
   * Holds the consent settings for the consent manager.
   * It is initialized to `null` and will be populated with the user's consent preferences once known.
   * 
   * @private
   * @type {Object|null}
   */
  #settings = null;

  #types = [
    {
      key: 'necessary',
      label: 'Strictly Necessary',
      description: 'These cookies/services are required for our website(s) to function and cannot be disabled.',
      required: true,
    },
    {
      key: 'analytics_storage',
      label: 'Analytics Storage',
      description: 'Enables storage, such as cookies and/or local/session storage related to analytics, for example, visit duration, and pages viewed.',
    },
    {
      key: 'ad_storage',
      label: 'Advertising Storage',
      description: 'Enables storage, such as cookies and/or local/session storage related to advertising.',
    },
    {
      key: 'ad_personalization',
      label: 'Advertising Personalization',
      description: 'Set consent for personalized advertising through the use of 3rd party cookies set by our partners.',
    },
    {
      key: 'ad_user_data',
      label: 'Ad User Data',
      description: 'Sets consent for sending user data to our advertising partners for online advertising purposes.',
    },
    {
      key: 'functionality_storage',
      label: 'Functionality Storage',
      description: 'Enables storage that supports the functionality of the website or app e.g. language settings.',
    },
    {
      key: 'personalization_storage',
      label: 'Personalization Storage',
      description: 'Enables storage related to personalization e.g. video recommendations, and account preferences.',
    },
    {
      key: 'security_storage',
      label: 'Security Storage',
      description: 'Enables services/storage related to security such as authentication functionality, fraud prevention, and other user protection.',
    },
  ];

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

    console.time('SimpleConsent');

    if (SimpleConsent.#instance) 
      return SimpleConsent.#instance;

    this.#config = this.#deepMerge(this.#config, config);
    this.#config.cookieDomain = this.#resolveCookieDomain();

    this.#settings = this.getStoredSettings();

    SimpleConsent.#instance = this;

    this.#maybeLocalize();
    this.#mount();
    this.#bindConsentActions();
    this.#bindCustomEvents();

    if (typeof this.#config.onInit == 'function') 
      this.#config.onInit(this.#settings);

    console.timeEnd('SimpleConsent');

  }

  static manager(config) {

    if (!SimpleConsent.#instance) 
      SimpleConsent.#instance = new SimpleConsent(config);
    
    return SimpleConsent.#instance;

  }

  #addAttributes(element, attributes) {
    for (const key in attributes) {
      if (! attributes.hasOwnProperty(key)) continue;
      element.setAttribute(key, attributes[key]);
    }
  }

  #bindConsentActions() {

    document.addEventListener('click', (e) => {

      if (e.target.matches('[data-consent-action]')) {
        
        e.preventDefault();

        this[{
          showSettings: 'show',
          acceptAll: 'accept',
          acceptSelected: 'save',
          denyAll: 'deny',
          saveSettings: 'save',
        }[e.target.dataset.consentAction]]();
        
      }        

      if (e.target.matches('[data-consent-close]')) {
        this.#close(e.target);
      }

    });

   this.#bindImplicitConsentBehavior();

  }

  #bindCustomEvents() {

    document.addEventListener('consent:modal.show.before', (e) => {

      const actions = e.detail.querySelectorAll('[data-consent-action]');

      if (! this.#settings) {

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

    document.addEventListener('consent:modal.close.before', (e) => {

      if (! this.#settings)
        this.show('banner');

    });

  }

  #bindImplicitConsentBehavior() {

    // We only want to bind the listeners if the user has not already set their preferences
    // and if the impliedConsentOn array is not empty/falsy.
    if (! this.#config.impliedConsentOn || this.#settings)
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

    if (this.#config.impliedConsentOn.includes('scroll'))
      document.addEventListener('scroll', debouncedAcceptOnScroll);

    const acceptOnBodyClick = (e) => {
      
      if (e.target.closest('[data-consent-tpl]')) 
        return;

      consentToAll();

    }

    if (this.#config.impliedConsentOn.includes('click'))
      document.addEventListener('mousedown', acceptOnBodyClick);


    const acceptOnClose = (e) => {
      
      if (! e.target.hasAttribute('data-consent-close')) 
        return;

      consentToAll();

    }

    if (this.#config.impliedConsentOn.includes('close'))
      document.addEventListener('click', acceptOnClose);

    const removeEventListeners = () => {
      document.removeEventListener('mousedown', acceptOnBodyClick);
      document.removeEventListener('click', acceptOnClose);
      document.removeEventListener('scroll', acceptOnScroll);
    }

  }

  #close(target) {

    if (this.#config.forceConsent && ! this.#settings)
      return;

    const element = target.closest('[data-consent-tpl]');

    if (! element)
      return;

    this.#emit(`consent:${element.dataset.consentTpl}.close.before`, element);

    element.classList.remove('is-open');

    this.#emit(`consent:${element.dataset.consentTpl}.close.after`, element);

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

  #emit(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }

  #pushConsentUpdate(event) {

    this.#config.dataLayer.push({
      event: 'consent.update',
      consent: {
        settings: this.#settings,
      },
    });

  }

  #getServicesGroupedByType() {

    const services = {};

    for (let service of this.#config.services) {
      for (let type of service.types) {
        if (! services[type]) {
          services[type] = [];
        }
        services[type].push(service);
      }
    }

    return services;

  }

  #hideAll() {
    this.hide('modal');
    this.hide('banner');
  }

  #maybeLocalize() {
      
      if (! this.#config.l10n)
        return;
  
      if (! this.#config.locale) {
        const lang = document.documentElement.lang;
        this.#config.locale = lang || null;
      }

      if (! this.#config.locale) {
        console.info('SimpleConsent: No locale set or detected. Using defaults.');
        return;
      }

      this.#config.locale = this.#config.locale.toLowerCase();

      const l10n = this.#config.l10n[this.#config.locale];
  
      if (! l10n) {
        console.info(`SimpleConsent: No localization found for "${this.#config.locale}". Using defaults.`);
        return;
      }
  
      if (l10n.text) 
        this.#config.text = this.#deepMerge(this.#config.text, l10n.text);
  
      // if (l10n.services) {
      //   this.#config.services = l10n.services;
      // }
  
      // if (l10n.types) {
      //   this.#types = l10n.types;
  }

  #mount() {

    const root = document.createElement('div');
    root.id = this.#config.theme.rootId;
    root.classList.add(...this.#config.theme.rootClass.split(' ')); // @todo: Allow for custom root element classes
    
    // Modal
    this.#ui.modal = this.#parseTemplate('modal', this.#config.text.modal);

    this.#mountActions(this.#ui.modal);
    this.#mountConsentTypes();

    root.appendChild(this.#ui.modal);

    // Banner
    this.#ui.banner = this.#parseTemplate('banner', this.#config.text.banner);
    this.#mountActions(this.#ui.banner);

    if (! this.#settings && ! this.#config.forceConsent)
      this.#ui.banner.classList.add('is-open');
    
    this.#addAttributes(this.#ui.banner, { 
      'data-consent-placement': this.#config.theme.placement.banner.join(','),
    });

    root.appendChild(this.#ui.banner);

    // Root
    document.body.appendChild(root);
    this.#ui.root = root;

    if (! this.#settings && this.#config.forceConsent)
      this.show();

  }

  #mountActions(element) {
      
    const template = element.dataset.consentTpl;
    const actions = this.#config.actions[template];

    const target = element.querySelector('[data-consent-actions]');

    if (! target) {
      console.warn(`SimpleConsent Template Error: "${template}" does not contain a [data-consent-actions] target.`);
      return;
    }

    for (let prop of this.#config.actions[template]._order) {
      if (!actions.hasOwnProperty(prop) || !actions[prop] || !this.#actions.includes(prop)) {
        continue;
      }
  
      let action = document.createElement('button');
  
      if (this.#config.theme.actionClasses[prop]) {
        if (this.#config.theme.actionClasses._all) {
          action.classList.add(...this.#config.theme.actionClasses._all.split(' '));
        }
        action.classList.add(...this.#config.theme.actionClasses[prop].split(' '));
      }
  
      action.setAttribute('data-consent-action', prop);
      action.textContent = this.#config.text[template].actions[prop];
  
      target.append(action);
    }

  }

  #mountConsentTypes() {

    const services = this.#getServicesGroupedByType();

    for (let type of this.#types) {

      if (! services[type.key] && ! type.required) 
        continue;

      const tpl = this.#parseTemplate('type', type);
      const input = tpl.querySelector('input');
      this.#addAttributes(tpl, { 'data-consent-type': type.key });

      if (this.#settings && this.#settings[type.key])
        input.checked = true;

      if (type.required) {
        input.disabled = true;
        input.checked = true;
      }

      this.#ui.modal.querySelector('[data-consent-types]').appendChild(tpl);

    }

    this.#ui.settings = this.#ui.modal.querySelectorAll('[data-consent-settings] input');

  }

  #parseTemplate(template, content = {}) {

    const tpl = document.createElement('template');
    tpl.innerHTML = this.#config.templates[template].trim();

    for (let placeholder in content) {

      if (! content.hasOwnProperty(placeholder) || ['actions', 'required'].includes(placeholder))
        continue;

      let pattern = new RegExp(`{{ ${placeholder} }}`, 'g');

      let sanitized = content[placeholder].replace(/<\/?[^>]+(>|$)/g, '');

      tpl.innerHTML = tpl.innerHTML.replace(pattern, sanitized);

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
    const domainParts = hostname.split('.').reverse();

    // Handle TLDs with two segments (e.g., co.uk)
    let rootDomain = domainParts[1] + '.' + domainParts[0];
    if (domainParts.length > 2 && domainParts[1].length <= 3) {
        rootDomain = domainParts[2] + '.' + rootDomain;
    }

    return rootDomain;
  }

  save(implicit = false) {

    if (typeof this.#config.onUpdateBefore == 'function') 
      this.#config.onUpdateBefore(this.#settings);

    for (let input of this.#ui.settings) {
      
      if (! this.#settings)
        this.#settings = {};
      
      this.#settings[input.name] = input.checked;

    }

    this.#settings._datetime = new Date().toISOString();
    this.#settings._location = this.#config.location;
    this.#settings._id = crypto.randomUUID();
    this.#settings._mode = implicit ? 'implicit' : 'explicit';

    document.cookie = `${this.#config.cookieName}=${JSON.stringify(this.#settings)}; expires=${new Date(Date.now() + (this.#config.cookieExpiryDays * 24 * 60 * 60 * 1000)).toUTCString()}; path=/; domain=${this.#config.cookieDomain}`;

    if (typeof this.#config.onUpdateAfter == 'function') 
      this.#config.onUpdateAfter(this.#settings);

    setTimeout(() => this.#hideAll(), 200);

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

  forget() {
    document.cookie = `${this.#config.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${this.#config.cookieDomain}`;
  }

  getStoredSettings() {

    let name = `${this.#config.cookieName}=`;
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return JSON.parse(c.substring(name.length, c.length));
      }
    }
    
    return null;

  }

  hide(uiKey = 'modal') {

    if (this.#config.forceConsent && ! this.#settings)
      return;

    this.#ui[uiKey].classList.remove('is-open');

  }

  show(uiKey = 'modal') {

    this.#emit(`consent:${uiKey}.show.before`, this.#ui[uiKey]);
    this.#ui[uiKey].classList.add('is-open');
    this.#emit(`consent:${uiKey}.show.after`, this.#ui[uiKey]);

  }

}

document.addEventListener('DOMContentLoaded', () => {

  const script = document.querySelector('script[data-consent-config]');

  if (! script) 
    return;

  const config = window[script.dataset.consentConfig] || {};
  new SimpleConsent(config);

  // Clean up the global namespace
  delete window[script.dataset.consentConfig];
  
});