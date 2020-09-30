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
var whiteWordsList = ["API","I'm","HTTP","COAP"];

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