$(document).ready(function(){
	
	// init
	var $terms = [];
	var $return = [];
	var $menu = $('#show-hide-menu');
	var $searchbar = $('#search-bar');
	var $description = $('#search-bar').closest('form').find('textarea[name="description"]');
	var count = 0;
	var $complet = $('#autosearch .output-complet');
	var $partiel = $('#autosearch .output-partiel');
	
	$complet.find('li.item').each(function(){
		var titre = $(this).find('span.item-titre').text(), 
			texte = $(this).find('span.item-texte').text();
		$terms.push([titre,texte]);
		count += 1;
	});
	$terms.sort();


	function strInDict(str, dict) {
		var research = new RegExp(str,"gi");
		for (var j=0; j<dict.length; j++) {
			var $titre = dict[j][0], $texte = dict[j][1]
			if ($titre.match(research)) {
				var regex = new RegExp( '(' + str + ')', 'gi' );
    			var $titre = $titre.replace( regex, "<b>$1</b>" );
				$return.push('<li class="item"><span class="item-titre">' + $titre + '</span><span class="item-texte">' + $texte + '</span></li>');
			}
			
		}
	}
		
	function recherche(openMenu){
		var $search = $searchbar.val();
		$return = [];
		strInDict($search, $terms);
		if ( $search == '' || ! $('input').val ) {
			$partiel.html('');
			$menu.prop('checked', false);
		} else {
			if ($return.length) {
				$partiel.html($return);
				if(openMenu) $menu.prop('checked', true);						
			} else {
				$menu.prop('checked', false);						
			}
		}
		$('.item:first-child').addClass('focus');
	}

	function nextItem(kp) {
		var $container = getContainer();
		$focus = $container.find('.focus');

		if ( $focus.length > 0 ) {
			var $next = $focus.next(),
				$prev = $focus.prev();
		} else {			
			var $next = $container.find('.item:first-child'),
				$prev = $container.find('.item:last-child');
		}
		if ( kp == 38 ) { // Up
			console.log('yo')
			if ( $focus.is(':first-child') ) {
				$prev = $container.find('.item:last-child');
			}
			$('.item').removeClass('focus');
			$prev.addClass('focus');
		} else if ( kp == 40 ) { // Down
			if ( $focus.is(':last-child') ) {
				$next = $container.find('.item:first-child');
			}
			$('.item').removeClass('focus');
			$next.addClass('focus');
		}

		if ( kp == 13 ) { // Enter
			if ( $focus.length > 0 ) { selectItem($focus); }
		}		
	}


	$(function(){  
		$searchbar.keydown(function(e){
			$key = e.keyCode;
			if ( $key == 38 || $key == 40 || $key == 13) {
				e.preventDefault();
				nextItem($key);
				return;
			}
			setTimeout(function() {
				recherche(openMenu=true);
			}, 50);
		});
	});
		
	$('.autosearch-results').on('click', 'li', function(){
		selectItem($(this));
	});

	$searchbar.focus(function(){
		if ( $partiel.find('.item').length > 0 ) {
			recherche(openMenu=true);
		}
		$('#searchform').submit(function(e){
			e.preventDefault();
			selectItem($(this));
			$('input').blur();
		});		
	});
	$('.show-hide.bouton').on('click', function(){
		$partiel.html('');
	})

	function selectItem($item){
		var $titre = $item.find('span.item-titre').text(),
			$texte = $item.find('span.item-texte').text();
		$menu.prop('checked', false);
		$searchbar.val($titre);
		$description.val($texte);//.prop( "disabled", true );
	}

	function getContainer(){
		if ( $partiel.find('.item').length > 0 ) {
			var $container = $partiel;
		} else {
			var $container = $complet;
		}
		return $container;
	}
	
});