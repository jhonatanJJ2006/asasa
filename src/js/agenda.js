(function () {
    const grid = document.querySelector(".calendario-grid");

    if (grid) {
        const eventos = [
            { titulo: "Cita médica para un orfanato dentro de la nueva granada del sistema geo", fecha: "2025-06-30", info: "Consultorio 1" },
            { titulo: "Cita médica para un orfanato dentro de la nueva granada del sistema geo", fecha: "2025-07-10", info: "Consultorio 1" },
            { titulo: "Chequeo pediátrico", fecha: "2025-07-18", info: "Niño de 2 años" },
            { titulo: "Terapia", fecha: "2025-07-22", info: "Psicología" },
            { titulo: "Cumpleaños Carlos G.", fecha: "2025-07-25", info: "Carlos G." }
        ];

        const mesTexto = document.getElementById("mes-actual");
        const btnPrev = document.getElementById("mes-anterior");
        const btnNext = document.getElementById("mes-siguiente");
        const contenedorEventos = document.getElementById("eventos-del-dia");
        const listaEventos = contenedorEventos.querySelector(".lista-eventos");

        let fechaActual = new Date();

        function renderCalendario() {
            const year = fechaActual.getFullYear();
            const month = fechaActual.getMonth();

            mesTexto.textContent = fechaActual.toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric"
            });

            // Eliminar días anteriores
            document.querySelectorAll(".dia-celda").forEach(n => n.remove());

            const primerDia = new Date(year, month, 1);
            const ultimoDia = new Date(year, month + 1, 0);
            const inicioSemana = primerDia.getDay();
            const diasMes = ultimoDia.getDate();

            // Celdas vacías antes del primer día
            for (let i = 0; i < inicioSemana; i++) {
                const celdaVacia = document.createElement("div");
                celdaVacia.classList.add("dia-celda");
                grid.appendChild(celdaVacia);
            }

            // Crear días del mes
            for (let dia = 1; dia <= diasMes; dia++) {
                const fechaDia = new Date(year, month, dia);
                const celda = document.createElement("div");
                celda.classList.add("dia-celda");

                const numero = document.createElement("div");
                numero.classList.add("numero-dia");
                numero.textContent = dia;
                celda.appendChild(numero);

                eventos.forEach(evento => {
                    const fechaEvento = new Date(evento.fecha);
                    if (
                        fechaEvento.getFullYear() === year &&
                        fechaEvento.getMonth() === month &&
                        fechaEvento.getDate() === dia
                    ) {
                        const divEvento = document.createElement("div");
                        divEvento.classList.add("evento");

                        // Punto rojo solo en móvil
                        if (window.innerWidth <= 768) {
                            const puntoRojo = document.createElement("span");
                            puntoRojo.style.display = "inline-block";
                            puntoRojo.style.width = "8px";
                            puntoRojo.style.height = "8px";
                            puntoRojo.style.backgroundColor = "red";
                            puntoRojo.style.borderRadius = "50%";
                            puntoRojo.style.marginRight = "6px";
                            puntoRojo.style.verticalAlign = "middle";

                            divEvento.appendChild(puntoRojo);
                        }

                        divEvento.appendChild(document.createTextNode(evento.titulo));

                        celda.appendChild(divEvento);
                    }
                });

                // Comportamiento para móviles
                celda.addEventListener("click", () => {
                    if (window.innerWidth <= 768) {
                        mostrarEventosDelDia(dia, month, year);
                        marcarDiaSeleccionado(celda);
                    }
                });

                grid.appendChild(celda);
            }
        }

        function mostrarEventosDelDia(dia, mes, anio) {
            listaEventos.innerHTML = "";

            const eventosDelDia = eventos.filter(e => {
                const f = new Date(e.fecha);
                return f.getDate() === dia && f.getMonth() === mes && f.getFullYear() === anio;
            });

            if (eventosDelDia.length === 0) {
                listaEventos.innerHTML = "<li>No hay eventos</li>";
            } else {
                eventosDelDia.forEach(ev => {
                    const li = document.createElement("li");
                    li.textContent = ev.titulo;
                    listaEventos.appendChild(li);
                });
            }
        }

        function marcarDiaSeleccionado(celdaSeleccionada) {
            // Eliminar selección previa
            document.querySelectorAll(".dia-celda").forEach(c => c.classList.remove("seleccionado"));
            celdaSeleccionada.classList.add("seleccionado");
        }

        btnPrev.addEventListener("click", () => {
            fechaActual.setMonth(fechaActual.getMonth() - 1);
            renderCalendario();
        });

        btnNext.addEventListener("click", () => {
            fechaActual.setMonth(fechaActual.getMonth() + 1);
            renderCalendario();
        });

        renderCalendario();
    }
})();
