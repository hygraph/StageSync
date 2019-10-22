import {
  sourceAxiosExport,
} from "./fetch";

export const exportBatch = async (args) => {
    const {cursor, fileType, callback} = args

    const response = await sourceAxiosExport({
        method: "POST",
        url: "",
        data: {
            fileType, cursor
        }
    })
    if(response.data.errors) {
        console.log('Error', response.data.errors)
        reportError(response.data.errors)
    }


    if (Object.values(response.data.cursor).some(pointer => pointer !== -1)) {
        await callback(response.data.out.jsonElements) 
        console.log(`Importing ${response.data.out.jsonElements.length} ${fileType}`)
        return exportBatch({callback, cursor: response.data.cursor, fileType})
    } else {
        console.log(`Importing Final Batch of ${response.data.out.jsonElements.length} ${fileType}`)
        await callback(response.data.out.jsonElements)
        return
    }
}


// {
//     "fileType": "relationships",
    
//   }

