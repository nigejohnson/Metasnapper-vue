# Metasnapper-vue

This is an example Progressive Web Application and simple no-build Vue framework application.  
It is a conversion to use the Vue JavaScript frontend framework of the plain HTML/JavaScript/CSS Progressive Web App here: https://github.com/nigejohnson/Metasnapper.  
Like that project, this project is also intended to demonstrate that it is possible to build a fully functional mobile application, which is also capable of working offline when there is no internet connection, using only JavaScript, HMTL and CSS, simply by conforming to Progressive Web Application approaches and standards.
The use case implemented is the adding of metadata to photos. Metadata is both bundled with the photos as a "metasnap" and also written into the JPEG of the photo itself, in accordance with JPEG standards, using a 3rd party JavaScript library. This use case enables the demonstration of the following application features:
-	Integration with hardware on the device: specifically, the camera (to take the photos) and GPS (to capture geolocation metadata).
-	Offline storage of data on the device itself, using indexedDB, specifically the photos and associated metadata.
-	Integration with a cloud-based web service, specifically an email sending service, to distribute the photos.
-	Graceful handling of situations where the email sending service is unavailable, e.g., due to lack of connectivity (*).
-	 Use of local offline storage to store configuration settings and diagnostic logging for the application itself.
However, the Metasnapper-vue project also demonstrates a very simple, no-build, implementation of the Vue Options API framework. It also does so on the basis of a strict set of pre-existing requirements, which were in no way biased to play to the strengths or weaknesses of Vue, and in a way where-by Metasnapper-vue Vue using code can be compared with the equivalent plain and purely "hand-cranked" JavaScript/HMTL/CSS code in the Metasnapper project, to allow a better understanding of Vue and of the possible advantages and disadvantages of Vue adoption. At the same time, though the adoption of Vue here is simple and lightweight, it includes implementations of Vue based routing to support navigations and of two-way Vue data-binding all the way from the page to indexedDB storage and back again. The intention is that the example code here should therefore be functional enough to be useful. 
> (* Unfortunately, due to the discontinuation of free Heroku hosting, the email sending service is currently unavailable. The email sending service is called Metasnapper-server, and the source code, built using the Node Express framework, is here: nigejohnson/Metasnapper-server (github.com). An alternative version, using the Node Hapi framework is here: nigejohnson/Hapi-metasnapper-server: A server for the "metasnapper" PWA proof of concept but written using the Hapi framework (github.com).) 

## Prerequisites
A git install so that the repo can easily be cloned locally, e.g., https://git-scm.com/download/win.
To host this application locally a local web server of some form is needed.
To satisfy this pre-requisite during development, the node http-server package was used, and this is also the package assumed by the local start cmd scripts.
The recommended prerequisites are therefore as follows:
-	A node and node package manager (npm) install, e.g., https://nodejs.org/en.
-	An install of the http-server package: "npm install http-server -g" at a command prompt.

## Setup
Git clone the repo to a suitable local folder: git clone https://github.com/nigejohnson/Metasnapper-vue.git

### Development
Install and use a suitable IDE. Visual Studio Code was used during the actual development.

### Test
To continue to work offline, a Progressive Web App needs to be cached by a local browser engine. The application therefore extensively caches itself locally. To see the effects of any changes you have made to the application, you must therefore do the following:
-	Add any new resources you have created to the list of "precacheResources" in the service-worker.js.
-	Update the "cacheName" in service-worker.js every time you want to test a change.
-	Ensure that the local web server hosting the application is running, so that it can redeploy the app to your browser.
-	Fully refresh the application in the browser (e.g., Ctrl-F5 twice).
-	To test that the application is functioning correctly offline, simply shutdown the local web server, and continue to test the application in the browser.

## Running in development
1.	Inspect the localstart.cmd, and make any edits necessary for your local environment (no edits should be necessary if you have installed the http-server package as your local web server).
2.	Open a command prompt in the root folder of the Metasnapper project, i.e., where the localstart.cmd file itself is located.
3.	Type localstart.cmd at the command line.
4.	Type http://localhost:8080 into a browser. The application should work in all modern, PWA complaint browsers such as Edge, Chrome, Safari/Webkit or Firefox. 
5.	If testing on a laptop rather than on a mobile device (such as a smartphone or an iPad) you won’t normally be able to take a photo, but you will be able to select an already existent image from your laptop instead.

## Running tests
There are currently no automated tests. Sorry: that just wasn't as interesting as the PWA features!

## Deploying to a device
This was being accomplished by hosting the application on Heroku, simply navigating to the URL of the Heroku hosted application in a browser on the target device, and following the device specific options for installing the app on the device's home screen (at which point the app becomes indistinguishable from any other mobile app). Simplified deployment is one of the big advantages of the PWA model. 
With the discontinuation of free Heroku hosting, however, this approach is currently not feasible. Alternatives are being sought.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

>Contains public sector information licensed under the Open Government licence v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.

