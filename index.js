import { BitmexClient } from "ccxws";
import { BinarySearchTree } from "@datastructures-js/binary-search-tree";
import chalk from "chalk";

function diffColor(change, negate = false) {
  if (change < 0) {
    return negate ? chalk.green : chalk.red;
  } if (change > 0) {
    return negate ? chalk.green : chalk.green;
  }
  return function (number) {
    return number.toString();
  };
}

class OrderBook {
  constructor(market) {
    this.market = market;
    this.bitmex = new BitmexClient();

    this.asks = new BinarySearchTree();
    this.bids = new BinarySearchTree();

    this.firstAsk = { price: 0, size: 0 };
    this.firstBid = { price: 0, size: 0 };
    this.difference = 0;

    this.bitmex.on("l2snapshot", (snapshot) => this.handleL2Snapshot(snapshot));
    this.bitmex.on("l2update", (update) => this.handleL2Update(update));
    this.bitmex.subscribeLevel2Updates(market);
  }

  updateFirstAskAndBid() {
    const newFirstAsk = this.asks.max().getValue();
    const newFirstBid = this.bids.min().getValue();
    const newDifference = parseFloat(newFirstAsk.price) - parseFloat(newFirstBid.price);

    if (newFirstAsk !== this.firstAsk || newFirstBid !== this.firstBid) {
      process.stdout.write("First Ask: ");
      process.stdout.write(diffColor(newFirstAsk.price - this.firstAsk.price, true)(`${this.market.quote} ${parseFloat(newFirstAsk.price)}`));
      process.stdout.write(" ");
      process.stdout.write(diffColor(newFirstAsk.size - this.firstAsk.size)(Math.trunc(newFirstAsk.size)));
      process.stdout.write(" ");
      process.stdout.write("First Bid: ");
      process.stdout.write(diffColor(newFirstBid.price - this.firstBid.price)(`${this.market.quote} ${parseFloat(newFirstBid.price)}`));
      process.stdout.write(" ");
      process.stdout.write(diffColor(newFirstBid.size - this.firstBid.size)(Math.trunc(newFirstBid.size)));
      process.stdout.write(" ");
      process.stdout.write("Difference: ");
      process.stdout.write(diffColor(newDifference - this.difference)(`${this.market.quote} ${newDifference.toFixed(4)}`));
      process.stdout.write("\n");

      this.firstAsk = newFirstAsk;
      this.firstBid = newFirstBid;
      this.difference = newDifference;
    }
  }

  handleL2Snapshot(snapshot) {
    for (const orderKey of ["asks", "bids"]) {
      this[orderKey].clear();

      for (const order of snapshot[orderKey]) {
        this[orderKey].insert(order.meta.id, order);
      }
    }

    const initialFirstAsk = this.asks.max().getValue();
    const initialFirstBid = this.bids.min().getValue();

    this.firstAsk = { price: initialFirstAsk.price, size: initialFirstAsk.size };
    this.firstBid = { price: initialFirstBid.price, size: initialFirstBid.size };
    this.difference = parseFloat(initialFirstAsk.price) - parseFloat(initialFirstBid.price);

    this.updateFirstAskAndBid();
  }

  handleL2Update(update) {
    for (const orderKey of ["asks", "bids"]) {
      for (const order of update[orderKey]) {
        switch (order.meta.type) {
          case "insert":
          case "update":
            this[orderKey].insert(order.meta.id, order);
            break;
          case "delete":
            this[orderKey].remove(order.meta.id);
            break;
          default:
            throw new Error(`Unexpected order type: ${order.meta.type}`);
        }
      }
    }

    this.updateFirstAskAndBid();
  }
}

let [base, quote] = process.argv.slice(2);

if (base === undefined) {
  base = "XBT";
  console.warn(`Base not specified, defaulting to ${base}`);
}

if (quote === undefined) {
  quote = "USD";
  console.warn(`Quote not specified, defaulting to ${quote}`);
}

/* eslint-disable no-unused-vars */
const orderBook = new OrderBook({ id: `${base}${quote}`, base, quote });
