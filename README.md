 Splashboard
 ===========
 Splashboard is an HTML5 app for displaying information in a pleasant way.

 Currently it can display the following information:

 * Local weather condition and temperature (U.S. only)
 * Time
 * Date
 * Photos (provided directly or from Picasa Album JSON feed)
 * Severe weather alerts (U.S. only)

Additionally, Splashboard supports a feature called nightmode, in which the
display goes dark.  

## How to Build

### Install dependencies
```
npm install
bower install
```

### Build
```
grunt build
```

### Deploy
Copy the files from the dist/ directory to your server.

## Usage

The fragment part of the url (after the '#') is how you specify a configuration
file.  There are four ways to specify configuration:

 * Zip code: http://example.com/spashboard/#90210
 * Config (called config.json) in Splashboard root: http://example.com/splashboard/#config
 * Relative path to config: http://example.com/splashboard/#/dir/config.json
 * Path to external server: http://example.com/splashboard/#//www.example.org/dir/config.json

## Config file

Example:
```JSON
{
    picasa: ['http://picasaweb.google.com/data/feed/base/user/112870609367691483673/albumid/5699371792810315905?alt=json&kind=photo&hl=en_US'],
    images: ['http://lorempixel.com/800/600/'],
    zip: 90210,
    delay: 5000,
    nightmode: [23, 6]
}
```
*picasa* - Picasa Web Album feed.  Make sure you use "alt=json"
*images* - URLs to images to display in addition to images found in any picasa album feeds
*zip* - Zip code used for weather and weather alerts
*delay* - How many miliseconds between displaying images
*nightmode* - Two element array.  First element is the hour in which nightmode starts, followed by the hour in which nightmode ends.

### Devices
Splashboard works on a number of different devices.  I run it frequently as a
screensaver on my Mac through WebSaver http://code.google.com/p/websaver

I'm also working on running it on Chumby powered devices, through a Chromeless
QtWebkit app.

## Roadmap
Here are some ideas I working on:
 * Monitor webcams and display webcam images on motion detection
 * Display of popup information
