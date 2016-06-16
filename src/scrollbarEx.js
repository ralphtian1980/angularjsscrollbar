var angular;
var Scroll;
(function (Scroll) {
    var ArrowState;
    (function (ArrowState) {
        ArrowState[ArrowState["HasArrow"] = 1] = "HasArrow";
        ArrowState[ArrowState["NoArrow"] = 2] = "NoArrow";
    })(ArrowState || (ArrowState = {}));
    var Refresh;
    (function (Refresh) {
        Refresh[Refresh["Normal"] = 1] = "Normal";
        Refresh[Refresh["Manual"] = 2] = "Manual";
        Refresh[Refresh["Auto"] = 3] = "Auto";
    })(Refresh || (Refresh = {}));
    var ScrollBarDisplay;
    (function (ScrollBarDisplay) {
        ScrollBarDisplay[ScrollBarDisplay["Fixed"] = 1] = "Fixed";
        ScrollBarDisplay[ScrollBarDisplay["Static"] = 2] = "Static";
        ScrollBarDisplay[ScrollBarDisplay["InFixed"] = 3] = "InFixed";
        ScrollBarDisplay[ScrollBarDisplay["InStatic"] = 4] = "InStatic";
        ScrollBarDisplay[ScrollBarDisplay["None"] = 5] = "None";
    })(ScrollBarDisplay || (ScrollBarDisplay = {}));
    var MoveType;
    (function (MoveType) {
        MoveType[MoveType["right"] = 1] = "right";
        MoveType[MoveType["bottom"] = 2] = "bottom";
    })(MoveType || (MoveType = {}));
    var Direction;
    (function (Direction) {
        Direction[Direction["xy"] = 1] = "xy";
        Direction[Direction["x"] = 2] = "x";
        Direction[Direction["y"] = 3] = "y";
    })(Direction || (Direction = {}));
    var Layout;
    (function (Layout) {
        Layout[Layout["Solid"] = 1] = "Solid";
        Layout[Layout["Percentage"] = 2] = "Percentage";
        Layout[Layout["WSolid"] = 3] = "WSolid";
        Layout[Layout["HSolid"] = 4] = "HSolid";
        Layout[Layout["WPercentage"] = 5] = "WPercentage";
        Layout[Layout["HPercentage"] = 6] = "HPercentage";
    })(Layout || (Layout = {}));
    var Config;
    (function (Config) {
        Config[Config["Normal"] = 1] = "Normal";
        Config[Config["Detail"] = 2] = "Detail";
    })(Config || (Config = {}));
    var ScrollbarEx = (function () {
        function ScrollbarEx(modules) {
            var _this = this;
            this.scrollLayoutHeight = Layout.Solid;
            this.scrollLayoutWidth = Layout.Solid;
            this.scrollBoxStrWidth = function () {
                if (_this.scrollLayoutWidth == Layout.Percentage) {
                    return _this.scrollBoxWidth + "%";
                }
                else {
                    return _this.scrollBoxWidth + "px";
                }
            };
            this.scrollBoxStrHeight = function () {
                if (_this.scrollLayoutHeight == Layout.Percentage) {
                    return _this.scrollBoxHeight + "%";
                }
                else {
                    return _this.scrollBoxHeight + "px";
                }
            };
            this.buildfunction = function () {
                var myself = _this;
                return {
                    controller: function ($scope, $element, $attrs) {
                        var t = function (e) {
                            e.preventDefault();
                            return false;
                        };
                        var f = function () {
                            var transclude = angular.element($element).find("ng-transclude");
                            myself.scrollShell = $element[0];
                            var item = angular.element(transclude).children("div")[0];
                            var w = item.offsetWidth;
                            var h = item.offsetHeight;
                            var itemlist = (angular.element($element).children("div.selfElementCSS").children("div.selfElementCSS"));
                            myself.scrollbox = angular.element($element).children("div.scrollboxCSS")[0];
                            if (myself.scrollLayoutHeight == Layout.Percentage) {
                                myself.scrollItemHeight = myself.scrollbox.clientHeight;
                            }
                            if (myself.scrollLayoutWidth == Layout.Percentage) {
                                myself.scrollItemWidth = myself.scrollbox.clientWidth;
                            }
                            angular.element(myself.scrollbox).bind("mouseover", myself.MouseOverInBodys);
                            angular.element(myself.scrollbox).bind("mouseleave", myself.MouseleaveOutBodys);
                            angular.element(document).bind("mouseup", myself.MousemoveUnSelectfn);
                            for (var i = 0; i < itemlist.length; i++) {
                                if (angular.element(itemlist[i]).hasClass("scrollbodyCSS")) {
                                    myself.scrollbody = itemlist[i];
                                    myself.selfElement = angular.element(myself.scrollbody).children("div.selfElementCSS")[0];
                                    if (myself.scrollbarRefresh == Refresh.Normal) {
                                        var mo = new MutationObserver(function () { myself.UpdateScroll(); });
                                        var option = {
                                            'subtree': true,
                                            'characterData': true
                                        };
                                        mo.observe(myself.selfElement, option);
                                    }
                                }
                                if (angular.element(itemlist[i]).hasClass("scrollBarRightCSS")) {
                                    myself.scrollBarRight = itemlist[i];
                                    myself.arrowRightHeight = myself.scrollBarRight.clientWidth;
                                    angular.forEach(angular.element(myself.scrollBarRight).children(), function (childElement) {
                                        if (angular.element(childElement).hasClass("scrollBarRightLineCSS")) {
                                            myself.scrollBarRightLine = childElement;
                                        }
                                        if (myself.arrowType == ArrowState.HasArrow) {
                                            if (angular.element(childElement).hasClass("sBRightArrowBoxCSS")) {
                                                if (angular.element(childElement).attr("name") == "up") {
                                                    myself.scrollBarArrowTop = childElement;
                                                    myself.BuildArrow(angular.element(childElement).css("height", myself.arrowRightHeight + "px"), angular.element(childElement).children()[0], myself.arrowRightHeight / 2, "border-left", "border-right", "border-bottom", "margin-top", myself.RightScrollMove, -1, function () { return myself.scrollMarginTop != 0; });
                                                }
                                                if (angular.element(childElement).attr("name") == "down") {
                                                    myself.scrollBarArrowBottom = childElement;
                                                    myself.BuildArrow(angular.element(childElement).css("height", myself.arrowRightHeight + "px").css("position", "absolute").css("bottom", "0px"), angular.element(childElement).children()[0], myself.arrowRightHeight / 2, "border-left", "border-right", "border-top", "margin-top", myself.RightScrollMove, 1, function () { return (myself.scrollMarginTop != (myself.scrollItemHeight - myself.scrollBarRightLineNumber - myself.arrowRightHeight * 2)); });
                                                }
                                            }
                                        }
                                    });
                                }
                                if (angular.element(itemlist[i]).hasClass("scrollBarBottomCSS")) {
                                    myself.scrollBarBottom = itemlist[i];
                                    myself.arrowBottomHeight = myself.scrollBarBottom.clientHeight;
                                    angular.forEach(angular.element(myself.scrollBarBottom).children(), function (childElement) {
                                        if (angular.element(childElement).hasClass("scrollBarBottomLineCSS")) {
                                            myself.scrollBarBottomLine = childElement;
                                        }
                                        if (myself.arrowType == ArrowState.HasArrow) {
                                            if (angular.element(childElement).hasClass("sBBottomArrowBoxCSS")) {
                                                if (angular.element(childElement).attr("name") == "right") {
                                                    myself.scrollBarArrowRight = childElement;
                                                    myself.BuildArrow(angular.element(childElement).css("width", myself.arrowBottomHeight + "px").css("position", "absolute").css("right", "0px"), angular.element(childElement).children()[0], myself.arrowBottomHeight / 2, "border-top", "border-bottom", "border-left", "margin-left", myself.BottomScrollMove, 1, function () { return myself.scrollMarginleft != (myself.scrollItemWidth - myself.scrollBarBottomLineNumber - myself.arrowBottomHeight * 2); });
                                                }
                                                if (angular.element(childElement).attr("name") == "left") {
                                                    myself.scrollBarArrowLeft = childElement;
                                                    myself.BuildArrow(angular.element(childElement).css("width", myself.arrowBottomHeight + "px"), angular.element(childElement).children()[0], myself.arrowBottomHeight / 2, "border-top", "border-bottom", "border-right", "margin-left", myself.BottomScrollMove, -1, function () { return myself.scrollMarginleft != 0; });
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                            myself.scrollMarginTop = 0;
                            myself.scrollMarginleft = 0;
                            if (myself.ScrollDisplay == ScrollBarDisplay.Static) {
                                angular.element(myself.scrollShell).css("margin-right", myself.arrowRightHeight + "px").css("margin-bottom", myself.arrowBottomHeight + "px");
                            }
                            myself.UpdateScroll();
                            angular.element(myself.scrollBarRightLine).bind("dragstart", t);
                            angular.element(myself.scrollBarBottomLine).bind("dragstart", t);
                            if (myself.scrollbarRefresh == Refresh.Normal) {
                                angular.element(window).bind("resize", function (e) {
                                    myself.UpdateScroll();
                                });
                            }
                        };
                        angular.element().ready(f);
                    },
                    template: function ($scope, $element, $attrs) {
                        var isX = false;
                        var isY = false;
                        if ($element.ngDirection == undefined) {
                            isX = true;
                            isY = true;
                        }
                        else {
                            if (angular.uppercase($element.ngDirection).indexOf("x") > -1) {
                                isX = true;
                            }
                            if (angular.uppercase($element.ngDirection).indexOf("y") > -1) {
                                isY = true;
                            }
                        }
                        if ($element.ngLayout != undefined) {
                            if (angular.uppercase($element.ngLayout).indexOf(angular.uppercase(Layout[Layout.WPercentage])) > -1) {
                                myself.scrollLayoutWidth = Layout.Percentage;
                            }
                            if (angular.uppercase($element.ngLayout).indexOf(angular.uppercase(Layout[Layout.HPercentage])) > -1) {
                                myself.scrollLayoutHeight = Layout.Percentage;
                            }
                            if (angular.uppercase($element.ngLayout).indexOf(angular.uppercase(Layout[Layout.WSolid])) > -1) {
                                myself.scrollLayoutWidth = Layout.Solid;
                            }
                            if (angular.uppercase($element.ngLayout).indexOf(angular.uppercase(Layout[Layout.HSolid])) > -1) {
                                myself.scrollLayoutHeight = Layout.Solid;
                            }
                        }
                        myself.scrollbarRefresh = Refresh.Normal;
                        if ($element.ngRefresh != undefined) {
                            if (angular.uppercase($element.ngRefresh) == angular.uppercase(Refresh[Refresh.Auto])) {
                                myself.scrollbarRefresh = Refresh.Auto;
                            }
                            if (angular.uppercase($element.ngRefresh) == angular.uppercase(Refresh[Refresh.Manual])) {
                                myself.scrollbarRefresh = Refresh.Manual;
                            }
                        }
                        var isNumber = /[1-9][0-9]*/i;
                        if ($element.ngDisplay != undefined) {
                            if (angular.uppercase($element.ngDisplay) == angular.uppercase(ScrollBarDisplay[ScrollBarDisplay.Static])) {
                                myself.ScrollDisplay = ScrollBarDisplay.Static;
                            }
                            else {
                                myself.ScrollDisplay = ScrollBarDisplay.Fixed;
                            }
                        }
                        if ($element.ngWidth == undefined) {
                            myself.scrollBoxWidth = myself.scrollItemWidth = 400;
                        }
                        else {
                            if (isNumber.exec($element.ngWidth) != null) {
                                myself.scrollBoxWidth = myself.scrollItemWidth = parseInt(isNumber.exec($element.ngWidth)[0]);
                            }
                            else {
                                myself.scrollBoxWidth = myself.scrollItemWidth = 400;
                            }
                        }
                        if ($element.ngHeight == undefined) {
                            myself.scrollBoxHeight = myself.scrollItemHeight = 400;
                        }
                        else {
                            if (isNumber.exec($element.ngHeight) != null) {
                                myself.scrollBoxHeight = myself.scrollItemHeight = parseInt(isNumber.exec($element.ngHeight)[0]);
                            }
                            else {
                                myself.scrollBoxHeight = myself.scrollItemHeight = 400;
                            }
                        }
                        if (angular.uppercase($element.ngArrow) == angular.uppercase(ArrowState[ArrowState.HasArrow])) {
                            myself.arrowType = ArrowState.HasArrow;
                            return '<div class="scrollShellCSS"><div class="scrollboxCSS" style="width:' + myself.scrollBoxStrWidth() + '; height:' + myself.scrollBoxStrHeight() + ';"><div class="scrollBarRightCSS" style="height: ' + myself.scrollBoxStrHeight() + '; left: ' + myself.scrollBoxStrWidth() + ';"><div name="up" class="sBRightArrowBoxCSS"><div class="scrollBarArrowArrowCSS"></div></div><div class="scrollBarRightLineCSS" style="margin-top: 0px; height: 0px;"></div><div name="down" class="sBRightArrowBoxCSS"><div class="scrollBarArrowArrowCSS"></div></div></div><div class="scrollBarBottomCSS" style="width: ' + myself.scrollBoxStrWidth() + '; top: ' + myself.scrollBoxStrHeight() + ';"><div name="left" class="sBBottomArrowBoxCSS"><div class="scrollBarArrowArrowCSS"></div></div><div class="scrollBarBottomLineCSS" style="margin-left: 0px; width: 0px;"></div><div name="right" class="sBBottomArrowBoxCSS"><div class="scrollBarArrowArrowCSS"></div></div></div><div class="scrollbodyCSS">' +
                                '<div class="selfElementCSS"><ng-transclude></ng-transclude>' +
                                '</div></div > </div></div>';
                        }
                        else {
                            myself.arrowType = ArrowState.NoArrow;
                            return '<div class="scrollShellCSS" style="width:' + myself.scrollBoxStrWidth() + '; height:' + myself.scrollBoxStrHeight() + ';"><div class="scrollboxCSS" ><div class="scrollBarRightCSS" style="height: ' + (myself.scrollLayoutHeight == Layout.Percentage ? "100%" : myself.scrollBoxStrHeight()) +
                                '; left: ' + (myself.scrollLayoutWidth == Layout.Percentage ? "100%" : myself.scrollBoxStrWidth())
                                + ';"><div class="scrollBarRightLineCSS" style="margin-top: 0px; height: 0px;"></div></div><div class="scrollBarBottomCSS" style="width: ' + (myself.scrollLayoutWidth == Layout.Percentage ? "100%" : myself.scrollBoxStrWidth()) + '; top: ' + (myself.scrollLayoutHeight == Layout.Percentage ? "100%" : myself.scrollBoxStrHeight()) + ';"><div class="scrollBarBottomLineCSS" style="margin-left: 0px; width: 0px;"></div></div><div class="scrollbodyCSS">' +
                                '<div class="selfElementCSS"><ng-transclude></ng-transclude>' +
                                '</div></div > </div></div>';
                        }
                    },
                    compile: function (tElem, tAttrs, ex) {
                        var x = ex;
                    },
                    link: function (tElem, tAttrs, ex) {
                        var x = ex;
                    },
                    restrict: 'E',
                    transclude: true,
                    replace: true
                };
            };
            this.MouseOverInBodys = function (ex) {
                angular.element(ex.currentTarget).bind("mousewheel DOMMouseScroll", _this.MousewheelScroll);
            };
            this.MouseleaveOutBodys = function (ex) {
                angular.element(ex.currentTarget).unbind("mousewheel DOMMouseScroll", _this.MousewheelScroll);
            };
            this.MousemoveUnSelectfn = function (ex) {
                angular.element(document).unbind("selectstart", _this.NoSelect);
                angular.element(document.body).removeClass("noselect");
                angular.element(document).unbind("mousemove", _this.MousemoveMovefn);
            };
            this.BuildArrow = function (childElement, element, length, styleone, styletwo, stylethree, stylefour, movefunction, v, transformfunction) {
                _this.ArrowCss = _this.ArrowCss || window.getComputedStyle(element, "border-left-color")["border-left-color"];
                _this.ArrowCssBackground = _this.ArrowCssBackground || window.getComputedStyle(element, "border-left-color")["background-color"];
                childElement
                    .bind("click", function () {
                    movefunction(v);
                }).bind("mousedown", function () {
                    angular.element(element).css(stylethree + "-color", _this.ArrowCssBackground);
                }).bind("mouseup", function () {
                    if (transformfunction()) {
                        angular.element(element).css(stylethree + "-color", _this.ArrowCss);
                    }
                });
                angular.element(element).css(styleone, length + "px solid transparent").css(styletwo, length + "px solid transparent")
                    .css(stylethree, length + "px solid " + _this.ArrowCss).css(stylefour, length / 2 + "px").css("background-color", "transparent");
            };
            this.RightScrollMove = function (move) {
                if (_this.scrollBarRightLineNumber < _this.scrollItemHeight) {
                    var margintop = _this.scrollMarginTop;
                    var line = move + margintop;
                    var upcolor = _this.ArrowCss;
                    var downcolor = _this.ArrowCss;
                    if (line < 0) {
                        line = 0;
                        upcolor = _this.ArrowCssBackground;
                    }
                    if (_this.arrowType == ArrowState.HasArrow) {
                        if (line > _this.scrollItemHeight - _this.scrollBarRightLineNumber - _this.arrowRightHeight * 2) {
                            line = _this.scrollItemHeight - _this.scrollBarRightLineNumber - _this.arrowRightHeight * 2;
                            downcolor = _this.ArrowCssBackground;
                        }
                    }
                    else {
                        if (line > _this.scrollItemHeight - _this.scrollBarRightLineNumber) {
                            line = _this.scrollItemHeight - _this.scrollBarRightLineNumber;
                            downcolor = _this.ArrowCssBackground;
                        }
                    }
                    _this.ArrowChangColor(angular.element(_this.scrollBarArrowTop).children()[0], "border-bottom-color", upcolor);
                    _this.ArrowChangColor(angular.element(_this.scrollBarArrowBottom).children()[0], "border-top-color", downcolor);
                    _this.scrollMarginTop = line;
                    angular.element(_this.scrollBarRightLine).css("margin-top", line + "px");
                    angular.element(_this.scrollbody).css("top", line * _this.scrollBoxHeight / -_this.scrollItemHeight + "px");
                }
            };
            this.BottomScrollMove = function (move) {
                if (_this.scrollBarBottomLineNumber < _this.scrollBoxWidth) {
                    var marginleft = _this.scrollMarginleft;
                    var line = move + marginleft;
                    var rightcolor = _this.ArrowCss;
                    var leftcolor = _this.ArrowCss;
                    if (line < 0) {
                        line = 0;
                        leftcolor = _this.ArrowCssBackground;
                    }
                    if (_this.arrowType == ArrowState.HasArrow) {
                        if (line > _this.scrollItemWidth - _this.scrollBarBottomLineNumber - _this.arrowBottomHeight * 2) {
                            line = _this.scrollItemWidth - _this.scrollBarBottomLineNumber - _this.arrowBottomHeight * 2;
                            rightcolor = _this.ArrowCssBackground;
                        }
                    }
                    else {
                        if (line > _this.scrollItemWidth - _this.scrollBarBottomLineNumber) {
                            line = _this.scrollItemWidth - _this.scrollBarBottomLineNumber;
                            rightcolor = _this.ArrowCssBackground;
                        }
                    }
                    _this.ArrowChangColor(angular.element(_this.scrollBarArrowLeft).children()[0], "border-right-color", leftcolor);
                    _this.ArrowChangColor(angular.element(_this.scrollBarArrowRight).children()[0], "border-left-color", rightcolor);
                    _this.scrollMarginleft = line;
                    angular.element(_this.scrollBarBottomLine).css("margin-left", line + "px");
                    angular.element(_this.scrollbody).css("left", line * _this.scrollBoxWidth / -_this.scrollItemWidth + "px");
                }
            };
            this.UpdateScroll = function () {
                if (_this.scrollLayoutHeight == Layout.Percentage) {
                    if (_this.scrollItemHeight != _this.scrollbox.clientHeight) {
                        _this.scrollItemHeight = _this.scrollbox.clientHeight;
                        _this.scrollBoxHeight = 0;
                    }
                }
                if (_this.scrollLayoutWidth == Layout.Percentage) {
                    if (_this.scrollItemWidth != _this.scrollbox.clientWidth) {
                        _this.scrollItemWidth = _this.scrollbox.clientWidth;
                        _this.scrollBoxWidth = 0;
                    }
                }
                if (_this.selfElement.offsetHeight != _this.scrollBoxHeight) {
                    var x = _this.selfElement.offsetHeight;
                    var y = _this.scrollBoxHeight;
                    angular.element(_this.scrollBarRightLine).unbind("mousedown", _this.MousemoveSelectfn);
                    _this.scrollBoxHeight = _this.selfElement.offsetHeight;
                    var scrollH = _this.scrollItemHeight;
                    var DomH = _this.selfElement.offsetHeight;
                    var ScrollNow = scrollH * scrollH / DomH;
                    if (ScrollNow > _this.scrollItemHeight) {
                        ScrollNow = _this.scrollItemHeight;
                    }
                    if (_this.arrowType == ArrowState.HasArrow) {
                        _this.scrollBarRightLineNumber = ScrollNow - _this.arrowRightHeight * 2;
                        _this.scrollBarRightLine.style.height = _this.scrollBarRightLineNumber + "px";
                    }
                    else {
                        _this.scrollBarRightLineNumber = ScrollNow;
                        _this.scrollBarRightLine.style.height = ScrollNow + "px";
                    }
                    angular.element(_this.scrollBarRightLine).bind("mousedown", _this.MousemoveSelectfn);
                    if (ScrollNow == _this.scrollItemHeight) {
                        angular.element(_this.scrollBarRight).css("display", "none");
                    }
                    else {
                        angular.element(_this.scrollBarRight).css("display", "block");
                    }
                    _this.RightScrollMove(0);
                }
                if (_this.selfElement.offsetWidth != _this.scrollBoxWidth) {
                    angular.element(_this.scrollBarBottomLine).unbind("mousedown", _this.MousemoveSelectBtfn);
                    _this.scrollBoxWidth = _this.selfElement.offsetWidth;
                    var scrollH = _this.scrollItemWidth;
                    var DomH = _this.selfElement.offsetWidth;
                    var ScrollNow = scrollH * scrollH / DomH;
                    if (ScrollNow > _this.scrollItemWidth) {
                        ScrollNow = _this.scrollItemWidth;
                    }
                    if (_this.arrowType == ArrowState.HasArrow) {
                        _this.scrollBarBottomLineNumber = ScrollNow - _this.arrowBottomHeight * 2;
                        _this.scrollBarBottomLine.style.width = _this.scrollBarBottomLineNumber + "px";
                    }
                    else {
                        _this.scrollBarBottomLineNumber = ScrollNow;
                        _this.scrollBarBottomLine.style.width = ScrollNow + "px";
                    }
                    angular.element(_this.scrollBarBottomLine).bind("mousedown", _this.MousemoveSelectBtfn);
                    if (ScrollNow == _this.scrollItemWidth) {
                        angular.element(_this.scrollBarBottom).css("display", "none");
                    }
                    else {
                        angular.element(_this.scrollBarBottom).css("display", "block");
                    }
                    _this.BottomScrollMove(0);
                }
                if (_this.scrollbarRefresh == Refresh.Auto) {
                    window.requestAnimationFrame(_this.UpdateScroll);
                }
                return 0;
            };
            this.NoSelect = function (e) {
                e.preventDefault();
                return false;
            };
            this.MousewheelScroll = function (e) {
                var delta = (e.wheelDelta && (e.wheelDelta > 0 ? 1 : -1)) ||
                    (e.detail && (e.detail > 0 ? -1 : 1)); // firefox
                _this.RightScrollMove(delta * -1);
                return false;
            };
            this.MousemoveMovefn = function (e) {
                try {
                    if (_this.scrollMoveType == MoveType.right) {
                        if (_this.scrollBarRightLineNumber < _this.scrollItemHeight) {
                            var margintop = _this.scrollMarginTop;
                            var line = e.pageY - _this.ypoint + margintop;
                            var upcolor = _this.ArrowCss;
                            var downcolor = _this.ArrowCss;
                            if (line < 0) {
                                line = 0;
                                upcolor = _this.ArrowCssBackground;
                            }
                            if (_this.arrowType == ArrowState.HasArrow) {
                                if (line > _this.scrollItemHeight - _this.scrollBarRightLineNumber - _this.arrowRightHeight * 2) {
                                    line = _this.scrollItemHeight - _this.scrollBarRightLineNumber - _this.arrowRightHeight * 2;
                                    downcolor = _this.ArrowCssBackground;
                                }
                            }
                            else {
                                if (line > _this.scrollItemHeight - _this.scrollBarRightLineNumber) {
                                    line = _this.scrollItemHeight - _this.scrollBarRightLineNumber;
                                    downcolor = _this.ArrowCssBackground;
                                }
                            }
                            _this.ArrowChangColor(angular.element(_this.scrollBarArrowTop).children()[0], "border-bottom-color", upcolor);
                            _this.ArrowChangColor(angular.element(_this.scrollBarArrowBottom).children()[0], "border-top-color", downcolor);
                            _this.ypoint = e.pageY;
                            _this.scrollMarginTop = line;
                            angular.element(_this.scrollBarRightLine).css("margin-top", line + "px");
                            angular.element(_this.scrollbody).css("top", line * _this.scrollBoxHeight / -_this.scrollItemHeight + "px");
                        }
                    }
                    if (_this.scrollMoveType == MoveType.bottom) {
                        if (_this.scrollBarBottomLineNumber < _this.scrollBoxWidth) {
                            var marginleft = _this.scrollMarginleft;
                            var line = e.pageX - _this.xpoint + marginleft;
                            var leftcolor = _this.ArrowCss;
                            var rightcolor = _this.ArrowCss;
                            if (line < 0) {
                                line = 0;
                                leftcolor = _this.ArrowCssBackground;
                            }
                            if (_this.arrowType == ArrowState.HasArrow) {
                                if (line > _this.scrollItemWidth - _this.scrollBarBottomLineNumber - _this.arrowBottomHeight * 2) {
                                    line = _this.scrollItemWidth - _this.scrollBarBottomLineNumber - _this.arrowBottomHeight * 2;
                                    rightcolor = _this.ArrowCssBackground;
                                }
                            }
                            else {
                                if (line > _this.scrollItemWidth - _this.scrollBarBottomLineNumber) {
                                    line = _this.scrollItemWidth - _this.scrollBarBottomLineNumber;
                                    rightcolor = _this.ArrowCssBackground;
                                }
                            }
                            _this.ArrowChangColor(angular.element(_this.scrollBarArrowRight).children()[0], "border-left-color", rightcolor);
                            _this.ArrowChangColor(angular.element(_this.scrollBarArrowLeft).children()[0], "border-right-color", leftcolor);
                            _this.xpoint = e.pageX;
                            _this.scrollMarginleft = line;
                            angular.element(_this.scrollBarBottomLine).css("margin-left", line + "px");
                            angular.element(_this.scrollbody).css("left", line * _this.scrollBoxWidth / -_this.scrollItemWidth + "px");
                        }
                    }
                    return false;
                }
                catch (e) {
                    return false;
                }
            };
            this.ArrowChangColor = function (element, style, color) {
                angular.element(element).css(style, color);
            };
            this.MousemoveSelectfn = function (ex) {
                _this.xpoint = ex.pageX;
                _this.ypoint = ex.pageY;
                _this.scrollMoveType = MoveType.right;
                angular.element(document).bind("selectstart", _this.NoSelect);
                angular.element(document.body).addClass("noselect");
                angular.element(document).bind("mousemove", _this.MousemoveMovefn);
            };
            this.MousemoveSelectBtfn = function (ex) {
                _this.xpoint = ex.pageX;
                _this.ypoint = ex.pageY;
                _this.scrollMoveType = MoveType.bottom;
                angular.element(document).bind("selectstart", _this.NoSelect);
                angular.element(document.body).addClass("noselect");
                angular.element(document).bind("mousemove", _this.MousemoveMovefn);
            };
            this.Directive = this.buildfunction();
            ScrollbarEx.ScrollBarList.push(this);
            return this.Directive;
        }
        ScrollbarEx.ScrollBarList = [];
        return ScrollbarEx;
    }());
    Scroll.ScrollbarEx = ScrollbarEx;
    angular.module('scrollbar', []).directive("scroll", function () {
        return new ScrollbarEx("");
    }).service('ChangeScrollBar', function () {
        var _value = ScrollbarEx.ScrollBarList[ScrollbarEx.ScrollBarList.length - 1];
        return function () {
            _value.UpdateScroll();
        };
        //service code
    });
})(Scroll || (Scroll = {}));
//# sourceMappingURL=scrollbarEx.js.map