var app = angular.module('coinex', []);
app.controller('myController', function ($scope, $http, $q) {
	$scope.profit = 0;
	var purchase_date, purchase_price;
	var sell_date, sell_price;
	var currency, coin;

	var dateToString = function(date) {
		var tzoffset = date.getTimezoneOffset() * 60000;
		var localISOTime = (new Date(date - tzoffset)).toISOString().substring(0, 10);
		return localISOTime;
	};

	var toTimestamp = function(strDate) {
		var datum = Date.parse(strDate);
		return datum/1000;
	}

	var getPriceOn = function(date) {
		var def = $q.defer();
		$http.get('https://min-api.cryptocompare.com/data/dayAvg', {
			params: {
				fsym: $scope.coin,
				tsym: $scope.currency,
				toTs: toTimestamp(date),
			}
		}).then(function(response) {
			def.resolve(response.data[currency]);
		});
		return def.promise;
	}

	var setValues = function() {
		//var deferred = $q.defer();
		var purchaseFlag = false, sellFlag = false;
		if ($scope.amount === undefined || $scope.amount < 0) {
			throw("Amount is invalid or not defined.");
		}

		if ($scope.purchase_date === undefined || $scope.sell_date === undefined) {	
			throw("Date not defined.");
		}

		if (purchase_date !== $scope.purchase_date) {
			purchase_date = $scope.purchase_date;
			getPriceOn(purchase_date)
			.then(function(response) {
				purchase_price = response;
				console.log(purchase_price);
				purchaseFlag = true;
			});
		}

		if (sell_date !== $scope.sell_date) {
			sell_date = $scope.sell_date;
			getPriceOn(sell_date)
			.then(function(response) {
				sell_price = response;
				sellFlag = true;
			});
		}

		if (currency !== $scope.currency) {
			currency = $scope.currency;
			if (!purchaseFlag) {
				getPriceOn(purchase_date)
				.then(function(response) {
					purchase_price = response;
					purchaseFlag = true;
				});
			}

			if (!sellFlag) {
				getPriceOn(sell_date)
				.then(function(response) {
					sell_price = response;
					sellFlag = true;
				});
			}
		}

		if (coin !== $scope.coin) {
			coin = $scope.coin;
			if (!purchaseFlag) {
				getPriceOn(purchase_date, function(response) {
					purchase_price = response;
					purchaseFlag = true;
				});
			}

			if (!sellFlag) {
				getPriceOn(sell_date, function(response) {
					sell_price = response;
					sellFlag = true;
				});
			}
		}
		console.log(deferred.promise);
		//return deferred.promise;
	};

	$scope.calculate = function() {
		setValues();
	};
});
