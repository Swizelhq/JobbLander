(function ($) {
    "use strict";
	
	var $window = $(window); 
	var $body = $('body'); 

	/* Preloader Effect */
	$window.on('load', function(){
		$(".preloader").fadeOut(600);
	});

	/* Sticky Header */	
	if($('.active-sticky-header').length){
		$window.on('resize', function(){
			setHeaderHeight();
		});

		function setHeaderHeight(){
	 		$("header.main-header").css("height", $('header .header-sticky').outerHeight());
		}	
	
		$window.on("scroll", function() {
			var fromTop = $(window).scrollTop();
			setHeaderHeight();
			var headerHeight = $('header .header-sticky').outerHeight()
			$("header .header-sticky").toggleClass("hide", (fromTop > headerHeight + 100));
			$("header .header-sticky").toggleClass("active", (fromTop > 600));
		});
	}	
	
	/* Slick Menu JS */
	$('#menu').slicknav({
		label : '',
		prependTo : '.responsive-menu'
	});

	if($("a[href='#top']").length){
		$(document).on("click", "a[href='#top']", function() {
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return false;
		});
	}

	/* testimonial Slider JS */
	if ($('.testimonial-slider').length) {
		const testimonial_slider = new Swiper('.testimonial-slider .swiper', {
			slidesPerView : 1,
			speed: 1000,
			spaceBetween: 30,
			loop: true,
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: '.testimonial-pagination',
				clickable: true,
			},
			navigation: {
				nextEl: '.testimonial-button-next',
				prevEl: '.testimonial-button-prev',
			},
			breakpoints: {
				768:{
					slidesPerView: 1,
				},
				991:{
					slidesPerView: 2,
				}
			}
		});
	}

	/* Skill Bar */
	if ($('.skills-progress-bar').length) {
		$('.skills-progress-bar').waypoint(function() {
			$('.skillbar').each(function() {
				$(this).find('.count-bar').animate({
				width:$(this).attr('data-percent')
				},2000);
			});
		},{
			offset: '70%'
		});
	}

	/* Youtube Background Video JS */
	if ($('#herovideo').length) {
		var myPlayer = $("#herovideo").YTPlayer();
	}

	/* Init Counter */
	if ($('.counter').length) {
		$('.counter').counterUp({ delay: 6, time: 1500 });
	}

	/* Image Reveal Animation */
	if ($('.reveal').length) {
        gsap.registerPlugin(ScrollTrigger);
        let revealContainers = document.querySelectorAll(".reveal");
        revealContainers.forEach((container) => {
            let image = container.querySelector("img");
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    toggleActions: "play none none none"
                }
            });
            tl.set(container, {
                autoAlpha: 1
            });
            tl.from(container, 1, {
                xPercent: -100,
                ease: Power2.out
            });
            tl.from(image, 1, {
                xPercent: 100,
                scale: 1,
                delay: -1,
                ease: Power2.out
            });
        });
    }

	/* Text Effect Animation Start */
	if($('.text-effect').length) {
		var textheading = $(".text-effect");

		if(textheading.length == 0) return; gsap.registerPlugin(SplitText); textheading.each(function(index, el) {
			
			el.split = new SplitText(el, { 
				type: "lines,words,chars",
				linesClass: "split-line"
			});
			
			if( $(el).hasClass('text-effect') ){
				gsap.set(el.split.chars, {
					opacity: .3,
					x: "-7",
				});
			}
			el.anim = gsap.to(el.split.chars, {
				scrollTrigger: {
					trigger: el,
					start: "top 92%",
					end: "top 60%",
					markers: false,
					scrub: 1,
				},

				x: "0",
				y: "0",
				opacity: 1,
				duration: .7,
				stagger: 0.2,
			});
			
		});
	}
	/* Text Effect Animation End */

	/* Parallaxie js */
	var $parallaxie = $('.parallaxie');
	if($parallaxie.length && ($window.width() > 991))
	{
		if ($window.width() > 768) {
			$parallaxie.parallaxie({
				speed: 0.55,
				offset: 0,
			});
		}
	}

	/* Zoom Gallery screenshot */
	$('.gallery-items').magnificPopup({
		delegate: 'a',
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: false,
		mainClass: 'mfp-with-zoom',
		image: {
			verticalFit: true,
		},
		gallery: {
			enabled: true
		},
		zoom: {
			enabled: true,
			duration: 300, // don't foget to change the duration also in CSS
			opener: function(element) {
			  return element.find('img');
			}
		}
	});

	/* Contact form validation */
	var $contactform = $("#contactForm");
	$contactform.validator({focus: false}).on("submit", function (event) {
		if (!event.isDefaultPrevented()) {
			event.preventDefault();
			submitForm();
		}
	});

	function submitForm(){
		/* Ajax call to submit form */
		$.ajax({
			type: "POST",
			url: "form-process.php",
			data: $contactform.serialize(),
			success : function(text){
				if (text === "success"){
					formSuccess();
				} else {
					submitMSG(false,text);
				}
			}
		});
	}

	function formSuccess(){
		$contactform[0].reset();
		submitMSG(true, "Message Sent Successfully!")
	}

	function submitMSG(valid, msg){
		if(valid){
			var msgClasses = "h4 text-success";
		} else {
			var msgClasses = "h4 text-danger";
		}
		$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}
	/* Contact form validation end */

	/* Animated Wow Js */	
	new WOW().init();

	/* Popup Video */
	if ($('.popup-video').length) {
		$('.popup-video').magnificPopup({
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: true
		});
	}

	/* Flowmap deformation effect */
	function flowmap_deformation() {
		jQuery('.flowmap-deformation').each(function(){
			let box = jQuery(this);

			setTimeout(function() {box.addClass('active');}, 300);

			const imgSize = [box.data('bg-width'), box.data('bg-height')];

			const vertex = `
						attribute vec2 uv;
						attribute vec2 position;
						varying vec2 vUv;
						void main() {
								vUv = uv;
								gl_Position = vec4(position, 0, 1);
						}
				`;
			const fragment = `
						precision highp float;
						precision highp int;
						uniform sampler2D tWater;
						uniform sampler2D tFlow;
						uniform float uTime;
						varying vec2 vUv;
						uniform vec4 res;

						void main() {

								// R and G values are velocity in the x and y direction
								// B value is the velocity length
								vec3 flow = texture2D(tFlow, vUv).rgb;

								vec2 uv = .5 * gl_FragCoord.xy / res.xy ;
								vec2 myUV = (uv - vec2(0.5))*res.zw + vec2(0.5);
								myUV -= flow.xy * (0.15 * 0.7);

								vec3 tex = texture2D(tWater, myUV).rgb;

								gl_FragColor = vec4(tex.r, tex.g, tex.b, 1.0);
						}
				`;
			{
				const renderer = new ogl.Renderer({ dpr: 2 });
				const gl = renderer.gl;
				box.append(gl.canvas);

				// Variable inputs to control flowmap
				let aspect = 1;
				const mouse = new ogl.Vec2(-1);
				const velocity = new ogl.Vec2();
				function resize() {
					let a1, a2;
					var imageAspect = imgSize[1] / imgSize[0];
					if (box.outerHeight() / box.outerWidth() < imageAspect) {
						a1 = 1;
						a2 = box.outerHeight() / box.outerWidth() / imageAspect;
					} else {
						a1 = (box.outerWidth() / box.outerHeight()) * imageAspect;
						a2 = 1;
					}
					mesh.program.uniforms.res.value = new ogl.Vec4(
						box.outerWidth(),
						box.outerHeight(),
						a1,
						a2
					);

					renderer.setSize(box.outerWidth(), box.outerHeight());
					aspect = box.outerWidth() / box.outerHeight();
				}
				const flowmap = new ogl.Flowmap(gl, {
					falloff: 0.6
				});
				// Triangle that includes -1 to 1 range for 'position', and 0 to 1 range for 'uv'.
				const geometry = new ogl.Geometry(gl, {
					position: {
						size: 2,
						data: new Float32Array([-1, -1, 3, -1, -1, 3])
					},
					uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
				});
				const texture = new ogl.Texture(gl, {
					minFilter: gl.LINEAR,
					magFilter: gl.LINEAR
				});
				const img = new Image();
				img.onload = () => (texture.image = img);
				img.crossOrigin = "Anonymous";
				img.src = box.data('bg');

				let a1, a2;
				var imageAspect = imgSize[1] / imgSize[0];              //0.5573
				if (box.outerHeight() / box.outerWidth() < imageAspect) {      // 0.4146 < 0.5573
					a1 = 1;
					a2 = box.outerHeight() / box.outerWidth() / imageAspect;   // 0.7439
				} else {
					a1 = (box.outerWidth() / box.outerHeight()) * imageAspect;
					a2 = 1;
				}

				const program = new ogl.Program(gl, {
					vertex,
					fragment,
					uniforms: {
						uTime: { value: 0 },
						tWater: { value: texture },
						res: {
							value: new ogl.Vec4(box.outerWidth(), box.outerHeight(), a1, a2)
						},
						img: { value: new ogl.Vec2(imgSize[0], imgSize[1]) },
						// Note that the uniform is applied without using an object and value property
						// This is because the class alternates this texture between two render targets
						// and updates the value property after each render.
						tFlow: flowmap.uniform
					}
				});
				const mesh = new ogl.Mesh(gl, { geometry, program });

				window.addEventListener("resize", resize, false);
				resize();

				// Create handlers to get mouse position and velocity
				const isTouchCapable = "ontouchstart" in window;
				const section = box.closest('.flowmap-effect')[0];
				if (isTouchCapable) {
					section.addEventListener("touchstart", updateMouse, false);
					section.addEventListener("touchmove", updateMouse, { passive: false });
				} else {
					section.addEventListener("mousemove", updateMouse, false);
				}
				let lastTime;
				const lastMouse = new ogl.Vec2();
				function updateMouse(e) {
					// e.preventDefault();
					if (e.changedTouches && e.changedTouches.length) {
						e.x = e.changedTouches[0].pageX;
						e.y = e.changedTouches[0].pageY;
					}
					if (e.x === undefined) {
						e.x = e.pageX;
						e.y = e.pageY;
					}
					// Get mouse value in 0 to 1 range, with y flipped
					mouse.set(e.x / gl.renderer.width, 1.0 - e.y / gl.renderer.height);
					// Calculate velocity
					if (!lastTime) {
						// First frame
						lastTime = performance.now();
						lastMouse.set(e.x, e.y);
					}

					const deltaX = e.x - lastMouse.x;
					const deltaY = e.y - lastMouse.y;

					lastMouse.set(e.x, e.y);

					let time = performance.now();

					// Avoid dividing by 0
					let delta = Math.max(10.4, time - lastTime);
					lastTime = time;
					velocity.x = deltaX / delta;
					velocity.y = deltaY / delta;
					// Flag update to prevent hanging velocity values when not moving
					velocity.needsUpdate = true;
				}
				requestAnimationFrame(update);
				function update(t) {
					requestAnimationFrame(update);
					// Reset velocity when mouse not moving
					if (!velocity.needsUpdate) {
						mouse.set(-1);
						velocity.set(0);
					}
					velocity.needsUpdate = false;
					// Update flowmap inputs
					flowmap.aspect = aspect;
					flowmap.mouse.copy(mouse);
					// Ease velocity input, slower when fading out
					flowmap.velocity.lerp(velocity, velocity.len ? 0.15 : 0.1);
					flowmap.update();
					program.uniforms.uTime.value = t * 0.01;
					renderer.render({ scene: mesh });
				}
			}
		});
	}
	flowmap_deformation();


	/* Feature Body Item List Active Start */
	var $feature_body_list = $('.features-body-item-list');
	if ($feature_body_list.length) {
		var $feature_item = $feature_body_list.find('.feature-body-item');

		if ($feature_item.length) {
			$feature_item.on({
				mouseenter: function () {
					if (!$(this).hasClass('active')) {
						$feature_item.removeClass('active'); 
						$(this).addClass('active'); 
					}
				},
				mouseleave: function () {
					// Optional: Add logic for mouse leave if needed
				}
			});
		}
	}
	/* Feature Body Item List Active End */
	
})(jQuery);