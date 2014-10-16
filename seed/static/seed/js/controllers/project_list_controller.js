/**
 * :copyright: (c) 2014 Building Energy Inc
 * :license: see LICENSE for more details.
 */
angular.module('BE.seed.controller.project', [])
.controller('project_list_controller', [
  '$scope',
  '$http',
  'project_service',
  'urls',
  '$log',
  '$modal',
  'projects_payload',
  function($scope, $http, project_service, urls, $log, $modal, projects_payload) {

    $scope.user = {};
    $scope.user.projects = projects_payload.projects;
    $scope.$on('projects_updated', function() {
        // get new list of projects
        get_projects();
    });

    $scope.delete_project = function(project) {
        if (confirm("Are you sure you want to PERMANENTLY delete the '" + project.name + "'' project?")) {
            project_service.delete_project(project.slug).then(function (data) {
                // resolve promise
                // get new list of projects
                $scope.$emit('project_created');
                get_projects();
            });
        }
    };

    $scope.open_edit_modal = function(p) {
        $scope.the_project = p;
        var modalInstance = $modal.open({
            templateUrl: urls.static_url + 'seed/partials/edit_project_modal.html',
            controller: 'edit_project_modal_ctrl',
            resolve: {
                project: function () {
                    return $scope.the_project;
                },
                create_project: function () {
                    return false;
                }
            }
        });

        modalInstance.result.then(
            function (project) {
                $log.info(project);
                get_projects();
        }, function (message) {
                $log.info(message);
                $log.info('Modal dismissed at: ' + new Date());
        });
    };

    var get_projects = function() {
        project_service.get_projects().then(function(data) {
            // resolve promise
            $scope.user.projects = data.projects;
        });
    };
}]);
