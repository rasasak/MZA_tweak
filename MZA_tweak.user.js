// ==UserScript==
// @name         MZA tweak
// @version      0.7.5
// @downloadURL  https://github.com/rasasak/MZA_tweak/raw/main/MZA_tweak.user.js
// @updateURL    https://github.com/rasasak/MZA_tweak/raw/main/MZA_tweak.user.js
// @description  Malá vylepšení pro web MZA...
// @author       Rasasak
// @match        https://www.mza.cz/actapublica/matrika/detail/*
// @match        https://www.mza.cz/scitacioperaty/digisada/*
// @icon         https://www.mza.cz/actapublica/assets/favicon/android-chrome-192x192.png
// @require      http://code.jquery.com/jquery-latest.js
// @grant        unsafeWindow
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.listValues

// ==/UserScript==

    $("#seadragon-toolbar").children().last().height('4px')
    if (window.location.href.indexOf("actapublica/matrika/detail") > -1) {
        $('#prev-image').after($('#next-image'))

    }
//$(document).ready(function() {

	// dates in header
	var birth = $('#matrikaHeader .row div:nth-child(3) p strong').text();
	var married = $('#matrikaHeader .row div:nth-child(4) p strong').text();
	var died = $('#matrikaHeader .row div:nth-child(5) p strong').text();

	$('.card-header .nav').append(`<li class="nav-item pl-5">
					<ul class="nav">
					  <li class="nav-item px-3">
					    <span class="small font-italic">Narození od-do</span><br>
					    <span class="font-weight-bolder">`+birth+`</span>
					  </li>
					  <li class="nav-item px-3">
					    <span class="small font-italic">Oddaní od-do</span><br>
					    <span class="font-weight-bolder">`+married+`</span>
					  </li>
					  <li class="nav-item px-3">
					    <span class="small font-italic">Zemřelí od-do</span><br>
					    <span class="font-weight-bolder">`+died+`</span>
					  </li>
					</ul>
				      </li>`);



	  //toolbar for buttons
	  let toolbar = document.querySelector('#seadragon-toolbar .form-group');


	  //dezoomify button
    let btnDezoomify = makeButton('dezoomify','Stáhnout (Dezoomify)','fas fa-cloud-download-alt');
    toolbar.after(btnDezoomify);

	btnDezoomify.onclick = () => {
		var dezoomify_url = unsafeWindow.g_viewer.tileSources[unsafeWindow.g_viewer.currentPage()];
		dezoomify_url = "https://dezoomify.ophir.dev/#"+dezoomify_url;
		console.log("DZI: "+dezoomify_url);
		window.open(dezoomify_url, '_blank');
	};



    //setting button
    let btnSettings = makeButton('settings','Nastavení','fas fa-cog')
    toolbar.after(btnSettings);

    //setting
    let divSettings = document.createElement('div');
    divSettings.setAttribute('class','form-check');
    divSettings.setAttribute('style','background-color:white;');
    divSettings.style.display = "none";
    $('#seadragon-toolbar').append(divSettings);

  	 btnSettings.onclick = () => {
		 if(divSettings.style.display == "none"){
      divSettings.style.display = ""
     }else{
       divSettings.style.display = "none"
     }
	  };

       //kompaktni rezim
    let inpCompact = makeInput("compact", "Kompaktní režim", false)
    divSettings.append(inpCompact);
