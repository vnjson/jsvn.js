/* jsVN
 * requirements: jQuery
 * jsVN is a simple javascript visual novel engine for browsers
 * by standard-relic.tumbr.com
 * info: standard-relic.tumblr.com/jsvnlatest
 * free to use and modify, do not remove the above credit
*/

var jsvn = new Object();

jsvn.memory = {
        complete: 0,
        storyObj: myVisualNovel,
        script: myVisualNovel.script,
        height: 500,
        frame: 0,
        prev: 0,
        next: 2,
        bgindex: 1,
        timed: 0,
        setTimer: 0,
        choices: {
          //choices are stored here
        },
        mode: {
          pos: {},
          dir: {},
          vis: {}
        }
      };

jsvn.isEmpty = function (el) {
        return !$.trim(el.html());
    }
jsvn.devDisplay = function(data) {
  $("#screen .jsvn-error").html(data).show();
}

jsvn.preload = function(data) {
      //put things in container
      $("#screen").append('<div class="set"><div class="bg"></div></div><div class="portraits"><div class="portrait left"></div><div class="portrait right"></div></div><div class="text"><div class="speaker">Speaker</div><div class="line"></div></div><div class="startmenu menu"></div><div class="nav-button prev">prev</div><div class="nav-button next">next</div><div class="jsvn-error"></div>');
      $(".bg, .startmenu, .text .speaker, .nav-button, .jsvn-error").hide();
  
      if(jsvn.memory.storyObj.style === "invert") $("#screen").addClass("jsvn-theme-invert"); //for inverted UI
  
      //preload images below...
      var load = function(img) {
          $loadImage = new Image()
          $loadImage.src = img;
      };
      $.each(jsvn.memory.storyObj.backgrounds, function(i, item) {
        if(jsvn.imgParse(item)) {
          load(item);
        };
      });
      $.each(jsvn.memory.storyObj.characters, function(i, character) {
        $.each(character, function(i, expression) {
          if(jsvn.imgParse(expression)) {
            load(expression);
          }
        });
      });
    };

jsvn.imgParse = function(data) {
      var imgRegex = /\.(gif|jpg|jpeg|tiff|png)$/i;
      if(imgRegex.test(data)) {
        return true;
      };
    };

jsvn.textParse = function(data, type) {
      var parsedText = data;
      var getThis;
      var textUpdate = function(input, output) {
        return parsedText.replace(input,output);
      };

      //regex for finding words within ::word::
      var textRegex = /(?:^|\W)::(\w+)::(?!\w)/g, match;

      while(match = textRegex.exec(data)) {
        //Fetch: get a value from memory
        if(match[1].substring(0, 5) === ("Fetch")){
          getThis = match[1];
          getThis = getThis.replace("Fetch","");
          getThis = jsvn.fetch(getThis);
          type !== "line" ? parsedText = textUpdate(match[0], getThis) : parsedText = textUpdate(match[0], " "+getThis);;
        };
      };
      return parsedText;
    };

jsvn.save = function(data, type) {
      var saveChoice = function() {
        if(data === "erase") {
          jsvn.memory.choices = {}
        } else {
          var splitData = data.split(" ");
          if(splitData[1] === "erase") {
            jsvn.memory.choices[splitData[0]] = "";
          } else {
            jsvn.memory.choices[splitData[0]] = splitData[1];
          };
        };
      };
      saveChoice();
    };

    //fetches choices from memory.choices
jsvn.fetch = function(data) {
        if(jsvn.memory.choices[data]) {
          return jsvn.memory.choices[data];
        };
    };

