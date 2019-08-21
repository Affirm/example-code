
setTimeout(function(){
var configuration = {
  	promoMessaging: window.affirm.merchant_config[0].promoMessaging,
  	checkout: window.affirm.merchant_config[0].checkout
}

// file variables
var logoPath = {
	blue :  "https://cdn-assets.affirm.com/images/black_logo-transparent_bg.png",
	white : "https://cdn-assets.affirm.com/images/white_logo-transparent_bg.png",
	black : "https://cdn-assets.affirm.com/images/all_black_logo-transparent_bg.png"
}

var position = {
	before : "beforebegin",
	after : "afterend",
	insideFirst : "afterbegin",
	insideLast : "beforeend"
}

//Items container

if(configuration.promoMessaging){

	insertPromo(configuration.promoMessaging.singlePromo[0], position);
	insertPromoList(configuration.promoMessaging.listPromo[0], position);
	insertLogo(configuration.promoMessaging.logo[0], position, logoPath);
	
	affirm.ui.refresh();
}


if(configuration.checkout){
	
	var checkout_submit = document.querySelector(configuration.checkout.submitEl);

	insertPaymentType(configuration.checkout.paymentButton, position, logoPath);
	checkout_submit.addEventListener('click', initiateAffirmCheckout);
}
}, 300);
function insertPromo(singlePromoConfig, position) {

  	let promoEl = document.querySelector(singlePromoConfig.promoEl),
		price = document.querySelector(singlePromoConfig.priceEl),
		promo = createPromo(singlePromoConfig, price.value);
	
	promoEl.insertAdjacentElement(position[singlePromoConfig.promoPos], promo);
}

function insertPromoList(listPromoConfig, position){

	let promoList = document.querySelectorAll(listPromoConfig.promoEl),
		priceList = document.querySelectorAll(listPromoConfig.priceEl);

	for(let i = 0; i < promoList.length; i++){

		let promo = createPromo(listPromoConfig, priceList[i].value);
		promoList[i].insertAdjacentElement(position[listPromoConfig.promoPos], promo);
	}
}

function insertLogo(logoConfig, position, logoPath){

	var logoTargets = document.querySelectorAll(logoConfig.target),
		logoTargetsLength = logoTargets.length,
		i = 0;
	
	let logo = createLogo(logoConfig.color, logoConfig.width, logoPath);
	
	for(i; i < logoTargetsLength; i++){
		
		logoTargets[i].insertAdjacentElement(position[logoConfig.position], logo);
	}
}

function createLogo(color, width, logoPath){

	let logo = document.createElement('img');

	logo.src = logoPath[color];
	logo.width = width;

	return logo;
}

function createPromo(config, amount){

	var promo = document.createElement('p');
	promo.className = 'affirm-as-low-as';
	promo.dataset.amount = amount;
	promo.dataset.affirmType = config.affirmType;

	if(config.affirmType === "logo") promo.dataset.affirmColor = config.logoColor;

	promo.dataset.pageType = config.pageType;

	return promo;
}

function checkoutCancel(a) {

	console.log(a);
}

function checkoutSuccess(a) {

	var config = window.affirm.merchant_config[0].checkout;

	console.log(a);
    addAffirmPixel(a.id);
	document.querySelector(config.cardOutput.nameEl).innerHTML = a.cardholder_name;
	document.querySelector(config.cardOutput.numberEl).innerHTML = a.number;
	document.querySelector(config.cardOutput.cvvEl).innerHTML = a.cvv;
	document.querySelector(config.cardOutput.expEl).innerHTML = a.expiration;

}
	
function addAffirmPixel(orderId, affirmPixel) {
    console.log('Affirm tracking pixel');

	var affirmPixel = {
		"storeName": "Affirm Example Code",
	    "currency": "USD",
	    "paymentMethod": "Affirm",
	    "shippingMethod": "Fedex"
	}

	var config = window.affirm.merchant_config[0].checkout;

    affirmPixel.shipping = document.querySelector(config.shipping).value;
    affirmPixel.tax = document.querySelector(config.tax).value;
    affirmPixel.orderId = orderId;
    affirmPixel.total = document.querySelector(config.total).value;
    affirm.analytics.trackOrderConfirmed(affirmPixel, getAllItemsforTracking());
}
	
