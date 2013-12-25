(function(root){
    /**
     * @module WordCount
     */

    /**
     * @title WordCount.js
     * @author Robert Bost <bostrt at gmail dot com>
     * @copyright &copy; 2013 Robert Bost
     * @license MIT
     * WordCount.js is a client-side JS library that counts bytes, words, lines 
     * chars, and calculates the longest line of a file. This library utilized
     * the HTML5 File API. 
     *
     * > # Callbacks
     * Callbacks are passed into each of WordCount's 
     * functions. Each callback should accept 3 parameters, (1) the value that the 
     * function is calculating or finding, (2) the File object that was uploaded, 
     * (3) and the ID selector of the file input element.
     * `callback(value, file, inputSelector)`
     */
    var WordCount = function() {
    };

    /**
     * When a file is uploaded using the file input element with the given input
     * selector then the number of the bytes in the uploaded file is calculated
     * and then callback is called.
     * @param {String} inputSelector - The selector for a file input element.
     * @param {Function} callback - Called when a file has been completely uploaded and bytes have been calculated.
     * @returns {undefined}
     */
    WordCount.bytes = function(inputSelector, callback){
        addFileChangeListener(inputSelector, function(file) {
            callback(file.size, file, inputSelector);           
        });
    };

    /**
     * When a file is uploaded using the file input element with the given input
     * selector then the longest line in the file is located and the callback
     * is called.
     * 
     * @param {String} inputSelector - The selector for a file input element.
     * @param {Function} callback - Called when a file has been completely uploaded and the longest line has been found.
     * @returns {undefined}
     */
    WordCount.longest = function(inputSelector, callback) {
        addFileChangeListener(inputSelector, function(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                if (e.target.readyState === 2) {
                    var text = e.target.result;
                    callback(WordCount.longestInText(text) ,file, inputSelector);
                }
            };
            
            reader.readAsText(file);
        });
    };

    /*
     * Finds longest line in given text.
     */
    WordCount.longestInText = function(text) {
	if (text == null) {
	    return null;
	}
	
        var split = text.split(/\n/g);
        if (split != null) {
            if (split.length > 1) {
                var longest = split[0];
                for (var i = 1; i < split.length; i++) {
                    if (longest.length < split[i].length) {
                        longest = split[i];
                    }
                }
                return longest;
            } else {
                return split[0];
            }
        } else {
            // return the only line...
            return text;
        }
	
    };

    /**
     * When a file is uploaded using the file input element with the given input
     * selector then the number of words in the file is calculated and the
     * callback is called. A word is a non-zero-length sequence of characters
     * delimited by white space.
     * @param {String} inputSelector - The selector for a file input element.
     * @param {Function} callback - Called after a file is available and the number of words have been calculated.
     * @returns {undefined}
     */
    WordCount.words = function(inputSelector, callback) {
        addFileChangeListener(inputSelector, function(file) {
           var reader = new FileReader() ;
           reader.onload = function(e) {
             if (e.target.readyState === 2) {
                 var text = e.target.result;
		 callback(WordCount.wordsInText(text), file, inputSelector);
             }  
           };
           
           reader.readAsText(file);
        });
    };

    /*
     * Find number of words in given text.
     */
    WordCount.wordsInText = function(text) {
	if (text == null) {
	    // There is no text.
	    return 0;
	}

        text = text.trim(); // Clear ends.
        var split = text.split(/\s+/g);
        if (split.length === 1) {
            if (split[0].trim() === '') {
		// There is no text.
                return 0;
            } else {
		// There can be only one.
                return 1;
            }
        } else {
            return split.length;
        }
    };

    /**
     * When a file is uploaded using the file input element with the given input
     * selector then the number of chars in the file are calculated and the
     * callback is called.
     * @param {String} inputSelector - The selector for a file input element.
     * @param {Function} callback - Called after a file is available and the number of chars in that file have been calculated.
     * @returns {undefined}
     */    
    WordCount.chars = function(inputSelector, callback) {
        addFileChangeListener(inputSelector, function(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                if (e.target.readyState === 2) {
                    var text = e.target.result;
		    var charsLength = WordCount.charsInText(text);
		    callback(charsLength, file, inputSelector);
                }
            };
            
            reader.readAsText(file);
        });
    };

    /*
     * Find number of chars in given text.
     */
    WordCount.charsInText = function(text) {
	if (text == null) {
	    return 0;
	}
	
	return text.split(/./g).length;
    };

    /**
     * When a file is uploaded using the file input element with the given input
     * selector then the number of lines in the file are calculated and the
     * callback is called.
     * @param {String} inputSelector - The selector for a file input element.
     * @param {Function} callback - Called after a file is available and the number of lines in that file have been calculated.
     * @returns {undefined}
     */
    WordCount.lines = function(inputSelector, callback) {
        addFileChangeListener(inputSelector, function(file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                if (e.target.readyState === 2) {
                    // upload is complete.
                    if (e.loaded > 0) {
                        // File has contents
                        var string = e.target.result;
			callback(WordCount.linesInText(string), file, inputSelector);
                    }
		}
            };
            reader.readAsBinaryString(file);
        });
    };

    /*
     * Find number of lines in given text.
     */
    WordCount.linesInText = function(text) {
	if (text == null) {
	    return 0;
	}
        var matching = text.match(/\n/g);
        if (matching != null) {
            return matching.length;
        } else {
            // File has content but no newlines...must be a single line!
            return 1;
        }
    };

    /*
     * Schedules a "change" event listener on a file input element.
     * When the "change" event is fired, the callback is called for each
     * file that was supplied.
     */
    function addFileChangeListener(inputSelector, callback) {
        var input = document.getElementById(inputSelector);
        input.addEventListener("change", function(event) {
            var files = event.target.files;
            if (files != undefined) {
                for (var i = 0; i < files.length; i++) {
                    callback(files[i]);
                }
            }
        });
    };
    
    // Export the wc.js class to the world!
    if (typeof define !== 'undefined' && define.amd) {
        define(WordCount);
    } else if (typeof exports === 'object') {
        module.exports = WordCount;
    } else {
        root.WordCount = WordCount;
    }    
})(this);
