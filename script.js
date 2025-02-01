function searchMovie() {
  // Kosongin dulu
  $("#card-container").html("");

  // Jalankan AJAX :
  $.ajax({
    // Kalau ingin upload di github -> harus https
    url: "https://www.omdbapi.com",
    type: "get",
    dataType: "json",
    data: {
      apikey: "76063137",
      // Value search-input
      s: $("#search-input").val(),
    },
    // Kalau berhasil -> dapat Object {result} (udah di parsing)
    success: (result) => {
      console.log(result);

      if (result.Response == "True") {
        let fixResult = result.Search;

        // Lakukan forEach / di JQuery -> each
        // Ternyata -> Harus (index, Object) -> 2 argumen
        $.each(fixResult, (i, objFilm) => {
          // Ambil card-container
          $("#card-container").append(`
             <div class="card" data-aos="fade-up" data-aos-duration="800">
               <img src="${objFilm.Poster}" class="card-image" />
               <div class="card-description">
                 <p class="title">${objFilm.Title}</p>
                 <p class="year">${objFilm.Year}</p>
                 <a href="#" class="see-details" id="see-details" data-id-film="${objFilm.imdbID}">See Detail</a>
               </div>
             </div>
             `);
        });
      } else {
        $("#card-container").html(`<h2 class="not-found">${result.Error}</h2>`);
      }

      setTimeout(() => {
        $("#search-input").val("");
      }, 1000);
    },
  });
}

$(".search-button").on("click", () => {
  // Jalankan searchMovie
  searchMovie();
});

$("#search-input").on("keyup", (event) => {
  if (event.keyCode == 13) {
    // Jalankan searchMovie
    searchMovie();
  }
});

// Fitur see Details
/*Karena awalnya pasti belum ada maka : tangkap saja container dulu baru #see-detail*/
/*Pakai function(){} -> agar this dapat beroperasi*/
$("#card-container").on("click", "#see-details", function (event) {
  // Testing
  console.log($(this).data("id-film"));

  // Jalankan ajax lagi
  $.ajax({
    url: "https://www.omdbapi.com",
    type: "get",
    dataType: "json",
    data: {
      apikey: "76063137",
      // data-id-film -> nangkapnya : $(this).data('id-film')
      i: $(this).data("id-film"),
    },
    success: (resultDetail) => {
      console.log(resultDetail);
      if (resultDetail.Response === "True") {
        $("#container-detail").css("display", "flex");

        $("#card-container").append(`
        <div class="card-detail" id="card-detail">
          <p class="card-detail-title">Detail Film</p>
          <div class="card-detail-content">
            <img src="${resultDetail.Poster}" alt="" class="card-detail-image" />
            <div class="card-detail-list">
              <ul>
                <li class="title">${resultDetail.Title}</li>
                <li class="writer"><span>Writer :</span> ${resultDetail.Writer}</li>
                <li class="actor"><span>Actor :</span> ${resultDetail.Actors}</li>
                <li class="time"><span>Runtime :</span> ${resultDetail.Runtime}</li>
                <li class="year"><span>Released :</span> ${resultDetail.Released}</li>
              </ul>
            </div>
          </div>
          <div class="card-detail-button">
            <button class="card-detail-close" id="card-detail-close">close</button>
          </div>
        </div>
          `);
      }
    },
  });
  event.preventDefault();
});

// Ketika card-detail di close
// Ambil yang sudah ada dulu -> main
// Baru ambil yang baru datang -> card-detail-close
// $(".main").on("click", "#card-detail-close", () => {
//   $("#card-detail").remove();
//   $("#container-detail").css("display", "");
// });
$(".main").on("click", (event) => {
  if (
    $(event.target).is("#card-detail-close") ||
    $(event.target).is("#container-detail")
  ) {
    $("#card-detail").remove();
    $("#container-detail").css("display", "");
  }
});
