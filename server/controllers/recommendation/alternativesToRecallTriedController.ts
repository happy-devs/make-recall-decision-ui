import { NextFunction, Request, Response } from 'express'
import { updateRecommendation } from '../../data/makeDecisionApiClient'
import { nextPageLinkUrl } from '../recommendations/helpers/urls'
import { inputDisplayValuesAlternativesToRecallTried } from '../recommendations/alternativesToRecallTried/inputDisplayValues'
import { validateAlternativesTried } from '../recommendations/alternativesToRecallTried/formValidator'

async function get(req: Request, res: Response, next: NextFunction) {
  const { flags, recommendation } = res.locals

  res.locals = {
    ...res.locals,
    backLink: flags.flagTriggerWork ? 'task-list-consider-recall' : 'licence-conditions',
    page: {
      id: 'alternativesToRecallTried',
    },
    inputDisplayValues: inputDisplayValuesAlternativesToRecallTried({
      errors: res.locals.errors,
      unsavedValues: res.locals.unsavedValues,
      apiValues: recommendation,
    }),
  }

  res.render(`pages/recommendations/alternativesToRecallTried`)
  next()
}

async function post(req: Request, res: Response, _: NextFunction) {
  const { recommendationId } = req.params

  const {
    flags,
    user: { token },
    urlInfo,
  } = res.locals

  const { errors, valuesToSave, unsavedValues } = await validateAlternativesTried({
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

  const nextPageId = flags.flagTriggerWork ? 'task-list-consider-recall' : 'manager-review'
  res.redirect(303, nextPageLinkUrl({ nextPageId, urlInfo }))
}

export default { get, post }