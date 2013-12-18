Movie Description for Torrent Chrome Extension 
=============================
Chrome extension to Pirate Bay &amp; Iso Hunt that integrates IMDB and/or FilmWeb description and movie ratings into torrent search results.

**version 0.2.7, Last update: 2013-12-18**

Use Cases
--------------
- Req: *As a torrent user, I am sick of those tons of adds, iframes and popups on my favorite torrens sites.* 

Res: Thanks to this plugin you can you can enable option to remove adds from torrent sites. It is not perfect, works with approx 90% of those stupid adds.

- Req: *I browse torrents sites in search or interesting movies to watch, but need to check with movie site for the movie title, since I don't want to watch crap!*

Res: This plugin automatically extracts movie title from torrent title and downloads movie description with rating from IMDB and/or FilmWeb.

- Req: *... and there are so many crappy movies it takes a lot of time to separate the wheat from the chaff.*

Res: This plugin can hide movies with low rating and promote movies with high rating.

- Req: *... and I've already watched so much movies, it takes a lot of time to find ones I haven't watched.*

Res: This plugin has a place call 'blacklist' where you can send the movie and it won't be visible in the following searches. Of course you can resurrect the movie from blacklist at any time.

- Req: *I am not a movie junkie, I just want quickly and easily search on Google, Google Images or IMDB with query being equal to torrent title.*

Res: You can enable 'Links' column with your favorite search site.

List of features
--------------
- Integrates with PirateBay and IsoHunt
- Adds additional column to torrent search results with description and movie rating from IMDB and/or FilmWeb. It performs some basic heuristic to extract movie title and perform ajax calls to get the data form movie site.
- Marks films with high rating to be better visible to the user
- Hides films with low rating not to be visible to the user (including CAM versions)
- Can hides movies with CAM version
- Adds additional column to search results with links to:  Google search, Google graphic, Filmweb, Imdb search for the original torrent title or movie title
- Keeps track and hides unwanted movies (blacklist)
- Removes adds

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
- fix problems with new adds on both PB & IsoHunt
- URLs on IMDB, need to either remove or remove "TODO"

EOF. Hope you like it !