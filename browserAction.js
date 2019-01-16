browserAction = (function () {
    "use strict";

    var init, toggleOption, containerForSVG, createOption, removeInlineContent, fixToBoudingBox,
        getDimensions, removeHiddenGElements, downloadAllIndividually;

    init = function () {
        pullSVGData();

        var downloadBtn = document.querySelector("#download");
        if (downloadBtn)
            downloadBtn.addEventListener("click", download);

        var extBtn = document.querySelector("#png");
        if (extBtn) {
            extBtn.addEventListener("click", function () {
                setExtension("png");
            });
        }

        extBtn = document.querySelector("#jpg");
        if (extBtn) {
            extBtn.addEventListener("click", function () {
                setExtension("jpg");
            });
        }

        var download_All = document.querySelector("#downloadAll");
        if (download_All)
            download_All.addEventListener("click", downloadAllIndividually);
    };

    downloadAllIndividually = function () {
        var i;
        var options = document.querySelector('#options');
        var checkboxes = options.querySelectorAll("input");
        var fileName = document.querySelector('#fileName');

        // todo? Turn off all options prior to download
        for (i = 0; i < checkboxes.length; ++i) {
            checkboxes[i].checked = false;

            toggleOption({
                srcElement: {
                    value: checkboxes[i].defaultValue
                },
                currentTarget: {
                    checked: false
                }
            });            
        }

        for (i = 0; i < checkboxes.length; ++i) {
            (function (i) {
                setTimeout(function () {
                    checkboxes[i].checked = true;

                    if (i > 0) {
                        checkboxes[i-1].checked = false;
                        toggleOption({
                            srcElement: {
                                value: checkboxes[i-1].defaultValue
                            },
                            currentTarget: {
                                checked: false
                            }
                        });
                    }

                    toggleOption({
                        srcElement: {
                            value: checkboxes[i].defaultValue
                        },
                        currentTarget: {
                            checked: true
                        }
                    });

                    fileName.value = checkboxes[i].value;
                    download();
                }, 500 * i);
            })(i);
        }
    };

    function setExtension(ext) {
        var jpg = document.querySelector("#jpg");
        var png = document.querySelector("#png");

        if (ext === 'jpg')
            png.checked = !jpg.checked;
        else if (ext === 'png')
            jpg.checked = !png.checked;
    }

    function pullSVGData() {
        chrome.tabs.executeScript(
            {
                code:
                    "(" +
                    function () {
                        var svgContainer = document.querySelector(".svg-container svg");
                        if (svgContainer)
                            return { success: true, node: svgContainer.outerHTML };
                    } +
                    ")();"
            },
            formatReturningHTML
        );
    }

    function formatReturningHTML(html) {
        var i, svgContainerList, options;

        var width = getWidth();

        containerForSVG = document.getElementById("container-for-svg");
        containerForSVG.innerHTML = html[0].node;

        var svgContainer = document.querySelector(".svg-container svg");
        if (svgContainer) {
            svgContainer.style.width = width + "px";
            svgContainer.style.height = width + "px";
        }

        var svg = containerForSVG.querySelector("svg");
        if (svg) {
            svg.setAttribute("viewBox", "0 0 " + width + " 600");
            svg.setAttribute("width", width + "px");
            svg.setAttribute("height", width + "px");
        }

        options = document.getElementById("options");
        options.innerHTML = "";

        svgContainerList = document.querySelectorAll("svg > g");
        for (i = 0; i < svgContainerList.length; ++i) {
            const node = createOption(i, svgContainerList[i]);
            options.appendChild(node);
            removeInlineContent(svgContainerList[i].id);
        }

        svgContainerList = fixToBoudingBox();
    }

    removeInlineContent = function (optionId) {
        var optionDiv = document.getElementById(optionId);
        optionDiv.style.display = "";
        optionDiv.style.visibility = "";
        optionDiv.style.cssText = "";
    };

    createOption = function (i, option) {
        var node, label, nodeDiv;

        nodeDiv = document.createElement("div");
        nodeDiv.classList += "list-item";

        node = document.createElement("input");
        node.type = "checkbox";
        node.id = "checkbox" + i;
        node.value = option.id;

        label = document.createElement("label");
        label.htmlFor = "checkbox" + i;
        label.innerHTML = option.id;
        label.id = "label" + i;

        nodeDiv.appendChild(node);
        nodeDiv.appendChild(label);

        node.addEventListener("change", toggleOption);
        node.checked = true;
        return nodeDiv;
    };

    toggleOption = function (option) {
        var component;

        if (!option || !option.srcElement || !option.srcElement.value) return;

        var fileInput = document.querySelector('#fileName');

        component = containerForSVG.querySelector("#" + option.srcElement.value);
        if (option.currentTarget.checked) {
            if (component.classList.value.trim() !== "") {
                component.classList.value = component.classList.value.replace(/do-not-show-option/g, "").trim();
                component.classList.value = component.classList.value.replace(/show-option/g, "").trim();
            }

            component.classList += " show-option";
            fileInput.value = option.srcElement.value;
        } else {

            if (component.classList.value.trim() !== "") {
                component.classList.value = component.classList.value.replace(/do-not-show-option/g, "").trim();
                component.classList.value = component.classList.value.replace(/show-option/g, "").trim();
            }

            component.classList += " do-not-show-option";
            fileInput.value = '';
        }

        fixToBoudingBox();
    };

    function getWidth() {
        if (document.querySelector("#width"))
            return parseInt(document.querySelector("#width").value, 10);
        else
            return 533;
    }

    fixToBoudingBox = function () {
        var svgContainerList, i, scale, dimensions, svgContainer, svg, svgContainerBoundingRect,
            paddingLeft, transform, paddingTop, width;

        width = getWidth();

        svgContainer = document.querySelector("#container-for-svg");
        svg = document.querySelector("svg");

        if (svg && svgContainer) {
            svg.setAttribute("width", width + "px");
            svgContainer.style.width = width + "px";
            svgContainerList = document.querySelectorAll("svg > g");

            for (i = 0; i < svgContainerList.length; ++i)
                svgContainerList[i].removeAttribute("transform");

            dimensions = getDimensions(svgContainerList);

            if (dimensions && dimensions.width && dimensions.height && dimensions.farLeft && dimensions.farTop) {
                scale = width / dimensions.width;
                var height = dimensions.height * scale;
                svg.setAttribute("height", height + "px");
                svg.setAttribute("viewBox", "0 0 533 " + height);

                for (i = 0; i < svgContainerList.length; ++i)
                    svgContainerList[i].setAttribute("transform", "scale(" + scale + ", " + scale + ")");

                svgContainerBoundingRect = svgContainer.getBoundingClientRect();

                dimensions = getDimensions(svgContainerList);
                paddingLeft =
                    svgContainerBoundingRect.left < dimensions.farLeft
                        ? svgContainerBoundingRect.left - dimensions.farLeft
                        : dimensions.farLeft - svgContainerBoundingRect.left;

                paddingTop =
                    svgContainerBoundingRect.top > dimensions.farTop
                        ? dimensions.farTop - svgContainerBoundingRect.top
                        : svgContainerBoundingRect.top - dimensions.farTop;

                for (i = 0; i < svgContainerList.length; ++i) {
                    transform = `translate(${paddingLeft}, ${paddingTop}) scale(${scale}, ${scale})`;
                    svgContainerList[i].setAttribute("transform", transform);
                }
            }
        }

        return svgContainerList;
    };

    getDimensions = function (svgContainerList) {
        var i, component, farLeft, farRight, boundingRect, width, farTop,
            farBottom, height;

        for (i = 0; i < svgContainerList.length; ++i) {
            component = svgContainerList[i];

            if (component && component.classList && component.classList.value.trim().indexOf("do-not-show-option") === -1) {
                boundingRect = component.getBoundingClientRect();
                if (!farLeft || farLeft > boundingRect.left)
                    farLeft = boundingRect.left;

                if (!farRight || farRight < boundingRect.right)
                    farRight = boundingRect.right;

                if (!farTop || farTop > boundingRect.top) farTop = boundingRect.top;

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

    removeHiddenGElements = function (element) {
        var children = element.querySelectorAll("svg > g");
        for (var i = 0; i < children.length; ++i) {
            if (children[i].classList.contains("do-not-show-option"))
                children[i].remove();
        }

        return element;
    };

    function download() {
        var element = document.querySelector("#svg-and-label");
        var copy = element.cloneNode(element);
        copy = removeHiddenGElements(copy);

        var width = getWidth();
        var elementBounding = element.getBoundingClientRect();

        var svg = copy.querySelector("svg");
        svg.setAttribute("viewBox", `0 0 ${width} ${elementBounding.height}`);

        // var svgBounding = element.querySelector("svg").getBoundingClientRect();
        var svgData = new XMLSerializer().serializeToString(svg);
        var canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = elementBounding.height;
        canvas.style.width = width;
        canvas.style.height = elementBounding.height;
        document.body.appendChild(canvas);

        var ctx = canvas.getContext("2d");
        var img = document.createElement("img");

        img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
        img.setAttribute("width", width);
        img.setAttribute("height", elementBounding.height);

        img.onload = function () {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            var canvasdata = canvas.toDataURL("image/png", 1);

            var a = document.createElement("a");
            var fileName = document.querySelector("#fileName");

            a.download = (fileName.value || "download_img") + getExtension();
            a.href = canvasdata;
            document.body.appendChild(a);
            a.click();
        };
    }

    function getExtension() {
        if (document.querySelector("#jpg").checked)
            return ".jpg";

        return ".png";
    }

    init();

    return {
        getDimensions: getDimensions,
        fixToBoudingBox: fixToBoudingBox
    };
})();
