---
layout: post
title: Creating tones in JavaScript
date: 2014-11-12 12:00:00
categories: posts
description: These are the chronicles of my journey around the internet in trying to discover how to create a chime sound effect for a simple puzzle game in JavaScript.
---

Creating a sound in the browser has gotten a lot easier since the days of the [early internet](http://www.instanet.com/). The days of flash games with blaring sound is basically behind us, and now the HTML5 spec provides us with the wonderful [`<audio>`](http://www.w3schools.com/html/html5_audio.asp) tags that we can use to make sounds play.

I had a specific sound in mind  &mdash; a subtle chime-like sound, similar to the one that can be heard in [Danny Miller](https://www.linkedin.com/pub/danny-miller/1/452/315)'s [Boomshine](http://www.k2xl.com/games/boomshine/). My other requirement was that the sound would have to be playable in different pitches.

I've documented my learning process and included my final solution in hopes to help people that have similar requirements.

## Finding the perfect sound

Unlike I anticipated, finding a sound to play was very difficult, probably because the sound I was looking for was so simple and common.

Imagine that you need a great picture of the outside of a [Tesla Model S](http://www.teslamotors.com/en_CA/models), because you wanna show your buddy how cool that car is. Now you Google "Tesla Model S" for hours and for some reason you only find picture of the interior of the car or [Nikola Tesla](https://en.wikipedia.org/wiki/Nikola_Tesla) instead. You might feel frustrated because you think this is something that should be easy to find, but isn't coming up even after hours of searching. This is how I felt.

I scoured through countless sites like  [Freesound](https://www.freesound.org/browse/tags/sound-effects/) and [SoundBible](http://soundbible.com/free-sound-effects-1.html) with no luck. Eventually I found [this sound](http://www.freesfx.co.uk/rx2/mp3s/9/10183_1367780535.mp3) on [freesfx.co.uk](http://www.freesfx.co.uk/) which was *almost* exactly what I wanted.

To someone who's musically talented, it might be easy to edit such a sound to play in different pitches, but I have very little experience in editing sounds.

I opened the sound up in Apple's [Garageband](https://en.wikipedia.org/wiki/GarageBand) and tried using online tools like [TwistedWave](https://twistedwave.com/online/) to precisely edit the pitch, with no luck. I found that the pitch of the sound can't be controlled with enough accuracy; most tools just provide a slider which only allows the user to approximate the resultant pitch.

## Creating the tone myself

Sooner or later I discovered that the sound I wanted was a [sine wave](https://en.wikipedia.org/wiki/Sine_wave), so it could theoretically be generated  in code.

Sites like [Online Tone Generator](http://onlinetonegenerator.com/) played an acceptable tone, but unfortunately only allowed me to save an audio file that was much too long for use as a sound effect.

I looked into the [WebAudio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html), a fascinating new piece of technology for the web. Unfortunately this solution [didn't give me much confidence](http://caniuse.com/#feat=audio-api) that it was cross-browser, and would leave many people unable to hear sounds.

Finally I stumbled upon [Riffwave](http://www.codebase.es/riffwave/), a beautiful piece of JavaScript that allows a user to create a .wav file on the fly and play it right in the browser using an `audio` element. The syntax is simple and it's a [cross-browser](http://caniuse.com/#feat=audio) solution.

## Playing a scale

I understood the basic science that changing the frequency of the wave would change the sound. Unfortunately I underestimated the difficulty I would experience while trying to create a [scale](https://en.wikipedia.org/wiki/Scale_(music)).

I observed that tones were [logarithmic](https://en.wikipedia.org/wiki/Logarithmic_scale); changing the frequency by a fixed value didn't always result in notes that fit well together.

After some time I found a Wikipedia article on [Piano key frequencies](https://en.wikipedia.org/wiki/Piano_key_frequencies), which contained a list of piano key frequencies as well as the formula with which they can be calculated.

Unfortunately the equation given calculated the frequencies for both black *and* white notes, even though I didn't want any sharps or flats played.

![Logarithmic scale of tone frequencies][scale-of-tone-frequencies]

At first I tried to graph the frequencies of the white notes only and calculate the formula for their line on a graph. The picture above is an actual picture of one of the graphs I created while trying to crack the magical formula for a scale.

When it became evident that there was no way to ignore the sharps and flats, I gave up and decided to create an array in code that contained a list of the frequencies that would be used in the game, which ended up being an exceptional solution.

## Fading out

There was a final problem with these tones &mdash; they were long and all ended abruptly; I needed a way to fade them out.

After some searching around I found a piece of elegant [code online](https://github.com/miohtama/Krusovice/blob/master/src/tools/fade.js) written by [Mikko Ohtamaa](http://opensourcehacker.com/).

In the future I may look at programmatically decreasing the volume of the sound in code by changing the formula for the sine wave where the .wav file is generated. Until then, fading the sound by changing the volume in steps is more than functional.

## Final product

Here's my finished code which heavily relies on Riffwave and Mikko's fade.js.

{% highlight javascript %}
var play(num) {
  var audio = new Audio(); // Create the HTML5 audio element
  var wave = new Riffwave();
  var data = [];
  var frequencies = [220,246.94,261.63,293.66,329.63,349.23,392,440,493.88,
  523.25,587.33,659.25,698.46,783.99,880,987.77,1046.50,1174.66,1318.51,
  1396.91,1567.98,1760,1975.53,2093,2349.32,2637.02,2793.83,3135.96,3520,
  3951.07];

  wave.header.sampleRate = 44100; // Set sample rate to 44KHz
  wave.header.numChannels = 1;

  // Cap the number so it's always within the frequency list
  num += frequencies.length/2;
  if(num > frequencies.length-1)
    num = frequencies.length-1;
  else if(num < 0)
    num = 0;

  var i = 0;
  while (i<100000) {
    var t = i/wave.header.sampleRate;
    data[i++] = 128+Math.round(127*Math.sin(frequencies[num]*t*2*Math.PI));
  }

  wave.make(data);
  audio.src = wave.dataURI;
  audio.volume = volume;
  fadeOut(audio, 250, 0, 1);
  audio.play();
}
{% endhighlight %}

## Summary

Adding a chime sound effect to a JavaScript game was a challenge in ways I'd never anticipated. HTML5's audio tag along with the simplicity of creating a sine wave tone with Riffwave and combining that with other publically available code allowed me to come up with a solution that was even more compatible and attractive than using the up-and-coming WebAudio API.

[scale-of-tone-frequencies]: ../../../../images/2014-11-12/scale-of-tone-frequencies.png "Logarithmic scale of tone frequencies"