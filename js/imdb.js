"use strict";

var imdbUrl = "http://www.imdb.com";

function getRatingFromIMDB(contentNode) {
	var rating = null;
	try {
		rating = contentNode.find(".star-box-details").children(":first").text();
		rating = parseFloat(rating);
	} catch (err) {
		console.warn("Can't extract imdb rating: " + err);
	}
	return rating;
}

function removeMetaHtmlAttrs(node, what) {
	var what = [ "id", "itemprop", "itemscope", "itemtype", "onclick" ];
	for ( var i in what) {
		node.find("*").removeAttr(what[i]);
	}
}

function extractDataFromMoviePage(n, movieId) {
	if (n.length == 0) {
		return $("<p>Can't extract data - looks like IMDB layout problem :(</p>");
	}
	n.find("#img_primary,#share-checkin,#share-popover,#prometer_container,#overview-bottom").remove();
	n.find("img").remove();
	n.find(".rightcornerlink,.star-box-rating-widget,.star-box-giga-star,.clear").remove();
	n.find("p:empty").remove();

	if (!myOPT.opts.Integration.Display_detailed_informations) {
		n.find(".txt-block").remove();
	}

	n.find("h4").each(function() {
		$(this).replaceWith($("<strong>" + $(this).text() + "</strong>"));
	});
	n.find("h1").each(function() {
		$(this).replaceWith($("<h3><a href='" + movieId + "'> " + $(this).text() + "</a><h3>"));
	});
	removeMetaHtmlAttrs(n);
	// WRONG: must be relative to movie URL, not imdb
	makeHrefAbsolute(imdbUrl, n);
	return $("<div>" + removeNewLines(n.html()) + "</div>");
}

function extractPossibleData(movieNode, data, movie) {
	var nodeHtml = "<div>";
	var mainNode = $(data).find("#main").find(".findSection:first").find("table.findList");

	// console.log(mainNode.html());

	var possibleMovies = [];
	mainNode.find("td.result_text").each(function() {
		var nThis = $(this);
		var titleTitle = nThis.text().trim();
		var wrongSections = [ "(TV Series)", "(TV Episode)", "(TV Movie)", "(TV Special)", "(Short)", "(Video Game)" ];
		if (containsAny(titleTitle, wrongSections)) {
			return;
		}

		var year = nThis.contents().filter(function() {
			return this.nodeType == Node.TEXT_NODE;
		}).text();

		if (movie.year) {
			if (year.indexOf(movie.year) == -1) {
				return;
			}
		}

		var mUrl = nThis.find("a[href^='/title/tt']").attr("href");
		possibleMovies.push(mUrl);
		nodeHtml = nodeHtml + "<div>" + $(this).html() + "</div>";
	});
	nodeHtml = nodeHtml + "</div>";
	if (nodeHtml.length < 20) {
		nodeHtml = "";
	}

	if (possibleMovies.length == 1) {
		console.log("[IMDB] there is only movie on main search, displaying that movie");
		callImdbForMovie(movieNode, movie, possibleMovies[0]);
		return null;
	}

	var contentNode = $(nodeHtml);
	makeHrefAbsolute(imdbUrl, contentNode);
	return contentNode;
}

function callImdbForMovie(movieNode, Movie, movieId) {

	var theUrl = imdbUrl + movieId;

	callAjax("callImdbForMovie", {
		url : theUrl,
		beforeSend : function(xhr) {
			console.log("[IMDB] callImdbForMovie with url=" + theUrl);
		},
		success : function(data) {
			var contentNode = $(data).find("#overview-top");
			contentNode = extractDataFromMoviePage(contentNode, movieId);

			var rating = getRatingFromIMDB(contentNode);
			contentNode.find("*").removeAttr("class");
			imdbCache.addMovie(Movie, contentNode.html(), rating);
			updateMovieSection(movieNode, contentNode.html(), Movie, rating, myOPT.opts.IMDB);

		},
		failure : function(data) {
			replaceWith(filmwebNode, "Can't connect to IMDB");
		}
	});

}

