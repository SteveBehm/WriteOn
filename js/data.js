/* exported data */
var data = {
  view: 'landing-page',
  stories: [],
  editing: null,
  nextStoryId: 1
};

var previousStoriesJSON = localStorage.getItem('local-storage');

if (previousStoriesJSON !== null) {
  data = JSON.parse(previousStoriesJSON);
}

function handleBeforeUnload(event) {
  var localStorageData = JSON.stringify(data);
  localStorage.setItem('local-storage', localStorageData);
}

window.addEventListener('beforeunload', handleBeforeUnload);
