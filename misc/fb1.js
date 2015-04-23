/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-04-21 17:02:17
 * @version $Id$
 */

var cache = {
    0: 0,
    1: 1
};

function fabonacci(n) {
    return typeof cache[n] === 'number'
           ? cache[n]
           : cache[n] = fabonacci(n - 1) + fabonacci(n - 2);
}

var start  = new Date();
var result = fabonacci(1476);
var end    = new Date();

console.log('fabonacci(%d) = %d, use time %dms.', 
            50, 
            result,
            end.getTime() - start.getTime());
console.log(cache);