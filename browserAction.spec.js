describe('browserAction, method getDimensions', function () {
    beforeEach(function () {
        document.body.innerHTML = '';
    })

    it('should pass', function () {
        expect(true).toBeTruthy();
    });

    it('should find browser action variable without failing', function () {
        expect(browserAction).not.toBe(null);
    });

    it('should not fail if no svgContainerList', function () {
        var svgList = [];
        dimensions = browserAction.getDimensions(svgList);

        expect(dimensions.farLeft).not.toBeDefined();
    })

    it('should find bounding for basic rect', function () {
        var svgList = [];

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 60);
        rect.setAttribute('y', 10);
        rect.setAttribute('id', 'item');

        svg.appendChild(rect);
        document.body.appendChild(svg);

        var gElement = document.querySelector('#item');
        svgList.push(gElement);

        dimensions = browserAction.getDimensions(svgList);
        var svgBounding = svg.getBoundingClientRect();

        expect(dimensions.farLeft).toBe(svgBounding.left + 60);
        expect(dimensions.farRight).toBe(svgBounding.left + 60 + 30);
        expect(dimensions.farTop).toBe(svgBounding.top + 10);
        expect(dimensions.farBottom).toBe(svgBounding.top + 30 + 10);
        expect(dimensions.width).toBe(30);
        expect(dimensions.height).toBe(30);
    })

    it('should find bounding for basic g element with rect item inside', function () {
        var svgList = [];

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 60);
        rect.setAttribute('y', 10);

        var g = document.createElementNS(svg.namespaceURI, 'g');
        g.setAttribute('id', 'item');

        g.appendChild(rect);

        svg.appendChild(g);
        document.body.appendChild(svg);

        var gElement = document.querySelector('#item');
        svgList.push(gElement);

        dimensions = browserAction.getDimensions(svgList);
        var svgBounding = svg.getBoundingClientRect();

        expect(dimensions.farLeft).toBe(svgBounding.left + 60);
        expect(dimensions.farRight).toBe(svgBounding.left + 60 + 30);
        expect(dimensions.farTop).toBe(svgBounding.top + 10);
        expect(dimensions.farBottom).toBe(svgBounding.top + 30 + 10);
        expect(dimensions.width).toBe(30);
        expect(dimensions.height).toBe(30);
    })

    it('should find bounding for two non-overlapping basic rects', function () {
        var svgList = [];

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 60);
        rect.setAttribute('y', 10);
        rect.setAttribute('id', 'item');

        var rect2 = document.createElementNS(svg.namespaceURI, 'rect');
        rect2.setAttribute('width', 40);
        rect2.setAttribute('height', 60);
        rect2.setAttribute('x', 10);
        rect2.setAttribute('y', 30);
        rect2.setAttribute('id', 'item2');

        svg.appendChild(rect);
        svg.appendChild(rect2);
        document.body.appendChild(svg);

        var gElement = document.querySelector('#item');
        var gElement2 = document.querySelector('#item2');
        svgList.push(gElement);
        svgList.push(gElement2);

        dimensions = browserAction.getDimensions(svgList);
        var svgBounding = svg.getBoundingClientRect();

        expect(dimensions.farLeft).toBe(svgBounding.left + 10);
        expect(dimensions.farRight).toBe(svgBounding.left + 10 + dimensions.width);
        expect(dimensions.farTop).toBe(svgBounding.top + 10);
        expect(dimensions.farBottom).toBe(svgBounding.top + 10 + dimensions.height);
        expect(dimensions.width).toBe(80);
        expect(dimensions.height).toBe(80);
    })

    it('should find bounding for two overlapping basic rects', function () {
        var svgList = [];

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 65);
        rect.setAttribute('y', 60);
        rect.setAttribute('id', 'item');

        var rect2 = document.createElementNS(svg.namespaceURI, 'rect');
        rect2.setAttribute('width', 40);
        rect2.setAttribute('height', 60);
        rect2.setAttribute('x', 40);
        rect2.setAttribute('y', 45);
        rect2.setAttribute('id', 'item2');

        svg.appendChild(rect);
        svg.appendChild(rect2);
        document.body.appendChild(svg);

        var gElement = document.querySelector('#item');
        var gElement2 = document.querySelector('#item2');
        svgList.push(gElement);
        svgList.push(gElement2);

        dimensions = browserAction.getDimensions(svgList);
        var svgBounding = svg.getBoundingClientRect();

        expect(dimensions.farLeft).toBe(svgBounding.left + 40);
        expect(dimensions.farRight).toBe(svgBounding.left + 95);
        expect(dimensions.farTop).toBe(svgBounding.top + 45);
        expect(dimensions.farBottom).toBe(svgBounding.top + 105);
        expect(dimensions.width).toBe(55);
        expect(dimensions.height).toBe(60);
    })

    it('should find bounding for two overlapping basic rects, second rect is hidden', function () {
        var svgList = [];

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 65);
        rect.setAttribute('y', 60);
        rect.setAttribute('id', 'item');

        var rect2 = document.createElementNS(svg.namespaceURI, 'rect');
        rect2.setAttribute('width', 40);
        rect2.setAttribute('height', 60);
        rect2.setAttribute('x', 40);
        rect2.setAttribute('y', 45);
        rect2.setAttribute('id', 'item2');
        rect2.setAttribute('class', 'do-not-show-option');

        svg.appendChild(rect);
        svg.appendChild(rect2);
        document.body.appendChild(svg);

        var gElement = document.querySelector('#item');
        var gElement2 = document.querySelector('#item2');
        svgList.push(gElement);
        svgList.push(gElement2);

        dimensions = browserAction.getDimensions(svgList);
        var svgBounding = svg.getBoundingClientRect();

        expect(dimensions.farLeft).toBe(svgBounding.left + 65);
        expect(dimensions.farRight).toBe(svgBounding.left + 95);
        expect(dimensions.farTop).toBe(svgBounding.top + 60);
        expect(dimensions.farBottom).toBe(svgBounding.top + 90);
        expect(dimensions.width).toBe(30);
        expect(dimensions.height).toBe(30);
    })
})

