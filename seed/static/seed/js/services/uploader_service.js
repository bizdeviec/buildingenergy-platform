/**
 * :copyright: (c) 2014 Building Energy Inc
 * :license: see LICENSE for more details.
 */
// uploader services
angular.module('BE.seed.service.uploader', []).factory('uploader_service', [
  '$http',
  '$q',
  '$timeout',
  'user_service',
  function ($http, $q, $timeout, user_service) {

    var uploader_factory = {};

    uploader_factory.get_AWS_creds = function() {
        var defer = $q.defer();
        $http({
            method: 'GET',
            'url': window.BE.urls.get_AWS_creds
        }).success(function(data) {
            defer.resolve(data);
        }).error(function(data, status) {
            defer.reject(data, status);

        });
        return defer.promise;
    };
    /**
     * create_dataset: AJAX request to create a new dataset/import record
     * should have a response like:
     *  {
     *       "status": "success",
     *       "import_record_id": 4,
     *       "import_record_name": "2013 city compliance dataset"
     *  }
     * or
     *  {
     *        "status": "error",
     *        "message": "name already in use"
     *  }
     */
    uploader_factory.create_dataset = function(dataset_name) {
        // timeout here for testing
        var defer = $q.defer();
        $http({
            method: 'POST',
            'url': window.BE.urls.create_dataset,
            'data': {
                'name': dataset_name,
                'organization_id': user_service.get_organization().id
            }
        }).success(function(data, status) {
            if (data.status === "error"){
                defer.reject(data, status);
            } else {
                defer.resolve(data);
            }
        }).error(function(data, status) {
            defer.reject(data, status);
        });
        return defer.promise;
    };

    /*
    * save_raw_data
    * This service call will simply call a view on the backend to save raw
    * data into BuildingSnapshot instances.
    * @param file_id: the pk of a ImportFile object we're going to save raw.
    */
    uploader_factory.save_raw_data = function(file_id) {
        var defer = $q.defer();
        $http({
            method: 'POST',
            url: window.BE.urls.save_raw_data,
            'data': {
              'file_id': file_id,
              'organization_id': user_service.get_organization().id
            }
        }).success(function(data, status) {
            if (data.status === "error"){
                defer.reject(data, status);
            } else {
                defer.resolve(data);
            }
        }).error(function(data, status) {
            defer.reject(data, status);
        });
        return defer.promise;
    };

    /*
    * check_progress: gets the progress for saves, maps, and matches
    * @param progress_key: progress_key to grab the progress
    */
    uploader_factory.check_progress = function(progress_key) {
        var defer = $q.defer();
        $http({
            method: 'POST',
            url: window.BE.urls.progress,
            'data': {'progress_key': progress_key}
        }).success(function(data, status) {
            if (data.status === "error"){
                defer.reject(data, status);
            } else {
                defer.resolve(data);
            }
        }).error(function(data, status) {
            defer.reject(data, status);
        });
        return defer.promise;
    };
    /*
     * check_progress_loop: check loop to update the progress bar
     *
     * @param {string} progress_key: key
     * @param {number} offset: where to start the progress bar
     * @param {number} multiplier: multiplier for progress val
     * @param {fn} success_fn: function to call when progress is done
     * @param {obj} progress_bar_obj: progress bar object, attr 'progress'
     *   is set with the progress
     */
    uploader_factory.check_progress_loop = function(progress_key, offset, multiplier, success_fn, progress_bar_obj, debug) {
        if (typeof debug === 'undefined') {
          debug = false;
        }
        uploader_factory.check_progress(progress_key).then(function (data){
          if (debug) {
            console.log({progress: data.progress});
          }
          var stop = $timeout(function(){
              progress_bar_obj.progress = (data.progress * multiplier) + offset;
              if (data.progress < 100) {
                uploader_factory.check_progress_loop(progress_key, offset, multiplier, success_fn, progress_bar_obj, debug);
              } else {
                  success_fn(data);
              }
          }, 750);
        }, function (data, status) {
          // reject promise
          console.log(data, status);
        });
    };

    return uploader_factory;
}]);
