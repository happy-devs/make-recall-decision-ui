import { NextFunction, Request, Response } from 'express'
import { isCaseRestrictedOrExcluded, isPreprodOrProd, isString, validateCrn } from '../../utils/utils'
import { getCaseSection } from './getCaseSection'
import { transformErrorMessages } from '../../utils/errors'
import { AuditService } from '../../services/auditService'
import { AppError } from '../../AppError'
import { strings } from '../../textStrings/en'
import { CaseSectionId } from '../../@types/pagesForms'
import { getStatuses, updateRecommendation } from '../../data/makeDecisionApiClient'
import { nextPageLinkUrl } from '../recommendations/helpers/urls'

interface RecommendationButton {
  display: boolean
  post?: boolean
  title?: string
  dataAnalyticsEventCategory?: string
  link?: string
}

const auditService = new AuditService()

async function get(req: Request, res: Response, _: NextFunction) {
  const { crn, sectionId, recommendationId } = req.params
  const { user } = res.locals
  if (!isString(sectionId)) {
    throw new AppError('Invalid section ID', { status: 404 })
  }
  const normalizedCrn = validateCrn(crn)
  const { errors, ...caseSection } = await getCaseSection(
    sectionId as CaseSectionId,
    normalizedCrn,
    res.locals.user.token,
    res.locals.user.userId,
    req.query
  )
  if (errors) {
    res.locals.errors = transformErrorMessages(errors)
  }

  let pageUrlBase = `/cases/${normalizedCrn}/`
  let backLink = '/search'

  let recommendationButton: RecommendationButton = { display: false }

  if (recommendationId) {
    // this will be true when the SPO is reviewing the case during the SPO consider recall flow.
    pageUrlBase = `/recommendations/${recommendationId}/review-case/${normalizedCrn}/`
    backLink = `/recommendations/${recommendationId}/spo-task-list-consider-recall`

    recommendationButton = {
      display: true,
      post: true,
      title: 'Continue',
    }
  } else {
    const isSpo = user.roles.includes('ROLE_MAKE_RECALL_DECISION_SPO')
    const isRecommendationActive = !!caseSection.caseSummary.activeRecommendation?.recommendationId
    if (!isRecommendationActive) {
      if (!isSpo) {
        recommendationButton = {
          display: true,
          post: false,
          title: 'Make a recommendation',
          dataAnalyticsEventCategory: 'make_recommendation_click',
          link: `${pageUrlBase}create-recommendation-warning`,
        }
      }
    } else if (isSpo) {
      const statuses = await getStatuses({
        recommendationId: String(caseSection.caseSummary.activeRecommendation?.recommendationId),
        token: user.token,
      })

      const isSpoConsiderRecall = statuses
        .filter(status => status.active)
        .find(status => status.name === 'SPO_CONSIDER_RECALL')

      const isSpoConsideringRecall = statuses
        .filter(status => status.active)
        .find(status => status.name === 'SPO_CONSIDERING_RECALL')

      if (isSpoConsiderRecall) {
        recommendationButton = {
          display: true,
          post: false,
          title: 'Consider a recall',
          dataAnalyticsEventCategory: 'spo_consider_recall_click',
          link: `/recommendations/${caseSection.caseSummary.activeRecommendation.recommendationId}/`,
        }
      } else if (isSpoConsideringRecall) {
        recommendationButton = {
          display: true,
          post: false,
          title: 'Update recommendation',
          dataAnalyticsEventCategory: 'spo_consider_recall_click',
          link: `/recommendations/${caseSection.caseSummary.activeRecommendation.recommendationId}/`,
        }
      }
    } else {
      recommendationButton = {
        display: true,
        post: false,
        title: 'Update recommendation',
        dataAnalyticsEventCategory: 'update_recommendation_click',
        link: `/recommendations/${caseSection.caseSummary.activeRecommendation.recommendationId}/`,
      }
    }
  }

  res.locals = {
    ...res.locals,
    crn: normalizedCrn,
    ...caseSection,
    notifications: strings.notifications,
    recommendationButton,
    backLink,
    pageUrlBase,
  }
  const page = isCaseRestrictedOrExcluded(caseSection.caseSummary.userAccessResponse)
    ? 'pages/excludedRestrictedCrn'
    : 'pages/caseSummary'
  res.render(page)
  auditService.caseSummaryView({
    crn: normalizedCrn,
    sectionId,
    username: res.locals.user.username,
    logErrors: isPreprodOrProd(res.locals.env) && process.env.NODE_ENV !== 'test',
  })
}

async function post(req: Request, res: Response, _: NextFunction) {
  const { recommendationId } = req.params

  const {
    flags,
    user: { token },
    urlInfo,
  } = res.locals

  await updateRecommendation({
    recommendationId,
    valuesToSave: {
      reviewOffenderProfile: true,
    },
    token,
    featureFlags: flags,
  })
  res.redirect(303, nextPageLinkUrl({ nextPageId: 'spo-task-list-consider-recall', urlInfo }))
}

export default { get, post }