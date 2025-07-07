(function () {

    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("fileElem");
    const carousel = document.getElementById("carousel");
    const noImagesMsg = document.getElementById("no-images-msg");

    if(fileInput) {

        fileInput.addEventListener("change", handleFiles);
    
        function handleFiles() {
            const files = [...fileInput.files];
    
            if (files.length > 0) {
                noImagesMsg.style.display = "none";
                carousel.style.display = "flex";
    
                files.forEach(file => {
                    if (!file.type.startsWith("image/")) return;
    
                    const reader = new FileReader();
                    reader.onload = () => {
                        const img = document.createElement("img");
                        img.src = reader.result;
                        img.className = "canton-info__carousel-img";
                        carousel.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                });
            }
        }

    }

})();
