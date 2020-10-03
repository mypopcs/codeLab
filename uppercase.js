const lgFile = {
    title: {
      h1: 'this is a title',
      content:
        "hello, i'm a demo page. if you see my api words uppercase. it's working!",
      this: 'bug',
    },
    h2: 'this is h2, h1 , coap, already used',
};
var values = [];
//专有名词数组
var whiteWordsGrop = ["API","I'm","HTTP","COAP"];

//遍历对象，获取所有数据并传至新数组中
function getValues(file) {
    if (file !== null && typeof file == 'object') {
      for (var key in file) {
        getValues(file[key]);
      }
    } else {
      values.push(file);
    }
}

//定义首字母大写公共函数
function pubUpperCase(index, arrayList) {
    //先转小写和清除空白
    var str = arrayList[index].toLowerCase().replace(/\si\s/g, ' ');
    arrayList[index] = str.charAt(0).toUpperCase() + str.slice(1);
}

//定义句子首字母大写，包括句号和问号后的首字母的函数
async function sentenceCase(array){
    //以指定的方式为分隔符对字符串进行分割
    for (i = 0; i < array.length; i++){
        //先执行匹配.和?和！
        if(array[i].match(/(.+?[\.\?\!](\s|$))/g)){
            //如果匹配到就执行分段
            array[i] = array[i].split(/(.+?[\.\?\!](\s|$))/g);
            for(y = 0; y < array[i].length; y++){
                pubUpperCase(y, array[i]);
            }
            //重新拼合成句子
            array[i] = array[i].join('').replace(/\s\s/g, ' ');
        } else {
             //没有匹配到就只需要执行首字母大写
            pubUpperCase(i, array);
        }

    }
}

//恢复白名单大写
async function whiteList(file, whiteWords){
    await getValues(file);
    sentenceCase(values);
    for (i = 0; i < values.length; i++){
        for (x = 0; x < whiteWords.length; x++){
            var whiteWordsRegex = '/' + whiteWords[x] + '/ig'
            values[i] = values[i].replace(eval(whiteWordsRegex), whiteWords[x])
        }
    }
}
whiteList(lgFile, whiteWordsGrop)