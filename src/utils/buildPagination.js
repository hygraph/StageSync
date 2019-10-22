import paginate from './paginate'
import {pickQuery} from './pickQuery'

const defaultArgs = {
  page: 5,
  skip: 0,
  collection: []
}

//  Helpers

export const buildPagination = (query, callback) => {
  return async () => {
    await paginate({
      ...defaultArgs,
      query: pickQuery(query),
      callback: callback})
  }
}