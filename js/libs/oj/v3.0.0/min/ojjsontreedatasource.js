/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojdatasource-common"],function(a){a.uA=function(){this.id=null;this.depth=0;this.parent=null;this.children=[];this.E3=this.attr=this.title=null};a.uA.prototype.Iwa=function(a){return function(c,b){return null!=c.attr&&null!=b.attr&&null!=c.attr[a]&&null!=b.attr[a]?c.attr[a]<b.attr[a]?-1:c.attr[a]===b.attr[a]?0:1:c[a]<b[a]?-1:c[a]===b[a]?0:1}};a.uA.prototype.xza=function(a){return function(c,b){return null!=c.attr&&null!=b.attr&&null!=c.attr[a]&&null!=b.attr[a]?c.attr[a]<
b.attr[a]?1:c.attr[a]===b.attr[a]?0:-1:c[a]<b[a]?1:c[a]===b[a]?0:-1}};a.uA.prototype.Lja=function(a){var c=a.key;"ascending"===a.direction?this.children.sort(this.Iwa(c)):"descending"===a.direction&&this.children.sort(this.xza(c));for(var c=0,b=this.children.length;c<b;c++)this.children[c].Lja(a)};a.Wd=function(g){var c;c=new a.uA;null==g.id&&(c.id="root");this.data=this.Kaa({count:0},c,g);a.Wd.O.constructor.call(this,c)};o_("JsonTreeDataSource",a.Wd,a);a.f.xa(a.Wd,a.Kt,"oj.JsonTreeDataSource");a.Wd.prototype.Init=
function(){a.Wd.O.Init.call(this)};a.f.j("JsonTreeDataSource.prototype.Init",{Init:a.Wd.prototype.Init});a.Wd.prototype.Kaa=function(g,c,b,d){var e,f,h,k,l,m,p;null==d&&(d=0);for(k in b)if("children"==k||0==d&&b instanceof Array)for(e=0==d&&b instanceof Array?b:b[k],d++,p=0;p<e.length;p++){h=e[p];f=new a.uA;null==h.id&&(g.count++,null==h.attr?f.id="rid_"+g.count:null==h.attr.id&&(h.attr.id="rid_"+g.count));for(l in h)for(m in f)l==m&&"children"!=l&&(f[m]=h[l]),"depth"==m&&(f[m]=d);c.children.push(f);
for(m in h)"children"==m&&this.Kaa(g,c.children[p],h,d)}return c};a.Wd.prototype.getChildCount=function(a){null==a&&(a=this.data.id);a=this.Zu(this.data,a);return a.children?a.children.length:0};a.f.j("JsonTreeDataSource.prototype.getChildCount",{getChildCount:a.Wd.prototype.getChildCount});a.Wd.prototype.fetchChildren=function(g,c,b){var d,e,f,h,k;f=[];null==g&&(g=this.data.id);h=this.Zu(this.data,g);c||(c=[],c.start=0,c.count=h.children.length);c.count||(c.count=h.children.length);c.start||(c.start=
0);d=c.start;e=Math.min(h.children.length,d+c.count);for(c=d;c<e;c+=1)k=new a.uA,null!=h.children[c].attr&&(k.attr=h.children[c].attr),null!=h.children[c].id&&(k.id=h.children[c].id),null!=h.children[c].depth&&(k.depth=h.children[c].depth),null!=h.children[c].title&&(k.title=h.children[c].title),null!=h.children[c].parent&&(k.parent=h.children[c].parent),k.E3=0<h.children[c].children.length?!1:!0,f.push(k);g=new a.Uh(d,e,f,g);null!=b&&null!=b.success&&b.success.call(null,g)};a.f.j("JsonTreeDataSource.prototype.fetchChildren",
{fetchChildren:a.Wd.prototype.fetchChildren});a.Wd.prototype.fetchDescendants=function(g,c){var b,d,e,f;e=[];null==g&&(g=this.data.id);f=this.Zu(this.data,g);b=[];b.start=0;b.count=f.children.length;d=b.start;for(b=Math.min(f.children.length,d+b.count);d<b;d+=1)f.children[d].E3=0<f.children[d].children.length?!1:!0,e.push(f.children[d]);e=new a.Uh(0,e.length,e,g);null!=c&&null!=c.success&&c.success.call(null,e)};a.f.j("JsonTreeDataSource.prototype.fetchDescendants",{fetchDescendants:a.Wd.prototype.fetchDescendants});
a.Wd.prototype.moveOK=function(){return"valid"};a.f.j("JsonTreeDataSource.prototype.moveOK",{moveOK:a.Wd.prototype.moveOK});a.Wd.prototype.move=function(g,c,b,d){var e;e=c;if(null==e||e==this.data.id){if("inside"!=b){a.F.log("Error: root can not be the reference node if position equals to "+b);return}e||(e=this.data.id)}g=this.Zu(null,g);this.Zu(g,e)?a.F.log("Error: the node to move contains the reference node as its sub-tree."):(c=this.Zu(null,e),e=this.gY(e),this.FJa(g),"inside"==b?(this.Fs(g,g.depth-
(c.depth+1)),c.children.push(g)):"before"==b?(this.Fs(g,g.depth-c.depth),b=e.children.indexOf(c),-1<b&&(0!=b?e.children.splice(b,0,g):e.children.unshift(g))):"after"==b?(this.Fs(g,g.depth-c.depth),b=e.children.indexOf(c),-1<b&&e.children.splice(b+1,0,g)):"first"==b?(this.Fs(g,g.depth-c.depth),e.children.unshift(g)):"last"==b&&(this.Fs(g,g.depth-c.depth),e.children.push(g)),null!=d&&null!=d.success&&d.success.call(null,this.data))};a.f.j("JsonTreeDataSource.prototype.move",{move:a.Wd.prototype.move});
a.Wd.prototype.sort=function(a,c){var b;b=this.Zu(this.data,this.data.id);b.Lja(a);null!=c&&null!=c.success&&c.success.call(null,b)};a.f.j("JsonTreeDataSource.prototype.sort",{sort:a.Wd.prototype.sort});a.Wd.prototype.getSortCriteria=function(){return{key:null,direction:"none"}};a.f.j("JsonTreeDataSource.prototype.getSortCriteria",{getSortCriteria:a.Wd.prototype.getSortCriteria});a.Wd.prototype.gY=function(a,c){var b,d=null;if(a==this.data.id)return null;null==c&&(c=this.data);if(c.children&&0<c.children.length){for(b=
0;b<c.children.length;b++)if(c.children[b].id&&c.children[b].id==a||c.children[b].attr&&c.children[b].attr.id==a)return c;for(b=0;b<c.children.length&&!(d=this.gY(a,c.children[b]));b++);}return d};a.Wd.prototype.Zu=function(a,c){var b,d=null;null==a&&(a=this.data);if(a.id&&a.id==c||a.attr&&a.attr.id==c)return a;if(null!=a.children)for(b=0;b<a.children.length&&!d;b++)d=a.children[b].id&&a.children[b].id==c||a.children[b].attr&&a.children[b].attr.id==c?a.children[b]:this.Zu(a.children[b],c);return d};
a.Wd.prototype.Fs=function(a,c){var b;a.depth-=c;if(a.children&&0!=a.children.length)for(b=0;b<a.children.length;b++)this.Fs(a.children[b],c)};a.Wd.prototype.FJa=function(a){var c;null!=a.id?c=a.id:null!=a.attr&&(c=a.attr.id);(c=this.gY(c))||(c=this.data);a=c.children.indexOf(a);-1<a&&c.children.splice(a,1)};a.Wd.prototype.getCapability=function(a){return"fetchDescendants"===a?"enable":"sort"===a?"default":"batchFetch"===a?"disable":"move"===a?"full":null};a.f.j("JsonTreeDataSource.prototype.getCapability",
{getCapability:a.Wd.prototype.getCapability});a.Uh=function(g,c,b,d){a.u.Is(g,null);a.u.Is(c,null);this.URa=d;this.Uv=g;this.dR=c;this.fj=b};o_("JsonNodeSet",a.Uh,a);a.Uh.prototype.getParent=function(){return this.URa};a.f.j("JsonNodeSet.prototype.getParent",{getParent:a.Uh.prototype.getParent});a.Uh.prototype.getStart=function(){return this.Uv};a.f.j("JsonNodeSet.prototype.getStart",{getStart:a.Uh.prototype.getStart});a.Uh.prototype.getCount=function(){return Math.max(0,this.dR-this.Uv)};a.f.j("JsonNodeSet.prototype.getCount",
{getCount:a.Uh.prototype.getCount});a.Uh.prototype.getData=function(g){a.u.assert(g<=this.dR&&g>=this.Uv);g-=this.Uv;return this.fj[g]?this.fj[g].attr:null};a.f.j("JsonNodeSet.prototype.getData",{getData:a.Uh.prototype.getData});a.Uh.prototype.getMetadata=function(g){var c=[];a.u.assert(g<=this.dR&&g>=this.Uv);g-=this.Uv;c.key=this.fj[g].id?this.fj[g].id:this.fj[g].attr.id;c.leaf=this.fj[g].E3;c.depth=this.fj[g].depth;null==c.leaf&&(c.leaf=this.fj[g].children&&0<this.fj[g].children.length?!1:!0);
return c};a.f.j("JsonNodeSet.prototype.getMetadata",{getMetadata:a.Uh.prototype.getMetadata});a.Uh.prototype.Fs=function(a,c){var b;c++;a.depth=c;if(a.children&&0!=a.children.length)for(b=0;b<a.children.length;b++)this.Fs(a.children[b],c)};a.Uh.prototype.Zi=function(g){var c,b,d;a.u.assert(g<=this.dR&&g>=this.Uv);g-=this.Uv;b=this.fj[g].depth;c=this.fj[g].children;if(0==c.length)return null;g=this.fj[g].id?this.fj[g].id:this.fj[g].attr.id;for(d=0;d<c.length;d++)this.Fs(c[d],b);return new a.Uh(0,c.length,
c,g)};a.f.j("JsonNodeSet.prototype.getChildNodeSet",{Zi:a.Uh.prototype.Zi})});