window.consentConfig = {
  // forceConsent: true,
  impliedConsentOn: ['click', 'scroll'],
  onInit: () => {
    // SimpleConsent.getManager().show();
  },
  services: [
    {
      name: 'Google Analytics',
      description: '',
      types: ['analytics_storage', 'ad_personalization'],
      cookies: [
        {
          name: '_ga',
          purpose: 'Client (browser) ID used to distinguish users.',
          duration: '2 years or less',
        },
        {
          name: '_ga_XXXXXXXXX',
          pattern: /_ga_[A-Z\d]+/,
          purpose: 'Timestamp of when a session began, # of sessions for the user, and other bits of entrophy.',
          duration: '30 minutes - 7 hours',
        },
      ],
    },
    {
      name: 'Google Ads',
      description: '',
      types: ['ad_storage', 'ad_personalization', 'ad_user_data'],
      cookies: [
        {
          name: '_gcl_au',
          purpose: '',
          duration: '90 days or less',
        },
        {
          name: '_gcl_aw',
          purpose: 'Stores click ID from the last ad a user clicked on from a Google ad network.',
          duration: '90 days or less',
        },
      ],
    },
    {
      name: 'Meta Ads Pixel',
      description: '',
      types: ['ad_storage', 'ad_user_data'],
      cookies: [
        {
          name: '_fbc',
          purpose: 'Stores click ID from the last ad a user clicked on a Meta product (Facebook, Instagram etc...).',
          duration: '90 days or less',
        },
        {
          name: '_fbp',
          purpose: 'Client (browser) ID used to distinguish users.',
          duration: '90 days or less',
        },
      ],
    }
  ],
  text: {
    banner: {
      heading: 'This website uses cookies',
      description: 'We use cookies to provide the best experience. By clicking "Accept", you agree to the use of cookies.',
    },
    buttons: {
      acceptAll: 'Accept All',
      denyAll: 'Deny All',
    },
    modal: {
      heading: 'Privacy Preferences',
      // description: 'This is an overview of the cookies we use. You can choose which cookies you want to accept.',
    },
  },
  theme: {
    placement: {
      // banner: ['bottom', 'left'],
    },
    scheme: 'light',
  },
};