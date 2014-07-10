
// Global variables
var localStoreName = 'quotes';
var idQuoteBase = 'zz';
localStorage.clear();
var lastDelete;

var randomNumber = function() {
	var maxRanVal = 30000;
	var minRanVal = 10000;
	return Math.floor(Math.random() * (maxRanVal - minRanVal) + minRanVal);
};

var currentIdValue = randomNumber();
console.log('currentIdValue: ' + currentIdValue);

var QuoteObject = function(idValue, quoteText, quoteAuthor, quoteRating) {
	this.quoteText = quoteText;
	this.quoteAuthor = quoteAuthor;
	this.quoteRating = quoteRating;
	this.valID = idValue;
	var that = this;
	console.log(this.valID);
	
	this.render = function() {
		console.log('Create DOM function has fired');
		var tempJqueryObject = $('<div class="quote-container"><p class="quote-text">' + this.quoteText 
			+ '</p><p class="quote-author"> - ' + this.quoteAuthor + '</p><div class="quote-rating">Rating:  ' 
			+ this.averageValue + '</div><button class="delete-button">Delete</button>' 
			+ '<div class="radio-container><p>Radio Buttons</p>'
			+ '<input class="rate-button rate1" type="Radio"> 1'
			+ '<input class="rate-button rate2" type="Radio"> 2'
			+ '<input class="rate-button rate3" type="Radio"> 3'
			+ '<input class="rate-button rate4" type="Radio"> 4'
			+ '<input class="rate-button rate5" type="Radio"> 5'
			+ '</div>'
			+ '</div>');
		console.log('tempJqueryObject: ' + tempJqueryObject);
		tempJqueryObject = setElementID(tempJqueryObject, this.valID);
		$('#main').prepend(tempJqueryObject);
		console.log('render has finished');
	};
	this.store = function(inProp) {
		var outputArray = createQuoteObjectArray(inProp);
		console.log('store has fired');
		outputArray.unshift(this);
		return turnArrayJsonAndStore(inProp, outputArray);
	};
	this.average = function() {
		var sum = _.reduce(this.quoteRating, function(memo, num){ return memo + num; }, 0);
		console.log('that.quoteRating.length: ' + that.quoteRating.length);
		return parseFloat( (sum/(that.quoteRating.length)).toFixed(0) );
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
	if( !(tempObjectIn instanceof Array) ) {
		var tempObjectIndex = inArray.indexOf(tempObjectIn); 
		var removedObject = inArray.splice(tempObjectIndex, 1);
		console.log('Object removed from list');
	}
	else {
		console.log('You returned multiple objects with the same id');
	}
	return inArray;
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
		var newObject = new QuoteObject('', '', '', []);
		for(key in tempObject) {
			newObject[ key ] = tempObject[ key ];

		}
		outputArray.push(newObject);
	}
	return outputArray;
};

var createObjectWithMethods = function(tempObject) {
	var newObject = new QuoteObject('', '', '', []);
	for(key in tempObject) {
		newObject[ key ] = tempObject[ key ];
	}
	return newObject;
};

var createQuoteObjectArray = function(inProp) {
	return createObjectListWithMethods( storageToArray(inProp) );
};

var storeObjectLocalStorage = function(inProp, inObject) {
	var outputArray = createQuoteObjectArray( inProp );
	console.log('outputArray: ' + outputArray);
	outputArray.unshift(inObject);
	return turnArrayJsonAndStore(inProp, outputArray);
};

var turnObjectValueToFloat = function(keyString, normalObject, checkString) {
	var outputVal;
	((keyString.slice(keyString.length - checkString.length)) === checkString) ? outputVal = parseFloat(normalObject[keyString]) : outputVal = normalObject[keyString];
	return outputVal;
};

var checkValueAndKeySync = function(keyString, normalObject, checkString) {
	var outputVal;
	((keyString.slice(keyString.length - checkString.length)) === checkString) ? outputVal = true : outputVal = false;
	return outputVal;
};

var setElementID = function(jqueryObject, currentObjectId) {
	return jqueryObject.attr("id", currentObjectId);
};

var createNewId = function(typeId, currentIdTemp) {
	var currentIdTemp = currentIdTemp + 10;
	console.log('currentIdValue: ' + currentIdTemp);
	var newId = typeId + currentIdTemp.toString();
	console.log('newId: ' + newId);
	currentIdValue = currentIdTemp;
	return newId;
};

var c = [new QuoteObject(createNewId(idQuoteBase, currentIdValue), 'hello', 'GOD', [0,1,2,3,3]), new QuoteObject(createNewId(idQuoteBase, currentIdValue), 'herroo', 'Chairman Meow', [5,2,3]), new QuoteObject(createNewId(idQuoteBase, currentIdValue), 'suck it', 'Me', [ 5, 4 ] ) ];

var appendListToMainContainer = function(inArray) {
	for(var i=0; i < inArray.length; i++) {
		var tempObject = inArray[ i ];

		console.log('append list on: ' + i);
		tempObject.render();

		storeObjectLocalStorage(localStoreName, tempObject);
		console.log('object has been stored');
	}
};

// Input quotes
appendListToMainContainer(c);

$(document).on('ready', function() {

	$('.add-quote').click(function(event) {
		event.preventDefault();
		var tempTextValue = $('#quote-input').val();
		var tempAuthorValue = $('#author-input').val();
		console.log(tempTextValue);
		console.log(tempAuthorValue);
		alert('STOP!');
		var tempQuoteObject = new QuoteObject(createNewId(idQuoteBase, currentIdValue), tempTextValue, tempAuthorValue, [0]);
		
		storeObjectLocalStorage(localStoreName, tempQuoteObject);
		tempQuoteObject.render();
		
	});

	$('.undo-delete-button').click(function() {
		if(lastDelete !== undefined) {
			var tempObject = createObjectWithMethods(lastDelete);
			tempObject.render();
			storeObjectLocalStorage(localStoreName, tempObject);
		}
		else {
			alert('No items have been deleted');
		}
	});

	$(document).on('click', '.delete-button', function() {
		var containerObject = $(this).closest('.quote-container');
		console.log($(this));
		var containerObjectID = containerObject.attr("id");
		console.log('containerObjectID: ' + containerObjectID);
		var quoteArray = storageToArray(localStoreName);

		var foundObject = findObjectWithCertainValue(quoteArray, 'valID', containerObjectID)
		lastDelete = foundObject;
		quoteArray = removeObjectFromArray(foundObject, quoteArray);
		turnArrayJsonAndStore(localStoreName, quoteArray);
		containerObject.remove();
	});

  
});