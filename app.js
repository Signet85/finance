//Дэлгэцтэй ажиллах контроллер
var uiController = (function () {})();

//Сайнхүүтэй ажиллах контроллер
var financeController = (function () {})();

// Программын холбогч контроллер
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    //1. Оруулах өгөгдлийг дэлгэцнээс олж авна
    //2. Олж авсан өгөгдлүүдээ санхүүгийн контреллерт дамжуулж тэнд хадгална.
    //3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана
    //4. Төсвийг тооцоолно
    //5. Эцсийн үлдэгдэл, Тооцоог дэлгэцэнд гаргана
    console.log("uildel");
  };

  document.querySelector(".add__btn").addEventListener("click", function () {
    ctrlAddItem();
  });

  document.addEventListener("keypress", function () {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(uiController, financeController);
