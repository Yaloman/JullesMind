const { SlashCommandBuilder } = require('discord.js');
const saveMessage = require('../../handlers/saveMemory');
const getBotReply = require('../../handlers/getResponse');
const { startConversation } = require('../../utils/conversationManager');

const MAX_DISCORD_LENGTH = 2000;

function splitMessageWithPrefix(content, prefix = '', suffix = '') {
  const maxLength = MAX_DISCORD_LENGTH - prefix.length - suffix.length;
  const parts = [];

  while (content.length > maxLength) {
    let sliceIndex = content.lastIndexOf('\n', maxLength);
    if (sliceIndex === -1) sliceIndex = maxLength;

    parts.push(content.slice(0, sliceIndex));
    content = content.slice(sliceIndex);
  }

  if (content.length > 0) parts.push(content);

  return parts;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Start a chat with AI')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('What do you want to say to the AI?')
        .setRequired(true)
    ),
  async execute(interaction) {
    console.log("Ai Feature Engaged")
    const prompt = interaction.options.getString('prompt');
    const userId = interaction.user.id;
    

    await interaction.deferReply();

    await saveMessage(userId, prompt);
    const response = await getBotReply(userId, prompt);
    await saveMessage(userId, response);
    


    // Split and send message chunks
    const messageParts = splitMessageWithPrefix(response);
    const totalParts = messageParts.length;

    await interaction.editReply(`**Part 1/${totalParts}**\n${messageParts[0]}`);

    for (let i = 1; i < totalParts; i++) {
      await interaction.channel.send(`**Part ${i + 1}/${totalParts}**\n${messageParts[i]}`);
    }
    console.log("Ai Feature Active")

    startConversation(userId, async () => {
      await interaction.channel.send(`<@${userId}> AI chat ended due to inactivity.`);
      console.log("Ai Feature Ended")
    });
  }
};
