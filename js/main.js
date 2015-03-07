'use strict';
var app = angular.module('app',[]);

app.factory('MQQTNG',function($http,$q){
	return Paho.MQTT;
});

app.controller('appController',['$scope', '$http', 'MQQTNG', function($scope, $http, mq){
	$scope.host='messagesight.demos.ibm.com';
	$scope.port=1883;
	$scope.path='/mqtt';
	$scope.clientId='Client87758';

	//connection details
	$scope.userName='';
	$scope.password='';
	$scope.cleanSession=false;
	$scope.useSSL=false;
	$scope.hideBelow=true;

	//state values;
	$scope.isConnected=false;
	$scope.stateNext='Connect';
	$scope.status='Idle';
	$scope.error='';

	//publish
	$scope.message="your message here";
	$scope.qos=0;
	$scope.destinationName="/world";
	$scope.subscriptions=[];
	$scope.messages=[];

	var client;

	$scope.qos = ['0','1','2'];

	$scope.connectOrDisconnect = function(){

		if(client && client.isConnected()){
			client.disconnect();
			$scope.stateNext='Connect';
			return;
		}

		$scope.stateNext='Connecting';

		client = new mq.Client($scope.host, Number($scope.port), $scope.clientId);
		client.onConnectionLost = onConnectionLost;
		client.onMessageArrived = onMessageArrived;

		function onConnect() {
			$scope.status='Connected';
			$scope.hideBelow=false;
			$scope.isConnected=true;
			$scope.stateNext='Disconnect';
			$scope.$apply();
		};

		function onConnectionLost(responseObject) {
		  	$scope.status='Disconnected';
		  	$scope.hideBelow=true;
			$scope.isConnected=false;
		  	if (responseObject.errorCode !== 0)
				console.log("onConnectionLost:"+responseObject.errorMessage);
			$scope.$apply();
		};

		function onMessageArrived(message) {
			$scope.messages.push(message);
		  	console.log("onMessageArrived",message);
		  	$scope.$apply();
		};

		if(!$scope.isConnected){
			var p={onSuccess:onConnect,onFailure:function(e){
				$scope.status='Failed : '+e.errorMessage;
				$scope.stateNext='Connect';
				$scope.error='connection failed';
			}};
			if(!!$scope.userName){ p.userName=$scope.userName; }
			if(!!$scope.password){ p.password=$scope.password; }
			if(!!$scope.cleanSession){ p.cleanSession=$scope.cleanSession; }
			if(!!$scope.useSSL){ p.useSSL=$scope.useSSL; }
			client.connect(p);
		}else{
			$scope.disconnect();
		}
	};

	$scope.disconnect=function(){
		$scope.status='Disconnected';
	}

	$scope.publish = function(){
		var message = new mq.Message($scope.message);
		message.destinationName =$scope.topic;
		client.send(message);
	};
	$scope.subscribeConnection = function(){
		client.subscribe($scope.destinationName);
		$scope.subscriptions.push({
			value:$scope.destinationName,
			unsubscribe:function(){
				client.unsubscribe(this.value);
				$scope.subscriptions.remove(this);
			}
		})
		$scope.topic=$scope.destinationName;
		$scope.destinationName="";
		$scope.$apply();
		console.log('Subscribe Triggered')
	};

}]);
