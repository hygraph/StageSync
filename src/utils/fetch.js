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


// Fetch upload url


export {sourceAxios, destAxios}