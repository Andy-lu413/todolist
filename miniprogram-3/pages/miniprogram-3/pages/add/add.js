const LOCAL_KEY = 'todo_list'
const app = getApp()


Page({
  data: {
    categories: ['工作', '学习', '生活', '运动'], // 类型映射
    category: "0", // 默认选中第一个类型（"0"）
    categoryText: '工作', // 默认显示的文字
    description: '', // 描述内容
    backgroundColor: '#FFFFFF', // 默认背景颜色
  },

  onLoad() {
    // 默认选中第一个类型
    const initialCategory = "0";
    const initialColor = app.globalData.categoryColors[initialCategory];
    this.setData({
      category: initialCategory,
      categoryText: this.data.categories[initialCategory],
      backgroundColor: initialColor, // 设置初始背景颜色
    });
  },

  // 切换类型
  changeCategory() {
    const { categories, category } = this.data;
    const nextCategory = String((Number(category) + 1) % categories.length); // 切换到下一个类型
    const nextCategoryText = categories[nextCategory]; // 获取对应的文字
    const nextColor = app.globalData.categoryColors[nextCategory]; // 获取对应的颜色

    this.setData({
      category: nextCategory,
      categoryText: nextCategoryText,
      backgroundColor: nextColor, // 更新背景颜色
    });
  },

  // 提交表单
  submitForm(e) {
    const { category, description } = e.detail.value;
    if (!category || !description) {
      wx.showToast({ title: '请填写完整', icon: 'none' });
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      category: category, // 存储为字符串
      description,
      status: '进行中',
      createTime: Date.now(),
      actionTime: Date.now(),
    };
        // 清空输入框内容
        this.setData({
          description: '', // 清空描述
        });

    const list = wx.getStorageSync(LOCAL_KEY) || [];
    wx.setStorageSync(LOCAL_KEY, [...list, newItem]);
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});