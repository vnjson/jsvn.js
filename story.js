var myVisualNovel = {
  
  "title" : "Bird Feathers", //set the title of your story
  "style" : "default", //theme (use "invert" for a white theme)

  "characters": {
    "Алиса": {
      "base":"assets/char/elf-girl-base.png",
      "normal":"assets/char/elf-girl-normal.png",
      "wink":"assets/char/elf-girl-wink.png",
      "mad":"assets/char/elf-girl-mad.png"
    },
    "Кирон": {
      "base":"assets/char/demon-boy-base.png",
      "normal":"assets/char/demon-boy-normal.png",
      "happy":"assets/char/demon-boy-happy.png",
      "cry":"assets/char/demon-boy-cry.png"
    }
  },

  "backgrounds": {
    "black": "#000",
    "white": "#fff",
    "stage": "assets/bg/stage.png",
    "Meadow": "assets/bg/meadow.png",
    "Castle": "assets/bg/castle.png",
    "Dungeon": "assets/bg/dungeon.png",
    "Forest": "assets/bg/forrest.png",
    "Room": "assets/bg/room.png",
    "Castle2": "assets/bg/castle2.png"
  },

  "start": {
    "screen": [
      {"bg": "Castle"}
    ],
    "menu": [
      {"button":"Новая игра", "action":"start"},{"button":"От автора", "action":"credits"}
      ]
  },

  "stages": {
    "credits": {
      "content": {//you can make as many credits as you like using separate key value pairs. please mind escape quotes.
        "Description": "jsVN demo story",
        "Stary &amp; Art": "standard-relic",
        "Built with": "<a href=\"http://standard-relic.tumblr.com/jsvnlatest\" target=\"_blank\">jsVN v2.0.4 : Animation</a>",
                }
              }
    
  },

  "script": [//story starts below this line
    {"c":"", "line":""},
    {"line":"Неизвестно где, но известно когда", "bg":"Forest"},
    {"c":"Алиса", "line":"Привет ребята", "e":"normal", "mode":"left fadein", "anitext":"bump"},
    {"c":"Алиса", "line":"Меня зовут Алиса а ваши птички уже улетели?"},
    {"line":"У тебя есть девушка?.",
             "prompt":
              [{"option":"Да", "jumpto":"yes"},
               {"option":"Нет", "jumpto":"no"}
              ]},
    //yes
    {"c":"Алиса", "line":"Правда, тогда я бы хотела ей стать.", "e":"wink", "ancor":"yes"},
    {"c":"Алиса", "line":"Но к сожалению я немогу покинуть эту локацию", "e":"normal"},
    {"line":"А какие птички тебе по нраву?",
             "prompt":
              [{"option":"Красные", "mem":"Feathers red"},
               {"option":"Синие", "mem":"Feathers blue"},
               {"option":"Зеленые", "mem":"Feathers green"},
               {"option":"Черные", "mem":"Feathers black"},
              ]},
    {"c":"Алиса", "line":"Ладно я думаю что мы с тобой подружимся.", "e":"wink"},
    {"jumpto":"Carmelo"},
    //no
    {"c":"Алиса", "line":"Правда, тогда я буду ей!", "e":"mad", "ancor":"no", "anitext":"bump", "time":"2000"},
   
    //Carnelio
    {"c":"Кирон", "line":"Мисс Алиса!", "ancor":"Carmelo", "anibg":"shake"},         
    {"c":"Кирон", "line":"Мисс Алиса! Ты где?", "e":"normal", "mode":"right fadein", "anitext":"shake"},
    {"c":"Алиса", "line":"Привет Кирон, неужели ты опять меня ищешь?", "e":"mad"},
    {"c":"Кирон", "line":"Я так испугался когда ты ушла далеко далеко...", "e":"cry"},
    {"c":"Алиса", "line":"Ты не должен привыкать ко мне"},
    {"c":"Кирон", "line":"Почему же?!", "e":"normal"},
    {"c":"Алиса", "line":"Потому что я хочу отправиться в страну чудей и волшебства.", "e":"normal"},
    {"c":"Алиса", "line":"Но это будет длинный путь поэтому мне необходимо писать заметки!"},
    {"c":"Кирон", "line":"Я рад что ты у меня Есть Алиса.", "e":"happy"},
    {"mode":"clear", "line":"Ладно пошли уродец..."},
  ]

}
