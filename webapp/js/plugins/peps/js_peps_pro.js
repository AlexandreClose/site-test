var autocompleteSocialWorkerNameIsNotOk =false;
var autocompleteOrganismerNameIsNotOk=false;

(function($) {
	$(window).on("load", function() {

		// Autocomplete user name (simple search)
		$(function() {
			$('#search_input').autocomplete({
				minLength : 0,
				source : function(request, response) {
					$.ajax({
						type : "GET",
						url : 'jsp/admin/plugins/peps/socialworker/autoCompleteUserName.jsp',
						data : 'search_input=' + $('#search_input').val(),
						messages : {
							noResults : 'Aucun usager trouvé'
						},

						success : function(data) {
							var names = $.map(data, function(items) {
								return {
									label : items.name,
									value : items.name,
									data : items.id
								};
							});
							
							names.push({
								label : "+ de critères",
								value : "",
								data : "-1"
							})
							
							response(names);
						}
					});
				},
				select : function(event, ui) {
					if (ui.item.data == -1) {
						$('#search_input').autocomplete('close');
						$("#modal-advanced-search").modal();
					} else {
					    if (/*@cc_on!@*/false || !!document.documentMode)  // If Internet Explorer
					    {
					    	window.location.href = 'SocialWorkerSyntheticView.jsp?id=' + ui.item.data;
					    }
					    else  // If another browser
					    {
					    	window.location.href = 'jsp/admin/plugins/peps/socialworker/SocialWorkerSyntheticView.jsp?id=' + ui.item.data;
					    }
					}
				}
			});
		});
		// End autocomplete

		// Autocomplete address (admin)
		$(function() {
			$('#adresse').autocomplete({
				minLength : 0,
				source : function(request, response) {
					$.ajax({
						type : "GET",
						url : 'jsp/admin/plugins/peps/admin/AutoCompleteAddress.jsp',
						data : 'adresse=' + $('#adresse').val(),
						messages : {
							noResults : 'Aucune adresse trouvé'
						},

						success : function(data) {
							var addresses = $.map(data, function(items) {


								$('#idadresse').val(items.Idadrposte);

								return {
									label : items.Adressetypo,
									value : items.Adressetypo
								};
							});

							response(addresses);
						}
					});
				},
			});
		});
		// End autocomplete


		// Autocomplete social worker name (simple search)
		function autocompletesocialworkername($object, $id) {
			$object.autocomplete({
					minLength: 0,
					autoFocus: true,
					messages: {
						noResults: 'Aucun usager trouvé',
						results: function() {}
					},
					source: function(request, response) {
						$.ajax({
							type: "GET",
							url: 'jsp/admin/plugins/peps/socialworker/AutoCompleteSocialWorkerName.jsp',
							data: 'search_input=' + $object.val(),
							messages: {
								noResults: 'Aucun usager trouvé'
							},

							success: function(data) {
								//console.info($(this).val());
								var result = $.map(data, function(items) {
									return {
										label: items.name,
										value: items.name,
										data: items.id
									};
								});
								response(result);
							}
						});
					},
					select: function(e, ui) {
						$object.val(ui.item.value);
						$id.val(ui.item.data);
					},
					change: function(e, ui) {
						if (!(ui.item)) {
							$object.val("");
							$id.val("");
						}
					}
				})
				.autocomplete("instance")._renderItem = function(ul, item) {
					return $("<li>")
						.append("<b>" + item.value + "</b>")
						.appendTo(ul);
				};
		}

		if(window.location.href.indexOf("/jsp/admin/plugins/peps/socialworker/ManageRoadMaps.jsp") >= 0){
			autocompletesocialworkername($('#search_input_social_worker_name'), $('#search_input_social_worker_name_id'));
		}

			autocompletesocialworkername($('#autocomplete-socialworker-name'), $('#selected_socialworker_id'));

		// End autocomplete

		// Autocomplete organisme (simple search)		
	    function autocompleteorganisme(object) {
	        object.autocomplete({
	            minLength: 0,
	            autoFocus: true,
	            messages: {
	                noResults: 'Aucun organisme trouvé',
	                results: function () {}
	            },
	            source : function(request, response) {
					$.ajax({
						type : "GET",
						url : 'jsp/admin/plugins/peps/socialworker/AutoCompleteOrganisme.jsp',
						data : 'search_input=' + $('#search_input_social_organisme').val(),
						messages : {
							noResults : 'Aucun usager trouvé'
						},

						success : function(data) {
							var names = $.map(data, function(items) {
								return {
									label : items.name,
									value : items.name,
									adress : items.adress,
									data : items.id
								};
							});
							response(names);
						}
					});
				},
	            select: function (e, ui) {
					$("#search_input_social_organisme_id").val(ui.item.data);
					$("#search_input_social_organisme").val(ui.item.value + "\n" + ui.item.adress);
					return false;
	            },
	            change: function (e, ui) {
	                if (!(ui.item)) {
						$("#search_input_social_organisme").val("");
						$("search_input_social_organisme_id").val("");
	                }
	            }
	        })
			.autocomplete("instance")._renderItem = function(ul, item) {
			return $("<li>")
				.append("<div><b>" + item.value + "</b><br>" + item.adress + "</div>")
				.appendTo(ul);
	        };
	    }

	    if(window.location.href.indexOf("/jsp/admin/plugins/peps/socialworker/ManageRoadMaps.jsp") >= 0){
	    	autocompleteorganisme($('#search_input_social_organisme'));
	    }
		// End autocomplete

	});
})(jQuery);

