#!/usr/bin/env node
const logger = require('./util/logger.js');
const jimp = require('jimp');
const readLine = require('readline');
let filepath;
const chalk = require('chalk');
const rl = readLine.createInterface(process.stdin, process.stdout);
const fs = require('fs');
const argv = require('yargs').argv
let conf = require(`${__dirname}/config.json`);
if (argv.version) {
    const ver = require(`${__dirname}/package.json`);
    logger.info(ver)
}
if (argv.config) {
    logger.warn("If you're on windows use / instead of \\")
    rl.question("Provide the desired save path: ", async function (answer) {
        d = answer
        let temp = `{"saveto": "${d}"}`
        fs.readdir(d, async function (err, files) {
            if (err) return console.log("That's not a valid path")
            else {
             fs.writeFileSync(`${__dirname}/config.json`, temp);
                logger.info(`New save path set to ${d}`)
            
                }

        });

        await rl.close()
        fs.mkdir(`${answer}/howified/`, (err) => {
            if (err) return;
        })
    })
} else {
    if (conf.saveto === 'nicepath') {
        logger.info(`There's no save path. Run 'how --config' to setup a save path`)
        process.exit()
    }

    fs.readdir(`${conf.saveto}/howified/`, (err, files) => {
        let ar = files.filter(f => f.split(".").pop() === "jpeg");
        let pito = ar.length + 1

        var file = `${conf.saveto}/howified/how-(${pito}).jpeg`
        rl.question("Provide an url/path to the image that you want to HOW-ify ", async function (answer) {
            filepath = answer;
            await rl.close()
            console.time(`[${new Date().toLocaleDateString()}]:[INFO]`);
            jimp.read(filepath).then(image => {
                if (image.bitmap.width & image.bitmap.height < 60) {
                    return logger.error(chalk.red("That image is too small"))
                }
                logger.info(chalk.yellow('Writing image (this may take a while)'))
                let w;
                let h;


                if (image.bitmap.width && image.bitmap.height < 500) {
                    w = image.bitmap.width - 100;
                    h = image.bitmap.height - 100;

                } else if (image.bitmap.width && image.bitmap.height < 200) {
                    w = image.bitmap.width - 50;
                    h = image.bitmap.height - 50;

                } else {
                    w = image.bitmap.width - 400;
                    h = image.bitmap.height - 400;
                }

                image.resize(w, h)//.catch(err => console.error(chalk.red("Error: The image is too small")))
                let wea = image.bitmap.width / 2.8

                let fSize;
                let ver;
                if (image.bitmap.width < 270) {
                    fSize = `${__dirname}/impact/impact_32.fnt`
                    ver = -20
                } else {
                    fSize = `${__dirname}/impact/impact.fnt`
                    ver = -70
                }
                jimp.loadFont(fSize).then(font => {

                    image.color([
                        { apply: 'saturate', params: [20] },
                        { apply: 'xor', params: [40] }
                    ]).print(
                        font,
                        wea,
                        ver,
                        "HOW",
                        50
                    )
                        .posterize(100)
                        .quality(10)
                        .write(file);
                    logger.info(chalk.green('Finished writing image'));
                    logger.info(`Width: ${image.bitmap.width}`)
                    logger.info(`Height: ${image.bitmap.height}`)
                    console.timeEnd(`[${new Date().toLocaleDateString()}]:[INFO]`)
    
                })
            })//.catch(err => console.error(chalk.red(`Error: ${err.message}`)))
        });

    })

}
