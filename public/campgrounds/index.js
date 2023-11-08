
const campgrounds = Array.from(document.getElementsByClassName('campground-card-container'));
const pageLinks = document.getElementById('page-links');

let showNumber = 10;
let page = 1;

function showOnPage() {
    const startingPoint = showNumber * (page - 1);
    const endPoint = startingPoint + showNumber;
    const show = campgrounds.slice(startingPoint, endPoint);

    campgrounds.forEach(cg => cg.classList.add('hidden'));

    show.forEach(cg => cg.classList.remove('hidden'));
    showPageLinks();
}
showOnPage();

function showPageLinks() {
    const cgCount = campgrounds.length;
    if (cgCount > showNumber) {
        const pageLabel = document.createElement('p');
        pageLabel.classList.add('page-label');
        pageLabel.textContent = 'Results page: '
        pageLinks.append(pageLabel);
        for (let i = 0; i < Math.floor(cgCount / showNumber) + 1; i++) {
            const pageLink = document.createElement('a');
            pageLabel.classList.add("page-link");
            pageLink.textContent = i + 1;
            pageLinks.append(pageLink);
        }
        pageLinks
    }
}