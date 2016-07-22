myApp.factory('doGoodFactory', ['$http', '$q', '$log', function ($http, $q,
  $log) {

  console.log('doGood Factory online!');

  var user = undefined;
  var creds = undefined;

  function getAWSCredentials() {
    return $http.get('/s3').then(function (response) {
      creds = response.data;

    });
  }

  function refreshUserData() {
    var promise = $http.get('/user').then(function (response) {

      user = response.data;
      console.log('user data set:', user);

    });

    return promise;

  }

  var onLoad = function(reader, deferred, scope) {
      return function () {
          scope.$apply(function () {
              deferred.resolve(reader.result);
          });
      };
  };

  var onError = function (reader, deferred, scope) {
      return function () {
          scope.$apply(function () {
              deferred.reject(reader.result);
          });
      };
  };

  var onProgress = function(reader, scope) {
      return function (event) {
          scope.$broadcast("fileProgress",
              {
                  total: event.total,
                  loaded: event.loaded
              });
      };
  };

  var getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
  };

  var readAsDataURL = function (file, scope) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsDataURL(file);

      return deferred.promise;
  };

  var publicApi = {
    factoryRefreshUserData: function () {
      return refreshUserData();
    },

    factoryGetUserData: function () {
      return user;
    },

    factoryClearUser: function () {
      user = undefined;
    },

    factorySaveUser: function (newUser) {
      user = newUser;
    },

    refreshSettings: function () {
      return getAWSCredentials();
    },

    getSettings: function () {
      return creds;
    },

    readAsDataURL: function() {
      return readAsDataURL();
    }

  };
  return publicApi;
}]);
