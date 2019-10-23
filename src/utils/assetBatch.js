import qs from 'querystring'
import axios from 'axios'

import {
  destAxios,
  destAxiosImport
} from "./fetch";


const pattern = /\.com\/(.+)/;

const importNode = payload => ({ _typeName: "Asset", ...payload });

const batch = async args => {
  const {payload, read, update } = args;
  let errors = [];
  let batchImport = [];

  console.log(`Beginning batch of ${payload.length}`);


  // Batch process all the assets in the page
  for await (let entry of payload) {
    
    console.log(`Processing ${entry.id}`);
    
    // Set a timeout to help the server
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });

    // Check if Asset exists in Destination
    const readResponse = await destAxios({
    method: "POST",
      url: "",
      data: {
        query: read,
        variables: entry
      }
    });

    // Log errors
    if (readResponse.data.errors) {
      console.log("Error with ", entry.id);
    }

    // Get the data response
    const response = await readResponse.data.data;

    // If we have an asset response we'll update
    if (response && response.asset) {
      
        // If there were no updates to the file
        if (response.asset.updatedAt !== entry.updatedAt) {
        // Run Update Query
        console.log(`Updating to ${entry.id}`);
        const updateResponse = await destAxios({
            method: "POST",
          url: "",
          data: {
            query: update,
            variables: entry
          }
        });
      } else {
        console.log(`No updates for ${entry.id}`);
      }
    } else {
    // If we don't have an existing asset, we'll construct a node for batch import using the import    
    console.log("Uploading ", entry.url)

      // Await creating new asset handle
      console.log(`Updating new asset for ${entry.id}`);
      
      const queryparams = qs.stringify({
        key: process.env.GCMS_FILESTACK_DEST,
        url: entry.url,
        path: `/${process.env.GCMS_PROJECT_ID}-${process.env.GCMS_DEST_STAGE_NAME}/${entry.fileName}`
      })

      const fileStackResponse = await axios.post(`https://www.filestackapi.com/api/store/S3?${queryparams}`)

      const newHandle = await fileStackResponse.data.url.match(pattern)[1];

      console.log(`Queuing import for ${entry.id}`);

      delete entry.url
      
      batchImport.push({
        ...importNode(entry),
        handle: newHandle
      });
    }
  }

  if (batchImport.length) {
    console.log(`Importing batch`);

    const importData = await destAxiosImport({
        method: "POST",
      url: "",
      data: {
        valueType: "nodes",
        values: batchImport
      }
    });

    console.log(importData.data)
  }
  

  return errors;
};

export default batch;
