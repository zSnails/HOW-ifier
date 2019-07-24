#!/usr/bin/env node
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
    console.log(ver)
}
if (argv.config) {
    console.log("Note: If you're on windows use / instead of \\")
    rl.question("Provide the desired save path: ", async function (answer) {
        d = answer
        let temp = `{"saveto": "${d}"}`
        fs.readdir(d, function (err, files) {
            if (err) return console.log("That's not a valid path")
            else fs.writeFileSync(`${__dirname}/config.json`, temp); console.log(`New save path set to ${d}`)

        });

        await rl.close()
    })
} else {
    if (conf.saveto === 'nicepath') {
        console.log(`There's no save path\nRun 'how --config' to setup a save path`)
        process.exit()
    }
    let pe = Math.floor(Math.random() * 9999);
    var file = `${conf.saveto}/howified/how-${pe}.jpeg`
    rl.question("Provide an url/path to the image that you want to HOW-ify ", async function (answer) {
        filepath = answer;
        await rl.close()
        console.time("⏱️");
        jimp.read(filepath).then(image => {
            console.log(chalk.yellow('Writing image (this may take a while)'))
            let w;
            let h;


            if (image.bitmap.width && image.bitmap.height < 500) {
                w = image.bitmap.width - 100;
                h = image.bitmap.height - 100;

            } else if (image.bitmap.width && image.bitmap.height < 200) {
                w = image.bitmap.width - 50;
                h = image.bitmap.height - 50;

            } else if (image.bitmap.width & image.bitmap.height < 60) {
                return console.log(chalk.red("That image is too small"))
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

                let eu = `Width: ${image.bitmap.width}\nHeight: ${image.bitmap.height}`
                console.log(chalk.green('Finished writing image'));
                console.log(eu)
                console.timeEnd("⏱️")
            })
        })//.catch(err => console.error(chalk.red(`Error: ${err.message}`)))
    });

}