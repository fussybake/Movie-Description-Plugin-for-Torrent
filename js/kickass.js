"use strict";

function augmentKickass() {
	var opts = myOPT.opts;

	if (!opts.General.Integrate_with_Kickass) {
		console.log("Kickass is selected not to be integrated, skipping");
		return;
	}

	createOptionsBreadcrumbsNode().insertBefore($(".mainpart"));


	if (opts.General.Remove_adds) {
		console.log("[MAIN] Removing adds");
		$('#sidebar').remove();
		$('iframe').remove();
		$('.advertising').remove();
		$('.feedbackButton').remove();

	}
	if (!opts.General.Enable_augmenting){
		console.log("[MAIN] Augmenting has been disabled");
		return;
	}


	var resultSet = $('.mainpart').find("table").find("tbody").find(".firstr");

	var x = resultSet.children(1).first();
	x.removeClass("width100perc")
	x.addClass("width30perc")


	if (opts.FilmWeb.Integrate_with_FilmWeb) {
		resultSet.append("<th>" + prepateURLToOptions("FilmWeb") + "</th>");
	}
	if (opts.IMDB.Integrate_with_IMDB) {
		resultSet.append("<th>" + prepateURLToOptions("IMDB") + "</th>");
	}



	console.log("[MAIN] Begin of scanning");

	$('.mainpart').find("table").find("tbody").children().each(function(index) {
		if (index < 2) return;

		var titleNode = $(this).find(".torrentname .markeredBlock .cellMainLink");

		var originalTitle = titleNode.text();
		console.log("-------");
		console.log("[MAIN] New title: '" + originalTitle + "'");

		if (opts.Integration.Hide_Hindi_versions && isMovieAHindi(originalTitle)){
			console.log("movie '" + originalTitle + "' is HINDI - skipping display");
			$(this).hide(500);
			return;
		}
		
		if (opts.Integration.Hide_CAM_versions && isMovieACam(originalTitle)){
			console.log("movie '" + originalTitle + "' is CAM - skipping display");
			$(this).hide(500);
			return;
		}
		var cleanedTitle = getCleanTitleGeneric(originalTitle);
		if (cleanedTitle == null) {
			console.error("Torrent title is empty - looks like layout problem");
			return;
		}
		if (isMovieAlreadyBlacklisted(cleanedTitle)) {
			console.log("movie '" + cleanedTitle.title + "' is blacklisted");
			$(this).hide(500);
			return;
		}


		if (opts.FilmWeb.Integrate_with_FilmWeb) {
			var filmwebNode = $("<td>" + getAjaxIcon() + "</td>");
			$(this).append(filmwebNode);
			addFilmwebCell(filmwebNode, cleanedTitle);
		}
		if (opts.IMDB.Integrate_with_IMDB) {
			var imdbNode = $("<td>" + getAjaxIcon() + "</td>");
			$(this).append(imdbNode);
			addIMDBCell(imdbNode, cleanedTitle);
		}
		if (opts.Links.Add_links) {
			var linksNode = $("<td></td>");
			$(this).append(linksNode);
			addLinksCell(linksNode, originalTitle, cleanedTitle);
		}


	});

	console.log("[MAIN] End of scanning");


}