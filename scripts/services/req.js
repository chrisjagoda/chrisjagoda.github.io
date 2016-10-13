'use strict';

angular.module('angularDjangoRegistrationAuthApp')
  .service('req', function req($location, $q, $http, $cookies, $rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // var forceSSL = function () {
    //     if ($location.protocol() !== 'https') {
    //         $window.location.href = $location.absUrl().replace('http', 'https');
    //     }
    // };
    //forceSSL();
    var service = {
        /* START CUSTOMIZATION HERE */
        // Change this to point to your Django REST Auth API
        // e.g. /api/rest-auth  (DO NOT INCLUDE ENDING SLASH)
        'API_URL': '/api',
        // Set use_session to true to use Django sessions to store security token.
        // Set use_session to false to store the security token locally and transmit it as a custom header.
        'use_session': false,
        /* END OF CUSTOMIZATION */
        'authenticated': null,
        'authPromise': null,
        'request': function(args) {            
            params = args.params || {}
            args = args || {};
            var deferred = $q.defer(),
                url = this.API_URL + args.url,                
                method = args.method || "GET",
                params = params,
                data = args.data || {};
            console.log(url);
            // Fire the request, as configured.
            $http({
                url: url,
                withCredentials: this.use_session,
                method: method.toUpperCase(),
                params: params,
                data: data
            })
            .success(angular.bind(this,function(data, status, headers, config) {
                deferred.resolve(data, status);
            }))
            .error(angular.bind(this,function(data, status, headers, config) {
                console.log("error syncing with: " + url);
                //console.log(data);
                // Set request status
                if(data){
                    data.status = status;
                }
                if(status == 0){
                    if(data == ""){
                        data = {};
                        data['status'] = 0;
                        data['non_field_errors'] = ["Could not connect. Please try again."];
                    }
                    // or if the data is null, then there was a timeout.
                    if(data == null){
                        // Inject a non field error alerting the user
                        // that there's been a timeout error.
                        data = {};
                        data['status'] = 0;
                        data['non_field_errors'] = ["Server timed out. Please try again."];
                    }
                }
                deferred.reject(data, status, headers, config);
            }));
            return deferred.promise;
        },
        'getCourses': function(){
            return this.request({
                'method': "GET",
                'url': "/courses/"
            }); 
        },
        'pager': function(totalItems, currentPage, pageSize){
            currentPage = currentPage || 1; 
            // default page size is 10
            pageSize = pageSize || 10;     
            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);
     
            var startPage, endPage;
            if (totalPages <= 10) {
                // less than 10 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 10 total pages so calculate start and end pages
                if (currentPage <= 6) {
                    startPage = 1;
                    endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 9;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 5;
                    endPage = currentPage + 4;
                }
            }

            // calculate start and end item indexes
            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
     
            // create an array of pages to ng-repeat in the pager control
            var pages = _.range(startPage, endPage + 1);
     
            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        },
        'initialize': function(url, sessions){
            this.API_URL = url;
            this.use_session = sessions;
        },
        'getStatus': function(status) {
            switch(status) {
                case 'e':
                    return "Enrolled";
                case 'c':
                    return "Complete";
                case 'i':
                    return "Inactive";
                default:
                    return "Enrolled";
            }
        }
    }
    return service;
  });