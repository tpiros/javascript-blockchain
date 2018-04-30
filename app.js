const http = require('http');
const url = require('url');

const Blockchain = require('./blockchain.class');
const blockchain = new Blockchain();

const port = 3000;

const server = http.createServer((req, res) => {
  const urlParts = url.parse(req.url);
  switch(urlParts.pathname) {
    case '/mine':
      const mine = (req, res) => {
        const lastBlock = blockchain.lastBlock();
        const lastProof = lastBlock.proof;
        const proof = blockchain.proofOfWork(lastProof);
        const previousHash = blockchain.hash(JSON.stringify(lastBlock));
        const block = blockchain.createBlock(proof, previousHash);

        const response = {
          message: 'New block forged',
          index: block.index,
          proof: block.proof,
          previousHash: block.previousHash
        };

        res.end(JSON.stringify(response));
      };
      mine(req, res);
      break;
    case '/chain':
      const chain = (req, res) => {
        const response = {
          chain: blockchain.chain,
          length: blockchain.chain.length
        };
        return res.end(JSON.stringify(response));
      }
      chain(req, res);
      break;
    default:
      const def = (req, res) => res.end(`Pick and endpoint:
      "/chain" to view the blockchain
      "/mine" to mine a new block`);
      def(req, res);
      break;
  }
});

server.listen(port, () => console.log(`Server running at http://localhost:${port}`));