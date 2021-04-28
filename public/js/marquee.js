function isElementOverflowing(element) {
  if (element.scrollWidth > element.clientWidth) return true;
}

var marqueeContainers = document.getElementsByClassName("marquee-container");

Array.prototype.forEach.call(marqueeContainers, function (container) {
  if (isElementOverflowing(container)) {
    container.classList.add("marquee");
  }
});
