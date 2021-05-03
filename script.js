const OMDB_API_KEY = "b415e062";

$("#search-input").on("search", function (e) {
	const $searchBar = $(this);
	const input = $searchBar.val();
	$searchBar.val("");

    //TODO: replace API KEY if it works
	const queryURL = "https://www.omdbapi.com/?s=" + input + "&apikey=trilogy&p=25";
	$.ajax({
		url: queryURL,
		method: "GET",
	}).then((res) => {

	});
});
