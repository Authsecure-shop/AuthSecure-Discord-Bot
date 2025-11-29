const fs = require("fs");
const path = require("path");

function loadCommands(client) {
    client.commands = new Map();
    const commands = [];

    const commandsPath = path.join(__dirname, "..", "commands");

    const folders = fs.readdirSync(commandsPath);

    for (const folder of folders) {
        const folderPath = path.join(commandsPath, folder);
        const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);

            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }
    return commands;
}

module.exports = { loadCommands };
