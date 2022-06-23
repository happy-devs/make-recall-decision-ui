import { ParsedQs } from 'qs'
import { CaseSectionId, ContactHistoryFilters, ObjectMap } from '../../@types'
import { CaseSummaryOverviewResponse } from '../../@types/make-recall-decision-api/models/CaseSummaryOverviewResponse'
import { getCaseSummary } from '../../data/makeDecisionApiClient'
import { ContactHistoryResponse } from '../../@types/make-recall-decision-api/models/ContactHistoryResponse'
import { CaseRisk } from '../../@types/make-recall-decision-api/models/CaseRisk'
import { PersonDetailsResponse } from '../../@types/make-recall-decision-api/models/PersonDetailsResponse'
import { fetchFromCacheOrApi } from '../../data/fetchFromCacheOrApi'
import { transformContactHistory } from './contactHistory/transformContactHistory'
import { countLabel } from '../../utils/utils'
import { LicenceConditionsResponse } from '../../@types/make-recall-decision-api'
import { transformLicenceConditions } from './licenceConditions/transformLicenceConditions'

const isCaseRestrictedOrExcluded = (apiResponse: { userRestricted?: boolean; userExcluded?: boolean }) =>
  apiResponse.userRestricted || apiResponse.userExcluded

export const getCaseSection = async (
  sectionId: CaseSectionId,
  crn: string,
  token: string,
  userId: string,
  reqQuery: ParsedQs,
  featureFlags: ObjectMap<boolean>
) => {
  let sectionLabel
  let caseSummary
  let caseSummaryRaw
  let transformed
  let errors
  const trimmedCrn = crn.trim()
  switch (sectionId) {
    case 'overview':
      caseSummary = await getCaseSummary<CaseSummaryOverviewResponse>(trimmedCrn, sectionId, token)
      sectionLabel = 'Overview'
      break
    case 'risk':
      caseSummary = await getCaseSummary<CaseRisk>(trimmedCrn, sectionId, token)
      sectionLabel = 'Risk'
      break
    case 'personal-details':
      caseSummary = await getCaseSummary<PersonDetailsResponse>(trimmedCrn, sectionId, token)
      sectionLabel = 'Personal details'
      break
    case 'licence-conditions':
      caseSummaryRaw = await getCaseSummary<LicenceConditionsResponse>(trimmedCrn, sectionId, token)
      caseSummary = transformLicenceConditions(caseSummaryRaw)
      sectionLabel = 'Licence conditions'
      break
    case 'contact-history':
      caseSummaryRaw = await fetchFromCacheOrApi({
        fetchDataFn: () => getCaseSummary<ContactHistoryResponse>(trimmedCrn, 'contact-history', token),
        checkWhetherToCacheDataFn: apiResponse => !isCaseRestrictedOrExcluded(apiResponse),
        userId,
        redisKey: `contactHistory:${trimmedCrn}`,
      })
      if (isCaseRestrictedOrExcluded(caseSummaryRaw)) {
        caseSummary = caseSummaryRaw
        sectionLabel = 'Contact history'
      } else {
        transformed = transformContactHistory({
          caseSummary: caseSummaryRaw,
          filters: reqQuery as unknown as ContactHistoryFilters,
          featureFlags,
        })
        errors = transformed.errors
        caseSummary = transformed.data
        sectionLabel = `${countLabel({
          count: transformed.data.contactCount,
          noun: 'contact',
        })} for ${trimmedCrn} - Contact history`
      }
      break
    default:
      throw new Error(`getCaseSection: invalid sectionId: ${sectionId}`)
  }
  return {
    errors,
    caseSummary,
    caseSummaryRaw,
    section: {
      label: sectionLabel,
      id: sectionId,
    },
  }
}
