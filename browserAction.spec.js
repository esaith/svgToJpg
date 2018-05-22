 describe('browser action test', function(){
    it('should pass', function(){
        expect(true).toBeTruthy();
    });

    it('should find browser action variable without failing', function(){
        expect(browserAction).not.toBe(null);
    });

    it('should not fail if no svgContainerList', function(){ 
        var svgList = [];
        dimensions = browserAction.getDimensions(svgList);

        expect(dimensions.farLeft).not.toBeDefined();
    })

    it('should find width for basic rect', function(){ 
        var svgList = [];
        var item = '<rect id="item" x="60" y="10" rx="10" ry="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>'
        svgList.push(item);

        dimensions = browserAction.getDimensions(svgList);

        expect(dimensions.farLeft).not.toBeDefined();
    })
 })