import { sanitizeHtml } from "../validation/valid.js";

const reviewForm = document.querySelector('#review-form');
const starButtons = Array.from(document.getElementsByClassName('star-rating'));
const sumbitReviewButton = document.querySelector('#review-btn')
const starFeedback = document.querySelector('#star-feedback');
const reviewText = document.querySelector('#review-text');
const reviewFeedback = document.querySelector("#review-feedback");
const editReviewText = document.querySelector("#edit-review-text");

// Validate reviews -- check if length is at least 10 characters and contains a rating
function checkStarReview() {
    console.log('fnction running')
    if (!starButtons.find(star => star.checked)) {
        starFeedback.classList.remove('hidden');
    }
    else if (reviewText.value.length < 10) {
        reviewFeedback.classList.remove('hidden');
    }
    else {
        if (sanitizeHtml() === true) reviewForm.submit();
    }
}

sumbitReviewButton.addEventListener('click', checkStarReview);

starButtons.forEach(star => star.addEventListener('click', () => {
    starFeedback.classList.add('hidden');
}))

reviewText.addEventListener('change', () => {
    if (reviewText.value.length >= 10) {
      reviewFeedback.classList.add('hidden');
    }
})


// Dialog to delete review
const dialogBtnDelRev = document.querySelector('#dialog-btn-del-rev');
const dialogShowRevBtns = Array.from(document.getElementsByClassName('dialog-show-rev'));
const dialogCnclRev = document.querySelector('#dialog-cncl-rev');
const dialogDelRev = Array.from(document.getElementsByClassName('dialog-del-rev'));

// delete review
if (dialogBtnDelRev) {
    dialogBtnDelRev.addEventListener('click', () => {
        dialogDelRev.forEach(dialog => dialog.close());
    })
}

if (dialogCnclRev) {
    dialogCnclRev.addEventListener('click', () => {
        dialogDelRev.forEach((dialog) => dialog.close());
    })   
}

if (dialogShowRevBtns) {
    for (let i = 0; i < dialogShowRevBtns.length; i++) {
      dialogShowRevBtns[i].addEventListener("click", () => {
        dialogDelRev[i].show();
      });
    }   
}

// Scroll to review when edit route is accessed
if (editReviewText) {
    editReviewText.scrollIntoView({ behavior: "instant" })
}