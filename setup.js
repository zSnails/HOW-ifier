const fs = require('fs');
const rl = require('readline');
let d;
const rel = rl.createInterface(process.stdin, process.stdout);

rel.question("Provide the desired save path: ", async function (answer)  {
    d = answer
    let temp = `{"saveto": "${d}"}`
    fs.readdir(d, function (err, files) {
        if (err) console.log("That's not a valid path")
    });
    fs.writeFileSync('./config.json', temp);
    await rel.close()
});