function changeAdresse() {
	document.getElementById("adresse_espace_inclusion_numerique").value = $('#id_lieu').find(":selected").text();
}

// Social Worker : Create / modify roadmap

$(function() {

	$(".pepsCalendar").datepicker({
		dateFormat : 'dd/mm/yy',
		beforeShowDay : $.datepicker.noWeekends,
		minDate : 0
	});

	$("#identifiant_service_inclusion_numerique").multilineSelectmenu();

	$("select[name^='lieu-modalite-']").multilineSelectmenu();

	function toggleChevron(header) {
		if (header) {
			$(header).find("span.glyphicon").toggleClass(
				"glyphicon-chevron-down glyphicon-chevron-up");
		}
	}

	$("#demarches-accordeon").accordion({
		active : 0,
		icons : null,
		collapsible : true,
		heightStyle : "content",
		create : function(event, ui) {
			toggleChevron(ui.header);
		},
		activate : function(event, ui) {
			toggleChevron(ui.newHeader);
			toggleChevron(ui.oldHeader);
		}
	});

	//Unchecking a category
	$("#demarches-accordeon .ui-accordion-header input[type='checkbox']")
		.click(
			function(e) {
				e.stopPropagation();
				if (!$(this).is(":checked")) { //If unchecking parent
					$(this).parent(".ui-accordion-header").next(
						".ui-accordion-content").find(
						"input[type='checkbox']").prop(
						"checked", false); //Uncheck its children too
				} else {
					$id_clicked = $("#demarches-accordeon").find("h3").index($(this).parent(".ui-accordion-header"));
					$("#demarches-accordeon").accordion("option", "active", $id_clicked);
				}
			});


	//Checking a step
	$("#demarches-accordeon .ui-accordion-content input[type='checkbox']")
		.click(
			function() {
				if ($(this).is(":checked")) {
					$(this).parents(".ui-accordion-content").eq(0)
						.prev(".ui-accordion-header").find(
						"input[type='checkbox']").prop(
						"checked", true); //Check parent category too
				}
			});

	$("#roadmap-history").change(function() {
		if ($(this).val() != '') {
			window.location = $(this).val();
		}
	});

	// form validation
	var date = $('#roadmap-calendar-day');
	var hour = $('#roadmap-calendar-hour');
	var min = $('#roadmap-calendar-min');
	var search_sw = $('#search_input_social_worker_name');
	var search_so = $('#search_input_social_organisme_id');

	//Checking children checkbox
	function validateChildrenSteps() {
		var i = 0;
		var flag = false;
		var nbCheckedChildren = $("#demarches-accordeon .ui-accordion-content input[type='checkbox']:checked").length;
		//Checks if any of the children is checked
		if (nbCheckedChildren > 0) {
			$("#demarches-accordeon .ui-accordion-content input[type='checkbox']:checked").each(function() {
				if ($(this).parents(".ui-accordion-content").eq(0).prev(".ui-accordion-header").find("input[type='checkbox']").is(":checked"))
					i++;
			});
			if (i != nbCheckedChildren) {
				return "<li>Veuillez également sélectionner les catégories des démarches sélectionnées.</li>";
			}
		} else {
			return "<li>Veuillez sélectionner au moins une démarche.</li>";
		}
		return null;

	}

	//Checking parents checkbox
	function validateParentSteps() {
		var i = 0;
		var flag = true;
		//check if any parents are checked

		$("#demarches-accordeon .ui-accordion-header input[type='checkbox']:checked").each(function() {
			var nbChildren = 0;
			$(this).parent(".ui-accordion-header").next(".ui-accordion-content").find("input[type='checkbox']").each(function() {
				if ($(this).prop("checked")) {
					nbChildren++;
				}
			});
			if (nbChildren == 0) {
				flag = false;
			}
		});

		if (!flag) {
			return "<li>Veuillez sélectionner au moins une démarche dans la(les) catégorie(s) sélectionnée(s).</li>";
		}

		return null;

	}

	function validateListsOfPlaces() {
		var flag = true;
		$("select[name^='lieu-modalite-']").each(function() {
			if (flag && $(this).parents("ul.modalites").eq(0).prev().prev("input[type='checkbox'][name='demarche']").prop("checked")) {
				if ($(this).val() === "") {
					flag = false;
				}
			}
		});
		return flag;
	}

	// control hours and minutes
	function shouldBeBetween(param, inf, sup) {
		return (param >= inf && param <= sup);
	}
	$('#roadmap-calendar-hour').keyup(function() {
		var hour = $('#roadmap-calendar-hour').val();
		$('#errors').empty();
		if (!shouldBeBetween(hour, 0, 23)) {
			$('#errors').show();
			$('#errors').append("<li>Cette valeur doit être comprise entre 0 et 23.</li>");
		} else {
			$('#errors').hide();
		}
	});

	$('#roadmap-calendar-min').keyup(function() {
		var min = $('#roadmap-calendar-min').val();
		$('#errors').empty();
		if (!shouldBeBetween(min, 0, 59)) {
			$('#errors').show();
			$('#errors').append("<li>Cette valeur doit être comprise entre 0 et 59.</li>");
		} else {
			$('#errors').hide();
		}
	});


	// Appointement block
	function isAppointmentFullyFilled() {
		return (date.val() != '' && hour.val() != '' && min.val() != '' && search_sw.val() != '' && search_so.val() != '');
	}
	;

	function isAppointmentEmpty() {
		var valid = false;

		if (date.val() == '' && hour.val() == '' && min.val() == '') {
			valid = true;
		}

		return valid;
	}
	;

	function addError(errorsArray, error) {
		if (error != null) {
			errorsArray.push(error);
		}
	}

	// Submitting the form
	$("#roadmap-creation").on("submit", function(event) {

		var error = null;
		var errorsArray = [];
		$('#errors').empty();
		if (!isAppointmentFullyFilled() && !isAppointmentEmpty()) {
			errorsArray.push("<li>Un rendez-vous doit contenir toutes les informations demandées ou être vide.</li>");
		}

		addError(errorsArray, validateChildrenSteps());
		addError(errorsArray, validateParentSteps());

		if (!validateListsOfPlaces()) {
			errorsArray.push("<li>Veuillez choisir une adresse parmi les propositions dans vos démarches sélectionnées.</li>");
		}

		if (errorsArray.length != 0) {
			$('#errors').show();
			for (var i = 0; i < errorsArray.length; i++) {
				$('#errors').append(errorsArray[i]);
			}
			window.scrollTo(0, 0);
			return false;
		} else {
			return true;
		}

	});
});

