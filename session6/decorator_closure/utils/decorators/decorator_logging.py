from loguru import logger

def decorator_logging(event_name):
    def decorator_real(func: callable):
        def wrapper(*args, **kwargs):
            logger.debug(f'event: {event_name}')
            return func(*args, **kwargs)
        return wrapper
    return decorator_real