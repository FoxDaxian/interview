window.onload=function(){
	//页面加载之后 的瀑布流排版
	waterfall("main","box");
	//当滚动条发生滚动是 发生的事件
	window.onscroll = function(){
		// checkScrollSlide自己封装的函数 :是否具备加载数据块的函数
		// checkScrollSlide 比较的是 最后一个元素距离页面顶部的高度加上自身高度一半的距离，小于滚动距离和页面高度时 为真
		if(checkScrollSlide()){
			var oParent = document.getElementById("main");
			for(var i=10;i<16;i++){
				var oBox = document.createElement("div");
				oBox.className = "box";
				oParent.appendChild(oBox);
				var oPic = document.createElement("div");
				oPic.className = "pic";
				oBox.appendChild(oPic);
				var oImg = document.createElement("img");
				oImg.src = "../css-img/img"+i+".jpg";
				oPic.appendChild(oImg);
			}	
			waterfall("main","box");
		}

	}
}

function waterfall(parent,box){
	//取main父元素
	var oParent = document.getElementById(parent);

	//讲main下的所有class为box 的元素取出来  赋给xBoxs
	var oBoxs = getByClass(oParent,box);

	//计算整个页面显示的列数(页面宽/box的宽度)
	//第一步 利用 offsetWidth来获得元素的宽度（这个宽度包括一切），然后复给oBoxW
	var oBoxW = oBoxs[0].offsetWidth;
//第二步 利用clientWidth 来获取页面的宽度  然后除以box的宽度  由于不知道是不是整数  所以 利用Math.floor来取整  最后赋给cols(列)
	var cols = Math.floor(document.documentElement.clientWidth/oBoxW);

	//设置main(大div)的宽  用每个元素的宽度*总共的列数即可	 style.cssText是用来设置 HTML 元素的 style 属性值。
	oParent.style.cssText = "width:"+oBoxW*cols+"px;margin:0 auto;"

	//设置一个存放每一列(所有图片加起来的总和)高度的数组
	var hArr=[];

	//遍历所有图片oBoxs 
	for(var i = 0; i<oBoxs.length;i++){
		if(i<cols){
			hArr.push(oBoxs[i].offsetHeight);
		}else{
			//存储数组中最小的高度  Math.min();是用来求数组中最小的值 但是只能求数字的 不能求数组的  利用apply(还有一个call)来求
			var minH = Math.min.apply(null,hArr);

			//获取最小高度的索引 并赋给index
			var index = getMinIndex(hArr,minH);

			//给照片加一个绝对定位
			oBoxs[i].style.position = "absolute";

			//设置完position后给照片加 top 和left
			oBoxs[i].style.top = minH+"px";
			//第一种方法  用一个照片的宽度*最小H的索引
			oBoxs[i].style.left = oBoxW*index+"px";
			//第二种方法 获取最小索引对应的照片 到父div 的left值
			//oBoxs[i].style.left = oBoxW[index].offsetLeft+"px";
			
			//将从第二行开始的图片重叠在第一行最矮图片的下面的问题解决
			//改变存放高度的数组 改变最小值的index的那个值  等于它加上新加上的图片的高  offsetHeight
			hArr[index]+=oBoxs[i].offsetHeight;
		}
	}

}

// getByClass作用:根据class获取元素
function getByClass(parent,clsName){
	var boxArr = new Array(),//用来存储得到的所有class为box的元素
		oElements = parent.getElementsByTagName('*');//取得parent下的所有元素
		//遍历oElements
	for(var i=0; i<oElements.length;i++){ 
		if(oElements[i].className == clsName){
			boxArr.push(oElements[i]);
		}
	}
	return boxArr;
}

//获取最小高度的索引
function getMinIndex(arr,val){
	for(var i in arr){
		if(arr[i]==val){
			return i;
		}
	}
}

//检测是否具备滚动加载数据块的条件
function checkScrollSlide(){
	//找到main
	var oParent = document.getElementById("main");

	//找到main下所有class为box的元素
	var oBoxs = getByClass(oParent,"box");

	//获取最后一个盒子的高度(Math.floor()用于取整)
	var lastBoxH = oBoxs[oBoxs.length-1].offsetTop+Math.floor(oBoxs[oBoxs.length-1].offsetHeight/2);

	//滚动条滚动的距离即页面滚走的距离 (混杂模式 是body  标准模式是documentElement)
	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	//获取页面高度 (也有混杂模式和标准模式)
	var height = document.body.clientHeight || document.documentElement.clientHeight;
	//返回的是布尔值，所以
	return (lastBoxH<scrollTop+height)?true:false;
}