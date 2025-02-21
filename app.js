//Дэлгэцтэй ажиллах контроллер
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescpription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    persentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };
  var formatMoney = function (too, type) {
    too = "" + too;
    var x = too.split("").reverse().join("");
    var y = "";
    var count = 1;
    for (var i = 0; i < x.length; i++) {
      y = y + x[i];
      if (count % 3 === 0) y = y + ",";
      count++;
    }
    var z = y.split("").reverse().join("");
    if (z[0] === ",") z = z.substr(1, z.length - 1);
    if (type === "inc") z = "+ " + z;
    else z = "- " + z;
    return z;
  };
  return {
    displayDate: function () {
      var unuudur = new Date();
      document.querySelector(DOMstrings.dateLabel).textContent =
        unuudur.getFullYear() + " оны " + unuudur.getMonth() + "сарын ";
    },
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescpription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    displayPercentages: function (allPercentages) {
      // Зарлагын Nodelist-ийг олох <button>Click</button>
      var elements = document.querySelectorAll(
        DOMstrings.expensePercentageLabel
      );
      //Элемент болгоны хувьд зарлагын хувийг массиваас авч шивж оруулах
      nodeListForEach(elements, function (el, index) {
        el.textContent = allPercentages[index];
      });
    },
    getDOMstrings: function () {
      return DOMstrings;
    },

    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescpription + ", " + DOMstrings.inputValue
      );
      // Convert list to array
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (el, index, array) {
        el.value = "";
      });
      fieldsArr[0].focus();
      //   For(var i = 0; i < fieldsArr.length; i++) {
      //       fieldsArr[i].value = "";
      //   }
    },

    tusviigUzuuleh: function (tusuv) {
      var type;
      if (tusuv.tusuv > 0) type = "inc";
      else type = "exp";
      document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(
        tusuv.tusuv,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(
        tusuv.totalInc,
        "inc"
      );
      document.querySelector(DOMstrings.expenseLabel).textContent = formatMoney(
        tusuv.totalExp,
        "exp"
      );
      if (tusuv.huvi !== 0) {
        document.querySelector(DOMstrings.persentageLabel).textContent =
          tusuv.huvi + "%";
      } else {
        document.querySelector(DOMstrings.persentageLabel).textContent =
          tusuv.huvi;
      }
    },
    deleteListItem: function (type) {
      var el = document.getElementById(type);
      el.parentNode.removeChild(el);
    },
    addListItem: function (item, type) {
      // Орлого, зарлагын элементийг агуулсан html-ийг бэлтгэнэв
      var html, list;

      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //Тэр html дотроо орлого зарлагын утгуудыг REPLACE ашиглаж өөрчлөнө
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", formatMoney(item.value, type));

      //Бэлтгэсэн html ээ DOM руу хийж өгнө
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },
  };
})();

//Сайнхүүтэй ажиллах контроллер
var financeController = (function () {
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expence = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expence.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0)
      this.percentage = Math.round((this.value / totalIncome) * 100);
    else this.percentage = 0;
  };
  Expence.prototype.getPercentage = function () {
    return this.percentage;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum = sum + el.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    items: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    tusuv: 0,
    huvi: 0,
  };
  return {
    tusuvTootsooloh: function () {
      //Орлогын нийлбэрийг тооцоолно
      calculateTotal("inc");
      //Зарлагын нийлбэрийг тооцоолно
      calculateTotal("exp");
      //Төсвийг шинээр тооцоолно
      data.tusuv = data.totals.inc - data.totals.exp;
      // Орлого зарлагын хувийг тооцоолно
      if (data.totals.inc > 0)
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      else data.huvi = 0;
    },

    calculatePercentages: function () {
      data.items.exp.forEach(function (el) {
        el.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function () {
      var allPercentages = data.items.exp.map(function (el) {
        return el.getPercentage();
      });
      return allPercentages;
    },

    tusviigAvah: function () {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },

    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });

      var index = ids.indexOf(id);

      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
    },
    addItem: function (type, desc, val) {
      var item, id;
      if (data.items[type].length === 0) id = 1;
      else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }
      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expence(id, desc, val);
      }
      data.items[type].push(item);
      return item;
    },
    seeData: function () {
      return data;
    },
  };
})();

// Программын холбогч контроллер
var appController = (function (uiController, financeController) {
  //var DOM = uiController.getDOMstrings();
  var ctrlAddItem = function () {
    //1. Оруулах өгөгдлийг дэлгэцнээс олж авна
    var input = uiController.getInput();
    if (input.description !== "" && input.value !== "") {
      //2. Олж авсан өгөгдлүүдээ санхүүгийн контреллерт дамжуулж тэнд хадгална.
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );

      //3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана
      uiController.addListItem(item, input.type);
      uiController.clearFields();
      //төсвийг шинээр тооцоолоод дэлгэцэнд үзүүлнэ
      updateTusuv();
    }
  };
  var updateTusuv = function () {
    //4. Төсвийг тооцоолно
    financeController.tusuvTootsooloh();
    //5. Эцсийн үлдэгдэл, Тооцоог дэлгэцэнд гаргана
    var tusuv = financeController.tusviigAvah();
    //6. Эцсийн төсвийг дэлгэцэнд гаргах
    uiController.tusviigUzuuleh(tusuv);

    //7. Элементүүдийн хувийг хүлээж авна
    financeController.calculatePercentages();
    // 8. Элементүүдийн хувийг хүлээж авна
    var allPercentages = financeController.getPercentages();
    // 9. Дэлгэцэнд үзүүлэх
    uiController.displayPercentages(allPercentages);
    //console.log(allPercentages);
  };
  var setupEventListeners = function () {
    var DOM = uiController.getDOMstrings();
    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);
          //console.log(type + ":" + itemId);
          //1.Санхүүгийн модулиас type, id ашиглан устгана.
          financeController.deleteItem(type, itemId);
          //2. Дэлгэц дээрээс энэ элементийг устгана.
          uiController.deleteListItem(id);
          //3. Үлдэгдэл тооцоог шинэчилж хадгална.
          updateTusuv();
        }
      });
  };

  return {
    init: function () {
      console.log("Application started...");
      uiController.displayDate();
      uiController.tusviigUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0,
      });
      setupEventListeners();
    },
  };
})(uiController, financeController);

appController.init();
