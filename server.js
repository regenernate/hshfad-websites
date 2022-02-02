
require('dotenv').config();

const DOMAIN_OVERRIDE = process.env.DOMAIN_OVERRIDE || "hshf";

var domains = {hiddenspringsfarmanddairy:"hsfad", hiddenspringshorsefarm:"hshf", vitalitybodyworkandwellness:"vitality"};

const http = require('http');
const fs = require('fs');

const hostname = process.env.BIND_IP || process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

var home = "homepage";

var page_index = {};
var filename_index = {
    homepage_hsfad:__dirname+'/index_hsfad.html',
    homepage_hshf:__dirname+'/index_hshf.html',
    homepage_vitality:__dirname+'/index_vitality.html',
  };

function reloadPage( v ){
  page_index[ v ] = "";
  fs.readFile(filename_index[ v ],function (err, data){
    page_index[ v ] += data;
  });
}

reloadPage( home + "_hsfad" );
reloadPage( home + "_hshf" );
reloadPage( home + "_vitality" );

/*
fs.watch( filename_index[ home ], ( eventType, filename ) => {
  if( eventType.toLowerCase() == "change" ){
      reloadPage( home );
  }
});
*/
//add listener to homepage for auto-refresh???


const server = http.createServer((req, res) => {
  res.statusCode = 200;

  if( !req.headers.accept ) req.headers.accept = "text/html";

  //serve images first
  if( req.url === '/favicon.ico' || req.headers.accept.substr(0,5).toLowerCase() == 'image' ){
    var filename = __dirname+'/images'+req.url;
    //console.log("image ... " + req.url );
    // This line opens the file as a readable stream
    var readStream = fs.createReadStream(filename);
    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', function () {
      // This just pipes the read stream to the response object (which goes to the client)
//      console.log("reading :: " + filename);
      if( req.url == '/favicon.ico' ){
        res.writeHead(200, { 'Content-Type':'image/x-icon' } );
      }else{
        res.writeHead(200, { 'Content-Type':'image/*' } );
      }
      readStream.pipe(res);
    });
    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', function(err) {
      res.writeHead(400)
//      console.log("There was a failure reading :: " + filename + " :: " + err );
      res.end();
    });
    readStream.on('complete', function(done){
      res.end();
    })
  }else{ //if not an image ...

    //get the requesting domain extension for proper routing
    let d = req.headers.host.split(".");
    for( let i=0; i<d.length; i++ ){
      if(d[i] == "www") continue;
      else{
        d = d[i];
        break;
      }
    }
    //getting the domain so we know what content to serve
    let de = domains[ d ] || DOMAIN_OVERRIDE;
    //console.log(de); //to debug what domain is being requested ...
    let p = req.url.substr(1).split(".")[0].toLowerCase().split("/"); //get just the page name - assumes a leading "/" and works with .html extension or without
    let pagename = p[0];
    let subpath = p[1] || "";
    //console.log("Looking for page :: " + pagename + " in " + visiting );
    if( pagename === '' || pagename === 'index' ){ //peel off the homepage requests first
      var toolspath = __dirname + '/tools';
      //hereify
      let t = require(toolspath + '/putyouhereifier.js').module();
      //insert herification data
      t = page_index[ home + "_" + de ].split("<hereify />").join(t);
      //return the page contents
      res.writeHead(200, {'Content-Type': 'text/html','Content-Length':t.length });
      res.write(t);
      res.end();
    }else if( filename_index.hasOwnProperty( pagename ) ) { //this is a known page, not the homepage, ( with a template to display )
      //find the template to run
      let t = page_index[ pagename ];
      let r = "";
      if( subpath ){
        r = "/" + subpath;
      }
//      console.log( "it's on " + visiting + " - " + pagename + ' :: ' + subpath);
      t = t.split("<returnificate-me />").join(r);
      res.writeHead(200, {'Content-Type':'text/html', 'Content-Length':t.length})
      res.write(t);
      res.end();
    }else if( req.url.substr(-3) === "css" ){ //these are css requests
//      console.log("its css ! " +req.url)
      var filename = __dirname+req.url;
      fs.readFile(filename,function (err, data){
        res.writeHead(200, {'Content-Type': 'text/css','Content-Length':data.length});
        res.write(data);
        res.end();
      });
    }else{ //these are requests we don't yet handle
      console.log("OOPS !!!! it isnt css or a known page in server.js ( towards the end )" + req.url);
      res.writeHead(200, { 'Content-Type':'text/plain' })
      res.end("Hmmm ... we're not sure what you're looking for. You requested :: " + req.url + " which does not yet have routing defined.");
//      throw new Error("Oops, this shouldn't have happened!");
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
