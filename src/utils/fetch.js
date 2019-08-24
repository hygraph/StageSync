require('dotenv').config();
import axios from 'axios'
const API = (stage = 'master') =>
  `https://api-euwest.graphcms.com/v1/cjubekk561n9a01gh4sievp2i/${stage}`

const SOURCE_STAGE_API = API('restructure')
const DEST_STAGE_API = API('changeDateTime')

const sourceAxios = axios.create({
    method: "post",
    baseURL: SOURCE_STAGE_API,
    headers: {
        'Authorization': `Bearer ${process.env.GCMS_PAT_SOURCE}`,
      }
})
const destAxios = axios.create({
    method: "post",
    baseURL: DEST_STAGE_API,
    headers: {
        'Authorization': `Bearer ${process.env.GCMS_PAT_DEST}`,
      }
})

const destAxiosFileStack = axios.create({
    method: "post",
    baseURL: `https://www.filestackapi.com/api/store/S3?key=${process.env.GCMS_FILESTACK_DEST}`,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})

const destAxiosImport = axios.create({
    method: "post",
    baseURL: DEST_STAGE_API + "/import",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})


// Fetch upload url


export {sourceAxios, destAxios, destAxiosFileStack, destAxiosImport}