$(document).ready(function() {
	$('.create_roadmapsteptypes_details_check').change(function() {
		if (this.checked) {
			$(this).parent().next('.create_roadmapsteptypes_details').removeClass('hidden');
		} else {
			$(this).parent().next('.create_roadmapsteptypes_details').addClass('hidden');
		}
	});

	$('#roadmapsteptypes-form .check-has-details-fixes').change(function() {
		if (this.checked) {
			$(this).parent().parent().find('.details-fixes-inputs').removeClass('hidden');
			$(this).parent().parent().find('.list-places-inputs').addClass('hidden');

		} else {
			$(this).parent().parent().find('.details-fixes-inputs').addClass('hidden');
			$(this).parent().parent().find('.list-places-inputs').removeClass('hidden');
		}
	});

	$("#manageStepTypes .ui-accordion-header a").click(
		function(e) {
			e.stopPropagation();
		}
	);
});

// Admin : Manage roadmap languages
$(function() {
	$("form[name='create_roadmaplanguage']").validate({
		lang : 'fr'
	});
	$("form[name='create_roadmaplanguage'] input[type='text']").rules("add", "required");

	$("form[name='modify_roadmaplanguage']").validate({
		lang : 'fr'
	});
	$("form[name='modify_roadmaplanguage'] input[type='text']").rules("add", "required");
});


