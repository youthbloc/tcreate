//use HammerJS for touch detection

String.prototype.toTitleCase = String.prototype.toTitleCase || function (str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

String.prototype.capitalizeFirstCharecterOfAllWords = String.prototype.capitalizeFirstChar || function(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.slice(1); });
}

window.ko.viewModels = window.ko.viewModels || {};

window.ko.viewModels.fabricCanvasViewModel = function () {
    self = this;

    self.setupEventHandling = function () {
        self.canvas.on({
            'touch:shake': commonFunctions.deleteActive(),
            'touch:longpress': commonFunctions.changeDrawMode
        });
        $('#fabric-canvas-wrap').keypress(self.keypress);
        $('#imgLoader').change(self.imageUpload);
    };

    self.keypress = function (event) {
        var preventEvent = true;
        switch (event.keyCode) {
            case 46: commonFunctions.deleteActive(); break; //del key
            case 17: commonFunctions.changeDrawMode(); break; //ctrl key
            default: preventEvent = false; break;  //any other key
        }
        if (preventEvent) { event.preventDefault(); }
    };

    self.imageUpload = function (event) {
        if (this.files && this.files[0]) {
            var fr = new FileReader();
            fr.onload = function (innerEvent) {
                fabric.Image.fromURL(innerEvent.target.result, function (usrImage) {
                    var heightRatio = usrImage.height / self.canvas.height,
                        widthRatio = usrImage.width / self.canvas.width,
                        scale = Math.max(widthRatio, heightRatio);
                    if (scale == heightRatio)
                    { usrImage.scale(0.4 / heightRatio); }
                    else
                    { usrImage.scale(0.4 / widthRatio); }
                    canvas.add(usrImage);
                });
            };
            fr.readAsDataURL(event.target.files[0]);
        }
    }

    self.init = function (selector) {
        self.canvas = new fabric.Canvas('fabric-canvas', {
            height: 10000,
            width: 10000
        });

        self.canvas.commonFunctions = {
            copy: function () {
                var retval = [];
                if (canvas.getActiveGroup()) {
                    retval = _.toArray(canvas.getActiveGroup().objects);
                }
                else if (canvas.getActiveObject()) {
                    retval.push(canvas.getActiveObject());
                }
                return retval;
            },
            paste: function (copied) {
                _.each(copied, function (item) {
                    canvas.add(fabric.util.object.clone(item));
                });
            },
            changeDrawMode: function () {
                canvas.isDrawingMode = !(canvas.isDrawingMode || false);
            },
            deleteActive: function () {
                if (canvas.getActiveGroup()) {
                    _.each(canvas.getActiveGroup().objects, function (item) {
                        item.remove();
                    });
                }
                else if (canvas.getActiveObject()) {
                    canvas.getActiveObject().remove();
                }
            }
        }

        self.setupEventHandling();

        self.backgroundImage('/Content/Images/Shirt.png');

        var fonts = "Tangerine|Cantarell|Droid+Sans|Allan|Allerta|Allerta+Stencil|Anonymous+Pro|Arimo|Arvo|Bentham|Buda|Cabin|Calligraffitti|Cantarell|Cardo|Cherry+Cream+Soda|Chewy|Coda|Coming+Soon|Copse|Corben|Cousine|Covered+By+Your+Grace|Crafty+Girls|Crimson+Text|Crushed|Cuprum|Droid+Sans|Droid+Sans+Mono|Droid+Serif|Fontdiner+Swanky|GFS+Didot|GFS+Neohellenic|Geo|Gruppo|Hanuman|Homemade+Apple|IM+Fell+DW+Pica|IM+Fell+DW+Pica+SC|IM+Fell+Double+Pica|IM+Fell+Double+Pica+SC|IM+Fell+English|IM+Fell+English+SC|IM+Fell+French+Canon|IM+Fell+French+Canon+SC|IM+Fell+Great+Primer|IM+Fell+Great+Primer+SC|Inconsolata|Irish+Growler|Josefin+Sans|Josefin+Slab|Just+Another+Hand|Just+Me+Again+Down+Here|Kenia|Kranky|Kristi|Lato|Lekton|Lobster|Luckiest+Guy|Merriweather|Molengo|Mountains+of+Christmas|Neucha|Neuton|Nobile|OFL+Sorts+Mill+Goudy+TT|Old+Standard+TT|Orbitron|PT+Sans|PT+Sans+Caption|PT+Sans+Narrow|Permanent+Marker|Philosopher|Puritan|Raleway|Reenie+Beanie|Rock+Salt|Schoolbell|Slackey|Sniglet|Sunshiney|Syncopate|Tangerine|Tinos|Ubuntu|UnifrakturCook|UnifrakturMaguntia|Unkempt|Vibur|Vollkorn|Walter+Turncoat|Yanone+Kaffeesatz";
        var fontNames = fonts.replace('+', " ").split('|');
        var $fs = $('.fontSelector').fontselect({ fonts: fontNames, lookahead: 20 });
    };

    self.backgroundImage = ko.pureComputed({
        read: function () { return self.backgroundImage.bgImage; },
        write: function (imageUrl) {
            fabric.Image.fromURL(imageUrl, function (bgImage) {
                self.backgroundImage.bgImage = bgImage;
                var scaleX = self.canvas.getWidth() / bgImage,
                    scaleY = self.canvas.getHeight() / bgImage,
                    scale = Math.min(scaleX, scaleY);

                bgImage.scale(scale);
                canvas.setBackgroundImage(bgImage);
                canvas.renderAll();
            });
        }
    });
};

