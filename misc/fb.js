/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-04-21 17:00:05
 * @version $Id$
 * n > 40 时代码执行明显变慢
 */
function fabonacci(n) {
    if (n === 0) {
        return 0;
    }
    if (n === 1) {
        return 1;
    }
    return fabonacci(n - 1) + fabonacci(n - 2);
}

var start  = new Date();
var result = fabonacci(50);
var end    = new Date();

console.log('fabonacci(%d) = %d, use time %dms.', 
            50, 
            result,
            end.getTime() - start.getTime());
