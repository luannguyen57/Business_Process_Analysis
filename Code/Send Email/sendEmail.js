const { Client, logger } = require("camunda-external-task-client-js");

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'creditScoreChecker'
client.subscribe("sendEmail", async function({ task, taskService }) {
  // Put your business logic
  //Get email from process variables
  var email = task.variables.get('email');
  console.log(email);
  console.log("Before send email");
  //Send email-------------------- by Tin Trinh 2022.05.23
  var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yghoangvu1@gmail.com',
    pass: 'ballcyhoangvu1123'
}});

var mailOptions = {
  from: 'yghoangvu1@gmail.com',
  to: email, 
  subject: 'Sending Email using Node.js',
  text: 'Send thanh cong!!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
  // complete the task
  await taskService.complete(task);
});