#include<stdio.h>
int main() {
    int n = 10;
    int sum = 0;

    for (int i = 0; i < n; i++) {
        sum += i;
    }

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            printf("*");
        }
        printf("\n");
    }

    printf("Sum: %d\n", sum);
    return 0
}