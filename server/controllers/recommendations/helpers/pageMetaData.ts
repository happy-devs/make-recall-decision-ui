import { AppError } from '../../../AppError'
import { validateRecallType } from '../recallType/formValidator'
import { inputDisplayValuesRecallType } from '../recallType/inputDisplayValues'
import { validateEmergencyRecall } from '../emergencyRecall/formValidator'
import { inputDisplayValuesEmergencyRecall } from '../emergencyRecall/inputDisplayValues'
import { validateVictimContactScheme } from '../victimContactScheme/formValidator'
import { inputDisplayValuesVictimContactScheme } from '../victimContactScheme/inputDisplayValues'
import { validateVictimLiaisonOfficer } from '../victimLiaisonOfficer/formValidator'
import { inputDisplayValuesVictimLiaisonOfficer } from '../victimLiaisonOfficer/inputDisplayValues'
import { validateArrestIssues } from '../arrestIssues/formValidator'
import { inputDisplayValuesArrestIssues } from '../arrestIssues/inputDisplayValues'
import { validateIntegratedOffenderManagement } from '../integratedOffenderManagement/formValidator'
import { inputDisplayValuesIntegratedOffenderManagement } from '../integratedOffenderManagement/inputDisplayValues'
import { validateLocalPoliceContactDetails } from '../localPoliceContactDetails/formValidator'
import { inputDisplayValuesLocalPoliceContactDetails } from '../localPoliceContactDetails/inputDisplayValues'
import { inputDisplayValuesVulnerabilities } from '../vulnerabilities/inputDisplayValues'
import { validateVulnerabilities } from '../vulnerabilities/formValidator'
import { validateContraband } from '../contraband/formValidator'
import { inputDisplayValuesContraband } from '../contraband/inputDisplayValues'
import { validateRecallTypeIndeterminate } from '../recallTypeIndeterminate/formValidator'
import { inputDisplayValuesRecallTypeIndeterminate } from '../recallTypeIndeterminate/inputDisplayValues'
import { validateFixedTermLicenceConditions } from '../fixedTermAdditionalLicenceConditions/formValidator'
import { inputDisplayValuesFixedTermLicenceConditions } from '../fixedTermAdditionalLicenceConditions/inputDisplayValues'
import { validateIndeterminateDetails } from '../indeterminateOrExtendedSentenceDetails/formValidator'
import { inputDisplayValuesIndeterminateDetails } from '../indeterminateOrExtendedSentenceDetails/inputDisplayValues'
import { validateNextAppointment } from '../nextAppointment/formValidator'
import { inputDisplayValuesNextAppointment } from '../nextAppointment/inputDisplayValues'
import { validateAddress } from '../addressDetails/formValidator'
import { inputDisplayValuesAddress } from '../addressDetails/inputDisplayValues'
import { validateOffenceAnalysis } from '../offenceAnalysis/formValidator'
import { inputDisplayValuesOffenceAnalysis } from '../offenceAnalysis/inputDisplayValues'
import { validatePreviousReleases } from '../previousReleases/formValidator'
import { validateAddPreviousRelease } from '../addPreviousRelease/formValidator'
import { inputDisplayValuesAddPreviousRelease } from '../addPreviousRelease/inputDisplayValues'
import { validateManagerRecordDecision } from '../managerRecordDecision/formValidator'
import { inputDisplayValuesManagerRecordDecision } from '../managerRecordDecision/inputDisplayValues'
import { validateManagerRecordDecisionDelius } from '../managerRecordDecisionDelius/formValidator'
import { validateRosh } from '../rosh/formValidator'
import { inputDisplayValuesRosh } from '../rosh/inputDisplayValues'
import { PageMetaData } from '../../../@types/pagesForms'
import { validatePreviousRecalls } from '../previousRecalls/formValidator'
import { validateAddPreviousRecall } from '../addPreviousRecall/formValidator'
import { inputDisplayValuesAddPreviousRecall } from '../addPreviousRecall/inputDisplayValues'
import { inputDisplayValuesCustodyStatus } from '../custodyStatus/inputDisplayValues'
import { validateCustodyStatus } from '../custodyStatus/formValidator'

/* The PageMetaData properties explained:
 * id - used as a key to get the page title. Also the name of the nunjucks HTML template
 * validator - will be called by postRecommendationForm, with the submitted form values
 * inputDisplayValues - called by getRecommendationPage, used to determine what input values to render, using errors / unsaved values / API values
 * reviewedProperty - used to mark a property on the recommendation record as 'reviewed'
 * propertyToRefresh - ask the API to refresh its copy of this data property, from its upstream services
 *  */
