Movie Description Plugin for The Pirate Bay
=============================
Chrome Extension to Pirate Bay that integrates IMDB and/or FilmWeb description and movie ratings into torrent search results.

**version 0.2.8, last update: 2014-089-21**

Use Cases
--------------
- *As a TPB website user, I don't like those ads on the page* 

 Thanks to this plugin you can you can enable option to remove ads on TBP site. It is not perfect, works with approx. 90% of those.

- *I browse TPB in search or interesting movies to watch, but need to check with movie site like IMDB for the movie, to check if movie is interesting for me*

 This plugin automatically extracts movie title from torrent title and downloads movie description with rating from IMDB and/or FilmWeb.

- *... and there are so many bad movies it takes a lot of time to separate the wheat from the chaff.*

 This plugin can hide movies with low rating and promote movies with high rating.

- *... and I've already watched so much movies, it takes a lot of time to find ones I haven't watched.*

 This plugin has a place call 'blacklist' where you can send the movie and it won't be visible in the following searches. Of course you can resurrect the movie from blacklist at any time.

- *I don't watch movies, I just want quickly and easily search on Google, Google Images or IMDB with query being equal to torrent title.*

 You can enable 'Links' column with your favorite search site.

List of features
--------------
- Integrates with PirateBay
- Adds additional column to torrent search results with description and movie rating from IMDB and/or FilmWeb. It performs some basic heuristic to extract movie title and perform ajax calls to get the data form movie site.
- Marks films with high rating to be better visible to the user
- Hides films with low rating not to be visible to the user (including CAM versions)
- Can hides movies with CAM version
- Adds additional column to search results with links to:  Google search, Google graphic, Filmweb, Imdb search for the original torrent title or movie title
- Keeps track and hides unwanted movies (blacklist)
- Removes ads

Installation
--------------
- Download latest code, e.g: https://github.com/witoza/movie-description-for-torrent-chrome-extension/zipball/master
- Navigate chrome to **chrome://extensions**
- Check the **Developer mode** toggle
- Click on **Load Unpacked Extension...**
- Select the folder containing the extension and load it
- Have fun !

Future work (TODO):
--------------
- export/import movie list to plain file: watched & blacklisted
- fix expiring cache
- fix problems with new adds on TPB 
- URLs on IMDB, need to either remove or remove "TODO"
- Hide Genre Animations

EOF.