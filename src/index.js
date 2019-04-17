import "./style.scss";

const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

let oldScroll = window.scrollY;
setInterval(() => {
  const currentScroll = window.scrollY;
  const scrollSpeed = Math.abs(currentScroll - oldScroll);// lerp(oldScroll, currentScroll, 0.5);
  document.querySelector("header .logo").style.fontWeight = 900 - scrollSpeed * 20;
  document.querySelector("header .logo").style.transform = `scaleY(${1 + scrollSpeed/400})`;
  oldScroll = currentScroll;
}, 1000/60);

