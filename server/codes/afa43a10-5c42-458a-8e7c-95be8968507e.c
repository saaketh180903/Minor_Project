#include <stdio.h>

// Function to calculate sum of numbers from 1 to n
int calculateSum(int n) {
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

int main() {
    int number;

    // Input number from the user
    printf("Enter a positive integer: ");
    scanf("%d", &number);

    // Calculate the sum using the function
    int result = calculateSum(number);

    // Output the result
    printf("Sum of numbers from 1 to %d is: %d\n", number, result);

    return 0;
}
