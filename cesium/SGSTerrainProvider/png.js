(function(){var t;t=function(){var t;function e(t){var e,a,i,s,r,h,n,o,d,c,p,l,f;for(this.data=t,this.pos=8,this.palette=[],this.imgData=[],this.transparency={},this.animation=null,this.text={},r=null;;){switch(e=this.readUInt32(),o=function(){var t,e;for(e=[],t=0;t<4;++t)e.push(String.fromCharCode(this.data[this.pos++]));return e}.call(this).join("")){case"IHDR":this.width=this.readUInt32(),this.height=this.readUInt32(),this.bits=this.data[this.pos++],this.colorType=this.data[this.pos++],this.compressionMethod=this.data[this.pos++],this.filterMethod=this.data[this.pos++],this.interlaceMethod=this.data[this.pos++];break;case"acTL":this.animation={numFrames:this.readUInt32(),numPlays:this.readUInt32()||1/0,frames:[]};break;case"PLTE":this.palette=this.read(e);break;case"fcTL":r&&this.animation.frames.push(r),this.pos+=4,r={width:this.readUInt32(),height:this.readUInt32(),xOffset:this.readUInt32(),yOffset:this.readUInt32()},s=this.readUInt16(),i=this.readUInt16()||100,r.delay=1e3*s/i,r.disposeOp=this.data[this.pos++],r.blendOp=this.data[this.pos++],r.data=[];break;case"IDAT":case"fdAT":for("fdAT"===o&&(this.pos+=4,e-=4),t=(null!=r?r.data:void 0)||this.imgData,p=0;0<=e?p<e:p>e;0<=e?++p:--p)t.push(this.data[this.pos++]);break;case"tRNS":switch(this.transparency={},this.colorType){case 3:if(this.transparency.indexed=this.read(e),(d=255-this.transparency.indexed.length)>0)for(l=0;0<=d?l<d:l>d;0<=d?++l:--l)this.transparency.indexed.push(255);break;case 0:this.transparency.grayscale=this.read(e)[0];break;case 2:this.transparency.rgb=this.read(e)}break;case"tEXt":h=(c=this.read(e)).indexOf(0),n=String.fromCharCode.apply(String,c.slice(0,h)),this.text[n]=String.fromCharCode.apply(String,c.slice(h+1));break;case"IEND":return r&&this.animation.frames.push(r),this.colors=function(){switch(this.colorType){case 0:case 3:case 4:return 1;case 2:case 6:return 3}}.call(this),this.hasAlphaChannel=4===(f=this.colorType)||6===f,a=this.colors+(this.hasAlphaChannel?1:0),this.pixelBitlength=this.bits*a,this.colorSpace=function(){switch(this.colors){case 1:return"DeviceGray";case 3:return"DeviceRGB"}}.call(this),void(this.imgData=new Uint8Array(this.imgData));default:this.pos+=e}if(this.pos+=4,this.pos>this.data.length)throw new Error("Incomplete or corrupt PNG file")}}return e.load=function(t,a,i){var s;return"function"==typeof a&&(i=a),(s=new XMLHttpRequest).open("GET",t,!0),s.responseType="arraybuffer",s.onload=function(){var t;return t=new e(new Uint8Array(s.response||s.mozResponseArrayBuffer)),"function"==typeof(null!=a?a.getContext:void 0)&&t.render(a),"function"==typeof i?i(t):void 0},s.send(null)},0,1,2,0,1,e.prototype.read=function(t){var e,a;for(a=[],e=0;0<=t?e<t:e>t;0<=t?++e:--e)a.push(this.data[this.pos++]);return a},e.prototype.readUInt32=function(){return this.data[this.pos++]<<24|this.data[this.pos++]<<16|this.data[this.pos++]<<8|this.data[this.pos++]},e.prototype.readUInt16=function(){return this.data[this.pos++]<<8|this.data[this.pos++]},e.prototype.decodePixels=function(t){var e,a,i,s,r,h,n,o,d,c,p,l,f,u,m,g,y,w,v,I,b,D,U;if(null==t&&(t=this.imgData),0===t.length)return new Uint8Array(0);for(t=(t=new FlateStream(t)).getBytes(),g=(l=this.pixelBitlength/8)*this.width,f=new Uint8Array(g*this.height),h=t.length,m=0,u=0,a=0;u<h;){switch(t[u++]){case 0:for(s=v=0;v<g;s=v+=1)f[a++]=t[u++];break;case 1:for(s=I=0;I<g;s=I+=1)e=t[u++],r=s<l?0:f[a-l],f[a++]=(e+r)%256;break;case 2:for(s=b=0;b<g;s=b+=1)e=t[u++],i=(s-s%l)/l,y=m&&f[(m-1)*g+i*l+s%l],f[a++]=(y+e)%256;break;case 3:for(s=D=0;D<g;s=D+=1)e=t[u++],i=(s-s%l)/l,r=s<l?0:f[a-l],y=m&&f[(m-1)*g+i*l+s%l],f[a++]=(e+Math.floor((r+y)/2))%256;break;case 4:for(s=U=0;U<g;s=U+=1)e=t[u++],i=(s-s%l)/l,r=s<l?0:f[a-l],0===m?y=w=0:(y=f[(m-1)*g+i*l+s%l],w=i&&f[(m-1)*g+(i-1)*l+s%l]),n=r+y-w,o=Math.abs(n-r),c=Math.abs(n-y),p=Math.abs(n-w),d=o<=c&&o<=p?r:c<=p?y:w,f[a++]=(e+d)%256;break;default:throw new Error("Invalid filter algorithm: "+t[u-1])}m++}return f},e.prototype.decodePalette=function(){var t,e,a,i,s,r,h,n,o;for(a=this.palette,r=this.transparency.indexed||[],s=new Uint8Array((r.length||0)+a.length),i=0,a.length,t=0,e=h=0,n=a.length;h<n;e=h+=3)s[i++]=a[e],s[i++]=a[e+1],s[i++]=a[e+2],s[i++]=null!=(o=r[t++])?o:255;return s},e.prototype.copyToImageData=function(t,e){var a,i,s,r,h,n,o,d,c,p,l;if(i=this.colors,c=null,a=this.hasAlphaChannel,this.palette.length&&(c=null!=(l=this._decodedPalette)?l:this._decodedPalette=this.decodePalette(),i=4,a=!0),d=(s=t.data||t).length,h=c||e,r=n=0,1===i)for(;r<d;)o=c?4*e[r/4]:n,p=h[o++],s[r++]=p,s[r++]=p,s[r++]=p,s[r++]=a?h[o++]:255,n=o;else for(;r<d;)o=c?4*e[r/4]:n,s[r++]=h[o++],s[r++]=h[o++],s[r++]=h[o++],s[r++]=a?h[o++]:255,n=o},e.prototype.decode=function(){var t;return t=new Uint8Array(this.width*this.height*4),this.copyToImageData(t,this.decodePixels()),t},t=function(t){var e;return(void 0).width=t.width,(void 0).height=t.height,(void 0).clearRect(0,0,t.width,t.height),(void 0).putImageData(t,0,0),(e=new Image).src=(void 0).toDataURL(),e},e.prototype.decodeFrames=function(e){var a,i,s,r,h,n,o,d;if(this.animation){for(d=[],i=h=0,n=(o=this.animation.frames).length;h<n;i=++h)a=o[i],s=e.createImageData(a.width,a.height),r=this.decodePixels(new Uint8Array(a.data)),this.copyToImageData(s,r),a.imageData=s,d.push(a.image=t(s));return d}},e.prototype.renderFrame=function(t,e){var a,i,s;return a=(i=this.animation.frames)[e],s=i[e-1],0===e&&t.clearRect(0,0,this.width,this.height),1===(null!=s?s.disposeOp:void 0)?t.clearRect(s.xOffset,s.yOffset,s.width,s.height):2===(null!=s?s.disposeOp:void 0)&&t.putImageData(s.imageData,s.xOffset,s.yOffset),0===a.blendOp&&t.clearRect(a.xOffset,a.yOffset,a.width,a.height),t.drawImage(a.image,a.xOffset,a.yOffset)},e.prototype.animate=function(t){var e,a,i,s,r,h,n=this;return a=0,h=this.animation,s=h.numFrames,i=h.frames,r=h.numPlays,(e=function(){var h,o;if(h=a++%s,o=i[h],n.renderFrame(t,h),s>1&&a/s<r)return n.animation._timeout=setTimeout(e,o.delay)})()},e.prototype.stopAnimation=function(){var t;return clearTimeout(null!=(t=this.animation)?t._timeout:void 0)},e.prototype.render=function(t){var e,a;return t._png&&t._png.stopAnimation(),t._png=this,t.width=this.width,t.height=this.height,e=t.getContext("2d"),this.animation?(this.decodeFrames(e),this.animate(e)):(a=e.createImageData(this.width,this.height),this.copyToImageData(a,this.decodePixels()),e.putImageData(a,0,0))},e}(),this.PNG=t}).call(this);