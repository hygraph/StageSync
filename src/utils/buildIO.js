import {exportBatch} from './exportBatch'

const defaultArgs = {
    cursor: ({
        table: 0,
        row: 0,
        field: 0,
        array: 0
    })
}

//  Helpers

export const buildIO = (fileType, callback) => {
  return async () => {
    await exportBatch({
      ...defaultArgs,
      fileType: fileType,
      callback: callback})
  }
}