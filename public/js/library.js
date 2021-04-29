function insertInTable(songs) {
  songs.forEach((song, i) => {
    if (song.album == "") {
      song.album = "-";
    }
    const row =
      "<tr><td>" +
      i +
      "</td><td>" +
      song.title +
      "</td><td>" +
      song.artist +
      "</td><td>" +
      song.album +
      "</td></tr>";
    $("tbody").html($("tbody").html() + row);
  });
}

function getLibraryDetails() {
  $.get("/library-details", function (data) {
    $(".disk-space").html(data.size + " MB");
    $(".song-count").html(data.songs.length);
    insertInTable(data.songs);
  });
}

getLibraryDetails();
