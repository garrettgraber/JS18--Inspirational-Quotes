
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
	this.radioCheck = null;
	var that = this;
	
	this.render = function() {
		var mainContainer = $( '<div class="quote-container"></div>');
		var topContainerJquery = $('<div class="top-container"><span class="quote-text">' + this.quoteText 
			+ '</span><button class="quote-author"> - ' + this.quoteAuthor + '</button></div>');
		var bottomContainerJquery = $('<div class="bottom-container"><span class="quote-rating">Rating:  ' 
			+ this.averageValue + '</span><button class="delete-button">Delete</button></div>');
		var radioFormJqueryObject = $('<form class="radio-container"><div class="radio-title">Rate It:</div></form>');

		for(var i=1; i < 6; i++) {
			var jqueryHtmlString =  '<input class="rate-button" type="radio">' + '<span class="rate-title">' + i.toString() + '</span>';
			var inputFormJqueryObject = $(jqueryHtmlString);
			inputFormJqueryObject.addClass('rate' + i);
			if (this.radioCheck === i) { inputFormJqueryObject.prop('checked', true) }
			// + '<input class="rate-button rate2" type="radio"> 2'
			// + '<input class="rate-button rate3" type="radio"> 3'
			// + '<input class="rate-button rate4" type="radio"> 4'
			// + '<input class="rate-button rate5" type="radio"> 5'

			radioFormJqueryObject.append(inputFormJqueryObject);
		}

		bottomContainerJquery.append(radioFormJqueryObject);
		mainContainer.append(topContainerJquery);
		mainContainer.append(bottomContainerJquery);		
		mainContainer = setElementID(mainContainer, this.valID);
		return mainContainer;
	};
	this.remove = function(inProp) {
		var outputArray = createQuoteObjectArray(inProp);
		outputArray = removeObjectFromArrayUnderscore(this, outputArray);
		return turnArrayJsonAndStore(inProp, outputArray);
	};
	// Does not work properly
	this.store = function(inProp) {
		var outputArray = createQuoteObjectArray(inProp);
		outputArray = removeObjectFromArrayUnderscore(this, outputArray);
		outputArray.unshift(this);
		return turnArrayJsonAndStore(inProp, outputArray);
	};
	this.average = function() {
		if(this.quoteRating.length !== 0) {
			var sum = _.reduce(this.quoteRating, function(memo, num){ return memo + num; }, 0);
			var newAverage = parseFloat( (sum/(that.quoteRating.length)).toFixed(2) );
			this.averageValue = newAverage;
		}
		else {
			var newAverage = 0;
			this.averageValue = newAverage;
		}
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

var removeObjectFromArrayUnderscore = function(tempObjectIn, inArray) {
	var outArray = _.reject(inArray, function(el) {return el === tempObjectIn });
	return outArray;
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
	var newId = typeId + currentIdTemp.toString();
	currentIdValue = currentIdTemp;
	return newId;
};

var appendQuotesToMain = function(inArray) {

	if(inArray.length === undefined) {inArray = [inArray]};

	inArray = sortByRating(inArray);
	$('#main').empty();
	for(var i=0; i < inArray.length; i++) {
		var tempObject = inArray[ i ];
		tempObject = createObjectWithMethods(tempObject);
		var jqueryObject = tempObject.render();
		$('#main').append(jqueryObject);
	}
};

var sortByRating = function(inArray) {

	tempArray = inArray;
	var outArray = _.sortBy(inArray, function(el) {return el.averageValue});
	return outArray.reverse();
};

var tempArray;

var c = [new QuoteObject(createNewId(idQuoteBase, currentIdValue), 'hello', 'GOD', [2,1,2,3,3]), new QuoteObject(createNewId(idQuoteBase, currentIdValue), 'herroo', 'Chairman Meow', [5,2,3]), new QuoteObject(createNewId(idQuoteBase, currentIdValue), 'suck it', 'Me', [ 1, 1 ] ) ];

var tempQuoteObject1 = new QuoteObject(createNewId(idQuoteBase, currentIdValue), 'YES!', 'GOD', [2,1,2]);
c.push(tempQuoteObject1);

var tempQuoteObject2 = new QuoteObject(createNewId(idQuoteBase, currentIdValue), "A person who won't read has no advantage over one who can't read.", 'Mark Twain', [4, 4, 5]);
c.unshift(tempQuoteObject2);


// Input quotes
appendQuotesToMain(c);
turnArrayJsonAndStore(localStoreName, c);

$(document).on('ready', function() {

	$('.add-quote').click(function(event) {
		event.preventDefault();
		var tempTextValue = $('#quote-input').val();
		var tempAuthorValue = $('#author-input').val();
		var tempQuoteObject = new QuoteObject(createNewId(idQuoteBase, currentIdValue), tempTextValue, tempAuthorValue, []);		
		storeObjectLocalStorage(localStoreName, tempQuoteObject);
		var jqueryObject = tempQuoteObject.render();
		$('#main').append(jqueryObject);
	});

	$('.undo-delete-button').click(function() {
		if(lastDelete !== undefined) {
			var tempObject = createObjectWithMethods(lastDelete);
			var jqueryObject = tempObject.render();
			$('#main').append(jqueryObject);
			storeObjectLocalStorage(localStoreName, tempObject);
			lastDelete = undefined;
		}
		else {
			alert('No items have been deleted');
		}
	});

	$(document).on('click', '.delete-button', function() {
		var containerObject = $(this).closest('.quote-container');
		var containerObjectID = containerObject.attr("id");
		var quoteArray = storageToArray(localStoreName);
		var foundObject = findObjectWithCertainValue(quoteArray, 'valID', containerObjectID)
		lastDelete = foundObject;
		quoteArray = removeObjectFromArrayUnderscore(foundObject, quoteArray);
		containerObject.remove();
		appendQuotesToMain(quoteArray);
		turnArrayJsonAndStore(localStoreName, quoteArray);
	});

	$(document).on('click', '.rate-button', function() {
		var ratingObjectClass = $(this).attr('class');
		var ratingObjectClassLength = ratingObjectClass.length;
		var newRatingValue = parseInt(ratingObjectClass.slice(ratingObjectClassLength - 1, ratingObjectClassLength));
		if( $(this).is(':checked') ) {
			var rateButtonSiblings = $(this).siblings();
			for(var i=0; i < rateButtonSiblings.length; i++) {
				var tempJqueryObject = $(rateButtonSiblings[ i ]);
				if(tempJqueryObject.is(':checked')) {
					tempJqueryObject.prop('checked', false);
				}
			}
			var containerObject = $(this).closest('.quote-container');
			var containerObjectID = containerObject.attr("id");
			var quoteArray = storageToArray(localStoreName);
			var foundObject = findObjectWithCertainValue(quoteArray, 'valID', containerObjectID);
			quoteArray = removeObjectFromArrayUnderscore(foundObject, quoteArray);
			var foundObject = createObjectWithMethods(foundObject);
			foundObject.quoteRating.push(newRatingValue);
			foundObject.average();
			foundObject.radioCheck = newRatingValue;
			quoteArray.unshift(foundObject);
			appendQuotesToMain(quoteArray);
			turnArrayJsonAndStore(localStoreName, quoteArray);
		}
	});

	//add a pop-up
	$('.random-quote').click(function() {
		var quoteArray = createQuoteObjectArray(localStoreName);
		var randomQuoteObject = _.sample(quoteArray);
		alert(randomQuoteObject.toString());
		console.log('quoteArray: ');
		console.log(quoteArray);
		console.log('random quote: ');
		console.log(randomQuoteObject);
		var quoteJqueryObject = randomQuoteObject.render();

		var popUpJquery = $('<div class="pop-up-container"><button class="pop-up-exit header-button">Exit</button></div>');
		popUpJquery.append(quoteJqueryObject);
		$('body').append(popUpJquery);
	});

	$('.go-main').click(function() {
		var quoteArray = createQuoteObjectArray(localStoreName);
		appendQuotesToMain(quoteArray);

	});

	$(document).on('click', '.quote-author', function() {
		console.log( $(this).text() );
		var tempAuthorValue = $(this).text().slice(3);
		console.log('author event handler working: ' + tempAuthorValue);
		var quoteArray = createQuoteObjectArray(localStoreName);
		console.log('tempAuthorValue: ' + tempAuthorValue);
		var outArray = findObjectWithCertainValue(quoteArray, 'quoteAuthor', tempAuthorValue)
		appendQuotesToMain(outArray);
	});

	$(document).on('click', '.pop-up-exit', function() {
		var popUpContainer = $(this).closest('.pop-up-container');
		popUpContainer.remove();
	});

  
});