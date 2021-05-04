const OMDB_API_KEY = "b415e062";

const $nomineeList = $("#nominee-list");
const $results = $("#results");
const $nav = $("#nav");
const $modal = $('#modal');
const $modalText = $("#modal-text");

const nominees = [];

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

async function nominate(btn) {
    const id = $(btn).data("id");

    if(nominees.length < 5) {
        if(!nominees.includes(id)) {
            nominees.push(id);
            $nomineeList.append(await createNomineeCard(id));
        } else {
            showMessage("You have already nominated this movie.");
        }
    } else {
        showMessage("You can only nominate 5 movies.");
    }
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

function showMessage(message) {
    $modalText.text(message);
    $modal.modal();
}

async function createNomineeCard(id) {
    const res = await $.ajax({
		url: `https://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}`,
		method: "GET"
	});

    if(res.Response === "True") {
        const poster = res.Poster.startsWith("h")?res.Poster:"http://placehold.it/200x300";
        const title = res.Title;
        const year = res.Year;
        const plot = res.Plot;
        const genre = res.Genre;
        const runtime = res.Runtime;

        return $(`
            <div class="card movie-nominee-card shadow m-3">
                <img
                    class="card-img-top"
                    src="${poster}"
                    alt="${title}"
                />
                <div class="card-body custom-scrollbar">
                    <div class="h4 card-title">${title} (${year})</div>
                    <div class="card-text">
                        <div class="text-muted">
                            ${runtime} - ${genre}
                        </div>
                        <div class="plot">
                            ${plot}
                        </div>
                    </div>
                    <button class="btn btn-danger w-100 mt-2">
                        Remove
                    </button>
                </div>
            </div>
        `);
    } else {
        showMessage(res.Error);
        return null;
    }
}