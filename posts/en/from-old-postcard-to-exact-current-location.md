---
id: "de-postal-antigua-a-ubicacion-exacta"
title: "From an Old Postcard to the Exact Current Location"
author: "juan-antonio-gonzalez-mena"
publishedDate: 2023-12-24
updatedDate: 2023-12-24
image: "https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-0.webp"
description: "OSINT investigation to determine the exact location of an old Italian postcard using image restoration techniques, reverse search, and geographic analysis."
categories:
  - "osint"
draft: false
featured: false
lang: "en"
---

The other day, while I was programming a couple of things, my sister went to see some Christmas stalls that had been set up in my city. Apparently, at one of them, she found inside a book a postcard presumably of Italian origin with the following photo:

![Old Italian postcard found in a book](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-1.avif)

When she showed it to me I said, hey, it would be cool to find the exact location. And that's basically what this article is about : )

- [References](#references)
- [Edit 01/02/2024 - GeoSpy AI](#edit-01022024---geospy-ai)

The first thing I did was take a photo with my phone (yes, ideally I should scan it, but I'm not rich enough to have a printer):

![Photograph of the old postcard with the phone](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-2.avif)

You can see how the photo is not only old, but also damaged, so the best thing to do is try to reconstruct it a bit to make it higher quality and easier to search through it. So what I did was use _[Cleanup.pictures](https://cleanup.pictures/)_:

![Cleanup.pictures interface for restoring images](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-3.avif)

This website allows you to clean objects from images in a super simple and quite efficient way. So I used it to remove the defects from the image through the brush it provides:

![Using the Cleanup.pictures brush to remove defects](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-4.avif)

![Cleaning process of the old postcard](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-5.avif)

Once I touched up a bit what I considered could be fixed, we went from this image:

![Original postcard with visible defects](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-6.avif)

To this:

![Postcard after cleaning with Cleanup.pictures](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-7.avif)

A cleaner image without so much damage. However, something common in old images is the "noise" they contain, so it would also be ideal to eliminate or fix this.

For this, nowadays there are multiple AI-powered tools that allow you to "recover old photos". The one I specifically used was _[jpghd](https://jpghd.com/)_ for the simple fact that I didn't have to register (I was lazy) and it was partially free. In addition, the result it provides without having paid is quite decent, at least for what I wanted.

![jpghd main page for restoring old photos](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-8.avif)

The use is quite simple, you upload the image:

![Uploading image to jpghd](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-9.avif)

And you define the configuration and changes you want to apply:

![Configuration options in jpghd](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-10.avif)

Since it's the free version, you can't tweak much either, but what you see in the image is enough.

Once you click "Start", you just wait for it to process, the higher the AI Enlarge (rescaling) we give it, the longer it will take, but it won't take more than 5 minutes:

![Restoration process started in jpghd](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-11.avif)

![Image processing progress bar](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-12.avif)

Once the process finished, it gave me the following result:

![Postcard restored with jpghd AI](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-13.avif)

A much sharper image, which doesn't mean it can look a bit artificial, but compared to what we had before:

![Comparison of the original unrestored postcard](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-14.avif)

It's much better now.

At this point, I've more or less solved the image damage and that old image feeling. Therefore, it's time to use the resulting image for searches.

The first thing I did was upload the image to _[labs.tib.eu](https://labs.tib.eu/geoestimation/)_, specifically to the "Geolocation Estimation" tool:

![Geolocation Estimation tool at TIB Labs](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-15.avif)

This tool consists of the following:

> GeoEstimation uses convolutional neural networks (CNNs) for geolocation estimation. By uploading a photo, the network visually analyzes the image to identify geographically distinctive features. The tool generates a heat map showing the most likely areas where the photo was taken, based on learning from a large dataset of geolocated images. Additionally, it uses "decision visualization" techniques to highlight the parts of the image that were most influential in the network's decision. Classification into indoor, natural, and urban environments helps refine the estimation. This technical approach leverages advances in deep learning and image analysis to predict locations based on visual features.
> 
> ChatGPT

At a practical level, the tool tries to determine possible locations of the image you uploaded:

![Geolocation analysis of the postcard](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-16.avif)

![Heat map showing possible location in Marseille](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-17.avif)

In this case, it indicates that it's quite sure it's Marseille, but I'll say right away that it's not, since, in addition, let's remember that the postcard was presumably of Italian origin.

Mind you, this doesn't mean this tool isn't good, in fact, for me it's one of the most powerful I know. For example, a while ago I gave a _[mini OSINT talk](https://github.com/draco-0x6ba/talks/blob/main/OSINT_El_Poder_de_la_Informacion_Publica.pdf)_ and I set the following challenge:

![Geolocation challenge of an image](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-18.avif)

In this case, if you uploaded this image, this tool gave you the exact and direct location of the place it was:

![Successful geolocation result with TIB Labs](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-19.avif)

So, simply for this case this tool was not the most suitable.

Since it didn't give me very good results, I chose to do a reverse image search on different search engines. I tried Yandex, Bing, Baidu, and Google, with Google being the one that gave me the best result in this case.

- Personally, regarding reverse image search, the ones I consider give the best results are Google and Yandex.

Anyway, what I did was upload the image to Google:

![Reverse image search on Google](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-20.avif)

![Initial results from Google Images search](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-21.avif)

And at first glance I didn't get very good results. It gave me similar buildings, but none that I would say, it fits or looks very similar.

So, what I did to try to refine the search a bit more is to use the crop tool that it provides:

![Google Images crop tool](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-22.avif)

I decided to remove a bit of the plant area at the bottom in case that could alter the search a bit with so much "green" in the image. When I did it, one of the results it provided was at least interesting:

![Search result showing similar postcard on eBay](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-23.avif)

It was a link to eBay where a postcard could be found. If we look closely, not only were the buildings quite similar to the buildings on my postcard:

![Postcard found on eBay with similar buildings](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-24.avif)

![Comparison of buildings between postcards](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-25.avif)

But also, in the product title I could find what appeared to be a place:

![eBay product title mentioning Monferrato](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-26.avif)

Since I had no idea, I just searched for it on Google:

![Search for Monferrato on Google](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-27.avif)

![Wikipedia information about Monferrato](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-28.avif)

Apparently it was a region of Italy. Here I said, okay, it fits very well knowing that my postcard is presumably of that origin.

Anyway, the "Monferrato" region is located and comprises approximately the following area:

![Map of the Monferrato region in Italy](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-29.avif)

The cities of Asti and Alessandria.

At this point, I said, okay, I can't look at every street in every town in the entire Monferrato region, well, I can, but I don't want to.

![Territorial extension of Monferrato](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-30.avif)

Anyway, trying to get a bit more information from my postcard image, I observed that in the background of it, you can see what appear to be trees, at a distance that is not close, but not far either:

![Trees visible in the background of the postcard](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-31.avif)

So, in a fairly crude way, I tried to highlight the "green borders" of the area, knowing that the place I was looking for had to be reasonably close to these lines:

![Delimitation of green zones on the Monferrato map](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-32.avif)

Likewise, I tried to cross out the most central parts that had less possibility of being it for the simple fact that they were quite far from the "green zones".

In addition to this, I wanted to see the satellite view of the place, because not all areas that are "white" (urban) mean there is a city, town, or whatever. Therefore, at a glance with the satellite view of Google Maps I wanted to see possible settlements that there were in the area:

![Google Maps satellite view of Monferrato](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-33.avif)

The number of possibilities was decreasing, since with the default view of Google Maps a lot of urban area could be seen.

To try to compare these two possible viewing modes a bit better, what I did was use _[Google Earth Pro](https://www.google.com/intl/es/earth/about/versions/)_, because one of the functionalities it provides is overlaying the map with an image:

![Image overlay functionality in Google Earth Pro](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-34.avif)

The crude image I had made, I overlaid it on Google Earth so that the places, roads, etc., matched. The interesting thing about this functionality is that you can modify the opacity of the image you have placed to be able to do a better analysis:

![Map overlay with adjustable opacity in Google Earth](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-35.avif)

At this point, I said, okay, I could use more information. I have the area where to look more or less, but I could use something more concrete.

Going back to the initial image:

![Analysis of the distinctive roof on the postcard](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-36.avif)

We can see how all the houses have a brick-colored roof (it's the most common) except the house we are looking for. Interesting to keep that detail in mind.

Also, in the image itself we can assume that the house is at the corner of two streets:

![House at the corner on the postcard](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-37.avif)

Therefore, having this extra information and knowing the areas where to look, I found a place that seemed to fit with the information we have:

![House found with dark roof on Google Maps](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-38.avif)

A house with a dark roof among many with "orange" roofs, and also, at a "corner".

Setting the "Street View":

![Street View of the found location](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-39.avif)

![Confirmation of the exact location in Street View](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-40.avif)

It seems that I indeed found the exact location of the postcard that my sister found in a random book at a random Christmas stall.

As a fact, the oldest image of the place that Google has saved is from 2010:

![Historical Street View image from 2010](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-41.avif)

And that's as far as the OSINT time I spent went, honestly quite fun ^^.

## References

I leave the links to tools mentioned/used throughout the post:

- _[Cleanup.pictures](https://cleanup.pictures/)_
- _[jpghd](https://jpghd.com/)_
- _[TIB Labs - Geolocation Estimation](https://labs.tib.eu/geoestimation/)_
- _[Google Earth Pro](https://www.google.com/intl/es/earth/about/versions/)_
- _[Flameshot](https://flameshot.org/)_
- _[Google Images](https://www.google.com/imghp?hl=es&authuser=0&ogbl)_

## Edit 01/02/2024 - GeoSpy AI

Hello again! I'm back here to show another interesting tool similar in practice to what we saw on _[labs.tib.eu](https://labs.tib.eu/geoestimation/)_:

_[DragonJAR's Tweet about GeoSpy AI](https://twitter.com/DragonJAR/status/1742196983220044045)_

It's _[GeoSpy AI](https://geospy.web.app/)_, in this case if we upload the restored image to this website:

![GeoSpy AI interface](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-42.avif)

![Geolocation analysis with GeoSpy AI](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-43.avif)

The website itself tells us that it corresponds to northern Italy. It also gives us some coordinates. In this case, the coordinates point to a place between Milan and Venice, which is not the exact correct place:

![GeoSpy AI result showing location in northern Italy](https://cdn.deephacking.tech/i/posts/de-postal-antigua-a-ubicacion-exacta/de-postal-antigua-a-ubicacion-exacta-44.avif)

But hey, in terms of approximation from the entire world, it almost hit the nail on the head, northern Italy.

And, who knows if the same thing happens as with _[labs.tib.eu](https://labs.tib.eu/geoestimation/)_, maybe this tool simply doesn't fully apply for this case, who knows how it will behave with other images, but it's definitely good to have it on the radar.
