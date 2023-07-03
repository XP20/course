from loguru import logger

def decorator_try_catch(func: callable):
    def wrapper(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except Exception as exc:
            logger.error(exc)
    return wrapper