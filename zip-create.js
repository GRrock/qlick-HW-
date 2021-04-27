var fs = require('fs');
var archiver = require('archiver');
var output = fs.createWriteStream('./svgTestGrigorev.zip');
var archive = archiver('zip', {
    gzip: true,
    zlib: { level: 9 } // Sets the compression level.
});

archive.on('error', function(err) {
  throw err;
});

// pipe archive data to the output file
archive.pipe(output);

// append files
archive.file('./out/svgTestGrigorev.js', {name: 'svgTestGrigorev.js'});
archive.file('./out/svgTestGrigorev.qext', {name: 'svgTestGrigorev.qext'});

//
archive.finalize();