angular.module('borrowedApp.controllers', ['google-maps'])

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

.controller('ForumCtrl', function($scope) {
})

.controller('MeCtrl', function($scope) {
})

.controller('menuCtrl', function($scope, $state, AuthService, SessionService) {
  $scope.browser = function(url) {
    var ref = window.open('http://' + url, '_blank', 'location=yes');
  };
  $scope.authenticate = function() {
    AuthService.login(function() {
      $scope.session = SessionService;
      $scope.$watch('session', function() {
        if($scope.session.user.name == null){
          $state.go('login');
        }
        else {
          $state.go('forum');
        }
      });
    });
  };
})

.controller('BrowserCtrl', function($scope, $stateParams) {
  /*$scope.map = {
    center: {
        lAuthService.login(function() {
    $scope.session = SessionService;
    $scope.$watch('session', function() {
      if($scope.session.user.name == null){
        $state.go('login');
      }
    });atitude: 45.499239,
        longitude: -73.566085
    },
    zoom: 15
  };*/
   var ref = window.open('http://' + $stateParams.url, '_blank', 'location=yes');
   $scope.title = $stateParams.title;

 // var ref = window.open('http://maps.google.ca/?q=H5A+1E4', '_blank', 'location=yes');
})
/*
.controller('TwitterCtrl', function($scope, $timeout) {
    /*$scope.run = function() {
      (!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs"));
    }
    $scope.run();
    $timeout(function () { twttr.widgets.load(); }, 500);
    
    $scope.showLoading();
    $http.get("http://twitter.com/search?q=%23SSUNS").success(function(data) {
      $scope.content = data;
      $scope.hideLoading();
      console.log($scope.content);
    });
    var ref = window.open('http://twitter.com/search?q=%23SSUNS', '_blank', 'location=no');
})

.controller('FacebookCtrl', function($scope, $timeout) {
    /*$scope.run = function() {
      (!function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.0"; fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));
    }
    $scope.run(); 
    $timeout(function () { FB.XFBML.parse(); }, 500);
    var ref = window.open('https://www.facebook.com/officialssuns', '_blank', 'location=no');
})

https://www.youtube.com/channel/UCCHYwb-lrewUehE4edclD2g/videos
*/

// ----- Login Page

.controller('LoginCtrl', function($scope) {
	$scope.login_button = function(){
		window.location.href = window.app.apiBaseUrl + '/auth/facebook';
	}
})

// ----- Index Page

