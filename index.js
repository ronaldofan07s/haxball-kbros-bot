import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { Utils, Room } = require('node-haxball')();

const roomLink = process.env.HAXBALL_ROOM_LINK;
const roomPassword = process.env.HAXBALL_ROOM_PASSWORD || null;

if (!roomLink) {
  throw new Error('Falta configurar HAXBALL_ROOM_LINK con el link de tu sala de HaxBall.');
}

const roomId = new URL(roomLink).searchParams.get('c');

if (!roomId) {
  throw new Error('El HAXBALL_ROOM_LINK no parece ser un link válido de HaxBall.');
}

console.log(`sacatangas intentando entrar a la sala ${roomId}...`);

Utils.generateAuth().then(([, authObj]) => {
  Room.join(
    {
      id: roomId,
      password: roomPassword,
      authObj
    },
    {
      storage: {
        player_name: 'sacatangas',
        avatar: '📢'
      },
      onOpen: (room) => {
        console.log(`sacatangas entró a: ${room.name}`);

        room.sendChat('🤖 sacatangas conectado a la sala de los kbros.');

        room.onPlayerJoin = (player) => {
          const nombre = player.name.trim().toUpperCase();

          if (nombre === 'SACATANGAS') return;

          if (nombre === 'NARDOSKI') {
            room.sendChat('👑 ¡NARDOSKI entró a la sala!');
          } else {
            room.sendChat(`👋 ¡Bienvenido a la sala de los kbros oficial, ${player.name}!`);
          }
        };

        const mensajes = [
          '📢 Discord de los KBROS: https://discord.gg/MeRvuRBvQk',
          '📱 WhatsApp de los KBROS: https://whatsapp.com/channel/0029VbDE6uH6LwHgmDbwoD2q',
          '🔴 Twitch de CXNNARD: https://www.twitch.tv/cxnnard'
        ];

        let index = 0;

        setInterval(() => {
          room.sendChat(`📣 [sacatangas] ${mensajes[index]}`);
          index = (index + 1) % mensajes.length;
        }, 3 * 60 * 1000);
      }
    }
  );
}).catch((err) => {
  console.error('No se pudo conectar sacatangas a la sala:', err);
});
