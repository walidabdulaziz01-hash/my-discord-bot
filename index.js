const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// سيرفر وهمي للحفاظ على نشاط البوت على Render
http.createServer((req, res) => {
    res.write('Status: Online');
    res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

const GUILD_ID = '1488155566499958784';
const CHANNEL_ID = '1500725529777799239';

client.once('ready', () => {
    console.log(`البوت جاهز: ${client.user.tag}`);
    joinVoice();
});

function joinVoice() {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;
    
    const channel = guild.channels.cache.get(CHANNEL_ID);
    if (!channel) return;

    joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: true, // يضع البوت على وضعية "الصامت" تلقائياً لتقليل الضغط
    });
    console.log("تم دخول الروم بنجاح");
}

// إعادة المحاولة كل 5 دقائق لضمان البقاء
setInterval(() => {
    joinVoice();
}, 300000); 

client.login(process.env.TOKEN);