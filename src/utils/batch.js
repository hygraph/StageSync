import {destAxios} from './fetch'
import {reportError} from './errors'
const batch = async (args) => {
    let {payload, query, transformation} = args
    for await (let entry of payload) {
        await new Promise((resolve)=> {setTimeout(resolve, 2000)})

        if (transformation) {
            payload = transformation(payload)
        }
        
        const response = await destAxios({
            method: "POST",
            url: "",
            data: {
                query: query,
                variables: entry
            }
        })
        
        if(response.data.errors) {
            console.log('Error with ', entry.id)
            reportError(response.data.errors)
        } else {
            console.log("Upserted ", entry.id)
        }
    }
}

export default  batch