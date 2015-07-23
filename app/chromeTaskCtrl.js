'use strict';

angular.module('app').controller('chromeTaskCtrl', function ($scope, chromeTaskStorage) {

    // chromeTask - Storage: to store the tags locally
    $scope.chromeTaskStorage = chromeTaskStorage;

    $scope.$watch('chromeTaskStorage.data', function() {
        console.log('watch(chromeTaskStorage.data)');
        $scope.chromeTaskList = $scope.chromeTaskStorage.data;
    });

    $scope.chromeTaskStorage.findAll(function(data){
        console.log('chromeTaskStorage.findAll');
        $scope.chromeTaskList = data;
        $scope.$apply();
    });

    $scope.add = function() {
        var storeTag = {
            domain: $scope.current.domain,  // can be dropped in future to optimize storage
            url: $scope.current.url,
            tag: $scope.newContent
        };
        chromeTaskStorage.add(storeTag);
        $scope.newContent = '';
    }

    $scope.remove = function(chromeTask) {
        chromeTaskStorage.remove(chromeTask);
    }

    $scope.removeAll = function() {
        chromeTaskStorage.removeAll();
        console.log ('current WINDOW_ID_CURRENT = ' + chrome.windows.WINDOW_ID_CURRENT);
        console.log('tabsURL = ' + tabs[0].url);
    }

    $scope.toggleCompleted = function() {
        chromeTaskStorage.sync();
    }

    // chromeTask - Utils

    // chromeTask - Globals
    $scope.current = {
        domain:     undefined,
        url:        undefined
    };

    // chromeTask - init
    $scope.init = function() {

        var setCurrentPageInfo = function(tabs) {
            $scope.current.url = tabs[0].url;            

            // Get domain name
            var matches = $scope.current.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            $scope.current.domain = matches && matches[1];  // null if no domain is found

            // Refresh the view
            $scope.$digest();
        };  

        chrome.tabs.query(
            {'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
            setCurrentPageInfo
        );
    }
});