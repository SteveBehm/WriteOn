// DOM querying for specific elements.
var $tryItBtn = document.querySelector('.try-it-btn');
var $newStoryPage = document.querySelector('.new-story');
var $landingPage = document.querySelector('.first-page');
var $newLink = document.querySelector('.new-link');
var $libraryLink = document.querySelector('.library-link');
var $randomImg = document.querySelector('.random-art');
var $form = document.querySelector('form');
var $unorderedList = document.querySelector('ul');
var $storyLibrary = document.querySelector('.stories');

/* Function to change view to new stiory if user clicks try it */
function handleClickRandomImage(event) {
  $landingPage.className = 'first-page container hidden';
  $newStoryPage.className = 'container new-story';
  $storyLibrary.className = 'container stories hidden';
  getRandomArtObject();
  data.view = 'create-story';
}

/* Function to change view to new stiory if user clicks new link */
function handleNewClick(event) {
  $landingPage.className = 'first-page container hidden';
  $newStoryPage.className = 'container new-story';
  $storyLibrary.className = 'container stories hidden';
  // below will get a new img if the user clicks on the new link
  getRandomArtObject();
  data.view = 'create-story';
}

// this function will allow the user to go to the story library if they
// click on the library link
function handleLibraryClick(event) {
  $landingPage.className = 'first-page container hidden';
  $newStoryPage.className = 'container new-story hidden';
  $storyLibrary.className = 'container stories';
  data.view = 'story-library';
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
  event.preventDefault();
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
  $form.reset();

  // a story $entry is the return from the formObj being passed
  // as an argument in the newStory DOM creation function.
  // then we take that entry and prepend to the UL so that
  // the story is added to the top of the UL
  var $entry = newStory(formObj);
  $unorderedList.prepend($entry);

  $landingPage.className = 'first-page container hidden';
  $newStoryPage.className = 'container new-story hidden';
  $storyLibrary.className = 'container stories';
  // this will switch the view to the story library and set the data.view to
  // the correct view
  data.view = 'story-library';
}

// this function will create a DOM tree from an entry
// that matches a story entry from the UL.
function newStory(entry) {
  var $listItem = document.createElement('li');
  $listItem.className = 'row';
  $listItem.setAttribute('data-entry-id', entry.storyId);

  var $imgDiv = document.createElement('div');
  $imgDiv.className = 'column-half';
  $listItem.appendChild($imgDiv);

  var $img = document.createElement('img');
  $img.setAttribute('alt', 'random image');
  $img.setAttribute('src', entry.photoAddress);
  $img.className = 'img-styling random-art';
  $imgDiv.appendChild($img);

  var $textColumnDiv = document.createElement('div');
  $textColumnDiv.className = 'column-half';
  $listItem.appendChild($textColumnDiv);

  var $iconTitleDiv = document.createElement('div');
  $iconTitleDiv.className = 'edit-icon';
  $textColumnDiv.appendChild($iconTitleDiv);

  var $storyTitle = document.createElement('h3');
  var $storyTitleText = document.createTextNode(entry.title);
  $storyTitle.appendChild($storyTitleText);
  $storyTitle.className = 'library-title';
  $iconTitleDiv.appendChild($storyTitle);

  var $icon = document.createElement('i');
  $icon.className = 'fas fa-pencil-alt';
  $iconTitleDiv.appendChild($icon);

  var $storyPara = document.createElement('p');
  var $storyParaText = document.createTextNode(entry.story);
  $storyPara.appendChild($storyParaText);
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
  if (data.view === 'landing-page') {
    $landingPage.className = 'first-page container';
    $newStoryPage.className = 'container hidden new-story';
    $storyLibrary.className = 'container hidden stories';
  } else if (data.view === 'create-story') {
    $landingPage.className = 'first-page hidden container';
    $newStoryPage.className = 'container new-story';
    $storyLibrary.className = 'container hidden stories';
  } else if (data.view === 'story-library') {
    $landingPage.className = 'first-page hidden container';
    $newStoryPage.className = 'container hidden new-story';
    $storyLibrary.className = 'container stories';
  }
}

// when user clicks the try it button it swaps views and produces random image
$tryItBtn.addEventListener('click', handleClickRandomImage);
// when user clicks the new button it swaps views and gets a new image
$newLink.addEventListener('click', handleNewClick);
// when the user click the library link it will show the story library
$libraryLink.addEventListener('click', handleLibraryClick);
// when user clicks save it stores the users story, title, and image
$form.addEventListener('submit', handleSave);
// this event listener will be used for the DOMContentLoaded event
window.addEventListener('DOMContentLoaded', handleRefresh);
