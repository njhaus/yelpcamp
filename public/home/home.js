// img fade in-out carousel
const imgs = Array.from(document.getElementsByClassName('home-img-container'));

 let current = 0;

 setInterval(() => {
   fadeCarousel(current);
 }, 5000);

const fadeCarousel = (curr) => {
  let next = current + 1 >= imgs.length ? 0 : current + 1;
  let last = current - 1 < 0 ? imgs.length - 1 : current - 1;
  imgs[curr].classList.remove("initial-img");
  imgs[curr].classList.add("fade-out");
  imgs[curr].classList.remove("fade-in");
  imgs[next].classList.add("fade-in");
  imgs[last].classList.remove("fade-out");
  if (curr + 1 >= imgs.length) current = 0;
  else current++;
}


const allElements = Array.from(document.getElementsByTagName('div', 'section', 'p', 'a', 'article'));
console.log(allElements)

allElements.forEach(el => el.addEventListener('click', () => console.log(el)))

// Styles

const nav = document.querySelector('nav');
nav.classList.add('home-nav');

const footer = document.querySelector("footer");
footer.classList.add("home-footer");