# SimpleConsent

**Foreword**
A good portion of the SimpleConsent public API is/was inspired by [Klaro](https://duckduckgo.com). Klaro is a great project, and does a LOT more than this library, and offer a premium hosted service. But, Klaro puts a focus on "Services first" instead of "consent types" which is how most CMPs operate. As such, integrating Klaro with GTM's Consent API/Signals isn't as clear as it could be. So, if this library doesn't suit your needs - go check out Klaro.

## Library Principles

1. **Developer/Technical Marketer First**
   This is a "Configuration First" library. Too many CMPs try to offer fancy GUI's and tertiary features like "Cookie Scanners". YAGNI - and if you do - there's likely a better way than a hosted CMP. 
2. **Focused on Tag Managment through Google Tag Manager (GTM)**
   Love it or hate it - GTM is the main TMS used on the web. This library will not try to tailor to every TMS or situation (we won't add inline script blocking).
3. **Localization is Opt-In**
   We want to keep the core library as small as possible. As such, localization will be "DIY" through provided configuration objects.
4. **Easy to Style & Theme**
   Sensible defaults set via CSS variables, overrideable templates if full control is desired.
6. **No Build by Design**
   Value simplictiy, no TypeScript or Elaborate build tooling (aside from basic compression). If this library gets complicated to the point something like TypeScript is necessary - we've lost our way.
