// Dialog to delete entire campground
const dialogBtn = document.querySelector('#dialog-btn');
const dialogShow = document.querySelector('#dialog-show');
const dialogCncl = document.querySelector('#dialog-cncl');
const dialog = document.querySelector('#dialog');

// Delete campground
dialogBtn.addEventListener('click', () => {
    dialog.close();
})

dialogCncl.addEventListener('click', () => {
    dialog.close();
})

if (dialogShow) {
    dialogShow.addEventListener('click', () => {
        dialog.show();
    })
}
