window.onload = function(){ 
  var dialog = document.querySelector('dialog')
  // выводим диалоговое окно
  document.querySelector('#open').onclick = function () {
    dialog.show()
  }
  document.querySelector('#close').onclick = function () {
  dialog.close()
}
};