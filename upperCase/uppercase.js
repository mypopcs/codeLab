const fs = require('fs');

//专有名词数组
var settings = JSON.parse(fs.readFileSync('whiteWords.json', 'utf8'))
var whiteWordsGrop = settings.whiteWords

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
    //如果s是一个对象，就说明是多个句子组合，每个句子都执行匹配
    if(typeof s == 'object'){
        for(i = 0; i < s.length; i++){
            //将每句拆分为单个单词
            var oneWords = s[i].split(' ')
            for( o = 0; o < oneWords.length; o++){
                for (x = 0; x < whiteWordsList.length; x++){
                    //单词在句子中匹配
                    if(RegExp(whiteWordsList[x], 'ig').test(s[i]) == true){
                        s[i] = s[i].replace(RegExp('\\b' + whiteWordsList[x] +'\\b', 'ig'), whiteWordsList[x])
                    }
                    //单个单词匹配
                    if(whiteWordsList[x] == oneWords[o]) {
                        oneWords[o] = whiteWordsList[x]
                        s[i] = oneWords.join(' ')
                    }
                }
            }
        }
        
    } else {
        var oneWords = s.split(' ')
        console.log(s)
        for (o = 0; o < oneWords.length; o++){
            for (x = 0; x < whiteWordsList.length; x++){
                if(RegExp(whiteWordsList[x], 'ig').test(s) == true){
                    s = s.replace(RegExp('\\b' + whiteWordsList[x] +'\\b', 'ig'), whiteWordsList[x])
                }
                if(whiteWordsList[x] == oneWords[o]) {
                    oneWords[o] = whiteWordsList[x]
                    s = oneWords.join(' ')
                }
            }
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
            // \s匹配所有空白符，包括换行；.匹配除换行符之外任何单字符；+匹配前面的子表达式一次或多次；?匹配前面的子表达式零次或一次；$匹配输入字符串的结尾位置
            //()标记一个子表达式的开始和结束位置；[]标记一个中括号表达式的开始与结束
            // \b 匹配一个单词边界，即字与空格间的位置；\d匹配数字；/i忽略大小写
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
function readFile(file, newPath){
    console.log("开始读取" + file + '数据------------');
    fs.readFile(file, async function(err, data){
        if (err) {
            return console.log(err);
        } else {
            // console.log("读取文件数据：" + data)
            //将 JSON 转为对象
            var languagesFile = JSON.parse(data)
            var objResult = await getValues(languagesFile)
            //将 JavaScript 值转换为 JSON 字符串,格式化
            var objResultToStr = JSON.stringify(objResult, null, 4)
            fs.writeFile(newPath, objResultToStr, function(err){
                if(err){
                    return console.log(err);
                } else {
                    console.log(file + ':' + "数据写入成功！");
                }
            })
        }
    })
}

var oldPath = './english/'
var newPath = './newEnglish/'

fs.readdir(oldPath, 'utf8', function(err, data) {
    //删除第一个.DS_Store
    for( d = 0; d < data.length; d++){
        if(data[d] == '.DS_Store'){
            //splice() 方法可删除从 index 处开始的零个或多个元素(第二个值)，并且用参数列表中声明的一个或多个值来替换那些被删除的元素。
            data.splice(d,1);
        }
        console.log('读取到列表：' + data)
        var fileName = data[d]
        var oldFilePath = oldPath + fileName
        var newFilePath = newPath + fileName
        readFile(oldFilePath, newFilePath)
    }
})