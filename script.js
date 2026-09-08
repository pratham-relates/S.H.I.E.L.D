function inverseMousePosition(element, event) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const res = {
    x1: -(x - rect.width / 2) / 20,
    y1: -(y - rect.height / 2) / 20,
    x2: -(x - rect.width / 2) / 20,
    y2: (y - rect.height / 2) / 20,
    x3: (x - rect.width / 2) / 20,
    y3: -(y - rect.height / 2) / 20,
    x4: (x - rect.width / 2) / 20,
    y4: (y - rect.height / 2) / 20
  };
  return res !== undefined ? res : 0;
}

const nav = document.querySelector('.nav');
const links = nav.querySelectorAll('li a');
const mainUI = document.getElementById('main-ui');
const appScreen = document.getElementById('app-screen');

// Background map mapping for preview screens
const backgroundMap = {
  'home': 'Images/home.jpeg',
  'project': 'Images/3d.jpg',     // AR uses 3D Render's image
  'about': 'Images/training.png',
  'how': 'Images/ar.jpeg'         // 3D Render uses AR's image
};

function closePreview() {
  mainUI.classList.remove('slide-down');
  appScreen.classList.remove('visible');
  nav.classList.remove('has-selection');
  
  // Reset background back to main menu
  document.body.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('Images/main_menu.jpeg')";
  
  [...nav.querySelectorAll('li')].forEach(link => link.classList.remove('active'));
  
  setTimeout(() => {
    appScreen.src = "";
  }, 800);
}

for (let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', (event) => {
    const targetLi = event.target.parentNode;
    const linkId = event.target.id;

    // If the clicked tab is already active, toggle it closed
    if (targetLi.classList.contains('active') && mainUI.classList.contains('slide-down')) {
      event.preventDefault();
      closePreview();
      return;
    }

    // Otherwise, open/switch to this tab and update background image
    if (backgroundMap[linkId]) {
      document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('${backgroundMap[linkId]}')`;
    }

    const width = targetLi.offsetWidth;
    const { left } = targetLi.getBoundingClientRect();
    const offsetLeft = left - nav.getBoundingClientRect().left;

    [...nav.querySelectorAll('li')].forEach(link => link.classList.remove('active'));
    targetLi.classList.add('active');

    nav.classList.add('has-selection');
    nav.style.setProperty('--after-bg-position', offsetLeft);
    nav.style.setProperty('--after-radial-bg-position', (left + width / 2) - nav.getBoundingClientRect().left);
    nav.style.setProperty('--after-bg-width', width);
    
    mainUI.classList.add('slide-down');
    appScreen.classList.add('visible');
  });

  links[i].addEventListener("mousemove", (event) => {
    const tilt = inverseMousePosition(event.target, event);
    nav.style.setProperty("--tilt-bg-y", tilt.x1 * 2);
    nav.style.setProperty("--tilt-bg-x", tilt.y1 * 2);
  });
}

window.closePreview = closePreview;

window.addEventListener('resize', () => {
  const activeLi = document.querySelector('.nav li.active');
  if (activeLi) {
    const width = activeLi.offsetWidth;
    const { left } = activeLi.getBoundingClientRect();
    const offsetLeft = left - nav.getBoundingClientRect().left;
    nav.style.setProperty('--after-bg-position', offsetLeft);
    nav.style.setProperty('--after-radial-bg-position', (left + width / 2) - nav.getBoundingClientRect().left);
    nav.style.setProperty('--after-bg-width', width);
  }
});