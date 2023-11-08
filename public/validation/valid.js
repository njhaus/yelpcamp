  'use strict'
    // FORM DOM ELEMENTS
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.getElementsByClassName('needs-validation')
    // Fetch image upload if it exists
    const imgUpload = document.getElementById('img-upload');
    const imgFeedback = document.getElementById("img-feedback");
    // Fetch existing images
    const existingImgs = Array.from(document.getElementsByClassName('existing-img'));
  const deleteImgChecks = Array.from(document.getElementsByClassName('delete-img-check'));
  // text fields
    const textAreas = Array.from(document.getElementsByTagName("textArea"));  
    const textFields = Array.from(document.getElementsByTagName('input')).filter(input => input.type === 'text');
    // Loading dialog
  const loadingDialog = document.getElementById("loading-dialog");
  // NO HTML dialog 
  const htmlDialog = document.getElementById("html-dialog");
  const htmlClose = document.getElementById("html-close");
    // measuring length constsnts (to avoid undefined errors when length doesn't exist)
    const existingImgCount = existingImgs.length || 0;

  
// Check that there is no html in text fields (exported to all form scripts)

  export function sanitizeHtml() {
      textFields.push(...textAreas);
    if (textFields.some(field => field.value.match(/[<>{}]|script/g, ''))) {
      htmlDialog.show();
      htmlClose.addEventListener("click", () => htmlDialog.close());
      return false;
    }
    else return true;
    }
  
  
    // Check amount of photos
    function checkPhotoAmount() {
        if (
          imgUpload.files.length +
            existingImgCount -
            deleteImgChecks.filter((chbx) => chbx.checked).length >
          5
        ) {
          imgFeedback.style.display = "block";
        } else {
          imgFeedback.style.display = "none";
        }
    }

    // Reset image upload feedabck
    if (imgUpload && imgFeedback) {
        imgFeedback.style.display = "none";
        imgUpload.addEventListener("change", () => {
            checkPhotoAmount();
      });
    }

    if (deleteImgChecks) {
        deleteImgChecks.forEach(checkbox => checkbox.addEventListener('change', () => {
            checkPhotoAmount();
        }))
    }

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            else if (sanitizeHtml() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            else if (
              imgUpload &&
              imgUpload?.files.length +
                existingImgCount -
                deleteImgChecks.filter((chbx) => chbx.checked).length >
                5
            ) {
              event.preventDefault();
              event.stopPropagation();
                if (imgFeedback) {
                imgFeedback.style.display = "block";
              }
            } else {
              const formElements = Array.from(form.querySelectorAll('input,textarea,button'));
              formElements.forEach(el => el.classList.add('faux-disabled'));
              loadingDialog.show();
              form.submit();
            }
            form.classList.add('was-validated')
        }, false)
    })
