// Ionic Starter App

//LaunchmyApp - UrlSchemeNavigator
var handleOpenURL = function(url) {
  alert("RECEIVED URL: " + url);
  window.localStorage.setItem("external_load", url);
};



var votex = angular.module('starter', ['ionic', 'firebase', 'starter', 'starter.controllers', 'starter.loginCtrl', 'starter.menuCtrl', 'starter.profileCtrl',
  'starter.voteCtrl', 'starter.messageCtrl', 'starter.settingCtrl', 'starter.bookmarkCtrl',
  'starter.editVoteCtrl', 'starter.userCtrl', 'ngCordova', 'ionic.ion.imageCacheFactory', 'starter.agbCtrl',
  'starter.vote_historyCtrl', 'angular-progress-button-styles', 'ngMap',
  'google.places', 'starter.searchHistoryCtrl','ngSanitize', 'textAngular']);




/*
 *- TODO Kontaktliste
 *- TODO Notifications
 *- TODO Trends, charts
 *- TODO Kommentare Upvoten/melden können
 *- TODO Bilder Gallerie in business view
 *- TODO Erweiterte suche in Home view
 *- TODO edit vote überarbeiten
 *- TODO Einstellungen - Delete account - Reset password
 *- TODO Socia network für Business & Kommentare
 *- TODO Blockierliste, nachrichten
 *- TODO Network connection error etc
 *- TODO Google analytics
 *- TODO editVoteCtrl REMOVE reparieren
 *- TODO kommentare tabs margin center
 */



