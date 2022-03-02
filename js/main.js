var $tryItBtn = document.querySelector('.try-it-btn');
var $newStoryPage = document.querySelector('.new-story');
var $landingPage = document.querySelector('.first-page');
var $newLink = document.querySelector('.new-link');

/* Function to change view to new stiory if user clicks try it */
function handleClickRandomImage(event) {
  $landingPage.className = 'first-page container hidden';
  $newStoryPage.className = 'container new-story';
}

/* Function to change view to new stiory if user clicks new link */
function handleNewClick(event) {
  $landingPage.className = 'first-page container hidden';
  $newStoryPage.className = 'container new-story';
}

$tryItBtn.addEventListener('click', handleClickRandomImage);
$newLink.addEventListener('click', handleNewClick);
