const campgrounds = Array.from(document.getElementsByClassName('campground-card-container'));
const pageLinks= document.getElementById('page-links');
const pageLinksBottom = document.getElementById("page-links-bottom-container");

// Create pagination
let showNumber = 12;
let startPage = 1;

// Create page links
function showPageLinks(el) {
    const cgCount = campgrounds.length;
    if (cgCount > showNumber) {
        const pageLabel = document.createElement('p');
        pageLabel.classList.add('page-label');
        pageLabel.classList.add("mb-0");
        pageLabel.textContent = 'Results page: '
        el.append(pageLabel);
        for (let i = 0; i < Math.floor(cgCount / showNumber) + 1; i++) {
            const pageLink = document.createElement('a');
            pageLink.classList.add("page-link");
            pageLink.textContent = i + 1;
            el.append(pageLink);
        }
    }
}
showPageLinks(pageLinks);

// copy the links to the bottom
const pageLinks_copy = pageLinks.cloneNode(true);
pageLinks_copy.setAttribute("id", "page-links-bottom");
pageLinksBottom.append(pageLinks_copy);

// Make page links work and show the correct campgrounds -- doubled them to make the top nd bottom links work. Refactor this to make reusable.

const topLinks = Array.from(pageLinks.getElementsByClassName('page-link'));
if(topLinks.length > 0) topLinks[0].classList.add("visited");
if (topLinks.length > 0) topLinks[0].classList.add("current-page");

const bottomLinks = Array.from(pageLinksBottom.getElementsByClassName("page-link"));
if (bottomLinks.length > 0) bottomLinks[0].classList.add("visited");
if (bottomLinks.length > 0) bottomLinks[0].classList.add("current-page");

topLinks.forEach((link, index) => (link.addEventListener('click', () => {
    topLinks.forEach(link => link.classList.remove('current-page'));
    bottomLinks.forEach((link) => link.classList.remove("current-page"));
    link.classList.add('visited');
    link.classList.add('current-page');
    bottomLinks[index].classList.add('visited');
    bottomLinks[index].classList.add("current-page");
    showOnPage(index + 1)
    window.scroll({ top: 0, behavior: "instant" });
})))

bottomLinks.forEach((link, index) =>
  link.addEventListener("click", () => {
      bottomLinks.forEach((link) => link.classList.remove("current-page"));
      topLinks.forEach((link) => link.classList.remove("current-page"));
    link.classList.add("visited");
      link.classList.add("current-page");
      topLinks[index].classList.add("visited");
      topLinks[index].classList.add("current-page");
      showOnPage(index + 1);
      window.scroll({ top: 0, behavior: "instant" });
  })
);


    // Show campgrounds by page
function showOnPage(pg) {
    const startingPoint = showNumber * (pg - 1);
    const endPoint = startingPoint + showNumber;
    const show = campgrounds.slice(startingPoint, endPoint);

    campgrounds.forEach(cg => cg.classList.add('hidden'));

    show.forEach(cg => cg.classList.remove('hidden'));
}
showOnPage(startPage);


// Slide filters in and filter buttons
const filterOpen = document.getElementById('search-filter-btn');
const filterClose = document.getElementById('search-close-btn');
const filterContainer = document.getElementById('campground-search-container');



function toggleFilters(add, remove) {
    filterContainer.classList.add(add);
    filterContainer.classList.remove(remove);
}

filterOpen.addEventListener('click', () => {
    toggleFilters('open', 'close');
    filterClose.scrollIntoView({ behavior: 'smooth' });
});

filterClose.addEventListener("click", () => {
  toggleFilters("close", "open");
  filterOpen.scrollIntoView({ behavior: "smooth" });
});

