const searchForm = document.querySelector("#search-form");
const searchBtn = document.querySelector("#search-btn");
const citySearch = document.querySelector("#city-search");
const stateSearch = document.querySelector("#state-search");
const milesSearch = document.querySelector("#miles-search");
const invalidLocation = document.querySelector("#invalid-location");

// Check if there is a city entered but no state -- do not submit form and request a state be entered ()

function checkIfEmpty(input, dependency) {
  if (!input.value) dependency.setAttribute("disabled", true);
  else dependency.removeAttribute("disabled");
}

citySearch.addEventListener("change", () =>
  checkIfEmpty(citySearch, stateSearch)
);

stateSearch.addEventListener("change", () => {
  checkIfEmpty(stateSearch, milesSearch);
  milesSearch.value = 100;
  invalidLocation.classList.add('hidden');
});

// Send search terms as query to get request /campgrounds/search

const queryString = new URLSearchParams(new FormData(searchForm)).toString();

searchBtn.addEventListener("click", () => {
  if (citySearch.value && !stateSearch.value) {
    console.log(invalidLocation.classList)
    invalidLocation.classList.remove('hidden');
  } else {
    console.log("click");
    console.log(queryString);
    searchForm.submit(`/campgrounds/search/?${queryString}`);
  }
});
