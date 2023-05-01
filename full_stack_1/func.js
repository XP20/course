var prompt = require('prompt');

function mult_pow(x, b) {
    let result = 1;
    for (let i = 0; i < b; i++) result *= x*b;
    return result;
}

prompt.start();
prompt.get(['x', 'b'],
    function (err, result) {
        console.log('result: ', mult_pow(result.x,result.b));
});