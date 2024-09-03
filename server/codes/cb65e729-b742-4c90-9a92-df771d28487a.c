#include <stdio.h>

int main() {
    int n = 10;
    int sum = 0;

    // For loop to calculate the sum of first n natural numbers
    for (int i = 1; i <= n; i++) {
        sum += i;
    }

    // Nested loops to print a pattern
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            printf("*");
        }
        printf("\n");
    }

    printf("Sum of first %d natural numbers is: %d\n", n, sum)

    return 0;
}
