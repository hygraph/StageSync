import {pickQuery} from './pickQuery'
import batch from './batch'

export const buildBatch = (query, transformation) => {
    return async (payload) => {
      const response = await batch({
        query: pickQuery(query),
        payload: payload,
        transformation: transformation
      })
  }
}