// ==UserScript==
// @name           DotD Raid Catcher
// @namespace      tag://kongregate
// @description    DotD raid assistance.
// @author         JHunz, wpatter6
// @version        0.0.1
// @date           11.02.2012
// @grant          GM_xmlHttpRequest
// @include        http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        *web*.dawnofthedragons.com/kong*
// ==/UserScript==

function shared() {//bulk of the script, shared between sites
	
	console.log("[RaidCatcher] Shared script initializing");
	if(typeof GM_setValue=='undefined'||typeof GM_getValue=='undefined'||typeof GM_deleteValue=='undefined'){GM_setValue=function(name,value){localStorage.setItem(name,(typeof value).substring(0,1)+value)}GM_getValue=function(name,dvalue){var value=localStorage.getItem(name);if(typeof value!='string'){return dvalue}else{var type=value.substring(0,1);value=value.substring(1);if(type=='b'){return(value=='true')}else if(type=='n'){return Number(value)}else{return value}}}GM_deleteValue=function(name){localStorage.removeItem(name)}}

	window.RaidCatcher = {
		version: {major: '0.0.1', minor: 'wpatter6/JHunz'},
		ui:{//raid tab creation/interaction
			cHTML:function(ele){function cEle(ele){this._ele=ele;this.ele=function(){return this._ele}this.set=function(param){for(var attr in param){if(param.hasOwnProperty(attr)){this._ele.setAttribute(attr,param[attr])}}return this}this.text=function(text){this._ele.appendChild(document.createTextNode(text));return this}this.html=function(text,overwrite){if(overwrite){this._ele.innerHTML=text}else{this._ele.innerHTML+=text}return this}this.attach=function(method,ele){if(typeof ele=='string')ele=document.getElementById(ele);if(!(ele instanceof Node)){throw"Invalid attachment element specified"}else if(!/^(?:to|before|after)$/i.test(method)){throw"Invalid append method specified"}else if(method=='to'){ele.appendChild(this._ele)}else if(method=='before'){ele.parentNode.insertBefore(this._ele,ele)}else if(typeof ele.nextSibling=='undefined'){ele.parentNode.appendChild(this._ele)}else{ele.parentNode.insertBefore(this._ele,ele.nextSibling)}return this}this.on=function(event,func,bubble){this._ele.addEventListener(event,func,bubble);return this}}if(typeof ele=="string"){ele=(/^#/i.test(ele)?document.getElementById(ele.substring(1)):document.createElement(ele))}if(ele instanceof Node){return new cEle(ele)}else{throw"Invalid element type specified"}},
			init: function(el) {
				//todo param as raid tab to generate UI in
				
				
			}
			addRaid: function(id){//todo gui.addRaid;
			
			}
		},
		chat: {//chat input/output (kong only)
			init: function(){
				RaidCatcher.chat.echo = function(msg){holodeck.activeDialogue().SRDotDX_echo(msg)};
				RaidCatcher.chat.output = function(msg, whisper, to){			
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
				//todo add all kong chat commands & raids from chat
			}
		}
		db: {//todo server interaction
			get: function(filter){//todo db interaction
			}
		},
		raids: (function(){//stored raid list
			var tmp;
			try tmp=JSON.parse(GM_getValue('RaidCatcher_raids','{}'));
			catch (e) tmp={};
			
			//properties
			tmp.count=(typeof tmp.count=='number'?tmp.count:0);
			tmp.list=(typeof tmp.list=='object'?tmp.list:{});
			
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
						expTime: (typeof RaidCatcher.data.raids[boss] == 'object'?SRDotDX.raids[boss].duration:168) * 3600+parseInt((new Date).getTime() / 1000),
						timeStamp: ((typeof ts ==='undefined'||ts==null)?(new Date().getTime()):parseInt(ts)),
						room: ((typeof room ==='undefined'||room==null)?SRDotDX.getRoomName():parseInt(room)),
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
		})(),
		settings: (function(){//saved configuration
			var tmp;
			try tmp = JSON.parse(GM_getValue('RaidCatcher_settings','{}'));
			catch (e) tmp = {};
			
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
					var raid = SRDotDX.raids[raidid];
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
			},
			purge: function(){//todo .purge();
			},
			elfade: function(elem,time){if(typeof time!='number')time=500;if(typeof elem=='string')elem=document.getElementById(elem);if(elem==null)return;var startOpacity=elem.style.opacity||1;elem.style.opacity=startOpacity;var tick=1/(time/100);(function go(){elem.style.opacity=Math.round((elem.style.opacity-tick)*100)/100;if(elem.style.opacity>0)setTimeout(go,100);else elem.style.display='none'})()},
			isNumber: function(n) {return !isNaN(parseFloat(n)) && isFinite(n);},
			dateFormat: function(){var token=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,timezone=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,timezoneClip=/[^-+\dA-Z]/g,pad=function(val,len){val=String(val);len=len||2;while(val.length<len)val="0"+val;return val};return function(date,mask,utc){var dF=dateFormat;if(arguments.length==1&&Object.prototype.toString.call(date)=="[object String]"&&!/\d/.test(date)){mask=date;date=undefined}date=date?new Date(date):new Date;if(isNaN(date))throw SyntaxError("invalid date");mask=String(dF.masks[mask]||mask||dF.masks["default"]);if(mask.slice(0,4)=="UTC:"){mask=mask.slice(4);utc=true}var _=utc?"getUTC":"get",d=date[_+"Date"](),D=date[_+"Day"](),m=date[_+"Month"](),y=date[_+"FullYear"](),H=date[_+"Hours"](),M=date[_+"Minutes"](),s=date[_+"Seconds"](),L=date[_+"Milliseconds"](),o=utc?0:date.getTimezoneOffset(),flags={d:d,dd:pad(d),ddd:dF.i18n.dayNames[D],dddd:dF.i18n.dayNames[D+7],m:m+1,mm:pad(m+1),mmm:dF.i18n.monthNames[m],mmmm:dF.i18n.monthNames[m+12],yy:String(y).slice(2),yyyy:y,h:H%12||12,hh:pad(H%12||12),H:H,HH:pad(H),M:M,MM:pad(M),s:s,ss:pad(s),l:pad(L,3),L:pad(L>99?Math.round(L/10):L),t:H<12?"a":"p",tt:H<12?"am":"pm",T:H<12?"A":"P",TT:H<12?"AM":"PM",Z:utc?"UTC":(String(date).match(timezone)||[""]).pop().replace(timezoneClip,""),o:(o>0?"-":"+")+pad(Math.floor(Math.abs(o)/60)*100+Math.abs(o)%60,4),S:["th","st","nd","rd"][d%10>3?0:(d%100-d%10!=10)*d%10]};return mask.replace(token,function($0){return $0 in flags?flags[$0]:$0.slice(1,$0.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"};dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]},
			timeSince: function(date,after){if(typeof date=='number')date=new Date(date);var seconds=Math.abs(Math.floor((new Date().getTime()-date.getTime())/1000));var interval=Math.floor(seconds/31536000);var pretext="about ";var posttext=" ago";if(after)posttext=" left";if(interval>=1){return pretext+interval+" year"+(interval==1?'':'s')+posttext}interval=Math.floor(seconds/2592000);if(interval>=1){return pretext+interval+" month"+(interval==1?'':'s')+posttext}interval=Math.floor(seconds/86400);if(interval>=1){return pretext+interval+" day"+(interval==1?'':'s')+posttext}interval=Math.floor(seconds/3600);if(interval>=1){return pretext+interval+" hour"+(interval==1?'':'s')+posttext}interval=Math.floor(seconds/60);if(interval>=1){return interval+" minute"+(interval==1?'':'s')+posttext}return Math.floor(seconds)+" second"+(seconds==1?'':'s')+posttext},
			removeDupes: function(arr){var i,len=arr.length,out=[],obj={};for(i=0;i<len;i++){obj[arr[i]]=0}for(i in obj){out.push(i)}return out}
		},
		data: {//game raid information
			get: function(){
				//GM_xmlHttpRequest() CAN NOW BE USED IN CHROME
			}
		},
		session:{//session variables
		}
	}
	console.log("[RaidCatcher] Shared script initialized");
}

function kmain(){//kong initialization
	if (typeof holodeck == 'object' && typeof ChatDialogue == 'function' && typeof activateGame == 'function' && 
		typeof document.getElementById('kong_game_ui') != 'null' && typeof RaidCatcher == 'object') {
		RaidCatcher.ui.init(document.getElementById(''));//todo create raid tab and pass in element to populate UI
		RaidCatcher.chat.init();
	} 
	else
	{
		console.log('[RaidCatcher] Kong resources not found, retrying in 1 second...');
		setTimeout(function(el){RaidCatcher.ui.init(el)}, 1000, el);
	}
}
function amain(){//AG initialization
}
function fmain(){//FB initialization
}

if (/^http:\/\/www\.kongregate\.com\/games\/5thplanetgames\/dawn-of-the-dragons(?:\/?$|\?|#)/i.test(document.location.href)) {//kmain
	console.log("[Raid Catcher] Kongregate initializing....");
	var script = document.createElement("script");
	script.appendChild(document.createTextNode('('+shared+')()'));
	(document.head || document.body || document.documentElement).appendChild(script);
	
	var kscript = document.createElement("script");
	kscript.appendChild(document.createTextNode('('+kmain+')()'));
	(document.head || document.body || document.documentElement).appendChild(kscript);
}