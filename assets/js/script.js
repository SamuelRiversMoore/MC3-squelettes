L.mapbox.accessToken = 'pk.eyJ1IjoicGllcnJlcGllcnJlcGllcnJlIiwiYSI6IkdXdE5CRFEifQ.3zLbKVYfHituW8BVU-bl5g';



$( document ).ready(function() {

	var myModal = $('body').find('.modal');
	if(myModal.length && myModal.is(':visible')){ 
		$('body').addClass('hasModal'); // pour désactiver la scrollbar de l'arrière plan si le modal et visible
	}

	$('#show-menu, #close-menu').on('click', function(){
		$('#menu').toggleClass('shown');
	});


	/* SELECT MENU */
	var openMenu = false;
	function closeMenu(){
		openMenu.removeClass('open');
		openMenu = false;
	}

	$(document).on('click', function(e) {

		// Pour supprimer les messages d'avertissement des formulaires au clique.
		if($(document).find('.message.ok').length && !okremoved) $(document).find('.message.ok').remove(); var okremoved = true;


		if(openMenu != false){
			if(!$(e.target).closest('.select-menu').length){
				closeMenu();
			} else {
				if ($(e.target).is('li.status')) {
					var $target = $(e.target);
					var $menu = $target.closest('.select-menu');
					var $old = $target.parent().find('.selected');
					var newValue = $target.attr('data-value').replace(' ', '');
					var oldValue = $old.attr('data-value');
					var original = $menu.attr('data-original').replace(' ', '');

					/*
					if (original != newValue) {
						$menu.find('input').show();
					} else {
						$menu.find('input').hide();
					}
					*/

					$target.addClass('selected');
					$old.removeClass('selected');

					$menu.find('.select-title .status').removeClass(oldValue).addClass(newValue);
					$menu.find('select').val(newValue);
					$menu.closest('form').submit();
					closeMenu();
				}
			}
		}
	}).on('click', '.select-title', function(e){
		if ($(this).hasClass('open')){
			closeMenu();
		} else {
			$(this).addClass('open');
			openMenu = $(this);
		}
	});

	// responsive tabs pas fini
	$('.tabs-wrapper').on('click', '#tabs-menu-button', function(){
		$(this).closest('.tabs-wrapper').toggleClass('openmenu');
	})

	// surmodal
	$('.modal').on('click', '.bouton.montrer', function(){
		var target = $(this).attr('data-target');
		target = document.getElementById(target);
		if($(target).length){
			$(target).removeClass('hidden');
			// Reinitialiser autocomplete.js & FileUpload.js
			AutoComplete.init();
			FileUpload.init();

		}
	});
	$('.modal').on('click', '.surmodal', function(e){
		$(this).addClass('hidden');
	}).on('click', '.surmodal>.edition', function(e){
		e.stopPropagation();
	}).on('click', '.surmodal .bouton.annuler', function(e){
		$(this).closest('.surmodal').addClass('hidden');
	})

	// pour le futur
	$('.modal').on('click', '.diapositive .supprimer-button', function(){
		$(this).closest('.diapositive').addClass('deletemode');
	}).on('click', '.diapositive .bouton.annuler', function(){
		$(this).closest('.diapositive').removeClass('deletemode');
	})

	$('.modal').on('click', '.diapositive.fake .bouton.ajouter', function(){
		$(this).closest('.diapositive').removeClass('fake').addClass('ajout');
	}).on('click', '.diapositive.ajout .bouton.annuler', function(){
		$(this).closest('.diapositive').removeClass('ajout').addClass('fake');
	});

	Ps.initialize(document.getElementById('menu'),{
		suppressScrollX: true
	});


	/* slickers */
	$(".slider").slick({
		dots: true,
		infinite: true,
		speed: 300,
		//slidesToShow: 1,
		//centerMode: true,
		//variableWidth: true,
		prevArrow: '<img class="slider-arrow-left" src="squelettes/assets/images/arrow-left.png">',
		nextArrow: '<img class="slider-arrow-right" src="squelettes/assets/images/arrow-right.png">'
	});
	$(".slick-zoom").on('click', function(e) {
		$(".slider").addClass("slick-fullscreen");
		$(".slider").slick('setPosition');
	});
	$(".slider").on('click', function(e) {
		if( !$(e.target).hasClass('slick-arrow') ) {
			if($(e.target).hasClass('slick-slide')) {
				$(".slider").slick('slickNext');
			} else {
				$(this).removeClass("slick-fullscreen");
				$(".slider").slick('setPosition');
			}
		}
	})
	$(document).keyup(function(e) {
		if (e.keyCode == 27) { // escape key maps to keycode `27`
			$(".slider").removeClass("slick-fullscreen")
			$(".slider").slick('setPosition');
		}
	});


	/* Ancres dans les tabs */
	$(".thematique-sommaire a").click(function(e) {
		e.preventDefault();
		var dest = $(this).attr('href');
		$('html,body').animate({ scrollTop: $(dest).offset().top }, 'slow');
	})

	$("#searchbar-button").on('change', function() {
	    if($(this).is(':checked')) {
	    	$('#menu-searchbar input').focus();
	    }
	});




	/* ----- gestion des onglets (tab) ---- */

	// les tabs du compte fonctionnent sur un système d'ancres et pas de liens en dur
	if (!$('body').hasClass('logged') || $('#contenu').hasClass('compte')) { 
		$("#nav-tabs li a").click(function(e) {
			e.preventDefault();
			history.pushState({ path: this.path }, '', this.href);
			var $inventaireMenu = $(this).closest('#nav-tabs');
			if (!$(this).hasClass('bouton')) {
				if($(this).hasClass('chapitre') && $(this).closest('.chapitres').is(':hidden')){
					$(this).closest('.chapitres').slideDown(300, function(){
						$(document.body).trigger("sticky_kit:recalc");
					});
				} else {
					if (!$(this).hasClass('chapitre') && !$(this).hasClass('strong') && $(this).siblings('ul.chapitres').find('a.strong').length <= 0) {
						$inventaireMenu.find('.chapitres').slideUp(300);
						$(this).next('.chapitres').slideDown(300, function(){
							$(document.body).trigger("sticky_kit:recalc");
						});
					}
				}
			}
			$(".tabs-wrapper article.tab").hide();
			if (document.getElementById( this.getAttribute('data-cible') )){
				document.getElementById( this.getAttribute('data-cible') ).style.display = 'block';
			}
			$inventaireMenu.find("li a").removeClass('strong');
			if($(this).hasClass('titre')){ 
				$(this).next('.chapitres').find('li a').first().addClass('strong');
			} else {
				$(this).addClass('strong');
			}
			$inventaireMenu.closest('.tabs-wrapper').removeClass('openmenu')
			return false;
		});
	}


	/* Qu'est ce ce truc ? pas simplifiable juste pur css ? */
	if ($('#nav-tabs').length > 0) {
		var $inventaireMenu = $('#nav-tabs');
		var minHeight = $inventaireMenu.find('header h5').outerHeight(true);  // hauteur du header
		var itemHeight = $inventaireMenu.find('li').last().outerHeight(true); // hauteur d'une entrée
		$inventaireMenu.find('ul.thematiques>li').each(function(){
			minHeight += itemHeight; // hauteur du premier niveau
		});
		var maxlength = 0;
		$inventaireMenu.find('ul.chapitres').each(function(){
			var thislength = $(this).find('li').length;
			if(thislength > maxlength) maxlength = thislength; // hauteur du menu chapitres le plus grand
		});
		minHeight += itemHeight * maxlength;
		minHeight += $inventaireMenu.find('#topButton').outerHeight(true);
		$('#inventaire-tabs').css('min-height', minHeight).find('article.tab').each(function(){
			$(this).css('min-height', minHeight);
		});
	};


	$(window).on('resize', function(){
		set_offset();
	});

	var stick_offset = 0;
	function set_offset(){
		var wwidth = $(window).width();
		if(wwidth <= 1100){
			stick_offset = 65;
		} else {
			stick_offset = 0;
		}
		if(typeof sticky != 'undefined'){
			sticky.trigger("sticky_kit:detach");
			sticky.stick_in_parent({offset_top : stick_offset});
		}
	}

	// pour afficher le premier article si aucun n'est ouvert. J'ai pas réussi à le faire en SPIP...
	if ($('#nav-tabs').length > 0) {
		if (window.location.hash) {
			// interception d'url
			var target = $('#nav-tabs').find('a[href="'+window.location.hash+'"]');
			setTimeout(function() {
				target.trigger('click');
			}, 200);
		} else {
			if($('#nav-tabs').find('a.strong').length <= 0){
				$('#nav-tabs').find('li a').first().trigger('click');
			}			
		}
		set_offset();
		console.log('stick!')
		var sticky = $('#nav-tabs').stick_in_parent({offset_top : stick_offset});
		$('#nav-tabs').on("sticky_kit:bottom", function(e) {
			$(this).addClass('is_bottom');
		}).on("sticky_kit:unbottom", function(e) {
			$(this).removeClass('is_bottom');
		});

		
	}

	/* ----- / fin gestion des onglets (tab) ---- */



	if($('#contenu.compte').length > 0 && $('#contenu').find('.dashboard .tabs-wrapper')){
		var dashboard = $('section.dashboard .tabs-wrapper');
		var nav = dashboard.find('#nav-tabs');
		dashboard.find('article.tab').each(function(){
			var target = $(this).attr('id').replace('#', '');
			var props = $(this).find('tr>td.statut .select-menu div.status.prop').length;
			if (props>0) {
				var prop = $('<span class="somme status prop" data-count="'+props+'"><span class="count">'+props+'</span></span>')
				nav.find('.item:not(titre)[data-cible='+target+']').append(prop);
			}
		});
		nav.find('li.section').each(function(){
			var section = $(this);
			var somme = 0;
			section.find('ul.chapitres span.somme').each(function(){
				somme += parseInt($(this).attr('data-count'));
			});
			if(somme > 0){
				var total = $('<span class="somme status prop" data-count="'+somme+'"><span class="count">'+somme+'</span></span>');
				section.find('.item.titre').append(total);
			}
		});
	}





	/* Init Mapbox */
	if($("#welcome-map").length > 0) {
		var map = L.mapbox.map('welcome-map', 'mapbox.streets', {zoomControl: false })
		.setView([37, 16.5], 5);
		map.scrollWheelZoom.disable();
	}

	if($('#administration-map').length){
    	var wrapper = $('#administration-map').closest('section.row'),
    		latInput = wrapper.find('input[name="latitude"]'),
    		lonInput = wrapper.find('input[name="longitude"]');

		var adminMap = L.mapbox.map('administration-map', 'mapbox.streets');
			adminMap.scrollWheelZoom.disable();
			
    	var geocoderControl = L.mapbox.geocoderControl('mapbox.places', {keepOpen: true, autocomplete: true});
    		geocoderControl.addTo(adminMap);
		
		getInputVal();
	    geocoderControl.on('select', function(object){
	    	var coord = object.feature.geometry.coordinates;
	    		setMarker(coord[1], coord[0]);
	    });
	    latInput.on('input', function(){ getInputVal(); });
	    lonInput.on('input', function(){ getInputVal(); });
	    function getInputVal(){
	    	if(latInput.val().length >= 1 && lonInput.val().length >= 1 ){
		    	var zoomVal = adminMap['_zoom'] ? adminMap['_zoom'] : 5;
	    		var lat = latInput.val(), lon = lonInput.val();
	    		setMarker(lat, lon);
	    		adminMap.setView([lat, lon], zoomVal);
	    	} else {
	 			adminMap.setView([37, 16.5], 4);
	    	}
	    }
	    function displayCoords(){
	    	var m = marker.getLatLng();
	    	latInput.val(m.lat);
	    	lonInput.val(m.lng);
	    };
	    
       	var marker;
	    function setMarker(lat, lon){
	    	if (undefined != marker) { adminMap.removeLayer(marker); }
	    	marker = L.marker([lat, lon], { icon: L.mapbox.marker.icon({ 'marker-color': 'FFDB16'}), draggable: true });
   			marker.addTo(adminMap);
			marker.on('dragend', displayCoords);
			displayCoords();
	    }
	}

	if($("#inventaire-mapbox").length > 0){
		var map = L.mapbox.map('inventaire-mapbox', 'mapbox.streets').setView([37, 16.5], 5);
			map.scrollWheelZoom.disable();

		if(typeof geojson !== 'undefined' && geojson.length > 0) {
			var markers = L.mapbox.featureLayer()
				.setGeoJSON(geojson)
				.addTo(map);
			map.fitBounds(markers.getBounds(), { padding: L.point(60, 60), maxZoom: maxZoom });
			markers.on('click', function(e) {
				if (!$("#inventaire-carte").hasClass('projet')) {
					window.location = e.layer.feature.properties['url'];
				};
			});
			markers.on('mouseover', function(e) {
				e.layer.openPopup();
			});
			markers.on('mouseout', function(e) {
				e.layer.closePopup();
			});

		} else {
			//$('#inventaire-carte').remove();
		}
	}

});

// pour afficher des marqueurs customs 
/*
	"properties": {
		"title": "#NOM_FR",
		"url": "#URL_VILLE",
		"icon": {
			"className": "map-pointer", // class name to style
			"html": "#NOM_FR", // add content inside the marker
			"iconSize": null // size of icon, use null to set the size in CSS
		}
	}
	var markers = L.mapbox.featureLayer().addTo(map);
	markers.on('layeradd', function(e) {
		var marker = e.layer,
			feature = marker.feature;
		marker.setIcon(L.divIcon(feature.properties.icon));
	});
	markers.setGeoJSON(geojson);

*/