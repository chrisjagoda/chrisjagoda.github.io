'use strict';

angular.module('angularDjangoRegistrationAuthApp')
  .controller('MainCtrl', function ($scope, $cookies, $location, djangoAuth, req) {
    $scope.courseTemplate = 'views/course.html' 
    
    var hideDescription = function(desc){
      $scope.description == false;
    }
        
    var handleSuccess = function(data){
      $scope.response = data;
    }
    
    var handleError = function(data){
      $scope.response = data;
    }

    $scope.show_login = true;
    $scope.$on("djangoAuth.logged_in", function(data){
      $scope.show_login = false;
    });
    $scope.$on("djangoAuth.logged_out", function(data){
      $scope.show_login = true;
    });

  });