jsvn.display = function(currentFrame, scriptObj) {

       var frame = scriptObj[currentFrame]; 
       var character = frame.c;
       var characterObj = jsvn.memory.storyObj.characters[character];
       var timed = false;
  
       //parse out text for fetch items
       if(frame.c) frame.c = jsvn.textParse(frame.c);
       if(frame.line) var lineParsed = jsvn.textParse(frame.line, "line");
       if(frame.bg) frame.bg = jsvn.textParse(frame.bg);

       jsvn.display.mode = function(modes) {
         var save = function(type, mode) {      
           jsvn.memory.mode[type][character] = mode;
         };
         modes = modes.split(" ");
         $.each(modes, function(i, m) {
           switch(m) {
             case "left": save("pos", "left");
             break
             case "right": save("pos", "right");
             break
             case "clear": save("vis", "clear");
             break
             case "flip": save("dir", "flip");
             break
             case "unflip": save("dir", "default");
             break
             case "fadeout": save("vis", "out");
             break
             case "fadein": save("vis", "in");
           };
         });
       };

       jsvn.display.background = function(bg) {
          var bgimage = function(file) { 
            if(jsvn.memory.prev === 0) $(".set .bg").html(""); // if start, clear existing bg images (useful for second play through)
            $(".set .bg").append($('<img src="' + file +'" class="' + frame.bg +'" style="z-index: ' +  jsvn.memory.bgindex + '" />')).fadeIn(); 
          }
          var bgcolor = function(color){ 
            if($(".set .bg")) {
              $(".set .bg").fadeOut(300, function(){$(".set .bg img").remove()});
            }
            $("#screen .set").css({"background": color }); 
          }
          var bgValue = jsvn.memory.storyObj.backgrounds[bg];
         
          if(!bgValue) jsvn.devDisplay("Error: Background not found. Please check if background name was spelled and capitalized correctly.");
          
          if(jsvn.imgParse(bgValue)) {
            //bgindex is used for the css z-layer, it is useful for layering backgrounds on top of eachother in the order they are called
            jsvn.memory.bgindex = jsvn.memory.bgindex++;
            bgimage(bgValue);
          } else if(bgValue.substring(0,1) === "#") {
            bgcolor(bgValue);
          }
       };

       jsvn.display.clearStage = function(elem) {
           $(elem + " .sprite").fadeOut("slow", function(){$(elem + " .sprite *").remove()});
       }

       jsvn.display.portrait = function(pos, dir) {
         var dir = jsvn.memory.mode.dir[character];
         var pos = jsvn.memory.mode.pos[character];
         var posObj = ".portraits ." + pos;
           
         this.base = function() {
           $(posObj).append($('<div class="sprite"><img src="'+ characterObj["base"] +'" alt="" class="base ' + dir + '" /></div>').fadeIn());
         }; 
         this.emote = function() {
           $(posObj + " .sprite .emote").fadeOut("fast", function(){$(this).remove()});
           $(posObj + " .sprite").append('<div class="emote"><img src="'+ characterObj[frame.e] +'" alt="" class="' + dir +'" /></div>').fadeIn("100");
           if(jsvn.memory.mode.dir[character] === "flip") {//flip if flip is set
             $(posObj + " .sprite img").addClass("flip");
           } else if(jsvn.memory.mode.dir[character] === "default" && $(posObj + " .sprite img").hasClass("flip")) {
             $(posObj + " .sprite img").removeClass("flip");
           }
         };
         this.vis = function(elem, vis) {
           if("base" in characterObj && jsvn.isEmpty($(posObj + " .sprite"))) this.base();
           this.emote();   
         }

         if(jsvn.memory.mode.vis[character] === "clear") {
           this.clearStage(".portraits .portrait");
           jsvn.memory.mode.vis[character] = "default";
         } else if(jsvn.memory.mode.vis[character] === "out") {
           this.clearStage(posObj);
         } else if(frame.e) {
           this.vis(posObj + " .sprite", jsvn.memory.mode.vis[character]);
         }
       };

       jsvn.display.speaker = function(name) {
         name ? $(".text .speaker").html(name).show() : $(".text .speaker").hide();
       };
        
       jsvn.display.text = function(line) {
         if(line) {
           $(".text .line").html(line);
           $(".text").show();
         } else if($(".text").is(":visible")) { $(".text").hide(); }
         if(frame.anitext) jsvn.anim(".text", frame.anitext); //animate if animation is defined
       };

      jsvn.display.render = function(currentFrame, scriptObj) {
        if(jsvn.memory.frame === 0) $(".nav-button").hide();
        if(jsvn.memory.frame === 1) {
          $(".nav-button").show();
          $(".startmenu").fadeOut(600, function(){$(".startmenu").hide()});
          jsvn.memory.choices = {"saved":"default"} //clear choice memory
        };
        if(frame.jumpto) jsvn.jump(frame.jumpto); 
        if(frame.bg) jsvn.display.background(frame.bg);
        if(frame.anibg) jsvn.anim(".set .bg img:last-child", frame.anibg); //animate if animation is defined

        if(frame.prompt) jsvn.prompt.loadMenu(frame.prompt);
        jsvn.display.portrait();
        jsvn.display.text(lineParsed); 
        jsvn.display.speaker(character);
        if(frame.time) {
          jsvn.memory.timed = 1;
          jsvn.autoSkip(frame.time);
        }
      }

      if(frame.mode) jsvn.display.mode(frame.mode);
      jsvn.display.render(frame, this.scriptObj);

    };

