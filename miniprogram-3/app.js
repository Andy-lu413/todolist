// app.js
App({
  globalData: {
    categoryColors: {
      '0': '#FF6347', // 红色-工作
      '1': '#FFA07A', // 橙色-学习
      '2': '#B8E986', // 绿色-生活
      '3': '#10AEEF'  // 蓝色-运动
    }
  },
  formatTime(timestamp) {
    console.log('时间戳：', timestamp) // 打印时间戳
    const date = new Date(timestamp)
    console.log('解析后的日期：', date) // 打印解析后的日期
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
})