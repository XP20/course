from loguru import logger
import time

def decorator_speed(func_name):
    def decorator_real(func: callable):
        def wrapper(*args, **kwargs):
            before = time.monotonic_ns()
            func(*args, **kwargs)
            after = time.monotonic_ns()
            diff = (after - before) / 1000000
            logger.debug(f'{func_name} took: {diff}ms')
        return wrapper
    return decorator_real