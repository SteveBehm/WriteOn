/* exported data */
var data = {
  view: 'landing-page',
  stories: [],
  editing: null,
  nextStoryId: 1
};

// here we are gathering local storage from the previous visit or
// prior to the last refresh
var previousStoriesJSON = localStorage.getItem('local-storage');

// if the local storage was not empty then we update the data model
// with the previous data the user was using
if (previousStoriesJSON !== null) {
  data = JSON.parse(previousStoriesJSON);
}

// if it was empty then we stringify the data into a JSON string
// that can be storage before the user refreshes or loses the page
function handleBeforeUnload(event) {
  var localStorageData = JSON.stringify(data);
  localStorage.setItem('local-storage', localStorageData);
}

window.addEventListener('beforeunload', handleBeforeUnload);
