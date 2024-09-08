#include <stdio.h>

// Function to calculate sum of numbers from 1 to n
long long calculateSum(int n) {
    long long sum = 0;
    for (long long i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

int main() {
    long long numb;

    // Input number from the user
    scanf("%d", &number);

    // Calculate the sum using the function
    long long result = calculateSum(number);

    // Output the result
    printf("Sum of numbers from 1 to %d is: %d\n", number, result);

    return 0;
}
