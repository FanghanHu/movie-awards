const OMDB_API_KEY = "b415e062";

const $nomineeList = $("#nominee-list");
const $results = $("#results");

$("#search-input").on("search", function (e) {
	const $searchBar = $(this);
	const input = $searchBar.val();
	$searchBar.val("");

    //search for user input
	const queryURL = "https://www.omdbapi.com/?s=" + input + "&apikey=" + OMDB_API_KEY;
	$.ajax({
		url: queryURL,
		method: "GET",
	}).then(res => {
        if(res.Response === "true") {
            for(const movie of res.Search) {
                const poster = movie.Poster;
                const title = movie.Title;
                const year = movie.Year;
                const id = movie.imdbID;
            }
        } else {
            $results.text(res.Error);
        }
	});
});
