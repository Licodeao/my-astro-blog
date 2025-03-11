---
title: 微信小程序实现WiFi打卡的思路
author: Licodeao
publishDate: "2022-9-4"
img: /assets/articles/wechat.jpeg
img_alt: 微信小程序实现WiFi打卡的思路
description: |
  微信小程序实现 WiFi 打卡的思路
categories:
  - 技术分享
tags:
  - 分享
---

昨天在实现 WiFi 打卡时，因为是第一次实现这种需求，故在此记录一下。

## 起因

昨天在判断用户是否是使用指定 WiFi 时，发现了一个 bug。

我们都知道，打开/关闭 WiFi 有两个途径：

1. 系统设置里的 WiFi 开关
2. 手机界面右上角的状态栏中的 WiFi 开关

那么此时问题就来了，如果查询微信小程序文档时，会找到通过 wx.getSystemInfo()来获取 WiFi 开关的状态

```javascript
// 回调函数返回的属性中有个wifiEnabled，它表明WiFi开关的状态
wx.getSystemInfo({
  success(res) {
    console.log(res.wifiEnabled);
    if (res.wifiEnabled) {
      // wx.startwifi() 初始化WiFi模块
      // wx.connectWifi() 连接WiFi
      // wx.onWifiConnected() 监听WiFi连接
      // 成功则发送签到打卡请求
    }
  },
});
```

如果是以上方案，那么就会**漏掉**一个重要的因素：手机界面右上角的状态栏中的 WiFi 开关，**因为 wifiEnabled 仅仅表明系统设置里面的 WiFi 开关状态**

> 模拟一个情况

​ 先连上指定的 WiFi，调用 wx.getSystemInfo()，获取到了 wifiEnabled 且值为 true，wx.onWifiConnected()回调成功的函数并发送签到打卡请求...

​ 但此时，如果**将手机界面右上角的状态栏中的 WiFi 开关关闭**（此时手机设置里的 WiFi 开关依然是开启状态，但手机右上角的状态栏中的 WiFi 开关是关闭状态），此时**依然会触发 wx.onWifiConnected()并执行成功的回调**，进而发送签到打卡请求

## 解决

​ 虽然关闭了右上角的状态栏中的 WiFi 开关仍会触发签到打卡请求，但**此时手机使用的是流量，而非 WiFi**

​ 抓住这一点，就可以成功实现 WiFi 签到打卡的需求

> 大概流程

1. 首先判断用户**手机设置中是否开启 WiFi**，如果没有则不进行接下来的操作
2. 如果手机设置中开启了 WiFi，那么接下来**获取手机的网络类型**
   - 如果**网络类型不是 WiFi**，则提示用户连接指定 WiFi 后再签到，**不进行接下来的操作**
   - 如果**网络类型是 WiFi**，需要**判断用户连接的 WiFi 是否是指定的 WiFi**
     - 如果**是指定的 WiFi**，则**发送签到打卡请求**

> 流程代码

```javascript
onDuty() {
	let that = this
	// 判断手机设置有没有打开WiFi开关
	wx.getSystemInfo({
		success(res) {
			that.isOpenMobileWifi = res.wifiEnabled
			if (!that.isOpenMobileWifi) {
				uni.showToast({
					icon: "error",
					title: "请打开WiFi开关",
					duration: 2000
				})
		} else {
			let SSID = "指定的WiFi的名称"
			let BSSID = "指定的WiFi的MAC地址"
      // 获取网络类型
      wx.getNetworkType({
        success(res) {
          if (res.networkType !== "wifi") {
            uni.showToast({
              icon: "error",
              title: "请连接工作室WiFi",
              duration: 2000
            })
          } else {
            // 判断是不是工作室的WiFi
            wx.getConnectedWifi({
              success(res) {
                if (res.wifi.SSID === SSID && res.wifi.BSSID === BSSID) {
                  that.isSuccess = true
                  uni.request({
                    url: '签到打卡请求',
                    method: 'GET',
                    header: {
                      "Authorization": uni.getStorageSync('tokenHead') + ' ' + uni.getStorageSync('token')
                    },
                    data: {
                      place: that.isSuccess,
                      success: that.isSuccess,
                      type: 2
                    },
                    success(res) {
                      if (res.data.code === 200) {
                        uni.showToast({
                          icon: 'success',
                          title: "签到成功",
                          duration: 2000
                        })
                      }
                      if (res.data.code === 401) {
                        uni.showToast({
                          icon: 'error',
                          title: "请先登录",
                          duration: 2000
                        })
                      }
                      if (res.data.code === 500) {
                        uni.showToast({
                          icon: 'error',
                          title: "本周不是你值班",
                          duration: 2000
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
    }
  })
}
```

## 总结

使用网络进行打卡签到时，尤其注意**手机设置**与**手机右上角状态栏**的区别，流程倒不难理解，在此 mark 一下。
