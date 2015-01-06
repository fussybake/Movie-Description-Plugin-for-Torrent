"use strict";

var filmwebUrl = "http://www.filmweb.pl";

function getRatingFromFilmWeb(rate) {
	var rating = null;
	try 
	{
		var e = rate.indexOf("/");
		if (e == -1) 
			rating = rate;
		else
			rating = rate.substring(0, e);
		if (rate == "") return null;

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

function constructInfo(det) {
	var movieHtml = "<h3><a href='" + det.href + "'>" + det.titlePol + /*" " + det.year + */"</a></h3>";
	if (det.titleAng) {
		movieHtml = movieHtml + "Ang: <strong>" + det.titleAng + "</strong>";
	}
	if (det.rate != null) {
		movieHtml = movieHtml + "<div>Ratings: <strong>" + det.rate + "</strong> od " + det.votes + "</div>";
	}
	movieHtml = movieHtml + "<div><p>" + det.plot + "</p></div>";
	movieHtml = movieHtml + det.filmInfo;

	return movieHtml;
}

function fixFilmwebInfo(contentNode) {

	var filmInfo = "";
	contentNode.find("tr").each(function(i) {
		var th = $(this).find("th");
		var td = $(this).find("td");

		if (th.text() == "boxoffice:") return;
		if (th.text() == "nagrody:") return;

		filmInfo = filmInfo + "<div><strong>" + capitaliseFirstLetter(th.text()) + "</strong> ";
		td.find("a").each(function(i) {
			filmInfo = filmInfo + $(this).parent().html() + " ";
		});
		filmInfo = filmInfo + "</div>";

	});
	return filmInfo;

}

function callFilmwebForExplicitMovie(movieNode, Movie, theUrl, callback) {
	callAjax("filmWebQueue2", {
		url : theUrl,
		beforeSend : function(xhr) {
			console.log("[FilmWeb] Call to extract movie from url=" + theUrl);
		},
		success : function(data) {

			var contentNode = $(data).find(".filmMainHeaderParent .filmMainHeader");
			if (contentNode.length == 0) {
				updateMovieSection(movieNode, null, Movie, null, myOPT.opts.FilmWeb);
				callback(false);
				return;
			}

			makeHrefAbsolute(filmwebUrl, contentNode);

			var details = {};

			var filmTitle_node = contentNode.find(".hdr");

			details.titlePol = filmTitle_node.text();
			details.href = filmTitle_node.find("a").attr("href");
			details.year = filmTitle_node.find("span").text();
			details.titleAng = contentNode.find(".cap").text();
			details.plot = contentNode.find(".filmPlot").text();
			details.filmInfo = contentNode.find(".filmInfo");

			var ratingNode = $(data).find(".ratingInfo .boxContainer");

			details.rate = ratingNode.find(".nowrap").text();
			details.votes = ratingNode.find(".full-width").find("span").text();

			// and fix
			details.rate = getRatingFromFilmWeb(details.rate.trim());
			details.year = removeOnlyBrackets(details.year.trim());
			details.filmInfo = fixFilmwebInfo(details.filmInfo);

		//	console.info(details);

			var movieHtml =  "<div>" + constructInfo(details) + "</div>";
			filmwebCache.addMovie(Movie, movieHtml, details.rate);
			updateMovieSection(movieNode, movieHtml, Movie, details.rate, myOPT.opts.FilmWeb);
			callback(true);

		},
		failure : function(data) {
			replaceWith(movieNode, "Can't connect to Filmweb. Try again later");
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