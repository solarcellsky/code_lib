/**
 * mapSvg 5.4.4 - Interactive Map Plugin
 *
 * Author - Roman S. Stepanov
 * http://codecanyon.net/user/Yatek/portfolio?ref=Yatek
 *
 * Version : 5.4.4
 * Released: February 23, 2013
 *
 * You must purchase Regular or Extended license to use mapSvg plugin.
 * Visit plugin's page @ CodeCanyon: http://codecanyon.net/item/jquery-interactive-svg-map-plugin/1694201
 * Licenses: http://codecanyon.net/licenses/regular_extended
 */

 (function( $ ) {

    var instances = {};
    var userAgent = navigator.userAgent.toLowerCase();

    // Get plugin's path
    var scripts       = document.getElementsByTagName('script');
    var myScript      = scripts[scripts.length - 1].src.split('/');
        myScript.pop();
    var pluginJSURL   =  myScript.join('/')+'/';
        myScript.pop();
    var pluginRootURL =  myScript.join('/')+'/';

    // Check for iPad/Iphone/Andriod
    var touchDevice =
        (userAgent.indexOf("ipad") > -1) ||
        (userAgent.indexOf("iphone") > -1) ||
        (userAgent.indexOf("ipod") > -1) ||
        (userAgent.indexOf("android") > -1);

    var _browser = {};

    _browser.ie = userAgent.indexOf("msie") > -1 ? {} : false;
    if(_browser.ie)
        _browser.ie.old = (navigator.userAgent.match(/MSIE [6-8]/) !== null);

    _browser.firefox = userAgent.indexOf("firefox") > -1;


    // Create function for retrieving mouse coordinates
    if (touchDevice){
        var mouseCoords = function(e){
            return e.touches[0] ?
            {'x':e.touches[0].pageX, 'y':e.touches[0].pageY} :
            {'x':e.changedTouches[0].pageX, 'y':e.changedTouches[0].pageY};
        };
    }else{
        var mouseCoords = function(e){
            return e.pageX ?
            {'x':e.pageX, 'y':e.pageY} :
            {'x':e.clientX + $('html').scrollLeft(), 'y':e.clientY + $('html').scrollTop()};
        };
    }

    // This data is needed for lat-lon to x-y conversions
    var CBK = [128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648, 4294967296, 8589934592, 17179869184, 34359738368, 68719476736, 137438953472]
    var CEK = [0.7111111111111111, 1.4222222222222223, 2.8444444444444446, 5.688888888888889, 11.377777777777778, 22.755555555555556, 45.51111111111111, 91.02222222222223, 182.04444444444445, 364.0888888888889, 728.1777777777778, 1456.3555555555556, 2912.711111111111, 5825.422222222222, 11650.844444444445, 23301.68888888889, 46603.37777777778, 93206.75555555556, 186413.51111111112, 372827.02222222224, 745654.0444444445, 1491308.088888889, 2982616.177777778, 5965232.355555556, 11930464.711111112, 23860929.422222223, 47721858.844444446, 95443717.68888889, 190887435.37777779, 381774870.75555557, 763549741.5111111]
    var CFK = [40.74366543152521, 81.48733086305042, 162.97466172610083, 325.94932345220167, 651.8986469044033, 1303.7972938088067, 2607.5945876176133, 5215.189175235227, 10430.378350470453, 20860.756700940907, 41721.51340188181, 83443.02680376363, 166886.05360752725, 333772.1072150545, 667544.214430109, 1335088.428860218, 2670176.857720436, 5340353.715440872, 10680707.430881744, 21361414.86176349, 42722829.72352698, 85445659.44705395, 170891318.8941079, 341782637.7882158, 683565275.5764316, 1367130551.1528633, 2734261102.3057265, 5468522204.611453, 10937044409.222906, 21874088818.445812, 43748177636.891624]

    // Default options
    var defaults = {
        keepSourceStyles    : false,
        loadingText         : 'Loading map...',
        //colors              : {base: "#E1F1F1", background: "#eeeeee", hover: "#548eac", selected: "#065A85", stroke: "#7eadc0"},
        colors              : {background: "#eeeeee", selected: 5, hover: 2},
        regions             : {},
        viewBox             : [],
        cursor              : 'default',
        scale               : 1,
        tooltipsMode        : 'hover',
        tooltips            : {show: 'hover', mode: 'names'},
        onClick             : null,
        mouseOver           : null,
        mouseOut            : null,
        disableAll          : false,
        hideAll             : false,
        marks               : null,
        hover_mode          : 'brightness',
        selected_mode       : 'brightness',
        hover_brightness    : 1,
        selected_brightness : 5,
        pan                 : false,
        panLimit            : false,
        panBackground       : false,
        zoom                : false,
        popover             : {width: 'auto', height:  'auto'},
        buttons             : true,
        zoomLimit           : [0,5],
        zoomDelta           : 1.2,
        zoomButtons         : {'show': true, 'location': 'right'},
        multiSelect         : false

    };

    // Default mark style
    var markOptions = {attrs: {'cursor': 'pointer', 'src': pluginRootURL+'markers/_pin_default.png'}};


/** Main Class **/
var mapSVG = function(elem, options){

    var _data;

    this.methods = {


        // destroy
        destroy : function(){
            delete instances[_data.$map.attr('id')];
            _data.$map.empty();
            return _this;
        },
        getData : function(){
          return _data;
        },
        // GET SCALE VALUE
        getScale: function(){

            var ratio_def = _data.svgDefault.width / _data.svgDefault.height;
            var ratio_new = _data.options.width / _data.options.height;
            var scale1, scale2;

            var size = _data.options.responsive ? [_data.$map.width(), _data.$map.height()] : [_data.options.width, _data.options.height];

            if(ratio_new < ratio_def ){
            // Calculate scale by height
                scale1 = _data.svgDefault.width / _data.svgDefault.viewBox[2];
                scale2 = size[0] / _data.viewBox[2];
            }else{
            // Calculate scale by width
                scale1 = _data.svgDefault.height / _data.svgDefault.viewBox[3];
                scale2 = size[1] / _data.viewBox[3];
            }

            return (1 - (scale1-scale2));
        },
        fluidResize : function(w,h){

            if(!w || !h){
                w = _data.$map.width();
                h = _data.$map.height();
            }

           _data.R.setSize(w,h);

           _data.scale = _this.getScale();
           _this.marksAdjustPosition();

           //_data.R.setViewBox(_data.viewBox[0], _data.viewBox[1], _data.viewBox[2], _data.viewBox[3], true);
        },
        // GET VIEBOX [x,y,width,height]
        getViewBox : function(){
            return _data.viewBox;
        },
        // SET VIEWBOX
        setViewBox : function(v){

            if(typeof v == 'string'){
                var coords = _data.ref[v].getBBox();
                _data.viewBox = [coords.x-5, coords.y-5, coords.width+10, coords.height+10];
                var isZooming = true;
            }else{
                var d = (v && v.length==4) ? v : _data.svgDefault.viewBox;
                var isZooming = parseInt(d[2]) != _data.viewBox[2] || parseInt(d[3]) != _data.viewBox[3];
                _data.viewBox = [parseFloat(d[0]), parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3])];
            }

            _data.R.setViewBox(_data.viewBox[0], _data.viewBox[1], _data.viewBox[2], _data.viewBox[3], true);

            if(isZooming){
                _data.scale = _this.getScale();
                _this.marksAdjustPosition();
                if((_browser.ie && !_browser.ie.old) || _browser.firefox){
                        _this.mapAdjustStrokes();
                }

            }

            return true;
        },
        // SET VIEWBOX BY SIZE
        viewBoxSetBySize : function(width,height){

            _data._viewBox = _this.viewBoxGetBySize(width,height);
            _data.viewBox  = $.extend([],_data._viewBox);
            _data.scale    = _this.getScale();

            _data.R.setViewBox(_data.viewBox[0], _data.viewBox[1], _data.viewBox[2], _data.viewBox[3], true);

            _this.marksAdjustPosition();

            return _data.viewBox;
        },
        viewBoxGetBySize : function(width, height){


            var new_ratio = width / height;
            var old_ratio = _data.svgDefault.viewBox[2] / _data.svgDefault.viewBox[3];

            var vb = $.extend([],_data.svgDefault.viewBox);

            if (new_ratio != old_ratio){
                    vb[2] = width*_data.svgDefault.viewBox[2] / _data.svgDefault.width;
                    vb[3] = height*_data.svgDefault.viewBox[3] / _data.svgDefault.height;

            }

            return vb;
        },
        viewBoxReset : function(){
            _this.setViewBox();
        },
        mapAdjustStrokes : function(){
                $.each(_data.ref, function(i,region){
                    if(region.default_attr['stroke-width'])
                        region.attr( {'stroke-width': region.default_attr['stroke-width'] / _data.scale } );
                });
        },
        // ZOOM
        zoomIn: function(){
            _this.zoom(1);
        },
        zoomOut: function(){
            _this.zoom(-1);
        },
        touchZoomStart : function (touchScale){

            touchZoomStart = _data._scale;
            _data.scale  = _data.scale * zoom_k;
            zoom   = _data._scale;
            _data._scale = _data._scale * zoom_k;


            var vWidth     = _data.viewBox[2];
            var vHeight    = _data.viewBox[3];
            var newViewBox = [];

            newViewBox[2]  = _data._viewBox[2] / _data._scale;
            newViewBox[3]  = _data._viewBox[3] / _data._scale;

            newViewBox[0]  = _data.viewBox[0] + (vWidth - newViewBox[2]) / 2;
            newViewBox[1]  = viewBox[1] + (vHeight - newViewBox[3]) / 2;

            _this.setViewBox(newViewBox, true);

        },
        touchZoomMove : function(){

        },
        touchZoomEnd : function(){

        },
        zoom : function (delta, exact){

            var vWidth     = _data.viewBox[2];
            var vHeight    = _data.viewBox[3];
            var newViewBox = [];

            if(!exact){
            // check for zoom limit
                var d = delta > 0 ? 1 : -1;
                _data._zoomLevel = _data.zoomLevel;
                _data._zoomLevel += d;
                if(_data._zoomLevel > _data.options.zoomLimit[1] || _data._zoomLevel < _data.options.zoomLimit[0]) return false;

                _data.zoomLevel = _data._zoomLevel;

                var zoom_k = d * _data.options.zoomDelta;
                if (zoom_k < 1) zoom_k = -1/zoom_k;

                _data._scale         = _data._scale * zoom_k;
                newViewBox[2]  = _data._viewBox[2] / _data._scale;
                newViewBox[3]  = _data._viewBox[3] / _data._scale;
            }else{
                _data._scale         = exact;
                newViewBox[2]  = _data.touchZoomStartViewBox[2] / _data._scale;
                newViewBox[3]  = _data.touchZoomStartViewBox[3] / _data._scale;
            }

            newViewBox[0]  = _data.viewBox[0] + (vWidth - newViewBox[2]) / 2;
            newViewBox[1]  = _data.viewBox[1] + (vHeight - newViewBox[3]) / 2;

            _this.setViewBox(newViewBox, true);
        },
        //  MARK : UPDATE
        markUpdate : function(mark, data){

            if(data.attrs['src']=="")
                delete data.attrs['src'];
            if(data.attrs['href']=="")
                delete data.attrs['href'];

                var img  = new Image();

                img.onload = function(){

                    data.data.width = this.width;
                    data.data.height = this.height;
                    data.attrs.width = parseFloat(data.data.width/_data.scale).toFixed(2);
                    data.attrs.height = parseFloat(data.data.height/_data.scale).toFixed(2);

                    // we don't want href to be active in edit mode
                    if(options.editMode && data.attrs.href){
                            mark.data('href',data.attrs.href);
                            delete data.attrs.href;
                    }else if(options.editMode && !data.attrs.href){
                            mark.removeData('href');
                    }

                    mark.data(data.data);
                    mark.attr(data.attrs);
                };

                img.src  = data.attrs.src;

        },
        // MARK : DELETE
        markDelete: function(mark){
            mark.remove();
        },
        // MARK : ADD
        markAdd : function(opts, create) {

                // Join default mark options with user-defined options
                var mark = $.extend(true, {}, markOptions, opts);

                if (mark.width && mark.height){

                    return _this.markAddFinalStep(mark, create);

                }else{

                    var img = new Image();


                    img.onload = function(){

                        mark.width = this.width;
                        mark.height = this.height;

                        return _this.markAddFinalStep(mark, create);
                    };

                    img.src = mark.attrs.src;
                }
        },
        markAddFinalStep : function(mark, create){
                // We don't need to open a link in edit mode
                var markAttrs = $.extend(true, {}, mark.attrs);

                var width  = parseFloat(mark.width/_data.scale).toFixed(2);
                var height = parseFloat(mark.height/_data.scale).toFixed(2);


                // Get mark's xy OR convert lat/lon to x/y
                var xy = mark.xy ? mark.xy :
                            (mark.attrs.x ? [mark.attrs.x, mark.attrs.y] :
                                (mark.c ? _this.ll2px(mark) : false)
                             );

                if(!xy) return false;

                if(create){
                    xy[0] = xy[0]/_data.scale - mark.width/(2*_data.scale);
                    xy[1] = (xy[1]-mark.height)/_data.scale;
                }

                xy[0] = parseFloat(xy[0]).toFixed(4);
                xy[1] = parseFloat(xy[1]).toFixed(4);

                if(_data.options.editMode)
                    delete markAttrs.href;


                delete markAttrs.width;
                delete markAttrs.height;


                // Add mark (image)
                var RMark = _data.R.image(mark.attrs.src, xy[0], xy[1], width, height)
                             .attr(markAttrs)
                             .data(mark);
                RMark.mapsvg_type = 'mark';


                if(mark.id)
                    RMark.node.id = mark.id;

                if(!_data.options.editMode){
                    if(!touchDevice){
                        RMark.mousedown(function(e){
                                if(this.data('popover')){

                                    _this.showPopover(e, this.data('popover'));
                                }
                                if(_data.options.onClick)
                                    return _data.options.onClick.call(this, e, _this);

                        });

                        if(_data.options.mouseOver){
                            RMark.mouseover(function(e){
                                return _data.options.mouseOver.call(this, e, _this);
                            });
                        }
                        if(_data.options.mouseOut){
                            RMark.mouseout(function(e){
                                return _data.options.mouseOver.call(this, e, _this);
                            });
                        }

                    }else{
                        RMark.touchstart(function(e){
                                if(this.attrs.href){
                                    window.location.href = this.attrs.href;
                                }else if(this.data('popover')){
                                    _this.showPopover(e, this.data('popover'));
                                }
                                if(_data.options.onClick)
                                    return _data.options.onClick.call(this, e, _this);

                        });
                    }
                }

                _this.markEventHandlersSet(_data.options.editMode, RMark);
                _data.RMarks.push(RMark);


                // Call edit window
                if(create)
                    _data.options.marksEditHandler.call(RMark);
                else
                    _this.markAdjustPosition(RMark);


                return RMark;

        },
        marksAdjustPosition : function(mark){

            if(!mark && (!_data.RMarks || _data.RMarks.length < 1)) return false;

            // We want a marker "tip" to be on bottom side (like a pin)
            // But Raphael starts to draw an image from left top corner.
            // At the same time we don't want a mark to be scaled in size when map scales;
            // Mark always should stay the same size.
            // In this case coordinates of bottom point of image will vary with map scaling.
            // So we have to calculate the offset.

            var dx, dy;

            for (var m in _data.RMarks.items){
                var w = _data.RMarks.items[m].data('width');
                var h = _data.RMarks.items[m].data('height');
                dx = w/2 - w/(2*_data.scale);
                dy = h - h/_data.scale;
                if(_browser.ie){
                    w  = parseInt(w);
                    h  = parseInt(h);
                }

                _data.RMarks.items[m].attr({width: w/_data.scale, height: h/_data.scale}).transform('t'+dx+','+dy);
            }

        },
        markAdjustPosition : function(mark){
                var w = mark.data('width');
                var h = mark.data('height');
                var dx = w/2 - w/(2*_data.scale);
                var dy = h - h/_data.scale;
                mark.attr({width: w/(_data.scale), height: h/(_data.scale)}).transform('t'+dx+','+dy);
                //mark.transform('t'+dx+','+dy);
        },
        // GET MARK COORDINATES TRANSLATED TO 1:1 SCALE (used when saving new added marks)
        markGetDefaultCoords : function(markX, markY, markWidth, markHeight, mapScale){
            markX       = parseFloat(markX);
            markY       = parseFloat(markY);
            markWidth   = parseFloat(markWidth);
            markHeight  = parseFloat(markHeight);
            markX       = parseFloat(markX + markWidth/(2*mapScale) - markWidth/2).toFixed(2);
            markY       = parseFloat(markY + markHeight/mapScale - markHeight).toFixed(2);
            return [markX, markY];
        },
        // MARK MOVE & EDIT HANDLERS
        markMoveStart : function(){
            // storing original coordinates
            this.data('ox', parseFloat(this.attr('x')));
            this.data('oy', parseFloat(this.attr('y')));
        },
        markMove : function (dx, dy) {
            dx = dx/_data.scale;
            dy = dy/_data.scale;
            this.attr({x: this.data('ox') + dx, y: this.data('oy') + dy});
        },
        markMoveEnd : function () {
            // if coordinates are same then it was a "click" and we should start editing
            if(this.data('ox') == this.attr('x') && this.data('oy') == this.attr('y')){
               options.marksEditHandler.call(this);
            }
        },
        panStart : function (e){


                if(e.target.id == 'btnZoomIn' || e.target.id == 'btnZoomOut')
                    return false;

                e.preventDefault();
                var ce = e.touches && e.touches[0] ? e.touches[0] : e;

                _data.pan = {};

                // initial viewbox when panning started
                _data.pan.vxi = _data.viewBox[0];
                _data.pan.vyi = _data.viewBox[1];
                // mouse coordinates when panning started
                _data.pan.x  = ce.clientX;
                _data.pan.y  = ce.clientY;
                // mouse delta
                _data.pan.dx = 0;
                _data.pan.dy = 0;
                // new viewbox x/y
                _data.pan.vx = 0;
                _data.pan.vy = 0;

                if(!touchDevice)
                    $('body').on('mousemove', _this.panMove).on('mouseup', _this.panEnd);
        },
        panMove :  function (e){

                e.preventDefault();

                _data.isPanning = true;

                _data.RMap.attr({'cursor': 'move'});
                $('body').css({'cursor': 'move'});

                var ce = e.touches && e.touches[0] ? e.touches[0] : e;

                // delta x/y
                _data.pan.dx = (_data.pan.x - ce.clientX);
                _data.pan.dy = (_data.pan.y - ce.clientY);

                // new viewBox x/y
                var vx = parseInt(_data.pan.vxi + _data.pan.dx /_data.scale);
                var vy = parseInt(_data.pan.vyi + _data.pan.dy /_data.scale);

                // Limit pan to map's boundaries
                if(_data.options.panLimit){
                    if(vx < _data.svgDefault.viewBox[0])
                        vx = _data.svgDefault.viewBox[0];
                    else if(_data.viewBox[2] + vx > _data.svgDefault.viewBox[2])
                        vx = _data.svgDefault.viewBox[2]-_data.viewBox[2];

                    if(vy < _data.svgDefault.viewBox[1])
                        vy = _data.svgDefault.viewBox[1];
                    else if(_data.viewBox[3] + vy > _data.svgDefault.viewBox[3])
                        vy = _data.svgDefault.viewBox[3]-_data.viewBox[3];
                }

                _data.pan.vx = vx;
                _data.pan.vy = vy;


                // set new viewBox
                _this.setViewBox([_data.pan.vx,  _data.pan.vy, _data.viewBox[2], _data.viewBox[3]]);

        },
        panEnd : function (e){

                _data.isPanning = false;

                // call regionClickHandler if mouse did not move more than 5 pixels
                if (_data.region_clicked && Math.abs(_data.pan.dx)<5 && Math.abs(_data.pan.dy)<5)
                    _this.regionClickHandler(e, _data.region_clicked);

                $('body').css({'cursor': 'default'});
                _data.RMap.attr({'cursor': _data.options.cursor});

                _data.viewBox[0] = _data.pan.vx || _data.viewBox[0];
                _data.viewBox[1] = _data.pan.vy || _data.viewBox[1] ;

                if(!touchDevice)
                    $('body').off('mousemove', _this.panMove).off('mouseup', _this.panEnd);
        },
        // REMEMBER WHICH REGION WAS CLICKED BEFORE START PANNING
        panRegionClickHandler : function (e, region) {
                _data.region_clicked = region;
        },
        touchStart : function (e){
            e.preventDefault();
            if(_data.options.zoom && e.touches && e.touches.length == 2){
                _data.touchZoomStartViewBox = _data.viewBox;
                _data.touchZoomStart =  _data.scale;
                _data.touchZoomEnd   =  1;
            }else{
                _this.panStart(e);
                _data.isPanning = true;
            }
        },
        touchMove : function (e){
            e.preventDefault();
            if(_data.options.zoom && e.touches && e.touches.length >= 2){
                _this.zoom(null, e.scale);
                _data.isPanning = false;
            }else if(_data.isPanning){
                _this.panMove(e);
            }
        },
        touchEnd : function (e){
            e.preventDefault();
                if(_data.touchZoomStart){
                   _data.touchZoomStart  = false;
                   _data.touchZoomEnd    = false;
                }else if(_data.isPanning){
                    _this.panEnd(e);
                }
        },
        marksHide : function(){
            _data.RMarks.hide();
        },
        marksShow : function(){
            _data.RMarks.show();
        },
        // GET ALL MARKS
        marksGet : function(){
            var _marks = [];
            $.each(_data.RMarks, function(i, m){
                    if(m.attrs){
                    // If mark exist
                        var attrs = $.extend({},m.attrs);
                        if(!m.data('placed')){
                            var xy = _this.markGetDefaultCoords(m.attrs.x, m.attrs.y, m.data('width'), m.data('height'), _data.scale);
                            attrs.x = xy[0];
                            attrs.y = xy[1];
                        }

                        if(m.data('href'))
                            attrs.href = m.data('href');

                        _marks.push({
                            attrs:    attrs,
                            tooltip:  m.data('tooltip'),
                            popover:  m.data('popover'),
                            width:    m.data('width'),
                            height:   m.data('height'),
                            href:     m.data('href'),
                            placed:   true
                        });
                    }
            });
            return _marks;
        },
        // GET SELECTED REGION OR ARRAY OF SELECTED REGIONS
        getSelected : function(){
            return _data.selected_id;
        },
        // SELECT REGION
        selectRegion :    function(id){
                if(!_data.ref[id] || _data.ref[id].disabled) return false;

                if(_data.options.multiSelect){
                // if multi select is ON
                    var i = $.inArray(id, _data.selected_id);

                    if(i >= 0){
                    // if selected, deselect
                        _data.ref[id].attr({'fill' : _data.ref[id].default_attr.fill});
                        _data.selected_id.splice(i,1);
                        return;
                    }else{
                    // select
                        _data.selected_id.push(id);
                    }
                }else{
                // single select
                    if(_data.selected_id)
                        _data.ref[_data.selected_id].attr(_data.ref[_data.selected_id].default_attr);
                    _data.selected_id = id;
                }

                //_data.ref[id].attr({'stroke-width': _data.ref[id].default_attr['stroke-width']*2});
                _data.ref[id].attr(_data.ref[id].selected_attr);

        },
        // UNHIGHLIGHT REGION
        unhighlightRegion :   function(id){

                if(_data.ref[id].disabled
                   || (_data.options.multiSelect && $.inArray(id,_data.selected_id)>=0)
                   || _data.selected_id == id
                   ) return false;

                _data.ref[id].attr({'fill' : _data.ref[id].default_attr.fill});
        },
        // HIGHLIGHT REGION
        highlightRegion : function(id){
                if(_data.isPanning
                    || _data.ref[id].disabled
                    || (_data.options.multiSelect && $.inArray(id,_data.selected_id)>=0)
                    || _data.selected_id == id
                   )
                    return false;

                _data.ref[id].attr(_data.ref[id].hover_attr);
        },
        // CONVERT LAT/LON TO X/Y (works only with world_high.svg map!)
        ll2px : function(mark){

                var latlng = mark.c;

                var lat = parseFloat(latlng[0]);
                var lng = parseFloat(latlng[1]);

                var czoom = 2;

                var cbk = CBK[czoom];
                //var scale = options.width/1024;
                var scale_ = 1;

                var x = Math.round(cbk + (lng * CEK[czoom]));

                var foo = Math.sin(lat * 3.14159 / 180)
                if (foo < -0.9999)
                    foo = -0.9999;
                else if (foo > 0.9999)
                    foo = 0.9999;

                var y = Math.round(cbk + (0.5 * Math.log((1+foo)/(1-foo)) * (-CFK[czoom])));

                var coordsXY  = [x-(33.8+(mark.width/2)), y-(141.7+mark.height)];

                return coordsXY;
       },
       // CHECK IF REGION IS DISABLED
       isRegionDisabled : function (name, svgfill){
            if(_data.options.regions[name] && (_data.options.regions[name].disabled || svgfill == 'none') ){
                return true;
            }else if(_data.options.disableAll || svgfill == 'none' || name == 'labels' || name == 'Labels'){
                return true;
            }else{
                return false;
            }
       },
       regionClickHandler : function(e, region){

            if(!region) return false;

            _data.region_clicked = null;
            _this.selectRegion(region.name);
            _this.hidePopover();

            if(region.popover)
                _this.showPopover(e, region.popover);

            if(_data.options.onClick)
                return _data.options.onClick.call(region, e, _this);

            if(touchDevice && region.attrs.href)
                window.location.href = region.attrs.href;

       },
       addText : function (textObj){

            var styles = _this.getElementStyles(textObj);

            var text = $.map($(textObj).find('tspan'), function(val,i){
                                                                        return $(val).text();
                                                                      });


            if(!text.length)
                text = [$(textObj).text()];


            var fontSize = parseInt(styles.getPropertyValue('font-size'));
            var delta = text.length > 1 ? -fontSize*text.length/(2*1.5) : fontSize/2;
            text = text.join('\n');

            var x = $(textObj).attr('x');
            var y = $(textObj).attr('y') - delta;

            var t = _data.R.text(x, y, text)
            .attr({
                    'font-size': fontSize,
                    'font-family': styles.getPropertyValue('font-family') +', sans-serif, verdana',
                    'font-weight': styles.getPropertyValue('font-weight') || 'normal',
                    'fill': _data.options.colors.font || styles.getPropertyValue('fill') || '#000',
                    'text-anchor': 'start'});

            t.mapsvg_type = 'text';

            $(t.node).css({
            	"-webkit-touch-callout": "none",
            	"-webkit-user-select": "none",
                'cursor': 'default',
                'pointer-events': 'none'
            });



       },
       // GET ELEMENT'S STYLES (fill, strokes etc..)
       getElementStyles : function (elem){
            if(!_browser.ie){
                return elem.style;
            }else{
                var styles = {};
                styles.getPropertyValue = function(v){
                    return styles[v] || undefined;
                };
                if($(elem).attr('style')){
                    var def_styles = $(elem).attr('style').split(';');
                    $.each(def_styles, function(i, val){
                        var p = val.split(':');
                        styles[p[0]] = p[1];
                    });
                }
                return styles;
            }
       },
       // ADD REGION (PARSE SVG DATA)
       regionAdd : function (_item){

            var styles                    = _this.getElementStyles(_item);
            var svgfill                   = styles.getPropertyValue('fill') || $(_item).attr('fill');
            var name                      = $(_item).attr('id');

            _data.ref[name]               = _data.R.path( $(_item).attr('d') );
            _data.ref[name].mapsvg_type   = 'region';
            _data.ref[name].id            = name;
            _data.ref[name].node.id       = name;
            _data.ref[name].name          = name;
            _data.ref[name].disabled      = _this.isRegionDisabled(name, svgfill);
            _data.ref[name].default_attr  = {};

            _data.ref[name].default_attr['fill']         = svgfill || 'none';
            if(_data.ref[name].default_attr['fill'] && _data.ref[name].default_attr['fill'] != 'none' && _data.options.colors.base)
                _data.ref[name].default_attr['fill'] = _data.options.colors.base;

            var opacity = _data.options.colors['fill-opacity'] || styles.getPropertyValue('fill-opacity') || $(_item).attr('fill-opacity');
            if(opacity)
                _data.ref[name].default_attr['fill-opacity'] = opacity;

            _data.ref[name].default_attr['stroke']       = styles.getPropertyValue('stroke') ||  $(_item).attr('stroke') || 'none';
            if(_data.ref[name].default_attr['stroke'])
                _data.ref[name].default_attr['stroke-width'] = styles.getPropertyValue('stroke-width') || $(_item).attr('stroke-width');

            console.log(_data.ref[name].default_attr['fill'], _data.ref[name].default_attr['stroke']);
            if(_data.ref[name].default_attr['fill']=='none' && _data.ref[name].default_attr['stroke']=='none'){
                _data.ref[name].default_attr['fill'] = '#000000';

            }


            if(_data.ref[name].default_attr['stroke'] && _data.ref[name].default_attr['stroke'] != 'none' && _data.options.colors.stroke)
                    _data.ref[name].default_attr['stroke'] = _data.options.colors.stroke;
            if(_data.ref[name].default_attr['stroke-width'] && _data.options.strokeWidth)
                    _data.ref[name].default_attr['stroke-width'] = _data.options.strokeWidth;

            _data.ref[name].selected_attr = {};
            _data.ref[name].hover_attr = {};

            // Set cursor
            if(_data.ref[name].disabled){
                _data.ref[name].default_attr.cursor = 'defalut';
                $(_data.ref[name].node).css({'pointer-events' :'none'});
            }else{
                _data.ref[name].default_attr.cursor = _data.options.cursor;
            }

            if(_data.options.regions[name]){
                // Set attributes (colors, href, etc..)
                if(_data.options.regions[name].attr)
                    _data.ref[name].default_attr = $.extend(true, {}, _data.ref[name].default_attr, _data.options.regions[name].attr);
                // Set tooltip
                if(_data.options.regions[name].tooltip)
                    _data.ref[name].tooltip = _data.options.regions[name].tooltip;
                // Set popover
                if(_data.options.regions[name].popover)
                    _data.ref[name].popover = _data.options.regions[name].popover;
                // Add custom data
                if(_data.options.regions[name].data)
                    _data.ref[name].data(options.regions[name].data);
            }

            if(typeof _data.options.colors.selected == 'string')
                _data.ref[name].selected_attr['fill'] = _data.options.colors.selected;
            else
                _data.ref[name].selected_attr['fill'] = _this.lighten(_data.ref[name].default_attr.fill, _data.options.colors.selected);

            if(typeof _data.options.colors.hover == 'string')
                _data.ref[name].hover_attr['fill'] = _data.options.colors.hover;
            else
                _data.ref[name].hover_attr['fill'] = _this.lighten(_data.ref[name].default_attr.fill, _data.options.colors.hover);



            // If stroke is dashed, convert it to simple: - - - - -
            var dash = styles.getPropertyValue('stroke-dasharray')  || $(_item).attr('stroke-dasharray');
            if( dash && dash!='none')
                _data.ref[name].default_attr['stroke-dasharray'] = '--';


            _data.ref[name].attr(_data.ref[name].default_attr);

            // Make stroke-width always the same:
            if(!_browser.ie && !_browser.firefox)
                $(_data.ref[name].node).css({'vector-effect' : 'non-scaling-stroke'});

            // Add region to Raphael.set()
            _data.RMap.push(_data.ref[name]);

            // Should we select the region now?
            if(_data.options.regions[name] && _data.options.regions[name].selected)
                _this.selectRegion(name);
        },

        /** Lighten / Darken color
         *  Taken from http://stackoverflow.com/questions/801406/c-create-a-lighter-darker-color-based-on-a-system-color/801463#801463
         */

        lighten2: function(hexColor, factor){
                var h = (hexColor.charAt(0)=="#") ? hexColor.substring(1,7) : hexColor;
                var hsb = Raphael.rgb2hsb(parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16),parseInt(h.substring(4,6),16));
                hsb.b += .1;
                return Raphael.hsb(hsb);
        },
        lighten: function ( hexColor, delta ){

            if(!hexColor) return false;

            delta = parseInt(delta)*0.008;

            var rgb = Raphael.getRGB(hexColor);
            var hsb = Raphael.rgb2hsb(rgb.r, rgb.g, rgb.b);

            var b   = hsb.b + delta;

            if(b >= 1){
                b = 1;
                hsb.s = hsb.s - delta*1.5;
            }else if (b <= 0){
                b = 0;
            }

            var new_rgb = Raphael.hsb2rgb(hsb.h, hsb.s, b);

            return new_rgb.hex;

        },
        setPan : function(on){
            if(on){
                _data.options.pan = true;
                _data.$map.on('mousedown', _this.panStart);
            }else{
                if(_data.options.pan)
                  _data.$map.off('mousedown', _this.panStart);
                _data.options.pan = false;
            }
        },
        markAddClickHandler : function(e){
            // Don't add marker if marker was clicked
            if($(e.target).is('image')) return false;
            var x = e.offsetX == undefined ? e.layerX : e.offsetX;
            var y = e.offsetY == undefined ? e.layerY : e.offsetY;
            _this.markAdd({xy: [x, y]}, true);
        },
        markEventHandlersSet : function(on, mark){

            on = _this.parseBoolean(on);

            if(on){
                if(_data.options.editMode === false)
                    mark.unhover();
                mark.drag(_this.markMove, _this.markMoveStart, _this.markMoveEnd);

            }else{
                if(_data.options.editMode)
                    mark.undrag();

                mark.hover(
                     function(){
                        if(this.data('tooltip')){
                            _data.mapTip.html( this.data('tooltip') );
                            _data.mapTip.show();
                        }
                     },
                     function(){
                        if(this.data('tooltip'))
                            _data.mapTip.hide();
                });

            }
        },
        setMarksEditMode : function(on, mark){

            on = _this.parseBoolean(on);

            if(on){
                _data.$map.on('click',_this.markAddClickHandler);
            }else{
                _data.$map.off('click',_this.markAddClickHandler);
            }

            _data.options.editMode = on;
        },
        setZoom : function (on){
            if(on){
                _data.options.zoom = true;
                _data.$map.bind('mousewheel.mapsvg',function(event, delta, deltaX, deltaY) {
                    var d = delta > 0 ? 1 : -1;
                    _this.zoom(d);
                    return false;
                });

                // Add zoom buttons
                if(_data.options.zoomButtons.show){

                    var buttons = $('<div></div>');

                    var cssBtn = {'border-radius': '3px', 'display': 'block', 'margin-bottom': '7px'};

                    var btnZoomIn = $('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABhElEQVR4nJWTT4rqQBDGf92pSEJWmYfgQpABb+EB1NU8DyBe5M1q5iKStTCDd/AWggElC3EQJAQxbb/NJDH+mccraEh31fdVfR8pBRBF0Uuapn+AX8CZn0MDuyAI3sfj8aeaTqcvWZZ9XFdZazmdTgC4rotS6oYpCILfkmXZ6yNwt9tFKcVyucRxnBuSNE1fNfB0TWCModlsMhwOGQwGdDod8jy/J+dJP9JsjKl9W2vvlZ3lcuyiS57ntY7FvZDgum6Zk0vN7XYbay3GGMIwLItarRbGGEQErTVxHON5XkVQAEaj0b0x6fV6tXsURRwOBxzHQd9F/CPO58o2ARARdrsds9ms9CIMQ/r9PgCLxYL1eo3rulhr2e/3dQkAnueRJElp2vF4LLskScJmsynNK8A1AqjcVUohUqVEBBGpuV+E/j63CV093/sLizIBvoDny1fHcdhut8znc5RSrFar2kQX8aV933+7ZldK0Wg0iOO4BD9YpjcF8L2R/7XOvu+/TyaTz79+UqnWsVHWHAAAAABJRU5ErkJggg==" id="btnZoomIn"/>').on('click', function(e){
                        e.stopPropagation();
                        _this.zoomIn();
                    }).css(cssBtn);

                    var btnZoomOut = $('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA6klEQVR4nKWTPW6DQBBG3w4RaLXSFs4puAe9fQHEReLKPgYN4gLxQei5RNytFraANNEKKwk29uum+N78SKMA2rbdO+c+gHdgYh0Bvowx57IsL6ppmr33/vNO6E+MMQfx3h+fCQM4544C7J4VADvh/s5rTG/LKoTANK37RIQ0TWMdBSEE8jwnyzLmef437L2n7/soiQLnHEVRPDR313VRIA8lVogTWGup6/pmhSRJAFBKxcAwDFhrfwuSJCGEwDiOqx2VUlF8I1h23ILw2h1EgOsLgqtorU/LI23BGHNSAD8fuemdtdbnqqou39SbTK6RdYDsAAAAAElFTkSuQmCC" id="btnZoomOut"/>').on('click', function(e){
                        e.stopPropagation();
                        _this.zoomOut();
                    }).css(cssBtn);

                    buttons.append(btnZoomOut).append(btnZoomIn).css({position: 'absolute', top: '15px', width: '16px', cursor: 'pointer'});

                    if(_data.options.zoomButtons.location == 'right')
                        buttons.css({'right': '15px'});
                    else if(_data.options.zoomButtons.location == 'left')
                        buttons.css({'left': '15px'});

                    _data.zoomButtons = buttons;

                    _data.$map.append(_data.zoomButtons);
                }

            }else{
                if(_data.options.zoom)
                    _data.$map.unbind('mousewheel.mapsvg');
                if(_data.zoomButtons)
                    _data.zoomButtons.hide();
                _data.options.zoom = false;
            }
        },
        setSize : function( width, height, responsive ){

            // Convert strings to numbers
            _data.options.width      = parseInt(width);
            _data.options.height     = parseInt(height);
            _data.options.responsive = _this.parseBoolean(responsive);

            // Calculate width and height
            if ((!_data.options.width && !_data.options.height)){
                _data.options.width	 = _data.svgDefault.width;
                _data.options.height = _data.svgDefault.height;
            }else if (!_data.options.width && _data.options.height){
            	_data.options.width	 = parseInt(_data.options.height * _data.svgDefault.width / _data.svgDefault.height);
            }else if (_data.options.width && !_data.options.height){
            	_data.options.height = parseInt(_data.options.width * _data.svgDefault.height/_data.svgDefault.width);
            }

            if(_data.options.responsive){
                var maxWidth  = _data.options.width;
                var maxHeight = _data.options.height;
                _data.options.width	 = _data.svgDefault.width;
                _data.options.height = _data.svgDefault.height;
            }

            _data.whRatio      = _data.options.width / _data.options.height;
            _data.scale        = _this.getScale();

            if(_data.options.responsive){

                _data.$map.css({
                    'max-width': maxWidth+'px',
                    'max-height': maxHeight+'px',
                    'width': 'auto',
                    'height': 'auto',
                    'position': 'relative'
                }).height(_data.$map.width()  / _data.whRatio);

                $(window).bind('resize.mapsvg', function(){
                    _data.$map.height(_data.$map.width() / _data.whRatio);
                });
            }else{
                _data.$map.css({
                    'width': _data.options.width+'px',
                    'height': _data.options.height+'px',
                    'max-width': 'none',
                    'max-height': 'none',
                    'position': 'relative'
                });
                $(window).unbind('resize.mapsvg');
            }

            if(!_data.options.responsive && _data.R)
                _data.R.setSize(_data.options.width, _data.options.height);

            return [_data.options.width, _data.options.height];


        },
        // Adding marks
        setMarks : function (marksArr){
            if(marksArr){
                $.each(marksArr, function(i, mark){
                        _this.markAdd(mark);
                });
            }
        },

        // Show tooltip (this function will be defined later in setTooltip method)
        showTip : function(){},
        showPopover : function(){},
        // Hide tooltip
        hideTip : function (){
            _data.mapTip.hide();
            _data.mapTip.html('');
        },
        // Set tooltip behaviour
        setTooltip : function (mode){

            // Add tooltip container
            _data.mapTip = $('<div id="map_tooltip"></div>');
            $("body").append(_data.mapTip);

            _data.mapTip.css({
               'font-weight': 'normal',
               'font-size' : '12px',
               'color': '#000000',
               'position': 'absolute',
               'border-radius' : '4px',
               '-moz-border-radius' : '4px',
               '-webkit-border-radius' : '4px',
               'top': '0',
               'left': '0',
               'z-index': '1000',
               'display': 'none',
               'background-color': 'white',
               'border': '1px solid #eee',
               'padding': '4px 7px',
               'max-width': '600px'
            });

            if(_data.options.tooltips.show == 'hover'){
                _data.$map.mousemove(function(e) {
                    _data.mapTip.css('left', e.pageX).css('top', e.pageY + 30);
                });
            }

            _this.showTip = (_data.options.tooltipsMode == 'custom' ?
                function (name){
                    if(_data.ref[name].tooltip){
                        _data.mapTip.html(_data.ref[name].tooltip);
                        _data.mapTip.show();
                    }
                }: _data.options.tooltipsMode == 'names' ?
                function (name){
                        if(_data.ref[name].disabled) return false;
                        _data.mapTip.html(name.replace(/_/g, ' '));
                        _data.mapTip.show();
                }: _data.options.tooltipsMode == 'combined' ?
                function (name){
                    if(_data.ref[name].tooltip){
                        _data.mapTip.html(_data.ref[name].tooltip);
                        _data.mapTip.show();
                    }else{
                        if(_data.ref[name].disabled) return false;
                        _data.mapTip.html(name.replace(/_/g, ' '));
                        _data.mapTip.show();
                    }
                }: function(name){null;}
            );

        },
        // Set popover behaviour
        setPopover : function (on){

            if(!on) return false;

            // Add tooltip container
            $("body").prepend('<div class="map_popover"><div class="map_popover_content"></div><div class="map_popover_close">x</div></div>');

            _data.mapPopover = $('.map_popover');

            var popoverClose = _data.mapPopover.find('.map_popover_close');


            _data.mapPopover.css({
               'font-weight': 'normal',
               'font-size' : '12px',
               'color': '#000000',
               'position': 'absolute',
               'border-radius' : '4px',
               '-moz-border-radius' : '4px',
               '-webkit-border-radius' : '4px',
               'top': '0',
               'left': '0',
               'z-index': '1000',
               'width': _data.options.popover.width+(_data.options.popover.width=='auto'? '': 'px'),
               'height': _data.options.popover.height+(_data.options.popover.height=='auto'? '': 'px'),
               'display': 'none',
               'background-color': 'white',
               'border': '1px solid #ccc',
               'padding': '12px',
               '-webkit-box-shadow': '5px 5px 5px 0px rgba(0, 0, 0, 0.2)',
               'box-shadow': '5px 5px 5px 0px rgba(0, 0, 0, 0.2)'

            });

            popoverClose.css({
                'position': 'absolute',
                'top': '0',
                'right' : '5px',
                'cursor': 'pointer',
                'color': '#aaa',
                'z-index' : '1200'

            });

            _this.showPopover = function (e, content, pos){

                                    if (!pos || pos.length != 2){
                                        var m   = mouseCoords(e);
                                        var pos = [m.x, m.y];
                                    }

                                    if(content){
                                        _data.mapPopover.find('.map_popover_content').html(content);
                                        var nx = pos[0] - _data.mapPopover.outerWidth()/2;
                                        var ny = pos[1] - _data.mapPopover.outerHeight() - 7;
                                        if(nx<0) nx = 0;
                                        if(ny<0) ny = 0;

                                        if(nx+_data.mapPopover.outerWidth() > $(window).scrollLeft() + $(window).width()) nx = ($(window).scrollLeft() + $(window).width()) - _data.mapPopover.outerWidth();
                                        if(ny+_data.mapPopover.outerHeight() > $(window).scrollTop() + $(window).height()) ny = ($(window).scrollTop() + $(window).height()) - _data.mapPopover.outerHeight();
                                        if(nx < $(window).scrollLeft()) nx = $(window).scrollLeft();
                                        if(ny < $(window).scrollTop()) ny = $(window).scrollTop();

                                        _data.mapPopover.css('left', nx).css('top', ny);
                                        _data.mapPopover.show();

                                    }
                                  };
            _this.hidePopover = function(){

                _data.mapPopover.find('.map_popover_content').html('');
                _data.mapPopover.hide();

            };

            popoverClose.on('click', _this.hidePopover);

        },
        popoverOffHandler : function(e){
            if(!$(e.target).closest('#map_popover').length)
                _this.hidePopover();
        },
        parseBoolean : function (string) {
          switch (String(string).toLowerCase()) {
            case "true":
            case "1":
            case "yes":
            case "y":
              return true;
            case "false":
            case "0":
            case "no":
            case "n":
              return false;
            default:
              return undefined;
          }
        },
        mouseOverHandler : function(){},
        mouseOutHandler : function(){},
        mouseDownHandler : function(){},
        // INIT
        init    : function(opts, elem) {

            if(!opts.source) {
                alert('mapSVG Error: Please provide a map URL');
                return false;
            }

            // Cut protocol (http: || https:) - to avoid "cross-domain" error
            if(opts.source.indexOf('http://') == 0 || opts.source.indexOf('https://') == 0)
                opts.source = "//"+opts.source.split("://").pop();

            opts.pan  = _this.parseBoolean(opts.pan);
            opts.zoom = _this.parseBoolean(opts.zoom);
            opts.responsive  = _this.parseBoolean(opts.responsive);
            opts.disableAll  = _this.parseBoolean(opts.disableAll);
            opts.multiSelect = _this.parseBoolean(opts.multiSelect);

            // If veiwBox is set as string region's name (or country name)
            // then we'll calculate veiwBox parameters later
            if(opts.viewBox && typeof opts.viewBox == 'string'){
                opts.viewBoxFind = opts.viewBox;
                delete opts.viewBox;
            }

            /** Setting _data **/
            _data  = {};

            _data.options = $.extend(true, {}, defaults, opts);

            _data.map  = elem;
            _data.$map = $(elem);
            _data.whRatio = 0;
            _data.isPanning = false;
            _data.showTip = {};
            _data.markOptions = {};
            _data.svgDefault = {};
            _data.mouseDownHandler;
            _data.mapAttrs      = {};
            _data.ref = {};

            _data.scale  = 1;         // absolute scale
            _data._scale = 1;         // relative scale starting from current zoom level

            _data.selected_id   =  _data.options.multiSelect ? [] : 0;
            _data.mapData       = {};
            _data.ref           = {};
            _data.marks         = [];
            _data._viewBox      = []; // initial viewBox
            _data.viewBox       = []; // current viewBox
            _data.viewBoxZoom   = [];
            _data.viewBoxFind   = undefined;
            _data.zoomLevel     = 0;
            _data.pan           = {};
            _data.zoom;
            _data.touchZoomStart;
            _data.touchZoomStartViewBox;
            _data.touchZoomEnd;
            /****/


            // Set background
            _data.$map.css({
                             'background': _data.options.colors.background,
                             'height': '100px',
                             'position' : 'relative'
                           });

            var loading = $('<div>'+_data.options.loadingText+'</div>').css({
                position: 'absolute',
                top:  '50%',
                left: '50%',
                'z-index': 1,
                padding: '7px 10px',
                'border-radius': '5px',
                '-webkit-border-radius': '5px',
                '-moz-border-radius': '5px',
                '-ms-border-radius': '5px',
                '-o-border-radius': '5px',
                'border': '1px solid #ccc',
                background: '#f5f5f2',
                color: '#999'
            });

            _data.$map.append(loading);

            loading.css({
                'margin-left': function () {
                    return -($(this).outerWidth() / 2)+'px';
                },
                'margin-top': function () {
                    return -($(this).outerHeight() / 2)+'px';
                }
            });


            // Attributes for regions in different states
            _data.mapAttrs = {
                strokes : {
                	stroke:            _data.options.colors.stroke,
                	"stroke-width":    _data.options.strokeWidth,
                	"stroke-linejoin": "round"
                },
                def : {
                	fill: _data.options.colors.base       // Base color
                },
                disabled : {
                	fill: _data.options.colors.disabled   // Disabled color
                },
                hover  : {
                	fill: _data.options.colors.hover      // Hover color
                },
                selected : {
                	fill: _data.options.colors.selected   // Selected color
                }
            };

            // GET the map by ajax request
            $.ajax({
                url: _data.options.source,
                contentType: "image/svg+xml; charset=utf-8",
                //dataType: (_browser.ie) ? 'text' : 'xml', // check if IE
                beforeSend: function(x) {
                        if(x && x.overrideMimeType) {
                            x.overrideMimeType("image/svg+xml; charset=utf-8");
                        }
                    },
                success:  function(xmlData){

                    data = xmlData;

                    // Default width/height/viewBox from SVG
                    var svgTag         = $(data).find('svg');
                    _data.svgDefault.width   = parseFloat(svgTag.attr('width').replace(/px/g,''));
                    _data.svgDefault.height  = parseFloat(svgTag.attr('height').replace(/px/g,''));
                    _data.svgDefault.viewBox = svgTag.attr('viewBox') ? svgTag.attr('viewBox').split(' ') : [0,0, _data.svgDefault.width, _data.svgDefault.height];

                    $.each(_data.svgDefault.viewBox, function(i,v){
                        _data.svgDefault.viewBox[i] = parseInt(v);
                    });

                    _data._viewBox  = (_data.options.viewBox.length==4) ? _data.options.viewBox : _data.svgDefault.viewBox;

                    $.each(_data._viewBox, function(i,v){
                        _data._viewBox[i] = parseInt(v);
                    });


                    // Set size
                    _this.setSize(_data.options.width, _data.options.height, _data.options.responsive);

                    // Attach Raphael to given jQuery element

                    // IE 7&8 doesn't support responsive size so we just set
                    // width and height in pixels, and then resize it on window.resize event.
                    // For all other cool browsers we just set width and height
                    // to 100% to simply fit DIV container.
                    if(_browser.ie && _browser.ie.old){

                        _data.R = Raphael(_data.$map.attr('id'), _data.options.width, _data.options.height);
                        _data.scale = _this.getScale();

                        if(_data.options.responsive)
                            $(window).on('resize', _this.fluidResize);

                    }else{
                        _data.R = Raphael(_data.$map.attr('id'), '100%', '100%');

                        if(_data.options.responsive){
                            $(window).on('resize', function(e){
                                _data.scale = _this.getScale();
                                _this.marksAdjustPosition();
                            });
                        }
                    }

                    // Adding moving sticky draggable image on background
                    if(_data.options.panBackground)
                        _data.background = _data.R.rect(_data.svgDefault.viewBox[0],_data.svgDefault.viewBox[1],_data.svgDefault.viewBox[2],_data.svgDefault.viewBox[3]).attr({fill: _data.options.colors.background});

                	_data.RMap     = _data.R.set();
                    _data.RMarks   = _data.R.set();


                    // Render each path in SVG
                    $('path',data).each(function(i, _item){
                        _this.regionAdd(_item);
                    });

                    // Set viewBox
                    var v = _data.options.viewBoxFind || _data._viewBox;
                    _this.setViewBox(v);


                    // Render text elements
                    $('text',data).each(function(i, _item){
                        _this.addText(_item);
                    });


                    // If there are markers, put them to the map
                    _this.setMarks(_data.options.marks);
                    _this.setMarksEditMode(_data.options.editMode);

                    // Set panning
                    _this.setPan(_data.options.pan);

                    // Set zooming by mouswheel
                    _this.setZoom(_data.options.zoom);


                    // Set tooltips
                    _this.setTooltip(_data.options.tooltips.mode);

                    // Set popovers
                    _this.setPopover(_data.options.popover);


                    if(_data.options.responsive && _browser.ie && _browser.ie.old)
                        _this.fluidResize();


                    if((_browser.ie && !_browser.ie.old) || _browser.firefox)
                            _this.mapAdjustStrokes();


                    //Create event handlers
                    var funcStr = '';

                    /*
                     * Now let's add event handlers.
                     * Please note that we don't need mouseOver / mouseOut on mobile devices (iPad etc..)
                     */
                    if(!touchDevice){
                        // 1. MouseOver
                        funcStr = 'methods.highlightRegion(this.name);';
                        if(_data.options.tooltips.show == 'hover')
                            funcStr += 'methods.showTip(this.name);';
                        if(_data.options.mouseOver)
                            funcStr += 'return options.mouseOver.call(this, e, methods);';

                        _this.mouseOverHandler = new Function('e, methods, options', funcStr);

                        // 2. MouseOut
                        funcStr = '';
                        funcStr += 'methods.unhighlightRegion(this.name);';
                        if(_data.options.tooltips.show == 'hover')
                            funcStr += 'methods.hideTip();';
                        if(_data.options.mouseOut)
                            funcStr += 'return options.mouseOut.call(this, e, methods);';
                        _this.mouseOutHandler = new Function('e, methods, options', funcStr);
                    }

                    // 3. MouseDown
                    funcStr = '';
                    funcStr = 'methods.regionClickHandler.call(mapObj, e, this);';
                    _this.mouseDownHandler = new Function('e, methods', funcStr);


                    /* EVENTS */
                    if(!touchDevice){
                    	_data.RMap
                            .mouseover( function(e){_this.mouseOverHandler.call(this, e, _this, options);} )
                            .mouseout(  function(e){_this.mouseOutHandler.call(this, e, _this, options);} );
                    }

                    if(!_data.options.pan){
                        _data.RMap.mousedown( function(e){
                            //_this.mouseDownHandler.call(this, e, methods);}
                            _this.regionClickHandler.call(_this, e, this);
                         });
                        _data.RMap.touchstart(
                            function(e){
                                e.preventDefault();
                                _this.regionClickHandler.call(_this, e, this);
                            }
                        );
                    }else{
                        if(!touchDevice){
                            _data.RMap.mousedown( function(e){
                                // While panning we just remember which region was clicked
                                // by panRegionClickHandler method, and then trigger
                                // regionClickHandler on that region when panning finishes
                                e.preventDefault();
                                _this.panRegionClickHandler.call(_this, e, this);
                            });
                        }else{
                            _data.RMap.touchstart(
                                function(e){
                                    _this.panRegionClickHandler.call(_this, e, this);
                                }
                            );
                            _data.R.canvas.addEventListener('touchstart', function(e) {
                                _this.touchStart(e);
                            }, false);
                            _data.R.canvas.addEventListener('touchmove', function(e) {
                                _this.touchMove(e);
                            }, false);
                            _data.R.canvas.addEventListener('touchend', function(e) {
                                _this.touchEnd(e);
                            }, false);
                        }
                    }
                    loading.hide();
                    } // end of AJAX callback
                });// end of AJAX



        return _this;

        } // end of init

   }; // end of methods

   var _this = this.methods;

  }; // end of mapSVG class


  /** $.FN **/
  $.fn.mapSvg = function( opts ) {

    var id = $(this).attr('id');

    if(typeof opts == 'object' && instances[id] === undefined){
        instances[id] = new mapSVG(this, opts);
        return instances[id].methods.init(opts, this);
    }else if(instances[id]){
        return instances[id].methods;
    }else{
        return $(this);
    }

  }; // end of $.fn.mapSvg

})( jQuery );