function initiateAffirmCheckout() {
	var config = window.affirm.merchant_config[0].checkout;

	var _checkout_object = {
		"merchant": {
			"name": "Affirm Example Code",
		},
		"mode": "modal",
		"shipping": {
			"name": document.querySelector(config.full_name).value,
			"address": {
				"line1": document.querySelector(config.line1).value,
				"line2": document.querySelector(config.line2).value,
				"city": document.querySelector(config.city).value,
				"state": document.querySelector(config.state).value,
				"zipcode": document.querySelector(config.zip).value
			},
			"phone_number": document.querySelector(config.phone).value,
			"email": document.querySelector(config.email).value
		},
		"items": getAllItemsforCheckout(),
		"shipping_amount":document.querySelector(config.shipping).value,
		"tax_amount": document.querySelector(config.tax).value,
		"total": document.querySelector(config.total).value
	};
	console.log(_checkout_object);
	var _checkout = {
		success: checkoutSuccess,
      	error: checkoutCancel,
      	checkout_data: _checkout_object
	};
	affirm.checkout.open_vcn(_checkout);
}

function insertPaymentType(buttonConfig, position, logoPath){

	var payment_affirm = document.querySelector(buttonConfig.paymentEl);

	var checkout_button = document.createElement('input');
	checkout_button.type = "radio";
	checkout_button.id = 'payment_affirm_button';
	checkout_button.className = 'checkout_button';

	var label = document.createElement('label');

	var paymentName = document.createElement('span');
	paymentName.innerText = " ";

	if(buttonConfig.affirmType == "logo"){
		var logo = createLogo(buttonConfig.logoColor, buttonConfig.logoWidth, logoPath);
	} else {
		paymentName.innerText = "Affirm ";
	}

	paymentName.innerText += buttonConfig.paymentDescription;
	
	label.appendChild(checkout_button);
	if(logo) label.appendChild(logo);
	label.appendChild(paymentName);
	payment_affirm.insertAdjacentElement(position[buttonConfig.position],label);
}

 // Get all items - Needs modification as per items markup on checkout page
function getAllItemsforCheckout() {

	var config = window.affirm.merchant_config[0].checkout;
	var checkout_items = document.querySelectorAll(config.items.containerEl);

	let items = [],
		i = 0,
		itemsLength = checkout_items.length;

	for(i; i < itemsLength; i++){

		let item = {};
		item['display_name'] = checkout_items[i].querySelector(config.items.name).value;
		item['unit_price'] = checkout_items[i].querySelector(config.items.price).value;
		item['sku'] = checkout_items[i].querySelector(config.items.sku).value;
		item['qty'] = checkout_items[i].querySelector(config.items.qty).value;
		item['item_image_url'] = checkout_items[i].querySelector(config.items.image_url).value;
		item['item_url'] = checkout_items[i].querySelector(config.items.url).value;

		items.push(item);
	}

	return items;
}
  
// Get all items - Needs modification as per items markup on checkout page
function getAllItemsforTracking() {

	var config = window.affirm.merchant_config[0].checkout;
	var checkout_items = document.querySelectorAll(config.items.containerEl);

	let items = [],
		i = 0,
		itemsLength = checkout_items.length;

	for(i; i < itemsLength; i++){

		let item = {};
		item['name'] = checkout_items[i].querySelector(config.items.name).value;
		item['price'] = checkout_items[i].querySelector(config.items.price).value;
		item['productId'] = checkout_items[i].querySelector(config.items.sku).value;
		item['quantity'] = checkout_items[i].querySelector(config.items.qty).value;

		items.push(item);
	};

	return items;
}