var commonElementConstructor = function(self, elem) {
    self.canvas = canvas;
    canvas.add(elem);
    
    self.undoStack = ko.msf.createNewMStack();
    self.undoExtendOptions = { registerToMS: { context: this, stack: self.undoStack } };

    elem.stateProperties.forEach(function (item) {
        self[item] = ko.pureComputed({
            read: function () {
                var result = eval('self.elem.get' + item.capitalizeFirstCharecterOfAllWords() + '();');
            },
            write: function (value) {
                eval('self.elem.get' + item.capitalizeFirstCharecterOfAllWords() + '(' + value + ');');
                self.redraw(true);
            }
        }).extend(self.undoExtendOptions)
    }, self);

    self.redraw = ko.pureComputed().extend({
        notify: 'always',
        rateLimit: {
            timeout: 0
        }
    });

    self.redraw.subscribe(function () {
        self.canvas.renderAll();
    });
}

window.ko.viewModels.fabricTextViewModel = function (canvas) {
    self = this;
    self.text = new fabric.Text("");
    commonElementConstructor(self, text);

    self.fontSize.extend()
    self.fontSize(64);
    self.fontFamily('Arial');
    self.textAlignOptions = ['left', 'center', 'right'];
    self.textAlign('left');
    self.fontStyle('bold');
    self.fill('#000000');

    self.isBold = ko.pureComputed(function () {
        return self.fontWeight() == 'bold' || self.fontWeight() == 700;
    });
    self.bold = function () {
        $(this).hasClass('active') ? self.fontWeight('normal') : self.fontWeight('bold');
    };

    self.isItalic = ko.pureComputed(function () {
        return self.fontStyle() == 'italic';
    });
    self.italic = function () {
        $(this).hasClass('active') ? self.fontStyle('normal') : self.fontStyle('italic');
    };

    self.isUnderlined = ko.pureComputed(function () {
        return self.textDecoration() == 'underline';
    });
    self.underline = function () {
        $(this).hasClass('active') ? self.textDecoration('') : self.textDecoration('underline');
    };

    self.isLineThrough = ko.pureComputed(function () {
        return self.textDecoration() == 'line-through';
    });
    self.lineThrough = function () {
        $(this).hasClass('active') ? self.textDecoration('') : self.textDecoration('line-through');
    };

    self.isOverlined = ko.pureComputed(function () {
        return self.textDecoration() == 'overline';
    });
    self.overline = function () {
        $(this).hasClass('active') ? self.textDecoration('') : self.textDecoration('overline');
    };

    self.isLeftAligned = ko.pureComputed(function () {
        return self.textAlign() == 'left';
    });
    self.leftAlign = function () {
        $(this).hasClass('active') ? self.textAlign('left') : self.textAlign('left');
    };

    self.isCenterAligned = ko.pureComputed(function () {
        return self.textAlign() == 'center';
    });
    self.centerAlign = function () {
        $(this).hasClass('active') ? self.textAlign('left') : self.textAlign('center');
    };

    self.isRightAligned = ko.pureComputed(function () {
        return self.textAlign() == 'right';
    });
    self.rightAlign = function () {
        $(this).hasClass('active') ? self.textAlign('left') : self.textAlign('right');
    };
};



//self.fontFamily = ko.purecomputed({
//    read: function () {
//        return self.elem.getFontFamily();
//    },
//    write: function (value) {
//        self.elem.setFontFamily(value);
//        self.redraw(true);
//    }
//});