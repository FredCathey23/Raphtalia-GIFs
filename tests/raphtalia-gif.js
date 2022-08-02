const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log(" Starting test... ")
  
  // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.RaphtaliaGif;

    const baseAccount = anchor.web3.Keypair.generate();


    let tx = await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    console.log(" transaction signature", tx);

    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('Gif Count', account.totalGifs.toString())

    await program.rpc.addGif("'https://i.redd.it/r4upeatupo491.gif'",{
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });

    account = await program.account.baseAccount.fetch(baseAccount.publicKey)
    console.log('Gif Count', account.totalGifs.toString())

    console.log('gif list', account.gifList)
  }

  const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
