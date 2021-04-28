$(".search-input").focusin(function () {
  expandSource();
});

$(".search-input").focusout(function () {
  collapseSearch();
});

function collapseSearch() {
  $(".search-results-container").css("max-height", "0");
}

function expandSource() {
  $(".search-results-container").css("max-height", "60vh");
}

$(".main-navigation-container").scroll(function () {
  collapseSearch();
  $(".search-input").blur();
});
