pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/eddsaposeidon.circom";

template CommitVerify() {
    signal input publicKey[2];
    signal input signature[3]; // [R8x, R8y, S]
    signal input message[1];

    component verifier = EdDSAPoseidonVerifier();

    // Assign inputs to the verifier
    verifier.enabled <== 1;
    verifier.Ax <== publicKey[0];
    verifier.Ay <== publicKey[1];
    verifier.R8x <== signature[0];
    verifier.R8y <== signature[1];
    verifier.S <== signature[2]; // Use the last element of the signature array
    verifier.M <== message[0];    // Message hash
}

component main {public [publicKey, signature, message]} = CommitVerify();
