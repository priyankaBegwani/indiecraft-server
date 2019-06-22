
var nodemailer = require('nodemailer');
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var router = express.Router();
var port = process.env.PORT || 8080;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
    {id: 'email', title: 'Email'},
    {id: 'time', title: 'Time & Date'}
  ]
});
var transporter = nodemailer.createTransport({
  service: 'Godaddy',
    host: "smtpout.secureserver.net",
    secureConnection: true,
    port: 465,
  auth: {
    user: 'info@indiecraft.co.in',
    pass: 'Qwert@123'
  }
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    csvWriter.writeRecords({
      "email":req.body.email,
      "time": new Date()
    }).then(()=> console.log('The CSV file was written successfully'));
    var mailOptions = {
      from: 'Indie Craft info@indiecraft.co.in',
      to: req.body.email,
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api', router);
app.listen(port, () => console.log(`Listening on port ${port}`));
