const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const http = require('http');

// إنشاء سيرفر وهمي للاستضافة عشان ما يقفل البوت
http.createServer((req, res) => {
    res.write("I am alive");
    res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const GUILD_ID = '1488155566499958784';
const CHANNEL_ID = '1500725529777799239';
const BOT_TOKEN = process.env.BOT_TOKEN; // سحبنا التوكن هنا للأمان منعاً لسرقته

client.once('ready', () => {
    console.log(`تم تشغيل البوت بنجاح: ${client.user.tag}`);

    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return console.log("خطأ: لم يتم العثور على السيرفر.");

    const channel = guild.channels.cache.get(CHANNEL_ID);
    if (!channel) return console.log("خطأ: لم يتم العثور على الروم الصوتي.");

    connectToVoice(channel);
});

function connectToVoice(channel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true, 
        selfMute: false
    });

    const player = createAudioPlayer();
    connection.subscribe(player);

    console.log(`البوت متصل الآن في روم: ${channel.name}`);

    connection.on('disconnected', async () => {
        console.log("تم فصل البوت، جارٍ إعادة الاتصال...");
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
        } catch (error) {
            setTimeout(() => connectToVoice(channel), 5000);
        }
    });
}

client.login(BOT_TOKEN);