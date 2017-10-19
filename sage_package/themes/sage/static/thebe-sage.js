/**
 * @overview
 * This file aims at replacing the document's Sage code blocks by executable
 * notebook cells. Users are presented a dedicated button in the top right
 * corner. When they click on it, each code block is appended a "Run" button
 * to execute the corresponding code.
 *
 * This is based on the Thebe library (https://github.com/oreillymedia/thebe/)
 * installed in ${SAGE_ROOT}/local/share/thebe/thebe.js by Sage's thebe package.
 */

$(function() {

// TODO: remove
let _pageConfigData = undefined;
function getPageConfig(key) {
  // from jupyterlab coreutils.PageConfig
  if (!_pageConfigData) {
    let el = document.getElementById("thebe-config-data");
    if (el) {
      _pageConfigData = JSON.parse(el.textContent || "{}");
    }
  }
  return (_pageConfigData || {})[key];
}

function getBinderOptions(options) {
  let binderOptions = {
    ref: "master",
    binderUrl: "https://beta.mybinder.org",
  };
  Object.assign(binderOptions, getPageConfig("binderOptions"));
  Object.assign(binderOptions, (options || {}).binderOptions);
  return binderOptions;
}

function getKernelOptions(options) {
  let kernelOptions = {};
  Object.assign(kernelOptions, getPageConfig("kernelOptions"));
  Object.assign(kernelOptions, (options || {}).kernelOptions);
  return kernelOptions;
}

function bootstrap(options) {
    // bootstrap thebe on the page

    options = options || {};
    // bootstrap thebelab on the page
    let cells = renderAllCells(thebelab.getOption("thebeCellSelector", options));
    let kernelPromise;

    let binderOptions = getBinderOptions(options);
    console.log('binderOptions', binderOptions);
    if (binderOptions.repo) {
        kernelPromise = thebelab.requestBinderKernel({
            binderOptions: binderOptions,
            kernelOptions: getKernelOptions(options),
        });
    } else {
        kernelPromise = thebelab.requestKernel(thebelab.getKernelOptions(options));
    }
    kernelPromise.then(kernel => {
        // debug
        window.thebeKernel = kernel;
        thebelab.hookupKernel(kernel, cells);
    });
}

    /**
     * Sanitize the code before executing. For now, transforms the code line
     * into pure text, also stripping out the Sage prompts and continuation
     * characters at line start, if any.
     *
     * @param {Element} cellNode - The DOM element of the cell
     * @param {String} codeClass - The class name associated to code line
     */
    function sanitizeCode(cellNode, codeClass) {
        var rgx = /^(sage: )|(\.\.\.\.: )|(\.\.\.  )/;
        var codeLines = cellNode.getElementsByClassName(codeClass);
        Array.prototype.forEach.call(codeLines, function(line) {
            line.textContent = line.textContent.replace(rgx, '');
        });
    }

    /**
     * Wrap consecutive lines of the same type in a given cell in line blocks.
     *
     * @param {Element} cellNode - The DOM element of the cell
     * @param {String} lineClass - The class name that identifies all cell lines
     * @param {String} specificClass - The class name that identifies the lines
     *                                 to be wrapped
     * @param {String} blockClass - The class name to be given to the add
     *                              wrapper blocks
     */
    function wrapLineBlocks(cellNode, lineClass, specificClass, blockClass) {
        var wrapper,
            lines = cellNode.getElementsByClassName(lineClass);
        Array.prototype.forEach.call(lines, function(line) {
            if (line.classList.contains(specificClass)) {
                if (! wrapper) {
                    wrapper = document.createElement('span');
                    wrapper.classList.add(blockClass);
                    cellNode.insertBefore(wrapper, line);
                }
                wrapper.appendChild(line);
            } else {
                wrapper = null;
            }
        });
    }

    /**
     * Add a class on each line of a cell to categorize them as code or result.
     *
     * @param {Element} cellNode - The DOM element of the cell to categorize the
     *                             lines of
     * @param {String} lineClass - A class name to identify each cell line
     * @param {String} codeClass - A class name to be added on code lines
     * @param {String} resultClass - A class name to be added on result lines
     */
    function categorizeCellLines(cellNode, lineClass, codeClass, resultClass) {
        var lines = cellNode.getElementsByClassName(lineClass);
        var previousCategory;
        Array.prototype.forEach.call(lines, function(line) {
            var lineText = line.textContent;
            if (lineText.startsWith('sage: ')) {
                line.classList.add(codeClass);
                previousCategory = 'code';
                return;
            }
            if (previousCategory === 'code'
                && (lineText.startsWith('....: ')
                    || lineText.startsWith('...  '))) {
                line.classList.add(codeClass);
                return;
            }
            line.classList.add(resultClass);
            previousCategory = 'result';
        });
    }

    /**
     * Add a (span) DOM element around each line of an executable cell
     *
     * @param {Element} cellNode - cell to wrap the lines of
     * @param {String} lineClass - class attribute value for the added span tags
     */
    function wrapEachCellLine(cellNode, lineClass) {
        var html = '';
        cellNode.innerHTML.split('\n').forEach(function(htmlLine) {
            html += '<span class="' + lineClass + '">' + htmlLine + '\n</span>';
        });
        cellNode.innerHTML = html;
    }


    /**
     * Preprocess the code cells, sanitizing out HTML tags (e.g. syntax highlighting),
     * and each cell into a sequence of code and results cells
     *
     */
    function renderAllCells(selector) {
        var lineClass = 'sage-cell-line',
            codeClass = 'sage-code',
            codeBlockClass = 'sage-code-block',
            resultClass = 'sage-expected-result',
            resultBlockClass = 'sage-expected-result-block';
        $(cellSelector).each(function() {
            wrapEachCellLine(this, lineClass);
            categorizeCellLines(this, lineClass, codeClass, resultClass);
            wrapLineBlocks(this, lineClass, codeClass, codeBlockClass);
            wrapLineBlocks(this, lineClass, resultClass, resultBlockClass);
            $('.' + resultBlockClass, this).hide();
            sanitizeCode(this, codeClass);
        });

        return thebelab.renderAllCells({selector:'.' + codeBlockClass})
    }


    var cellSelector = "pre:contains('sage: ')";

    if ($(cellSelector).length > 0) {
        $('<button id="thebe-activate">Activate</button>')
            .css({position: 'absolute', right: 0})
            .click(function() {
                bootstrap({
                    binderOptions: {
                        repo: "nthiery/test-binder-sage",
                    },
                    kernelOptions: {
                        name: "sagemath",
                    },
                    thebeCellSelector: cellSelector
                });
                $(this).attr('disabled', 'disabled');
            })
            .prependTo('div.body');
    }
});
