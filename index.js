const jimp = require('jimp');
const readLine = require('readline');
let filepath;
const config = require('config.json');
const chalk = require('chalk')
let file = `${savepath}${new Date()}.jpeg`
var rl = readLine.createInterface(process.stdin, process.stdout);

rl.question("Provide an url/path to the image that you want to HOW-ify ", async function (answer) {
    filepath = answer;
    await rl.close()
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

        } else {
            w = image.bitmap.width - 400;
            h = image.bitmap.height - 400;
        }

        image.resize(w, h)
        let wea = image.bitmap.width / 2.7

        let fSize;
        let ver;
        if (image.bitmap.width < 270) {
            fSize = "impact/impact_32.fnt"
            ver = -20
        } else {
            fSize = "impact/impact.fnt"
            ver = -70
        }

        jimp.loadFont(fSize).then(font => {

            image.color([
                { apply: 'saturate', params: [20] },
                { apply: 'xor', params: [40] }
            ]);
            image.print(
                font,
                wea,
                ver,
                "HOW",
                50
            )
            image.posterize(100)

            image.quality(10)

            image.write(file);
            let eu = `Width: ${image.bitmap.width}\nHeight: ${image.bitmap.height}`
            console.log(chalk.green('Finished writing image'));
            console.log(`Image saved as: ${file}`)
            console.log(`To see the image go to ${__dirname + '/' + file}`)
            console.log(eu)

        })
    }).catch(err => console.error(chalk.red(`Error: ${err.message}`)))

});
