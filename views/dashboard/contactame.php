<section class="contact" id="contact">
  <div class="contact__content">
    <h2 class="contact__title">Contáctame</h2>
    <p class="contact__text">¿Tienes alguna pregunta, propuesta o idea? ¡Hablemos!</p>

    <form class="contact__form" action="enviar.php" method="POST">
      <input type="text" name="nombre" placeholder="Tu nombre" required>
      <input type="email" name="email" placeholder="Tu correo" required>
      <textarea name="mensaje" rows="5" placeholder="Escribe tu mensaje..." required></textarea>
      <button type="submit">Enviar mensaje</button>
    </form>
  </div>
</section>
