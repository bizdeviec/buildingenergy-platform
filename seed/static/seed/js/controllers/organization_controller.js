/**
 * :copyright: (c) 2014 Building Energy Inc
 * :license: see LICENSE for more details.
 */
angular.module('BE.seed.controller.organization', [])
.controller('organization_controller', [
    '$scope',
    '$modal',
    'users_payload',
    'organization_payload',
    'auth_payload',
    'organization_service',
    'urls',
    function (
      $scope,
      $modal,
      users_payload,
      organization_payload,
      auth_payload,
      organization_service,
      urls
    ) {
    $scope.users = users_payload.users;
    $scope.org = organization_payload.organization;
    $scope.auth = auth_payload.auth;

    $scope.new_member_modal = function() {
        var modalInstance = $modal.open({
            templateUrl: urls.static_url + 'seed/partials/new_member_modal.html',
            controller: 'new_member_modal_ctrl'
        });
    };
    $scope.existing_members_modal = function() {
        var modalInstance = $modal.open({
            templateUrl: urls.static_url + 'seed/partials/existing_members_modal.html',
            controller: 'existing_members_modal_ctrl'
        });
    };

    /**
     * open the create a sub org modal
     */
    $scope.create_organization_modal = function() {
        var modalInstance = $modal.open({
            templateUrl: urls.static_url + 'seed/partials/create_organization_modal.html',
            controller: 'create_organization_modal_ctrl',
            resolve: {
              organization: function () {
                return $scope.org;
              }
            }
        });
        modalInstance.result.then(
            // modal close()/submit() function
            function () {
                organization_service.get_organization($scope.org.id)
                .then(function (data) {
                    $scope.org = data.organization;
                });
        }, function (message) {
                // dismiss
        });
    };
    }
]);
