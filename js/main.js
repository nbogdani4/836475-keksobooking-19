'use strict';

var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var ADVERTISEMENTS_COUNT = 8;
var X_MIN = 0;
var X_MAX = document.querySelector('.map').clientWidth;
var Y_MIN = 130;
var Y_MAX = 630;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var advertisementsMap = document.querySelector('.map');
advertisementsMap.classList.remove('map--faded');

function genRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomValue(arr) {
  var rand = genRandomNumber(0, arr.length - 1);
  return arr[rand];
}

function getRandomLength(arr) {
  var maxLength = genRandomNumber(1, arr.length);
  return arr.slice(0, maxLength);
}

function addLeadingZero(number) {
  return (number < 10 ? '0' : '') + number;
}

function correctPinLocationX(x, pinWidth) {
  var correctLocation = x - (pinWidth / 2);
  if (x < (pinWidth / 2)) {
    correctLocation = X_MIN;
  } else if (x > X_MAX - (pinWidth / 2)) {
    correctLocation = X_MAX - pinWidth;
  }
  return correctLocation;
}

function correctPinLocationY(y, pinHeight) {
  var correctLocation = y - pinHeight;
  if (correctLocation < Y_MIN) {
    correctLocation = Y_MIN;
  }
  return correctLocation;
}

function genAdvertisement(num) {
  var advertisement = {

    'author': {
      'avatar': 'img/avatars/user' + addLeadingZero(num) + '.png',
    },

    'offer': {
      'title': 'Заголовок ' + addLeadingZero(num),
      'address': '600, 350',
      'price': 350,
      'type': getRandomValue(OFFER_TYPES),
      'rooms': 6,
      'guests': 3,
      'checkin': getRandomValue(TIMES),
      'checkout': getRandomValue(TIMES),
      'features': getRandomLength(FEATURES),
      'description': 'строка с описанием',
      'photos': getRandomLength(PHOTOS)
    },

    'location': {
      'x': correctPinLocationX(genRandomNumber(X_MIN, X_MAX), PIN_WIDTH),
      'y': correctPinLocationY(genRandomNumber(Y_MIN, Y_MAX), PIN_HEIGHT),
    }
  };
  return advertisement;
}

function getAdvertisementsArray(count) {
  var advertisements = [];
  for (var i = 1; i <= count; i++) {
    advertisements.push(genAdvertisement(i));
  }
  return advertisements;
}

function createPinElement(contextData) {
  var newPin = document.querySelector('#pin').content.querySelector('.map__pin').cloneNode(true);
  var img = newPin.querySelector('img');
  img.src = contextData.author.avatar;
  img.alt = contextData.offer.title;
  newPin.style.left = contextData.location.x + 'px';
  newPin.style.top = contextData.location.y + 'px';
  return newPin;
}

function createCardElement(contextData) {
  var newCard = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
  newCard.querySelector('.popup__title').textContent = contextData.offer.title;
  newCard.querySelector('.popup__text--address').textContent = contextData.offer.address;
  newCard.querySelector('.popup__text--price').textContent = contextData.offer.price + '₽/ночь';
  newCard.querySelector('.popup__type').textContent = contextData.offer.type;
  newCard.querySelector('.popup__text--capacity').textContent = contextData.offer.rooms + ' комнаты для ' + contextData.offer.guests + ' гостей.';
  newCard.querySelector('.popup__text--capacity').textContent = 'Заезд после ' + contextData.offer.checkout + ', выезд до ' + contextData.offer.checkin;
  newCard.querySelector('.popup__description').textContent = contextData.offer.description;
  newCard.querySelector('.popup__avatar').src = contextData.author.avatar;
  var photos = newCard.querySelector('.popup__photos');
  var photo = photos.querySelector('.popup__photo');
  photos.removeChild(photo);
  for (var j = 0; j < contextData.offer.photos.length; j++) {
    photos.appendChild(photo.cloneNode(photo.src = contextData.offer.photos[j]));
  }

  return newCard;
}

function getFragmentWithPins(advertisements) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < advertisements.length; i++) {
    fragment.appendChild(createPinElement(advertisements[i]));
  }
  return fragment;
}

function getFragmentWithCards(advertisements) {
  var fragmentWithCards = document.createDocumentFragment();
  for (var i = 0; i < advertisements.length; i++) {
    fragmentWithCards.appendChild(createCardElement(advertisements[i]));
  }
  return fragmentWithCards;
}

var advertisements = getAdvertisementsArray(ADVERTISEMENTS_COUNT);
advertisementsMap.querySelector('.map__pins').appendChild(getFragmentWithPins(advertisements));
var mapFilters = advertisementsMap.querySelector('.map__filters-container');
advertisementsMap.insertBefore(getFragmentWithCards(advertisements), mapFilters);
