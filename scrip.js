    VANTA.BIRDS({
      el: "body",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      backgroundColor: 0xffffff,
      color1: 0x000,
      color2: 0x000,
      birdSize: 1.10,
      wingSpan: 18.00,
      speedLimit: 8.00,
      separation: 27.00,
      alignment: 17.00,
      cohesion: 26.00,
      quantity: 3.00
    })

    window.addEventListener('load', function() {
      const nameDiv = document.querySelector('.name');
      nameDiv.classList.add('reveal');
  });