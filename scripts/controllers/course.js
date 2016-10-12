'use strict';

angular.module('angularDjangoRegistrationAuthApp')
  .controller('CourseCtrl', function ($timeout, $scope, $rootScope, $location, djangoAuth, req, $filter) {
    $scope.status = '';
    $scope.sorting = false;
    $scope.searchString = "";
    $scope.sortedCourses = [];
    $scope.providers = [
        {id:"Show All"},
        {id:"coursera"},
        {id:"udacity"},
        {id:"udemy"},
        {id:"edx"}
    ];

    $scope.selectedProvider = "Show All";

    req.getCourses().then(function(data){
      $scope.model = data;
      $scope.setPage(1);
    });

    $scope.pager = {};
    $scope.setPage = function(page) {
        if (page < 1 || page > $scope.pager.totalPages) {
            return;
        }
        else if ($scope.sorting){
            $scope.pager = req.pager($scope.sortedCourses.length, page);
            $rootScope.courses = $scope.sortedCourses.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
        }
        else {
            $scope.pager = req.pager($scope.model.length, page);
            $rootScope.courses = $scope.model.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
        }
    };

    $scope.setProvider = function(provider) {
        $scope.sorting = true;
        $scope.selectedProvider = provider.id;
        $timeout( function() {
            $scope.setPage(1);
        }, 500);
    };

    $scope.changeData = function(searchString){
      if (!$scope.searching && searchString.length > 2) {
          if (!$scope.sorting){
              $rootScope.courses = $scope.model;
          }
          $scope.searching = true;
      }
      else if ($scope.searching && searchString.length < 2) {
          $scope.searching = false;
          $scope.setPage(1);
      }
    }

    $scope.addCourse = function(model){
      $scope.errors = [];
      djangoAuth.addCourse(model.id, 'e')
      .then(function(data){
        model.added = true;
      })
      .catch(function(data){
        model.added = false;
        $scope.errors = data;
      });
    };
  })
  .filter('searchFor', function(){
    return function(arr, searchString){
        if(!searchString){
            return arr;
        }
        var result = [];
        searchString = searchString.toLowerCase();        
        var terms = searchString.split(/ /);
        angular.forEach(arr, function(item){
            if(terms.length > 1){
                var count = 0;
                angular.forEach(terms, function(term){
                    if(item.course.toLowerCase().indexOf(term) !== -1){
                        count++;
                    }
                });
                if(count == terms.length){
                    result.push(item);
                }
            }
            else if((item.course.toLowerCase() + " " + item.provider).indexOf(searchString) !== -1){
                result.push(item);
            }
        });
        return result;
    };
  })
  .filter('sortProvider', function($filter){
    return function(arr, scope){
        // if(scope.selectedProvider == "Show All"){
        //     if (scope.searching){
        //         return $filter('searchFor')(scope.model, scope.searchString);
        //     }
        //     else {
        //         return arr;
        //         scope.pager = req.pager(scope.model.length, page);
        //     }
        // }
        scope.sortedCourses = [];
        angular.forEach(scope.model, function(item, index){
            if(item.provider == scope.selectedProvider || scope.selectedProvider == "Show All"){
                scope.sortedCourses.push(item);                
            }
        });
        if (!scope.searching)
            return scope.sortedCourses.slice(scope.pager.startIndex, scope.pager.endIndex + 1);
        else
            return $filter('searchFor')(scope.sortedCourses, scope.searchString);
    };
  })  
  .directive('', function() {
    return {
      link: function(scope, element, attrs) {
        element.bind('error', function() {
          if (attrs.src != attrs.errSrc) {
            attrs.$set('src', attrs.errSrc);
          }
        });
        attrs.$observe('ngSrc', function(value) {
          if (!value && attrs.errSrc) {
            attrs.$set('src', attrs.errSrc);
          }
        });
      }
    };
  })
  .directive('img', function () {
    return {
        restrict: 'E',        
        link: function (scope, element, attrs) {
            element.error(function () {
                var url = 'images/default.jpg';
                element.prop('src', url);
            });
        }
    }
  });