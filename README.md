# bitHolla Challenge
## 2021 - Ata Kuyumcu

In this repository, I will be sharing my application developed as per the
challenge. It's a CLI application that can be used to track the changes in the
market maker orders (best bid and best ask). It can be given any symbols
available on the BitMEX exchange but defaults to XBTUSD.

To use it, you can run the following command in the project root directory:

```
node index.js ETH USD
```

The application will then start tracking the best bid and best ask for the given
ticker, and display them each every time they change, immediately.

```
[atak@carbon bitholla-challenge]$ node index.js ETH USD
First Ask: USD 3948.8 385 First Bid: USD 3948.75 38 Difference: USD 0.0500
First Ask: USD 3948.8 385 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 382 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 379 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 319 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 368 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 371 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 368 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 357 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 256 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 155 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 155 First Bid: USD 3948.75 34 Difference: USD 0.0500
First Ask: USD 3948.8 155 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 180 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 177 First Bid: USD 3948.75 31 Difference: USD 0.0500
First Ask: USD 3948.8 177 First Bid: USD 3948.75 34 Difference: USD 0.0500
First Ask: USD 3948.8 177 First Bid: USD 3948.75 99 Difference: USD 0.0500
First Ask: USD 3948.8 177 First Bid: USD 3948.75 96 Difference: USD 0.0500
First Ask: USD 3948.8 112 First Bid: USD 3948.75 96 Difference: USD 0.0500
First Ask: USD 3948.8 111 First Bid: USD 3948.75 96 Difference: USD 0.0500
```

The output will be colored with red signifying a decrease, and green signifying
an increase in any value. The only exception to this is the best ask price in
which the coloring is inverted so green is a decrease and red is an increase.

## FAQ

**Why use binary search tree maps to track orders?**

To optimize the search for minimum and maximum values.

**Why index orders by their IDs and not their prices?**

On BitMEX, order IDs are derived from:
- symbol indices (constant within a symbol)
- price (what we want to sort by)
- instrument tick size (usually constant but still doesn't affect sorting to find the best order)

The exact formula is:
`ID = (100000000 * symbolIdx) - (price / instrumentTickSize)`.
Taken from [their documentation](https://www.bitmex.com/app/wsAPI#OrderBookL2).

Which means ID and price and inversely proportional. And it's more convenient to
look orders up by their ID, so to:

- find the best bid, thefore the highest price, we look up the order with the lowest ID value.
- find the best ask, thefore the lowest price, we look up the order with the highest ID value.
