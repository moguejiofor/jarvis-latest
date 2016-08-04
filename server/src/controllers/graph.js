import config from 'config';
let dbConfig = config.get('graph');

let graph = require("seraph")({
  user: dbConfig.user,
  pass: dbConfig.pass,
  server: dbConfig.server
});

function queryGraph(cypher, params={}){
  return new Promise(function(resolve, reject) {
    // console.log('Executing::::', cypher);
    graph.query(cypher, params, function(err, result){
      if (err) reject(err)
      else resolve(result)
    });
  });
}
async function getNormalizedWeight(query){
  let normalizedSumCypherResult = await queryGraph(query);
  let normalizedWeight = parseFloat(normalizedSumCypherResult[0].normalizedSumWeight);
  normalizedWeight = (normalizedWeight > 0) ? normalizedWeight : 1;
  return normalizedWeight;

}

let graphController = {
  getUsers: async function(req, res) {
    let cypher = `match (n:User) return n`;
    try {
      let result = await queryGraph(cypher);
      res.json(result);
    } catch (e) {
      console.error('Query to graph for users failed', cypher);
      res.json({'error': e});
    }
  },

  query: async function(req, res){
    let nodeId = req.param('nodeId');
    let relationshipType = req.param('relationshipType') || false;
    let startNodeType = req.param('startNodeType') || false;
    let endNodeType = req.param('endNodeType') || false;
    let relationshipCypherVariableString = relationshipType ? 'relationship:' + relationshipType : 'relationship'
    let startNodeString = startNodeType ? 'startNode:' + startNodeType : 'startNode'
    let endNodeString = endNodeType ? 'endNode:' + endNodeType : 'endNode'

    let startUserNodeId = req.param('startUserNodeId') || false;
    let endUserNodeIds = req.param('endUserNodeIds') || false;
    let normalizedSumCypher;
    let normalizedWeight;
    let cypher;



    if (startUserNodeId && (!endUserNodeIds || endUserNodeIds.length === 0)){
      cypher = `match (startUserNode:User)-[t:touched]-(${startNodeString})-[${relationshipCypherVariableString}]-(endNode) where ID(startNode) = ${nodeId}`
      cypher += ` and ID(startUserNode) = ${startUserNodeId}`
      normalizedSumCypher = cypher + ` return avg(${relationshipCypherVariableString}.weight) as normalizedSumWeight`;
      normalizedWeight = await getNormalizedWeight(normalizedSumCypher)

      cypher += ` return startNode,type(relationship) as relationshipType, (${relationshipCypherVariableString}.weight / ${normalizedWeight}) as relationshipWeight, collect(distinct endNode)[0] as endNode order by relationshipWeight desc`

    }
    if (startUserNodeId && endUserNodeIds && endUserNodeIds.length > 0){
      cypher = `match (startUserNode:User)-[t:touched]-(${startNodeString})-[${'startUserRel_' + relationshipCypherVariableString}]-(endNode)-[${'endUserRel_' + relationshipCypherVariableString}]-(endUserNode:User) where ID(startNode) = ${nodeId}`
      cypher += ` and ID(startUserNode) = ${startUserNodeId}`
      cypher += ` and ID(endUserNode) in [${endUserNodeIds.join(',')}]`

      normalizedSumCypher = cypher + ` return avg(${'endUserRel_' + relationshipCypherVariableString}.weight) as normalizedSumWeight`;
      normalizedWeight = await getNormalizedWeight(normalizedSumCypher)

      cypher += ` return startNode,type(${'endUserRel_' + relationshipCypherVariableString}) as relationshipType, (${'endUserRel_' + relationshipCypherVariableString}.weight / ${normalizedWeight}) as relationshipWeight, collect(distinct endNode)[0] as endNode order by relationshipWeight desc`
    }
    if (!startUserNodeId && endUserNodeIds && endUserNodeIds.length > 0){
      cypher = `match (startUserNode:User)-[t:touched]-(${startNodeString})-[${'startUserRel_' + relationshipCypherVariableString}]-(endNode)-[${'endUserRel_' + relationshipCypherVariableString}]-(endUserNode:User) where ID(startNode) = ${nodeId}`
      cypher += ` and ID(endUserNode) in [${endUserNodeIds.join(',')}]`

      normalizedSumCypher = cypher + ` return avg(${'endUserRel_' + relationshipCypherVariableString}.weight) as normalizedSumWeight`;
      normalizedWeight = await getNormalizedWeight(normalizedSumCypher)
      cypher += ` return startNode,type(${'endUserRel_' + relationshipCypherVariableString}) as relationshipType, (${'endUserRel_' + relationshipCypherVariableString}.weight / ${normalizedWeight}) as relationshipWeight, collect(distinct endNode)[0] as endNode order by relationshipWeight desc`
    }


    try{

      if (!startUserNodeId && !endUserNodeIds){
        normalizedSumCypher = `start startNode=node(${nodeId}) match (${startNodeString})-[${relationshipCypherVariableString}]-(${endNodeString}) return log(sum(relationship.weight)) as normalizedSumWeight`;
        normalizedWeight = await getNormalizedWeight(normalizedSumCypher);


        cypher = `
          start startNode=node(${nodeId}) match (${startNodeString})-[${relationshipCypherVariableString}]-(${endNodeString}) return startNode, type(relationship) as relationshipType, log(relationship.weight)/${normalizedWeight} as relationshipWeight, endNode order by relationshipWeight desc limit 15
        `
      }

      try{
        let result = await queryGraph(cypher);
        res.json(result);
      }
      catch(error){
        console.error('Query to graph failed', cypher);
        res.json({'error': error});

      }
    }
    catch(error){
      console.error('Query to graph failed', cypher);
      res.json({'error': error});

    }



  }


}


module.exports =  graphController
