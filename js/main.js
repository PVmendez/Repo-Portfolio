(function ($) {
    "use strict";
    
    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();
    
    
    // Initiate the wowjs
    new WOW().init();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    
    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('nav-sticky');
        } else {
            $('.navbar').removeClass('nav-sticky');
        }
    });
    
    
    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });
    
    
    // Typed Initiate
    if ($('.hero .hero-text h2').length == 1) {
        var typed_strings = $('.hero .hero-text .typed-text').text();
        var typed = new Typed('.hero .hero-text h2', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }
    
    
    // Skills
    $('.skills').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Testimonials carousel
    $(".testimonials-carousel").owlCarousel({
        center: true,
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0:{
                items:1
            }
        }
    });
    
    
    
    // Portfolio filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });

    $('#portfolio-filter li').on('click', function () {
        $("#portfolio-filter li").removeClass('filter-active');
        $(this).addClass('filter-active');
        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);

jQuery(document).ready(function(){


    jQuery(".owl-carousel2").owlCarousel({
      loop:true,
      center: false,
      margin:20,
      responsiveClass:true,
      nav:true,
      responsive:{
        0:{
          items:2,
          nav:false,
        },
        600:{
          items:2,
          nav:false
        },
        1000:{
          items:4,
          nav:true,
          loop:true
        }
      }
    }
    );
  
    jQuery(".owl-carousel3").owlCarousel({
      loop:true,
      center: false,
      margin:20,
      responsiveClass:true,
      nav:true,
      responsive:{
        0:{
          items:1,
          nav:false,
        },
        600:{
          items:2,
          nav:false
        },
        1000:{
          items:3,
          nav:true,
          loop:true
        }
      }
    }
    );
  
    jQuery(".owl-carousel4").owlCarousel({
      loop:true,
      center: false,
      margin:20,
      responsiveClass:true,
      nav:true,
      responsive:{
        0:{
          items:1,
          nav:false,
        },
        600:{
          items:2,
          nav:false
        },
        1000:{
          items:2,
          nav:true,
          loop:true
        }
      }
    }
    );
  
  
  
  });
  
  function myFunction(x) {
    x.classList.toggle("change");
  }

  
  (function ($) {
  
  "use strict";

    // NAVBAR
    $('.navbar-nav .nav-link').click(function(){
        $(".navbar-collapse").collapse('hide');
    });

    $(window).scroll(function() {    
        var scroll = $(window).scrollTop();

        if (scroll >= 50) {
            $(".navbar").addClass("sticky-nav");
        } else {
            $(".navbar").removeClass("sticky-nav");
        }
    });

    // BACKSTRETCH SLIDESHOW
    $('#section_1').backstretch([
      "img/WEB/ANTIFASHION-657.jpg", 
      "img/WEB/ANTIFASHION-834.jpg",
      "img/WEB/PORTADA ANTIFASHION_compressed_page-0001.jpg"
    ],  {duration: 2000, fade: 750});
    
  })(window.jQuery);

