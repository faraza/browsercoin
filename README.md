BrowserCoin is a browser-based cryptocurrency platform meant to illustrate how the distributed blockchain works. Anyone who goes to the BrowserCoin website can receive a full node and start mining through client-side javascript. Block sizes will be very small and time between blocks will be long to support keeping a full node in browser memory.

The first coin supported by BrowserCoin will be WhitePaperCoin, an implementation of the Bitcoin 0.1 protocol described in Satoshi Nakamoto's original white paper.

Later, we will add support for other versions of Bitcoin throughout the years, along with other cryptocurrencies like Ethereum.

We will also allow completely custom coins, like Bitcoin 0.1 with proof-of-stake instead of proof-of-work.

Because all of the honest miners will be running on a browser, it will be easy for an adversary to launch a 51% attack by mining on their computer. Because of this, COINS RUNNING ON BROWSERCOIN HAVE ZERO MONETARY VALUE!!! This project is just meant to experiment with various coins and learn how to blockchain works. In fact, we may add a feature down the line that lets users team up to launch a 51% attack, so everyone can better understand how it works.

Users will also be able to select the net number that they want to run on, from 0 to 99999. Users can join older/more widely used blockchains, or create the genesis block of a brand new one if they want. All of these should be illustrative of the life cycle of the blockchain.

As a user mines, sees new transactions, and receives completed blocks, the React web app will update to show all of them, along with the full block chain. 

Later, we will show aggregate stats on the server such as total number of active miners. These stats would be harder on a traditional blockchain to determine because the miners would not send data to a central server. While that is not required for this, it is something nice that we can toggle on to provide interesting insights about blockchain performance. Again, none of these are 'real' coins but are educational and experimental tools for understanding the blockchain. 
We can launch two versions of each coin - one which does keep centralized stats, and one that doesn't, so users can play around with whichever one they prefer.


TODO LIST:
-Implement WhitePaperCoin
-Make a nice UI in React
-Deploy to the web
-Add unit tests
-Let users select the blockchain net that they want to participate in
-Let users join mining pools
-Let mining pools team up to launch 51% attacks
-Allow users to run WhitePaperCoin with Proof of Stake
-Implement Ethereum 1.0 and 2.0