import css from "./donate.css"

export default async () => {
    const dialog = document.getElementById('donate-dialog');
    // выводим диалоговое окно
    document.querySelector('#close').onclick = function () {
        dialog.close()
    }
    document.querySelector('#send-donate').onclick = function () {

    }
}