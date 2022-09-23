import { PageMetaData } from '../../../@types'
import { AppError } from '../../../AppError'
import { strings } from '../../../textStrings/en'
import { validateRecallType } from '../recallType/formValidator'
import { validateCustodyStatus } from '../custodyStatus/formValidator'
import { inputDisplayValuesRecallType } from '../recallType/inputDisplayValues'
import { inputDisplayValuesCustodyStatus } from '../custodyStatus/inputDisplayValues'
import { validateResponseToProbation } from '../responseToProbation/formValidator'
import { inputDisplayValuesResponseToProbation } from '../responseToProbation/inputDisplayValues'
import { validateEmergencyRecall } from '../emergencyRecall/formValidator'
import { inputDisplayValuesEmergencyRecall } from '../emergencyRecall/inputDisplayValues'
import { validateVictimContactScheme } from '../victimContactScheme/formValidator'
import { inputDisplayValuesVictimContactScheme } from '../victimContactScheme/inputDisplayValues'
import { validateVictimLiaisonOfficer } from '../victimLiaisonOfficer/formValidator'
import { inputDisplayValuesVictimLiaisonOfficer } from '../victimLiaisonOfficer/inputDisplayValues'
import { validateAlternativesTried } from '../alternativesToRecallTried/formValidator'
import { inputDisplayValuesAlternativesToRecallTried } from '../alternativesToRecallTried/inputDisplayValues'
import { validateArrestIssues } from '../arrestIssues/formValidator'
import { inputDisplayValuesArrestIssues } from '../arrestIssues/inputDisplayValues'
import { validateLicenceConditionsBreached } from '../licenceConditions/formValidator'
import { inputDisplayValuesLicenceConditions } from '../licenceConditions/inputDisplayValues'
import { validateIntegratedOffenderManagement } from '../integratedOffenderManagement/formValidator'
import { inputDisplayValuesIntegratedOffenderManagement } from '../integratedOffenderManagement/inputDisplayValues'
import { validateLocalPoliceContactDetails } from '../localPoliceContactDetails/formValidator'
import { inputDisplayValuesLocalPoliceContactDetails } from '../localPoliceContactDetails/inputDisplayValues'
import { inputDisplayValuesVulnerabilities } from '../vulnerabilities/inputDisplayValues'
import { validateVulnerabilities } from '../vulnerabilities/formValidator'
import { validateWhatLedToRecall } from '../whatLedToRecall/formValidator'
import { inputDisplayValuesWhatLedToRecall } from '../whatLedToRecall/inputDisplayValues'
import { validateContraband } from '../contraband/formValidator'
import { inputDisplayValuesContraband } from '../contraband/inputDisplayValues'
import { validateIsIndeterminateSentence } from '../isIndeterminateSentence/formValidator'
import { inputDisplayValuesIsIndeterminateSentence } from '../isIndeterminateSentence/inputDisplayValues'
import { validateIndeterminateSentenceType } from '../indeterminateSentenceType/formValidator'
import { inputDisplayValuesIndeterminateSentenceType } from '../indeterminateSentenceType/inputDisplayValues'
import { validateIsExtendedSentence } from '../isExtendedSentence/formValidator'
import { inputDisplayValuesIsExtendedSentence } from '../isExtendedSentence/inputDisplayValues'
import { validateRecallTypeIndeterminate } from '../recallTypeIndeterminate/formValidator'
import { inputDisplayValuesRecallTypeIndeterminate } from '../recallTypeIndeterminate/inputDisplayValues'
import { validateFixedTermLicenceConditions } from '../fixedTermAdditionalLicenceConditions/formValidator'
import { inputDisplayValuesFixedTermLicenceConditions } from '../fixedTermAdditionalLicenceConditions/inputDisplayValues'
import { validateIndeterminateDetails } from '../indeterminateOrExtendedSentenceDetails/formValidator'
import { inputDisplayValuesIndeterminateDetails } from '../indeterminateOrExtendedSentenceDetails/inputDisplayValues'
import { validateWhyConsideredRecall } from '../whyConsideredRecall/formValidator'
import { inputDisplayValuesWhyConsideredRecall } from '../whyConsideredRecall/inputDisplayValues'
import { validateReasonsForNoRecall } from '../reasonsForNoRecall/formValidator'
import { inputDisplayValuesReasonsForNoRecall } from '../reasonsForNoRecall/inputDisplayValues'
import { validateNextAppointment } from '../nextAppointment/formValidator'
import { inputDisplayValuesNextAppointment } from '../nextAppointment/inputDisplayValues'
import { validateAddress } from '../addressDetails/formValidator'
import { inputDisplayValuesAddress } from '../addressDetails/inputDisplayValues'

