import express from 'express';
var MongoClient = require('mongodb').MongoClient;
import bodyParser from 'body-parser';//获取post接口数据

const path = require('path')
const app = express();


// 设置静态资源
app.use(express.static(path.join(__dirname, 'public')));
// 解析以 application/json 和 application/x-www-form-urlencoded 提交的数据
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var url = "mongodb://localhost:27017/"

MongoClient.connect(url, { useUnifiedTopology: true }, function(err,db){
	if (err) throw err;
	
	var dbbase = db.db("lqp");
	
	app.get('/api/list',(req,res)=>{
		dbbase.collection("list").find({}).toArray((err,result)=>{
			if(err) throw err;
			res.json(result)
		})
	})
	app.get('/api/list/detail',(req,res)=>{
		dbbase.collection("listDetail").find({id:req.query._id}).toArray(function(err,result){
			if (err) throw err;
			console.log(result);
			res.json(result)
		})
	})
	//注册
	app.post('/api/regiest',(req,res)=>{
		let { username, password } = req.body;//es6结构赋值
		let info = {"username":username ,"password":password};
		//查找是否存在相同名称
		dbbase.collection("userInfo").find({username:username}).toArray(function(err,result){
			if (err) throw err;
			if(result.length==0){
				 dbbase.collection("userInfo").insertOne(info, function(err, ress) {
				        if (err) throw err;
						res.json({"success":"1"})
				  });
			}else{
				res.json({"success":"账号已注册"})
			}
		})
	})
	//登录验证
	app.post('/api/login',(req,res)=>{
		let { username, password } = req.body;//es6结构赋值
		dbbase.collection("userInfo").find({username:username}).toArray(function(err,result){
			if (err) throw err;
			console.log(result.length)
			if(result.length!==0){
				if(result[0].password == password){
					res.json({"success":"1"})
				}else{
					res.json({"success":"密码错误"})
				}
			}else if(result.length=="0"){
				console.log(result.length,"76756766")
				res.json({"success":"手机号未注册"})
			}
			
		})
	})
})

app.listen(5000,()=>{
	console.log("server is runing on localhost:5000")
})

