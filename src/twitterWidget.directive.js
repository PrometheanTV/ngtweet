(function() {
'use strict';

angular
    .module('ngtweet')
    .directive('twitterWidget', TwitterWidget);

function TwitterWidget(ngTweetLogger, TwitterWidgetFactory) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            twitterWidgetId: '=',
            twitterWidgetOnRendered: '&',
            twitterWidgetOptions: '@'
        },
        template: '<div class="ngtweet-wrapper" ng-transclude></div>',
        link: function(scope, element, attrs) {
            scope.$watch('twitterWidgetId', function(newValue, oldValue) {
                ngTweetLogger.debug('Linking', element, attrs);
                var twitterWidgetOptions = scope.$eval(attrs.twitterWidgetOptions);
                if (!angular.isUndefined(scope.twitterWidgetId)) {
                    if (!angular.isString(scope.twitterWidgetId)) {
                        ngTweetLogger.warn('twitterWidgetId should probably be a string due to loss of precision.');
                    }
                    var elementCopy = element.clone();
                    TwitterWidgetFactory.createTweet(scope.twitterWidgetId, elementCopy[0], twitterWidgetOptions).then(function success(embed) {
                        ngTweetLogger.debug('Created tweet widget: ', scope.twitterWidgetId, elementCopy[0]);

                        element.empty();
                        element.append(elementCopy[0]);

                        scope.twitterWidgetOnRendered();
                    }).catch(function creationError(message) {
                        ngTweetLogger.error('Could not create widget: ', message, element);
                    });
                } else {
                    TwitterWidgetFactory.load(element[0]);
                }
            });
        }
    };
}
})();
