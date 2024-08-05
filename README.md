# SimpleConsent

<img src="docs/images/ui-display.png" width=830 style="margin: 0 auto; display: block;" />

### ⚠️ Legal Disclaimer! ⚠️

**The maintainers of this library are not data-privacy lawyers, and this library's defaults and/or example configurations are not a substitute for proper legal counsel**.

As such, installing this tool on your website does not "magically" make you compliant with regional data collection laws - it must be configured properly with Google Tag Manager to work correctly.

**It cannot be understated to always consult with a data privacy professional to ensure your consent banner configuration is compliant with regional data collection laws.**

---

#### **⚠️ This project is in active development ⚠️** 
A proper release will be tagged when ready. There are likely bugs and missing features at this point in time.

#### Foreword

This project is/was inspired by [Klaro](https://github.com/klaro-org/klaro-js). Klaro is another great open-source consent project, and does a LOT more than this library - especially around "autoblocking" behavior. However, Klaro takes a "services first" approach to its configuration instead of "consent types". This makes Klaro a bit harder to use with GTM and more specifically its consent signal APIs that are "type/behavior" focused. So TL;DR - if this library doesn't fit your needs, check out Klaro - it very well could.

### Why should I use this?

SimpleConsent is a tool to help technical marketers and/or developers comply with the data-collection laws using a lightweight alternative to expensive 3rd party services like OneTrust or CookieBot. 

#### ⚡️ Lightweight (< 10KB gzipped)
[![JS GZip Size](https://img.badgesize.io/derekcavaliero/simpleconsent/main/dist/SimpleConsent.min.js?compression=gzip&label=JS%20GZip%20size)](https://github.com/derekcavaliero/simpleconsent/blob/main/dist/SimpleConsent.min.js)
[![CSS GZip Size](https://img.badgesize.io/derekcavaliero/simpleconsent/main/dist/SimpleConsent.min.css?compression=gzip&label=CSS%20GZip%20size)](https://github.com/derekcavaliero/simpleconsent/blob/main/dist/SimpleConsent.min.css)

Compare this to bloated CMPs like OneTrust or CookieBot which can be 100KB+ in size AFTER GZip compression.

#### ⚙️ Configuration First
If you... 
- Can write basic JSON structures, you can configure it 
- Can write some basic CSS, you can style it
- Use a front-end component library (e.g. Bootstrap or similar), you can edit the underlying UI templates
- Have access to Cloudflare Workers, or Server-Side GTM, (or similar tech) you can create geolocation routing

#### 🏷️ Google Tag Manager (GTM) Focused
Designed to work with GTM's consent signal APIs and provide better ergonomics for GTM users.

### SimpleConsent might be for you if...

1. ✅ You use Google Tag Manager (GTM) for managing your tags
2. ✅ You aren't afraid to write some basic JS/JSON and CSS
3. ✅ You're fed up with bloated CMPs like OneTrust or CookieBot (etc...)

### SimpleConsent isn't for you if...

1. ❌ You don't use a TMS like Google Tag Manager for controlling tag firing
2. ❌ You need full-fledged "autoblocking" behavior
3. ❌ You require IAB TCF v2.X compliance/compaitibility (for now - this may change in the future)
4. ❌ You require support for dead browsers like Internet Explorer (we'll never do this don't ask)
5. ❌ You need bundled "baked in" (cookie pun intended) geolocation routing or a built-in cookie scanner.

---

### Getting Started

#### Installation

In order to use SimpleConsent, 2 things are required. If you have used Klaro before, the process is identical.

1. **Stylesheet** (SimpleConsent.min.css) (if using the default theme)
2. **A configuration file/object** (consentConfig.js) that is loaded by your site. You may also have your configuration bundled into other JS files if you prefer - but for the sake of maintainability, it is recommended to keep it separate.
3. **Main Library** (SimpleConsent.min.js) with a `data-consent-config` attribute that points to the global configuration object that will be loaded. 

You can do this by adding the following code to your website's `<head>`.

```html
<link href="https://cdn.jsdelivr.net/gh/derekcavaliero/simpleconsent@latest/dist/SimpleConsent.min.css" rel="stylesheet">
<script defer src="/path/to/consentConfig.js"></script>
<script defer
  data-consent-config="consentConfig"
  src="https://cdn.jsdelivr.net/gh/derekcavaliero/simpleconsent@latest/dist/SimpleConsent.min.js"></script>
```

#### Configuration

Inside the `consentConfig.js` (or whatever you chose for a filename) file, you will need to define a global object called `consentConfig` (or whatever you chose for global object) that will be used to configure the consent manager behavior. This configuration object is merged with the default configuration object provided by the library allowing you to override any default settings. 

```javascript
/** 
 * ℹ️ SimpleConsent will clean up the global scope after initialization, 
 * As such, this object will not be available to other scripts on your page.
 */
window.consentConfig = window.consentConfig || {
  consentModel: 'opt-out',
  content: {
    banner: {
      title: '🍪 Notice',
      description: 'This website uses cookies (or other browser storage) to deliver our services and/or analyze our website usage.',
    }
  }
}
```

The above example will display a banner with the title "🍪 Notice" and use an "opt-out" consent model (meaning the default consent types are all enabled until the user disables them).

You can view the source of the default `#config` object in the SimpleConsent class. Each configration object is annotated with JSDoc comments to help you understand what each property does.

### Defining Consent Types

Consent types are the individual categories of data collection that your website performs. These can be anything from "Analytics" to "Marketing" or "Functional" data collection. Each consent type can have the following properties:

- **`name`** (string) - The title of the consent type (what is show to the end user)
- **`description`** (string) - A description of the consent type usually a brief explanation of what services/storage is used for the consent type.
- **`required`** (boolean) - Whether or not the consent type is required for the website to function properly. Note, the library will automatically add a "necessary" type - you do not need to define one explicitly.
- **`gpc`** (boolean) - If set to `true`, the consent type will be automatically disabled if a `navigator.globalPrivacyControl` is detected. This is useful for respecting the user's browser settings.\
- **`mapTo`** (array) - If you wish to map a particular consent type to other consent types (useful for Google's Consent Mode). This is an array of strings that represent the names of other consent types. (e.g. `ad_user_data`, `ad_storage`, `ad_personalization` etc...).

```json
"types": {
  "analytics_storage": {
    "name": "Analytics & Performance",
    "description": "Enables storage and services that are used to measure visits, sessions, and certain types of on-page activity (such as clicks on buttons).",
    "gpc": true,
  },
  "advertising": {
    "name": "Advertising Targeting & Measurement",
    "description": "Enables services and services for all advertising purposes. This includes, ad personalization, advertising cookies, user data shared with our advertising partners.",
    "mapTo" : ["ad_storage", "ad_personalization", "ad_user_data"],
    "gpc": true,
  },
  "personalization_storage": {
    "name": "Personalization Storage",
    "description": "Enables storage and services related to personalization e.g. video recommendations, and account preferences.",
  },
  "functionality_storage": {
    "name": "Functional Storage",
    "description": "Enables storage and services that supports the functionality of the website or app (e.g. language settings).",
  },
  "security_storage": {
    "name": "Security Storage",
    "description": "Enables storage and services related to security such as authentication functionality, fraud prevention, and other user protection.",
    "required": true,
  }
}
```

Each consent type is defined with its own "key" (e.g. `analytics_storage`, `advertising`, etc...). These keys are used to reference the consent types in the configuration object. These are also the keys that are used when pushing `dataLayer` events to Google Tag Manager, and also the stored consent object in cookies and/or localStorage.

#### Sample GTM Container Configuration

@todo

Proper configuration of this tool with Google Tag Manager does require some triggers and consent default/update tags to be configured. As a result, a sample GTM container configuration is provided in the `gtm` directory of this repository. This configuration assumes the use of the 7 main consent types provided by the library. If you have customized your consent types, you will need to create triggers to match the consent types you have defined.

#### Contributing

If you would like to contribute to this project, please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.
