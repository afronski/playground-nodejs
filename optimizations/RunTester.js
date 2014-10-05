function TEST_CASE() {
    return 3;

    // Uncomment it, in order to see a not optimized function:
    // with({}) {}
}

function printStatus(testCase) {
    switch(%GetOptimizationStatus(testCase)) {
        case 1:
            console.log("Function is optimized");
            break;

        case 2:
            console.log("Function is not optimized");
            break;

        case 3:
            console.log("Function is always optimized");
            break;

        case 4:
            console.log("Function is never optimized");
            break;

        case 6:
            console.log("Function is maybe deoptimized");
            break;
    }
}

// Not optimized.
TEST_CASE();

%OptimizeFunctionOnNextCall(TEST_CASE);

// Optimized.
TEST_CASE();

// Results.
printStatus(TEST_CASE);