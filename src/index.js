import { Controller, Scene } from "scrollmagic";
import "scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap"
import { TweenMax } from "gsap";
import { Menu } from "./modules/distorsion-hover"
import { getProjects } from "./modules/data";

import "./style.scss";

const controller = new Controller();

let oldScroll = window.scrollY;
setInterval(() => {
  const currentScroll = window.scrollY;
  const scrollSpeed = currentScroll - oldScroll;
  document.querySelector("header .logo").style.fontWeight = 900 - Math.abs(scrollSpeed) * 10;
  document.querySelector("header .logo").style.transformOrigin = scrollSpeed > 0 ? "bottom left" : "top left";
  document.querySelector("header .logo").style.transform = `scale3d(1, ${1 + Math.abs(scrollSpeed)/400}, 1) skewY(${-scrollSpeed / 10}deg)`;
  oldScroll = currentScroll;
}, 1000/60);

const projectsList = document.querySelector("#work .projects");
const coversList = document.querySelector("#work .distort .covers");

// Get projects from API
getProjects().then(projects => projects.forEach(project => {
  const li = document.createElement("li"); // create the list item element
  li.classList.add("project");
  li.innerHTML = `<a href="${ project.url }" target="_blank" class="project__desc"><span class="project__name">${ project.name } —</span> ${ project.description } <span class="arrow">-></span></a>`;
  projectsList.appendChild(li); // append it to the list element
  coversList.innerHTML += `<image class="distort__cover" x="0" y="0" xlink:href="${ project.cover }" height="632" width="808" />`;
  
  // ScrollMagic & GSAP
  new Scene({ triggerElement: li, triggerHook: .8, reverse: false })
    .setTween(TweenMax.from(li.querySelector(".project__desc"), .5, { autoAlpha: 0, x: -100 }))
    .addTo(controller);
})).then(() => {
  new Menu("#work .distort", "#work .projects", ".project__desc");
});