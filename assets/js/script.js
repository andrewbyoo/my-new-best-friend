var petFinderApiKey = "6MI42Rvs7RjJGQQTiwMErXRHg5hdT08iBt1zKyzysWnTt7BPzx";
var petFinderSecret = "qQWrLT0bSjdrEfmGEXO7xuBTx9SY5KdHCQ4v4GOf";
var theDogApiKey = "9af1f589-f293-4bba-8d9e-3ba9732efb0f";
var breedTextBox = document.getElementById("breed")
var zipCode = document.getElementById('zip');
var distance = document.getElementById('distance');
var savedDogs = document.getElementById('savedDogs');
var selectedDogInfo = document.getElementById('selectedDogInfo');
var selectedImage = document.getElementById('selectedImage');
var selectedName = document.getElementById('selectedName');
var selectedBreed = document.getElementById('selectedBreed');
var selectedTraits = document.getElementById('selectedTraits');
var selectedLifespan = document.getElementById('selectedLifespan');
var selectedURL = document.getElementById('selectedURL');
var dogImage = document.getElementsByClassName('dogImage');
var dogName = document.getElementsByClassName('dogName');
var dogBreed = document.getElementsByClassName('dogBreed');
var dogGender = document.getElementsByClassName('dogGender');
var dogAge = document.getElementsByClassName('dogAge');
var dogUrl = document.getElementsByClassName('dogUrl');
var dogListing = document.getElementById('dogListing');
var dogCard = document.getElementsByClassName('dogCard');
var aboutDog = document.getElementById('aboutDog');
var saveBtn = document.getElementById('saveBtn');
var savedDogsStorage = localStorage.getItem('savedDogs');

// On content load, puts the saved dogs list from local storage onto the html
document.addEventListener('DOMContentLoaded', function () {
  if (savedDogsStorage == null) {
    console.log('No saved dogs');
  } else {
    savedDogs.innerHTML = savedDogsStorage;
  }
})

