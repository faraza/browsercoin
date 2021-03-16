BrowserCoin is a browser-based cryptocurrency platform meant to illustrate how the distributed blockchain works. Anyone who goes to the BrowserCoin website can receive a full node and start mining through client-side javascript. Block sizes will be very small and time between blocks will be long to support keeping a full node in browser memory.

The first coin supported by BrowserCoin will be WhitePaperCoin, an implementation of the Bitcoin 0.1 protocol described in Satoshi Nakamoto's original white paper.

Later, we will add support for other versions of Bitcoin throughout the years, along with other cryptocurrencies like Ethereum.

We will also allow completely custom coins, like Bitcoin 0.1 with proof-of-stake instead of proof-of-work.

Because all of the honest miners will be running on a browser, it will be easy for an adversary to launch a 51% attack by mining on their computer. Because of this, COINS RUNNING ON BROWSERCOIN HAVE ZERO MONETARY VALUE!!! This project is just meant to experiment with various coins and learn how the blockchain works. In fact, we may add a feature down the line that lets users team up to launch a 51% attack as an educational/testing tool.

Users will also be able to select the net number that they want to run on, from 0 to 99999. Users can join older/more widely used blockchains, or create the genesis block of a brand new one if they want. All of these should be illustrative in different ways of the life cycle of the blockchain.

As a user mines, sees new transactions, and receives completed blocks, the React web app will update to show all of them, along with the full block chain. 

Later, we will show aggregate stats on the server such as total number of active miners and number of miners added/dropped over time. These stats would be hard or impossible to determine on a traditional blockchain, because the miners would not send data to a central server. While a centralized server is not required for Browsercoin, it is something nice that we can toggle on to provide interesting insights about blockchain performance. To reiterate, none of these are 'real' coins but are educational and experimental tools for understanding the blockchain. 
We can launch two versions of each coin - one which does communicate with a central server to provide stats, and one that doesn't, as some might consider a blockchain in which all nodes communicate with a central server to be illegitimate.

P2P initially discovery will be implemented in the beginning with a signaling server. However, this violates the distributed blockchain principle of not being reliant on a centralized server. Later, we will publish the addresses of well known full nodes on the Browsercoin page, in order to demonstrate this principle of P2P discovery. Ideally, this should be mirrored on many different websites controlled by different parties to mitigate the consequences of an attacker hacking the webpage.

----------
WhitePaperCoin

Same as Bitcoin 0.1 it has the following differences:

-Blocks only store up to 10 transactions. This is so a browser can run a full node without running into issues.

-No changing proof of work requirement. This is just to make implementation easier. We'll probably implement this later.

-Blocks are greatly simplified to keep their size small and make to implementation easier. They consist of: block number, previous block hash, timestamp, 10 transactions, and the nonce.

-Block reward starts at 5 coins and doesn't decrease, in order to make implementation easier.

-Transaction hash is signed by 1) all 


----------
TODO LIST:
-Implement WhitePaperCoin
-Make a nice UI in React
-Deploy to the web
-Add unit tests
-Let users select the blockchain net that they want to participate in
-Users can decide what nonce to start from instead of client choosing random one for them
-Let users try to double spend UTXO
-Let users try to create transactions with fake UTXO
-Let users try to sign transactions with bogus private keys
-Let users join mining pools
-Let mining pools team up to launch 51% attacks
-Allow users to run WhitePaperCoin with Proof of Stake
-Implement Ethereum 1.0 and 2.0