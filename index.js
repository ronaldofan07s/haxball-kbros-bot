const http = require('http');
const HBInit = require('haxball.js');

// 1. Servidor HTTP para Render
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot HaxBall de los kbros activo 24/7!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor web interno corriendo en el puerto ${PORT}`);
});

// 2. Inicialización del bot de HaxBall optimizada para entornos sin pantalla (headless)
HBInit({
  roomName: "los kbros sala oficial",
  maxPlayers: 16,
  public: true,
  geo: { code: "ar", lat: -31.416, lon: -64.183 },
  botName: "sacatangas",
  noHeadless: true // <--- Esto le avisa que corra en modo consola pura sin exigir navegador gráfico
}).then((room) => {
  console.log("¡Sala 'los kbros sala oficial' iniciada con éxito!");

  room.onPlayerJoin = (player) => {
    if (player.name.toUpperCase().includes("NARDOWSKI")) {
      room.setPlayerAdmin(player.id, true);
      room.sendAnnouncement(`👑 ¡Atención! El jefe supremo NARDOWSKI ha entrado a la sala.`, null, 0xFFD700, "bold", 2);
    } else {
      room.sendAnnouncement(`¡Bienvenido a los kbros, ${player.name}! Disfrutá del fulbito.`, player.id, 0x00FF00, "normal", 1);
    }
  };

  const INTERVALO = 3 * 60 * 1000;
  const mensajes = [
    "📢 Unite al Discord de la comunidad: https://discord.gg/MeRvuRBvQk",
    "📱 Sumate al canal de WhatsApp de los kbros: https://whatsapp.com/channel/0029VbDE6uH6LwHgmDbwoD2q",
    "🔴 Pasate por el Twitch de cxnnard y dejá tu follow: https://www.twitch.tv/cxnnard"
  ];

  let index = 0;
  setInterval(() => {
    room.sendAnnouncement(`[sacatangas] ${mensajes[index]}`, null, 0x00BFFF, "bold", 1);
    index = (index + 1) % mensajes.length;
  }, INTERVALO);

}).catch((err) => {
  console.error("Error al iniciar la sala:", err);
});
