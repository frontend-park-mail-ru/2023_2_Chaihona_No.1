import {Api} from "@modules/api";

export default () => {
    const sendButtons = document.querySelectorAll('.send_btn');
    sendButtons.forEach((sendButton) => sendButton.addEventListener('click', (event) => {
        alert(event.target.parentElement.dataset.post);
        alert(event.target.parentElement.children[0].value);
    }))

    const postSettingsButton = document.querySelectorAll('.post_opts');

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
            return window.router.redirect('/editpost' + id);
        })

        postDeleteButton.addEventListener('click', async () => {
            const api = new Api();
            await api.deletePost(id);
            const post = postMenu.parentNode;
            post.remove();
        })
    }))

    const postLikeButton = document.querySelectorAll('.like')

    postLikeButton.forEach((likeButton) => likeButton.addEventListener('click', async (event) => {
        const id = event.target.dataset.post;
        const liked = event.dataset.liked;
        const lks = document.getElementById("like-" + id);
        if (liked === "true") {
            const api = new Api();
            await api.unlikePost(id);
            lks.classList.remove('like-comment-share-clicked');
            lks.classList.add('like-comment-share');
        } else {
            const api = new Api();
            await api.likePost(id);
            lks.classList.remove('like-comment-share');
            lks.classList.add('like-comment-share-clicked');
        }
    }))

}