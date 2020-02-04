const express = require('express')
const app = express()
var serialPort = require('serialport')
var bodyParser = require('body-parser')
var cors = require('cors');
var readingFinal = "" ;
var readingToSend = "";
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}))

var port = new serialPort("COM3", 9600);
var readLine = serialPort.parsers.Readline;
var parser = new readLine();
//port.pipe(parser);
  
port.on('open', showPortOpen);
port.on('data', onDataArrival)


function showPortOpen(){
    console.log("COM3 has been opened");
}

function onDataArrival(reading) {
    var readingString = reading.toString("utf-8");
    if(readingString.trim() != "") {
        readingFinal = readingFinal + reading;
    }
    else{
        console.log("Final Reading :" + readingFinal);
        if(readingToSend!=readingFinal)
            readingToSend = readingFinal
        readingFinal = "";

    }
}

app.get('/api/scale/read', (req, res) => {
    if (readingToSend == ""){
        console.log("Error fetching reading:");
        res.json({"status":"0",data:{"weight":null}});
      }
      else {
        res.json({"status":"1",data:{"weight":parseFloat(readingToSend).toFixed(3)}});
        
      }
});
  

app.listen(8081)


