

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

const {
    Client,
    logger,
    Variables,
    File
  } = require("camunda-external-task-client-js");
const { getTestMessageUrl } = require("nodemailer");
  
  // configuration for the Client:
  //  - 'baseUrl': url to the Process Engine
  //  - 'logger': utility to automatically log important events
  const config = {
    baseUrl: "http://localhost:8080/engine-rest",
    use: logger
  };
  
  // create a Client instance with custom configuration
  const client = new Client(config);
  
  // susbscribe to the topic: 'invoiceCreator'
  client.subscribe("SendTour", async function({ task, taskService }) {
    // Put your business logic
    let MaTour = task.variables.get("MaTour");
    let TenKH = task.variables.get("TenKhachHang");
    let address = task.variables.get("DiaDiem");
    let Soluong = task.variables.get("SoLuong");
    let HDV= task.variables.get("HuongDanVien");
    let Phuongtien= task.variables.get("PhuongTien");
    let Noio =task.variables.get("NoiO");
    let Ngaykhoihanh=task.variables.get("NgayBatDau");
    let Ngayketthuc=task.variables.get("NgayKetThuc");

    var nodemailer = require('nodemailer');
  
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'thuyvy20122002@gmail.com',
        pass: 'XXXXXXX'
      },
      tls:{
        rejectUnauthorized: false
  }
    });
    var mailOptions = {
        from: 'thuyvy20122002@gmail.com',
        to: task.variables.get("email"),
        subject: 'THÔNG TIN VỀ CHUYẾN ĐI',
        text: `
        CẢM ƠN ${TenKH} ĐÃ YÊU CẦU TOUR, DƯỚI ĐÂY LÀ THÔNG TIN CHUYỂN ĐI CỦA BẠN!!
            Mã Tour của bạn: ${MaTour}
            Điểm đến: ${address}
            Số lượng hành khách: ${Soluong}
            Hướng dẫn viên: ${HDV}
            Phương tiện: ${Phuongtien}
            Nơi ở: ${Noio}
            Ngày giờ khởi hành:${Ngaykhoihanh}
            Ngày kết thúc: ${Ngayketthuc}
          
        `

      };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        return
      }
      
    });
    
  await taskService.complete(task);
  
  });
 
 

  
