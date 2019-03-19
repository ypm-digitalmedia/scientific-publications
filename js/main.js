var myDropzone = null;
var searchTextRecord = null;
var fuse;
var numMax
var result;
var filtered = [];

var dataFile = "../data/data_jmr_test.json";

$(document).ready(function () {
	
	
	loadData(dataFile);
	
	
	// dynamic DOM elements workaround
	$("body").click(function (event) {
		
		if ($(event.target).hasClass("edit-record-search-link")) {
			
		}

	});


	$("#mainForm").validator()
		.on("submit", function (e) {
			if (e.isDefaultPrevented()) {
				// handle the invalid form...
				//                alert("this is invalid");
				console.warn("invalid form submission");
			} else {
				// everything looks good!
				e.preventDefault();
				
			}
		});


	$("#searchRecordAll").on("keyup keypress click", function (e) {
		searchTextRecord = $(this).val();
		//		console.log(searchTextEvent);
	});


	function showDebugPanel() {
		$("#outputToggle").html('<i class="fas fa-caret-up"></i>');
		$("#output").css('opacity', 0)
			.slideDown('slow')
			.animate({
				opacity: 1
			}, {
				queue: false,
				duration: 'slow'
			});
		$("#outputToggle").fadeIn('slow');
	}

	function hideDebugPanel() {
		$("#outputToggle").html('<i class="fas fa-caret-down"></i>');
		$("#output").css('opacity', 1)
			.slideUp('slow')
			.animate({
				opacity: 0
			}, {
				queue: false,
				duration: 'slow'
			});
	}

	$("#outputToggle").click(function () {
		if ($("#output").is(":hidden")) {
			showDebugPanel();
		} else {
			hideDebugPanel();
		}
	});


	var options = {
	  shouldSort: true,
	  threshold: 0.6,
	  location: 0,
	  distance: 100,
	  maxPatternLength: 32,
	  minMatchCharLength: 1,
	  keys: [
		"TITLE",
		"AUTHOR",
		"DATE",
		"SEQUENCE"
	  ]
	};
	
	fuse = new Fuse(jsonDataRecords, options); // "list" is the item array
	//result = fuse.search("");
	
	
	
	$("#searchRecordAll").keyup(function() {
		result = fuse.search($(this).val());
		filtered = _.map(result,"SEQUENCE");
		$("#output").html(JSON.stringify(result,null,2));
		filterIt(filtered,$(this).val());
	})
	
	
//		$("#searchRecordAll").easyAutocomplete(optsRecords);
});


// ============================================================
// =========== UTILITIES / HELPERS ============================
// ============================================================

function loadData(dataFile) {	
	jsonDataRecords = loadJsonAsVar(dataFile);
}

function filterIt(list,term) {
	if( list.length == 0 && term == "" ) {
		$(".record").css("display","block");
		$("#numPubs").text(numMax);
		$("#numPubPlural").text("s");
	} else {
		$(".record").each(function() {
			var sequence = $(this).attr("id").split("record_").join("");
			if(list.indexOf(sequence) == -1 ) {
				$(this).css("display","none");
			} else {
				$(this).css("display","block");
			}
		});
	
		var plural = list.length==1 ? "" : "s";
		$("#numPubs").text(list.length);
		$("#numPubPlural").text(plural);
	}
}


function loadJsonAsVar(url) {
	var obj;
	$.ajax({
		url: url,
		dataType: "json",
		async: false,
		//			data: myData,
		success: function (data) {
			obj = data;
			printPubs(data);
		}
	});
	return obj;
}



function printPubs(obj) {
//	console.warn(obj);
	clearSearchResults();
	var tpl = document.querySelector("#tplRecord").innerHTML;
	var dest = $("#searchResultsRecord");
	
	_.forEach(obj,function(o) {
		
		var theURL = "http://images.peabody.yale.edu/publications/jmr/"+o.SEQUENCE+"-article.pdf";
		var descripString = "Download PDF: Journal of Marine Research " + o.SEQUENCE + " - " + o.TITLE; 
		var theVol = o.SEQUENCE.split("-")[1];
		theVol = parseInt(theVol);
		
		var tplEdit = tpl.replace("{{{title}}}", o.TITLE);
		tplEdit = tplEdit.replace("{{{author}}}", o.AUTHOR);
		tplEdit = tplEdit.replace("{{{date}}}", o.DATE);
		tplEdit = tplEdit.replace("{{{number}}}", o.SEQUENCE);
		tplEdit = tplEdit.replace("{{{url}}}", theURL);
		tplEdit = tplEdit.replace("{{{volnum}}}", theVol);
		tplEdit = tplEdit.replace("{{{sequence}}}", o.SEQUENCE);

		$(dest).append(tplEdit);
		
	});
	
	var plural = obj.length==1 ? "" : "s";
	
	$("#numPubs").text(obj.length);
	$("#numPubPlural").text(plural);
	
	numMax = obj.length;
	
	
	
	
	
	
	
	
	
	
	

}

function clearSearchResults() {
	var dest = $("#searchResultsRecord");
	$(dest).empty();
}



function getPageWidth() {
	$("#pageWidth").val($(window).width());
}

function formatBytes(a, b) {
	if (0 == a) return "0 Bytes";
	var c = 1024,
		d = b || 2,
		e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
		f = Math.floor(Math.log(a) / Math.log(c));
	return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}

function createHexId(length) {
	var choices = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f"
    ];
	var hexString = "";
	for (var i = 0; i < length; i++) {
		hexString += _.sample(choices);
	}

	return hexString;
}

