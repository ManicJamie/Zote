const {MessageAttachment, MessageEmbed} = require('discord.js');
const Discord = require('discord.js');
const Files = require('fs')
require('dotenv').config();
const bot = new Discord.Client();
var fileList = Files.readdirSync(__dirname);
var list = [];
const pastaKing = new MessageAttachment('PastaZote.png');
var flag = true;
const preceptsFile = Files.readFileSync('precept.txt') + '';
var precepts = [];

for(let i = 0; i < fileList.length; i++) {
    if(fileList[i].substring(fileList[i].length - 4) == '.txt') {
        list.push(fileList[i].substring(0, fileList[i].length - 4));
    }
}

for(let i = 1; i < 58; i++) {
    precepts.push(preceptsFile.substring(preceptsFile.indexOf(i) + 2, preceptsFile.indexOf(i + 1)).replace('<page>', '\n'));
}

bot.on('ready', () => {
    bot.user.setActivity('The Eternal Ordeal', {type: 'COMPETING'})
});

bot.on('message', async message => {
    // do something with message
    console.log(message.content)

    if (message.content.charAt(0) == '~' && message.content.charAt(1) != '~') {
        if(flag) {
            list = [];
            fileList = Files.readdirSync(__dirname);
            for(let i = 0; i < fileList.length; i++) {
                if(fileList[i].substring(fileList[i].length - 4) == '.txt') {
                    list.push(fileList[i].substring(0, fileList[i].length - 4));
                }
            }
            flag = false;
        }
        temp = list.indexOf(message.content.substring(1));
        if (message.content == '~pasta') {
            await message.channel.send(pastaKing)
        } else if (message.content == '~list') {
            await message.channel.send(list.join(', '))
        } else if (message.content.substring(0, 8) == '~precept') {
            await message.channel.send(precepts[Math.floor(Math.random() * 57) + 1])
        } else if (message.content.length > 6 && message.member.roles.cache.some(role => role.name === 'Discord Mod') && (message.guild.id == 772964112908156938 || message.guild.id == 1073253198539800647) && (message.content.substring(0, 7) == '~remove' || message.content.substring(0, 7) == '~create')) {
            restOfMessage = message.content.substring(8);
            if (message.content.substring(0, 7) == '~remove') {
                if (restOfMessage.indexOf('precept') == 0) {   
                    await message.channel.send('rude')
                } else if (restOfMessage.length > 0 && list.indexOf(restOfMessage) != -1) {
                    await message.channel.send('removed ' + restOfMessage + ' pasta')
                    Files.unlink(restOfMessage + '.txt', function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });
                    flag = true;
                } else {
                    await message.channel.send('please use ~remove (pasta name)')
                }
            } else if (message.content.substring(0, 7) == '~create') {
                newPastaName = restOfMessage.substring(0, restOfMessage.indexOf(' '))
                if (restOfMessage.indexOf('precept') == 0) {   
                    await message.channel.send('rude')
                } else if (newPastaName.length > 0) {
                    await message.channel.send('created ' + newPastaName + ' pasta')
                    Files.writeFile(newPastaName + '.txt', restOfMessage.substring(restOfMessage.indexOf(' ') + 1), function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });
                    flag = true;
                } else {
                    await message.channel.send('please use ~create (pasta name) (pasta)')
                }
            }
        } else if (temp == -1) {
            await message.channel.send('pasta \'' + message.content.substring(1) + '\' not found')
        } else {
            var file = Files.readFileSync(message.content.substring(1) + '.txt')
            await message.channel.send('' + file)
        }
    }
});

bot.login(process.env.APIKEY);