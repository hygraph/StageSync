const FormData = require("form-data");
import {
  sourceAxios,
  destAxios,
  destAxiosFileStack,
  destAxiosImport
} from "./fetch";

const pattern = /\.com\/(.+)/;

const importNode = payload => ({ _typeName: "Asset", ...payload });

const batch = async args => {
  const { api, payload, read, create, update } = args;
  let errors = [];
  let batchImport = [];

  console.log(`Beginning batch of ${payload.length}`);

  for await (let entry of payload) {
    // Set a timeout to help the server

    console.log(`Processing ${entry.id}`);
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });

    // Check if Asset exists
    const readResponse = await destAxios({
      url: "",
      data: {
        query: read,
        variables: entry
      }
    });

    if (readResponse.data.errors) {
      console.log("Error with ", entry.id);
    }

    const response = await readResponse.data.data;

    if (response && response.asset) {
      
        if (response.asset.updatedAt !== entry.updatedAt) {
        // Run Update Query
        console.log(`Updating to ${entry.id}`);
        const updateResponse = await destAxios({
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
      const bodyFormData = new FormData();
      bodyFormData.append("url", entry.url);

      // Await creating new asset handle
      console.log(`Updating new asset for ${entry.id}`);
      const fileStackResponse = await destAxiosFileStack({
        url: "",
        data: bodyFormData
      });

      const newHandle = await fileStackResponse.data.url.match(pattern)[0];

      console.log(`Queuing import for ${entry.id}`);
      batchImport.push({
        ...importNode(entry),
        handle: newHandle
      });
    }
  }

  if (batchImport.length) {
    console.log(`Importing batch`);
    const bodyFormData = new FormData();
    bodyFormData.append("valueType", "nodes");
    bodyFormData.append("values", batchImport);

    const importData = destAxiosImport({
      url: "",
      data: bodyFormData
    });
  }

  return errors;
};

export default batch;
