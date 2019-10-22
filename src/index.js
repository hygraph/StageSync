import {buildPagination} from './utils/buildPagination'
import {buildAssetBatch} from './utils/buildAssetBatch'
import {buildBatch} from './utils/buildBatch'
import {buildIO} from './utils/buildIO'
import {reportErrors} from './utils/errors'

// Hotels
import readHotelsQuery from './queries/readHotelsQuery.graphql'
import upsertHotelMutation from './queries/upsertHotelMutation.graphql'

// Destination
import readDestinationsQuery from './queries/readDestinationsQuery.graphql'
import upsertDestinationMutation from './queries/upsertDestinationMutation.graphql'

// Destination
import readReviewsQuery from './queries/readReviewsQuery.graphql'
import upsertReviewMutation from './queries/upsertReviewMutation.graphql'

// Assets
import readAssetQuery from './queries/readAsset.graphql'
import readDestAssetQuery from './queries/readDestAsset.graphql'
import upsertAssetQuery from './queries/upsertAsset.graphql'


// Relationships
import {importBatch} from './utils/importBatch'

// Destinations
const writeDestination = buildBatch(upsertDestinationMutation)
const processDestinations = buildPagination(readDestinationsQuery, writeDestination)

// Hotels

/*
  Optionally pass a transformation function
  that accepts the expected payload shape and
  returns the desired shape.
*/
const writeHotel = buildBatch(upsertHotelMutation, /* transform function */)
const processHotels = buildPagination(readHotelsQuery, writeHotel)

// Reviews
const writeReview = buildBatch(upsertReviewMutation)
const processReviews = buildPagination(readReviewsQuery, writeReview)

// Assets
const writeAssets = buildAssetBatch(readDestAssetQuery, upsertAssetQuery)
const processAssets = buildPagination(readAssetQuery, writeAssets)

// Relations
const importRelations = importBatch({valueType: 'relations'})
const processRelations = buildIO('relations', importRelations)

const run = async () => {
    try {
      
      // Sync Assets
      console.log("Processing Assets...")
      // await processAssets()
      reportErrors()

      // Sync Hotels
      console.log("Processing Hotels...")
      await processHotels()
      reportErrors()
      
      // Sync Destinations
      console.log("Processing Destinations...")
      // await processDestinations()
      reportErrors()

      // Sync Reviews
      console.log("Processing Reviews...")
      await processReviews()
      reportErrors()

      // Sync Relations
      await processRelations()
      reportErrors()

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
