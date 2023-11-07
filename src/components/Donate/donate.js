import css from "./donate.css"
import {Api} from "@modules/api.js";

export default async (receiver) => {
    const dialog = document.getElementById('donate-dialog');
    document.querySelector('#close').onclick = function () {
        dialog.close();
    }
    document.querySelector('#send-donate').onclick = async function () {
        const sum = document.querySelector('.sum').value;
        if (sum <= 10) {
	const errEl = document.querySelector('.error');
		errEl.textContent = 'Минимальная сумма - 10';
	} else {
	    const api = new Api();
        const response = await api.donate(window.user.id, receiver,'RUB', sum);
        dialog.close();
        window.location.href = response.data.body.redirect_url;
	}
    }
}
