const http = require("http");
const child_process = require('child_process');
const cluster = require("cluster");
const numCPUS = require('os').cpus().length;

if (cluster.isMaster) {
  /* 当监听到某个进程挂了，则开始 */
  console.log("master process:" + process.pid);
  
  for (var i = 0; i < numCPUS; i++) {

    // 进程退出事件，worker 退出的进程， code: 正常退出的代码，signal: 导致进程被杀死的信号名称
   /*  cluster.on('exit', function(worker, code, signal) {
      // worker.exitedAfterDisconnect 进程是由于.kill 或 .disconnect 退出的是： true, 其他的为false
      // 可以用来区分主动退出还是被动退出
      if (code !== 0 && !worker.exitedAfterDisconnect) {
        console.log('Worker crashed. Starting a new worker', code);
        cluster.fork();
      }
    }) */
    //cluster.fork();
  }
 

  process.on("SIGUSR2", function () {
    console.log("Received SIGUSR2 from system");
    console.log("Restarting workers");
    var workers = Object.keys(cluster.workers);
    
    function restartWorker(i){
      if ( i >= workers.length) return;
      var worker = cluster.workers[workers[i]];
      console.log('Stopping worker:' + worker.process.pid);
      worker.disconnect();

      worker.on('exit', function () {
          if(!worker.exitedAfterDisconnect) return;

          var newWorker = cluster.fork();
          // 工作进程正在监听
          newWorker.on('listening',function () {
              restartWorker(i+1);
          })
      })
    }
    restartWorker(0);
  })


} else {
  http.createServer(function(req, res) {
    console.log("process run: ", process.pid);
    res.writeHead(200);
    res.write(fib(40).toString());
    res.end();
  }).listen(8000, function() {
    console.log("process:" + process.pid);
  })
}

function fib(n) {
  return n > 1 ? fib(n - 1) + fib(n - 2) : 1;
}




// 0停机事件重启 一次只启动一个worker，其余继续工作