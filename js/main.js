'use strict';
var app = angular.module('app',[]);

app.factory('MQQTNG',function($http,$q){

	function Connector(args){
		var that=this;
		this.config=args;
		this.client=new Paho.MQTT.Client(args.host, Number(args.port),args.id);
		this.client.onConnectionLost = function(responseObject) {
			that.isConnected=false;
		  	if (responseObject.errorCode !== 0) that.emit('error',responseObject);
			that.emit('disconnect',responseObject);
		};
		this.client.onMessageArrived = function(msg) {
			that.subscriptions[msg.destinationName].messages.push(msg.payloadString);
			that.messages.push(msg);
			that.emit('message',{message:msg.payloadString,topic:msg.destinationName});
		};
		this.events={};
		this.messages=[];
		this.subscriptions=[];
		this.connect();
	};

	Connector.prototype.on =function(event,cb){
		this.events[event]=this.events[event]||[];
		if(typeof(cb)==='function'){
			this.events[event].push(cb);
		}else{
			throw 'event on should be a callback function';
		}
	}

	Connector.prototype.emit =function(event,result){
		var calls=this.events[event];
		if(calls){
			for(var x in calls){
				if(typeof(calls[x])==='function'){
					calls[x].apply(this,[result]);
				}
			}
		}
	}

	Connector.prototype.disconnect=function(){
		if(this.isConnected){
			this.isConnected=false;
			this.client.disconnect();
		}
	}

	Connector.prototype.subscribe=function(topic){
		var that=this;
		var sub={ topic:topic,messages:[],message:'Your message here',
			unsubscribe:function(){
				if(that.isConnected){
					that.client.unsubscribe(topic);
					if(that.subscriptions[topic]) delete that.subscriptions[topic];
					that.emit('unsubscribed',sub);
				}
			},
			send:function(){
				var msg = new Paho.MQTT.Message(this.message);
				msg.destinationName=this.topic;
				that.client.send(msg);
				this.message='';	
			}
		};
		that.client.subscribe(topic);
		that.subscriptions[topic]=sub;
		that.emit('subscribed',sub);
	}

	Connector.prototype.connect = function() {
		var that=this;
		function _onConnected(e) {
			that.isConnected=true;
			that.emit('connected',e);
		};

		function _onFailed(e){
			that.error='connection failed';
			that.emit('error',e);		
		}

		if(!this.isConnected){
			var conf=this.config;
			var params={onSuccess:_onConnected,onFailure:_onFailed};
			if(!!conf.userName){ params.userName=conf.userName; }
			if(!!conf.password){ params.password=conf.password; }
			if(!!conf.cleanSession){ params.cleanSession=conf.cleanSession; }
			if(!!conf.useSSL){ params.useSSL=conf.useSSL; }
			this.client.connect(params);
		}
	};
	return new Connector({host:'messagesight.demos.ibm.com',port:1883,id:'client'+Number(new Date())});
});

app.controller('appController',['$scope', '$http', 'MQQTNG', function($scope, $http, mq){

	$scope.isConnected=false;
	$scope.topic="/world";
	$scope.subscriptions=[];
	$scope.error = '';

	mq.on('message',function(msg){
		$scope.$digest();
	})

	mq.on('connected',function(msg){
		$scope.isConnected=true;
		$scope.$digest();
	})

	mq.on('subscribed',function(sub){
		$scope.topic="";
		$scope.subscriptions.push(sub);
	})

	mq.on('unsubscribed',function(sub){
		$scope.subscriptions.splice($scope.subscriptions.indexOf(sub),1);
	})

	mq.on('error',function(err){
		$scope.hasError=true;
		$scope.error=err.errorMessage;
	})
	
	$scope.subscribe = function(){
		mq.subscribe($scope.topic);
	};

}]);
