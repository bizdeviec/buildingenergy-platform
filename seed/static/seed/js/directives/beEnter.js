/**
 * :copyright: (c) 2014 Building Energy Inc
 * :license: see LICENSE for more details.
 */
/**
 * directive be-enter used for search input to only fire on 'enter' or 'return'
 */
angular.module('beEnter', []).directive('beEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.beEnter);
                });

                event.preventDefault();
            }
        });
    };
});