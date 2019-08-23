import {sourceAxios} from './fetch'
const batch = async (args) => {
    const {payload, query} = args
    let errors = []
    
    for await (let entry of payload) {
        await new Promise((resolve)=> {setTimeout(resolve, 2000)})
        
        const response = await sourceAxios({
            url: "",
            data: {
                query: query,
                variables: entry
            }
        })
        
        if(response.data.errors) {
            console.log('Error with ', entry.id)
        } else {
            console.log("Upserted ", entry.id)
        }
    }
    return errors;

}

export default  batch