// Admin : Manage document types

function populateChildrenGedTypes(data, selectorChildMenu) {
	if (!jQuery.isEmptyObject(data)) {
		$(selectorChildMenu).find("option:gt(0)").remove();
		$.each(data, function(i, item) {
			$(selectorChildMenu).append($("<option>", {
				value : item._nId,
				text : item._strLibelle
			}));
		});
	}
}

$('#gedTypeLvlOne').change(function() {
	$.ajax({
		url : "jsp/admin/plugins/peps/admin/AjaxPopulateGEDTypes.jsp",
		data : {
			"selected" : $(this).val()
		},
		type : "GET",
		success : function(data) {
			populateChildrenGedTypes(data, "#gedTypeLvlTwo");
		}
	});
});

$('#gedTypeLvlTwo').change(function() {
	$.ajax({
		url : "jsp/admin/plugins/peps/admin/AjaxPopulateGEDTypes.jsp",
		data : {
			"selected" : $(this).val()
		},
		type : "GET",
		success : function(data) {
			populateChildrenGedTypes(data, "#gedTypeLvlThree");
		}
	});
});

$(function() {

	$("#documents-accordeon").accordion("option", "active", "none");

	// When header collapsed, hide dark blue bloc if shown already
	$("#documents-accordeon").on("accordionactivate", function(event, ui) {
		if (ui.oldHeader.attr("id") != null) {
			// hide any li hidden dark blue block
			$id = $('#' + ui.oldHeader.attr("id"));
			$id.next('div').find('ul').find('li').each(function() {
				$(this).find('label').next('div').hide();
				$(this).find('label').removeClass("text-white");
				$(this).removeClass("bg-dark-blue");
			});
			//Hide other document bloc if not hidden
			$id.next('div').find('.other-document-inputs').hide();
			$id.next('div').find('.other-document-label').removeClass("text-white");
			$id.next('div').find('div').removeClass("bg-dark-blue");
		}
	});

	//save initial lists of documents requests in wait to compare at the end
	var init_in_wait_requests = [];
	$('.document-in-wait li').each(function() {
		var $document = $(this);
		var label = $document.children("span.li-document-label").text();
		var precision = $document.children("div.precision-container").find("span.precision").text();
		var id = $document.children("input").attr('value');
		init_in_wait_requests.push([ label, precision, id ]);
	});



	// Add other document to document requests
	$('.confirm-add-other-document').on('click', function() {

		var label = $(this).parent('div').parent('.other-document-inputs').find('.document-label').val();
		var precision = $(this).parent('div').parent('.other-document-inputs').find('.document-precision').val();
		var type_document = $(this).attr("name");
		var li = "";
		if (label != "" && label != null) {
			if ($('.document-new-requests ul').length == 0) {
				$('.document-new-requests').append("<ul></ul>");
			}
			$('.document-new-requests ul').append("<li><span class=\"li-document-label\">" + label + "</span><span class=\"picto-peps picto-cancel-circled\" data-toggle=\"modal\" data-label=" + "\"" + label + "\"" + " data-precision=" + "\"" + precision + "\"" + " data-target=\"#modal-delete-document\"></span><br><div class=\"precision-container\"><span class=\"precision\">" + precision + "</span></div><input type=\"hidden\" name=\"" + type_document + "\" value=\"1\"></li>");
			$(this).parent('div').parent('div').hide();
			$(this).parent('div').parent('div').parent('div').find('label').toggleClass("text-white");
			$(this).parent('div').parent('div').parent('div').toggleClass("bg-dark-blue");
			$(this).parent('div').parent('div').find('input').val('');
			$('.document-new-requests').find('.no-new-requests').hide();
		}
	});
	// Add document
	$('.confirm-add-document').on('click', function() {
		var precision = $(this).parent('div').parent('.document-type-precision').find('.document-precision-input').val();
		var li = "";
		var label = $(this).attr("value");
		var type_document = $(this).attr("name");
		if (precision != "" && precision != null) {
			//check if there is already ul with element or we need to create one

			if ($('.document-new-requests ul').length == 0) {
				$('.document-new-requests').append("<ul></ul>");
			}
			$('.document-new-requests ul').append("<li><span class=\"li-document-label\">" + label + "</span><span class=\"picto-peps picto-cancel-circled\" data-toggle=\"modal\" data-label=" + "\"" + label + "\"" + " data-precision=" + "\"" + precision + "\"" + " data-target=\"#modal-delete-document\"></span><br><div class=\"precision-container\"><span class=\"precision\">" + precision + "</span></div><input type=\"hidden\" name=\"" + type_document + "\" value=\"0\"></li>");
		} else {
			if ($('.document-new-requests ul').length == 0) {
				$('.document-new-requests').append("<ul></ul>");
			}
			$('.document-new-requests ul').append("<li><span class=\"li-document-label\">" + label + "</span><span class=\"picto-peps picto-cancel-circled\" data-toggle=\"modal\" data-label=" + "\"" + label + "\"" + " data-precision=" + "\"" + precision + "\"" + " data-target=\"#modal-delete-document\"></span><br><div class=\"precision-container\"><span class=\"precision\"></span></div><input type=\"hidden\" name=\"" + type_document + "\" value=\"0\"></li>");

		}

		$(this).parent('div').parent('.document-type-precision').hide();
		$(this).parent('div').parent('div').parent('li').find('label').toggleClass("text-white");
		$(this).parent('div').parent('div').parent('li').toggleClass("bg-dark-blue");
		$(this).parent('div').parent('div').find('input').val('');
		$('.document-new-requests').find('.no-new-requests').hide();
	});

	//hid other document block and precision block for document types
	$('.other-document-label').click(function() {
		$(this).next('div').toggle();
		$(this).toggleClass("text-white");
		$(this).parent('.other-document').toggleClass("bg-dark-blue");

		//close other showed bloc if exists
		$(this).parent('div').parent('div').find('ul').find('li').each(function() {
			$(this).find('label').next('div').hide();
			$(this).find('label').removeClass("text-white");
			$(this).removeClass("bg-dark-blue");
		});
	});
	$('.document-types label').on('click', function() {
		$this = $(this);

		//close other showed bloc if exists
		$this.parent('li').parent('ul').find('li').each(function() {

			$(this).find('label').next('div').hide();
			$(this).find('label').removeClass("text-white");
			$(this).removeClass("bg-dark-blue");

		});
		//close other bloc if opend
		$this.parent('li').parent('ul').next('div').find('.other-document-inputs').hide();
		$this.parent('li').parent('ul').next('div').find('.other-document-label').removeClass("text-white");
		$this.parent('li').parent('ul').next('div').removeClass("bg-dark-blue");

		// show only the clicked bloc
		$this.next('div').toggle();
		$this.toggleClass("text-white");
		$this.parent('.document-types').toggleClass("bg-dark-blue");

	});


	// disable confirm button when label is empty
	$('.document-label').keyup(function() {
		if ($(this).val() != "") {
			$('.confirm-add-other-document').prop('disabled', false);
		}
		else
			$('.confirm-add-other-document').prop('disabled', true);
	});

	// Go back button
	$("#modal-back").on("show.bs.modal", function(event) {
		var idFileActive = $(event.relatedTarget).data('user');
		$("#confirm-back").on('click', function() {
			$("#modal-back").modal('toggle');
			closeManageDocuments(idFileActive, null);
		});
	});

	// delete requests
	//save label precision so that we can use them later to delete item in documents list
	var label = "";
	var precision = "";
	//when modal is open .. save curent label  and  precision
	$("#modal-delete-document").on("show.bs.modal", function(event) {
		var $modal = $(this);
		var in_wait=$(event.relatedTarget).data('in-wait');
		label = $(event.relatedTarget).data('label');
		precision = $(event.relatedTarget).data('precision');
		var document = "- " + label;
		if (precision != "")
			document += " " + "- " + precision;
		$modal.find('#document-to-delete').html(document);
		
		if(in_wait == 1)
			$(".activate-msg2").show();
		else
			$(".activate-msg2").hide();
	});

	// when click on button confirm delete, look for the document in ul list and delete it
	$("#modal-delete-document .confirm-delete").on('click', function() {
		$('.box-content li').each(function() {
			var $document = $(this);
			if ($document.children("span.li-document-label").text() === label) {
				if (precision != "" && $document.children("div.precision-container").find("span.precision").text() === precision) {
					$document.remove();
				}else{
					$document.remove();
				}
			}
		});

		// display empty list message if list is empty
		if ($('.box-content .document-in-wait li').length == 0)
			$('.document-in-wait').find('.no-requests-in-wait').show();

		if ($('.box-content .document-new-requests li').length == 0)
			$('.document-new-requests').find('.no-new-requests').show();

		//Modal's job is done, close it!
		$("#modal-delete-document").modal('toggle');
	});

	function closeManageDocuments(idUsager, jsonChanges) {
		if ($("#mode_documents").val() === "roadmap") {
			$("#modal-manage-documents").modal('toggle');
			$("#json-documents-requested").val(jsonChanges);
		} else {
		    if (/*@cc_on!@*/false || !!document.documentMode)  // If Internet Explorer
		    {
		    	window.location.href = 'SocialWorkerSyntheticView.jsp?id=' + idUsager;
		    }
		    else  // If another browser
		    {
		    	window.location.href = 'jsp/admin/plugins/peps/socialworker/SocialWorkerSyntheticView.jsp?id=' + idUsager;
		    }
			
		}
	}

	var new_requests = [];
	var deleted_requests = [];
	var final_in_wait_requests = [];
	var id_ts;
	var id_usager;
	// get changes that has been done in document requests and display the summary
	$("#modal-validate").on("show.bs.modal", function(event) {
		var $modal = $(this);
		id_ts = $(event.relatedTarget).data('ts');
		id_usager = $(event.relatedTarget).data('user');
		new_requests = [];
		deleted_requests = [];
		final_in_wait_requests = [];
		var count_deleted = 0;
		$("#modal-content ul").remove();

		//get new new_requests
		$('.document-new-requests li').each(function() {
			var $document = $(this);
			var label = $document.children("span.li-document-label").text();
			var precision = $document.children("div.precision-container").find("span.precision").text();
			var isOther = $document.children("input").attr('value');
			var typeDocument = $document.children("input").attr('name');
			new_requests.push([ label, precision, isOther, typeDocument ]);
		});

		//get final in wait requests, compare it with initial list
		$('.document-in-wait li').each(function() {
			var $document = $(this);
			var label = $document.children("span.li-document-label").text();
			var precision = $document.children("div.precision-container").find("span.precision").text();
			var isOther = $document.children("input").attr('value');
			var typeDocument = $document.children("input").attr('name');
			final_in_wait_requests.push([ label, precision, isOther, typeDocument ]);
		});

		//get requests that has been deleted from intial list
		$.each(init_in_wait_requests, function(i) {
			var current_label = init_in_wait_requests[i][0];
			var current_precision = init_in_wait_requests[i][1];
			$.each(final_in_wait_requests, function(j) {
				if (current_label == final_in_wait_requests[j][0] && current_precision == final_in_wait_requests[j][1])
					count_deleted++;
			});
			if (count_deleted == 0) {
				var l = init_in_wait_requests[i][0];
				var p = init_in_wait_requests[i][1];
				var i = init_in_wait_requests[i][2];
				deleted_requests.push([ l, p, i ]);
			} else {
				count_deleted = 0;
			}
		});

		// if now summary display message no recap
		if (final_in_wait_requests.length == 0 && deleted_requests.length == 0 && new_requests.length == 0) {
			$('div#no-recap').show();
			$('span#recap-msg').hide();
		} else {
			$('div#no-recap').hide();
			$('span#recap-msg').show();
		}

		// fill in the modal with a summary
		if (new_requests.length != 0) {
			var elts = "<ul id=\"new-document-requests\">";
			$.each(new_requests, function(index) {
				var document = new_requests[index][0];
				if (new_requests[index][1] != "")
					document += " - " + new_requests[index][1];
				elts += "<li>" + document + "</li>";
			});
			elts += "</ul>";
			$modal.find('#final-new-requests').append(elts);
			$("#final-new-requests span").show();
		} else {
			$("#final-new-requests span").hide();
		}

		if (final_in_wait_requests.length != 0) {
			var elts = "<ul id=\"in-wait-document-requests\">";
			$.each(final_in_wait_requests, function(index) {
				var document = final_in_wait_requests[index][0];
				if (final_in_wait_requests[index][1] != "")
					document += " - " + final_in_wait_requests[index][1];
				elts += "<li>" + document + "</li>";
			});
			elts += "</ul>";
			$modal.find('#final-in-wait-requests').append(elts);
			$("#final-in-wait-requests span").show();
		} else {
			$("#final-in-wait-requests span").hide();
		}

		if (deleted_requests.length != 0) {
			var elts = "<ul id=\"deleted-document-requests\">";
			$.each(deleted_requests, function(index) {
				var document = deleted_requests[index][0];
				if (deleted_requests[index][1] != "")
					document += " - " + deleted_requests[index][1];
				elts += "<li>" + document + "</li>";
			});
			elts += "</ul>";
			$modal.find('#final-deleted-requests').append(elts);
			$("#final-deleted-requests span").show();
		} else {
			$("#final-deleted-requests span").hide();
		}
	});

	//when validate recap and send mail
	$("#btn-validate-and-send").on('click', function() {
		//Build json array with requests to create
		var documents = {
			"request" : [],
			"deleted" : [],
			"inwait":[]
		};
		$.each(new_requests, function(index) {
			var label_other = "";

			if (new_requests[index][0] != null)
				label = new_requests[index][0];

			if (new_requests[index][2] == 1)
				label_other = new_requests[index][0];

			var id_type = 0;
			if (new_requests[index][3] > 0)
				id_type = new_requests[index][3];

			var comment = new_requests[index][1];
			var status = 1; // we validate request and becomes in wait request
			var doc = {
				'id_type_document' : id_type,
				'id_travailleur_social' : id_ts,
				'id_usager' : id_usager,
				'commentaire' : comment,
				'libelle_autre_type_document' : label_other,
				'statut_document' : status,
				'libelle' : label
			}
			documents.request[index] = doc;
		});
		// Build json array with request to delete
		$.each(deleted_requests, function(index) {
			var id_document = deleted_requests[index][2];
			var label_document = deleted_requests[index][0];
			var doc = {
				'id_document' : id_document,
				'label_document': label_document
			}
			documents.deleted[index] = doc;
		});
		
		$.each(final_in_wait_requests, function(index) {
			var nom = final_in_wait_requests[index][0];
			var doc = {
				'nom_document' : nom,
				'id_usager' : id_usager
			}
			documents.inwait[index] = doc;
		});

		var json = JSON.stringify(documents);
		//Send the json list to action
		$.ajax({
			type : 'POST',
			url : "jsp/admin/plugins/peps/socialworker/AjaxPopulateDocumentRequests.jsp",
			data : {
				"json" : json
			},
			mimeType : 'application/json',
			success : function() {
				//Modal's job is done, close it!
				$("#modal-validate").modal('toggle');

				closeManageDocuments(id_usager, json);

				if ($("#mode_documents").val() === "roadmap") {
					if (documents.request.length === 0) {
						$("#roadmap-documents-requested").append("Aucune demande de document n'a été ajoutée.");
					} else {
						var liste = "";
						liste += "<ul>";
						$.each(documents.request, function(index, doc) {
							liste += "<li>";

							if (doc.libelle_autre_type_document !== "") {
								liste += doc.libelle_autre_type_document;
							} else {
								liste += doc.libelle;
							}

							if (doc.commentaire !== "") {
								liste += " - " + doc.commentaire;
							}

							liste += "</li>";
						});
						liste += "</ul>";
						$("#roadmap-documents-requested").append(liste);
					}
					$("#btn-roadmap-documents").prop('disabled', true);
					$("#btn-roadmap-documents").hide();
				}
			}
		});
	});
	
	
	// Social worker : Synthetic view
	
	function resizeBlockInterventions() {
		var neighbouringHeights = $.map($(".box-overview-ts .box-wrapper"), function(box) { return $(box).innerHeight(); });

		if (neighbouringHeights.length > 0) {
			var maxHeight = Math.max.apply(Math, neighbouringHeights);
			var firstBloc = $("#overview-social-reference").innerHeight();
			var scrollableHeight = maxHeight - firstBloc;
			
			//For media size over XS
			if (window.innerWidth > 576) {
				$("#block-social-interventions").css("max-height", scrollableHeight + "px");
				$("#block-social-interventions").css("height", scrollableHeight + "px");
			} else {
				$("#block-social-interventions").removeAttr("style");
			}
		}
	}

	resizeBlockInterventions();
	$(window).resize(function() { resizeBlockInterventions(); } );
	$('.box-overview-ts .box-wrapper .peps-collapse').on('shown.bs.collapse', function() { resizeBlockInterventions(); });
	$('.box-overview-ts .box-wrapper .peps-collapse').on('hidden.bs.collapse', function() { resizeBlockInterventions(); });

	
	$("#imprimer-notice").on('click', function() {
		$.ajax({
			url : "jsp/admin/plugins/peps/socialworker/AjaxDownload.jsp",
			data : 'id_user=' + $('#notice-id').val(),
			success : function(data) {
				download(data.trim(),"notice_connexion.pdf","application/pdf")
			}
		});
	});

	$("#imprimer-roadmap").on('click', function() {
		printCurrentRoadmap();
	});

	function checkPrintingRequest() {
		if ($("#printingRequested").length > 0) {
			printCurrentRoadmap();
		}
	}


	function printCurrentRoadmap() {
		$.ajax({
			url : "jsp/admin/plugins/peps/socialworker/AjaxDownloadRoadMap.jsp",
			data : 'idroadmap=' + $('#idroadmap').val(),
			success : function(data) {
				download(data.trim(),"feuille_de_route.pdf","application/pdf")
			}
		});
	}
	
	checkPrintingRequest();
});