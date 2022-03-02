// DOM querying for specific elements.
var $tryItBtn = document.querySelector('.try-it-btn');
var $newStoryPage = document.querySelector('.new-story');
var $landingPage = document.querySelector('.first-page');
var $newLink = document.querySelector('.new-link');
var $randomImg = document.querySelector('.random-art');

/* Function to change view to new stiory if user clicks try it */
function handleClickRandomImage(event) {
  $landingPage.className = 'first-page container hidden';
  $newStoryPage.className = 'container new-story';
  getRandomArtObject();
}

/* Function to change view to new stiory if user clicks new link */
function handleNewClick(event) {
  $landingPage.className = 'first-page container hidden';
  $newStoryPage.className = 'container new-story';
  // below will get a new img if the user clicks on the new link
  getRandomArtObject();
}

// Retrieving list of objects from the API
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=art');
xhr.responseType = 'json';

function getRandomArtObject() {
  // below produces a random string version of an objectId that has an image value
  var objectIdArr = xhr.response.objectIDs;
  var randomObjectId = objectIdArr[Math.floor(Math.random() * objectIdArr.length)];
  var randomObjectIdString = randomObjectId.toString();

  // This API request is using the string version of the objectID to retrieve the actual
  // data on the specific object.
  // it is then going to take the primary img url and put it into the src value for
  // the random image when creating a story.
  var objectData = new XMLHttpRequest();
  objectData.open('GET', 'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + randomObjectIdString);
  objectData.responseType = 'json';

  function getRandomArtImg() {
    var imgURL = objectData.response.primaryImage;
    $randomImg.setAttribute('src', imgURL);
  }

  objectData.addEventListener('load', getRandomArtImg);
  objectData.send();
}

// when user clicks the try it button it swaps views and produces random image
$tryItBtn.addEventListener('click', handleClickRandomImage);
// when user clicks the new button it swaps views and gets a new image
$newLink.addEventListener('click', handleNewClick);
// listens for a load event to make a request to the API
xhr.addEventListener('load', getRandomArtObject);
// sends the equest to the API
xhr.send();
