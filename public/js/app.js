// Ionic Starter App


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
window.app = angular.module('borrowedApp', ['ionic', 'ngResource', 'borrowedApp.services', 'borrowedApp.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: "LoginCtrl"
    })

    // // setup an abstract state for the tabs directive
    // .state('tab', {
    //   url: "/tab",
    //   abstract: true,
    //   templateUrl: "templates/tabs.html"
    // })

    // the pet tab has its own child nav-view and history
    .state('friend-index', {
      url: '/friends',
      templateUrl: 'templates/friend-index.html',
      controller: 'FriendIndexCtrl'
    })

    .state('friend-detail', {
      url: '/friends/:friendId',
      templateUrl: 'templates/friend-detail.html',
      controller: 'FriendDetailCtrl'
    })

    .state('add-friend', {
      url:'/add-friend',
      templateUrl: 'templates/add-friend.html',
      controller: 'AddFriendCtrl' 
    })

    .state('lend-stuff', {
      url:'/lend-stuff/:friendId',
      templateUrl: 'templates/lend-stuff.html',
      controller: 'LendStuffCtrl'
    })
    .state('lend-money', {
      url:'/lend-money/:friendId',
      templateUrl: 'templates/lend-money.html',
      controller: 'LendMoneyCtrl'
    })

    // .state('tab.adopt', {
    //   url: '/adopt',
    //   views: {
    //     'adopt-tab': {
    //       templateUrl: 'templates/adopt.html'
    //     }
    //   }
    // })

    // .state('tab.about', {
    //   url: '/about',
    //   views: {
    //     'about-tab': {
    //       templateUrl: 'templates/about.html'
    //     }
    //   }
    // });
    .state('menu', {
      url: '/menu',
      templateUrl: 'templates/tab-menu.html',
      controller: 'menuCtrl'
    })

    .state('submenu', {
        url: '/submenu?url&title',
        templateUrl: 'templates/submenu.html',
        controller: 'SubmenuCtrl'
    })

    .state('map', {
        url: '/map',
        templateUrl: 'templates/hotel-map.html',
        controller: 'HotelmapCtrl'
    })

    .state('twitter', {
        url: '/twitter',
        templateUrl: 'templates/twitter.html',
        controller: 'TwitterCtrl'
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/menu');

});


window.app.apiBaseUrl = '';
