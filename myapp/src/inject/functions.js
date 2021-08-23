console.log("functins.js loaded");

// if (omid == true) {
//   console.log("omid is true now");
//   $("#omid").click(function () {
//     console.log("hello");
//   });
// }

var runomid = function () {
  console.log("runomid is running");
  $(".kf-sidebar").draggable();
  // Toggle wells on sidebar
  $(".kf-presets-header").click(function () {
    $(this).next(".kf-preset-well").slideToggle(500);
    $(this).toggleClass("kf-well-active");
  });
  $(".kf-presets-header2").click(function () {
    $(this).next(".kf-preset-well").slideToggle(500);
    $(this).toggleClass("kf-well-active");
    $(this).nextAll(".slider-range").slideToggle(500);
  });
  //dashboard start
  const filters = [
    "nosafkharid",
    "nosafforush",
    "hmashkuk",
    "pcrange",
    "plrange",
    "btosratio",
    "skh",
    "sf",
    "codebecode",
    "minprice",
    "posrange",
    "intellmoney",
  ];
  const values = [
    "pcmin",
    "pcmax",
    "plmin",
    "plmax",
    "btosratiov",
    "skhmin",
    "skhmax",
    "sfmin",
    "sfmax",
    "codebecoderatio",
    "minpriceday",
    "hajmmmin",
    "hajmmmax",
    "nesbatkhbfmin",
    "nesbatkhbfmax",
  ];
  //functions

  function savef(f) {
    if (document.getElementById(f)) {
      var checkbox = document.getElementById(f);
      localStorage.setItem(f, checkbox.checked);
    }
  }
  function savev(v) {
    var input = document.getElementById(v);
    localStorage.setItem(v, input.value);
  }
  function loadingf(f) {
    if (localStorage.getItem(f) && document.getElementById(f)) {
      var checked = JSON.parse(localStorage.getItem(f));
      document.getElementById(f).checked = checked;
    }
  }
  function loadingv(v) {
    if (localStorage.getItem(v)) {
      var value = JSON.parse(localStorage.getItem(v));
      document.getElementById(v).value = value;
    }
  }
  function create01f(f) {
    if (document.getElementById(f)) {
      window[f] = 0;
      if (document.getElementById(f).checked) window[f] = 1;
    }
  }
  function create01v(v) {
    window[v] = document.getElementById(v).value;
  }

  //for loading
  filters.forEach(loadingf);
  values.forEach(loadingv);
  //action Button
  document.getElementById("action").addEventListener("click", function () {
    filters.forEach(create01f);
    values.forEach(create01v);

    filters.forEach(savef);
    values.forEach(savev);

    condition = "";
    functions = "";
    condition += nosafkharid
      ? "(po1)<= (tmax) && (po1)>= (tmax)-1 && (pd1)<(tmax)"
      : "true";
    condition += nosafforush
      ? "&&(tvol)>(bvol) && (pmin)== (tmin) && ((pl)-(pc))/(pl)*100>1.5 && (ct).Sell_CountI >= (ct).Buy_CountI && (tno)>5 && (tno)>20"
      : "&&true";
    condition += hmashkuk
      ? "&&(tvol)>5*(([ih][0].QTotTran5J+[ih][1].QTotTran5J+[ih][2].QTotTran5J+[ih][3].QTotTran5J+[ih][4].QTotTran5J+[ih][5].QTotTran5J+[ih][6].QTotTran5J+[ih][7].QTotTran5J+[ih][8].QTotTran5J+[ih][9].QTotTran5J+[ih][10].QTotTran5J+[ih][11].QTotTran5J+[ih][12].QTotTran5J+[ih][13].QTotTran5J+[ih][14].QTotTran5J+[ih][15].QTotTran5J+[ih][16].QTotTran5J+[ih][17].QTotTran5J+[ih][18].QTotTran5J+[ih][19].QTotTran5J+[ih][20].QTotTran5J+[ih][21].QTotTran5J+[ih][22].QTotTran5J+[ih][23].QTotTran5J+[ih][24].QTotTran5J+[ih][25].QTotTran5J+[ih][26].QTotTran5J+[ih][27].QTotTran5J+[ih][28].QTotTran5J+[ih][29].QTotTran5J)/30)&&(bvol)!=1&&(tno)>=1"
      : "&&true";
    condition += pcrange
      ? "&&(pcp)>" + pcmin + "&&(pcp)<" + pcmax + ""
      : "&&true";
    condition += plrange
      ? "&&(plp)>" + plmin + "&&(plp)<" + plmax + ""
      : "&&true";
    condition += btosratio
      ? "&&((ct).Buy_I_Volume/(ct).Buy_CountI)>" +
        btosratiov +
        "*((ct).Sell_I_Volume/(ct).Sell_CountI)"
      : "&&true";

    functions += skh
      ? "var s_kh= Math.round(((((ct).Buy_I_Volume*(pc))/(ct).Buy_CountI))/10000000);"
      : "";
    condition += skh ? "&&s_kh>" + skhmin + "&&s_kh<" + skhmax + "" : "&&true";

    functions += sf
      ? "var s_f =Math.round((((ct).Sell_I_Volume*(pc))/(ct).Sell_CountI)/10000000);"
      : "";
    condition += sf ? "&&s_f>" + sfmin + "&&s_f<" + sfmax + "" : "&&true";

    condition += codebecode
      ? "&&(ct).Sell_N_Volume / (tvol) > " + codebecoderatio + ""
      : "&&true";

    functions += minprice
      ? "var MinPrice=function(){var min=[ih][0].PriceMin;var ipos;for(ipos=0;ipos<" +
        minpriceday +
        ";ipos++)if(min>[ih][ipos].PriceMin)min=[ih][ipos].PriceMin;return min;};"
      : "";
    condition += minprice ? "&&(pl)<MinPrice()" : "&&true";

    condition += posrange
      ? "&&(pl)>1.01*(pf) && (tno)>10 && (pf)>1.01*(py) && (pl)!=(tmax)"
      : "&&true";

    functions += intellmoney
      ? "a=Math.round((((pc)*(ct).Buy_I_Volume)/(ct).Buy_CountI)/1000000);b=Math.round((((pc)*(ct).Sell_I_Volume)/(ct).Sell_CountI)/1000000);c=Math.round((a)/(b)*100)/100;d=(ct).Buy_CountI;e=Math.round((tvol)/(([ih][0].QTotTran5J+[ih][1].QTotTran5J+[ih][2].QTotTran5J+[ih][3].QTotTran5J+[ih][4].QTotTran5J+[ih][5].QTotTran5J+[ih][6].QTotTran5J+[ih][7].QTotTran5J+[ih][8].QTotTran5J+[ih][9].QTotTran5J+[ih][10].QTotTran5J+[ih][11].QTotTran5J+[ih][12].QTotTran5J+[ih][13].QTotTran5J)/14)*100)/100;f=Math.round(((pl)-Math.min((pl),[ih][0].PriceMin,[ih][1].PriceMin,[ih][2].PriceMin,[ih][3].PriceMin,[ih][4].PriceMin,[ih][5].PriceMin,[ih][6].PriceMin,[ih][7].PriceMin,[ih][8].PriceMin,[ih][9].PriceMin,[ih][10].PriceMin,[ih][11].PriceMin,[ih][12].PriceMin,[ih][13].PriceMin,[ih][14].PriceMin,[ih][15].PriceMin,[ih][16].PriceMin,[ih][17].PriceMin,[ih][18].PriceMin,[ih][19].PriceMin,[ih][20].PriceMin,[ih][21].PriceMin,[ih][22].PriceMin,[ih][23].PriceMin,[ih][24].PriceMin,[ih][25].PriceMin,[ih][26].PriceMin,[ih][27].PriceMin,[ih][28].PriceMin,[ih][29].PriceMin,[ih][30].PriceMin,[ih][31].PriceMin,[ih][32].PriceMin,[ih][33].PriceMin,[ih][34].PriceMin,[ih][35].PriceMin,[ih][36].PriceMin,[ih][37].PriceMin,[ih][38].PriceMin,[ih][39].PriceMin,[ih][40].PriceMin,[ih][41].PriceMin,[ih][42].PriceMin,[ih][43].PriceMin,[ih][44].PriceMin,[ih][45].PriceMin,[ih][46].PriceMin,[ih][47].PriceMin,[ih][48].PriceMin,[ih][49].PriceMin,[ih][50].PriceMin,[ih][51].PriceMin,[ih][52].PriceMin,[ih][53].PriceMin,[ih][54].PriceMin,[ih][55].PriceMin,[ih][56].PriceMin,[ih][57].PriceMin,[ih][58].PriceMin,[ih][59].PriceMin))/(Math.max([ih][0].PriceMax,[ih][1].PriceMax,[ih][2].PriceMax,[ih][3].PriceMax,[ih][4].PriceMax,[ih][5].PriceMax,[ih][6].PriceMax,[ih][7].PriceMax,[ih][8].PriceMax,[ih][9].PriceMax,[ih][10].PriceMax,[ih][11].PriceMax,[ih][12].PriceMax,[ih][13].PriceMax,[ih][14].PriceMax,[ih][15].PriceMax,[ih][16].PriceMax,[ih][17].PriceMax,[ih][18].PriceMax,[ih][19].PriceMax,[ih][20].PriceMax,[ih][21].PriceMax,[ih][22].PriceMax,[ih][23].PriceMax,[ih][24].PriceMax,[ih][25].PriceMax,[ih][26].PriceMax,[ih][27].PriceMax,[ih][28].PriceMax,[ih][29].PriceMax,[ih][33].PriceMax,[ih][34].PriceMax,[ih][30].PriceMax,[ih][31].PriceMax,[ih][32].PriceMax,[ih][35].PriceMax,[ih][36].PriceMax,[ih][37].PriceMax,[ih][38].PriceMax,[ih][39].PriceMax,[ih][40].PriceMax,[ih][41].PriceMax,[ih][42].PriceMax,[ih][43].PriceMax,[ih][44].PriceMax,[ih][45].PriceMax,[ih][46].PriceMax,[ih][47].PriceMax,[ih][48].PriceMax,[ih][49].PriceMax,[ih][50].PriceMax,[ih][51].PriceMax,[ih][52].PriceMax,[ih][53].PriceMax,[ih][54].PriceMax,[ih][55].PriceMax,[ih][56].PriceMax,[ih][57].PriceMax,[ih][58].PriceMax,[ih][59].PriceMax,(pl))-Math.min((pl),[ih][0].PriceMin,[ih][1].PriceMin,[ih][2].PriceMin,[ih][3].PriceMin,[ih][4].PriceMin,[ih][5].PriceMin,[ih][6].PriceMin,[ih][7].PriceMin,[ih][8].PriceMin,[ih][9].PriceMin,[ih][10].PriceMin,[ih][11].PriceMin,[ih][12].PriceMin,[ih][13].PriceMin,[ih][14].PriceMin,[ih][15].PriceMin,[ih][16].PriceMin,[ih][17].PriceMin,[ih][18].PriceMin,[ih][19].PriceMin,[ih][20].PriceMin,[ih][21].PriceMin,[ih][22].PriceMin,[ih][23].PriceMin,[ih][24].PriceMin,[ih][25].PriceMin,[ih][26].PriceMin,[ih][27].PriceMin,[ih][28].PriceMin,[ih][29].PriceMin,[ih][30].PriceMin,[ih][31].PriceMin,[ih][32].PriceMin,[ih][33].PriceMin,[ih][34].PriceMin,[ih][35].PriceMin,[ih][36].PriceMin,[ih][37].PriceMin,[ih][38].PriceMin,[ih][39].PriceMin,[ih][40].PriceMin,[ih][41].PriceMin,[ih][42].PriceMin,[ih][43].PriceMin,[ih][44].PriceMin,[ih][45].PriceMin,[ih][46].PriceMin,[ih][47].PriceMin,[ih][48].PriceMin,[ih][49].PriceMin,[ih][50].PriceMin,[ih][51].PriceMin,[ih][52].PriceMin,[ih][53].PriceMin,[ih][54].PriceMin,[ih][55].PriceMin,[ih][56].PriceMin,[ih][57].PriceMin,[ih][58].PriceMin,[ih][59].PriceMin))*100);g=Math.round((((ct).Buy_I_Volume/(ct).Buy_CountI)/([is50]/[is58]))*100)/100;i=Math.round(((pc)/(([ih][0].PClosing*[ih][0].QTotTran5J+[ih][1].PClosing*[ih][1].QTotTran5J+[ih][2].PClosing*[ih][2].QTotTran5J+[ih][3].PClosing*[ih][3].QTotTran5J+[ih][4].PClosing*[ih][4].QTotTran5J+[ih][5].PClosing*[ih][5].QTotTran5J+[ih][6].PClosing*[ih][6].QTotTran5J+[ih][7].PClosing*[ih][7].QTotTran5J+[ih][8].PClosing*[ih][8].QTotTran5J+[ih][9].PClosing*[ih][9].QTotTran5J)/([ih][0].QTotTran5J+[ih][1].QTotTran5J+[ih][2].QTotTran5J+[ih][3].QTotTran5J+[ih][4].QTotTran5J+[ih][5].QTotTran5J+[ih][6].QTotTran5J+[ih][7].QTotTran5J+[ih][8].QTotTran5J+[ih][9].QTotTran5J)))*100)/100;j=(ct).Buy_I_Volume/(tvol);k=(ct).Sell_N_Volume/(tvol);l=((ct).Buy_I_Volume-(ct).Sell_I_Volume)*(pc);"
      : "";
    condition += intellmoney
      ? "&& c>" +
        nesbatkhbfmin +
        " && c<" +
        nesbatkhbfmax +
        " && e>" +
        hajmmmin +
        " && e<" +
        hajmmmax +
        "&& g>2 && a>100 && d>50"
      : "&&true";

    var filter =
      "true==function(){" +
      functions +
      "if(" +
      condition +
      "){return true;}else{return false;}}()";

    var code =
      "mw.FilterCode = mw.PrepareFilterCode('" +
      filter +
      "');mw.RemoveAllData();mw.RenderData()";

    var el = document.createElement("script");
    el.setAttribute("type", "text/javascript");
    el.id = "chortkeScript";
    el.textContent = code;
    const preel = document.getElementById("chortkeScript");
    if (preel) {
      document.head.removeChild(preel);
    }
    document.head.append(el);
  });

  var inputs, index;

  inputs = document.getElementsByTagName("input");
  for (index = 0; index < inputs.length; ++index) {
    // deal with inputs[index] element.
    inputs[index].value = parseFloat(Number(inputs[index].value).toFixed(2));
  }
  //Dashboard end
  //slider
  $(".slider-range").each(function (e) {
    var slider = $(this);

    var imin = "";
    var imax = "";

    switch (slider[0].id) {
      case "pcslider":
        imin = "#pcmin";
        imax = "#pcmax";
        break;
      case "plslider":
        imin = "#plmin";
        imax = "#plmax";
        break;
      case "skhslider":
        imin = "#skhmin";
        imax = "#skhmax";
        break;
      case "sfslider":
        imin = "#sfmin";
        imax = "#sfmax";
        break;
    }

    function assignv() {
      return [$(imin).val(), $(imax).val()];
    }

    function assignmin() {
      switch (slider[0].id) {
        case "pcslider":
          return -5;
        case "plslider":
          return -5;
        case "skhslider":
          return 30;
        case "sfslider":
          return 30;
      }
    }
    function assignmax() {
      switch (slider[0].id) {
        case "pcslider":
          return 5;
        case "plslider":
          return 5;
        case "skhslider":
          return 1.5 * $(imax).val();
        case "sfslider":
          return 1.5 * $(imax).val();
      }
    }
    //assign inputs value to sliders
    function inputtos() {
      $(imin).change(function () {
        slider.slider("values", 0, $(this).val());
      });

      $(imax).change(function () {
        switch (slider[0].id) {
          case "pcslider":
            slider.slider("values", 1, $(this).val());
            break;
          case "plslider":
            slider.slider("values", 1, $(this).val());
            break;
          case "skhslider":
            slider.slider("option", "max", 1.5 * $(this).val());
            slider.slider("values", 1, $(this).val());
            break;
          case "sfslider":
            slider.slider("option", "max", 1.5 * $(this).val());
            slider.slider("values", 1, $(this).val());
            break;
        }
      });
    }
    inputtos();
    slider.slider({
      range: true,
      values: assignv(),
      min: assignmin(),
      step: 0.1,
      minRange: 0.1,
      max: assignmax(),
      create(event, ui) {
        //apply value to our inputs
        function createv() {
          $(imin).val(slider.slider("values", 0));
          $(imax).val(slider.slider("values", 1));
        }
        createv();
      },
      start(event, ui) {},
      change(event, ui) {},
      slide(event, ui) {
        //apply value to our inputs
        function slidev() {
          $(imin).val(ui.values[0]);
          $(imax).val(ui.values[1]);
        }
        slidev();
      },
    });
  });
  //Slider end
  $("#hideShowToggle").click(function () {
    $(".kf-sidebar").toggleClass("kf-deactive");
  });
  //
  logo = chrome.extension.getURL("src/inject/ui/img/chortkee.png");
  $("#hideShowToggleLogo").attr("src", logo);
};

var waitForTarget = function () {
  if (omid) {
    console.log("omidhiooo");
    runomid();
  } else {
    setTimeout(function () {
      waitForTarget();
    }, 100);
  }
};

waitForTarget();
