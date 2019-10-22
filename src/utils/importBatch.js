import {
  destAxiosImport
} from "./fetch";

export const importBatch = (args) => async (values) => {
    const {valueType} = args
    const response = await destAxiosImport({
        method: "POST",
        url: "",
        data: {
            valueType,
            values: values
        }
    })
    if (response.data.errors) {
        reportError(response.data.errors)
    } else {
        console.log(`Imported ${valueType}`)
        return
    }
    
}
