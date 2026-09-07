function inverseMousePosition(element, event) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const res = {
    x1: -(x - rect.width / 2) / 20, // top left
    y1: -(y - rect.height / 2) / 20,
    x2: -(x - rect.width / 2) / 20, // top right
    y2: (y - rect.height / 2) / 20,
    x3: (x - rect.width / 2) / 20, // bottom left
    y3: -(y - rect.height / 2) / 20,
    x4: (x - rect.width / 2) / 20, // bottom right
    y4: (y - rect.height / 2) / 20
  };
  const resKey = "x" + (x < rect.width / 2 ? 1 : 2) + (y < rect.height / 2 ? 1 : 3);
  const tilt = res;
  return tilt !== undefined ? tilt : 0; // default to 0 if undefined
}

function handleClick(event) {
  const nav = document.querySelector('.nav');
  const target = event.target.parentNode;
  const width = target.offsetWidth;
  const { left } = target.getBoundingClientRect();
  const offsetLeft = left - nav.getBoundingClientRect().left;
  [...nav.querySelectorAll('li')].map(link => link.classList.remove('active'));
  event.target.parentNode.classList.add('active');
  nav.style.setProperty('--after-bg-position', offsetLeft);
  nav.style.setProperty('--after-radial-bg-position', (left + width / 2) - nav.getBoundingClientRect().left);
  nav.style.setProperty('--after-bg-width', width);
}

const nav = document.querySelector('.nav');
const links = nav.querySelectorAll('li a');
const mainUI = document.getElementById('main-ui');
const appScreen = document.getElementById('app-screen');

for (let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', handleClick);
  
  // NEW: Trigger the sliding animation and reveal preview
  links[i].addEventListener('click', () => {
    mainUI.classList.add('slide-down');
    appScreen.classList.add('visible');
  });

  links[i].addEventListener("mousemove", (event) => {
    const tilt = inverseMousePosition(event.target, event);
    nav.style.setProperty("--tilt-bg-y", tilt.x1 * 2); 
    nav.style.setProperty("--tilt-bg-x", tilt.y1 * 2); 
  });
}

// NEW: Function to close the preview (called by the Back button in the inner files)
window.closePreview = function() {
  mainUI.classList.remove('slide-down');
  appScreen.classList.remove('visible');
  
  // Clear the iframe after the animation finishes so it resets
  setTimeout(() => {
    appScreen.src = "";
  }, 800); 
};

['DOMContentLoaded', 'resize'].map(event => window.addEventListener(event, () => {
  const { width, left } = links[0].parentNode.getBoundingClientRect();
  for (let i = 0; i < links.length; i++) {
    links[i].parentNode.classList.remove('active');
  }
  links[0].parentNode.classList.add('active');
  const offsetLeft = left - nav.getBoundingClientRect().left;
  nav.style.setProperty('--after-bg-position', offsetLeft);
  nav.style.setProperty('--after-radial-bg-position', 0);
  nav.style.setProperty('--after-bg-width', width);
}));