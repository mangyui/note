import request from '@/utils/request'

export var Imgurl = 'http://1975386453.38haotyhn.duihuanche.com/'

// api前缀 ,代理跨域拦截
// 上传题库
export function upQuestion(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?s=Question.insert',
    method: 'post',
    data: datas
  })
}

// *********************** 错题*/
// 获取用户错题分类
export function mistakeCate(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Mistake.Getcate',
    method: 'post',
    data: datas
  })
}

// 添加用户错题分类
export function AddMistakeCate(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Mistake.AddCate',
    method: 'post',
    data: datas
  })
}

// 修改用户错题分类
export function UpdateMistakeCate(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Mistake.UpdateCate',
    method: 'post',
    data: datas
  })
}

// 删除用户错题分类
export function DeleteMistakeCate(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Mistake.DeleteCate',
    method: 'post',
    data: datas
  })
}

// 添加错题
export function addMistake(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Mistake.Add',
    method: 'post',
    data: datas
  })
}

// 删除错题
export function DeleteMistake(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Mistake.Delete',
    method: 'post',
    data: datas
  })
}
// 更新错题
export function UpdateMistake(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Mistake.Update',
    method: 'post',
    data: datas
  })
}
// 查找错题
export function SearchMistake(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Mistake.GetByKeys',
    method: 'post',
    data: datas
  })
}

// 查找相识体型
export function QuestionMore(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Question.GetRecommendByQId',
    method: 'post',
    data: datas
  })
}

// 查找题目题友解答 ****************************************************/!!!!!!!!!!!!!!!!!!
export function QFriendCorrect(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Mistake.GetByQuestionId',
    method: 'post',
    data: datas
  })
}

// 识别匹配题目
export function ocrQues(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Question.Search',
    method: 'post',
    data: datas
  })
}

// 关键字搜索题目
export function SearchQues(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Question.GetByKeys',
    method: 'post',
    data: datas
  })
}

// 我的错题列表
export function QuesList(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Mistake.GetByCateId',
    method: 'post',
    data: datas
  })
}

// 我的收藏列表
export function CollectList(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Collection.All',
    method: 'post',
    data: datas
  })
}

// ***************************** 笔记*/
// 笔记详情
export function NoteDetails(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Note.GetOne',
    method: 'post',
    data: datas
  })
}

// 笔记列表
export function NoteList(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Note.NotesByCate',
    method: 'post',
    data: datas
  })
}

// 添加笔记
export function AddNote(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Note.Add',
    method: 'post',
    data: datas
  })
}

// 修改笔记
export function UpdateNote(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Note.Update',
    method: 'post',
    data: datas
  })
}
// 删除笔记
export function DeteleNote(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Note.Delete',
    method: 'post',
    data: datas
  })
}

// 笔记搜索
export function SearchNote(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Note.NotesByKeys',
    method: 'post',
    data: datas
  })
}

// 添加笔记分类
export function AddNoteType(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Note.AddCate',
    method: 'post',
    data: datas
  })
}

// 修改笔记分类
export function UpdateNoteType(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Note.UpdateCategory',
    method: 'post',
    data: datas
  })
}

// 删除笔记分类
export function DeteleNoteType(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Note.DeleteCategory',
    method: 'post',
    data: datas
  })
}
// ******************************* 点赞收藏*/
// 点赞
export function P_dianZan(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Like.Add',
    method: 'post',
    data: datas
  })
}

// 收藏
export function P_toCollect(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Collection.Add',
    method: 'post',
    data: datas
  })
}

// ******************* 关注*/
// 关注
export function P_toFollowee(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Focus.Add',
    method: 'post',
    data: datas
  })
}

// 粉丝
export function GetFans(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Focus.GetFans',
    method: 'post',
    data: datas
  })
}

// 关注的人
export function GetFollowee(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Focus.GetFollowee',
    method: 'post',
    data: datas
  })
}

// 他人信息
export function GetCustomer(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.User.GetById',
    method: 'post',
    data: datas
  })
}

// 他人信息
export function SearchUsers(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.User.GetByName',
    method: 'post',
    data: datas
  })
}

// 生成试题
export function GetTest(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.User.GetTest',
    method: 'post',
    data: datas
  })
}

// 获取试题详情
export function GetTestDetail(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Test.GetTestDetail',
    method: 'post',
    data: datas
  })
}

// 修改头像
export function ChangeUserAvatar(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.User.ChangeUserAvatar',
    method: 'post',
    data: datas
  })
}

// 笔记相关题目
export function GetQuestionsByText(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Question.GetQuestionsByText',
    method: 'post',
    data: datas
  })
}

// 切题
export function CutQuestion(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.CutQuestion.Cut',
    method: 'post',
    data: datas
  })
}

// 题目数组查找
export function ToSearchs(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Question.Searchs',
    method: 'post',
    data: datas
  })
}

// 添加一条测试
export function addTest(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Test.Add',
    method: 'post',
    data: datas
  })
}
// 修改一条测试
export function updateTest(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Test.Update',
    method: 'post',
    data: datas
  })
}

// 添加一个班级
export function addClass(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Userelation.Add',
    method: 'post',
    data: datas
  })
}
// 修改一个班级
export function updateClass(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Userelation.Update',
    method: 'post',
    data: datas
  })
}
// 查找用户通知
export function GetMessage(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Notice.GetByUserId',
    method: 'post',
    data: datas
  })
}

// 更改已读未读通知
export function UpdateRead(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Notice.UpdateRead',
    method: 'post',
    data: datas
  })
}

export function RechargeMoney(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Recharge.RechargeMoney',
    method: 'post',
    data: datas
  })
}

// 学生get班级
export function GetStudentClass(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Userelation.GetListUid',
    method: 'post',
    data: datas
  })
}

// 班级get学生列表
export function ClassStudents(datas) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/?service=App.Userelation.GetUsersById',
    method: 'post',
    data: datas
  })
}

