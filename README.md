# Tijdloze Website frontend

This project contains the frontend of the [Tijdloze Website](https://tijdloze.stijnshome.be/). It is build as a single page application with [Vue.js](https://vuejs.org/) and the [Nuxt framework](https://nuxtjs.org/). There is a separate [API project](https://github.com/stijnvermeeren/tijdloze-api) that provides the backend.

The Tijdloze Website is maintained by [Stijn Vermeeren](https://github.com/stijnvermeeren). Other contributions to improve the functionality and/or the layout of the website are very welcome. Please reach out if you are interested in contributing.

## Development setup

### API and database

#### Using Docker Compose

To get started quickly, it is recommended to run the API and the database using [Docker Compose](https://docs.docker.com/compose/). A `docker-compose.yml` file to start two containers, one for the API and one for the database, is provided. The official images are hosted on Docker Hub as [stijnvermeeren/tijdloze-api](https://hub.docker.com/repository/docker/stijnvermeeren/tijdloze-db) and [stijnvermeeren/tijdloze-db](https://hub.docker.com/repository/docker/stijnvermeeren/tijdloze-db).

The database image comes with:
- All data about artists, albums, songs and list entries.
- Four dummy users from the `stijnvermeeren-tijdloze-dev.eu.auth0.com` Auth0 domain, all with password "_secret_":
  - `user1@example.com`
  - `user2@example.com`
  - `admin1@example.com` (Admin user) 
  - `admin2@example.com` (Admin user)

#### Manual setup

If you don't want to use the Docker images, it is also possible to build and run the API project from the source. Instructions can be found in the [tijdloze-api project](https://github.com/stijnvermeeren/tijdloze-api).

### Configuration

Copy the file `.env.example` to `.env` and adjust the variables accordingly.

The defaults in `.env.example` should work out-of-the-box when running the API using default Docker Compose file.

#### Available settings and defaults

The URI for the API can be different on the client side (i.e. in the browser of a visitor of the website) and on the server side (i.e. in the Node.js process running Nuxt).
- `API_URI_CLIENT=http://localhost:9000/`
- `API_URI_SERVER=http://localhost:9000/`

The Tijdloze Website is designed to work with [Auth0](https://auth0.com/) for authentication and authorization. An Auth0 domain `stijnvermeeren-tijdloze-dev.eu.auth0.com` has been set up that can be used for development purposes (though without the ability to create new users beyond the ones listed above under _API and database_). To use your own Auth0 domain, these settings must be adjusted accordingly. 
- `AUTH0_CLIENT_ID=bDIm5fEwDBV0IBv5tRb48IPwLhFeysSB`
- `AUTH0_CLIENT_DOMAIN=stijnvermeeren-tijdloze-dev.eu.auth0.com`
- `AUTH0_CALLBACK_URI=http://localhost:3000/auth/callback`
- `AUTH0_LOGOUT_URI=http://localhost:3000/`
- `AUTH0_AUDIENCE=dev.tijdloze.stijnshome.be`

An optional [Google Analytics](https://analytics.google.com/analytics/web/#/) ID can be provided to activate web tracking.
- `GOOGLE_ANALYTICS_ID=` 

### Install all dependencies

Run `npm install`.

### Start the application in development mode

Run `npm run dev`. The application will be accessible at [localhost:3000](http://localhost:3000/).

## Production setup recommendations

Recommendations for running this application in a production environment can be found in [Production.md](Production.md). 