jsvn.anim = function(selector, type) {
      jsvn.anim.blink = function(selector) {
        (function() {
          setInterval(
            function () {
              $(selector).fadeOut(500);
              $(selector).fadeIn(500)}, 500);
        })();
      };

      jsvn.anim.float = function(selector) {
        (function() {
          setInterval(
            function () {
          $(selector).animate({"top":"+=5px"}, "slow")
                     .animate({"top":"-=5px"}, "slow")}, 500);
        })();
      };

      jsvn.anim.shake = function(selector) {
         $(selector).animate({"left":"+=8px"}, 50)
                    .animate({"left":"-=8px"}, 50)
                    .animate({"left":"+=8px"}, 50)
                    .animate({"left":"-=8px"}, 50);
      };

      jsvn.anim.bump = function(selector) {
         $(selector).animate({"bottom":"+=8px"}, 50)
                    .animate({"bottom":"-=8px"}, 50)
                    .animate({"bottom":"+=8px"}, 50)
                    .animate({"bottom":"-=8px"}, 50);
      };

      jsvn.anim[type](selector);
    };

jsvn.Menu = function Menu() {
        this.data = "";
        this.container = ".prompt",
        this.loadMenu = function(container) {
          $(container).html('<ul class="list"></ul>');
          $.each(this.data.menu, function(i, item) {
            $(".list").append('<li class="item button-' + item.action +'"><span>' + item.button + '</span></li>');
            });
          $(container).fadeIn();
        }
        this.blink = function(selector) {
          jsvn.anim(selector, "blink");
        }
    };

jsvn.start = new jsvn.Menu();
        jsvn.start.data = jsvn.memory.storyObj.start;
        jsvn.start.container = ".startmenu";
        jsvn.start.hide = function() {
          $(jsvn.start.container).hide();
        }
        jsvn.start.show = function() {
          $(jsvn.start.container).show();
        }
        jsvn.start.loadMenu = function(container) {
          $(container).html('<ul class="list"></ul>');
          $.each(this.data.menu, function(i, item) {
            $(".list").append('<li class="item button-' + item.action +'"><span>' + item.button + '</span></li>');
            });
            jsvn.start.blink(".button-start span");
            if($(".button-credits")) $(".button-credits").on("click", jsvn.credits.loadStage);
            if($(".button-start")) {
              $('.button-start').on("click", function() {
                jsvn.router(1);
                $(".startmenu").fadeOut();
              });
            };
          $(container).fadeIn();
        };


jsvn.prompt = new jsvn.Menu();
        jsvn.prompt.loadMenu = function(data) {
          $("#screen").append('<div class="prompt"><div class="menu"><ul class="list"></ul></div></div>');
          $.each(data, function(i, item) {
            $(".list").append('<li class="item option-' + i +'"><span>' + item.option + '</span></li>');
            $(".option-" + i).click( function(e){
              $(".prompt").remove();
              if(item.mem) jsvn.save(item.mem, "choice");
              if(item.jumpto) {
                jsvn.jump(item.jumpto);
              } else {
                jsvn.router(jsvn.memory.frame + 1);
              };
            });
          });
        };


