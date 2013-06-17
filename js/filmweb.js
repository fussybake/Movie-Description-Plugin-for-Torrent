"use strict";

var filmwebUrl = "http://www.filmweb.pl";

function getRatingFromFilmWeb(rate) {
	var rating = null;
	try {
		var e = rate.indexOf("/");
		rating = rate.substring(0, e);
		rating = rating.replace(new RegExp("\\,", "gi"), ".");
		rating = parseFloat(rating);
	} catch (err) {
		console.warn("Can't extract filmweb rating: " + err);
	}
	return rating;
}

function capitaliseFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function callFilmwebForExplicitMovie(movieNode, Movie, theUrl, callback) {
	callAjax("filmWebQueue2", {
		url : theUrl,
		beforeSend : function(xhr) {
			console.log("[FilmWeb] Call to extract movie from url=" + theUrl);
		},
		success : function(data) {

			// this is workaround for $(data).html() returns empty
			var b = data.indexOf("<div class=filmMainHeaderParent");
			var e = data.indexOf("<div class=filmPosterBox");
			if (b == -1 || e == -1) {
				updateMovieSection(movieNode, null, Movie, null, myOPT.opts.FilmWeb);
				callback(false);
				return;
			}
			data = data.substring(b, e);

			var contentNode = $(data);
			contentNode.find("script").remove();
			contentNode.find(".communityRate").remove();
			contentNode.find(".emptyPlotInfo").remove();
			contentNode.find(".hide").remove();
			contentNode.find(".rankAndWts").remove();
			makeHrefAbsolute(filmwebUrl, contentNode);

			console.log(contentNode.html());
			var det = {};

			var filmTitleNd = contentNode.find(".filmTitle");
			var mtitleNd = filmTitleNd.find("h1");

			det.titlePol = mtitleNd.text();
			det.href = mtitleNd.find("a").attr("href");
			det.titleAng = filmTitleNd.find("h2").text();
			det.year = filmTitleNd.find("#filmYear").text();

			det.time = contentNode.find(".filmTime").text();

			var mRatingNd = contentNode.find(".filmRateInfo");
			det.rate = mRatingNd.find(".filmRate").text();
			det.votes = mRatingNd.find(".votesCount").text();
			det.plot = contentNode.find(".filmPlot").text();
			if (!det.plot) {
				var altDesc = contentNode.find(".sep-hr").find("p");
				if (altDesc.html() != null) {
					det.plot = altDesc.html();
				}
			}

			var filmInfo = "";
			contentNode.find(".filmInfo").find("tr").each(function(i) {
				var th = $(this).find("th");
				var td = $(this).find("td");
				filmInfo = filmInfo + "<div><strong>" + capitaliseFirstLetter(th.text()) + "</strong>";
				td.find("a").each(function(i) {
					filmInfo = filmInfo + $(this).parent().html() + " ";
				});
				filmInfo = filmInfo + "</div>";

			});
			det.filmInfo = filmInfo;

			console.log("DETAILS = " + JSON.stringify(det));

			var movieHtml = "<h3><a href='" + det.href + "'>" + det.titlePol + " " + det.year + "</a></h3>";
			if (det.titleAng) {
				movieHtml = movieHtml + "Ang: <strong>" + det.titleAng + "</strong>";
			}
			movieHtml = movieHtml + "<div>" + det.time + "</div>";
			if (det.rate.indexOf("-") == -1) {
				movieHtml = movieHtml + "<div>Ratings:" + det.rate + " od " + det.votes + "</div>";
			}
			movieHtml = movieHtml + "<div><p>" + det.plot + "</p></div>";
			movieHtml = movieHtml + det.filmInfo;

			var rating = getRatingFromFilmWeb(det.rate);
			filmwebCache.addMovie(Movie, movieHtml, rating);
			updateMovieSection(movieNode, movieHtml, Movie, rating, myOPT.opts.FilmWeb);
			callback(true);

		},
		failure : function(data) {
			replaceWith(movieNode, "Can't connect to Filmweb");
		}
	});

}

function callFilmweb(movieNode, Movie, callback) {

	var cachedMovie = filmwebCache.getFromCache(Movie);
	if (cachedMovie != undefined) {
		updateMovieSection(movieNode, cachedMovie.content, Movie, cachedMovie.rating, myOPT.opts.FilmWeb);
	} else {

		var params = {
			q : Movie.title
		};
		if (Movie.year != undefined && Movie.year != null) {
			params["startYear"] = Movie.year;
			params["endYear"] = Movie.year;
		}

		var theUrl = filmwebUrl + "/search/film?" + $.param(params);

		callAjax("filmWebQueue", {
			url : theUrl,
			beforeSend : function(xhr) {
				console.log("[FilmWeb] Call to get " + JSON.stringify(Movie) + " with url=" + theUrl);
			},
			success : function(data) {
				var contentNode = $(data).find("#searchResult").find("li").first().find(".hitDescWrapper").children(":first")
						.children(":first");
				if (contentNode.length > 0) {
					var properUrl = filmwebUrl + contentNode.attr("href");
					callFilmwebForExplicitMovie(movieNode, Movie, properUrl, callback);
				} else {
					updateMovieSection(movieNode, null, Movie, null, myOPT.opts.FilmWeb);
					callback(false);
				}

			},
			failure : function(data) {
				replaceWith(movieNode, "Can't connect to Filmweb");
			}
		});

	}
}