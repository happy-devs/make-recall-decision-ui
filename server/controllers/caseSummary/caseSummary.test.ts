import { Response } from 'express'
import { mockReq, mockRes } from '../../middleware/testutils/mockRequestUtils'
import { caseSummary } from './caseSummary'
import { getCaseSummary } from '../../data/makeDecisionApiClient'
import * as redisExports from '../../data/redisClient'
import caseOverviewApiResponse from '../../../api/responses/get-case-overview.json'
import caseRiskApiResponse from '../../../api/responses/get-case-risk.json'

jest.mock('../../data/makeDecisionApiClient')

const crn = ' A1234AB '
let res: Response
const token = 'token'

describe('caseSummary', () => {
  beforeEach(() => {
    res = mockRes({ token })
  })

  it('should return case details for risk', async () => {
    ;(getCaseSummary as jest.Mock).mockReturnValueOnce(caseRiskApiResponse)
    const req = mockReq({ params: { crn, sectionId: 'risk' } })
    await caseSummary(req, res)
    expect(getCaseSummary).toHaveBeenCalledWith(crn.trim(), 'risk', token)
    expect(res.render).toHaveBeenCalledWith('pages/caseSummary')
    expect(res.locals.caseSummary).toEqual(caseRiskApiResponse)
    expect(res.locals.section).toEqual({
      id: 'risk',
      label: 'Risk',
    })
  })

  it('should return case details for overview', async () => {
    ;(getCaseSummary as jest.Mock).mockReturnValueOnce(caseOverviewApiResponse)
    const req = mockReq({ params: { crn, sectionId: 'overview' } })
    await caseSummary(req, res)
    expect(getCaseSummary).toHaveBeenCalledWith(crn.trim(), 'overview', token)
    expect(res.locals.caseSummary).toEqual(caseOverviewApiResponse)
    expect(res.locals.section).toEqual({
      id: 'overview',
      label: 'Overview',
    })
  })

  it('should convert the CRN to uppercase', async () => {
    ;(getCaseSummary as jest.Mock).mockReturnValueOnce(caseOverviewApiResponse)
    const req = mockReq({ params: { crn: 'abc', sectionId: 'overview' } })
    await caseSummary(req, res)
    expect(getCaseSummary).toHaveBeenCalledWith('ABC', 'overview', token)
  })

  it('should return grouped by dates for contact history', async () => {
    ;(getCaseSummary as jest.Mock).mockReturnValueOnce({
      contactSummary: [
        {
          code: 'C191',
          contactStartDate: '2022-06-03T08:00:00',
          descriptionType: 'Registration Review',
          outcome: null,
          notes:
            'Comment added by John Smith on 05/05/2022 at 17:45\nType: Public Protection - MAPPA\nLevel: MAPPA Level 3\nCategory: MAPPA Cat 3\nNotes: Please Note - Category 3 offenders require multi-agency management at Level 2 or 3 and should not be recorded at Level 1.',
          enforcementAction: 'action 2',
          systemGenerated: false,
        },
        {
          code: 'IVSP',
          contactStartDate: '2022-05-10T11:39:00',
          descriptionType: 'Police Liaison',
          outcome: null,
          notes: null,
          enforcementAction: 'action 1',
          systemGenerated: false,
        },
      ],
    })
    jest.spyOn(redisExports, 'getRedisAsync').mockResolvedValue(null)
    const req = mockReq({ params: { crn, sectionId: 'contact-history' } })
    await caseSummary(req, res)
    expect(getCaseSummary).toHaveBeenCalledWith(crn.trim(), 'all-licence-history', token)
    expect(res.locals.caseSummary.contactSummary).toEqual({
      groupedByKey: 'startDate',
      items: [
        {
          groupValue: '2022-06-03',
          items: [
            {
              code: 'C191',
              contactStartDate: '2022-06-03T08:00:00',
              descriptionType: 'Registration Review',
              enforcementAction: 'action 2',
              notes:
                'Comment added by John Smith on 05/05/2022 at 17:45\nType: Public Protection - MAPPA\nLevel: MAPPA Level 3\nCategory: MAPPA Cat 3\nNotes: Please Note - Category 3 offenders require multi-agency management at Level 2 or 3 and should not be recorded at Level 1.',
              outcome: null,
              startDate: '2022-06-03',
              systemGenerated: false,
            },
          ],
        },
        {
          groupValue: '2022-05-10',
          items: [
            {
              code: 'IVSP',
              contactStartDate: '2022-05-10T11:39:00',
              descriptionType: 'Police Liaison',
              enforcementAction: 'action 1',
              notes: null,
              outcome: null,
              startDate: '2022-05-10',
              systemGenerated: false,
            },
          ],
        },
      ],
    })
    expect(res.locals.section).toEqual({
      id: 'contact-history',
      label: '2 contacts for A1234AB - Contact history',
    })
  })

  it('should return 400 for an invalid CRN', async () => {
    const invalidCrn = 50 as unknown as string
    const req = mockReq({ params: { crn: invalidCrn, sectionId: 'contact-log' } })
    await caseSummary(req, res)
    expect(res.sendStatus).toHaveBeenCalledWith(400)
  })

  it('should throw for an invalid section param', async () => {
    const invalidSection = 'recalls'
    ;(getCaseSummary as jest.Mock).mockReturnValueOnce(caseOverviewApiResponse)
    const req = mockReq({ params: { crn, sectionId: invalidSection } })
    try {
      await caseSummary(req, res)
    } catch (err) {
      expect(err.message).toEqual('getCaseSection: invalid sectionId: recalls')
    }
  })

  it('should throw if the API call errors', async () => {
    const apiError = { status: 500 }
    ;(getCaseSummary as jest.Mock).mockRejectedValue(apiError)
    const req = mockReq({ query: { crn } })
    try {
      await caseSummary(req, res)
    } catch (err) {
      expect(err).toEqual(apiError)
    }
  })
})
