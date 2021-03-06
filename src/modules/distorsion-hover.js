// From https://tympanus.net/codrops/2019/03/12/image-distortion-effects-with-svg-filters/

const lineEq = (y2, y1, x2, x1, currentVal) => {
    // y = mx + b 
    var m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
    return m * currentVal + b;
};

const lerp = (a,b,n) => (1 - n) * a + n * b;

const distance = (x1,x2,y1,y2) => {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.hypot(a,b);
};

const getMousePos = (e) => {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    }
    else if (e.clientX || e.clientY) 	{
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return { x : posx, y : posy }
}

// Window size
let winsize;
const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
calcWinsize();
window.addEventListener('resize', calcWinsize);

class Menu {
    constructor(SVGSelector, menuSelector, itemSelector) {
        this.DOM = {
            // The SVG element
            svg: document.querySelector(SVGSelector),
            // The menu element
            menu: document.querySelector(menuSelector)
        };
        // The images (one per menu link)
        this.DOM.imgs = [...this.DOM.svg.querySelectorAll('g > image')];
        // The menu links
        this.DOM.menuLinks = [...this.DOM.menu.querySelectorAll(itemSelector)];
        // Mouse position
        this.mousePos = {x: winsize.width/2, y: winsize.height/2};
        // Last mouse positions (one to consider for the image translation movement, another for the scale value of the feDisplacementMap element)
        this.lastMousePos = {
            translation: {x: winsize.width/2, y: winsize.height/2},
            displacement: {x: 0, y: 0}
        };
        // feDisplacementMap scale value
        this.dmScale = 0;
        // Current menu link position
        this.current = -1;
        
        this.initEvents();
        requestAnimationFrame(() => this.render());
    }
    initEvents() {
        // Update mouse position
        window.addEventListener('mousemove', ev => this.mousePos = getMousePos(ev));

        const mousemenuenterFn = () => this.fade = true;
        const mousemenuleaveFn = () => {
            console.log("fuck");
            TweenMax.to(this.DOM.imgs[this.current], .2, {ease: Quad.easeOut, opacity: 0})
        };

        this.DOM.menuLinks.forEach((item, pos) => {
            const mouseenterFn = () => {
                // Hide the previous menu image.
                if ( this.current !== -1 ) {
                    TweenMax.set(this.DOM.imgs[this.current], {opacity: 0});
                }
                // Update current.
                this.current = pos;

                // Now fade in the new image if we are entering the menu or just set the new image's opacity to 1 if switching between menu items.
                if ( this.fade ) {
                    TweenMax.to(this.DOM.imgs[this.current], 0.5, {ease: Quad.easeOut, opacity: 1});
                    this.fade = false;
                }
                else {
                    TweenMax.to(this.DOM.imgs[this.current], 0.2, {opacity: 1});
                }
            };
            item.addEventListener('mouseenter', mouseenterFn);
            item.addEventListener('mouseenter', mousemenuenterFn);
            item.addEventListener('mouseleave', mousemenuleaveFn);
        });
        
    }
    render() {
        // Translate the image on mousemove
        this.lastMousePos.translation.x = lerp(this.lastMousePos.translation.x, this.mousePos.x, 0.2);
        this.lastMousePos.translation.y = lerp(this.lastMousePos.translation.y, this.mousePos.y, 0.2);
        this.DOM.svg.style.transform = `translate3d(${(this.lastMousePos.translation.x-this.DOM.svg.attributes["width"].nodeValue/2)}px, ${this.lastMousePos.translation.y-this.DOM.svg.attributes["height"].nodeValue/2}px, 0)`;
        
        // Scale goes from 0 to 50 for mouseDistance values between 0 to 140
        this.lastMousePos.displacement.x = lerp(this.lastMousePos.displacement.x, this.mousePos.x, 0.1);
        this.lastMousePos.displacement.y = lerp(this.lastMousePos.displacement.y, this.mousePos.y, 0.1);
        const mouseDistance = distance(this.lastMousePos.displacement.x, this.mousePos.x, this.lastMousePos.displacement.y, this.mousePos.y);
        this.dmScale = Math.min(lineEq(50, 0, 140, 0, mouseDistance), 50);
        document.querySelector('feDisplacementMap').scale.baseVal = this.dmScale * 8;

        requestAnimationFrame(() => this.render());
    }
}

module.exports = { Menu }