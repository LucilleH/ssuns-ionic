angular.module('borrowedApp.services', [])

/**
 * A simple example service that returns some data.
 */

.factory('UserService', function($resource) {
  // Might use a resource here that returns a JSON array

  var User = $resource( window.app.apiBaseUrl + '/users', {});

  return {
    all: function() {
      var users = User.query();
      return users;
    }
  }
})


.factory('TransactionService', function($resource) {
  // Might use a resource here that returns a JSON array
  var ItemTransaction = $resource( window.app.apiBaseUrl + '/itemtransactions/:id', {id: '@_id'},{'get':    {method:'GET'},
    'update':   {method:'PUT'}});
  var BalanceTransaction = $resource( window.app.apiBaseUrl + '/balancetransactions/:id', {id: '@_id'});
  var FriendItemTransaction = $resource( window.app.apiBaseUrl + '/friends/:userId/itemtransactions', {});
  var FriendBalanceTransaction = $resource( window.app.apiBaseUrl + '/friends/:userId/balancetransactions', {});
  var User = $resource( window.app.apiBaseUrl + '/users/:userId', {userId: '@id'});
  
  return {
    all: function(friendId, cb) {
      var itemtransactions = FriendItemTransaction.query({userId: friendId,hash: Math.random().toString(36).substring(7)});
      var balancetransactions = FriendBalanceTransaction.query({userId: friendId,hash: Math.random().toString(36).substring(7)});
      var friend = User.get({userId: friendId});
      return {itemtransactions: itemtransactions, friend: friend, balancetransactions: balancetransactions};
    },
    addMessage: function(transactionId, message, cb){
      console.log(transactionId);
      var transaction = ItemTransaction.get({id: transactionId}, function(item){
        item.messages.push(message);
        item.$update(function(data){
          cb(data);
          return data;
        });
      });
    },
    refreshItem: function(transactionId, cb){
      var transaction = ItemTransaction.get({id: transactionId, hash: Math.random().toString(36).substring(7) }, function(item){
        cb(item);
        return item;
      });
    },
    returnedItem: function(transactionId, cb){
      var transaction = ItemTransaction.get({id: transactionId}, function(item){
        item.status = 'returned';
        item.$update(function(data){
          cb(data);
          return data;
        });
      });
    },
    addItem: function(friendId, item, cb){
      var newitem = new ItemTransaction();
      newitem.borrower = friendId;
      newitem.return_date = Date.create(item.return_date);
      newitem.items = item.items;
      newitem.$save(function(data){
        cb(data);
      });
    },
    addBalance: function(friendId, amount, cb){
      var newbalance = new BalanceTransaction();
      newbalance.borrower = friendId;
      newbalance.amount = amount;
      newbalance.$save(function(data){
        cb(data);
      });
    }

  }
})

.factory('FriendService', function($resource) {
  // Might use a resource here that returns a JSON array

  var Friend = $resource( window.app.apiBaseUrl + '/friends', {});

  return {
    all: function(cb) {
      var friends = Friend.query({hash: Math.random().toString(36).substring(7)}, function(data){
        cb(data);
      });
      return friends;
    },
    addFriend: function(friendId, cb){
      var newFriend = new Friend();
      newFriend._id = friendId;
      newFriend.$save(function(data){
        cb(data);
      });
    }
  }
})

.factory('AuthService', [
    '$http', 'SessionService',
 
    function($http, SessionService) {
      var AuthService = {
        
        login: function(callback) {
          $http({ method: 'GET', url: 'http://127.0.0.1:3000/users/me' })
          
          // User Successfully Authenticates
          .success(function(data, status, headers, config) {
            SessionService.authenticated = true;
            SessionService.user = data;
            if (typeof(callback) === typeof(Function)) callback();
          })
          
          // Not logged in
          .error(function(data, status, headers, config) {
            console.log('Error authenticating');
            SessionService.authenticated = false; 
            if (typeof(callback) === typeof(Function)) callback();
          });    
        }
      };
 
      return AuthService;
    }
  ])
  .factory('SessionService', function() {
    return {
      user: null,
      authenticated: false
    };
  });