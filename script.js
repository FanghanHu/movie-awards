const OMDB_API_KEY = "b415e062";

const $nomineeList = $("#nominee-list");
const $results = $("#results");

$("#search-input").on("search", function (e) {
	const $searchBar = $(this);
	const input = $searchBar.val();
	$searchBar.val("");

	search(input);
});

function search(input, currentPage = 1) {
    $.ajax({
		url: `https://www.omdbapi.com/?s=${input}&page=${currentPage}&apikey=${OMDB_API_KEY}`,
		method: "GET",
	}).then(res => {
        if(res.Response === "True") {
            //empty search section
            $results.empty();

            //updage pagination
            const totalPages = Math.ceil(res.totalResults / 10);

            //add moviews
            for(const movie of res.Search) {
                const poster = movie.Poster;
                const title = movie.Title;
                const year = movie.Year;
                const id = movie.imdbID;

                const $movieCard = $(`
                    <div class="card bg-dark text-white movie-card">
						<img
							src="${poster}"
							alt="${title}"
							class="card-img"
						/>
						<div class="card-img-overlay">
							<div class="card-body">
								<div class="card-title">
									${title} (${year})
								</div>
							</div>
						</div>

						<button class="nominate-btn" data-id="${id}" onclick="nominate(this)">Nominate</button>
					</div>
                `);

                $results.append($movieCard);
            }
        } else {
            $results.text(res.Error);
        }
	});
}

function nominate(btn) {
    console.log($(btn).data("id"));
    //TODO: add a card to nominees seaction.
}

function createPagination(input, totalPages, currentPage=1) {
    
}