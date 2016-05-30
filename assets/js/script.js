L.mapbox.accessToken = 'pk.eyJ1IjoicGllcnJlcGllcnJlcGllcnJlIiwiYSI6IkdXdE5CRFEifQ.3zLbKVYfHituW8BVU-bl5g';



$( document ).ready(function() {

	$('#show-menu, #close-menu').on('click', function(){
		$('#menu').toggleClass('shown');
	});

	/* UPLOAD FILES INPUT */
	var inputs = document.querySelectorAll( '.fileupload' );
	Array.prototype.forEach.call( inputs, function( input ){
		var label	 = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener( 'change', function( e ){
			var fileName = '';
			/* if( this.files && this.files.length > 1 ) {
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			} else { */
				fileName = e.target.value.split( '\\' ).pop();
			//}

			var file = this.files[0];

			if( fileName && file ) {
				label.innerHTML = fileName ? fileName : labelVal;
				label.className += " hasFile";

				if (file.type.match('image.*')) {
					// http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
					var reader = new FileReader();
					reader.onload = function (e) {
						$('#inputImg').html('<img src="'+e.target.result+'">');
					}
					reader.readAsDataURL(this.files[0]);
				}
				if (file.type.match('application/pdf') || file.name.match('\.pdf')) {
					$('#inputImg').html('<span class="gros fichier pdf">PDF</span>');
				}
				if (file.type.match('application/msword') || file.type.match('application\/.*officedocument') || file.name.match('\.doc') ) {
					$('#inputImg').html('<span class="gros fichier doc">DOC</span>');
				}
			} else {
				label.innerHTML = labelVal;
			}
		});
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


	// pour le futur
	$('.diaporama').on('click', '.diapositive .supprimer-button', function(){
		$(this).closest('.diapositive').addClass('deletemode');
	}).on('click', '.diapositive .bouton.annuler', function(){
		$(this).closest('.diapositive').removeClass('deletemode');
	})

	$('.diaporama').on('click', '.diapositive.fake .bouton.ajouter', function(){
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



	/* ----- gestion des onglets (tab) ---- */

	if (!$('body').hasClass('logged') || $('#contenu').hasClass('compte')) { // les tabs du compte fonctionnent sur un système d'ancres et pas de liens en dur

		$("#nav-tabs li a").click(function(e) {
			e.preventDefault();
			history.pushState({ path: this.path }, '', this.href);
			var $inventaireMenu = $(this).closest('#nav-tabs');
			if (!$(this).hasClass('chapitre') && !$(this).hasClass('bouton')) {
				if (!$(this).hasClass('strong') && $(this).siblings('ul.chapitres').find('a.strong').length <= 0) {
					$inventaireMenu.find('.chapitres').slideUp(300);
					$(this).next('.chapitres').slideDown(300, function(){
						//$inventaireMenu.sticky({topSpacing:12});
					});
				}
			}

			$(".tabs-wrapper article.tab").hide();
			if (document.getElementById( this.getAttribute('data-cible') )){
				document.getElementById( this.getAttribute('data-cible') ).style.display = 'block';
			}
			$inventaireMenu.find("li a").removeClass('strong');
			$(this).addClass('strong');
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

	// pour afficher le premier article si aucun n'est ouvert. J'ai pas réussi à le faire en SPIP...
	if ($('#nav-tabs').length > 0) {
		if($('#nav-tabs').find('a.strong').length <= 0){
			$('#nav-tabs').find('li a').first().trigger('click');
		} else {
			// $('#nav-tabs').sticky({topSpacing:12});

		}
	}


	/* ----- / fin gestion des onglets (tab) ---- */


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

		var adminMap = L.mapbox.map('administration-map', 'mapbox.streets', {zoomControl: false});
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