import {Api} from "@modules/api";

import postOptionsIcon from '@static/icons/post_opts.svg';
import likeIcon from '@static/icons/like.svg';
import commentIcon from '@static/icons/comment.svg';
import shareIcon from '@static/icons/share.svg';
import sendIcon from '@static/icons/send.svg';
import defaultAva from '@static/img/default-ava.png'

export default (isOwner, userAva) => {
    const sendButtons = document.querySelectorAll('.send_btn');
    sendButtons.forEach((sendButton) => sendButton.src = sendIcon);

    sendButtons.forEach((sendButton) => sendButton.addEventListener('click', (event) => {
        alert(event.target.parentElement.dataset.post);
        alert(event.target.parentElement.children[0].value);
    }))

    if (isOwner) {
        const postSettingsButton = document.querySelectorAll('.post_opts');
        postSettingsButton.forEach((settingsButton) => settingsButton.src = postOptionsIcon);

        postSettingsButton.forEach((settingsButton) => settingsButton.addEventListener('click', (event) => {
            const id = event.target.dataset.post;
            const postMenu = document.getElementById('submenu-' + id);
            if (postMenu.style.display === 'none') {
                postMenu.style.display = 'block';
            } else {
                postMenu.style.display = 'none';
            }

            const postEditButton = postMenu.children[0];
            const postDeleteButton = postMenu.children[1];

            postEditButton.addEventListener('click', () => {
                const post = {};
                post.header = document.getElementById('header-' + id).textContent;
                post.body = document.getElementById('body-' + id).textContent;
                post.tags = [];
                window.post = post;
                return window.router.redirect('/editpost' + id);
            })

            postDeleteButton.addEventListener('click', async () => {
                const api = new Api();
                await api.deletePost(id);
                const post = postMenu.parentNode;
                post.remove();
            })
        }))
    }
    document.querySelectorAll('.comment-ico').forEach((commentButton) => commentButton.src = commentIcon);
    document.querySelectorAll('.share').forEach((shareButton) => shareButton.src = shareIcon);

    document.querySelectorAll('.comment-ava-img').forEach((commentAva) => commentAva.src = userAva);
    document.querySelectorAll('.input-ava').forEach((inputAva) => inputAva.children[0].src = userAva);

    const postLikeButton = document.querySelectorAll('.like');
    postLikeButton.forEach((likeButton) => likeButton.src = likeIcon);

    postLikeButton.forEach((likeButton) => likeButton.addEventListener('click', async (event) => {
        const id = event.target.dataset.post;
        const liked = event.target.dataset.liked;
        const lks = document.getElementById("like-" + id);
        const likesCount = document.getElementById("likes-" + id);
        if (liked === "true") {
            const api = new Api();
            await api.unlikePost(id);
            lks.classList.remove('like-clicked');
            likesCount.textContent = String(Number(likesCount.textContent) - 1);
            event.target.dataset.liked = false;
        } else {
            const api = new Api();
            await api.likePost(id);
            lks.classList.add('like-clicked');
            likesCount.textContent = String(Number(likesCount.textContent) + 1);
            event.target.dataset.liked = true;
        }
    }))

}