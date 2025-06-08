const {
  SlashCommandBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  ComponentType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const Settings = require('../../database/schemas/Settings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Interactive bot setup (admin only)'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: '🚫 Admin only.', ephemeral: true });
    }

    await interaction.reply({ content: '🛠️ Starting setup...', ephemeral: true });

    const messagesToDelete = [interaction];

    const askText = async (label, defaultValue) => {
      const message = await interaction.followUp({ content: `${label}${defaultValue ? ` (default: \`${defaultValue}\`)` : ''}`, ephemeral: true });
      messagesToDelete.push(message);

      const collected = await interaction.channel.awaitMessages({
        filter: m => m.author.id === interaction.user.id,
        max: 1,
        time: 60000,
        errors: ['time']
      }).catch(() => {});

      if (!collected) return defaultValue;
      messagesToDelete.push(...collected.values());
      return collected.first().content || defaultValue;
    };

    const askRole = async (label) => {
      const roles = interaction.guild.roles.cache.filter(r => r.name !== '@everyone').map(r => ({ label: r.name, value: r.id })).slice(0, 25);
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`select_${label.toLowerCase().replace(/\s+/g, '_')}`)
        .setPlaceholder(`Select ${label}`)
        .addOptions(roles);

      const row = new ActionRowBuilder().addComponents(selectMenu);
      const msg = await interaction.followUp({ content: `Please select the **${label}**:`, components: [row], ephemeral: true });
      messagesToDelete.push(msg);

      const collected = await msg.awaitMessageComponent({ componentType: ComponentType.StringSelect, time: 60000 });
      messagesToDelete.push(collected);
      await collected.update({ content: `✅ Selected ${label}: <@&${collected.values[0]}>`, components: [], ephemeral: true });
      return collected.values[0];
    };

    const askChannel = async (label) => {
      const channelMenu = new ChannelSelectMenuBuilder()
        .setCustomId(`channel_${label.toLowerCase().replace(/\s+/g, '_')}`)
        .setPlaceholder(`Select ${label}`)
        .setMinValues(1)
        .setMaxValues(1)
        .addChannelTypes(0); // 0 = GUILD_TEXT

      const row = new ActionRowBuilder().addComponents(channelMenu);
      const msg = await interaction.followUp({ content: `Please select the **${label}**:`, components: [row], ephemeral: true });
      messagesToDelete.push(msg);

      const collected = await msg.awaitMessageComponent({ componentType: ComponentType.ChannelSelect, time: 60000 });
      messagesToDelete.push(collected);
      const selectedChannel = collected.values[0];
      await collected.update({ content: `✅ Selected ${label}: <#${selectedChannel}>`, components: [], ephemeral: true });
      return selectedChannel;
    };

    const askBoolean = async (label, defaultValue) => {
      const options = [
        { label: 'True', value: 'true' },
        { label: 'False', value: 'false' }
      ];

      const menu = new StringSelectMenuBuilder()
        .setCustomId(`bool_${label}`)
        .setPlaceholder(`${label} (default: ${defaultValue})`)
        .addOptions(options);

      const row = new ActionRowBuilder().addComponents(menu);
      const msg = await interaction.followUp({ content: `Enable **${label}**?`, components: [row], ephemeral: true });
      messagesToDelete.push(msg);

      const collected = await msg.awaitMessageComponent({ componentType: ComponentType.StringSelect, time: 60000 });
      messagesToDelete.push(collected);
      await collected.update({ content: `✅ ${label}: ${collected.values[0]}`, components: [], ephemeral: true });
      return collected.values[0] === 'true';
    };

    // Begin setup steps
    const prefix = await askText('Prefix', '!');
    const adminRole = await askRole('Admin Role');
    const modRole = await askRole('Moderator Role');
    const language = await askText('Language', 'en');
    const verify = await askBoolean('Verification', false);

    let verifyRole, verifyNRole, emailVerify;
    const verificationChannelId = await askChannel('Verification Channel');

    if (verify) {
      verifyNRole = await askRole('Default Role');
      verifyRole = await askRole('Verification Complete Role');
      emailVerify = await askBoolean('Require Email Verification', true);

      // ✅ Send verification message if just enabled
    
      const channel = await interaction.client.channels.fetch(verificationChannelId).catch(() => null);
      if (channel) {
        const embed = new EmbedBuilder()
          .setTitle('Verification Required')
          .setDescription('Click below to verify your account.')
          .setColor(0x00AE86);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('verify_start')
            .setLabel('Verify')
            .setStyle(ButtonStyle.Success)
        );

        await channel.send({ embeds: [embed], components: [row] });
      }
    }
    

    await Settings.findOneAndUpdate(
      { guildId: interaction.guild.id },
      {
        prefix,
        admins: [adminRole],
        moderators: [modRole],
        language,
        verify,
        verify_role: verifyRole || null,
        verify_nrole: verifyNRole || null,
        emailverify: emailVerify || false,
        email: 'bot@dev.croove.me',
        verificationChannelId
      },
      { upsert: true }
    );
    

    for (const m of messagesToDelete) {
      try {
        if (m.deletable) await m.delete();
      } catch {}
    }

    
  }
};
