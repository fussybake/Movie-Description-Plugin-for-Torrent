var storage = chrome.storage.local;

var filmwebCache = new MovieCache('filmwebCache');
var imdbCache = new MovieCache('imdbCache');

function MovieCache(cacheName) {
	this.cacheName = cacheName;
	this.quietPeriodMs = 4000;
	this.content = null;
	this.saveTimer = null;
}

MovieCache.prototype.log = function(msg) {
	console.log("[" + this.cacheName + "] " + msg);
};

MovieCache.prototype.clean = function() {
	this.log("Cleaning cache");
	storage.remove(this.cacheName);
};

MovieCache.prototype.display = function() {
	var _this = this;
	storage.getBytesInUse(this.cacheName, function(result) {
		_this.log("Cache size in use: " + Math.round(result / 1024) + "KB out of 5 MB");
	});
};

MovieCache.prototype.reload = function(callBack) {
	var _this = this;
	_this.log("Loading cache");
	storage.get(this.cacheName, function(result) {
		if (result[_this.cacheName] != undefined) {
			_this.log("Cache is not empty");
			_this.content = result[_this.cacheName];
			_this.display();
		} else {
			_this.log("The cache is empty");
			_this.content = {};
		}
		callBack();
	});
};

MovieCache.prototype.saveCacheForReal = function() {
	this.log("Saving cache for real");
	var obj = {};
	obj[this.cacheName] = this.content;
	storage.set(obj);
};

MovieCache.prototype.save = function() {

	if (this.saveTimer != null) {
		clearTimeout(this.saveTimer);
	}
	var _this = this;
	this.saveTimer = setTimeout(function() {
		_this.saveCacheForReal();
	}, this.quietPeriodMs);
	
};

MovieCache.prototype.getMovieKey = function(Movie) {
	return Movie.title + "|" + Movie.year;
};

MovieCache.prototype.addMovie = function(Movie, _content, _rating) {
	key = this.getMovieKey(Movie);
	ts = new Date().getTime();
	this.log("Adding movie " + key + " to the cache with timestamp " + ts);

	this.content[key] = {
		content : _content,
		rating : _rating,
		timestamp : ts
	};
	this.save();
};

MovieCache.prototype.isTsOlderThanNHours = function(timestamp, hours) {
	del = new Date().getTime() - timestamp;
	del = del / 1000; // secs
	del = del / 1000; // mins
	del = del / 1000; // hours
	return del > hours;
};

MovieCache.prototype.removesMoviesOlderThan = function(hours) {
	this.log("Evicting movies from cache older than " + hours + " hours");
	var anyDeleted = false;
	for ( var movieKey in this.content) {
		if (this.isTsOlderThanNHours(this.content[movieKey].timestamp, hours)) {
			this.log("evicting movie '" + movieKey + "'");
			anyDeleted = true;
			delete this.content[movieKey];
		}
	}
	if (anyDeleted) {
		this.save();
	}
};

MovieCache.prototype.getFromCache = function(Movie) {
	key = this.getMovieKey(Movie);
	cm = this.content[key];
	if (cm != undefined) {		
		this.log("Cache hit for " + key);
	}
	return cm;
};