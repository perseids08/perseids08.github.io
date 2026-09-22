/* Initial dishes, photo credits and bundled Lucide icons. No external requests. */
window.KITCHEN_DATA = {
  "seedDishes": [
    {
      "id": "tomato-eggs",
      "name": "番茄炒蛋",
      "description": "酸酸甜甜，最熟悉的家的味道",
      "cooks": 3,
      "image": "tomato",
      "createdAt": 6
    },
    {
      "id": "braised-pork",
      "name": "红烧肉",
      "description": "小火慢炖，连汤汁都想拌饭",
      "cooks": 2,
      "image": "pork",
      "createdAt": 5
    },
    {
      "id": "cola-wings",
      "name": "可乐鸡翅",
      "description": "甜咸刚好，今天也要好好吃饭",
      "cooks": 1,
      "image": "wings",
      "createdAt": 4
    },
    {
      "id": "vegetables",
      "name": "清炒时蔬",
      "description": "给这一餐添一点清爽",
      "cooks": 3,
      "image": "greens",
      "createdAt": 3
    },
    {
      "id": "chicken-curry",
      "name": "咖喱鸡",
      "description": "浓浓咖喱，配一大碗米饭",
      "cooks": 2,
      "image": "curry",
      "createdAt": 2
    },
    {
      "id": "tomato-soup",
      "name": "番茄蛋花汤",
      "description": "暖暖的一碗，为这顿饭收尾",
      "cooks": 1,
      "image": "soup",
      "createdAt": 1
    }
  ],
  "photoCredits": [
    {
      "key": "tomato",
      "dish": "番茄炒蛋",
      "author": "三島堂",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
      "source": "https://commons.wikimedia.org/wiki/File:番茄炒蛋2.PNG"
    },
    {
      "key": "pork",
      "dish": "红烧肉",
      "author": "lazy fri13th",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0/",
      "source": "https://commons.wikimedia.org/wiki/File:Red_braised_pork_belly.jpg"
    },
    {
      "key": "wings",
      "dish": "可乐鸡翅",
      "author": "Alpha",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/",
      "source": "https://commons.wikimedia.org/wiki/File:Chicken_Wings_in_Coca_Cola_Sauce.jpg"
    },
    {
      "key": "greens",
      "dish": "清炒时蔬",
      "author": "Daderot",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
      "source": "https://commons.wikimedia.org/wiki/File:Bok_choy_-_Massachusetts.jpg"
    },
    {
      "key": "curry",
      "dish": "咖喱鸡",
      "author": "Biswarup Ganguly",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
      "source": "https://commons.wikimedia.org/wiki/File:Boneless_Chicken_Curry_-_Kolkata_2011-11-15_7054.JPG"
    },
    {
      "key": "soup",
      "dish": "番茄蛋花汤",
      "author": "NNU-10-HanRongrong",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0/",
      "source": "https://commons.wikimedia.org/wiki/File:Tomato_and_egg_soup.jpg"
    }
  ],
  "icons": {
    "chef": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-chef-hat\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z\"></path><path d=\"M6 17h12\"></path></svg>",
    "plus": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-plus\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M5 12h14\"></path><path d=\"M12 5v14\"></path></svg>",
    "heart": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-heart\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\"></path></svg>",
    "utensils": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-utensils-crossed\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8\"></path><path d=\"M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7\"></path><path d=\"m2.1 21.8 6.4-6.3\"></path><path d=\"m19 5-7 7\"></path></svg>",
    "edit": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-pencil\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"></path><path d=\"m15 5 4 4\"></path></svg>",
    "basket": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-shopping-basket\" aria-hidden=\"true\" focusable=\"false\"><path d=\"m15 11-1 9\"></path><path d=\"m19 11-4-7\"></path><path d=\"M2 11h20\"></path><path d=\"m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4\"></path><path d=\"M4.5 15.5h15\"></path><path d=\"m5 11 4-7\"></path><path d=\"m9 11 1 9\"></path></svg>",
    "arrow": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-arrow-right\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M5 12h14\"></path><path d=\"m12 5 7 7-7 7\"></path></svg>",
    "check": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-check\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M20 6 9 17l-5-5\"></path></svg>",
    "close": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-x\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M18 6 6 18\"></path><path d=\"m6 6 12 12\"></path></svg>",
    "trash": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-trash2 lucide-trash-2\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M10 11v6\"></path><path d=\"M14 11v6\"></path><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"></path><path d=\"M3 6h18\"></path><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path></svg>",
    "orders": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-clipboard-list\" aria-hidden=\"true\" focusable=\"false\"><rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"></rect><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"></path><path d=\"M12 11h4\"></path><path d=\"M12 16h4\"></path><path d=\"M8 11h.01\"></path><path d=\"M8 16h.01\"></path></svg>",
    "refresh": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-refresh-cw\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"></path><path d=\"M21 3v5h-5\"></path><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"></path><path d=\"M8 16H3v5\"></path></svg>",
    "device": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"lucide lucide-monitor\" aria-hidden=\"true\" focusable=\"false\"><rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\"></rect><line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\"></line><line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\"></line></svg>"
  }
};
