var DecodeStream=function(){function e(){this.pos=0,this.bufferLength=0,this.eof=!1,this.buffer=null}return e.prototype={ensureBuffer:function(e){var t=this.buffer,r=t?t.byteLength:0;if(e<r)return t;for(var i=512;i<e;)i<<=1;for(var s=new Uint8Array(i),f=0;f<r;++f)s[f]=t[f];return this.buffer=s},getByte:function(){for(var e=this.pos;this.bufferLength<=e;){if(this.eof)return null;this.readBlock()}return this.buffer[this.pos++]},getBytes:function(e){var t=this.pos;if(e){this.ensureBuffer(t+e);for(var r=t+e;!this.eof&&this.bufferLength<r;)this.readBlock();var i=this.bufferLength;r>i&&(r=i)}else{for(;!this.eof;)this.readBlock();r=this.bufferLength}return this.pos=r,this.buffer.subarray(t,r)},lookChar:function(){for(var e=this.pos;this.bufferLength<=e;){if(this.eof)return null;this.readBlock()}return String.fromCharCode(this.buffer[this.pos])},getChar:function(){for(var e=this.pos;this.bufferLength<=e;){if(this.eof)return null;this.readBlock()}return String.fromCharCode(this.buffer[this.pos++])},makeSubStream:function(e,t,r){for(var i=e+t;this.bufferLength<=i&&!this.eof;)this.readBlock();return new Stream(this.buffer,e,t,r)},skip:function(e){e||(e=1),this.pos+=e},reset:function(){this.pos=0}},e}(),FlateStream=function(){var e=new Uint32Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),t=new Uint32Array([3,4,5,6,7,8,9,10,65547,65549,65551,65553,131091,131095,131099,131103,196643,196651,196659,196667,262211,262227,262243,262259,327811,327843,327875,327907,258,258,258]),r=new Uint32Array([1,2,3,4,65541,65543,131081,131085,196625,196633,262177,262193,327745,327777,393345,393409,459009,459137,524801,525057,590849,591361,657409,658433,724993,727041,794625,798721,868353,876545]),i=[new Uint32Array([459008,524368,524304,524568,459024,524400,524336,590016,459016,524384,524320,589984,524288,524416,524352,590048,459012,524376,524312,589968,459028,524408,524344,590032,459020,524392,524328,59e4,524296,524424,524360,590064,459010,524372,524308,524572,459026,524404,524340,590024,459018,524388,524324,589992,524292,524420,524356,590056,459014,524380,524316,589976,459030,524412,524348,590040,459022,524396,524332,590008,524300,524428,524364,590072,459009,524370,524306,524570,459025,524402,524338,590020,459017,524386,524322,589988,524290,524418,524354,590052,459013,524378,524314,589972,459029,524410,524346,590036,459021,524394,524330,590004,524298,524426,524362,590068,459011,524374,524310,524574,459027,524406,524342,590028,459019,524390,524326,589996,524294,524422,524358,590060,459015,524382,524318,589980,459031,524414,524350,590044,459023,524398,524334,590012,524302,524430,524366,590076,459008,524369,524305,524569,459024,524401,524337,590018,459016,524385,524321,589986,524289,524417,524353,590050,459012,524377,524313,589970,459028,524409,524345,590034,459020,524393,524329,590002,524297,524425,524361,590066,459010,524373,524309,524573,459026,524405,524341,590026,459018,524389,524325,589994,524293,524421,524357,590058,459014,524381,524317,589978,459030,524413,524349,590042,459022,524397,524333,590010,524301,524429,524365,590074,459009,524371,524307,524571,459025,524403,524339,590022,459017,524387,524323,589990,524291,524419,524355,590054,459013,524379,524315,589974,459029,524411,524347,590038,459021,524395,524331,590006,524299,524427,524363,590070,459011,524375,524311,524575,459027,524407,524343,590030,459019,524391,524327,589998,524295,524423,524359,590062,459015,524383,524319,589982,459031,524415,524351,590046,459023,524399,524335,590014,524303,524431,524367,590078,459008,524368,524304,524568,459024,524400,524336,590017,459016,524384,524320,589985,524288,524416,524352,590049,459012,524376,524312,589969,459028,524408,524344,590033,459020,524392,524328,590001,524296,524424,524360,590065,459010,524372,524308,524572,459026,524404,524340,590025,459018,524388,524324,589993,524292,524420,524356,590057,459014,524380,524316,589977,459030,524412,524348,590041,459022,524396,524332,590009,524300,524428,524364,590073,459009,524370,524306,524570,459025,524402,524338,590021,459017,524386,524322,589989,524290,524418,524354,590053,459013,524378,524314,589973,459029,524410,524346,590037,459021,524394,524330,590005,524298,524426,524362,590069,459011,524374,524310,524574,459027,524406,524342,590029,459019,524390,524326,589997,524294,524422,524358,590061,459015,524382,524318,589981,459031,524414,524350,590045,459023,524398,524334,590013,524302,524430,524366,590077,459008,524369,524305,524569,459024,524401,524337,590019,459016,524385,524321,589987,524289,524417,524353,590051,459012,524377,524313,589971,459028,524409,524345,590035,459020,524393,524329,590003,524297,524425,524361,590067,459010,524373,524309,524573,459026,524405,524341,590027,459018,524389,524325,589995,524293,524421,524357,590059,459014,524381,524317,589979,459030,524413,524349,590043,459022,524397,524333,590011,524301,524429,524365,590075,459009,524371,524307,524571,459025,524403,524339,590023,459017,524387,524323,589991,524291,524419,524355,590055,459013,524379,524315,589975,459029,524411,524347,590039,459021,524395,524331,590007,524299,524427,524363,590071,459011,524375,524311,524575,459027,524407,524343,590031,459019,524391,524327,589999,524295,524423,524359,590063,459015,524383,524319,589983,459031,524415,524351,590047,459023,524399,524335,590015,524303,524431,524367,590079]),9],s=[new Uint32Array([327680,327696,327688,327704,327684,327700,327692,327708,327682,327698,327690,327706,327686,327702,327694,0,327681,327697,327689,327705,327685,327701,327693,327709,327683,327699,327691,327707,327687,327703,327695,0]),5];function f(e){throw new Error(e)}function o(e){var t=0,r=e[t++],i=e[t++];-1!=r&&-1!=i||f("Invalid header in flate stream"),8!=(15&r)&&f("Unknown compression method in flate stream"),((r<<8)+i)%31!=0&&f("Bad FCHECK in flate stream"),32&i&&f("FDICT bit set in flate stream"),this.bytes=e,this.bytesPos=2,this.codeSize=0,this.codeBuf=0,DecodeStream.call(this)}return o.prototype=Object.create(DecodeStream.prototype),o.prototype.getBits=function(e){for(var t,r=this.codeSize,i=this.codeBuf,s=this.bytes,o=this.bytesPos;r<e;)void 0===(t=s[o++])&&f("Bad encoding in flate stream"),i|=t<<r,r+=8;return t=i&(1<<e)-1,this.codeBuf=i>>e,this.codeSize=r-=e,this.bytesPos=o,t},o.prototype.getCode=function(e){for(var t=e[0],r=e[1],i=this.codeSize,s=this.codeBuf,o=this.bytes,n=this.bytesPos;i<r;){var a;void 0===(a=o[n++])&&f("Bad encoding in flate stream"),s|=a<<i,i+=8}var h=t[s&(1<<r)-1],u=h>>16,c=65535&h;return(0==i||i<u||0==u)&&f("Bad encoding in flate stream"),this.codeBuf=s>>u,this.codeSize=i-u,this.bytesPos=n,c},o.prototype.generateHuffmanTable=function(e){for(var t=e.length,r=0,i=0;i<t;++i)e[i]>r&&(r=e[i]);for(var s=1<<r,f=new Uint32Array(s),o=1,n=0,a=2;o<=r;++o,n<<=1,a<<=1)for(var h=0;h<t;++h)if(e[h]==o){var u=0,c=n;for(i=0;i<o;++i)u=u<<1|1&c,c>>=1;for(i=u;i<s;i+=a)f[i]=o<<16|h;++n}return[f,r]},o.prototype.readBlock=function(){function o(e,t,r,i,s){for(var f=e.getBits(r)+i;f-- >0;)t[b++]=s}var n=this.getBits(3);if(1&n&&(this.eof=!0),0!=(n>>=1)){var a,h;if(1==n)a=i,h=s;else if(2==n){for(var u=this.getBits(5)+257,c=this.getBits(5)+1,d=this.getBits(4)+4,l=Array(e.length),b=0;b<d;)l[e[b++]]=this.getBits(3);for(var v=this.generateHuffmanTable(l),g=0,B=(b=0,u+c),y=new Array(B);b<B;){var m=this.getCode(v);16==m?o(this,y,2,3,g):17==m?o(this,y,3,3,g=0):18==m?o(this,y,7,11,g=0):y[b++]=g=m}a=this.generateHuffmanTable(y.slice(0,u)),h=this.generateHuffmanTable(y.slice(u,B))}else f("Unknown block type in flate stream");for(var p=(D=this.buffer)?D.length:0,k=this.bufferLength;;){var S=this.getCode(a);if(S<256)k+1>=p&&(p=(D=this.ensureBuffer(k+1)).length),D[k++]=S;else{if(256==S)return void(this.bufferLength=k);var w=(S=t[S-=257])>>16;w>0&&(w=this.getBits(w));g=(65535&S)+w;S=this.getCode(h),(w=(S=r[S])>>16)>0&&(w=this.getBits(w));var C=(65535&S)+w;k+g>=p&&(p=(D=this.ensureBuffer(k+g)).length);for(var L=0;L<g;++L,++k)D[k]=D[k-C]}}}else{var A,U=this.bytes,P=this.bytesPos;void 0===(A=U[P++])&&f("Bad block header in flate stream");var z=A;void 0===(A=U[P++])&&f("Bad block header in flate stream"),z|=A<<8,void 0===(A=U[P++])&&f("Bad block header in flate stream");var H=A;void 0===(A=U[P++])&&f("Bad block header in flate stream"),(H|=A<<8)!=(65535&~z)&&f("Bad uncompressed block length in flate stream"),this.codeBuf=0,this.codeSize=0;var T=this.bufferLength,D=this.ensureBuffer(T+z),F=T+z;this.bufferLength=F;for(var E=T;E<F;++E){if(void 0===(A=U[P++])){this.eof=!0;break}D[E]=A}this.bytesPos=P}},o}();