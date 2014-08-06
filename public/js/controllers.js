angular.module('borrowedApp.controllers',[])

// ----- Main Controller

.controller('MainCtrl', function($scope, $state, AuthService, SessionService, $ionicLoading) {
  AuthService.login(function() {
  	$scope.session = SessionService;
  	$scope.$watch('session', function() {
    	if($scope.session.user.name == null){
  			$state.go('login');
  		}
    });
  });

  $scope.showLoading = function() {
    $scope.loading = $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      noBackdrop: true,
      maxWidth: 200,
      showDelay: 500
    });
  };

  $scope.hideLoading = function(){
    $scope.loading.hide();
  };
})

.controller('HomeCtrl', function($state, $scope, $ionicLoading) {
  $state.go('menu');
   $scope.showLoading = function() {
    $scope.loading = $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 500
    });
  };

  $scope.hideLoading = function(){
    $scope.loading.hide();
  };
})

.controller('SubmenuCtrl', function($scope, $stateParams, $http) {
  $scope.content = "";
  $scope.showLoading();
  $http.get('http://ssuns.org' + $stateParams.url).success(function(data) {
    $scope.content = data;
    $scope.hideLoading();
    console.log($scope.content);
  });
  $scope.title = $stateParams.title;
})


.controller('menuCtrl', function($scope, $state, AuthService, SessionService) {
  $scope.browser = function(url) {
    var ref = window.open('http://' + url, '_blank', 'location=yes');
  };
  $scope.authenticate = function() {
    if($scope.session.user.name == null){
      $state.go('login');
    }
    else {
      if($scope.session.user.committee == null) {
        $state.go('me-position');
      }
      else $state.go('delegates');
    }
  };
})

.controller('BrowserCtrl', function($scope, $stateParams) {
   var ref = window.open('http://' + $stateParams.url, '_blank', 'location=yes');
   $scope.title = $stateParams.title;
})

// ----- Login Page

.controller('LoginCtrl', function($scope) {
	$scope.login_button = function(){
		window.location.href = window.app.apiBaseUrl + '/auth/facebook';
	}
})

// ----- Index Page


.controller('DelegateCtrl', function($scope, $stateParams, UserService, CommitteeService) {

  // Quick hack: since we don't expect many users at first, load list of all users.
  $scope.committeeId = {};
  $scope.committeename = {};
  if ($stateParams.committeeId) 
    $scope.committeeId = $stateParams.committeeId;
  else 
    $scope.committeeId = $scope.session.user.committee;
  $scope.users = UserService.committee($scope.committeeId, function(data) {
    console.log(data);
  });

  var committeename = CommitteeService.refreshItem($scope.committeeId, function(data) {
    $scope.committeename = data.name;
  });

  $scope.rightButtons = [
    {
      type: 'button-clear',
      content: '<a class="icon ion-ios7-gear"></a>',
      tap: function(e) {
        window.location.href = '/#/me/position';
      }
    }
  ];

})


.controller('PositionCtrl', function($scope, CommitteeService, UserService) {
  //  $scope.me = CommitteeService.user()
    $scope.user = $scope.session.user;
    $scope.committees = CommitteeService.all();
    //$scope.committeeId = null;
    //$scope.assignment = {};

    $scope.addAssignment = function(){
      if($scope.user.committeeId && $scope.user.assignment){
        console.log($scope.user);
        UserService.update($scope.user, function(){
          window.location.href = '/#/delegates?committeeId=' + $scope.user.committeeId._id;
        });
      }
  }

  $scope.rightButtons = [
    {
      type: 'button-clear',
      content: 'Next',
      tap: function(e) {
        $scope.addAssignment();
      }
    }
  ];

})


// ----- Messages

.controller('MessagesCtrl', function($scope, $stateParams, CommitteeService) {
  $scope.committeeId = $stateParams.committeeId || $scope.session.user.committee;
  $scope.newMessage = '';
  $scope.messages = $scope.messages || {};
  CommitteeService.refreshItem($scope.committeeId, function(data) {
    $scope.messages = data.messages;
    console.log(data);
  });

  $scope.addMessage = function(){
    if($scope.newMessage.length > 0){
      var message = {user: $scope.session.user._id, content: $scope.newMessage};
      CommitteeService.addMessage($scope.committeeId, message, function(){
        $scope.onRefresh();
        $scope.newMessage = '';
      });
    }
  }

  $scope.onRefresh = function(){
    CommitteeService.refreshItem($scope.committeeId, function(data){
      console.log(data.messages);
      $scope.messages = data.messages;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
});