function modalPopUp(id) {
  console.log(id);
  const className = `modal.${id}`;
  console.log(className);
  var x = document.getElementsByClassName(id);
  x[0].classList.add('is-visible');
  console.log(x)
  const closeEls = document.querySelectorAll("[data-close]");
  for (const el of closeEls) {
    el.addEventListener("click", function() {
      x[0].parentElement.parentElement.parentElement.classList.remove('is-visible');
    });
  }
}