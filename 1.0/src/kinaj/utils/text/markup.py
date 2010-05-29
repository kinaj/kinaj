# -*- coding: utf-8 -*-
import markdown2

RENDERERS = {
    'markdown': markdown2.markdown,
}


# convenience
get_markup = RENDERERS.get