function getGUID() {

	$.ajax({
		url: 'getGUID.php',
		async: false,
		type: 'POST',
		dataType: 'json',
		success: function (result) {
			sessionGUID = result;
			console.warn("GUID returned: " + sessionGUID);
		},
		error: function () {
			console.error("error in fetching GUID.");
		}
	})

}


function makeGUID() {
	var choices = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f"
    ];
	var groups = [[], [], [], [], []];

	//group 1
	for (var i = 0; i < 8; i++) {
		groups[0].push(_.sample(choices));
	}
	groups[0] = groups[0].join("");

	//group 2
	for (var i = 0; i < 4; i++) {
		groups[1].push(_.sample(choices));
	}
	groups[1] = groups[1].join("");

	//group 3
	for (var i = 0; i < 4; i++) {
		groups[2].push(_.sample(choices));
	}
	groups[2] = groups[2].join("");

	//group 4
	for (var i = 0; i < 4; i++) {
		groups[3].push(_.sample(choices));
	}
	groups[3] = groups[3].join("");

	//group 5
	for (var i = 0; i < 12; i++) {
		groups[4].push(_.sample(choices));
	}
	groups[4] = groups[4].join("");

	return groups.join("-");
}

function syntaxHighlight(json) {
	json = json
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
	return json.replace(
		/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
		function (match) {
			var cls = "number";
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = "key";
				} else {
					cls = "string";
				}
			} else if (/true|false/.test(match)) {
				cls = "boolean";
			} else if (/null/.test(match)) {
				cls = "null";
			}
			return '<span class="' + cls + '">' + match + "</span>";
		}
	);
}



function getQs(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return "";
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setQs(param, value) {
	var url = window.location.href;
	var new_url = url + "?" + param + "=" + value;
	history.pushState(null, null, new_url);
}

function stripQs(parameter, url) {
	if (!url) url = window.location.href;
	//prefer to use l.search if you have a location/link object
	var urlparts = url.split("?");
	if (urlparts.length >= 2) {
		var prefix = encodeURIComponent(parameter) + "=";
		var pars = urlparts[1].split(/[&;]/g);

		//reverse iteration as may be destructive
		for (var i = pars.length; i-- > 0;) {
			//idiom for string.startsWith
			if (pars[i].lastIndexOf(prefix, 0) !== -1) {
				pars.splice(i, 1);
			}
		}

		url = urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
		//		return url;
		return url;
	} else {
		return url;
	}
}



function randomNumber() {
	return Math.floor(Math.random() * 1000000000);
}

function feedbackEmail() {
	var v = $("#appVersion").text();
	window.open('mailto:peabody.webmaster@yale.edu?subject=Injestr issue: v' + v);
}

function showNormalDialog(title,message) {
		if( !message || typeof(message) == "undefined") { var theText = "Hello!"; } else { var theText = message; }
		if( !title || typeof(title) == "undefined") { var theTitle = "Alert"; } else { var theTitle = title; }
		BootstrapDialog.show({
			type: BootstrapDialog.TYPE_DEFAULT,
			closable: true,
			title: '<h4>'+theTitle+'</h4>',
			message: '<p>'+theText+'</p>',
			buttons: [{
				label: '<i class="fas fa-times"></i>&nbsp;Close',
				cssClass: 'btn-default',
				action: function (dialogItself) {
					dialogItself.close();
				}
            }]
		});
	}
	
	function showProcessingDialog() {
		BootstrapDialog.show({
			type: BootstrapDialog.TYPE_DEFAULT,
			closable: false,
			title: '<h4>SUBMITTING ASSETS</h4>',
			message: '<p>Please wait while your assets are being processed.  For very large files, this process may take several minutes.</p><p style="text-align: center" align="center"><img src="../img/loader3.gif" /></p>'
		});
	}
	
	function showErrorDialog(errText) {
		console.log(errText);
		BootstrapDialog.show({
			type: BootstrapDialog.TYPE_DANGER,
			closable: false,
			title: '<h4>Error!</h4>',
			message: '<p>' + errText + '</p>',
			buttons: [{
				label: '<i class="fas fa-times"></i>&nbsp;Close',
				cssClass: 'btn-danger',
				action: function (dialogItself) {
					dialogItself.close();
				}
            }]
		});
	}

	function showSuccessDialog(result) {
		console.log(result);
		BootstrapDialog.show({
			type: BootstrapDialog.TYPE_SUCCESS,
			closable: false,
			title: '<h4>Success!</h4>',
			message: '<p>Your submission was successful. Please allow time for these assets to propagate throughout the necessary systems.</p>',
			buttons: [{
				label: '<i class="fas fa-sync-alt"></i>&nbsp;Start over',
				cssClass: 'btn-default',
				action: function () {
					document.location.reload();
				}
            }]
		});
	}

	function showPleaseWaitDialog(result) {
		console.log(result);
		BootstrapDialog.show({
			type: BootstrapDialog.TYPE_WARNING,
			closable: false,
			title: '<h4>Please Wait</h4>',
			message: '<p>Sorry, the server is currently over capacity and processing a large volume of assets.  Please wait a few minutes before trying to use this application again.</p>',
			buttons: [{
				label: '<i class="fas fa-sync-alt"></i>&nbsp;Reload',
				cssClass: 'btn-warning',
				action: function () {
					document.location.reload();
				}
            }]
		});
	}