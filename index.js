import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { Utils, Room } = require('node-haxball')();

const ROOM_LINK = process.env.HAXBALL_ROOM_LINK || 'https://www.haxball.com/play?c=7T20JsIjnkY';
const ROOM_PASSWORD = process.env.HAXBALL_ROOM_PASSWORD || null;
const ROOM_ID = new URL(ROOM_LINK).searchParams.get('c');

if (!ROOM_ID) {
  throw new Error('El link de HaxBall no es válido.');
}

const mensajes = [
  '📢 Discord de los KBROS: https://discord.gg/MeRvuRBvQk',
  '📱 WhatsApp de los KBROS: https://whatsapp.com/channel/0029VbDE6uH6LwHgmDbwoD2q',
  '🔴 Twitch de CXNNARD: https://www.twitch.tv/cxnnard'
];

let reconnectTimer = null;

function programarReintento() {
  if (reconnectTimer) return;

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    conectar();
  }, 15000);
}

function conectar() {
  console.log(`🤖 sacatangas intentando entrar a la sala ${ROOM_ID}...`);

  Utils.generateAuth().then(([authKey, authObj]) => {
    Room.join(
      {
        id: ROOM_ID,
        password: ROOM_PASSWORD,
        authObj
      },
      {
        storage: {
          player_name: 'sacatangas',
          avatar: '📢',
          player_auth_key: authKey
        },

        onOpen: (room) => {
          console.log(`✅ sacatangas entró a: ${room.name}`);
          room.sendChat('🤖 sacatangas conectado a la sala de los kbros.');

          room.onPlayerJoin = (player) => {
            const nombre = (player.name || '').trim().toUpperCase();

            if (nombre === 'SACATANGAS') return;

            if (nombre === 'NARDOSKI') {
              room.sendChat('👑 ¡NARDOSKI entró a la sala!');
            } else {
              room.sendChat(`👋 ¡Bienvenido a la sala de los kbros oficial, ${player.name}!`);
            }
          };

          let index = 0;

          setInterval(() => {
            room.sendChat(`📣 [sacatangas] ${mensajes[index]}`);
            index = (index + 1) % mensajes.length;
          }, 3 * 60 * 1000);

          room.onClose = (error) => {
            console.log('⚠️ sacatangas salió de la sala:', error || 'sala cerrada');
            programarReintento();
          };
        },

        onClose: (error) => {
          console.log('⚠️ Conexión cerrada:', error || 'motivo desconocido');
          programarReintento();
        }
      }
    );
  }).catch((err) => {
    console.error('❌ Error preparando la conexión:', err);
    programarReintento();
  });
}

conectar();