export const pageMetaData = (pageUrlSlug?: string): PageMetaData => {
  switch (pageUrlSlug) {
    case 'manager-record-decision':
      return {
        id: 'managerRecordDecision',
        validator: validateManagerRecordDecision,
        inputDisplayValues: inputDisplayValuesManagerRecordDecision,
      }
    case 'manager-view-decision':
      return {
        id: 'managerViewDecision',
      }
    case 'manager-record-decision-delius':
      // This one raises an ap insight event
      return {
        id: 'managerRecordDecisionDelius',
        validator: validateManagerRecordDecisionDelius,
      }
    case 'manager-decision-confirmation':
      return {
        id: 'managerDecisionConfirmation',
      }
    case 'recall-type-indeterminate':
      return {
        id: 'recallTypeIndeterminate',
        validator: validateRecallTypeIndeterminate,
        inputDisplayValues: inputDisplayValuesRecallTypeIndeterminate,
      }
    case 'indeterminate-details':
      return {
        id: 'indeterminateOrExtendedSentenceDetails',
        validator: validateIndeterminateDetails,
        inputDisplayValues: inputDisplayValuesIndeterminateDetails,
      }
    case 'recall-type':
      return {
        id: 'recallType',
        validator: validateRecallType,
        inputDisplayValues: inputDisplayValuesRecallType,
      }
    case 'fixed-licence':
      return {
        id: 'fixedTermLicenceConditions',
        validator: validateFixedTermLicenceConditions,
        inputDisplayValues: inputDisplayValuesFixedTermLicenceConditions,
      }
    case 'emergency-recall':
      return {
        id: 'emergencyRecall',
        validator: validateEmergencyRecall,
        inputDisplayValues: inputDisplayValuesEmergencyRecall,
      }
    case 'custody-status':
      // THIS HAS ALREADY BEEN MIGRATED TO NEW FORMAT - left here because of unit tests on getRecommendationPage
      return {
        id: 'custodyStatus',
        validator: validateCustodyStatus,
        inputDisplayValues: inputDisplayValuesCustodyStatus,
      }
    case 'vulnerabilities':
      return {
        id: 'vulnerabilities',
        validator: validateVulnerabilities,
        inputDisplayValues: inputDisplayValuesVulnerabilities,
      }
    case 'iom':
      return {
        id: 'integratedOffenderManagement',
        validator: validateIntegratedOffenderManagement,
        inputDisplayValues: inputDisplayValuesIntegratedOffenderManagement,
      }
    case 'police-details':
      return {
        id: 'localPoliceContactDetails',
        validator: validateLocalPoliceContactDetails,
        inputDisplayValues: inputDisplayValuesLocalPoliceContactDetails,
      }
    case 'victim-contact-scheme':
      return {
        id: 'victimContactScheme',
        validator: validateVictimContactScheme,
        inputDisplayValues: inputDisplayValuesVictimContactScheme,
      }
    case 'victim-liaison-officer':
      return {
        id: 'victimLiaisonOfficer',
        validator: validateVictimLiaisonOfficer,
        inputDisplayValues: inputDisplayValuesVictimLiaisonOfficer,
      }
    case 'arrest-issues':
      return {
        id: 'arrestIssues',
        validator: validateArrestIssues,
        inputDisplayValues: inputDisplayValuesArrestIssues,
      }
    case 'personal-details':
      return {
        id: 'personalDetails',
        reviewedProperty: 'personOnProbation',
        propertyToRefresh: 'personOnProbation',
      }
    case 'offence-details':
      return {
        id: 'offenceDetails',
        reviewedProperty: 'convictionDetail',
        propertyToRefresh: 'convictionDetail',
      }
    case 'previous-releases':
      return {
        id: 'previousReleases',
        propertyToRefresh: 'previousReleases',
        validator: validatePreviousReleases,
      }
    case 'add-previous-release':
      return {
        id: 'addPreviousRelease',
        validator: validateAddPreviousRelease,
        inputDisplayValues: inputDisplayValuesAddPreviousRelease,
      }
    case 'previous-recalls':
      return {
        id: 'previousRecalls',
        propertyToRefresh: 'previousRecalls',
        validator: validatePreviousRecalls,
      }
    case 'add-previous-recall':
      return {
        id: 'addPreviousRecall',
        validator: validateAddPreviousRecall,
        inputDisplayValues: inputDisplayValuesAddPreviousRecall,
      }
    case 'offence-analysis':
      return {
        id: 'offenceAnalysis',
        propertyToRefresh: 'indexOffenceDetails',
        validator: validateOffenceAnalysis,
        inputDisplayValues: inputDisplayValuesOffenceAnalysis,
      }
    case 'mappa':
      return {
        id: 'mappa',
        reviewedProperty: 'mappa',
        propertyToRefresh: 'mappa',
      }
    case 'rosh':
      return {
        id: 'rosh',
        propertyToRefresh: 'riskOfSeriousHarm',
        validator: validateRosh,
        inputDisplayValues: inputDisplayValuesRosh,
      }
    case 'address-details':
      return {
        id: 'addressDetails',
        validator: validateAddress,
        inputDisplayValues: inputDisplayValuesAddress,
      }
    case 'contraband':
      return {
        id: 'contraband',
        validator: validateContraband,
        inputDisplayValues: inputDisplayValuesContraband,
      }
    case 'confirmation-part-a':
      return {
        id: 'confirmationPartA',
      }
    case 'appointment-no-recall':
      return {
        id: 'nextAppointment',
        validator: validateNextAppointment,
        inputDisplayValues: inputDisplayValuesNextAppointment,
      }
    default:
      throw new AppError(`getPageMetaData - invalid pageUrlSlug: ${pageUrlSlug}`, { status: 404 })
  }
}
