browserAction = (function () {
    'use strict';
    var getData, init, toggleOption, containerForSVG, createCheckBoxesPerOption, removeInlineContent, fixToBoudingBox, getDimensions,
    setLabel, label;

    init = function () {
        var btn = document.querySelector('#data');
        if (btn)
            btn.addEventListener('click', getData);
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

            var svgContainer = containerForSVG.querySelector('svg');
            if (svgContainer) {
                svgContainer.setAttribute('viewBox', "0 0 533 600");
                svgContainer.setAttribute('width', '533px');
            }

            label = document.querySelector('#label');
            options = document.getElementById('list');
            
            options.innerHTML = '';
            svgContainerList = document.querySelectorAll('svg > g');
            for (i = 0; i < svgContainerList.length; ++i) {
                createCheckBoxesPerOption(i, svgContainerList[i])
                removeInlineContent(svgContainerList[i].id);
            }

            fixToBoudingBox();
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

        fixToBoudingBox();
    };

    fixToBoudingBox = function () {
        var svgContainerList = document.querySelectorAll('svg > g'), i, component, scale, dimensions,
            svgContainer, svg, svgContainerBoundingRect, paddingLeft, transform, paddingTop;

        for (i = 0; i < svgContainerList.length; ++i) {
            component = containerForSVG.querySelector('#' + svgContainerList[i].id);
            component.setAttribute('transform', '');
        }

        svg = document.querySelector('svg');

        dimensions = getDimensions(svgContainerList);
        svg.style.width = '533px';


        if (dimensions && dimensions.width) {

            scale = 533 / dimensions.width;
            svg.style.height = (dimensions.height * scale) + 'px';


            for (i = 0; i < dimensions.componentList.length; ++i)
                dimensions.componentList[i].setAttribute('transform', "scale(" + scale + ", " + scale + ")");

            svgContainer = document.querySelector('#container-for-svg');
            svgContainerBoundingRect = svgContainer.getBoundingClientRect();

            dimensions = getDimensions(svgContainerList);
            paddingLeft = svgContainerBoundingRect.left < dimensions.farLeft ? svgContainerBoundingRect.left - dimensions.farLeft : dimensions.farLeft - svgContainerBoundingRect.left;
            paddingTop = svgContainerBoundingRect.top > dimensions.farTop ? dimensions.farTop - svgContainerBoundingRect.top : svgContainerBoundingRect.top - dimensions.farTop;


            for (i = 0; i < dimensions.componentList.length; ++i) {
                transform = "translate(" + paddingLeft + ", " + paddingTop + ") scale(" + scale + ", " + scale + ")";
                dimensions.componentList[i].setAttribute('transform', transform);
            }
        }

        setLabel();
    };

    getDimensions = function (svgContainerList) {
        var i, component, farLeft, farRight, boundingRect, width, farTop, farBottom, height, componentList = [];

        for (i = 0; i < svgContainerList.length; ++i) {
            component = svgContainerList[i];

            if (component.classList.value.trim().indexOf('do-not-show-option') === -1) {
                boundingRect = component.getBoundingClientRect();
                if (!farLeft || farLeft > boundingRect.left)
                    farLeft = boundingRect.left;

                if (!farRight || farRight < boundingRect.right)
                    farRight = boundingRect.right;

                if (!farTop || farTop > boundingRect.top)
                    farTop = boundingRect.top;

                if (!farBottom || farBottom < boundingRect.bottom)
                    farBottom = boundingRect.bottom;

                componentList.push(component);
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
            farBottom: farBottom,
            componentList: componentList
        };
    };

    setLabel = function() {
        label.innerText = 'Label';
    }

    init();

    return {
        getDimensions: getDimensions
    };

})();