jsvn.Stage = function Stage() {
      this.content = "";
      this.title = "New Stage";
      this.removeStage = function removeStage(selector) {
          $(selector).remove();
      }
      this.screen = function appendScreen() {
        $("#screen").append('<div class="info"><h3>'+this.title+'</h3><div class="content"><ul>'+this.content+'</ul></div></div>');
      }
      this.blink = function(selector) {
        jsvn.anim(selector, "blink");  
      };
    };

jsvn.credits = new jsvn.Stage();
        jsvn.credits.data = jsvn.memory.storyObj.stages.credits.content;
        jsvn.credits.list = function(data) {
          var creditList = "<li><strong>Title</strong> : " + jsvn.memory.storyObj.title + "</li>";
          for(var key in data) {
            creditList += "<li><strong>" + key + "</strong> : " + data[key] + "</li>";  
          }
          return creditList;
        };
        jsvn.credits.content = jsvn.credits.list(jsvn.credits.data);

        jsvn.credits.title = "Credits";
        jsvn.credits.returnButton = function returnButton() {
          $("#screen .info").append('<div class="returnButton"><span>Return to Main Menu</span></div>');
          jsvn.credits.blink(".returnButton span");
          $(".info .returnButton").on("click", function() {
            jsvn.credits.removeStage("#screen .info");
            jsvn.start.show();
          });
        };
        jsvn.credits.loadStage = function() {
          jsvn.credits.screen();
          jsvn.start.hide();
          jsvn.credits.returnButton();
        };

jsvn.jump = function(data) {
      $returnFrame = 0;
      $.each(jsvn.memory.script, function(i, frame) {
        if(data === frame.ancor) {
          $returnFrame = i;
          jsvn.router($returnFrame);
        };
      });
    };

jsvn.autoSkip = function(data) {
  if(data === "clear") {
    clearTimeout(jsvn.memory.setTimer);
  } else if(!isNaN(data) && data <= 60000) { 
    jsvn.memory.setTimer = setTimeout(
      function(){
         jsvn.router(jsvn.memory.next);
        }, data);
    jsvn.memory.timed = 0;
  } else {
    jsvn.devDisplay("error: time delay value must be a number and 1 minute or less (60000 milliseconds)");  
  }
}

jsvn.router = function(currentFrame) {
      //save frames and set navigation boundaries
      $this = currentFrame;
      $this > jsvn.memory.script.length -1 ? jsvn.memory.frame = 0 : jsvn.memory.frame = $this; //if it's the end, set the current frame back to zero, otherwise save the current frame

      if(jsvn.memory.frame === jsvn.memory.script.length -1) {//if the current frame is the end, set next to zero, set story as completed
        jsvn.memory.next = 0;
        jsvn.memory.complete = 1;
      } else if(jsvn.memory.frame === 1 && jsvn.memory.complete === 1) {//if the game has restarted set completed to false again
        jsvn.memory.complete = 0;
      } else { //else set the next frame to be the current frame plus 1
         jsvn.memory.next = jsvn.memory.frame + 1;
      };

      if(jsvn.memory.frame > 0) { //if current frame is greater than zero set the previous frame minus 1, else previous is zero
        jsvn.memory.prev = jsvn.memory.frame -1;
      } else {
        jsvn.memory.prev = 0;
      };

      if(jsvn.memory.frame === 0) {
        jsvn.start.loadMenu(jsvn.start.container);
        jsvn.display(0, jsvn.memory.storyObj.start.screen);
      } else {
        jsvn.display(jsvn.memory.frame, jsvn.memory.script);
      };
    };

jsvn.read = function(story) {
    jsvn.memory.storyObj = story;
    jsvn.memory.script = story.script;
  
    //preload the images
    jsvn.preload();

    //start menu
    jsvn.start.loadMenu(jsvn.start.container);

    //initial frame
    jsvn.router(jsvn.memory.frame);

    //change frame on click
    $(".set, .text, .next, .prev, .portraits").on("click", function() {
      if(jsvn.memory.timed){
        jsvn.autoSkip("clear");
        jsvn.memory.timed = 0;
      };
      if($(this).hasClass("prev")) {
        jsvn.router(jsvn.memory.frame -1);
      } else {
        jsvn.router(jsvn.memory.frame +1);
      };
    });
}

jsvn.read(myVisualNovel);