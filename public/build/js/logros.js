(function () {
  // ----------- Configuración general y utilidades -----------

  const YEAR_START = 1900;
  const today = new Date();
  const YEAR_END = today.getFullYear();
  const MONTH_END = today.getMonth() + 1;
  const DAY_END = today.getDate();

  const monthsNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // ---- Función: intervalo óptimo responsive ----
  function getOptimalInterval(mode, rangeLength) {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const maxItems = vw < 480 ? 4 : vw < 768 ? 6 : vw < 1024 ? 8 : 12;
    
    if (!rangeLength) {
      if (mode === 'year') rangeLength = YEAR_END - YEAR_START + 1;
      if (mode === 'month' && current.year) {
        rangeLength = (current.year == YEAR_END) ? MONTH_END : 12;
      }
      if (mode === 'day' && current.year && current.month) {
        let daysInMonth = new Date(current.year, current.month, 0).getDate();
        rangeLength = (current.year == YEAR_END && current.month == MONTH_END) ? DAY_END : daysInMonth;
      }
    }
    
    if (mode === 'day-detail') return 1; // Forzar días individuales
    
    // Responsive intervals
    if (vw < 480) { // Móviles pequeños
      if (rangeLength > maxItems * 3) return 25;
      if (rangeLength > maxItems * 2) return 15;
      if (rangeLength > maxItems) return 5;
      return 1;
    } else if (vw < 768) { // Móviles grandes
      if (rangeLength > maxItems * 2.5) return 20;
      if (rangeLength > maxItems * 1.5) return 10;
      if (rangeLength > maxItems) return 3;
      return 1;
    } else { // Tablets y desktop
      if (rangeLength > maxItems * 2) return 10;
      if (rangeLength > maxItems * 1.4) return 5;
      if (rangeLength > maxItems) return 3;
      if (rangeLength > 6) return 2;
      return 1;
    }
  }

  let logros = {}; // logros[year][month][day] = logroObj
  let level = "year";
  let interval = getOptimalInterval('year');
  let current = {};

  const timeline = document.getElementById('timeline');
  const fechaActualDiv = document.getElementById('fechaActual');
  const logrosModal = document.getElementById('logrosModal');
  const logrosModalContent = document.getElementById('logrosModalContent');

  if (timeline) {

    // --------- Loader mientras carga ---------
    timeline.innerHTML = `<div style="width:100%;text-align:center;padding:48px 0 24px;">
      <div class="loader-timeline" style="display:inline-block; width:48px; height:48px; border-radius:50%; background:rgba(48,72,160,.09); position:relative;">
        <div style="width:32px;height:32px; border:4px solid #6270ba; border-bottom-color:transparent; border-radius:50%;position:absolute;left:8px;top:8px;animation:spin .7s linear infinite;"></div>
      </div>
      <style>@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}</style>
    </div>`;

    // --------- Fetch logros desde BD ---------
    async function fetchLogros() {
      try {
        const resp = await fetch('/api/logros');
        const logrosArr = await resp.json(); // [{fecha, titulo, descripcion, imagen, pdfs...}, ...]
        // Parse a estructura logros[year][month][day] = logroObj
        logros = {};
        logrosArr.forEach(l => {
          if (!l.fecha) return;
          const [y, m, d] = l.fecha.split('-').map(v => parseInt(v));
          if (!logros[y]) logros[y] = {};
          if (!logros[y][m]) logros[y][m] = {};
          // Procesa PDFs como array si están en string json
          if (typeof l.pdfs === "string") {
            try { l.pdfs = JSON.parse(l.pdfs); } catch { l.pdfs = []; }
          }
          logros[y][m][d] = l;
        });
      } catch (e) {
        logros = {};
      }
    }

    // --------- Utilidad para saber si hay evento en rango
    function hasEventInRange(type, from, to, year, month) {
      if (type === 'year') {
        for (let y = from; y <= to; y++) {
          if (logros[y]) return true;
        }
      }
      if (type === 'month') {
        for (let m = from; m <= to; m++) {
          if (logros[year]?.[m]) return true;
        }
      }
      if (type === 'day') {
        for (let d = from; d <= to; d++) {
          if (logros[year]?.[month]?.[d]) return true;
        }
      }
      return false;
    }

    // --------- Agrupación adaptativa (solo con eventos) ---------
    function getYearTicks(interval) {
      let arr = [];
      let yearsWithEvents = Object.keys(logros).map(y => parseInt(y)).sort((a, b) => a - b);
      
      if (yearsWithEvents.length === 0) return arr;
      
      let minYear = yearsWithEvents[0];
      let maxYear = yearsWithEvents[yearsWithEvents.length - 1];
      
      let y = minYear;
      while (y <= maxYear) {
        let to = Math.min(y + interval - 1, maxYear);
        // Solo agregar si hay eventos en este rango
        if (hasEventInRange('year', y, to)) {
          arr.push({ from: y, to });
        }
        y = to + 1;
      }
      return arr;
    }
    function getYearRange(from, to, interval = 1) {
      let arr = [];
      let y = from;
      while (y <= to) {
        let t = Math.min(y + interval - 1, to);
        // Solo agregar si hay eventos en este rango
        if (hasEventInRange('year', y, t)) {
          arr.push({ from: y, to: t });
        }
        y = t + 1;
      }
      return arr;
    }
    function getMonthTicks(interval, year) {
      let arr = [];
      let monthsWithEvents = logros[year] ? Object.keys(logros[year]).map(m => parseInt(m)).sort((a, b) => a - b) : [];
      
      if (monthsWithEvents.length === 0) return arr;
      
      let minMonth = monthsWithEvents[0];
      let maxMonth = monthsWithEvents[monthsWithEvents.length - 1];
      
      let m = minMonth;
      while (m <= maxMonth) {
        let to = Math.min(m + interval - 1, maxMonth);
        // Solo agregar si hay eventos en este rango
        if (hasEventInRange('month', m, to, year)) {
          arr.push({ from: m, to });
        }
        m = to + 1;
      }
      return arr;
    }
    function getMonthRange(from, to, interval = 1, year) {
      let arr = [];
      let m = from;
      while (m <= to) {
        let t = Math.min(m + interval - 1, to);
        // Solo agregar si hay eventos en este rango
        if (hasEventInRange('month', m, t, year)) {
          arr.push({ from: m, to: t });
        }
        m = t + 1;
      }
      return arr;
    }
    function getDayTicks(interval, year, month) {
      let arr = [];
      let daysWithEvents = logros[year]?.[month] ? Object.keys(logros[year][month]).map(d => parseInt(d)).sort((a, b) => a - b) : [];
      
      if (daysWithEvents.length === 0) return arr;
      
      let minDay = daysWithEvents[0];
      let maxDay = daysWithEvents[daysWithEvents.length - 1];
      
      let d = minDay;
      while (d <= maxDay) {
        let to = Math.min(d + interval - 1, maxDay);
        // Solo agregar si hay eventos en este rango
        if (hasEventInRange('day', d, to, year, month)) {
          arr.push({ from: d, to });
        }
        d = to + 1;
      }
      return arr;
    }
    function getDayRange(from, to, interval = 1, year, month) {
      let arr = [];
      let d = from;
      while (d <= to) {
        let t = Math.min(d + interval - 1, to);
        // Solo agregar si hay eventos en este rango
        if (hasEventInRange('day', d, t, year, month)) {
          arr.push({ from: d, to: t });
        }
        d = t + 1;
      }
      return arr;
    }

    // --------- Botón de regresar ---------
    function createBackButton() {
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const isMobile = vw < 768;
      
      const backBtn = document.createElement('button');
      backBtn.id = 'timeline-back-btn';
      backBtn.className = 'logros__back-btn';
      backBtn.innerHTML = `
        <svg width="${isMobile ? '18' : '20'}" height="${isMobile ? '18' : '20'}" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
        </svg>
        <span>Regresar</span>
      `;
      backBtn.style.cssText = `
        display: flex; align-items: center; gap: 8px; padding: ${isMobile ? '8px 12px' : '10px 16px'};
        background: linear-gradient(135deg, #3048a0 0%, #6270ba 100%); color: white;
        border: none; border-radius: 25px; font-size: ${isMobile ? '0.9rem' : '1rem'}; font-weight: 600;
        cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(48,72,160,0.2);
        margin-bottom: 16px; position: relative; z-index: 10;
      `;
      
      backBtn.addEventListener('mouseover', () => {
        backBtn.style.transform = 'translateY(-2px)';
        backBtn.style.boxShadow = '0 4px 12px rgba(48,72,160,0.3)';
      });
      
      backBtn.addEventListener('mouseout', () => {
        backBtn.style.transform = 'translateY(0)';
        backBtn.style.boxShadow = '0 2px 8px rgba(48,72,160,0.2)';
      });
      
      backBtn.addEventListener('click', goBack);
      
      return backBtn;
    }

    // --------- Función para regresar ---------
    function goBack() {
      if (level === "day-detail") {
        level = "day";
        renderTimeline();
      } else if (level === "day") {
        level = "month";
        renderTimeline();
      } else if (level === "month-detail") {
        level = "month";
        renderTimeline();
      } else if (level === "month") {
        if (current.from !== undefined && current.to !== undefined) {
          level = "year-detail";
        } else {
          level = "year";
        }
        renderTimeline();
      } else if (level === "year-detail") {
        level = "year";
        renderTimeline();
      }
    }

    // --------- Render Timeline Adaptativo ---------
    function renderTimeline(options = { animated: true }) {
      let items = [];
      
      // Limpiar timeline
      timeline.innerHTML = "";
      
      // Agregar botón de regresar si no estamos en el nivel principal
      if (level !== "year") {
        const backBtn = createBackButton();
        timeline.appendChild(backBtn);
      }
      
      // Crear contenedor para los items del timeline
      const timelineContainer = document.createElement('div');
      timelineContainer.className = 'logros__timeline-items';
      timelineContainer.style.cssText = `
        display: flex; gap: 12px; align-items: center; padding: 16px 0;
        overflow-x: auto; scroll-behavior: smooth;
      `;
      timeline.appendChild(timelineContainer);
      
      if (level === "year") {
        interval = getOptimalInterval('year');
        getYearTicks(interval).forEach(({ from, to }) => {
          items.push(createYearGroupItem(from, to, interval));
        });
        setFechaActual(current.from ? `${current.from} - ${current.to}` : `Años`);
        renderTimelineAnimated(items, timelineContainer, scrollToEnd);
      }
      else if (level === "year-detail" && current.from !== undefined && current.to !== undefined) {
        let detailInterval = getOptimalInterval('year', current.to - current.from + 1);
        getYearRange(current.from, current.to, detailInterval).forEach(({ from, to }) => {
          items.push(createYearGroupItem(from, to, detailInterval));
        });
        setFechaActual(`${current.from} - ${current.to}`);
        renderTimelineAnimated(items, timelineContainer, scrollToEnd);
      }
      else if (level === "month" && current.year) {
        let monthInterval = getOptimalInterval('month');
        getMonthTicks(monthInterval, current.year).forEach(({ from, to }) => {
          items.push(createMonthGroupItem(from, to, monthInterval));
        });
        setFechaActual(`${current.year}`);
        renderTimelineAnimated(items, timelineContainer, scrollToEnd);
      }
      else if (level === "month-detail" && current.from !== undefined && current.to !== undefined && current.year) {
        let detailInterval = getOptimalInterval('month', current.to - current.from + 1);
        getMonthRange(current.from, current.to, detailInterval, current.year).forEach(({ from, to }) => {
          items.push(createMonthGroupItem(from, to, detailInterval));
        });
        setFechaActual(`${current.year}: ${monthsNames[current.from - 1] || current.from} - ${monthsNames[current.to - 1] || current.to}`);
        renderTimelineAnimated(items, timelineContainer, scrollToEnd);
      }
      else if (level === "day" && current.year && current.month) {
        let dayInterval = getOptimalInterval('day');
        getDayTicks(dayInterval, current.year, current.month).forEach(({ from, to }) => {
          items.push(createDayGroupItem(from, to, dayInterval));
        });
        setFechaActual(`${current.year} - ${monthsNames[current.month - 1] || current.month}`);
        renderTimelineAnimated(items, timelineContainer, scrollToEnd);
      }
      else if (level === "day-detail" && current.from !== undefined && current.to !== undefined && current.year && current.month) {
        let detailInterval = 1; // Forzar días individuales
        getDayRange(current.from, current.to, detailInterval, current.year, current.month).forEach(({ from, to }) => {
          items.push(createDayGroupItem(from, to, detailInterval));
        });
        setFechaActual(`${current.year} - ${monthsNames[current.month - 1] || current.month} - Día ${current.from} - Día ${current.to}`);
        renderTimelineAnimated(items, timelineContainer, scrollToEnd);
      }
    }

    // --------- Crear items (dot rojo y modal bonito al click) ---------
    function createYearGroupItem(from, to, interval) {
      const div = document.createElement("button");
      div.type = "button";
      div.className = "logros__item";
      div.setAttribute("data-group-from", from);
      div.setAttribute("data-group-to", to);
      div.setAttribute("data-group-interval", interval);
      div.style.flex = "1 1 0";
      let hasEvento = hasEventInRange('year', from, to);
      div.innerHTML = `<div class="logros__dot${hasEvento ? ' logros__dot--evento' : ''}"></div>
        <div class="logros__label">${interval === 1 ? from : `${from} - ${to}`}</div>`;
      div.addEventListener("mouseenter", () => setFechaActual(interval === 1 ? from : `${from} - ${to}`));
      div.addEventListener("mouseleave", () => setFechaActual("Años"));
      return div;
    }
    function createMonthGroupItem(from, to, interval) {
      const div = document.createElement("button");
      div.type = "button";
      div.className = "logros__item";
      div.setAttribute("data-month-from", from);
      div.setAttribute("data-month-to", to);
      div.setAttribute("data-month-interval", interval);
      div.style.flex = "1 1 0";
      let label = interval === 1 ? monthsNames[from - 1] : `${monthsNames[from - 1]} - ${monthsNames[to - 1]}`;
      let hasEvento = hasEventInRange('month', from, to, current.year);
      div.innerHTML = `<div class="logros__dot${hasEvento ? ' logros__dot--evento' : ''}"></div>
        <div class="logros__label">${label}</div>`;
      div.addEventListener("mouseenter", () => setFechaActual(label));
      div.addEventListener("mouseleave", () => setFechaActual(`${current.year}`));
      return div;
    }
    function createDayGroupItem(from, to, interval) {
      const div = document.createElement("button");
      div.type = "button";
      div.className = "logros__item";
      div.setAttribute("data-day-from", from);
      div.setAttribute("data-day-to", to);
      div.setAttribute("data-day-interval", interval);
      div.style.flex = "1 1 0";
      let label = interval === 1 ? `Día ${from}` : `Día ${from} - ${to}`;
      let hasEvento = hasEventInRange('day', from, to, current.year, current.month);

      let logro = null;
      if (interval === 1 && hasEvento && logros[current.year]?.[current.month]?.[from]) {
        logro = logros[current.year][current.month][from];
      }

      div.innerHTML = `<div class="logros__dot${hasEvento ? ' logros__dot--evento' : ''}"></div>
        <div class="logros__label">${label}</div>`;

      if (logro) {
        div.addEventListener("click", (e) => {
          e.stopPropagation();
          showLogroModal(logro, e);
        });
        div.style.cursor = 'pointer';
        div.title = `Ver detalles: ${logro.titulo}`;
      } else {
        div.addEventListener("mouseenter", () => setFechaActual(label));
        div.addEventListener("mouseleave", () => setFechaActual(`${current.year} - ${monthsNames[current.month - 1] || current.month}`));
      }
      return div;
    }
    function setFechaActual(txt) { fechaActualDiv.textContent = txt; }

    // --------- Animación progresiva ---------
    function renderTimelineAnimated(items, container, cbAfter) {
      let i = 0;
      function next() {
        if (i >= items.length) {
          if (cbAfter) setTimeout(cbAfter, 150);
          return;
        }
        const item = items[i];
        container.appendChild(item);
        item.classList.add("anim-hide");
        setTimeout(() => {
          item.classList.remove("anim-hide");
          item.classList.add("anim-show");
        }, 8);
        i++;
        setTimeout(next, 30);
      }
      next();
    }

    // --------- Modal responsive y mejorado ---------
    function showLogroModal(logro, ev) {
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const isMobile = vw < 768;

      let html = `
        <button class="logros__modal-close" title="Cerrar" style="
          position: absolute; top: ${isMobile ? '12px' : '18px'}; right: ${isMobile ? '12px' : '18px'}; 
          font-size: ${isMobile ? '1.8rem' : '2.2rem'}; background: #fff; border: none; color: #3048a0; 
          cursor: pointer; border-radius: 50%; width: ${isMobile ? '32px' : '40px'}; height: ${isMobile ? '32px' : '40px'}; 
          box-shadow: 0 2px 8px rgba(48,72,160,0.08); transition: all 0.2s ease;
          z-index: 1001; display: flex; align-items: center; justify-content: center;
        " onmouseover="this.style.background='#f0f4ff'" onmouseout="this.style.background='#fff'">&times;</button>
        <div class="logro__padding" style="padding: ${isMobile ? '20px 16px' : '28px 24px'};">
      `;
      
      if (logro.titulo) html += `
        <h3 class="logro__h3" style="
          font-size: ${isMobile ? '1.8rem' : '2.6rem'}; font-weight: bold; color: #3048a0; 
          margin-bottom: 12px; letter-spacing: 0.5px; text-align: center; line-height: 1.2;
        ">${logro.titulo}</h3>
      `;
      
      if (logro.fecha) html += `
        <span class="logro__fecha" style="
          display: inline-block; background: linear-gradient(135deg, #eaf0ff 0%, #d4e4ff 100%); 
          color: #6270ba; font-size: ${isMobile ? '1rem' : '1.15rem'}; font-weight: 600;
          padding: 8px 16px; border-radius: 20px; margin-bottom: 20px; text-align: center; 
          box-shadow: 0 2px 4px rgba(98,112,186,0.1);
        ">${formatDate(logro.fecha)}</span>
      `;
      
      if (logro.descripcion) html += `
        <div class="logro__desc" style="
          font-size: ${isMobile ? '1rem' : '1.18rem'}; color: #333; margin: 20px 0 24px 0; 
          line-height: 1.7; background: linear-gradient(135deg, #f8faff 0%, #f0f6ff 100%); 
          border-radius: 12px; padding: ${isMobile ? '16px' : '20px'}; text-align: left;
          border-left: 4px solid #3048a0; box-shadow: 0 2px 8px rgba(48,72,160,0.05);
        ">${logro.descripcion}</div>
      `;
      
      if (logro.imagen) {
        html += `
          <div class="logro-modal__img-wrap" style="
            margin: 20px 0; text-align: center; border-radius: 12px; overflow: hidden;
            box-shadow: 0 4px 16px rgba(48,72,160,0.1);
          ">
            <img src="/build/img/logros/${logro.imagen}.png" alt="${logro.titulo}" 
                 class="logro-modal__img" style="
              width: 100%; height: auto; max-height: ${isMobile ? '250px' : '400px'}; 
              object-fit: cover; display: block; transition: transform 0.3s ease;
            " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
          </div>
        `;
      }

      if (logro.pdfs && Array.isArray(logro.pdfs) && logro.pdfs.length) {
        html += `
          <div style="margin-top: 24px;">
            <h4 style="
              font-size: ${isMobile ? '1.1rem' : '1.2rem'}; color: #3048a0; margin-bottom: 16px; 
              font-weight: 600; text-align: center; border-bottom: 2px solid #eaf0ff; 
              padding-bottom: 8px;
            ">📎 Archivos adjuntos</h4>
            <div style="
              display: grid; grid-template-columns: repeat(auto-fit, minmax(${isMobile ? '280px' : '300px'}, 1fr)); 
              gap: 12px; justify-content: center;
            ">
        `;
        logro.pdfs.forEach((pdf, index) => {
          html += `
            <a href="/build/pdfs/logros/${pdf}" target="_blank" style="
              display: flex; align-items: center; gap: 12px; 
              background: linear-gradient(135deg, #eaf0ff 0%, #d4e4ff 100%); 
              color: #3048a0; padding: ${isMobile ? '12px 16px' : '14px 18px'}; 
              border-radius: 12px; text-decoration: none; 
              font-size: ${isMobile ? '0.95rem' : '1.05rem'}; font-weight: 500;
              box-shadow: 0 3px 12px rgba(48,72,160,0.08); 
              transition: all 0.3s ease; border: 1px solid rgba(48,72,160,0.1);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(48,72,160,0.15)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 12px rgba(48,72,160,0.08)'">
              <svg width="${isMobile ? '20' : '24'}" height="${isMobile ? '20' : '24'}" fill="#3048a0" style="flex-shrink:0;" viewBox="0 0 24 24">
                <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828a2 2 0 0 0-.586-1.414l-5.828-5.828A2 2 0 0 0 12.172 2H6zm6 1.414L18.586 8H14a2 2 0 0 1-2-2V3.414zM6 4h6v2a4 4 0 0 0 4 4h4v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4zm2 8h8v2H8v-2zm0 4h8v2H8v-2z"/>
              </svg>
              <span style="flex: 1; word-break: break-word;">${pdf.length > 30 ? pdf.substring(0, 30) + '...' : pdf}</span>
              <svg width="16" height="16" fill="#6270ba" viewBox="0 0 24 24">
                <path d="M7 14l5-5 5 5z"/>
              </svg>
            </a>
          `;
        });
        html += `
            </div>
          </div>
        `;
      }
      html += `</div>`;
      
      // Aplicar estilos responsive al modal
      logrosModalContent.style.maxWidth = isMobile ? '95vw' : '600px';
      logrosModalContent.style.maxHeight = isMobile ? '90vh' : '80vh';
      logrosModalContent.style.margin = isMobile ? '20px' : '40px';
      
      logrosModalContent.innerHTML = html;
      logrosModal.style.display = 'flex';
      logrosModal.classList.add('active');
    }

    // Función para formatear fechas de manera más amigable
    function formatDate(dateStr) {
      try {
        const [year, month, day] = dateStr.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      } catch (e) {
        return dateStr; // Fallback a fecha original
      }
    }
    function hideLogroModal() {
      logrosModal.classList.remove('active');
      logrosModal.style.display = 'none';
      logrosModalContent.innerHTML = '';
    }
    // Cerrar por botón close o click fuera
    logrosModal.addEventListener('click', function (e) {
      if (e.target === logrosModal || e.target.classList.contains('logros__modal-close')) hideLogroModal();
    });

    // --------- Click en ítems para navegar (SIN SCROLL) ---------
    timeline.addEventListener('click', (e) => {
      const target = e.target.closest('.logros__item');
      if (!target) return;

      // Prevenir que se ejecute si ya se manejó el click (para modales)
      if (target.hasAttribute('data-modal-handled')) return;

      if (level === 'year') {
        let from = parseInt(target.getAttribute('data-group-from'));
        let to = parseInt(target.getAttribute('data-group-to'));
        let interval = parseInt(target.getAttribute('data-group-interval'));
        if (interval > 1) {
          level = 'year-detail';
          current = { from, to };
        } else {
          level = 'month';
          current = { year: from };
        }
      } else if (level === 'year-detail') {
        let from = parseInt(target.getAttribute('data-group-from'));
        let to = parseInt(target.getAttribute('data-group-to'));
        let interval = parseInt(target.getAttribute('data-group-interval'));
        if (interval > 1) {
          current = { from, to };
        } else {
          level = 'month';
          current = { year: from };
        }
      } else if (level === 'month') {
        let from = parseInt(target.getAttribute('data-month-from'));
        let to = parseInt(target.getAttribute('data-month-to'));
        let interval = parseInt(target.getAttribute('data-month-interval'));
        if (interval > 1) {
          level = 'month-detail';
          current = { year: current.year, from, to };
        } else {
          level = 'day';
          current = { year: current.year, month: from };
        }
      } else if (level === 'month-detail') {
        let from = parseInt(target.getAttribute('data-month-from'));
        let to = parseInt(target.getAttribute('data-month-to'));
        let interval = parseInt(target.getAttribute('data-month-interval'));
        if (interval > 1) {
          current = { year: current.year, from, to };
        } else {
          level = 'day';
          current = { year: current.year, month: from };
        }
      } else if (level === 'day') {
        let from = parseInt(target.getAttribute('data-day-from'));
        let to = parseInt(target.getAttribute('data-day-to'));
        let interval = parseInt(target.getAttribute('data-day-interval'));
        if (interval > 1) {
          level = 'day-detail';
          current = { year: current.year, month: current.month, from, to };
        }
        // Si interval === 1, el modal ya se maneja en createDayGroupItem
      }

      renderTimeline();
    });

    // --------- Auto-scroll al final ---------
    function scrollToEnd() { 
      const container = timeline.querySelector('.logros__timeline-items');
      if (container) {
        container.scrollLeft = container.scrollWidth; 
      }
    }

    // --------- Inicializa ---------
    fetchLogros().then(() => {
      renderTimeline();
      window.addEventListener('resize', () => setTimeout(renderTimeline, 200));
    });

  }

})();