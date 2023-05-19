import { When } from '@badeball/cypress-cucumber-preprocessor'
import { proxy } from '@alfonso-presa/soft-assert'
import {
  q12MappaDetails,
  q15RoshLevels,
  q16IndexOffenceDetails,
  q1EmergencyRecall,
  q22RecallType,
  q25ProbationDetails,
  q2IndeterminateSentenceType,
  q3ExtendedSentence,
  q4OffenderDetails,
  q5SentenceDetails,
  q6CustodyStatus,
  q7Addresses,
  q8ArrestIssues,
  assertAllPartA,
} from './assertionsPartA'

const expectSoftly = proxy(expect)

When('Maria confirms the person is on a IPP sentence', function () {
  cy.selectRadio(
    `What type of sentence is ${this.offenderName} on?`,
    'Imprisonment for Public Protection (IPP) sentence'
  )
  cy.clickButton('Continue')
})

When('Maria confirms the person is on a life sentence', function () {
  cy.selectRadio(`What type of sentence is ${this.offenderName} on?`, 'Life sentence')
  cy.clickButton('Continue')
})

When('Maria confirms the existing indeterminate and extended sentence criteria', () => {
  cy.clickButton('Continue')
})

When('Maria enters indeterminate and extended sentence criteria', function () {
  cy.selectCheckboxes('Indeterminate and extended sentences', [
    `${this.offenderName} has shown behaviour similar to the index offence`,
    `${this.offenderName} has shown behaviour that could lead to a sexual or violent offence`,
    `${this.offenderName} is out of touch`,
  ])
  cy.fillInput('Give details', 'Details on behaviour similar to index offence', {
    parent: '#conditional-BEHAVIOUR_SIMILAR_TO_INDEX_OFFENCE',
  })
  cy.fillInput('Give details', 'Details on behaviour that could lead to a sexual or violent offence', {
    parent: '#conditional-BEHAVIOUR_LEADING_TO_SEXUAL_OR_VIOLENT_OFFENCE',
  })
  cy.fillInput('Give details', 'Details on out of touch', { parent: '#conditional-OUT_OF_TOUCH' })
  cy.clickButton('Continue')
})

When('Maria downloads the Part A and confirms the indeterminate recall', function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const context = this
  cy.downloadDocX('Download the Part A').then(contents => {
    q1EmergencyRecall(contents, 'Yes')
    q2IndeterminateSentenceType(contents, 'Yes - IPP')
    q3ExtendedSentence(contents, 'Yes')
    q4OffenderDetails(contents, context)
    cy.log('Q5')
    q5SentenceDetails(contents, context)
    q6CustodyStatus(contents, 'No')
    cy.log('Q7')
    expectSoftly(contents).to.contain(
      'Provide any other possible addresses: Police can find this person at: 123 Acacia Avenue, Birmingham B23 1AV'
    )
    q8ArrestIssues(contents, 'Yes', 'Arrest issues details...')
    cy.log('Q9')
    expectSoftly(contents).to.contain('Police single point of contact name: Bob Wiggins')
    expectSoftly(contents).to.contain('Current contact telephone number: 07936 737 387')
    expectSoftly(contents).to.contain('Fax number:  0208 737 3838')
    expectSoftly(contents).to.contain('Email address: bob.wiggins@met.gov.uk')

    cy.log('Q10')
    expectSoftly(contents).to.contain('Relationship breakdown')
    expectSoftly(contents).to.contain('Details on relationship breakdown')
    expectSoftly(contents).to.contain('Physical disabilities')
    expectSoftly(contents).to.contain('Details on physical disabilities')

    cy.log('Q11')
    expectSoftly(contents).to.contain(
      'Do you have any suspicions that the offender is using recall to bring contraband into the prison estate? Yes'
    )
    expectSoftly(contents).to.contain(
      'If yes, provide details and contact your local police SPOC to share information or concerns: Contraband details...'
    )
    cy.log('Q12')
    q12MappaDetails(contents)
    cy.log('Q13')
    expectSoftly(contents).to.contain('Registered PPO/IOM: Yes')
    cy.log('Q14')
    expectSoftly(contents).to.contain(
      'Is there a victim(s) involved in the victim contact scheme (contact must be made with the VLO if there is victim involvement)? Yes'
    )
    expectSoftly(contents).to.contain('Confirm the date the VLO was informed of the above: 14 April 2022')

    cy.log('Q15')
    q15RoshLevels(contents)

    cy.log('Q16')
    q16IndexOffenceDetails(contents)
    // TODO - Q18 - additional licence conditions
    cy.log('Q19')
    expectSoftly(contents).to.contain('Increasingly violent behaviour')
    cy.log('Q20')
    expectSoftly(contents).to.contain('Re-offending has occurred')
    cy.log('Q21')
    expectSoftly(contents).to.contain('Details on reporting')
    expectSoftly(contents).to.contain('Details on drug testing')

    q22RecallType(contents, 'N/A', 'N/A')
    cy.log('Q23')
    expectSoftly(contents).to.contain(
      'Has the offender exhibited behaviour similar to the circumstances surrounding the index offence; is there a causal link? Yes'
    )
    expectSoftly(contents).to.contain('Please Comment: Details on behaviour similar to index offence')
    expectSoftly(contents).to.contain(
      'Has the offender exhibited behaviour likely to give rise, or does give rise to the commission of a sexual or violent offence? Yes'
    )
    expectSoftly(contents).to.contain(
      'Please Comment: Details on behaviour that could lead to a sexual or violent offence'
    )
    expectSoftly(contents).to.contain(
      'Is the offender out of touch with probation/YOT and the assumption can be made that any of (i) to (ii) may arise? Yes'
    )
    expectSoftly(contents).to.contain('Please Comment: Details on out of touch')
    cy.log('Q25')
    q25ProbationDetails(contents)
    assertAllPartA()
  })
})

