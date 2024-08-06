window._configs.ccpa = {
  actions: {
    banner: {
      _order: ['showSettings', 'acceptAll', 'denyAll'],
    }
  },
  consentModel: 'opt-out',
  consentOn: ['click', 'scroll', 'banner.close'],
  content: {
    banner: {
      actions: {
        acceptAll: 'Accept',
        denyAll: 'Deny',
        showSettings: 'Do Not Sell My Personal Data',
      },
      heading: 'Config: CCPA',
    },
    modal: {
      actions: {
        denyAll: 'Do Not Sell My Personal Data',
      },
    }
  },
  gtm: _configs._.gtm,
  services: _configs._.services,
  types: _configs._.types,
  ui: {
    actionClasses: {
      _all: 'btn btn-sm',
      acceptAll: 'btn btn-primary',
      acceptSelected: 'btn btn-primary',
      denyAll: 'btn btn-secondary',
      showSettings: 'btn btn-link px-0',
    },
  },
};