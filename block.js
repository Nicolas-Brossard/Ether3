const CryptoJs = require('crypto-js');

//Class d'un block pour la blockchain Ether 3 
class Block {
  constructor( index, previousHash, timestamp, data, hash){
    this.index= index;
    this.previousHash = previousHash.toString();
    this.timestamp = timestamp;
    this.data = data;
    this.hash = hash.toString();
  }
}

// Initialisation de la queue vide
const transactionQueue = [];

//Creation de transaction qui sont ajoutées à la queue
const generateRandomTransaction = () => {
  for (let index = 0; index < 1000000; index++) {
    const randomTransaction = (Math.random() + 1).toString(36).substring(2);
    transactionQueue.push(randomTransaction);
  }
};

//Fonction de hachage
const calculateHash = (index, previousHash, timestamp, data) => (CryptoJs.SHA256(index + previousHash + timestamp + data).toString())

//Fonction permettant de créer le genesis bloc
const getGenesisBlock = () => (new Block(0, "0", new Date().getTime()/1000, "Genesis block !", CryptoJs.SHA256().toString()))

//Fonction de création de bloc
const generateNextBlock = (blockData) => {
  const previousBlock = getLastBlock();
  const nextIndex = previousBlock.index + 1;
  const nextTimeStamp = new Date().getTime()/1000;
  const nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimeStamp, blockData)
  return new Block(nextIndex, previousBlock.hash, nextTimeStamp, blockData, nextHash)
};

//blockchain
const blockchain = [getGenesisBlock()];

//Fonction récupérant le dernier bloc
const getLastBlock = () => blockchain[blockchain.length - 1 ]

//Fonction de calcul du hash utilisée pour la vérification des blocs
const calculateHashForBlock = (block) => (
  calculateHash(block.index, block.previousHash, block.timestamp, block.data)
);

//Vérification des nouveaux blocs
const isValidNewBlock = (newBlock, previousBlock) => {
  if (previousBlock.index + 1 !== newBlock.index) {
      console.log('index invalide');
      return false;
  } else if (previousBlock.hash !== newBlock.previousHash) {
      console.log('previousHash invalide');
      return false;
  } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
      console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
      console.log('hash invalide: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
      return false;
  }
  return true;
};

//Fonction permettant la vérification du bloc génésis
const isValidGenesisBlock = (genesisBlockToValidate) => {
  if (JSON.stringify(genesisBlockToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
    return false;
  }
}

//Vérification de l'intégralité de la blockchain
const isValidChain = (blockchainToValidate) => {
  isValidGenesisBlock(blockchainToValidate)
  const tempBlocks = [blockchainToValidate[0]];
  for (let i = 1; i < blockchainToValidate.length; i++) {
      if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
          tempBlocks.push(blockchainToValidate[i]);
      } else {
          return false;
      }
  }
  return true;
};

//Fonction Main
const Ether3 = () => {
  generateRandomTransaction()
  for (let index = 0; index < 100; index++) {
    const newBlock = generateNextBlock(transactionQueue.slice(0, 5))
    transactionQueue.splice(0,5)
    const checkValidity = isValidNewBlock(newBlock, blockchain[newBlock.index -1])
    if (checkValidity){
      blockchain.push(newBlock);
    }else{
      console.log("Le block est corrompu");
    }
  }
  console.log("Blockchain");
  console.log("-----------------");
  console.log(blockchain);
  console.log("-----------------");
  console.log("-----------------");
  if(isValidChain(blockchain)){
    console.log("La blockchain est intègre ! 👌");
  }
}

Ether3()