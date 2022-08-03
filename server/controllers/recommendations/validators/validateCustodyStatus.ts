import { FormValidatorArgs, FormValidatorReturn } from '../../../@types'
import { makeErrorObject } from '../../../utils/errors'
import { routeUrls } from '../../../routes/routeUrls'
import { formOptions, isValueValid } from '../formOptions'
import { strings } from '../../../textStrings/en'

export const validateCustodyStatus = ({ requestBody }: FormValidatorArgs): FormValidatorReturn => {
  let errors
  let valuesToSave
  let nextPagePath

  const { custodyStatus } = requestBody
  if (!custodyStatus || !isValueValid(custodyStatus, 'custodyStatus')) {
    const errorId = 'noCustodyStatusSelected'
    errors = [
      makeErrorObject({
        id: 'custodyStatus',
        text: strings.errors[errorId],
        errorId,
      }),
    ]
  }
  if (!errors) {
    valuesToSave = {
      custodyStatus: {
        value: custodyStatus,
        options: formOptions.custodyStatus,
      },
    }
    nextPagePath = `${routeUrls.cases}/${requestBody.crn}/overview`
  }
  return {
    errors,
    valuesToSave,
    nextPagePath,
  }
}