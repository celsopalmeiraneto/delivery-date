# Delivery Date

## How to run

After cloning the repository on your computer you should:

```
#install dependencies
yarn

#compile and run the project
yarn start
```

## Environment Variables

`PORT`: The port where the API will run. Defaults to 8000.

## The 'database'

All application data is loaded into memory in the 'boot' of the application.
To change the database change the contents of `mocks/db.csv`. **Don't forget to stop and run the application again.**

## The API

There is only one endpoint, the `/purchase-order`. You can take a look at a very primitive documentation at the `openapi.yaml`.

## The Architecture

### Domain Logic

All domain logic (or business rules) are implemented at `src/domain`.
These are the files reposible for getting the data somewhat "raw" transforming it in dialect the application "speaks", validating stuff and making the magic happens.
One thing the domain logic should not do is to access the database. This should be done exclusively at the Mapper level.

### Mappers

From all the Data Source access patterns my favorite is the Data Mapper. However, they are complicated and not suitable to all use cases. For this problem I decided to go with them but in the end they looked more like Row Data Gateways. For this case in specific they were good fits because the database is not a 1-1 relationship between DB rows and Objects. Mappers are great in grabbing data from different tables and rows and sources and putting together.

### Why TypeScript?

Typescript comes with a cost, however, in the medium-long run I think (just my observations, no controlled experiment here) it pays off. The type checking is great, helps avoiding a lot of pitfalls and TypeScript is flexible enough to still feel like JS.

## TODO

There are a lot of room for improvement.

- `src/index/ts` should be the entry point for all 'future' calls. Each API endpoint should implement a Router, with the correct marshalling and unmarshalling to the external world.
- Improve Mappers. They are powerful and beatiful.
- Create more integration tests.