describe('browserAction, method fixToBoundingBox', function () {
    beforeEach(function () {
        document.body.innerHTML = '';
    });

    it('should throw not throw an error if no svgs are found', function () {
        var svgContainerlist = browserAction.fixToBoudingBox();
        expect(svgContainerlist).toBeUndefined();
    })

    it('should transform a g element to the size of the svg', function () {
        var svgList = [];

        var div = document.createElement('div');
        div.setAttribute('id', 'container-for-svg');
        div.style.border = '1px solid black';
        div.style.boxSizing = 'border-box';
        div.style.width = '533px';

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 60);
        rect.setAttribute('y', 10);

        var g = document.createElementNS(svg.namespaceURI, 'g');
        g.setAttribute('id', 'item');

        g.appendChild(rect);
        svg.appendChild(g);
        div.appendChild(svg);
        document.body.appendChild(div);

        //Act
        var svgContainerList = browserAction.fixToBoudingBox();
        var itemBounding = svgContainerList[0].getBoundingClientRect();

        //Assert
        var svgBounding = svg.getBBox();
        var divBounding = div.getBoundingClientRect();
        expect(svgBounding.width).toBe(533);
        expect(divBounding.width).toBe(533);
        expect(Math.ceil(itemBounding.left)).toBe(divBounding.left);
    });

    it('should transform two g element to the size of the svg', function () {
        var svgList = [];

        var div = document.createElement('div');
        div.setAttribute('id', 'container-for-svg');
        div.style.border = '1px solid black';
        div.style.boxSizing = 'border-box';
        div.style.width = '533px';

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 60);
        rect.setAttribute('y', 10);
        rect.setAttribute('id', 'item');

        var rect2 = document.createElementNS(svg.namespaceURI, 'rect');
        rect2.setAttribute('width', 40);
        rect2.setAttribute('height', 60);
        rect2.setAttribute('x', 10);
        rect2.setAttribute('y', 30);
        rect2.setAttribute('id', 'item2');

        var g = document.createElementNS(svg.namespaceURI, 'g');
        g.setAttribute('id', 'item');

        g.appendChild(rect);
        g.appendChild(rect2);
        svg.appendChild(g);
        div.appendChild(svg);
        document.body.appendChild(div);

        //Act
        var svgContainerList = browserAction.fixToBoudingBox();
        var itemBounding = svgContainerList[0].getBoundingClientRect();

        //Assert
        var svgBounding = svg.getBBox();
        var divBounding = div.getBoundingClientRect();
        expect(svgBounding.width).toBe(533);
        expect(divBounding.width).toBe(533);
        expect(Math.ceil(itemBounding.left)).toBe(divBounding.left);
    });

    it('should transform three g element to the size of the svg', function () {
        var svgList = [];

        var div = document.createElement('div');
        div.setAttribute('id', 'container-for-svg');
        div.style.border = '1px solid black';
        div.style.boxSizing = 'border-box';
        div.style.width = '533px';

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 60);
        rect.setAttribute('y', 10);
        rect.setAttribute('id', 'item');

        var rect2 = document.createElementNS(svg.namespaceURI, 'rect');
        rect2.setAttribute('width', 40);
        rect2.setAttribute('height', 60);
        rect2.setAttribute('x', 10);
        rect2.setAttribute('y', 30);
        rect2.setAttribute('id', 'item2');

        var rect3 = document.createElementNS(svg.namespaceURI, 'rect');
        rect3.setAttribute('width', 70);
        rect3.setAttribute('height', 70);
        rect3.setAttribute('x', 0);
        rect3.setAttribute('y', 0);
        rect3.setAttribute('id', 'item3');

        var g = document.createElementNS(svg.namespaceURI, 'g');
        g.setAttribute('id', 'item');

        g.appendChild(rect);
        g.appendChild(rect2);
        g.appendChild(rect3);
        svg.appendChild(g);
        div.appendChild(svg);
        document.body.appendChild(div);

        //Act
        var svgContainerList = browserAction.fixToBoudingBox();
        var itemBounding = svgContainerList[0].getBoundingClientRect();

        //Assert
        var svgBounding = svg.getBBox();
        var divBounding = div.getBoundingClientRect();
        expect(svgBounding.width).toBe(533);
        expect(divBounding.width).toBe(533);
        expect(Math.ceil(itemBounding.left)).toBe(divBounding.left);
    });

    it('should transform three g element larger than the size of the svg', function () {
        var svgList = [];

        var div = document.createElement('div');
        div.setAttribute('id', 'container-for-svg');
        div.style.border = '1px solid black';
        div.style.boxSizing = 'border-box';
        div.style.width = '533px';

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 60);
        rect.setAttribute('y', 10);
        rect.setAttribute('id', 'item');

        var rect2 = document.createElementNS(svg.namespaceURI, 'rect');
        rect2.setAttribute('width', 40);
        rect2.setAttribute('height', 60);
        rect2.setAttribute('x', 10);
        rect2.setAttribute('y', 30);
        rect2.setAttribute('id', 'item2');

        var rect3 = document.createElementNS(svg.namespaceURI, 'rect');
        rect3.setAttribute('width', 500);
        rect3.setAttribute('height', 90);
        rect3.setAttribute('x', 20);
        rect3.setAttribute('y', 0);
        rect3.setAttribute('id', 'item3');
        rect3.style.fill = 'blue';

        var g = document.createElementNS(svg.namespaceURI, 'g');
        g.setAttribute('id', 'item');

        g.appendChild(rect);
        g.appendChild(rect2);
        g.appendChild(rect3);
        svg.appendChild(g);
        div.appendChild(svg);
        document.body.appendChild(div);

        //Act
        var svgContainerList = browserAction.fixToBoudingBox();
        var itemBounding = svgContainerList[0].getBoundingClientRect();

        //Assert
        var svgBounding = svg.getBBox();
        var divBounding = div.getBoundingClientRect();
        expect(Math.ceil(svgBounding.width)).toBe(533);
        expect(divBounding.width).toBe(533);
        expect(Math.ceil(itemBounding.left) - 1 <= divBounding.left && Math.ceil(itemBounding.left) + 1 >= divBounding.left).toBeTruthy();
    });
});

