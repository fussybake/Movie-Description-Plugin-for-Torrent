"use strict";

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

var current_page = 1;
var loading_status = 0;

function handle_infinite_scroll() {
	var opts = myOPT.opts;
	var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height(); 
	var scrolltrigger = 0.95;
	if  ((wintop/(docheight-winheight)) > scrolltrigger) { 
		
		var next_page = current_page + 1;
		if (loading_status != 0) {
			console.log("loading page " + next_page +" is in progress");
			return;
		}
		loading_status = 1;
		var main_part = $(".mainpart");	

		callAjax("", {
			beforeSend : function () {
				console.log("getting page: " + next_page);
			},
			url : "https://kickass.so/movies/" + next_page,
			success : function(data) {
				var main_part2 = $(data).find(".mainpart");
				impl(main_part2, opts);
				//main_part.find(".pages").remove();
				main_part.parent().append(main_part2);

		
				current_page = next_page;
				loading_status = 0; 
			},
			failure : function() {
				loading_status = 0;
			}
		});
	}
}

function addInfiniteScroll() {

	var path = window.location.pathname;

	if (path.indexOf("/movies/") == -1) {
		console.log("not adding infinite scroll");
		return;
	}
	// TODO: set current_page based on path

	var scroll_node = 
		'<script type="text/javascript"> ' 
		+'	$(document).ready(function(){ ' 
		+' 		$(window).scroll(function() { ' 
		+'   		handle_infinite_scroll(); '
		+' 		}); ' 
		+'	});' 
		+'</script>';

	$(window).append(scroll_node);
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

	addInfiniteScroll();

	var main_part = $(".mainpart");
	createOptionsBreadcrumbsNode().insertBefore(main_part);
	impl(main_part, opts);

}