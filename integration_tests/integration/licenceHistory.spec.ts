import { DateTime } from 'luxon'
import getCaseOverviewResponse from '../../api/responses/get-case-overview.json'
import getCasePersonalDetailsResponse from '../../api/responses/get-case-personal-details.json'
import getCaseRiskResponse from '../../api/responses/get-case-risk.json'
import getCaseLicenceHistoryResponse from '../../api/responses/get-case-licence-history.json'
import { europeLondon, sortListByDateField } from '../../server/utils/dates'
import { routeUrls } from '../../server/routes/routeUrls'
import { formatDateTimeFromIsoString } from '../../server/utils/dates/format'
import { dedupeList } from '../../server/utils/utils'

context('Licence history', () => {
  beforeEach(() => {
    cy.signIn()
    cy.task('getCase', { sectionId: 'overview', statusCode: 200, response: getCaseOverviewResponse })
    cy.task('getCase', { sectionId: 'risk', statusCode: 200, response: getCaseRiskResponse })
    cy.task('getCase', { sectionId: 'personal-details', statusCode: 200, response: getCasePersonalDetailsResponse })
    cy.task('getCase', { sectionId: 'all-licence-history', statusCode: 200, response: getCaseLicenceHistoryResponse })
  })

  it('can view the licence history page', () => {
    const crn = 'X34983'
    cy.visit(`${routeUrls.cases}/${crn}/licence-history`)
    cy.pageHeading().should('equal', 'Licence history')

    // contacts
    const systemGeneratedRemoved = getCaseLicenceHistoryResponse.contactSummary.filter(
      contact => contact.systemGenerated === false
    )
    const sortedByDate = sortListByDateField({
      list: systemGeneratedRemoved,
      dateKey: 'contactStartDate',
      newestFirst: true,
    })
    const dates = []
    sortedByDate.forEach((contact, index) => {
      dates.push(DateTime.fromISO(contact.contactStartDate, { zone: europeLondon }).toISODate())
      const opts = { parent: `[data-qa="contact-${index}"]` }
      cy.getText('heading', opts).should('equal', contact.descriptionType)
      cy.getText('time', opts).should(
        'contain',
        formatDateTimeFromIsoString({ isoDate: contact.contactStartDate, timeOnly: true })
      )
      cy.getText('notes', opts).should('equal', contact.notes)
    })
    const dedupedDates = dedupeList(dates)
    dedupedDates.forEach((date, index) => {
      cy.getText(`date-${index}`).should('equal', formatDateTimeFromIsoString({ isoDate: date, dateOnly: true }))
    })
  })

  it('can view collapsible notes on the licence history page', () => {
    const crn = 'X34983'
    cy.visit(`${routeUrls.cases}/${crn}/licence-history`)

    // contacts
    const systemGeneratedRemoved = getCaseLicenceHistoryResponse.contactSummary.filter(
      contact => contact.systemGenerated === false
    )
    const sortedByDate = sortListByDateField({
      list: systemGeneratedRemoved,
      dateKey: 'contactStartDate',
      newestFirst: true,
    })
    const dates = []
    sortedByDate.forEach((contact, index) => {
      dates.push(contact.contactStartDate.substring(0, 10))
      const opts = { parent: `[data-qa="contact-${index}"]` }
      cy.viewDetails('View more detail', opts).should('equal', contact.notes)
    })
  })

  it('can filter licence history contacts by date range', () => {
    const crn = 'X34983'
    cy.visit(`${routeUrls.cases}/${crn}/licence-history?dateFilters=1`)

    // apply filters without entering dates
    cy.clickButton('Apply filters')
    cy.getElement('5 contacts').should('exist')

    // invalid dates - part of date missing
    cy.fillInput('Day', '12', { parent: '#dateFrom' })
    cy.fillInput('Month', '04', { parent: '#dateFrom' })
    cy.fillInput('Year', '2022', { parent: '#dateTo' })
    cy.clickButton('Apply filters')
    cy.assertErrorMessage({
      fieldGroupId: 'dateFrom-day',
      fieldName: 'dateFrom',
      errorText: 'The from date must include a year',
    })
    cy.assertErrorMessage({
      fieldGroupId: 'dateTo-day',
      fieldName: 'dateTo',
      errorText: 'The to date must include a day and month',
    })
    cy.getElement('5 contacts').should('exist')

    // invalid dates - from date after to date
    cy.enterDateTime('2022-04-14', { parent: '#dateFrom' })
    cy.enterDateTime('2022-04-13', { parent: '#dateTo' })
    cy.clickButton('Apply filters')
    cy.assertErrorMessage({
      fieldGroupId: 'dateFrom-day',
      fieldName: 'dateFrom',
      errorText: 'The from date must be before the to date',
    })

    // invalid date - out of bounds value
    cy.fillInput('Day', '36', { parent: '#dateFrom', clearExistingText: true })
    cy.fillInput('Month', '04', { parent: '#dateFrom', clearExistingText: true })
    cy.fillInput('Year', '2021', { parent: '#dateFrom', clearExistingText: true })
    cy.clickButton('Apply filters')
    cy.assertErrorMessage({
      fieldGroupId: 'dateFrom-day',
      fieldName: 'dateFrom',
      errorText: 'The from date must be a real date',
    })

    // successful date filter
    cy.enterDateTime('2022-03-13', { parent: '#dateFrom' })
    cy.enterDateTime('2022-04-13', { parent: '#dateTo' })
    cy.clickButton('Apply filters')
    cy.getElement('2 contacts').should('exist')
    cy.getLinkHref('13-03-2022 to 13-04-2022').should('equal', `/cases/${crn}/licence-history?dateFilters=1`)

    // clear filters
    cy.clickLink('Clear filters')
    cy.getElement('5 contacts').should('exist')
  })
})