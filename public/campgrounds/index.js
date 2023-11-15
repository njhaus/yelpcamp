const campgrounds = Array.from(document.getElementsByClassName('campground-card-container'));
const pageLinks = document.getElementById('page-links');

// Create pagination
let showNumber = 10;
let startPage = 1;

// Create page links
function showPageLinks() {
    const cgCount = campgrounds.length;
    if (cgCount > showNumber) {
        const pageLabel = document.createElement('p');
        pageLabel.classList.add('page-label');
        pageLabel.classList.add("mb-0");
        pageLabel.textContent = 'Results page: '
        pageLinks.append(pageLabel);
        for (let i = 0; i < Math.floor(cgCount / showNumber) + 1; i++) {
            const pageLink = document.createElement('a');
            pageLink.classList.add("page-link");
            pageLink.textContent = i + 1;
            pageLinks.append(pageLink);
        }
    }
}
showPageLinks();

// Make page links work and show the correct campgrounds

const links = Array.from(document.getElementsByClassName('page-link'));
if(links.length > 0) links[0].classList.add("visited");
if(links.length > 0) links[0].classList.add("current-page");

links.forEach((link, index) => (link.addEventListener('click', () => {
    links.forEach(link => link.classList.remove('current-page'));
    link.classList.add('visited');
    link.classList.add('current-page');
    showOnPage(index + 1)
})))

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

