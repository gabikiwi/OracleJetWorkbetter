/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

var MockRESTServer = function (data, options) {
    options = options || {};
    
    var timeout = options['timeout'];
    var url = options['url'];
    var idurl = options['idUrl'];
    var proxy = options['proxy'];
    var fetchParam = options['fetchParam'];
    
    this.url = "/context-root/ojet/items";
    this.idUrl = MockRESTServer.idUrl;
    this.timeout = MockRESTServer.timeout;
    this.idPool = 1000;
    
    this.data = data;
    this.parentField = options['parentField'];
    this.idField = options['id'];
    var self = this;
    
    if (timeout)
        this.timeout = timeout;
    
    if (url)
        this.url = url;
    
    if (idurl)
        this.idUrl = idurl;
    
    var mockOptions = {
      url: this.url,
      type: 'GET',
      contentType: 'json',
      responseTime: 50,
      response: function(settings) { 
        var retVal;
        if (settings.hasOwnProperty('urlParams') && settings.urlParams.hasOwnProperty('id')) {
            retVal = self.getDataFromId(settings.urlParams.id);
        } else {
            retVal =  self.data ? JSON.stringify(self.data) : data;
        }
        
        // Test that certain headers are passed:
        if (window.equal !== undefined) {
            equal(settings['headers']['Accept-Language'], oj.Config.getLocale(), "Test Accept-Language locale header setting");
        }
        
        if (settings['dataType'] === 'jsonp' && settings['jsonpCallback']) {
            this.responseText = settings['jsonpCallback'] + "(" + retVal + ");";
        }
        else {
          this.responseText = retVal;
        }
      },
    };
    
    if (fetchParam) {
        mockOptions.urlParams = ['id'];
    }
    
    if (proxy) {
        mockOptions['proxy'] = proxy;
    }
    
    // fetch
    $.mockjax(mockOptions);      
    
    // delete
    $.mockjax({
        url: this.idUrl,
        urlParams: ['id'],
        type: 'DELETE',
        response: function (settings) {
            var id = settings.urlParams.id, data;
            // Find id in data list
            data = self.getData();
            for (var i = 0; i < data.length; i++) {
                if (data[i][self.idField] == id) {
                    data.splice(i, 1);
                    return;
                }
            }

        }
    });

    // create
    $.mockjax({
        url: this.url,
        type: 'POST',
        response: function (settings) {
            var data = self.getData();
            data.push(JSON.parse(settings.data));
            var item = data[data.length-1];
            // Assign an ID
            if (!item[self.idField]) {
                item[self.idField] = self.idPool.toString();
                self.idPool++;
            }
            this.responseText = item;
        }
    });
    
    // update
    $.mockjax({
        url: self.idUrl,
        urlParams: ['id'],
        type: 'PUT',
        response: function (settings) {
            var id = settings.urlParams.id, data;
            // Find id in data list
            var data = self.getData();
            for (var i = 0; i < data.length; i++) {
                var x = data[i];
                if (x[self.idField] == id) {
                    // Update data fields
                    data[i] = JSON.parse(settings.data);
                    this.responseText = data[i];
                }
            }

        }
    });
};

MockRESTServer.prototype.getDataFromId = function(id) {
    var data = this.getData();
    if (data instanceof Array) {
        var retVal = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i][this.parentField] == id) {
                retVal.push(data[i]);
            }
        }
        return JSON.stringify(retVal);
    }
    return data;    
};

MockRESTServer.prototype.getURL = function() {
    return this.url;
};

MockRESTServer.prototype.shutdown = function () {
    $.mockjax.clear();
};

MockRESTServer.prototype.getData = function() {
    var prop;
    
    // Check to see if data is lurking down property (like ADF bc REST)
    if (this.data instanceof Array)
        return this.data;
    
    for (prop in this.data) {
        if (this.data.hasOwnProperty(prop)) {
            if (this.data[prop] instanceof Array) {
                return this.data[prop];
            }
        }
    }
    return this.data;
};

MockRESTServer.timeout = 10;
MockRESTServer.idUrl = /^\/context-root\/ojet\/items\/([\d]+)$/i;
