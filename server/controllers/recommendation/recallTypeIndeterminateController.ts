import { NextFunction, Request, Response } from 'express'
import { updateRecommendation } from '../../data/makeDecisionApiClient'
import { nextPageLinkUrl } from '../recommendations/helpers/urls'
import { validateRecallTypeIndeterminate } from '../recommendations/recallTypeIndeterminate/formValidator'
import { inputDisplayValuesRecallTypeIndeterminate } from '../recommendations/recallTypeIndeterminate/inputDisplayValues'
import { isEmptyStringOrWhitespace, normalizeCrn } from '../../utils/utils'
import { appInsightsEvent } from '../../monitoring/azureAppInsights'

function get(req: Request, res: Response, next: NextFunction) {
  const {
    recommendation,
    flags: { flagTriggerWork },
  } = res.locals

  let backLink
  if (flagTriggerWork) {
    backLink = 'discuss-with-manager'
  } else if (recommendation.isIndeterminateSentence) {
    backLink = 'indeterminate-type'
  } else {
    backLink = 'is-extended'
  }

  res.locals = {
    ...res.locals,
    backLink,
    page: {
      id: 'recallTypeIndeterminate',
    },
    inputDisplayValues: inputDisplayValuesRecallTypeIndeterminate({
      errors: res.locals.errors,
      unsavedValues: res.locals.unsavedValues,
      apiValues: recommendation,
    }),
  }

  res.render(`pages/recommendations/recallTypeIndeterminate`)
  next()
}

async function post(req: Request, res: Response, _: NextFunction) {
  const { recommendationId } = req.params
  const { recallType } = req.body

  const {
    flags,
    user: { token, username },
    urlInfo,
  } = res.locals

  const { errors, valuesToSave, unsavedValues, monitoringEvent } = await validateRecallTypeIndeterminate({
    requestBody: req.body,
    recommendationId,
    urlInfo,
    token,
  })

  if (errors) {
    req.session.errors = errors
    req.session.unsavedValues = unsavedValues
    return res.redirect(303, req.originalUrl)
  }

  await updateRecommendation({
    recommendationId,
    valuesToSave,
    token,
    featureFlags: flags,
  })

  const nextPageId = recallType === 'NO_RECALL' ? 'task-list-no-recall' : 'indeterminate-details'
  res.redirect(303, nextPageLinkUrl({ nextPageId, urlInfo }))

  const crn = normalizeCrn(req.body.crn)
  if (!isEmptyStringOrWhitespace(crn)) {
    appInsightsEvent(
      monitoringEvent.eventName,
      username,
      {
        ...monitoringEvent.data,
        crn,
        recommendationId,
      },
      flags
    )
  }
}

export default { get, post }