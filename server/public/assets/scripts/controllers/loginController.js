myApp.controller('LoginController', ['doGoodFactory', '$scope', '$http',
  '$window', '$location', function (doGoodFactory, $scope, $http, $window,
  $location) {
  $scope.user = {
    username: '',
    password: '',
    is_admin: false,
    textnotifications: false,
    dgdnumber: 0,
    timesflagged: 0,
    active: true,
    badges: {
      bibliophile: false,
      kindness_ambassador: false,
      royalty: false,
      creature_care: false,
      citizenship: false,
      super_fan: false,
      generosity: false,
      happy_habits: false,
      helpful_holiday: false,
      flash_kindness: false,
      wilderness_hero: false,
      urgent_needs: false,
      smile_sharing: false,
      on_your_way: false,
      halfway: false,
      champion: false,
      downloads: false,
      kindness_coach: false,
      bright_smiles: false
    }
  };
  $scope.message = '';
  $scope.mismatch = false;

  /*$scope.badges = {
    user_verify: '',
    bibliophile: false,
    kindness_ambassador: false,
    royalty: false,
    creature_care: false,
    citizenship: false,
    super_fan: false,
    generosity: false,
    happy_habits: false,
    helpful_holiday: false,
    flash_kindness: false,
    wilderness_hero: false,
    urgent_needs: false,
    smile_sharing: false,
    on_your_way: false,
    halfway: false,
    champion: false,
    downloads: false,
    kindness_coach: false,
    bright_smiles: false,
  }*/

  // select elements need jQuery to work properly
  $(document).ready(function () {
    $('select').material_select();
  });

  $scope.login = function () {
    if ($scope.user.username === '' || $scope.user.password === '') {
      $scope.message = 'Please enter a valid username and password';
    } else {
      $http.post('/', $scope.user).then(function (response) {
        if (response.data.username) {
          console.log('success: ', response.data);
          doGoodFactory.factorySaveUser(response.data);

          // location works with SPA (ng-route)
          $location.path('/landingpage');
        } else {
          console.log('failure: ', response);
          $scope.message = response.data.message;
        }
      });
    }
  };

  $scope.registerUser = function () {

    // username & password are required
    if ($scope.user.username === '' || $scope.user.password === '') {
      $scope.message = 'Please enter all required information';

    // check if verify password matches original password
    } else if ($scope.user.password !== $scope.user.password2) {
      $scope.message = 'Passwords do not match - please re-type';

    // process registration
    } else {

      // check verification code
      var candidate = $scope.user.verification;
      $http.get('/verification/' + candidate).then(function (response) {
        if (response.data.result) {

          // all checks passed - create user
          //$scope.badges.user_verify = candidate;
          $http.post('/register', $scope.user).then(function (response) {
            console.log('success');
              $location.path('/login');

          },

          // error handling for registration
          function (response) {
            console.log('Registration error', response);
            $scope.message = 'Registration failed - please try again';
          });

        } else {
          $scope.message = 'Verification code not found or no longer valid';
        }

      },

      // error handling for verification code check
      function (response) {
        $scope.message = 'Code verification failed - please check your code';
      });

    }
  };

// jQuery for select element
$(".dropdown-button").dropdown({
      hover: true, // Activate on hover
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'right' // Displays dropdown with edge aligned to the left of button
    }
  );

  $(document).ready(function(){
  $('.tooltipped').tooltip({delay: 100});
});

  $scope.comparePassword = function () {
    if ($scope.user.password !== $scope.user.password2) {
      $scope.mismatch = true;
      $scope.password = '';
      $scope.password2 = '';
    } else {
      $scope.mismatch = false;
    }
  };

}]);
