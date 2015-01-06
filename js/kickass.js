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

function load_next_page(opts) {
	
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
			main_part2.append(make_load_more_movies_btn());
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

function get_movie_category_page_number(path) {
    
    var p = path.indexOf("/movies/");
    if (p == -1) return -1;
    var r = path.indexOf("/", p + "/movies/".length);
    if (r == -1) return 1; 
    return path.substring(p + "/movies/".length, r);

}

function make_load_more_movies_btn() {
	var node = $('<a href="javascript: return false;" class="load_more_movies turnoverButton siteButton bigButton">More...</a>');
	node.click(function() {
		load_next_page(myOPT.opts);
	});
	return node;
}


function handle_infinite_scroll() {

	$(document).ready(function() {
		$(window).scroll(function() {
			var opts = myOPT.opts;
			var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height(); 
			var scrolltrigger = 0.95;
			if  ((wintop/(docheight-winheight)) > scrolltrigger) { 
				load_next_page(opts);
			}
		});
	});
}

function addInfiniteScroll() {

	var path = window.location.pathname;
	current_page = parseInt(get_movie_category_page_number(path));

	if (current_page == -1) {
		console.log("not adding infinite scroll");
		return;
	}

	handle_infinite_scroll();
	$(".mainpart").append(make_load_more_movies_btn());
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
		$('.chat-bar').remove();
		$('.feedbackButton').remove();
	}

	var main_part = $(".mainpart");
	createOptionsBreadcrumbsNode().insertBefore(main_part);

	if (!opts.General.Enable_augmenting){
		console.log("[MAIN] Augmenting has been disabled");
		return;
	}

	addInfiniteScroll();
	
	impl(main_part, opts);

}