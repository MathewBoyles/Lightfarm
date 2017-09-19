// Source: script.js
var config = {
  client_id: "8hRTUTjbwsJrLqGZ0kgxT48GBmkwwM5g"
};

// Source: homepage.js
// Get Lightfarm Studio Data
if ($("body").attr("id") == "homepage") {
  $.ajax({
    url: "http://www.behance.net/v2/projects",
    data: {
      client_id: config.client_id
    },
    dataType: "jsonp",
    success: function(data) {
      var categories = [];
      var categoriesCount = {};

      for (var i = 0; i < data.projects.length; i++) {
        for (var i_i = 0; i_i < data.projects[i].fields.length; i_i++) {
          var c_name = data.projects[i].fields[i_i];
          if (categories.indexOf(c_name) == -1) categories.push(c_name);
          categoriesCount[c_name] = categoriesCount[c_name] ? (Number(categoriesCount[c_name]) + 1) : 1;
        }
        var tagLine = "";
        for (var i_tag = 0; i_tag < data.projects[i].fields.length; i_tag++) {
          tagLine += " tag-" + (data.projects[i].fields[i_tag].replace(/ /g, "").replace(/[^\w\s]/gi, "").toLowerCase());
        }
        $("#mixitup-container .row").append("<div class='portfolio-item col-md-3" + tagLine + "' data-id='" + data.projects[i].id + "'> " +
          "<img class='portfolio-image' src='" + data.projects[i].covers[404] + "' alt='" + data.projects[i].name.replace(/'/g, "") + "'>" +
          "</div>");
      }
      $("#mixitup-container .row .portfolio-item").click(function() {
        console.log($(this));

      });

      var categoriesSorted = Object.keys(categoriesCount).sort(function(a, b) {
        return categoriesCount[a] - categoriesCount[b];
      });
      categoriesSorted.reverse();

      for (var j = 0; j < categoriesSorted.length; j++) {
        var isHidden = j > 3;
        $("#mixitup-container .filters").append("<button class='btn" + (isHidden ? " hide" : "") + "' type='button' data-filter='.tag-" + categoriesSorted[j].replace(/ /g, "").replace(/[^\w\s]/gi, "").toLowerCase() + "'>" + categoriesSorted[j] + "</button>");

        if (j == (categoriesSorted.length - 1) && categoriesSorted.length > 4) {
          $("#mixitup-container .filters").append("<button class='btn showmore' type='button'>Show more...</button>");
          $("#mixitup-container .filters").append("<a id='mixitup-showless'>Show less</a>");
        }
      }

      $("#mixitup-container .filters .btn.showmore").click(function() {
        $(this).hide();
        $("#mixitup-container .filters .btn.hide").show();
        $("#mixitup-showless").css("display", "block");
        return false;
      });

      $("#mixitup-showless").click(function() {
        $(this).hide();
        $("#mixitup-container .filters .btn.hide:not(.mixitup-control-active)").hide();
        $("#mixitup-container .filters .btn.showmore").show();
      });

      var mixer = mixitup($("#mixitup-container"), {
        selectors: {
          target: ".portfolio-item"
        },
        animation: {
          duration: 300
        }
      });
    },
    error: function() {
      console.log("something went wrong.");
    }
  });
}

// Source: popup.js
$.fn.popup = function(fun, options) {
  var defaults = {
    backdrop: true,
    click: true,
    keyboard: true
  };
  var settings = $.extend({}, defaults, options);

  if (fun == "toggle") {
    this.popup((this.is(":visible") ? "hide" : "show"), options);
    return this;
  }

  this.data({
    "popupSettings": settings
  });

  this.find(".popup-backdrop")
    .filter(function() {
      return !$(this).data("popupInit");
    })
    .data({
      "popupInit": 1
    })
    .click(function() {
      if ($(this).parent().data("popupSettings").click) $(this).parent().popup("hide");
    });

  if (fun == "hide") {
    $("body").css("overflow", "auto");
    this.find(".popup-container")
      .animate({
        "top": 0 - (this.find(".popup-container").height() * 1.5)
      });
    this.find(".popup-backdrop")
      .fadeOut(500, function() {
        $(this).parent().hide();
      });
  } else if (fun == "show" || !fun) {
    $("body").css("overflow", "hidden");
    this.find(".popup-backdrop,.popup-container").hide();
    this.show();
    this.find(".popup-container")
      .css({
        "top": 0 - (this.find(".popup-container").height() * 1.5)
      })
      .show()
      .animate({
        "top": "50%"
      });
    if (this.data("popupSettings").backdrop) this.find(".popup-backdrop").fadeIn(500);
    else this.find(".popup-backdrop").css({
      "opacity": 0
    }).show();
  }

  return this;
};

$(document).keyup(function(e) {
  if (e.keyCode == 27 && $(".popup:visible").length) {
    $(".popup:visible").filter(function() {
      return $(this).data("popupSettings").keyboard;
    }).popup("hide");
  }
});

// Source: team.js
if ($("body").attr("id") == "about") {
  $.getJSON("/js/team.json", function(team) {
    var template = $("#teamRows").html();
    var compiledTemplate = Template7.compile(template);

    var teamItems = [];
    for (var i = 0; i < team.length; i++) {
      var teamItem = team[i];
      teamItem.lineBr = ((i+1) % 4) == 0;
      teamItems.push(teamItem);
    }

    var context = {
        team: teamItems
    };
    var html = compiledTemplate(context);
    $("#teamRows").after(html);
    console.log(context);
  });
}
