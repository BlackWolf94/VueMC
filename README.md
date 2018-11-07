# vue2-mc

API
===
Docs generated using [`docts`](https://github.com/charto/docts)
>
> <a name="api-BaseCollection"></a>
> ### Class [`BaseCollection`](#api-BaseCollection)
> Source code: [`<>`](http:///blob/e1e63ce/src/modules/BaseCollection.ts#L7-L88)  
>  
> Methods:  
> > **new( )** <sup>&rArr; <code>[BaseCollection](#api-BaseCollection)&lt;M&gt;</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/BaseCollection.ts#L11-L16)  
> > &emsp;&#x25ab; models<sub>?</sub> <sup><code>Item | Item[]</code></sup>  
> > **.clear( )** <sup>&rArr; <code>this</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/BaseCollection.ts#L18-L21)  
> > **.add( )** <sup>&rArr; <code>this</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/BaseCollection.ts#L23-L32)  
> > &emsp;&#x25ab; items<sub>?</sub> <sup><code>Item | Item[]</code></sup>  
> > **.search( )** <sup>&rArr; <code>M[]</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/BaseCollection.ts#L34-L40)  
> > &emsp;&#x25ab; search<sub>?</sub> <sup><code>string</code></sup>  
> > **.toggleLoading( )** <sup>&rArr; <code>this</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/BaseCollection.ts#L42-L45)  
> > &emsp;&#x25aa; value <sup><code>boolean</code></sup>  
> > **.model( )** <sup>&rArr; <code>typeof Model</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/BaseCollection.ts#L47-L49)  
> > &emsp;&#x25aa; item <sup><code>Item | [Model](#api-Model)</code></sup>  
> > **.initModel( )** <sup>&rArr; <code>M</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/BaseCollection.ts#L51-L56)  
> > &emsp;&#x25aa; item <sup><code>M | Item</code></sup>  
> > **.replace( )** <sup>&rArr; <code>this</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/BaseCollection.ts#L63-L65)  
> > &emsp;&#x25ab; items<sub>?</sub> <sup><code>Item | Item[]</code></sup>  
> > **.find( )** <sup>&rArr; <code>M | [Model](#api-Model)</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/BaseCollection.ts#L67-L69)  
> > &emsp;&#x25aa; filter <sup><code>object</code></sup>  
> > **.filter( )** <sup>&rArr; <code>M[]</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/BaseCollection.ts#L71-L78)  
> > &emsp;&#x25aa; filter <sup><code>object | FilterIteration&lt;M&gt;</code></sup>  
> > **.removeItem( )** <sup>&rArr; <code>any</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/BaseCollection.ts#L80-L87)  
> > &emsp;&#x25aa; filter <sup><code>object</code></sup>  
>  
> Properties:  
> > **.models** <sup><code>M[]</code></sup>  
> > **.loading** <sup><code>any</code></sup>  
>
> <a name="api-Collection"></a>
> ### Class [`Collection`](#api-Collection)
> Source code: [`<>`](http:///blob/e1e63ce/src/modules/Collection.ts#L8-L85)  
>  
> Methods:  
> > **new( )** <sup>&rArr; <code>[Collection](#api-Collection)&lt;M&gt;</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/Collection.ts#L13-L16)  
> > &emsp;&#x25ab; models<sub>?</sub> <sup><code>Item | Item[]</code></sup>  
> > &emsp;&#x25ab; filters<sub>?</sub> <sup><code>object</code></sup>  
> > **.destruct( )** <sup>&rArr; <code>void</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/Collection.ts#L54-L57)  
> > **.update( )** <sup>&rArr; <code>Promise&lt;[Collection](#api-Collection)&lt;M&gt;&gt;</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/Collection.ts#L59-L76)  
> > &emsp;&#x25ab; filters<sub>?</sub> <sup><code>{}</code></sup>  
> > **.pagination( )** <sup>&rArr; <code>Promise&lt;[Collection](#api-Collection)&lt;M&gt;&gt;</code></sup> [`<>`](http:///blob/e1e63ce/src/modules/Collection.ts#L78-L80)  
> > &emsp;&#x25aa; page <sup><code>number</code></sup>  
>  
> Properties:  
> > **.$timer_id** <sup><code>any</code></sup>  
> > **.$filters** <sup><code>any</code></sup>  
> > **.$pages** <sup><code>any</code></sup>  
>
> <a name="api-Model"></a>
> ### Class [`Model`](#api-Model)
> Source code: [`<>`](http:///blob/support/docs/src/modules/Model.ts#L4-L23)  
>  
> Methods:  
> > **new( )** <sup>&rArr; <code>[Model](#api-Model)</code></sup> [`<>`](http:///blob/support/docs/src/modules/Model.ts#L12-L14)  
> > &emsp;&#x25ab; attributes<sub>?</sub> <sup><code>Attributes</code></sup>  
> > **.init( )** <sup>&rArr; <code>void</code></sup> [`<>`](http:///blob/support/docs/src/modules/Model.ts#L5-L10)  
> > &emsp;&#x25ab; attributes<sub>?</sub> <sup><code>Attributes</code></sup>  
> > **.defaults( )** <sup>&rArr; <code>Attributes</code></sup> [`<>`](http:///blob/support/docs/src/modules/Model.ts#L16-L18)  
> > **.mutations( )** <sup>&rArr; <code>Mutations</code></sup> [`<>`](http:///blob/support/docs/src/modules/Model.ts#L20-L22)  
