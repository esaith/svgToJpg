browserAction = (function () {
    'use strict';
    var getData, init, toggleOption, containerForSVG, createCheckBoxesPerOption, removeInlineContent, fixToBoudingBox, getDimensions,
        setLabel, label, maxWidth, download;

    init = function () {
        var data = document.querySelector('#data');
        if (data)
            data.addEventListener('click', getData);

        var downloadBtn = document.querySelector('#download');
        if (downloadBtn)
            downloadBtn.addEventListener('click', download);

        maxWidth = 533;
    }

    getData = function () {
        chrome.tabs.executeScript({
            code: '(' + function () {
                var svgContainer = document.querySelector('.svg-container svg');
                if (svgContainer)
                    return { success: true, node: svgContainer.outerHTML };

            } + ')();'
        }, function (results) {
            var i, svgContainerList, options;

            containerForSVG = document.getElementById('container-for-svg');
            containerForSVG.innerHTML = results[0].node;

            var svgContainer = document.querySelector('.svg-container svg');
            if (svgContainer) {
                svgContainer.style.width = maxWidth + 'px';
                svgContainer.style.height = maxWidth + 'px';
            }

            var svg = containerForSVG.querySelector('svg');
            if (svg) {
                svg.setAttribute('viewBox', '0 0 ' + maxWidth + ' 600');
                svg.style.width = maxWidth + 'px';
                svg.style.height = maxWidth + 'px';
            }

            label = document.querySelector('#label');
            options = document.getElementById('list');

            options.innerHTML = '';
            label.innerText = '';

            svgContainerList = document.querySelectorAll('svg > g');
            for (i = 0; i < svgContainerList.length; ++i) {
                createCheckBoxesPerOption(i, svgContainerList[i])
                removeInlineContent(svgContainerList[i].id);
            }

            var svgContainerList = fixToBoudingBox();
            setLabel(svgContainerList);
        });
    };

    removeInlineContent = function (optionId) {
        var optionDiv = document.getElementById(optionId);
        optionDiv.style.display = '';
        optionDiv.style.visibility = '';
        optionDiv.style.cssText = '';
    };

    createCheckBoxesPerOption = function (i, option) {
        var i, node, label, nodeDiv;

        nodeDiv = document.createElement('div');
        nodeDiv.classList += 'list-item'

        node = document.createElement('input');
        node.type = 'checkbox';
        node.id = 'checkbox' + i;
        node.value = option.id;

        label = document.createElement('label');
        label.htmlFor = 'checkbox' + i;
        label.innerHTML = option.id;
        label.id = 'label' + i;

        nodeDiv.appendChild(node);
        nodeDiv.appendChild(label);
        list.appendChild(nodeDiv);

        node.addEventListener('change', toggleOption);
        node.checked = true;
    };

    toggleOption = function (option) {
        var component;

        component = containerForSVG.querySelector('#' + option.srcElement.value);
        if (option.currentTarget.checked) {
            if (component.classList.value.trim() !== '') {
                component.classList.value = component.classList.value.replace(/do-not-show-option/g, '').trim();
                component.classList.value = component.classList.value.replace(/show-option/g, '').trim();
            }
            component.classList += ' show-option';


        } else {
            if (component.classList.value.trim() !== '') {
                component.classList.value = component.classList.value.replace(/do-not-show-option/g, '').trim();
                component.classList.value = component.classList.value.replace(/show-option/g, '').trim();
            }
            component.classList += ' do-not-show-option';
        }

        var svgContainerList = fixToBoudingBox();
        setLabel(svgContainerList);
    };

    fixToBoudingBox = function () {
        var svgContainerList, i, component, scale, dimensions, maxWidth, svgContainer, svg,
            svgContainerBoundingRect, paddingLeft, transform, paddingTop;

        maxWidth = maxWidth || 533;
        svgContainer = document.querySelector('#container-for-svg');
        svg = document.querySelector('svg');

        if (svg && svgContainer) {
            svg.style.width = maxWidth + 'px';
            svgContainer.style.width = maxWidth + 'px';
            svgContainerList = document.querySelectorAll('svg > g');

            for (i = 0; i < svgContainerList.length; ++i)
                svgContainerList[i].removeAttribute('transform');

            dimensions = getDimensions(svgContainerList);

            if (dimensions && dimensions.width && dimensions.height && dimensions.farLeft && dimensions.farTop) {
                scale = maxWidth / dimensions.width;
                svg.style.height = (dimensions.height * scale) + 'px';
                svg.setAttribute('viewBox', '0 0 533 ' + (dimensions.height * scale));

                for (i = 0; i < svgContainerList.length; ++i)
                    svgContainerList[i].setAttribute('transform', "scale(" + scale + ", " + scale + ")");

                svgContainerBoundingRect = svgContainer.getBoundingClientRect();

                dimensions = getDimensions(svgContainerList);
                paddingLeft = svgContainerBoundingRect.left < dimensions.farLeft ? svgContainerBoundingRect.left - dimensions.farLeft : dimensions.farLeft - svgContainerBoundingRect.left;
                paddingTop = svgContainerBoundingRect.top > dimensions.farTop ? dimensions.farTop - svgContainerBoundingRect.top : svgContainerBoundingRect.top - dimensions.farTop;

                for (i = 0; i < svgContainerList.length; ++i) {
                    transform = "translate(" + paddingLeft + ", " + paddingTop + ") scale(" + scale + ", " + scale + ")";
                    svgContainerList[i].setAttribute('transform', transform);
                }
            }
        }

        return svgContainerList;
    };

    getDimensions = function (svgContainerList) {
        var i, component, farLeft, farRight, boundingRect, width, farTop, farBottom, height, componentList = [];

        for (i = 0; i < svgContainerList.length; ++i) {
            component = svgContainerList[i];

            if (component && component.classList && component.classList.value.trim().indexOf('do-not-show-option') === -1) {
                boundingRect = component.getBoundingClientRect();
                if (!farLeft || farLeft > boundingRect.left)
                    farLeft = boundingRect.left;

                if (!farRight || farRight < boundingRect.right)
                    farRight = boundingRect.right;

                if (!farTop || farTop > boundingRect.top)
                    farTop = boundingRect.top;

                if (!farBottom || farBottom < boundingRect.bottom)
                    farBottom = boundingRect.bottom;
            }
        }

        width = farRight > farLeft ? farRight - farLeft : farLeft - farRight;
        height = farTop < farBottom ? farBottom - farTop : farTop - farBottom;

        return {
            width: width,
            height: height,
            farLeft: farLeft,
            farRight: farRight,
            farTop: farTop,
            farBottom: farBottom
        };
    };

    setLabel = function (svgContainerList) {
        var id;
        if (!label)
            label = document.querySelector('#label');

        if (svgContainerList && svgContainerList.length > 0) {
            id = svgContainerList[0].id;

            for (var i = 0; i < svgContainerList.length; ++i) {
                if (svgContainerList[i].id.indexOf('o-') > -1) {
                    id = svgContainerList[i].id;
                }
            }

            var index = id.lastIndexOf('-');
            if (index > -1)
                id = id.substring(0, index);

            index = id.lastIndexOf('-');
            if (index > -1)
                id = id.substring(index + 1);

            label.innerText = 'Option ' + id[0].toUpperCase() + id.slice(1);
        } else {
            label.innerText = 'Option Label';
        }

        return label.innerText;
    }

    download = function () {
        var element = document.querySelector("#svg-and-label");
        var elementBounding = element.getClientRects();

        var svg = document.querySelector("svg");
        //var svg = element;
        var svgData = new XMLSerializer().serializeToString(svg);
        var canvas = document.createElement("canvas");

        canvas.width = elementBounding.width;
        canvas.height = elementBounding.height;
        canvas.style.width = elementBounding.width;
        canvas.style.height = elementBounding.height;

        var ctx = canvas.getContext("2d");
        ctx.scale(1, 1);
        var img = document.createElement("img");
        img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            var canvasdata = canvas.toDataURL("image/png", 1);
            console.log(canvasdata);
            var pngimg = '<img src="' + canvasdata + '">';
            
            var a = document.createElement("a");
            a.download = "download_img" + ".png";
            a.href = canvasdata;
            document.body.appendChild(a);
            a.click();
        }
    }

        init();

        return {
            getDimensions: getDimensions,
            fixToBoudingBox: fixToBoudingBox,
            setLabel: setLabel
        };

    }) ();