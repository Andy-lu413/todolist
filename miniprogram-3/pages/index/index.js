const app = getApp()
const LOCAL_KEY = 'todo_list'

Page({
  data: {
    categoryColors: app.globalData.categoryColors,
    activeId: null,
    detailId: null,
    groupedList: [] // 分组后的待办事项列表
  },

  onLoad() {
    this.loadTodos()
  },

  onShow() {
    this.loadTodos()
    this.setData({ activeId: null }) // 切换标签页时隐藏删除按钮
  },

  loadTodos() {
    const list = wx.getStorageSync(LOCAL_KEY) || []
    // 获取今天的日期
    const today = this.getTodayDate();

    // 更新每个事项的 isToday 字段
    const updatedList = list.map(item => {
      // 如果 isToday 为真，则重新判断是否是今天
      if (item.isToday) {
        return {
          ...item,
          isToday: item.actionDate === today // 判断是否是今天操作
        };
      }
      return item;
    });

      console.log('所有事项数据：', list) // 打印所有事项数据
      // 分组并设置数据
      const groupedList = this.groupByCategory(updatedList);
      this.setData({ groupedList });
  },

  groupByCategory(list) {
    const groups = list.reduce((acc, item) => {
      if (item.status !== '进行中') return acc
      const key = item.category
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {})

    return Object.keys(groups).map(category => ({
      category,
      todos: groups[category].sort((a, b) => b.createTime - a.createTime)
    }))
  },

  // 跳转到详情页面
  gotoDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}` // 将事项的 id 作为参数传递
    });
  },

  showActions(e) {
    this.setData({ 
      activeId: e.currentTarget.dataset.id ,
      detailId: null
    })
  },

  // 点击空白区域隐藏操作按钮
  hideActions(e) {
    // 如果点击的不是操作按钮区域，则隐藏按钮
    if (!e.target.dataset.id) {
      this.setData({ 
        activeId: null,
        detailId: null
      })
    }
  },
  updateItem(id, newData) {
    const list = wx.getStorageSync(LOCAL_KEY) || []
    const updatedList = list.map(item => 
      item.id === id ? { ...item, ...newData } : item
    )
    wx.setStorageSync(LOCAL_KEY, updatedList)
    this.loadTodos()
    this.setData({ activeId: null })
  },

   // 点击取消按钮后删除事项
   handleCancel(e) {
    const id = e.currentTarget.dataset.id
    const list = wx.getStorageSync(LOCAL_KEY) || []
    const updatedList = list.filter(item => item.id !== id)
    wx.setStorageSync(LOCAL_KEY, updatedList)
    this.loadTodos()
    this.setData({ activeId: null }) // 隐藏操作按钮
  },

  handleDo(e) {
    const id = e.currentTarget.dataset.id
    const list = wx.getStorageSync(LOCAL_KEY) || []
    const item = list.find(item => item.id === id)

    // 获取今天的日期
    const today = this.getTodayDate();
    // 更新原事项的操作时间和 actionDate
    const updatedList = list.map(item => 
      item.id === id ? { 
        ...item, 
        actionTime: Date.now(),
        actionDate: today, // 更新 actionDate
        isToday: true // 标记为今天操作
      } : item
    );

    // 生成一条历史记录，状态为“做了”
    const historyItem = {
      ...item,
      id: Date.now().toString(), // 生成唯一ID
      status: '做了',
      actionTime: Date.now(),
      actionDate: today // 立即执行函数，生成 actionDate
    }

    // 保存数据
    wx.setStorageSync(LOCAL_KEY, [...updatedList, historyItem])
    this.loadTodos()

    // 隐藏操作按钮
    this.setData({ activeId: null })

  },

//点击完成
  handleComplete(e) {
    this.updateItem(e.currentTarget.dataset.id, { 
      status: '完成',
      actionTime: Date.now(),
      actionDate: (() => {
        const date = new Date(); // 创建 Date 对象
        const year = date.getFullYear(); // 获取年份
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份并补零
        const day = String(date.getDate()).padStart(2, '0'); // 获取日期并补零
        return `${year}-${month}-${day}`; // 返回格式化后的日期
      })() // 立即执行函数，生成 actionDate
    }),
    // 隐藏操作按钮
    this.setData({ activeId: null })
    // 跳转到历史记录页面
    wx.switchTab({
      url: '/pages/history/history'
    })
  },
  
    // 获取今天的日期（格式：YYYY-MM-DD）
  getTodayDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  formatTime: app.formatTime,

  gotoAdd() {
    wx.navigateTo({
      url: '/pages/add/add'
    })
  }
})