.controller('FriendIndexCtrl', function($scope, FriendService) {
  $scope.showLoading();

  $scope.friends = FriendService.all(function(){
    $scope.hideLoading();
  });

  $scope.onRefresh = function(){
    FriendService.all(function(data){
      $scope.friends = data;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  /*$scope.rightButtons = [
    {
      type: 'button-clear',
      content: '<a class="button button-icon icon ion-ios7-plus-empty"></a>',
      tap: function(e) {
        window.location.href = '/#/add-friend';
      }
    }
  ];*/

})

// ----- Friend Detail Page

.controller('FriendDetailCtrl', function($scope, $stateParams, $ionicModal, TransactionService) {
  $scope.balance = $scope.balance || 0;
  $scope.friendId = $stateParams.friendId;
  $scope.messages = $scope.messages || [];
  $scope.paybutton = 'Pay Back';
  $scope.friendDetails = $scope.friendDetails || {};
  $scope.loaded = false;

  var loadData = function(cb){
    // Load friend details
    var newBalance = 0;
    var result = TransactionService.all($scope.friendId);
    // Calculate balance once balancetransactions are loaded
    result.balancetransactions.$promise.then(function(data){
        for (var i = data.length - 1; i >= 0; i--) {
            if (data[i].borrower._id === $scope.friendId) {
              newBalance = newBalance + data[i].amount;
            } else {
              newBalance = newBalance - data[i].amount;
            }
        };
        if (newBalance > 0) $scope.paybutton = 'Lend Money';
        $scope.balance = newBalance;
        $scope.loaded = true;
        cb(data);
    });

    result.itemtransactions.$promise.then(function(data){
      _.each(data, function(item){
        item.return_date = Date.create(item.return_date).relative();
      });
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

  $scope.openMessages = function(itemtransactionId) {
    $scope.newMessage = '';
    $scope.modalId = itemtransactionId;
    $scope.modalTransaction = _.find($scope.friendDetails.itemtransactions, {'_id': itemtransactionId});
    $scope.messages = $scope.modalTransaction.messages;
    $scope.modal.show();
  };

  $scope.onRefresh = function(){
    var result = loadData();

    result.itemtransactions.$promise.then(function(){
      $scope.friendDetails.itemtransactions = result.itemtransactions;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  // UI Functions

  $scope.balanceNumber = function(){
    return Math.abs($scope.balance).toFixed(2);
  }

  $scope.lend_filter = function(item){
    if(item.borrower._id === $scope.friendId){
      return true;
    } else return false;
  }

  $scope.borrow_filter = function(item){
    if(item.borrower._id === $scope.friendId){
      return false;
    } else return true;
  }

  // First load
  var init = function(){
    $scope.showLoading();
    $scope.friendDetails = loadData(function(data){
      $scope.hideLoading();
    });
  }

  if( Object.size($scope.friendDetails) === 0){
    init();
  }

})

// ----- Messages

.controller('MessagesCtrl', function($scope, TransactionService) {
  $scope.closeMessages = function(itemtransactionId) {
    $scope.modal.hide();
  };

  $scope.addMessage = function(){
    if($scope.newMessage.length > 0){
      var message = {user: $scope.session.user._id, content: $scope.newMessage};
      TransactionService.addMessage($scope.modalId, message, function(){
        $scope.messages.push(message);
        $scope.newMessage = '';
      });
    }
  }

  $scope.onRefresh = function(){
    var transactionIndex = _.findIndex($scope.friendDetails.itemtransactions, {'_id': $scope.modalId});

    TransactionService.refreshItem($scope.modalId, function(data){
      console.log(data.messages);
      $scope.friendDetails.itemtransactions[transactionIndex].messages = data.messages;
      $scope.messages = data.messages;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
})

// ----- Lending Action Pages

.controller('LendStuffCtrl', function($scope, $stateParams, TransactionService) {
  $scope.item = {};
  $scope.payload = {
    return_date: Date.create('next month').format('{yyyy}-{MM}-{dd}')
  };

  var addStuff = function(friendId){
    $scope.payload.items = [];
    $scope.payload.items.push($scope.item);
    var newItem = TransactionService.addItem(friendId, $scope.payload, function(){
      var url = '/#/friends/' + friendId;
      window.location.href = url;
    });
  }

  $scope.rightButtons = [
    {
      type: 'button-clear',
      content: 'Next',
      tap: function(e) {
        addStuff($stateParams.friendId);
      }
    }
  ];
})

.controller('LendMoneyCtrl', function($scope, $stateParams, TransactionService) {
    $scope.payload = {};
    var addBalance = function(friendId){
      if($scope.payload.amount){
        var newItem = TransactionService.addBalance(friendId, $scope.payload.amount, function(){
          var url = '/#/friends/' + friendId;
          window.location.href = url;
        });
      }
  }

  $scope.rightButtons = [
    {
      type: 'button-clear',
      content: 'Next',
      tap: function(e) {
        addBalance($stateParams.friendId);
      }
    }
  ];

})

// ----- Add Friend Page

.controller('AddFriendCtrl', function($scope, UserService, FriendService) {

  // Quick hack: since we don't expect many users at first, load list of all users.
  $scope.users = UserService.all();

  var updateAddButton = function(){
    _.each($scope.users, function(user){
      if(_.contains($scope.session.user.friends, user._id)){
        user.addButtonText = 'Added';
        user.addButtonClass = 'button-stable'
      } else if (user._id === $scope.session.user._id){
        user.addButtonText = 'Me';
        user.addButtonClass = 'hidden';
      } else if (_.contains(user.friends, $scope.session.user._id)){
        user.addButtonText = 'Confirm';
        user.addButtonClass = 'button-balanced';
      } else {
        user.addButtonText = 'Add';
        user.addButtonClass = 'button-positive';
      }
    });
  };

  // Update add button for each user
  $scope.users.$promise.then(updateAddButton);

  $scope.friendFilter = function(item){
    if(item._id === $scope.session.user._id){
      return false;
    } else {
      return true;
    }
  }

  $scope.addFriend = function(id){
    FriendService.addFriend(id, function(data){
      $scope.session.user = data;
      updateAddButton();
    });
  }

});