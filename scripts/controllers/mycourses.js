'use strict';

/**
 * @ngdoc function
 * @name angularDjangoRegistrationAuthApp.controller:MyCoursesCtrl
 * @description
 * # MyCoursesCtrl
 * Controller of the angularDjangoRegistrationAuthApp
 */
angular.module('angularDjangoRegistrationAuthApp')
  .controller('MyCoursesCtrl', function ($scope, $route, req, djangoAuth) {
  	$scope.courseStatus = [
  		{status:'Enrolled', id:'e'},
  		{status:'Complete', id:'c'},
  		{status:'Inactive', id:'i'}
    ];

    $scope.selectedStatus = "Sort by Status";

    djangoAuth.profile().then(function(data){
      $scope.profile = data;
    });
  	djangoAuth.myCourses().then(function(data){
  		$scope.courses = data;
  	});
    req.getCourses().then(function(data){
      $scope.model = data;
    });
    $scope.removeCourse = function(model){
      $scope.errors = [];
      djangoAuth.removeCourse(model.mycourseid)
      .then(function(data){
        model.removed = true;
      })
      .catch(function(data){
        model.removed = false;
        $scope.errors = data;
      });
    };
    $scope.updateCourse = function(course, status){
      $scope.errors = [];
      djangoAuth.updateCourse(course.mycourseid, status)
      .then(function(data){
        course.updated = true;
      })
      .catch(function(data){
        course.updated = false;
        $scope.errors = data;
      });
    };
    $scope.setStatus = function(course, status) {
      $scope.updateCourse(course, status);
      var statusStr = req.getStatus(status);
      course.status = {status:statusStr, id:status};
      var eleme = angular.element(document.querySelector( '#courseid' + course.mycourseid ));
      eleme.html(statusStr);
    };
    $scope.sortStatus = function(status) {
      $scope.selectedStatus = status.status;
    };
  })
  .filter('courseFilter', function (req) {
    	return function(models, courses) {
    		var filtered = [];
    		angular.forEach(courses, function(myCourse) {
    			angular.forEach(models, function(model) {
    				if(model.id == myCourse.course){
    					var mycourseinfo = {
    						status: {status:req.getStatus(myCourse.status), id:myCourse.status},
    						mycourseid: myCourse.id
    					};
    					filtered.push(angular.extend(model, mycourseinfo));
    				}
    			});
    		});
    		return filtered;
    	};
    })
  .filter('sortStatus', function($filter){
    return function(arr, scope){
        if (arr.length === 0) {
            return [];
        }
        if(scope.selectedStatus == "Sort by Status"){
            if (scope.searching){
                return $filter('courseFilter')($filter('searchFor')(scope.model, scope.searchString))(scope.courses);
            }
            else return arr;
        }
        var cstmSort = function (a, b, status) {
            if (a == b)
              return 0;
            else if (a == status)
              return -1;
            else if (b == status)
              return 1;
            return 0;
        };
        var result = $filter('courseFilter')(arr, scope.courses);
        return result.sort(function(a, b){
            return cstmSort(a.status.status,b.status.status, scope.selectedStatus);
        });
        // if (!scope.searching)
        //     return scope.sortedCourses.slice(scope.pager.startIndex, scope.pager.endIndex + 1);
        // else
        //     return $filter('searchFor')(scope.sortedCourses, scope.searchString);
    };
  });