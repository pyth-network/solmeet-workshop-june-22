import * as fs from "fs";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Status } from "../target/types/status";

describe("status", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Status as Program<Status>;
  const wallet = anchor.Wallet.local();

  const outputSecret = Uint8Array.from(
    JSON.parse(fs.readFileSync("output.json").toString())
  );
  const output = anchor.web3.Keypair.fromSecretKey(outputSecret);

  const price = new anchor.web3.PublicKey(
    "8oGTURNmSQkrBS1AQ5NjB2p8qY34UVmMA9ojrw8vnHus"
  );

  it("runs", async () => {
    const tx = await program.methods
      .run()
      .accounts({
        price: price,
        output: output.publicKey,
        funding: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([output, wallet.payer])
      .rpc();

    console.log("Transaction: ", tx);
  });
});