export const pageMetaData = (pageId?: unknown): PageMetaData => {
  switch (pageId) {
    case 'response-to-probation':
      return {
        templateName: 'responseToProbation',
        validator: validateResponseToProbation,
        inputDisplayValues: inputDisplayValuesResponseToProbation,
        pageHeading: strings.pageHeadings.responseToProbation,
        pageTitle: strings.pageTitles.responseToProbation,
      }
    case 'licence-conditions':
      return {
        templateName: 'licenceConditions',
        validator: validateLicenceConditionsBreached,
        inputDisplayValues: inputDisplayValuesLicenceConditions,
        pageHeading: strings.pageHeadings.licenceConditions,
        pageTitle: strings.pageTitles.licenceConditions,
      }
    case 'alternatives-tried':
      return {
        templateName: 'alternativesToRecallTried',
        validator: validateAlternativesTried,
        inputDisplayValues: inputDisplayValuesAlternativesToRecallTried,
        pageHeading: strings.pageHeadings.alternativesToRecallTried,
        pageTitle: strings.pageTitles.alternativesToRecallTried,
      }
    case 'stop-think':
      return {
        templateName: 'stopThink',
        pageHeading: strings.pageHeadings.stopThink,
        pageTitle: strings.pageTitles.stopThink,
      }
    case 'is-indeterminate':
      return {
        templateName: 'isIndeterminateSentence',
        validator: validateIsIndeterminateSentence,
        inputDisplayValues: inputDisplayValuesIsIndeterminateSentence,
        pageHeading: strings.pageHeadings.isIndeterminateSentence,
        pageTitle: strings.pageTitles.isIndeterminateSentence,
      }
    case 'is-extended':
      return {
        templateName: 'isExtendedSentence',
        validator: validateIsExtendedSentence,
        inputDisplayValues: inputDisplayValuesIsExtendedSentence,
        pageHeading: strings.pageHeadings.isExtendedSentence,
        pageTitle: strings.pageTitles.isExtendedSentence,
      }
    case 'indeterminate-type':
      return {
        templateName: 'indeterminateSentenceType',
        validator: validateIndeterminateSentenceType,
        inputDisplayValues: inputDisplayValuesIndeterminateSentenceType,
        pageHeading: strings.pageHeadings.indeterminateSentenceType,
        pageTitle: strings.pageTitles.indeterminateSentenceType,
      }
    case 'recall-type-indeterminate':
      return {
        templateName: 'recallTypeIndeterminate',
        validator: validateRecallTypeIndeterminate,
        inputDisplayValues: inputDisplayValuesRecallTypeIndeterminate,
        pageHeading: strings.pageHeadings.recallType,
        pageTitle: strings.pageTitles.recallType,
      }
    case 'indeterminate-details':
      return {
        templateName: 'indeterminateOrExtendedSentenceDetails',
        validator: validateIndeterminateDetails,
        inputDisplayValues: inputDisplayValuesIndeterminateDetails,
        pageHeading: strings.pageHeadings.indeterminateOrExtendedSentenceDetails,
        pageTitle: strings.pageTitles.indeterminateOrExtendedSentenceDetails,
      }
    case 'recall-type':
      return {
        templateName: 'recallType',
        validator: validateRecallType,
        inputDisplayValues: inputDisplayValuesRecallType,
        pageHeading: strings.pageHeadings.recallType,
        pageTitle: strings.pageTitles.recallType,
      }
    case 'fixed-licence':
      return {
        templateName: 'fixedTermLicenceConditions',
        validator: validateFixedTermLicenceConditions,
        inputDisplayValues: inputDisplayValuesFixedTermLicenceConditions,
        pageHeading: strings.pageHeadings.fixedTermLicenceConditions,
        pageTitle: strings.pageTitles.fixedTermLicenceConditions,
      }
    case 'sensitive-info':
      return {
        templateName: 'sensitiveInformation',
        pageHeading: strings.pageHeadings.sensitiveInformation,
        pageTitle: strings.pageTitles.sensitiveInformation,
      }
    case 'emergency-recall':
      return {
        templateName: 'emergencyRecall',
        validator: validateEmergencyRecall,
        inputDisplayValues: inputDisplayValuesEmergencyRecall,
        pageHeading: strings.pageHeadings.emergencyRecall,
        pageTitle: strings.pageTitles.emergencyRecall,
      }
    case 'custody-status':
      return {
        templateName: 'custodyStatus',
        validator: validateCustodyStatus,
        inputDisplayValues: inputDisplayValuesCustodyStatus,
        pageHeading: strings.pageHeadings.custodyStatus,
        pageTitle: strings.pageTitles.custodyStatus,
      }
    case 'vulnerabilities':
      return {
        templateName: 'vulnerabilities',
        validator: validateVulnerabilities,
        inputDisplayValues: inputDisplayValuesVulnerabilities,
        pageHeading: strings.pageHeadings.vulnerabilities,
        pageTitle: strings.pageTitles.vulnerabilities,
      }
    case 'what-led':
      return {
        templateName: 'whatLedToRecall',
        validator: validateWhatLedToRecall,
        inputDisplayValues: inputDisplayValuesWhatLedToRecall,
        pageHeading: strings.pageHeadings.whatLedToRecall,
        pageTitle: strings.pageTitles.whatLedToRecall,
      }
    case 'task-list':
      return {
        templateName: 'taskList',
        pageHeading: strings.pageHeadings.taskList,
        pageTitle: strings.pageTitles.taskList,
      }
    case 'iom':
      return {
        templateName: 'integratedOffenderManagement',
        validator: validateIntegratedOffenderManagement,
        inputDisplayValues: inputDisplayValuesIntegratedOffenderManagement,
        pageHeading: strings.pageHeadings.integratedOffenderManagement,
        pageTitle: strings.pageTitles.integratedOffenderManagement,
      }
    case 'police-details':
      return {
        templateName: 'localPoliceContactDetails',
        validator: validateLocalPoliceContactDetails,
        inputDisplayValues: inputDisplayValuesLocalPoliceContactDetails,
        pageHeading: strings.pageHeadings.localPoliceContactDetails,
        pageTitle: strings.pageTitles.localPoliceContactDetails,
      }
    case 'victim-contact-scheme':
      return {
        templateName: 'victimContactScheme',
        validator: validateVictimContactScheme,
        inputDisplayValues: inputDisplayValuesVictimContactScheme,
        pageHeading: strings.pageHeadings.victimContactScheme,
        pageTitle: strings.pageTitles.victimContactScheme,
      }
    case 'victim-liaison-officer':
      return {
        templateName: 'victimLiaisonOfficer',
        validator: validateVictimLiaisonOfficer,
        inputDisplayValues: inputDisplayValuesVictimLiaisonOfficer,
        pageHeading: strings.pageHeadings.victimLiaisonOfficer,
        pageTitle: strings.pageTitles.victimLiaisonOfficer,
      }
    case 'arrest-issues':
      return {
        templateName: 'arrestIssues',
        validator: validateArrestIssues,
        inputDisplayValues: inputDisplayValuesArrestIssues,
        pageHeading: strings.pageHeadings.arrestIssues,
        pageTitle: strings.pageTitles.arrestIssues,
      }
    case 'address-details':
      return {
        templateName: 'addressDetails',
        validator: validateAddress,
        inputDisplayValues: inputDisplayValuesAddress,
        pageHeading: strings.pageHeadings.addressDetails,
        pageTitle: strings.pageTitles.addressDetails,
      }
    case 'contraband':
      return {
        templateName: 'contraband',
        validator: validateContraband,
        inputDisplayValues: inputDisplayValuesContraband,
        pageHeading: strings.pageHeadings.contraband,
        pageTitle: strings.pageTitles.contraband,
      }
    case 'confirmation-part-a':
      return {
        templateName: 'confirmationPartA',
        pageHeading: strings.pageHeadings.confirmationPartA,
        pageTitle: strings.pageTitles.confirmationPartA,
      }
    case 'task-list-no-recall':
      return {
        templateName: 'taskListNoRecall',
        pageHeading: strings.pageHeadings.taskListNoRecall,
        pageTitle: strings.pageTitles.taskListNoRecall,
      }
    case 'why-considered-recall':
      return {
        templateName: 'whyConsideredRecall',
        validator: validateWhyConsideredRecall,
        inputDisplayValues: inputDisplayValuesWhyConsideredRecall,
        pageHeading: strings.pageHeadings.whyConsideredRecall,
        pageTitle: strings.pageTitles.whyConsideredRecall,
      }
    case 'reasons-no-recall':
      return {
        templateName: 'reasonsForNoRecall',
        validator: validateReasonsForNoRecall,
        inputDisplayValues: inputDisplayValuesReasonsForNoRecall,
        pageHeading: strings.pageHeadings.reasonsForNoRecall,
        pageTitle: strings.pageTitles.reasonsForNoRecall,
      }
    case 'appointment-no-recall':
      return {
        templateName: 'nextAppointment',
        validator: validateNextAppointment,
        inputDisplayValues: inputDisplayValuesNextAppointment,
        pageHeading: strings.pageHeadings.nextAppointment,
        pageTitle: strings.pageTitles.nextAppointment,
      }
    case 'confirmation-no-recall':
      return {
        templateName: 'confirmationNoRecallLetter',
        pageHeading: strings.pageHeadings.confirmationNoRecallLetter,
        pageTitle: strings.pageTitles.confirmationNoRecallLetter,
      }
    default:
      throw new AppError(`getPageMetaData - invalid pageId: ${pageId}`, { status: 404 })
  }
}