function callImdbForAnything(movieNode, Movie) {

	var params = {
		s : Movie.title
	};

	if (Movie.year == null) {
		params["q"] = Movie.title;
	} else {
		params["q"] = Movie.title + " (" + Movie.year + ")";
	}

	var theUrl = imdbUrl + "/find?" + $.param(params);

	callAjax("callImdbForAnything", {
		url : theUrl,
		beforeSend : function(xhr) {
			console.log("[IMDB] callImdbForAnything " + JSON.stringify(Movie) + " with url=" + theUrl);
		},
		success : function(data) {
			var contentNode = extractPossibleData(movieNode, data, Movie);
			if (contentNode != null) {
				var rating = getRatingFromIMDB(contentNode);
				contentNode.find("*").removeAttr("class");
				imdbCache.addMovie(Movie, contentNode.html(), rating);
				updateMovieSection(movieNode, contentNode.html(), Movie, rating, myOPT.opts.IMDB);
			}
		},
		failure : function(data) {
			replaceWith(filmwebNode, "Can't connect to IMDB");
		}
	});
}

function callImdbForSpecialTitle(movieNode, Movie) {

	var params = {
		title : Movie.title,
		title_type : "feature"
	};

	var theUrl = imdbUrl + "/search/title?" + $.param(params);

	callAjax("callImdbForSpecialTitle", {
		url : theUrl,
		beforeSend : function(xhr) {
			console.log("[IMDB] callImdbForSpecialTitle " + JSON.stringify(Movie) + " with url=" + theUrl);
		},
		success : function(data) {
			var content = $(data).find("#main").find("table").find(".title");
			if (content.length == 0) {
				callImdbForAnything(movieNode, Movie);
			} else {

				var movieId = null;
				content.each(function() {
					if (movieId != null) {
						return;
					}
					var linkNode = $(this).find("a[href^='/title/tt']");

					if (Movie.year == null) {
						movieId = linkNode.attr("href");
					} else {
						var yearNode = $(this).find(".year_type");
						var year = removeOnlyBrackets(yearNode.text());
						if (year.indexOf(Movie.year) >= 0) {
							movieId = linkNode.attr("href");
						}
					}
				});
				if (movieId != null) {
					callImdbForMovie(movieNode, Movie, movieId);
				} else {
					callImdbForAnything(movieNode, Movie);
				}
			}
		},
		failure : function(data) {
			replaceWith(filmwebNode, "Can't connect to IMDB");
		}
	});
}

function callImdbForFirstHit(movieNode, Movie) {

	var params = {
		s : Movie.title
	};

	if (Movie.year == null) {
		params["q"] = Movie.title;
	} else {
		params["q"] = Movie.title + " (" + Movie.year + ")";
	}

	var theUrl = imdbUrl + "/find?" + $.param(params);

	callAjax("callImdbForFirstHit", {
		url : theUrl,
		beforeSend : function(xhr) {
			console.log("[IMDB] callImdbForFirstHit: " + JSON.stringify(Movie) + " with url=" + theUrl);
		},
		success : function(data) {
			var contentNode = $(data).find("#overview-top");
			// when going to imdb redirects query is so uniq that it just
			// redirects to movie display page
			if (contentNode.length > 0) {
				contentNode = extractDataFromMoviePage(contentNode, "need_to_fix_this");
				var rating = getRatingFromIMDB(contentNode);
				contentNode.find("*").removeAttr("class");
				imdbCache.addMovie(Movie, contentNode.html(), rating);
				updateMovieSection(movieNode, contentNode.html(), Movie, rating, myOPT.opts.IMDB);
			} else {
				callImdbForSpecialTitle(movieNode, Movie);
			}

		},
		failure : function(data) {
			replaceWith(filmwebNode, "Can't connect to IMDB");
		}
	});

}

function callImdb(movieNode, movie) {

	var cachedMovie = imdbCache.getFromCache(movie);
	if (cachedMovie != undefined) {
		updateMovieSection(movieNode, cachedMovie.content, movie, cachedMovie.rating, myOPT.opts.IMDB);
	} else {
		callImdbForFirstHit(movieNode, movie);
	}
}