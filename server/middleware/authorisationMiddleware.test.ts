import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'

import authorisationMiddleware, { HMPPS_AUTH_ROLE } from './authorisationMiddleware'

function createToken(authorities: string[]) {
  const payload = {
    user_name: 'USER1',
    scope: ['read', 'write'],
    auth_source: 'nomis',
    authorities,
    jti: 'a610a10-cca6-41db-985f-e87efb303aaf',
    client_id: 'clientid',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

describe('authorisationMiddleware', () => {
  let req: Request
  const next = jest.fn()

  function createResWithToken({ authorities }: { authorities: string[] }): Response {
    return {
      locals: {
        user: {
          token: createToken(authorities),
        },
      },
      redirect: (redirectUrl: string) => {
        return redirectUrl
      },
    } as unknown as Response
  }

  it('should return next when no required roles', () => {
    const res = createResWithToken({ authorities: [] })

    const authorisationResponse = authorisationMiddleware()(req, res, next)

    expect(authorisationResponse).toEqual(next())
  })

  it('sets hasSpoRole to true if SPO role is present', () => {
    const res = createResWithToken({ authorities: [HMPPS_AUTH_ROLE.SPO] })

    authorisationMiddleware()(req, res, next)

    expect(res.locals.user.hasSpoRole).toEqual(true)
  })

  it('sets hasPpcsRole to true if PPCS role is present', () => {
    const res = createResWithToken({ authorities: [HMPPS_AUTH_ROLE.PPCS] })

    authorisationMiddleware()(req, res, next)

    expect(res.locals.user.hasPpcsRole).toEqual(true)
  })

  it('should set roles', () => {
    const res = createResWithToken({ authorities: [HMPPS_AUTH_ROLE.SPO, HMPPS_AUTH_ROLE.PO] })

    authorisationMiddleware()(req, res, next)

    expect(res.locals.user.roles).toEqual([HMPPS_AUTH_ROLE.SPO, HMPPS_AUTH_ROLE.PO])
  })

  it('sets hasSpoRole to false if SPO role is not present', () => {
    const res = createResWithToken({ authorities: [HMPPS_AUTH_ROLE.PO] })

    authorisationMiddleware()(req, res, next)

    expect(res.locals.user.hasSpoRole).toEqual(false)
  })

  it('should redirect when user has no authorised roles', () => {
    const res = createResWithToken({ authorities: [] })

    const authorisationResponse = authorisationMiddleware(['SOME_REQUIRED_ROLE'])(req, res, next)

    expect(authorisationResponse).toEqual('/authError')
  })

  it('should return next when user has authorised role', () => {
    const res = createResWithToken({ authorities: ['SOME_REQUIRED_ROLE'] })

    const authorisationResponse = authorisationMiddleware(['SOME_REQUIRED_ROLE'])(req, res, next)

    expect(authorisationResponse).toEqual(next())
  })
})
