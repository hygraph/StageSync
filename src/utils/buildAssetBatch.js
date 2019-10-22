import {pickQuery} from './pickQuery'
import assetBatch from './assetBatch'
import {reportError} from './errors'

// Assets need Unique Handling because we have to check for assets at destination so we can create them with destination filestack API.
export const buildAssetBatch = (readQuery, updateQuery) => {
    return async (payload) => {
      const response = await assetBatch({
        read: pickQuery(readQuery),
        update: pickQuery(updateQuery),
        payload: payload
      })
      reportError(response)
  }
  }