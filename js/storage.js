var storage = chrome.storage.local;
var opts;

function getDefaultOptions() {
	return {
		General : {
			Enable_this_plugin : true,
			Integrate_with_PirateBay : true,
			Integrate_with_IsoHunt : true,
			Remove_adds_on_PirateBay_and_IsoHunt : true
		},
		Integration : {
			Download_one_movie_descryption_at_a_time : true,
			Display_detailed_informations : true
		},
		IMDB : {
			Integrate_with_IMDB : true,
			Mark_movies_with_rating_greater_or_equal_than : "6.5",
			Hide_movies_with_rating_less_than : "5.0",
			Expire_cache_after_hours : "48"
		},
		FilmWeb : {
			Integrate_with_FilmWeb : true,
			Fallback_to_IMDB_when_cant_find_movie : true,
			Mark_movies_with_rating_greater_or_equal_than : "7.0",
			Hide_movies_with_rating_less_than : "6.1",
			Expire_cache_after_hours : "48"			
		},
		Links : {
			Add_links : true,
			Add_Google_Search_link : true,
			Add_Google_Graphic_link : true,
			Add_Filmweb_link : true,
			Add_IMDB_link : true,
			Use_torrent_title_as_query_param : false,
			Use_movie_title_as_query_param : true
		}
	};
}

function resetOptions() {
	storage.remove('opts');
	storage.set({
		'opts' : getDefaultOptions()
	});
}

function updateOptions() {
	storage.set({
		'opts' : opts
	});
}