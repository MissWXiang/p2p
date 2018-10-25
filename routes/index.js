var express = require('express');
var router = express.Router();

//1.引入mongoose
var mongoose = require('mongoose');

//2.链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/admin', (err) => {
  if (err) {
    throw err;
  } else {
    console.log("数据库链接成功！！！");
  }
});

//3.定义骨架
let userSchema = new mongoose.Schema({
  username: String,
  password: Number
});
//定义用户骨架
let infoSchema = new mongoose.Schema({
  name: String,
  sex: String,
  idtype: String,
  idcode: String,
  ctime: String
});

//4.发布模型
let userModel = mongoose.model("user", userSchema, "user");
let infoModel = mongoose.model("userinfo", infoSchema, "userinfo");

/* 检查用户名和密码是否正确 */
router.post('/checkLogin.html', (req, res) => {
  //接收前端的值
  let username = req.body.username;
  let password = parseInt(req.body.password);
  //console.log(username, typeof password);
  //构造查询条件对象
  let checkObj = {
    "username": username,
    "password": parseInt(password)
  }

  //去数据库查询是否用这个用户(根据条件查询 用户名和密码 且的关系)
  userModel.find(checkObj).exec((err, data) => {
    //console.log(data);
    if (data.length) {
      //设置cookie
      res.cookie('user', data[0].username);
      res.send({ "errcode": "1", "msg": "登录成功", "result": data })
    } else {
      res.send({ "errcode": "0", "msg": "登录失败", "result": [] })
    }
  })

});

/*显示当前登录用户的信息  给个页面在登录后显示登录用户*/
// router.get('/userlogin.html', (req, res) => {
//   // 接收id
//   let id = req.query.id;

//   // 根据id 把当前登录用户数据查询出来 返回给前端
//   userModel.find({ "_id": id }).exec((err, data) => {
//     res.send(data);
//   })
// });

/* 设置cookie 判断用户是否登录 */
router.get('/exit.html', (req, res) => {
  //获取用户的值
  let user = req.cookies.user;
  if (user) {
    res.send('1')
  } else {
    res.send('alert("请登录以后再操作"); location.href="./login.html"')
  }
});

/* 退出登录 */
router.get('/cancel.html', (req, res) => {
  //清除cookie
  res.clearCookie('user');
  res.send('<script>alert("退出成功,欢迎回来"); location.href = "./login.html"</script>')
});

/* 显示页面的数据 */
router.get('/userall.html', (req, res) => {
  //查询所有数据
  infoModel.find().sort({"ctime":-1}).exec((err, data) => {
    res.send(data);
  })
});

/* 添加用户 */
router.post('/adduserall', (req, res) => {
  //接收前端的值
  let name = req.body.name;
  let sex = req.body.sex;
  let idtype = req.body.idtype;
  let idcode = req.body.idcode;
  let ctime = new Date().toLocaleString();
  // console.log(name,sex,idtype,idcode);

  //创建实力
  let user = new infoModel();
  user.name = name;
  user.sex = sex;
  user.idtype = idtype;
  user.idcode = idcode;
  user.ctime = ctime;
  //添加到数据库
  user.save((err) => {
    if (err) {
      res.send('0');
    } else {
      res.send('1');
    }
  })

});

//批量删除
router.post('/delAll.html', (req, res) => {
  //接收id值
  let ids = req.body['idAll[]'];

  //去数据库查询 这要存在这几个id的数据 都删除
  infoModel.find({ "_id" : { $in: ids } }).exec((err, data) => {
    if (err) {
      res.send('0');
    } else {
      //循环数组
      for (var i in data) {
        data[i].remove();
      }
      res.send("1");
    }
  })

});

//单条删除
router.get('/delone.html', (req, res) => {

  //接收id
  let id = req.query.id;
  //console.log(id);
  //根据id查找数据
  infoModel.findById(id).exec((err, data) => {
    // console.log(data);
    data.remove((err) => {
      if (err) {
        res.send({ 'errcode': '0', 'msg': '删除失败' });
      } else {
        res.send({ 'errcode': '1', 'msg': '删除成功' });
      }
    })
  })
});

//修改数据回显
router.get('/edixone.html', (req, res) => {
  //接收id
  let id = req.query.id;
  //根据id查询数据
  infoModel.findById(id).exec((err, data) => {
    //console.log(data);
    if (err) {
      res.send({ "errcode": "0", "result": [] });
    } else {
      res.send({ "errcode": "1", "result": data });
    }
  })
});

//修改数据
router.post('/save-edit.html', (req, res) => {
  //接收前端的值
  let name = req.body.name;
  let sex = req.body.sex;
  let idtype = req.body.idtype;
  let idcode = req.body.idcode;
  let id = req.body.id;
  // console.log(id,name,sex,idtype,idcode);

  //根据id修改数据
  infoModel.findById(id).exec((err, data) => {
    // console.log(data);
    data.name = name;
    data.sex = sex;
    data.idtype = idtype;
    data.idcode = idcode;
    //修改数据
    data.save((err) => {
      if (err) {
        res.send('0');
      } else {
        res.send('1');
      }
    })
  })
});

//增加注册登录用户
router.get('/register-add.html', (req, res) => {
  //接收发送的值
  let username = req.query.username;
  let password = req.query.password;
  // console.log(username,password);
  //将接收的值保存到数据库
  //实例化模型并且赋值
  var newusername = new userModel({
    username: username,
    password: password
  });

  newusername.save(function (err) {
    if (err) {
      res.send('0')
    } else {
      res.send('1');
    }
  });
});

//高级查询
router.post('/search.html',(req,res)=>{
  //接收发送的值
  let name = req.body.searchname;
  let sex = req.body.searchsex;
  let idtype = req.body.searchidtype;
  // console.log(name , sex ,idtype);
  //定义变量
  let obj = {}
  //构造查询语句
  if(name != ""){
    obj.name = new RegExp(name);
  }
  if(sex != "全部"){
    obj.sex = sex;
  }
  if(idtype != "全部"){
    obj.idtype = idtype;
  }
  //根据条件查询
  infoModel.find(obj).exec((err,data)=>{
    res.send(data);
  })
});

//密码修改
router.post('/editpwd.html',(req,res)=>{
  //接收前端的值
  let oldpwd = req.body.oldpwd;
  let newpwd = req.body.newpwd;
  let username = req.body.userlogin;
  // console.log(oldpwd, newpwd, userlogin)
  //根据用户和旧密码重新设置新密码
  userModel.find({'username':username,'password':oldpwd}).exec((err,data)=>{
    if(!data.length){
      res.send({"errcode":'0','msg':'旧密码错误！！！'});
    }else{
      data[0].password = newpwd;
      //console.log(data[0].password);
      data[0].save((err)=>{
        if(err){
          res.send({"errcode":'1','msg':'修改失败！！！'});
        }else{
          res.clearCookie('user');
          res.send({"errcode":'2','msg':'修改成功！！！'});
        }
      })
    }
  })
});

module.exports = router;
