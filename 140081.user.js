// ==UserScript==
// @name           DotD Raid Catcher
// @namespace      tag://kongregate
// @description    DotD raid assistance.
// @author         JHunz, wpatter6
// @version        0.0.1
// @date           11.02.2012
// @grant          GM_xmlHttpRequest
// @include		   *armorgames.com/dawn-of-the-dragons-game*
// @include        http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        *web*.dawnofthedragons.com/*
// ==/UserScript==

function shared() {//bulk of the script, shared between sites
	
	console.log("[RaidCatcher] Shared script adding...");
	if (typeof GM_setValue == 'undefined' || typeof GM_getValue == 'undefined' || typeof GM_deleteValue == 'undefined') {
		GM_setValue = function (name,value) {
			localStorage.setItem(name, (typeof value).substring(0,1) + value);
		}
		GM_getValue = function (name,dvalue) {
			var value = localStorage.getItem(name);
			if (typeof value != 'string') {
				return dvalue;
			}
			else {
				var type = value.substring(0,1);
				value = value.substring(1);
				if (type == 'b') {
					return (value == 'true');
				}
				else if (type == 'n') {
					return Number(value);
				}
				else {
					return value;
				}
			}
		}
		GM_deleteValue = function (name)  {
			localStorage.removeItem(name);
		}
	}

	window.RaidCatcher = {
		version: {major: '0.0.1', minor: 'wpatter6/JHunz'},
		ui:{//raid tab creation/interaction
			cHTML: function (ele) {
				function cEle(ele) {
					this._ele = ele;
					this.ele = function(){
						return this._ele
					}
					this.set = function (param) {
						for (var attr in param) {
							if (param.hasOwnProperty(attr)) {
								this._ele.setAttribute(attr,param[attr]);
							}
						}
						return this
					}
					this.text = function(text){
						this._ele.appendChild(document.createTextNode(text));
						return this
					}
					this.html = function(text,overwrite){
						if (overwrite){
							this._ele.innerHTML=text
						}
						else {
							this._ele.innerHTML+=text
						}
						return this
					}
					this.attach = function (method,ele) {
						if (typeof ele == 'string') ele = document.getElementById(ele);
						if (!(ele instanceof Node)){
							throw "Invalid attachment element specified"
						}
						else if (!/^(?:to|before|after)$/i.test(method)){
							throw "Invalid append method specified"
						}
						else if (method == 'to'){
							ele.appendChild(this._ele)
						}
						else if (method == 'before'){
							ele.parentNode.insertBefore(this._ele,ele)
						}
						else if (typeof ele.nextSibling == 'undefined'){
							ele.parentNode.appendChild(this._ele)
						}
						else {
							ele.parentNode.insertBefore(this._ele,ele.nextSibling)
						}
						return this;
					}
					this.on=function(event,func,bubble){
						this._ele.addEventListener(event,func,bubble);
						return this;
					}
				}
				if (typeof ele == "string"){
					ele = (/^#/i.test(ele)?document.getElementById(ele.substring(1)):document.createElement(ele));
				}
				if (ele instanceof Node){
					return new cEle(ele)
				}
				else {
					throw "Invalid element type specified"
				}
			},
			init: function(el) {//param is raid pane to generate UI in
				RaidCatcher.ui.cHTML('style').set({type: "text/css",id: 'DotD_shared_styles'}).text(' \
					#dotd_tab_pane ul{margin: 0px;padding: 0px;list-style-type: none;position: relative;}\
					#dotd_tab_pane ul li.tab{float: left;height: 100%;}\
					#dotd_tab_pane ul li.tab.active div.tab_head{background-color:white;cursor:default;text-decoration:none;}\
					#dotd_tab_pane ul li.tab div.tab_head{font-family: Verdana, Arial, sans-serif;font-size: 10px;padding: 3px 5px 4px 5px;background-color: silver;cursor: pointer;text-decoration: underline;margin-right: 1px;}\
					#dotd_tab_pane ul li.tab.active div.tab_pane{position: absolute;display: block;left: 0px;}\
					#dotd_tab_pane ul li.tab div.tab_pane{padding: 2px 5px;background-color: white;display: none; width:100%; height:100%;}\
				').attach('to',document.head);
				
				var pane = RaidCatcher.ui.cHTML('div').set({style: 'padding:5px;width:100%;height:100%;'}).html('\
					<div class="room_name_container h6_alt mbs">DotD Extension - <span class="room_name" id="StatusOutput"></span></div> \
					<div class="room_name_container h6_alt mbs" id="UpdateNotification" style="display:none">Your script version is out of date.  <a href="http://userscripts.org/scripts/show/140080" target="_blank">Update</a> <a href="#" onclick="document.getElementById(\'UpdateNotification\').style.display=\'none\'; return false;">Dismiss</a></div> \
					<ul id="RaidCatcher_tabpane_tabs"> \
						<li class="tab active"> \
							<div class="tab_head">Raids</div> \
							<div class="tab_pane"> \
								This is the raids tab \
							</div> \
						</li> \
						<li class="tab"> \
							<div class="tab_head">Options</div> \
							<div class="tab_pane"> \
								This is the options tab \
							</div> \
						</li> \
						<li class="tab"> \
							<div class="tab_head">Filters</div> \
							<div class="tab_pane"> \
								This is the filters tab \
							</div> \
						</li> \
					</ul> \
				').attach("to",el).ele();
				
				var e = pane.getElementsByClassName("tab_head")
				for (var i = 0;i<e.length;i++) {
					e[i].addEventListener("click",function(){
						if (!/\bactive\b/i.test(this.className)) {
							var e = document.getElementById("dotd_tab_pane").getElementsByTagName("li");
							for (var i = 0;i<e.length;i++) {
								if (e[i].getAttribute("class").indexOf("active") > -1) e[i].className = e[i].className.replace(/ active$/g,"");
							}
							(this.parentNode).className += " active";
						}
					});
				}
				var e = pane.getElementsByClassName("tab_pane");
				var w = el.offsetWidth - 24;
				var h = el.offsetHeight - e[0].offsetTop - 36;
				for (var i = 0;i<e.length;i++) {
					e[i].style.width = w + "px";
					e[i].style.height = h + "px";
				}
			},
			addRaid: function(id){//todo gui.addRaid;
			},
			filterRaidList: function (){//todo filter
			}
		},
		chat: {//chat input/output (kong only)
			init: function(){
				console.log('[RaidCatcher] Kongregate chat initializing...');
				RaidCatcher.chat.echo = function(msg){holodeck.activeDialogue().RaidCatcher_echo(msg)};
				RaidCatcher.chat.output = function(msg, whisper, to){//DoWork
					if(whisper && ((to||'') != '')) msg = "/w " + to + " " + msg;
					console.log('RaidCatcher chat output] '+msg);
					var txt = [];		
					var elems=document.getElementsByClassName('chat_input');
					for(i=0;i<elems.length;i++){
						txt[i] = elems[i].value;
						elems[i].value = msg;
					}
					holodeck.activeDialogue().sendInput();
					for(i=0;i<txt.length;i++) elems[i].value = txt[i];
				}
				RaidCatcher.chat.linkClick = function(href){//ChatLinkClick
				}
				
				//todo add all kong chat commands & raids from chat
				ChatDialogue.prototype.RaidCatcher_echo = function(msg){
					this.RaidCatcher_DUM("DotD Extension","<br>"+msg,{class: "whisper whisper_received"},{non_user: true})
				}
				ChatDialogue.prototype.RaidCatcher_DUM = ChatDialogue.prototype.displayUnsanitizedMessage;
				ChatDialogue.prototype.displayUnsanitizedMessage=function (b,d,e,f) {//b=user,d=message,e=element,f=unk
					if(!this._user_manager.isMuted(b)){
						if (typeof e != 'object') { e = {class: ''}  }
						else if (typeof e.class != 'string') { e.class = ''; }
						var isPublic = false;
						try { isPublic = (/^room_\d+-dawn-of-the-dragons-\d+$/i.test(this._holodeck._chat_window._active_room._short_room_name) && e.class.indexOf("whisper") == -1?true:false) }
						catch(err){}

						var raid = RaidCatcher.util.getRaidLink(d,b)
						if (typeof raid == 'object') {
							e.class+= " SRDotDX_raid";
							e.class+= " SRDotDX_hash_"+raid.hash;
							e.class+= " SRDotDX_raidid_"+raid.id;
							e.class+= (raid.seen?" SRDotDX_seenRaid":'');
							e.class+=(raid.visited?" SRDotDX_visitedRaid":'');
							e.class+=(raid.nuked?" SRDotDX_nukedRaid":'');
							e.class+=" SRDotDX_filteredRaidChat" + raid.boss + '_' + (raid.diff - 1);							
							d = raid.ptext + '<a href="'+raid.url+'" onClick="return false;" onMouseDown="RaidCatcher.chat.linkClick(this.href,'+'\''+raid.id+'\''+');return false;">'+raid.linkText()+'</a>'+raid.ntext;
							//SRDotDX.gui.toggleRaid('visited',raid.id,raid.visited);//TODO
							RaidCatcher.raids.list[raid.id].seen = true;
							//SRDotDX.gui.raidListItemUpdate(raid.id); //TODO
							if(raid.isNew){
								//if(!RaidCatcher.session.AutoJoin)
								//	RaidCatcher.ui.updateMessage();
								RaidCatcher.ui.filterRaidList();
							}
						}
						if(RaidCatcher.settings.mutedUsers[b]){
							e.class+=" SRDotDX_nukedRaidList";
							console.log("[RaidCatcher] Muted message recieved from " + b + " : " + d);
						}
						this.RaidCatcher_DUM(b,d,e,f);
					}
				}
				console.log("[RaidCatcher] Kongregate chat initialized.");
			}
		},
		db: {//todo server interaction
			get: function(filter){//todo server get (GM_xmlHttpRequest works in chrome now)
			}
		},
		raids: (function(){//stored raid list
			var tmp;
			try{ tmp=JSON.parse(GM_getValue('RaidCatcher_raids','{}')) }
			catch (e) { tmp={} }
			
			//properties
			tmp.count=(typeof tmp.count=='number'?tmp.count:0);
			tmp.list=(typeof tmp.list=='object'?tmp.list:{});
			
			GM_setValue('RaidCatcher_raids',JSON.stringify(tmp));
			
			//functions
			tmp.addRaid = function(hash,id,boss,diff,seen,visited,user,ts,room) {
				id=RaidCatcher.util.cleanRaidId(id);
				if (typeof RaidCatcher.raids.getRaid(id) != 'object') {
					RaidCatcher.raids.list[id] = {
						hash: hash,
						id: id,
						boss: boss,
						diff: diff,
						seen: seen,
						visited: visited,
						user: user,
						lastUser: user,
						expTime: (typeof RaidCatcher.data.raids[boss] == 'object'?RaidCatcher.data.raids[boss].duration:168) * 3600+parseInt((new Date).getTime() / 1000),
						timeStamp: ((typeof ts ==='undefined'||ts==null)?(new Date().getTime()):parseInt(ts)),
						nuked: false
					}
					RaidCatcher.ui.addRaid(id);
					RaidCatcher.raids.count++;
					setTimeout('RaidCatcher.util.purge()', 1);
				}
				RaidCatcher.raids.list[id].lastUser = user;
				return RaidCatcher.raids.list[id];
			}
			tmp.getRaid = function(id){
				var r = RaidCatcher.raids.list[id];
				if(typeof r === 'undefined') return false;
				
				var raidList = document.getElementById('raid_catcher_list').childNodes;
				for(i=0; i<raidList.length; i++) {
					var item = raidList[i];
					if(item.getAttribute("raidid")==id){ r.ele = item; return r }
				}
				delete RaidCatcher.raids.list[id]; //element doesn't exist, something funky happened
			}
			tmp.deleteRaid = function(id) {//returns true if successful, always use this to delete raids. 
				if(typeof RaidCatcher.raids.getRaid(id) == 'object'){
					var raidList = document.getElementById('raid_catcher_list').childNodes;
					delete RaidCatcher.raids.list[id];
					for(i=0; i<raidList.length; i++) if(item.getAttribute("raidid")==id){ raidList.removeChild(item); break; }
					RaidCatcher.raids.count--;
					return true;
				} return false;
			}
			tmp.getRaids = function (s) {//pass string to get raids you want, false to get selected non-dead raids, anything else to get currently selected raids
				var r = [];
				s = (typeof s=='boolean'?(s?RaidCatcher.settings.selectedRaids:RaidCatcher.settings.selectedRaids.replace('nuked_', '')):(typeof s == 'string'?s:RaidCatcher.settings.selectedRaids));
				if(!/visible/.test(s) && !/hidden/.test(s)) s += 'visible_hidden_';
				if(!/visited/.test(s) && !/new/.test(s)) s += 'visited_new_';
				if(!/nuked/.test(s) && !/alive/.test(s)) s += 'nuked_alive_';
				console.log("[RaidCatcher] Getting " + s);
				if(s != ""){
					var raidList = document.getElementById('raid_catcher_list').childNodes;
					for(i=0; i<raidList.length; i++) {
						var item = raidList[i];
						var raid = RaidCatcher.raids.list[item.getAttribute("raidid")];
						if (!(typeof raid === 'undefined') && (
							(/all/.test(s)) ||
							(((/visited/.test(s) && raid.visited) || (/new/.test(s) && !raid.visited)) &&
							((/visible/.test(s) && item.offsetWidth+item.offsetHeight>0) || (/hidden/.test(s) && item.offsetWidth+item.offsetHeight==0)) &&
							((/nuked/.test(s) && raid.nuked) || (/alive/.test(s) && !raid.nuked)))
						)) {
							try {
								r.push(JSON.parse(JSON.stringify(raid)));
								r[r.length-1].ele = item
							} catch(ex){console.log("[RaidCatcher Error] "+ex+"\nraid var="+raidList[i]+raidList[i].innerHTML);return false;} 
						}
					}
				}
				console.log("[RaidCatcher] Got selected " + r.length);
				return r;
			}
			tmp.save = function(b){//pass bool to specify if it should repeat
				b = (typeof b==='undefined'?true:b);
				GM_setValue('RaidCatcher_raids',JSON.stringify(RaidCatcher.raids));
				if(b) setTimeout('RaidCatcher.raids.save(true);',30000);
				console.log('[RaidCatcher] Raids saved (repeat="+b+")');
			}
			return tmp;
		})(),
		settings: (function(){//saved configuration
			var tmp;
			try{ tmp = JSON.parse(GM_getValue('RaidCatcher_settings','{}')) }
			catch (e){tmp = {}}
			
			//boolean
			tmp.hideRaidLinks = (typeof tmp.hideRaidLinks == 'boolean'?tmp.hideRaidLinks:false);
			tmp.hideVisitedRaids = (typeof tmp.hideVisitedRaids == 'boolean'?tmp.hideVisitedRaids:false);
			tmp.hideVisitedRaidsInRaidList = (typeof tmp.hideVisitedRaidsInRaidList == 'boolean'?tmp.hideVisitedRaidsInRaidList:false);
			tmp.hideSeenRaids = (typeof tmp.hideSeenRaids == 'boolean'?tmp.hideSeenRaids:false);
			tmp.markRightClick = (typeof tmp.FPXmarkRightClick == 'boolean'?tmp.FPXmarkRightClick:false);
			tmp.markMyRaidsVisted = (typeof tmp.markMyRaidsVisted == 'boolean'?tmp.markMyRaidsVisted:false);
			tmp.useMaxRaidCount = (typeof tmp.useMaxRaidCount =='boolean'?tmp.useMaxRaidCount:false);
			tmp.refreshGameToJoin = (typeof tmp.refreshGameToJoin == 'boolean'? tmp.refreshGameToJoin:true);
			tmp.confirmDeletes = (typeof tmp.confirmDeletes == 'boolean'?tmp.confirmDeletes:true);
			tmp.asyncJoin = (typeof tmp.asyncJoin == 'boolean'?tmp.asyncJoin:false);
			tmp.showRaidLink = (typeof tmp.showRaidLink == 'boolean'?tmp.showRaidLink:true);
			tmp.formatRaidLinks = (typeof tmp.formatRaidLinks == 'boolean'?tmp.formatRaidLinks:true);
			tmp.filterChatLinks = (typeof tmp.filterChatLinks == 'boolean'?tmp.filterChatLinks:true);
			tmp.filterRaidList = (typeof tmp.filterRaidList == 'boolean'?tmp.filterRaidList:false);
			tmp.newRaidsAtTopOfList = (typeof tmp.newRaidsAtTopOfList == 'boolean'?tmp.newRaidsAtTopOfList:false);
			
			//numbers
			tmp.maxRaidCount = (typeof tmp.maxRaidCount == 'number'?tmp.maxRaidCount:3000);
			tmp.asyncJoinCount = (typeof tmp.asyncJoinCount == 'number'?tmp.asyncJoinCount:5);
			tmp.lastUpdateCheck = (typeof tmp.lastUpdateCheck == 'number'?tmp.lastUpdateCheck:0);
			
			//strings
			tmp.whisperTo = (typeof tmp.whisperTo == 'string'?tmp.whisperTo:'');
			tmp.raidLinkFormat = (typeof tmp.raidLinkFormat == 'string'?tmp.raidLinkFormat:"<seen:(s) ><visited:(v) ><shortname> - <diff> - <fs>/<os>");
			tmp.raidLinkFormat = tmp.raidLinkFormat.replace(/&#91;/g,"[").replace(/&#93;/g,"]").replace(/&#123;/g,"{").replace(/&#125;/g,"}")
			tmp.unvisitedRaidPruningMode = (typeof tmp.unvisitedRaidPruningMode == 'number'? tmp.unvisitedRaidPruningMode : 1);
			tmp.selectedRaids = (typeof tmp.selectedRaids == 'string'?tmp.selectedRaids:"");

			//objects
			tmp.mutedUsers = (typeof tmp.mutedUsers =='object'?tmp.mutedUsers:{});
			tmp.filters = (typeof tmp.filters =='object'?tmp.filters:{});
			
			GM_setValue("RaidCatcher_settings",JSON.stringify(tmp));
			
			//functions
			tmp.setFilter = function(raidid,diff,val) { RaidCatcher.settings.filters[raidid][diff] = val; }
			tmp.getFilter = function(raidid,diffIndex) {
				if (typeof RaidCatcher.settings.filters[raidid] == 'boolean') {
					var tempVal = RaidCatcher.settings.filters[raidid];
					RaidCatcher.settings.filters[raidid] = [tempVal, tempVal, tempVal, tempVal, tempVal, tempVal];
				} else if ((typeof RaidCatcher.settings.filters[raidid] != 'boolean') && (typeof RaidCatcher.settings.filters[raidid] != 'object')) {
					var raid = RaidCatcher.raids.list[raidid];
					if (raid.size == 1 || raid.stat == 'H' || raid.stat == 'h') {
						RaidCatcher.settings.filters[raidid] = [true, true, true, true, true, true];
					} else {
						RaidCatcher.settings.filters[raidid] = [false, false, false, false, false];
					}
				} return RaidCatcher.settings.filters[raidid][diffIndex];
			}
			tmp.save = function () {
				var a = RaidCatcher.settings.raidFormat;
				RaidCatcher.settings.raidFormat = RaidCatcher.settings.raidLinkFormat.replace(/\{/g,"&#123;").replace(/\}/g,"&#125;").replace(/\[/g,"&#91;").replace(/\]/g,"&#93;")
				GM_setValue("RaidCatcher_settings",JSON.stringify(RaidCatcher.settings));
				RaidCatcher.settings.raidFormat = a;
				console.log("[RaidCatcher] Settings saved");
			}
			return tmp;
		})(),
		util: {//utility functions
			cleanRaidId: function(id) {//todo .gui.GetRaidID:
				return id;
			},
			purge: function(){//todo .purge();
				return;
			},/*
			elfade: function(elem,time){if(typeof time!='number')time=500;if(typeof elem=='string')elem=document.getElementById(elem);if(elem==null)return;var startOpacity=elem.style.opacity||1;elem.style.opacity=startOpacity;var tick=1/(time/100);(function go(){elem.style.opacity=Math.round((elem.style.opacity-tick)*100)/100;if(elem.style.opacity>0)setTimeout(go,100);else elem.style.display='none'})()},
			isNumber: function(n) {return !isNaN(parseFloat(n)) && isFinite(n);},
			dateFormat: function(){var token=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,timezone=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,timezoneClip=/[^-+\dA-Z]/g,pad=function(val,len){val=String(val);len=len||2;while(val.length<len)val="0"+val;return val};return function(date,mask,utc){var dF=dateFormat;if(arguments.length==1&&Object.prototype.toString.call(date)=="[object String]"&&!/\d/.test(date)){mask=date;date=undefined}date=date?new Date(date):new Date;if(isNaN(date))throw SyntaxError("invalid date");mask=String(dF.masks[mask]||mask||dF.masks["default"]);if(mask.slice(0,4)=="UTC:"){mask=mask.slice(4);utc=true}var _=utc?"getUTC":"get",d=date[_+"Date"](),D=date[_+"Day"](),m=date[_+"Month"](),y=date[_+"FullYear"](),H=date[_+"Hours"](),M=date[_+"Minutes"](),s=date[_+"Seconds"](),L=date[_+"Milliseconds"](),o=utc?0:date.getTimezoneOffset(),flags={d:d,dd:pad(d),ddd:dF.i18n.dayNames[D],dddd:dF.i18n.dayNames[D+7],m:m+1,mm:pad(m+1),mmm:dF.i18n.monthNames[m],mmmm:dF.i18n.monthNames[m+12],yy:String(y).slice(2),yyyy:y,h:H%12||12,hh:pad(H%12||12),H:H,HH:pad(H),M:M,MM:pad(M),s:s,ss:pad(s),l:pad(L,3),L:pad(L>99?Math.round(L/10):L),t:H<12?"a":"p",tt:H<12?"am":"pm",T:H<12?"A":"P",TT:H<12?"AM":"PM",Z:utc?"UTC":(String(date).match(timezone)||[""]).pop().replace(timezoneClip,""),o:(o>0?"-":"+")+pad(Math.floor(Math.abs(o)/60)*100+Math.abs(o)%60,4),S:["th","st","nd","rd"][d%10>3?0:(d%100-d%10!=10)*d%10]};return mask.replace(token,function($0){return $0 in flags?flags[$0]:$0.slice(1,$0.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"};dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]},
			timeSince: function(date,after){if(typeof date=='number')date=new Date(date);var seconds=Math.abs(Math.floor((new Date().getTime()-date.getTime())/1000));var interval=Math.floor(seconds/31536000);var pretext="about ";var posttext=" ago";if(after)posttext=" left";if(interval>=1){return pretext+interval+" year"+(interval==1?'':'s')+posttext}interval=Math.floor(seconds/2592000);if(interval>=1){return pretext+interval+" month"+(interval==1?'':'s')+posttext}interval=Math.floor(seconds/86400);if(interval>=1){return pretext+interval+" day"+(interval==1?'':'s')+posttext}interval=Math.floor(seconds/3600);if(interval>=1){return pretext+interval+" hour"+(interval==1?'':'s')+posttext}interval=Math.floor(seconds/60);if(interval>=1){return interval+" minute"+(interval==1?'':'s')+posttext}return Math.floor(seconds)+" second"+(seconds==1?'':'s')+posttext},
			removeDupes: function(arr){var i,len=arr.length,out=[],obj={};for(i=0;i<len;i++){obj[arr[i]]=0}for(i in obj){out.push(i)}return out},
			reload: function () {
				RaidCatcher.chat.echo("Reloading, please wait...");
				var reg = new RegExp(/var iframe_options = ([^\x3B]+)/g);
				var match = reg.exec(activateGame); 
				var iframe_options = eval('('+match[1]+')');
				$('gameiframe').replace(new Element('iframe', {"id":"gameiframe","name":"gameiframe","style":"border:none;position:relative;z-index:1;","scrolling":"auto","border":0,"frameborder":0,"width":760,"height":700,"class":"dont_hide"}));
				$('gameiframe').contentWindow.location.replace("http://web1.dawnofthedragons.com/kong?" + Object.toQueryString(iframe_options));
			},*/
			getShortNum: function (num) {
				if (isNaN(num) || num < 0){return num}
				else if (num>=1000000000000){return (num/1000000000000).toFixed(3)/1+"T"}
				else if (num>=1000000000){return (num/1000000000).toFixed(2)/1+"B"}
				else if (num>=1000000){return (num/1000000).toFixed(2)/1+"M"}
				else if (num>=1000){return (num/1000).toFixed(1)/1+"K"}
				else if (num>0){return num+""}
			},
			getStatText: function (stat) {
				stat=stat.toLowerCase();
				var r="";
				if (stat=='?'||stat=='Unknown')return 'Unknown';
				if (stat.indexOf("s")>-1)r="Stamina";
				if (stat.indexOf("h")>-1)r+=(r!=''?(stat.indexOf("e")>-1?", ":" and "):"")+"Honor";
				if (stat.indexOf("e")>-1)r+=(r!=''?" and ":"")+"Energy";
				return r;
			},
			getLootTierText: function (raidid, diffIndex) {
				if (typeof RaidCatcher.data.raids[raidid] != 'object' || typeof RaidCatcher.data.raids[raidid].loottiers != 'object' || typeof RaidCatcher.data.raids[raidid].loottiers[diffIndex] != 'object') {
					return "";
				}
				var tiers = RaidCatcher.data.raids[raidid].loottiers[diffIndex];
				var text = tiers[0];
				for (var i = 1;i<tiers.length;i+=1) {
					text = text + "/" + tiers[i] + " ";
				}
				return text;
			},
			getRaidLink: function (msg,user) {
				msg = msg.replace(/[\r\n]/g,"");
				var m = /^((?:(?!<a[ >]).)*)<a.*? href="((?:(?:https?:\/\/)?(?:www\.)?kongregate\.com)?\/games\/5thPlanetGames\/dawn-of-the-dragons(\?[^"]+))".*?<\/a>((?:(?!<\/?a[ >]).)*(?:<a.*? class="reply_link"[> ].*)?)$/i.exec(msg);
				if (m) {
					var raid = RaidCatcher.util.getRaidDetails(m[3],user)
					if (typeof raid != 'undefined' && typeof raid != 'null') {
						raid.ptext = m[1];
						raid.url = m[2];
						raid.ntext = m[4];
						return raid;
					}
				}
			},
			getRaidDetailsBase: function(url){
				var r = {diff: '', hash: '', boss: '', id: ''};
				var reg = /[?&]([^=]+)=([^?&]+)/ig, p = url.replace(/&amp;/gi,"&");
				while ((i = reg.exec(p)) != null) {
					if (!r.diff && i[1] == 'kv_difficulty') r.diff=parseInt(i[2]);
					else if (!r.hash && i[1] == 'kv_hash') r.hash=i[2];
					else if (!r.boss && i[1] == 'kv_raid_boss') r.boss=i[2];
					else if (!r.id && i[1] == 'kv_raid_id') r.id=i[2].replace(/http:?/i,""); // Workaround for when part of the next link gets glommed onto the last bit of this one
					else if (i[1] != 'kv_action_type') return
				}
				if (typeof r != 'undefined' && typeof r.diff != 'undefined' && typeof r.hash != 'undefined' && typeof r.boss != 'undefined' && typeof r.id != 'undefined') {
					r.diffLongText = ['Normal','Hard','Legendary','Nightmare','Insane','Hell'][r.diff-1];
					r.diffShortText = ['N','H','L','NM','I','HL'][r.diff-1];
					
					var stats = RaidCatcher.data.raids[r.boss];
					if (typeof stats == 'object') {
						r.name = stats.name;
						r.shortname = stats.shortname;
						r.size = stats.size;
						r.dur = stats.duration;
						r.durText = stats.dur + "hrs";
						r.stat = stats.stat;
						r.statText = RaidCatcher.util.getStatText(stats.stat);
						if (!isNaN(stats.health[r.diff-1])) {
							r.health = stats.health[r.diff-1];
							r.healthText = RaidCatcher.util.getShortNum(r.health);
							if (r.boss == "dragons_lair") {
								r.fairShareText = "";
							} else {
								r.fairShare = r.health / r.size;
								r.fairShareText = RaidCatcher.util.getShortNum(r.fairShare);

							}

							if (typeof stats.loottiers == 'object' && typeof stats.loottiers[r.diff-1] == 'object') {
								var tiers = stats.loottiers[r.diff-1];
								var text = 'Tiered loot: ' + RaidCatcher.util.getLootTierText(stats.id,(r.diff - 1));
								r.optimalShare = 0;
								r.optimalShareText = text;

							} else {

								r.optimalShare = r.fairShare * {"1": 1, "10":1.25, "13":1.25, "15":1.25, "50": 2.2, "100":2.3, "250": 1, "500": 1.5}[r.size];					
								r.optimalShareText = RaidCatcher.util.getShortNum(r.optimalShare);
							}
							
						}
						else if (stats.health[0] == 'Unlimited') {
							r.health = '';
							r.healthText = 'Unlimited';
							if (typeof stats.loottiers == 'object' && typeof stats.loottiers[r.diff-1] == 'object' && stats.loottiers[r.diff-1][0]) {
								// TODO: At some point, make the numeric FS/OS numbers here line up with the correct textual ones
								r.fairshare = 1000000000;
								r.optimalShare = 1000000000;
								r.fairShareText = stats.loottiers[r.diff-1][0];
								r.optimalShareText = stats.loottiers[r.diff-1][stats.loottiers[r.diff-1].length-1];
							} else {
								r.fairShare = 1000000000;
								r.fairShareText = RaidCatcher.util.getShortNum(r.fairShare);
								r.optimalShare = 1000000000;
								r.optimalShareText = RaidCatcher.util.getShortNum(r.optimalShare);
							}
						}
						else {
							r.health = '';
							r.healthText = 'Unknown';
							r.fairShare = '';
							r.fairShareText = 'Unknown';
							r.fairShare = '';
							r.optimalShareText = 'Unknown';
						} 
					}
				}
				return r;
			},
			getRaidDetails: function(url,user,visited,seen,ts,room) {
				user=(user?user:'');
				visited=(visited?visited:(user==active_user.username() && RaidCatcher.settings.markMyRaidsVisted));
				seen=(seen?seen:false);
				var i;
				var r = RaidCatcher.util.getRaidDetailsBase(url);
				if (typeof r != 'undefined' && typeof r.diff != 'undefined' && typeof r.hash != 'undefined' && typeof r.boss != 'undefined' && typeof r.id != 'undefined') {
					var info = RaidCatcher.raids.getRaid(r.id);
					if (typeof info != 'object') {
						info = RaidCatcher.raids.addRaid(r.hash, r.id, r.boss, r.diff,visited,seen,user,ts,room)
						if(typeof info == 'object') r.isNew = true;
						//inserting new raid
					} else r.isNew = false;
					r.timeStamp = info.timeStamp;
					r.seen = info.seen;
					r.visited = info.visited;
					r.nuked = info.nuked;

					r.linkText = function () {
						if (RaidCatcher.settings.formatRaidLinks){
							var txt = RaidCatcher.settings.raidLinkFormat;
							txt = txt.replace(/<visited:([^>]*)>/gi,(this.visited?"$1":""));
							txt = txt.replace(/<seen:([^>]*)>/gi,(this.seen?"$1":""));
							txt = txt.replace(/<diff>/gi,this.diffShortText);
							txt = txt.replace(/<diff:Num>/gi,this.diff);
							txt = txt.replace(/<diff:Long>/gi,this.diffLongText);
							txt = txt.replace(/<bossId>/gi,this.boss);
							txt = txt.replace(/<raidId>/gi,this.id);
							txt = txt.replace(/<hash>/gi,this.hash);
							txt = txt.replace(/<name>/gi,(!this.name?'Unknown':this.name));
							txt = txt.replace(/<shortname>/gi,(!this.name?'Unknown':RaidCatcher.data.raids[this.boss].shortname));
							txt = txt.replace(/<size>/gi,(!this.name?'':this.size));
							txt = txt.replace(/<dur>/gi,(!this.name?'':this.durText));
							txt = txt.replace(/<dur:Num>/gi,(!this.name?'':this.dur));
							txt = txt.replace(/<stat>/gi,(!this.name?'':this.stat));
							txt = txt.replace(/<stat:Long>/gi,(!this.name?'':this.statText));
							txt = txt.replace(/<health>/gi,(!this.name?'':this.healthText));
							txt = txt.replace(/<health:Num>/gi,(!this.name?'':this.health));
							txt = txt.replace(/<fs>/gi,(!this.name?'':this.fairShareText));
							txt = txt.replace(/<fs:Num>/gi,(!this.name?'':this.fairShare));
							txt = txt.replace(/<os>/gi,(!this.name?'':this.optimalShareText));
							txt = txt.replace(/<os:Num>/gi,(!this.name?'':this.optimalShare));	
							txt = txt.replace(/</g,"&lt;").replace(/>/g,"&gt;");
							return txt.replace(/&lt;image&gt;/gi,'<image src="http://cdn2.kongregate.com/game_icons/0033/2679/i.gif" style="vertical-align: text-top; float: left;">');
						} else {
							return '<image src="http://cdn2.kongregate.com/game_icons/0033/2679/i.gif" style="vertical-align: text-top"> Dawn of the Dragons'
						}
					}
					return r;
				}
			}
			//todo more
		},
		data: {//game raid information
			searchKeywords: {
			z1: { reg: /^(z1)|(kobold\sbelts?)|(hilted\sspears?)$/i, sub: 'horgrak|mazalu|grune' },
			z2: { reg: /^(z2)|(bandit\sinsignias?)$/i, sub: 'ataxes|alice|lurking' },
			z3: { reg: /^(z3)|(dragon\sscales?)$/i, sub: 'briareus|scylla|gravlok|erebus' },
			z4: { reg: /^(z4)|(scabbards?)|(wizard'?s\s?hats?)$/i, sub: 'bloodmane|kerberos|hydra|cai|tyranthius' },
			z5: { reg: /^(z5)|(skulls?)|(souls?)|(notes?\sfrom\sthe\sfront)$/i, sub: 'ironclad|zombie|stein|bogstench|nalagarst' },
			z6: { reg: /^(z6)|(war horns?)|(^lutes?)|(rune\s?stones?)$/i, sub: 'gunnar|nidhogg|kang|ulfrik|kalaxia' },
			z7: { reg: /^(z7)|(oroc crystals?)|(glyphs?)$/i, sub: 'maraak|erakka|wexxa|guilbert|bellarius' },
			z8: { reg: /^(z8)|(dream\s?catchers?)|(dream\s?threads?)$/i, sub: 'hargamesh|grimsly|rift|sisters|mardachus' },
			z9: { reg: /^(z9)|(dragon'?s\st[eo][eo]th)$/i, sub: 'mesyra|nimrod|phaedra|tenebra|valanazes' },
			farm: { reg: /^farm$/i, sub: 'maraak|erakka|wexxa|guilbert|bellarius|erebus|grune|mazalu' },
			gloves: { reg: /^gloves?$/i, sub: 'ataxes|alice|lurking|slaughterers|lunatics|felendis|agony|obyron|hammer|dirthax|dreadbloom' },
			flute: { reg: /^flutes?$/i, sub: 'horgrak|mazalu|grune|ataxes|alice|lurking|butcher|scylla|gravlok|erebus|celeano|arachna|azab|groblar|deathglare|ragetalon|gladiator|tetrarchos|scuttlegore|tithrasia|moon|varlachleth|euphronios' },
			trim: { reg: /^((brown|grey|gray|green|blue|purple|orange)\s+)?trim(\s+(helm|shield|boots|chest|ring|hammer))?$/i, sub: 'butcher|scylla|gravlok' },
			dragonsbane: { reg: /^(sword\s(hilt|guard|blade|tip|emblem))|(dragon eye pearls)|(dragonsbane)$/i, sub: 'erebus' }
		},
			raids: {
				agony:{name: 'Agony', shortname: 'Agony',  id: 'agony', stat: 'H', size:100, duration:168, health: [700000000,875000000,1120000000,1400000000,,]},
				djinn:{name: 'Al-Azab', shortname: 'Al-Azab',  id: 'djinn', stat: 'H', size:100, duration:168, health: [55000000,68750000,88000000,110000000,,]},
				animated_armor:{name: 'Animated Armor', shortname: 'Armor', id: 'animated_armor', stat: 'S', size:1, duration:12, health: [8000000,,,,,]},
				spider:{name: 'Arachna', shortname: 'Arachna',  id: 'spider', stat: 'H', size:50, duration:144, health: [22000000,27500000,35200000,44000000,,]},
				rhino:{name: 'Ataxes', shortname: 'Ataxes',  id: 'rhino', stat: 'S', size:10, duration:120, health: [2000000,2500000,3200000,4000000,,]},
				gladiators:{name: 'Batiatus Gladiators ', shortname: 'Gladiators ',  id: 'gladiators', stat: 'H', size:10, duration:120, health: [12000000,15000000,19200000,24000000,,]},
				bellarius:{name: 'Bellarius the Guardian', shortname: 'Bella',  id: 'bellarius', stat: 'S', size:500, duration:96, health: [900000000,1125000000,1440000000,1800000000,,]},
				werewolfpack:{name: 'Black Moon', shortname: 'Black Moon',  id: 'werewolfpack', stat: 'H', size:50, duration:144, health: [135000000,168750000,216000000,270000000,,]},
				alice:{name: 'Bloody Alice', shortname: 'Alice',  id: 'alice', stat: 'S', size:50, duration:120, health: [15000000,18750000,24000000,30000000,,]},
				bogstench:{name: 'Bogstench', shortname: 'Bogstench',  id: 'bogstench', stat: 'S', size:250, duration:96, health: [450000000,562500000,720000000,900000000,,]},
				'4ogre':{name: 'Briareus the Butcher', shortname: 'Briareus',  id: '4ogre', stat: 'S', size:10, duration:72, health: [4500000,5625000,7200000,9000000,,]},
				bmane:{name: 'Bloodmane', shortname: 'Bmane',  id: 'bmane', stat: 'S', size:10, duration:72, health: [7000000,8750000,11200000,14000000,,]},
				harpy:{name: 'Celeano', shortname: 'Cel',  id: 'harpy', stat: 'H', size:10, duration:120, health: [3000000,3750000,4800000,6000000,,]},
				kobold:{name: 'Chieftain Horgrak', shortname: 'Horgrak',  id: 'kobold', stat: 'S', size:10, duration:168, health: [150000,187500,240000,300000,,]},
				corrupterebus:{name: 'Corrupted Erebus', shortname: 'Corrupted', id: 'corrupterebus', stat: 'ESH', size:90000, duration:72, health: ['Unlimited','Unlimited','Unlimited','Unlimited','Unlimited','Unlimited'], loottiers: [['1M','5M','10M','20M','50M','100M','150M','300M','450M','600M','750M','1B','2B','5B','20B'],[],[],[],[],[]]},
				serpina:{name: 'Countess Serpina', shortname: 'Countess',  id: 'serpina', stat: 'E', size:15, duration:5, health: [75000000,112500000,150000000,187500000,,]},
				dahrizons_general:{name: "Dahrizon's General", shortname: 'General', id: 'dahrizons_general', stat: 'S', size:1, duration:12, health: [1000000,,,,,]},
				basilisk:{name: 'Deathglare', shortname: 'Deathglare',  id: 'basilisk', stat: 'H', size:50, duration:144, health: [45000000,56250000,72000000,90000000,,]},
				dirthax:{name: 'Dirthax', shortname: 'Dirthax',  id: 'dirthax', stat: 'H', size:100, duration:168, health: [550000000,687500000,880000000,1100000000,,]},
				dragons_lair:{name: 'Dragons Lair', shortname: 'Lair',  id: 'dragons_lair', stat: 'S', size:13, duration:5, health: [100000000,500000000,1000000000,1500000000,,], loottiers: [['8M','9M','10M','16M','20M','26M','30M','36M','40M','46M'],['40M','45M','50M','80M','100M','130M','150M','180M','200M','230M'],['80M','90M','100M','160M','200M','260M','300M','360M','400M','460M'],['120M','135M','150M','240M','300M','390M','450M','540M','600M','690M'],,]},
				erakka_sak:{name: 'Erakka-Sak', shortname: 'Erakka',  id: 'erakka_sak', stat: 'S', size:50, duration:60, health: [62000000,77500000,99200000,124000000,,]},
				giantgolem:{name: 'Euphronios', shortname: 'Euphronios',  id: 'giantgolem', stat: 'H', size:100, duration:168, health: [450000000,562500000,720000000,900000000,,]},
				echthros:{name: 'Echthros', shortname: 'Echthros',  id: 'echthros', stat: 'ESH', size:90000, duration:96, health: ['Unlimited','Unlimited','Unlimited','Unlimited','Unlimited','Unlimited'], loottiers: [[],[],[],['150M','200M','250M','300M','400M','500M','600M','700M','800M','900M','1B','2B','3B','4B','5B'],[],[]]},
				drag:{name: 'Erebus the Black', shortname: 'Erebus',  id: 'drag', stat: 'S', size:250, duration:168, health: [150000000,187500000,240000000,300000000,,]},
				felendis:{name: 'Felendis and Shaoquin', shortname: 'Felendis',  id: 'felendis', stat: 'H', size:100, duration:168, health: [441823718,549238221,707842125,888007007,,]},
				ogre:{name: 'General Grune', shortname: 'Grune',  id: 'ogre', stat: 'S', size:100, duration:172, health: [20000000,25000000,32000000,40000000,,]},
				dreadbloom:{name: 'Giant Dreadbloom', shortname: 'Dreadbloom',  id: 'dreadbloom', stat: 'H', size:100, duration:192, health: [900000000,1125000000,1440000000,1800000000,,]},
				batman:{name: 'Gravlok the Night-Hunter', shortname: 'Grav',  id: 'batman', stat: 'S', size:100, duration:72, health: [50000000,62500000,80000000,100000000,,]},
				evilgnome:{name: 'Groblar Deathcap', shortname: 'Groblar',  id: 'evilgnome', stat: 'H', size:10, duration:120, health: [6000000,7500000,9600000,12000000,,]},
				guardian_golem:{name: 'Guardian Golem', shortname: 'Guardian', id: 'guardian_golem', stat: 'S', size:1, duration: 12, health: [3000000,3000000,3000000,3000000,,]},
				guilbert:{name: 'Guilbert the Mad', shortname: 'Guil',  id: 'guilbert', stat: 'S', size:250, duration:96, health: [550000000,687500000,880000000,1100000000,,]},
				gunnar:{name: 'Gunnar the Berserk', shortname: 'Gunnar',  id: 'gunnar', stat: 'S', size:10, duration:48, health: [12000000,15000000,19200000,24000000,,]},
				war_boar:{name: 'Hammer', shortname: 'Hammer',  id: 'war_boar', stat: 'H', size:50, duration:144, health: [220000000,275000000,352000000,440000000,,]},
				hargamesh:{name: 'Hargamesh', shortname: 'Hargamesh',  id: 'hargamesh', stat: 'S', size:10, duration:48, health: [18000000,22500000,28800000,36000000,,]},
				grimsly:{name: 'Headmaster Grimsly', shortname: 'Grimsly',  id: 'grimsly', stat: 'S', size:50, duration:60, health: [72000000,90000000,115200000,144000000,,]},
				hydra:{name: 'Hydra', shortname: 'Hydra',  id: 'hydra', stat: 'S', size:100, duration:72, health: [65000000,81250000,104000000,130000000,,]},
				ironclad:{name: 'Ironclad', shortname: 'Ironclad',  id: 'ironclad', stat: 'S', size:10, duration:48, health: [10000000,12500000,16000000,20000000,,]},
				pumpkin:{name: 'Jack', shortname: 'Jack', id: 'pumpkin', stat: 'S', size: 250, duration:48 , health: [,,,3000000000], loottiers: [[],[],[],['12M','24M','36M','48M','60M','72M','145M','216M','288M','360M','432M','504M','576M'],[],[]]},
				jacksrevenge1:{name: "Jack's Revenge", shortname: 'Revenge', id: 'jacksrevenge1', stat: 'S', size: 250, duration:48 , health: [,,,15000000000], loottiers: [[],[],[],['60M','120M','180M','240M','300M','360M','720M','1.5B','3B'],[],[]]},
				kang:{name: 'Kang-Gsod', shortname: 'Kang',  id: 'kang', stat: 'S', size:100, duration:72, health: [95000000,118750000,152000000,190000000,,]},
				'3dawg':{name: 'Kerberos', shortname: 'Kerb',  id: '3dawg', stat: 'S', size:50, duration:72, health: [35000000,43750000,56000000,70000000,,]},
				kessovtowers:{name: 'Kessov Towers', shortname: 'Towers',  id: 'kessovtowers', stat: 'ESH', size:90000, duration:120, health: ['Unlimited','Unlimited','Unlimited','Unlimited','Unlimited','Unlimited']},
				kessovtower:{name: 'Treachery and the Tower', shortname: 'Treachery',  id: 'kessovtowers', stat: 'ESH', size:90000, duration:24, health: ['Unlimited','Unlimited','Unlimited','Unlimited','Unlimited','Unlimited'], loottiers: [['1M','5M','10M','20M','50M','100M','150M','300M','450M','600M','750M','1B','1.25B','1.5B','1.75B','2B'],[],[],[],[],[]]},
				kessovforts:{name: 'Kessov Forts', shortname: 'Forts',  id: 'kessovforts', stat: 'ESH', size:90000, duration:120, health: ['Unlimited','Unlimited','Unlimited','Unlimited','Unlimited','Unlimited']},
				kessovcastle:{name: 'Kessov Castle', shortname: 'Castle',  id: 'kessovcastle', stat: 'ESH', size:90000, duration:144, health: ['Unlimited','Unlimited','Unlimited','Unlimited','Unlimited','Unlimited'],loottiers: [['1','1M','5M','10M','20M','50M','100M','150M','300M','450M','600M','750M','1B','2B','5B','50B'],[],[],[],[],[]]},
				kalaxia:{name: 'Kalaxia The Far-Seer', shortname: 'Kalaxia',  id: 'kalaxia', stat: 'S', size:500, duration:96, health: [800000000,1000000000,1280000000,1600000000,,]},
				krykagrius:{name: 'Krykagrius', shortname: 'Krykagrius', id: 'krykagrius', stat: 'ESH', size:90000, duration:72, health: ['Unlimited','Unlimited','Unlimited','Unlimited','Unlimited','Unlimited'], loottiers: [['1M','5M','10M','20M','50M','100M','150M','300M','450M','600M','750M','1B','2B','3B','4B','5B','10B','15B','20B'],[],[],[],[],[]]},
				tyranthius:{name: 'Lord Tyranthius', shortname: 'Tyr',  id: 'tyranthius', stat: 'S', size:500, duration:168, health: [600000000,750000000,960000000,1200000000,,]},
				lunacy:{name: 'Lunatics', shortname: 'Lunatics',  id: 'lunacy', stat: 'H', size:50, duration:144, health: [180000000,225000000,288000000,360000000,,]},
				lurker:{name: 'Lurking Horror', shortname: 'Lurking',  id: 'lurker', stat: 'S', size:100, duration:120, health: [35000000,43750000,56000000,70000000,,]},
				magma_horror:{name: 'Magma Horror', shortname: 'Magma',  id: 'magma_horror', stat: 'S', size:1, duration:24, health: [200000,250000,320000,400000,,]},
				maraak:{name: 'Maraak the Impaler', shortname: 'Maraak',  id: 'maraak', stat: 'S', size:10, duration:48, health: [15000000,18750000,24000000,30000000,,]},
				mardachus:{name: 'Mardachus the Destroyer', shortname: 'Mardachus',  id: 'mardachus', stat: 'S', size:500, duration:96, health: [1100000000,1375000000,1760000000,2200000000,,]},
				scorp:{name: 'Mazalu', shortname: 'Mazalu',  id: 'scorp', stat: 'S', size:50, duration:168, health: [5000000,6250000,8000000,10000000,,]},
				mestr:{name: 'Mestr Rekkr', shortname: 'Mestr',  id: 'mestr', stat: 'S', size:1, duration:48, health: [150000,187500,240000,300000,,]},
				mesyra:{name: 'Mesyra the Watcher', shortname: 'Mesyra',  id: 'mesyra', stat: 'S', size:250, duration:96, health: [1000000000,1250000000,1600000000,2000000000,,]},
				misako:{name: 'Misako', shortname: 'Misako',  id: 'misako', stat: 'S', size:1, duration:48, health: [100000,125000,160000,200000,,]},
				nalagarst:{name: 'Nalagarst', shortname: 'Nalagarst',  id: 'nalagarst', stat: 'S', size:500, duration:98, health: [700000000,875000000,1120000000,1400000000,,]},
				nidhogg:{name: 'Nidhogg', shortname: 'Nidhogg',  id: 'nidhogg', stat: 'S', size:50, duration:60, health: [52000000,65000000,83200000,104000000,,]},
				nimrod:{name: 'Nimrod the Hunter', shortname: 'Nimrod',  id: 'nimrod', stat: 'S', size:250, duration:96, health: [1200000000,1500000000,1920000000,2400000000,,]},
				phaedra:{name: 'Phaedra the Deceiver', shortname: 'Phaedra',  id: 'phaedra', stat: 'S', size:250, duration:96, health: [1400000000,1750000000,2240000000,2800000000,,]},
				fairy_prince:{name: 'Prince Obyron', shortname: 'Obyron',  id: 'fairy_prince', stat: 'H', size:10, duration:120, health: [30000000,37500000,48000000,60000000,,]},
				roc:{name: 'Ragetalon', shortname: 'Ragetalon',  id: 'roc', stat: 'H', size:100, duration:168, health: [110000000,137500000,176000000,220000000,,]},
				rhalmarius_the_despoiler:{name: 'Rhalmarius the Despoiler', shortname: 'Rhal',  id: 'rhalmarius_the_despoiler', stat: 'H', size:100, duration:84, health: [500000000,1250000000,3125000000,7812500000,,]},
				rift:{name: 'Rift the Mauler', shortname: 'Rift',  id: 'rift', stat: 'S', size:100, duration:72, health: [125000000,156250000,200000000,250000000,,]},
				crabshark:{name: 'Scuttlegore', shortname: 'Scuttle',  id: 'crabshark', stat: 'H', size:100, duration:168, health: [220000000,275000000,352000000,440000000,,]},
				squid:{name: 'Scylla', shortname: 'Scylla',  id: 'squid', stat: 'S', size:50, duration:72, health: [25000000,31250000,40000000,50000000,,]},
				simulacrum_dahrizon:{name: 'Simulacrum of Dahrizon', shortname: 'Dahrizon', id: 'simulacrum_dahrizon', stat: 'S', size:1, duration:12, health: [12000000,,,,,]},
				sircai:{name: 'Sir Cai', shortname: 'SirCai',  id: 'sircai', stat: 'S', size:250, duration:168, health: [350000000,437500000,560000000,700000000,,]},
				sisters:{name: 'Sisters of the Song', shortname: 'Sisters',  id: 'sisters', stat: 'S', size:250, duration:96, health: [600000000,750000000,960000000,1200000000,,]},
				slaughterers:{name: 'Slaughterers Six', shortname: 'Slaughterers',  id: 'slaughterers', stat: 'H', size:10, duration:120, health: [24000000,30000000,38400000,48000000,,]},
				stein:{name: 'Stein', shortname: 'Stein',  id: 'stein', stat: 'S', size:100, duration:72, health: [80000000,100000000,128000000,160000000,,]},
				tainted:{name: 'Tainted Erebus', shortname: 'Tainted',  id: 'tainted', stat: 'S', size:250, duration:168, health: [250000000,312500000,400000000,500000000,,]},
				tenebra:{name: 'Tenebra Shadow Mistress', shortname: 'Tenebra',  id: 'tenebra', stat: 'S', size:500, duration:128, health: [2000000000,2500000000,3200000000,4000000000,,]},
				tisiphone:{name: 'Tisiphone The Vengeful', shortname: 'Tisiphone',  id: 'tisiphone', stat: 'E', size:50, duration:48, health: [500000000,2500000000,5000000000,7500000000,,]},
				chimera:{name: 'Tetrarchos', shortname: 'Tetrarchos',  id: 'chimera', stat: 'H', size:50, duration:144, health: [90000000,112500000,144000000,180000000,,]},
				gorgon:{name: 'Tithrasia', shortname: 'Tithrasia',  id: 'gorgon', stat: 'H', size:10, duration:120, health: [18000000,22500000,28800000,36000000,,]},
				ulfrik:{name: 'Ulfrik', shortname: 'Ulfrik',  id: 'ulfrik', stat: 'S', size:250, duration:96, health: [500000000,625000000,800000000,1000000000,,]},
				valanazes:{name: 'Valanazes the Gold', shortname: 'Valanazes',  id: 'valanazes', stat: 'S', size:500, duration:128, health: [2400000000,3000000000,3840000000,4800000000,,]},
				blobmonster:{name: 'Varlachleth', shortname: 'Varla',  id: 'blobmonster', stat: 'H', size:100, duration:168, health: [330000000,412500000,528000000,660000000,,]},
				wexxa:{name: 'Wexxa the Worm-Tamer', shortname: 'Wexxa',  id: 'wexxa', stat: 'S', size:100, duration:72, health: [110000000,137500000,176000000,220000000,,]},
				zombiehorde:{name: 'Zombie Horde', shortname: 'Zombies',  id: 'zombiehorde', stat: 'S', size:50, duration:60, health: [45000000,56250000,72000000,90000000,,]}
			},
			raidSizes: {
				10: { name: 'Small', visible: 'Yes', pruneTimers: [3600000,10800000,32400000]}, // 1h, 2h, 3h
				13: { name: 'Small', visible: 'No', pruneTimers: [3600000,10800000,32400000]},  // 1h, 2h, 3h
				15: { name: 'Small', visible: 'No', prumeTimers: [18000000,18000000,18000000]}, // Serpina only, so 5h/5h/5h
				50: { name: 'Medium', visible: 'Yes', pruneTimers: [3600000,10800000,32400000]}, // 1h, 2h, 3h
				100:{ name: 'Large', visible: 'Yes', pruneTimers: [14400000,43200000,129600000]}, // 4h, 12h, 36h
				250:{ name: 'Epic', visible: 'Yes', pruneTimers: [86400000,172800000,259200000]}, // 24h, 48h, 72h
				500:{ name: 'Colossal', visible: 'Yes', pruneTimers: [86400000,172800000,259200000]} // 24h, 48h, 72h
			}
		},
		session:{//session variables
			isInitialized: false,
			platform: 0
		},
		init: function(platform, element){
			console.log("[RaidCatcher] Creating " + platform + "...");
			if(/kong/i.test(platform)){//kongregate
				RaidCatcher.session.platform=1;
				RaidCatcher.ui.init(element);
				RaidCatcher.chat.init();
			} else if(/ag/i.test(platform)||/armor/i.test(platform)) {//armor
				RaidCatcher.session.platform=2;
				RaidCatcher.ui.init(element);
			} else { //facebook/standalone
				RaidCatcher.session.platform=3;
				RaidCatcher.ui.init(element);
			}
			console.log("[RaidCatcher] Created " + platform);
		}
	}
	console.log("[RaidCatcher] Shared script added");
}
function kmain(){//kong initialization
	console.log("[RaidCatcher] Kongregate initializing...");
	window.initKongDotD = function (tries){
		tries=(tries||1);
		if(tries > 50){
			console.log('[RaidCatcher] Resources not found. Aborting');
			return;
		}
		if (typeof holodeck == 'object' && typeof ChatDialogue == 'function' && typeof activateGame == 'function' && 
			typeof document.getElementById('kong_game_ui') != 'null' && typeof RaidCatcher == 'object') {
			
			var link = RaidCatcher.ui.cHTML('a').set({href: '#dotd_tab_pane',class: ''}).attach("to",RaidCatcher.ui.cHTML('li').set({class: 'tab', id: 'dotd_tab'}).attach("after","game_tab").ele()).ele();
			var pane = RaidCatcher.ui.cHTML('div').set({id: 'dotd_tab_pane'}).attach("to",'kong_game_ui').ele();
			pane.style.height = document.getElementById("chat_tab_pane").style.height;
			holodeck._tabs.addTab(link);
			RaidCatcher.init('kong', pane);
			console.log('[RaidCatcher] Kongregate initialized.');
		} 
		else
		{
			console.log('[RaidCatcher] Resources not found ('+tries+' attempts), retrying in 1 second...');
			console.log('[RaidCatcher] holodeck:'+(typeof holodeck)+ ", ChatDialogue:"+(typeof ChatDialogue)+", activateGame:"+(typeof activateGame)+", kong_game_ui:"+(typeof document.getElementById('kong_game_ui'))+", RaidCatcher:"+(typeof RaidCatcher));
			setTimeout('initKongDotD('+(++tries)+')', 1000);
		}
	}
	initKongDotD();
}
function amain(){//AG initialization
	console.log("[RaidCatcher] AG initializing...");
	window.initAGDotD = function (tries) {
		tries=(tries||1);
		if(tries > 50){
			console.log('[RaidCatcher] Resources not found. Aborting');
			return;
		}
		try
		{
			RaidCatcher.ui.cHTML('style').set({type: "text/css",id: 'DotD_AG_styles'}).text(' \
				.room_name_container{font-style:italic;font-family:Arial,sans-serif;} .mbs{margin-bottom:5px !important} .h6_alt{color:#666}\
				#dotd_tab_pane {position:absolute;background-color:#DDD;width:264px !important;height:640px !important;z-index:500;}\
				#dotd_tab {position:absolute; width:65px; height:36px;z-index:500;cursor:pointer;background-image:url(http://i.imgur.com/WVr5l.png)}\
				.dotd_tab_overlay {position:absolute; width:65px; height:36px;z-index:500;pointer-events:none;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AsMEDEXzYbZWAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAFUlEQVQI12P8//+/LwMDAwMTAxQAADQ8A058cLdLAAAAAElFTkSuQmCC)}\
				.hidden{display:none}\
			').attach('to',document.head);
			
			var pane = RaidCatcher.ui.cHTML('div').set({id: 'dotd_tab_pane' }).attach("to", document.getElementsByTagName('body')[0]).ele();
			var tab = RaidCatcher.ui.cHTML('div').set({id: 'dotd_tab', class: 'dotd_tab'}).attach("to", document.getElementsByTagName('body')[0]).ele();
			var tabhoverpane = RaidCatcher.ui.cHTML('div').set({id: 'dotd_tab_hover_pane', class: 'hidden dotd_tab_overlay'}).attach("to", document.getElementsByTagName('body')[0]).ele();
			var tabclickpane = RaidCatcher.ui.cHTML('div').set({id: 'dotd_tab_click_pane', class: 'hidden dotd_tab_overlay'}).attach("to", document.getElementsByTagName('body')[0]).ele();
			var rf = function () {//handles window resizing and raid control placement
				var el = document.getElementById('game-iframe');
				var x = parseInt(el.offsetLeft);
				var y = parseInt(el.offsetTop);
				while(el != null) { x += parseInt(el.offsetLeft); y += parseInt(el.offsetTop); el = el.offsetParent; }
				var x1=x+760, y1=y+47, x2=x+1023, y2=y+5;
				pane.style.left = x1+'px';pane.style.top = y1+'px';tab.style.left = x2+'px';tab.style.top = y2+'px';tabhoverpane.style.left = x2+'px';tabhoverpane.style.top = y2+'px';tabclickpane.style.left = x2+'px';tabclickpane.style.top = y2+'px';
			}
			rf();
			var isHover = false;
			window.addEventListener('resize', rf);
			window.addEventListener('message', function(event){//needed to hide raid pane when other tabs are clicked.
				if(/web1\.dawnofthedragons\.com/.test(event.origin) && /HideRaids/.test(event.data) && !/hidden/.test(pane.className)) pane.className += " hidden";
			});
			tab.addEventListener('click', function () {pane.className = pane.className.replace(/hidden/gi, '');tabclickpane.className = tabclickpane.className.replace(/hidden/gi, '');});
			tab.addEventListener('mouseover', function () {tabhoverpane.className = tabhoverpane.className.replace(/hidden/gi, '');});
			tab.addEventListener('mouseout', function () { tabhoverpane.className += ' hidden';});
			
			RaidCatcher.init('ag', pane);
			
			pane.className = 'hidden';
			console.log('[RaidCatcher] AG initialized.');
		} catch (e) {
			console.log('[RaidCatcher] AG Init error: ' + e.toString())
			setTimeout('initAGDotD('+(++tries)+')', 1000);
		}
		
	}
	initAGDotD();
}
function fmain(){//FB initialization
}
function agamemain(){
	document.getElementById('chatcontainer').addEventListener('click', function (){
		window.parent.postMessage('HideRaids', 'http://armorgames.com/dawn-of-the-dragons-game');
	});
}
if(/^http:\/\/web1\.dawnofthedragons\.com\/armor/i.test(document.location.href)){//agamemain
	var ascript = document.createElement("script");
	ascript.appendChild(document.createTextNode('('+agamemain+')()'));
	(document.head || document.body || document.documentElement).appendChild(ascript);
}
if (/^http:\/\/armorgames\.com\/dawn-of-the-dragons-game/i.test(document.location.href)) {//amain
	if(window==window.top){
		var script = document.createElement("script");
		script.appendChild(document.createTextNode('('+shared+')()'));
		(document.head || document.body || document.documentElement).appendChild(script);
		
		var ascript = document.createElement("script");
		ascript.appendChild(document.createTextNode('('+amain+')()'));
		(document.head || document.body || document.documentElement).appendChild(ascript);
	}
}
if (/^http:\/\/www\.kongregate\.com\/games\/5thplanetgames\/dawn-of-the-dragons(?:\/?$|\?|#)/i.test(document.location.href)) {//kmain
	if(window==window.top){
		var script = document.createElement("script");
		script.appendChild(document.createTextNode('('+shared+')()'));
		(document.head || document.body || document.documentElement).appendChild(script);
		
		var kscript = document.createElement("script");
		kscript.appendChild(document.createTextNode('('+kmain+')()'));
		(document.head || document.body || document.documentElement).appendChild(kscript);
	}
}