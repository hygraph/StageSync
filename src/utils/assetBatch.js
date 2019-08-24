import {sourceAxios, destAxios} from './fetch'

const importNode = payload => ({_typeName: "Asset", ...payload})

const batch = async (args) => {
    const {api, payload, read, create, update} = args
    let errors = []
    
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
            console.log(importNode(entry))
        } else {

            console.log(importNode(entry))

            // Await creating new asset handle
            // Construct node for import API
            // Push consructed node into collection
            // Use import node

            // Shape of exported asset
            // {
            //     "_typeName": "Asset",
            //     "id": "cjuvcuddwb3cq0c15kmewr906",
            //     "updatedAt": "2019-04-24T15:12:32.690Z",
            //     "size": 1080,
            //     "height": 0,
            //     "fileName": "cocktail.svg",
            //     "mimeType": "image/svg+xml",
            //     "status": "PUBLISHED",
            //     "createdAt": "2019-04-24T15:10:11.780Z",
            //     "width": 0,
            //     "handle": "B1pYOsmdTGukfSSAS8L2"
            //   },


            // Here is where we need to find a way to create the missing assets and upload them with the destination stage API key. But it's not that simple, we also need to find a way to change the relationship for the dependent models with the new ID. The reference should be there but this gets highly nested and specific.

            console.log("Miss", entry)
        }
    }
    return errors;

}

export default  batch