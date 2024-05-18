# Changelog for package websocket

tros_2.2.0 (2024-04-29)
------------------
1. openssl的加密库不指定连接1.1.0版本，连接系统对应的sysroot安装的版本。

tros_2.1.0 (2024-04-01)
------------------
1. 适配ros2 humble零拷贝。
2. 新增中英双语README。
3. 零拷贝通信使用的qos的Reliability由RMW_QOS_POLICY_RELIABILITY_RELIABLE（rclcpp::QoS()）变更为RMW_QOS_POLICY_RELIABILITY_BEST_EFFORT（rclcpp::SensorDataQoS()）。

tros_2.0.1 (2024-3-4)
------------------
1. 订阅的`jpeg`压缩格式图片使用的数据类型由`sensor_msgs::msg::Image`变更为`sensor_msgs::msg::CompressedImage`。

tros_2.0.0rc1 (2023-05-23)
------------------
1. 更新openssl版本
2. 完善readme
3. 修改launch脚本默认log级别为error

tros_2.0.0 (2023-05-11)
------------------
1. 更新package.xml，支持应用独立打包
2. 更新应用启动launch脚本
3. 更新Web地平线logo
4. 更新protobuf、nginx、openssl版本

tros_1.1.6rc1 (2023-03-24)
------------------
1. 修复非root用户启动webservice出错问题。
2. 修改x86平台AI消息检测时间间隔为30s。
3. 完善README。

tros_1.1.6 (2023-03-16)
------------------
1. 修改webservice默认使用的端口为8000，普通用户可直接运行，无需使用sudo权限。
2. 优化web端显示链接，并修改TogetherROS->TogetheROS。

tros_1.1.6b (2023-03-03)
------------------
1. 修改x86平台图像帧和智能结果帧匹配规则，不再使用时间戳严格对齐。只要有图像消息就送给浏览器显示，智能结果至少保留一帧，和最新的图像一起送到浏览器端。
2. 修改默认输出帧率为0，不做帧率控制。

tros_1.1.6a (2023-02-16)
------------------
1. 适配x86平台。

tros_1.1.2rc1 (2022-10-18)
------------------
1. 修复问题：only_show_image为true时，依旧打印未收到AI数据的日志。

tros_1.1.2 (2022-09-28)
------------------
1. 优化websocket输出日志

hhp_1.0.6 (2022-08-29)
------------------
1. 新增Web页面可视化全图分割“segmentation”渲染。
2. 发布的Points数据中，当类型名称不在枚举范围内时，填充值由"body_kps"变更为使用接收到的实际值。

hhp_1.0.4 (2022-07-29)
------------------
1. Web页面显示的标题名由OpenExplorer改为TogetherROS。

v1.0.2 (2022-07-08)
------------------
1. 修复第一次启动webservice服务情况下，启动完成后未切回原运行路径，导致算法模型加载失败的问题。
2. 增加图像输出帧率控制功能，默认以10fps对外输出，支持通过"output_fps"字段重新配置，解决使用wifi等弱网络环境下展示卡顿的问题。

v1.0.1 (2022-06-24)
------------------
1. 修复websocket内存占用可能会不断增长，导致的内存泄漏问题。
2. 性能统计新增AI推理延时显示。
