import { Options } from "yargs";
import * as options from "../options";
import { readPriceConfigFile } from "../price-config";
import { PriceServiceConnection } from "@pythnetwork/price-service-client";
import { PythPriceListener } from "../pyth-price-listener";
import { SolanaPriceListener, SolanaPricePusher } from "./solana";
import { Controller } from "../controller";
import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { Keypair, Connection } from "@solana/web3.js";
import fs from "fs";
import { PublicKey } from "@solana/web3.js";

export default {
  command: "solana",
  describe: "run price pusher for solana",
  builder: {
    endpoint: {
      description: "Solana RPC API endpoint",
      type: "string",
      required: true,
    } as Options,
    "keypair-file": {
      description: "Path to a keypair file",
      type: "string",
      required: true,
    } as Options,
    "shard-id": {
      description: "Shard ID",
      type: "number",
      required: true,
    } as Options,
    "compute-unit-price-micro-lamports": {
      description: "Priority fee per compute unit",
      type: "number",
      default: 50000,
    } as Options,
    ...options.priceConfigFile,
    ...options.priceServiceEndpoint,
    ...options.pythContractAddress,
    ...options.pollingFrequency,
    ...options.pushingFrequency,
  },
  handler: function (argv: any) {
    const {
      endpoint,
      keypairFile,
      shardId,
      computeUnitPriceMicroLamports,
      priceConfigFile,
      priceServiceEndpoint,
      pythContractAddress,
      pushingFrequency,
      pollingFrequency,
    } = argv;

    const priceConfigs = readPriceConfigFile(priceConfigFile);

    const priceServiceConnection = new PriceServiceConnection(
      priceServiceEndpoint,
      {
        logger: {
          // Log only warnings and errors from the price service client
          info: () => undefined,
          warn: console.warn,
          error: console.error,
          debug: () => undefined,
          trace: () => undefined,
        },
      }
    );

    const priceItems = priceConfigs.map(({ id, alias }) => ({ id, alias }));

    const pythListener = new PythPriceListener(
      priceServiceConnection,
      priceItems
    );

    const wallet = new NodeWallet(
      Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync(keypairFile, "ascii")))
      )
    );

    const pythSolanaReceiver = new PythSolanaReceiver({
      connection: new Connection(endpoint),
      wallet,
      pushOracleProgramId: new PublicKey(pythContractAddress),
    });

    const solanaPricePusher = new SolanaPricePusher(
      pythSolanaReceiver,
      priceServiceConnection,
      shardId,
      computeUnitPriceMicroLamports
    );
    const solanaPriceListener = new SolanaPriceListener(
      pythSolanaReceiver,
      shardId,
      priceItems,
      { pollingFrequency }
    );

    const controller = new Controller(
      priceConfigs,
      pythListener,
      solanaPriceListener,
      solanaPricePusher,
      { pushingFrequency }
    );

    controller.start();
  },
};
