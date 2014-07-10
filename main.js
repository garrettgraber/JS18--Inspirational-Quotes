
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
			+ '<form class="radio-container"><p>Radio Buttons</p>'
			+ '<input class="rate-button rate1" type="radio"/><label>1</label>'
			+ '<input class="rate-button rate2" type="radio"> 2'
			+ '<input class="rate-button rate3" type="radio"> 3'
			+ '<input class="rate-button rate4" type="radio"> 4'
			+ '<input class="rate-button rate5" type="radio"> 5'
			+ '</form>'
			+ '</div>');
		console.log('tempJqueryObject: ' + tempJqueryObject);
		tempJqueryObject = setElementID(tempJqueryObject, this.valID);
		$('#main').prepend(tempJqueryObject);
		console.log('render has finished');
	};
	this.remove = function(inProp) {
		var outputArray = createQuoteObjectArray(inProp);
		console.log('store has fired');
		outputArray = removeObjectFromArray(this, outputArray);
		return turnArrayJsonAndStore(inProp, outputArray);
	}

	this.store = function(inProp) {
		var outputArray = createQuoteObjectArray(inProp);
		console.log('store has fired');

		outputArray = removeObjectFromArray(this, outputArray);
		outputArray.unshift(this);
		return turnArrayJsonAndStore(inProp, outputArray);
	};
	this.average = function() {
		console.log('average method has fired: ' + Object.keys(this));
		console.log('quote rating array: ' + this.quoteRating);
		var sum = _.reduce(this.quoteRating, function(memo, num){ return memo + num; }, 0);
		console.log('this.quoteRating.length: ' + this.quoteRating.length);
		var newAverage = parseFloat( (sum/(that.quoteRating.length)).toFixed(2) );
		this.averageValue = newAverage;
		return newAverage;
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
		(tempObjectIndex > -1)? removedObject = inArray.splice(tempObjectIndex, 1) : console.log('Object not in Array');	
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

	$(document).on('click', '.rate-button', function() {
	//	console.log('radio button clicked');
	//	console.log('Checked status: ' + $(this).is(':checked'));
		var ratingObjectClass = $(this).attr('class');
		var ratingObjectClassLength = ratingObjectClass.length;
		var newRatingValue = parseInt(ratingObjectClass.slice(ratingObjectClassLength - 1, ratingObjectClassLength));

		if( $(this).is(':checked') ) {

			var rateButtonSiblings = $(this).siblings();


			for(var i=0; i < rateButtonSiblings.length; i++) {
				var tempJqueryObject = $(rateButtonSiblings[ i ]);
				// console.log(tempJqueryObject + typeof tempJqueryObject);
				if(tempJqueryObject.is(':checked')) {
					tempJqueryObject.prop('checked', false);
				}
			}

			var containerObject = $(this).closest('.quote-container');
			// console.log($(this));
			var containerObjectID = containerObject.attr("id");
			console.log('containerObjectID: ' + containerObjectID);
			var quoteArray = storageToArray(localStoreName);

			console.log('quoteArray: ');
			console.log(quoteArray);

			var foundObject = findObjectWithCertainValue(quoteArray, 'valID', containerObjectID);
		//Add rating to object

			quoteArray = removeObjectFromArray(foundObject, quoteArray);


			console.log('foundObject: ')
			console.log(foundObject);

			var foundObject = createObjectWithMethods(foundObject);

			foundObject.quoteRating.push(newRatingValue);
			
			foundObject.average();

			console.log('foundObject average: ')
			console.log(foundObject.averageValue);

			quoteArray.unshift(foundObject);

			console.log('foundObject: ')
			console.log(foundObject);

			console.log('quoteArray: ');
			console.log(quoteArray);



			turnArrayJsonAndStore(localStoreName, quoteArray);

			console.log(localStorage[ localStoreName ]);





			// console.log('localStorage: ' + localStorage[localStoreName]);

			// foundObject.remove();

			// console.log('localStorage: ' + localStorage[localStoreName]);

			// foundObject.quoteRating.push(newRatingValue);
			
			// foundObject.average();

			// console.log('foundObject: ');
			// console.log(foundObject);

			// foundObject.store(localStoreName);

		}
	});

  
});