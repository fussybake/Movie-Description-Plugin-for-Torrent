"use strict";


function isKickassMovies() {
	return window.location.pathname.indexOf("/movies/1/") >= 0;
}

function impl(main_part, opts) {

	main_part.find(".sidebarCell").remove();
	main_part.find(".advertising").remove();
	 

	var main_node = main_part.find("table.data:first").find("tbody");
	var resultSet = main_node.find(".firstr");

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

	main_node.children().each(function(index) {
		if (index < 1) return;

		var curr = $(this);

		var titleNode = curr.find(".markeredBlock .cellMainLink");

		var originalTitle = titleNode.text();
		console.log("-------");
		console.log("[MAIN] New title: '" + originalTitle + "'");

		if (opts.Integration.Hide_Hindi_versions && isMovieAHindi(originalTitle)){
			console.log("movie '" + originalTitle + "' is HINDI - skipping display");
			curr.remove();
			return;
		}
		
		if (opts.Integration.Hide_CAM_versions && isMovieACam(originalTitle)){
			console.log("movie '" + originalTitle + "' is CAM - skipping display");
			curr.remove();
			return;
		}
		var cleanedTitle = getCleanTitleGeneric(originalTitle);
		if (cleanedTitle == null) {
			console.error("Torrent title is empty - looks like layout problem");
			return;
		}
		if (isMovieAlreadyBlacklisted(cleanedTitle)) {
			console.log("movie '" + cleanedTitle.title + "' is blacklisted");
			curr.remove();
			return;
		}


		if (opts.FilmWeb.Integrate_with_FilmWeb) {
			var filmwebNode = $("<td>" + getAjaxIcon() + "</td>");
			curr.append(filmwebNode);
			addFilmwebCell(filmwebNode, cleanedTitle);
		}
		if (opts.IMDB.Integrate_with_IMDB) {
			var imdbNode = $("<td>" + getAjaxIcon() + "</td>");
			curr.append(imdbNode);
			addIMDBCell(imdbNode, cleanedTitle);
		}
		if (opts.Links.Add_links) {
			var linksNode = $("<td></td>");
			curr.append(linksNode);
			addLinksCell(linksNode, originalTitle, cleanedTitle);
		}


	});

	console.log("[MAIN] End of scanning");

}


function add_more_pages(page_nbr, max_pages, main_part, opts) {
	if (page_nbr >  max_pages) return;

	callAjax("", {
		beforeSend : function () {
			console.log("getting another page");
		},
		url : "https://kickass.so/movies/" + page_nbr,
		success : function(data) {
				var main_part2 = $(data).find(".mainpart");
				impl(main_part2, opts);
				//main_part.find(".pages").remove();
				main_part.parent().append(main_part2);

				add_more_pages(page_nbr + 1, max_pages, main_part, opts);
		}
	});

}

function augmentKickass() {
	var opts = myOPT.opts;

	if (!opts.General.Integrate_with_Kickass) {
		console.log("Kickass is selected not to be integrated, skipping");
		return;
	}

	if (opts.General.Remove_adds) {
		console.log("[MAIN] Removing adds");
		$('#sidebar').remove();
		$('iframe').remove();
		$('.feedbackButton').remove();

	}
	if (!opts.General.Enable_augmenting){
		console.log("[MAIN] Augmenting has been disabled");
		return;
	}


	var main_part = $(".mainpart");

	createOptionsBreadcrumbsNode().insertBefore(main_part);

	impl(main_part, opts);

	if (isKickassMovies()) {
		add_more_pages(2, 4, main_part, opts);
	}


}