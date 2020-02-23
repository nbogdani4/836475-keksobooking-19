'use strict';

var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var ADVERTISEMENTS_COUNT = 8;
var X_MIN = 0;
var X_MAX = document.querySelector('.map').clientWidth;
var Y_MIN = 130;
var Y_MAX = 630;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

document.querySelector('.map').classList.remove('map--faded');

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
      'title': 'Заголовок',
      'address': '600, 350',
      'price': 350,
      'type': getRandomValue(OFFER_TYPE),
      'rooms': 6,
      'guests': 3,
      'checkin': getRandomValue(TIME),
      'checkout': getRandomValue(TIME),
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
  var pinImg = newPin.querySelector('img');
  pinImg.src = contextData.author.avatar;
  pinImg.alt = contextData.offer.title;
  newPin.style.left = contextData.location.x + 'px';
  newPin.style.top = contextData.location.y + 'px';
  return newPin;
}

function getFragmentWithPins(advertisements) {
  var fragmentWithPins = document.createDocumentFragment();
  for (var i = 0; i < advertisements.length; i++) {
    fragmentWithPins.appendChild(createPinElement(advertisements[i]));
  }
  return fragmentWithPins;
}

var advertisements = getAdvertisementsArray(ADVERTISEMENTS_COUNT);
document.querySelector('.map__pins').appendChild(getFragmentWithPins(advertisements));
