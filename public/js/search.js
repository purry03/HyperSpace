var searchText = "";

const defaultResult =
  '<h3 class="search-result-default">We couldn\'t find anything =(</h3>';

jQuery(".search-input").on("input", function () {
  searchText = $(".search-input").val();
  $.get("/search/" + searchText, function (results) {
    if (results.length == 0) {
      sendDefaultResult();
    } else {
      sendResults(results);
    }
  });
});

function sendDefaultResult() {
  $(".search-results-container").html(defaultResult);
}

function sendResults(results) {
  $(".search-results-container").html(" ");
  results.forEach((result) => {
    const resultTemplate =
      '<div class="search-result" onclick="changeSong(\'' +
      result.uid +
      '\')"><img class="search-result-cover" src="/img/cover.jpg" /><div class="search-result-text"><h3 class="search-result-title">' +
      result.title +
      '</h3><h6 class="search-result-artist">' +
      result.artist +
      "</h6></div></div>";
    $(".search-results-container").html(
      $(".search-results-container").html() + resultTemplate
    );
  });
}

$(".search-input").focusin(function () {
  expandSource();
});

$(".search-input").focusout(function () {
  if ($(".search-result").is(":focus")) {
    collapseSearch();
  }
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
