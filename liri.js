require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var action = process.argv[2];
var input = process.argv[3];

checkAction();

function checkAction() {

    // Twitter
    if (action === "my-tweets") {
        actionTweets();
    }

    // Spotify
    else if (action === "spotify-this-song") {
        actionSpotify();
    }

    // Movies
    else if (action === "movie-this") {
        actionMovies();
    }

    // Do this
    else if (action === "do-what-it-says") {
        actionDo();
    }
}

function actionTweets() {

    var params = {status: 'I am a tweet', count: 20};
    twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log("\nLatest Tweets:\n");
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at + " " + tweets[i].text);
            }
            console.log("\n-------------\n");
        }
    });
};

function actionSpotify() {

    spotify.search({ type: 'track', query: input, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        console.log("\nSpotify Data:\n");
        console.log("Track: " + data.tracks.items[0].name); 
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name); 
        console.log("Album: " + data.tracks.items[0].album.name); 
        console.log("Listen: " + data.tracks.items[0].album.external_urls.spotify); 
        console.log("\n-------------\n");
    })
};

function actionMovies() {

    if (!input) {
        input = "Mr. Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            console.log("\nIMDB Data:")
            console.log(
                "\nTitle: " + body.Title,
                "\nYear: " + body.Year,
                "\nIMDB Rating: " + body.imdbRating,
                "\nRotten Tomatoes Rating: " + body.Ratings[1].Value,
                "\nCountry: " + body.Country,
                "\nLanguage: " + body.Language,
                "\nActors: " + body.Actors,
                "\nPlot: " + body.Plot
            );
            console.log("\n-------------\n");
        }
    });
};

function actionDo() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        action = dataArr[0];
        input = dataArr[1];
        
        checkAction();
    });
};