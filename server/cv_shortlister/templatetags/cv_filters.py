from django import template

register = template.Library()

@register.filter
def divide(value, arg):
    """Divides value by arg and returns the result."""
    try:
        return float(value) / float(arg)
    except (ValueError, ZeroDivisionError):
        return 0

@register.simple_tag
def concatenate(str1, str2):
    """Concatenates two strings."""
    return f"{str1}{str2}"
