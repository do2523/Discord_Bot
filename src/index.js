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

let everyone = new Map();

client.on('ready', (bot) => {
  console.log(`${bot.user.tag} is online!`);
});

client.on('ready', async () => {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  if (guild) {
    console.log("test");
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

  let user = interaction.user;

  if (interaction.commandName === 'points') {
    let points = everyone.get(user.username) ?? 0;
    return interaction.reply(`You currently have ${points} points!`);
  }
  if (interaction.commandName === 'scoreboard') {
    let members = await interaction.guild.members.fetch();

    for (const [_, member] of members) {
      if(everyone.get(member.user.username) !== undefined) continue;

      everyone.set(member.user.username, 0);
    }


    return interaction.reply("everyone's points: " + JSON.stringify(Array.from(everyone.entries()))); 
  }

  if (interaction.commandName === 'more_points') {
    try {
      let previousPoints = everyone.get(user.username) ?? 0;

      everyone.set(user.username, ++previousPoints);

      console.log(`${user.username} has been given a point!`);
      return interaction.reply("You have been given a point " + user.username + "!");
    } catch (error) {
      console.error('Error fetching user:', error);
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
