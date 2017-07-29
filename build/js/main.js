jQuery(document).ready(function($){
	var	scrolling = false;
	var contentSections = $('.cd-section'),
		verticalNavigation = $('.cd-vertical-nav'),
		navigationItems = verticalNavigation.find('a'),
		navTrigger = $('.cd-nav-trigger'),
		scrollArrow = $('.cd-scroll-down');



	// open navigation if user clicks the .cd-nav-trigger - small devices only
    navTrigger.on('click', function(event){
    	event.preventDefault();
		console.log("Clicked");
    	verticalNavigation.toggleClass('open');
    });


});
