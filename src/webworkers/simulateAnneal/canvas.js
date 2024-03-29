// http://webreflection.blogspot.com/2009/01/ellipse-and-circle-for-canvas-2d.html
(function() {
    // Andrea Giammarchi - Mit Style License
    var extend = {
        // Circle methods
        circle: function(aX, aY, aDiameter) {
            this.ellipse(aX, aY, aDiameter, aDiameter);
        },
        fillCircle: function(aX, aY, aDiameter) {
            this.beginPath();
            this.circle(aX, aY, aDiameter);
            this.fill();
        },
        strokeCircle: function(aX, aY, aDiameter) {
            this.beginPath();
            this.circle(aX, aY, aDiameter);
            this.stroke();
        },
        // Ellipse methods
        ellipse: function(aX, aY, aWidth, aHeight) {
            aX -= aWidth / 2;
            aY -= aHeight / 2;
            var hB = (aWidth / 2) * .5522848,
                vB = (aHeight / 2) * .5522848,
                eX = aX + aWidth,
                eY = aY + aHeight,
                mX = aX + aWidth / 2,
                mY = aY + aHeight / 2;
            this.moveTo(aX, mY);
            this.bezierCurveTo(aX, mY - vB, mX - hB, aY, mX, aY);
            this.bezierCurveTo(mX + hB, aY, eX, mY - vB, eX, mY);
            this.bezierCurveTo(eX, mY + vB, mX + hB, eY, mX, eY);
            this.bezierCurveTo(mX - hB, eY, aX, mY + vB, aX, mY);
            this.closePath();
        },
        fillEllipse: function(aX, aY, aWidth, aHeight) {
            this.beginPath();
            this.ellipse(aX, aY, aWidth, aHeight);
            this.fill();
        },
        strokeEllipse: function(aX, aY, aWidth, aHeight) {
            this.beginPath();
            this.ellipse(aX, aY, aWidth, aHeight);
            this.stroke();
        }
    };

    for (var key in extend)
        CanvasRenderingContext2D.prototype[key] = extend[key];
})();