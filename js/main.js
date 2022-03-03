// DOM querying for specific elements.
var $tryItBtn = document.querySelector('.try-it-btn');
var $newStoryPage = document.querySelector('.new-story');
var $landingPage = document.querySelector('.first-page');
var $newLink = document.querySelector('.new-link');
var $randomImg = document.querySelector('.random-art');
var $form = document.querySelector('form');
var $unorderedList = document.querySelector('ul');

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

function getRandomArtObject() {
  // Retrieving list of objects from the API
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=art');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
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
    // when the page loads this add event listener method will be called
    // which will in turn run the function to call the getRandomImg function
    // the getRandomArtImg function will then change the value or the src attr
    // to the value of objectData.response.primaryImage
    objectData.addEventListener('load', function () {
      getRandomArtImg(objectData.response.primaryImage);
    });
    objectData.send();
  });
  // sends the request to the API
  xhr.send();
}

// This function will take a url as a parameter and set that url to the
// image's src attribute value
function getRandomArtImg(url) {
  $randomImg.setAttribute('src', url);
}

// This function will allow a user to save their story and title along with
// the image that was the source of inspiration.

function handleSave(event) {
  // the formObj will be used to place an entry into the stories array that
  // is within the data model.
  var formObj = {};

  var title = $form.elements.title.value;
  var story = $form.elements.story.value;
  var photoAddress = $randomImg.src;

  formObj.title = title;
  formObj.story = story;
  formObj.photoAddress = photoAddress;
  formObj.storyId = data.nextStoryId;

  data.nextStoryId++;
  // here we will prepend the formObj into the data model's stories array
  data.stories.unshift(formObj);
  // now we need to reset the form's input values as well
  formObj.reset();

  // a story $entry is the return from the formObj being passed
  // as an argument in the newStory DOM creation function.
  // then we take that entry and prepend to the UL so that
  // the story is added to the top of the UL
  var $entry = newStory(formObj);
  $unorderedList.prepend($entry);
}

// this function will create a DOM tree from an entry
// that matches a story entry from the UL.
function newStory(entry) {
  var $listItem = document.createElement('li');
  $listItem.className = 'row';

  var $imgDiv = document.createElement('div');
  $imgDiv.className = 'column-half';
  $listItem.appendChild($imgDiv);

  var $img = document.createElement('img');
  $img.setAttribute('alt', 'random image');
  $img.setAttribute('src', entry.photoAddress);
  $imgDiv.appendChild($img);

  var $textColumnDiv = document.createElement('div');
  $textColumnDiv.className = 'column-half';
  $listItem.appendChild($textColumnDiv);

  var $storyTitle = document.createElement('h3');
  $storyTitle.className = 'library-title';
  $textColumnDiv.appendChild($storyTitle);

  var $storyPara = document.createElement('p');
  $storyPara.className = 'library-para';
  $textColumnDiv.appendChild($storyPara);

  return $listItem;
}

// This loop will create a DOM tree for each story entry in the data
// model and append it to the page when the DOMContentLoaded event fires
function handleRefresh(event) {
  for (var i = 0; i < data.stories.length; i++) {
    var $stories = newStory(data.stories[i]);
    $unorderedList.appendChild($stories);
  }
}
// when user clicks the try it button it swaps views and produces random image
$tryItBtn.addEventListener('click', handleClickRandomImage);
// when user clicks the new button it swaps views and gets a new image
$newLink.addEventListener('click', handleNewClick);
// when user clicks save it stores the users story, title, and image
$form.addEventListener('submit', handleSave);
// this event listener will be used for the DOMContentLoaded event
window.addEventListener('DOMContentLoaded', handleRefresh);
