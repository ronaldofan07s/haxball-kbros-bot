import HaxballJS from 'haxball.js';

const token = process.env.HAXBALL_TOKEN;

if (!token) {
  throw new Error("Falta configurar HAXBALL_TOKEN en el servidor.");
}

HaxballJS().then((HBInit) => {
  const room = HBInit({
    roomName: "🟣 • los kbros sala oficial",
    maxPlayers: 16,
    public: true,
    geo: { code: "ar", lat: -31.416, lon: -64.183 },
    token,
    noPlayer: true
  });

  console.log("¡Sala 'los kbros sala oficial' iniciada con éxito!");

  room.onRoomLink = (link) => {
    console.log("Link de la sala:", link);
  };

  room.onPlayerJoin = (player) => {
    const nombre = player.name.trim().toUpperCase();

    if (nombre === "NARDOSKI") {
      room.setPlayerAdmin(player.id, true);
      room.sendAnnouncement(
        "👑 ¡NARDOSKI entró a la sala y recibió superadmin!",
        null,
        0xFFD700,
        "bold",
        2
      );
    } else {
      room.sendAnnouncement(
        "¡Bienvenido a la sala de los kbros oficial, " + player.name + "!",
        player.id,
        0x00FF00,
        "normal",
        1
      );
    }
  };

  const INTERVALO = 3 * 60 * 1000;

  const mensajes = [
    "📢 [sacatangas] Discord de los KBROS: https://discord.gg/MeRvuRBvQk",
    "📱 [sacatangas] Canal de WhatsApp de los KBROS: https://whatsapp.com/channel/0029VbDE6uH6LwHgmDbwoD2q",
    "🔴 [sacatangas] Twitch de CXNNARD: https://www.twitch.tv/cxnnard"
  ];

  let index = 0;

  setInterval(() => {
    room.sendAnnouncement(
      mensajes[index],
      null,
      0x00BFFF,
      "bold",
      1
    );

    index = (index + 1) % mensajes.length;
  }, INTERVALO);
}).catch((err) => {
  console.error("Error al iniciar HaxBallJS:", err);
});
