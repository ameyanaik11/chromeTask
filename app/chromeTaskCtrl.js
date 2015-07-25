'use strict';

angular.module('app').controller('chromeTaskCtrl', ['$scope', '$mdSidenav', 'chromeTaskStorage', function ($scope, $mdSidenav, chromeTaskStorage) {
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
            tag: $scope.input.newTag.value
        };
        chromeTaskStorage.add(storeTag);
        $scope.input.newTag.value = undefined;
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
    $scope.input = {
        newTag: {
            label: 'New tag?',
            value: undefined
        },
        searchTag: {
            label: 'Filter tags',
            value: undefined
        },
    }

    // chromeTask - init
    $scope.init = function() {

        var setCurrentPageInfo = function(tabs) {
            $scope.current.url = tabs[0].url;            

            // Get domain name
            var matches = $scope.current.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            $scope.current.domain = matches && matches[1];  // null if no domain is found

            // Update input label
            $scope.input.newTag.label = "Add new tag for " + $scope.current.domain;
            $scope.input.searchTag.label = "Search a tags for " + $scope.current.domain;

            // Refresh the view
            $scope.$digest();
        };  

        chrome.tabs.query(
            {'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
            setCurrentPageInfo
        );
    }
}]);