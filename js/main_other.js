'use strict';
var app = angular.module('app',[]);

app.factory('MQQTNG',['$http',function($http){
	/*Here Comes the factory code, which can be accessed by all the controllers. This would be hte mqtt.js script*/	
	var factory = {};
	var url = 'http://git.eclipse.org/c/paho/org.eclipse.paho.mqtt.javascript.git/plain/src/mqttws31.js';
	
	factory.getJS = function() {
		var MQQTNG = $http.jsonp('js/mqttws31.js').success(function(data) {
	        console.log(data);
	    });
	    return MQQTNG;
	}	
	return factory;
}]);

app.controller('appController',['$scope','$rootscope' ,'$http', 'MQQTNG', function($scope, $rootscope, $http, MQQTNG) {

	$scope.hello = "Paho.MQQT";

	var phase = this.$root.$$phase;
	
	$rootscope.CONNECT = function(fn) {
		if(phase == 'apply' || phase == 'digest') {
			if(fn) {
				fn();
				console.log('Connect Triggered');
			}
		} else {
			this.$apply(fn);
		}
	};

	$rootscope.PUBLISH = function(fn) {
		if(phase == 'apply' || phase == 'digest') {
			if(fn) {
				fn();
				console.log('PUBLISH Triggered');
			}
		} else {
			this.$apply(fn);
		}
	};

	$rootscope.SUBSCRIBE = function(fn) {
		if(phase == 'apply' || phase == 'digest') {
			if(fn) {
				fn();
				console.log('SUBSCRIBE Triggered');
			}
		} else {
			this.$apply(fn);
		}
	};

	$rootscope.SUBSCRIBE = function(fn) {
		if(phase == 'apply' || phase == 'digest') {
			if(fn) {
				fn();
				console.log('SUBSCRIBE Triggered');
			}
		} else {
			this.$apply(fn);
		}
	};

	$rootscope.SUBSCRIBE = function(fn) {
		if(phase == 'apply' || phase == 'digest') {
			if(fn) {
				fn();
				console.log('PUBLISH Triggered');
			}
		} else {
			this.$apply(fn);
		}
	};
}]);