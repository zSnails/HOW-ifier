let jimp = require('jimp');
let fs = require('fs');

module.exports = async function (imageurl) {
        let file = `${__dirname}/images/blissgay.jpeg`
    
    if (imageurl === undefined) {
        throw (
            `the image field can't be empty`)
    }
    jimp.read(imageurl).then(image => {
        if (image.bitmap.width && image.bitmap.height < 60) return console.log("That image is too small")
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
//dou
        jimp.loadFont(fSize).then(async font => {
            let r;
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

                let f = await image.write(file)
                return f
        })
    }).catch(err => console.error(`Error: ${err.message}`))
}
