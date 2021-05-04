const OMDB_API_KEY = "b415e062";

const $nomineeList = $("#nominee-list");
const $results = $("#results");
const $nav = $("#nav");

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
            //updage pagination
            const totalPages = Math.ceil(res.totalResults / 10);
            $nav.empty();
            $nav.append(createPagination(input, totalPages, currentPage));

            //empty search section
            $results.empty();
            //add moviews
            for(const movie of res.Search) {
                const poster = movie.Poster.startsWith("h")?movie.Poster:"http://placehold.it/200x300";
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
    const createPaginationButton = (text, targetPage) => {
        return $(`
            <li class="page-item${targetPage===currentPage?" active":""}${targetPage?"":" disabled"}"><button class="page-link" ${targetPage?`onclick="search('${input}', ${targetPage})"`:``}>${text}</button></li>
        `)
    }
    const $pagination = $(`
        <ul class="pagination">
        </ul>
    `);

    if(currentPage > 1) {
        $pagination.append(createPaginationButton("Previous", currentPage-1));
    }

    if(currentPage > 3) {
        $pagination.append(createPaginationButton(1, 1));
        $pagination.append(createPaginationButton("..."));
    }

    for(let i = 2; i > 0; i--) {
        if(currentPage - i > 0) {
            $pagination.append(createPaginationButton(currentPage - i, currentPage - i));
        }
    }

    $pagination.append(createPaginationButton(currentPage, currentPage));

    for(let i = 1; i <= 2 && currentPage + i <= totalPages; i++) {
        $pagination.append(createPaginationButton(currentPage + i, currentPage + i));
    }

    if(totalPages - currentPage > 2) {
        $pagination.append(createPaginationButton("..."));
        $pagination.append(createPaginationButton(totalPages, totalPages));
    }

    if(currentPage < totalPages) {
        $pagination.append(createPaginationButton("Next", currentPage+1));
    }

    return $pagination;
}