const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findRepositoryIndex(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: "Repository not found." });
  }

  request.repositoryIndex = repositoryIndex;

  return next();
}

app.use("/repositories/:id", findRepositoryIndex);

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;

  const repositoryUpdated = {
    ...repositories[request.repositoryIndex],
    title,
    url,
    techs
  };

  repositories[request.repositoryIndex] = repositoryUpdated;

  return response.json(repositoryUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  repositories.splice(request.repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  repositories[request.repositoryIndex].likes += 1;

  return response.json(repositories[request.repositoryIndex]);
});

module.exports = app;