let jimp = require('jimp');
let file = `${__dirname}/images/img.jpeg`

module.exports = function (imageurl) {
    if (imageurl === undefined) {
        throw (
            `the image field can't be empty`)
    }
    jimp.read(imageurl).then(image => {
        let w;
        let h;
        if (image.bitmap.width && image.bitmap.height < 500) {
            w = image.bitmap.width - 100;
            h = image.bitmap.height - 100;

        } else if (image.bitmap.width && image.bitmap.height < 200) {
            w = image.bitmap.width - 50;
            h = image.bitmap.height - 50;

        } else if (image.bitmap.width & image.bitmap.height < 60) {
            w = image.bitmap.width - 10;
            h = image.bitmap.height - 10;
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

                .write(file)
                
        })
    }).catch(err => console.error(`Error: ${err.message}`))
    return file
}
