(function($) {
	if (window.location.hash == "#priorityfiles") {
		switchMyFilesTab('#myfilesprioritary');
		$('#socialworker-myfiles-top-button-prioritary').addClass('socialworker-myfiles-top-button-active');

	} else {
		if (window.location.hash == "#documenttovalidate") {
			switchMyFilesTab('#myfilesdoctovalidate');
			$('#socialworker-myfiles-top-button-doctovalidate').addClass('socialworker-myfiles-top-button-active');

		} else if (window.location.hash == "#searchresult") {
			switchMyFilesTab('#myfilessearchresult');
			$('#socialworker-myfiles-top-button-searchresult').addClass('socialworker-myfiles-top-button-active');
		} else {
			switchMyFilesTab('#myfiles');
			$('#socialworker-myfiles-top-button-myfiles').addClass('socialworker-myfiles-top-button-active');
		}
	}

})(jQuery);





function getNextLetter(letter) {
	var code = letter.charCodeAt(0);
	return (String.fromCharCode(code + 1));
}

function showIt(elID) {

	var currentChar = elID;
	
	var view = $("#socialworker-myfiles-table table").filter(":visible");
	
	if (view.length > 0) {
		var viewID = "#" + $(view.get(0)).attr("id")
		var pointedChar = $(viewID + " #" + elID);
		
		while (pointedChar.length == 0 && currentChar != 'Z') {
			currentChar = getNextLetter(currentChar);
			pointedChar = $(viewID + " #" + currentChar);
		}
		
		if (pointedChar.length > 0) {
			$("#socialworker-myfiles-table").mCustomScrollbar('scrollTo', viewID + " #" + currentChar);
		}
	}
}

function switchMyFilesTab(newTab) {
	var allTabs = ['#myfiles', '#myfilesprioritary', '#myfilesdoctovalidate', '#myfilessearchresult'];
	var idNewTab = allTabs.indexOf(newTab);
	if (idNewTab !== -1) {
		allTabs.splice(idNewTab, 1);
	}
	
	for (i=0 ; i < allTabs.length ; i++) {
		var tab = allTabs[i];
		if (!$(tab).hasClass("hidden")) {
			$(tab).addClass("hidden");
		}
	}
	
	if ($(newTab).hasClass("hidden")) {
		$(newTab).removeClass("hidden");
	}
}

$('.socialworker-myfiles-top-button').on('click', function() {
	$('.socialworker-myfiles-top-button').removeClass('socialworker-myfiles-top-button-active');
	$(this).addClass('socialworker-myfiles-top-button-active');
});