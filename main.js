
var localStoreName = 'quotes';

var QuoteObject = function(quoteText, quoteAuthor, quoteRating) {
	this.quoteText = quoteText;
	this.quoteAuthor = quoteAuthor;
	this.quoteRating = quoteRating;
	
	this.render = function() {
		console.log('Create DOM function has fired');
		var tempJqueryObject = $('<div class="quote-container">' + this.quoteText + '<p class="quote-author">' + this.quoteAuthor + '</p><div class="quote-rating">' + this.averageValue + '</div></div>');
		console.log(tempJqueryObject);
		$('#main').prepend(tempJqueryObject);
	};
	this.store = function(inProp) {
		var outputArray = createQuoteObjectArray(inProp);
		console.log('store has fired');
		outputArray.unshift(this);
		return turnArrayJsonAndStore(inProp, outputArray);
	};
	this.average = function() {
		var sum = _.reduce(this.quoteRating, function(memo, num){ return memo + num; }, 0);
		return (sum/(this.quoteRating.length)).toFixed(0);
	};

	this.averageValue = this.average();
};

var averageNumberArray = function(inArray) {
	var sum = _.reduce(inArray, function(memo, num){ return memo + num; }, 0);
	return (sum/(inArray.length)).toFixed(2);
};

var findObjectWithCertainValue = function(inArray, inProp, inId) {
	var outputArray = $.grep(inArray, function(el) { return el[ inProp ] === inId; });
	return (outputArray.length === 1) ? outputArray[0] : outputArray;
};

var removeObjectFromArray = function(tempObjectIn, inArray) {
	if( !(tempObject instanceof Array) ) {
		var tempObjectIndex = inArray.indexOf(tempObject); 
		var removedObject = inArray.splice(tempObjectIndex, 1);
		console.log('Object removed from list');
		return true;
	}
	else {
		console.log('You returned multiple objects with the same id');
		return false;
	}
};

var turnArrayJsonAndStore = function(inProp, inArray) {
	var jsonData = JSON.stringify(inArray);
	localStorage[ inProp ] = jsonData;
	return (localStorage [ inProp ] === jsonData)? true: false;
};

var storageToArray = function(inProp) {
	if(localStorage[ inProp ] === undefined || localStorage[ inProp ] === '') { localStorage[ inProp ] = '[]' }
	var outputArray = JSON.parse(localStorage[ inProp ]);
	return outputArray;
};

var createObjectListWithMethods = function(inArray) {
	var outputArray = [];
	for(var i=0; i < inArray.length; i++) {
		var tempObject = inArray[ i ];
		var newObject = new QuoteObject('', '', '');
		for(key in tempObject) {
			newObject[ key ] = tempObject[ key ];

		}
		outputArray.push(newObject);
	}
	return outputArray;
};

var createQuoteObjectArray = function(inProp) {
	return createObjectListWithMethods( storageToArray(inProp) );
};

var storeObjectLocalStorage = function(inProp, inObject) {
	var outputArray = createQuoteObjectArray( inProp );
	outputArray.unshift(inObject);
	return turnArrayJsonAndStore(inProp, outputArray);
};

var c = [new QuoteObject('hello', 'GOD', [{id: 0}]), new QuoteObject('herroo', 'Chairman Meow', [4]), new QuoteObject('suck it', 'Me', [10,1])]







$(document).on('ready', function() {

	$('.add-quote').click(function(event) {
		event.preventDefault();
		var tempTextValue = $('#quote-input').val();
		var tempAuthorValue = $('#author-input').val();
		console.log(tempTextValue);
		console.log(tempAuthorValue);
		alert('STOP!');
		var tempQuoteObject = new QuoteObject(tempTextValue, tempAuthorValue, [0]);
		tempQuoteObject.render();
		storeObjectLocalStorage(localStoreName, tempQuoteObject);
	});

  
});