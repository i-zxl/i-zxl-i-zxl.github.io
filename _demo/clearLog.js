
// http://10.126.14.42:9200/_cluster/health 集群健康
// http://10.126.14.42:9200/_cat/shards 查看集群下所有分片
// http://10.126.14.42:9200/_cat/indices 查看集群下所有索引
// http://10.126.14.42:9200/_cat/nodes 机器节点信息
// http://10.126.14.42:9200/_cat/allocation?v 查看磁盘空间

/*

  降低磁盘使用空间: （貌似没有用，磁盘空间并没有降下来）

  curl -XDELETE 'http://10.126.14.42:9200/neptune-2018.01.0.1'
  curl -XPOST 'http://10.126.14.42:9200/_forcemerge?only_expunge_deletes=true'
  
  执行完delete之后，es会将对应索引标记为“已删除”, 执行 forcemerge，暴力合并过程中一个不包含删除索引的文档被创建

*/

/*

干货 | Elasticsearch 集群健康值红色终极解决方案 
https://cloud.tencent.com/developer/article/1066287  

解决Elasticsearch分片未分配的问题「译」 
https://fashengba.com/post/how-to-resolve-unassigned-shards-in-elasticsearch.html

*/

// 因为索引删除操作会超时，此脚本并不会每次成功删除所有想删的索引

const { exec } = require('child_process');

const es = "http://10.126.14.42:9200";

const now = Date.now();

const getAllshards = () => {
  return new Promise((resolve, reject) => {
    exec(`curl -XGET ${es}/_cat/indices`, (err, stdout, stderr) => {
      const allShards = stdout.split('\n').map(item => item.split(' ').filter(i => i)).filter( i => i)
      resolve(allShards)
    })
  })
}

function removeElasticSearchIndex ( index, repeat = 3) {
  if(!index) return Promise.resolve(true);
  const url = `curl -XDELETE '${es}/${index}'`
  return new Promise((resolve, reject) => {
    exec(url, (err, stdout, stderr) => {
      stdout = JSON.parse(stdout);
      if (stdout && stdout.status == 503) {
        if (repeat-->0) {
          console.log('starting repeat remove: ', index);
          setTimeout(() => {
            removeElasticSearchIndex(index, repeat)
          }, 1000)
        } else {
          console.log('remove failed: ', index);
          resolve(false);
        }
      } else {
        console.log('remove success: ', index)
        resolve(true)
      }
    })
  })
}

function splitNoProduction (allShards) {
  const RegExpes = ['audittest', 'manual'].map(reg => new RegExp(reg));
  const noProductionShards = [], ProductionShards = [];
  allShards.map(shard => {
    RegExpes.forEach( reg => {
      //shard[2] 存了索引
      if (shard.length) {
        if (shard[2].match(reg)) {
          noProductionShards.push(shard)
        } else {
          ProductionShards.push(shard)
        }
      }
    })
  })
  console.log('测试环境索引: ', noProductionShards.length)
  return [noProductionShards, ProductionShards]
}
// time: 之前的时间
function splitPreTime(shards, time, appid="*") {
  const preDateShards = [], preDate = new Date(time).getTime();
  shards.forEach(shard => {
    let matchResult = shard[2].match(/\d+/g);
    if (matchResult) {
      matchResult = matchResult.join('-');
      const indexDate = new Date(matchResult).getTime();
      if (indexDate < preDate) {
        if (appid === "*") {
          preDateShards.push(shard);
        } else if ((appid && shard[2].indexOf(appid) > -1)) {
          preDateShards.push(shard);
        }
      }
    }
  })
  console.log(`在${time}之前的${appid || ''}索引: `, preDateShards.length)
  return preDateShards;
}

async function run () {
  const allShards = await getAllshards();
  // 清理之前遗留的非线上环境的分片
  const [noProductionShards, ProductionShard] = splitNoProduction(allShards);
  // 每次清理，修改时间线或者项目分片, 默认 "*" 表示清理所有的项目的分片
  const preDateShards = splitPreTime(ProductionShard, '2019-02-01', "*");
  const removeShards = [].concat(preDateShards, noProductionShards);
  removeShards.map(shard => {
    removeElasticSearchIndex(shard[2]);
  })
}

run()


