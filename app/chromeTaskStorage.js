angular.module('app').service('chromeTaskStorage', function ($q) {
    var _this = this;
    this.data = [];

    this.sync = function() {
        chrome.storage.sync.set({chromeTask: this.data}, function() {
            console.log('Data is stored in Chrome storage');
        });
    }

    
    this.add = function (newContent) {
        var id = this.data.length + 1;
        var chromeTask = {
            id: id,
            content: newContent,
            completed: false,
            createdAt: new Date()
        };
        this.data.push(chromeTask);
        this.sync();
    }

    this.findAll = function(callback) {
        chrome.storage.sync.get('chromeTask', function(keys) {
            if (keys.chromeTask != null) {
                _this.data = keys.chromeTask;
                for (var i=0; i<_this.data.length; i++) {
                    _this.data[i]['id'] = i + 1;
                }
                console.log(_this.data);
                callback(_this.data);
            }
        });
    }
  
    this.remove = function(chromeTask) {
        this.data.splice(this.data.indexOf(chromeTask), 1);
        this.sync();
    }

    this.removeAll = function() {
        this.data = [];
        this.sync();
    }
});