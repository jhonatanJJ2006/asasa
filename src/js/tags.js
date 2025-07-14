(function () {

    const tagsInput = document.querySelector('#adicionales');
    const instruccuionTags = document.querySelector('.formulario-administrador__instruccion');
    const tagsDiv = document.querySelector('.tagsDiv');
    const tagsInputHidden = document.querySelector('#tagsHidden');
    let tags = [];

    if (tagsInput) {

        if (tagsInputHidden.value !== '') {

            tags = tagsInputHidden.value.split(',');
            mostrarTags();

        }

        tagsInput.addEventListener('keypress', guardarTag);

    }

    function guardarTag(e) {

        if (e.keyCode === 44) {

            if (e.target.value.trim() === '' || e.target.value < 1) { return }

            e.preventDefault();

            tags = [...tags, e.target.value.trim()];
            tagsInput.value = '';

            mostrarTags();

        }

    }

    function mostrarTags() {

        tagsDiv.textContent = '';
        instruccuionTags.style.display = 'block';

        tags.forEach(tag => {

            const etiqueta = document.createElement('LI');
            etiqueta.classList.add('tag');
            etiqueta.textContent = tag;
            etiqueta.ondblclick = eliminarTag;
            tagsDiv.appendChild(etiqueta);

        });

        actualizarInputHidden();

    }

    function eliminarTag(e) {

        e.target.remove();
        tags = tags.filter(tag => tag !== e.target.textContent);

        if(tags.length === 0) {
            instruccuionTags.style.display = 'none';
        }

        actualizarInputHidden();

    }

    function actualizarInputHidden() {

        tagsInputHidden.value = tags.toString();

    }

})();