GM.getValue( "compact", false ).then(value => {
    inpCompact.firstChild.checked = value;
    compacted(value)
});

	  inpCompact.firstChild.onclick = () => {
          GM.getValue( "compact", false ).then(value => {
              if(value == true){
                  GM.setValue("compact", false);
                  inpCompact.firstChild.checked = false;
                  compacted(false)
                  console.log('Kompaktní režim =', false);
              }else{
                  GM.setValue("compact", true);
                  inpCompact.firstChild.checked = true;
                  compacted(true)
                  console.log('Kompaktní režim =', true);
              }
          });
	  };



    //minimap
     if (window.location.href.indexOf("scitacioperaty/digisada/detail") > -1) {
    let inpMinimap = makeInput("minimapa", "Minimapa", false, [unsafeWindow.g_viewer.navigator.element])
        divSettings.append(makeSettingSpacer());
    divSettings.append(inpMinimap);

 	  inpMinimap.firstChild.onclick = () => {
          GM.getValue( "minimapa", "false" ).then(value => {
              if(value == true){
                  GM.setValue("minimapa", false);
                  inpMinimap.firstChild.checked = false;
                  unsafeWindow.g_viewer.navigator.element.style.display = "none";
                  console.log('Minimapa =', false);
              }else{
                  GM.setValue("minimapa", true);
                  inpMinimap.firstChild.checked = true;
                  unsafeWindow.g_viewer.navigator.element.style.display = "";
                  console.log('Minimapa =', true);
              }
          });
	  };
     };

    //navigation
    let btnPlus10 = makeButtonText('plusTen', '+10 snímků', '+10');
    let btnMinus10 = makeButtonText('minusTen', '-10 snímků', '-10');
    let btnPlus25 = makeButtonText('plus25', '+25 snímků', '+25');
    let btnMinus25 = makeButtonText('minus25', '-25 snímků', '-25');

    $('#next-image').after(btnPlus25);
	  btnPlus25.onclick = () => {
		  unsafeWindow.g_viewer.goToPage(unsafeWindow.g_viewer.currentPage()+25)
	  };

    $('#prev-image').before(btnMinus25);
	  btnMinus25.onclick = () => {
		  unsafeWindow.g_viewer.goToPage(unsafeWindow.g_viewer.currentPage()-25)
	  };

    $('#next-image').after(btnPlus10);
	  btnPlus10.onclick = () => {
		  unsafeWindow.g_viewer.goToPage(unsafeWindow.g_viewer.currentPage()+10)
	  };

    $('#prev-image').before(btnMinus10);
	  btnMinus10.onclick = () => {
		  unsafeWindow.g_viewer.goToPage(unsafeWindow.g_viewer.currentPage()-10)
	  };



    let inpNav10 = makeInput("navigace10", "+/- 10", true, [btnPlus10, btnMinus10])

    divSettings.append(makeSettingSpacer());
    divSettings.append(inpNav10);


	  inpNav10.firstChild.onclick = () => {
          GM.getValue( "navigace10", true ).then(value => {
              if(value == true){
                  GM.setValue("navigace10", false);
                  inpNav10.firstChild.checked = false;
                  btnPlus10.style.display = "none";
                  btnMinus10.style.display = "none";
                  console.log('Rozšířená (10) navigace =', false);
              }else{
                  GM.setValue("navigace10", true);
                  inpNav10.firstChild.checked = true;
                  btnPlus10.style.display = "";
                  btnMinus10.style.display = "";
                  console.log('Rozšířená (10) navigace =', true);
              }
          });
	  };

    let inpNav25 = makeInput("navigace25", "+/- 25", false, [btnPlus25, btnMinus25])

    divSettings.append(makeSettingSpacer());
    divSettings.append(inpNav25);


	  inpNav25.firstChild.onclick = () => {
          GM.getValue( "navigace25", false ).then(value => {
              if(value == true){
                  GM.setValue("navigace25", false);
                  inpNav25.firstChild.checked = false;
                  btnPlus25.style.display = "none";
                  btnMinus25.style.display = "none";
                  console.log('Rozšířená (25) navigace =', false);
              }else{
                  GM.setValue("navigace25", true);
                  inpNav25.firstChild.checked = true;
                  btnPlus25.style.display = "";
                  btnMinus25.style.display = "";
                  console.log('Rozšířená (25) navigace =', true);
              }
          });
	  };






	// normalize
    $("#full-page").empty().append('<i class="fas fa-expand"></i>');
    $("#step-10-forward").hide();
    $("#step-10-backward").hide();
    $("#plus25").after($("#last-image"));
	if (window.location.href.indexOf("scitacioperaty/digisada/detail") > -1) {
          $('.nav-pills').prepend(`<li class="nav-item">
				        <a class="nav-link" href="https://www.mza.cz/scitacioperaty/digisada/search">
                                            <i class="fas fa-arrow-circle-left"></i> Zpět na vyhledávání
                                        </a>
			            </li>`);
            $("main .container-fluid .row").first().remove();
            $("#zoom-in").empty().append('<i class="fas fa-search-plus"></i>');
            $("#zoom-out").empty().append('<i class="fas fa-search-minus"></i>');
            $("#home").empty().append('<i class="fas fa-home"></i>');
            $("#full-page").empty().append('<i class="fas fa-arrows-alt"></i>');
            $("#prev-image").empty().append('<i class="fas fa-angle-double-left"></i>');
            $("#next-image").empty().append('<i class="fas fa-angle-double-right"></i>');
            $("#full-page").empty().append('<i class="fas fa-expand"></i>');
            let hamburger = makeHamburger();
            $("main .container-fluid .card .card-body").first().attr('id','scitaniHeader').addClass('collapse');
            $(".card-header").prepend(hamburger);

        	//preserve button
        let btnPreserve = makeButton('preserve', 'Zachovat zoom a polohu', checkPreserveIcon() );
        $("#dezoomify").after(btnPreserve);

        btnPreserve.onclick = () => {
            if (unsafeWindow.g_viewer.preserveViewport == false){
                unsafeWindow.g_viewer.preserveViewport = true
                btnPreserve.firstChild.setAttribute('class','fas fa-lock')
            }else{
                unsafeWindow.g_viewer.preserveViewport = false
                btnPreserve.firstChild.setAttribute('class','fas fa-unlock')
            }
            console.log('Preserve = '+unsafeWindow.g_viewer.preserveViewport)
        };


    }

//});


