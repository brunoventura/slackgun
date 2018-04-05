(function() {
    
    const elFeedback = document.querySelector('#feedback');
    const elLoader = document.querySelector('#loader')
    const elError = document.querySelector('#error');
    
    const errorList = {
        invalid_auth: 'Invalid token.'
    }

    function hideElement(el) {
        el.classList.add('is-invisible', 'is-marginless', 'is-paddingless')
    }

    function showElement(el) {
        el.classList.remove('is-invisible', 'is-marginless', 'is-paddingless')
    }

    async function send(e) {
        e.preventDefault();

        elLoader.classList.add('is-active');

        const fields = [].map.call(
            document.querySelectorAll('.form-field'),
            ({ name, value }) => ({[name]: value})
        );        

        const res = await fetch('/send', {
            body: JSON.stringify(Object.assign(...fields)),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
        });

        const body = await res.json();
        elLoader.classList.remove('is-active');
        
        if (res.ok) {
            elFeedback.classList.add('is-active');
            elFeedback.querySelector('.modal-card-body').textContent = JSON.stringify(body, null, 4);
        } else {
            elError.textContent = errorList[body.error] || body.error;
            showElement(elError);
        }
    }

    document
        .querySelector('[aria-label="close"]')
        .addEventListener('click', () => elFeedback.classList.remove('is-active'));
    
    document
        .querySelector('#slackgun')
        .addEventListener('submit', send, false);
})();