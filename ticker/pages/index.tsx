import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Connection, PublicKey } from "@solana/web3.js";
import { PythConnection } from "@pythnetwork/client";

const Home: NextPage = () => {
  const [solPrice, setSolPrice] = useState(0);
  const [solConfidence, setSolConfidence] = useState(0);

  useEffect(() => {
    const connection = new Connection("https://api.devnet.solana.com");
    const programKey = new PublicKey(
      "gSbePebfvPy7tRqimPoVecS2UsBvYv46ynrzWocc92s"
    );
    const pythConnection = new PythConnection(connection, programKey);

    pythConnection.onPriceChange((product, price) => {
      if (
        product.symbol == "Crypto.SOL/USD" &&
        price.price &&
        price.confidence
      ) {
        setSolPrice(price.price);
        setSolConfidence(price.confidence);
      }
    });

    pythConnection.start();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Ticker</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Pyth Ticker</h1>
        <h2>SOL/USD</h2>
        <h3>
          {solPrice} &plusmn;{solConfidence}
        </h3>
      </main>
    </div>
  );
};

export default Home;
