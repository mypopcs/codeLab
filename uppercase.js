const fs = require('fs');
//专有名词数组
var whiteWordsGrop = ["API","I'm","HTTP","COAP"];

//定义首字母大写公共函数
function pubUpperCase(z){
    if(typeof z == 'object'){
        //先转小写和清除空白
        for(y =0; y < z.length; y++){
            //分离出首字母
            var str = z[y].toLowerCase().replace(/\si\s/g, ' ');
            z[y] = str.charAt(0).toUpperCase() + str.slice(1);
        }
    } else {
        var str = z.toLowerCase().replace(/\si\s/g, ' ');
        z = str.charAt(0).toUpperCase() + str.slice(1);
    }
    return z
}

//恢复白名单大写
function whiteList(s, whiteWordsList){
    if(typeof s == 'object'){
        for(i = 0; i < s.length; i++){
            for (x = 0; x < whiteWordsList.length; x++){
                //根据白名单生成正则
                var whiteWordsRule = '/' + whiteWordsList[x] + '/ig'
                //eval可以计算某个字符串并执行其中的js代码，比如用来执行正则替换
                s[i] = s[i].replace(eval(whiteWordsRule), whiteWordsList[x])
            }
        }
    } else {
        for (x = 0; x < whiteWordsList.length; x++){
            var whiteWordsRule = '/' + whiteWordsList[x] + '/ig'
            s = s.replace(eval(whiteWordsRule), whiteWordsList[x])
          }
    }
    return s
}

//遍历对象，获取所有数据并传至新数组中
function getValues(file) {
    //如果发现对象属性是object就说明还有子集，需要继续
    for( var values in file){
        var objValues = file[values];
        if(objValues !== null && typeof objValues == 'object'){
            getValues(objValues)
        } else {
            //满足. ? !就分割句子
            if(objValues.match(/(.+?[\.\?\!](\s|$))/g)){
                var splitList = file[values] = objValues.split(/(.+?[\.\?\!](\s|$))/g);
                //执行大写
                pubUpperCase(splitList)
                whiteList(splitList, whiteWordsGrop)
                //重新拼合
                file[values] = splitList.join('').replace(/\s\s/g, ' ');
                //单纯的首字母大写
            } else {
                var objValues = pubUpperCase(objValues)
                file[values] = whiteList(objValues, whiteWordsGrop)
            }

        }
    }
    return file;
}

//读取文件
fs.readFile('./language.json', async function(err, data){
    if (err) {
        return console.log(err);
    } else {
        // console.log("读取文件数据：" + data)
        //将 JSON 转为对象
        var languagesFile = JSON.parse(data)
        var objResult = await getValues(languagesFile)
        //将 JavaScript 值转换为 JSON 字符串,格式化
        var objResultToStr = JSON.stringify(objResult, null, 4)
        fs.writeFile('./languageNew.json', objResultToStr, function(err){
            if(err){
                return console.log(err);
            } else {
                console.log("数据写入成功！");
            }
        })
    }
})