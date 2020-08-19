const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, validate } = require("uuid");
const app = express();

app.use(express.json());
app.use(cors());


const repositories = [];

function checkValidUi (request,response,next) {
  const {id} = request.params
  console.log(id)
  if (!isUuid(id)){
    return response.status(400).json({error: 'N'})
  }

  return next()

}
app.use("/repositories/:id", checkValidUi)

app.get("/repositories", (request, response) => {
  
  return response.json(repositories) 

});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body

  const repository = {
    id: uuid(),title, url, techs, likes: 0
  }

  repositories.push(repository)

  return response.json(repository)

});

app.put("/repositories/:id", checkValidUi,(request, response) => {
  const id = request.params.id
  const {title, url, techs} = request.body

  const repoIndex = repositories.findIndex(repository => repository.id === id)

  if (repoIndex < 0)
    return response.status(400).json({message: 'Não foi possível realizar a operação'})

  const repository = {
    id, title, url, techs, likes: 0
  }

  repositories[repoIndex] = repository

  return response.status(200).json(repository)

});

app.delete("/repositories/:id", checkValidUi, (request, response) => {
  const id = request.params.id
  const repoIndex = repositories.findIndex(repository => repository.id == id)

  if (repoIndex < 0)
    return response.status(400).json({message: 'Não foi possível realizar a operação'})

  repositories.splice(repoIndex, 1)

  return response.status(204).send()

});

app.post("/repositories/:id/like", checkValidUi, (request, response) => {
  const id = request.params.id
  const repoIndex = repositories.findIndex(repository => repository.id == id)

  if (repoIndex < 0)
    return response.status(400).json({message: 'Não foi possível realizar a operação'})

  let repository = repositories[repoIndex]

  repository.likes += 1

  repositories[repoIndex] = repository

  return response.json(repository)

});

module.exports = app;
