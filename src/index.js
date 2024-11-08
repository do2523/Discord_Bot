require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

let points = 0;

everyone = new Map();

client.on('ready', (c) => {
  console.log(`✅ ${c.user.tag} is online.`);
});

client.on('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (guild) {
    try {
      const members = await guild.members.fetch();
      members.forEach(member => {
        everyone.set(member.user.username, 0);
      });
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  }
});



client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'points') {
    return interaction.reply('You currently have ' + points + ' points!');
  }
  if (interaction.commandName === 'scoreboard') {
    return interaction.reply("everyone's points: " + JSON.stringify(Array.from(everyone.entries()))); 
  }

  if (interaction.commandName === 'more_points') {
    try {
      everyone.set("daniel_3117", points += 1)
      const daniel = await client.users.fetch(DANIEL_ID);
      console.log(`${daniel.username} has been given a point!`);
      return interaction.reply("You have been given a point " + daniel.username + "!");
    } catch (error) {
      console.error('Error fetching Daniel:', error);
      return interaction.reply("An error occurred while fetching the user's information.");
    }
  }
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  // if (message.content === 'hello') {
  //   message.reply('hello');
  // }
});

client.login(process.env.TOKEN);
