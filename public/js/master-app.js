var BASE_URL = "https://who-here-test.herokuapp.com";

var USER = null;

var bulletinApp = angular.module('bulletinApp', ['ngRoute']);



bulletinApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider.
        when('/' , {
            templateUrl: 'templates/login.html',
            controller: 'boardCntrl'
        }).
        when('/board', {
            templateUrl: 'templates/board.html',
            controller: 'boardCntrl'
        })
    }]);




                 /**     Controllers    **/


/*************************  Board    ********************************/


bulletinApp.controller('bulletinCntrl', function ($scope, $rootScope, $http, $location) {
    
    $scope.connectedUser = {};
    

    //facebook login
    $scope.facebookInsert = function (){
        $scope.friendList = [];
        facebookLogin(function (friendList) {
            delete friendList['paging'];
            delete friendList['summary'];
            friendList.data.forEach(function (friend) {
                friend.profilePicture = friend.picture.data.url
                friend.bigProfilePicture = 'https://graph.facebook.com/' + friend.id + '/picture?height=215&width=215';
                delete friend['picture'];
            });
            
            USER.isNew = true;
            USER.friendsList = friendList.data;
            console.log('BASE_URL', BASE_URL);

            $http.post(BASE_URL + '/api/userInsert', { user: USER }).
                  success(function (data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                // if user has signed up or not
                if (data == null) {
                    console.log("date == null!!!!!");
                    $location.path('login');
                } else {
                    $scope.connectedUser = data;
                    console.log('$scope.connectedUser', $scope.connectedUser);
                    $scope.changeURL('board');
                }

            }).
                  error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                console.log('Error : data', data);
                console.log('Error : status', status);
                console.log('Error : headers', headers);
                console.log('Error : config', config);
                // Redirect user back to login page
                $location.path('signup');
            });
        });
    }
    
    
    $scope.users = {};
    $scope.calendar = {
        value : moment()
    }
    
    $scope.getDateFormat = function () {
        if (!$scope.calendar.value)
            return null;
        
        // if format already exists. return calendar.value
        return moment($scope.calendar.value).format("DD/MM/YYYY");
    }
    
    $scope.changeDate = function () {
        
        console.log("changeDate - $scope.calendar.value: ", $scope.calendar.value);
        
        updatedData($scope.getDateFormat());
    }
    
    //Changing the URL path
    $scope.changeURL = function (url) {
        $location.path(url);
    };
    
    
    $(document).ready(function () {
        
        /* API CALL  */
        
        //getting all users with their logs -- UPDATED
        $scope.calendar.value = new Date;
        updatedData($scope.getDateFormat());
    });

    var updatedData = function (updatedDate) {
        $http.post(window.location.origin + '/api/getupdatedData', { date : updatedDate }).
            success(function (data, status, headers, config) {
            if (data == null) {
                console.log('(getupdatedData == null)', data);
            } else {
                $scope.users = data;
            }

        }).
            error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Error : data', data);
            console.log('Error : status', status);
            console.log('Error : headers', headers);
            console.log('Error : config', config);
                            // Redirect user back to login page
                            //$location.path('signup');
        });
    }
    
    $scope.pass = '';

    //Checking password for enterence
    $scope.checkPassword = function (password) {
        if (password == '123')
            $scope.changeURL('board');
    };

});



/*************************  Logs    ********************************/

var logsApp = angular.module('logsApp', ['ngRoute']);

logsApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider.
        when('/' , {
            templateUrl: 'index.html',
            controller: 'logsCntrl'
        })
    }]);

logsApp.controller('logsCntrl', function ($scope, $rootScope, $http, $location) {
    
    $scope.logs = {};
    
    $scope.date = {
        value : moment()
    }
    
    $scope.dateFrom = {
        value : moment()
    }
    
    $scope.dateUntil = {
        value : moment()
    }

    
    $scope.changedDate = function (log){
        return log.date == $scope.date.value;
    }
    
    $scope.changedValue = function (){
        $scope.date.value = moment($scope.date.value).format("DD/MM/YYYY");
    }
    

    $(document).ready(function () {
        
        //getting all users with their logs -- UPDATED
        console.log('Document ready : ');
        $scope.date.value = null;
        $scope.dateFrom.value = null;
        $scope.dateUntil.value = null;


        $http.post(window.location.origin + '/api/getPopulateLog').
            success(function (data, status, headers, config) {
            if (data == null) {
                console.log('(getPopulateLog == null) at Client side /api/getPopulateLog', data);
            } else {
                console.log('Populate logs from api/getPopulateLog: ',data);
                $scope.logs = data;
                angular.forEach($scope.logs, function (log) {
                    log.dateCreated = moment("/Date(" + log.dateCreated + ")/");
                });
            }

        }).
            error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log('Error : data', data);
            console.log('Error : status', status);
            console.log('Error : headers', headers);
            console.log('Error : config', config);
                            // Redirect user back to login page
                            //$location.path('signup');
        });
        
    });
});