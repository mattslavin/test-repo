window.MC = window.MC || {};

window.MC.MCPT = (function($, window, document, undefined) {
    "use strict";

    var pluginName = "MCPT",
        defaults = {

        };

    function MCPT(element, options) {

        this.init();
    }

 
    MCPT.prototype.init = function() {
       
        var that = this;
        this.embedDoubleClick();

        // do the initialization stuff for the page here
        picturefill();
        this.attachEvents();
        this.responsiveSectionBackground();
        this.initSliders();
        this.adjustHeight();

         //if is tablet or mobile hide video
        var screenWidth = $(window).width();
        if (screenWidth<= 1024) {
            $('#intro-video').remove();
        } else {
            $('#video-alternative').remove();
            this.updateVideoSize();
        }

        this.allBenefits();
        this.simpleToggles();

        this.embedFlood = function(options, callback){
            return that.embedFloodlight(options.catStr); 
        };


    };

    MCPT.prototype.adjustHeight = function(){
    };

    MCPT.prototype.attachEvents = function() {
        var that = this;

        // use this for any event listeners
        /*
         * Modal - Add/remove classes and css when modals are brought up and closed
         */

        var currentModal,
            viewportHeight,
            viewportWidth;

        /*
         * Modal - Our little modal functionality
         * Each element that invokes the modal must have a data attribute of data-modalid which identifies the modal id to be shown
         *  and a class of ".trigger-modal"
         * The modal content must also have a class of ".modal-content" in addition to the aforementioned id
         */
        $(".trigger-modal").on("click", function(e) {
            e.preventDefault();

            currentModal = ("." + this.getAttribute("data-modalid"));
            viewportHeight = $(window).height();
            viewportWidth = $(window).width();
            var $modal = $('.modal' + currentModal),
                $content = $(".carousel-holder, .modal-content"); // depends on type of content contained in modal

            $modal.append($("<div class='overlay'><div class='overlay-header'><div class='overlay-close'></div></div></div>"));
            $modal.show();
            $('body').addClass('modal-open');
            $('#header-wrapper').addClass('modal-open');
            $modal.addClass('opened');

            // benefits specific modals
            if (this.getAttribute("data-benefit-id")) {
               // console.log("value to find: ", this.getAttribute("data-benefit-id"));
               // console.log("slider id: ", "#" + this.getAttribute("data-modalid") + "-collection");

                that.findSpecificSlide(this.getAttribute("data-benefit-id"), "#" + this.getAttribute("data-modalid") + "-collection");
            }

            // fix the width for the video thing

            // get the number of the slide we're on out of the total
            $modal.on('click', 'div.overlay-close', function() {
                var $modal = $('.modal' + currentModal),
                    $content = $modal.find('.modal-content');

                   
                    if($modal.hasClass("video-player")){
                        document.getElementById('popup-youtube-player').src='';
                        document.getElementById('popup-youtube-player').src='//www.youtube.com/embed/1-0T9_oYl-Q';

                    }
                $('.overlay').remove();



                $modal.hide();
                $content.css("width", "100%");
                $modal.css({
                    'top': '',
                    'left': '',
                    'width' : ''
                });

                $('body, #header-wrapper').removeClass('modal-open');
                $modal.removeClass('opened');
            });

            /*// OPEN ALL OFF SITE LINKS IN A NEW WINDOW
            $('a').each(function() {
               var a = new RegExp('/' + window.location.host + '/');
               if(!a.test(this.href)) {
                   $(this).click(function(event) {
                       event.preventDefault();
                       event.stopPropagation();
                       window.open(this.href, '_blank');
                   });
               }
            });*/
        });


        // If the browser resizes then resize the video
        $(window).resize(function() {
            if('#intro-video') {
                that.updateVideoSize();
            }

            that.responsiveSectionBackground();
        });


        window.onorientationchange = function() {
            var orientation = window.orientation;

            if (orientation === 0) {
            // iPad is in Portrait mode.

            } else if (orientation === 90) {
             // iPad is in Landscape mode. The screen is turned to the left.

            } else if (orientation === -90) {
             // iPad is in Landscape mode. The screen is turned to the right.

            } else if (orientation === 180) {
            // Upside down portrait.

            }
        } 

        // Sticky header
        // Check the initial Poistion of the Sticky Header
        var stickyHeaderTop = $('header').offset().top;
        // filter out tablet and mobile
        if ( $(window).width() > 1025 )  {
            $(window).scroll(function(){
                if ($(window).scrollTop() > stickyHeaderTop) {
                        $('header').css({position: 'fixed', top: '0px'});
                } else {
                        $('header').css({position: 'absolute', top: '30px'});
                }
            });
        }
    };

    MCPT.prototype.updateVideoSize = function() {
      
        // set up all the variables
        var techOrderArr,
            windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            windowAspect = windowWidth / windowHeight,
            videoPlayer = videojs('#intro-video'),
            videoElement = '#intro-video',
            mediaWidth = $(videoElement).data("setup").width,
            mediaHeight = $(videoElement).data("setup").height,
            mediaAspect = (mediaWidth / mediaHeight );
         
        // Tech Order - depending on the browser we set what type of video it wants
        if (!Modernizr.video.h264) {
            techOrderArr = ["flash","html5"];
            $('.video-js').data("setup").techOrder = techOrderArr;
        } else {
            techOrderArr = ["html5","flash"];
        }

        // calculate the size
        if (windowAspect < mediaAspect) {
            // TALLER
            // set the player height and width
            videoPlayer.height(windowHeight);
            videoPlayer.width(windowHeight * mediaAspect);

            // Safari & Chrome
            $(videoElement + '_html5_api').css({
                'top': 0,
                'left': -(windowHeight * mediaAspect - windowWidth) / 2,
                'height': windowHeight,
                'width': 'auto'
            });
            // if we are using a flash fallback set the flash object height and width
            $(videoElement + '_flash_api').css({
                //'top': -(windowWidth / mediaAspect - windowHeight) / 2,
                'height': windowHeight,
                'left': 0,
                'width': windowHeight * mediaAspect
            });
        } else {
            // WIDER
            // console.log("wider videos");
            // set the video player size
            videoPlayer.width(windowWidth);
            videoPlayer.height(windowWidth / mediaAspect);

            // Safari & Chrome
            $(videoElement + '_html5_api').css({
                'top': -(windowWidth / mediaAspect - windowHeight) / 2,
                'left': 0,
                'height': windowWidth / mediaAspect,
                'width': 'auto'
            });

             // if we are using a flash fallback set the flash object height and width
             $(videoElement + '_flash_api').css({
                //'top': -(windowWidth / mediaAspect - windowHeight) / 2,
                'height': windowWidth / mediaAspect + 200,
                'left': 0,
                'width': windowWidth
            });
            var updatedHeight = $(videoElement + '_flash_api').height();
            var updatedWidth = $(videoElement + '_flash_api').width();
             //console.log('Updated video size should be: ' + updatedHeight + 'h x ' + updatedWidth + 'w');
        }
        // place the nav bullets and scroll icon based on screen size
        $('#mcpt-intro .owl-controls, #mcpt-intro #scroll').css('top', windowHeight *  0.9);

        // programattically mute the video
        $('video').prop('muted', true);
        // now play
        videoPlayer.play();

        // force height for intro section slider items that are not video
        $('#intro .owl-item').height(windowHeight);
    };

    MCPT.prototype.simpleToggles = function() {
        // mobile nav toggle
        $('#hamburger').click(function(e) {
            e.preventDefault();
            $('#hamburger, #mobile-nav-wrapper').toggleClass('active');
            // set body width and hide overflow to handle bug in android tablet
            $('#mobile-nav-wrapper').css('overflow-y', 'scroll' );
            var mobileNavLeft = $(window).width() * 0.2;
            var tabletNavLeft = $(window).width() * 0.61;
            var scrollLock = $('body').scrollTop();
                scrollLock = "-" + scrollLock + "px";
            var screenHeight = $(window).height();
            var headerHeight = $('header').height();
            // set mobile nav inner height
            $('#mobile-nav-wrapper .scroller').height( screenHeight - headerHeight);
            if (!$('#mobile-nav-wrapper').hasClass('active')) { // nav closed
                $('html').removeClass('mobile-nav-open').css("top", '', "position", 'relative' );
                $('#mobile-nav-wrapper').css('left', '');
            } else { // nav open
                if ( $(window).width() <= 640 ) {
                    $('#mobile-nav-wrapper.active').css('left', mobileNavLeft );
                } else {
                     $('#mobile-nav-wrapper.active').css('left', tabletNavLeft );
                    // lock the main content from scrolling
                }
            }
        });
        // mobile nav clicks
        $('#mobile-nav-wrapper .mcpt-primary-nav a, #mobile-nav-wrapper .all-benefits-link a').on( "click", function(e) {
            // console.log('mobile nav hit' + e);
            e.preventDefault();

            //$('html').removeClass('mobile-nav-open').css('top', '', 'position', 'relative' );
            $('#mobile-nav-wrapper').css('left', '' );
            $('#hamburger, #mobile-nav-wrapper').removeClass('active');
        });
        // toggle mastercard sites on desktop, disable on tablet
        if ( $(window).width() >= 1024 )  {
            // console.log('mc-sites-link');
            // close mc sites link
            if ( $('.mc-sites-link.active').length ) {
                // console.log('mc sites active click');
                $(document).click(function (e) {
                    if($('.mc-sites.active').is(":visible") && !$('.mc-sites a').is(e.target)) {
                        $('.mc-sites, .mc-sites-link').toggleClass('active');
                        $('.mc-sites-link-overlay').remove();
                    }
                });
            } else {
                // console.log('mc sites NOT active click');
                $('.mc-sites-link').click(function(e) {
                   
                    e.preventDefault();
                    $('.mc-sites, .mc-sites-link').toggleClass('active');
                    $('body').append($("<div class='mc-sites-link-overlay'></div>"));

                });
            }

        }

         // Show hide more
        $(".show-card-benefit .toggle").on("click", function(e){
            $(e.target).parent().next(".more-info").toggle();
        })
    };

    MCPT.prototype.responsiveSectionBackground = function() {
      
        // do this on resize of screen also.
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();
        var backgrounds = $('body').find(".has-background");

        for (var i = 0; i < backgrounds.length; i++) {
            // check for page breakpoints

            // Reset all width and heights on refresh
            $('section').not('#intro').css({
                'height' : "",
                'width'  : ""
            });

            if (screenWidth <= 640) {
                if (!$('html').hasClass('mobile')){
                    $('html').addClass('mobile'); //due to the design we need this hook
                }
                // get the data attribute for the right size
                $(backgrounds[i]).css("background-image", " url('" + $(backgrounds[i]).data("bg-small") + "')");
                // show a fixed amount of carousel peekage
                // section height = viewport height + carousel height - peek amount
                $('section').not('#intro').css('height', (screenHeight + 220));
            } else if ( (screenWidth > 640 && screenWidth <= 1024) && (window.innerWidth > window.innerHeight) ) {
                // landscape view
                $(backgrounds[i]).css("background-image", " url('" + $(backgrounds[i]).data("bg-landscape") + "')");
                $('section').not('#intro').css('height', (screenHeight + 5));


            } else if ( (screenWidth > 640 && screenWidth <= 1024) && (window.innerHeight > window.innerWidth) ) {
                // portrait view
                $(backgrounds[i]).css("background-image", " url('" + $(backgrounds[i]).data("bg-portrait") + "')");
                $('section').not('#intro').css('width', (screenWidth));
            } else {
                $(backgrounds[i]).css("background-image", " url('" + $(backgrounds[i]).data("bg-large") + "') ");
                // show a fixed amount of carousel peekage
                // section height = viewport height + carousel height - peek amount
                $('section').not('#intro').css('height', (screenHeight + 220));
            }
        }

        // apply a style on the section for proper cropping
        var theWindow = $(window),
            //aspectRatio = 1.79487179 ;
            aspectRatio = 2;

            // set class based on aspect ratio
            if ( (theWindow.width() / theWindow.height()) < aspectRatio ) {
                backgrounds
                    .removeClass('bg-height, bg-width')
                    .addClass('bg-height');
            } else {
                backgrounds
                    .removeClass('bg-height, bg-width')
                    .addClass('bg-width');
            }
        // placement of mobile section carousels
        $('.mobile section .carousel-wrapper').css('margin-top', ($(window).height() * '.75' ));

        // RESPONSIVE INTRO SECTION BACKGROUNDS
        var introAspectRatio = 1.79487179;

        //if (theWindow.width() > 1024) {
            if ( (theWindow.width() / theWindow.height()) < introAspectRatio ) {
                $('#slide1, #slide2, #video-alternative, #slide4').removeClass('bg-height, bg-width').addClass('bg-height');
                if (theWindow.width() > 1024) {
                    var introImageWidth = $('#intro .bg-height img').width();
               }

            } else {
                $('#slide1, #slide2, #video-alternative, #slide4').removeClass('bg-height, bg-width').addClass('bg-width');
            }
        //}

    };

    MCPT.prototype.initSliders = function() {

        $('#intro-slider').owlCarousel({
            singleItem: true,
            pagination: true,
            autoPlay: false,
            //lazyLoad: true
            responsive: true
        });


        $(".section-carousel").owlCarousel({
            pagination: true,
            items: 3,
            itemsDesktop: [2000, 3],
            itemsTablet: [768, 2],
            itemsMobile: [479, 1],
            navigation: true,
            navigationText: ['<div><img src="images/nav/leftArrow.png"></div>', '<div><img src="images/nav/rightArrow.png"></div>'],
            lazyLoad: true,
            responsive: true

        });

        $("#dreaming-modal-collection").owlCarousel({
            singleItem: true,
            pagination: true,
            navigation: true,
            responsive: true,
            navigationText: ['<div><img src="images/nav/arrow-modal-carousel.png"></div>', '<div><img src="images/nav/arrow-modal-carousel.png"></div>'],
            afterAction: function() {
                var totalItems = $('#dreaming-modal-collection .owl-page').length;
                var currentIndex = $('#dreaming-modal-collection .owl-page.active').index() +1;

                $(".carousel-counter").text(currentIndex + " / " + totalItems);
            },
            lazyLoad: true
        });

        $("#planning-modal-collection").owlCarousel({
            singleItem: true,
            pagination: true,
            navigation: true,
            responsive: true,
            navigationText: ['<div><img src="images/nav/arrow-modal-carousel.png"></div>', '<div><img src="images/nav/arrow-modal-carousel.png"></div>'],
            afterAction: function() {
                var totalItems = $('#planning-modal-collection .owl-page').length;
                var currentIndex = $('#planning-modal-collection .owl-page.active').index() + 1;
                $(".carousel-counter").text(currentIndex + " / " + totalItems);
            },
            lazyLoad: true
        });

        $("#travel-modal-collection").owlCarousel({
            singleItem: true,
            pagination: true,
            navigation: true,
            responsive: true,
            navigationText: ['<div><img src="images/nav/arrow-modal-carousel.png"></div>', '<div><img src="images/nav/arrow-modal-carousel.png"></div>'],
            afterAction: function() {
                var totalItems = $('#travel-modal-collection .owl-page').length;
                var currentIndex = $('#travel-modal-collection .owl-page.active').index() + 1;
                $(".carousel-counter").text(currentIndex + " / " + totalItems);
            },
            lazyLoad: true
        });

        $("#vacation-modal-collection").owlCarousel({
            singleItem: true,
            pagination: true,
            navigation: true,
            responsive: true,
            navigationText: ['<div><img src="images/nav/arrow-modal-carousel.png"></div>', '<div><img src="images/nav/arrow-modal-carousel.png"></div>'],
            afterAction: function() {
                var totalItems = $('#vacation-modal-collection .owl-page').length;
                var currentIndex = $('#vacation-modal-collection .owl-page.active').index() + 1;
                $(".carousel-counter").text(currentIndex + " / " + totalItems);
            },
            lazyLoad: true
        });

        $("#oneMoreDay-modal-collection").owlCarousel({
            singleItem: true,
            pagination: true,
            navigation: true,
            responsive: true,
            navigationText: ['<div><img src="images/nav/arrow-modal-carousel.png"></div>', '<div><img src="images/nav/arrow-modal-carousel.png"></div>'],
            afterAction: function() {
                var totalItems = $('#oneMoreDay-modal-collection .owl-page').length;
                var currentIndex = $('#oneMoreDay-modal-collection .owl-page.active').index() + 1;
                $(".carousel-counter").text(currentIndex + " / " + totalItems);
            },
            lazyLoad: true
        });
       
        if(window.location.search == ""){
            // console.log("no search");
        }else {
            // console.log("I need to search");
            var slideId = this.getQueryString();
            // console.log("slide id: ", slideId);
            this.findSpecificSlide(slideId[1], slideId[0], slideId[2]);
        }
    };

    MCPT.prototype.allBenefits = function() {
        // first populate the contents
        // world elite
        $('.benefit-outer.world-elite').clone().appendTo('#all-benefits');
        // world
        $('.benefit-outer.world').clone().appendTo('#all-benefits');
        // standard
        $('.benefit-outer.standard').clone().appendTo('#all-benefits');

        // accordion
        var allPanels = $('#all-benefits .benefit-outer');
        // reset all panels
        $(allPanels).removeClass('active');
        // start by preselecting world benefits
        $('#accordion-benefits-nav a.world-card').addClass('active');
        $('.benefit-outer.standard, .benefit-outer.world').addClass('active');


        // toggle benefit info when clicked
        //TODO: now that the caret is on the benefit-outer and we are passing that a class we can clean all this up and adust CSS too
        $('#all-benefits h3').click(function() {
            
            if ($(this).parent().hasClass('active')) {
                $('.benefit-outer').removeClass('open');
                $('.benefit-description, .benefit-offer').removeClass('active');
            } else {
                $('.benefit-outer').removeClass('open');
                $('.benefit-description, .benefit-offer').removeClass('active');
                $(this).parent().addClass('active');
                $(this).parent().siblings('.benefit-offer').addClass('active');
                $(this).closest('.benefit-outer').addClass('open');
            }
            return false;
        });

        // ALL BENEFITS NAVIGATION
        // since we can update the nav contents by either a select
        $('#accordion-benefits-select').on('change', function() {
            cardChange(this.value);
        });
        // or click
        $('#accordion-benefits-nav a').click(function() {
            var cardType = this.className;
            cardChange(cardType);
        });
        // process our results
        function cardChange(cardType) {
        // toggle benefits in accordion based on card type selected
            // update nav
            $('#accordion-benefits-nav a').removeClass('active');
            // make sure all open panels are closed
            $('.benefit-description, .benefit-offer').removeClass('active');
            // do the needful
            switch (true) {
                case (cardType.indexOf('standard-card') !== -1):
                   $('#accordion-benefits-nav a.standard-card').addClass('active');
                    $('.accordion .world, .accordion .world-elite').removeClass('active');
                    break;
                case (cardType.indexOf('world-card') !== -1):
                    $('#accordion-benefits-nav a.world-card').addClass('active');
                    $('.accordion .world-elite').removeClass('active');
                    $('.accordion .standard, .accordion .world').addClass('active');
                    break;
                case (cardType.indexOf('world-elite-card') !== -1):
                    $('#accordion-benefits-nav a.world-elite-card').addClass('active');
                    $('.accordion .standard, .accordion .world, .accordion .world-elite').addClass('active');
                    break;
            }
        }
    };

    /*
     * Land on a specific intro carousel slide from an external link
     * Append unique slide ID in query string to url
     */
    MCPT.prototype.getQueryString = function() {
         // get the query string attached to the URL
        // i.e. ?slide=slide1
        var query = window.location.search;
        
        // get just what's after ?section=
        // Gets the slide we want.
        var data = query.split("&", 2);
        var section = data[0].split("=", 2);
       
        // change book to planning
        if (section[1] === 'book') {
            section = 'planning';
        } else {
            section = section[1];
        }

        var slide = data[1].split("=", 2);
        slide = slide[1];

        var queryString = true;

        return [section, slide, queryString];
    };

    /*
     * Navigates to a specific slide within a slider
     * Each item in a slider needs an ID attached to it.
     * TODO: Choose which slider specifically we want to get this info from.
     */
    MCPT.prototype.findSpecificSlide = function(value, sliderId, queryString) {
        var owlData;
        if(queryString){
            if(sliderId != "intro"){
                // owlData ID should be whichever slider we are looking for.
                owlData = $("#"+sliderId + "-carousel").data("owlCarousel");
               $('*[data-benefit-id="'+value+'"]').click();
            }else {
                // this is the intro, do special things
                 owlData = $("#"+sliderId+"-slider").data("owlCarousel");
            }


        }else {
            owlData = $(sliderId).data("owlCarousel");
        }


        // get the array of things in the slider
        var slideArray = owlData.$userItems;
      
        // create an empty array holder.
        var idArray = [];
        // loop through the slide array and push the IDs into the holder array.
        for (var i = 0; i < slideArray.length; i++) {
           idArray.push(slideArray[i].id);
        }
       
        // get the index of the slide you need based on the location hash
        var locationIndex = $.inArray(value, idArray);
       
        // update the slider position
        owlData.goTo(locationIndex);
    };







    MCPT.prototype.embedDoubleClick = function(){

        var url = document.URL, idx = url.indexOf("#")
        var hash = idx != -1 ? url.substring(idx+1) : "";
        var cat = "";
        var activityId = "";

      
        // Needs code here

        if (activityId !==""){
            var catStr = pageMap[activityId].cat;
            this.embedFloodlight(catStr);
        }


        var axel = Math.random() + "";
        var a = axel * 10000000000000;

     
        // Trigger Events on Buttons
        // Have left comments in to make it easier to debug

        window.MC = window.MC || {};

window.MC.MCPT = (function($, window, document, undefined) {
    "use strict";

    var pluginName = "MCPT",
        defaults = {

        };

    function MCPT(element, options) {

        this.init();
    }

 
    MCPT.prototype.init = function() {
       
        var that = this;
        this.embedDoubleClick();

        // do the initialization stuff for the page here
        picturefill();
        this.attachEvents();
        this.responsiveSectionBackground();
        this.initSliders();
        this.adjustHeight();

         //if is tablet or mobile hide video
        var screenWidth = $(window).width();
        if (screenWidth<= 1024) {
            $('#intro-video').remove();
        } else {
            $('#video-alternative').remove();
            this.updateVideoSize();
        }

        this.allBenefits();
        this.simpleToggles();

        this.embedFlood = function(options, callback){
            return that.embedFloodlight(options.catStr); 
        };


    };

    MCPT.prototype.adjustHeight = function(){
    };

    MCPT.prototype.attachEvents = function() {
        var that = this;

        // use this for any event listeners
        /*
         * Modal - Add/remove classes and css when modals are brought up and closed
         */

        var currentModal,
            viewportHeight,
            viewportWidth;

        /*
         * Modal - Our little modal functionality
         * Each element that invokes the modal must have a data attribute of data-modalid which identifies the modal id to be shown
         *  and a class of ".trigger-modal"
         * The modal content must also have a class of ".modal-content" in addition to the aforementioned id
         */
        $(".trigger-modal").on("click", function(e) {
            e.preventDefault();

            currentModal = ("." + this.getAttribute("data-modalid"));
            viewportHeight = $(window).height();
            viewportWidth = $(window).width();
            var $modal = $('.modal' + currentModal),
                $content = $(".carousel-holder, .modal-content"); // depends on type of content contained in modal

            $modal.append($("<div class='overlay'><div class='overlay-header'><div class='overlay-close'></div></div></div>"));
            $modal.show();
            $('body').addClass('modal-open');
            $('#header-wrapper').addClass('modal-open');
            $modal.addClass('opened');

            // benefits specific modals
            if (this.getAttribute("data-benefit-id")) {
               // console.log("value to find: ", this.getAttribute("data-benefit-id"));
               // console.log("slider id: ", "#" + this.getAttribute("data-modalid") + "-collection");

                that.findSpecificSlide(this.getAttribute("data-benefit-id"), "#" + this.getAttribute("data-modalid") + "-collection");
            }

            // fix the width for the video thing

            // get the number of the slide we're on out of the total
            $modal.on('click', 'div.overlay-close', function() {
                var $modal = $('.modal' + currentModal),
                    $content = $modal.find('.modal-content');

                   
                    if($modal.hasClass("video-player")){
                        document.getElementById('popup-youtube-player').src='';
                        document.getElementById('popup-youtube-player').src='//www.youtube.com/embed/1-0T9_oYl-Q';

                    }
                $('.overlay').remove();



                $modal.hide();
                $content.css("width", "100%");
                $modal.css({
                    'top': '',
                    'left': '',
                    'width' : ''
                });

                $('body, #header-wrapper').removeClass('modal-open');
                $modal.removeClass('opened');
            });

            /*// OPEN ALL OFF SITE LINKS IN A NEW WINDOW
            $('a').each(function() {
               var a = new RegExp('/' + window.location.host + '/');
               if(!a.test(this.href)) {
                   $(this).click(function(event) {
                       event.preventDefault();
                       event.stopPropagation();
                       window.open(this.href, '_blank');
                   });
               }
            });*/
        });


        // If the browser resizes then resize the video
        $(window).resize(function() {
            if('#intro-video') {
                that.updateVideoSize();
            }

            that.responsiveSectionBackground();
        });


        window.onorientationchange = function() {
            var orientation = window.orientation;

            if (orientation === 0) {
            // iPad is in Portrait mode.

            } else if (orientation === 90) {
             // iPad is in Landscape mode. The screen is turned to the left.

            } else if (orientation === -90) {
             // iPad is in Landscape mode. The screen is turned to the right.

            } else if (orientation === 180) {
            // Upside down portrait.

            }
        } 

        // Sticky header
        // Check the initial Poistion of the Sticky Header
        var stickyHeaderTop = $('header').offset().top;
        // filter out tablet and mobile
        if ( $(window).width() > 1025 )  {
            $(window).scroll(function(){
                if ($(window).scrollTop() > stickyHeaderTop) {
                        $('header').css({position: 'fixed', top: '0px'});
                } else {
                        $('header').css({position: 'absolute', top: '30px'});
                }
            });
        }
    };

    MCPT.prototype.updateVideoSize = function() {
      
        // set up all the variables
        var techOrderArr,
            windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            windowAspect = windowWidth / windowHeight,
            videoPlayer = videojs('#intro-video'),
            videoElement = '#intro-video',
            mediaWidth = $(videoElement).data("setup").width,
            mediaHeight = $(videoElement).data("setup").height,
            mediaAspect = (mediaWidth / mediaHeight );
         
        // Tech Order - depending on the browser we set what type of video it wants
        if (!Modernizr.video.h264) {
            techOrderArr = ["flash","html5"];
            $('.video-js').data("setup").techOrder = techOrderArr;
        } else {
            techOrderArr = ["html5","flash"];
        }

        // calculate the size
        if (windowAspect < mediaAspect) {
            // TALLER
            // set the player height and width
            videoPlayer.height(windowHeight);
            videoPlayer.width(windowHeight * mediaAspect);

            // Safari & Chrome
            $(videoElement + '_html5_api').css({
                'top': 0,
                'left': -(windowHeight * mediaAspect - windowWidth) / 2,
                'height': windowHeight,
                'width': 'auto'
            });
            // if we are using a flash fallback set the flash object height and width
            $(videoElement + '_flash_api').css({
                //'top': -(windowWidth / mediaAspect - windowHeight) / 2,
                'height': windowHeight,
                'left': 0,
                'width': windowHeight * mediaAspect
            });
        } else {
            // WIDER
            // console.log("wider videos");
            // set the video player size
            videoPlayer.width(windowWidth);
            videoPlayer.height(windowWidth / mediaAspect);

            // Safari & Chrome
            $(videoElement + '_html5_api').css({
                'top': -(windowWidth / mediaAspect - windowHeight) / 2,
                'left': 0,
                'height': windowWidth / mediaAspect,
                'width': 'auto'
            });

             // if we are using a flash fallback set the flash object height and width
             $(videoElement + '_flash_api').css({
                //'top': -(windowWidth / mediaAspect - windowHeight) / 2,
                'height': windowWidth / mediaAspect + 200,
                'left': 0,
                'width': windowWidth
            });
            var updatedHeight = $(videoElement + '_flash_api').height();
            var updatedWidth = $(videoElement + '_flash_api').width();
             //console.log('Updated video size should be: ' + updatedHeight + 'h x ' + updatedWidth + 'w');
        }
        // place the nav bullets and scroll icon based on screen size
        $('#mcpt-intro .owl-controls, #mcpt-intro #scroll').css('top', windowHeight *  0.9);

        // programattically mute the video
        $('video').prop('muted', true);
        // now play
        videoPlayer.play();

        // force height for intro section slider items that are not video
        $('#intro .owl-item').height(windowHeight);
    };

    MCPT.prototype.simpleToggles = function() {
        // mobile nav toggle
        $('#hamburger').click(function(e) {
            e.preventDefault();
            $('#hamburger, #mobile-nav-wrapper').toggleClass('active');
            // set body width and hide overflow to handle bug in android tablet
            $('#mobile-nav-wrapper').css('overflow-y', 'scroll' );
            var mobileNavLeft = $(window).width() * 0.2;
            var tabletNavLeft = $(window).width() * 0.61;
            var scrollLock = $('body').scrollTop();
                scrollLock = "-" + scrollLock + "px";
            var screenHeight = $(window).height();
            var headerHeight = $('header').height();
            // set mobile nav inner height
            $('#mobile-nav-wrapper .scroller').height( screenHeight - headerHeight);
            if (!$('#mobile-nav-wrapper').hasClass('active')) { // nav closed
                $('html').removeClass('mobile-nav-open').css("top", '', "position", 'relative' );
                $('#mobile-nav-wrapper').css('left', '');
            } else { // nav open
                if ( $(window).width() <= 640 ) {
                    $('#mobile-nav-wrapper.active').css('left', mobileNavLeft );
                } else {
                     $('#mobile-nav-wrapper.active').css('left', tabletNavLeft );
                    // lock the main content from scrolling
                }
            }
        });
        // mobile nav clicks
        $('#mobile-nav-wrapper .mcpt-primary-nav a, #mobile-nav-wrapper .all-benefits-link a').on( "click", function(e) {
            // console.log('mobile nav hit' + e);
            e.preventDefault();

            //$('html').removeClass('mobile-nav-open').css('top', '', 'position', 'relative' );
            $('#mobile-nav-wrapper').css('left', '' );
            $('#hamburger, #mobile-nav-wrapper').removeClass('active');
        });
        // toggle mastercard sites on desktop, disable on tablet
        if ( $(window).width() >= 1024 )  {
            // console.log('mc-sites-link');
            // close mc sites link
            if ( $('.mc-sites-link.active').length ) {
                // console.log('mc sites active click');
                $(document).click(function (e) {
                    if($('.mc-sites.active').is(":visible") && !$('.mc-sites a').is(e.target)) {
                        $('.mc-sites, .mc-sites-link').toggleClass('active');
                        $('.mc-sites-link-overlay').remove();
                    }
                });
            } else {
                // console.log('mc sites NOT active click');
                $('.mc-sites-link').click(function(e) {
                   
                    e.preventDefault();
                    $('.mc-sites, .mc-sites-link').toggleClass('active');
                    $('body').append($("<div class='mc-sites-link-overlay'></div>"));

                });
            }

        }

         // Show hide more
        $(".show-card-benefit .toggle").on("click", function(e){
            $(e.target).parent().next(".more-info").toggle();
        })
    };

    MCPT.prototype.responsiveSectionBackground = function() {
      
        // do this on resize of screen also.
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();
        var backgrounds = $('body').find(".has-background");

        for (var i = 0; i < backgrounds.length; i++) {
            // check for page breakpoints

            // Reset all width and heights on refresh
            $('section').not('#intro').css({
                'height' : "",
                'width'  : ""
            });

            if (screenWidth <= 640) {
                if (!$('html').hasClass('mobile')){
                    $('html').addClass('mobile'); //due to the design we need this hook
                }
                // get the data attribute for the right size
                $(backgrounds[i]).css("background-image", " url('" + $(backgrounds[i]).data("bg-small") + "')");
                // show a fixed amount of carousel peekage
                // section height = viewport height + carousel height - peek amount
                $('section').not('#intro').css('height', (screenHeight + 220));
            } else if ( (screenWidth > 640 && screenWidth <= 1024) && (window.innerWidth > window.innerHeight) ) {
                // landscape view
                $(backgrounds[i]).css("background-image", " url('" + $(backgrounds[i]).data("bg-landscape") + "')");
                $('section').not('#intro').css('height', (screenHeight + 5));


            } else if ( (screenWidth > 640 && screenWidth <= 1024) && (window.innerHeight > window.innerWidth) ) {
                // portrait view
                $(backgrounds[i]).css("background-image", " url('" + $(backgrounds[i]).data("bg-portrait") + "')");
                $('section').not('#intro').css('width', (screenWidth));
            } else {
                $(backgrounds[i]).css("background-image", " url('" + $(backgrounds[i]).data("bg-large") + "') ");
                // show a fixed amount of carousel peekage
                // section height = viewport height + carousel height - peek amount
                $('section').not('#intro').css('height', (screenHeight + 220));
            }
        }

        // apply a style on the section for proper cropping
        var theWindow = $(window),
            //aspectRatio = 1.79487179 ;
            aspectRatio = 2;

            // set class based on aspect ratio
            if ( (theWindow.width() / theWindow.height()) < aspectRatio ) {
                backgrounds
                    .removeClass('bg-height, bg-width')
                    .addClass('bg-height');
            } else {
                backgrounds
                    .removeClass('bg-height, bg-width')
                    .addClass('bg-width');
            }
        // placement of mobile section carousels
        $('.mobile section .carousel-wrapper').css('margin-top', ($(window).height() * '.75' ));

        // RESPONSIVE INTRO SECTION BACKGROUNDS
        var introAspectRatio = 1.79487179;

        //if (theWindow.width() > 1024) {
            if ( (theWindow.width() / theWindow.height()) < introAspectRatio ) {
                $('#slide1, #slide2, #video-alternative, #slide4').removeClass('bg-height, bg-width').addClass('bg-height');
                if (theWindow.width() > 1024) {
                    var introImageWidth = $('#intro .bg-height img').width();
               }

            } else {
                $('#slide1, #slide2, #video-alternative, #slide4').removeClass('bg-height, bg-width').addClass('bg-width');
            }
        //}

    };

    MCPT.prototype.initSliders = function() {

        $('#intro-slider').owlCarousel({
            singleItem: true,
            pagination: true,
            autoPlay: false,
            //lazyLoad: true
            responsive: true
        });


        $(".section-carousel").owlCarousel({
            pagination: true,
            items: 3,
            itemsDesktop: [2000, 3],
            itemsTablet: [768, 2],
            itemsMobile: [479, 1],
            navigation: true,
            navigationText: ['<div><img src="images/nav/leftArrow.png"></div>', '<div><img src="images/nav/rightArrow.png"></div>'],
            lazyLoad: true,
            responsive: true

        });

        $("#dreaming-modal-collection").owlCarousel({
            singleItem: true,
            pagination: true,
            navigation: true,
            responsive: true,
            navigationText: ['<div><img src="images/nav/arrow-modal-carousel.png"></div>', '<div><img src="images/nav/arrow-modal-carousel.png"></div>'],
            afterAction: function() {
                var totalItems = $('#dreaming-modal-collection .owl-page').length;
                var currentIndex = $('#dreaming-modal-collection .owl-page.active').index() +1;

                $(".carousel-counter").text(currentIndex + " / " + totalItems);
            },
            lazyLoad: true
        });

        $("#planning-modal-collection").owlCarousel({
            singleItem: true,
            pagination: true,
            navigation: true,
            responsive: true,
            navigationText: ['<div><img src="images/nav/arrow-modal-carousel.png"></div>', '<div><img src="images/nav/arrow-modal-carousel.png"></div>'],
            afterAction: function() {
                var totalItems = $('#planning-modal-collection .owl-page').length;
                var currentIndex = $('#planning-modal-collection .owl-page.active').index() + 1;
                $(".carousel-counter").text(currentIndex + " / " + totalItems);
            },
            lazyLoad: true
        });

        $("#travel-modal-collection").owlCarousel({
            singleItem: true,
            pagination: true,
            navigation: true,
            responsive: true,
            navigationText: ['<div><img src="images/nav/arrow-modal-carousel.png"></div>', '<div><img src="images/nav/arrow-modal-carousel.png"></div>'],
            afterAction: function() {
                var totalItems = $('#travel-modal-collection .owl-page').length;
                var currentIndex = $('#travel-modal-collection .owl-page.active').index() + 1;
                $(".carousel-counter").text(currentIndex + " / " + totalItems);
            },
            lazyLoad: true
        });

        $("#vacation-modal-collection").owlCarousel({
            singleItem: true,
            pagination: true,
            navigation: true,
            responsive: true,
            navigationText: ['<div><img src="images/nav/arrow-modal-carousel.png"></div>', '<div><img src="images/nav/arrow-modal-carousel.png"></div>'],
            afterAction: function() {
                var totalItems = $('#vacation-modal-collection .owl-page').length;
                var currentIndex = $('#vacation-modal-collection .owl-page.active').index() + 1;
                $(".carousel-counter").text(currentIndex + " / " + totalItems);
            },
            lazyLoad: true
        });

        $("#oneMoreDay-modal-collection").owlCarousel({
            singleItem: true,
            pagination: true,
            navigation: true,
            responsive: true,
            navigationText: ['<div><img src="images/nav/arrow-modal-carousel.png"></div>', '<div><img src="images/nav/arrow-modal-carousel.png"></div>'],
            afterAction: function() {
                var totalItems = $('#oneMoreDay-modal-collection .owl-page').length;
                var currentIndex = $('#oneMoreDay-modal-collection .owl-page.active').index() + 1;
                $(".carousel-counter").text(currentIndex + " / " + totalItems);
            },
            lazyLoad: true
        });
       
        if(window.location.search == ""){
            // console.log("no search");
        }else {
            // console.log("I need to search");
            var slideId = this.getQueryString();
            // console.log("slide id: ", slideId);
            this.findSpecificSlide(slideId[1], slideId[0], slideId[2]);
        }
    };

    MCPT.prototype.allBenefits = function() {
        // first populate the contents
        // world elite
        $('.benefit-outer.world-elite').clone().appendTo('#all-benefits');
        // world
        $('.benefit-outer.world').clone().appendTo('#all-benefits');
        // standard
        $('.benefit-outer.standard').clone().appendTo('#all-benefits');

        // accordion
        var allPanels = $('#all-benefits .benefit-outer');
        // reset all panels
        $(allPanels).removeClass('active');
        // start by preselecting world benefits
        $('#accordion-benefits-nav a.world-card').addClass('active');
        $('.benefit-outer.standard, .benefit-outer.world').addClass('active');


        // toggle benefit info when clicked
        //TODO: now that the caret is on the benefit-outer and we are passing that a class we can clean all this up and adust CSS too
        $('#all-benefits h3').click(function() {
            
            if ($(this).parent().hasClass('active')) {
                $('.benefit-outer').removeClass('open');
                $('.benefit-description, .benefit-offer').removeClass('active');
            } else {
                $('.benefit-outer').removeClass('open');
                $('.benefit-description, .benefit-offer').removeClass('active');
                $(this).parent().addClass('active');
                $(this).parent().siblings('.benefit-offer').addClass('active');
                $(this).closest('.benefit-outer').addClass('open');
            }
            return false;
        });

        // ALL BENEFITS NAVIGATION
        // since we can update the nav contents by either a select
        $('#accordion-benefits-select').on('change', function() {
            cardChange(this.value);
        });
        // or click
        $('#accordion-benefits-nav a').click(function() {
            var cardType = this.className;
            cardChange(cardType);
        });
        // process our results
        function cardChange(cardType) {
        // toggle benefits in accordion based on card type selected
            // update nav
            $('#accordion-benefits-nav a').removeClass('active');
            // make sure all open panels are closed
            $('.benefit-description, .benefit-offer').removeClass('active');
            // do the needful
            switch (true) {
                case (cardType.indexOf('standard-card') !== -1):
                   $('#accordion-benefits-nav a.standard-card').addClass('active');
                    $('.accordion .world, .accordion .world-elite').removeClass('active');
                    break;
                case (cardType.indexOf('world-card') !== -1):
                    $('#accordion-benefits-nav a.world-card').addClass('active');
                    $('.accordion .world-elite').removeClass('active');
                    $('.accordion .standard, .accordion .world').addClass('active');
                    break;
                case (cardType.indexOf('world-elite-card') !== -1):
                    $('#accordion-benefits-nav a.world-elite-card').addClass('active');
                    $('.accordion .standard, .accordion .world, .accordion .world-elite').addClass('active');
                    break;
            }
        }
    };

    /*
     * Land on a specific intro carousel slide from an external link
     * Append unique slide ID in query string to url
     */
    MCPT.prototype.getQueryString = function() {
         // get the query string attached to the URL
        // i.e. ?slide=slide1
        var query = window.location.search;
        
        // get just what's after ?section=
        // Gets the slide we want.
        var data = query.split("&", 2);
        var section = data[0].split("=", 2);
       
        // change book to planning
        if (section[1] === 'book') {
            section = 'planning';
        } else {
            section = section[1];
        }

        var slide = data[1].split("=", 2);
        slide = slide[1];

        var queryString = true;

        return [section, slide, queryString];
    };

    /*
     * Navigates to a specific slide within a slider
     * Each item in a slider needs an ID attached to it.
     * TODO: Choose which slider specifically we want to get this info from.
     */
    MCPT.prototype.findSpecificSlide = function(value, sliderId, queryString) {
        var owlData;
        if(queryString){
            if(sliderId != "intro"){
                // owlData ID should be whichever slider we are looking for.
                owlData = $("#"+sliderId + "-carousel").data("owlCarousel");
               $('*[data-benefit-id="'+value+'"]').click();
            }else {
                // this is the intro, do special things
                 owlData = $("#"+sliderId+"-slider").data("owlCarousel");
            }


        }else {
            owlData = $(sliderId).data("owlCarousel");
        }


        // get the array of things in the slider
        var slideArray = owlData.$userItems;
      
        // create an empty array holder.
        var idArray = [];
        // loop through the slide array and push the IDs into the holder array.
        for (var i = 0; i < slideArray.length; i++) {
           idArray.push(slideArray[i].id);
        }
       
        // get the index of the slide you need based on the location hash
        var locationIndex = $.inArray(value, idArray);
       
        // update the slider position
        owlData.goTo(locationIndex);
    };







    MCPT.prototype.embedDoubleClick = function(){

        var url = document.URL, idx = url.indexOf("#")
        var hash = idx != -1 ? url.substring(idx+1) : "";
        var cat = "";
        var activityId = "";

      
        if (hash === ""){
            activityId = 1882757;
        } else {
            // Need to match up url to activityId 

            $.each(pageMap, function(key, value) {
                if (value["urlparams"] == "#" + hash){

                    activityId = value["id"];
                }    
            });

        } 

        if (activityId !==""){
            var catStr = pageMap[activityId].cat;
            this.embedFloodlight(catStr);
        }


        var axel = Math.random() + "";
        var a = axel * 10000000000000;

     
        // Trigger Events on Buttons
        // Have left comments in to make it easier to debug

        // 1882858 - Please implement on the "Book Your Trip" Button on both the top right and bottom right. Should fire on click. 
        $("#book-trip a").on("click",{'catStr' : pageMap[1882858].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        });

        // 1883091 - Please implement on the "Dream Benefits" picture slides on the Dreams Page. Should fire when any of the three slides are clicked on.
        $("#dream-carousel .item").on("click",{'catStr' : pageMap[1883091].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        });


        // 1883000 Please implement on the "Dream" Button on the navigation bar. Should fire on click.
        $(".fl-dream").on("click",{'catStr' : pageMap[1883000].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        });

        // THIS NEEDS TO BE THE DEFAULT PAGE TRIGGER
        // 1882757 Please implement on the Travel Homepage. Should fire when the page loads.
        // $("a#dream").on("click",{'catStr' : pageMap[1882757].cat, "that" : this}, function(event){           
        //     event.data.that.embedFloodlight(event.data.catStr);
        // });

        // 1883090 Please implement on the "#One More Day Benefits" pictures slides on the #One More Day  Page. Should fire when any of the three slides are clicked on. 
        // $(".oneMoreDay-modal .owl-item").on("click",{'catStr' : pageMap[1883090].cat, "that" : this}, function(event){           
        //     event.data.that.embedFloodlight(event.data.catStr);
        // });
        $("body").on("click",'#share-carousel .owl-item', {'catStr' : pageMap[1883090].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        });



        // 1882856 Please implement on the "#OneMoreDay" Button on the navigation bar. Should fire on click. 
        $(".fl-onemoreday").on("click",{'catStr' : pageMap[1882856].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        });


        // 1882758 Please implement on the "Plan Benefits" pictures slides on the Plan  Page. Should fire when any of the three slides are clicked on.
        $("body").on("click","#planning-carousel .owl-item", {'catStr' : pageMap[1882758].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        });
       

        // 1883092 Please implement on the "Plan" Button on the navigation bar. Should fire on click.
        $(".fl-plan").on("click",{'catStr' : pageMap[1883092].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        });  


        // 1883096 Please implement on the "See all Benefits" Button on the top of the navigation bar. Should fire on click.
        $(".mcpt-utility-nav .all-benefits-link").on("click",{'catStr' : pageMap[1883096].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        });   


        // 1883097 Please implement on all Social Buttons found at the universal footer. Should fire when any social button is clicked ex. Facebook, Twitter, Youtube -.pluginConnectButton = facebook, .footer-line a = twitter and youtube

        // Facebook button needs to be fixed
        $(".footer-line a").on("click",{'catStr' : pageMap[1883097].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        });  

        // 1883001 Please implement on the "Travel Benefits" pictures slides on the Travel Page. Should fire when any of the three slides are clicked on.

        $("body").on("click","#travel-carousel .owl-item", {'catStr' : pageMap[1883001].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        });  

        // 1883093 Please implement on the "Travel" Button on the navigation bar. Should fire on click.
        $(".fl-travel").on("click",{'catStr' : pageMap[1883093].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        });  

        // 1883095 Please implement on the "Vacation Benefits" pictures slides on the Vacation Page. Should fire when any of the three slides are clicked on.
        $("body").on("click","#vacation-carousel .owl-item", {'catStr' : pageMap[1883095].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        }); 

        // 1882857 Please implement on the "Vacation" Button on the navigation bar. Should fire on click.
        $(".fl-vacation").on("click",{'catStr' : pageMap[1882857].cat, "that" : this}, function(event){           
            event.data.that.embedFloodlight(event.data.catStr);
        });   

    };

    MCPT.prototype.returnCatStr = function(event){
        var data = event.data;
        return data.catStr;
    };


    MCPT.prototype.embedFloodlight = function(catStr){
        var axel = Math.random() + "";
        var a = axel * 10000000000000;
          
        $(".floodlighttags").append('<iframe src="http://4382661.fls.doubleclick.net/activityi;src=4382661;type=Trave00;cat=' + catStr+ ';ord=' + a + '?" width="1" height="1" frameborder="0" style="display:none"></iframe>');
    };



    $.fn[pluginName] = function(options) {

        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new MCPT(this, options));
            }
        });
    };

    /*
     * Removes modals from flow
     */
    $(".modal").hide();

    //return MCPT;
})(jQuery, window, document, undefined);


    };

    MCPT.prototype.returnCatStr = function(event){
        var data = event.data;
        return data.catStr;
    };


    MCPT.prototype.embedFloodlight = function(catStr){
        var axel = Math.random() + "";
        var a = axel * 10000000000000;
          
        $(".floodlighttags").append('<iframe src="http://4382661.fls.doubleclick.net/activityi;src=4382661;type=Trave00;cat=' + catStr+ ';ord=' + a + '?" width="1" height="1" frameborder="0" style="display:none"></iframe>');
    };



    $.fn[pluginName] = function(options) {

        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new MCPT(this, options));
            }
        });
    };

    /*
     * Removes modals from flow
     */
    $(".modal").hide();

    //return MCPT;
})(jQuery, window, document, undefined);