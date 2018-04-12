var app = angular.module('coinex', []);
app.controller('myController', function ($scope, $http, $q) {
	$scope.profit = 0;
	$scope.proloss = "profit";
	$scope.coin = 'BTC';
	$scope.currency = 'USD';
	$scope.symbol = '$';
	$scope.amount = 0;
	$scope.tax = 0;
	var toTimestamp = function(strDate) {
		var datum = Date.parse(strDate);
		return datum/1000;
	}

	var getPriceOn = function(date, callback) {
		$http.get('https://min-api.cryptocompare.com/data/dayAvg', {
			params: {
				fsym: $scope.coin,
				tsym: $scope.currency,
				toTs: toTimestamp(date),
			}
		}).then(function(response) {
			console.log(response.data[$scope.currency]);
			callback(response.data[$scope.currency]);
		});
	}

	var calculate_profit = function() {

		return (sell_price - purchase_price) * $scope.amount;
	};

	$scope.changeSymbol = function() {
		switch ($scope.currency) {
			case 'INR':
				$scope.symbol = '₹';
				break;
			case 'USD':
				$scope.symbol = '$';
				break;
			case 'EUR':
				$scope.symbol = '€';
				break;
			case 'JPY':
				$scope.symbol = '¥';
				break;
			default:
				$scope.symbol = '$';
		}
	};

	$scope.calculate = function() {	
		if ($scope.amount === undefined || $scope.amount < 0) {
			throw("Amount is invalid or not defined.");
		}

		if ($scope.purchase_date === undefined || $scope.sell_date === undefined) {
			throw("Date not defined.");
		}

		getPriceOn($scope.purchase_date, function(data) {
			$scope.purchase_price = data;


			getPriceOn($scope.sell_date, function(response) {
				$scope.sell_price = response;
				$scope.profit = ($scope.sell_price - $scope.purchase_price) * $scope.amount;
				$scope.tax = ($scope.profit > 0) ? ($scope.profit * 0.3) : 0;
				$scope.proloss = ($scope.profit > 0) ? "profit" : "loss";
			});
		});
	};
}).filter('makePositive', function() {
    return function(num) { return Math.abs(num); }
})
