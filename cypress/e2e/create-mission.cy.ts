// cypress/e2e/create-mission.cy.ts

describe('Création d\'une mission', () => {

    beforeEach(() => {
        cy.on('uncaught:exception', (err) => {
            if (err.message.includes('valid number') || err.message.includes('anchor')) {
                return false
            }
            return true
        })

        cy.clearLocalStorage()
        cy.clearCookies()

        cy.visit('/login')
        cy.get('input[name="email"]', { timeout: 10000 }).should('be.visible').type('admin@email.com')
        cy.get('input[name="password"]').type('123!Mdp')
        cy.get('button').contains('Se connecter').click()
        cy.url({ timeout: 10000 }).should('include', '/home')

        cy.visit('/event/4')
        cy.url().should('not.include', '/login')
        cy.url().should('include', '/event/4')

        cy.contains('button', '+ Nouvelle mission', { timeout: 10000 }).should('be.visible').click()
        cy.get('#create_mission_modal').should('be.visible')
    })

    // Ouvre le popover en forçant son affichage, clique sur le BOUTON à l'intérieur
    // de la cellule du jour (pas le <td> lui-même, qui ne porte pas le handler de clic),
    // puis referme le popover.
    const pickFirstAvailableDay = (popoverId: string) => {
        cy.get(`#${popoverId}`).invoke('css', 'display', 'block')
        cy.get(`#${popoverId} .rdp-day`)
            .not('.rdp-hidden')
            .not('.rdp-outside')
            .not('.rdp-disabled')
            .first()
            .find('button')
            .click({ force: true })
        cy.get(`#${popoverId}`).invoke('css', 'display', 'none')
    }

    it('Cas 1 — Crée une mission avec des données valides', () => {
        cy.get('#create_mission_modal').within(() => {
            cy.get('input[placeholder="Ex: tournoi départemental"]').type('Mariage des Frivault')
            cy.get('textarea[placeholder="Décrivez l\'évènement"]').type(
                "A la bonne franquette de pizzas ! Venez partager notre journée autour d'une bonne pizza. On s'amuse, on danse, on rit ! ça sera la fête !"
            )
            cy.contains('button', 'Suivant').click()
            cy.contains('button', 'Manuel').click()
            cy.contains('button', 'jj/mm/aaaa').click()
        })

        pickFirstAvailableDay('rdp-popover-slot-0')

        cy.get('#create_mission_modal').within(() => {
            cy.get('input[type="time"]').first().type('09:00')
            cy.get('input[type="time"]').last().type('11:00')
            cy.contains('button', 'Suivant').click()
            cy.contains('button', 'Organisation').click()
            cy.contains('button', 'Enregistrer').should('not.be.disabled').click()
        })

        cy.get('#create_mission_modal').should('not.be.visible')
        cy.get('body', { timeout: 8000 }).should('contain.text', 'Mariage des Frivault')
    })

    it('Cas 2 — Refuse un nom vide (bug identifié : pas de message affiché)', () => {
        cy.get('#create_mission_modal').within(() => {
            cy.get('textarea[placeholder="Décrivez l\'évènement"]').type('Description sans nom')
            cy.contains('button', 'Suivant').click()
            cy.contains('Informations générales').should('be.visible')
        })
    })

    it('Cas 3 — Refuse une description vide', () => {
        cy.get('#create_mission_modal').within(() => {
            cy.get('input[placeholder="Ex: tournoi départemental"]').type('Nom sans description')
            cy.contains('button', 'Suivant').click()
            cy.contains('Informations générales').should('be.visible')
            cy.contains('La description est requise').should('be.visible')
        })
    })

    it('Cas 4 — Refuse un créneau sans date ni heures', () => {
        cy.get('#create_mission_modal').within(() => {
            cy.get('input[placeholder="Ex: tournoi départemental"]').type('Mission sans créneau')
            cy.get('textarea[placeholder="Décrivez l\'évènement"]').type('Description')
            cy.contains('button', 'Suivant').click()
            cy.contains('button', 'Manuel').click()
            cy.contains('button', 'Suivant').click()
            cy.contains('Créneaux horaires').should('be.visible')
        })
    })

    it('Cas 5 — Refuse une heure de fin avant l\'heure de début', () => {
        cy.get('#create_mission_modal').within(() => {
            cy.get('input[placeholder="Ex: tournoi départemental"]').type('Mission créneau invalide')
            cy.get('textarea[placeholder="Décrivez l\'évènement"]').type('Description')
            cy.contains('button', 'Suivant').click()
            cy.contains('button', 'Manuel').click()
            cy.contains('button', 'jj/mm/aaaa').click()
        })

        pickFirstAvailableDay('rdp-popover-slot-0')

        cy.get('#create_mission_modal').within(() => {
            cy.get('input[type="time"]').first().type('14:00')
            cy.get('input[type="time"]').last().type('10:00')
            cy.contains('button', 'Suivant').click()
            cy.contains("L'heure de fin doit être après l'heure de début").should('be.visible')
        })
    })

    it('Cas 6 — Refuse une génération automatique qui dépasse minuit', () => {
        cy.get('#create_mission_modal').within(() => {
            cy.get('input[placeholder="Ex: tournoi départemental"]').type('Mission créneaux auto')
            cy.get('textarea[placeholder="Décrivez l\'évènement"]').type('Description')
            cy.contains('button', 'Suivant').click()
            cy.contains('button', 'Automatique').click()
            cy.contains('button', 'jj/mm/aaaa').click()
        })

        pickFirstAvailableDay('rdp-auto')

        cy.get('#create_mission_modal').within(() => {
            cy.get('input[type="time"]').type('23:00')
            cy.get('input[type="number"]').eq(0).clear().type('60')
            cy.get('input[type="number"]').eq(1).clear().type('3')
            cy.contains('button', 'Générer les créneaux').click()
            cy.contains('Les créneaux dépassent minuit').should('be.visible')
        })
    })

    it('Cas 7 — Le bouton "Enregistrer" reste désactivé sans compétence sélectionnée', () => {
        cy.get('#create_mission_modal').within(() => {
            cy.get('input[placeholder="Ex: tournoi départemental"]').type('Mission sans compétence')
            cy.get('textarea[placeholder="Décrivez l\'évènement"]').type('Description')
            cy.contains('button', 'Suivant').click()
            cy.contains('button', 'Manuel').click()
            cy.contains('button', 'jj/mm/aaaa').click()
        })

        pickFirstAvailableDay('rdp-popover-slot-0')

        cy.get('#create_mission_modal').within(() => {
            cy.get('input[type="time"]').first().type('09:00')
            cy.get('input[type="time"]').last().type('11:00')
            cy.contains('button', 'Suivant').click()
            cy.contains('button', 'Enregistrer').should('be.disabled')
        })
    })

})