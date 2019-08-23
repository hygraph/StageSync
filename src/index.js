import paginate from './utils/paginate'
import batch from './utils/batch'
import assetBatch from './utils/assetBatch'

// Speakers
import readSpeakerQuery from './queries/readSpeaker.graphql'
import upsertSpeakerMutation from './queries/upsertSpeaker.graphql'

// Events
import readEventQuery from './queries/readEvent.graphql'
import upsertEventMutation from './queries/upsertEvent.graphql'

// Assets
import readAssetQuery from './queries/readAsset.graphql'
import readDestAssetQuery from './queries/readDestAsset.graphql'
import upsertAssetQuery from './queries/upsertAsset.graphql'


let errors = []

const defaultArgs = {
  page: 5,
  skip: 0,
  collection: []
}


//  Helpers
const pickQuery = node => node.loc.source.body
const buildPagination = (query, callback) => {
  return async () => {
    await paginate({
      ...defaultArgs,
      query: pickQuery(query),
      callback: callback})
  }
}
const buildBatch = (query) => {
    return async (payload) => {
      const response = await batch({
        query: pickQuery(query),
        payload: payload
      })
      errors = [...errors, ...response]
  }
}


// Assets need Unique Handling because we have to check for assets at destination so we can create them with destination filestack API.
const buildAssetBatch = (readQuery, createQuery, updateQuery) => {
  return async (payload) => {
    const response = await assetBatch({
      read: pickQuery(readQuery),
      // create: pickQuery(createQuery),
      // update: pickQuery(updateQuery),
      payload: payload
    })
    errors = [...errors, ...response]
}
}


// Events
const writeEvents = buildBatch(upsertEventMutation)
const processEvents = buildPagination(readEventQuery, writeEvents)

// Speakers
const writeSpeakers = buildBatch(upsertSpeakerMutation)
const processSpeakers = buildPagination(readSpeakerQuery, writeSpeakers)

// Assets
const writeAssets = buildAssetBatch(readDestAssetQuery)
const processAssets = buildPagination(readAssetQuery, writeAssets)

const run = async () => {
    try {
      
      // Sync Assets
      await processAssets()  

      // Sync Speakers
      await processSpeakers()
      
      // Sync Events
      await processEvents()

      
      // console.log(errors)
    } catch (error) {
      console.log(error)
    }
}


try {
    console.log('Get Ready!')
    run()
}  catch (e) {
    console.log("Server Error!", e)
}
