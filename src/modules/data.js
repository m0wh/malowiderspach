import { request } from 'graphql-request';

// https://api.mowh.fr/playground
const url = "https://api.mowh.fr/";

const getProjects = () => {
  const query = `{
    getUser(username: "mowh") {
      projects {
        name
        description
        url
        covers {
          size
          src
        }
      }
    }
  }`;
  
  return request(url, query).then(data => data.getUser.projects.map(project => {
    return {
      name: project.name,
      description: project.description,
      url: project.url,
      cover: project.covers.filter(({ size }) => size === "original")[0].src
    }
  }));
}


module.exports = { getProjects };