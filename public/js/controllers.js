angular.module('ssunsApp.controllers',[])

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


.controller('DelegateCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicScrollDelegate, UserService, CommitteeService) {
  if($scope.session.user.name == null){
    $state.go('login');
  }
  else {
    if($scope.session.user.committee == null) {
      $state.go('me-position');
    }
  }
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

  $scope.secretariat = UserService.roles('secretariat');

  /*var committee = CommitteeService.refreshItem($scope.committeeId, function(data) {
    $scope.committeename = data.name;
    $scope.messages = data.messages;
  });*/


  $scope.loaded = false;

  var loadData = function(cb){
    var result = CommitteeService.refreshItem($scope.committeeId, function(data){
        $scope.committeename = data.name;
        $scope.messages = data.messages;
        $scope.loaded = true;
	cb(data);
    });
    return result;
  }


  // Message Modal Init
  $ionicModal.fromTemplateUrl('templates/messages.html', function(modal) {
    $scope.modal = modal;
    }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.openMessages = function() {
    $scope.newMessage = '';
    $scope.modalId = $scope.committeeId;
    var messageStartIndex = 0;
    if($scope.messages.length > 40) {
	messageStartIndex = $scope.messages.length - 40;
    }
    $scope.messages = $scope.messages.slice(messageStartIndex);
    $scope.modal.show();
    $ionicScrollDelegate.scrollBottom();
  };

  $scope.onRefresh = function(){
    var result = loadData();

    result.messages.$promise.then(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  // First load
  var init = function(){
    $scope.showLoading();
    loadData(function(data){
      $scope.hideLoading();
    });
  }

  if( Object.size($scope.committeename) === 0){
    init();
  }

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

    $scope.authorized = 0;
    $scope.secretariat = 0;
    if($scope.user.roles.indexOf("secretariat") != -1) 
    {
      $scope.authorized = 1;
      $scope.secretariat = 1;
    }

    if($scope.user.committee!=null && !$scope.authorized) 
    {
      var committeename = CommitteeService.refreshItem($scope.user.committee, function(data) {
        $scope.committeename = data.name;
        $scope.authorized = 0;
      });
    }
    else
    {
      $scope.committees = CommitteeService.all();
      $scope.authorized = 1;
    }
    //$scope.committeeId = null;
    //$scope.assignment = {};

    $scope.addAssignment = function(){
      if($scope.user.committee && $scope.user.position){
        console.log($scope.user);
        UserService.update($scope.user.committee, $scope.user.position, function(){
          $scope.session.user.committee = $scope.user.committee._id;
          $scope.session.user.position = $scope.user.position;
          window.location.href = '/#/delegates';
        });
      }
  }

  $scope.rightButtons = [
    {
      type: 'button-clear',
      content: 'Done',
      tap: function(e) {
        $scope.addAssignment();
      }
    }
  ];

})


// ----- Messages

.controller('MessagesCtrl', function($scope, $ionicScrollDelegate, CommitteeService) {
  $scope.closeMessages = function() {
    $scope.modal.hide();
  };

  $scope.addMessage = function(){
    if($scope.newMessage.length > 0){
      var message = {user: $scope.session.user._id, content: $scope.newMessage};
      CommitteeService.addMessage($scope.committeeId, message, function(){
        message.user = {_id: $scope.session.user._id, position: $scope.session.user.position};
	$scope.messages.push(message);
        $scope.newMessage = '';
        $ionicScrollDelegate.scrollBottom();
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
  $ionicScrollDelegate.scrollBottom();
});