describe('browserAction, method setLabel', function () {
    beforeEach(function () {
        document.body.innerHTML = '';
    });

    it('should receive an empty list. Label should default to "Option Label"', function(){
        var svgList = [];

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 60);
        rect.setAttribute('y', 10);
        rect.setAttribute('id', 'item');

        svg.appendChild(rect);
        var l = document.createElement('div');
        l.setAttribute('id', 'label');
        
        document.body.appendChild(svg);
        document.body.appendChild(l);

        var label = browserAction.setLabel(svgList);
        expect(label).toBe('Option Label');
    });

    it('should receive one item in the list. Label should be "item"', function(){
        var svgList = [];

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 60);
        rect.setAttribute('y', 10);
        rect.setAttribute('id', 'item');

        svg.appendChild(rect);
        var l = document.createElement('div');
        l.setAttribute('id', 'label');
        
        document.body.appendChild(svg);
        document.body.appendChild(l);

        var gElement = document.querySelector('#item');
        svgList.push(gElement);

        dimensions = browserAction.getDimensions(svgList);
        var svgBounding = svg.getBoundingClientRect();

        var gElement = document.querySelector('#item');
        svgList.push(gElement);

        var label = browserAction.setLabel(svgList);
        expect(label).toBe('Option Item');
    });

    it('should receive one item in the list. Label should be "Walkout" when o-Walkout-o1', function(){
        var svgList = [];

        var id = 'o-Walkout-o1';
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 60);
        rect.setAttribute('y', 10);
        rect.setAttribute('id', id);

        svg.appendChild(rect);
        var l = document.createElement('div');
        l.setAttribute('id', 'label');
        
        document.body.appendChild(svg);
        document.body.appendChild(l);

        var gElement = document.querySelector('#' + id);
        svgList.push(gElement);

        dimensions = browserAction.getDimensions(svgList);
        var svgBounding = svg.getBoundingClientRect();

        var gElement = document.querySelector('#' + id);
        svgList.push(gElement);

        var label = browserAction.setLabel(svgList);
        expect(label).toBe('Option Walkout');
    });

    it('should receive one item in the list. Label should be "Option Walkout" when a-off-Walkout-o52', function(){
        var svgList = [];

        var id = 'a-off-Walkout-o52';
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', 100);
        svg.setAttribute('height', 100);
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('x', 0);
        svg.setAttribute('y', 0);

        var rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('width', 30);
        rect.setAttribute('height', 30);
        rect.setAttribute('x', 60);
        rect.setAttribute('y', 10);
        rect.setAttribute('id', id);

        svg.appendChild(rect);
        var l = document.createElement('div');
        l.setAttribute('id', 'label');
        
        document.body.appendChild(svg);
        document.body.appendChild(l);

        var gElement = document.querySelector('#' + id);
        svgList.push(gElement);

        dimensions = browserAction.getDimensions(svgList);
        var svgBounding = svg.getBoundingClientRect();

        var gElement = document.querySelector('#' + id);
        svgList.push(gElement);

        var label = browserAction.setLabel(svgList);
        expect(label).toBe('Option Walkout');
    });

});