window._configs.l10n = {
  content: {
    banner: {
      heading: 'Config: l10n'
    }
  },
  gtm: _configs._.gtm,
  l10n: {
    de: {
      content: {
        banner: {
          heading: 'Datenschutzhinweis',
          description: 'Diese Website verwendet Cookies (oder andere Browser-Speichermöglichkeiten), um unsere Dienste bereitzustellen und/oder die Nutzung unserer Website zu analysieren. Diese Informationen werden auch durch die Verwendung von Tracking-Skripten/Pixeln mit Werbepartnern geteilt.',
          actions: {
            acceptAll: 'Alle akzeptieren',
            denyAll: 'Alle ablehnen',
            showSettings: 'Einstellungen bearbeiten'
          }
        },
        notices: {
          required: {
            badge: 'Immer aktiviert'
          },
          gpc: {
            badge: 'Durch GPC deaktiviert',
            heading: 'Globale Datenschutzkontrolle (GPC)',
            description: 'Einige Dienste wurden deaktiviert, um Ihr Opt-out-Signal zu respektieren.'
          }
        },
        modal: {
          heading: 'Ihre Datenschutzoptionen',
          description: 'Diese Website verwendet Dienste, die Speicherfunktionen in Ihrem Browser (über Cookies oder andere Browser-Speicherfunktionen) nutzen, um Informationen zu sammeln. Sie können bestimmte Arten der Datenerfassung mit den folgenden Steuerungsmöglichkeiten genehmigen oder ablehnen.',
          toggleAll: 'Alle aktivieren/deaktivieren',
          actions: {
            acceptAll: 'Alle akzeptieren',
            acceptSelected: 'Ausgewählte akzeptieren',
            denyAll: 'Alle ablehnen',
            saveSettings: 'Einstellungen speichern'
          }
        },
        links: {
          privacyPolicy: {
            text: 'Datenschutzrichtlinie',
            url: '#/privacy-policy'
          },
          termsOfService: null,
          cookiePolicy: {
            text: 'Cookie-Richtlinie',
            url: '#/cookie-policy'
          }
        }
      }
    },
    es: {
      content: {
        banner: {
          heading: 'Aviso de privacidad',
          description: 'Este sitio web utiliza cookies (u otro almacenamiento del navegador) para ofrecer nuestros servicios y/o analizar el uso de nuestro sitio web. Esta información también se comparte con socios publicitarios mediante el uso de scripts/píxeles de seguimiento.',
          actions: {
            acceptAll: 'Aceptar todo',
            denyAll: 'Rechazar todo',
            showSettings: 'Editar preferencias'
          }
        },
        notices: {
          required: {
            badge: 'Siempre activado'
          },
          gpc: {
            badge: 'Desactivado por GPC',
            heading: 'Control de Privacidad Global (GPC)',
            description: 'Algunos servicios han sido desactivados para respetar su señal de exclusión.'
          }
        },
        modal: {
          heading: 'Sus opciones de privacidad',
          description: 'Este sitio web utiliza servicios que emplean funciones de almacenamiento en su navegador (a través de cookies u otras funcionalidades de almacenamiento del navegador) para recopilar información. Puede elegir conceder o denegar ciertos tipos de recopilación de datos utilizando los controles a continuación.',
          toggleAll: 'Activar/Desactivar todo',
          actions: {
            acceptAll: 'Aceptar todo',
            acceptSelected: 'Aceptar seleccionados',
            denyAll: 'Rechazar todo',
            saveSettings: 'Guardar preferencias'
          }
        },
        links: {
          privacyPolicy: {
            text: 'Política de privacidad',
            url: '#/privacy-policy'
          },
          termsOfService: null,
          cookiePolicy: {
            text: 'Política de cookies',
            url: '#/cookie-policy'
          }
        }
      }
    },
    fr: {
      content: {
        banner: {
          heading: '🍪 & Confidentialité',
          description: 'Nous utilisons des cookies pour offrir la meilleure expérience. En cliquant sur "Accepter", vous acceptez l\'utilisation des cookies.',
          actions: {
            showSettings: 'Préférences',
            acceptAll: 'Accepter',
            denyAll: 'Refuser',
          },
        },
        modal: {
          heading: 'Préférences de confidentialité',
          description: 'Ceci est un aperçu des cookies que nous utilisons. Vous pouvez choisir les cookies que vous souhaitez accepter.',
          actions: {
            acceptAll: 'Tout accepter',
            acceptSelected: 'Accepter la sélection',
            saveSettings: 'Sauvegarder',
            denyAll: 'Tout refuser',
          },
        },
        links: {
          privacyPolicy: {
            text: 'Politique de confidentialité',
          },
          cookiePolicy: {
            text: 'Politique de cookies',
          },
        }
      },
      services: {},
      types: {
        necessary: {
          name: 'Nécessaire',
          description: 'Les cookies nécessaires permettent des fonctionnalités de base telles que la navigation de page et l\'accès aux zones sécurisées du site Web. Le site Web ne peut pas fonctionner correctement sans ces cookies.',
        },
        analytics_storage: {
          name: 'Analyse & Performance',
          description: 'Active le stockage et les services qui sont utilisés pour mesurer les visites, les sessions et certains types d\'activité en page (comme les clics sur les boutons).',
        },
        advertising: {
          name: 'Publicité Ciblage & Mesure',
          description: 'Active les services et services à toutes fins publicitaires. Cela inclut, la personnalisation des annonces, les cookies publicitaires, les données utilisateur partagées avec nos partenaires publicitaires.',
        },
        personalization_storage: {
          name: 'Stockage de personnalisation',
          description: 'Active le stockage et les services liés à la personnalisation, par exemple les recommandations vidéo et les préférences de compte.',
        },
        functionality_storage: {
          name: 'Stockage fonctionnel',
          description: 'Active le stockage et les services qui prennent en charge la fonctionnalité du site Web ou de l\'application (par exemple, les paramètres de langue).',
        },
        security_storage: {
          name: 'Stockage de sécurité',
          description: 'Active le stockage et les services liés à la sécurité tels que la fonctionnalité d\'authentification, la prévention de la fraude et d\'autres protections des utilisateurs.'
        }
      },
    }
  },
  services: _configs._.services,
  types: _configs._.types,
  ui: {
    placement: _configs._.ui.placement,
  }
};