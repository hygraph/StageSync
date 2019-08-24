import {
    sourceAxios,
    destAxios,
    destAxiosFileStack,
    destAxiosImport} from './fetch'

const pattern = /\.com\/(.+)/

const importNode = payload => ({_typeName: "Asset", ...payload})

const batch = async (args) => {
    const {api, payload, read, create, update} = args
    let errors = []
    let batchImport = []

    for await (let entry of payload) {
        // Set a timeout to help the server
        await new Promise((resolve)=> {setTimeout(resolve, 2000)})
        
        // Check if Asset exists
        const readResponse = await destAxios({
            url: "",
            data: {
            query: read,
            variables: entry
            }
        })
        
        if(readResponse.data.errors) {
            console.log('Error with ', entry.id)
        }

        

        const response = await readResponse.data.data
        
        if (response && response.asset) {
            // Run Update Query
            const updateResponse = await destAxios({
                url: "",
                data: {
                    query: update,
                    variables: entry
                }
            })
        } else {
            const bodyFormData = new FormData();
            bodyFormData.set('url', entry.url);
            
            // Await creating new asset handle
            const fileStackResponse = await destAxiosFileStack({
                url: "",
                data: bodyFormData
            })

            const newHandle = await fileStackResponse.data.url.match(pattern)[0]

            batchImport.push({
                ...importNode(entry), handle: newHandle})
            
        }
    }

    if (batchImport.length) {
        const bodyFormData = new FormData();
        bodyFormData.set('valueType', "nodes");
        bodyFormData.set('values', batchImport);
        
        const importData = destAxiosImport({
            url: "",
            data: bodyFormData
        })
    }

    return errors;

}

export default  batch