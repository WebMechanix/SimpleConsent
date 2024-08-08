describe('UI Behavior', () => {

  beforeEach(() => {
    cy.task('clearCache')
    cy.visit(`http://localhost:8080/testbench?json_console=false&_cachebuster=${Date.now()}`)
    cy.get('[data-consent-tpl="root"]').should('exist')
    // cy.wait(200)
  })

  after(() => {
    cy.clearCookies()
  })

  afterEach(() => {
    cy.wait(800)
  })

  it('Banner is visible on load', () => {
    cy.get('[data-consent-tpl="banner"]').should('be.visible')
  })

  it('Modal is hidden on load', () => {
    cy.get('[data-consent-tpl="modal"]').should('not.be.visible')
  })

  it('Banner is hidden after close', () => {
    
    cy.get('[data-consent-tpl="banner"]').as('banner')
      .find('[data-consent-close]').click()

    cy.get('@banner').should('not.be.visible')
  
  })

  it('click:showSettings/close : Banner/Modal Visibility', () => {
    
    cy.get('[data-consent-tpl="banner"]').as('banner')
      .find('[data-consent-action="showSettings"]').click()
    
    cy.get('@banner').should('not.be.visible')
    cy.get('[data-consent-tpl="modal"]').as('modal').should('be.visible')

    cy.get('@modal').find('button[data-consent-close]').click()
    cy.get('@modal').should('not.be.visible')
    cy.get('@banner').should('be.visible')

  })

  it('Consent preferences are saved after acceptAll', () => {

    cy.get('[data-consent-tpl="banner"]')
      .find('[data-consent-action="acceptAll"]').click()

    cy.getCookie('simple_consent').should('exist')

  })

  it('GTM Tags/Triggers wait for opt-in', () => {

    cy.get('[data-consent-tpl="banner"]')
      .find('[data-consent-action="acceptAll"]').click()

    cy.getCookie('simple_consent').should('exist')
      .then((cookie) => {
      
        const settings = JSON.parse(decodeURIComponent(cookie.value))
        
        for (let setting in settings) {
        
          if (! settings.hasOwnProperty(setting) || setting == 'necessary' || setting.startsWith('_')) 
            continue
    
          let assert = settings[setting] ? 'exist' : 'not.exist'
          cy.getCookie(setting).should(assert)
        
        }

      })

  })

  it('Consent preferences are saved after acceptSelected', () => {
    
    cy.get('[data-consent-tpl="banner"]')
      .find('[data-consent-action="showSettings"]').click()
    
    cy.get('[data-consent-tpl="modal"]').as('modal')
      .find('input[name="advertising"]').check()
    
    cy.get('@modal')
      .find('[data-consent-action="acceptSelected"]').click()

    cy.getCookie('simple_consent').should('exist')
      .then((cookie) => {
        const settings = JSON.parse(decodeURIComponent(cookie.value))
        expect(settings).to.have.property('ad_storage', true)
        expect(settings).to.have.property('ad_personalization', true)
        expect(settings).to.have.property('ad_user_data', true)
      })

  })

  it('Modal is hidden after close', () => {
    cy.get('[data-consent-tpl="banner"]').find('[data-consent-action="showSettings"]').click()
    cy.get('[data-consent-tpl="modal"]').as('modal').find('[data-consent-close]').click()
    cy.get('@modal').should('not.be.visible')
  })

})