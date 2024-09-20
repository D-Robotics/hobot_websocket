// Copyright (c) 2024，D-Robotics.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include "server/uws_server.h"

#include <chrono>
#include <fstream>
#include <iostream>

#include "uWS/uWS.h"
#include "rclcpp/rclcpp.hpp"

namespace websocket {
using std::chrono::milliseconds;

int UwsServer::Init(int port, MsgCallBackType cb) {
  if (nullptr == worker_) {
    worker_ = std::make_shared<std::thread>(&UwsServer::StartServer, this, port, cb);
    worker_->detach();
  }
  return 0;
}

int UwsServer::DeInit() {
  connetion_ = nullptr;
  return 0;
}

UwsServer::UwsServer(const std::string &config_file) : connetion_(nullptr),
  worker_(nullptr) {
}

void UwsServer::StartServer(int port, MsgCallBackType cb_onmsg) {
  RCLCPP_WARN(rclcpp::get_logger("websocket"),
    "UwsServer Start Server with port: %d %s", port, cb_onmsg? "and callback" : "");
  uWS::Hub hub;
  hub.onConnection(
      [this, port](uWS::WebSocket<uWS::SERVER> *ws, uWS::HttpRequest req) {
        RCLCPP_WARN(rclcpp::get_logger("websocket"), "UwsServer Connection with client success, using port: %d", port);
        std::lock_guard<std::mutex> connection_mutex(mutex_);
        connetion_ = ws;
      });

  hub.onMessage([this, cb_onmsg](uWS::WebSocket<uWS::SERVER> *ws, char *message,
                       size_t length, uWS::OpCode opCode) {
    RCLCPP_INFO(rclcpp::get_logger("websocket"), "UwsServer onMessage length: %d", length);
    if (opCode == uWS::OpCode::TEXT) {
      RCLCPP_INFO(rclcpp::get_logger("websocket"), "TEXT Message: %s", message);
    } else if (opCode == uWS::OpCode::BINARY) {
      RCLCPP_INFO(rclcpp::get_logger("websocket"), "BINARY Message");
    }
    if (cb_onmsg) {
      cb_onmsg(message, length);
    }
  });

  hub.onDisconnection([this, port](uWS::WebSocket<uWS::SERVER> *ws, int code,
                             char *message, size_t length) {
    std::lock_guard<std::mutex> connection_mutex(mutex_);
    connetion_ = nullptr;
    RCLCPP_WARN(rclcpp::get_logger("websocket"), "UwsServer Disconnection with client success, using port: %d", port);
  });
  if (!hub.listen(port)) {
    RCLCPP_ERROR(rclcpp::get_logger("websocket"), "UwsServer start failed");
    return;
  }
  RCLCPP_DEBUG(rclcpp::get_logger("websocket"), "UwsServer begin to run");
  hub.run();
}
int UwsServer::Send(const std::string &protocol) {
  if (connetion_ != nullptr) {
    RCLCPP_DEBUG(rclcpp::get_logger("websocket"), "UwsServer begin send protocol");
    connetion_->send(protocol.c_str(), protocol.size(), uWS::OpCode::BINARY);
    RCLCPP_DEBUG(rclcpp::get_logger("websocket"), "UwsServer send protocol size = %d", protocol.size());
  }
  return 0;
}
}  // namespace websocket