function makeButton(id, title, icon){
    let btn = document.createElement('a');
    btn.setAttribute('id', id);
	  btn.setAttribute('type','button');
	  btn.setAttribute('class','btn btn-light mr-1');
	  btn.setAttribute('title',title);
	  btn.setAttribute('style','display: inline-block; position: relative;');

    let icn = document.createElement('i');
	  icn.setAttribute('class',icon);

    btn.append(icn);
    return btn;
}

function makeButtonText(id, title, text, ){
    let btn = document.createElement('a');
    btn.setAttribute('id', id);
    btn.setAttribute('type','button');
    btn.setAttribute('class','btn btn-light mr-1');
    btn.setAttribute('title',title);
    btn.setAttribute('style','display: inline-block; position: relative; font-weight:bold;');

    btn.append(text);
    return btn;
}

function makeInput(id, title, def, array=false){
    let div = document.createElement('div');
    div.setAttribute('class','form-check')
    let inp = document.createElement('input');
    inp.setAttribute('class','form-check-input');
    inp.setAttribute('type','checkbox');
    inp.setAttribute('id',id);
    if(array){
    GM.getValue( id, def ).then(value => {
        inp.checked = value;
           for(var i = 0; i < array.length; i++){
               if(value == true){
                   array[i].style.display = "";
               }else{
                   array[i].style.display = "none"
               }
           }
    });
    };
    let lab = document.createElement('label');
    lab.setAttribute('class','form-check-label');
    lab.setAttribute('for',id);
    lab.append(title);

    div.append(inp)
    div.append(lab);
    return div

}


function checkPreserveIcon(){
	if (unsafeWindow.g_viewer.preserveViewport == false){
		return 'fas fa-unlock';
	}else{
		return 'fas fa-lock';
	};
}

function makeSettingSpacer(){
    let spc = document.createElement('div');
	spc.setAttribute('class','px-2');
    spc.append("|")
    return spc
}



function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function compacted(bool){
    if(bool){//TRUE
       layoutCompact()
    }else{//FALSE
       layoutNormal()
    };
};

function layoutCompact(){
        if(window.location.href.indexOf("actapublica/matrika/detail") > -1){
                  $('body .bg-light .container-md .row .col a img').attr('style','height: 40px')
                  $('body .bg-light .container-md .row .col:nth-child(2) div:nth-child(2)').hide()
                  addGlobalStyle(`.card-body { padding: 4px !important; };`);
                  $('nav').removeClass('py-2 px-3').addClass('py-0 px-2');
                  $('footer .container-md .mt-2').hide();
                  $('footer').removeClass('py-3').addClass('py-2')
                  addGlobalStyle(`.card-header { padding: 4px 16px  4px 16px !important; };`);
                  addGlobalStyle(`td { padding: 6px 12px  6px 12px !important; };`);
                  $('.input-group-prepend').hide()

        }else if(window.location.href.indexOf("scitacioperaty/digisada/detail") > -1){
                  $('body .container-md a img').attr('style','height: 40px')
                  addGlobalStyle('.card-body { padding: 4px ! important; };');
                  $('nav').removeClass('py-2 px-3').addClass('py-0 px-2');
                 $('footer').removeClass('py-3').addClass('py-2')
                $('.input-group-prepend').hide()

        };
}


function layoutNormal(){
        if(window.location.href.indexOf("actapublica/matrika/detail") > -1){
                  $('body .bg-light .container-md .row .col a img').attr('style','height: 80px')
                  $('body .bg-light .container-md .row .col:nth-child(2) div:nth-child(2)').show()
                  addGlobalStyle(`.card-body { padding: 20px !important; };`);
                  $('nav').removeClass('py-0 px-2').addClass('py-2 px-3');
                  $('footer .container-md .mt-2').show();
                  $('footer').removeClass('py-2').addClass('py-3')
                  addGlobalStyle(`.card-header { padding: 12px 20px  12px 20px !important; };`);
                  addGlobalStyle(`td { padding: 12px 12px  12px 12px !important; };`);
                 $('.input-group-prepend').show()

        }else if(window.location.href.indexOf("scitacioperaty/digisada/detail") > -1){
                 $('body .container-md a img').attr('style','height: 50px')
                 addGlobalStyle('.card-body { padding: 20px ! important; };');
                 $('nav').removeClass('py-0 px-2').addClass('py-2 px-3');
                 $('footer').removeClass('py-2').addClass('py-3')
                $('.input-group-prepend').show()


        };
}

function makeHamburger(){
    let btn = document.createElement('button');
    btn.setAttribute('class', 'btn btn-primary collapsed');
    btn.setAttribute('type','button');
    btn.setAttribute('data-toggle','collapse');
    btn.setAttribute('data-target','#scitaniHeader');
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-controls','scitaniHeader');
    btn.setAttribute('title','Zobrazit základní informace o digitalizační sadě');

    let icn = document.createElement('i');
	  icn.setAttribute('class','fas fa-bars');

    btn.append(icn);
    return btn;

}

