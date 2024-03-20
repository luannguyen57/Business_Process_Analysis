/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership. Camunda licenses this file to you under the Apache License,
 * Version 2.0; you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const mongoose = require('mongoose')

const customerSchema = require('./model/customer')
const url = "mongodb+srv://mhung2303:hung@carterhung.jenze.mongodb.net/BPMN?retryWrites=true&w=majority"
const {
  Client,
  logger,
  Variables,
  File
} = require("camunda-external-task-client-js");

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = {
  baseUrl: "http://localhost:8080/engine-rest",
  use: logger
};
const connect = async () => {
  try {
    await mongoose.connect(url)
  } catch (err) {
    throw new Error(err)
  }


}
connect()

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'invoiceCreator'
client.subscribe("thongtin", async function ({ task, taskService }) {
  // Put your business logic

  const thongtin = task.variables.getAll();
  const fullname = thongtin['fullname1'];
  const phone = thongtin['phone'];
  const address = thongtin['address']
  const destination = thongtin['destination']
  try {
    const newCus = new customerSchema({ fullname: fullname, phone: phone, address: address, destination: destination });
    console.log(newCus)
    await newCus.save();
  } catch (e) {
    console.log(e.message)
  }



  // complete the task
  const date = new Date();
  const invoice = await new File({ localPath: "./assets/invoice.txt" }).load();
  const minute = date.getMinutes();
  const variables = new Variables().setAll({ invoice, date });

  // check if minute is even
  if (minute % 2 === 0) {
    // for even minutes, store variables in the process scope
    await taskService.complete(task, variables);
  } else {
    // for odd minutes, store variables in the task local scope
    await taskService.complete(task, null, variables);
  }
})
