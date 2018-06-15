$(function getUserNameInitial() {

	var name = $("span[id^=userNameIntial]").attr('name');
	if (name != "" && name != null) {
		var initial = name.charAt(0).toUpperCase();
		console.info("test");
		$("#userNameIntial").html(initial);
	}
});

$(function() {

	function toggleChevron(header) {
		if (header) {
			$(header).find("span.glyphicon").toggleClass(
					"glyphicon-chevron-down glyphicon-chevron-up");
		}
	}
	
	$('.peps-collapse').on('show.bs.collapse', function() { toggleChevron($(this).prev('.peps-collapse-header')); });
	$('.peps-collapse').on('hide.bs.collapse', function() { toggleChevron($(this).prev('.peps-collapse-header')); });
	
	
	$(".peps-accordion").accordion({
		active : currentTab,
		icons : null,
		collapsible : true,
		active: false,
		heightStyle : "content",
		create : function(event, ui) {
			toggleChevron(ui.header);
		},
		activate : function(event, ui) {
			toggleChevron(ui.newHeader);
			toggleChevron(ui.oldHeader);
		}
	});
	
	//userstep load file photo part begin
	var tab = document.getElementById('initCurrentTab');
	var previousURL = document.referrer;//previous url
	
	if(tab) {
		var currentTab =tab.value;
		if(currentTab) {
			currentTab = parseInt(currentTab);
			if (previousURL.indexOf("jsp/site/Portal.jsp?page=userstepsloadfiles&view=photo") > -1){
				$("#documents-accordeon-usager").accordion({collapsible: true, active: currentTab });
			}
		}
	}
	//userstep load file photo part end

});

function goBack() {
    window.history.back();
}

$(document).ready(function() {

	
	//usersteploadfiles photo part
	if(window.location.href.indexOf("jsp/site/Portal.jsp?page=userstepsloadfiles&view=photo") > -1){

		// Grab elements, create settings, etc.
		var video = document.getElementById('video');
	
		// Get access to the camera!
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			// Not adding `{ audio: true }` since we only want video now
			navigator.mediaDevices.getUserMedia({
				video : true
			}).then(function(stream) {
				video.src = window.URL.createObjectURL(stream);
				video.play();
			});
		}
	
		document.getElementById("snap").addEventListener("click", function() {
			$("#canvas")[0].getContext('2d').drawImage(video, 0, 0, 640, 480);
			$("#video").hide();
			$("#snap").hide();
			$("#canvas").show();
			$("#validate").show();
			$("#retry").show();
			
			document.getElementById('photo').value = canvas.toDataURL("image/jpeg");
	
		});
		
	
		document.getElementById("retry").addEventListener("click", function() {
			$("#video").show();
			$("#canvas").hide();
			$("#validate").hide();
			$("#retry").hide();
			$("#snap").show();
		});
		
	  	$("#canvas").outerWidth($("#photo-size").width()-$("#canvas").offset().left- Math.abs($("#canvas").outerWidth(true) - $("#canvas").outerWidth()));
	    $(window).on("resize", function(){
			if ($(window).width() < 640) {
				$("#canvas").outerWidth($("#photo-size").width()-$("#canvas").offset().left- Math.abs($("#canvas").outerWidth(true) - $("#canvas").outerWidth()));
			}
		});
    
	}

});
