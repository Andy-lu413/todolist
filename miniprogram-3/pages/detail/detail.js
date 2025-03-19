Page({
  data: {
    category: '',       // 类型
    createTime: '',    // 创建日期
    description: ''    // 完整描述
  },

  onLoad(options) {
    const id = options.id; // 获取传递的 id
    this.loadDetail(id);
  },

  // 加载事项详情
  loadDetail(id) {
    const list = wx.getStorageSync('todo_list') || [];
    const item = list.find(item => item.id === id);

    if (item) {
      this.setData({
        category: item.category,
        createTime: this.formatTime(item.createTime),
        description: item.description
      });
    }
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});