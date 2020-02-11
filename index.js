let jimp = require('jimp');

let file = `${__dirname}/images/blissgay.jpeg`
module.exports = function (imageurl) {
        
    
    if (imageurl === undefined) {
        throw (
            `the image field can't be empty`)
    }
    jimp.read(imageurl).then(image => {
        if (image.bitmap.width && image.bitmap.height < 60) return "That image is too small"
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
        jimp.loadFont(fSize).then(font => {
            let r;
            image.color([
                { apply: 'saturate', params: [20] },
                { apply: 'xor', params: [40] }
            ]).print(
                font,
                    0,
                    0,
		    {
			    text: "HOW",
			    alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
			    alignmentY: jimp.VERTICAL_ALIGN_TOP
		    },
		    image.bitmap.width,
		    image.bitmap.height
        )
                .posterize(100)

                .quality(10)

                 image.write(file)

        })
    }).catch(err => err)
    return file
}
