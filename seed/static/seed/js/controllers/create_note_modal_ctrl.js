/**
 * :copyright: (c) 2014 Building Energy Inc
 * :license: see LICENSE for more details.
 */
angular.module('BE.seed.controller.create_note_modal', [])
.controller('create_note_modal_ctrl', [
    '$scope',
    '$modalInstance',
    'audit_service',
    '$timeout',
    'building',
    'note',
    function ($scope, $modalInstance, audit_service, $timeout, building, note) {
    $scope.note = note || {};
    $scope.note = angular.copy($scope.note);
    $scope.error_message = "";

    /**
     * saves a new note or updates an existing note
     * @param  {Boolean} is_valid whether the form is valid (checked in the html)
     */
    $scope.submit_form = function(is_valid) {
        if (typeof note !== 'undefined') {
            // update existing note
            audit_service.update_note(note.id, $scope.note.action_note)
            .then(function(data){
                // resolve promise
                $modalInstance.close(data.audit_log);

            }, function(data) {
                // reject promise
                $scope.error_message = data.message;
            });
        } else {
            // new note
            audit_service.create_note(building.canonical_building, $scope.note.action_note)
            .then(function(data){
                // resolve promise
                $modalInstance.close(data.audit_log);

            }, function(data) {
                // reject promise
                $scope.error_message = data.message;
            });
        }
    };
    
    
    $scope.close = function () {
        $modalInstance.close($scope.note);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    /**
     * set the focus on the first input box
     */
    $timeout(function() {
        angular.element('#creatNote').focus();
    }, 50);
}]);
