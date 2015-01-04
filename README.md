Movie Description Plugin for Torrent
=============================
Chrome Extension to 

 - The Pirate Bay 
 - Kickass

 torrent websites that integrates IMDB and/or FilmWeb description and movie ratings into torrent search results.

**version 0.2.9, last update: 2015-01-04**

Use Cases
--------------

- *I browse torrent sites in search or interesting movies to watch, but need to check with movies site like IMDB to check if the movie is interesting*

 This plugin automatically extracts movie title from torrent title and downloads movie description with rating from IMDB and/or FilmWeb.

- *... and there are so many bad movies it takes a lot of time to separate the wheat from the chaff.*

 This plugin can hide movies with low rating and promote movies with high rating.

- *... and I've already watched so many movies, it takes a lot of time to find ones I haven't watched.*

 This plugin has a place call 'blacklist' where you can send the movie and it won't be visible in the following searches. Of course you can resurrect the movie from blacklist at any time.
 
- *As a torrent website user, I don't like those tons of ads on the webpage* 

 This plugin can remove some adds of the torrent site. It is not perfect though.

- *I don't watch movies, I just want quickly and easily search on Google, Google Images or IMDB with query being equal to torrent title.*

 You can enable 'Links' column with your favorite search site.

List of features
--------------
- Adds column to torrent website search results with description and movie rating from IMDB and/or FilmWeb. It performs some basic heuristic to extract movie title and perform ajax calls to get the data form movie site.
- Marks films with high rating to be better visible to the user
- Hides films with low rating not to be visible to the user
- Hides movies with CAM version not to be visible to the user
- Hides Hindi movies not to be visible to the user
- Adds column to search results with links to:  Google search, Google graphic, Filmweb, Imdb search for the original torrent title or movie title
- Keeps track and hides unwanted movies (blacklist)
- Removes ads

Installation
--------------
- Download latest code, e.g: https://github.com/witoza/Movie-Description-Plugin-for-Torrent/zipball/master
- Navigate chrome to **chrome://extensions**
- Check the **Developer mode** toggle
- Click on **Load Unpacked Extension...**
- Select the folder containing the extension and load it
- Go to torrent site and enjoy it

Future work
--------------
- export/import movie list to plain file: watched & blacklisted
- fix expiring cache
- URLs on IMDB, need to either remove or remove "TODO"
- Hide Genre Animations

EOF.