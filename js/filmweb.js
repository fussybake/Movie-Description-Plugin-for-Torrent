function callFilmweb(opts, _movieNode, _movie) {

	var movieNode = _movieNode;
	var Movie = _movie;

	cachedContentNode = getFromCache(Movie);
	if (cachedContentNode != undefined) {
		updateMovieSection(opts, movieNode, $("<div></div>").append(cachedContentNode), Movie);
	} else {

		params = {
			q : Movie.title
		};
		if (Movie.year != undefined && Movie.year != null) {
			params["startYear"] = Movie.year;
			params["endYear"] = Movie.year;
		}

		var theUrl = "http://www.filmweb.pl/search/film?" + $.param(params);

		callOpts = {
			url : theUrl,
			beforeSend : function(xhr) {
				console.log("[FilmWeb] Call to get " + JSON.stringify(Movie) + " with url=" + theUrl);
			},
			success : function(data) {
				contentNode = $(data).find("#searchFixCheck").children(":first").find(".searchResultCol_2_wrapper");
				if (contentNode.length > 0) {
					console.log("[FilmWeb] Got data for " + JSON.stringify(Movie));
					makeHrefAbsolute("http://www.filmweb.pl", contentNode);
					addMovieToCache(Movie, contentNode.html());
				} else {
					console.log("[FilmWeb] There is no data for " + JSON.stringify(Movie));
				}
				updateMovieSection(opts, movieNode, contentNode, Movie);
			},
			failure : function(data) {
				replaceWith(movieNode, "Can't connect to Filmweb");
			}
		};

		if (opts.Integration.Download_one_movie_descryption_at_a_time) {
			$.ajaxq("filmWebQueue", callOpts);
		} else {
			$.ajax(callOpts);
		}
	}
}