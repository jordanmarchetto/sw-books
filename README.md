This project is a server/frontend for a book/reading list/tracker.

It shows the list of canon Star Wars novels, and you can tick off which ones you've read as you go.

### Running the project

running `run.sh` should install the dev server/backend, build the docker image, run the image, install the frontend and run the frontend server.

To manually run each server: 

### /server

#### `npm dev`
Runs the node.js server which has all the koa-defined endpoints.

Server runs on :2223 (will run on 2222 inside the docker container).

On startup, it'll check for the books db table, and if it's not there, it'll create/populate it.


### /frontend

#### `npm dev`

Runs the app, but hits a local version of the node server running on 2223

#### `npm start`

Runs the app, but hits the docker version of the node server running on 2222
