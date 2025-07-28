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

  // ---- Función: intervalo óptimo (debe ir arriba) ----
  function getOptimalInterval(mode, rangeLength) {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const maxItems = vw < 600 ? 8 : 15;
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
    if (rangeLength > maxItems * 2) return vw < 600 ? 20 : 10;
    if (rangeLength > maxItems * 1.4) return 10;
    if (rangeLength > maxItems) return 5;
    if (rangeLength > maxItems / 1.5) return 3;
    if (rangeLength > 6) return 2;
    return 1;
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

    // --------- Agrupación adaptativa ---------
    function getYearTicks(interval) {
      let arr = [];
      let y = YEAR_START;
      while (y <= YEAR_END) {
        let to = Math.min(y + interval - 1, YEAR_END);
        arr.push({ from: y, to });
        y = to + 1;
      }
      return arr;
    }
    function getYearRange(from, to, interval = 1) {
      let arr = [];
      let y = from;
      while (y <= to) {
        let t = Math.min(y + interval - 1, to);
        arr.push({ from: y, to: t });
        y = t + 1;
      }
      return arr;
    }
    function getMonthTicks(interval, year) {
      let last = (year == YEAR_END) ? MONTH_END : 12;
      let arr = [];
      let m = 1;
      while (m <= last) {
        let to = Math.min(m + interval - 1, last);
        arr.push({ from: m, to });
        m = to + 1;
      }
      return arr;
    }
    function getMonthRange(from, to, interval = 1, year) {
      let last = (year == YEAR_END) ? MONTH_END : 12;
      let arr = [];
      let m = from;
      while (m <= to) {
        let t = Math.min(m + interval - 1, to);
        arr.push({ from: m, to: t });
        m = t + 1;
      }
      return arr;
    }
    function getDayTicks(interval, year, month) {
      let daysInMonth = new Date(year, month, 0).getDate();
      let last = (year == YEAR_END && month == MONTH_END) ? DAY_END : daysInMonth;
      let arr = [];
      let d = 1;
      while (d <= last) {
        let to = Math.min(d + interval - 1, last);
        arr.push({ from: d, to });
        d = to + 1;
      }
      return arr;
    }
    function getDayRange(from, to, interval = 1, year, month) {
      let daysInMonth = new Date(year, month, 0).getDate();
      let last = (year == YEAR_END && month == MONTH_END) ? DAY_END : daysInMonth;
      let arr = [];
      let d = from;
      while (d <= to) {
        let t = Math.min(d + interval - 1, to);
        arr.push({ from: d, to: t });
        d = t + 1;
      }
      return arr;
    }

    // --------- Render Timeline Adaptativo ---------
    function renderTimeline(options = { animated: true }) {
      let items = [];
      if (level === "year") {
        interval = getOptimalInterval('year');
        getYearTicks(interval).forEach(({ from, to }) => {
          items.push(createYearGroupItem(from, to, interval));
        });
        setFechaActual(current.from ? `${current.from} - ${current.to}` : `Años`);
        renderTimelineAnimated(items, scrollToEnd);
      }
      else if (level === "year-detail" && current.from !== undefined && current.to !== undefined) {
        let detailInterval = getOptimalInterval('year', current.to - current.from + 1);
        getYearRange(current.from, current.to, detailInterval).forEach(({ from, to }) => {
          items.push(createYearGroupItem(from, to, detailInterval));
        });
        setFechaActual(`${current.from} - ${current.to}`);
        renderTimelineAnimated(items, scrollToEnd);
      }
      else if (level === "month" && current.year) {
        let monthInterval = getOptimalInterval('month');
        getMonthTicks(monthInterval, current.year).forEach(({ from, to }) => {
          items.push(createMonthGroupItem(from, to, monthInterval));
        });
        setFechaActual(`${current.year}`);
        renderTimelineAnimated(items, scrollToEnd);
      }
      else if (level === "month-detail" && current.from !== undefined && current.to !== undefined && current.year) {
        let detailInterval = getOptimalInterval('month', current.to - current.from + 1);
        getMonthRange(current.from, current.to, detailInterval, current.year).forEach(({ from, to }) => {
          items.push(createMonthGroupItem(from, to, detailInterval));
        });
        setFechaActual(`${current.year}: ${monthsNames[current.from - 1] || current.from} - ${monthsNames[current.to - 1] || current.to}`);
        renderTimelineAnimated(items, scrollToEnd);
      }
      else if (level === "day" && current.year && current.month) {
        let dayInterval = getOptimalInterval('day');
        getDayTicks(dayInterval, current.year, current.month).forEach(({ from, to }) => {
          items.push(createDayGroupItem(from, to, dayInterval));
        });
        setFechaActual(`${current.year} - ${monthsNames[current.month - 1] || current.month}`);
        renderTimelineAnimated(items, scrollToEnd);
      }
      else if (level === "day-detail" && current.from !== undefined && current.to !== undefined && current.year && current.month) {
        let detailInterval = 1; // Forzar días individuales
        getDayRange(current.from, current.to, detailInterval, current.year, current.month).forEach(({ from, to }) => {
          items.push(createDayGroupItem(from, to, detailInterval));
        });
        setFechaActual(`${current.year} - ${monthsNames[current.month - 1] || current.month} - Día ${current.from} - Día ${current.to}`);
        renderTimelineAnimated(items, scrollToEnd);
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
          showLogroModal(logro, e);
        });
      } else {
        div.addEventListener("mouseenter", () => setFechaActual(label));
        div.addEventListener("mouseleave", () => setFechaActual(`${current.year} - ${monthsNames[current.month - 1] || current.month}`));
      }
      return div;
    }
    function setFechaActual(txt) { fechaActualDiv.textContent = txt; }

    // --------- Animación progresiva ---------
    function renderTimelineAnimated(items, cbAfter) {
      timeline.innerHTML = "";
      let i = 0;
      function next() {
        if (i >= items.length) {
          if (cbAfter) setTimeout(cbAfter, 150);
          return;
        }
        const item = items[i];
        timeline.appendChild(item);
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

    // --------- Modal mostrar/ocultar ---------
    function showLogroModal(logro, ev) {

      

      let html = `
        <button class="logros__modal-close" title="Cerrar" style="
          position: absolute; top: 18px; right: 18px; font-size: 2.2rem; background: #fff; border: none; color: #3048a0; cursor: pointer; border-radius: 50%; width: 40px; height: 40px; box-shadow: 0 2px 8px rgba(48,72,160,0.08); transition: background 0.2s;
        ">&times;</button>
        <div class="logro__padding">
      `;
      if (logro.titulo) html += `
        <h3 class="logro__h3" style="
          font-size: 2.6rem; font-weight: bold; color: #3048a0; margin-bottom: 8px; letter-spacing: 0.5px; text-align:center;
        ">${logro.titulo}</h3>
      `;
      if (logro.fecha) html += `
        <span class="logro__fecha" style="
          display: block; background: #eaf0ff; color: #6270ba; font-size: 1.15rem; padding: 4px 12px; border-radius: 8px; margin-bottom: 18px; margin-top: 2px; text-align:center; margin-left:auto; margin-right:auto; width:fit-content;
        ">${logro.fecha}</span>
      `;
      if (logro.descripcion) html += `
        <div class="logro__desc" style="
          font-size: 1.18rem; color: #222; margin: 18px 0 24px 0; line-height: 1.6; background: #f8faff; border-radius: 8px; padding: 16px 14px; text-align:center;
        ">${logro.descripcion}</div>
      `;
      if (logro.imagen) {
        html += `
    <div class="logro-modal__img-wrap">
      <img src="/build/img/logros/${logro.imagen}.png" alt="${logro.titulo}" class="logro-modal__img">
    </div>
  `;
      }


      if (logro.pdfs && Array.isArray(logro.pdfs) && logro.pdfs.length) {
        html += `
          <div style="margin-top: 18px;">
        <h4 style="font-size: 1.15rem; color: #3048a0; margin-bottom: 8px; font-weight: 600; text-align:center;">Archivos adjuntos:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">
        `;
        logro.pdfs.forEach(pdf => {
          html += `
        <a href="/build/pdfs/logros/${pdf}" target="_blank" style="
          display: flex; align-items: center; gap: 8px; background: #eaf0ff; color: #3048a0; padding: 8px 18px; border-radius: 7px; text-decoration: none; font-size: 1.07rem; box-shadow: 0 2px 8px rgba(48,72,160,0.06); transition: background 0.2s;
        ">
          <svg width="22" height="22" fill="#3048a0" style="flex-shrink:0;" viewBox="0 0 24 24"><path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828a2 2 0 0 0-.586-1.414l-5.828-5.828A2 2 0 0 0 12.172 2H6zm6 1.414L18.586 8H14a2 2 0 0 1-2-2V3.414zM6 4h6v2a4 4 0 0 0 4 4h4v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4zm2 8h8v2H8v-2zm0 4h8v2H8v-2z"/></svg>
          ${pdf}
        </a>
          `;
        });
        html += `
        </div>
          </div>
        `;
      }
      html += `</div>`;
      logrosModalContent.innerHTML = html;
      logrosModal.style.display = 'flex';
      logrosModal.classList.add('active');
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

    // --------- Zoom granularidad (Wheel) ---------
    timeline.addEventListener("wheel", function (e) {
      const target = e.target.closest('.logros__item');
      if (!target) return;
      if (Math.abs(e.deltaX) < 5) {
        e.preventDefault();
        // Zoom in
        if (e.deltaY < 0) {
          if (level === "year") {
            let from = parseInt(target.getAttribute("data-group-from"));
            let to = parseInt(target.getAttribute("data-group-to"));
            let interval = parseInt(target.getAttribute("data-group-interval"));
            if (interval > 1) {
              level = "year-detail";
              current = { from, to };
              renderTimeline();
              animateExpand(target, 1.08);
            } else {
              level = "month";
              current = { year: from };
              renderTimeline();
              animateExpand(target, 1.12);
            }
          } else if (level === "year-detail") {
            let from = parseInt(target.getAttribute("data-group-from"));
            let to = parseInt(target.getAttribute("data-group-to"));
            let interval = parseInt(target.getAttribute("data-group-interval"));
            if (interval > 1) {
              level = "year-detail";
              current = { from, to };
              renderTimeline();
              animateExpand(target, 1.08);
            } else {
              level = "month";
              current = { year: from };
              renderTimeline();
              animateExpand(target, 1.12);
            }
          } else if (level === "month") {
            let from = parseInt(target.getAttribute("data-month-from"));
            let to = parseInt(target.getAttribute("data-month-to"));
            let interval = parseInt(target.getAttribute("data-month-interval"));
            if (interval > 1) {
              level = "month-detail";
              current = { year: current.year, from, to };
              renderTimeline();
              animateExpand(target, 1.12);
            } else {
              level = "day";
              current = { year: current.year, month: from };
              renderTimeline();
              animateExpand(target, 1.14);
            }
          } else if (level === "month-detail") {
            let from = parseInt(target.getAttribute("data-month-from"));
            let to = parseInt(target.getAttribute("data-month-to"));
            let interval = parseInt(target.getAttribute("data-month-interval"));
            if (interval > 1) {
              level = "month-detail";
              current = { year: current.year, from, to };
              renderTimeline();
              animateExpand(target, 1.12);
            } else {
              level = "day";
              current = { year: current.year, month: from };
              renderTimeline();
              animateExpand(target, 1.14);
            }
          } else if (level === "day") {
            let from = parseInt(target.getAttribute("data-day-from"));
            let to = parseInt(target.getAttribute("data-day-to"));
            let interval = parseInt(target.getAttribute("data-day-interval"));
            if (interval > 1) {
              level = "day-detail";
              current = { year: current.year, month: current.month, from, to };
              renderTimeline();
              animateExpand(target, 1.14);
            }
          }
        }
        // Zoom out
        else if (e.deltaY > 0) {
          if (level === "day-detail") {
            level = "day";
            renderTimeline();
            animateExpand(target, 1.07, false);
          } else if (level === "day") {
            level = "month";
            renderTimeline();
            animateExpand(target, 1.05, false);
          } else if (level === "month-detail") {
            level = "month";
            renderTimeline();
            animateExpand(target, 1.04, false);
          } else if (level === "month") {
            level = "year-detail";
            renderTimeline();
            animateExpand(target, 1.04, false);
          } else if (level === "year-detail") {
            level = "year";
            renderTimeline();
            animateExpand(target, 1.02, false);
          }
        }
      }
    }, { passive: false });

    function animateExpand(target, scale, isIn = true) {
      if (!target) return;
      target.classList.add("expanded");
      target.style.transform = `scale(${scale})`;
      setTimeout(() => {
        target.style.transform = "";
        if (!isIn) target.classList.remove("expanded");
      }, 340);
    }

    // --------- Scroll horizontal suave (drag) ---------
    let isDown = false, startX, scrollLeft;
    timeline.addEventListener('mousedown', (e) => {
      isDown = true;
      timeline.classList.add('active');
      startX = e.pageX - timeline.offsetLeft;
      scrollLeft = timeline.scrollLeft;
    });
    document.addEventListener('mouseup', () => {
      isDown = false;
      timeline.classList.remove('active');
    });
    timeline.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - timeline.offsetLeft;
      const walk = (x - startX) * 1.1;
      timeline.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    let touchStartX = 0, touchScrollLeft = 0;
    timeline.addEventListener('touchstart', e => {
      isDown = true;
      touchStartX = e.touches[0].pageX - timeline.offsetLeft;
      touchScrollLeft = timeline.scrollLeft;
    });
    timeline.addEventListener('touchend', () => { isDown = false; });
    timeline.addEventListener('touchmove', e => {
      if (!isDown) return;
      const x = e.touches[0].pageX - timeline.offsetLeft;
      const walk = (x - touchStartX) * 1.1;
      timeline.scrollLeft = touchScrollLeft - walk;
    });

    // --------- Click en ítems para navegar ---------
    timeline.addEventListener('click', (e) => {
      const target = e.target.closest('.logros__item');
      if (!target) return;

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
      }

      renderTimeline();
    });

    // --------- Click fuera para volver atrás ---------
    document.addEventListener("click", function (e) {
      if (logrosModal.classList.contains('active')) return;
      if (!e.target.closest('.logros__item')) {
        if (level === "day-detail") { level = "day"; renderTimeline(); }
        else if (level === "day") { level = "month"; renderTimeline(); }
        else if (level === "month-detail") { level = "month"; renderTimeline(); }
        else if (level === "month") { level = "year-detail"; renderTimeline(); }
        else if (level === "year-detail") { level = "year"; renderTimeline(); }
      }
    });

    // --------- Auto-scroll al final ---------
    function scrollToEnd() { timeline.scrollLeft = timeline.scrollWidth; }

    // --------- Inicializa ---------
    fetchLogros().then(() => {
      renderTimeline();
      window.addEventListener('resize', () => setTimeout(renderTimeline, 200));
    });

  }

})();
