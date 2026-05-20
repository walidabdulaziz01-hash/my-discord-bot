const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState, VoiceConnectionDisconnectReason } = require('@discordjs/voice');
const http = require('http');

http.createServer((req, res) => {
  res.write('Bot is alive');
  res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

const GUILD_ID = '1488155566499958784';
const CHANNEL_ID = '1500725529777799239';

client.once('ready', () => {
    console.log(`تم تشغيل البوت: ${client.user.tag}`);
    connectToChannel();
});

async function connectToChannel() {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return console.log("خطأ: لم يتم العثور على السيرفر");

    const channel = guild.channels.cache.get(CHANNEL_ID);
    if (!channel) return console.log("خطأ: لم يتم العثور على الروم الصوتي");

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
        } catch (error) {
            connection.destroy();
            connectToChannel(); // إعادة محاولة الاتصال
        }
    });
}

client.login(process.env.TOKEN);