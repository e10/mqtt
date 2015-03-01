'use strict';
var app = angular.module('app',[]);

app.factory('MQQTNG',function($http,$q){
	return Paho.MQTT;
});

app.controller('appController',['$scope', '$http', 'MQQTNG', function($scope, $http, mq){
	$scope.host='google.com';
	$scope.port=80;
	$scope.path='/message';
	$scope.clientId='2301948';

	//connection details
	$scope.userName='anuj';
	$scope.password='password';
	$scope.cleanSession=false;
	$scope.useSSL=false;

	//state values;
	$scope.isConnected=false;
	$scope.stateNext='Connect';
	$scope.error='';

	var clientMQ;

	$scope.hello = "Paho.MQQT";

	$scope.connectOrDisconnect = function(){
		if(!clientMQ){
			clientMQ=new mq.Client($scope.host,$scope.port,$scope.path,$scope.clientId);
		}
		if(!$scope.isConnected){
			$scope.stateNext='Connecting';
			clientMQ.connect({
				userName:$scope.userName,
				password:$scope.password,
				cleanSession:$scope.cleanSession,
				useSSL:$scope.useSSL,
				onSuccess:function(){
					$scope.isConnected=true;
					$scope.stateNext='Disconnect';
					console.log('Connected');
				},
				onFailure:function(){
					$scope.stateNext='Connect';
					$scope.error='connection failed';
				}
			});
		}else{
			clientMQ.disconnect();
			console.log('Connect Triggered');
		}
	};

	$scope.publish = function(){
		mq.Client.connect();
		console.log('Publish Triggered')	
	};
	$scope.subscribe = function(){
		mq.Client.connect();
		console.log('Subscribe Triggered')
	};
	$scope.unsubscribe = function(){
		MQQTNG.CONNECT();	
		console.log('Unsubscribe Triggered')
	};

}]);