When('Maria downloads the Part A and confirms the indeterminate recall with details', function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const ctx = this
  return cy.downloadDocX('Download the Part A').then(contents => {
    q4OffenderDetails(contents, ctx)
    q5SentenceDetails(contents, ctx)
    q12MappaDetails(contents)
    q16IndexOffenceDetails(contents)
    assertAllPartA()
  })
})

When('Maria downloads the Part A and confirms the indeterminate recall with police custody', () => {
  cy.downloadDocX('Download the Part A').then(contents => {
    q3ExtendedSentence(contents, 'No')
    q6CustodyStatus(contents, 'Police Custody')
    q7Addresses(contents, 'West Ham Lane Police Station, 18 West Ham Lane, Stratford, E15 4SG')
    assertAllPartA()
  })
})

When('Maria confirms answers were saved', function () {
  cy.log('========= Response to probation')
  cy.clickLink(`How has ${this.offenderName} responded to probation so far?`)
  cy.getTextInputValue(`How has ${this.offenderName} responded to probation so far?`).should(
    'equal',
    'Re-offending has occurred'
  )
  cy.clickLink('Back')

  cy.log('========= Licence conditions')
  cy.clickLink(`What licence conditions has ${this.offenderName} breached?`)
  cy.getSelectableOptionByLabel(
    `What licence conditions has ${this.offenderName} breached?`,
    'Receive visits from the supervising officer in accordance with instructions given by the supervising officer'
  ).should('be.checked')
  cy.clickLink('Back')

  cy.log('========= Alternatives to recall')
  cy.clickLink('What alternatives to recall have been tried already?')
  cy.getSelectableOptionByLabel(
    'What alternatives to recall have been tried already?',
    'Increased frequency of reporting'
  ).should('be.checked')
  cy.getSelectableOptionByLabel('What alternatives to recall have been tried already?', 'Drug testing').should(
    'be.checked'
  )
  cy.getTextInputValue('Give details on Increased frequency of reporting', {
    parent: '#conditional-INCREASED_FREQUENCY',
  }).should('equal', 'Details on reporting')
  cy.getTextInputValue('Give details on Drug testing', { parent: '#conditional-DRUG_TESTING' }).should(
    'equal',
    'Details on drug testing'
  )
  cy.clickLink('Back')

  cy.log('========= Recommendation')
  cy.clickLink('What you recommend')
  cy.getSelectableOptionByLabel('What do you recommend?', 'Emergency recall').should('be.checked')
  cy.clickLink('Back')

  cy.log('========= Custody')
  cy.clickLink(`Is ${this.offenderName} in custody now?`)
  cy.getSelectableOptionByLabel(`Is ${this.offenderName} in custody now?`, 'No').should('be.checked')
  cy.clickLink('Back')

  cy.log('========= IOM')
  cy.clickLink(`Is ${this.offenderName} under Integrated Offender Management (IOM)?`)
  cy.getSelectableOptionByLabel(`Is ${this.offenderName} under Integrated Offender Management (IOM)?`, 'Yes').should(
    'be.checked'
  )
  cy.clickLink('Back')

  cy.log('========= Local police contact')
  cy.clickLink('Local police contact details')
  cy.getTextInputValue('Police contact name').should('equal', 'Bob Wiggins')
  cy.getTextInputValue('Telephone number').should('equal', '07936 737 387')
  cy.getTextInputValue('Fax number (optional)').should('equal', '0208 737 3838')
  cy.getTextInputValue('Email address').should('equal', 'bob.wiggins@met.gov.uk')
  cy.clickLink('Back')

  cy.log('========= Victim contact scheme')
  cy.clickLink('Are there any victims in the victim contact scheme?')
  cy.getSelectableOptionByLabel('Are there any victims in the victim contact scheme?', 'Yes').should('be.checked')
  cy.clickButton('Continue')
  cy.getTextInputValue('Day').should('equal', '14')
  cy.getTextInputValue('Month').should('equal', '04')
  cy.getTextInputValue('Year').should('equal', '2022')
  cy.clickButton('Continue')

  cy.log('========= Arrest issues')
  cy.clickLink(`Is there anything the police should know before they arrest ${this.offenderName}?`)
  cy.getSelectableOptionByLabel(
    `Is there anything the police should know before they arrest ${this.offenderName}?`,
    'Yes'
  ).should('be.checked')
  cy.getTextInputValue('Give details. Include information about any vulnerable children and adults').should(
    'equal',
    'Arrest issues details...'
  )
  cy.clickLink('Back')

  cy.log('========= Contraband')
  cy.clickLink(`Do you think ${this.offenderName} is using recall to bring contraband into prison?`)
  cy.getSelectableOptionByLabel(
    `Do you think ${this.offenderName} is using recall to bring contraband into prison?`,
    'Yes'
  ).should('be.checked')
  cy.getTextInputValue('Give details. Also tell your local police contact about your concerns.').should(
    'equal',
    'Contraband details...'
  )
  cy.clickLink('Back')

  cy.log('========= Indeterminate or extended sentence details')
  cy.clickLink('Confirm the recall criteria - indeterminate and extended sentences')
  cy.getSelectableOptionByLabel(
    'Indeterminate and extended sentences',
    `${this.offenderName} has shown behaviour similar to the index offence`
  ).should('be.checked')
  cy.getSelectableOptionByLabel(
    'Indeterminate and extended sentences',
    `${this.offenderName} has shown behaviour that could lead to a sexual or violent offence`
  ).should('be.checked')
  cy.getSelectableOptionByLabel('Indeterminate and extended sentences', `${this.offenderName} is out of touch`).should(
    'be.checked'
  )
  cy.getTextInputValue('Give details', { parent: '#conditional-BEHAVIOUR_SIMILAR_TO_INDEX_OFFENCE' }).should(
    'equal',
    'Details on behaviour similar to index offence'
  )
  cy.getTextInputValue('Give details', {
    parent: '#conditional-BEHAVIOUR_LEADING_TO_SEXUAL_OR_VIOLENT_OFFENCE',
  }).should('equal', 'Details on behaviour that could lead to a sexual or violent offence')
  cy.getTextInputValue('Give details', { parent: '#conditional-OUT_OF_TOUCH' }).should(
    'equal',
    'Details on out of touch'
  )
  cy.clickLink('Back')

  cy.pageHeading().should('equal', 'Create a Part A form')
})
