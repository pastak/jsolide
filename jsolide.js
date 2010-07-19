var JSolide={
		slidejson:[],
		allslide:0,
		currentslide:0,
		jsonppath:"",
		startTime:0,
		layout:function(){
		  var docEl  = document.documentElement;
		  var width  = docEl.clientWidth;
		  var height = docEl.clientHeight;
		  var aspect = 4.0 / 3.0;
		  if (width > height * aspect) {
		  	width = height * aspect;
		  }
		  else {
		  	height = width / aspect;
		  }
		  var css = {
		    width: width + "px",
		    height: height-20 + "px",
		  };
		  $("#main").css({
		    width: width + "px",
		    height: height + "px",
		  });
		  $(".slide").css(css);
		  $(".slide>h1").css({
		  	fontSize:(width/13)+"px",
			width:(width-50)+"px"
		  });	
		  $(".slide>ul>li").css({
		  	fontSize:(width/20)+"px"
		  });
		  $("#title>h1").css({
		  	 fontSize: (width-30)/10 +"px",
			 width:(width-50) +"px"
		  });
		  $(".imageslide>img").css({
		  	height:height-height/10*3 +"px"
		  });
		  $("address").css({
		  	fontSize: (width)/25 +"px"
		  });
		  $("pre").css({
		  	margin:25+"px",
			fontSize:(width)/25 +"px"
		  })
		  $("#footer").css({
		  	fontSize:width/20 +"px",
			bottom:width/20 +"px",
			textAlign:"right",
			color:"white",
			position:"relative"
		})
		$(".subject").css({
			fontSize:width/13 +"px",
			verticalAlign:"middle",
			textAlign:"center",
		})
		$(".subject>p").css({
			top:height*0.2,
			position:"relative"
		})
	},
	Go2Next:function(){
		if(JSolide.allslide!=JSolide.currentslide){
			var effect=JSolide.slidejson.slides[(JSolide.currentslide)].effect;
			if(!effect&&JSolide.slidejson.meta.all_effect){
				effect=JSolide.slidejson.meta.all_effect;
			}
			if(JSolide.slidejson.slides[(JSolide.currentslide)].type=="subject"){
			$(".currentslide").animate({
				fontSize:"100px",
				opacity:"0"
			},500).removeClass("currentslide").hide().next().fadeIn().addClass("currentslide");
			}else if (effect) {
				switch (effect) {
					case "fade":
						$(".currentslide").fadeOut().removeClass("currentslide").next().fadeIn().addClass("currentslide");
						break;
				}
			}else{
				$(".currentslide").removeClass("currentslide").hide().next().show().addClass("currentslide");
			}
			JSolide.currentslide++;
			location.hash=("#page_"+(JSolide.currentslide+1));
			if (document.getElementById("nowpage")) {
				$("#nowpage").text(JSolide.currentslide + 1);
			}
		}
	},
	Go2Prev:function(){
		if((JSolide.currentslide-1)>=0){
			var effect=JSolide.slidejson.slides[(JSolide.currentslide-1)].effect;
			if(!effect&&JSolide.slidejson.meta.all_effect){
				effect=JSolide.slidejson.meta.all_effect
			}
			effect=false;
			if(effect){
				switch (effect) {
					case "fade":
						$(".currentslide").fadeOut().removeClass("currentslide").prev().fadeIn().addClass("currentslide");
						break;
				}
			}else{
				$(".currentslide").hide().removeClass("currentslide").prev().show().addClass("currentslide");
			}
			JSolide.currentslide--;
			location.hash=("#page_"+(JSolide.currentslide+1));
			if(document.getElementById("nowpage")){
				$("#nowpage").text(JSolide.currentslide+1);
			}
			
		}
	},
	init:function(){
		var page=parseInt(location.hash.replace("#page_",""));
		if(!page>0){
			var page=1;
		}
		this.jsonpath=location.search.replace("?data=","");
		location.hash=("#page_"+page);
		this.currentslide=page-1;
		document.body.style.overflow = "hidden";
		this.getJSON();
		shortcut.add("Right",this.Go2Next);
		shortcut.add("Enter",this.Go2Next);
		shortcut.add("Return",this.Go2Next);
		shortcut.add("Space",this.Go2Next);
		shortcut.add("Backspace",this.Go2Prev);
		shortcut.add("Left",this.Go2Prev);
	},
	convertSlide:function(){
		var titleslide=document.createElement("div");
		titleslide.className="slide title";
				
		var title=document.createElement("h1");
		$(title).text(this.slidejson.meta.title);
		$(titleslide).append(title);
		var address=document.createElement("address");
		var i=0;
		var authortext="";
		while(JSolide.slidejson.meta.author[i]){
			authortext+=(JSolide.slidejson.meta.author[i++]+"<br />");
		}
		$(address).html(authortext);
		$("#main").append($(titleslide).append(address));
		
		var slides=this.slidejson.slides;
		this.allslide=slides.length;
		var slide,h1,list,p,temp;
		for(i=0;i<slides.length;i++){
			slide=slides[i];
			switch(slide.type){
				case "list":
					$("#main").append(this.MakingSlide.list(slide));
					break;
				case "img":
					$("#main").append(this.MakingSlide.img(slide));
					break;
				case "code":
					$("#main").append(this.MakingSlide.code(slide));
					break;
				case "subject":
					$("#main").append(this.MakingSlide.subject(slide));
					break;
			}
		}
		this.setFooter();
		this.layout();
		prettyPrint();
		$(".slide:eq("+this.currentslide+")").addClass("currentslide").show();
	},
	MakingSlide:{
		list:function(slide){
			list=$("<ul></ul>");
			for(var s=0;s<slide.text.length;s++){
				$(list).append($("<li></li>").html(JSolide.textConvert(slide.text[s])));
			}
			return $("<div></div>").addClass("slide").append($("<h1>"+slide.h1+"</h1>")).append(list);
		},
		img:function(slide){
			var slidediv=$("<div></div>").addClass("slide").addClass("imageslide");
			if(slide.h1){
				slidediv.append($("<h1>"+slide.h1+"</h1>"));
			}
			slidediv.append($("<img>").attr("src",slide.img));
			return slidediv;
		},
		code:function(slide){
			var slidediv=$("<div></div>").addClass("slide");
			if(slide.h1){
				slidediv.append($("<h1>"+slide.h1+"</h1>"));
			}
			var codes=slide.code;
			var text="";
			for(var i=0;i<codes.length;i++){
				text+=(codes[i]+"\n");
			}
			slidediv.append($("<pre></pre>").css({
				backgroundColor:"white"
			}).append($("<code></code>").addClass("prettyprint").text(text)));
			return slidediv;
		},
		subject:function(slide){
			var slidediv=$("<div></div>").addClass("slide").addClass("subject");
			var text=slide.text;
			var p=$("<p />").text(text).css({
				textAlign:"center"
			})
			$(slidediv).append(p);
			return slidediv;
		}
	},
	getJSON:function(){
		$.ajax({
			url:this.jsonpath,
			dataType: "json",
			complete:function(json){
				JSolide.slidejson=jQuery.parseJSON(json.responseText);
				JSolide.convertSlide();
			}
		});
	},
	textConvert:function(text){
		var reg=new RegExp("\\\[.+\\\]","g");
		var syntaxtext=text.match(reg);
		if(!syntaxtext){
			return text;
		}
		var syntax,syntaxpart,afterconvert;
		for(var i=0;i<syntaxtext.length;i++){
			syntax=syntaxtext[i].replace(/[\[\]]/g,"");
			syntaxpart=syntax.split(":");
			switch(syntaxpart[0]){
				case "http":
					if(syntaxpart[2]){
						afterconvert=("<a href='http:"+syntaxpart[1]+"' target='_blank'>"+syntaxpart[2]+"</a>");
					}else{
						afterconvert=("<a href='http:"+syntaxpart[1]+"' target='_blank'>"+"http:"+syntaxpart[1]+"</a>");
					}
					break;
				case "image":
					if(syntaxpart[2]){
						afterconvert=("<img src='http:"+syntaxpart[2]+"/>");
					}else{
						afterconvert=("<img src='"+syntaxpart[1]+"/>");
					}
					break;
			}
			text=text.replace(syntaxtext[i],afterconvert);
		}
		return text;
	},
	setFooter:function(){
		var footerinfo=this.slidejson.meta.footer;
		if (footerinfo == "page") {
			var footer = $("<div />").attr("id", "footer");
			var now = $("<span />").attr("id", "nowpage").text(this.currentslide + 1);
			var all = $("<span />").attr("id", "allpage").text(this.allslide + 1);
			footer.append(now).html($(footer).html() + "/").append(all);
		}else if(footerinfo=="time"){
			var footer = $("<div />").attr("id", "footer");
			footer.append(
				$("<span />").attr("id","time")
			);
			var d=new Date();
			this.starttime=d.getTime();
			setInterval(function(){
				var da=new Date();
				var spendtime=parseInt((da.getTime()-JSolide.starttime)/1000);
				console.log(spendtime);
				var min,sec;
				if(spendtime>=60){
					sec=spendtime%60;
					min=(spendtime-sec)/60;
				}else{
					sec=spendtime;
					min=0;
				}
				if(sec<10){
					sec=("0"+sec);
				}
				if(min<10){
					min=("0"+min);
				}
				$("#time").text(min+":"+sec)
			},350)
		}
		
		$("#main").append(footer);
	}
}