// Function to call the Petfinder API
function callPetFinder() {

  dogListing.innerHTML = "";

  // Sets default zip code to Philadelphia if nothing is input
  var zipCodeValue = zipCode.value;
  if (zipCodeValue == "") {
    zipCodeValue = 19106;
  }

  // Sets distance to 100 miles if the any distance option is selected
  var distanceValue = distance.options[distance.selectedIndex].value;
  if (distanceValue == "any") {
    distanceValue = 100;
  } else (
    distanceValue = parseInt(distance.options[distance.selectedIndex].value)
  )

  // Fetch code referenced from https://gomakethings.com/using-oauth-with-fetch-in-vanilla-js/
  // Fetch to retrieve the Petfinder authorization tokens
  fetch('https://api.petfinder.com/v2/oauth2/token', {
    method: 'POST',
    body: 'grant_type=client_credentials&client_id=' + petFinderApiKey + '&client_secret=' + petFinderSecret,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function (response) {

    // Return the Petfinder authorization tokens
    return response.json();

  }).then(function (tokenData) {

    // Uses the returned authorization tokens to fetch Petfinder's API
    return fetch('https://api.petfinder.com/v2/animals?type=dog&location=' + zipCodeValue + '&distance=' + distanceValue, {
      headers: {
        'Authorization': tokenData.token_type + ' ' + tokenData.access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

  }).then(function(response){

	  // Return the API response as JSON
	  return response.json();

  }).then(function (petData) {

    // For loop creates a new dog card for each dog (1 page is up to 20 dogs)
    for (var i = 0; i < petData.animals.length; i++) {
      var newDogCard = document.createElement('article');
      var newCardImg = document.createElement('img');
      var newNameEl = document.createElement('h3');
      var dogImageOutput = petData.animals[i].primary_photo_cropped;
      var dogNameOutput = petData.animals[i].name;
      var dogBreedOutput = petData.animals[i].breeds.primary;
      var dogGenderOutput = petData.animals[i].gender;
      var dogAgeOutput = petData.animals[i].age;
      var dogUrlOutput = petData.animals[i].url;

      // Adds new elements, classes, and values for dog card container, image, and name
      dogListing.appendChild(newDogCard);
      dogListing.children[i].setAttribute('class', 'card dogCard');
      dogListing.children[i].addEventListener('click', individualCardClick);
      dogCard[i].appendChild(newCardImg);
      dogCard[i].children[0].setAttribute('class', 'section media dogImage');

      if (dogImageOutput == null) {
        dogImage[i].src = '';
        dogImage[i].alt = 'Photo unavailable';
      } else {
        dogImage[i].src = dogImageOutput.full;
      }

      dogCard[i].appendChild(newNameEl);
      dogCard[i].children[1].setAttribute('class', 'section double-padded dogName');
      dogName[i].innerHTML = 'Name: ' + dogNameOutput;

      // Adds 4 new p elements
      for (var j = 0; j < 4; j++) {
        var newPEl = document.createElement('p');
        dogCard[i].appendChild(newPEl);
      }

      // Sets class and value for the p tags
      dogCard[i].children[2].setAttribute('class', 'section single-padded dogBreed')
      dogBreed[i].innerHTML = 'Breed: ' + dogBreedOutput;
      dogCard[i].children[3].setAttribute('class', 'section single-padded dogGender')
      dogGender[i].innerHTML = 'Gender: ' + dogGenderOutput;
      dogCard[i].children[4].setAttribute('class', 'section single-padded dogAge')
      dogAge[i].innerHTML = 'Age: ' + dogAgeOutput;
      dogCard[i].children[5].setAttribute('class', 'section single-padded dogUrl hidden')
      dogUrl[i].innerHTML = dogUrlOutput;
    }
  });
}

// Function to retrieve the dog API information
function getBreedInfo(currentBreed, dogCardValues){

  var Url = "https://api.thedogapi.com/v1/breeds/search?q=" + currentBreed

    // Fetches the dog API information
    fetch(Url, {
      headers:{
        "x-api-key": theDogApiKey
      }
    }).then(function(response){
      return response.json()
    }).then(function(dataJson){

      // Get image, name, and breed from selected card
      var imageEl = dogCardValues.children[0].src;
      var nameEl = dogCardValues.children[1].textContent;
      var breedEl = dogCardValues.children[2].textContent;

      // Inputs the api information onto the html
      if(currentBreed == "Mixed Breed") {
        var temperamentEl = 'No temperament information available';
        var lifeSpanEl = 'No life span information available';
      } else {
        var temperamentEl = dataJson[0].temperament;
        var lifeSpanEl = dataJson[0].life_span;
      }

      var urlEl = dogCardValues.children[5].innerHTML
      selectedImage.src = imageEl;
      selectedName.innerHTML = nameEl.replace ('Name: ', '');
      selectedBreed.innerHTML =  breedEl;
      selectedTraits.innerHTML = 'Traits: ' + temperamentEl;
      selectedLifespan.innerHTML = 'Typical Life Span: ' + lifeSpanEl;
      selectedURL.href = urlEl;
    });
}


// Event listener and function for getting specific card info into the getBreedInfo function
var individualCardClick = function(event) {
  var dogCardValues = event.currentTarget;
  var currentBreed = dogCardValues.children[2].textContent
  currentBreed = currentBreed.replace('Breed: ', '')
  getBreedInfo(currentBreed, dogCardValues)
  selectedDogInfo.classList.remove('hidden');
};

// Function to save dogs to to local storage
function saveLocalStorage() {
  var savedDogBtnEl = document.createElement('button');
  var aboutDogContents = aboutDog.innerHTML;
  var selectedNameValue = selectedName.innerHTML;
  var dogCheck = document.getElementById(selectedNameValue);

  // Checks if a dog was previously saved
  if (dogCheck == null) {

    // If the dog was not previously saved
    // If there are less than 10 dogs in the list, adds the new dog
    if (savedDogs.children.length < 10) {
      savedDogs.prepend(savedDogBtnEl);
      savedDogs.firstChild.innerHTML = selectedNameValue;
      savedDogs.firstChild.id = selectedNameValue;
      savedDogs.firstChild.setAttribute('onClick', 'reply_click(this.id)')
    }

    // If there are more than 10 dogs in the list, removes the last dog and adds the new dog
    else {
      savedDogs.removeChild(savedDogs.lastChild);
      savedDogs.prepend(savedDogBtnEl);
      savedDogs.firstChild.innerHTML = selectedNameValue;
      savedDogs.firstChild.id = selectedNameValue;
      savedDogs.firstChild.setAttribute('onClick', 'reply_click(this.id)')
    }
  }

  // If the dog was previously saved, moves the existing button to the top of the list
  else {
    dogCheck.remove();
    savedDogs.prepend(savedDogBtnEl);
    savedDogs.firstChild.innerHTML = selectedNameValue;
    savedDogs.firstChild.id = selectedNameValue;
    savedDogs.firstChild.setAttribute('onClick', 'reply_click(this.id)')
  }

  // Sets local storage for the dog information saved and the saved dogs list
  localStorage.setItem(selectedNameValue, aboutDogContents);
  localStorage.setItem('savedDogs', savedDogs.innerHTML);
}

// Function to recall the dog information on click of any saved dogs
function reply_click(clicked_id){
  var recallId = document.getElementById(clicked_id);
  var savedDogValue = recallId.innerHTML;
  aboutDog.innerHTML =  localStorage.getItem(savedDogValue);
  selectedDogInfo.classList.remove('hidden');
}
