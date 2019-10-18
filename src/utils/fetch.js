require('dotenv').config();
import axios from 'axios'
const API = (stage = 'master') =>
  `https://api-euwest.graphcms.com/v1/cjubekk561n9a01gh4sievp2i/${stage}`

const SOURCE_STAGE_API = API('restructure')
const DEST_STAGE_API = API('changeDateTime')

const sourceAxios = axios.create({
    baseURL: SOURCE_STAGE_API,
    headers: {
        'Authorization': `Bearer ${process.env.GCMS_PAT_SOURCE}`,
      }
})
const destAxios = axios.create({
    baseURL: DEST_STAGE_API,
    headers: {
        'Authorization': `Bearer ${process.env.GCMS_PAT_DEST}`,
      }
})

const destAxiosFileStack = axios.create({
    baseURL: `https://www.filestackapi.com/api`,
    headers: {
        "Content-Type": "application/json"
    }
})

const destAxiosImport = axios.create({
    baseURL: DEST_STAGE_API + "/import",
    headers: {
        "Content-Type": "application/json"
    }
})

const sourceAxiosExport = axios.create({
    baseURL: DEST_STAGE_API + "/export",
    headers: {
        "Content-Type": "application/json"
    }
})



export {sourceAxios, destAxios, destAxiosFileStack, destAxiosImport, sourceAxiosExport}