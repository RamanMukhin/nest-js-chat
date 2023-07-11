## Description

**Simple chat app using Nest.Js + MongoDB**

## Installation

```bash
$ npm install
```

Provide your **mongo db connection url** as an enviroment variabel **DATABASE_HOST**. If you don't have mongoDB installed locally, and don't have accaunt on MongoDB Atlas with cloude managed database, your can deploy mongoDB locally using **docker** (you should have **already installed docker, docker-compose**). To perform it, **first of all** create in root dir **.env** file like **.env.example** (**just copy data from .env.example to .env**) and **then** in the project **root** dir run:

```bash
$ docker-compose up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
