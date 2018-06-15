//Socialworker Dashboard (web resources)
(function($){
    $(window).on("load",function(){
        $(".table-container").mCustomScrollbar({
        	theme:"violet-theme",
        	scrollButtons: { enable: true }
        });
    });
})(jQuery);

//Socialworker synthetic view (social interventions)
(function($){
    $(window).on("load",function(){
        $("#block-social-interventions").mCustomScrollbar({
        	theme:"yellow-theme",
        	scrollButtons: { enable: true }
        });
    });
})(jQuery);

//Socialworker my files
(function($){
    $(window).on("load",function(){
        $("#socialworker-myfiles-table").mCustomScrollbar({
        	theme:"blue-theme",
        	scrollButtons: { enable: true }
        });
    });
})(jQuery);


