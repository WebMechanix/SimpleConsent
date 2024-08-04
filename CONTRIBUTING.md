# Contributing to SimpleConsent

### Library Principles

#### Developer/Technical Marketer First
This is a "Configuration First" library. Therefore, the naming and structure of the configuration object should be intuitive.

#### Google Tag Manager (GTM) First
Love it or hate it - GTM is the main TMS used on the web - used by millions of websites. This library will not try to tailor to every TMS or situation. The library should offer flexibility through callbacks to allow for non-GTM implementations (if possible).

#### "Bring Your Own" Localization & Geolocation
Every configuration/implementation will not require robust multi-language support. We want to keep the core library as small as possible. As such, localization will be "DIY" through provided configuration objects. With the abundance of AI tools like LLMs - localizing a configuration object should be easy to do.

#### Vanilla CSS
Use of CSS variables, and low specificity selectors should be used to keep the CSS as simple and "flat" as possible. 

#### Minimal Build Tooling
Value simplicity, no TypeScript (for now) or elaborate build tooling (aside from basic minification/compression). 