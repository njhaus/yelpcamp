import { sanitizeHtml } from "../validation/valid.js";

const reviewForm = document.querySelector('#review-form');
const starButtons = Array.from(document.getElementsByClassName('star-rating'));
const sumbitReviewButton = document.querySelector('#review-btn')
const starFeedback = document.querySelector('#star-feedback');
const reviewText = document.querySelector('#review-text');
const reviewFeedback = document.querySelector("#review-feedback");

function checkStarReview() {
    if (!starButtons.find(star => star.checked)) {
        starFeedback.style.display = "block";
    }
    else if (reviewText.value.length < 10) {
        reviewFeedback.style.display = "block";
    }
    else {
        if (sanitizeHtml() === true) reviewForm.submit();
    }
}

sumbitReviewButton.addEventListener('click', checkStarReview);

starButtons.forEach(star => star.addEventListener('click', () => {
    starFeedback.style.display = "none";
}))

reviewText.addEventListener('change', () => {
    if (reviewText.value.length >= 10) {
      reviewFeedback.style.display = "none";
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
