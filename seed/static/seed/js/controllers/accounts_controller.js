/**
 * :copyright: (c) 2014 Building Energy Inc
 * :license: see LICENSE for more details.
 */
angular.module('BE.seed.controller.accounts', [])
.controller('accounts_controller', [
    '$scope',
    '$modal',
    'organization_payload',
    'urls',
    'organization_service',
    function ($scope, $modal, organization_payload, urls, organization_service) {
    
    $scope.create_organization_modal = function(org) {
        var modalInstance = $modal.open({
            templateUrl: urls.static_url + 'seed/partials/create_organization_modal.html',
            controller: 'create_organization_modal_ctrl',
            resolve: {
              organization: function () {
                return org;
              }
            }
        });
        modalInstance.result.then(
            // modal close()/submit() function
            function () {
                organization_service.get_organizations()
                .then(function (data) {
                    organization_payload = data;
                    init();
                });
        }, function (message) {
                // dismiss
        });
    };
    
    var init = function(){
        $scope.orgs = organization_payload.organizations;
        $scope.orgs_I_own = organization_payload.organizations.filter(function (o) {
            return o.user_is_owner;
        });
    };
    init();

}
]);
