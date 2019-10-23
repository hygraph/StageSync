require("dotenv").config();
import axios from "axios";

// Be sure to use your own API base here.
const PROJECT_ID = "ck1rvohw10be401df2et44uhy";

const API = (stage = "master") =>
  `https://api-euwest.graphcms.com/v1/${PROJECT_ID}/${stage}`;

// Add your own stage names here.
const SOURCE_STAGE_API = API("delta");
const DEST_STAGE_API = API("master");

const axiosCreate = (url, key) => 
  axios.create({
    baseURL: url,
    headers: {
      Authorization: `Bearer ${process.env[key]}`,
      "Content-Type": "application/json"
    }
  });

  const axiosCreateFileStack = (url) => 
  axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  });

const sourceAxios = axiosCreate(SOURCE_STAGE_API, "GCMS_PAT_SOURCE");
const destAxios = axiosCreate(DEST_STAGE_API, "GCMS_PAT_DEST");

const destAxiosFileStack = axiosCreateFileStack(
  `https://www.filestackapi.com/api/store/S3`
);

const sourceAxiosFileStack = axiosCreateFileStack(
  `https://www.filestackapi.com/api/store/S3`
);

const destAxiosImport = axiosCreate(
  DEST_STAGE_API + "/import",
  "GCMS_SYSTEM_DEST_IMPORT"
);

const destAxiosExport = axiosCreate(
  DEST_STAGE_API + "/export",
  "GCMS_SYSTEM_DEST_EXPORT"
);

const sourceAxiosImport = axiosCreate(
  SOURCE_STAGE_API + "/import",
  "GCMS_SYSTEM_SOURCE_IMPORT"
);

const sourceAxiosExport = axiosCreate(
  SOURCE_STAGE_API + "/export",
  "GCMS_SYSTEM_SOURCE_EXPORT"
);

export {
  sourceAxios,
  destAxios,
  destAxiosFileStack,
  sourceAxiosFileStack,
  destAxiosImport,
  destAxiosExport,
  sourceAxiosImport,
  sourceAxiosExport
};