votex.run(function($ionicPlatform, $cordovaStatusbar, $ImageCacheFactory, $rootScope, $location, $ionicLoading) {
  $ionicPlatform.ready(function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="spiral" class="spinner-assertive"></ion-spinner>'
    });
    $rootScope.newMail = null;
    $rootScope.gpsCounter = 0;
    $rootScope.placeObject = null;
    $rootScope.votexObject = null;
    $rootScope.checkIfSecondSlide = {
      is: false
    };
    $rootScope.userInfo;
    $rootScope.user = {
      username: "",
      level: "",
      verified: "",
      ownProfile: "",
      ownProfileImage: "",
      memberSince: "",
      contacts: "",
      upvotePoints: ""
    };
    $rootScope.partnerUid = null;
    $rootScope.toUser = null;
    $rootScope.messageArray = [];
    $rootScope.messageBoxIndex = 0;
    $rootScope.adMobCounter = 0;


    $rootScope.voteUpdater = {
      avg_points: null,
      ambiente_avg: null,
      best_value_avg: null,
      service_avg: null,
      location_avg: null,
      quality_avg: null
    };
    $rootScope.voteKey = {
      key: null
    };
    $rootScope.userImg = null;

    if (ionic.Platform.isWebView()) {
      screen.lockOrientation('portrait');
      if (ionic.Platform.isAndroid()) {
        StatusBar.backgroundColorByHexString("#CCCCCC");
      }

      if (ionic.Platform.isIOS()) {
        StatusBar.backgroundColorByHexString("#E3E3E3");
      }
    }


    //Preload ALL Images
    $ImageCacheFactory.Cache([

      'img/votex_title.png',
      'img/voteOn.png',
      'img/voteOff.png',
      'img/voteTitleOn.png',
      'img/voteTitleOff.png',
      'img/voteRateOn.png',
      'img/voteRateOff.png',
      'img/modal1_opt-compressor.jpg',
      'img/background_opt-compressor.jpg',
      'img/noimage.jpg',
      'img/standard_profileImg.jpg'
    ]).then(function() {

    }, function(failed) {

    });





    if (window.cordova && window.cordova.plugins) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      if (window.cordova.plugins.Keyboard) {
        if (ionic.Platform.isIOS()) {
          cordova.plugins.Keyboard.disableScroll(true);
        }
      }
      if (navigator.splashscreen) {
        navigator.splashscreen.hide();
      }

      if (ionic.Platform.isWebView()) {
        if (AdMob) {

          var admob_interstitial_key = ionic.Platform.device() == "Android" ? "ca-app-pub-9863131629845499/3899772767" : "ca-app-pub-9863131629845499/8329972361";

          AdMob.prepareInterstitial({
            adId: admob_interstitial_key,
            autoShow: false
          });


        }
      }


    }

    if (typeof window.localStorage.getItem("external_load") !== "undefined") {
      $location.path("/");
    }

    // allow user rotate
    if (ionic.Platform.isWebView()) {
      screen.unlockOrientation();

    }



    $ionicLoading.hide();
  });


})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {



  if (!ionic.Platform.isIOS()) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }

  // ------------------------


  $ionicConfigProvider.views.maxCache(13);


  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'

  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'AppCtrl',
      }
    }
  })

  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/karte.html'
      }
    }
  })

  .state('app.login', {
    url: "/login",
    abstract: true,
    templateUrl: "templates/login.html"
  })

  .state('app.register', {
    url: "/register",
    views: {
      'menuContent': {
        templateUrl: "templates/register.html"
      }
    }
  })


  .state('app.searchHistory', {
    url: "/searchHistory",
    cache: true,
    views: {
      'menuContent': {
        templateUrl: "templates/searchHistory.html",
        controller: "searchHistoryCtrl"
      }
    }
  })

  .state('app.forgot', {
    url: "/forgot",
    views: {
      'menuContent': {
        templateUrl: "templates/forgot.html"
      }
    }
  })

  .state('app.profile', {
    url: "/profile",
    cache: true,
    controller: "profileCtrl",
    views: {
      'menuContent': {
        templateUrl: "templates/profile.html"
      }
    }
  })

  .state('app.business', {
    url: "/business",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/business.html"

      }
    }
  })

  .state('app.trends', {
    url: '/trends',
    cache: true,
    views: {
      'menuContent': {
        templateUrl: 'templates/trends.html'
      }
    }
  })



  .state('app.feedback', {
    url: '/feedback',
    views: {
      'menuContent': {
        templateUrl: 'templates/feedback.html'
      }
    }
  })

  .state('app.agb', {
    url: '/agb',
    views: {
      'menuContent': {
        templateUrl: 'templates/agb/agb.html',
        controller: 'agbCtrl'
      }
    }
  })


  .state('app.vote', {
    url: "/vote",
    abstract: true,
    templateUrl: "templates/vote.html"
  })

  .state('app.editVote', {
    url: "/editVote",
    abstract: true,
    templateUrl: "templates/editVote.html"
  })

  .state('app.user', {
    url: "/user",
    templateUrl: "templates/user.html",
    controller: 'userCtrl'
  })

  .state('app.vote_history', {
    url: '/vote_history',
    views: {
      'menuContent': {
        templateUrl: 'templates/vote_history.html',
        controller: 'vote_historyCtrl'
      }
    }
  })

  .state('app.businessMap', {
    url: "/businessMap",
    abstract: true,
    templateUrl: "templates/businessMap.html",
    controller: 'businessCtrl'
  })

  .state('app.messages', {
    url: '/messages',
    reload: true,
    views: {
      'menuContent': {
        templateUrl: 'templates/messages.html',
        controller: 'messageCtrl'
      }
    }
  })

  .state('app.messageBox', {
    url: '/messageBox',
    reload: true,
    views: {
      'menuContent': {
        templateUrl: 'templates/messageBox.html',
        controller: 'messageBoxCtrl'
      }
    }
  })

  .state('app.bookmark', {
    url: '/bookmark',
    reload: true,
    views: {
      'menuContent': {
        templateUrl: 'templates/bookmark.html',
        controller: 'bookmarkCtrl'
      }
    }
  })



  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'settingCtrl'
      }
    }
  })

  .state('app.smsVerify', {
    url: "/smsVerify",
    abstract: true,
    templateUrl: "templates/smsVerify.html"
  })

  .state('app.messagePop', {
    url: "/messagePop",
    abstract: true,
    templateUrl: "templates/messagePop.html",
    controller: 'messageBoxCtrl'
  });


  $urlRouterProvider.otherwise('/app/home');



})


;
