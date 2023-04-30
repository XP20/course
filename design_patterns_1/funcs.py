def fact(n, current=1):
    if n == 0: return current
    current *= n
    return fact(n-1, current)
#print(fact(10)) #3628800

def pow_fact(x, b):
    return fact(x**b)
#print(pow_fact(2, 3)) #40320