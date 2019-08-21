#!/usr/bin/env node
const Logger = require('./util/logger.js');
const logger = new Logger();
const jimp = require('jimp');
let filepath;
const chalk = require('chalk');
const fs = require('fs');
const argv = process.argv.slice(2)
const imgur = require('imgur');
const clp = require('clipboardy');
let temp = `Usage:
    how <Url|Image path>
    
Flags:
    -v | --version
    -h | --help`
if (!argv[0]) {
    logger.error('Wrong usage')
    console.log(temp)
    process.exit()
}
if (argv[0] === '--version' || argv[0] === '-v') {
    const ver = require(`${__dirname}/package.json`);
    logger.info(ver.version)
    process.exit()
} 
if (argv[0] === '--help' || argv[0] === '-h') {
    console.log(temp)
    process.exit()
} else {
    fs.readdir(`${process.cwd()}`, (err, files) => {
        let ar = files.filter(f => f.split(".").pop() === "jpeg");
        let pito = ar.length + 1

        var file = `${process.cwd()}/how-(${pito}).jpeg`
        filepath = argv[0];
        console.time(`[${new Date().toLocaleDateString()}]:[INFO]`);
        jimp.read(filepath).then(image => {
            if (image.bitmap.width && image.bitmap.height < 60) {
                return logger.error(chalk.red("That image is too small"))
            }
            logger.info(chalk.yellow('Writing image (this may take a while)'))
            let w;
            let h;


            if (image.bitmap.width && image.bitmap.height < 500) {
                w = image.bitmap.width - 100;
                h = image.bitmap.height - 100;

            } else if (image.bitmap.width && image.bitmap.height < 150) {
                w = image.bitmap.width - 50;
                h = image.bitmap.height - 50;

            } else {
                w = image.bitmap.width - 400;
                h = image.bitmap.height - 400;
            }
            try {
                image.resize(w, h)
            } catch (err) {
                return logger.error(err)
            }

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
                console.timeEnd(`[${new Date().toLocaleDateString()}]:[INFO]`)
                logger.info('Uploading file to imgur...')
                imgur.uploadFile(file).then(file => {
                    logger.info("File uploaded, url (already copied to clipboard): " + file.data.link)
                    clp.writeSync(file.data.link)
                });
            })
        }).catch(err => null)


    })

}
