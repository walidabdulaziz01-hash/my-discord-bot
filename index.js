const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

// تأكد من أرقام الـ IDs الخاصة بك هنا
const GUILD_ID = '1488155566499958784'; 
const CHANNEL_ID = '1500725529777799239';

client.once('ready', () => {
    console.log(`تم تشغيل البوت: ${client.user.tag}`);
    joinChannel();
});

function joinChannel() {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return console.log("خطأ: لم يتم العثور على السيرفر");

    const channel = guild.channels.cache.get(CHANNEL_ID);
    if (!channel) return console.log("خطأ: لم يتم العثور على الروم الصوتي");

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id, // تم التصحيح هنا ليكون رقم السيرفر
        adapterCreator: guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            connection.destroy();
            joinChannel(); 
        } catch (error) {
            joinChannel();
        }
    });
}

// ضع التوكن الخاص بك هنا بين علامتي التنصيص
client.login('process.env.token');