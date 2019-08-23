# Syncing Content Between Stages

First things first, this is by far not the most robust solution it could be. If you are handling thousands of nodes with deeply nested relations, I would suggest looking to implement some type of queue system like Bull. For the low hundreds, this solution should get you fairly far. On that note, one could be more clever with the use of GraphQL tooling such as Apollo Server tooling and the like. For the sake of demonstrating how fully uncomplicated syncing of content can be, the following code base is mostly descriptive with a smantering of helpers.

## The Strategy

We'll handle our sync in a three step process. Each step is composed of a two step process. We will read (and paginate) the response from the server. We'll send each page of data as a mutation via an `upsert` query which will create nodes that do not exist, and update ones that do.

### Sync the Assets

Because assets touch a few external systems, we'll be syncing them first. This allows us to ensure that they are ready as we create or update our content models.

NEEDS WORD

### Sync the Models (with asset relations)

In phase two we will sync all the models themselves, a process for each type we have. In my example I have events, speakers, talks and conferences. I'll process each on individually.

The reason we do this with the API is that it allows us to handle any data transformations in the process should we need to do some data cleansing.

### Connect the Relationships

The last phase is to connect all the relationships from our source stage to our destination stage once we've ensured all the nodes of our graph are present.

### We need some keys

To get access to all the tokens we'll need, we need to first create some system tokens on the source and destination stages.

...create system tokens


Finally, we can use this query to get access to all the data we need. You'll associate each of these with an env variable in our .env file.

```gql
{
  viewer {
    project(id: "9dd68a66b75c406e85beb4dda1e8ccfe") {
      
      stages {
        name
        assetConfig {
          apiKey
        }
        permanentAuthTokens {
          name
          token
        }
        systemTokens {
          name
          token
        }
      }
    }
  }
}
``