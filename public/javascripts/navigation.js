var expanded = false;

function toggleNavState() {
  if (!expanded) {
    expanded = true;
    expand();
  } else {
    expanded = false;
    collapse();
  }
}

function expand() {
  $(".navigation-container").css("height", "70%");
  $(".main-navigation-container").css("overflow-y", "auto");
  $(".nav-control-button").attr("src", "/img/collapse.svg");
}

function collapse() {
  $(".navigation-container").css("height", "10%");
  $(".main-navigation-container").css("overflow-y", "hidden");
  $(".main-navigation-container").scrollTop(0);
  $(".nav-control-button").attr("src", "/img/expand.svg");
}
