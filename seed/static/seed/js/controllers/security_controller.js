/**
 * :copyright: (c) 2014 Building Energy Inc
 * :license: see LICENSE for more details.
 */
angular.module('BE.seed.controller.security', [])
.controller('security_controller', [
    '$scope',
    'urls',
    'auth_payload',
    'user_service',
    'user_profile_payload',
    function (
      $scope,
      urls,
      auth_payload,
      user_service,
      user_profile_payload
    ) {
    $scope.auth = auth_payload.auth;
    $scope.username = user_profile_payload.user.first_name + " " + 
        user_profile_payload.user.last_name;

    /**
     * sets the user's password
     */
    $scope.change_password = function () {
        user_service.set_password($scope.current_password, $scope.password_1, $scope.password_2)
        .then(function (data) {
            $scope.password_updated = true;
            $scope.error_message = "";
        }, function (data) {
            $scope.error_message = data.message;
        });
    };

}]);
