var app = angular.module('coinex', []);
app.controller('myController', function ($scope, $http) {
	$scope.profit = 0;
	var start = new Date();
	var start_string;
	var end_string;
	var end = new Date();
	var price;

	var dateToString = function(date) {
		var tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
		var localISOTime = (new Date(date - tzoffset)).toISOString().substring(0, 10);
		return localISOTime;
	};

	var setDates = function() {
		start_string = dateToString($scope.purchase_date);
		end_string = dateToString($scope.sell_date);
	}
	
	var retreiveTable = function(callback) {
		$http.get('https://api.coindesk.com/v1/bpi/historical/close.json', {
			params: {
				'start': start_string,
				'end': end_string,
			}
		}).then(function(data) {
			price = data.data.bpi;
			console.log(price);
			callback();
		});
	};

	var calculate_profit = function() {
		console.log(end_string);
		console.log(start_string);
		console.log(price);
		console.log(price[end_string]);
		console.log(price[start_string]);
		return (price[end_string] - price[start_string]) * $scope.amount;
	};

	$scope.calculate = function() {
		console.log($scope.purchase_date);
		console.log(dateToString($scope.purchase_date));	
		if ($scope.amount === undefined || $scope.amount < 0) {
			document.getElementById('error').innerHTML = "Please enter a valid amount.";
			throw("Amount is invalid or not defined.");
		}

		if ($scope.purchase_date === undefined || $scope.sell_date === undefined) {	
			document.getElementById('error').innerHTML = "Please enter a valid date.";
			throw("Date not defined.");
		}

		if ((start > $scope.purchase_date) || (end < $scope.sell_date)) {
			start = $scope.purchase_date;
			end = $scope.sell_date;
			setDates();
			retreiveTable(function() {
				$scope.profit = calculate_profit();
			});
		}
		else {
			setDates();
			$scope.profit = calculate_profit();
		}
		//$scope.$apply();
	};
});
