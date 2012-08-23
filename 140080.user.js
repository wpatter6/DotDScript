// ==UserScript==
// @name           SRDotDX - wpatter6/JHunz
// @namespace      tag://kongregate
// @description    Easier Kongregate's Dawn of the Dragons
// @author         SReject, chairmansteve, JHunz, wpatter6
// @version        0.1.7
// @date           08.22.2012
// @include        http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        *pastebin.com*
// @include        *web*.dawnofthedragons.com/kong*
// ==/UserScript==

function main() {
// if any1 needs a simple way to calculate damage: atk*4+def+legionpower*5
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
	window.FPX = {
		tooltip:(function(){
			var id = 'FPXtt';
			var top = 3;
			var left = 3;
			var maxw = 300;
			var speed = 10;
			var timer = 20;
			var endalpha = 95;
			var alpha = 0;
			var tt,t,c,b,h;
			var ie = document.all ? true : false;
			
			var tmp={};
			tmp.id = 'FPXtt';
			tmp.top = 3;
			tmp.left = 3;
			tmp.maxw = 300;
			tmp.speed = 10;
			tmp.timer = 20;
			tmp.endalpha = 95;
			tmp.alpha = 0;
			tmp.tt,tmp.t,tmp.c,tmp.b,tmp.h;
			tmp.ie = document.all ? true : false;
			
			tmp.show=function(v,w){
					if(tt == null){
						tt = document.createElement('div');
						tt.setAttribute('id',id);
						t = document.createElement('div');
						t.setAttribute('id',id + 'top');
						c = document.createElement('div');
						c.setAttribute('id',id + 'cont');
						b = document.createElement('div');
						b.setAttribute('id',id + 'bot');
						tt.appendChild(t);
						tt.appendChild(c);
						tt.appendChild(b);
						document.body.appendChild(tt);
						tt.style.opacity = 0;
						tt.style.filter = 'alpha(opacity=0)';
						document.onmousemove = this.pos;
					}
					tt.style.display = 'block';
					c.innerHTML = v;
					tt.style.width = w ? w + 'px' : 'auto';
					if(!w && ie){
						t.style.display = 'none';
						b.style.display = 'none';
						tt.style.width = tt.offsetWidth;
						t.style.display = 'block';
						b.style.display = 'block';
					}
					if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
						h = parseInt(tt.offsetHeight) + top;
						clearInterval(tt.timer);
						tt.timer = setInterval(function(){FPX.tooltip.fade(1)},timer);
				};
			tmp.pos=function(e){
					var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
					var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
					tt.style.top = (u - h) + 'px';
					tt.style.left = (l + left) + 'px';
				};
			tmp.fade=function(d){
					var a = alpha;
					if((a != endalpha && d == 1) || (a != 0 && d == -1)){
						var i = speed;
						if(endalpha - a < speed && d == 1){
							i = endalpha - a;
						}else if(alpha < speed && d == -1){
							i = a;
						}
						alpha = a + (i * d);
						tt.style.opacity = alpha * .01;
						tt.style.filter = 'alpha(opacity=' + alpha + ')';
					}else{
						clearInterval(tt.timer);
						if(d == -1){tt.style.display = 'none'}
					}
				};
				tmp.hide=function(){
					clearInterval(tt.timer);
					tt.timer = setInterval(function(){FPX.tooltip.fade(-1)},timer);
				};
			return tmp;
		})()
	}
	//dateformatting utilities
	window.dateFormat=function(){var token=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,timezone=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,timezoneClip=/[^-+\dA-Z]/g,pad=function(val,len){val=String(val);len=len||2;while(val.length<len)val="0"+val;return val};return function(date,mask,utc){var dF=dateFormat;if(arguments.length==1&&Object.prototype.toString.call(date)=="[object String]"&&!/\d/.test(date)){mask=date;date=undefined}date=date?new Date(date):new Date;if(isNaN(date))throw SyntaxError("invalid date");mask=String(dF.masks[mask]||mask||dF.masks["default"]);if(mask.slice(0,4)=="UTC:"){mask=mask.slice(4);utc=true}var _=utc?"getUTC":"get",d=date[_+"Date"](),D=date[_+"Day"](),m=date[_+"Month"](),y=date[_+"FullYear"](),H=date[_+"Hours"](),M=date[_+"Minutes"](),s=date[_+"Seconds"](),L=date[_+"Milliseconds"](),o=utc?0:date.getTimezoneOffset(),flags={d:d,dd:pad(d),ddd:dF.i18n.dayNames[D],dddd:dF.i18n.dayNames[D+7],m:m+1,mm:pad(m+1),mmm:dF.i18n.monthNames[m],mmmm:dF.i18n.monthNames[m+12],yy:String(y).slice(2),yyyy:y,h:H%12||12,hh:pad(H%12||12),H:H,HH:pad(H),M:M,MM:pad(M),s:s,ss:pad(s),l:pad(L,3),L:pad(L>99?Math.round(L/10):L),t:H<12?"a":"p",tt:H<12?"am":"pm",T:H<12?"A":"P",TT:H<12?"AM":"PM",Z:utc?"UTC":(String(date).match(timezone)||[""]).pop().replace(timezoneClip,""),o:(o>0?"-":"+")+pad(Math.floor(Math.abs(o)/60)*100+Math.abs(o)%60,4),S:["th","st","nd","rd"][d%10>3?0:(d%100-d%10!=10)*d%10]};return mask.replace(token,function($0){return $0 in flags?flags[$0]:$0.slice(1,$0.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"};dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]};
	window.timeSince=function(date,after){if(typeof date=='number')date=new Date(date);var seconds=Math.abs(Math.floor((new Date().getTime()-date.getTime())/1000));var interval=Math.floor(seconds/31536000);var pretext="about ";var posttext=" ago";if(after)posttext=" left";if(interval>=1){return pretext+interval+" year"+(interval==1?'':'s')+posttext}interval=Math.floor(seconds/2592000);if(interval>=1){return pretext+interval+" month"+(interval==1?'':'s')+posttext}interval=Math.floor(seconds/86400);if(interval>=1){return pretext+interval+" day"+(interval==1?'':'s')+posttext}interval=Math.floor(seconds/3600);if(interval>=1){return pretext+interval+" hour"+(interval==1?'':'s')+posttext}interval=Math.floor(seconds/60);if(interval>=1){return interval+" minute"+(interval==1?'':'s')+posttext}return Math.floor(seconds)+" seconds"+(seconds==1?'':'s')+posttext}
	window.isNumber=function(n) {return !isNaN(parseFloat(n)) && isFinite(n);}
	window.eliminateDuplicates=function(arr){var i,len=arr.length,out=[],obj={};for(i=0;i<len;i++){obj[arr[i]]=0}for(i in obj){out.push(i)}return out}
	
	window.SRDotDX = {
		version: {major: "0.1.6", minor: "wpatter6/JHunz"},
		echo: function(msg){holodeck.activeDialogue().SRDotDX_echo(msg)},
		config: (function(){
			try {
				var tmp = JSON.parse(GM_getValue("SRDotDX","{}"));
			}
			catch (e) {var tmp = {}}
			tmp.scrollbarFix = (typeof tmp.scrollbarFix == 'boolean'?tmp.scrollbarFix:true);
			tmp.splitLongMsgs = (typeof tmp.splitLongMsgs == 'boolean'?tmp.splitLongMsgs:true);
			tmp.hideRaidLinks = (typeof tmp.hideRaidLinks == 'boolean'?tmp.hideRaidLinks:false);
			tmp.hideVisitedRaids = (typeof tmp.hideVisitedRaids == 'boolean'?tmp.hideVisitedRaids:false);
			tmp.hideVisitedRaidsInRaidList = (typeof tmp.hideVisitedRaidsInRaidList == 'boolean'?tmp.hideVisitedRaidsInRaidList:false);
			tmp.hideSeenRaids = (typeof tmp.hideSeenRaids == 'boolean'?tmp.hideSeenRaids:false);
			tmp.FPXmarkRightClick = (typeof tmp.FPXmarkRightClick == 'boolean'?tmp.FPXmarkRightClick:false);
			tmp.markMyRaidsVisted = (typeof tmp.markMyRaidsVisted == 'boolean'?tmp.markMyRaidsVisted:false);
			tmp.whisperSpam = false;
			tmp.AutoJoinInterval = (typeof tmp.AutoJoinInterval == 'number'?tmp.AutoJoinInterval:1000);
			tmp.autoWhisper = (typeof tmp.autoWhisper == 'boolean'?tmp.autoWhisper:false);
			tmp.markImportedVisited = (typeof tmp.markImportedVisited == 'boolean'?tmp.markImportedVisited:false);
			tmp.prettyPost = (typeof tmp.prettyPost == 'boolean'?tmp.prettyPost:false);
			tmp.useMaxRaidCount = (typeof tmp.useMaxRaidCount =='boolean'?tmp.useMaxRaidCount:false);
			tmp.maxRaidCount = (!(typeof tmp.maxRaidCount === 'undefined')?tmp.maxRaidCount:3000);
			tmp.autoImportPaste = (typeof tmp.autoImportPaste =='boolean'?tmp.autoImportPaste:false);
			tmp.whisperTo = (typeof tmp.whisperTo == 'string'?tmp.whisperTo:'');
			tmp.showRaidLink = (typeof tmp.showRaidLink == 'boolean'?tmp.showRaidLink:(navigator.userAgent.toLowerCase().indexOf('chrome')>-1));
			tmp.formatLinkOutput = (typeof tmp.formatLinkOutput == 'boolean'?tmp.formatLinkOutput:false);
			tmp.FPXoptsMarkRightClickDelay = (typeof tmp.FPXoptsMarkRightClickDelay == 'number'?tmp.FPXoptsMarkRightClickDelay:2000);
			tmp.FPXdisplayListImgLink = (typeof tmp.FPXdisplayListImgLink == 'boolean'?tmp.FPXdisplayListImgLink:false);
			tmp.formatRaidLinks = (typeof tmp.formatRaidLinks == 'boolean'?tmp.formatRaidLinks:true);
			tmp.raidLinkFormat = (typeof tmp.raidLinkFormat == 'string'?tmp.raidLinkFormat:"<seen:(s) ><visited:(v) ><shortname> - <diff> - <fs>/<os>");
			tmp.raidLinkFormat = tmp.raidLinkFormat.replace(/&#91;/g,"[").replace(/&#93;/g,"]").replace(/&#123;/g,"{").replace(/&#125;/g,"}")
			tmp.unvisitedRaidPruningMode = (typeof tmp.unvisitedRaidPruningMode == 'number'? tmp.unvisitedRaidPruningMode : 1);
			if (typeof tmp.raidList != 'object')tmp.raidList = {};
			if (typeof tmp.pasteList != 'object')tmp.pasteList = {};

			// Raid list indexing upgrade code
			tmp.pendingRaidListIndexingChange = (typeof tmp.pendingRaidListIndexingChange == 'boolean'?tmp.pendingRaidListIndexingChange:true);
			if (tmp.pendingRaidListIndexingChange == true) {
				var raidList2 = {};

				for (var hash in tmp.raidList) {
					if (tmp.raidList.hasOwnProperty(hash)) {
						raidList2[tmp.raidList[hash].id] = tmp.raidList[hash];
					}
				}

				tmp.raidList = raidList2;
				tmp.pendingRaidListIndexingChange = false;
			}

			// Delete expired raids
			for (var id in tmp.raidList){
				if (tmp.raidList.hasOwnProperty(id)) {
					tmp.raidList[id].timeLeft = function (){
						return this.expTime - parseInt((new Date).getTime() / 1000);
					}
					if (tmp.raidList[id].timeLeft() < 0) {
						delete tmp.raidList[id];
					}
				}
			}

			if (typeof tmp.filters != 'object') {
				tmp.filters = {}
			}

			// Default filtering settings filter out guild raids and personal raids from chat
			tmp.getFilter = function(raidid,diffIndex) {
				// Upgrade from raid id filtering to raid id/difficulty filtering data structure
				if (typeof SRDotDX.config.filters[raidid] == 'boolean') {
					var tempVal = SRDotDX.config.filters[raidid];
					SRDotDX.config.filters[raidid] = [tempVal, tempVal, tempVal, tempVal, tempVal, tempVal];
				} else if ((typeof SRDotDX.config.filters[raidid] != 'boolean') && (typeof SRDotDX.config.filters[raidid] != 'object')) {
					var raid = SRDotDX.raids[raidid];
					if (raid.size == 1 || raid.stat == 'H' || raid.stat == 'h') {
						SRDotDX.config.filters[raidid] = [true, true, true, true, true, true];
					} else {
						SRDotDX.config.filters[raidid] = [false, false, false, false, false];
					}
				}
					
				return SRDotDX.config.filters[raidid][diffIndex];
			}
			tmp.setFilter = function(raidid,diff,val) {
				SRDotDX.config.filters[raidid][diff] = val;
			}

			tmp.filterChatLinks = (typeof tmp.filterChatLinks == 'boolean'?tmp.filterChatLinks:true);
			tmp.filterRaidList = (typeof tmp.filterRaidList == 'boolean'?tmp.filterRaidList:false);
			tmp.newRaidsAtTopOfList = (typeof tmp.newRaidsAtTopOfList == 'boolean'?tmp.newRaidsAtTopOfList:false);

			// Update old default for right click delay
			// It's obvious this wasn't widely used, because a bug was preventing saving any value except the default
			if (tmp.FPXoptsMarkRightClickDelay == 8000) { tmp.FPXoptsMarkRightClickDelay = 2000; }

			GM_setValue("SRDotDX",JSON.stringify(tmp));
			tmp.addRaid = function(hash,id,boss,diff,seen,visited,user,ts,room) {
				if (typeof SRDotDX.config.getRaid(id) != 'object') {
					SRDotDX.config.raidList[id] = {
						hash: hash,
						id: id,
						boss: boss,
						diff: diff,
						seen: seen,
						visited: visited,
						user: user,
						lastUser: user,
						expTime: (typeof SRDotDX.raids[boss] == 'object'?SRDotDX.raids[boss].duration:168) * 3600+parseInt((new Date).getTime() / 1000),
						timeLeft: function (){return this.expTime - parseInt((new Date).getTime() / 1000)},
						timeStamp: ((typeof ts ==='undefined'||ts==null)?(new Date().getTime()):parseInt(ts)),
						room: ((typeof room ==='undefined'||room==null)?SRDotDX.getRoomName():parseInt(room))
					}
					SRDotDX.gui.addRaid(id);
					//onNewRaid
					SRDotDX.purge();
				}
				SRDotDX.config.raidList[id].lastUser = user;
				return SRDotDX.config.raidList[id]
			}
			tmp.addPaste = function(url,id,user){
				if (typeof SRDotDX.config.getPaste(id) != 'object') {
					SRDotDX.config.pasteList[id]={
						url: url,
						id: id,
						user: user,
						lastUser: user,
						timeStamp: new Date().getTime()
					}
					console.log("[SRDotDX] New pastebin added " + id + " : " + user)
					//onNewPastie
					//TODO ADD TO GUI/PURGE
				}
				SRDotDX.config.pasteList[id].lastuser = user;
				return SRDotDX.config.pasteList[id]				
			}
			tmp.export = function () {
				SRDotDX.config.save();
				window.prompt("Export Data:",JSON.stringify(SRDotDX.config));
			}
			tmp.getRaid = function(id) {
				if (typeof SRDotDX.config.raidList[id] == 'object') {
					if (SRDotDX.config.raidList[id].timeLeft() > 1) {
						return SRDotDX.config.raidList[id];
					}
					else {
						delete SRDotDX.config.raidList[id];
					}
				}
			}
			tmp.getPaste = function(id) {
				if (typeof SRDotDX.config.pasteList[id] == 'object') {
					console.log("[SRDotDX] Returning paste " + id);
					return SRDotDX.config.pasteList[id];
				}
			}
			tmp.import = function (data) {
			}
			tmp.save = function (b) {
				b = (typeof b==='undefined'?true:b);
				for (var id in SRDotDX.config.raidList){
					if (SRDotDX.config.raidList.hasOwnProperty(id) && SRDotDX.config.raidList[id].timeLeft <= 0) {
						delete SRDotDX.config.raidList[id];
						SRDotDX.gui.raidListRemoveById(id);
					}
				}
				var a = SRDotDX.config.raidFormat;
				SRDotDX.config.raidFormat = SRDotDX.config.raidLinkFormat.replace(/\{/g,"&#123;").replace(/\}/g,"&#125;").replace(/\[/g,"&#91;").replace(/\]/g,"&#93;")
				GM_setValue("SRDotDX",JSON.stringify(SRDotDX.config));
				SRDotDX.config.raidFormat = a;
				if(b) setTimeout("SRDotDX.config.save(true);",30000);
				console.log("[SRDotDX] Config saved (repeat="+b+")");
			}
			return tmp;
		})(),
		purge: function() {
			var el = document.getElementById('raid_list');
			if(el){
				var diff = el.childNodes.length - SRDotDX.config.maxRaidCount;
				if(SRDotDX.config.useMaxRaidCount && diff > 0){
					if(!SRDotDX.gui.Importing){
						console.log("[SRDotDX] Purging started " + diff);
						var uraids = SRDotDX.gui.GetUnvisitedRaids();
						uraids.sort(function(a,b){
							if(!(typeof a.timeStamp === 'undefined' || typeof b.timeStamp === 'undefined'))
								if(a.timeStamp < b.timeStamp) return -1;
							return 1;
						});
						var i=0, total=0;;
						while(i<uraids.length && diff > 0){
							if((new Date).getTime() - uraids[i].timeStamp > 60000){//only if it's older than 1 hour
								console.log('[SRDotDX] Purging ' + uraids[i].id);
								SRDotDX.gui.deleteRaid(uraids[i].ele.getElementsByClassName("FPXDeleteLink")[0], uraids[i].id);
								i++;
								diff--;
							} else break;
						}
						total += i;
						i=0;
						if(diff > 0){
							var raids = SRDotDX.gui.GetAllRaids();
							raids.sort(function(a,b){
								if(!(typeof a.timeStamp === 'undefined' || typeof b.timeStamp === 'undefined'))
									if(a.timeStamp < b.timeStamp) return -1;
								return 1;
							});
							while(i<raids.length && diff > 0){
								if((new Date).getTime() - uraids[i].timeStamp > 60000){//only if it's older than 1 hour
									console.log('[SRDotDX] Purging ' + raids[i].id);
									SRDotDX.gui.deleteRaid(raids[i].ele.getElementsByClassName("FPXDeleteLink")[0], raids[i].id);
									i++;
									diff--;
								} else break;
							}
						}
						total += i;
						SRDotDX.gui.doStatusOutput('Maximum raid count exceeded. ' + total + ' old raids purged.');
						console.log("[SRDotDX] Purging ended");
					}else setTimeout("SRDotDX.purge();", 1000);
				}
			}
		},
		getRaidDetailsBase: function(url) {
			//if(!/^http:\/\/www\.kongregate\.com\/games\/5thplanetgames\/dawn-of-the-dragons(?:\/?$|\?|#)/i.test(url)) return null;//added security for pastebin import
			var r = {diff: '', hash: '', boss: '', id: ''};
			var reg = /[?&]([^=]+)=([^?&]+)/ig, p = url.replace(/&amp;/gi,"&");
			while ((i = reg.exec(p)) != null) {
				if (!r.diff && i[1] == 'kv_difficulty'){
					r.diff=parseInt(i[2])
				}
				else if (!r.hash && i[1] == 'kv_hash'){
					r.hash=i[2]
				}
				else if (!r.boss && i[1] == 'kv_raid_boss'){
					r.boss=i[2]
				}
				else if (!r.id && i[1] == 'kv_raid_id'){
					r.id=i[2]
				}
				else if (i[1] != 'kv_action_type'){
					return
				}
			}
			if (typeof r != 'undefined' && typeof r.diff != 'undefined' && typeof r.hash != 'undefined' && typeof r.boss != 'undefined' && typeof r.id != 'undefined') {
				r.diffLongText = ['Normal','Hard','Legendary','Nightmare','Insane','Hell'][r.diff-1];
				r.diffShortText = ['N','H','L','NM','I','HL'][r.diff-1];
				
				var stats = SRDotDX.raids[r.boss];
				if (typeof stats == 'object') {
					r.name = stats.name;
					r.shortname = stats.shortname;
					r.size = stats.size;
					r.dur = stats.duration;
					r.durText = stats.dur + "hrs";
					r.stat = stats.stat;
					r.statText = SRDotDX.getStatText(stats.stat);
					if (!isNaN(stats.health[r.diff-1])) {
						r.health = stats.health[r.diff-1];
						r.healthText = SRDotDX.getShortNum(r.health);
						if (r.boss == "dragons_lair") {
							r.fairShareText = "";
						} else {
							r.fairShare = r.health / r.size;
							r.fairShareText = SRDotDX.getShortNum(r.fairShare);

						}

						if (typeof stats.loottiers == 'object' && typeof stats.loottiers[r.diff-1] == 'object') {
							var tiers = stats.loottiers[r.diff-1];
							var text = 'Tiered loot: ' + SRDotDX.getLootTierText(stats.id,(r.diff - 1));
							r.optimalShare = 0;
							r.optimalShareText = text;

						} else {

							r.optimalShare = r.fairShare * {"1": 1, "10":1.25, "13":1.25, "50": 2.2, "100":2.3, "250": 1, "500": 1.5}[r.size];					
							r.optimalShareText = SRDotDX.getShortNum(r.optimalShare);
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
							r.fairShareText = SRDotDX.getShortNum(r.fairShare);
							r.optimalShare = 1000000000;
							r.optimalShareText = SRDotDX.getShortNum(r.optimalShare);
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
		getPasteDetails: function(url, user) {
			user=(user?user:'');
			var pb = {url: url, id: url.substring(url.length-8)};
			pb.id = url.substring(url.length-8);
			console.log("[SRDotDX] Getting paste");
			var info = SRDotDX.config.getPaste(pb.id);
			console.log(typeof info);
			if(typeof info === 'undefined'){
				info = SRDotDX.config.addPaste(pb.url, pb.id, user);
				if(typeof info == 'object'){
					console.log("[SRDotDX] Paste is new");
					pb.isNew = true;
				}
			} else pb.isNew = false;
			pb.user = info.user;
			pb.lastUser = info.lastUser;
			//pb.seen = info.seen;
			//pb.linkText = function () { //TODO
			//	if (SRDotDX.config.formatPasteLinks){
			//		var txt = SRDotDX.config.pasteLinkFormat;
			//	}
			//}
			return pb;
		},
		getRaidDetails: function(url,user,visited,seen,ts,room) {
			user=(user?user:'');
			visited=(visited?visited:(user==active_user.username() && SRDotDX.config.markMyRaidsVisted));
			seen=(seen?seen:false);
			var i;
			var r = SRDotDX.getRaidDetailsBase(url);
			if (typeof r != 'undefined' && typeof r.diff != 'undefined' && typeof r.hash != 'undefined' && typeof r.boss != 'undefined' && typeof r.id != 'undefined') {
				var info = SRDotDX.config.getRaid(r.id);
				if (typeof info != 'object') {
					info = SRDotDX.config.addRaid(r.hash, r.id, r.boss, r.diff,visited,seen,user,ts,room)
					if(typeof info == 'object') r.isNew = true;
					//inserting new raid
				} else r.isNew = false;
				r.timeStamp = info.timeStamp;
				r.seen = info.seen;
				r.visited = info.visited;

				r.linkText = function () {
					if (SRDotDX.config.formatRaidLinks){
						var txt = SRDotDX.config.raidLinkFormat;
						txt = txt.replace(/<visited:([^>]*)>/gi,(this.visited?"$1":""));
						txt = txt.replace(/<seen:([^>]*)>/gi,(this.seen?"$1":""));
						txt = txt.replace(/<diff>/gi,this.diffShortText);
						txt = txt.replace(/<diff:Num>/gi,this.diff);
						txt = txt.replace(/<diff:Long>/gi,this.diffLongText);
						txt = txt.replace(/<bossId>/gi,this.boss);
						txt = txt.replace(/<raidId>/gi,this.id);
						txt = txt.replace(/<hash>/gi,this.hash);
						txt = txt.replace(/<name>/gi,(!this.name?'Unknown':this.name));
						txt = txt.replace(/<shortname>/gi,(!this.name?'Unknown':SRDotDX.raids[this.boss].shortname));
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
					}
					else {
						return '<image src="http://cdn2.kongregate.com/game_icons/0033/2679/i.gif" style="vertical-align: text-top"> Legacy of a Thousand Suns'
					}
				}
				return r;
			}
		},
		browser: {
			ff:(navigator.userAgent.toLowerCase().indexOf("firefox")>-1),
			chrome:(navigator.userAgent.toLowerCase().indexOf('chrome')>-1)
		},
		getRaidLink: function (msg,user) {
			msg = msg.replace(/[\r\n]/g,"");
			var m = /^((?:(?!<a[ >]).)*)<a.*? href="((?:(?:https?:\/\/)?(?:www\.)?kongregate\.com)?\/games\/5thPlanetGames\/dawn-of-the-dragons(\?[^"]+))".*?<\/a>((?:(?!<\/?a[ >]).)*(?:<a.*? class="reply_link"[> ].*)?)$/i.exec(msg);
			if (m) {
				var raid = SRDotDX.getRaidDetails(m[3],user)
				if (typeof raid != 'undefined' && typeof raid != 'null') {
					raid.ptext = m[1];
					raid.url = m[2];
					raid.ntext = m[4];
					return raid;
				}
			}
		},
		getPastebinLink: function (msg, user, pub) {
			msg = msg.replace(/[\r\n]/g,"");
			var m = /^((?:(?!<a[ >]).)*)?http:\/\/pastebin\.com\/\w{8}((?:(?!<\/?a[ >]).)*(?:<a.*? class="reply_link"[> ].*)?)$/i.exec(msg);
			if (m) {
				console.log("[SRDotDX] Getting paste details");
				var pb = SRDotDX.getPasteDetails(/http:\/\/pastebin\.com\/\w{8}/i.exec(m[0])+"",pub?user:active_user.username());
				if(!(typeof pb === 'undefined' || typeof pb === 'null')){	
					pb.ptext = m[1]||"";
					pb.ntext = m[2]||"";
				}
				return pb;
			}
		},
		getRoomName: function() {
			var els = document.getElementsByClassName('room_name_container');
			for(var i=0;i<els.length;i++){
				if(els[i].innerHTML.indexOf('Room') > -1){
					var ret = els[i].firstChild.nextSibling.innerHTML
					if(ret.indexOf('#') > -1) return parseInt(ret.substring(ret.indexOf('#')+1, ret.length));
					return null
				}
			}
			return null
		},
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
			if (typeof SRDotDX.raids[raidid] != 'object' || typeof SRDotDX.raids[raidid].loottiers != 'object' || typeof SRDotDX.raids[raidid].loottiers[diffIndex] != 'object') {
				return "";
			}
			var tiers = SRDotDX.raids[raidid].loottiers[diffIndex];
			var text = tiers[0];
			for (var i = 1;i<tiers.length;i+=1) {
				text = text + "/" + tiers[i] + " ";
			}
			return text;
		},
		gui: {
			addRaid: function (id) {
				var r = id;
				if(typeof id == "string" || typeof id == "number") r = SRDotDX.config.raidList[id];
				if (r.boss) {
					var rd = SRDotDX.raids[r.boss];
					var a = document.getElementById("raid_list");
					if (typeof a != 'undefined' && a) { 
						var b = 1
						if (a.hasChildNodes()) b += a.childNodes.length;
						var info = '<hr>';
						if (typeof rd != 'object') {
							rd = {name: 'Unknown'};
							info += '<div style="float: left;width: 49%;">Posted By:<br>In Room:<br>Timestamp:<br><br><hr>Boss Id:<br>Difficulty:</div>';
							info += '<div style="width: 49%; float: right; text-align: right;">'
							info += (r.user != ''?r.user:'Unknown')+"<br>";
							info += ((r.room!='undefined'&&r.room!= null&& r.room!= '')?r.room:'Unknown')+"<br>";
							info += (typeof r.timeStamp == 'number'?dateFormat(new Date(r.timeStamp), 'ddd, h:MM TT') :'Unknown')+"<br>";
							info += (typeof r.timeStamp == 'number'?'<span id="timeSince_'+r.id+'">'+timeSince(new Date(r.timeStamp))+'</span>' :'Unknown')+"<hr>";
							info += r.boss+"<br>";
							info += ["Normal","Hard","Legendary","Nightmare","Insane","Hell"][r.diff -1]+"</div>";
						}
						else if (rd.health[r.diff-1] == 'Unlimited') {
							info += '<div style="float: left;width: 49%;">Posted By:<br>In Room:<br>Timestamp:<br><br><hr>Stat Used:<br>Difficulty:<br>Health:<br>Best Share:</div>';
							info += '<div style="width: 49%; float: right; text-align: right;">'
							info += (r.user != ''?r.user:'Unknown')+"<br>";
							info += ((r.room!='undefined'&&r.room!= null&& r.room!= '')?r.room:'Unknown')+"<br>";
							info += (typeof r.timeStamp == 'number'?dateFormat(new Date(r.timeStamp), 'ddd, h:MM TT') :'Unknown')+"<br>";
							info += (typeof r.timeStamp == 'number'?'<span id="timeSince_'+r.id+'">'+timeSince(new Date(r.timeStamp))+'</span>' :'Unknown')+"<hr>";
							info += rd.stat+"<br>";
							info += ["Normal","Hard","Legendary","Nightmare","Insane","Hell"][r.diff -1]+"<br>";	
							info += "Unlimited<br>";
							if (typeof rd.loottiers == 'object' && typeof rd.loottiers[r.diff-1] == 'object') {
								info += rd.loottiers[r.diff-1][rd.loottiers[r.diff-1].length-1] + "</div>";								
							} else {
								info += "Unlisted</div>";
							}
						}
						
						else if (!isNaN(rd.health[r.diff-1])) {
							var h = rd.health[r.diff -1];
							var f = h / rd.size;
							var o = f * {"1":1, "10":1.25, "50":2.2, "100":2.3, "250":1,"500":1.5}[rd.size];
							info += '<div style="float: left; width: 49%;">';
							info += 'Posted By:<br>In Room:<br>Timestamp:<br><br><hr>Difficulty:<br>Stats Used:<br>Size:<br>Health:<br>';
							if (typeof rd.loottiers == 'object' && typeof rd.loottiers[r.diff-1] == 'object') {
								info += 'Loot tiers:</div>';
							}
							else {
								info += 'Fair Share:<br>Optimal Share:</div>';
							}
							info += '<div style="float: right; width: 49%;text-align: right;">';
							info += (r.user != ''?r.user:'Unknown')+"<br>";
							info += ((r.room!='undefined'&&r.room!= null&& r.room!= '')?r.room:'Unknown')+"<br>";
							info += (typeof r.timeStamp == 'number'?dateFormat(new Date(r.timeStamp), 'ddd, h:MM TT') :'Unknown')+"<br>";
							info += (typeof r.timeStamp == 'number'?'<span id="timeSince_'+r.id+'">'+timeSince(new Date(r.timeStamp))+'</span>' :'Unknown')+"<hr>";
							info += ["Normal","Hard","Legendary","Nightmare","Insane","Hell"][r.diff -1]+"<br>";
							info += rd.stat+"<br>";
							info += rd.size+"<br>";
							info += SRDotDX.getShortNum(h)+"<br>";
							if (typeof rd.loottiers == 'object' && typeof rd.loottiers[r.diff-1] == 'object') {
								info += SRDotDX.getLootTierText(rd.id,(r.diff-1)) + "</div>";
							} else {
								info += SRDotDX.getShortNum(f)+"<br>";
								info += SRDotDX.getShortNum(o)+"</div>";
							}
						}
						else {
							info += '<div style="float: left; width: 49%;">';
							info += 'Posted By:<br>In Room:<br>Timestamp:<br><br><hr>Difficulty:<br>Stats Used:<br>Size:<br>Health:<br>Fair Share:<br>Optimal Share:</div>';
							info += '<div style="float: right; width: 49%;text-align: right;">';
							info += (r.user != ''?r.user:'Unknown')+"<br>";
							info += ((r.room!='undefined'&&r.room!= null&& r.room!= '')?r.room:'Unknown')+"<br>";
							info += (typeof r.timeStamp == 'number'?dateFormat(new Date(r.timeStamp), 'ddd, h:MM TT') :'Unknown')+"<br>";
							info += (typeof r.timeStamp == 'number'?'<span id="timeSince_'+r.id+'">'+'<span id="timeSince_'+r.id+'">'+timeSince(new Date(r.timeStamp))+'</span>'+'</span>':'Unknown')+"<hr>";
							info += ["Normal","Hard","Legendary","Nightmare","Insane","Hell"][r.diff -1]+"<br>";
							info += rd.stat+"<br>";
							info += rd.size+"<br>";
							info += "Unknown<br>";
							info += "Unknown<br>";
							info += "Unknown</div>";
						}
						info += '<div style="clear: both"></div><hr>';
						info += '<center><table><tr>';
						info += '<td style="width: 70px"><input class="FPXcbSeen" type="checkbox" '+(r.seen == true?' checked="checked"':'')+'> Seen</td>';
						info += '<td style="width: 70px"><input class="FPXcbVisited" type="checkbox" '+(r.visited == true?' checked="checked"':'')+'> Visited</td>';
						info += '</tr></table></center>';

						var url = "/games/5thPlanetGames/dawn-of-the-dragons?kv_action_type=raidhelp&kv_difficulty="+r.diff+"&kv_hash="+r.hash+"&kv_raid_boss="+r.boss+"&kv_raid_id="+r.id;
						var filterClass = " SRDotDX_filteredRaidList" + rd.id + '_' + (r.diff - 1);
						var visitedClass = (r.visited == true ? " SRDotDX_visitedRaidList" : "");
						var lii = SRDotDX.gui.cHTML('div').set({
							class: 'raid_list_item raid_list_item_'+ r.id + filterClass + visitedClass,
							style: b%2==0?'background-color:#e0e0e0':'',
							raidId: r.id,
							raidHash: r.hash,
							raidDiff: r.diff,
							raidBoss: r.boss,
							raidVisited: r.visited,
							raidSeen: r.seen,
						});
						if (SRDotDX.config.newRaidsAtTopOfRaidList == true) {
							var arr = a.getElementsByClassName("raid_list_item");
							if (arr.length > 0) {
								lii.attach("before",arr[0]);
							} else {
								lii.attach("to",a);
							}
						} else {
							lii.attach("to",a);
						}
						var li = lii.ele();

						
						var rh;

						var diffColor = "";
						var diffText = "";
						if (r.diff == 1) {
							diffColor = "#00BB00";
							diffText = "N";
						} else if (r.diff == 2) {
							diffColor = "#DDAA00";
							diffText = "H";
						} else if (r.diff == 3) {
							diffColor = "#FF0000";
							diffText = "L";
						} else if (r.diff == 4) {
							diffColor = "#BB00BB";
							diffText = "NM";
						}

						if(SRDotDX.config.FPXdisplayListImgLink){
							rh=SRDotDX.gui.cHTML('div').set({class: 'raid_list_item_head'}).html(' \
								<a href="'+url+'" class="link">' + rd.name + '</a> \
								<span class="link" style="font-weight: normal !important; float: right"><a class="FPXDeleteLink" href="#">delete</a></span> \
								<a class="FPXlink" href="'+url+'" ></a> \
								<span class="RaidQuickLink">[</span><a style="color:blue; text-decoration:underline; cursor:pointer" class="RaidQuickLink" href="'+url+'">Link</a><span class="RaidQuickLink">]</span> \
								<span class="FPXtext">' + rd.name + '</span> <span class="FPXtext" style="float: right">'+(r.visited?'visited':'')+'</span><span class="FPXtext" style="display: block; width: 25px; float: left; font-weight: bold; color: ' + diffColor + ';">' + diffText + '</span> \
							').attach("to",li).ele()/* .addEventListener("click",function(e) {
								var con = document.getElementById("raid_list").getElementsByClassName("active");
								if (con.length == 1) con[0].className = con[0].className.replace(/ active/gi,"");
								this.parentNode.className += " active";
							}) */;
						}else{
							rh=SRDotDX.gui.cHTML('div').set({class: 'raid_list_item_head'}).html(' \
								<a href="'+url+'" class="link">' + rd.name + '</a> \
								<span class="link" style="font-weight: normal !important; float: right"><a class="FPXDeleteLink" href="#">delete</a></span> \
								<span class="RaidQuickLink">[</span><a style="color:blue; text-decoration:underline; cursor:pointer" class="RaidQuickLink" href="'+url+'">Link</a><span class="RaidQuickLink">]</span> \
								<span class="FPXtext">' + rd.name + '</span> <span class="FPXtext" style="float: right">'+(r.visited?'visited':'')+'</span><span class="FPXtext" style="display: block; width: 25px; float: left; font-weight: bold; color: ' + diffColor + ';">' + diffText + '</span> \
							').attach("to",li).ele()/* .addEventListener("click",function(e) {
								var con = document.getElementById("raid_list").getElementsByClassName("active");
								if (con.length == 1) con[0].className = con[0].className.replace(/ active/gi,"");
								this.parentNode.className += " active";
							}) */;
						}
						var ri = SRDotDX.gui.cHTML('div').set({
							class: 'raid_list_item_info'
						}).html(info).attach("to",li);
					}
				}
				else {
					delete SRDotDX.config.raidList[a];
				}
			},
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
			errorMessage: function(s, tag){
				tag=(typeof tag==='undefined'?'b':tag);
				SRDotDX.gui.doStatusOutput('<'+tag+'>'+s+'</'+tag+'>');
			},
			updateMessage: function () {
				SRDotDX.gui.doStatusOutput(SRDotDX.gui.standardMessage(), false);
			},
			postingMessage: function(i, ct) {
				SRDotDX.gui.doStatusOutput('Posting message ' + i + (typeof ct==='undefined'?'': ' of ' + ct + '...'), false);
			},
			standardMessage: function (){//message to show 
				return 'JHunz/wpatter6 - <span class="room_name_container h6_alt mbs">' +document.getElementById("raid_list").childNodes.length + ' raids stored</span>';
			},
			doStatusOutput: function (str, msecs){
				msecs=(typeof msecs === 'undefined'?4000:msecs);
				var el = document.getElementById('StatusOutput');
				el.innerHTML=str;
				if(msecs)setTimeout(function(){ el.innerHTML=SRDotDX.gui.standardMessage(); }, msecs);
			},
			raidsTabClicked: function (){
				var els = document.getElementsByClassName("SRDotDX_NewRaidsCount");
				for(var i=0;i<els.length;i++){
					i.innerHTML='0';
				}
			},
			toggleDisplay: function(el, sender){
				if(typeof el == "string") el = document.getElementById(el);
				if(el.style.display == "none"){
					el.style.display = "";
					if(typeof sender == "object") sender.className = sender.className.replace("closed_link", "opened_link");
				}else{
					el.style.display = "none";
					if(typeof sender == "object") sender.className = sender.className.replace("opened_link", "closed_link");
				}
			},
			Importing:false,
			FPXimportRaids: function(user){
				var linklist=document.FPXRaidSpamForm.FPXRaidSpamInput.value;
				if(linklist.length>10)
				{
					console.log("[SRDotDX] Import started");
					SRDotDX.gui.Importing=true;
					document.FPXRaidSpamForm.FPXRaidSpamInput.value="";
					var link,tagged=false,haspb=false,imct=0,total=document.getElementById('raid_list').childNodes.length;
					var patt = new RegExp("http...www.kongregate.com.games.5thPlanetGames.dawn.of.the.dragons.[\\w\\s\\d_=&]+[^,]", "ig");
					//if(total > SRDotDX.config.maxRaidCount){
					//	if(!confirm("This import contains a large number of raids (" + total + ").  Too many raids can cause performance issues, and can even crash the browser. Continue?"))
					//		return;
					//}
					
					if(linklist.indexOf("!!OBJECT_IMPORT!!")>-1){
						var objs = linklist.split(";"), i=0;
						console.log("[SRDotDX] Objects importing "+objs.length);
						tagged=true;
						while(imct<objs.length){
							var obj = objs[imct].split(",");
							if(obj.length == 4 && patt.test(obj[0])){
								console.log("[SRDotDX] Object importing " + imct + ": " + obj[2] + " : " + obj[1] + " : " + obj[3]);
								SRDotDX.getRaidDetails(obj[0], obj[2], SRDotDX.config.markImportedVisited, SRDotDX.config.markImportedVisited, obj[1],obj[3]);
							}
							imct++;
						}
					}
					if(!tagged){
						while(link = patt.exec(linklist))
						{
							imct++;
							SRDotDX.getRaidDetails(String(link), 'Untagged Import', SRDotDX.config.markImportedVisited, SRDotDX.config.markImportedVisited);
						}
					}

					var pbpatt = new RegExp("http...pastebin.com.\\w{8}", "ig");
					while(link = pbpatt.exec(linklist)){
						haspb=true;
						SRDotDX.gui.FPXImportPasteBin(link);//recurse
					}
					if(!haspb){				
						var diff = document.getElementById('raid_list').childNodes.length - total;
						SRDotDX.gui.doStatusOutput('Import complete, ' + diff + ' of ' + imct + ' new raids');
					}
					SRDotDX.gui.Importing=false;
					SRDotDX.config.save(false);
					return {totalnew: diff, total:imct}
				}
			},
			deleteRaid: function (ele,id,upd) {
				upd=(typeof upd === 'undefined'?true:upd);
				if (SRDotDX.config.raidList[id]) {
					delete SRDotDX.config.raidList[id];
				}
				setTimeout(function(ele) {
					//var e = ele.nextSibling;
					//while (e) {
					//	if (e.getAttribute("style").indexOf('background-color:#e0e0e0') > -1) {
					//		e.setAttribute("style","");
					//	}
					//	else {
					//		e.setAttribute("style",'background-color:#e0e0e0');
					//	}
					//	e = e.nextSibling;
					//}
					//delete the element
					ele.parentNode.removeChild(ele);
					if(upd)SRDotDX.gui.updateMessage();
				},1,ele.parentNode.parentNode.parentNode)
			},
			FPXdeleteAllRaids: function () {
				console.log("[SRDotDX]::{FPX}:: DELETE ALL STARTED...");
				for (var id in SRDotDX.config.raidList){					
						if (SRDotDX.config.raidList[id]) {
							delete SRDotDX.config.raidList[id];
						}				
				}
				console.log("[SRDotDX]::{FPX}:: removing from raid_list div");
				var raidlistDIV=document.getElementById('raid_list');
				while (raidlistDIV.hasChildNodes()) {
					raidlistDIV.removeChild(raidlistDIV.lastChild);
				}
				console.log("[SRDotDX]::{FPX}:: removing from local storage...");
				localStorage.removeItem('raidList');
				SRDotDX.gui.updateMessage();
				console.log("[SRDotDX]::{FPX}:: DELETE ALL FINISHED...");
			},
			FPXdoWork: function (param1, whisper, whisperTo) {
				console.log("[SRDotDX]::{FPX}::"+param1+"\n");
				var matchClass="chat_input";						
				var elems= document.getElementById("chat_rooms_container").firstChild.getElementsByTagName('textarea');
				if(whisper && ((whisperTo||"") != "")){
					console.log("[SRDotDX] Whispering spam to " + SRDotDX.config.whisperTo);
					param1 = "/w " + SRDotDX.config.whisperTo + " " + param1;
				}
				for (var i in elems){
						if((" "+elems[i].className+" ").indexOf(" "+matchClass+" ") > -1)
						{elems[i].value = param1;holodeck.activeDialogue().sendInput(); break;}
				}
			},
			FPXformatRaidOutput: function(url) {
				if(!SRDotDX.config.formatLinkOutput) return url;
				var r = SRDotDX.getRaidDetailsBase(String(url));
				return r.shortname + ' ' + r.diffShortText + ' ' + url				
			},
			FPXprettyPost: function () {
				console.log("[SRDotDX]::{FPX}:: Pretty post...");
				try
				{
					var linklist=document.FPXRaidSpamForm.FPXRaidSpamInput.value;
					
					if(linklist.length>10){
						var patt = new RegExp("http...www.kongregate.com.games.5thPlanetGames.dawn.of.the.dragons.[\\w\\s\\d_=&]+[^,]", "ig");
						var link,links=[];
						while(link = patt.exec(linklist)) links.push(link);
						
						var fullList = eliminateDuplicates(links);
						var fullCount = fullList.length;
						var bossArray = [];
						var finalOutput = ["Train starting. " + fullCount + " total raids including "];
						
						for(var i=0; i< SRDotDX.raidArray.length; i++)
						{
							var curBoss = SRDotDX.raidArray[i]
							var filtList = fullList.filter(function (e){
								return new RegExp('kv_raid_boss=' + curBoss,'i').test(e);
							});
							if(filtList.length > 0){
								var raid = SRDotDX.raids[curBoss];
								bossArray.push(raid.shortname);
								finalOutput.push(raid.name + " x" + filtList.length);
								console.log("[SRDotDX] Pretty post sorting " + raid.shortname);
								filtList.sort(function(a,b){
									a=SRDotDX.getRaidDetailsBase(String(a)),b=SRDotDX.getRaidDetailsBase(String(b));
									if(a.diff < b.diff) return -1
									return 1
								});
								for(var j=0; j< filtList.length; j++){
									var r = SRDotDX.getRaidDetailsBase(String(filtList[j]));
									finalOutput.push((j+1) + ") " + r.diffShortText + " " + filtList[j]);
								}
							}
						}
						if(bossArray.length > 0){
							finalOutput.push("Train finished");
							var bossStr = "";
							for(var i=0; i<bossArray.length; i++){
								if(bossStr != "") bossStr += ", ";
								bossStr += bossArray[i];
							}
							finalOutput[0] = finalOutput[0] + bossStr;
							var timer = 500, ttw=3000, ct=0;
							for(var i=0; i<finalOutput.length; i++){
								if(!SRDotDX.gui.isPosting) break;
								var link = finalOutput[i];
								(function(param1) {return SRDotDX.gui.FPXTimerArray[i]=setTimeout(function() {
									if(!SRDotDX.gui.isPosting)return; 
									SRDotDX.gui.FPXdoWork(param1, SRDotDX.config.whisperSpam, SRDotDX.config.whisperTo);
									SRDotDX.gui.postingMessage(++ct, finalOutput.length);
								},timer); })(link);
								timer+=ttw;								
							}
						}
					}
					SRDotDX.gui.FPXTimerArray[SRDotDX.gui.FPXTimerArray.length] = setTimeout(function() {	SRDotDX.gui.FPXEndPosting();console.log("[SRDotDX]::{FPX}:: Pretty post finished"); },timer);
					
				}catch(error){console.log("[SRDotDX]::{FPX}::ERROR:: "+error);}
			},
			isPosting:false,
			FPXTimerArray: [],
			FPXStopPosting: function(){
				SRDotDX.gui.FPXEndPosting();
				console.log("[SRDotDX]::{FPX}:: SPAMMER CANCELLED...");
				SRDotDX.echo('Raid posting cancelled');
			},
			FPXEndPosting: function(){
				for(var i=0;i<SRDotDX.gui.FPXTimerArray.length;i++){
					clearTimeout(SRDotDX.gui.FPXTimerArray[i]);
				}
				SRDotDX.gui.isPosting = false;
				document.FPXRaidSpamForm.Submit.disabled=false;
				document.FPXRaidSpamForm.Submit1.disabled=true;
				document.FPXRaidSpamForm.Submit2.disabled=false;
				document.FPXRaidSpamForm.Submit3.disabled=false;
				SRDotDX.gui.doStatusOutput('Posting finished');
				//document.getElementById("FPXShareTab").innerHTML="Share";
				SRDotDX.gui.FPXTimerArray = [];
				SRDotDX.config.save(true);
			},
			FPXStartPosting: function() {
				SRDotDX.gui.isPosting = true;
				document.FPXRaidSpamForm.Submit.disabled=true;
				document.FPXRaidSpamForm.Submit1.disabled=false;
				document.FPXRaidSpamForm.Submit2.disabled=true;
				document.FPXRaidSpamForm.Submit3.disabled=true;
				SRDotDX.gui.doStatusOutput('Posting started...', false);
				//document.getElementById("FPXShareTab").innerHTML="Working...";
			},
			FPXspamRaids: function () {
				if(SRDotDX.config.whisperSpam && ((SRDotDX.config.whisperTo||"") == "")){
					alert("You must select a user to whisper to if whispering is selected.");
					return false;
				}
				SRDotDX.gui.FPXStartPosting();
				if(SRDotDX.config.prettyPost){
					SRDotDX.gui.FPXprettyPost();
				}else{			
					console.log("[SRDotDX]::{FPX}:: SPAMMER STARTED...");
					try
					{
						var linklist=document.FPXRaidSpamForm.FPXRaidSpamInput.value;
						var ct=0;
						if(linklist.length>10)
						{
							document.FPXRaidSpamForm.FPXRaidSpamInput.value="";
							var patt = new RegExp("http...www.kongregate.com.games.5thPlanetGames.dawn.of.the.dragons.[\\w\\s\\d_=&]+[^,]", "ig");
							var link, i=0;
							var timer=500,ttw=3000;
							var total = linklist.split(patt).length;
							
							while((link = patt.exec(linklist)) && SRDotDX.gui.isPosting)
							{
								(function(param1) {return SRDotDX.gui.FPXTimerArray[i]=setTimeout(function() {
									if(!SRDotDX.gui.isPosting)return; 
									SRDotDX.gui.FPXdoWork(SRDotDX.gui.FPXformatRaidOutput(param1), SRDotDX.config.whisperSpam, SRDotDX.config.whisperTo);
									SRDotDX.gui.postingMessage(++ct, total);},timer); 
								})(link);
								timer+=ttw;
								i++;
							}
						}
						SRDotDX.gui.FPXTimerArray[SRDotDX.gui.FPXTimerArray.length]=setTimeout(function() {	SRDotDX.gui.FPXEndPosting(); console.log("[SRDotDX]::{FPX}:: SPAMMER FINISHED..."); },timer);
					}catch(error)
					{
						console.log("[SRDotDX]::{FPX}::ERROR:: "+error);
					}
				}
			},
			FPXFilterRaidListByName: function () {
				console.log("[SRDotDX]::{FPX}:: FILTERING RAID LIST...");
				
				var roomNameFilter = document.FPXRaidFilterForm.FPXRoomNameFilter.value;
				if(!isNumber(roomNameFilter) && roomNameFilter != ""){
					alert("Enter room number only for room filtering");
					return;
				}
				
				var raidList=document.getElementById('raid_list').childNodes,raidName;
				var classReg = /(SRDotDX_filteredRaidList[0-9a-z_]+)/i;
				var visitReg = /SRDotDX_visitedRaidList/i;
				
				var diffFilter=document.FPXRaidFilterForm.FPXRaidBossDifficultyFilter.value;
				var posterSwitch = document.FPXRaidFilterForm.FPXPostedNameSwitch.value;
				var roomSwitch = document.FPXRaidFilterForm.FPXRoomNameSwitch.value;
				var roomFilter = document.FPXRaidFilterForm.FPXRoomNameFilter.value;
				
				var str = (!(typeof SRDotDX.zoneRaidRegex[document.FPXRaidFilterForm.FPXRaidBossNameFilter.value]==='undefined')?SRDotDX.zoneRaidRegex[document.FPXRaidFilterForm.FPXRaidBossNameFilter.value]:document.FPXRaidFilterForm.FPXRaidBossNameFilter.value);
				
				var re = new RegExp(str, "i");
				var p_re = new RegExp(document.FPXRaidFilterForm.FPXPostedNameFilter.value, "i");
				
				for(i=0; i< raidList.length; i++)
				{
					SRDotDX.gui.FPXFilterRaidSingle(raidList[i], re, diffFilter, p_re, posterSwitch, roomFilter, roomSwitch);
				}
				
				console.log("[SRDotDX]::{FPX}:: RAID LIST FILTER COMPLETED...");
				return false;
			},
			FPXFilterRaidSingle: function(el, re, diffFilter, p_re, posterSwitch, roomFilter, roomSwitch){
				re=(re?re:new RegExp(document.FPXRaidFilterForm.FPXRaidBossNameFilter.value, "i"));
				if(typeof el == "undefined") return;
				var id = el;
				
				if(typeof el != "string" && typeof el != "number") id = el.getAttribute("raidid");
				else el = document.getElementsByClassName("raid_list_item_"+id)[0];
				
				var r = SRDotDX.config.raidList[id];
				
				
				if(typeof r == 'object')
				{
					if(re.test(el.firstChild.childNodes[1].textContent) &&  //Name
						(diffFilter==0 || diffFilter==r.diff) &&  //Difficulty
						((posterSwitch==0 && p_re.test(r.user)) || (posterSwitch==1 && !p_re.test(r.user))) && //Poster
						((roomFilter=="") || (roomSwitch==0 && roomFilter==r.room) || (roomSwitch==1 && roomFilter != r.room))){ //Room
						el.className = el.className.replace(/raid_list_item (hidden )?(.*)/i,"raid_list_item $2");
						return true;
					}else{
						el.className = el.className.replace(/raid_list_item (hidden )?(.*)/i,"raid_list_item hidden $2");
						return false;
					}
				}
			},
			FPXImportPasteBin: function(url){
				url=url+"";
				if(/pastebin\.com\//i.test(url)){
					if(!SRDotDX.gui.importingPastebin){
						url= 'http://pastebin.com/raw.php?i='+url.substring(url.length-8);
						console.log("[SRDotDX] Importing pastebin " +url);
						SRDotDX.gui.importingPastebin=true;
						document.getElementById("SRDotDX_pastebin").src = url;
						setTimeout("if(SRDotDX.gui.importingPastebin){console.log('[SRDotDX] Unknown error importing pastebin.  See console');SRDotDX.gui.importingPastebin=false;}", 30000);//not found in 30 secs error occured
					} else {
						console.log("[SRDotDX] Pastebin collision, trying again in 1 second");
						setTimeout("SRDotDX.gui.FPXImportPasteBin('"+url+"');", 1000);
					}
				}
			},
			importingPastebin:false,
			FPXSortRaids: function () {
				var raidArray = [];
				var selectedSort = document.getElementById("FPXRaidSortSelection").value;
				var selectedDir = document.getElementById("FPXRaidSortDirection").value;
				
				console.log("[SRDotDX] Sorting started " + selectedSort + " : " + selectedDir);
				var raidlistDIV=document.getElementById('raid_list');
				var raidList = raidlistDIV.childNodes;
				for(i=0; i<raidList.length; i+=1) {
					var item = SRDotDX.config.raidList[raidList[i].getAttribute("raidid")];
					raidArray.push(item);
				}
				var sortFunc;
				if(selectedSort == "Id")
					if(selectedDir == "asc")
						sortFunc = function(a,b){
							if(!(typeof a.id === 'undefined' || typeof b.id === 'undefined'))
								if(a.id < b.id) return -1;
							return 1;
						}
					else
						sortFunc = function(a,b){
							if(!(typeof a.id === 'undefined' || typeof b.id === 'undefined'))
								if(a.id > b.id) return -1;
							return 1;
						}
				else if(selectedSort == "Time")
					if(selectedDir == "asc")
						sortFunc = function(a,b){
							if(!(typeof a.timeStamp === 'undefined' || typeof b.timeStamp === 'undefined'))
								if(a.timeStamp < b.timeStamp) return -1;
							return 1;
						}
					else
						sortFunc = function(a,b){
							if(!(typeof a.timeStamp === 'undefined' || typeof b.timeStamp === 'undefined'))
								if(a.timeStamp > b.timeStamp) return -1;
							return 1;
						}
				else if(selectedSort == "Name")
					if(selectedDir == "asc")
						sortFunc = function(a,b){
							a=SRDotDX.raids[a.boss]; b=SRDotDX.raids[b.boss];
							console.log(a + " : " + b + " : " + (typeof a === 'undefined') + " : " + (typeof b === 'undefined'));
							if(!(typeof a === 'undefined' || typeof b === 'undefined'))
								if(a.name > b.name) return -1
							return 1;
						}
					else
						sortFunc = function(a,b){
							a=SRDotDX.raids[a.boss]; b=SRDotDX.raids[b.boss];
							if(!(typeof a === 'undefined' || typeof b === 'undefined'))
								if(a.name < b.name) return -1
							return 1;
						}
				else if(selectedSort == "Diff")
					if(selectedDir == "asc")
						sortFunc = function(a,b){
							if(a.diff > b.diff) return -1
							return 1
						}
					else
						sortFunc = function(a,b){
							if(a.diff < b.diff) return -1
							return 1
						}
				try{
					raidArray.sort(sortFunc);
				}catch(e){
					console.log("[SRDotDX] Sorting error: " +e);
					return;
				}
				
				var raidlistDIV=document.getElementById('raid_list');
				while (raidlistDIV.hasChildNodes()) {
					raidlistDIV.removeChild(raidlistDIV.lastChild);
				}
				
				for(var i=0; i<raidArray.length; i++){
					//SRDotDX.config.raidList[r.id] = r;
					SRDotDX.gui.addRaid(raidArray[i]);
				}
				SRDotDX.gui.FPXFilterRaidListByName();
				
				console.log("[SRDotDX] Sorting finished");
			},
			GetAllRaids: function (visible){
				console.log("[SRDotDX] Get all raids (visible="+visible+")");
				var r = [];
				var raidList = document.getElementById('raid_list').childNodes;
				if(typeof visible === 'undefined')
					for(i=0; i<raidList.length; i++) {
						var item = raidList[i];
						var raid = SRDotDX.config.raidList[item.getAttribute("raidid")];
						if (!(typeof raid === 'undefined')) {
							try {
								r.push(JSON.parse(JSON.stringify(raid)));
								r[r.length-1].ele = item
							} catch(err){console.log("[SRDotDX]::{FPX}:: error::"+err+"   raid var"+raidList[i]+raidList[i].innerHTML);return false;} 
						}
					}
				else if(visible)
					for(i=0; i<raidList.length; i++) {
							var item = raidList[i];
							var raid = SRDotDX.config.raidList[item.getAttribute("raidid")];
							if (!(typeof raid === 'undefined') && item.offsetWidth+item.offsetHeight>0){
								try {
									r.push(JSON.parse(JSON.stringify(raid)));
									r[r.length-1].ele = item
								} catch(err){console.log("[SRDotDX]::{FPX}:: error::"+err+"   raid var"+raidList[i]+raidList[i].innerHTML);return false;} 
							}
						}
				else
					for(i=0; i<raidList.length; i++) {
							var item = raidList[i];
							var raid = SRDotDX.config.raidList[item.getAttribute("raidid")];
							if (!(typeof raid === 'undefined') && item.offsetWidth+item.offsetHeight==0){
								try {
									r.push(JSON.parse(JSON.stringify(raid)));
									r[r.length-1].ele = item
								} catch(err){console.log("[SRDotDX]::{FPX}:: error::"+err+"   raid var"+raidList[i]+raidList[i].innerHTML);return false;} 
							}
						}
				return r;
			},
			GetHiddenRaids: function () {
				return this.GetAllRaids(false);
			},
			GetVisibleRaids: function () {
				return this.GetAllRaids(true);
			},
			GetUnvisitedRaids: function () {
				console.log("[SRDotDX] Getting unvisited raids (gui)");
				var r = [];
				var raidList = document.getElementById('raid_list').childNodes;
				
				for(i=0; i<raidList.length; i++) {
					var item = raidList[i];
					var raidid = item.getAttribute("raidid");
					var raid = SRDotDX.config.raidList[raidid]
					if (raid) {
						try {
							if (!raid.visited) {
								r.push(raid);
								r[r.length-1].ele = item
							}
						} catch(err){console.log("[SRDotDX]::{FPX}:: error::"+err+"   raid var"+raidList[i]+raidList[i].innerHTML);return false;} 
					}
				}
				return r;
			},
			DeleteUnvisitedRaids: function () {
				console.log("[SRDotDX] Deleting unvisited raids");
				var raids = SRDotDX.gui.GetUnvisitedRaids();
				for (i=0;i<raids.length;i++){
					var raid = raids[i];
					SRDotDX.gui.deleteRaid(raid.ele.getElementsByClassName("FPXDeleteLink")[0], raid.id, false);
				}
				SRDotDX.gui.doStatusOutput(raids.length + ' unvisited raids deleted');
			},
			DeleteHiddenRaids: function () {
				console.log("[SRDotDX] Deleting hidden raids");
				var raids = SRDotDX.gui.GetHiddenRaids();
				for(i=0;i<raids.length;i++){
					var raid = raids[i];
					SRDotDX.gui.deleteRaid(raid.ele.getElementsByClassName("FPXDeleteLink")[0], raid.id, false);
				}
				SRDotDX.gui.doStatusOutput(raids.length+' hidden raids deleted');
				console.log("[SRDotDX] Finished deleting hidden raids");
			},
			AutoJoin: false,
			AutoJoining: false,
			AutoJoinTimerArray: [],
			AutoJoinVisible: function (b, t) {
				if(typeof b === 'undefined'){
					b=!SRDotDX.gui.AutoJoin;
					document.getElementById('AutoJoinVisibleButton').value=b?"Cancel Auto Join":"Join Visible Raids";
				}
				for(i=0; i<SRDotDX.gui.AutoJoinTimerArray.length; i++){
					clearTimeout(SRDotDX.gui.AutoJoinTimerArray[i]);
				}
				SRDotDX.gui.AutoJoinTimerArray=[];
				SRDotDX.gui.AutoJoin = b;
				if(typeof b=='boolean' && b){
					console.log("[SRDotDX] Joining visible raids");
					var raids = SRDotDX.gui.GetVisibleRaids(),timer = (!(typeof t==='undefined')?t:200),ttw = SRDotDX.config.AutoJoinInterval;//make configurable
					if(raids.length > 0){
						timeFinished = (ttw*raids.length)+(new Date().getTime());
						for(i=0; i<raids.length; i++){
							var raid = raids[i];
							SRDotDX.gui.AutoJoinTimerArray[SRDotDX.gui.AutoJoinTimerArray.length]=setTimeout("if(SRDotDX.gui.AutoJoin){SRDotDX.gui.doStatusOutput('Joining "+(i+1)+" of "+raids.length+", '+timeSince("+timeFinished+",true), false);SRDotDX.gui.FPXraidLinkClickChat("+raid.id+",'"+raid.ele.firstChild.getElementsByTagName('a')[0].href+"', false)}", timer)
							timer += ttw;
						}
						SRDotDX.gui.AutoJoinTimerArray[SRDotDX.gui.AutoJoinTimerArray.length]=setTimeout("SRDotDX.reload();SRDotDX.gui.doStatusOutput('Finished Auto Joining');SRDotDX.gui.AutoJoin=false;SRDotDX.gui.AutoJoining=false;document.getElementById('AutoJoinVisibleButton').value='Join Visible Raids';", timer);//removed SRDotDX.gui.AutoJoinRepeater();
						SRDotDX.gui.AutoJoining=true;
						console.log("[SRDotDX] Joining prepared");
					}//else{
					//	console.log("[SRDotDX] No visible raids found. Checking again in "+(ttw/1000)+" seconds");
					//	SRDotDX.gui.AutoJoining=false;
					//	setTimeout("SRDotDX.gui.AutoJoinRepeater();", ttw);
					//}
				} else SRDotDX.gui.doStatusOutput('Cancelled Auto Joining');
				return b;
			},
			//AutoJoinRepeater: function () {
			//	if(SRDotDX.gui.AutoJoin){
			//		if(!SRDotDX.gui.AutoJoining){
			//			console.log("[SRDotDX] Auto joiner checking for new visible raids");
			//			SRDotDX.gui.AutoJoinVisible(true);
			//		}else setTimeout("SRDotDX.gui.AutoJoinRepeater();", 5000*60);//check every 5 minutes
			//	}
			//},
			DeleteVisibleRaids: function () {
				console.log("[SRDotDX] Deleting visible raids");
				var raids = SRDotDX.gui.GetVisibleRaids();
				for(i=0; i<raids.length; i++){
					var raid = raids[i];
					SRDotDX.gui.deleteRaid(raid.ele.getElementsByClassName("FPXDeleteLink")[0], raid.id, false);
				}
				SRDotDX.gui.doStatusOutput(raids.length + ' visible raids deleted');
				console.log("[SRDotDX] Deleting complete");
			},
			DumpRaidsToShare: function(v) {
				console.log("[SRDotDX] Dumping "+(v?'visible':'all'));
				var raids = (v?SRDotDX.gui.GetVisibleRaids():SRDotDX.gui.GetAllRaids());
				var dumptext = "!!OBJECT_IMPORT!!", el=document.getElementById('FPXRaidSpamTA');
				for(i=0; i<raids.length; i++){
					var raid = raids[i];
					var txt = raid.ele.firstChild.getElementsByTagName('a')[0].href+","+raid.timeStamp+","+raid.user+","+raid.room+";"
					dumptext += txt;
				}
				SRDotDX.gui.doStatusOutput((!v?'All ':'') + raids.length + (v?' visible':'') + ' raids dumped to share.');
				el.focus(); el.value = dumptext; el.select();
				console.log("[SRDotDX] Dumped "+(v?'visible':'all'));
				return false;
			},
			DeleteExpiredUnvisitedRaids: function() {
				console.log("[SRDotDX] Deleting expired unvisited raids");
				if (SRDotDX.config.unvisitedRaidPruningMode <= 2 && SRDotDX.config.unvisitedRaidPruningMode >= 0) {
					var raidList = document.getElementById('raid_list').childNodes;
					var pruneTime = new Date().getTime();
					var ct = 0;
					for(i=0; i<raidList.length; i+=1) {
						var item = raidList[i];	
						var raidid = item.getAttribute("raidid");
						if (SRDotDX.config.raidList[raidid]) {
							try {
								var raid = SRDotDX.config.raidList[raidid];
								var raidInfo = SRDotDX.raids[raid.boss];
								if (!raid.visited) {
									if(SRDotDX.raidSizes[raidInfo.size] && SRDotDX.raidSizes[raidInfo.size].pruneTimers && SRDotDX.raidSizes[raidInfo.size].pruneTimers[SRDotDX.config.unvisitedRaidPruningMode]) {
										var pruneTimer = SRDotDX.raidSizes[raidInfo.size].pruneTimers[SRDotDX.config.unvisitedRaidPruningMode];
										if ((pruneTime - raid.timeStamp) >= pruneTimer) {
											console.log("[SRDotDX] Deleting raid " + raidid);
											SRDotDX.gui.deleteRaid(item.getElementsByClassName("FPXDeleteLink")[0], raidid);
											ct++;
										}
									}

								}

							} catch(err){console.log("[SRDotDX]::{FPX}:: error::"+err+"   raid var"+raidList[i]+raidList[i].innerHTML);return false;} 

						}
					}
					if(ct>0)SRDotDX.gui.doStatusOutput(ct + " old unvisited raids pruned.");
				}
				// recur every 10 minutes
				setTimeout('SRDotDX.gui.DeleteExpiredUnvisitedRaids();',600000);
			},
			help: function (item) {
			},
			getElementsByAttribute: function (tagname,attr,value,ele) {
				var eles = (ele?ele.getElementsByTagName(tagname):document.getElementsByTagName(tagname));
				var result = new Array();
				for (var i=0;i<eles.length;i++) {
					if (eles[i].getAttribute("attr") == value) {
						result.push(eles[i]);
					}
				}
				return result;
			},
			toggleCollapse: function (aId, toggleDivId,text) {
				var a = document.getElementById(aId);
				var div = document.getElementById(toggleDivId);

				if (div.style.display == "block") {
					div.style.display = "none";
					a.innerHTML = text + " [+]";
				}
				else {
					div.style.display = "block";
					a.innerHTML = text + " [-]";
				}
			},
			load: function () {
				if (typeof holodeck == 'object' && typeof holodeck._tabs == 'object' && typeof holodeck._tabs.addTab == 'function') {
					SRDotDX.gui.cHTML('style').set({type: "text/css",id: 'SRDotDX_raidClass'}).text('.SRDotDX_raid{display:'+(SRDotDX.config.hideRaidLinks == true?'none !important':'block')+'}').attach('to',document.head);
					SRDotDX.gui.cHTML('style').set({type: "text/css",id: 'SRDotDX_visitedRaidClass'}).text('.SRDotDX_visitedRaid{display: '+(SRDotDX.config.hideVisitedRaids == true?'none !important':'block')+'}').attach('to',document.head);
					SRDotDX.gui.cHTML('style').set({type: "text/css",id:'SRDotDX_visitedRaidListClass'}).text('.SRDotDX_visitedRaidList{display: '+(SRDotDX.config.hideVisitedRaidsInRaidList == true?'none !important':'block')+'}').attach('to',document.head);
					SRDotDX.gui.cHTML('style').set({type: "text/css",id: 'SRDotDX_seenRaidClass'}).text('.SRDotDX_seenRaid{display: '+(SRDotDX.config.hideSeenRaids == true?'none !important':'block')+'}').attach('to',document.head);
					for (var i in SRDotDX.raids) {
						if (SRDotDX.raids.hasOwnProperty(i)) {
							var raid = SRDotDX.raids[i];
							for (j=0; j<4; j++) {
								SRDotDX.gui.cHTML('style').set({type: "text/css",id: 'SRDotDX_filteredRaidChat' + raid.id + '_' + j + 'Class'}).text('.SRDotDX_filteredRaidChat' + raid.id + '_' + j + '{display: ' + ((SRDotDX.config.getFilter(raid.id,j) == true && SRDotDX.config.filterChatLinks == true)?'none !important':'block')+'}').attach('to',document.head);
								SRDotDX.gui.cHTML('style').set({type: "text/css",id: 'SRDotDX_filteredRaidList' + raid.id + '_' + j + 'Class'}).text('.SRDotDX_filteredRaidList' + raid.id + '_' + j + '{display: ' + ((SRDotDX.config.getFilter(raid.id,j) == true && SRDotDX.config.filterRaidList == true)?'none !important':'block')+'}').attach('to',document.head);
							}
						}
					}
					
					SRDotDX.gui.cHTML('style').set({type: "text/css"}).text(" \
						a.FPXDeleteAllBtn{display:block;color:#FFFFFF;background-color:rgb(153, 0, 0);font-weight:bold;font-size:11px;width:120px;text-align:center;padding:0;padding-top:3px;padding-bottom:4px;border:1px solid #ffffff;outline:1px solid rgb(153, 0, 0);text-decoration:none;margin-left:1px;} \
						#FPXtt { position:absolute; display:block; background:url(data:image/gif;base64,R0lGODlhBQCWAIABAGZmZv///yH5BAEAAAEALAAAAAAFAJYAAAIgjG8AqaH9opy02ouz3rz7D4biSJbmiabqyrbuC8eyWgAAOw==) top left no-repeat; } \
						#FPXtttop { display:block; height:5px; margin-left:5px; background:url(data:image/gif;base64,R0lGODlhkAEFAIABAGZmZv///yH5BAEAAAEALAAAAACQAQUAAAI0hI+py+0Po5y02ouz3rz7XwWiCJbmiabqyrauOr7yTNf2jecPqff+DwwKZ4Gh8YhMKoWBAgA7) top right no-repeat; overflow:hidden; } \
						#FPXttcont { display:block; padding:2px 12px 3px 7px; margin-left:5px; background:#666; color:#fff; } \
						#FPXttbot {display:block;height:5px;margin-left:5px;background:url(data:image/gif;base64,R0lGODlhkAEFAIABAGZmZv///yH5BAEAAAEALAAAAACQAQUAAAI1hI+py+0Po5y02ouz3rz7nwXgSJbmiabqyqpiC8fyTNf27QQvzvf+DwyydDuh8YhMKm9EXQEAOw==) top right no-repeat;overflow:hidden;} \
						#kong_game_ui ul.main_tabs li#lots_tab a {width: 44px; color:white; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAwCAIAAAAOxbS1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARfSURBVFhH1Vk/SFtBGL9ot46RjI1GealkajJFBGOhdJBgEQczmmImty6COAUhS5fipDROJR0kIOJQBJNA0C1bkDxK2oBT2uBUxMl+9+7evXv33t2ZNLbpDfLeve/P777v933vyzPQbrfRyKyxkUGCgWA09/f3I4IJowkEAiOEZkSg0Ex50Qwxd32ZEllMsjbE3PVlyoUGNPs6ytBT7ELz2FC09h00btHO4WrEXquHHT4K1W14sF1lWyBqS/BaLhlLJzI9PS3YEqLroPEkOL5TgUbdbhej+UXHeedwr5XJxEtnDhyXSVurXdlpZSPEeXU726LGNr/uSxTt7qdJf+pVxpHonJ+ipVxuSQ7Hlg2vHxUzjbzgPLW7m5L7e8CboXpWis9MERMWmJfh8PpmRhodxxk+R+tbB6V2cXwjNFKKw48xungo1sAGYO3NVI7WwzwYuAZHpT03n/y9RKewamoXUl5ZOtVAGmN0kfCmsoPy76jb6n6+YWPMllDj9NxFbw8cPqrwEHLX/phRaWkrPLz+HvBY2cfGKRktdisNW9wtxSGtCCrNroLO9xYi0fJdYvfzEbJIAlnBYLBxe0GyfM5pxy4SyaJi20oxGEBZ0i4W89GigsaB/2Da0jZNTVOQP5YXjbzfEEYPjEmhKC8aDxrBivr1q3XpFdAe7wEsloRdOyqwAAMIsvgdfU3JsJN97ckEB0QeELBFBMitHo1XiFkkVvoib7/y2EUulyOevKRhUIQLhokn+x8Sn9ikvFEwjq9JWfBIHnkjisAoHoksVlthTJSFk4VNUZ6+j4hf8T2loKqWy1pdL/kIQxhPHjDfSKjbb4kRM4KWcEJnouirXh5JmE5bA1TjYwCisRks7EMHJH4V+LdBot3Pc8rQwkY2GSTbvcviQa3LRGIrW2nDPCmUm2QLRJfRsSXBayHEyVg6PrYEv+OJRELordbt08nEs+vPHz59qddvJjNrszf1qx/U95sXt9e3xsSdvQOiz1Gr0fnl0qqb4/NrmcS4CQ9iK2+jZtEydpd4HbqipryJdmXKnz3NlunohWYNZNbrZs+IxtS06dYOTsxgct4t1izbIfXTdr5tSRkTixq9HgkMssBcdbu1C1MLByF8juBECDXLJ71kdmtrYyGkPoH4O5zDFMQGYM31GG0oGDAJjow5nXGLKD8x45rlQqFQNA0NJEUvBvJiE5couUzdxuaTQRsjkDJozKrPykcVIEHuCpA8hRZFwyYgD3W6tWPAY2UfG7cQkqU2DOIraaMHacWVtkLZE5oI0mj5puwJ2eVfzqIcJskWzkoQjBedSodkpedmQ7UrlwKOXZLsQIUfWF2gdoEg42l7k3YGfCvMVdJpS023R3oqTlt/sxcLAzLcSr8mDQZLpsXvs2t+6CZscVU4n0XfTujrjN9UvH15EPw1r6L9RkF/KngHcuGIvkySefUWjTOJek+smMZJSNlfNZ0VAWaPCHvIrf9/PXgrQx99vMMo2/kN5y+czr7nW8kAAAAASUVORK5CYII=) !important;background-position: 0px -25px}\r\n \
						#kong_game_ui ul.main_tabs li#lots_tab a.active {background-position: 0px 0px;} \
						#kong_game_ui div#lots_tab_pane {padding: 8px; text-align: left;} \
						#kong_game_ui div#lots_tab_pane ul { margin: 0px; padding: 0px; list-style-type: none; position: relative;} \
						#kong_game_ui div#lots_tab_pane ul li.tab { float: left; height: 100%; } \
						#kong_game_ui div#lots_tab_pane ul li.tab div.tab_head  { font-family: Verdana, Arial, sans-serif;font-size: 10px;padding: 3px 5px 4px 5px; background-color: #c0c0c0; cursor: pointer; text-decoration: underline; margin-right: 1px; } \
						#kong_game_ui div#lots_tab_pane ul li.tab div.tab_pane  { padding: 2px 5px; background-color: #ffffff; display: none;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_head { background-color: #ffffff; cursor: default; text-decoration: none; }\
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane { position: absolute; display: block; left: 0px}\
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list {overflow-y: scroll; font-family: Verdana, Arial, sans-serif; font-size: 11px;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item {cursor: pointer; position: relative; padding: 2px; border-bottom: 1px solid #b0b0b0;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item .raid_list_item_head .link {display:none;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item .raid_list_item_head .FPXlink {display:block;width:10px;height:10px; padding-right: 5px;float: left;Background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=') no-repeat scroll left center transparent;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item.hidden {display:none;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item .raid_list_item_info {display:none;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item .raid_list_item_info hr {clear:both; margin: 5px 15px; } \
						"+(!SRDotDX.config.showRaidLink?'#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item .raid_list_item_head .RaidQuickLink{display:none;}':'') + "\
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item.active {cursor: default; background-color: #DEEAF6 !important;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item.active .raid_list_item_head .text{display:none;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item.active .raid_list_item_head .FPXtext{display:none;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item.active .raid_list_item_head .RaidQuickLink{display:none !important;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item.active .raid_list_item_head .link{display: inline-block; font-weight: bold;} \
						#kong_game_ui div#lots_tab_pane ul li.tab.active div.tab_pane #raid_list .raid_list_item.active .raid_list_item_info {display:block;} \
					").attach("to",document.head);
					var link = SRDotDX.gui.cHTML('a').set({href: '#lots_tab_pane',class: ''}).html("<span class='SRDotDX_new' style='float:right; padding-top:3px; padding-right:3px;'>(<span class='SRDotDX_NewRaidsCount'>0</span>)</span>").attach("to",SRDotDX.gui.cHTML('li').set({class: 'tab', id: 'lots_tab', onclick:'SRDotDX.gui.raidsTabClicked()'}).attach("after","game_tab").ele()).ele();

					var pane = SRDotDX.gui.cHTML('div').set({id: 'lots_tab_pane'}).html(' \
						<div class="room_name_container h6_alt mbs">DotD Extension - <span class="room_name" id="StatusOutput"></span></div> \
						<ul id="SRDotDX_tabpane_tabs"> \
							<li class="tab active"> \
								<div class="tab_head">Raids</div> \
								<div class="tab_pane"> \
									<div id="FPXRaidFilterDiv" class="collapsible_panel"> \
										<p class="panel_handle spritegame mts closed_link" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidFiltering\', this)"> <a> Raid Filtering </a> </p> \
										<div id="FPXRaidFiltering" style="display:none"> \
											<FORM name="FPXRaidFilterForm" onSubmit="return false;"> \
												<table><tr><td align="right">Boss:</td> \
												<td><select name="FPXRaidBossDifficultyFilter" tabIndex="50" onchange="SRDotDX.gui.FPXFilterRaidListByName()"> \
													<option value="0" selected>All or Any</option> \
													<option value="1">Normal</option> \
													<option value="2">Hard</option> \
													<option value="3">Legendary</option> \
													<option value="4">Nightmare</option> \
													<!--<option value="5">Insane</option> \
													<option value="6">Hell</option>--> \
												</select></td><td> <INPUT NAME="FPXRaidBossNameFilter" size="10" tabIndex="51" onkeyup="SRDotDX.gui.FPXFilterRaidListByName()"></td></tr> \
												<tr><td>Poster:</td>\
												<td><select name="FPXPostedNameSwitch" tabIndex="-1"> \
													<option value="0" selected>Contains</option> \
													<option value="1">Not Contains</option> \
												</select></td><td> <INPUT NAME="FPXPostedNameFilter" size="10" tabIndex="52" onkeyup="SRDotDX.gui.FPXFilterRaidListByName()"></td></tr> \
												<tr><td>Room:</td>\
												<td><select name="FPXRoomNameSwitch" tabIndex="-1"> \
													<option value="0" selected>Equals</option> \
													<option value="1">Not Equals</option> \
												</select></td><td> <INPUT NAME="FPXRoomNameFilter" size="10" tabIndex="53" onkeyup="SRDotDX.gui.FPXFilterRaidListByName()"></td></tr> \
												<tr><td colspan="3" align="left"><input type="checkbox" tabIndex="54" id="SRDotDX_options_hideVisitedRaidsInRaidList"> Hide visited </td></tr> \
												<!--<tr><td colspan="3" align="right"><input name="button" tabIndex="-1" type="submit" value="Search" onClick=";return false"/></td></tr>--></table> \
											</FORM> \
										</div> \
									</div> \
									<div id="FPXRaidActionsDiv" class="collapsible_panel"> \
										<p class="panel_handle spritegame mts closed_link" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidSort\', this)"> <a> Raid Sorting </a> </p> \
										<div id="FPXRaidSort" style="display:none"> \
											Sort By: \
											<select id="FPXRaidSortSelection" tabIndex="-1"> \
												<option value="Time" selected>TimeStamp</option> \
												<option value="Name">Raid Name</option> \
												<option value="Diff">Difficulty</option> \
												<option value="Id">Raid Id</option> \
											</select> \
											<select id="FPXRaidSortDirection" tabIndex="-1"> \
												<option value="asc" selected>Ascending</option> \
												<option value="desc">Descending</option> \
											</select> \
											<input type="button" onClick="SRDotDX.gui.FPXSortRaids();return false;" value="Sort"> \
											<input type="checkbox" id="SRDotDX_options_newRaidsAtTopOfRaidList"> New raids at top of raid list <br> \
										</div> \
									</div> \
									<div id="FPXRaidActionsDiv" class="collapsible_panel"> \
										<p class="panel_handle spritegame mts closed_link" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidActions\', this)"> <a> Raid Actions </a> </p> \
										<div id="FPXRaidActions" style="display:none"> \
											<hr> \
											<input name="DumpShare" tabIndex="-1" type="button" value="Dump All Raids to Share Tab" onClick="SRDotDX.gui.DumpRaidsToShare(false);return false;"/> (<a href="#" tabIndex="-1" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'All hidden and visible raids in the list will be dumped to the Share Raids tab.  You can then use the button in that tab to post them to chat, or load them into a pastebin to share.\');">?</a>) <br>\
											<input name="DumpVisible" tabIndex="-1" type="button" value="Dump Visible Raids to Share Tab" onClick="SRDotDX.gui.DumpRaidsToShare(true);return false;"/> (<a href="#" tabIndex="-1" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'All raids currently visible in the list will be dumped to the Share Raids tab.  You can then use the button in that tab to post them to chat, or load them into a pastebin to share\');">?</a>) <br>\
											<input name="QuickDump" tabIndex="-1" type="button" value="Quick Share Visible Raids" onClick="SRDotDX.gui.DumpVisibleRaidsToShare();SRDotDX.gui.FPXspamRaids();return false;"/> (<a href="#" tabIndex="-1" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'This will immediately begin posting all visible raids in the order shown.\');">?</a>) <br>\
											<input name="DeleteVisible" tabIndex="-1" type="button" value="Delete All Visible Raids" onClick="SRDotDX.gui.DeleteVisibleRaids();return false;"> (<a href="#" tabIndex="-1" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'This will delete all raids currently visible.\');">?</a>) <br>\
											<input name="DeleteHidden" tabIndex="-1" type="button" value="Delete All Hidden Raids" onClick="SRDotDX.gui.DeleteHiddenRaids();return false;"> (<a href="#" tabIndex="-1" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'This will delete all raids that are currently not visible.\');">?</a>) <br>\
											<input name="DeleteUnvisited" tabIndex="-1" type="button" value="Delete All Unvisited Raids" onClick="SRDotDX.gui.DeleteUnvisitedRaids();return false;"> (<a href="#" tabIndex="-1" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'This will delete all raids that you have not visited.\');">?</a>) <br> \
											<input name="AutoJoinVisible" id="AutoJoinVisibleButton" tabIndex="-1" type="button" value="Join Visible Raids" onClick="SRDotDX.gui.AutoJoinVisible();return false;"> \
											<!--<input name="AutoJoin" id="AutoJoinRaids" tabIndex="-1" type="checkbox" onClick="SRDotDX.gui.AutoJoinVisible(this.checked);"> Join Visible Raids -->(<a href="#" tabIndex="-1" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'This will join all visible raids by refreshing the game.  I was unable to find anything in the DotD or Kongregate ToS directly forbidding it, though have heard of people getting in trouble for using this method for joining raids.  Use at your own risk.\');">?</a>) \
											<input name="AutoJoinTimer" id="SRDotDX_options_autoJoinTimer" size="3" tabIndex="-1" type="text">Interval (ms) \
											<hr> \
										</div> \
									</div> \
									<div id="raid_list" tabIndex="-1"> \
									</div> \
								</div> \
							</li> \
							<li class="tab"> \
							<div class="tab_head">Options</div> \
									<div class="tab_pane"><br> \
									<div id="FPXRaidOptionsDiv" class="collapsible_panel"> \
										<p class="panel_handle spritegame mts opened_link" onclick="SRDotDX.gui.toggleDisplay(\'FPXRaidOptions\', this)"> <a> Raid Options </a> </p> \
										<div id="FPXRaidOptions"> \
											<hr> \
												<input type="checkbox" id="FPX_options_markVisitedRightClick"> Mark raids as visited on RightClick (<a href="#" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'When you right-click on a raid (generally, to copy and paste), that raid will be marked as visited.\');">?</a>)<br> \
												Delay(milliseconds) (<a href="#" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'Number of milliseconds to wait before marking raid link visited when it is right clicked.<br><strong>Only enabled if <i>\\\'Mark right click\\\'</i> is enabled.</strong> \');">?</a>) :: \
												<INPUT id="FPX_options_markVisitedRightClickDelay" size="8"> <br>\
												<input type="checkbox" id="SRDotDX_options_markMyRaidsVisited"> Automatically mark raids posted by me as visited <br> \
												<input type="checkbox" id="SRDotDX_options_showRaidLink"> Show raid link in raid list <br><br> \
												Unvisited raid pruning (<a href="#" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'How fast the script will automatically remove unvisited raids.  Small and Medium raids: Aggressive 1h, Moderate 2h, Slow 3h.  Large Raids: Aggressive 4h, Moderate 12h, Slow 36h.  Epic and Colossal raids: Aggressive 24h, Moderate 48h, Slow 72h.\');">?</a>)<br> \
												<input type="radio" id="FPX_options_unvisitedPruningAggressive" name="unvisitedPruning" value="Aggressive"/>Aggressive&nbsp;&nbsp; \
												<input type="radio" id="FPX_options_unvisitedPruningModerate" name="unvisitedPruning" value="Moderate"/>Moderate&nbsp;&nbsp; \
												<input type="radio" id="FPX_options_unvisitedPruningSlow" name="unvisitedPruning" value="Slow"/>Slow&nbsp;&nbsp; \
												<input type="radio" id="FPX_options_unvisitedPruningNone" name="unvisitedPruning" value="None"/>None&nbsp;&nbsp;<br> \
												<input type="checkbox" id="FPX_options_useMaxRaidCount"> enable max raid count <input type="text" id="FPX_options_maxRaidCount" size="5">(<a href="#" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'This will specify the maximum number of raids to store in the script. Once this number is reached, it will automatically purge the oldest raid as a new one is added.  Lowering this number could improve issues like shockwave crashes, etc.\');">?</a>)<br> \
												<a class="FPXDeleteAllBtn" href="#" onclick="SRDotDX.gui.FPXdeleteAllRaids();return false;">Delete All Raids</a> \ \
											<hr> \
										</div> \
									</div> \
									<div id="FPXChatOptionsDiv" class="open_link"> \
										<p class="panel_handle spritegame mts opened_link" onclick="SRDotDX.gui.toggleDisplay(\'FPXChatOptions\', this)"> <a> Chat Options </a> </p> \
										<div id="FPXChatOptions"> \
											<hr> \
											<input type="checkbox" id="SRDotDX_options_autoImportPaste"> Auto Import pastebins <br> \
											<input type="checkbox" id="SRDotDX_options_hideRaidLinks"> Hide all raid links in chat <br> \
											<input type="checkbox" id="SRDotDX_options_hideSeenRaids"> Hide seen raids in chat <br> \
											<input type="checkbox" id="SRDotDX_options_hideVisitedRaids"> Hide visited raids in chat <br> \
											<input type="checkbox" id="FPX_options_displayLinkImg"> Display icon beside raid (refresh req.) (<a href="#" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'Show a link Icon (\
												<img src=\\\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAVklEQVR4Xn3PgQkAMQhDUXfqTu7kTtkpd5RA8AInfArtQ2iRXFWT2QedAfttj2FsPIOE1eCOlEuoWWjgzYaB/IkeGOrxXhqB+uA9Bfcm0lAZuh+YIeAD+cAqSz4kCMUAAAAASUVORK5CYII=\\\'/> ) next to the boss name Inside the raid list.<br><strong>This may cause script to become excessively laggy as the list becomes larger.</strong>\');">?</a>)<br> \ \
											<hr><input type="checkbox" id="SRDotDX_options_formatRaids"> Enable Raid Link Formatting (<a href="#" onclick="return false;" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'Set formatting options for raid links posted in chat.<br><strong>See the userscript page for a list of all formatting options.</strong> \');">?</a>)<br><br> \
											<textarea id="SRDotDX_options_raidLinkFormat"></textarea> \
											<hr> \
										</div> \
									</div> \
								</div> \
							</li> \
							<li class="tab"> \
								<div class="tab_head" id="FPXShareTab">Share</div> \
								<div class="tab_pane"> \
								<div id="FPXRaidSpamDiv"> \
										<FORM name="FPXRaidSpamForm" onSubmit="return false"> \
											<div id="FPXShareDiv" class="collapsible_panel"> \
												<p class="panel_handle spritegame mts opened_link" onclick="SRDotDX.gui.toggleDisplay(\'FPXShare\', this)"> <a> Sharing </a> </p> \
												<div id="FPXShare"> <hr>\
													<input name="Submit"  type="submit" tabIndex="-1" value="Post Links to Chat" onClick="SRDotDX.gui.FPXspamRaids();return false;"/> \
													<input name="Submit1" type="submit" disabled="disabled" tabIndex="-1" value="Cancel Posting" onClick="SRDotDX.gui.FPXStopPosting();return false;"/><br> \
													<input type="checkbox" id="SRDotDX_options_formatLinkOutput"> Enable simple formatting for link spam <br> \
													<input type="checkbox" id="SRDotDX_options_prettyPost"> Enable counting and sorting for link spam <br> \
													<input type="checkbox" id="SRDotDX_options_whisperRaids"> Whisper to <input type="text" id="SRDotDX_options_whisperTo"> <br>\
													<!--<input type="checkbox" id="SRDotDX_options_autoWhipser"> Auto Whisper <br>--> \
												<hr></div> \
											</div> \
											<div id="FPXShareDiv" class="collapsible_panel"> \
												<p class="panel_handle spritegame mts opened_link" onclick="SRDotDX.gui.toggleDisplay(\'FPXImport\', this)"> <a> Import </a> </p> \
												<div id="FPXImport"> <hr>\
													<input name="Submit2"  type="submit" tabIndex="-1" value="Import to Raid Tab" onClick="SRDotDX.gui.FPXimportRaids();return false;"/> (<a href="#" onclick="return false" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'This will add any new raids in the share box below to the raid tab.\');">?</a>)\
													<input name="Submit3"  type="submit" tabIndex="-1" value="Delete and Import" onClick="SRDotDX.gui.FPXdeleteAllRaids();SRDotDX.gui.FPXimportRaids();return false;"/>(<a href="#" onclick="return false" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'This will delete all raids on the raid tab and refresh the data with any raids in the share box below.\');">?</a>)<br> \
													<!--<input name="Submit4" type="submit" tabIndex="-1" value="Import Pastebin" onClick="SRDotDX.gui.FPXImportPasteBin();return false;"> <input type="text" id="SRDotDX_FPX_ImportPastebin">(<a href="#" onclick="return false" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'This is currently only working in chrome.  Before this is fixed, Firefox users should simply navigate to the pastebin url, copy the raw data, and paste it into box below and import the raids. \');">?</a>)<br> -->\
													<input type="checkbox" id="SRDotDX_options_markImportedRaidsVisited"> Mark imported raids visited <br> \
												<hr></div> \
											</div> \
											<textarea id="FPXRaidSpamTA" name="FPXRaidSpamInput" ></textarea><br> \
										</FORM> \
									</div> \
								</div> \
							</li> \
							<li class="tab"> \
								<div class="tab_head">Filtering</div> \
								<div class="tab_pane"> \
									<div id="FPXRaidFilterDiv"> \
										<div id="FPXRaidFilterWhereDiv"> \
											<input type="checkbox" id="SRDotDX_options_perRaidFilterLinks">Activate filtering on raid links (<a href="#" onclick="return false" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'All raids unchecked below will be hidden when linked in chat, in addition to all other link hiding options\');">?</a>)<br> \
											<input type="checkbox" id="SRDotDX_options_perRaidFilterRaidList">Activate filtering on raid list tab (<a href="#" onclick="return false" onmouseout="FPX.tooltip.hide();" onmouseover="FPX.tooltip.show(\'All raids unchecked below will be hidden in the Raids tab, in addition to the search options specified there\');">?</a>)<br> \
										</div> \
										<hr> \
										<div id="FPXRaidFilterWhatDiv"> \
											<div> \
												<div> \
													<a id="FPXPersonalAToggle" href="#" onclick="SRDotDX.gui.toggleCollapse(\'FPXPersonalAToggle\',\'FPXRaidTablePersonal\',\'Personal Raids\');return false;">Personal Raids [+]</a><br> \
												</div> \
												<table id="FPXRaidTablePersonal" cellspacing="3" style="display:none"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatPersonal"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div> \
												<div> \
													<a id="FPXSmallAToggle" href="#" onclick="SRDotDX.gui.toggleCollapse(\'FPXSmallAToggle\',\'FPXRaidTableSmall\',\'Small Raids\');return false;">Small Raids [+]</a><br> \
												</div> \
												<table id="FPXRaidTableSmall" style="display:none"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatSmall"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div> \
												<div> \
													<a id="FPXMediumAToggle" href="#" onclick="SRDotDX.gui.toggleCollapse(\'FPXMediumAToggle\',\'FPXRaidTableMedium\',\'Medium Raids\');return false;">Medium Raids [+]</a><br> \
												</div> \
												<table id="FPXRaidTableMedium" style="display:none"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatMedium"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div> \
												<div> \
													<a id="FPXLargeAToggle" href="#" onclick="SRDotDX.gui.toggleCollapse(\'FPXLargeAToggle\',\'FPXRaidTableLarge\',\'Large Raids\');return false;">Large Raids [+]</a><br> \
												</div> \
												<table id="FPXRaidTableLarge" style="display:none"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatLarge"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div> \
												<div> \
													<a id="FPXEpicAToggle" href="#" onclick="SRDotDX.gui.toggleCollapse(\'FPXEpicAToggle\',\'FPXRaidTableEpic\',\'Epic Raids\');return false;">Epic Raids [+]</a><br> \
												</div> \
												<table id="FPXRaidTableEpic" style="display:none"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatEpic"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div> \
												<div> \
													<a id="FPXColossalAToggle" href="#" onclick="SRDotDX.gui.toggleCollapse(\'FPXColossalAToggle\',\'FPXRaidTableColossal\',\'Colossal Raids\');return false;">Colossal Raids [+]</a><br> \
												</div> \
												<table id="FPXRaidTableColossal" style="display:none"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatColossal"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div> \
												<div> \
													<a id="FPXGuildAToggle" href="#" onclick="SRDotDX.gui.toggleCollapse(\'FPXGuildAToggle\',\'FPXRaidTableGuild\',\'Guild Raids\');return false;">Guild Raids [+]</a><br> \
												</div> \
												<table id="FPXRaidTableGuild" style="display:none"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatGuild"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
											<div> \
												<div> \
													<a id="FPXSpecialAToggle" href="#" onclick="SRDotDX.gui.toggleCollapse(\'FPXSpecialAToggle\',\'FPXRaidTableSpecial\',\'Special Raids\');return false;">Special Raids [+]</a><br> \
												</div> \
												<table id="FPXRaidTableSpecial" style="display:none"> \
													<col width="180"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><col width="20"/><thead><tr><th>Raid</th><th>N</th><th>H</th><th>L</th><th>NM</th><th>All</th></tr></thead> \
													<tbody id="FPXRaidFilterWhatSpecial"> \
														<!-- Dynamic content --> \
													</tbody> \
												</table> \
											</div> \
										</div> \
										<iframe id="SRDotDX_pastebin" style="display:none"></iframe> \
									</div> \
								</div> \
							</li> \
							<!-- <li class="tab"> \
								<div class="tab_head">Help</div> \
								<div class="tab_pane">Do I need text too?</div> \
							</li> --> \
						</ul> \
					').attach("to",'kong_game_ui').ele();

					pane.style.height = document.getElementById("chat_tab_pane").style.height;
					var e = pane.getElementsByClassName("tab_head")
					for (var i = 0;i<e.length;i++) {
						e[i].addEventListener("click",function(){
							if (!/\bactive\b/i.test(this.className)) {
								var e = document.getElementById("lots_tab_pane").getElementsByTagName("li");
								for (var i = 0;i<e.length;i++) {
									if (e[i].getAttribute("class").indexOf("active") > -1) e[i].className = e[i].className.replace(/ active$/g,"");
								}
								(this.parentNode).className += " active";
							}
						});
					}
					holodeck._tabs.addTab(link);

					var e = pane.getElementsByClassName("tab_pane");
					var w = pane.offsetWidth - 24;
					var h = pane.offsetHeight - e[0].offsetTop - 36;
					for (var i = 0;i<e.length;i++) {
						e[i].style.width = w + "px";
						e[i].style.height = h + "px";
					}

					//spam tab
					var FPXimpSpam= SRDotDX.gui.cHTML('#FPXRaidSpamTA');
					FPXimpSpam.ele().style.width = e[0].offsetWidth - 12 + "px";
					FPXimpSpam.ele().style.height = (h - 300) + "px";
					var FPXSpamText="Paste raid and/or pastebin links here to share or import\n\nLinks must be comma (,) separated.";
					FPXimpSpam.ele().value=FPXSpamText;
					FPXimpSpam.ele().addEventListener("blur",function() {
						if (this.value == "") {
							this.value = FPXSpamText;
						}
					});
					FPXimpSpam.ele().addEventListener("focus",function() {
						if (this.value == FPXSpamText) {
							this.value = "";
						}
					});
					
					/*var FPXimpPB = SRDotDX.gui.cHTML('#SRDotDX_FPX_ImportPastebin');
					var FPXimpText = "Enter pastebin url";
					FPXimpPB.ele().value=FPXimpText;
					FPXimpPB.ele().addEventListener("blur",function() {
						if (this.value == "") {
							this.value = FPXimpText;
						}
					});
					FPXimpPB.ele().addEventListener("focus",function() {
						if (this.value == FPXimpText) {
							this.value = "";
						}
					});*/

					// Raids Tab
					var raid_list = document.getElementById('raid_list');
					raid_list.style.height = (h - raid_list.offsetTop -3) + "px";
					SRDotDX.gui.loadRaidList();

					//raidlist global click listener
					raid_list.addEventListener("mouseup",function(event) {
						SRDotDX.gui.FPXraidListMouseDown(event);
					},false);
					raid_list.addEventListener("click",function(e) {
						e.preventDefault();
						e.stopPropagation();
						return false;
					},false);
					
					//options tab
					var FPXoptsMarkRightClick = SRDotDX.gui.cHTML('#FPX_options_markVisitedRightClick');
					var FPXoptsMarkRightClickDelay = SRDotDX.gui.cHTML('#FPX_options_markVisitedRightClickDelay');
					var FPXoptsDispLinkIcon = SRDotDX.gui.cHTML('#FPX_options_displayLinkImg');
					var optsFormatRaids = SRDotDX.gui.cHTML('#SRDotDX_options_formatRaids');
					var optsRaidFormat = SRDotDX.gui.cHTML('#SRDotDX_options_raidLinkFormat');
					var optsHideARaids = SRDotDX.gui.cHTML('#SRDotDX_options_hideRaidLinks');
					var optsHideSRaids = SRDotDX.gui.cHTML('#SRDotDX_options_hideSeenRaids');
					var optsHideVRaids = SRDotDX.gui.cHTML('#SRDotDX_options_hideVisitedRaids');
					var optsAutoJoinInterval = SRDotDX.gui.cHTML('#SRDotDX_options_autoJoinTimer');
					var optsShowRaidLink = SRDotDX.gui.cHTML('#SRDotDX_options_showRaidLink');
					var optsHideVRaidsList = SRDotDX.gui.cHTML('#SRDotDX_options_hideVisitedRaidsInRaidList');
					var optsWhisperToCheck = SRDotDX.gui.cHTML('#SRDotDX_options_whisperRaids');
					var optsMarkImportedVisited = SRDotDX.gui.cHTML('#SRDotDX_options_markImportedRaidsVisited');
					var optsWhisperTo = SRDotDX.gui.cHTML('#SRDotDX_options_whisperTo');
					var optsMarkMyRaidsVisited = SRDotDX.gui.cHTML('#SRDotDX_options_markMyRaidsVisited');
					var optsUseMaxRaidCount = SRDotDX.gui.cHTML('#FPX_options_useMaxRaidCount');
					var optsMaxRaidCount = SRDotDX.gui.cHTML('#FPX_options_maxRaidCount');
					var optsNewRaidsAtTopOfRaidList = SRDotDX.gui.cHTML('#SRDotDX_options_newRaidsAtTopOfRaidList');
					var optsFormatLinkOutput = SRDotDX.gui.cHTML('#SRDotDX_options_formatLinkOutput');
					var optsPrettyPost = SRDotDX.gui.cHTML('#SRDotDX_options_prettyPost');
					var optsAutoImportPaste = SRDotDX.gui.cHTML('#SRDotDX_options_autoImportPaste');
					var rbUnvisitedPruningAggressive = SRDotDX.gui.cHTML('#FPX_options_unvisitedPruningAggressive');
					var rbUnvisitedPruningModerate = SRDotDX.gui.cHTML('#FPX_options_unvisitedPruningModerate');
					var rbUnvisitedPruningSlow = SRDotDX.gui.cHTML('#FPX_options_unvisitedPruningSlow');
					var rbUnvisitedPruningNone = SRDotDX.gui.cHTML('#FPX_options_unvisitedPruningNone');
					if ((SRDotDX.config.AutoJoinInterval||'')!='') { optsAutoJoinInterval.ele().value = SRDotDX.config.AutoJoinInterval }
					if (SRDotDX.config.FPXmarkRightClick) {	FPXoptsMarkRightClick.ele().checked = 'checked'}
					if (SRDotDX.config.FPXdisplayListImgLink) {	FPXoptsDispLinkIcon.ele().checked = 'checked'}
					if (SRDotDX.config.formatRaidLinks) {	optsFormatRaids.ele().checked = 'checked'}
					if (SRDotDX.config.markMyRaidsVisted) { optsMarkMyRaidsVisited.ele().checked = 'checked' }
					if (SRDotDX.config.showRaidLink) { optsShowRaidLink.ele().checked = 'checked';}
					if (SRDotDX.config.formatLinkOutput) { optsFormatLinkOutput.ele().checked = 'checked'; optsPrettyPost.ele().disabled=true;}
					if (SRDotDX.config.prettyPost) { optsPrettyPost.ele().checked='checked'; optsFormatLinkOutput.ele().disabled=true;}
					if (SRDotDX.config.markImportedVisited) { optsMarkImportedVisited.ele().checked = 'checked'; }
					if (SRDotDX.config.whisperSpam) { optsWhisperToCheck.ele().checked = 'checked'; }
					if ((SRDotDX.config.whisperTo||'')!='') { optsWhisperTo.ele().value = SRDotDX.config.whisperTo; }
					if (SRDotDX.config.useMaxRaidCount) { optsUseMaxRaidCount.ele().checked = 'checked'; }
					if (SRDotDX.config.maxRaidCount>0) { optsMaxRaidCount.ele().value = SRDotDX.config.maxRaidCount; }
					if (SRDotDX.config.autoImportPaste) { optsAutoImportPaste.ele().checked = 'checked'; }
					else { optsRaidFormat.ele().disabled = 'disabled' }
		
					if (SRDotDX.config.unvisitedRaidPruningMode == 0) {
						rbUnvisitedPruningAggressive.ele().checked = true;
					} else if (SRDotDX.config.unvisitedRaidPruningMode == 1) {
						rbUnvisitedPruningModerate.ele().checked = true;
					} else if (SRDotDX.config.unvisitedRaidPruningMode == 2) {
						rbUnvisitedPruningSlow.ele().checked = true;
					} else if (SRDotDX.config.unvisitedRaidPruningMode == 3) {
						rbUnvisitedPruningNone.ele().checked = true;
					}

					FPXoptsMarkRightClickDelay.ele().value = SRDotDX.config.FPXoptsMarkRightClickDelay;
					document.getElementById('FPX_options_markVisitedRightClickDelay').disabled = !SRDotDX.config.FPXmarkRightClick;
					optsRaidFormat.ele().value = SRDotDX.config.raidLinkFormat;
					optsRaidFormat.ele().style.width = e[0].offsetWidth - 12 + "px";
					if (SRDotDX.config.hideSeenRaids) {optsHideSRaids.ele().checked = 'checked'}
					if (SRDotDX.config.hideVisitedRaids) {optsHideVRaids.ele().checked = 'checked'}
					if (SRDotDX.config.hideVisitedRaidsInRaidList) { optsHideVRaidsList.ele().checked = 'checked'}
					if (SRDotDX.config.hideRaidLinks) {
						optsHideARaids.ele().checked = true;
						optsHideVRaids.ele().disabled = true;
						optsHideSRaids.ele().disabled = true;
					}
					if (SRDotDX.config.newRaidsAtTopOfRaidList) { optsNewRaidsAtTopOfRaidList.ele().checked = 'checked'}
					
					optsAutoImportPaste.ele().addEventListener('click', function (){
						SRDotDX.config.autoImportPaste = this.checked;
					});
					optsAutoJoinInterval.ele().addEventListener('change', function (){
						if(isNumber(this.value)) SRDotDX.config.AutoJoinInterval = parseInt(this.value);
						else SRDotDX.gui.errorMessage('Interval must be a number');
					});
					optsMaxRaidCount.ele().addEventListener('change', function (){
						if(isNumber(this.value)) SRDotDX.config.maxRaidCount = parseInt(this.value);
						else SRDotDX.gui.errorMessage('Raid count must be a number');
					});
					
					optsUseMaxRaidCount.ele().addEventListener('click', function (){
						SRDotDX.config.useMaxRaidCount = this.checked;
					});
					
					optsPrettyPost.ele().addEventListener('click', function(){
						SRDotDX.config.prettyPost = this.checked;
						if(this.checked){
							document.getElementById("SRDotDX_options_formatLinkOutput").checked=false;
							SRDotDX.config.formatLinkOutput = false;
						}
						document.getElementById("SRDotDX_options_formatLinkOutput").disabled=this.checked;
					});
					
					optsMarkImportedVisited.ele().addEventListener("click", function() {
						SRDotDX.config.markImportedVisited = this.checked;
					});
					
					optsWhisperToCheck.ele().addEventListener("click", function(){
						SRDotDX.config.whisperSpam = this.checked;
					});
					
					optsWhisperTo.ele().addEventListener("change", function(){
						console.log("[SRDotDX] Whisper person changed to " + this.value);
						SRDotDX.config.whisperTo = this.value;
					});
					optsFormatLinkOutput.ele().addEventListener("click", function(){
						SRDotDX.config.formatLinkOutput = this.checked;
						if(this.checked){
							document.getElementById("SRDotDX_options_prettyPost").checked=false;
							document.getElementById("SRDotDX_options_prettyPost").disabled=true;
							SRDotDX.config.prettyPost = false;
						}
						document.getElementById("SRDotDX_options_prettyPost").disabled=this.checked;
					});
					
					optsShowRaidLink.ele().addEventListener("click", function() {
						SRDotDX.config.showRaidLink = this.checked;
						var els = document.getElementsByClassName("RaidQuickLink");
						for(var i=0; i<els.length; i++){
							els[i].style.display = (this.checked?'inline':'none');
						}
					});
					
					optsMarkMyRaidsVisited.ele().addEventListener("click", function() {
						SRDotDX.config.markMyRaidsVisted = this.checked;
					});
					FPXoptsMarkRightClick.ele().addEventListener("click",function() {
						SRDotDX.config.FPXmarkRightClick = this.checked;
						document.getElementById('FPX_options_markVisitedRightClickDelay').disabled = !SRDotDX.config.FPXmarkRightClick;
					
					},false);
					FPXoptsDispLinkIcon.ele().addEventListener("click",function() {
						SRDotDX.config.FPXdisplayListImgLink = this.checked;
						console.log("[SRDotDX]::{FPX}::FPXdisplayListImgLink="+SRDotDX.config.FPXdisplayListImgLink);
					},true);
					FPXoptsMarkRightClickDelay.ele().addEventListener("blur",function() {
						if (/^\d+$/ig.test(this.value)) {
							SRDotDX.config.FPXoptsMarkRightClickDelay = parseInt(this.value);
						}
						else {
							this.value = SRDotDX.config.FPXoptsMarkRightClickDelay;
						}
					});
					optsRaidFormat.ele().addEventListener("blur",function() {
						if (this.value != "") {
							SRDotDX.config.raidLinkFormat = this.value;
						}
						else {
							this.value = SRDotDX.config.raidLinkFormat;
						}
					});
					optsFormatRaids.ele().addEventListener("click",function() {
						document.getElementById('SRDotDX_options_raidLinkFormat').disabled = (this.checked == true?false:true);
						SRDotDX.config.formatRaidLinks = this.checked;
					},true);
					optsHideARaids.ele().addEventListener("click",function() {
						document.getElementById('SRDotDX_options_hideVisitedRaids').disabled = this.checked;
						document.getElementById('SRDotDX_options_hideSeenRaids').disabled = this.checked;
						SRDotDX.config.hideRaidLinks = this.checked;
						SRDotDX.gui.toggleCSS({id: "SRDotDX_raidClass", cls:".SRDotDX_raid{display: "+(this.checked == true?'none !important':'block')+"}"})
					},true);
					optsHideSRaids.ele().addEventListener("click",function() {
						SRDotDX.config.hideSeenRaids = this.checked;
						SRDotDX.gui.toggleCSS({id: "SRDotDX_seenRaidClass", cls:".SRDotDX_seenRaid{display: "+(this.checked == true?'none !important':'block')+"}"})
					},true);
					optsHideVRaids.ele().addEventListener("click",function() {
						SRDotDX.config.hideVisitedRaids = this.checked;
						//FPX::FPX_options_markVisitedRightClickDelay disable
						SRDotDX.gui.toggleCSS({id: "SRDotDX_visitedRaidClass", cls:".SRDotDX_visitedRaid{display: "+(this.checked == true?'none !important':'block')+"}"})
					},true);
					optsHideVRaidsList.ele().addEventListener("click",function() {
						SRDotDX.config.hideVisitedRaidsInRaidList = this.checked;
						SRDotDX.gui.toggleCSS({id: "SRDotDX_visitedRaidListClass", cls:".SRDotDX_visitedRaidList{display:"+(this.checked == true?'none !important':'block')+"}"})
					},true);
					optsNewRaidsAtTopOfRaidList.ele().addEventListener("click",function() {
						SRDotDX.config.newRaidsAtTopOfRaidList = this.checked;
					},true);

					rbUnvisitedPruningAggressive.ele().addEventListener("click",function() {
						SRDotDX.config.unvisitedRaidPruningMode = 0;
					},true);

					rbUnvisitedPruningModerate.ele().addEventListener("click",function() {
						SRDotDX.config.unvisitedRaidPruningMode = 1;
					},true);

					rbUnvisitedPruningSlow.ele().addEventListener("click",function() {
						SRDotDX.config.unvisitedRaidPruningMode = 2;
					},true);

					rbUnvisitedPruningNone.ele().addEventListener("click",function() {
						SRDotDX.config.unvisitedRaidPruningMode = 3;
					},true);

					// Filtering tab					
					for (var i in SRDotDX.raids) {
						if (SRDotDX.raids.hasOwnProperty(i)) {
							var raid = SRDotDX.raids[i];

							var parentTableId = 'FPX_options_cbs_' + raid.id;
							var parentTable = SRDotDX.gui.cHTML('tr').set({id: parentTableId}).html(' \
								<td>' + raid.name + '</td> \
								<td><input type="checkbox" id="cb_filter_' + raid.id + '_0' + '"/></td> \
								<td><input type="checkbox" id="cb_filter_' + raid.id + '_1' + '"/></td> \
								<td><input type="checkbox" id="cb_filter_' + raid.id + '_2' + '"/></td> \
								<td><input type="checkbox" id="cb_filter_' + raid.id + '_3' + '"/></td> \
								<td><input type="checkbox" id="cb_filter_' + raid.id + '_all' + '"/></td>');

							if (raid.size == 1) {
								parentTable.attach('to','FPXRaidFilterWhatPersonal');
							} else if (raid.stat == 'H' || raid.stat == 'h') {
								parentTable.attach('to','FPXRaidFilterWhatGuild');
							} else if (raid.size == 10 || raid.size == 13) {
								parentTable.attach('to','FPXRaidFilterWhatSmall');
							} else if (raid.size == 50) {
								parentTable.attach('to','FPXRaidFilterWhatMedium');
							} else if (raid.size == 100) {
								parentTable.attach('to','FPXRaidFilterWhatLarge');
							} else if (raid.size == 250) {
								parentTable.attach('to','FPXRaidFilterWhatEpic');
							} else if (raid.size == 500) {
								parentTable.attach('to','FPXRaidFilterWhatColossal');
							} else {
								parentTable.attach('to','FPXRaidFilterWhatSpecial');
							}

							
							for (var j=0; j<4; j++) {
								var cb_id = "cb_filter_" + raid.id + '_' + j;
								var is_checked = (SRDotDX.config.getFilter(raid.id,j) == true ? false : true);
								var cb = SRDotDX.gui.cHTML('#' + cb_id);	
								cb.ele().checked = is_checked;

								cb.ele().addEventListener("click",function() {
									var raidid = "";
									var diffIndex = "";
									var reg = /cb_filter_([0-9a-z_]+)_([0-9])/i;
									if ((i = reg.exec(this.id)) != null) {
										raidid = i[1];
										diffIndex = parseInt(i[2]);
									}
									SRDotDX.config.setFilter(raidid,diffIndex,!this.checked);
									SRDotDX.gui.toggleCSS({id: "SRDotDX_filteredRaidChat" + raidid + '_' + diffIndex + "Class", 
										cls:".SRDotDX_filteredRaidChat" + raidid + '_' + diffIndex + "{display: "+((this.checked==false && SRDotDX.config.filterChatLinks)?'none !important':'block')+"}"});
									SRDotDX.gui.toggleCSS({id: "SRDotDX_filteredRaidList" + raidid + '_' + diffIndex + "Class", 
										cls:".SRDotDX_filteredRaidList" + raidid + '_' + diffIndex + "{display: "+((this.checked==false && SRDotDX.config.filterRaidList)?'none !important':'block')+"}"});
							
									var f1 = SRDotDX.config.getFilter(raidid,0);
									var f2 = SRDotDX.config.getFilter(raidid,1);
									var f3 = SRDotDX.config.getFilter(raidid,2);
									var f4 = SRDotDX.config.getFilter(raidid,3);

									var cb_all_id = "cb_filter_" + raidid + '_all';
									
									if ((!f1 && !f2 && !f3 && !f4) || (f1 && f2 && f3 && f4)) {
										var cb = SRDotDX.gui.cHTML('#' + cb_all_id);
										cb.ele().checked = this.checked;
									} 


								},true);	
							}

							var all_cb_id = "cb_filter_" + raid.id + "_all";
							var is_checked = (SRDotDX.config.getFilter(raid.id,0) == true && SRDotDX.config.getFilter(raid.id,1) == true && SRDotDX.config.getFilter(raid.id,2) == true && SRDotDX.config.getFilter(raid.id,3) == true) ? false : true;
							var cb = SRDotDX.gui.cHTML('#' + all_cb_id);
							cb.ele().checked = is_checked;

							cb.ele().addEventListener("click",function() {
								var reg = /cb_filter_([0-9a-z_]+)_all/i;
								var raidid = "";
								if ((i = reg.exec(this.id)) != null) {
									raidid = i[1];
								}

								for (var j=0;j<4;j++) {
									var cb_id = "cb_filter_" + raidid + '_' + j;
									var subcb = SRDotDX.gui.cHTML('#' + cb_id);
									subcb.ele().checked = this.checked;
									SRDotDX.config.setFilter(raidid,j,!this.checked);
																												SRDotDX.gui.toggleCSS({id: "SRDotDX_filteredRaidChat" + raidid + '_' + j + "Class", 
										cls:".SRDotDX_filteredRaidChat" + raidid + '_' + j + "{display: "+((this.checked==false && SRDotDX.config.filterChatLinks)?'none !important':'block')+"}"});
									SRDotDX.gui.toggleCSS({id: "SRDotDX_filteredRaidList" + raidid + '_' + j + "Class", 
										cls:".SRDotDX_filteredRaidList" + raidid + '_' + j + "{display: "+((this.checked==false && SRDotDX.config.filterRaidList)?'none !important':'block')+"}"});
								}

							},true);					
						}
					}

					var filterChatCb = SRDotDX.gui.cHTML('#SRDotDX_options_perRaidFilterLinks');
					filterChatCb.ele().checked = SRDotDX.config.filterChatLinks;
					filterChatCb.ele().addEventListener("click",function() {
						SRDotDX.config.filterChatLinks = this.checked;			

						for (var i in SRDotDX.raids) {
							if (SRDotDX.raids.hasOwnProperty(i)) {
								var raid = SRDotDX.raids[i];

								for (var j=0; j<4; j++) {
									SRDotDX.gui.toggleCSS({id: "SRDotDX_filteredRaidChat" + raid.id + '_' + j + "Class",
										cls:".SRDotDX_filteredRaidChat" + raid.id + '_' + j + "{display: "+((SRDotDX.config.getFilter(raid.id,j)==true && SRDotDX.config.filterChatLinks)?'none !important':'block')+"}"});
								}
							}
						}

					},true);

					var filterListCb = SRDotDX.gui.cHTML('#SRDotDX_options_perRaidFilterRaidList');
					filterListCb.ele().checked = SRDotDX.config.filterRaidList;
					filterListCb.ele().addEventListener("click",function() {
						SRDotDX.config.filterRaidList = this.checked;			

						for (var i in SRDotDX.raids) {
							if (SRDotDX.raids.hasOwnProperty(i)) {
								var raid = SRDotDX.raids[i];

								for (var j=0; j<4; j++) {
									SRDotDX.gui.toggleCSS({id: "SRDotDX_filteredRaidList" + raid.id + '_' + j + "Class",
										cls:".SRDotDX_filteredRaidList" + raid.id + '_' + j + "{display: "+((SRDotDX.config.getFilter(raid.id,j)==true && SRDotDX.config.filterRaidList)?'none !important':'block')+"}"});
								}
							}
						}

					},true);		

					SRDotDX.gui.cHTML('li').set({
						class: 'spritegame'
					}).html("<a href=\"http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons\" onclick=\"SRDotDX.reload(); return false;\">Reload Game</a>").attach("after","get_kreds_link");

					// Start raid pruning 10 seconds after loading completion
					setTimeout('SRDotDX.gui.DeleteExpiredUnvisitedRaids(); SRDotDX.purge();',10000);

					console.log("[SRDotDX] Loading is complete.");
				}
				else {setTimeout(SRDotDX.gui.load,5)}
				SRDotDX.gui.doStatusOutput('Loaded successfully');
			},
			loadRaidList: function () {
				var i = document.getElementById("raid_list");
				while (i.hasChildNodes() && i.childNodes.length > 0) {
					i.removeChild(i.firstChild);
				}
				for (var a in SRDotDX.config.raidList) {
					if (SRDotDX.config.raidList.hasOwnProperty(a)) {
						SRDotDX.gui.addRaid(a);
					}
				}
			},
			loadPasteList: function () {//todo after gui
				
			},
			FPXraidLinkClickRaidList: function (ele,isRightClick, isCopy) {
				if(!isRightClick){
					console.log("[SRDotDX] FPXraidLinkClickRaidList");
					SRDotDX.loadRaid(ele.href);
				}
				else if(document.getElementById('FPX_options_markVisitedRightClick').checked){
					var id= ele.parentNode.parentNode.getAttribute("raidid");	
					SRDotDX.config.raidList[id].visited = true;
					SRDotDX.gui.toggleRaid('visited',id,true);				
					SRDotDX.gui.raidListItemUpdate(id);
				}
			},
			FPXraidLinkClickChat: function (id,link,isRightClick) {
				if(!isRightClick){
					console.log("[SRDotDX] FPXraidLinkClickChat");
					SRDotDX.loadRaid(link);
				}
				else if(SRDotDX.config.FPXmarkRightClick){
					SRDotDX.config.raidList[id].visited = true;
					SRDotDX.gui.toggleRaid('visited',id,true);				
					SRDotDX.gui.raidListItemUpdate(id);
				}
			},
			FPXraidListMouseDown: function (e) {
				e.preventDefault();
				
				var classtype=e.element().className;
				e = e || window.event;
				e.stopPropagation();
				console.log("[SRDotDX]::{FPX}:: Clicked on::"+classtype+"::"+e.which);
				if(e.which == 1){
					if(classtype == "raid_list_item_head"){
						var con = document.getElementById("raid_list").getElementsByClassName("active");
						if (con.length == 1) con[0].className = con[0].className.replace(/ active/gi,"");
						e.element().parentNode.className += " active";
						SRDotDX.gui.raidListItemUpdateTimeSince(e.element().parentNode.getAttribute("raidid"));
						return false;
					}else if(classtype == "FPXtext"){
						var con = document.getElementById("raid_list").getElementsByClassName("active");
						if (con.length == 1) con[0].className = con[0].className.replace(/ active/gi,"");
						e.element().parentNode.parentNode.className += " active";
						SRDotDX.gui.raidListItemUpdateTimeSince(e.element().parentNode.parentNode.getAttribute("raidid"));
						return false;
					}else if(classtype == "FPXlink"){
						SRDotDX.gui.FPXraidLinkClickRaidList(e.element(), false); return false;
					}else if(classtype == "FPXDeleteLink"){
						SRDotDX.gui.deleteRaid(e.element(),e.element().parentNode.parentNode.parentNode.getAttribute("raidid")); return false;
					}else if(classtype == "link"){
						SRDotDX.gui.FPXraidLinkClickRaidList(e.element(), false); return false;
					}else if(classtype == "FPXcbVisited"){
						console.log("[SRDotDX]::{FPX}:: Clicked on::"+classtype+"::"+e.which+"::"+e.element().parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("raidid"));
						e.element().checked=(e.element().checked == true?false:true);
						SRDotDX.gui.raidListCBClicked(e.element(),'visited',e.element().parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("raidid"));
					}else if(classtype == "FPXcbSeen"){
						//onclick="SRDotDX.gui.raidListCBClicked(this,\'seen\',\''+r.hash+'\')"'+(r.seen == true?' checked="checked"':'')+'
						console.log("[SRDotDX]::{FPX}:: Clicked on::"+classtype+"::"+e.which+"::"+e.element().parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("raidid"));
						e.element().checked=(e.element().checked == true?false:true);
						SRDotDX.gui.raidListCBClicked(e.element(),'seen',e.element().parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("raidid"));
					}else if(classtype == "RaidQuickLink"){
						SRDotDX.gui.FPXraidLinkClickRaidList(e.element(), false); return false;
					}
				}else if(e.which == 3){
					if(classtype == "FPXlink" || classtype == "link" || classtype == "RaidQuickLink"){
						(function() { return setTimeout(function() {SRDotDX.gui.FPXraidLinkClickRaidList(e.element(),true);}, SRDotDX.config.FPXoptsMarkRightClickDelay)})();
						return false;
					}
				}
			},
			FPXraidLinkMouseDown: function (e,param1,param2,isChat) {
				e = e || window.event;
				if(isChat){
					switch (e.which) {
						case 1: SRDotDX.gui.FPXraidLinkClickChat(param1,param2,false); break;
						case 3: 
								if(SRDotDX.config.FPXmarkRightClick){
									(function(p1,p2) {return setTimeout(function() {SRDotDX.gui.FPXraidLinkClickChat(p1,p2,true);}, SRDotDX.config.FPXoptsMarkRightClickDelay)})(param1,param2);
								}else{
									SRDotDX.gui.FPXraidLinkClickChat(param1,param2,true); 
								}
								break;
					}
				}else
				{
					switch (e.which) {
						case 1: SRDotDX.gui.FPXraidLinkClickRaidList(param1,false); break;
						case 3: (function(p1) { return setTimeout(function() {SRDotDX.gui.FPXraidLinkClickRaidList(p1,true);}, SRDotDX.config.FPXoptsMarkRightClickDelay)})(param1); break; 
					}
				}
			},
			raidListCBClicked: function (ele,cb,id) {
			console.log("[SRDotDX]::{FPX}:: Clicked on::"+ele.checked+"::"+cb+"::"+id);
				if (SRDotDX.config.raidList[id]) {
				console.log("[SRDotDX]::{FPX}:: Clicked on1::"+ele.checked+"::"+cb+"::"+id);
					SRDotDX.config.raidList[id][cb] = ele.checked;
					console.log("[SRDotDX]::{FPX}:: Clicked on2::"+ele+"::"+cb+"::"+id);
					SRDotDX.gui.toggleRaid(cb,id,true);
					console.log("[SRDotDX]::{FPX}:: Clicked on3::"+ele+"::"+cb+"::"+id);
					if (cb =='visited') {
						console.log("[SRDotDX]::{FPX}:: Clicked on4::"+ele+"::"+cb+"::"+id);
						ele.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("FPXtext")[1].innerHTML = (ele.checked?"visited":"");
						console.log("[SRDotDX]::{FPX}:: Clicked on5::"+ele+"::"+cb+"::"+ele.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("FPXtext")[1].innerHTML);
					}
				}
			},
			raidListItemUpdateTimeSince: function (id) {
				var raid = SRDotDX.config.raidList[id];
				if (typeof raid == 'object') {
					document.getElementById('timeSince_' + id).innerHTML = timeSince(new Date(raid.timeStamp))
				}
			},
			raidListItemUpdate: function (id) {
				var raid = SRDotDX.config.raidList[id];
				if (typeof raid == 'object') {
					var ele = document.getElementById("raid_list").firstChild;
					while (ele) {
						if (ele.getAttribute("raidid") == id) {
							ele.getElementsByClassName("FPXtext")[1].innerHTML = (raid.visited == true?'visited':'');
							ele.getElementsByTagName("input")[0].checked = (raid.seen == true?true:false);
							ele.getElementsByTagName("input")[1].checked = (raid.visited == true?true:false);
							break;
						}
						ele = ele.nextSibling;
					}
				}
				else {
					SRDotDX.gui.raidListItemRemoveById(id);
				}
			},
			raidListItemRemoveById: function (id) {
				var e, ele = document.getElementById("raid_list").firstChild;
				while (typeof ele != 'null') {
					if (ele.getAttribute("raidid") == id) {
						break;
					}
					ele = ele.nextSibling;
				}
				if (ele) {
					while (typeof (e = ele.nextSibling) != 'null') {
						e.setAttribute("style",(e.getAttribute("style").indexOf('background-color:#e0e0e0') > -1?"":'background-color:#e0e0e0'))
					}
					ele.parentNode.removeChild(ele);
				}
			},
			toggleCSS: function (p) {
				document.head.removeChild(document.getElementById(p.id));
				SRDotDX.gui.cHTML("style").set({type: "text/css", id: p.id}).text(p.cls).attach("to",document.head);
			},
			toggleRaid: function(type,id,tog) {
				var d = document.getElementsByClassName("SRDotDX_raidid_" + id);
				if (typeof SRDotDX.config.raidList[id] == 'object') {
					var raid = SRDotDX.config.raidList[id];
					var raid = SRDotDX.getRaidDetails("&kv_difficulty="+raid.diff+"&kv_hash="+raid.hash+"&kv_raid_boss="+raid.boss+"&kv_raid_id="+raid.id);
				}
				for (var i = d.length -1;i>-1;i--) {
					if (tog == true && d[i].className.indexOf("SRDotDX_"+type+"Raid") == -1) {
						d[i].className += " SRDotDX_"+type+"Raid";
					}
					else if (tog == false && d[i].className.indexOf("SRDotDX_"+type+"Raid") > -1) {
						d[i].className = d[i].className.replace(eval("/SRDotDX_"+type+"Raid( |$)/i"),"");
					}
					if (typeof raid == 'object') {
						d[i].getElementsByTagName("a")[0].innerHTML = raid.linkText();
					}
				}

				var d2 = document.getElementsByClassName("raid_list_item_" + id);
				for (var j = d2.length -1;j>-1;j--) {
					if (tog == true && d2[j].className.indexOf("SRDotDX_"+type+"RaidList") == -1) {
						d2[j].className += " SRDotDX_"+type+"RaidList";
					}
					else if (tog == false && d2[j].className.indexOf("SRDotDX_"+type+"RaidList") > -1) {
						d2[j].className = d2[j].className.replace(eval("/SRDotDX_"+type+"RaidList( |$)/i"),"");
					}
				}
			}
		},
		load: function (fails) {
			if (typeof holodeck == 'object' && typeof ChatDialogue == 'function' && typeof activateGame == 'function' && typeof document.getElementById('kong_game_ui') != 'null') {
				ChatDialogue.prototype.SRDotDX_echo = function(msg){
					this.SRDotDX_DUM("DotD Extention","<br>"+msg,{class: "whisper whisper_recieved"},{non_user: true})
				}
				ChatDialogue.prototype.SRDotDX_DUM = ChatDialogue.prototype.displayUnsanitizedMessage;
				ChatDialogue.prototype.displayUnsanitizedMessage=function (b,d,e,f) {
					if(!this._user_manager.isMuted(b)){
						if (typeof e != 'object') { 
							e = {class: ''} 
						}
						else if (typeof e.class != 'string') {
							e.class = '';
						}
						var isPublic = false;
						try {
							isPublic = (/^room_\d+-dawn-of-the-dragons-\d+$/i.test(this._holodeck._chat_window._active_room._short_room_name) && e.class.indexOf("whisper") == -1?true:false)
						}
						catch(err){}

						
						var raid = SRDotDX.getRaidLink(d,b,isPublic)
						if (typeof raid == 'object') {
							e.class+= " SRDotDX_raid";
							e.class+= " SRDotDX_hash_"+raid.hash;
							e.class+= " SRDotDX_raidid_"+raid.id;
							e.class+= (raid.seen?" SRDotDX_seenRaid":'');
							e.class+=(raid.visited?" SRDotDX_visitedRaid":'');
							e.class+=" SRDotDX_filteredRaidChat" + raid.boss + '_' + (raid.diff - 1);							
							d = raid.ptext + '<a href="'+raid.url+'" onClick="return false;" onMouseDown="SRDotDX.gui.FPXraidLinkMouseDown(event,'+'\''+raid.id+'\''+',this.href,true); return false">'+raid.linkText()+'</a>'+raid.ntext;
							SRDotDX.gui.toggleRaid('visited',raid.id,raid.visited);
							SRDotDX.config.raidList[raid.id].seen = true;
							SRDotDX.gui.raidListItemUpdate(raid.id);
							if(raid.isNew && !SRDotDX.gui.AutoJoin)
								SRDotDX.gui.updateMessage();
						}
						var pb = SRDotDX.getPastebinLink(d,b,isPublic)
						if (typeof pb == 'object') {
							var doImport = pb.user!=active_user.username() && SRDotDX.config.autoImportPaste && pb.user==b;
							d = pb.ptext + '<a href="'+pb.url+'" target="_blank">'+(pb.isNew?'Pastebin Link':pb.user+'\'s Pastebin')+'</a> <span class="pb_'+pb.id+'">('+(doImport?'Importing...':'<a href="#" onClick="return false;" onMouseDown="SRDotDX.gui.FPXImportPasteBin(\''+pb.url+'\')">Import</a>')+')</span>'+pb.ntext;
							if(doImport){
								setTimeout("SRDotDX.gui.FPXImportPasteBin('"+pb.url+"');", 1000);
							}
						}
						
						this.SRDotDX_DUM(b,d,e,f);
					}
				}
				holodeck.addChatCommand("raidformat",function(deck,text){
					if (/^\/raidformat$/i.test(text)) {
						var i = SRDotDX.config.raidLinkFormat.replace(/</g,"&lt;").replace(/>/g,"&gt;")
						SRDotDX.echo("Raid Link formatting is: <b>" + (SRDotDX.config.formatRaidLinks?"on":"off")+"</b><br>Current Format:<br>"+i);
					}
					else if (/^\/raidformat on$/i.test(text)) {
						if (SRDotDX.config.formatRaidLinks == false) {
							SRDotDX.config.formatRaidLinks = true;
							SRDotDX.echo("Raid link formatting is now enabled");
						}
						else {
							SRDotDX.echo("Raid link formatting is already enabled")
						}
					}
					else if (/^\/raidformat off$/i.test(text)) {
						if (SRDotDX.config.formatRaidLinks == true) {
							SRDotDX.config.formatRaidLinks = false;
							SRDotDX.echo("Raid link formatting is now disabled");
						}
						else {
							SRDotDX.echo("Raid link formatting is already disabled")
						}
					}
					else if (/^\/raidformat help$/i.test(text)) {
						SRDotDX.gui.help("raidformat")
					}
					else if (SRDotDX.config.formatRaidLinks == false) {
						SRDotDX.echo('<b>/raidformat</b>: You must enable raid link formatting before you can set the format. (<a href="#" onclick="SRDotDX.gui.help(\'raidformat\'); return false">help</a>)')
					}
					else if (i = /^\/raidformat (\S.*)$/i.exec(text)) {
						SRDotDX.config.raidLinkFormat = i[1];
						SRDotDX.gui.cHTML('#SRDotDX_options_raidLinkFormat').ele().value = i[1];
						SRDotDX.echo("Raid format now set to:<br>"+i[1].replace(/</g,"&lt;").replace(/>/g,"&gt;"));
					}
					else {
						SRDotDX.echo('<b>/raidformat</b>: Invalid parameters specified. (<a href="#" onclick="SRDotDX.gui.help(\'raidformat\'); return false">help</a>)')
					}
					return false;
				});
				holodeck.addChatCommand("lr",function(deck,text){
					var u;
					if (u = /^\/lr (\S+)$/i.exec(text)) {SRDotDX.loadRaid(u[1]);}
					else {SRDotDX.echo('<b>/loadraid</b>: Invalid raid specified. (<a href="#" onclick="SRDotDX.gui.help(\'loadraid\'); return false">help</a>)');}
					return false;
				});
				holodeck.addChatCommand("loadraid",function(deck,text){
					var u;
					if (u = /^\/loadraid (\S+)$/i.exec(text)) {SRDotDX.loadRaid(u[1]);}
					else {SRDotDX.echo('<b>/loadraid</b>: Invalid raid specified. (<a href="#" onclick="SRDotDX.gui.help(\'loadraid\'); return false">help</a>)');}
					return false;
				});
				holodeck.addChatCommand("stop",function(deck,text){
					if(SRDotDX.gui.isPosting)
					{
						SRDotDX.gui.FPXStopPosting();
					}else{SRDotDX.echo('<b>/stop</b>: Links are not being posted. Stop command invalid.');}
					return false;
				});
				holodeck.addChatCommand("reload",function(deck,text){
					if (/^\/reload$/i.test(text)) {
						SRDotDX.reload();
					}
					else {
						SRDotDX.echo('<b>/reload</b>: Invalid parameters specified. (<a href="#" onclick="SRDotDX.gui.help(\'reload\'); return false">help</a>)');
					}
					return false
				});
				holodeck.addChatCommand("toggle",function (deck,text){
					var i;
					if (/^\/toggle$/i.test(text)) {
						var msg = "<b>Current Displays:</b><br>"
						msg += "Visited Raids: "+(!SRDotDX.config.hideVisitedRaids?'Shown':'hidden')+"<br>";
						msg += "Seen Raids: "+(!SRDotDX.config.hideSeenRaids?'Shown':'Hidden')+"<br>";
						SRDotDX.echo(msg);
					}
					else if (i = /^\/toggle (visited|seen)( show| hide)?$/i.exec(text)) {
						var p1 = i[1].toLowerCase();
						if (typeof i[2] == 'string' && i[2] != '') {
							var p2 = i[2].toLowerCase()
						}
						else {
							p2 = '';
						}

						var h = p1.substring(0,1).toUpperCase()+p1.substring(1);
						if (p2 == '') {
							SRDotDX.echo(h+" raids are currently: "+(SRDotDX.config[(p1 == "visited"?"hideVisitedRaids":"hideSeenRaids")] == true?"Hidden":"Shown"));
						}
						else {
							var eleId = "SRDotDX_" + p1 + "RaidClass";
							var state = document.getElementById(eleId).innerText.indexOf("none") > -1?"h":"s";
							var setTo = p2==" hide"?"h":"s";
							if (state == setTo) {
								SRDotDX.echo(h+" raids are already "+(state=="s"?"Shown":"Hidden"));
							}
							else {
								var cls = '.SRDotDX_'+p1+'Raid{display: '+(setTo=="s"?"block}":"none !important}");
								SRDotDX.gui.toggleCSS({id: eleId, cls: cls});
								SRDotDX.echo(h+" raids are now set to be "+(setTo=="s"?"Shown":"Hidden"));
							}

						}
					}
					else {
						SRDotDX.echo('Invalid parameters specified. (<a href="#" onclick="SRDotDX.gui.help(\'toggleraidview\'); return false">help</a>)');
					}
					return false;
				});
				holodeck.addChatCommand("clear",function(deck,text){
					holodeck.activeDialogue().clear();
					return false
				});
				holodeck.addChatCommand("spit",function(deck,text) {
					var p;
					if (p = /^\/spit ([0-9]*).*$/i.exec(text)) {
						var r = SRDotDX.config.getRaid(p[1]);
						var adjectives = ['stupid','worthless','terrible','awful','despicable','horrible','disgusting','ridiculous','horrendous','abominable','hideous'];
						var spitSounds = ['*ptoo*','*ptooie*', '*ptui*', '*pthu*'];
						var random1=Math.floor(Math.random()*11);
						var random2=Math.floor(Math.random()*4);
						if (typeof r == 'object') {
							var text = r.lastUser + ", I spit on your " + adjectives[random1] + " " + SRDotDX.raids[r.boss].name + "! " + spitSounds[random2] + "!";
							var elems= document.getElementById("chat_rooms_container").firstChild.getElementsByTagName('textarea');
							for (var i in elems){
								if((" "+elems[i].className+" ").indexOf(" chat_input ") > -1)
									{elems[i].value = text;holodeck.activeDialogue().sendInput(); break;
								}
							}
						}
					}
					return false;

				});				

				holodeck.addChatCommand("raid", function(deck,text){
					var p;
					if (p = /^\/raid (.*?)(?: ([1-6]))?$/i.exec(text)) {
						var msg = "";
						var start = (!isNaN(p[2]))?p[2]-1:0;
						var find = p[1].toLowerCase();
						for (var i in SRDotDX.raids) {
							if (SRDotDX.raids.hasOwnProperty(i)) {
								var raid = SRDotDX.raids[i];
								if (raid.name.toLowerCase().indexOf(find) > -1) {
									if (msg != "") msg += "<br>"
									msg += "<b>"+raid.name+"</b><br>";
									msg += "Size: "+raid.size+"<br>";
									msg += "Stats: "+SRDotDX.getStatText(raid.stat)+"<br>";
									msg += "Duration: "+raid.duration + "hrs<br>";
									if (raid.health[0] == 'Unlimited') {
										msg += "---<br>Health: Unlimited<br>FairShare: 1B<br>Optimal Share: 1B<br>";
									}
									else {
										var end = (isNaN(p[2])?(raid.id == 'echthros'?6:4):p[2]);
										
										for (var n = start;n<end;n++) {
											var h = raid.health[n];
											msg += "---<br>";
											msg += "Difficulty: "+["Normal","Hard","Legendary","Nightmare","Insane","Hell"][n]+"<br>";
											msg += "Health: "+SRDotDX.getShortNum(h)+"<br>";
											if (typeof raid.loottiers == 'object') {
												msg += "Loot Tiers: " + SRDotDX.getLootTierText(raid.id,n) + "<br>";
											} else {
												var fs = h / raid.size;
												var os = fs*{"1": 1, "10": 1.25,"50":2.2, "100": 2.3, "250": 1, "500": 1.5}[raid.size + ""];
												msg += "Fair Share: "+SRDotDX.getShortNum(fs)+"<br>";
												msg += "Optimal Share: "+SRDotDX.getShortNum(os)+"<br>";
											}
										}
									}
								}
							}
						}
						if (msg != "") {
							SRDotDX.echo(msg);
						}
						else {
							SRDotDX.echo('No raids found matching: '+p[1]);
						}
					}
					else {
						SRDotDX.echo('<b>/raid</b>: Invalid parameters specified (<a href="#" onclick="SRDotDX.gui.help(\'raid\')">help</a>)');
					}
					return false;
				});
				holodeck.addChatCommand("version", function(deck,text) {
					var d = "<b>Version</b>: "+SRDotDX.version.major+"("+SRDotDX.version.minor+")<br>";
					d += "<b>Major Version</b>: "+SRDotDX.version.major+"<br>"
					d += "<b>Minor Version</b>: "+SRDotDX.version.minor+"<br>"
					d += '<a href="http://userscripts.org/scripts/show/140080" target="_blank">Go to script page</a>';
					SRDotDX.echo(d);
					return false;
				});
				holodeck.addChatCommand("update", function(deck,text) {
					window.open("http://userscripts.org/scripts/show/140080");
					SRDotDX.echo("After installation, you will need to refresh this page");
					return false;
				});
				var i;
				if (typeof (i = SRDotDX.getRaidDetails(document.location.href)) == 'object'){
					if (SRDotDX.config.getRaid(i.id)) {
						SRDotDX.config.raidList[i.id].visited = true;
						SRDotDX.config.raidList[i.id].seen = true;
					}
					else {
						SRDotDX.config.addRaid(i.hash,i.id,i.boss,i.diff,true,true,false,'')
					}
				}
				window.onbeforeunload = function(){
					SRDotDX.config.pasteList = null;//for now just purge pastys when page is left
					SRDotDX.config.save(false);
				}

				SRDotDX.config.save();
				SRDotDX.gui.load();
				setTimeout(function(){delete SRDotDX.load},1);
				console.log("[SRDotDX] Core loaded; Loading user interface...");
			}

			else if (fails < 10) {
				console.log("[SRDotDX] Missing needed Kongregate resources, retrying in 5 seconds....");
				setTimeout(SRDotDX.load,5000,fails+1)
			}
			else {
				console.log("[SRDotDX] Unable to locate required Kongregate resources. Loading aborted");
				setTimeout(function(){delete SRDotDX;},1);
			}
		},
		loadRaid: function (url) {
			var r;
			if (typeof (r=SRDotDX.getRaidDetails(url)) == 'object') {
				var reg = new RegExp(/var iframe_options = ([^\x3B]+)/g);
				var match = reg.exec(activateGame); 
				var iframe_options = eval('('+match[1]+')');
				iframe_options['kv_action_type'] = 'raidhelp';
				iframe_options['kv_difficulty'] = r.diff;
				iframe_options['kv_hash'] = r.hash;
				iframe_options['kv_raid_boss'] = r.boss;
				iframe_options['kv_raid_id'] = r.id;
				$('gameiframe').replace(new Element('iframe', {"id":"gameiframe","name":"gameiframe","style":"border:none;position:relative;z-index:1;","scrolling":"auto","border":0,"frameborder":0,"width":760,"height":700,"class":"dont_hide"}));
				$('gameiframe').contentWindow.location.replace("http://web1.dawnofthedragons.com/kong?" + Object.toQueryString(iframe_options));
				SRDotDX.config.raidList[r.id].visited = true;
				SRDotDX.gui.toggleRaid("visited",r.id,true);
				SRDotDX.gui.raidListItemUpdate(r.id);
				//if(!SRDotDX.gui.AutoJoining && SRDotDX.config.AutoRefreshOnLinkClick) setTimeout("SRDotDX.reload()", SRDotDX.config.AutoJoinInterval);
			}
		},
		zoneRaidRegex:{
			z1: 'horgrak|mazalu|grune',
			z2: 'ataxes|alice|lurking',
			z3: 'briareus|scylla|gravlok|erebus',
			z4: 'bloodmane|kerberos|hydra|cai|tyranthius',
			z5: 'ironclad|zombie|stein|bogstench|nalagarst',
			z6: 'gunnar|nidhogg|kang|ulfrik|kalaxia',
			z7: 'maraak|erakka|wexxa|guilbert|bellarius',
			z8: 'hargamesh|grimsly|rift|sisters|mardachus',
			z9: 'mesyra|nimrod|phaedra|tenebra|valanazes'
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
			serpina:{name: 'Countess Serpina', shortname: 'Countess',  id: 'serpina', stat: 'E', size:10, duration:5, health: [75000000,112500000,150000000,187500000,,]},
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
			kang:{name: 'Kang-Gsod', shortname: 'Kang',  id: 'kang', stat: 'S', size:100, duration:72, health: [95000000,118750000,152000000,190000000,,]},
			'3dawg':{name: 'Kerberos', shortname: 'Kerb',  id: '3dawg', stat: 'S', size:50, duration:72, health: [35000000,43750000,56000000,70000000,,]},
			kessovtowers:{name: 'Kessov Towers', shortname: 'Towers',  id: 'kessovtowers', stat: 'ESH', size:90000, duration:120, health: ['Unlimited','Unlimited','Unlimited','Unlimited','Unlimited','Unlimited']},
			kessovforts:{name: 'Kessov Forts', shortname: 'Forts',  id: 'kessovforts', stat: 'ESH', size:90000, duration:120, health: ['Unlimited','Unlimited','Unlimited','Unlimited','Unlimited','Unlimited']},
			kessovcastle:{name: 'Kessov Castle', shortname: 'Castle',  id: 'kessovcastle', stat: 'ESH', size:90000, duration:144, health: ['Unlimited','Unlimited','Unlimited','Unlimited','Unlimited','Unlimited'],loottiers: [['1','1M','5M','10M','20M','50M','100M','150M','300M','450M','600M','750M','1B','2B','5B','50B'],[],[],[],[],[]]},
			kalaxia:{name: 'Kalaxia The Far-Seer', shortname: 'Kalaxia',  id: 'kalaxia', stat: 'S', size:500, duration:96, health: [800000000,1000000000,1280000000,1600000000,,]},
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
			50: { name: 'Medium', visible: 'Yes', pruneTimers: [3600000,10800000,32400000]}, // 1h, 2h, 3h
			100:{ name: 'Large', visible: 'Yes', pruneTimers: [14400000,43200000,129600000]}, // 4h, 12h, 36h
			250:{ name: 'Epic', visible: 'Yes', pruneTimers: [86400000,172800000,259200000]}, // 24h, 48h, 72h
			500:{ name: 'Colossal', visible: 'Yes', pruneTimers: [86400000,172800000,259200000]} // 24h, 48h, 72h
		},
		raidArray: [ "agony","djinn","animated_armor","spider","rhino","gladiators","bellarius","werewolfpack",
			"alice","bogstench","4ogre","bmane","harpy","kobold","corrupterebus","serpina","dahrizons_general",
			"basilisk","dirthax","dragons_lair","erakka_sak","giantgolem","echthros","drag","felendis","ogre",
			"dreadbloom","batman","evilgnome","guardian_golem","guilbert","gunnar","war_boar","hargamesh","grimsly",
			"hydra","ironclad","kang","3dawg","kessovtowers","kessovforts","kessovcastle","kalaxia","tyranthius",
			"lunacy","lurker","magma_horror","maraak","mardachus","scorp","mestr","mesyra","misako",
			"nalagarst","nidhogg","nimrod","phaedra","fairy_prince","roc","rhalmarius_the_despoiler","rift","crabshark",
			"squid","simulacrum_dahrizon","sircai","sisters","slaughterers","stein","tainted","tenebra","tisiphone",
			"chimera","gorgon","ulfrik","valanazes","blobmonster","wexxa","zombiehorde" ],
		reload: function () {
			SRDotDX.echo("Reloading, please wait...");
			var reg = new RegExp(/var iframe_options = ([^\x3B]+)/g);
			var match = reg.exec(activateGame); 
			var iframe_options = eval('('+match[1]+')');
			$('gameiframe').replace(new Element('iframe', {"id":"gameiframe","name":"gameiframe","style":"border:none;position:relative;z-index:1;","scrolling":"auto","border":0,"frameborder":0,"width":760,"height":700,"class":"dont_hide"}));
			$('gameiframe').contentWindow.location.replace("http://web1.dawnofthedragons.com/kong?" + Object.toQueryString(iframe_options));
		}
	}
	window.addEventListener("message", function(event){
		if(/pastebin\.com/i.test(event.origin)){//for pastebin import
			var pbid = event.data.split("###")[0];
			console.log("[SRDotDX] Pastebin message recieved "+pbid);
			document.FPXRaidSpamForm.FPXRaidSpamInput.value=event.data.replace(/&amp;/g, '&');
			var ct = SRDotDX.gui.FPXimportRaids();
			
			SRDotDX.config.pasteList[pbid].newTotal=ct.totalnew;
			SRDotDX.config.pasteList[pbid].total=ct.total;
			SRDotDX.config.pasteList[pbid].lastImport=new Date().getTime();
			
			var els = document.getElementsByClassName("pb_"+pbid);
			for(i=0;i<els.length;i++){
				els[i].innerHTML="(Imported, "+ct.totalnew+" new)";
			}
			SRDotDX.gui.importingPastebin=false;
			console.log("[SRDotDX] Pastebin import complete");
		}

		if(/web[\w]+\.dawnofthedragons\.com/i.test(event.origin)) { // for Kong game iframe 
			console.log("[SRDotDX] Reloading");
			if (/reload/.test(event.data)) { // reload the frame
				SRDotDX.reload();
			}
		} 

	}, false);
	console.log("[SRDotDX] Initialized. Checking for needed Kongregate resources...");
	SRDotDX.load(0);	
}
function PBmain(){//pastebin script
	var id = (window.location+"").substring((window.location+"").length-8);
	window.parent.postMessage(id+"###"+document.getElementsByTagName("body")[0].innerHTML, 'http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons');
}
function DDmain(){//game frame script
	var linkElements = document.getElementsByTagName('a');
	if (linkElements[0]) {
		linkElements[0].onclick = function() { window.parent.postMessage('reload','http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons'); return false; };
		//linkElements[0].textContent = 'Reload Game';
	} 
}
if (/^http:\/\/www\.kongregate\.com\/games\/5thplanetgames\/dawn-of-the-dragons(?:\/?$|\?|#)/i.test(document.location.href)) {
	console.log("[SRDotDX] Initializing....");
	/*var jq = document.createElement("script");
	jq.src = "http://code.jquery.com/jquery-latest.min.js";
	(document.head || document.body || document.documentElement).appendChild(jq);*/
	var script = document.createElement("script");
	script.appendChild(document.createTextNode('('+main+')()'));
	(document.head || document.body || document.documentElement).appendChild(script);
}
if (/pastebin\.com\/raw\.php\?i\=/i.test(document.location.href)) {
	console.log("[SRDotDX] PasteBin Initializing....");
	var script = document.createElement("script");
	script.appendChild(document.createTextNode('('+PBmain+')()'));
	(document.head || document.body || document.documentElement).appendChild(script);
}
if (/web[\w]+\.dawnofthedragons\.com\/kong/i.test(document.location.href)) {
	console.log("[SRDotDX] Gamescript Initializing....");
	var script = document.createElement("script");
	script.appendChild(document.createTextNode('('+DDmain+')()'));
	(document.head || document.body || document.documentElement).appendChild(script);
}