
const toast = document.querySelector("#toast");

const btnClose = document.querySelector("#btn-close");
btnClose.addEventListener("click", () => {
  toast.classList.add("hidden");
});
