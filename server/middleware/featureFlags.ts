import { NextFunction, Request, Response } from 'express'
import { FeatureFlagDefault, ObjectMap } from '../@types'

export const featureFlagsDefaults = {
  flagConsiderRecall: {
    label: 'Consider a recall / manager decision',
    default: false,
  },
  flagDomainEventRecommendationStarted: {
    label: "Create Delius contact when user clicks 'Make recommendation' button",
    default: false,
  },
  flagRecommendationsPage: {
    label: 'Recommendations list',
    default: false,
  },
  flagDeleteRecommendation: {
    label: 'Allow (soft) deletion of a recommendation',
    default: false,
  },
  flagShowSystemGenerated: {
    label: 'Option to include system generated contacts in Contact history',
    default: false,
  },
  flagExcludeFromAnalytics: {
    label: "Don't send my data to Google Analytics (in prod only)",
    default: false,
  },
  flagCreateVaryLicenceData: {
    label: "Show tab for 'Create & vary a licence' data",
    default: false,
  },
}

export const readFeatureFlags =
  (flags: ObjectMap<FeatureFlagDefault>) => (req: Request, res: Response, next: NextFunction) => {
    res.locals.flags = Object.keys(flags).reduce((acc, key) => {
      acc[key] = flags[key].default
      return acc
    }, {})
    Object.keys(flags).forEach(key => {
      const flag = req.query[key] || req.cookies[key]
      if (flag) {
        const enabled = flag === '1'
        res.cookie(key, flag)
        res.locals.flags[key] = enabled
      }
    })
    next()
  }
