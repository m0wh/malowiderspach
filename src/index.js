import { getProjects } from "./modules/data";

import "./style.scss";

const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

let oldScroll = window.scrollY;
setInterval(() => {
  const currentScroll = window.scrollY;
  const scrollSpeed = currentScroll - oldScroll;// lerp(oldScroll, currentScroll, 0.5);
  document.querySelector("header .logo").style.fontWeight = 900 - Math.abs(scrollSpeed) * 10;
  document.querySelector("header .logo").style.transformOrigin = scrollSpeed > 0 ? "bottom left" : "top left";
  document.querySelector("header .logo").style.transform = `scale3d(1, ${1 + Math.abs(scrollSpeed)/400}, 1) skewY(${-scrollSpeed / 10}deg)`;
  oldScroll = currentScroll;
}, 1000/60);

// Get projects from API
const projectsSection = document.querySelector("#work .projects");
getProjects().then(projects => projects.forEach(project => projectsSection.innerHTML += formatProject(project)));

const formatProject = ({ cover, name, description, url }) => `
  <li class="project">
    <img class="project__cover" src="${ cover }" alt="${ name }"/>
    <a href="${ url }" target="_blank" class="project__desc"><span class="project__name">${ name } —</span> ${ description } <span class="arrow">-></span></a>
    <!-- <a class="project__link" href="${ url }" target="_blank">${ name } on Behance <span class="arrow">-></span></a> -->
  </li>
`;