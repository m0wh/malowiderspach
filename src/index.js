import { getProjects } from "./modules/data";

import "./style.scss";

const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

let oldScroll = window.scrollY;
setInterval(() => {
  const currentScroll = window.scrollY;
  const scrollSpeed = currentScroll - oldScroll;// lerp(oldScroll, currentScroll, 0.5);
  document.querySelector("header .logo").style.fontWeight = 900 - Math.abs(scrollSpeed) * 10;
  document.querySelector("header .logo").style.transformOrigin = scrollSpeed > 0 ? "bottom" : "top";
  document.querySelector("header .logo").style.transform = `scaleY(${1 + Math.abs(scrollSpeed)/100})`;
  oldScroll = currentScroll;
}, 1000/60);

// Get projects from API
getProjects().then(projects => {
  
  const projectsSection = document.querySelector("#work .projects");
  projects.forEach(project => {
    const li = document.createElement("li")
    const html = `
      <li class="project">
        <img class="project__cover" src="${ project.cover }" alt="${ project.name }"/>
        <p class="project__desc"><span class="project__name">${ project.name } —</span> ${ project.description }</p>
        <a class="project__link" href="${ project.url }" target="_blank">${ project.name } on Behance <span class="arrow">-></span></a>
      </li>
    `
    projectsSection.innerHTML += html;
  });

});
