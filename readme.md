# Syncing Content Between Stages

Note: This is a set of helpful utilities  and scripts to sync content between multiple stages of a project. To get a better understanding of when one should or even should-not be syncing content between stages, please refer to the tutorial at [Syncing Content Between Stages](https://graphcms.com/docs/tutorials/syncing-content-between-stages).

## The Strategy

We'll handle our sync in a three step process. Each step is composed of a two step process. We will read (and paginate) the response from the server. We'll send each page of data as a mutation via either an `upsert` query or an `import` method which will create nodes that do not exist, and update ones that do.

### Sync the Assets

Because assets touch a few external systems, we'll be syncing them first. This allows us to ensure that they are ready as we create or update our content models.

There's an inherent round-trip involved with syncing assets between the stages. The physical assets are stored in a "per-stage" bucket at our CDN. When a stage is deleted, the bucket is destroyed and the physical assets backing the image is gone. To sync across stages, we first need to check if an asset exists in our destination stage. If the asset exists, we can simply update the content. If it does not, we need to upload the asset to the correct destination bucket at the CDN, return the data, associate the new asset with the existing asset ID and then import that into our destination stage.

### Sync the Models (with asset relations)

In phase two we will sync all the models themselves. In my example I have Hotels, Destinations and Reviews. I've written read `queries` and upsert `mutations` for each type. The queries are sparse for the sake of example, but you can expand them as much as you need for the data you expect to change.

In my example, I only added a Twitter handle to my hotel schema.

The reason we do this with the API is that it allows us to handle any data transformations in-flight should we need to do some data cleansing.

### Connect the Relationships

The last phase is to connect all the relationships from our source stage to our destination stage once we've ensured all the nodes of our graph are present. Since this is not a data model to be changed, we'll use the import API.

### Next Steps

The complete step-by-step is available over at [Syncing Content Between Stages](https://graphcms.com/docs/tutorials/syncing-content-between-stages). You will need iInformation on creating system tokens, querying the management API and more which is covered in detail at the link.