import { request } from 'graphql-request';

// https://api.mowh.fr/playground
const url = "https://api.mowh.fr/";

const getProjects = () => {
  const query = `{
    getUser(username: "mowh") {
      projects {
        name
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
      cover: project.covers.filter(({ size }) => size === "original")[0].src
    }
  }));
}


module.exports = { getProjects };