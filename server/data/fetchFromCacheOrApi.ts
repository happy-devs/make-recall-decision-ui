import { createRedisClient, RedisClient } from './redisClient'
import logger from '../../logger'

const TTL_SECONDS = 60 * 60 * 24

interface Fn {
  <Type>(Args: {
    fetchDataFn: () => Promise<Type>
    checkWhetherToCacheDataFn: (data: Type) => boolean
    userId: string
    redisKey: string
  }): Promise<Type>
}

let apiCache: RedisClient

export const mrdApiCache = () => {
  apiCache = apiCache ?? createRedisClient({ legacyMode: true })
  return apiCache
}

const fetchAndCache: Fn = async ({ fetchDataFn, checkWhetherToCacheDataFn, userId, redisKey }) => {
  const apiResponse = await fetchDataFn()
  const cache = mrdApiCache()
  try {
    if (cache) {
      if (checkWhetherToCacheDataFn(apiResponse)) {
        const newValueToCache = {
          userIds: [userId],
          data: apiResponse,
        }
        const existingCachedValue = await getValue(redisKey)
        if (existingCachedValue) {
          const updatedUserIds = [...newValueToCache.userIds, ...(existingCachedValue.userIds || [])]
          const dedupedUserIds = [...new Set(updatedUserIds)]
          newValueToCache.userIds = dedupedUserIds
        }
        cache.set(redisKey, JSON.stringify(newValueToCache))
        cache.expire(redisKey, TTL_SECONDS)
      } else {
        cache.del(redisKey)
      }
    }
  } catch (err) {
    logger.error(err)
  }
  return apiResponse
}

export const getValue = async (redisKey: string) => {
  const value = await mrdApiCache().get(redisKey)
  if (value) {
    return JSON.parse(value)
  }
  return undefined
}

export const fetchFromCacheOrApi: Fn = async ({ fetchDataFn, checkWhetherToCacheDataFn, userId, redisKey }) => {
  const stored = await getValue(redisKey)
  if (stored) {
    logger.info(`Redis cache hit for ${redisKey}`)
    try {
      const { userIds, data } = stored
      if (userIds.includes(userId)) {
        // start a fetch to update the cache, but don't wait for it
        fetchAndCache({ fetchDataFn, checkWhetherToCacheDataFn, userId, redisKey })
        return data
      }
    } catch (err) {
      logger.error(err)
    }
  }
  return fetchAndCache({ fetchDataFn, checkWhetherToCacheDataFn, userId, redisKey })
}
