const app = getApp()
const LOCAL_KEY = 'todo_list'


Page({
  data: {
    historyList: [],
    categoryColors: app.globalData.categoryColors
  },

  onLoad() {
    this.loadHistory()
  },

  onShow() {
    this.loadHistory() // 每次页面显示时刷新数据
    this.setData({ activeId: null }) // 切换标签页时隐藏删除按钮
  },

  loadHistory() {
    const list = wx.getStorageSync(LOCAL_KEY) || []
    const today = this.getTodayDate()
    // 过滤出已取消和已完成的事项，并按操作时间倒序排列
    const historyList = list
      .filter(item => item.status !== '进行中')
      .sort((a, b) => b.actionTime - a.actionTime)
      .map(item => ({
        ...item,
        isToday: item.actionDate === today // 判断是否是今天操作
      }))

    this.setData({ historyList })
  },

  // 获取今天的日期（格式：YYYY-MM-DD）
  getTodayDate() {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },


 // 长按显示删除按钮
 showDeleteButton(e) {
  const id = e.currentTarget.dataset.id
  this.setData({ activeId: id })
},

  // 点击其他区域隐藏删除按钮
  hideDeleteButton(e) {
    // 如果点击的不是删除按钮区域，则隐藏删除按钮
    if (!e.target.dataset.id) {
      this.setData({ activeId: null })
    }
  },

// 删除事项
handleDelete(e) {
  const id = e.currentTarget.dataset.id
  const list = wx.getStorageSync(LOCAL_KEY) || []
  const updatedList = list.filter(item => item.id !== id)
  wx.setStorageSync(LOCAL_KEY, updatedList)
  this.loadHistory()
  this.setData({ activeId: null }) // 隐藏删除按钮
}

})