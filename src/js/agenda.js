(function () {
    const grid = document.querySelector(".calendario-grid");

    if(grid) {

        const mesTexto = document.getElementById("mes-actual");
        const btnPrev = document.getElementById("mes-anterior");
        const btnNext = document.getElementById("mes-siguiente");
        const contenedorEventos = document.getElementById("eventos-del-dia");
        const listaEventos = contenedorEventos.querySelector(".lista-eventos");
    
        const coloresEventos = [
            "#c62828", // rojo intenso
            "#1565c0", // azul intenso
            "#2e7d32", // verde fuerte
            "#fbc02d", // amarillo oscuro
            "#8e24aa"  // violeta intenso
        ];
    
        let fechaActual = new Date();
        let eventos = [];
    
        // MODAL ALERTA (solo uno en el DOM)
        function crearModal() {
            if (document.getElementById('evento-modal')) return;
            const modal = document.createElement('div');
            modal.id = 'evento-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.display = 'none';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.background = 'rgba(0,0,0,0.45)';
            modal.style.zIndex = '10000';
    
            const inner = document.createElement('div');
            inner.style.background = '#fff';
            inner.style.borderRadius = '12px';
            inner.style.padding = '28px 22px 20px 22px';
            inner.style.maxWidth = '360px';
            inner.style.width = '92%';
            inner.style.boxShadow = '0 4px 28px 0 rgba(0,0,0,0.17)';
            inner.style.position = 'relative';
            inner.style.textAlign = 'left';
    
            // Cerrar
            const cerrar = document.createElement('button');
            cerrar.innerHTML = '×';
            cerrar.style.position = 'absolute';
            cerrar.style.right = '18px';
            cerrar.style.top = '10px';
            cerrar.style.background = 'none';
            cerrar.style.border = 'none';
            cerrar.style.fontSize = '1.5rem';
            cerrar.style.cursor = 'pointer';
            cerrar.style.color = '#555';
    
            cerrar.addEventListener('click', () => {
                modal.style.display = 'none';
                inner.innerHTML = '';
                inner.appendChild(cerrar);
            });
    
            modal.appendChild(inner);
            inner.appendChild(cerrar);
            document.body.appendChild(modal);
        }
    
        function mostrarModalEvento(evento) {
            Swal.fire({
                title: evento.nombre,
                html: `
                <div style="text-align:left">
                    <strong>Descripción:</strong><br>${evento.descripcion || ''}<br>
                    <strong>Fecha y hora:</strong> ${evento.fecha} ${evento.hora || ''}<br>
                    <strong>Tipo:</strong> ${evento.tipo_reunion || ''}<br>
                    <strong>Lugar:</strong> ${evento.lugar || ''}
                </div>
            `,
                confirmButtonText: 'Cerrar',
                width: 360
            });
        }
    
        // Obtener eventos de la API
        async function cargarEventos() {
            try {
                const res = await fetch("/api/eventos");
                eventos = await res.json();
                renderCalendario();
            } catch (error) {
                console.error("Error al cargar eventos:", error);
                eventos = [];
                renderCalendario();
            }
        }
    
        function renderCalendario() {
            const year = fechaActual.getFullYear();
            const month = fechaActual.getMonth();
            const isMobile = window.innerWidth <= 768;
    
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
    
            for (let dia = 1; dia <= diasMes; dia++) {
                const fechaDia = new Date(year, month, dia);
                const celda = document.createElement("div");
                celda.classList.add("dia-celda");
                celda.style.position = "relative"; // Necesario para la bolita
    
                const numero = document.createElement("div");
                numero.classList.add("numero-dia");
                numero.textContent = dia;
                celda.appendChild(numero);
    
                const eventosDelDia = eventos.filter(evento => {
                    const f = new Date(evento.fecha);
                    return f.getFullYear() === year &&
                        f.getMonth() === month &&
                        f.getDate() === dia;
                });
    
                // Mostrar bolita roja en móvil si hay eventos
                if (eventosDelDia.length > 0 && isMobile) {
                    const bolita = document.createElement("span");
                    bolita.style.display = "inline-block";
                    bolita.style.width = "12px";
                    bolita.style.height = "12px";
                    bolita.style.backgroundColor = "red";
                    bolita.style.borderRadius = "50%";
                    bolita.style.position = "absolute";
                    bolita.style.bottom = "4px";
                    bolita.style.right = "4px";
                    bolita.style.boxShadow = "0 0 2px rgba(0,0,0,0.5)";
                    celda.appendChild(bolita);
                }
    
                // Mostrar eventos (en todas las vistas)
                if (eventosDelDia.length > 0) {
                    eventosDelDia.forEach((evento, index) => {
                        const divEvento = document.createElement("div");
                        divEvento.classList.add("evento");
                        divEvento.style.backgroundColor = coloresEventos[index % coloresEventos.length];
                        divEvento.style.color = "#fff";
                        divEvento.style.padding = "4px 8px";
                        divEvento.style.borderRadius = "6px";
                        divEvento.style.marginBottom = "4px";
                        divEvento.style.cursor = "pointer";
                        divEvento.style.fontWeight = "bold";
                        divEvento.textContent = evento.nombre;
    
                        // Mostrar modal custom al hacer click en el nombre
                        divEvento.addEventListener("click", function (e) {
                            e.stopPropagation();
                            mostrarModalEvento(evento);
                        });
    
                        celda.appendChild(divEvento);
                    });
                }
    
                // Selección de día en móvil: muestra lista de eventos abajo
                celda.addEventListener("click", () => {
                    if (isMobile) {
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
                eventosDelDia.forEach((ev, idx) => {
                    const li = document.createElement("li");
                    li.style.listStyle = "none";
                    li.style.marginBottom = "8px";
                    li.style.background = coloresEventos[idx % coloresEventos.length];
                    li.style.color = "#fff";
                    li.style.padding = "7px 13px";
                    li.style.borderRadius = "6px";
                    li.style.cursor = "pointer";
                    li.style.fontWeight = "bold";
                    li.textContent = ev.nombre;
                    li.addEventListener("click", function (e) {
                        e.stopPropagation();
                        mostrarModalEvento(ev);
                    });
                    listaEventos.appendChild(li);
                });
            }
        }
    
        function marcarDiaSeleccionado(celdaSeleccionada) {
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
    
        window.addEventListener("resize", renderCalendario);
    
        // Cargar eventos y renderizar calendario al inicio
        crearModal();
        cargarEventos();

    }

})();
