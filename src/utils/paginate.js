import {sourceAxios} from './fetch'

const paginate = async (args) => {
    const {page, skip, query, collection, callback} = args

    const response = await sourceAxios({
        url: "",
        data: {
        query: query,
        variables: {
            first: page,
            skip: skip
        }}
    })
    if(response.data.errors) {
        console.log('Error', response.data.errors)
    }

    if (response.data.data.pages.length === page) {
        await callback(response.data.data.pages)
        return paginate({...args, skip: (skip + page), collection: [...collection, ...response.data.data.pages]})
    } else {
        await callback(response.data.data.pages)
        return [...collection, ...response.data.data.pages]
    }
}

export default  paginate