# SimpleConsent (⚠️ IN ACTIVE DEVELOPMENT)

**A proper release will be tagged when ready. There are likely bugs and missing features at this point in time.**

SimpleConsent is an ultra-lightweight, configuration-first, consent management library for web sites/applications.

- **⚡️ Lightweight** - &lt; 10KB minified and gzipped (JS + CSS) - compared to 50KB+ for most CMPs.
- **⚙️ Configuration First** - If you can write basic JSON objects, you can configure SimpleConsent.
- **🏷️ Google Tag Manager (GTM) Focused** - Designed to work with GTM's consent signal APIs.

**Foreword**

A large portion of this project is/was inspired by [Klaro](https://klaro.org). Klaro is a great project, and does a LOT more than this library, and offer a premium hosted service. But, Klaro takes a "Services first" approach to its configuration instead of "consent types" - this makes Klaro a little hard to use with tools like GTM and more specifically its consent signal APIs are "type/behavior" focused.

**⚠️ LEGAL DISCLAIMER!** 

**The maintainers of this library are not data-privacy lawyers, and this library's defaults and/or example configurations are not a substitute for proper legal counsel**. 

This library is a tool to help technical marketers and companies comply with the law using a lightweight alternative to something like OneTrust or CookieBot. As such, installing this tool on your website does not "magically" make you compliant with regional data collection laws - it must be configured properly with Google Tag Manager. 

### Library Principles

#### Developer/Technical Marketer First
This is a "Configuration First" library. Too many CMPs try to offer fancy GUI's and tertiary features like "Cookie Scanners". YAGNI - and if you do - there's likely a better way than a hosted CMP. 

#### Focused on Tag Managment through Google Tag Manager (GTM)
Love it or hate it - GTM is the main TMS used on the web - used by millions of websites. This library will not try to tailor to every TMS or situation.

#### Localization is Opt-In
Every configuration/implementation will not require robust multi-language support. We want to keep the core library as small as possible. As such, localization will be "DIY" through provided configuration objects. With the abundance of AI tools like LLMs - localizing a configuration object should be easy to do.

#### Easy to Style & Theme
Sensible defaults set via CSS variables, overrideable templates if full control is desired.

#### Minimal Build Tooling
Value simplicity, no TypeScript (for now) or elaborate build tooling (aside from basic minification/compression). 

---

### Getting Started

#### Installation

In order to use SimpleConsent, 2 things are required. If you have used Klaro before, the process is identical.

1. **Stylesheet** (SimpleConsent.min.css) (if using the default theme)
2. **A configuration file/object** (consentConfig.js) that is loaded by your site. You may also have your configuration bundled into other JS files if you prefer - but for the sake of maintainability, it is recommended to keep it separate.
3. **Main Library** (SimpleConsent.min.js) with a `data-consent-config` attribute that points to the global configuration object that will be loaded. 

You can do this by adding the following code to your website's `<head>`.

```html
<link href="/path/to/SimpleConsent.min.css" rel="stylesheet">
<script defer src="/path/to/consentConfig.js"></script>
<script defer
  data-consent-config="consentConfig"
  src="/path/to/SimpleConsent.min.js"></script>
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

#### Sample GTM Container Configuration

@todo

Proper configuration of this tool with Google Tag Manager does require some triggers and consent default/update tags to be configured. As a result, a sample GTM container configuration is provided in the `gtm` directory of this repository. This configuration assumes the use of the 7 main consent types provided by the library. If you have customized your consent types, you will need to create triggers to match the consent types you have defined.

#### Contributing

@todo

If you would like to contribute to this project, please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.