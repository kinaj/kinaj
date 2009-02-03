# -*- coding: utf-8 -*-
from kinaj.utils.text.markup import get_markup

def markup(value, formatting):
    return get_markup(formatting, lambda x: x)(unicode(value))

def smartmarkup(value):
    formatting = getattr(value, 'markup', None)
    return markup(unicode(value), formatting)