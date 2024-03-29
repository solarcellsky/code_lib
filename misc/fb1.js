/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-04-21 17:02:17
 * @version $Id$
 * 能显示的最大数 n = 1476
 * 代码能执行的最大数 n = 8362
 * n > 8362 报错 Maximum call stack size exceeded
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
